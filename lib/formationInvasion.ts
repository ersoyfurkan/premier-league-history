import { formationLineup, formationPlayer, FORMATION_SLOTS } from "@/data/formationInvasion";
import { COMPETITION_LABELS, type Competition } from "@/lib/competitions";
import { normalizeFootballPlayerName } from "@/data/footballNames";

export type FormationSide = "p1" | "p2";
export type FormationMode = "online" | "local" | "solo";
type Votes = Record<FormationSide, boolean>;
type Slot = {
  playerId: string; progress: number; owner: FormationSide | null; hints: Votes;
  questionPicks?: [number, number, number];
};
export type FormationState = {
  game: "formation-invasion";
  gameId: string;
  revision: number;
  comp: Competition;
  mode: FormationMode;
  phase: "waiting" | "playing" | "finished";
  p1Token: string | null;
  p2Token: string | null;
  turn: FormationSide;
  slots: Slot[];
  winner: FormationSide | null;
  mistakes: Record<FormationSide, number>;
  correct: Record<FormationSide, number>;
  rematch: Votes;
  notice: string | null;
  clueRace?: { slot: number; question: number; openedRevision: number; attempted: Votes } | null;
};
export type FormationAction =
  | { action: "answer"; slot: number; question: number; answer: string }
  | { action: "hint"; slot: number; question: number }
  | { action: "pass" }
  | { action: "rematch" };

const votes = (): Votes => ({ p1: false, p2: false });
const other = (side: FormationSide): FormationSide => side === "p1" ? "p2" : "p1";
export const formationSideLabel = (side: FormationSide) => side === "p1" ? "Player 1" : "Player 2";
export const isFormationComp = (value: unknown): value is Competition =>
  typeof value === "string" && Object.hasOwn(COMPETITION_LABELS, value);

function pickQuestions(playerId: string): [number, number, number] {
  const questions = formationPlayer(playerId).questions;
  const pick = (difficulty: "easy" | "medium" | "hard") => {
    const indices = questions.flatMap((question, index) => question.difficulty === difficulty ? [index] : []);
    if (!indices.length) throw new Error(`Missing ${difficulty} Formation Invasion questions for ${playerId}`);
    return indices[Math.floor(Math.random() * indices.length)];
  };
  return [pick("easy"), pick("medium"), pick("hard")];
}

export function isFormationRaceAnswer(state: FormationState, side: FormationSide, action: FormationAction,
  expected: { gameId: string; revision: number }): boolean {
  const race = state.clueRace;
  return Boolean(race && state.phase === "playing" && state.gameId === expected.gameId &&
    expected.revision >= race.openedRevision && expected.revision <= state.revision &&
    action.action === "answer" && action.slot === race.slot && action.question === race.question &&
    !race.attempted[side]);
}

export function formationQuestionFor(slot: Slot) {
  // Rooms created before random selection retain the original three question indices.
  const index = slot.questionPicks ? slot.questionPicks[slot.progress] : slot.progress;
  const question = formationPlayer(slot.playerId).questions[index];
  if (!question) throw new Error(`Invalid Formation Invasion question for ${slot.playerId}`);
  return question;
}

export function newFormationGame(comp: Competition, mode: FormationMode, token: string | null = null): FormationState {
  return {
    game: "formation-invasion", gameId: crypto.randomUUID(), revision: 0, comp, mode,
    phase: mode === "online" ? "waiting" : "playing", p1Token: token, p2Token: null,
    turn: "p1", slots: formationLineup(comp).map((playerId) => ({
      playerId, questionPicks: pickQuestions(playerId), progress: 0, owner: null, hints: votes(),
    })),
    winner: null, mistakes: { p1: 0, p2: 0 }, correct: { p1: 0, p2: 0 },
    rematch: votes(), notice: null, clueRace: null,
  };
}

export function formationSideOf(state: FormationState, token: string): FormationSide | null {
  if (!token) return null;
  return token === state.p1Token ? "p1" : token === state.p2Token ? "p2" : null;
}

export function formationScores(state: FormationState): Record<FormationSide, number> {
  return state.slots.reduce((scores, slot) => {
    if (slot.owner) scores[slot.owner] += 1;
    return scores;
  }, { p1: 0, p2: 0 });
}

export function joinFormationGame(state: FormationState, token: string): string | null {
  if (state.phase !== "waiting" || state.p2Token) return "This room is already full.";
  if (!token || token === state.p1Token) return "Invalid player token.";
  state.p2Token = token;
  state.phase = "playing";
  state.revision += 1;
  return null;
}

