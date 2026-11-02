import { FORMATION_PLAYERS, formationPlayer } from "@/data/formationInvasion";

export type FormationQuestionHistory = Record<string, number[]>;
export const FORMATION_HISTORY_KEY = "formation-question-history-v1";

export function parseFormationQuestionHistory(value: unknown): FormationQuestionHistory | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value);
  if (entries.length > FORMATION_PLAYERS.length) return null;
  const history: FormationQuestionHistory = {};
  for (const [id, indices] of entries) {
    const player = FORMATION_PLAYERS.find((item) => item.id === id);
    if (!player || !Array.isArray(indices) || indices.length > player.questions.length ||
      indices.some((index) => !Number.isInteger(index) || index < 0 || index >= player.questions.length) ||
      new Set(indices).size !== indices.length) return null;
    history[id] = [...indices];
  }
  return history;
}

export function mergeFormationQuestionHistory(
  ...histories: FormationQuestionHistory[]
): FormationQuestionHistory {
  const result: FormationQuestionHistory = {};
  for (const history of histories) {
    for (const [id, indices] of Object.entries(history)) {
      const recent = new Set(result[id] ?? []);
      for (const index of indices) {
        recent.delete(index);
        recent.add(index);
      }
      result[id] = [...recent];
    }
  }
  return result;
}

export function pickFormationQuestions(
  playerId: string, history: FormationQuestionHistory,
): [number, number, number] {
  const questions = formationPlayer(playerId).questions;
  const recent = [...(history[playerId] ?? [])];
  const selected = new Set<number>();
  const pick = (difficulty: "easy" | "medium") => {
    const candidates = questions.flatMap((question, index) =>
      question.difficulty === difficulty && !selected.has(index) ? [index] : []);
    if (!candidates.length) throw new Error(`Missing ${difficulty} Formation Invasion questions for ${playerId}`);
    const unseen = candidates.filter((index) => !recent.includes(index));
    const index = unseen.length
      ? unseen[Math.floor(Math.random() * unseen.length)]
      : recent.find((index) => candidates.includes(index));
    if (index === undefined) throw new Error(`Invalid Formation Invasion question history for ${playerId}`);
    selected.add(index);
    const previous = recent.indexOf(index);
    if (previous !== -1) recent.splice(previous, 1);
    recent.push(index);
    return index;
  };
  const picks: [number, number, number] = [pick("easy"), pick("medium"), pick("medium")];
  history[playerId] = recent;
  return picks;
}

export function readFormationQuestionHistory(storage: Pick<Storage, "getItem">): FormationQuestionHistory {
  const raw = storage.getItem(FORMATION_HISTORY_KEY);
  if (raw === null) return {};
  let value: unknown;
  try { value = JSON.parse(raw); } catch {
    throw new Error("Formation question history is damaged. Clear this site's browser storage to reset it.");
  }
  const history = parseFormationQuestionHistory(value);
  if (!history) throw new Error("Formation question history is invalid. Clear this site's browser storage to reset it.");
  return history;
}
