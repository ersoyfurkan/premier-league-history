import history from "@/data/tournamentHistory.generated.json";

type Table = { headers: string[]; rows: string[][] };
type Entry = { name: string; aliases: string[] };
export type TournamentCategory = { id: string; noun: string; plural: string; entries: Entry[]; short: string };

const tables = history.tournaments as unknown as Record<"worldcup" | "euros" | "copa", Record<string, Table | null>>;

const clean = (value: string) =>
  value
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

const column = (table: Table | null | undefined, pattern: RegExp) => table?.headers.findIndex((h) => pattern.test(h)) ?? -1;

function values(table: Table | null | undefined, pattern: RegExp): string[] {
  const idx = column(table, pattern);
  if (!table || idx < 0) return [];
  return table.rows.flatMap((row) => (row[idx] ?? "").split(",").map(clean)).filter((v) => v.length > 1 && !/^(five|four|three|two) players$/i.test(v));
}

const unique = (names: string[]) => [...new Set(names)];

// Players get their surname as an alias, so "Müller" or "Messi" is enough.
const person = (name: string): Entry => {
  const parts = name.split(" ");
  return { name, aliases: parts.length > 1 ? [parts[parts.length - 1]] : [] };
};
const nation = (name: string): Entry => ({ name, aliases: [] });

const category = (id: string, short: string, noun: string, plural: string, entries: Entry[]): TournamentCategory => ({ id, short, noun, plural, entries });

// Trivia derived from the Wikipedia tournament history, so it refreshes with the data.
export function tournamentTriviaCategories(): TournamentCategory[] {
  const out: TournamentCategory[] = [];
  const t = tables;

  const copaWinners = unique(values(t.copa.editions, /^champions/i));
  const wcLost = unique(values(t.worldcup.finals, /^runners/i));
  const euroLost = unique(values(t.euros.finals, /^runners/i));
  const copaLost = unique(values(t.copa.finals, /^runners/i));
  out.push(
    category("s-t-copawin", "Copa winners", "nation that has won the Copa América", "nations that have won the Copa América", copaWinners.map(nation)),
    category("s-t-wclost", "WC final losers", "nation that has lost a World Cup final", "nations that have lost a World Cup final", wcLost.map(nation)),
    category("s-t-eurolost", "Euro final losers", "nation that has lost a European Championship final", "nations that have lost a European Championship final", euroLost.map(nation)),
    category("s-t-copalost", "Copa final losers", "nation that has lost a Copa América final", "nations that have lost a Copa América final", copaLost.map(nation)),
  );

  const eurohost = unique(values(t.euros.editions, /^host/i).filter((h) => h !== "Europe"));
  const copahost = unique(values(t.copa.editions, /^host/i));
  out.push(
    category("s-t-eurohost", "Euro hosts", "country that has hosted the European Championship", "countries that have hosted the European Championship", eurohost.map(nation)),
    category("s-t-copahost", "Copa hosts", "country that has hosted the Copa América", "countries that have hosted the Copa América", copahost.map(nation)),
  );

  const coaches = (key: "worldcup" | "euros" | "copa", id: string, short: string, noun: string, plural: string) =>
    category(id, short, noun, plural, unique(values(t[key].editions, /coach/i)).map(person));
  out.push(
    coaches("worldcup", "s-t-wccoach", "WC winning coaches", "manager who has won the World Cup", "managers who have won the World Cup"),
    coaches("euros", "s-t-eurocoach", "Euro winning coaches", "manager who has won the European Championship", "managers who have won the European Championship"),
    coaches("copa", "s-t-copacoach", "Copa winning coaches", "manager who has won the Copa América", "managers who have won the Copa América"),
  );

  const scorers = (key: "worldcup" | "euros" | "copa", id: string, short: string, noun: string, plural: string, top: number) => {
    const table = t[key].scorers;
    const idx = column(table, /^player/i);
    const names = table && idx >= 0 ? table.rows.slice(0, top).map((row) => clean(row[idx] ?? "")) : [];
    return category(id, short, noun, plural, unique(names.filter(Boolean)).map(person));
  };
  out.push(
    scorers("worldcup", "s-t-wcall", "WC all-time scorers", "player among the World Cup's all-time top scorers", "players among the World Cup's all-time top scorers", 25),
    scorers("euros", "s-t-euroall", "Euro all-time scorers", "player among the European Championship's all-time top scorers", "players among the European Championship's all-time top scorers", 20),
    scorers("copa", "s-t-copaall", "Copa all-time scorers", "player among the Copa América's all-time top scorers", "players among the Copa América's all-time top scorers", 20),
  );

  const boots = (key: "euros" | "copa", id: string, short: string, noun: string, plural: string) =>
    category(id, short, noun, plural, unique(values(t[key].editions, /(top scorer|golden boot)/i)).map(person));
  out.push(
    boots("euros", "s-t-euroboot", "Euro top scorers", "player who finished as top scorer at a European Championship", "players who finished as top scorer at a European Championship"),
    boots("copa", "s-t-copaboot", "Copa top scorers", "player who finished as top scorer at a Copa América", "players who finished as top scorer at a Copa América"),
  );

  return out.filter((item) => item.entries.length >= 8);
}
