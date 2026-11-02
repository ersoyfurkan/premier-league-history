// "general" mixes every competition; the real ones are the leagues and the Champions League.
export const REAL_COMPETITIONS = ["pl", "ucl", "laliga", "seriea", "bundesliga", "ligue1", "superlig"] as const;
export type RealCompetition = (typeof REAL_COMPETITIONS)[number];
export type Competition = RealCompetition | "general";

export const COMPETITION_LABELS: Record<Competition, string> = {
  pl: "Premier League",
  laliga: "La Liga",
  seriea: "Serie A",
  ucl: "Champions League",
  bundesliga: "Bundesliga",
  ligue1: "Ligue 1 McDonald's",
  superlig: "S\u00fcper Lig",
  general: "All Competitions",
};
