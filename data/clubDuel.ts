import type { Competition } from "@/lib/gameRoom";
import { footballCareers, normalizeFootballPlayerName } from "@/data/footballTicTacToe";
import { CAREERS } from "@/data/clubDuelCareers";

export type DuelClub = { key: string; label: string; badge: string };

const espn = (id: number) => `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`;
const local = (file: string) => `/club-logos/${file}.svg`;
const c = (key: string, label: string, badge = ""): DuelClub => ({ key, label, badge });

// Clubs in each competition for the 2025-26 season. An empty badge shows initials instead.
export const DUEL_CLUBS: Record<Competition, DuelClub[]> = {
  pl: [
    c("ars", "Arsenal", local("arsenal")),
    c("avl", "Aston Villa", local("aston-villa")),
    c("bou", "Bournemouth", local("bournemouth")),
    c("bre", "Brentford", local("brentford")),
    c("bha", "Brighton", local("brighton")),
    c("bur", "Burnley", local("burnley")),
    c("che", "Chelsea", local("chelsea")),
    c("cry", "Crystal Palace", local("crystal-palace")),
    c("eve", "Everton", local("everton")),
    c("fulham", "Fulham", local("fulham")),
    c("lee", "Leeds United", local("leeds")),
    c("liv", "Liverpool", local("liverpool")),
    c("mci", "Manchester City", local("man-city")),
    c("mun", "Manchester United", local("man-utd")),
    c("new", "Newcastle", local("newcastle")),
    c("nfo", "Nottingham Forest", local("nottingham-forest")),
    c("sun", "Sunderland", local("sunderland")),
    c("tot", "Tottenham", local("tottenham")),
    c("wham", "West Ham", local("west-ham")),
    c("wol", "Wolves", local("wolverhampton")),
  ],
  laliga: [
    c("alv", "Alavés", espn(96)),
    c("ath", "Athletic Club", espn(93)),
    c("atm", "Atlético Madrid", espn(1068)),
    c("bar", "Barcelona", espn(83)),
    c("cel", "Celta Vigo", espn(85)),
    c("elc", "Elche"),
    c("esp", "Espanyol", espn(88)),
    c("get", "Getafe", espn(2922)),
    c("gir", "Girona"),
    c("lvt", "Levante"),
    c("mll", "Mallorca", espn(84)),
    c("osa", "Osasuna", espn(97)),
    c("ovi", "Real Oviedo"),
    c("ray", "Rayo Vallecano", espn(101)),
    c("bet", "Real Betis", espn(244)),
    c("rma", "Real Madrid", espn(86)),
    c("soc", "Real Sociedad", espn(89)),
    c("sev", "Sevilla", espn(243)),
    c("val", "Valencia", espn(94)),
    c("vil", "Villarreal", espn(102)),
  ],
  seriea: [
    c("ata", "Atalanta", espn(105)),
    c("bol", "Bologna", espn(107)),
    c("cag", "Cagliari", espn(2925)),
    c("com", "Como"),
    c("cre", "Cremonese"),
    c("fio", "Fiorentina", espn(109)),
    c("gen", "Genoa", espn(3263)),
    c("ver", "Hellas Verona", espn(119)),
    c("inter", "Inter", espn(110)),
    c("juv", "Juventus", espn(111)),
    c("laz", "Lazio", espn(112)),
    c("lec", "Lecce"),
    c("mil", "AC Milan", espn(103)),
    c("nap", "Napoli", espn(114)),
    c("par", "Parma", espn(115)),
    c("pis", "Pisa"),
    c("rom", "Roma", espn(104)),
    c("sas", "Sassuolo"),
    c("tor", "Torino", espn(239)),
    c("udi", "Udinese", espn(118)),
  ],
  ucl: [
    c("aek", "AEK Athens"),
    c("ars", "Arsenal", espn(359)),
    c("atm", "Atlético Madrid", espn(1068)),
    c("avl", "Aston Villa", espn(362)),
    c("bar", "Barcelona", espn(83)),
    c("bay", "Bayern Munich", espn(132)),
    c("bet", "Real Betis", espn(244)),
    c("bod", "Bodø/Glimt"),
    c("bru", "Club Brugge"),
    c("dor", "Dortmund", espn(124)),
    c("fen", "Fenerbahçe"),
    c("fey", "Feyenoord"),
    c("gal", "Galatasaray"),
    c("inter", "Inter", espn(110)),
    c("lask", "LASK"),
    c("lens", "Lens"),
    c("lil", "Lille"),
    c("liv", "Liverpool", espn(364)),
    c("mci", "Manchester City", espn(382)),
    c("mun", "Manchester United", espn(360)),
    c("nap", "Napoli", espn(114)),
    c("por", "Porto"),
    c("psg", "PSG", espn(160)),
    c("psv", "PSV", espn(148)),
    c("rbl", "RB Leipzig"),
    c("rma", "Real Madrid", espn(86)),
    c("rom", "Roma", espn(104)),
    c("sab", "Sabah"),
    c("sha", "Shakhtar Donetsk"),
    c("sla", "Slavia Praha"),
    c("slo", "Slovan Bratislava"),
    c("spo", "Sporting CP", espn(2250)),
    c("stu", "Stuttgart"),
    c("vik", "Viking"),
    c("vil", "Villarreal", espn(102)),
    c("com", "Como"),
  ],
};

