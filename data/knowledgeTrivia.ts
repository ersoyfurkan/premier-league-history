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

const groupClues = FOOTBALL_KNOWLEDGE_GROUPS.map((group) => {
  const letters = new Map<string, string[]>();
  const counts = new Map<string, number>();
  for (const { name, aliases } of group.entries) {
    const letter = knowledgeNameKey(name)[0].toUpperCase();
    const answers = letters.get(letter) ?? [];
    answers.push(name, ...aliases);
    letters.set(letter, answers);
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }
  return {
    group,
    clues: [...letters].map(([letter, answers]) => ({
      letter, clue: `Name a ${group.noun} (answer starts with ${letter}).`, answers,
      prompt: group.noun.length <= 180 ? `${group.noun[0].toUpperCase()}${group.noun.slice(1)}` : group.label,
      difficulty: group.difficulty >= 4 ? "hard" as const : "medium" as const,
      singleAnswer: counts.get(letter) === 1 && group.noun.length <= 200,
    })),
  };
});

export const KNOWLEDGE_RONDO_CLUES = Object.fromEntries(competitions.map((comp) => {
  const clues: RondoClue[] = [];
  for (const country of STADIUM_COUNTRIES.filter((country) => country.competitions.includes(comp))) {
    for (const stadium of country.stadiums) {
      clues.push({
        letter: stadium.name[0].toUpperCase(),
        clue: stadium.clue,
        answers: [stadium.name, ...stadium.aliases],
        difficulty: "easy",
      });
    }
  }
  clues.push(...groupClues.filter(({ group }) => group.competitions.includes(comp)).flatMap(({ clues }) => clues));
  return [comp, clues];
})) as Record<Competition, RondoClue[]>;
