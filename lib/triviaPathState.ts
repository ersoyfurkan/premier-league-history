import type { Competition } from "@/lib/competitions";
import { BOARD_SIZE, answersFor, checkTriviaAnswer, generateBoardIds, tileById, tileQuestion, triviaAnswerType, triviaSeconds } from "@/data/triviaPath";
import { triviaBoardPresentation } from "@/data/triviaPathVisuals";

export type PathSide = "p1" | "p2";
export type PathState = {
  game: "triviapath";
  comp: Competition;
  p1Token: string;
  p2Token?: string;
  phase: "waiting" | "roll" | "play" | "result" | "finished";
  board: string[];
  pos: Record<PathSide, number>;
  turns: Record<PathSide, number>;
  turn: PathSide;
  dice: number | null;
  origin: number;
  required: number;
  question: string | null;
  found: string[];
  taken?: Record<number, string[]>;
  last: { side: PathSide; success: boolean; message: string; answers: string[] } | null;
  winner: PathSide | null;
  rematch: Record<PathSide, boolean>;
  deadline: number | null;
  finalRevealed?: boolean;
};

export const targetOf = (state: PathState) => Math.min(state.origin + (state.dice ?? 0), BOARD_SIZE);

export function startPlay(state: PathState, now: number, dice: number) {
  state.dice = dice;
  state.origin = state.pos[state.turn];
  const target = targetOf(state);
  const tile = tileById(state.comp, state.board[target - 1]);
  if (!tile) throw new Error(`Trivia Path question unavailable: ${state.board[target - 1]}`);
  if (target === BOARD_SIZE) state.finalRevealed = true;
  state.required = answersFor(tile, dice);
  state.question = tileQuestion(tile, state.required);
  state.found = [];
  state.phase = "play";
  state.deadline = now + triviaSeconds(state.required) * 1000;
}

export function finishTurn(state: PathState, now: number, success: boolean, message: string) {
  const side = state.turn;
  const target = targetOf(state);
  state.taken ??= {};
  if (success) {
    state.taken[target] = [...new Set([...(state.taken[target] ?? []), ...state.found])];
    state.pos[side] = target;
  }
  state.turns[side] += 1;
  state.last = { side, success, message, answers: [...state.found] };
  if (success && state.pos[side] >= BOARD_SIZE) {
    state.phase = "finished";
    state.winner = side;
    state.deadline = null;
  } else {
    state.phase = "result";
    state.deadline = now + 3000;
  }
}

export function answerPath(state: PathState, guess: string, now: number): string {
  const target = targetOf(state);
  const tile = tileById(state.comp, state.board[target - 1]);
  if (!tile) throw new Error(`Trivia Path question unavailable: ${state.board[target - 1]}`);
  const result = checkTriviaAnswer(tile.entries, guess, state.found, state.taken?.[target] ?? []);
  if (result.kind !== "correct") {
    if (result.kind !== "duplicate") finishTurn(state, now, false, result.message);
    return result.message;
  }
  state.found.push(result.entry.name);
  if (state.found.length >= state.required) finishTurn(state, now, true, "Correct");
  return "Correct";
}

export function pathView(state: PathState, side: PathSide, now: number) {
  const opponent = side === "p1" ? "p2" : "p1";
  const finalRevealed = Boolean(state.finalRevealed || state.pos.p1 >= BOARD_SIZE || state.pos.p2 >= BOARD_SIZE
    || ((state.phase === "play" || state.phase === "result") && targetOf(state) === BOARD_SIZE));
  const tiles = state.board.map((id) => {
    const tile = tileById(state.comp, id);
    if (!tile) throw new Error(`Trivia Path question unavailable: ${id}`);
    return tile;
  });
  return {
    comp: state.comp,
    you: side,
    phase: state.phase,
    opponentJoined: Boolean(state.p2Token),
    tiles: triviaBoardPresentation(tiles, finalRevealed),
    finalRevealed,
    pos: state.pos,
    turns: state.turns,
    turn: state.turn,
    dice: state.dice,
    target: targetOf(state),
    required: state.required,
    question: state.question,
    answerType: state.phase === "play" || state.phase === "result" ? triviaAnswerType(tiles[targetOf(state) - 1]) : null,
    found: state.found,
    last: state.last,
    winner: state.winner,
    boardSize: BOARD_SIZE,
    youWantRematch: state.rematch[side],
    opponentWantsRematch: state.rematch[opponent],
    msLeft: state.deadline === null ? null : Math.max(0, state.deadline - now),
  };
}

export function freshState(comp: Competition, p1Token: string): PathState {
  return {
    game: "triviapath", comp, p1Token, phase: "waiting", board: generateBoardIds(comp),
    pos: { p1: 0, p2: 0 }, turns: { p1: 0, p2: 0 }, turn: "p1", dice: null, origin: 0,
    required: 1, question: null, found: [], taken: {}, last: null, winner: null,
    rematch: { p1: false, p2: false }, deadline: null, finalRevealed: false,
  };
}
