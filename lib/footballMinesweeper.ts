export const MINESWEEPER_SIZE = 8;
export const MINESWEEPER_CELLS = MINESWEEPER_SIZE * MINESWEEPER_SIZE;
export const MINESWEEPER_MINES = 10;
export const MINESWEEPER_LIVES = 3;

export type MinesweeperSide = "p1" | "p2";
export type MinesweeperPhase = "waiting" | "playing" | "finished";
export type MinesweeperAction =
  | { action: "reveal"; cell: number }
  | { action: "flag"; cell: number }
  | { action: "rematch" };

export type FootballMinesweeperState = {
  gameId: string;
  revision: number;
  phase: MinesweeperPhase;
  p1Token: string;
  p2Token: string | null;
  mines: number[];
  revealed: number[];
  flags: number[];
  turn: MinesweeperSide;
  scores: Record<MinesweeperSide, number>;
  lives: Record<MinesweeperSide, number>;
  winner: MinesweeperSide | null;
  rematch: Record<MinesweeperSide, boolean>;
  notice: string | null;
};

export type FootballMinesweeperView = {
  gameId: string;
  revision: number;
  phase: MinesweeperPhase;
  you: MinesweeperSide;
  turn: MinesweeperSide;
  opponentJoined: boolean;
  scores: Record<MinesweeperSide, number>;
  lives: Record<MinesweeperSide, number>;
  winner: MinesweeperSide | null;
  rematch: Record<MinesweeperSide, boolean>;
  notice: string | null;
  cells: Array<{
    state: "hidden" | "safe" | "mine";
    adjacent: number | null;
    flagged: boolean;
  }>;
};

const other = (side: MinesweeperSide): MinesweeperSide => side === "p1" ? "p2" : "p1";

function secureRandom(): number {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] / 0x1_0000_0000;
}

function randomMineCells(random: () => number): number[] {
  const cells = Array.from({ length: MINESWEEPER_CELLS }, (_, cell) => cell);
  for (let index = 0; index < MINESWEEPER_MINES; index += 1) {
    const swap = index + Math.floor(random() * (cells.length - index));
    [cells[index], cells[swap]] = [cells[swap], cells[index]];
  }
  return cells.slice(0, MINESWEEPER_MINES);
}

export function newFootballMinesweeperRoom(
  p1Token: string,
  random: () => number = secureRandom,
): FootballMinesweeperState {
  return {
    gameId: crypto.randomUUID(),
    revision: 0,
    phase: "waiting",
    p1Token,
    p2Token: null,
    mines: randomMineCells(random),
    revealed: [],
    flags: [],
    turn: "p1",
    scores: { p1: 0, p2: 0 },
    lives: { p1: MINESWEEPER_LIVES, p2: MINESWEEPER_LIVES },
    winner: null,
    rematch: { p1: false, p2: false },
    notice: null,
  };
}

export function minesweeperSideOf(state: FootballMinesweeperState, token: string): MinesweeperSide | null {
  if (token && token === state.p1Token) return "p1";
  if (token && token === state.p2Token) return "p2";
  return null;
}

function adjacentMines(state: FootballMinesweeperState, cell: number): number {
  const row = Math.floor(cell / MINESWEEPER_SIZE);
  const column = cell % MINESWEEPER_SIZE;
  let count = 0;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) continue;
      const neighborRow = row + rowOffset;
      const neighborColumn = column + columnOffset;
      if (neighborRow < 0 || neighborRow >= MINESWEEPER_SIZE ||
        neighborColumn < 0 || neighborColumn >= MINESWEEPER_SIZE) continue;
      if (state.mines.includes(neighborRow * MINESWEEPER_SIZE + neighborColumn)) count += 1;
    }
  }
  return count;
}

function finishIfClear(state: FootballMinesweeperState): boolean {
  const safeRevealed = state.revealed.filter((cell) => !state.mines.includes(cell)).length;
  if (safeRevealed < MINESWEEPER_CELLS - MINESWEEPER_MINES) return false;
  state.phase = "finished";
  state.winner = state.scores.p1 === state.scores.p2
    ? null
    : state.scores.p1 > state.scores.p2 ? "p1" : "p2";
  state.notice = state.winner ? `Player ${state.winner === "p1" ? "1" : "2"} wins on points!` : "Full time — it’s a draw!";
  return true;
}

