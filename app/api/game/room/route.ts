import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  applyNext,
  applyRematch,
  applyPick,
  newRoom,
  sideOf,
  startMatch,
  tick,
  viewFor,
  type RoomState,
  type StatKey,
} from "@/lib/gameRoom";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function makeCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

async function loadRoom(db: D1Database, code: string) {
  const row = await db
    .prepare("SELECT state, version FROM game_rooms WHERE code = ?")
    .bind(code)
    .first<{ state: string; version: number }>();
  return row ? { state: JSON.parse(row.state) as RoomState, version: row.version } : null;
}

// Optimistic lock so two simultaneous requests can't both apply
async function saveRoom(db: D1Database, code: string, state: RoomState, version: number) {
  const res = await db
    .prepare("UPDATE game_rooms SET state = ?, version = version + 1, updated_at = ? WHERE code = ? AND version = ?")
    .bind(JSON.stringify(state), Date.now(), code, version)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

const normalizeCode = (value: unknown) =>
  typeof value === "string" ? value.trim().toUpperCase().slice(0, 12) : "";

async function handleGet(request: NextRequest) {
  const { env } = getCloudflareContext();
  const code = normalizeCode(request.nextUrl.searchParams.get("code"));
  const token = request.nextUrl.searchParams.get("token") ?? "";

  const room = await loadRoom(env.DB, code);
  if (!room) return json({ error: "Room not found" }, 404);

  const side = sideOf(room.state, token);
  if (!side) return json({ error: "You are not in this room" }, 403);

  const now = Date.now();
  if (tick(room.state, now)) {
    // If another request saved first, it has already applied the timeout
    await saveRoom(env.DB, code, room.state, room.version);
  }

  return json({ view: viewFor(room.state, side, now) });
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

  const action = body.action;

  if (action === "create") {
    await db.prepare("DELETE FROM game_rooms WHERE updated_at < ?").bind(Date.now() - ROOM_TTL_MS).run();

    const token = crypto.randomUUID();
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = makeCode();
      try {
        await db
          .prepare("INSERT INTO game_rooms (code, state, version, updated_at) VALUES (?, ?, 0, ?)")
          .bind(code, JSON.stringify(newRoom(token)), Date.now())
          .run();
        return json({ code, token });
      } catch {
        // code collision, try another
      }
    }
    return json({ error: "Could not create room" }, 500);
  }

  const code = normalizeCode(body.code);
  const room = await loadRoom(db, code);
  if (!room) return json({ error: "Room not found" }, 404);
  const { state, version } = room;

  if (action === "join") {
    if (state.p2Token) return json({ error: "This room is already full" }, 409);
    const token = crypto.randomUUID();
    state.p2Token = token;
    startMatch(state, Date.now());
    if (!(await saveRoom(db, code, state, version))) return json({ error: "Room is busy, try again" }, 409);
    return json({ code, token });
  }

  const token = typeof body.token === "string" ? body.token : "";
  const side = sideOf(state, token);
  if (!side) return json({ error: "You are not in this room" }, 403);

  const now = Date.now();
  tick(state, now);

  let error: string | null = null;
  if (action === "pick") {
    error = applyPick(state, side, body.stat as StatKey);
  } else if (action === "next") {
    error = applyNext(state, side, Number(body.round), now);
  } else if (action === "rematch") {
    error = applyRematch(state, side, now);
  } else {
    error = "Unknown action";
  }

  if (error) return json({ error }, 400);
  if (!(await saveRoom(db, code, state, version))) return json({ error: "Room is busy, try again" }, 409);
  return json({ view: viewFor(state, side, now) });
}

async function safely(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    console.error("game room error", message);
    const hint = message.includes("no such table") ? "Game database is not set up yet (run the D1 migration)." : "Server error, please try again.";
    return json({ error: hint }, 500);
  }
}

export const GET = (request: NextRequest) => safely(() => handleGet(request));
export const POST = (request: NextRequest) => safely(() => handlePost(request));