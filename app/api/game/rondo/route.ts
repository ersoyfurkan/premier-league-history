import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { parseComp, type Competition } from "@/lib/gameRoom";
import { randomRondoPicks } from "@/data/rondo";

type Score = { right: number; wrong: number };
type RondoRoomState = {
  game: "rondo";
  comp: Competition;
  picks: number[];
  p1Token: string;
  p2Token?: string;
  p1?: Score;
  p2?: Score;
};

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const makeCode = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");

const normalizeCode = (value: unknown) =>
  typeof value === "string" ? value.trim().toUpperCase().slice(0, 12) : "";

async function loadRoom(db: D1Database, code: string) {
  const row = await db
    .prepare("SELECT state, version FROM football_tic_tac_toe_rooms WHERE code = ?")
    .bind(code)
    .first<{ state: string; version: number }>();
  if (!row) return null;
  const state = JSON.parse(row.state) as Partial<RondoRoomState>;
  return state.game === "rondo" ? { state: state as RondoRoomState, version: row.version } : null;
}

async function saveRoom(db: D1Database, code: string, state: RondoRoomState, version: number) {
  const result = await db
    .prepare("UPDATE football_tic_tac_toe_rooms SET state = ?, version = version + 1, updated_at = ? WHERE code = ? AND version = ?")
    .bind(JSON.stringify(state), Date.now(), code, version)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

const sideOf = (state: RondoRoomState, token: string) =>
  token && state.p1Token === token ? "p1" : token && state.p2Token === token ? "p2" : null;

function view(state: RondoRoomState, side: "p1" | "p2") {
  const other = side === "p1" ? "p2" : "p1";
  const bothDone = Boolean(state.p1 && state.p2);
  return {
    comp: state.comp,
    picks: state.picks,
    you: side,
    opponentJoined: Boolean(state.p2Token),
    myScore: state[side] ?? null,
    opponentFinished: Boolean(state[other]),
    opponentScore: bothDone ? state[other] ?? null : null,
  };
}

async function handleGet(request: NextRequest) {
  const { env } = getCloudflareContext();
  const code = normalizeCode(request.nextUrl.searchParams.get("code"));
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const room = await loadRoom(env.DB, code);
  if (!room) return json({ error: "Room not found" }, 404);
  const side = sideOf(room.state, token);
  if (!side) return json({ error: "You are not in this room" }, 403);
  return json({ view: view(room.state, side) });
}

async function handlePost(request: NextRequest) {
  const { env } = getCloudflareContext();
  const db = env.DB;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  if (body.action === "create") {
    await db.prepare("DELETE FROM football_tic_tac_toe_rooms WHERE updated_at < ?").bind(Date.now() - ROOM_TTL_MS).run();
    const comp = parseComp(typeof body.comp === "string" ? body.comp : null);
    const token = crypto.randomUUID();
    const state: RondoRoomState = { game: "rondo", comp, picks: randomRondoPicks(comp), p1Token: token };
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = makeCode();
      try {
        await db
          .prepare("INSERT INTO football_tic_tac_toe_rooms (code, state, version, updated_at) VALUES (?, ?, 0, ?)")
          .bind(code, JSON.stringify(state), Date.now())
          .run();
        return json({ code, token });
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (!/unique|constraint/i.test(message)) throw error;
      }
    }
    return json({ error: "Could not create room" }, 500);
  }

  const code = normalizeCode(body.code);
  const room = await loadRoom(db, code);
  if (!room) return json({ error: "Room not found" }, 404);
  const { state, version } = room;

  if (body.action === "join") {
    if (state.p2Token) return json({ error: "This room is already full" }, 409);
    const token = crypto.randomUUID();
    state.p2Token = token;
    if (!(await saveRoom(db, code, state, version))) return json({ error: "Room is busy, try again" }, 409);
    return json({ code, token });
  }

  const side = sideOf(state, typeof body.token === "string" ? body.token : "");
  if (!side) return json({ error: "You are not in this room" }, 403);
  if (body.action !== "submit") return json({ error: "Unknown action" }, 400);
  if (state[side]) return json({ view: view(state, side) });

  const right = Number(body.right);
  const wrong = Number(body.wrong);
  const valid = (n: number) => Number.isInteger(n) && n >= 0 && n <= 26;
  if (!valid(right) || !valid(wrong) || right + wrong > 26) return json({ error: "Invalid score" }, 400);
  state[side] = { right, wrong };
  if (!(await saveRoom(db, code, state, version))) return json({ error: "Room is busy, try again" }, 409);
  return json({ view: view(state, side) });
}

async function safely(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (error) {
    console.error("rondo room error", error instanceof Error ? error.message : "");
    return json({ error: "Server error, please try again." }, 500);
  }
}

export const GET = (request: NextRequest) => safely(() => handleGet(request));
export const POST = (request: NextRequest) => safely(() => handlePost(request));
