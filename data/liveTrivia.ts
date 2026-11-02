import type { Competition } from "@/lib/gameRoom";
import live from "@/data/liveFacts.generated.json";
import wikiFacts from "@/data/wikiFacts.generated.json";
import { normalizeFootballPlayerName } from "@/data/footballTicTacToe";
import { COMPETITION_LABELS } from "@/lib/competitions";

type Entry = { name: string; aliases: string[] };
export type LiveCategory = { id: string; short: string; noun: string; plural: string; entries: Entry[] };
type LiveComp = {
  seasons: { season: number; champion: string; top4: string[]; relegated: string[] }[];
  scorers: { name: string; club: string; value: number }[];
  assists: { name: string; club: string; value: number }[];
};

const data = live.comps as unknown as Partial<Record<Competition, LiveComp>>;

export const LIVE_FACTS_UPDATED_AT: string = live.updatedAt;

const CLUB_ALIASES: Record<string, string[]> = {
  Internazionale: ["Inter", "Inter Milan"],
  "AC Milan": ["Milan"],
  "Paris Saint-Germain": ["PSG", "Paris"],
  "Manchester United": ["Man United", "Man Utd"],
  "Manchester City": ["Man City"],
  "Tottenham Hotspur": ["Tottenham", "Spurs"],
  "Wolverhampton Wanderers": ["Wolves", "Wolverhampton"],
  "Atlético Madrid": ["Atletico Madrid", "Atletico"],
  "Athletic Club": ["Athletic Bilbao", "Bilbao"],
  "Brighton & Hove Albion": ["Brighton"],
  "Nottingham Forest": ["Forest"],
  "Bayern Munich": ["Bayern"],
  "Borussia Dortmund": ["Dortmund"],
  "Borussia Mönchengladbach": ["Gladbach", "Monchengladbach"],
  "Bayer Leverkusen": ["Leverkusen"],
  "Werder Bremen": ["Werder"],
  "Hamburg SV": ["Hamburg", "Hamburger SV"],
  "Real Sociedad": ["Sociedad"],
  "Real Betis": ["Betis"],
  "Deportivo La Coruña": ["Deportivo", "Depor"],
  Besiktas: ["Beşiktaş", "Besiktas JK"],
  Fenerbahce: ["Fenerbahçe"],
  "Istanbul Basaksehir": ["Başakşehir", "Basaksehir"],
  Lyon: ["Olympique Lyonnais", "OL"],
  Marseille: ["Olympique de Marseille", "OM"],
  "AS Monaco": ["Monaco"],
  "Hellas Verona": ["Verona"],
  Roma: ["AS Roma"],
};

const PREFIXES = /^(AFC|FC|AS|SSC|RC|OGC|VfL|VfB|1\. FC|1\. FSV|SV|RB|SC|US|CD|UD|RCD|CA)\s+/i;

function clubEntry(name: string): Entry {
  const aliases = new Set(CLUB_ALIASES[name] ?? []);
  const stripped = name.replace(PREFIXES, "").trim();
  if (stripped && stripped !== name) aliases.add(stripped);
  return { name, aliases: [...aliases] };
}

function playerEntry(name: string): Entry {
  const parts = name.split(" ");
  return { name, aliases: parts.length > 1 ? [parts[parts.length - 1]] : [] };
}

function unique(entries: Entry[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => (seen.has(entry.name) ? false : (seen.add(entry.name), true)));
}

const span = (first: number, last: number) => `${first}/${String(first + 1).slice(2)} and ${last}/${String(last + 1).slice(2)}`;

