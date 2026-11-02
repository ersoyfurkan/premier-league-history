import history from "@/data/tournamentHistory.generated.json";
import type { TournamentComp } from "@/lib/competitions";

type Table = { headers: string[]; rows: string[][] } | null | undefined;
type Tables = Record<string, Table>;
type Entry = { name: string; aliases: string[] };
export type TournamentCategory = { id: string; noun: string; plural: string; entries: Entry[]; short: string };

const TITLE: Record<TournamentComp, { long: string; short: string; code: string }> = {
  worldcup: { long: "the World Cup", short: "World Cup", code: "wc" },
  euros: { long: "the European Championship", short: "Euro", code: "euro" },
  copa: { long: "the Copa América", short: "Copa", code: "copa" },
};

const clean = (value = "") => value.replace(/\[[^\]]*\]/g, "").replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
const col = (table: Table, pattern: RegExp) => table?.headers.findIndex((h) => pattern.test(h)) ?? -1;
const unique = (names: string[]) => [...new Set(names.filter((name) => name.length > 1))];

const NATION_ALIASES: Record<string, string[]> = {
  "United States": ["USA", "US", "America", "United States of America"],
  "South Korea": ["Korea", "Korea Republic"],
  "Ivory Coast": ["Cote d'Ivoire", "Côte d'Ivoire"],
  Netherlands: ["Holland"],
  "Czech Republic": ["Czechia"],
  Turkey: ["Türkiye", "Turkiye"],
  "West Germany": ["Germany"],
  Germany: ["West Germany"],
  "Soviet Union": ["USSR", "Russia"],
  Russia: ["USSR", "Soviet Union"],
  "Republic of Ireland": ["Ireland"],
  "China PR": ["China"],
  "IR Iran": ["Iran"],
  "North Macedonia": ["Macedonia"],
  "Bosnia and Herzegovina": ["Bosnia"],
  "DR Congo": ["Congo", "Zaire"],
};
const nation = (name: string): Entry => ({ name, aliases: NATION_ALIASES[name] ?? [] });
// Players are accepted by surname too.
const person = (name: string): Entry => {
  const parts = name.split(" ");
  return { name, aliases: parts.length > 1 ? [parts[parts.length - 1]] : [] };
};

const cells = (table: Table, pattern: RegExp) => {
  const idx = col(table, pattern);
  if (!table || idx < 0) return [] as string[];
  return table.rows.flatMap((row) => (row[idx] ?? "").split(",").map(clean));
};

const make = (id: string, short: string, noun: string, plural: string, entries: Entry[]): TournamentCategory => ({ id, short, noun, plural, entries });

