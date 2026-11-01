import { ligue1AllTime, ligue1Seasons } from "@/data/ligue1History";

export { ligue1AllTime, ligue1Seasons };

export const ligue1Winners = ligue1Seasons
  .filter((season) => !season.champion.startsWith("Not awarded"))
  .map((season) => ({
    season: season.season,
    winner: season.champion,
    runnerUp: season.runnerUp,
    topScorer: season.topScorer,
    goals: season.goals,
  }));

type Ligue1Club = { name: string; short: string; espnId?: string; aliases: string[] };
type Ligue1Rivalry = {
  id: string; name: string; club1: string; club2: string; description: string;
  leagueMeetings: number; club1Wins: number; club2Wins: number; draws: number;
  club1Goals?: number; club2Goals?: number;
  biggestWins: { club: string; score: string; date: string }[];
  topScorers: { player: string; club: string; goals: number }[];
};

export const ligue1Clubs: Ligue1Club[] = [
  { name: "AJ Auxerre", short: "Auxerre", espnId: "172", aliases: ["Auxerre", "AJA"] },
  { name: "AS Monaco", short: "Monaco", espnId: "174", aliases: ["Monaco", "Monaco FC"] },
  { name: "Angers SCO", short: "Angers", espnId: "7868", aliases: ["Angers", "SCO Angers"] },
  { name: "Stade Brestois 29", short: "Brest", espnId: "6997", aliases: ["Brest", "Stade Brestois"] },
  { name: "Le Havre AC", short: "Le Havre", espnId: "3236", aliases: ["Le Havre"] },
  { name: "Le Mans FC", short: "Le Mans", espnId: "2697", aliases: ["Le Mans"] },
  { name: "RC Lens", short: "Lens", espnId: "175", aliases: ["Lens"] },
  { name: "Lille OSC", short: "Lille", espnId: "166", aliases: ["Lille", "LOSC", "Lille OSC", "Olympique Lillois"] },
  { name: "FC Lorient", short: "Lorient", espnId: "273", aliases: ["Lorient"] },
  { name: "Olympique Lyonnais", short: "Lyon", espnId: "167", aliases: ["Lyon", "OL"] },
  { name: "Olympique de Marseille", short: "Marseille", espnId: "176", aliases: ["Marseille", "OM"] },
  { name: "OGC Nice", short: "Nice", espnId: "2502", aliases: ["Nice"] },
  { name: "Paris FC", short: "Paris FC", espnId: "6851", aliases: ["PFC"] },
  { name: "Paris Saint-Germain", short: "PSG", espnId: "160", aliases: ["PSG", "Paris SG", "Paris Saint-Germain FC"] },
  { name: "Stade Rennais FC", short: "Rennes", espnId: "169", aliases: ["Rennes", "Stade Rennais"] },
  { name: "RC Strasbourg Alsace", short: "Strasbourg", espnId: "180", aliases: ["Strasbourg", "RC Strasbourg"] },
  { name: "Toulouse FC", short: "Toulouse", espnId: "179", aliases: ["Toulouse"] },
  { name: "ES Troyes AC", short: "Troyes", espnId: "170", aliases: ["Troyes", "ESTAC"] },
  { name: "AS Saint-Étienne", short: "Saint-Étienne", aliases: ["Saint-Étienne", "Saint-Etienne", "ASSE"] },
  { name: "FC Girondins de Bordeaux", short: "Bordeaux", aliases: ["Bordeaux", "Girondins Bordeaux"] },
  { name: "FC Nantes", short: "Nantes", aliases: ["Nantes"] },
  { name: "Montpellier HSC", short: "Montpellier", aliases: ["Montpellier"] },
  { name: "FC Metz", short: "Metz", aliases: ["Metz"] },
  { name: "Stade de Reims", short: "Reims", aliases: ["Reims"] },
  { name: "AS Nancy-Lorraine", short: "Nancy", aliases: ["Nancy"] },
  { name: "FC Sochaux-Montbéliard", short: "Sochaux", aliases: ["Sochaux"] },
  { name: "Nîmes Olympique", short: "Nîmes", aliases: ["Nîmes", "Nimes"] },
  { name: "SC Bastia", short: "Bastia", aliases: ["Bastia"] },
  { name: "EA Guingamp", short: "Guingamp", aliases: ["Guingamp"] },
  { name: "SM Caen", short: "Caen", aliases: ["Caen"] },
  { name: "Valenciennes FC", short: "Valenciennes", aliases: ["Valenciennes"] },
  { name: "AS Cannes", short: "Cannes", aliases: ["Cannes"] },
  { name: "CS Sedan Ardennes", short: "Sedan", aliases: ["Sedan"] },
  { name: "FC Rouen", short: "Rouen", aliases: ["Rouen"] },
  { name: "Red Star FC", short: "Red Star", aliases: ["Red Star"] },
  { name: "RC Paris", short: "Racing Paris", aliases: ["Racing Club de France", "Racing Paris"] },
  { name: "FC Sète", short: "Sète", aliases: ["Sète", "Sete"] },
  { name: "CO Roubaix-Tourcoing", short: "Roubaix-Tourcoing", aliases: ["Roubaix-Tourcoing"] },
  { name: "SC Fives", short: "Fives", aliases: ["Fives"] },
  { name: "Toulouse FC (1937)", short: "Toulouse (1937)", aliases: ["Toulouse (1937)"] },
  { name: "Stade Français", short: "Stade Français", aliases: ["Stade Francais"] },
  { name: "Angoulême CFC", short: "Angoulême", aliases: ["Angouleme"] },
];

