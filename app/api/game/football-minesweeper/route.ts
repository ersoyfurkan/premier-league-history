import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import {
  applyFootballMinesweeperAction,
  footballMinesweeperView,
  minesweeperSideOf,
  newFootballMinesweeperRoom,
  type FootballMinesweeperState,
  type MinesweeperAction,
} from "@/lib/footballMinesweeper";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_TTL = 24 * 60 * 60 * 1000;
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
const normalizeCode = (value: unknown) =>
  typeof value === "string" ? value.trim().toUpperCase() : "";
const validCode = (code: string) => /^[A-HJ-NP-Z2-9]{6}$/.test(code);

function makeCode() {
  return Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

async function loadRoom(db: D1Database, code: string) {
  const row = await db
    .prepare("SELECT state, version FROM football_minesweeper_rooms WHERE code = ? AND updated_at >= ?")
    .bind(code, Date.now() - ROOM_TTL)
    .first<{ state: string; version: number }>();
  return row ? { state: JSON.parse(row.state) as FootballMinesweeperState, version: row.version } : null;
}

async function saveRoom(db: D1Database, code: string, state: FootballMinesweeperState, version: number) {
  const result = await db
    .prepare("UPDATE football_minesweeper_rooms SET state = ?, version = version + 1, updated_at = ? WHERE code = ? AND version = ?")
    .bind(JSON.stringify(state), Date.now(), code, version)
    .run();
  return (result.meta.changes ?? 0) === 1;
}

async function get(request: NextRequest) {
  const code = normalizeCode(request.nextUrl.searchParams.get("code"));
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!validCode(code)) return json({ error: "Enter a valid six-character room code." }, 400);
  const { env } = getCloudflareContext();
  const room = await loadRoom(env.DB, code);
  if (!room) return json({ error: "Room not found or expired." }, 404);
  const side = minesweeperSideOf(room.state, token);
  if (!side) return json({ error: "You are not in this room." }, 403);
  return json({ view: footballMinesweeperView(room.state, side) });
}

async function post(request: NextRequest) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 8192) return json({ error: "Request is too large." }, 413);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON request." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Invalid request." }, 400);
  const input = body as Record<string, unknown>;
  const { env } = getCloudflareContext();
  const db = env.DB;

  if (input.action === "create") {
    await db.prepare("DELETE FROM football_minesweeper_rooms WHERE updated_at < ?").bind(Date.now() - ROOM_TTL).run();
    const token = crypto.randomUUID();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = makeCode();
      try {
        await db.prepare("INSERT INTO football_minesweeper_rooms (code, state, version, updated_at) VALUES (?, ?, 0, ?)")
          .bind(code, JSON.stringify(newFootballMinesweeperRoom(token)), Date.now())
          .run();
        return json({ code, token });
      } catch (error) {
        if (!(error instanceof Error) || !/UNIQUE constraint failed: football_minesweeper_rooms.code/i.test(error.message)) {
          throw error;
        }
      }
    }
    return json({ error: "Could not create a room. Please try again." }, 503);
  }

  const code = normalizeCode(input.code);
  if (!validCode(code)) return json({ error: "Enter a valid six-character room code." }, 400);
  const room = await loadRoom(db, code);
  if (!room) return json({ error: "Room not found or expired." }, 404);
  const { state, version } = room;

  if (input.action === "join") {
    if (state.p2Token || state.phase !== "waiting") return json({ error: "This room is already full." }, 409);
    const token = crypto.randomUUID();
    state.p2Token = token;
    state.phase = "playing";
    state.notice = "Both players are in. Player 1 kicks off!";
    state.revision += 1;
    if (!await saveRoom(db, code, state, version)) return json({ error: "The room changed. Try joining again." }, 409);
    return json({ code, token });
  }

  const token = typeof input.token === "string" ? input.token : "";
  const side = minesweeperSideOf(state, token);
  if (!side) return json({ error: "You are not in this room." }, 403);
  const action: MinesweeperAction | null =
    input.action === "reveal" && typeof input.cell === "number"
      ? { action: "reveal", cell: input.cell }
      : input.action === "flag" && typeof input.cell === "number"
        ? { action: "flag", cell: input.cell }
        : input.action === "rematch" ? { action: "rematch" } : null;
  if (!action || typeof input.revision !== "number" || !Number.isSafeInteger(input.revision)) {
    return json({ error: "Invalid game action." }, 400);
  }
  const error = applyFootballMinesweeperAction(state, side, action, input.revision);
  if (error) return json({ error, view: footballMinesweeperView(state, side) }, 409);
  if (!await saveRoom(db, code, state, version)) {
    const current = await loadRoom(db, code);
    return json({
      error: "The game changed. Refresh the board before trying again.",
      ...(current ? { view: footballMinesweeperView(current.state, side) } : {}),
    }, 409);
  }
  return json({ view: footballMinesweeperView(state, side) });
}

async function safely(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (error) {
    console.error("Football Minesweeper room error", error);
    return json({ error: error instanceof Error && error.message.includes("no such table")
      ? "Football Minesweeper needs its D1 database migration before online play."
      : "Could not load Football Minesweeper. Please try again." }, 500);
  }
}

export const GET = (request: NextRequest) => safely(() => get(request));
export const POST = (request: NextRequest) => safely(() => post(request));
