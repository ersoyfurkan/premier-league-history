import type { EspnLeague } from "@/lib/espn";

export type TournamentKey = "worldcup" | "euros" | "copa";

export type Edition = { label: string; season: number; year: number; host: string };
export type Qualifier = { key: string; label: string; espn: EspnLeague; season: number; years: number[] };

export type TournamentMeta = {
  label: string;
  short: string;
  espn: EspnLeague;
  home: string;
  game: string;
  match: string;
  logoId: number;
  region: string;
  since: string;
  editions: Edition[]; // newest first; season is the ESPN season, year is when matches were played
  qualifiers: Qualifier[];
  qualifiersNote: string;
  stageLabels?: Record<string, string>;
};

export const STAGE_ORDER = ["group-stage", "league-phase", "round-of-32", "round-of-16", "quarterfinals", "semifinals", "3rd-place-match", "third-place-match", "final"];
export const STAGE_LABEL: Record<string, string> = {
  "group-stage": "Group stage",
  "round-of-32": "Round of 32",
  "round-of-16": "Round of 16",
  quarterfinals: "Quarter-finals",
  semifinals: "Semi-finals",
  "3rd-place-match": "Third-place match",
  "third-place-match": "Third-place match",
  final: "Final",
};

export const TOURNAMENTS: Record<TournamentKey, TournamentMeta> = {
  worldcup: {
    label: "FIFA World Cup",
    short: "World Cup",
    espn: "fifa.world",
    home: "/world-cup",
    game: "/world-cup/game",
    match: "/world-cup/match",
    logoId: 4,
    region: "World",
    since: "1930",
    editions: [
      { label: "2026 USA / Canada / Mexico", season: 2026, year: 2026, host: "USA, Canada, Mexico" },
      { label: "2022 Qatar", season: 2022, year: 2022, host: "Qatar" },
      { label: "2018 Russia", season: 2018, year: 2018, host: "Russia" },
      { label: "2014 Brazil", season: 2014, year: 2014, host: "Brazil" },
      { label: "2010 South Africa", season: 2010, year: 2010, host: "South Africa" },
      { label: "2006 Germany", season: 2006, year: 2006, host: "Germany" },
    ],
    qualifiers: [
      { key: "uefa", label: "Europe (UEFA)", espn: "fifa.worldq.uefa", season: 2025, years: [2025] },
      { key: "conmebol", label: "South America (CONMEBOL)", espn: "fifa.worldq.conmebol", season: 2023, years: [2023, 2024, 2025] },
      { key: "concacaf", label: "North America (Concacaf)", espn: "fifa.worldq.concacaf", season: 2024, years: [2024, 2025] },
      { key: "caf", label: "Africa (CAF)", espn: "fifa.worldq.caf", season: 2023, years: [2023, 2024, 2025] },
      { key: "afc", label: "Asia (AFC)", espn: "fifa.worldq.afc", season: 2023, years: [2023, 2024, 2025] },
      { key: "ofc", label: "Oceania (OFC)", espn: "fifa.worldq.ofc", season: 2024, years: [2024, 2025] },
    ],
    qualifiersNote: "2026 World Cup qualifying. Playoff and intercontinental rounds are included where ESPN lists them.",
  },
  euros: {
    label: "UEFA European Championship",
    short: "Euros",
    espn: "uefa.euro",
    home: "/euros",
    game: "/euros/game",
    match: "/euros/match",
    logoId: 74,
    region: "European",
    since: "1960",
    editions: [
      { label: "2024 Germany", season: 2024, year: 2024, host: "Germany" },
      { label: "2020 (played 2021)", season: 2020, year: 2021, host: "11 host cities" },
      { label: "2016 France", season: 2016, year: 2016, host: "France" },
      { label: "2012 Poland / Ukraine", season: 2012, year: 2012, host: "Poland, Ukraine" },
    ],
    qualifiers: [{ key: "euroq", label: "Euro 2024 qualifying", espn: "uefa.euroq", season: 2023, years: [2023] }],
    qualifiersNote: "Euro 2024 qualifying. Euro 2028 qualifying has not started yet.",
  },
  copa: {
    label: "Copa América",
    short: "Copa América",
    espn: "conmebol.america",
    home: "/copa-america",
    game: "/copa-america/game",
    match: "/copa-america/match",
    logoId: 83,
    region: "South American",
    since: "1916",
    editions: [
      { label: "2024 USA", season: 2024, year: 2024, host: "United States" },
      { label: "2019 Brazil", season: 2019, year: 2019, host: "Brazil" },
      { label: "2016 Centenario (USA)", season: 2016, year: 2016, host: "United States" },
      { label: "2015 Chile", season: 2015, year: 2015, host: "Chile" },
    ],
    qualifiers: [],
    qualifiersNote: "Copa América has no qualifying: the ten CONMEBOL teams are joined by invited guests (CONCACAF teams in recent editions).",
  },
};

export const isTournament = (value: unknown): value is TournamentKey => typeof value === "string" && value in TOURNAMENTS;

export const tournamentForPath = (pathname: string): TournamentKey | undefined =>
  (Object.keys(TOURNAMENTS) as TournamentKey[]).find((key) => pathname === TOURNAMENTS[key].home || pathname.startsWith(`${TOURNAMENTS[key].home}/`));
