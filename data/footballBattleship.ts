import prepared from "@/data/footballBattleship.generated.json";
import { awardPlayerKey } from "@/data/footballNames";
import type { Competition } from "@/lib/competitions";

export type BattleshipClue = { id: string; label: string };
export type BattleshipBoard = { variant: number; rows: number[]; columns: number[] };
type PreparedBoard = { rows: BattleshipClue[]; columns: BattleshipClue[]; answers: number[][] };
export const BATTLESHIP_BOARDS: Record<Competition, PreparedBoard[]> = prepared.competitions;
export const battleshipPlayerKey = (name: string) => awardPlayerKey(name.replace(/ı/g, "i"));
const players = new Map(prepared.names.map((name, id) => [battleshipPlayerKey(name), id]));

function shuffledIndices() {
  const indices = Array.from({ length: 8 }, (_, index) => index);
  for (let index = 7; index > 0; index -= 1) {
    const swap = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
    [indices[index], indices[swap]] = [indices[swap], indices[index]];
  }
  return indices;
}

export function newBattleshipBoard(comp: Competition): BattleshipBoard {
  return {
    variant: crypto.getRandomValues(new Uint32Array(1))[0] % BATTLESHIP_BOARDS[comp].length,
    rows: shuffledIndices(),
    columns: shuffledIndices(),
  };
}

export function battleshipClues(comp: Competition, board: BattleshipBoard) {
  const prepared = BATTLESHIP_BOARDS[comp][board.variant];
  return {
    rows: board.rows.map((index) => prepared.rows[index]),
    columns: board.columns.map((index) => prepared.columns[index]),
  };
}

export function battleshipAnswer(comp: Competition, board: BattleshipBoard, cell: number, guess: string): string | null {
  const player = players.get(battleshipPlayerKey(guess));
  if (player === undefined) return null;
  const row = board.rows[Math.floor(cell / 8)];
  const column = board.columns[cell % 8];
  return BATTLESHIP_BOARDS[comp][board.variant].answers[row * 8 + column].includes(player)
    ? prepared.names[player] : null;
}
