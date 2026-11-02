// "general" mixes every competition; the real ones are the leagues and the Champions League.
export const REAL_COMPETITIONS = ["pl", "ucl", "laliga", "seriea", "bundesliga", "ligue1", "superlig"] as const;
export type RealCompetition = (typeof REAL_COMPETITIONS)[number];

// International tournaments are full game sections too; their pools are the players of the nations that play in them.
export const TOURNAMENT_COMPETITIONS = ["worldcup", "euros", "copa"] as const;
export type TournamentComp = (typeof TOURNAMENT_COMPETITIONS)[number];

export type Competition = RealCompetition | TournamentComp | "general";

export const isTournamentComp = (value: unknown): value is TournamentComp =>
  (TOURNAMENT_COMPETITIONS as readonly unknown[]).includes(value);

export const COMPETITION_LABELS: Record<Competition, string> = {
  pl: "Premier League",
  laliga: "La Liga",
  seriea: "Serie A",
  ucl: "Champions League",
  bundesliga: "Bundesliga",
  ligue1: "Ligue 1 McDonald's",
  superlig: "S\u00fcper Lig",
  worldcup: "World Cup",
  euros: "Euros",
  copa: "Copa Am\u00e9rica",
  general: "All Competitions",
};
