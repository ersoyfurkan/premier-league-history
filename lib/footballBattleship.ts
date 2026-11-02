import {
  battleshipAnswer, battleshipClues, newBattleshipBoard, type BattleshipBoard, type BattleshipClue,
} from "@/data/footballBattleship";
import { COMPETITION_LABELS, type Competition } from "@/lib/competitions";

export const BATTLESHIP_SIZE = 8;
export const BATTLESHIP_SHIP_SIZES = [2, 3, 4] as const;
export type BattleshipSide = "p1" | "p2";
export type ShipPlacement = { size: 2 | 3 | 4; start: number; vertical: boolean };
type Phase = "waiting" | "placing" | "playing" | "finished";
type Shot = { cell: number; side: BattleshipSide; hit: boolean; sunk: 2 | 3 | 4 | null; player: string };
export type BattleshipView = {
  gameId: string;
  revision: number;
  comp: Competition;
  phase: Phase;
  you: BattleshipSide;
  turn: BattleshipSide;
  winner: BattleshipSide | null;
  opponentJoined: boolean;
  youReady: boolean;
  opponentReady: boolean;
  rows: BattleshipClue[];
  columns: BattleshipClue[];
  ownRows: BattleshipClue[];
  ownColumns: BattleshipClue[];
  ownShips: ShipPlacement[];
  opponentShips: ShipPlacement[] | null;
  shots: Shot[];
  notice: string | null;
  rematch: Record<BattleshipSide, boolean>;
};
export type BattleshipState = {
  gameId: string;
  revision: number;
  comp: Competition;
  phase: Phase;
  turn: BattleshipSide;
  winner: BattleshipSide | null;
  p1Token: string;
  p2Token: string | null;
  board: BattleshipBoard;
  opponentBoard?: BattleshipBoard;
  ships: Record<BattleshipSide, ShipPlacement[] | null>;
  shots: Shot[];
  notice: string | null;
  rematch: Record<BattleshipSide, boolean>;
};
export type BattleshipAction =
  | { action: "place"; ships: ShipPlacement[] }
  | { action: "attack"; cell: number; answer: string }
  | { action: "rematch" };

const other = (side: BattleshipSide): BattleshipSide => side === "p1" ? "p2" : "p1";
export const isBattleshipComp = (value: unknown): value is Competition =>
  typeof value === "string" && Object.hasOwn(COMPETITION_LABELS, value);

export function battleshipShipCells(ship: ShipPlacement): number[] {
  if (!ship || !BATTLESHIP_SHIP_SIZES.includes(ship.size) || !Number.isInteger(ship.start) ||
    ship.start < 0 || ship.start >= 64 || typeof ship.vertical !== "boolean") return [];
  const row = Math.floor(ship.start / 8);
  const column = ship.start % 8;
  if ((ship.vertical ? row : column) + ship.size > 8) return [];
  return Array.from({ length: ship.size }, (_, offset) => ship.start + offset * (ship.vertical ? 8 : 1));
}

export function validBattleshipPlacement(ships: unknown): ships is ShipPlacement[] {
  if (!Array.isArray(ships) || ships.length !== 3) return false;
  const occupied = new Set<number>();
  const sizes = new Set<number>();
  for (const raw of ships) {
    if (!raw || typeof raw !== "object") return false;
    const ship = raw as ShipPlacement;
    const cells = battleshipShipCells(ship);
    if (!cells.length || sizes.has(ship.size) || cells.some((cell) => occupied.has(cell))) return false;
    sizes.add(ship.size);
    cells.forEach((cell) => occupied.add(cell));
  }
  return occupied.size === 9;
}

export function newBattleshipGame(comp: Competition, token: string): BattleshipState {
  const board = newBattleshipBoard(comp);
  return {
    gameId: crypto.randomUUID(), revision: 0, comp, phase: "waiting", turn: "p1", winner: null,
    p1Token: token, p2Token: null, board, opponentBoard: newBattleshipBoard(comp, board.variant),
    ships: { p1: null, p2: null }, shots: [], notice: null, rematch: { p1: false, p2: false },
  };
}

export function joinBattleshipGame(state: BattleshipState, token: string): string | null {
  if (state.p2Token || state.phase !== "waiting") return "This room already has two players.";
  state.p2Token = token;
  state.phase = "placing";
  state.revision += 1;
  return null;
}

export function battleshipSideOf(state: BattleshipState, token: string): BattleshipSide | null {
  if (token && token === state.p1Token) return "p1";
  if (token && token === state.p2Token) return "p2";
  return null;
}

