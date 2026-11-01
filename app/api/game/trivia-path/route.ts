import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { parseComp, type Competition } from "@/lib/gameRoom";
import {
  BOARD_SIZE,
  answersFor,
  generateBoardIds,
  matchTriviaAnswer,
  rollDice,
  tileById,
  tileQuestion,
  triviaSeconds,
} from "@/data/triviaPath";

type Side = "p1" | "p2";
type Last = { side: Side; success: boolean; message: string; answers: string[] };
type PathState = {
  game: "triviapath";
  comp: Competition;
  p1Token: string;
  p2Token?: string;
  phase: "waiting" | "roll" | "play" | "result" | "finished";
  board: string[];
  shorts: string[];
  pos: Record<Side, number>;
  turns: Record<Side, number>;
  turn: Side;
  dice: number | null;
  origin: number;
  required: number;
  question: string | null;
  found: string[];
  taken?: Record<number, string[]>;
  last: Last | null;
  winner: Side | null;
  rematch: Record<Side, boolean>;
  deadline: number | null;
};

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;
const ROLL_MS = 30_000;
const RESULT_MS = 3_000;

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const makeCode = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");

const normalizeCode = (value: unknown) =>
  typeof value === "string" ? value.trim().toUpperCase().slice(0, 12) : "";

const otherSide = (side: Side): Side => (side === "p1" ? "p2" : "p1");

async function loadRoom(db: D1Database, code: string) {
  const row = await db
    .prepare("SELECT state, version FROM football_tic_tac_toe_rooms WHERE code = ?")
    .bind(code)
    .first<{ state: string; version: number }>();
  if (!row) return null;
  const state = JSON.parse(row.state) as Partial<PathState>;
  return state.game === "triviapath" ? { state: state as PathState, version: row.version } : null;
}

async function saveRoom(db: D1Database, code: string, state: PathState, version: number) {
  const result = await db
    .prepare("UPDATE football_tic_tac_toe_rooms SET state = ?, version = version + 1, updated_at = ? WHERE code = ? AND version = ?")
    .bind(JSON.stringify(state), Date.now(), code, version)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

const sideOf = (state: PathState, token: string) =>
  token && state.p1Token === token ? "p1" : token && state.p2Token === token ? "p2" : null;

const targetOf = (state: PathState) => Math.min(state.origin + (state.dice ?? 0), BOARD_SIZE);

function startRoll(state: PathState, now: number) {
  state.phase = "roll";
  state.dice = null;
  state.question = null;
  state.found = [];
  state.deadline = now + ROLL_MS;
}

function startPlay(state: PathState, now: number, dice: number) {
  state.dice = dice;
  state.origin = state.pos[state.turn];
  const tile = tileById(state.comp, state.board[targetOf(state) - 1]);
  state.required = tile ? answersFor(tile, dice) : 1;
  state.question = tile ? tileQuestion(tile, state.required) : "Name a player";
  state.found = [];
  state.phase = "play";
  state.deadline = now + triviaSeconds(state.required) * 1000;
}

function finishTurn(state: PathState, now: number, success: boolean, message: string) {
  const side = state.turn;
  const key = targetOf(state);
  state.taken ??= {};
  state.taken[key] = [...(state.taken[key] ?? []), ...state.found];
  if (success) state.pos[side] = targetOf(state);
  state.turns[side] += 1;
  state.last = { side, success, message, answers: state.found };
  if (success && state.pos[side] >= BOARD_SIZE) {
    state.phase = "finished";
    state.winner = side;
    state.deadline = null;
    return;
  }
  state.phase = "result";
  state.deadline = now + RESULT_MS;
}

// Advances any phase whose timer ran out. A player who never rolls gets an automatic roll.
function tick(state: PathState, now: number) {
  if (state.deadline === null || now < state.deadline) return;
  if (state.phase === "roll") startPlay(state, now, rollDice());
  else if (state.phase === "play") finishTurn(state, now, false, "Time ran out");
  else if (state.phase === "result") {
    state.turn = otherSide(state.turn);
    startRoll(state, now);
  }
}

function view(state: PathState, side: Side, now: number) {
  const opponent = otherSide(side);
  return {
    comp: state.comp,
    you: side,
    phase: state.phase,
    opponentJoined: Boolean(state.p2Token),
    shorts: state.shorts,
    pos: state.pos,
    turns: state.turns,
    turn: state.turn,
    dice: state.dice,
    target: targetOf(state),
    required: state.required,
    question: state.question,
    found: state.found,
    last: state.last,
    winner: state.winner,
    boardSize: BOARD_SIZE,
    youWantRematch: state.rematch[side],
    opponentWantsRematch: state.rematch[opponent],
    msLeft: state.deadline === null ? null : Math.max(0, state.deadline - now),
  };
}

type Outcome = { error?: string; status?: number; extra?: Record<string, unknown> } | void;

// Reloads and retries on version conflicts so that simultaneous requests are applied in order.
async function mutate(
  db: D1Database,
  code: string,
  token: string,
  apply: (state: PathState, side: Side, now: number) => Outcome,
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
    if (JSON.stringify(room.state) === before || (await saveRoom(db, code, room.state, room.version))) {
      return json({ view: view(room.state, side, now), ...(outcome?.extra ?? {}) });
    }
  }
  return json({ error: "Room is busy, try again" }, 409);
}

