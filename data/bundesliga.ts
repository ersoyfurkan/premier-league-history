import { bundesligaAllTime, bundesligaSeasons } from "@/data/bundesligaHistory";

export { bundesligaAllTime, bundesligaSeasons };

export const bundesligaWinners = bundesligaSeasons.map((season) => ({
  season: season.season,
  winner: season.champion,
  runnerUp: season.runnerUp,
  topScorer: season.topScorer,
  goals: season.goals,
}));

type BundesligaClub = { name: string; short: string; espnId?: string; aliases: string[] };
type BundesligaRivalry = {
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

export const bundesligaClubs: BundesligaClub[] = [
  { name: "1. FC Union Berlin", short: "Union Berlin", espnId: "598", aliases: ["Union", "1. FC Union Berlin"] },
  { name: "Bayer Leverkusen", short: "Leverkusen", espnId: "131", aliases: ["Bayer 04 Leverkusen", "Bayer 04", "Werkself"] },
  { name: "Bayern Munich", short: "Bayern", espnId: "132", aliases: ["FC Bayern Munich", "FC Bayern", "Bayern München"] },
  { name: "Borussia Dortmund", short: "Dortmund", espnId: "124", aliases: ["BVB", "Borussia Dortmund"] },
  { name: "Borussia Mönchengladbach", short: "Gladbach", espnId: "268", aliases: ["Mönchengladbach", "Monchengladbach", "Gladbach"] },
  { name: "Eintracht Frankfurt", short: "Frankfurt", espnId: "125", aliases: ["Eintracht", "Frankfurt"] },
  { name: "FC Augsburg", short: "Augsburg", espnId: "3841", aliases: ["Augsburg"] },
  { name: "1. FC Köln", short: "Köln", espnId: "122", aliases: ["FC Cologne", "Cologne", "Köln", "FC Köln"] },
  { name: "Hamburger SV", short: "Hamburg", espnId: "127", aliases: ["Hamburg SV", "HSV", "Hamburger Sport-Verein"] },
  { name: "Mainz 05", short: "Mainz", espnId: "2950", aliases: ["1. FSV Mainz 05", "Mainz 05"] },
  { name: "RB Leipzig", short: "Leipzig", espnId: "11420", aliases: ["RasenBallsport Leipzig", "RB Leipzig"] },
  { name: "SC Freiburg", short: "Freiburg", espnId: "126", aliases: ["Sport-Club Freiburg"] },
  { name: "SC Paderborn 07", short: "Paderborn", espnId: "3307", aliases: ["SC Paderborn", "Paderborn 07"] },
  { name: "SV Elversberg", short: "Elversberg", espnId: "10388", aliases: ["Elversberg"] },
  { name: "Schalke 04", short: "Schalke", espnId: "133", aliases: ["FC Schalke 04", "Schalke 04"] },
  { name: "TSG Hoffenheim", short: "Hoffenheim", espnId: "7911", aliases: ["1899 Hoffenheim", "TSG 1899 Hoffenheim"] },
  { name: "VfB Stuttgart", short: "Stuttgart", espnId: "134", aliases: ["Stuttgart"] },
  { name: "Werder Bremen", short: "Werder", espnId: "137", aliases: ["SV Werder Bremen", "Bremen"] },
  { name: "1. FC Kaiserslautern", short: "Kaiserslautern", aliases: ["Kaiserslautern", "FCK"] },
  { name: "1. FC Nürnberg", short: "Nürnberg", aliases: ["Nuremberg", "Nürnberg"] },
  { name: "Hertha BSC", short: "Hertha", aliases: ["Hertha Berlin", "Hertha BSC Berlin"] },
  { name: "VfL Wolfsburg", short: "Wolfsburg", aliases: ["Wolfsburg"] },
  { name: "VfL Bochum", short: "Bochum", aliases: ["Bochum"] },
  { name: "Fortuna Düsseldorf", short: "Düsseldorf", aliases: ["Fortuna Dusseldorf", "Düsseldorf"] },
  { name: "Karlsruher SC", short: "Karlsruhe", aliases: ["Karlsruhe", "KSC"] },
  { name: "Eintracht Braunschweig", short: "Braunschweig", aliases: ["Braunschweig"] },
  { name: "MSV Duisburg", short: "Duisburg", aliases: ["Meidericher SV", "Duisburg"] },
  { name: "Arminia Bielefeld", short: "Bielefeld", aliases: ["Bielefeld"] },
  { name: "KFC Uerdingen", short: "Uerdingen", aliases: ["Bayer Uerdingen", "FC Bayer 05 Uerdingen"] },
  { name: "Hansa Rostock", short: "Rostock", aliases: ["Hansa"] },
  { name: "FC St. Pauli", short: "St. Pauli", aliases: ["St Pauli", "St. Pauli"] },
  { name: "Waldhof Mannheim", short: "Waldhof", aliases: ["SV Waldhof Mannheim"] },
  { name: "Kickers Offenbach", short: "Offenbach", aliases: ["Offenbach"] },
  { name: "Rot-Weiss Essen", short: "Essen", aliases: ["Rot-Weiß Essen"] },
  { name: "Energie Cottbus", short: "Cottbus", aliases: ["Cottbus"] },
  { name: "Alemannia Aachen", short: "Aachen", aliases: ["Aachen"] },
  { name: "Wattenscheid 09", short: "Wattenscheid", aliases: ["SG Wattenscheid 09"] },
  { name: "1. FC Saarbrücken", short: "Saarbrücken", aliases: ["Saarbrucken"] },
  { name: "Dynamo Dresden", short: "Dresden", aliases: ["SG Dynamo Dresden"] },
  { name: "Rot-Weiß Oberhausen", short: "Oberhausen", aliases: ["Rot-Weiss Oberhausen", "RWO"] },
  { name: "SV Darmstadt 98", short: "Darmstadt", aliases: ["Darmstadt 98"] },
  { name: "Wuppertaler SV", short: "Wuppertal", aliases: ["Wuppertal"] },
  { name: "1. FC Heidenheim", short: "Heidenheim", aliases: ["Heidenheim 1846"] },
  { name: "Borussia Neunkirchen", short: "Neunkirchen", aliases: ["Neunkirchen"] },
  { name: "FC 08 Homburg", short: "Homburg", aliases: ["Homburg"] },
  { name: "SpVgg Unterhaching", short: "Unterhaching", aliases: ["Unterhaching"] },
  { name: "Stuttgarter Kickers", short: "Kickers", aliases: ["Stuttgart Kickers"] },
  { name: "FC Ingolstadt 04", short: "Ingolstadt", aliases: ["Ingolstadt"] },
  { name: "Greuther Fürth", short: "Fürth", aliases: ["SpVgg Greuther Fürth", "Greuther Fuerth"] },
  { name: "SSV Ulm 1846", short: "Ulm", aliases: ["SSV Ulm"] },
  { name: "SC Fortuna Köln", short: "Fortuna Köln", aliases: ["Fortuna Cologne"] },
  { name: "Preußen Münster", short: "Münster", aliases: ["Preussen Munster"] },
  { name: "Holstein Kiel", short: "Kiel", aliases: ["Kiel"] },
  { name: "Blau-Weiß 1890 Berlin", short: "Blau-Weiß", aliases: ["Blau-Weiss 1890 Berlin"] },
  { name: "VfB Leipzig", short: "VfB Leipzig", aliases: ["VfB Leipzig"] },
  { name: "Tasmania 1900 Berlin", short: "Tasmania", aliases: ["SC Tasmania 1900 Berlin"] },
];

// Records are league-only and reflect source snapshots available during compilation; cups are excluded.
export const bundesligaRivalries: BundesligaRivalry[] = [
  { id: "der-klassiker", name: "Der Klassiker", club1: "Bayern Munich", club2: "Borussia Dortmund", description: "The modern marquee matchup between Germany's most successful club and its most consistent challenger.", leagueMeetings: 116, club1Wins: 54, club2Wins: 29, draws: 33, club1Goals: 223, club2Goals: 140, biggestWins: [{ club: "Bayern Munich", score: "Bayern Munich 11-1 Borussia Dortmund", date: "27 November 1971" }], topScorers: [{ player: "Robert Lewandowski", club: "Bayern Munich", goals: 16 }, { player: "Gerd Müller", club: "Bayern Munich", goals: 11 }] },
  { id: "revierderby", name: "Revierderby", club1: "Borussia Dortmund", club2: "Schalke 04", description: "The Ruhr region derby between Dortmund and Schalke, two clubs separated by fierce local rivalry.", leagueMeetings: 99, club1Wins: 37, club2Wins: 31, draws: 31, biggestWins: [{ club: "Schalke 04", score: "Schalke 04 0-7 Borussia Dortmund", date: "26 February 1966" }], topScorers: [{ player: "Manfred Burgsmüller", club: "Borussia Dortmund", goals: 6 }] },
  { id: "nordderby", name: "Nordderby", club1: "Hamburger SV", club2: "Werder Bremen", description: "The northern Germany rivalry between Hamburg and Bremen.", leagueMeetings: 108, club1Wins: 38, club2Wins: 48, draws: 22, biggestWins: [{ club: "Werder Bremen", score: "Werder Bremen 6-0 Hamburger SV", date: "1 March 1986" }], topScorers: [{ player: "Claudio Pizarro", club: "Werder Bremen", goals: 10 }] },
  { id: "rheinland-derby", name: "Rheinland Derby", club1: "1. FC Köln", club2: "Borussia Mönchengladbach", description: "A fierce regional rivalry between clubs from neighboring cities in the Rhineland.", leagueMeetings: 95, club1Wins: 34, club2Wins: 32, draws: 29, biggestWins: [{ club: "Borussia Mönchengladbach", score: "Borussia Mönchengladbach 5-0 1. FC Köln", date: "2 April 1977" }], topScorers: [{ player: "Jupp Heynckes", club: "Borussia Mönchengladbach", goals: 9 }] },
  { id: "koeln-leverkusen", name: "Köln–Leverkusen derby", club1: "1. FC Köln", club2: "Bayer Leverkusen", description: "A local derby between Cologne and Leverkusen, separated by the Rhine and a short journey.", leagueMeetings: 69, club1Wins: 15, club2Wins: 29, draws: 25, biggestWins: [{ club: "Bayer Leverkusen", score: "Bayer Leverkusen 5-1 1. FC Köln", date: "5 March 2011" }], topScorers: [{ player: "Ulf Kirsten", club: "Bayer Leverkusen", goals: 7 }] },
  { id: "bayern-leverkusen", name: "Bayern–Leverkusen", club1: "Bayern Munich", club2: "Bayer Leverkusen", description: "A regular title-contending fixture; Leverkusen ended Bayern's long title run in 2024.", leagueMeetings: 88, club1Wins: 52, club2Wins: 18, draws: 18, biggestWins: [{ club: "Bayern Munich", score: "Bayern Munich 6-2 Bayer Leverkusen", date: "30 September 2017" }], topScorers: [{ player: "Gerd Müller", club: "Bayern Munich", goals: 10 }] },
  { id: "rhein-main-derby", name: "Rhein-Main derby", club1: "Eintracht Frankfurt", club2: "Mainz 05", description: "The Rhine-Main regional rivalry between Frankfurt and Mainz.", leagueMeetings: 32, club1Wins: 13, club2Wins: 10, draws: 9, biggestWins: [{ club: "Eintracht Frankfurt", score: "Eintracht Frankfurt 3-0 Mainz 05", date: "multiple dates" }], topScorers: [{ player: "Alexander Meier", club: "Eintracht Frankfurt", goals: 5 }] },
  { id: "bayern-werder", name: "Bayern–Werder", club1: "Bayern Munich", club2: "Werder Bremen", description: "A classic Bundesliga matchup that has often featured high-scoring games and title races.", leagueMeetings: 113, club1Wins: 60, club2Wins: 27, draws: 26, biggestWins: [{ club: "Bayern Munich", score: "Bayern Munich 6-1 Werder Bremen", date: "23 February 2013" }], topScorers: [{ player: "Gerd Müller", club: "Bayern Munich", goals: 12 }] },
  { id: "borussen-derby", name: "Borussen derby", club1: "Borussia Dortmund", club2: "Borussia Mönchengladbach", description: "The Bundesliga meeting of the two clubs commonly known as the Borussians.", leagueMeetings: 99, club1Wins: 44, club2Wins: 25, draws: 30, biggestWins: [{ club: "Borussia Dortmund", score: "Borussia Dortmund 6-0 Borussia Mönchengladbach", date: "13 February 2022" }], topScorers: [{ player: "Marco Reus", club: "Borussia Dortmund", goals: 10 }] },
];
