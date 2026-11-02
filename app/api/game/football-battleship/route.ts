import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import {
  applyBattleshipAction, battleshipSideOf, battleshipView, isBattleshipComp,
  joinBattleshipGame, newBattleshipGame, validBattleshipPlacement,
  type BattleshipAction, type BattleshipState,
} from "@/lib/footballBattleship";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_AGE = 24 * 60 * 60 * 1000;
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
const roomCode = (value: unknown) => typeof value === "string" ? value.trim().toUpperCase() : "";
const validCode = (code: string) => /^[A-HJ-NP-Z2-9]{6}$/.test(code);

async function load(db: D1Database, code: string) {
  const row = await db.prepare("SELECT state, version FROM football_battleship_rooms WHERE code = ? AND updated_at >= ?")
    .bind(code, Date.now() - MAX_AGE).first<{ state: string; version: number }>();
  return row ? { state: JSON.parse(row.state) as BattleshipState, version: row.version } : null;
}

async function save(db: D1Database, code: string, state: BattleshipState, version: number) {
  const result = await db.prepare(
    "UPDATE football_battleship_rooms SET state = ?, version = version + 1, updated_at = ? WHERE code = ? AND version = ?",
  ).bind(JSON.stringify(state), Date.now(), code, version).run();
  return (result.meta.changes ?? 0) === 1;
}

function parseAction(body: Record<string, unknown>): BattleshipAction | null {
  if (body.action === "rematch") return { action: "rematch" };
  if (body.action === "place" && validBattleshipPlacement(body.ships)) return { action: "place", ships: body.ships };
  if (body.action === "attack" && typeof body.cell === "number" && Number.isInteger(body.cell) &&
    body.cell >= 0 && body.cell < 64 && typeof body.answer === "string" && body.answer.trim() && body.answer.length <= 100) {
    return { action: "attack", cell: body.cell, answer: body.answer };
  }
  return null;
}

async function get(request: NextRequest) {
  const code = roomCode(request.nextUrl.searchParams.get("code"));
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!validCode(code)) return json({ error: "Enter a valid six-character room code." }, 400);
  const { env } = getCloudflareContext();
  const room = await load(env.DB, code);
  if (!room) return json({ error: "Room not found or expired." }, 404);
  const side = battleshipSideOf(room.state, token);
  if (!side) return json({ error: "You are not in this room." }, 403);
  return json({ view: battleshipView(room.state, side) });
}

async function post(request: NextRequest) {
  if (Number(request.headers.get("content-length")) > 8192) return json({ error: "Request is too large." }, 413);
  const reader = request.body?.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let bytes = 0;
  if (reader) {
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 8192) {
          await reader.cancel();
          return json({ error: "Request is too large." }, 413);
        }
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    } finally { reader.releaseLock(); }
  }
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return json({ error: "Invalid JSON request." }, 400); }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return json({ error: "Invalid request." }, 400);
  const body = raw as Record<string, unknown>;
  const { env } = getCloudflareContext();
  const db = env.DB;
  if (body.action === "create") {
    if (!isBattleshipComp(body.comp)) return json({ error: "Choose a supported competition." }, 400);
    await db.prepare("DELETE FROM football_battleship_rooms WHERE updated_at < ?").bind(Date.now() - MAX_AGE).run();
    const token = crypto.randomUUID();
    const state = newBattleshipGame(body.comp, token);
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => ALPHABET[byte % ALPHABET.length]).join("");
      try {
        await db.prepare("INSERT INTO football_battleship_rooms (code, state, version, updated_at) VALUES (?, ?, 0, ?)")
          .bind(code, JSON.stringify(state), Date.now()).run();
        return json({ code, token, view: battleshipView(state, "p1") });
      } catch (error) {
        if (!(error instanceof Error) || !/UNIQUE constraint failed: football_battleship_rooms.code/i.test(error.message)) throw error;
      }
    }
    return json({ error: "Could not allocate a room. Please try again." }, 503);
  }
  const code = roomCode(body.code);
  if (!validCode(code)) return json({ error: "Enter a valid six-character room code." }, 400);
  const room = await load(db, code);
  if (!room) return json({ error: "Room not found or expired." }, 404);
  const { state, version } = room;
  if (body.action === "join") {
    const token = crypto.randomUUID();
    const error = joinBattleshipGame(state, token);
    if (error) return json({ error }, 409);
    if (!await save(db, code, state, version)) return json({ error: "Room changed. Please try joining again." }, 409);
    return json({ code, token, view: battleshipView(state, "p2") });
  }
  const side = battleshipSideOf(state, typeof body.token === "string" ? body.token : "");
  if (!side) return json({ error: "You are not in this room." }, 403);
  const action = parseAction(body);
  if (!action || typeof body.gameId !== "string" || typeof body.revision !== "number" || !Number.isSafeInteger(body.revision)) {
    return json({ error: "Invalid game action." }, 400);
  }
  const error = applyBattleshipAction(state, side, action, { gameId: body.gameId, revision: body.revision });
  if (error) return json({ error, view: battleshipView(state, side) }, 409);
  if (!await save(db, code, state, version)) {
    const current = await load(db, code);
    return json({ error: "The game changed. Refresh the board before trying again.",
      ...(current ? { view: battleshipView(current.state, side) } : {}) }, 409);
  }
  return json({ view: battleshipView(state, side) });
}

async function safely(handler: () => Promise<NextResponse>) {
  try { return await handler(); } catch (error) {
    console.error("Football Battleship room error", error);
    return json({ error: error instanceof Error && error.message.includes("no such table")
      ? "Football Battleship needs its D1 database migration before online play."
      : "Could not load Football Battleship. Please try again." }, 500);
  }
}

export const GET = (request: NextRequest) => safely(() => get(request));
export const POST = (request: NextRequest) => safely(() => post(request));
