import type { Competition } from "@/lib/gameRoom";
import { footballPlayersForClub, normalizeFootballPlayerName } from "@/data/footballTicTacToe";

export type DuelClub = { key: string; label: string; badge: string };

const espn = (id: number) => `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`;
const local = (file: string) => `/club-logos/${file}.svg`;

const c = (key: string, label: string, badge: string): DuelClub => ({ key, label, badge });

const MUN = c("mun", "Manchester United", local("man-utd"));
const LIV = c("liv", "Liverpool", local("liverpool"));
const ARS = c("ars", "Arsenal", local("arsenal"));
const CHE = c("che", "Chelsea", local("chelsea"));
const MCI = c("mci", "Manchester City", local("man-city"));
const TOT = c("tot", "Tottenham", local("tottenham"));

// Clubs currently in each competition that have enough known players to guess from.
export const DUEL_CLUBS: Record<Competition, DuelClub[]> = {
  pl: [
    MUN, LIV, ARS, CHE, MCI, TOT,
    c("eve", "Everton", local("everton")),
    c("new", "Newcastle", local("newcastle")),
    c("wham", "West Ham", local("west-ham")),
    c("avl", "Aston Villa", local("aston-villa")),
  ],
  laliga: [
    c("rma", "Real Madrid", espn(86)),
    c("bar", "Barcelona", espn(83)),
    c("atm", "Atlético Madrid", espn(1068)),
    c("val", "Valencia", espn(94)),
    c("sev", "Sevilla", espn(243)),
    c("vil", "Villarreal", espn(102)),
    c("ath", "Athletic Club", espn(93)),
    c("soc", "Real Sociedad", espn(89)),
    c("bet", "Real Betis", espn(244)),
  ],
  seriea: [
    c("juv", "Juventus", espn(111)),
    c("inter", "Inter", espn(110)),
    c("mil", "AC Milan", espn(103)),
    c("rom", "Roma", espn(104)),
    c("nap", "Napoli", espn(114)),
    c("laz", "Lazio", espn(112)),
    c("fio", "Fiorentina", espn(109)),
    c("ata", "Atalanta", espn(105)),
    c("par", "Parma", espn(115)),
    c("tor", "Torino", espn(239)),
    c("gen", "Genoa", espn(3263)),
    c("udi", "Udinese", espn(118)),
  ],
  ucl: [
    c("rma", "Real Madrid", espn(86)),
    c("bar", "Barcelona", espn(83)),
    c("bay", "Bayern Munich", espn(132)),
    c("juv", "Juventus", espn(111)),
    c("inter", "Inter", espn(110)),
    c("mil", "AC Milan", espn(103)),
    c("psg", "PSG", espn(160)),
    c("mci", "Manchester City", espn(382)),
    c("liv", "Liverpool", espn(364)),
    c("che", "Chelsea", espn(363)),
    c("dor", "Dortmund", espn(124)),
    c("mun", "Manchester United", espn(360)),
    c("ajax", "Ajax", espn(139)),
    c("ars", "Arsenal", espn(359)),
    c("atm", "Atlético Madrid", espn(1068)),
  ],
};

export const clubByKey = (comp: Competition, key: string) => DUEL_CLUBS[comp].find((club) => club.key === key);

export const DUEL_WIN_SCORE = 5;
export const DUEL_PICK_MS = 20_000;
export const DUEL_GUESS_MS = 60_000;
export const DUEL_RESULT_MS = 3_500;

// Returns the canonical player name if the guess is a full name, or a surname that is unique at that club.
export function matchClubPlayer(comp: Competition, clubKey: string, guess: string): string | null {
  const normalized = normalizeFootballPlayerName(guess);
  if (normalized.length < 3) return null;
  const players = footballPlayersForClub(comp, clubKey);
  const exact = players.find((name) => normalizeFootballPlayerName(name) === normalized);
  if (exact) return exact;

  const bySurname = players.filter((name) => {
    const parts = name.split(" ");
    return parts.length > 1 && normalizeFootballPlayerName(parts[parts.length - 1]) === normalized;
  });
  return bySurname.length === 1 && normalized.length >= 4 ? bySurname[0] : null;
}
