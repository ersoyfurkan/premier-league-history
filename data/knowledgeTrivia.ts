import { REAL_COMPETITIONS, TOURNAMENT_COMPETITIONS, type Competition } from "@/lib/competitions";
import { FOOTBALL_KNOWLEDGE_GROUPS, knowledgeNameKey } from "@/data/footballKnowledge";
import { STADIUM_COUNTRIES, STADIUM_GROUPS } from "@/data/stadiumTrivia";
import type { RondoClue } from "@/data/rondo";

const competitions: Competition[] = ["general", ...REAL_COMPETITIONS, ...TOURNAMENT_COMPETITIONS];
export const KNOWLEDGE_TRIVIA_CATEGORIES = Object.fromEntries(competitions.map((comp) => [
  comp,
  [...FOOTBALL_KNOWLEDGE_GROUPS, ...STADIUM_GROUPS]
    .filter((group) => group.competitions.includes(comp))
    .map((group) => ({ ...group, id: `s-knowledge-${group.id}`, short: group.label })),
])) as Record<Competition, (typeof FOOTBALL_KNOWLEDGE_GROUPS[number] & { short: string })[]>;

export const KNOWLEDGE_RONDO_CLUES = Object.fromEntries(competitions.map((comp) => {
  const clues: RondoClue[] = [];
  for (const country of STADIUM_COUNTRIES.filter((country) => country.competitions.includes(comp))) {
    for (const stadium of country.stadiums) {
      clues.push({
        letter: stadium.name[0].toUpperCase(),
        clue: stadium.clue,
        answers: [stadium.name, ...stadium.aliases],
      });
    }
  }
  for (const group of FOOTBALL_KNOWLEDGE_GROUPS.filter((group) => group.competitions.includes(comp))) {
    const letters = new Set(group.entries.map((entry) => knowledgeNameKey(entry.name)[0].toUpperCase()));
    for (const letter of letters) {
      clues.push({
        letter,
        clue: `Name a ${group.noun} (answer starts with ${letter}).`,
        answers: group.entries.filter((entry) => knowledgeNameKey(entry.name)[0].toUpperCase() === letter)
          .flatMap((entry) => [entry.name, ...entry.aliases]),
      });
    }
  }
  return [comp, clues];
})) as Record<Competition, RondoClue[]>;
