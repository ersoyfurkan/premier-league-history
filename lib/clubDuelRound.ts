import { DUEL_RESULT_MS, DUEL_WIN_SCORE, matchSharedPlayer } from "@/data/clubDuel";
import { normalizeFootballPlayerName } from "@/data/footballNames";
import type { Competition, Side } from "@/lib/gameRoom";

export type DuelRoundResult = {
  winner: Side | null;
  player: string | null;
  reason: "correct" | "pass" | "timeout" | "wrong";
};

export type DuelRoundState = {
  comp: Competition;
  phase: "waiting" | "pick" | "guess" | "result" | "finished";
  clubs: Record<Side, string> | null;
  scores: Record<Side, number>;
  used: string[];
  guesses?: Record<Side, boolean>;
  pass: Record<Side, boolean>;
  last: DuelRoundResult | null;
  winner: Side | null;
  deadline: number | null;
};

export function endDuelRound(state: DuelRoundState, now: number, result: DuelRoundResult) {
  state.last = result;
  if (result.winner) state.scores[result.winner] += 1;
  const leader = state.scores.p1 >= DUEL_WIN_SCORE ? "p1" : state.scores.p2 >= DUEL_WIN_SCORE ? "p2" : null;
  state.phase = leader ? "finished" : "result";
  state.winner = leader;
  state.deadline = leader ? null : now + DUEL_RESULT_MS;
}

export function submitDuelGuess(state: DuelRoundState, side: Side, guess: string, now: number) {
  if (state.phase !== "guess" || !state.clubs) return { correct: false, message: "Too late" };
  if (state.deadline !== null && now >= state.deadline) {
    endDuelRound(state, now, { winner: null, player: null, reason: "timeout" });
    return { correct: false, message: "Time ran out" };
  }
  const guesses = state.guesses ??= { p1: false, p2: false };
  if (guesses[side] || state.pass[side]) return { correct: false, message: "You already used your one guess this round" };
  if (!guess.trim()) return { correct: false, message: "Enter a player name" };
  guesses[side] = true;
  const player = matchSharedPlayer(state.clubs.p1, state.clubs.p2, guess, state.comp);
  const used = player !== null && state.used.includes(normalizeFootballPlayerName(player));
  if (player && !used) {
    state.used.push(normalizeFootballPlayerName(player));
    endDuelRound(state, now, { winner: side, player, reason: "correct" });
    return { correct: true, message: player };
  }
  if ((guesses.p1 || state.pass.p1) && (guesses.p2 || state.pass.p2)) {
    endDuelRound(state, now, { winner: null, player: null, reason: "wrong" });
  }
  return {
    correct: false,
    message: used ? `${player} was already used. No guesses left this round.` : "Incorrect. No guesses left this round.",
  };
}

export function skipDuelGuess(state: DuelRoundState, side: Side, now: number) {
  if (state.phase !== "guess") return;
  state.pass[side] = true;
  if ((state.guesses?.p1 || state.pass.p1) && (state.guesses?.p2 || state.pass.p2)) {
    endDuelRound(state, now, { winner: null, player: null, reason: state.pass.p1 && state.pass.p2 ? "pass" : "wrong" });
  }
}
