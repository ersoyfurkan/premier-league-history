import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { parseComp, type Competition } from "@/lib/gameRoom";
import {
  DUEL_CLUBS,
  DUEL_GUESS_MS,
  DUEL_PICK_MS,
  DUEL_WIN_SCORE,
  clubByKey,
  playersForBoth,
} from "@/data/clubDuel";
import { endDuelRound as endRound, submitDuelGuess, skipDuelGuess, type DuelRoundResult } from "@/lib/clubDuelRound";

type Side = "p1" | "p2";
type RoundResult = DuelRoundResult;
type DuelState = {
  game: "clubduel";
  comp: Competition;
  p1Token: string;
  p2Token?: string;
  phase: "waiting" | "pick" | "guess" | "result" | "finished";
  round: number;
  scores: Record<Side, number>;
  picks: Partial<Record<Side, string>>;
  clubs: Record<Side, string> | null;
  notice: string | null;
  used: string[]; // normalized names already guessed this match
  pass: Record<Side, boolean>;
  guesses?: Record<Side, boolean>;
  last: RoundResult | null;
  winner: Side | null;
  rematch: Record<Side, boolean>;
  deadline: number | null;
};

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const makeCode = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");

const normalizeCode = (value: unknown) =>
  typeof value === "string" ? value.trim().toUpperCase().slice(0, 12) : "";

const otherSide = (side: Side): Side => (side === "p1" ? "p2" : "p1");
const randomOf = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

async function loadRoom(db: D1Database, code: string) {
  const row = await db
    .prepare("SELECT state, version FROM football_tic_tac_toe_rooms WHERE code = ?")
    .bind(code)
    .first<{ state: string; version: number }>();
  if (!row) return null;
  const state = JSON.parse(row.state) as Partial<DuelState>;
  return state.game === "clubduel" ? { state: state as DuelState, version: row.version } : null;
}

async function saveRoom(db: D1Database, code: string, state: DuelState, version: number) {
  const result = await db
    .prepare("UPDATE football_tic_tac_toe_rooms SET state = ?, version = version + 1, updated_at = ? WHERE code = ? AND version = ?")
    .bind(JSON.stringify(state), Date.now(), code, version)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

const sideOf = (state: DuelState, token: string) =>
  token && state.p1Token === token ? "p1" : token && state.p2Token === token ? "p2" : null;

function startPick(state: DuelState, now: number) {
  state.phase = "pick";
  state.picks = {};
  state.clubs = null;
  state.pass = { p1: false, p2: false };
  state.guesses = { p1: false, p2: false };
  state.deadline = now + DUEL_PICK_MS;
}

function startGuess(state: DuelState, now: number) {
  const keys = DUEL_CLUBS[state.comp].map((club) => club.key);
  const p1 = state.picks.p1 ?? randomOf(keys.filter((key) => key !== state.picks.p2));
  const p2 = state.picks.p2 ?? randomOf(keys.filter((key) => key !== p1));
  const label = (key: string) => clubByKey(state.comp, key)?.label;
  if (p1 === p2) {
    startPick(state, now);
    state.notice = `Both picked ${label(p1)}. Pick different clubs.`;
    return;
  }
  if (playersForBoth(p1, p2, state.comp).length === 0) {
    startPick(state, now);
    state.notice = `No known player has played for both ${label(p1)} and ${label(p2)}. Pick again.`;
    return;
  }
  state.notice = null;
  state.clubs = { p1, p2 };
  state.phase = "guess";
  state.pass = { p1: false, p2: false };
  state.guesses = { p1: false, p2: false };
  state.deadline = now + DUEL_GUESS_MS;
}

// Advances any phase whose timer ran out or whose conditions are met.
function tick(state: DuelState, now: number) {
  if (state.phase === "pick") {
    const both = state.picks.p1 && state.picks.p2;
    if (both || (state.deadline !== null && now >= state.deadline)) startGuess(state, now);
  } else if (state.phase === "guess" && state.deadline !== null && now >= state.deadline) {
    endRound(state, now, { winner: null, player: null, reason: "timeout" });
  } else if (state.phase === "result" && state.deadline !== null && now >= state.deadline) {
    state.round += 1;
    startPick(state, now);
  }
}

function view(state: DuelState, side: Side, now: number) {
  const opponent = otherSide(side);
  const revealPicks = state.phase !== "pick" && state.phase !== "waiting";
  return {
    comp: state.comp,
    you: side,
    phase: state.phase,
    round: state.round,
    scores: state.scores,
    opponentJoined: Boolean(state.p2Token),
    myPick: state.picks[side] ?? null,
    opponentPicked: Boolean(state.picks[opponent]),
    opponentPick: revealPicks ? state.picks[opponent] ?? null : null,
    clubs:
      state.clubs && state.phase !== "pick" && state.phase !== "waiting"
        ? { you: state.clubs[side], opponent: state.clubs[opponent] }
        : null,
    notice: state.notice,
    youPassed: state.pass[side],
    opponentPassed: state.pass[opponent],
    youGuessed: state.guesses?.[side] ?? false,
    opponentGuessed: state.guesses?.[opponent] ?? false,
    last: state.last,
    usedCount: state.used.length,
    winner: state.winner,
    youWantRematch: state.rematch[side],
    opponentWantsRematch: state.rematch[opponent],
    msLeft: state.deadline === null ? null : Math.max(0, state.deadline - now),
    winScore: DUEL_WIN_SCORE,
  };
}

type Outcome = { error?: string; status?: number; extra?: Record<string, unknown> } | void;

// Reloads and retries on version conflicts so that simultaneous guesses are decided in order.
async function mutate(
  db: D1Database,
  code: string,
  token: string,
  apply: (state: DuelState, side: Side, now: number) => Outcome,
) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const room = await loadRoom(db, code);
    if (!room) return json({ error: "Room not found" }, 404);
    const side = sideOf(room.state, token);
    if (!side) return json({ error: "You are not in this room" }, 403);
    const now = Date.now();
    const before = JSON.stringify(room.state);
    tick(room.state, now);
    const outcome = apply(room.state, side, now);
    if (outcome?.error) return json({ error: outcome.error }, outcome.status ?? 400);
    tick(room.state, now);
    if (JSON.stringify(room.state) === before || (await saveRoom(db, code, room.state, room.version))) {
      return json({ view: view(room.state, side, now), ...(outcome?.extra ?? {}) });
    }
  }
  return json({ error: "Room is busy, try again" }, 409);
}

