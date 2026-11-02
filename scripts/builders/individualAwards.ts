import snapshot from "@/data/individualAwards.generated.json";
import clubHistory from "@/data/clubHistory.generated.json";
import { COMPETITION_LABELS, REAL_COMPETITIONS, TOURNAMENT_COMPETITIONS, type Competition } from "@/lib/competitions";
import { CAREERS } from "@/data/clubDuelCareers";
import { FOOTBALL_KNOWLEDGE_GROUPS, knowledgeNameKey, type KnowledgeEntry } from "@/data/footballKnowledge";
import type { RondoClue } from "@/data/rondo";
import { awardPlayerKey } from "@/data/footballNames";

export type IndividualAward = {
  id: string;
  label: string;
  comp: Competition;
  source: string;
  supplementalSources?: string[];
  src: string;
  fallback: string;
  image: string;
  imageKind: string;
  winners: { name: string; season: string }[];
  entries: KnowledgeEntry[];
};
export type AwardGroup = {
  id: string;
  label: string;
  noun: string;
  plural: string;
  entries: KnowledgeEntry[];
  difficulty: number;
  competitions: Competition[];
  sources: string[];
  awardIds: string[];
  relationId?: string;
  operator?: "AND" | "OR";
  awardOperator?: "AND" | "OR";
};
const competitions: Competition[] = ["general", ...REAL_COMPETITIONS, ...TOURNAMENT_COMPETITIONS];
const competitionByName: Record<string, Competition> = Object.fromEntries(competitions.map((comp) => [comp, comp]));
const aliases: Record<string, string[]> = {
  ronaldo: ["Ronaldo Nazario"], neymar: ["Neymar Jr"], alisson: ["Alisson Becker"],
  viniciusjunior: ["Vinicius Jr", "Vinicius"],
  khvichakvaratskhelia: ["Kvaratskhelia"], heungminson: ["Son Heung-min"], sonheungmin: ["Heung-min Son"],
  bremer: ["Gleison Bremer"], alejandrogomez: ["Papu Gomez"],
};
function entry(name: string): KnowledgeEntry {
  const surname = name.split(/\s+/).at(-1) ?? name;
  return { name, aliases: [...(aliases[awardPlayerKey(name)] ?? []), ...(surname !== name && surname.length >= 4 ? [surname] : [])] };
}
function unique(entries: KnowledgeEntry[]) {
  const found = new Map<string, KnowledgeEntry>();
  for (const candidate of entries) {
    const key = awardPlayerKey(candidate.name);
    const existing = found.get(key);
    if (existing) existing.aliases = [...new Set([...existing.aliases, ...candidate.aliases, ...(candidate.name === existing.name ? [] : [candidate.name])])];
    else found.set(key, { name: candidate.name, aliases: [...candidate.aliases] });
  }
  return [...found.values()];
}
export const INDIVIDUAL_AWARDS: IndividualAward[] = snapshot.awards.map((award) => {
  const comp = competitionByName[award.comp];
  if (!comp) throw new Error(`Unknown individual award competition: ${award.comp}`);
  return { ...award, comp, entries: unique(award.winners.map(({ name }) => entry(name))) };
});
export const AWARDS_CHECKED_AT = snapshot.checkedAt;
const byId = new Map(INDIVIDUAL_AWARDS.map((award) => [award.id, award]));
export function individualAward(id: string): IndividualAward {
  const award = byId.get(id);
  if (!award) throw new Error(`Unknown individual award: ${id}`);
  return award;
}
const scopes = (comp: Competition): Competition[] => comp === "general" ? competitions : ["general", comp];
const latest = (award: IndividualAward) => award.winners.map(({ season }) => season).sort().at(-1)!;
const sourcesFor = (award: IndividualAward) => [award.source, ...(award.supplementalSources ?? [])];
const standalone = (award: IndividualAward): AwardGroup => ({
  id: `s-award-${award.id}`, label: `${award.label} winner`,
  noun: `player who won the men's ${award.label} (recorded awards through ${latest(award)})`,
  plural: `players who won the men's ${award.label} (recorded awards through ${latest(award)})`,
  entries: award.entries, difficulty: 3, competitions: scopes(award.comp), sources: sourcesFor(award), awardIds: [award.id],
});
export const AWARD_GROUPS: AwardGroup[] = INDIVIDUAL_AWARDS.map(standalone);

