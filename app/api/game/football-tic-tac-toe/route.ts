import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  applyFootballTicTacToeMove,
  expireFootballTicTacToeTurn,
  footballTicTacToeSideOf,
  footballTicTacToeView,
  newFootballTicTacToeRoom,
  parseFootballTicTacToeComp,
  type FootballTicTacToeRoomState,
} from "@/lib/footballTicTacToe";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function makeCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

const normalizeCode = (value: unknown) =>
  typeof value === "string" ? value.trim().toUpperCase().slice(0, 12) : "";

async function loadRoom(db: D1Database, code: string) {
  const row = await db
    .prepare("SELECT state, version FROM football_tic_tac_toe_rooms WHERE code = ?")
    .bind(code)
    .first<{ state: string; version: number }>();
  return row ? { state: JSON.parse(row.state) as FootballTicTacToeRoomState, version: row.version } : null;
}

async function saveRoom(db: D1Database, code: string, state: FootballTicTacToeRoomState, version: number) {
  const result = await db
    .prepare(
      "UPDATE football_tic_tac_toe_rooms SET state = ?, version = version + 1, updated_at = ? WHERE code = ? AND version = ?",
    )
    .bind(JSON.stringify(state), Date.now(), code, version)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

async function handleGet(request: NextRequest) {
  const { env } = getCloudflareContext();
  const code = normalizeCode(request.nextUrl.searchParams.get("code"));
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const room = await loadRoom(env.DB, code);
  if (!room) return json({ error: "Room not found" }, 404);

  const side = footballTicTacToeSideOf(room.state, token);
  if (!side) return json({ error: "You are not in this room" }, 403);
  const now = Date.now();
  const needsDeadline = room.state.status === "playing" && room.state.turnDeadline === undefined;
  if (needsDeadline) {
    room.state.turnDeadline = now + 60_000;
  }
  if (expireFootballTicTacToeTurn(room.state, now) || needsDeadline) {
    await saveRoom(env.DB, code, room.state, room.version);
  }
  return json({ view: footballTicTacToeView(room.state, side) });
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
    await db
      .prepare("DELETE FROM football_tic_tac_toe_rooms WHERE updated_at < ?")
      .bind(Date.now() - ROOM_TTL_MS)
      .run();
    const comp = parseFootballTicTacToeComp(body.comp);
    const token = crypto.randomUUID();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = makeCode();
      try {
        await db
          .prepare(
            "INSERT INTO football_tic_tac_toe_rooms (code, state, version, updated_at) VALUES (?, ?, 0, ?)",
          )
          .bind(code, JSON.stringify(newFootballTicTacToeRoom(token, comp)), Date.now())
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
    state.status = "playing";
    state.turnDeadline = Date.now() + 60_000;
    if (!(await saveRoom(db, code, state, version))) return json({ error: "Room is busy, try again" }, 409);
    return json({ code, token });
  }

  const token = typeof body.token === "string" ? body.token : "";
  const side = footballTicTacToeSideOf(state, token);
  if (!side) return json({ error: "You are not in this room" }, 403);

  if (body.action !== "move") return json({ error: "Unknown action" }, 400);
  const now = Date.now();
  if (expireFootballTicTacToeTurn(state, now)) {
    if (!(await saveRoom(db, code, state, version))) return json({ error: "Room is busy, try again" }, 409);
    return json({
      error: "Time ran out. The turn passed to your opponent.",
      view: footballTicTacToeView(state, side),
    }, 409);
  }
  const error = applyFootballTicTacToeMove(state, side, Number(body.cell), String(body.player ?? ""), now);
  if (error) {
    return json({ error }, 400);
  }
  if (!(await saveRoom(db, code, state, version))) return json({ error: "Room is busy, try again" }, 409);
  return json({ view: footballTicTacToeView(state, side) });
}

async function safely(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    console.error("football tic-tac-toe room error", message);
    const hint = message.includes("no such table")
      ? "Football tic-tac-toe database is not set up yet (run the D1 migration)."
      : "Server error, please try again.";
    return json({ error: hint }, 500);
  }
}

export const GET = (request: NextRequest) => safely(() => handleGet(request));
export const POST = (request: NextRequest) => safely(() => handlePost(request));
