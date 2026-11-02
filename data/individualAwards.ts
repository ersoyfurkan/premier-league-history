import prepared from "@/data/quizAwards.generated.json";
import { REAL_COMPETITIONS, TOURNAMENT_COMPETITIONS, type Competition } from "@/lib/competitions";
import { normalizeFootballPlayerName } from "@/data/footballNames";
import type { RondoClue } from "@/data/rondo";
import type { IndividualAward, AwardGroup } from "@/scripts/builders/individualAwards";

export type { IndividualAward, AwardGroup } from "@/scripts/builders/individualAwards";
export { awardPlayerKey } from "@/data/footballNames";

export const INDIVIDUAL_AWARDS = prepared.awards as IndividualAward[];
export const AWARD_GROUPS = prepared.groups as AwardGroup[];
export const AWARDS_CHECKED_AT = prepared.checkedAt;
const byId = new Map(INDIVIDUAL_AWARDS.map((award) => [award.id, award]));

export function individualAward(id: string): IndividualAward {
  const award = byId.get(id);
  if (!award) throw new Error(`Unknown individual award: ${id}`);
  return award;
}

const competitions: Competition[] = ["general", ...REAL_COMPETITIONS, ...TOURNAMENT_COMPETITIONS];
export const AWARD_TRIVIA_CATEGORIES = Object.fromEntries(competitions.map((comp) => [
  comp, AWARD_GROUPS.filter((group) => group.competitions.includes(comp)).map((group) => ({ ...group, short: group.label })),
])) as Record<Competition, (AwardGroup & { short: string })[]>;

const groupClues = AWARD_GROUPS.map((group) => {
  const letters = new Map<string, string[]>();
  for (const { name, aliases } of group.entries) {
    const letter = normalizeFootballPlayerName(name)[0].toUpperCase();
    const answers = letters.get(letter) ?? [];
    answers.push(name, ...aliases);
    letters.set(letter, answers);
  }
  return {
    group,
    clues: [...letters].map(([letter, answers]) => ({
      letter, clue: `Name a ${group.noun} (answer starts with ${letter}).`, answers,
    })),
  };
});

export const AWARD_RONDO_CLUES = Object.fromEntries(competitions.map((comp) => [
  comp, groupClues.filter(({ group }) => group.competitions.includes(comp)).flatMap(({ clues }) => clues),
])) as Record<Competition, RondoClue[]>;

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function awardsInText(text: string): IndividualAward[] {
  const normalized = normalize(text);
  return INDIVIDUAL_AWARDS.filter((award) => normalized.includes(normalize(award.label))
    || (award.id === "ballon" && /ballon d['’]or/.test(normalized))
    || (award.id === "puskas" && /puskas/.test(normalized))
    || (award.id === "european-shoe" && /european golden shoe/.test(normalized)));
}
