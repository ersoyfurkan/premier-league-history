import {
  footballTicTacToeWinner,
  FOOTBALL_TIC_TAC_TOE,
  isFootballTicTacToeAnswer,
  normalizeFootballPlayerName,
  randomFootballTicTacToePuzzle,
  type FootballTicTacToePuzzle,
  type FootballTicTacToeCell,
} from "@/data/footballTicTacToe";
import { other, parseComp, type Competition, type Side } from "@/lib/gameRoom";

export type FootballTicTacToeRoomState = {
  mode?: FootballTicTacToeMode;
  traps?: string[];
  lastTrap?: { cell: number; player: string; side: Side } | null;
  comp: Competition;
  p1Token: string;
  p2Token: string | null;
  status: "waiting" | "playing" | "finished";
  turn: Side;
  puzzle: FootballTicTacToePuzzle;
  board: (FootballTicTacToeCell | null)[];
  winner: Side | null;
  turnDeadline: number | null;
  timedOut: Side | null;
  rematch?: Record<Side, boolean>;
};

export type FootballTicTacToeMode = "normal" | "hidden-trap";
export const isFootballTicTacToeMode = (value: unknown): value is FootballTicTacToeMode =>
  value === "normal" || value === "hidden-trap";

export type FootballTicTacToeRoomView = Omit<FootballTicTacToeRoomState, "p1Token" | "p2Token" | "rematch" | "traps" | "puzzle"> & {
  puzzle: Pick<FootballTicTacToePuzzle, "rows" | "columns">;
  revealedTraps: (string | null)[];
  you: Side;
  youWantRematch: boolean;
  opponentWantsRematch: boolean;
};

function pickTraps(puzzle: FootballTicTacToePuzzle): string[] {
  return puzzle.answers.flatMap((row) => row.map((answers) => {
    const names = [...new Set(answers.map(normalizeFootballPlayerName))];
    if (!names.length) throw new Error("Cannot pick a hidden trap for an empty answer pool");
    const random = crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000;
    return names[Math.floor(random * names.length)];
  }));
}

export function requestFootballTicTacToeRematch(state: FootballTicTacToeRoomState, side: Side, now: number) {
  if (state.status === "waiting") return "Wait for both players to join before voting";
  const rematch = state.rematch ?? { p1: false, p2: false };
  rematch[side] = true;
  state.rematch = rematch;
  if (rematch.p1 && rematch.p2) {
    state.puzzle = randomFootballTicTacToePuzzle(state.comp);
    state.traps = state.mode === "hidden-trap" ? pickTraps(state.puzzle) : undefined;
    state.lastTrap = null;
    state.board = Array(9).fill(null);
    state.winner = null;
    state.timedOut = null;
    state.turn = Math.random() < 0.5 ? "p1" : "p2";
    state.status = "playing";
    state.turnDeadline = now + 60_000;
    state.rematch = { p1: false, p2: false };
  }
  return null;
}

export function newFootballTicTacToeRoom(
  token: string, comp: Competition, mode: FootballTicTacToeMode = "normal",
): FootballTicTacToeRoomState {
  const puzzle = randomFootballTicTacToePuzzle(comp);
  return {
    mode,
    traps: mode === "hidden-trap" ? pickTraps(puzzle) : undefined,
    lastTrap: null,
    comp,
    p1Token: token,
    p2Token: null,
    status: "waiting",
    turn: Math.random() < 0.5 ? "p1" : "p2",
    puzzle,
    board: Array(9).fill(null),
    winner: null,
    turnDeadline: null,
    timedOut: null,
  };
}

export function footballTicTacToeSideOf(state: FootballTicTacToeRoomState, token: string): Side | null {
  if (token === state.p1Token) return "p1";
  if (state.p2Token && token === state.p2Token) return "p2";
  return null;
}

export function footballTicTacToeView(
  state: FootballTicTacToeRoomState,
  you: Side,
): FootballTicTacToeRoomView {
  const puzzle = state.puzzle ?? FOOTBALL_TIC_TAC_TOE[state.comp];
  const revealedTraps = state.board.map((entry, cell) => {
    if (!entry || state.mode !== "hidden-trap") return null;
    const trap = state.traps?.[cell];
    const name = puzzle.answers[Math.floor(cell / 3)][cell % 3]
      .find((answer) => normalizeFootballPlayerName(answer) === trap);
    if (!name) throw new Error("Cannot reveal a missing hidden trap answer");
    return name;
  });
  return {
    mode: state.mode ?? "normal",
    lastTrap: state.lastTrap ?? null,
    comp: state.comp,
    status: state.status,
    turn: state.turn,
    puzzle: { rows: puzzle.rows, columns: puzzle.columns },
    board: state.board,
    revealedTraps,
    winner: state.winner,
    turnDeadline: state.turnDeadline ?? null,
    timedOut: state.timedOut ?? null,
    you,
    youWantRematch: state.rematch?.[you] ?? false,
    opponentWantsRematch: state.rematch?.[other(you)] ?? false,
  };
}

export function expireFootballTicTacToeTurn(state: FootballTicTacToeRoomState, now: number) {
  if (state.status !== "playing" || state.turnDeadline === null || now < state.turnDeadline) return false;
  state.timedOut = state.turn;
  state.turn = other(state.turn);
  state.turnDeadline = now + 60_000;
  return true;
}

export function applyFootballTicTacToeMove(
  state: FootballTicTacToeRoomState,
  side: Side,
  cell: number,
  player: string,
  now: number,
): string | null {
  if (state.status !== "playing") return "The game is not in progress";
  if (expireFootballTicTacToeTurn(state, now)) return "Time ran out. The turn passed to your opponent.";
  if (state.turn !== side) return "It is your opponent's turn";
  if (!Number.isInteger(cell) || cell < 0 || cell > 8 || state.board[cell]) return "Choose an empty square";
  if (typeof player !== "string" || player.trim().length < 2 || player.trim().length > 80) {
    return "Enter a valid player name";
  }
  if (!isFootballTicTacToeAnswer(state.comp, cell, player, state.puzzle)) {
    return "That player does not match both clues. Try another name.";
  }

  const normalizedPlayer = normalizeFootballPlayerName(player);
  if (state.board.some((entry) => entry && normalizeFootballPlayerName(entry.player) === normalizedPlayer)) {
    return "That player has already been used";
  }

  const trap = state.mode === "hidden-trap";
  const hiddenAnswer = state.traps?.[cell];
  if (trap && (state.traps?.length !== 9 || !hiddenAnswer)) throw new Error("Hidden trap answers are missing");
  const hitTrap = trap && hiddenAnswer === normalizedPlayer;
  state.board[cell] = { side: hitTrap ? other(side) : side, player: player.trim() };
  state.lastTrap = hitTrap ? { cell, player: player.trim(), side } : null;
  state.timedOut = null;
  const winner = footballTicTacToeWinner(state.board);
  if (winner) {
    state.status = "finished";
    state.winner = winner;
    state.turnDeadline = null;
  } else if (state.board.every(Boolean)) {
    state.status = "finished";
    state.turnDeadline = null;
  } else {
    state.turn = other(side);
    state.turnDeadline = now + 60_000;
  }
  return null;
}

export const parseFootballTicTacToeComp = (value: unknown) => parseComp(value);
