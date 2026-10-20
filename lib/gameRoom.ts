import { PLAYERS, type PlayerCard } from "@/data/players";

export type Side = "p1" | "p2";
export type StatKey = "appearances" | "goals" | "assists";
export const STAT_KEYS: StatKey[] = ["goals", "assists", "appearances"];
export const WIN_SCORE = 10;

export type RoomState = {
  p1Token: string;
  p2Token: string | null;
  phase: "waiting" | "picking" | "resolved" | "finished";
  round: number;
  picker: Side;
  cards: { p1: PlayerCard; p2: PlayerCard } | null;
  scores: { p1: number; p2: number };
  result: { stat: StatKey; p1Value: number; p2Value: number; pointSide: Side | null } | null;
  winner: Side | null;
};

export type RoomView = {
  you: Side;
  phase: RoomState["phase"];
  round: number;
  picker: Side;
  scores: RoomState["scores"];
  yourCard: PlayerCard | null;
  opponentCard: PlayerCard | null; // only revealed once the round is resolved
  result: RoomState["result"];
  winner: Side | null;
};

export const other = (side: Side): Side => (side === "p1" ? "p2" : "p1");

function randomSide(): Side {
  return Math.random() < 0.5 ? "p1" : "p2";
}

function drawCards(): { p1: PlayerCard; p2: PlayerCard } {
  const a = Math.floor(Math.random() * PLAYERS.length);
  let b = Math.floor(Math.random() * PLAYERS.length);
  while (b === a) b = Math.floor(Math.random() * PLAYERS.length);
  return { p1: PLAYERS[a], p2: PLAYERS[b] };
}

export function newRoom(p1Token: string): RoomState {
  return {
    p1Token,
    p2Token: null,
    phase: "waiting",
    round: 1,
    picker: "p1",
    cards: null,
    scores: { p1: 0, p2: 0 },
    result: null,
    winner: null,
  };
}

export function startMatch(state: RoomState) {
  state.phase = "picking";
  state.round = 1;
  state.scores = { p1: 0, p2: 0 };
  state.winner = null;
  state.result = null;
  state.picker = randomSide();
  state.cards = drawCards();
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
  } else {
    state.phase = "resolved";
  }
  return null;
}

// Pickers alternate every round
export function applyNext(state: RoomState, round: number): string | null {
  if (round !== state.round) return null; // the other player already advanced
  if (state.phase !== "resolved") return "Round is not finished";
  state.round += 1;
  state.phase = "picking";
  state.picker = other(state.picker);
  state.cards = drawCards();
  state.result = null;
  return null;
}

export function viewFor(state: RoomState, side: Side): RoomView {
  const revealed = state.phase === "resolved" || state.phase === "finished";
  return {
    you: side,
    phase: state.phase,
    round: state.round,
    picker: state.picker,
    scores: state.scores,
    yourCard: state.cards ? state.cards[side] : null,
    opponentCard: state.cards && revealed ? state.cards[other(side)] : null,
    result: state.result,
    winner: state.winner,
  };
}