function collection(id: string, label: string, ids: string[], comps: Competition[]) {
  const awards = ids.map(individualAward);
  const condition = `won at least one of these men's individual awards: ${awards.map((award) => award.label).join(" OR ")} (through the recorded award seasons)`;
  const group: AwardGroup = {
    id: `s-award-${id}`, label, noun: `player who ${condition}`, plural: `players who ${condition}`,
    entries: unique(awards.flatMap((award) => award.entries)), difficulty: 3, competitions: comps,
    sources: [...new Set(awards.flatMap(sourcesFor))], awardIds: ids, operator: "OR", awardOperator: "OR",
  };
  AWARD_GROUPS.push(group);
  return group;
}
collection("global-player", "Ballon d'Or OR FIFA world player award", ["ballon", "fifa-best", "fifa-world"], competitions);
collection("global-young", "Golden Boy OR Kopa Trophy", ["golden-boy", "kopa"], competitions);
collection("global-keeper", "Yashin Trophy OR FIFA Best Goalkeeper", ["yashin", "fifa-keeper"], competitions);
for (const comp of ["pl", "laliga", "seriea", "bundesliga", "ligue1", "ucl", "worldcup", "euros", "copa"] as const) {
  const awards = INDIVIDUAL_AWARDS.filter((award) => award.comp === comp);
  collection(`${comp}-individual`, `${COMPETITION_LABELS[comp]} individual award winner`, awards.map((award) => award.id), ["general", comp]);
}
collection("top-five-young", "Top-five-league young player award", ["pfa-young", "pl-young", "laliga-young", "laliga-breakthrough", "seriea-young", "seriea-u23", "bundesliga-rookie", "ligue1-young"], ["general", "ucl"]);
collection("top-five-scorer", "Top-five-league top scorer award", ["pl-boot", "pichichi", "capocannoniere", "bundesliga-scorer", "ligue1-scorer"], ["general", "ucl"]);
collection("international-player", "World Cup, Euros OR Copa America best player", ["wc-ball", "euro-player", "copa-player"], ["general", ...TOURNAMENT_COMPETITIONS]);
collection("international-boot", "World Cup, Euros OR Copa America top scorer", ["wc-boot", "euro-boot", "copa-boot"], ["general", ...TOURNAMENT_COMPETITIONS]);
collection("international-young", "World Cup, Euros OR Copa America best young player", ["wc-young", "euro-young", "copa-young"], ["general", ...TOURNAMENT_COMPETITIONS]);

const baseGroups = [...AWARD_GROUPS];
for (let first = 0; first < INDIVIDUAL_AWARDS.length; first += 1) {
  for (let second = first + 1; second < INDIVIDUAL_AWARDS.length; second += 1) {
    const a = INDIVIDUAL_AWARDS[first];
    const b = INDIVIDUAL_AWARDS[second];
    if (a.comp !== "general" && b.comp !== "general" && a.comp !== b.comp) continue;
    const names = new Set(b.entries.map(({ name }) => awardPlayerKey(name)));
    const entries = a.entries.filter(({ name }) => names.has(awardPlayerKey(name)));
    if (entries.length < 6) continue;
    const condition = `won both the men's ${a.label} AND ${b.label} (through the recorded award seasons)`;
    AWARD_GROUPS.push({
      id: `s-award-both-${a.id}-${b.id}`, label: `${a.label} + ${b.label}`,
      noun: `player who ${condition}`, plural: `players who ${condition}`, entries, difficulty: 5,
      competitions: scopes(a.comp === "general" ? b.comp : a.comp), sources: [...sourcesFor(a), ...sourcesFor(b)],
      awardIds: [a.id, b.id], operator: "AND", awardOperator: "AND",
    });
  }
}

