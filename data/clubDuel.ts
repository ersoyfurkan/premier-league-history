import { REAL_COMPETITIONS, TOURNAMENT_COMPETITIONS, type Competition, type RealCompetition } from "@/lib/competitions";
import { footballCareers, normalizeFootballPlayerName, playerInComp } from "@/data/footballTicTacToe";

export type DuelClub = { key: string; label: string; badge: string };

const espn = (id: number) => `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`;
const local = (file: string) => `/club-logos/${file}.svg`;
const c = (key: string, label: string, badge = ""): DuelClub => ({ key, label, badge });

// Clubs in each competition for the 2026-27 season. An empty badge shows initials instead.
const REAL_DUEL_CLUBS: Record<RealCompetition, DuelClub[]> = {
  pl: [
    c("ars", "Arsenal", local("arsenal")),
    c("avl", "Aston Villa", local("aston-villa")),
    c("bou", "Bournemouth", local("bournemouth")),
    c("bre", "Brentford", local("brentford")),
    c("bha", "Brighton", local("brighton")),
    c("che", "Chelsea", local("chelsea")),
    c("cov", "Coventry City", espn(388)),
    c("cry", "Crystal Palace", local("crystal-palace")),
    c("eve", "Everton", local("everton")),
    c("fulham", "Fulham", local("fulham")),
    c("hul", "Hull City", espn(306)),
    c("ips", "Ipswich Town", espn(373)),
    c("lee", "Leeds United", local("leeds")),
    c("liv", "Liverpool", local("liverpool")),
    c("mci", "Manchester City", local("man-city")),
    c("mun", "Manchester United", local("man-utd")),
    c("new", "Newcastle", local("newcastle")),
    c("nfo", "Nottingham Forest", local("nottingham-forest")),
    c("sun", "Sunderland", local("sunderland")),
    c("tot", "Tottenham", local("tottenham")),
  ],
  laliga: [
    c("alv", "Alavés", espn(96)),
    c("ath", "Athletic Club", espn(93)),
    c("atm", "Atlético Madrid", espn(1068)),
    c("bar", "Barcelona", espn(83)),
    c("cel", "Celta Vigo", espn(85)),
    c("dep", "Deportivo La Coruña", espn(90)),
    c("elc", "Elche", espn(3751)),
    c("esp", "Espanyol", espn(88)),
    c("get", "Getafe", espn(2922)),
    c("lvt", "Levante", espn(1538)),
    c("mal", "Málaga", espn(99)),
    c("osa", "Osasuna", espn(97)),
    c("rac", "Racing Santander", espn(87)),
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
    c("com", "Como", espn(2572)),
    c("fio", "Fiorentina", espn(109)),
    c("fro", "Frosinone", espn(4057)),
    c("gen", "Genoa", espn(3263)),
    c("inter", "Inter", espn(110)),
    c("juv", "Juventus", espn(111)),
    c("laz", "Lazio", espn(112)),
    c("lec", "Lecce", espn(113)),
    c("mil", "AC Milan", espn(103)),
    c("mnz", "Monza", espn(4007)),
    c("nap", "Napoli", espn(114)),
    c("par", "Parma", espn(115)),
    c("rom", "Roma", espn(104)),
    c("sas", "Sassuolo", espn(3997)),
    c("tor", "Torino", espn(239)),
    c("udi", "Udinese", espn(118)),
    c("ven", "Venezia", espn(17530)),
  ],
  ucl: [
    c("aek", "AEK Athens", espn(887)),
    c("ars", "Arsenal", espn(359)),
    c("atm", "Atlético Madrid", espn(1068)),
    c("avl", "Aston Villa", espn(362)),
    c("bar", "Barcelona", espn(83)),
    c("bay", "Bayern Munich", espn(132)),
    c("bet", "Real Betis", espn(244)),
    c("bod", "Bodø/Glimt", espn(2980)),
    c("bru", "Club Brugge", espn(570)),
    c("dor", "Dortmund", espn(124)),
    c("fen", "Fenerbahçe", espn(436)),
    c("fey", "Feyenoord", espn(142)),
    c("gal", "Galatasaray", espn(432)),
    c("inter", "Inter", espn(110)),
    c("lask", "LASK", espn(4411)),
    c("lens", "Lens", espn(175)),
    c("lil", "Lille", espn(166)),
    c("liv", "Liverpool", espn(364)),
    c("mci", "Manchester City", espn(382)),
    c("mun", "Manchester United", espn(360)),
    c("nap", "Napoli", espn(114)),
    c("por", "Porto", espn(437)),
    c("psg", "PSG", espn(160)),
    c("psv", "PSV", espn(148)),
    c("rbl", "RB Leipzig", espn(11420)),
    c("rma", "Real Madrid", espn(86)),
    c("rom", "Roma", espn(104)),
    c("sab", "Sabah", espn(21922)),
    c("sha", "Shakhtar Donetsk", espn(493)),
    c("sla", "Slavia Praha", espn(494)),
    c("slo", "Slovan Bratislava", espn(521)),
    c("spo", "Sporting CP", espn(2250)),
    c("stu", "Stuttgart", espn(134)),
    c("vik", "Viking", espn(510)),
    c("vil", "Villarreal", espn(102)),
    c("com", "Como", espn(2572)),
  ],
  bundesliga: [
    c("fcu", "Union Berlin", espn(598)),
    c("lev", "Bayer Leverkusen", espn(131)),
    c("bay", "Bayern Munich", espn(132)),
    c("dor", "Borussia Dortmund", espn(124)),
    c("bmg", "Borussia Mönchengladbach", espn(268)),
    c("sge", "Eintracht Frankfurt", espn(125)),
    c("fca", "FC Augsburg", espn(3841)),
    c("koe", "1. FC Köln", espn(122)),
    c("hsv", "Hamburg SV", espn(127)),
    c("mai", "Mainz 05", espn(2950)),
    c("rbl", "RB Leipzig", espn(11420)),
    c("fre", "SC Freiburg", espn(126)),
    c("pad", "SC Paderborn 07", espn(3307)),
    c("els", "SV Elversberg", espn(10388)),
    c("s04", "Schalke 04", espn(133)),
    c("hof", "TSG Hoffenheim", espn(7911)),
    c("stu", "VfB Stuttgart", espn(134)),
    c("wer", "Werder Bremen", espn(137)),
  ],
  ligue1: [
    c("aux", "Auxerre", espn(172)),
    c("mon", "Monaco", espn(174)),
    c("ang", "Angers", espn(7868)),
    c("bst", "Brest", espn(6997)),
    c("leh", "Le Havre", espn(3236)),
    c("lem", "Le Mans", espn(2697)),
    c("lens", "Lens", espn(175)),
    c("lil", "Lille", espn(166)),
    c("lor", "Lorient", espn(273)),
    c("lyon", "Lyon", espn(167)),
    c("mar", "Marseille", espn(176)),
    c("nic", "Nice", espn(2502)),
    c("pfc", "Paris FC", espn(6851)),
    c("psg", "Paris Saint-Germain", espn(160)),
    c("ren", "Rennes", espn(169)),
    c("str", "Strasbourg", espn(180)),
    c("tou", "Toulouse", espn(179)),
    c("tro", "Troyes", espn(170)),
  ],
  superlig: [
    c("ala", "Alanyaspor", espn(9078)),
    c("amd", "Amed SFK", espn(132335)),
    c("bes", "Beşiktaş", espn(1895)),
    c("riz", "Çaykur Rizespor", espn(7656)),
    c("erz", "Erzurum BB", espn(19267)),
    c("eyu", "Eyüpspor", espn(20729)),
    c("fen", "Fenerbahçe", espn(436)),
    c("gal", "Galatasaray", espn(432)),
    c("gaz", "Gaziantep FK", espn(20070)),
    c("gnc", "Gençlerbirliği", espn(996)),
    c("goz", "Göztepe", espn(789)),
    c("ibf", "İstanbul Başakşehir", espn(7914)),
    c("kas", "Kasımpaşa", espn(6870)),
    c("koc", "Kocaelispor", espn(995)),
    c("kon", "Konyaspor", espn(7648)),
    c("sms", "Samsunspor", espn(11429)),
    c("tra", "Trabzonspor", espn(997)),
    c("cor", "Çorum FK", espn(132334)),
  ],
};

