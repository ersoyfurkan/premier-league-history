import type { FormationPlayer, FormationQuestion } from "@/data/formationInvasion";

type Question = Omit<FormationQuestion, "difficulty">;

export const expansionQuestion = (
  text: string, answers: string[], clues: [string, string, string],
): Question => ({ text, answers, hint: clues[0], clues });

export const expansionPlayer = (
  id: string, name: string, positions: FormationPlayer["positions"],
  competitions: FormationPlayer["competitions"], article: string, questions: Question[],
): FormationPlayer => ({
  id, name, positions, competitions, source: `https://en.wikipedia.org/wiki/${article}`,
  questions: questions.map((question, index) => ({
    ...question, difficulty: index < 6 ? "easy" : index < 12 ? "medium" : "hard",
  })),
});