async function handleGet(request: NextRequest) {
  const { env } = getCloudflareContext();
  const code = normalizeCode(request.nextUrl.searchParams.get("code"));
  const token = request.nextUrl.searchParams.get("token") ?? "";
  return mutate(env.DB, code, token, () => undefined);
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
    const state: DuelState = {
      game: "clubduel",
      comp,
      p1Token: token,
      phase: "waiting",
      round: 1,
      scores: { p1: 0, p2: 0 },
      picks: {},
      clubs: null,
      notice: null,
      used: [],
      pass: { p1: false, p2: false },
      last: null,
      winner: null,
      rematch: { p1: false, p2: false },
      deadline: null,
    };
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

  if (body.action === "join") {
    const room = await loadRoom(db, code);
    if (!room) return json({ error: "Room not found" }, 404);
    if (room.state.p2Token) return json({ error: "This room is already full" }, 409);
    const token = crypto.randomUUID();
    room.state.p2Token = token;
    startPick(room.state, Date.now());
    if (!(await saveRoom(db, code, room.state, room.version))) return json({ error: "Room is busy, try again" }, 409);
    return json({ code, token });
  }

  const token = typeof body.token === "string" ? body.token : "";

  if (body.action === "pick") {
    const key = typeof body.club === "string" ? body.club : "";
    return mutate(db, code, token, (state, side) => {
      if (state.phase !== "pick") return { error: "Picking is over for this round" };
      if (!clubByKey(state.comp, key)) return { error: "Unknown club" };
      state.picks[side] = key;
    });
  }

  if (body.action === "guess") {
    const guess = typeof body.guess === "string" ? body.guess.slice(0, 60) : "";
    return mutate(db, code, token, (state, side, now) => {
      if (body.round !== state.round) return { extra: { correct: false, message: "That round is over" } };
      return { extra: submitDuelGuess(state, side, guess, now) };
    });
  }

  if (body.action === "pass") {
    return mutate(db, code, token, (state, side, now) => {
      skipDuelGuess(state, side, now);
    });
  }

  if (body.action === "rematch") {
    return mutate(db, code, token, (state, side, now) => {
      if (state.phase !== "finished") return;
      state.rematch[side] = true;
      if (state.rematch.p1 && state.rematch.p2) {
        state.scores = { p1: 0, p2: 0 };
        state.used = [];
        state.round = 1;
        state.last = null;
        state.winner = null;
        state.rematch = { p1: false, p2: false };
        startPick(state, now);
      }
    });
  }

  return json({ error: "Unknown action" }, 400);
}

async function safely(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (error) {
    console.error("club duel room error", error instanceof Error ? error.message : "");
    return json({ error: "Server error, please try again." }, 500);
  }
}

export const GET = (request: NextRequest) => safely(() => handleGet(request));
export const POST = (request: NextRequest) => safely(() => handlePost(request));