export const clubByKey = (comp: Competition, key: string) => DUEL_CLUBS[comp].find((club) => club.key === key);

export const DUEL_WIN_SCORE = 5;
export const DUEL_PICK_MS = 20_000;
export const DUEL_GUESS_MS = 60_000;
export const DUEL_RESULT_MS = 3_500;

type Career = { name: string; clubs: Set<string> };
let careers: Career[] | null = null;

function allCareers() {
  if (careers) return careers;
  const byName = new Map<string, Career>();
  const add = (name: string, clubs: string[]) => {
    const id = normalizeFootballPlayerName(name);
    const existing = byName.get(id);
    if (existing) clubs.forEach((club) => existing.clubs.add(club));
    else byName.set(id, { name, clubs: new Set(clubs) });
  };
  for (const entry of footballCareers()) add(entry.name, entry.clubs);
  for (const line of CAREERS.split("\n")) {
    const [name, keys] = line.split(":");
    if (name && keys) add(name.trim(), keys.trim().split(/\s+/));
  }
  careers = [...byName.values()];
  return careers;
}

export const playersForBoth = (a: string, b: string) =>
  allCareers().filter((player) => player.clubs.has(a) && player.clubs.has(b)).map((player) => player.name);

// Autocomplete over every known player from the league's clubs, so suggestions never reveal the answer.
export function searchDuelPlayers(comp: Competition, query: string, limit = 8): string[] {
  const q = normalizeFootballPlayerName(query);
  if (q.length < 2) return [];
  const keys = new Set(DUEL_CLUBS[comp].map((club) => club.key));
  const hits = allCareers().filter(
    (player) => [...player.clubs].some((club) => keys.has(club)) && normalizeFootballPlayerName(player.name).includes(q),
  );
  const starts = (name: string) => {
    const n = normalizeFootballPlayerName(name);
    return n.startsWith(q) || n.split(" ").some((part) => part.startsWith(q)) ? 0 : 1;
  };
  return hits
    .map((player) => player.name)
    .sort((a, b) => starts(a) - starts(b))
    .slice(0, limit);
}

// Returns the canonical player name if the guess is a full name, or a surname that is unique among the shared players.
export function matchSharedPlayer(a: string, b: string, guess: string): string | null {
  const normalized = normalizeFootballPlayerName(guess);
  if (normalized.length < 3) return null;
  const players = playersForBoth(a, b);
  const exact = players.find((name) => normalizeFootballPlayerName(name) === normalized);
  if (exact) return exact;
  const bySurname = players.filter((name) => {
    const parts = name.split(" ");
    return parts.length > 1 && normalizeFootballPlayerName(parts[parts.length - 1]) === normalized;
  });
  return bySurname.length === 1 && normalized.length >= 4 ? bySurname[0] : null;
}
