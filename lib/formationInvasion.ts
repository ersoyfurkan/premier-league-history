import { formationLineup, formationPlayer, FORMATION_SLOTS } from "@/data/formationInvasion";
import { COMPETITION_LABELS, type Competition } from "@/lib/competitions";
import { normalizeFootballPlayerName } from "@/data/footballNames";
import { formationStandingCategory, FORMATION_STANDING_CATEGORIES, pickFormationStandingCategory } from "@/data/formationStanding";

export type FormationSide = "p1" | "p2";
export type FormationMode = "online" | "local" | "solo";
type Votes = Record<FormationSide, boolean>;
type Slot = {
  playerId: string; progress: number; owner: FormationSide | null; hints: Votes;
  questionPicks?: [number, number, number];
  cluesRevealed?: number;
  standingVotes?: Votes;
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
  selectedSlot?: number | null;
  clueRace?: { slot: number; question: number; openedRevision: number; attempted: Votes } | null;
  standing?: {
    slot: number; question: number; categoryId: string; turn: FormationSide;
    deadline: number; used: string[]; categories: string[];
  } | null;
};
export type FormationAction =
  | { action: "select"; slot: number; question: number }
  | { action: "answer"; slot: number; question: number; answer: string }
  | { action: "hint"; slot: number; question: number; clue?: number }
  | { action: "standing-vote"; slot: number; question: number }
  | { action: "standing-answer"; answer: string; deadline: number }
  | { action: "standing-timeout"; deadline: number }
  | { action: "pass" }
  | { action: "rematch" };

const votes = (): Votes => ({ p1: false, p2: false });
export const FORMATION_STANDING_TURN_MS = 7000;
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

function clueCount(state: FormationState, slot: Slot) {
  return slot.cluesRevealed ?? ((state.mode === "solo" ? slot.hints.p1 : slot.hints.p1 && slot.hints.p2) ? 1 : 0);
}

function completeFormationQuestion(state: FormationState, index: number, side: FormationSide) {
  const slot = state.slots[index];
  state.turn = side;
  state.clueRace = null;
  state.standing = null;
  state.selectedSlot = null;
  state.correct[side] += 1;
  slot.progress += 1;
  slot.hints = votes();
  slot.cluesRevealed = 0;
  slot.standingVotes = votes();
  const player = formationPlayer(slot.playerId);
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
}

function loseStanding(state: FormationState, loser: FormationSide, reason: string) {
  const standing = state.standing;
  if (!standing) throw new Error("No Last Man Standing round is active.");
  state.mistakes[loser] += 1;
  completeFormationQuestion(state, standing.slot, other(loser));
  state.notice = `${formationSideLabel(loser)} ${reason}. ${formationSideLabel(other(loser))} wins Last Man Standing! ${state.notice}`;
  state.revision += 1;
}

export function expireFormationStanding(state: FormationState, now = Date.now()): boolean {
  if (state.phase !== "playing" || !state.standing || now < state.standing.deadline) return false;
  loseStanding(state, state.standing.turn, "ran out of time");
  return true;
}