// Categories generated from data/liveFacts.generated.json, refreshed by scripts/refresh-live-facts.mts
export function liveTriviaCategories(comp: Competition): LiveCategory[] {
  const facts = data[comp];
  if (!facts || !facts.seasons.length) return [];
  const out: LiveCategory[] = [];
  const first = facts.seasons[0].season;
  const last = facts.seasons[facts.seasons.length - 1].season;

  const league = COMPETITION_LABELS[comp].replace(" McDonald's", "");
  const top4 = unique(facts.seasons.flatMap((season) => season.top4).map(clubEntry));
  if (top4.length >= 8) {
    out.push({
      id: "s-lv-top4",
      short: "Top-four clubs",
      noun: `club that finished in the ${league} top four between ${span(first, last)}`,
      plural: `clubs that finished in the ${league} top four between ${span(first, last)}`,
      entries: top4,
    });
  }
  const relegated = unique(facts.seasons.flatMap((season) => season.relegated).map(clubEntry));
  if (relegated.length >= 10) {
    out.push({
      id: "s-lv-rel",
      short: "Relegated clubs",
      noun: `club that was relegated from the ${league} between ${span(first, last)}`,
      plural: `clubs that were relegated from the ${league} between ${span(first, last)}`,
      entries: relegated,
    });
  }
  const scorers = unique(facts.scorers.map((row) => playerEntry(row.name)));
  if (scorers.length >= 10) {
    out.push({
      id: "s-lv-scorers",
      short: "Top scorers now",
      noun: `player in the current ${league} top 20 scorers`,
      plural: `players in the current ${league} top 20 scorers`,
      entries: scorers,
    });
  }
  const assists = unique(facts.assists.map((row) => playerEntry(row.name)));
  if (assists.length >= 10) {
    out.push({
      id: "s-lv-assists",
      short: "Top assisters now",
      noun: `player in the current ${league} top 20 for assists`,
      plural: `players in the current ${league} top 20 for assists`,
      entries: assists,
    });
  }
  return out;
}

type WikiLists = Record<string, string[]>;
const wiki = wikiFacts.lists as unknown as WikiLists;
export const WIKI_FACTS_UPDATED_AT: string = wikiFacts.updatedAt;

// Adds names that Wikipedia lists but a hand-written list is missing (never removes anything).
export function mergeWikiNames(target: Entry[], key: string, kind: "player" | "club") {
  const known = new Set(target.flatMap((entry) => [entry.name, ...entry.aliases]).map(normalizeFootballPlayerName));
  for (const name of wiki[key] ?? []) {
    if (known.has(normalizeFootballPlayerName(name))) continue;
    const entry = kind === "club" ? clubEntry(name) : playerEntry(name);
    if ([entry.name, ...entry.aliases].some((n) => known.has(normalizeFootballPlayerName(n)))) continue;
    target.push(entry);
    [entry.name, ...entry.aliases].forEach((n) => known.add(normalizeFootballPlayerName(n)));
  }
}

const TOP_SCORER_AWARDS: Partial<Record<Competition, { key: string; short: string; noun: string }>> = {
  pl: { key: "plGoldenBoot", short: "Golden Boot", noun: "Premier League Golden Boot winner" },
  laliga: { key: "laligaPichichi", short: "La Liga top scorers", noun: "La Liga top scorer award winner" },
  seriea: { key: "serieaCapocannoniere", short: "Serie A top scorers", noun: "Serie A top scorer award winner" },
  bundesliga: { key: "bundesligaTop", short: "Bundesliga top scorers", noun: "Bundesliga top scorer award winner" },
  ligue1: { key: "ligue1Top", short: "Ligue 1 top scorer", noun: "Ligue 1 top scorer award winner" },
  superlig: { key: "superligTop", short: "Süper Lig top scorers", noun: "Süper Lig top scorer award winner" },
};

// Categories built from Wikipedia lists, refreshed by scripts/refresh-wiki-facts.mts
export function wikiTriviaCategories(comp: Competition): LiveCategory[] {
  const out: LiveCategory[] = [];
  const award = TOP_SCORER_AWARDS[comp];
  const winners = award ? unique((wiki[award.key] ?? []).map(playerEntry)) : [];
  if (award && winners.length >= 12) {
    out.push({ id: "s-wk-top", short: award.short, noun: award.noun, plural: `${award.noun.replace(/ winner$/, "")} winners`, entries: winners });
  }
  if (comp === "ucl") {
    const runners = unique((wiki.uclRunnersUp ?? []).map(clubEntry));
    if (runners.length >= 12) {
      out.push({ id: "s-wk-uclfinal", short: "Lost a final", noun: "club that has lost a European Cup / Champions League final", plural: "clubs that have lost a European Cup / Champions League final", entries: runners });
    }
  }
  return out;
}