export const ligue1Rivalries: Ligue1Rivalry[] = [
  { id: "le-classique", name: "Le Classique", club1: "Paris Saint-Germain", club2: "Olympique de Marseille", description: "The high-profile rivalry between France's capital club and its most decorated Mediterranean side.", leagueMeetings: 94, club1Wins: 41, club2Wins: 33, draws: 20, club1Goals: 137, club2Goals: 108, biggestWins: [{ club: "Olympique de Marseille", score: "Marseille 4-0 Paris Saint-Germain", date: "28 November 1986" }], topScorers: [{ player: "Zlatan Ibrahimović", club: "Paris Saint-Germain", goals: 11 }] },
  { id: "derby-rhone", name: "Derby rhônalpin", club1: "Olympique Lyonnais", club2: "AS Saint-Étienne", description: "The regional derby between Lyon and Saint-Étienne, separated by roughly 50 kilometres.", leagueMeetings: 114, club1Wins: 42, club2Wins: 40, draws: 32, biggestWins: [], topScorers: [] },
  { id: "derby-du-nord", name: "Derby du Nord", club1: "Lille OSC", club2: "RC Lens", description: "The northern derby between neighbouring clubs Lille and Lens.", leagueMeetings: 31, club1Wins: 16, club2Wins: 6, draws: 9, biggestWins: [], topScorers: [] },
  { id: "cote-azur", name: "Derby de la Côte d'Azur", club1: "AS Monaco", club2: "OGC Nice", description: "The Côte d'Azur derby between Monaco and Nice, the two leading clubs of the French Riviera.", leagueMeetings: 110, club1Wins: 47, club2Wins: 30, draws: 33, club1Goals: 149, club2Goals: 132, biggestWins: [], topScorers: [] },
  { id: "choc-olympiques", name: "Choc des Olympiques", club1: "Olympique Lyonnais", club2: "Olympique de Marseille", description: "A major fixture between the two Olympique clubs, often involving the title race or European places.", leagueMeetings: 112, club1Wins: 38, club2Wins: 34, draws: 40, club1Goals: 176, club2Goals: 176, biggestWins: [], topScorers: [] },
  { id: "psg-lyon", name: "PSG–Lyon", club1: "Paris Saint-Germain", club2: "Olympique Lyonnais", description: "A modern marquee fixture between Paris and Lyon, both frequent title contenders.", leagueMeetings: 47, club1Wins: 24, club2Wins: 13, draws: 10, biggestWins: [], topScorers: [] },
  { id: "marseille-nice", name: "Marseille–Nice", club1: "Olympique de Marseille", club2: "OGC Nice", description: "A southern coastal rivalry between two clubs with long histories in the top division.", leagueMeetings: 50, club1Wins: 27, club2Wins: 14, draws: 9, biggestWins: [], topScorers: [] },
  { id: "marseille-monaco", name: "Marseille–Monaco", club1: "Olympique de Marseille", club2: "AS Monaco", description: "A high-profile Mediterranean fixture between Marseille and Monaco.", leagueMeetings: 60, club1Wins: 23, club2Wins: 21, draws: 16, club1Goals: 84, club2Goals: 92, biggestWins: [], topScorers: [] },
  { id: "psg-monaco", name: "PSG–Monaco", club1: "Paris Saint-Germain", club2: "AS Monaco", description: "A regular contest between Paris and Monaco, often involving the Ligue 1 title.", leagueMeetings: 99, club1Wins: 26, club2Wins: 45, draws: 28, biggestWins: [{ club: "Paris Saint-Germain", score: "Paris Saint-Germain 7-1 Monaco", date: "15 April 2018" }], topScorers: [] },
  { id: "derby-breton", name: "Derby breton", club1: "Stade Rennais FC", club2: "FC Nantes", description: "The Breton derby between Rennes and Nantes, two established western French clubs.", leagueMeetings: 53, club1Wins: 23, club2Wins: 16, draws: 14, biggestWins: [], topScorers: [] },
];