export function newFormationGame(comp: Competition, mode: FormationMode, token: string | null = null): FormationState {
  return {
    game: "formation-invasion", gameId: crypto.randomUUID(), revision: 0, comp, mode,
    phase: mode === "online" ? "waiting" : "playing", p1Token: token, p2Token: null,
    turn: "p1", slots: formationLineup(comp).map((playerId) => ({
      playerId, questionPicks: pickQuestions(playerId), progress: 0, owner: null, hints: votes(), cluesRevealed: 0, standingVotes: votes(),
    })),
    winner: null, mistakes: { p1: 0, p2: 0 }, correct: { p1: 0, p2: 0 },
    rematch: votes(), notice: null, selectedSlot: null, clueRace: null, standing: null,
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
  now = Date.now(),
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
  if (state.standing) {
    const standing = state.standing;
    if (action.action !== "standing-answer" && action.action !== "standing-timeout") {
      return "Finish Last Man Standing before returning to the formation.";
    }
    if (action.deadline !== standing.deadline) return "That Last Man Standing turn has ended.";
    if (expireFormationStanding(state, now)) return null;
    if (action.action === "standing-timeout") return "There is still time on this turn.";
    if (side !== standing.turn) return "It is not your Last Man Standing turn.";
    const normalized = normalizeFootballPlayerName(action.answer);
    if (!normalized || action.answer.length > 150) return "Enter a football answer of 1 to 150 characters.";
    const category = formationStandingCategory(standing.categoryId);
    const entry = category.entries.find((item) => [item.name, ...item.aliases]
      .some((alias) => normalizeFootballPlayerName(alias) === normalized));
    if (!entry || standing.used.includes(entry.name)) {
      loseStanding(state, side, entry ? "repeated an answer" : "gave a wrong answer");
      return null;
    }
    standing.used.push(entry.name);
    standing.turn = other(side);
    if (standing.used.length === category.entries.length) {
      if (standing.categories.length === FORMATION_STANDING_CATEGORIES.length) standing.categories = [];
      const next = pickFormationStandingCategory(standing.categories);
      standing.categoryId = next.id;
      standing.categories.push(next.id);
      standing.used = [];
      state.notice = `Category completed! New category: ${next.prompt} Answers reset for this new category.`;
    } else {
      state.notice = `Accepted: ${entry.name}. ${formationSideLabel(standing.turn)} has seven seconds.`;
    }
    standing.deadline = now + FORMATION_STANDING_TURN_MS;
    state.revision += 1;
    return null;
  }
  if (action.action === "standing-answer" || action.action === "standing-timeout") return "No Last Man Standing round is active.";
  if (state.clueRace && ((action.action !== "answer" && action.action !== "standing-vote") || action.slot !== state.clueRace.slot ||
    action.question !== state.clueRace.question)) return "Finish the shared-clue race before choosing another question or passing.";
  if (action.action === "pass") {
    if (side !== state.turn) return "It is not your turn.";
    if (state.selectedSlot != null) return "Answer your selected footballer's question before passing.";
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
  if (state.selectedSlot != null && state.selectedSlot !== action.slot) return "Answer your selected footballer's question before choosing another player.";
  if (action.action === "select") {
    if (side !== state.turn) return "It is not your turn.";
    if (state.selectedSlot === action.slot) return "That footballer is already selected.";
    state.selectedSlot = action.slot;
    state.notice = `${formationSideLabel(side)} chose ${formationPlayer(slot.playerId).name}. Answer this question before changing footballer.`;
    state.revision += 1;
    return null;
  }
  if (action.action === "standing-vote") {
    if (state.mode === "solo") return "Last Man Standing needs two players.";
    if (clueCount(state, slot) < 3) return "Reveal all three clues before voting for Last Man Standing.";
    slot.standingVotes ??= votes();
    if (slot.standingVotes[side]) return "You already voted for Last Man Standing.";
    slot.standingVotes[side] = true;
    if (slot.standingVotes.p1 && slot.standingVotes.p2) {
      const category = pickFormationStandingCategory();
      const first: FormationSide = Math.random() < 0.5 ? "p1" : "p2";
      state.standing = { slot: action.slot, question: slot.progress, categoryId: category.id, turn: first,
        deadline: now + FORMATION_STANDING_TURN_MS, used: [], categories: [category.id] };
      state.clueRace = null;
      state.notice = `Last Man Standing! ${formationSideLabel(first)} was randomly selected to start. Seven seconds per answer.`;
    } else {
      state.notice = `${formationSideLabel(side)} voted for Last Man Standing on ${formationPlayer(slot.playerId).name}. The other player must agree.`;
    }
    state.revision += 1;
    return null;
  }
  if (action.action === "hint") {
    const count = clueCount(state, slot);
    if (count >= 3) return "All three clues have been revealed.";
    if (action.clue === undefined && count > 0) return "You already requested this clue.";
    if (action.clue !== undefined && action.clue !== count) return "That clue is no longer active.";
    // Older saved rooms may still keep both votes on their first revealed clue.
    if (slot.cluesRevealed === undefined && count > 0) {
      slot.cluesRevealed = count;
      slot.hints = votes();
    }
    if (slot.hints[side]) return "You already requested this clue.";
    slot.hints[side] = true;
    const revealed = state.mode === "solo" || (slot.hints.p1 && slot.hints.p2);
    if (revealed) {
      slot.cluesRevealed = count + 1;
      slot.hints = votes();
    }
    if (revealed && state.mode !== "solo") {
      state.selectedSlot = action.slot;
      state.clueRace = { slot: action.slot, question: slot.progress, openedRevision: state.revision + 1, attempted: votes() };
    }
    state.notice = revealed
      ? `Clue ${count + 1}/3 revealed for ${formationPlayer(slot.playerId).name}, question ${slot.progress + 1}.${state.mode !== "solo" ? " Both players race: one attempt each; first correct answer takes the turn." : ""}`
      : `${formationSideLabel(side)} requested a clue for ${formationPlayer(slot.playerId).name}. The other player must agree.`;
    state.revision += 1;
    return null;
  }
  const race = state.clueRace;
  if (race?.attempted[side]) return "You already used your attempt in this clue race. Wait for the other player.";
  if (!race && side !== state.turn) return "It is not your turn.";
  if (!action.answer.trim() || action.answer.length > 150) return "Enter an answer of 1 to 150 characters.";
  const question = formationQuestionFor(slot);
  const normalized = normalizeFootballPlayerName(action.answer);
  if (!normalized) return "Enter a football answer, not only punctuation.";
  const correct = question.answers.some((answer) => normalizeFootballPlayerName(answer) === normalized);
  if (correct) {
    completeFormationQuestion(state, action.slot, side);
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
      if (state.mode !== "solo") state.selectedSlot = null;
      state.notice = state.mode === "solo"
      ? "Not correct. Try this question again or request a clue."
      : `Not correct. ${formationSideLabel(state.turn)} can continue this question or choose another player.`;
    }
  }
  state.revision += 1;
  return null;
}

export function formationView(state: FormationState, you: FormationSide, now = Date.now()) {
  return {
    gameId: state.gameId, revision: state.revision, comp: state.comp, mode: state.mode,
    phase: state.phase, turn: state.turn, you, opponentJoined: Boolean(state.p2Token),
    scores: formationScores(state), winner: state.winner, mistakes: { ...state.mistakes },
    correct: { ...state.correct }, notice: state.notice, rematch: { ...state.rematch },
    selectedSlot: state.selectedSlot ?? null,
    clueRace: state.clueRace ? { slot: state.clueRace.slot, question: state.clueRace.question,
      attempted: { ...state.clueRace.attempted } } : null,
    standing: state.standing ? {
      slot: state.standing.slot, question: state.standing.question, turn: state.standing.turn,
      deadline: state.standing.deadline, prompt: formationStandingCategory(state.standing.categoryId).prompt,
      used: [...state.standing.used],
    } : null,
    serverNow: now,
    slots: state.slots.map((slot, index) => {
      const player = formationPlayer(slot.playerId);
      const shared = state.clueRace?.slot === index || state.standing?.slot === index;
      const visible = state.phase === "playing" && (shared ||
        (state.selectedSlot === index && (state.mode !== "online" || state.turn === you)));
      const question = slot.owner || !visible ? null : formationQuestionFor(slot);
      return {
        playerId: player.id, name: player.name, position: FORMATION_SLOTS[index].position,
        progress: slot.progress, owner: slot.owner, hints: { ...slot.hints },
        question: question?.text ?? null,
        hint: question && clueCount(state, slot) > 0 ? question.hint : null,
        clues: question ? question.clues.slice(0, clueCount(state, slot)) : [],
        cluesRevealed: slot.owner ? 0 : clueCount(state, slot),
        standingVotes: { ...(slot.standingVotes ?? votes()) },
      };
    }),
  };
}

export type FormationView = ReturnType<typeof formationView>;
