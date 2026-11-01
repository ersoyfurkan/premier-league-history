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

export const laLigaRivalries = [
  {
    id: "el-clasico",
    name: "El Clásico",
    club1: "Barcelona",
    club2: "Real Madrid",
    description: "A historic rivalry between Spain's two most successful clubs, watched around the world.",
  },
  {
    id: "madrid-derby",
    name: "Madrid Derby",
    club1: "Real Madrid",
    club2: "Atlético Madrid",
    description: "The capital's city rivalry, contested across league, cup, and European competition.",
  },
  {
    id: "basque-derby",
    name: "Basque Derby",
    club1: "Athletic Bilbao",
    club2: "Real Sociedad",
    description: "A regional derby between two leading Basque clubs with a long history in the top flight.",
  },
  {
    id: "seville-derby",
    name: "Seville Derby",
    club1: "Sevilla",
    club2: "Real Betis",
    description: "A fierce city rivalry that divides Seville whenever its two clubs meet.",
  },
  {
    id: "galician-derby",
    name: "Galician Derby",
    club1: "Celta Vigo",
    club2: "Deportivo La Coruña",
    description: "A regional rivalry between Galicia's best-known clubs.",
  },
  {
    id: "valencian-derby",
    name: "Valencian Derby",
    club1: "Valencia",
    club2: "Villarreal",
    description: "A regional contest between two prominent clubs from the Valencian Community.",
  },
];