export function battleshipAttackBoard(state: BattleshipState, side: BattleshipSide): BattleshipBoard {
  // Saved rooms created before separate boards retain their shared clues until rematch.
  return side === "p2" ? state.opponentBoard ?? state.board : state.board;
}

export function battleshipView(state: BattleshipState, you: BattleshipSide): BattleshipView {
  const opponent = other(you);
  const own = battleshipClues(state.comp, battleshipAttackBoard(state, opponent));
  return {
    gameId: state.gameId, revision: state.revision, comp: state.comp, phase: state.phase,
    you, turn: state.turn, winner: state.winner, opponentJoined: !!state.p2Token,
    youReady: state.ships[you] !== null, opponentReady: state.ships[opponent] !== null,
    ...battleshipClues(state.comp, battleshipAttackBoard(state, you)),
    ownRows: own.rows, ownColumns: own.columns,
    ownShips: state.ships[you] ?? [],
    opponentShips: state.phase === "finished" ? state.ships[opponent] : null,
    shots: state.shots, notice: state.notice, rematch: state.rematch,
  };
}

export function applyBattleshipAction(
  state: BattleshipState,
  side: BattleshipSide,
  action: BattleshipAction,
  expected: { gameId: string; revision: number },
): string | null {
  if (state.gameId !== expected.gameId || state.revision !== expected.revision) {
    return "The game changed. Refresh the board before trying again.";
  }
  if (side === "p2" && !state.p2Token) return "Wait for an opponent to join.";
  if (action.action === "place") {
    if (state.phase !== "waiting" && state.phase !== "placing") return "Fleet placement is closed.";
    if (state.ships[side]) return "Your fleet is already committed.";
    if (!validBattleshipPlacement(action.ships)) {
      return "Place one straight ship of each size (2, 3 and 4), on the board without overlaps.";
    }
    state.ships[side] = action.ships.map(({ size, start, vertical }) => ({ size, start, vertical }));
    if (state.p2Token && state.ships.p1 && state.ships.p2) {
      state.phase = "playing";
      state.turn = crypto.getRandomValues(new Uint8Array(1))[0] % 2 ? "p1" : "p2";
      state.notice = "Both fleets are ready. Battle begins!";
    }
  } else if (action.action === "rematch") {
    if (state.phase !== "finished") return "Finish this battle before requesting a rematch.";
    if (state.rematch[side]) return "Your rematch vote is already recorded.";
    state.rematch[side] = true;
    if (state.rematch.p1 && state.rematch.p2) {
      state.gameId = crypto.randomUUID();
      state.board = newBattleshipBoard(state.comp);
      state.opponentBoard = newBattleshipBoard(state.comp, state.board.variant);
      state.phase = "placing";
      state.turn = "p1";
      state.winner = null;
      state.ships = { p1: null, p2: null };
      state.shots = [];
      state.notice = null;
      state.rematch = { p1: false, p2: false };
    }
  } else {
    if (state.phase !== "playing") return "The battle is not in progress.";
    if (state.turn !== side) return "It is your opponent's turn.";
    if (!Number.isInteger(action.cell) || action.cell < 0 || action.cell >= 64) return "Choose a square on the board.";
    if (state.shots.some((shot) => shot.side === side && shot.cell === action.cell)) return "You have already fired at this square.";
    if (typeof action.answer !== "string" || !action.answer.trim() || action.answer.length > 100) return "Enter a footballer name.";
    const player = battleshipAnswer(state.comp, battleshipAttackBoard(state, side), action.cell, action.answer);
    if (!player) {
      // Wrong answers never inspect the hidden fleet or reserve a target square.
      state.notice = "That player does not match both clues. The turn passes.";
      state.turn = other(side);
    } else {
      const fleet = state.ships[other(side)]!;
      const ship = fleet.find((ship) => battleshipShipCells(ship).includes(action.cell));
      const previousHits = new Set(state.shots.filter((shot) => shot.side === side && shot.hit).map((shot) => shot.cell));
      previousHits.add(action.cell);
      const sunk = ship && battleshipShipCells(ship).every((cell) => previousHits.has(cell)) ? ship.size : null;
      state.shots.push({ cell: action.cell, side, hit: !!ship, sunk, player });
      state.notice = sunk ? `Hit! Size ${sunk} ship sunk.` : ship ? "Hit! Fire again." : "Miss. The turn passes.";
      if (!ship) state.turn = other(side);
      if (ship && fleet.every((ship) => battleshipShipCells(ship).every((cell) => previousHits.has(cell)))) {
        state.phase = "finished";
        state.winner = side;
        state.notice = "All nine opponent squares hit. Battle won!";
      }
    }
  }
  state.revision += 1;
  return null;
}
