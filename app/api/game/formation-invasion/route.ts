import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import {
  applyFormationAction, formationSideOf, formationView, isFormationComp,
  joinFormationGame, newFormationGame, type FormationAction, type FormationState,
} from "@/lib/formationInvasion";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
const roomCode = (value: unknown) => typeof value === "string" ? value.trim().toUpperCase() : "";
const validCode = (code: string) => /^[A-HJ-NP-Z2-9]{6}$/.test(code);

async function load(db: D1Database, code: string) {
  const row = await db.prepare("SELECT state, version FROM formation_invasion_rooms WHERE code = ?")
    .bind(code).first<{ state: string; version: number }>();
  return row ? { state: JSON.parse(row.state) as FormationState, version: row.version } : null;
}

async function save(db: D1Database, code: string, state: FormationState, version: number) {
  const result = await db.prepare(
    "UPDATE formation_invasion_rooms SET state = ?, version = version + 1, updated_at = ? WHERE code = ? AND version = ?",
  ).bind(JSON.stringify(state), Date.now(), code, version).run();
  return (result.meta.changes ?? 0) === 1;
}

function parseAction(body: Record<string, unknown>): FormationAction | null {
  if (body.action === "pass" || body.action === "rematch") return { action: body.action };
  if ((body.action !== "answer" && body.action !== "hint") ||
    !Number.isInteger(body.slot) || typeof body.slot !== "number" || body.slot < 0 || body.slot > 10 ||
    !Number.isInteger(body.question) || typeof body.question !== "number" || body.question < 0 || body.question > 2) return null;
  if (body.action === "hint") return { action: "hint", slot: body.slot, question: body.question };
  if (typeof body.answer !== "string" || !body.answer.trim() || body.answer.length > 150) return null;
  return { action: "answer", slot: body.slot, question: body.question, answer: body.answer };
}

async function get(request: NextRequest) {
  const code = roomCode(request.nextUrl.searchParams.get("code"));
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!validCode(code)) return json({ error: "Enter a valid six-character room code." }, 400);
  const { env } = getCloudflareContext();
  const room = await load(env.DB, code);
  if (!room) return json({ error: "Room not found or expired." }, 404);
  const side = formationSideOf(room.state, token);
  if (!side) return json({ error: "You are not in this room." }, 403);
  return json({ view: formationView(room.state, side) });
}

async function post(request: NextRequest) {
  let raw: unknown;
  try { raw = await request.json(); } catch { return json({ error: "Invalid JSON request." }, 400); }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return json({ error: "Invalid request." }, 400);
  const body = raw as Record<string, unknown>;
  const { env } = getCloudflareContext();
  const db = env.DB;
  if (body.action === "create") {
    if (!isFormationComp(body.comp)) return json({ error: "Choose a supported competition." }, 400);
    await db.prepare("DELETE FROM formation_invasion_rooms WHERE updated_at < ?")
      .bind(Date.now() - 24 * 60 * 60 * 1000).run();
    const token = crypto.randomUUID();
    const state = newFormationGame(body.comp, "online", token);
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => ALPHABET[byte % ALPHABET.length]).join("");
      try {
        await db.prepare("INSERT INTO formation_invasion_rooms (code, state, version, updated_at) VALUES (?, ?, 0, ?)")
          .bind(code, JSON.stringify(state), Date.now()).run();
        return json({ code, token, view: formationView(state, "p1") });
      } catch (error) {
        if (!(error instanceof Error) || !/UNIQUE constraint failed: formation_invasion_rooms.code/i.test(error.message)) throw error;
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
    const error = joinFormationGame(state, token);
    if (error) return json({ error }, 409);
    if (!await save(db, code, state, version)) return json({ error: "Room changed. Please try joining again." }, 409);
    return json({ code, token, view: formationView(state, "p2") });
  }
  const side = formationSideOf(state, typeof body.token === "string" ? body.token : "");
  if (!side) return json({ error: "You are not in this room." }, 403);
  const action = parseAction(body);
  if (!action || typeof body.gameId !== "string" || typeof body.revision !== "number" || !Number.isInteger(body.revision)) {
    return json({ error: "Invalid game action." }, 400);
  }
  const error = applyFormationAction(state, side, action, { gameId: body.gameId, revision: body.revision });
  if (error) return json({ error, view: formationView(state, side) }, 409);
  if (!await save(db, code, state, version)) {
    const latest = await load(db, code);
    return json({ error: "The game changed. Check the current question before trying again.",
      ...(latest ? { view: formationView(latest.state, side) } : {}) }, 409);
  }
  return json({ view: formationView(state, side) });
}

async function safely(handler: () => Promise<NextResponse>) {
  try { return await handler(); } catch (error) {
    console.error("Formation Invasion room error", error);
    const message = error instanceof Error && error.message.includes("no such table")
      ? "Formation Invasion needs its D1 database migration before online play."
      : "Could not load Formation Invasion. Please try again.";
    return json({ error: message }, 500);
  }
}

export const GET = (request: NextRequest) => safely(() => get(request));
export const POST = (request: NextRequest) => safely(() => post(request));