function resetForRematch(state: FootballMinesweeperState, random: () => number): void {
  state.gameId = crypto.randomUUID();
  state.revision += 1;
  state.phase = "playing";
  state.mines = randomMineCells(random);
  state.revealed = [];
  state.flags = [];
  state.turn = "p1";
  state.scores = { p1: 0, p2: 0 };
  state.lives = { p1: MINESWEEPER_LIVES, p2: MINESWEEPER_LIVES };
  state.winner = null;
  state.rematch = { p1: false, p2: false };
  state.notice = "New match — Player 1 kicks off.";
}

export function applyFootballMinesweeperAction(
  state: FootballMinesweeperState,
  side: MinesweeperSide,
  action: MinesweeperAction,
  expectedRevision: number,
  random: () => number = secureRandom,
): string | null {
  if (state.revision !== expectedRevision) return "The game changed. Refresh the board before trying again.";
  if (state.phase === "waiting" && side === "p2") return "Wait for the other player to join.";
  if (action.action === "rematch") {
    if (state.phase !== "finished") return "Finish this match before requesting a rematch.";
    if (state.rematch[side]) return "Your rematch vote is already recorded.";
    state.rematch[side] = true;
    if (state.rematch.p1 && state.rematch.p2) resetForRematch(state, random);
    else {
      state.revision += 1;
      state.notice = `Player ${side === "p1" ? "1" : "2"} wants a rematch.`;
    }
    return null;
  }
  if (state.phase !== "playing") return "The match is not in progress.";
  if (!Number.isInteger(action.cell) || action.cell < 0 || action.cell >= MINESWEEPER_CELLS) {
    return "Choose a square on the pitch.";
  }
  if (state.turn !== side) return "It is your opponent’s turn.";
  if (state.revealed.includes(action.cell)) return "That square is already open.";

  if (action.action === "flag") {
    state.flags = state.flags.includes(action.cell)
      ? state.flags.filter((cell) => cell !== action.cell)
      : [...state.flags, action.cell];
    state.notice = state.flags.includes(action.cell) ? "Offside flag placed." : "Offside flag removed.";
    state.revision += 1;
    return null;
  }
  if (state.flags.includes(action.cell)) return "Remove the flag before opening this square.";

  state.revealed.push(action.cell);
  if (state.mines.includes(action.cell)) {
    state.lives[side] -= 1;
    if (state.lives[side] === 0) {
      state.phase = "finished";
      state.winner = other(side);
      state.notice = `Red card! Player ${side === "p1" ? "1" : "2"} is out of lives.`;
    } else {
      state.notice = `Red card! Player ${side === "p1" ? "1" : "2"} loses a life.`;
    }
  } else {
    state.scores[side] += 1;
    state.notice = `Safe pass! ${adjacentMines(state, action.cell)} mine${adjacentMines(state, action.cell) === 1 ? "" : "s"} nearby.`;
    finishIfClear(state);
  }
  if (state.phase === "playing") state.turn = other(side);
  state.revision += 1;
  return null;
}

export function footballMinesweeperView(
  state: FootballMinesweeperState,
  you: MinesweeperSide,
): FootballMinesweeperView {
  const revealAllMines = state.phase === "finished";
  return {
    gameId: state.gameId,
    revision: state.revision,
    phase: state.phase,
    you,
    turn: state.turn,
    opponentJoined: Boolean(state.p2Token),
    scores: state.scores,
    lives: state.lives,
    winner: state.winner,
    rematch: state.rematch,
    notice: state.notice,
    cells: Array.from({ length: MINESWEEPER_CELLS }, (_, cell) => {
      const isMine = state.mines.includes(cell);
      const isRevealed = state.revealed.includes(cell);
      const showMine = isMine && (isRevealed || revealAllMines);
      return {
        state: showMine ? "mine" : isRevealed ? "safe" : "hidden",
        adjacent: isRevealed && !isMine ? adjacentMines(state, cell) : null,
        flagged: state.flags.includes(cell),
      };
    }),
  };
}
