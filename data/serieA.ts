import { serieAAllTime, serieASeasons } from "@/data/serieAHistory";

export { serieAAllTime, serieASeasons };

export const serieAWinners = serieASeasons
  .filter((season) => !season.champion.startsWith("Not awarded"))
  .map((season) => ({
    season: season.season,
    winner: season.champion,
    runnerUp: season.runnerUp,
    topScorer: season.topScorer,
    goals: season.goals,
  }));

type SerieAClubLogo = { name: string; short: string; espnId?: string; aliases: string[] };

type SerieARivalry = {
  id: string;
  name: string;
  club1: string;
  club2: string;
  description: string;
  leagueMeetings: number;
  club1Wins: number;
  club2Wins: number;
  draws: number;
  club1Goals?: number;
  club2Goals?: number;
  biggestWins: { club: string; score: string; date: string }[];
  topScorers: { player: string; club: string; goals: number }[];
};

export const serieAClubs: SerieAClubLogo[] = [
  { name: "Juventus", short: "Juventus", espnId: "111", aliases: ["Juventus FC", "Juve"] },
  { name: "Inter", short: "Inter", espnId: "110", aliases: ["Internazionale", "Inter Milan", "Ambrosiana-Inter", "Ambrosiana"] },
  { name: "Milan", short: "Milan", espnId: "103", aliases: ["AC Milan", "A.C. Milan", "Milano"] },
  { name: "Roma", short: "Roma", espnId: "104", aliases: ["AS Roma", "A.S. Roma"] },
  { name: "Napoli", short: "Napoli", espnId: "114", aliases: ["SSC Napoli"] },
  { name: "Lazio", short: "Lazio", espnId: "112", aliases: ["SS Lazio"] },
  { name: "Fiorentina", short: "Fiorentina", espnId: "109", aliases: ["ACF Fiorentina"] },
  { name: "Atalanta", short: "Atalanta", espnId: "105", aliases: ["Atalanta BC"] },
  { name: "Torino", short: "Torino", espnId: "239", aliases: ["Torino FC"] },
  { name: "Bologna", short: "Bologna", espnId: "107", aliases: ["Bologna FC"] },
  { name: "Genoa", short: "Genoa", espnId: "3263", aliases: ["Genova 1893", "Genoa CFC"] },
  { name: "Sampdoria", short: "Sampdoria", espnId: "2734", aliases: ["UC Sampdoria"] },
  { name: "Udinese", short: "Udinese", espnId: "118", aliases: ["Udinese Calcio"] },
  { name: "Cagliari", short: "Cagliari", espnId: "2925", aliases: ["Cagliari Calcio"] },
  { name: "Parma", short: "Parma", espnId: "115", aliases: ["Parma Calcio"] },
  { name: "Verona", short: "Verona", espnId: "119", aliases: ["Hellas Verona"] },
  { name: "Palermo", short: "Palermo", espnId: "2923", aliases: [] },
  { name: "Bari", short: "Bari", espnId: "106", aliases: [] },
  { name: "Brescia", short: "Brescia", espnId: "108", aliases: [] },
  { name: "Lecce", short: "Lecce", espnId: "113", aliases: ["US Lecce"] },
  { name: "Empoli", short: "Empoli", espnId: "2574", aliases: [] },
  { name: "Sassuolo", short: "Sassuolo", espnId: "3997", aliases: ["US Sassuolo"] },
  { name: "Como", short: "Como", espnId: "2572", aliases: ["Como 1907"] },
  { name: "Venezia", short: "Venezia", espnId: "17530", aliases: ["Venezia FC"] },
  { name: "Monza", short: "Monza", espnId: "4007", aliases: ["AC Monza"] },
  { name: "Pisa", short: "Pisa", espnId: "3956", aliases: [] },
  { name: "Cremonese", short: "Cremonese", espnId: "4050", aliases: ["US Cremonese"] },
  { name: "Spezia", short: "Spezia", espnId: "4056", aliases: [] },
  { name: "Salernitana", short: "Salernitana", espnId: "3240", aliases: ["US Salernitana"] },
  { name: "Frosinone", short: "Frosinone", espnId: "4057", aliases: [] },
] as const;

export const serieARivalries: SerieARivalry[] = [
  {
    id: "derby-della-madonnina",
    name: "Derby della Madonnina",
    club1: "Inter",
    club2: "Milan",
    description: "The Milan derby, shared by two clubs at San Siro and decided in 2024 when Inter clinched the Scudetto against Milan.",
    leagueMeetings: 185,
    club1Wins: 70,
    club2Wins: 58,
    draws: 57,
    club1Goals: 261,
    club2Goals: 239,
    biggestWins: [{ club: "Milan", score: "Inter 0-6 Milan", date: "11 May 2001" }],
    topScorers: [{ player: "Andriy Shevchenko", club: "Milan", goals: 14 }],
  },
  {
    id: "derby-ditalia",
    name: "Derby d'Italia",
    club1: "Juventus",
    club2: "Inter",
    description: "Italy's two most decorated clubs, long the biggest fixture in the Italian calendar.",
    leagueMeetings: 186,
    club1Wins: 89,
    club2Wins: 50,
    draws: 47,
    club1Goals: 270,
    club2Goals: 219,
    biggestWins: [{ club: "Juventus", score: "Juventus 9-1 Inter", date: "10 June 1961" }],
    topScorers: [
      { player: "Giuseppe Meazza", club: "Inter", goals: 12 },
      { player: "Omar Sívori", club: "Juventus", goals: 12 },
      { player: "Roberto Boninsegna", club: "Inter", goals: 12 },
    ],
  },
  {
    id: "derby-della-capitale",
    name: "Derby della Capitale",
    club1: "Lazio",
    club2: "Roma",
    description: "The Rome derby, played in front of two fiercely divided curves at the Stadio Olimpico.",
    leagueMeetings: 164,
    club1Wins: 42,
    club2Wins: 60,
    draws: 62,
    club1Goals: 157,
    club2Goals: 205,
    biggestWins: [{ club: "Roma", score: "Roma 5-0 Lazio", date: "1 November 1933" }],
    topScorers: [
      { player: "Francesco Totti", club: "Roma", goals: 11 },
      { player: "Dino da Costa", club: "Roma", goals: 11 },
    ],
  },
  {
    id: "derby-della-mole",
    name: "Derby della Mole",
    club1: "Juventus",
    club2: "Torino",
    description: "Turin's city derby, one of the oldest rivalries in Italian football, first played in 1907.",
    leagueMeetings: 162,
    club1Wins: 78,
    club2Wins: 35,
    draws: 49,
    club1Goals: 250,
    club2Goals: 161,
    biggestWins: [{ club: "Torino", score: "Juventus 0-8 Torino", date: "17 November 1912" }],
    topScorers: [{ player: "Giampiero Boniperti", club: "Juventus", goals: 14 }],
  },
  {
    id: "derby-del-sole",
    name: "Derby del Sole",
    club1: "Roma",
    club2: "Napoli",
    description: "The clash of the south and the capital, fought between two of Serie A's most passionate fan bases.",
    leagueMeetings: 163,
    club1Wins: 54,
    club2Wins: 51,
    draws: 58,
    biggestWins: [{ club: "Roma", score: "Roma 8-0 Napoli", date: "29 March 1959" }],
    topScorers: [{ player: "Dino da Costa", club: "Roma", goals: 8 }],
  },
];