function forTournament(comp: TournamentComp): TournamentCategory[] {
  const t = (history.tournaments as unknown as Record<string, Tables>)[comp];
  const { long, short, code } = TITLE[comp];
  const id = (suffix: string) => `s-t-${code}${suffix}`;
  const out: TournamentCategory[] = [];

  const winners = unique(cells(t.editions, /^champions/i));
  const losers = unique(cells(t.finals, /^runners/i));
  const finalists = unique([...winners, ...losers]);
  out.push(
    make(id("win"), `${short} winners`, `nation that has won ${long}`, `nations that have won ${long}`, winners.map(nation)),
    make(id("lost"), `${short} final losers`, `nation that has lost a final at ${long}`, `nations that have lost a final at ${long}`, losers.map(nation)),
    make(id("fin"), `${short} finalists`, `nation that has reached the final of ${long}`, `nations that have reached the final of ${long}`, finalists.map(nation)),
    make(id("host"), `${short} hosts`, `country that has hosted ${long}`, `countries that have hosted ${long}`, unique(cells(t.editions, /^host/i).filter((h) => h !== "Europe")).map(nation)),
    make(id("coach"), `${short} winning coaches`, `manager who has won ${long}`, `managers who have won ${long}`, unique(cells(t.editions, /coach/i)).map(person)),
  );

  const standings = t.standings;
  const sTeam = col(standings, /^team/i);
  const sPart = col(standings, /^part/i);
  const teams = unique((standings?.rows ?? []).map((row) => clean(row[sTeam])));
  out.push(
    make(id("teams"), `${short} nations`, `nation that has played at ${long}`, `nations that have played at ${long}`, teams.map(nation)),
    make(id("top16"), `${short} all-time top 16`, `nation in the all-time top 16 of ${long}`, `nations in the all-time top 16 of ${long}`, teams.slice(0, 16).map(nation)),
  );
  if (sPart >= 0) {
    const threshold = comp === "worldcup" ? 10 : comp === "euros" ? 7 : 25;
    const regulars = unique((standings?.rows ?? []).filter((row) => Number(clean(row[sPart])) >= threshold).map((row) => clean(row[sTeam])));
    out.push(make(id("reg"), `${short} regulars`, `nation that has appeared in at least ${threshold} editions of ${long}`, `nations that have appeared in at least ${threshold} editions of ${long}`, regulars.map(nation)));
  }

  const medals = t.medals;
  const mTeam = col(medals, /^(team|nation)/i);
  if (medals && mTeam >= 0) {
    const names = unique(medals.rows.map((row) => clean(row[mTeam])).filter((n) => !/^totals/i.test(n)));
    out.push(make(id("medal"), `${short} medallists`, `nation that has won a medal at ${long}`, `nations that have won a medal at ${long}`, names.map(nation)));
  }

  const scorers = t.scorers;
  const pIdx = col(scorers, /^player/i);
  const players = (n: number) => unique((scorers?.rows ?? []).slice(0, n).map((row) => clean(row[pIdx] ?? "")));
  out.push(
    make(id("all"), `${short} all-time scorers`, `player among the all-time top scorers at ${long}`, `players among the all-time top scorers at ${long}`, players(comp === "worldcup" ? 25 : 20).map(person)),
    make(id("top10"), `${short} top-10 scorers`, `player in the all-time top 10 scorers at ${long}`, `players in the all-time top 10 scorers at ${long}`, players(10).map(person)),
  );

  const boots = unique(cells(t.editions, /(most goals|top scorer|golden boot)/i));
  out.push(make(id("boot"), `${short} top scorers`, `player who finished as top scorer at ${long}`, `players who finished as top scorer at ${long}`, boots.map(person)));

  if (comp === "worldcup") {
    out.push(make(id("assist"), `${short} assist leaders`, `player who led the assists at ${long}`, `players who led the assists at ${long}`, unique(cells(t.editions, /most assists/i)).map(person)));
  }
  if (comp === "copa") {
    const aIdx = col(t.assists, /^player/i);
    const assisters = unique((t.assists?.rows ?? []).map((row) => clean(row[aIdx] ?? "")));
    out.push(make(id("assistall"), `${short} assist leaders`, `player among the all-time assist leaders at ${long}`, `players among the all-time assist leaders at ${long}`, assisters.map(person)));
    out.push(make(id("best"), `${short} best players`, `player named best player at ${long}`, `players named best player at ${long}`, unique(cells(t.editions, /best player/i)).map(person)));
  }

  return out.filter((item) => item.entries.length >= 8);
}

// Trivia derived from the Wikipedia tournament history, so it refreshes with the data.
export const TOURNAMENT_TRIVIA: Record<TournamentComp, TournamentCategory[]> = {
  worldcup: forTournament("worldcup"),
  euros: forTournament("euros"),
  copa: forTournament("copa"),
};

export const tournamentTriviaCategories = (): TournamentCategory[] => [
  ...TOURNAMENT_TRIVIA.worldcup,
  ...TOURNAMENT_TRIVIA.euros,
  ...TOURNAMENT_TRIVIA.copa,
];

// Guaranteed-large category used as the fallback board tile: every nation that has played at the tournament.
export const tournamentTeamsCategory = (comp: TournamentComp): TournamentCategory =>
  TOURNAMENT_TRIVIA[comp].find((item) => item.id === `s-t-${TITLE[comp].code}teams`) ??
  make(`s-t-${TITLE[comp].code}teams`, `${TITLE[comp].short} nations`, `nation that has played at ${TITLE[comp].long}`, `nations that have played at ${TITLE[comp].long}`, []);
