// ESPN's public soccer API powers the La Liga section: standings, fixtures, leaders and live match detail.
import type { LineupPlayer, MatchDetail, MatchEvent, MatchStatus, Side, StatRow, TeamDetail } from "@/lib/matchDetail";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

const SITE = "https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1";
export const ESPN_STANDINGS = "https://site.api.espn.com/apis/v2/sports/soccer/esp.1/standings";
export const ESPN_SEASON = 2026;
export const espnBadge = (teamId: string) => `https://a.espncdn.com/i/teamlogos/soccer/500/${teamId}.png`;
export const espnHeadshot = (athleteId: string) => `https://a.espncdn.com/i/headshots/soccer/players/full/${athleteId}.png`;

export async function espnJson(url: string, revalidate = 0): Promise<Json> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    ...(revalidate ? { next: { revalidate } } : { cache: "no-store" as const }),
  });
  if (!response.ok) throw new Error(`ESPN feed returned ${response.status}`);
  return response.json();
}

const num = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// ---------------------------------------------------------------- Fixtures

export type LlFixture = {
  id: string;
  date: string; // ISO
  matchweek: number;
  state: "pre" | "in" | "post";
  detail: string;
  home: { id: string; name: string; score?: number };
  away: { id: string; name: string; score?: number };
};

function toFixture(event: Json): LlFixture | null {
  const comp = event.competitions?.[0];
  const home = comp?.competitors?.find((c: Json) => c.homeAway === "home");
  const away = comp?.competitors?.find((c: Json) => c.homeAway === "away");
  if (!home || !away) return null;
  const score = (c: Json) => {
    const value = typeof c.score === "object" ? c.score?.value : c.score;
    return value === undefined || value === "" ? undefined : num(value);
  };
  const type = event.status?.type ?? comp?.status?.type ?? {};
  return {
    id: String(event.id),
    date: event.date,
    matchweek: 0,
    state: type.state ?? "pre",
    detail: type.state === "post" ? "FT" : type.name === "STATUS_HALFTIME" ? "HT" : (type.shortDetail ?? ""),
    home: { id: String(home.team.id), name: home.team.shortDisplayName ?? home.team.displayName, score: score(home) },
    away: { id: String(away.team.id), name: away.team.shortDisplayName ?? away.team.displayName, score: score(away) },
  };
}

const dayKey = (iso: string) => iso.slice(0, 10).replace(/-/g, "");

// A scoreboard day gives live scores; the schedules give the whole season
async function scoreboardDay(day: string): Promise<LlFixture[]> {
  try {
    const board = await espnJson(`${SITE}/scoreboard?dates=${day}`);
    return (board.events ?? []).map(toFixture).filter(Boolean) as LlFixture[];
  } catch {
    return [];
  }
}

export async function teamIds(): Promise<string[]> {
  const standings = await espnJson(ESPN_STANDINGS, 3600);
  return (standings.children?.[0]?.standings?.entries ?? []).map((entry: Json) => String(entry.team.id));
}

async function teamSchedule(team: string): Promise<LlFixture[]> {
  const [played, upcoming] = await Promise.all([
    espnJson(`${SITE}/teams/${team}/schedule?season=${ESPN_SEASON}`, 600).catch(() => ({ events: [] })),
    espnJson(`${SITE}/teams/${team}/schedule?season=${ESPN_SEASON}&fixture=true`, 600).catch(() => ({ events: [] })),
  ]);
  return [...(played.events ?? []), ...(upcoming.events ?? [])].map(toFixture).filter(Boolean) as LlFixture[];
}

// Matchweek N is each club's Nth league game, which stays right through postponements well enough
export async function seasonFixtures(): Promise<LlFixture[]> {
  const ids = await teamIds();
  const all = new Map<string, LlFixture>();
  for (const list of await Promise.all(ids.map(teamSchedule))) for (const f of list) all.set(f.id, f);
  const fixtures = [...all.values()].sort((a, b) => a.date.localeCompare(b.date));
  const count = new Map<string, number>();
  for (const f of fixtures) {
    const week = (count.get(f.home.id) ?? 0) + 1;
    count.set(f.home.id, week);
    count.set(f.away.id, Math.max(count.get(f.away.id) ?? 0, week - 1) + 1);
    f.matchweek = week;
  }
  return fixtures;
}

// Overlay live scores from the scoreboard for the days in play
export async function withLiveScores(fixtures: LlFixture[]): Promise<LlFixture[]> {
  const now = Date.now();
  const days = new Set(
    fixtures
      .filter((f) => f.state !== "post" && Math.abs(new Date(f.date).getTime() - now) < 36 * 3600_000)
      .map((f) => dayKey(f.date))
  );
  const fresh = new Map<string, LlFixture>();
  for (const list of await Promise.all([...days].map(scoreboardDay))) for (const f of list) fresh.set(f.id, f);
  return fixtures.map((f) => {
    const live = fresh.get(f.id);
    return live ? { ...live, matchweek: f.matchweek } : f;
  });
}