// General mode: any club from any league, de-duplicated by key.
const ALL_CLUBS = [...new Map(REAL_COMPETITIONS.flatMap((comp) => REAL_DUEL_CLUBS[comp]).map((club) => [club.key, club])).values()];
export const DUEL_CLUBS: Record<Competition, DuelClub[]> = {
  ...REAL_DUEL_CLUBS,
  ...(Object.fromEntries(TOURNAMENT_COMPETITIONS.map((comp) => [comp, ALL_CLUBS])) as Record<(typeof TOURNAMENT_COMPETITIONS)[number], DuelClub[]>),
  general: ALL_CLUBS,
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
  careers = footballCareers().map(({ name, clubs }) => ({ name, clubs: new Set(clubs) }));
  return careers;
}

// For the international tournaments only players of the competing nations count.
export const playersForClub = (key: string, comp?: Competition) =>
  allCareers().filter((player) => player.clubs.has(key) && (!comp || playerInComp(comp, player.name))).map((player) => player.name);

export const playersForBoth = (a: string, b: string, comp?: Competition) =>
  allCareers().filter((player) => player.clubs.has(a) && player.clubs.has(b) && (!comp || playerInComp(comp, player.name))).map((player) => player.name);

// Autocomplete over every known player from the league's clubs, so suggestions never reveal the answer.
export function searchDuelPlayers(comp: Competition, query: string, limit = 8): string[] {
  const q = normalizeFootballPlayerName(query);
  if (q.length < 2) return [];
  const keys = new Set(DUEL_CLUBS[comp].map((club) => club.key));
  const hits = allCareers().filter(
    (player) => [...player.clubs].some((club) => keys.has(club)) && playerInComp(comp, player.name) && normalizeFootballPlayerName(player.name).includes(q),
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
export function matchSharedPlayer(a: string, b: string, guess: string, comp?: Competition): string | null {
  const normalized = normalizeFootballPlayerName(guess);
  if (normalized.length < 3) return null;
  const players = playersForBoth(a, b, comp);
  const exact = players.find((name) => normalizeFootballPlayerName(name) === normalized);
  if (exact) return exact;
  const bySurname = players.filter((name) => {
    const parts = name.split(" ");
    return parts.length > 1 && normalizeFootballPlayerName(parts[parts.length - 1]) === normalized;
  });
  return bySurname.length === 1 && normalized.length >= 4 ? bySurname[0] : null;
}
