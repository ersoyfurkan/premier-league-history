import prepared from "@/data/quizFootball.generated.json";
import { isTournamentComp, type Competition } from "@/lib/competitions";
import { natsAllowed } from "@/data/nations";
import { normalizeFootballPlayerName } from "@/data/footballNames";
import type { FootballClue, FootballTicTacToeCell, FootballTicTacToePuzzle } from "@/scripts/builders/footballTicTacToe";

export type { FootballClue, FootballTicTacToeCell, FootballTicTacToePuzzle } from "@/scripts/builders/footballTicTacToe";
export { normalizeFootballPlayerName } from "@/data/footballNames";

type Fact = { name: string; nat: string[]; clubs: string[]; tags: string[] };
type PreparedClue = { clue: FootballClue; members: number[] };
type PreparedCompetition = { facts: number[]; pool: PreparedClue[]; nations: PreparedClue[] };
const competitions: Record<Competition, PreparedCompetition> = prepared.competitions;
export const FOOTBALL_TIC_TAC_TOE_VARIANTS = prepared.variants as Record<Competition, FootballTicTacToePuzzle[]>;
export const FOOTBALL_TIC_TAC_TOE = Object.fromEntries(
  Object.entries(FOOTBALL_TIC_TAC_TOE_VARIANTS).map(([comp, variants]) => [comp, variants[0]]),
) as Record<Competition, FootballTicTacToePuzzle>;

const facts = new Map<Competition, Fact[]>();
export function footballFacts(comp: Competition): Fact[] {
  let result = facts.get(comp);
  if (!result) {
    result = competitions[comp].facts.map((index) => prepared.records[index]);
    facts.set(comp, result);
  }
  return result;
}

let natsByName: Map<string, string[]> | undefined;
export function natsOfPlayer(name: string): string[] {
  natsByName ??= new Map(footballFacts("general").map((fact) => [normalizeFootballPlayerName(fact.name), fact.nat]));
  return natsByName.get(normalizeFootballPlayerName(name)) ?? [];
}

export const playerInComp = (comp: Competition, name: string) =>
  !isTournamentComp(comp) || natsAllowed(comp, natsOfPlayer(name));
export const footballTicTacToePlayerNames = (comp: Competition) => footballFacts(comp).map((fact) => fact.name);
export const footballCareers = () => prepared.careers;

function pick<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let index = 0; index < count && index < copy.length; index += 1) {
    const swap = index + Math.floor(Math.random() * (copy.length - index));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy.slice(0, count);
}

function overlap(first: number[], second: number[], minimum: number) {
  let a = 0;
  let b = 0;
  let count = 0;
  while (a < first.length && b < second.length) {
    if (first[a] === second[b]) {
      if (++count >= minimum) return true;
      a += 1;
      b += 1;
    } else if (first[a] < second[b]) a += 1;
    else b += 1;
  }
  return false;
}

function build(comp: Competition, rows: PreparedClue[], columns: PreparedClue[]): FootballTicTacToePuzzle {
  const bank = footballFacts(comp);
  return {
    rows: rows.map(({ clue }) => clue) as FootballTicTacToePuzzle["rows"],
    columns: columns.map(({ clue }) => clue) as FootballTicTacToePuzzle["columns"],
    answers: rows.map((row) => columns.map((column) => {
      const members = new Set(column.members);
      return row.members.filter((index) => members.has(index)).map((index) => bank[index].name);
    })),
  };
}

export function randomFootballTicTacToePuzzle(comp: Competition): FootballTicTacToePuzzle {
  const { pool, nations } = competitions[comp];
  const withAward = Math.random() < 0.65;
  const awards = pool.filter(({ clue }) => clue.awardIds?.length);
  const preferSingleAward = Math.random() < 0.5;
  const preferredAwards = awards.filter(({ clue }) => (clue.awardIds?.length === 1) === preferSingleAward);
  for (let attempt = 0; attempt < 1500; attempt += 1) {
    const minimum = attempt < 1000 ? 3 : 2;
    const seed = withAward && attempt < 1400
      ? pick(attempt < 700 && preferredAwards.length ? preferredAwards : awards, 1)[0]
      : undefined;
    const rowPool = isTournamentComp(comp) ? nations : pool;
    const eligible = seed ? rowPool.filter((row) =>
      row !== seed && !row.clue.awardIds?.length && overlap(row.members, seed.members, minimum),
    ) : rowPool;
    if (eligible.length < 3) continue;
    const rows = pick(eligible, 3);
    const columns = pool.filter((column) =>
      !rows.includes(column) && rows.every((row) => overlap(row.members, column.members, minimum)),
    );
    if (columns.length >= 3) {
      return build(comp, rows, seed ? [seed, ...pick(columns.filter((column) => column !== seed), 2)] : pick(columns, 3));
    }
  }
  const variants = FOOTBALL_TIC_TAC_TOE_VARIANTS[comp];
  const puzzle = variants[Math.floor(Math.random() * variants.length)];
  const rows = pick([0, 1, 2], 3);
  const columns = pick([0, 1, 2], 3);
  return {
    rows: rows.map((index) => puzzle.rows[index]) as FootballTicTacToePuzzle["rows"],
    columns: columns.map((index) => puzzle.columns[index]) as FootballTicTacToePuzzle["columns"],
    answers: rows.map((row) => columns.map((column) => puzzle.answers[row][column])),
  };
}

export function isFootballTicTacToeAnswer(
  comp: Competition, cell: number, guess: string,
  puzzle: FootballTicTacToePuzzle = FOOTBALL_TIC_TAC_TOE[comp],
) {
  if (!Number.isInteger(cell) || cell < 0 || cell > 8) return false;
  const normalized = normalizeFootballPlayerName(guess);
  return puzzle.answers[Math.floor(cell / 3)][cell % 3].some((answer) => normalizeFootballPlayerName(answer) === normalized);
}

export function footballTicTacToeWinner(board: (FootballTicTacToeCell | null)[]) {
  for (const [a, b, c] of [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]) {
    if (board[a] && board[a].side === board[b]?.side && board[a].side === board[c]?.side) return board[a].side;
  }
  return null;
}