// ---------------------------------------------------------------- Match detail

const STAT_ROWS: [string, string, boolean?][] = [
  ["possessionPct", "Possession", true],
  ["totalShots", "Shots"],
  ["shotsOnTarget", "Shots on target"],
  ["totalPasses", "Passes"],
  ["passPct", "Pass accuracy", true],
  ["wonCorners", "Corners"],
  ["foulsCommitted", "Fouls"],
  ["offsides", "Offsides"],
  ["yellowCards", "Yellow cards"],
  ["redCards", "Red cards"],
  ["saves", "Saves"],
  ["totalCrosses", "Crosses"],
  ["totalTackles", "Tackles"],
  ["interceptions", "Interceptions"],
  ["totalClearance", "Clearances"],
];

const Y_RANK = (abbr: string) => {
  if (/^(LB|RB|LWB|RWB|CD|SW|D)/.test(abbr)) return 1;
  if (/^(DM|CDM)/.test(abbr)) return 2;
  if (/^(AM|LW|RW|CAM)/.test(abbr)) return 4;
  if (/^(F|CF|ST|LF|RF|SS|S)/.test(abbr)) return 5;
  return 3;
};
const X_PREF = (abbr: string) => {
  const tokens = abbr.split("-");
  if (tokens.some((t) => /^L/.test(t))) return 0;
  if (tokens.some((t) => /^R/.test(t))) return 2;
  return 1;
};

function layoutStarters(starters: LineupPlayer[], abbrs: Map<string, string>, formation?: string): LineupPlayer[] {
  const keeper = starters.filter((p) => abbrs.get(p.id) === "G");
  const field = starters.filter((p) => abbrs.get(p.id) !== "G");
  field.sort((a, b) => Y_RANK(abbrs.get(a.id) ?? "") - Y_RANK(abbrs.get(b.id) ?? ""));
  let sizes = (formation ?? "").split("-").map(Number).filter(Boolean);
  if (sizes.reduce((s, n) => s + n, 0) !== field.length) {
    const ranks = new Map<number, number>();
    for (const p of field) ranks.set(Y_RANK(abbrs.get(p.id) ?? ""), (ranks.get(Y_RANK(abbrs.get(p.id) ?? "")) ?? 0) + 1);
    sizes = [...ranks.entries()].sort((a, b) => a[0] - b[0]).map(([, n]) => n);
  }
  const out: LlFixtureLineup = [];
  keeper.forEach((p) => out.push({ ...p, x: 500, y: 50, role: "GK" }));
  let cursor = 0;
  sizes.forEach((size, row) => {
    const rowPlayers = field
      .slice(cursor, cursor + size)
      .sort((a, b) => X_PREF(abbrs.get(a.id) ?? "") - X_PREF(abbrs.get(b.id) ?? ""));
    cursor += size;
    const y = sizes.length > 1 ? 230 + (row / (sizes.length - 1)) * 650 : 500;
    rowPlayers.forEach((p, i) => out.push({ ...p, x: ((i + 1) / (rowPlayers.length + 1)) * 1000, y }));
  });
  return out;
}
type LlFixtureLineup = LineupPlayer[];

