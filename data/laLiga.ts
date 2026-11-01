import { laLigaAllTime, laLigaSeasons } from "@/data/laLigaHistory";

export { laLigaAllTime, laLigaSeasons };

export const laLigaWinners = laLigaSeasons.map((season) => ({
  season: season.season,
  winner: season.champion,
  runnerUp: season.runnerUp,
  topScorer: season.topScorer,
  goals: season.goals,
}));

type LaLigaClubLogo = { name: string; short: string; espnId?: string; aliases: string[] };

type LaLigaRivalry = {
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

export const laLigaClubs: LaLigaClubLogo[] = [
  { name: "Barcelona", short: "Barcelona", espnId: "83", aliases: ["FC Barcelona"] },
  { name: "Real Madrid", short: "Real Madrid", espnId: "86", aliases: ["Real Madrid CF", "Madrid FC"] },
  { name: "Atlético Madrid", short: "Atlético", espnId: "1068", aliases: ["Atlético de Madrid", "Atlético Aviación"] },
  { name: "Athletic Bilbao", short: "Athletic", espnId: "93", aliases: ["Athletic Club", "Athletic Club (Bilbao)", "Athletic de Bilbao"] },
  { name: "Valencia", short: "Valencia", espnId: "94", aliases: ["Valencia CF"] },
  { name: "Sevilla", short: "Sevilla", espnId: "243", aliases: ["Sevilla FC"] },
  { name: "Espanyol", short: "Espanyol", espnId: "88", aliases: ["RCD Espanyol", "RCD Espanyol de Barcelona", "RCD Espanyol (Barcelona)"] },
  { name: "Real Sociedad", short: "Real Sociedad", espnId: "89", aliases: ["Real Sociedad (San Sebastián)"] },
  { name: "Real Betis", short: "Betis", espnId: "244", aliases: ["Real Betis Balompié", "Real Betis Balompié (Sevilla)"] },
  { name: "Villarreal", short: "Villarreal", espnId: "102", aliases: ["Villarreal CF"] },
  { name: "Celta Vigo", short: "Celta", espnId: "85", aliases: ["RC Celta (Vigo)", "RC Celta de Vigo"] },
  { name: "Deportivo La Coruña", short: "Deportivo", espnId: "90", aliases: ["RC Deportivo de La Coruña", "RC Deportivo (La Coruña)", "Deportivo"] },
  { name: "Real Zaragoza", short: "Zaragoza", aliases: [] },
  { name: "Osasuna", short: "Osasuna", espnId: "97", aliases: ["CA Osasuna", "CA Osasuna (Pamplona)"] },
  { name: "Mallorca", short: "Mallorca", espnId: "84", aliases: ["Real CD Mallorca", "RCD Mallorca", "RCD Mallorca (Palma de M.)"] },
  { name: "Getafe", short: "Getafe", espnId: "2922", aliases: ["Getafe CF"] },
  { name: "Racing de Santander", short: "Racing Santander", espnId: "331", aliases: ["Racing Santander", "Real Racing Club de Santander"] },
  { name: "Real Oviedo", short: "Oviedo", espnId: "212", aliases: ["Oviedo"] },
] as const;

export const laLigaRivalries: LaLigaRivalry[] = [
  {
    id: "el-clasico",
    name: "El Clásico",
    club1: "Barcelona",
    club2: "Real Madrid",
    description: "A historic rivalry between Spain's two most successful clubs, watched around the world.",
    leagueMeetings: 192,
    club1Wins: 77,
    club2Wins: 80,
    draws: 35,
    club1Goals: 309,
    club2Goals: 312,
    biggestWins: [
      { club: "Barcelona", score: "Barcelona 7-2 Real Madrid", date: "24 September 1950" },
      { club: "Real Madrid", score: "Real Madrid 8-2 Barcelona", date: "3 February 1935" },
    ],
    topScorers: [{ player: "Lionel Messi", club: "Barcelona", goals: 26 }],
  },
  {
    id: "madrid-derby",
    name: "Madrid Derby",
    club1: "Real Madrid",
    club2: "Atlético Madrid",
    description: "The capital's city rivalry, contested across league, cup, and European competition.",
    leagueMeetings: 178,
    club1Wins: 92,
    club2Wins: 42,
    draws: 44,
    club1Goals: 307,
    club2Goals: 233,
    biggestWins: [
      { club: "Real Madrid", score: "Real Madrid 5-0 Atlético Madrid", date: "2 November 1958" },
      { club: "Atlético Madrid", score: "Atlético Madrid 5-0 Real Madrid", date: "23 November 1947" },
    ],
    topScorers: [{ player: "Cristiano Ronaldo", club: "Real Madrid", goals: 22 }],
  },
  {
    id: "basque-derby",
    name: "Basque Derby",
    club1: "Athletic Bilbao",
    club2: "Real Sociedad",
    description: "A regional derby between two leading Basque clubs with a long history in the top flight.",
    leagueMeetings: 158,
    club1Wins: 63,
    club2Wins: 54,
    draws: 41,
    club1Goals: 254,
    club2Goals: 212,
    biggestWins: [
      { club: "Athletic Bilbao", score: "Athletic Bilbao 7-0 Real Sociedad", date: "2 March 1935" },
      { club: "Real Sociedad", score: "Real Sociedad 5-0 Athletic Bilbao", date: "5 December 1976" },
    ],
    topScorers: [
      { player: "Telmo Zarra", club: "Athletic Bilbao", goals: 14 },
      { player: "Jesús María Satrústegui", club: "Real Sociedad", goals: 14 },
    ],
  },
  {
    id: "seville-derby",
    name: "Seville Derby",
    club1: "Sevilla",
    club2: "Real Betis",
    description: "A fierce city rivalry that divides Seville whenever its two clubs meet.",
    leagueMeetings: 109,
    club1Wins: 50,
    club2Wins: 32,
    draws: 27,
    club1Goals: 164,
    club2Goals: 131,
    biggestWins: [
      { club: "Sevilla", score: "Sevilla 5-1 Real Betis", date: "18 November 2012" },
      { club: "Real Betis", score: "Real Betis 4-0 Sevilla", date: "20 April 1980" },
    ],
    topScorers: [
      { player: "Miguel López Torrontegui", club: "Sevilla", goals: 7 },
      { player: "Julio Cardeñosa", club: "Real Betis", goals: 7 },
    ],
  },
  {
    id: "galician-derby",
    name: "Galician Derby",
    club1: "Celta Vigo",
    club2: "Deportivo La Coruña",
    description: "A regional rivalry between Galicia's best-known clubs.",
    leagueMeetings: 70,
    club1Wins: 26,
    club2Wins: 25,
    draws: 19,
    club1Goals: 94,
    club2Goals: 99,
    biggestWins: [
      { club: "Celta Vigo", score: "Celta Vigo 8-0 Deportivo La Coruña", date: "27 April 1941" },
      { club: "Deportivo La Coruña", score: "Deportivo La Coruña 5-0 Celta Vigo", date: "3 January 2004" },
    ],
    topScorers: [{ player: "Vladimir Gudelj", club: "Celta Vigo", goals: 6 }],
  },
  {
    id: "valencian-derby",
    name: "Valencian Derby",
    club1: "Valencia",
    club2: "Villarreal",
    description: "A regional contest between two prominent clubs from the Valencian Community.",
    leagueMeetings: 44,
    club1Wins: 21,
    club2Wins: 14,
    draws: 9,
    club1Goals: 76,
    club2Goals: 75,
    biggestWins: [
      { club: "Valencia", score: "Valencia 5-0 Villarreal", date: "10 April 2011" },
      { club: "Villarreal", score: "Villarreal 4-1 Valencia", date: "27 October 2013" },
    ],
    topScorers: [{ player: "Juan Sánchez", club: "Valencia", goals: 7 }],
  },
];
