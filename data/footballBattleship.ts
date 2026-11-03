import prepared from "@/data/footballBattleship.generated.json";
import { awardPlayerKey } from "@/data/footballNames";
import type { Competition } from "@/lib/competitions";

export type BattleshipClue = {
  id: string;
  label: string;
  kind?: "club" | "nation" | "award" | "trophy" | "manager" | "teammate";
  identity?: string;
  badge?: string;
  badgeAlt?: string;
  badgeFallback?: string;
  awardIds?: string[];
  reference?: string;
  source?: string;
};
export type BattleshipBoard = { variant: number; rows: number[]; columns: number[] };
type PreparedBoard = { rows: BattleshipClue[]; columns: BattleshipClue[]; answers: number[][] };
export const BATTLESHIP_BOARDS: Record<Competition, PreparedBoard[]> = prepared.competitions as Record<Competition, PreparedBoard[]>;
export const BATTLESHIP_LEGACY_VARIANTS = prepared.legacyVariantCount;
export const BATTLESHIP_AWARDS_CHECKED_AT = prepared.awardsCheckedAt;
export const battleshipPlayerKey = (name: string) => awardPlayerKey(name.replace(/ı/g, "i"));
const players = new Map(prepared.names.map((name, id) => [battleshipPlayerKey(name), id]));
const searchIndex = prepared.names.map((name) => ({ name, key: battleshipPlayerKey(name) }));

export function searchBattleshipPlayers(query: string): string[] {
  const key = battleshipPlayerKey(query.trim());
  if (key.length < 2) return [];
  return searchIndex.filter((player) => player.key.includes(key))
    .sort((a, b) => Number(b.key.startsWith(key)) - Number(a.key.startsWith(key)) || a.name.localeCompare(b.name))
    .slice(0, 12).map((player) => player.name);
}

function shuffledIndices() {
  const indices = Array.from({ length: 8 }, (_, index) => index);
  for (let index = 7; index > 0; index -= 1) {
    const swap = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
    [indices[index], indices[swap]] = [indices[swap], indices[index]];
  }
  return indices;
}

export function newBattleshipBoard(comp: Competition, excludeVariant?: number): BattleshipBoard {
  const variants = BATTLESHIP_BOARDS[comp].map((_, index) => index)
    .filter((index) => index >= BATTLESHIP_LEGACY_VARIANTS && index !== excludeVariant);
  return {
    variant: variants[crypto.getRandomValues(new Uint32Array(1))[0] % variants.length],
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