function parseMinute(display: string): { minute: number; extra?: number } {
  const match = String(display).match(/(\d+)'?(?:\s*\+\s*(\d+))?/);
  return { minute: match ? Number(match[1]) : 0, extra: match?.[2] ? Number(match[2]) : undefined };
}

export async function fetchLaLigaMatch(id: string): Promise<MatchDetail> {
  const data = await espnJson(`${SITE}/summary?event=${id}`);
  const header = data.header?.competitions?.[0];
  if (!header) throw new Error("Match not found");
  const homeC = header.competitors.find((c: Json) => c.homeAway === "home");
  const awayC = header.competitors.find((c: Json) => c.homeAway === "away");
  const type = header.status?.type ?? {};
  const status: MatchStatus = type.state === "post" ? "finished" : type.state === "in" ? "live" : "upcoming";
  const statusText = status === "finished" ? "FT" : type.name === "STATUS_HALFTIME" ? "HT" : status === "live" ? (type.shortDetail ?? "LIVE") : "";
  const homeId = String(homeC.team.id);

  const names = new Map<string, string>();
  const teamOf = (c: Json, side: Side): TeamDetail => {
    const roster = (data.rosters ?? []).find((r: Json) => String(r.team?.id) === String(c.team.id));
    const abbrs = new Map<string, string>();
    const toPlayer = (entry: Json): LineupPlayer => {
      const athlete = entry.athlete ?? {};
      const playerId = String(athlete.id);
      names.set(playerId, athlete.displayName ?? athlete.fullName ?? "Unknown");
      abbrs.set(playerId, entry.position?.abbreviation ?? "");
      return {
        id: playerId,
        name: athlete.shortName ?? athlete.displayName ?? "Unknown",
        number: entry.jersey ? Number(entry.jersey) : undefined,
        photo: espnHeadshot(playerId),
        role: entry.position?.abbreviation,
      };
    };
    const entries: Json[] = roster?.roster ?? [];
    const starters = layoutStarters(entries.filter((e) => e.starter).map(toPlayer), abbrs, roster?.formation);
    const bench = entries
      .filter((e) => !e.starter)
      .map(toPlayer)
      .sort((a, b) => (a.number ?? 99) - (b.number ?? 99));
    const score = c.score === undefined || c.score === "" ? null : num(c.score);
    return {
      id: String(c.team.id),
      name: c.team.displayName ?? c.team.shortDisplayName,
      logo: espnBadge(String(c.team.id)),
      score: status === "upcoming" ? null : score,
      formation: roster?.formation,
      starters,
      bench,
    };
    void side;
  };
  const home = teamOf(homeC, "home");
  const away = teamOf(awayC, "away");

  const events: MatchEvent[] = [];
  for (const raw of data.keyEvents ?? []) {
    const t = String(raw.type?.type ?? "");
    const isGoal = raw.scoringPlay === true || t.startsWith("goal") || t.startsWith("penalty---scored") || t === "own-goal";
    const isCard = t === "yellow-card" || t === "red-card";
    if (!isGoal && !isCard && t !== "substitution") continue;
    if (raw.shootout) continue;
    const { minute, extra } = parseMinute(raw.clock?.displayValue ?? "0");
    const teamSide: Side = String(raw.team?.id) === homeId ? "home" : "away";
    const people: Json[] = raw.participants ?? [];
    const actor = people[0]?.athlete;
    const second = people[1]?.athlete;
    const text = String(raw.text ?? "");
    const base = { id: String(raw.id), minute, extra };

    if (t === "substitution") {
      // ESPN lists the player coming on first, then the one leaving
      events.push({ ...base, kind: "sub", side: teamSide, playerId: String(second?.id ?? ""), player: second?.displayName ?? "Unknown", otherId: String(actor?.id ?? ""), other: actor?.displayName });
    } else if (isCard) {
      const secondYellow = /second yellow/i.test(text);
      events.push({ ...base, kind: t === "yellow-card" ? "yellow" : secondYellow ? "second_yellow" : "red", side: teamSide, playerId: String(actor?.id ?? ""), player: actor?.displayName ?? "Unknown" });
    } else {
      const own = /own goal/i.test(text) || t === "own-goal";
      const pen = /penalty/i.test(t) || /penalty/i.test(text.slice(0, 40));
      const assisted = /assisted by/i.test(text) && second;
      events.push({
        ...base,
        kind: own ? "own_goal" : pen ? "penalty" : "goal",
        // Own goals count for the opposing team
        side: own ? (teamSide === "home" ? "away" : "home") : teamSide,
        playerId: String(actor?.id ?? ""),
        player: actor?.displayName ?? "Unknown",
        otherId: assisted ? String(second.id) : undefined,
        other: assisted ? second.displayName : undefined,
      });
    }
  }
  events.sort((a, b) => a.minute + (a.extra ?? 0) / 100 - (b.minute + (b.extra ?? 0) / 100) || Number(a.id) - Number(b.id));

  const statsByTeam = new Map<string, Json[]>();
  for (const team of data.boxscore?.teams ?? []) statsByTeam.set(String(team.team?.id), team.statistics ?? []);
  const statRows: StatRow[] = [];
  const homeStats = statsByTeam.get(homeId) ?? [];
  const awayStats = statsByTeam.get(String(awayC.team.id)) ?? [];
  const pick = (list: Json[], key: string) => list.find((s) => s.name === key)?.displayValue;
  for (const [key, label, percent] of STAT_ROWS) {
    const h = pick(homeStats, key);
    const a = pick(awayStats, key);
    if (h === undefined && a === undefined) continue;
    statRows.push({ label, home: num(h), away: num(a), percent });
  }

  const firstHalf = events.filter((e) => ["goal", "penalty", "own_goal"].includes(e.kind) && e.minute <= 45);
  const halfTime =
    status === "upcoming"
      ? undefined
      : { home: firstHalf.filter((e) => e.side === "home").length, away: firstHalf.filter((e) => e.side === "away").length };

  return {
    comp: "laliga",
    id,
    status,
    statusText,
    kickoff: header.date ?? data.header?.date ?? "",
    venue: data.gameInfo?.venue?.fullName,
    attendance: data.gameInfo?.attendance || undefined,
    referee: data.gameInfo?.officials?.[0]?.fullName ?? data.gameInfo?.officials?.[0]?.displayName,
    home,
    away,
    halfTime,
    events,
    stats: statRows,
  };
}
