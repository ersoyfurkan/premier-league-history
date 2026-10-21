import { PLAYERS, type PlayerCard } from "@/data/players";
import { UCL_CARDS } from "@/data/uclCards";
import { LALIGA_CARDS } from "@/data/laLigaCards";

export type Competition = "pl" | "ucl" | "laliga";
export const poolFor = (comp: Competition | undefined): PlayerCard[] =>
  comp === "ucl" ? UCL_CARDS : comp === "laliga" ? LALIGA_CARDS : PLAYERS;
export const lobbyFor = (comp: Competition | undefined) =>
  comp === "ucl" ? "/champions-league/game" : comp === "laliga" ? "/la-liga/game" : "/game";
export const parseComp = (value: unknown): Competition => (value === "ucl" || value === "laliga" ? value : "pl");

export type Side = "p1" | "p2";
export type StatKey = "appearances" | "goals" | "assists";
export const STAT_KEYS: StatKey[] = ["goals", "assists", "appearances"];
export const WIN_SCORE = 10;
export const PICK_TIMEOUT_MS = 20_000;
export const NEXT_TIMEOUT_MS = 15_000;

export type RoomState = {
  comp?: Competition; // missing on older rooms, which are Premier League
  p1Token: string;
  p2Token: string | null;
  phase: "waiting" | "picking" | "resolved" | "finished";
  round: number;
  picker: Side;
  cards: { p1: PlayerCard; p2: PlayerCard } | null;
  scores: { p1: number; p2: number };
  result: { stat: StatKey; p1Value: number; p2Value: number; pointSide: Side | null } | null;
  winner: Side | null;
  ready: { p1: boolean; p2: boolean };
  rematch?: { p1: boolean; p2: boolean }; // votes to play again after a finished match
  deadline: number | null; // when the current phase auto-advances (ms since epoch)
};

export type RoomView = {
  comp: Competition;
  you: Side;
  phase: RoomState["phase"];
  round: number;
  picker: Side;
  scores: RoomState["scores"];
  yourCard: PlayerCard | null;
  opponentCard: PlayerCard | null; // only revealed once the round is resolved
  result: RoomState["result"];
  winner: Side | null;
  youReady: boolean;
  opponentReady: boolean;
  youWantRematch: boolean;
  opponentWantsRematch: boolean;
  msLeft: number | null;
};

export const other = (side: Side): Side => (side === "p1" ? "p2" : "p1");

function randomSide(): Side {
  return Math.random() < 0.5 ? "p1" : "p2";
}

function drawCards(comp: Competition | undefined): { p1: PlayerCard; p2: PlayerCard } {
  const pool = poolFor(comp);
  const a = Math.floor(Math.random() * pool.length);
  let b = Math.floor(Math.random() * pool.length);
  while (b === a) b = Math.floor(Math.random() * pool.length);
  return { p1: pool[a], p2: pool[b] };
}

export function newRoom(p1Token: string, comp: Competition = "pl"): RoomState {
  return {
    comp,
    p1Token,
    p2Token: null,
    phase: "waiting",
    round: 1,
    picker: "p1",
    cards: null,
    scores: { p1: 0, p2: 0 },
    result: null,
    winner: null,
    ready: { p1: false, p2: false },
    deadline: null,
  };
}

export function startMatch(state: RoomState, now: number) {
  state.phase = "picking";
  state.round = 1;
  state.scores = { p1: 0, p2: 0 };
  state.winner = null;
  state.result = null;
  state.picker = randomSide();
  state.cards = drawCards(state.comp);
  state.ready = { p1: false, p2: false };
  state.rematch = { p1: false, p2: false };
  state.deadline = now + PICK_TIMEOUT_MS;
}

export function applyRematch(state: RoomState, side: Side, now: number): string | null {
  if (state.phase !== "finished") return "Match is not finished";
  state.rematch = { p1: false, p2: false, ...state.rematch, [side]: true };
  if (state.rematch.p1 && state.rematch.p2) startMatch(state, now);
  return null;
}

export function sideOf(state: RoomState, token: string): Side | null {
  if (token === state.p1Token) return "p1";
  if (state.p2Token && token === state.p2Token) return "p2";
  return null;
}

export function applyPick(state: RoomState, side: Side, stat: StatKey): string | null {
  if (state.phase !== "picking" || !state.cards) return "Not your time to pick";
  if (state.picker !== side) return "It is your opponent's turn to pick";
  if (!STAT_KEYS.includes(stat)) return "Invalid stat";

  const p1Value = state.cards.p1[stat];
  const p2Value = state.cards.p2[stat];
  const pointSide: Side | null = p1Value === p2Value ? null : p1Value > p2Value ? "p1" : "p2";

  if (pointSide) state.scores[pointSide] += 1;
  state.result = { stat, p1Value, p2Value, pointSide };

  if (state.scores.p1 >= WIN_SCORE || state.scores.p2 >= WIN_SCORE) {
    state.phase = "finished";
    state.winner = state.scores.p1 >= WIN_SCORE ? "p1" : "p2";
    state.deadline = null;
  } else {
    state.phase = "resolved";
    state.ready = { p1: false, p2: false };
    state.deadline = null; // the next-round countdown starts once one player is ready
  }
  return null;
}

function advance(state: RoomState, now: number) {
  state.round += 1;
  state.phase = "picking";
  state.picker = other(state.picker); // pickers alternate every round
  state.cards = drawCards(state.comp);
  state.result = null;
  state.ready = { p1: false, p2: false };
  state.deadline = now + PICK_TIMEOUT_MS;
}

// Moves on when both players are ready; the first ready player starts a countdown for the other
export function applyNext(state: RoomState, side: Side, round: number, now: number): string | null {
  if (round !== state.round) return null; // already advanced
  if (state.phase !== "resolved") return "Round is not finished";
  state.ready[side] = true;
  if (state.ready.p1 && state.ready.p2) advance(state, now);
  else if (state.deadline === null) state.deadline = now + NEXT_TIMEOUT_MS;
  return null;
}

// Applies timeouts; returns true if the state changed
export function tick(state: RoomState, now: number): boolean {
  if (state.deadline === null || now < state.deadline) return false;

  if (state.phase === "picking") {
    const stat = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)];
    return applyPick(state, state.picker, stat) === null;
  }
  if (state.phase === "resolved") {
    advance(state, now);
    return true;
  }
  return false;
}
export function viewFor(state: RoomState, side: Side, now: number): RoomView {
  const revealed = state.phase === "resolved" || state.phase === "finished";
  return {
    comp: state.comp ?? "pl",
    you: side,
    phase: state.phase,
    round: state.round,
    picker: state.picker,
    scores: state.scores,
    yourCard: state.cards ? state.cards[side] : null,
    opponentCard: state.cards && revealed ? state.cards[other(side)] : null,
    result: state.result,
    winner: state.winner,
    youReady: state.ready[side],
    opponentReady: state.ready[other(side)],
    youWantRematch: Boolean(state.rematch?.[side]),
    opponentWantsRematch: Boolean(state.rematch?.[other(side)]),
    msLeft: state.deadline === null ? null : Math.max(0, state.deadline - now),
  };
}