function freshState(comp: Competition, p1Token: string): PathState {
  const board = generateBoardIds(comp);
  return {
    game: "triviapath",
    comp,
    p1Token,
    phase: "waiting",
    board,
    shorts: board.map((id) => tileById(comp, id)?.short ?? "Trivia"),
    pos: { p1: 0, p2: 0 },
    turns: { p1: 0, p2: 0 },
    turn: "p1",
    dice: null,
    origin: 0,
    required: 1,
    question: null,
    found: [],
    taken: {},
    last: null,
    winner: null,
    rematch: { p1: false, p2: false },
    deadline: null,
  };
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
    const state = freshState(comp, token);
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
    startRoll(room.state, Date.now());
    if (!(await saveRoom(db, code, room.state, room.version))) return json({ error: "Room is busy, try again" }, 409);
    return json({ code, token });
  }

  const token = typeof body.token === "string" ? body.token : "";

  if (body.action === "roll") {
    return mutate(db, code, token, (state, side, now) => {
      if (state.phase !== "roll" || state.turn !== side) return { error: "It is not your turn to roll" };
      startPlay(state, now, rollDice());
    });
  }

  if (body.action === "answer") {
    const guess = typeof body.guess === "string" ? body.guess.slice(0, 60) : "";
    return mutate(db, code, token, (state, side, now) => {
      if (state.phase !== "play" || state.turn !== side) return { extra: { message: "Not your question" } };
      const tile = tileById(state.comp, state.board[targetOf(state) - 1]);
      if (!tile) return { error: "Question unavailable" };
      const used = (state.taken ??= {})[targetOf(state)] ?? [];
      const open = tile.entries.filter((entry) => !state.found.includes(entry.name) && !used.includes(entry.name));
      const entry = matchTriviaAnswer(open, guess);
      if (!entry) {
        const repeat = matchTriviaAnswer(tile.entries, guess);
        if (repeat) {
          const message = state.found.includes(repeat.name) ? "Already said that one" : "Already answered on this question, try another";
          return { extra: { message } };
        }
        finishTurn(state, now, false, "Wrong answer, you lose your turn");
        return { extra: { message: "Wrong answer, you lose your turn" } };
      }
      state.found.push(entry.name);
      if (state.found.length >= state.required) finishTurn(state, now, true, "Correct");
    });
  }

  if (body.action === "rematch") {
    return mutate(db, code, token, (state, side, now) => {
      if (state.phase !== "finished") return;
      state.rematch[side] = true;
      if (state.rematch.p1 && state.rematch.p2) {
        Object.assign(state, freshState(state.comp, state.p1Token), { p2Token: state.p2Token });
        startRoll(state, now);
      }
    });
  }

  return json({ error: "Unknown action" }, 400);
}

async function safely(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (error) {
    console.error("trivia path room error", error instanceof Error ? error.message : "");
    return json({ error: "Server error, please try again." }, 500);
  }
}

export const GET = (request: NextRequest) => safely(() => handleGet(request));
export const POST = (request: NextRequest) => safely(() => handlePost(request));
