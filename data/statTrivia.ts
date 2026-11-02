import { STAT_SEASONS, type SeasonMetric } from "@/data/statTriviaSeasons";
import { AUTHORED_STAT_CATEGORIES, STAT_RECORDS } from "@/data/statTriviaRecords";
import { TOURNAMENT_COMPETITIONS, type Competition } from "@/lib/competitions";
import type { RondoClue } from "@/data/rondo";
import type { TriviaEntry } from "@/data/triviaPath";

export type StatTriviaCategory = {
  id: string;
  noun: string;
  plural: string;
  short: string;
  entries: TriviaEntry[];
  difficulty: number;
  sources: string[];
};
type Metric = SeasonMetric;
const METRICS: Record<Metric, string> = { goals: "goals", assists: "assists", redCards: "sendings-off (straight reds or second yellows)" };
const ALIASES: Record<string, string[]> = {
  "Ronaldo Nazario": ["Ronaldo"],
  "Raul": ["Raul Gonzalez"],
  "Cesar Rodriguez": ["Cesar"],
  "Jeff Chabot": ["Julian Chabot"],
  "Alex Baena": ["Alejandro Baena"],
  "Chimy Avila": ["Ezequiel Avila"],
  "Neymar": ["Neymar Jr"],
  "Pele": ["Edson Arantes do Nascimento"],
  "Ricardo": ["Ricardo Pereira", "Ricardo Alexandre Martins Soares Pereira"],
  "Alejandro Grimaldo": ["Alex Grimaldo"],
};
const entry = (name: string, aliases: string[] = []): TriviaEntry => ({ name, aliases: [...(ALIASES[name] ?? []), ...aliases] });
const emptyBank = <T,>(): Record<Competition, T[]> => ({
  general: [], pl: [], ucl: [], laliga: [], seriea: [], bundesliga: [], ligue1: [], superlig: [], worldcup: [], euros: [], copa: [],
});
export const STAT_TRIVIA_CATEGORIES = emptyBank<StatTriviaCategory>();
export const STAT_RONDO_CLUES = emptyBank<RondoClue>();

function addCategory(comp: Competition, id: string, condition: string, entries: TriviaEntry[], difficulty: number, sources: string[]) {
  if (!entries.length) return;
  const category = {
    id: `s-stat-${id}`,
    noun: `player who ${condition}`,
    plural: `players who ${condition}`,
    short: `Players who ${condition}`,
    entries,
    difficulty,
    sources,
  };
  STAT_TRIVIA_CATEGORIES[comp].push(category);
  if (comp !== "general") STAT_TRIVIA_CATEGORIES.general.push(category);
}

function addRondo(comp: Competition, condition: string, entries: TriviaEntry[]) {
  const letters = new Set(entries.map(({ name }) => name[0].toUpperCase()));
  for (const letter of letters) {
    const answers = entries.filter(({ name }) => name[0].toUpperCase() === letter).flatMap(({ name, aliases }) => [name, ...aliases]);
    const clue: RondoClue = { letter, clue: `Player who ${condition}`, answers, difficulty: "hard" };
    STAT_RONDO_CLUES[comp].push(clue);
    if (comp !== "general") STAT_RONDO_CLUES.general.push(clue);
  }
}

for (const set of STAT_RECORDS) {
  for (const minimum of set.thresholds) {
    if (minimum < set.minimum) throw new Error(`Threshold below verified coverage: ${set.id}`);
    const entries = set.rows.filter((row) => row.value >= minimum).map((row) => entry(row.name, row.aliases));
    addCategory(set.comp, `${set.id}-${minimum}`, `recorded at least ${minimum} ${set.metric} in ${set.scope}`, entries, 3, [set.source]);
  }
  for (const value of new Set(set.rows.map((row) => row.value))) {
    addRondo(set.comp, `recorded ${value} ${set.metric} in ${set.scope}`, set.rows.filter((row) => row.value === value).map((row) => entry(row.name, row.aliases)));
  }
}

for (const edition of STAT_SEASONS) {
  const comp = edition.comp;
  const id = edition.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  for (const metric of Object.keys(METRICS) as Metric[]) {
    const data = edition.stats[metric];
    if (!data) continue;
    const thresholds = new Set([1, 2, 3, 5, 10, 15, 20, ...[2, 5, 9].map((index) => data.rows[index]?.value).filter((value) => value !== undefined)]);
    for (const minimum of thresholds) {
      if (minimum < data.minimum) continue;
      const entries = data.rows.filter((row) => row.value >= minimum).map((row) => entry(row.name));
      addCategory(comp, `${id}-${metric}-${minimum}`, `recorded at least ${minimum} ${METRICS[metric]} in ${edition.label}${data.source.includes("statbunker") ? " (Statbunker)" : ""}`, entries, metric === "redCards" ? 4 : 3, [data.source]);
    }
    for (const value of new Set(data.rows.slice(0, 10).map((row) => row.value))) {
      const entries = data.rows.filter((row) => row.value === value).map((row) => entry(row.name));
      addRondo(comp, `recorded ${value} ${METRICS[metric]} in ${edition.label}${data.source.includes("statbunker") ? " (Statbunker)" : ""}`, entries);
    }
  }

  const international = TOURNAMENT_COMPETITIONS.some((key) => key === comp);
  const goalStats = edition.stats.goals;
  const assistStats = edition.stats.assists;
  if (goalStats && assistStats) {
    const assists = new Map(assistStats.rows.map((row) => [row.name, row]));
    const combinations = international ? [[3, 3], [4, 3]] : [[15, 10], [20, 10]];
    for (const [goals, goalAssists] of combinations) {
      if (goals < goalStats.minimum || goalAssists < assistStats.minimum) continue;
      const entries = goalStats.rows.filter((row) => row.value >= goals && (assists.get(row.name)?.value ?? 0) >= goalAssists).map((row) => entry(row.name));
      addCategory(comp, `${id}-goals-${goals}-assists-${goalAssists}`, `scored at least ${goals} goals AND provided at least ${goalAssists} assists in ${edition.label}`, entries, 4, [goalStats.source, assistStats.source]);
    }
  }

  const championName = (name: string) => name.toLowerCase().replace(/paris saint-germain|paris sg|psg/g, "psg").replace(/bayer 04 leverkusen/g, "bayer leverkusen").replace(/internazionale|inter milan/g, "inter").replace(/[^a-z]/g, "");
  if (goalStats) {
    const minimum = Math.max(goalStats.minimum, international ? 2 : 5);
    const champions = goalStats.rows.filter((row) => row.value >= minimum && championName(row.team) === championName(edition.champion));
    addCategory(comp, `${id}-goals-and-title`, `scored at least ${minimum} goals for champions ${edition.champion} in ${edition.label}`, champions.map((row) => entry(row.name)), 4, [goalStats.source]);
  }
}

for (const category of AUTHORED_STAT_CATEGORIES) {
  const entries = category.answers.map((name) => entry(name));
  addCategory(category.comp, category.id, category.condition, entries, category.difficulty, category.sources);
  addRondo(category.comp, category.condition, entries);
}