const clubNames: Record<string, string> = {
  ars: "Arsenal", mun: "Manchester United", liv: "Liverpool", che: "Chelsea", mci: "Manchester City",
  bar: "Barcelona", rma: "Real Madrid", juv: "Juventus", mil: "AC Milan", inter: "Inter Milan",
  bay: "Bayern Munich", dor: "Borussia Dortmund", psg: "Paris Saint-Germain",
};
const careers = new Map<string, Set<string>>();
for (const line of CAREERS.split("\n")) {
  const [name, clubs] = line.split(":");
  if (!name || !clubs || name.startsWith("//")) continue;
  const key = awardPlayerKey(name.trim());
  const known = careers.get(key) ?? new Set<string>();
  for (const club of clubs.trim().split(/\s+/)) known.add(club);
  careers.set(key, known);
}
const relations = FOOTBALL_KNOWLEDGE_GROUPS.filter((group) => /^(?:manager-|teammate-|ballon-worldcup|worldcup-2021|euros-2021|copa-2021|leagues-)/.test(group.id));
const clubSources: Record<string, { source: string }> = clubHistory.clubs;
for (const awardGroup of baseGroups.filter((group) => group.awardIds.length === 1 || /global-|top-five-/.test(group.id))) {
  for (const [club, name] of Object.entries(clubNames)) {
    const source = clubSources[club]?.source;
    if (!source) continue;
    const entries = awardGroup.entries.filter((entry) => careers.get(awardPlayerKey(entry.name))?.has(club));
    if (entries.length < 6) continue;
    const condition = `${awardGroup.noun.slice("player who ".length)} AND made senior appearances for ${name}`;
    AWARD_GROUPS.push({ ...awardGroup, id: `${awardGroup.id}-club-${club}`, label: `${awardGroup.label} + ${name}`, noun: `player who ${condition}`, plural: `players who ${condition}`, entries, difficulty: 4, operator: "AND", sources: [...awardGroup.sources, source] });
  }
  for (const relation of relations) {
    const names = new Set(relation.entries.map(({ name }) => awardPlayerKey(name)));
    const entries = awardGroup.entries.filter(({ name }) => names.has(awardPlayerKey(name)));
    if (entries.length < 6) continue;
    const relationCondition = relation.noun.startsWith("player who ") ? relation.noun.slice("player who ".length)
      : relation.noun.startsWith("player ") ? `was ${relation.noun.slice("player ".length)}` : `was a ${relation.noun}`;
    const condition = `${awardGroup.noun.slice("player who ".length)} AND ${relationCondition}`;
    AWARD_GROUPS.push({ ...awardGroup, id: `${awardGroup.id}-${relation.id}`, label: `${awardGroup.label} + ${relation.label}`, noun: `player who ${condition}`, plural: `players who ${condition}`, entries, difficulty: 5, operator: "AND", relationId: relation.id, sources: [...awardGroup.sources, ...relation.sources] });
  }
}

export const AWARD_TRIVIA_CATEGORIES = Object.fromEntries(competitions.map((comp) => [comp, AWARD_GROUPS.filter((group) => group.competitions.includes(comp)).map((group) => ({ ...group, short: group.label }))])) as Record<Competition, (AwardGroup & { short: string })[]>;
export const AWARD_RONDO_CLUES = Object.fromEntries(competitions.map((comp) => {
  const clues: RondoClue[] = [];
  for (const group of AWARD_GROUPS.filter((group) => group.competitions.includes(comp))) {
    const letters = new Set(group.entries.map(({ name }) => knowledgeNameKey(name)[0].toUpperCase()));
    for (const letter of letters) {
      clues.push({
        letter, clue: `Name a ${group.noun} (answer starts with ${letter}).`,
        answers: group.entries.filter(({ name }) => knowledgeNameKey(name)[0].toUpperCase() === letter).flatMap(({ name, aliases }) => [name, ...aliases]),
      });
    }
  }
  return [comp, clues];
})) as Record<Competition, RondoClue[]>;

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function awardsInText(text: string): IndividualAward[] {
  const normalized = normalize(text);
  return INDIVIDUAL_AWARDS.filter((award) => normalized.includes(normalize(award.label))
    || (award.id === "ballon" && /ballon d['’]or/.test(normalized))
    || (award.id === "puskas" && /puskas/.test(normalized))
    || (award.id === "european-shoe" && /european golden shoe/.test(normalized)));
}