export function applyFormationAction(
  state: FormationState, side: FormationSide, action: FormationAction,
  expected: { gameId: string; revision: number },
): string | null {
  if ((state.gameId !== expected.gameId || state.revision !== expected.revision) &&
    !isFormationRaceAnswer(state, side, action, expected)) {
    return "The game changed. Please check the current question and try again.";
  }
  if (state.mode === "solo" && side !== "p1") return "Solo practice has only one player.";
  if (state.phase === "waiting") return "Wait for your opponent to join.";
  if (action.action === "rematch") {
    if (state.phase !== "finished") return "Finish this game before starting another.";
    if (state.rematch[side]) return "You already voted for a new game.";
    state.rematch[side] = true;
    if (state.mode === "solo" || (state.rematch.p1 && state.rematch.p2)) {
      const fresh = newFormationGame(state.comp, state.mode, state.p1Token);
      fresh.p2Token = state.p2Token;
      fresh.phase = "playing";
      fresh.revision = state.revision + 1;
      Object.assign(state, fresh);
    } else {
      state.notice = `${formationSideLabel(side)} voted for a new game.`;
      state.revision += 1;
    }
    return null;
  }
  if (state.phase !== "playing") return "This game has finished.";
  if (state.clueRace && (action.action !== "answer" || action.slot !== state.clueRace.slot ||
    action.question !== state.clueRace.question)) return "Finish the shared-clue race before choosing another question or passing.";
  if (action.action === "pass") {
    if (side !== state.turn) return "It is not your turn.";
    if (state.mode === "solo") return "In practice, select another player instead.";
    state.turn = other(side);
    state.notice = `${formationSideLabel(side)} passed. ${formationSideLabel(state.turn)} can choose any unlocked player.`;
    state.revision += 1;
    return null;
  }
  const slot = state.slots[action.slot];
  if (!Number.isInteger(action.slot) || !slot) return "Choose a player on the pitch.";
  if (slot.owner) return "That player is already claimed and locked.";
  if (slot.progress !== action.question) return "That question is no longer active.";
  if (action.action === "hint") {
    if (slot.hints[side]) return "You already requested this clue.";
    slot.hints[side] = true;
    const revealed = state.mode === "solo" || (slot.hints.p1 && slot.hints.p2);
    if (revealed && state.mode !== "solo") {
      state.clueRace = { slot: action.slot, question: slot.progress, openedRevision: state.revision + 1, attempted: votes() };
    }
    state.notice = revealed
      ? `Clue revealed for ${formationPlayer(slot.playerId).name}, question ${slot.progress + 1}.${state.mode !== "solo" ? " Both players race: one attempt each; first correct answer takes the turn." : ""}`
      : `${formationSideLabel(side)} requested a clue for ${formationPlayer(slot.playerId).name}. The other player must agree.`;
    state.revision += 1;
    return null;
  }
  const race = state.clueRace;
  if (race?.attempted[side]) return "You already used your attempt in this clue race. Wait for the other player.";
  if (!race && side !== state.turn) return "It is not your turn.";
  if (!action.answer.trim() || action.answer.length > 150) return "Enter an answer of 1 to 150 characters.";
  const player = formationPlayer(slot.playerId);
  const question = formationQuestionFor(slot);
  const normalized = normalizeFootballPlayerName(action.answer);
  if (!normalized) return "Enter a football answer, not only punctuation.";
  const correct = question.answers.some((answer) => normalizeFootballPlayerName(answer) === normalized);
  if (correct) {
    state.turn = side;
    state.clueRace = null;
    state.correct[side] += 1;
    slot.progress += 1;
    slot.hints = votes();
    if (slot.progress === 3) {
      slot.owner = side;
      const count = formationScores(state)[side];
      state.notice = `${formationSideLabel(side)} claimed ${player.name}! ${count}/6 players.`;
      if (count === 6) {
        state.winner = side;
        state.phase = "finished";
      }
    } else {
      state.notice = `Correct! ${player.name}: ${slot.progress}/3. ${formationSideLabel(side)} keeps the turn and may choose any unlocked player.`;
    }
  } else {
    state.mistakes[side] += 1;
    if (race) {
      race.attempted[side] = true;
      if (race.attempted.p1 && race.attempted.p2) {
        state.clueRace = null;
        state.notice = `Both race answers were wrong. Normal turns resume with ${formationSideLabel(state.turn)}; the clue stays visible.`;
      } else {
        state.notice = `${formationSideLabel(side)} used their race attempt. ${formationSideLabel(other(side))} can still answer.`;
      }
    } else {
      if (state.mode !== "solo") state.turn = other(side);
      state.notice = state.mode === "solo"
      ? "Not correct. Try again, choose another player, or request a clue."
      : `Not correct. ${formationSideLabel(state.turn)} can continue this question or choose another player.`;
    }
  }
  state.revision += 1;
  return null;
}

export function formationView(state: FormationState, you: FormationSide) {
  return {
    gameId: state.gameId, revision: state.revision, comp: state.comp, mode: state.mode,
    phase: state.phase, turn: state.turn, you, opponentJoined: Boolean(state.p2Token),
    scores: formationScores(state), winner: state.winner, mistakes: { ...state.mistakes },
    correct: { ...state.correct }, notice: state.notice, rematch: { ...state.rematch },
    clueRace: state.clueRace ? { slot: state.clueRace.slot, question: state.clueRace.question,
      attempted: { ...state.clueRace.attempted } } : null,
    slots: state.slots.map((slot, index) => {
      const player = formationPlayer(slot.playerId);
      const question = slot.owner ? null : formationQuestionFor(slot);
      return {
        playerId: player.id, name: player.name, position: FORMATION_SLOTS[index].position,
        progress: slot.progress, owner: slot.owner, hints: { ...slot.hints },
        question: question?.text ?? null,
        hint: question && (state.mode === "solo" ? slot.hints.p1 : slot.hints.p1 && slot.hints.p2) ? question.hint : null,
      };
    }),
  };
}

export type FormationView = ReturnType<typeof formationView>;
