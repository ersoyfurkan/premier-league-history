import type { EspnLeague } from "@/lib/espn";

// Leagues whose live data (table, fixtures, leaders, match centre) comes from ESPN
export type EspnComp = "laliga" | "seriea" | "bundesliga" | "ligue1" | "superlig";

export type LeagueMeta = {
  label: string;
  espn: EspnLeague;
  home: string; // section landing page
  game: string; // mini-game lobby
  match: string; // match centre base path
  weeks: number;
  logoId: number; // ESPN id of a club shown as the section icon fallback
};

export const LEAGUE_META: Record<EspnComp, LeagueMeta> = {
  laliga: { label: "La Liga", espn: "esp.1", home: "/la-liga", game: "/la-liga/game", match: "/la-liga/match", weeks: 38, logoId: 86 },
  seriea: { label: "Serie A", espn: "ita.1", home: "/serie-a", game: "/serie-a/game", match: "/serie-a/match", weeks: 38, logoId: 110 },
  bundesliga: { label: "Bundesliga", espn: "ger.1", home: "/bundesliga", game: "/bundesliga/game", match: "/bundesliga/match", weeks: 34, logoId: 132 },
  ligue1: { label: "Ligue 1 McDonald's", espn: "fra.1", home: "/ligue-1", game: "/ligue-1/game", match: "/ligue-1/match", weeks: 34, logoId: 160 },
  superlig: { label: "Süper Lig", espn: "tur.1", home: "/super-lig", game: "/super-lig/game", match: "/super-lig/match", weeks: 34, logoId: 432 },
};

export const isEspnComp = (value: unknown): value is EspnComp =>
  typeof value === "string" && value in LEAGUE_META;
