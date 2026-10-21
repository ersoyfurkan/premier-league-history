// Normalises the Premier League and UEFA match feeds into one shape so a single UI can show either.

export type Comp = "pl" | "ucl" | "laliga";
export type MatchStatus = "upcoming" | "live" | "finished";
export type Side = "home" | "away";

export type LineupPlayer = {
  id: string;
  name: string;
  number?: number;
  photo?: string;
  x?: number; // 0 (left) to 1000 (right)
  y?: number; // 0 (own goal line) to 1000 (opposition goal line)
  role?: string;
};

export type TeamDetail = {
  id: string;
  name: string;
  logo?: string;
  score: number | null;
  formation?: string;
  coach?: string;
  starters: LineupPlayer[];
  bench: LineupPlayer[];
};

export type EventKind = "goal" | "own_goal" | "penalty" | "yellow" | "red" | "second_yellow" | "sub";

export type MatchEvent = {
  id: string;
  minute: number;
  extra?: number;
  kind: EventKind;
  side: Side;
  playerId: string;
  player: string;
  otherId?: string; // assist provider for goals, player coming on for substitutions
  other?: string;
};

export type StatRow = { label: string; home: number; away: number; percent?: boolean };

export type MatchDetail = {
  comp: Comp;
  id: string;
  status: MatchStatus;
  statusText: string;
  kickoff: string;
  round?: string;
  venue?: string;
  attendance?: number;
  referee?: string;
  home: TeamDetail;
  away: TeamDetail;
  halfTime?: { home: number; away: number };
  events: MatchEvent[];
  stats: StatRow[];
};

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const UEFA_MATCH = "https://match.uefa.com/v5/matches";
const UEFA_STATS = "https://matchstats.uefa.com/v1/team-statistics";
const PL_BASE = "https://sdp-prem-prod.premier-league-prod.pulselive.com/api";

async function getJson(url: string, headers: Record<string, string> = {}, optional = false): Promise<Json> {
  const response = await fetch(url, { headers: { Accept: "application/json", ...headers }, cache: "no-store" });
  if (!response.ok) {
    if (optional) return null;
    throw new Error(`Feed returned ${response.status}`);
  }
  return response.json();
}

const num = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function sortEvents(events: MatchEvent[]) {
  return events.sort((a, b) => a.minute + (a.extra ?? 0) / 100 - (b.minute + (b.extra ?? 0) / 100));
}

// ---------------------------------------------------------------- UEFA

const UEFA_STAT_ROWS: [string, string, boolean?][] = [
  ["ball_possession", "Possession", true],
  ["attempts", "Shots"],
  ["attempts_on_target", "Shots on target"],
  ["passes_attempted", "Passes"],
  ["passes_accuracy", "Pass accuracy", true],
  ["corners", "Corners"],
  ["fouls_committed", "Fouls"],
  ["offsides", "Offsides"],
  ["yellow_cards", "Yellow cards"],
  ["red_cards", "Red cards"],
  ["saves", "Saves"],
  ["cross_attempted", "Crosses"],
  ["clearance_attempted", "Clearances"],
  ["recovered_ball", "Ball recoveries"],
];

function uefaStatus(match: Json): { status: MatchStatus; text: string } {
  const phase = String(match.phase ?? "");
  if (match.status === "FINISHED") return { status: "finished", text: "FT" };
  if (match.status === "LIVE") {
    if (phase.includes("HALF_TIME")) return { status: "live", text: "HT" };
    const normal = match.minute?.normal;
    const injury = match.minute?.injury;
    if (normal === undefined) return { status: "live", text: "LIVE" };
    return { status: "live", text: injury ? `${normal}+${injury}'` : `${normal}'` };
  }
  return { status: "upcoming", text: "" };
}

function uefaPlayer(entry: Json, withPosition: boolean): LineupPlayer {
  const player = entry.player ?? {};
  return {
    id: String(player.id),
    name: player.internationalName ?? player.clubShirtName ?? "Unknown",
    number: entry.jerseyNumber,
    photo: player.imageUrl,
    x: withPosition ? entry.fieldCoordinate?.x : undefined,
    y: withPosition ? entry.fieldCoordinate?.y : undefined,
    role: entry.type === "GOALKEEPER" ? "GK" : undefined,
  };
}

function uefaEvents(raw: Json[], homeId: string, scorers: Json[]): MatchEvent[] {
  const time = (event: Json) => ({
    minute: num(event.time?.minute),
    extra: event.time?.injuryMinute ? num(event.time.injuryMinute) : undefined,
  });
  const seconds = (event: Json) => num(event.time?.minute) * 60 + num(event.time?.second);
  const sideOf = (event: Json): Side => (String(event.primaryActor?.team?.id) === homeId ? "home" : "away");
  const assists = raw.filter((event) => event.type === "ASSIST");
  const out: MatchEvent[] = [];

  for (const event of raw) {
    const actor = event.primaryActor?.person;
    const base = { id: String(event.id), ...time(event), playerId: String(actor?.id ?? ""), player: actor?.internationalName ?? "" };

    if (event.type === "GOAL") {
      const scorer = scorers.find(
        (item) => String(item.player?.id) === base.playerId && num(item.time?.minute) === base.minute,
      );
      const goalType = String(scorer?.goalType ?? "");
      const own = goalType.includes("OWN");
      const side = sideOf(event);
      const assist = assists
        .filter(
          (item) =>
            String(item.primaryActor?.team?.id) === String(event.primaryActor?.team?.id) &&
            seconds(item) <= seconds(event) &&
            seconds(event) - seconds(item) <= 45,
        )
        .sort((a, b) => seconds(b) - seconds(a))[0];
      out.push({
        ...base,
        kind: own ? "own_goal" : goalType.includes("PENALTY") ? "penalty" : "goal",
        // An own goal is credited to the other side
        side: own ? (side === "home" ? "away" : "home") : side,
        otherId: assist ? String(assist.primaryActor.person.id) : undefined,
        other: assist?.primaryActor?.person?.internationalName,
      });
    } else if (event.type === "YELLOW_CARD") {
      out.push({ ...base, kind: "yellow", side: sideOf(event) });
    } else if (event.type === "RED_CARD") {
      out.push({ ...base, kind: "red", side: sideOf(event) });
    } else if (event.type === "YELLOW_RED_CARD" || event.type === "SECOND_YELLOW_CARD") {
      out.push({ ...base, kind: "second_yellow", side: sideOf(event) });
    } else if (event.type === "SUBSTITUTION") {
      // The primary actor is the player leaving the pitch
      out.push({
        ...base,
        kind: "sub",
        side: sideOf(event),
        otherId: String(event.secondaryActor?.person?.id ?? ""),
        other: event.secondaryActor?.person?.internationalName,
      });
    }
  }
  return sortEvents(out);
}

export async function fetchUclMatch(id: string): Promise<MatchDetail> {
  const match = await getJson(`${UEFA_MATCH}/${id}`);
  const { status, text } = uefaStatus(match);
  const homeId = String(match.homeTeam.id);

  const [lineups, events, stats] = await Promise.all([
    getJson(`${UEFA_MATCH}/${id}/lineups`, {}, true),
    status === "upcoming" ? null : getJson(`${UEFA_MATCH}/${id}/events?filter=ALL&offset=0&limit=500`, {}, true),
    status === "upcoming" ? null : getJson(`${UEFA_STATS}/${id}`, {}, true),
  ]);

  const team = (side: "homeTeam" | "awayTeam"): TeamDetail => {
    const info = match[side];
    const lineup = lineups?.[side];
    return {
      id: String(info.id),
      name: info.internationalName,
      logo: info.logoUrl,
      score: status === "upcoming" ? null : num(match.score?.total?.[side === "homeTeam" ? "home" : "away"]),
      coach: lineup?.coaches?.find((coach: Json) => coach.role === "COACH")?.person?.translations?.name?.EN,
      starters: (lineup?.field ?? []).map((entry: Json) => uefaPlayer(entry, true)),
      bench: (lineup?.bench ?? []).map((entry: Json) => uefaPlayer(entry, false)),
    };
  };

  const statRows: StatRow[] = [];
  if (Array.isArray(stats) && stats.length === 2) {
    const byTeam = (teamId: string) => {
      const entry = stats.find((item: Json) => String(item.teamId) === teamId);
      return new Map<string, number>((entry?.statistics ?? []).map((item: Json) => [item.name, num(item.value)]));
    };
    const home = byTeam(homeId);
    const away = byTeam(String(match.awayTeam.id));
    for (const [key, label, percent] of UEFA_STAT_ROWS) {
      if (!home.has(key) && !away.has(key)) continue;
      statRows.push({ label, home: home.get(key) ?? 0, away: away.get(key) ?? 0, percent });
    }
  }

  const referee = (match.referees ?? []).find((item: Json) => item.role === "REFEREE")?.person?.translations?.name?.EN;

  return {
    comp: "ucl",
    id,
    status,
    statusText: text,
    kickoff: match.kickOffTime?.dateTime ?? match.kickOffTime?.date,
    round: match.matchday?.longName,
    venue: [match.stadium?.translations?.name?.EN, match.stadium?.city?.translations?.name?.EN].filter(Boolean).join(", ") || undefined,
    attendance: match.matchAttendance || undefined,
    referee,
    home: team("homeTeam"),
    away: team("awayTeam"),
    events: Array.isArray(events) ? uefaEvents(events, homeId, match.playerEvents?.scorers ?? []) : [],
    stats: statRows,
  };
}

// ---------------------------------------------------------------- Premier League

const PL_HEADERS = { Origin: "https://www.premierleague.com" };
const plBadge = (teamId: string) => `https://resources.premierleague.com/premierleague/badges/50/t${teamId}.png`;

const PL_STAT_ROWS: [string, string, boolean?][] = [
  ["possessionPercentage", "Possession", true],
  ["totalScoringAtt", "Shots"],
  ["ontargetScoringAtt", "Shots on target"],
  ["bigChanceCreated", "Big chances"],
  ["totalPass", "Passes"],
  ["cornerTaken", "Corners"],
  ["fkFoulLost", "Fouls"],
  ["totalOffside", "Offsides"],
  ["totalYelCard", "Yellow cards"],
  ["totalRedCard", "Red cards"],
  ["saves", "Saves"],
  ["totalTackle", "Tackles"],
  ["totalClearance", "Clearances"],
  ["ballRecovery", "Ball recoveries"],
];

function plStatus(period: string, clock: unknown): { status: MatchStatus; text: string } {
  if (period === "FullTime") return { status: "finished", text: "FT" };
  if (period === "HalfTime") return { status: "live", text: "HT" };
  if (period === "PreMatch" || period === "") return { status: "upcoming", text: "" };
  const minutes = parseInt(String(clock), 10);
  return { status: "live", text: Number.isFinite(minutes) ? `${minutes}'` : "LIVE" };
}

// The feed gives local UK kick-off times with a timezone abbreviation
function plKickoff(match: Json): string {
  const offset = match.kickoffTimezone === "BST" ? "+01:00" : "+00:00";
  return `${String(match.kickoff).replace(" ", "T")}${offset}`;
}

export async function fetchPlMatch(id: string): Promise<MatchDetail> {
  const info = await getJson(`${PL_BASE}/v2/matches/${id}`, PL_HEADERS);
  const { status, text } = plStatus(info.period, info.clock);
  const homeId = String(info.homeTeam.id);
  const awayId = String(info.awayTeam.id);

  const [lineups, events, stats] = await Promise.all([
    getJson(`${PL_BASE}/v1/matches/${id}/lineups`, PL_HEADERS, true),
    status === "upcoming" ? null : getJson(`${PL_BASE}/v1/matches/${id}/events`, PL_HEADERS, true),
    status === "upcoming" ? null : getJson(`${PL_BASE}/v3/matches/${id}/stats`, PL_HEADERS, true),
  ]);

  const names = new Map<string, string>();
  const photoId = new Map<string, string>();
  for (const side of lineups ?? []) {
    for (const player of side.players ?? []) {
      names.set(String(player.id), player.knownName ?? `${player.firstName} ${player.lastName}`.trim());
      photoId.set(String(player.id), String(player.id));
    }
  }

  const team = (teamId: string, label: Json): TeamDetail => {
    const lineup = (lineups ?? []).find((item: Json) => String(item.teamId) === teamId);
    const rows: string[][] = lineup?.lineup ?? [];
    const starters: LineupPlayer[] = [];
    rows.forEach((row, rowIndex) => {
      row.forEach((playerId, columnIndex) => {
        starters.push({
          id: String(playerId),
          name: names.get(String(playerId)) ?? "Unknown",
          photo: undefined,
          x: ((columnIndex + 1) / (row.length + 1)) * 1000,
          y: rows.length > 1 ? 60 + (rowIndex / (rows.length - 1)) * 800 : 500,
          role: rowIndex === 0 ? "GK" : undefined,
        });
      });
    });
    return {
      id: teamId,
      name: label.name,
      logo: plBadge(teamId),
      score: status === "upcoming" ? null : num(label.score),
      formation: lineup?.formation,
      starters,
      bench: (lineup?.subs ?? []).map((playerId: string) => ({ id: String(playerId), name: names.get(String(playerId)) ?? "Unknown" })),
    };
  };

  const out: MatchEvent[] = [];
  for (const [key, side] of [["homeTeam", "home"], ["awayTeam", "away"]] as const) {
    const part = events?.[key];
    if (!part) continue;
    const name = (playerId: unknown) => names.get(String(playerId)) ?? "Unknown";
    for (const goal of part.goals ?? []) {
      const type = String(goal.goalType ?? "");
      const own = /own/i.test(type);
      out.push({
        id: `${side}-goal-${goal.timestamp}-${goal.playerId}`,
        minute: num(goal.time),
        kind: own ? "own_goal" : /pen/i.test(type) ? "penalty" : "goal",
        // Own goals are listed under the team that conceded them
        side: own ? (side === "home" ? "away" : "home") : side,
        playerId: String(goal.playerId),
        player: name(goal.playerId),
        otherId: goal.assistPlayerId ? String(goal.assistPlayerId) : undefined,
        other: goal.assistPlayerId ? name(goal.assistPlayerId) : undefined,
      });
    }
    for (const card of part.cards ?? []) {
      const type = String(card.type ?? "");
      out.push({
        id: `${side}-card-${card.timestamp}-${card.playerId}`,
        minute: num(card.time),
        kind: /second|yellowred/i.test(type) ? "second_yellow" : /red/i.test(type) ? "red" : "yellow",
        side,
        playerId: String(card.playerId),
        player: name(card.playerId),
      });
    }
    for (const sub of part.subs ?? []) {
      out.push({
        id: `${side}-sub-${sub.timestamp}-${sub.playerOffId}`,
        minute: num(sub.time),
        kind: "sub",
        side,
        playerId: String(sub.playerOffId),
        player: name(sub.playerOffId),
        otherId: String(sub.playerOnId),
        other: name(sub.playerOnId),
      });
    }
  }

  const statRows: StatRow[] = [];
  if (Array.isArray(stats)) {
    const home = stats.find((item: Json) => item.side === "Home")?.stats ?? {};
    const away = stats.find((item: Json) => item.side === "Away")?.stats ?? {};
    for (const [key, label, percent] of PL_STAT_ROWS) {
      if (home[key] === undefined && away[key] === undefined) continue;
      const round = (value: unknown) => (percent ? Math.round(num(value) * 10) / 10 : num(value));
      statRows.push({ label, home: round(home[key]), away: round(away[key]), percent });
    }
    const xgHome = stats.find((item: Json) => item.side === "Home")?.stats?.expectedGoals;
    const xgAway = stats.find((item: Json) => item.side === "Away")?.stats?.expectedGoals;
    if (xgHome !== undefined || xgAway !== undefined) {
      statRows.splice(1, 0, { label: "Expected goals", home: Math.round(num(xgHome) * 100) / 100, away: Math.round(num(xgAway) * 100) / 100 });
    }
  }

  return {
    comp: "pl",
    id,
    status,
    statusText: text,
    kickoff: plKickoff(info),
    round: info.matchWeek ? `Matchweek ${info.matchWeek}` : undefined,
    venue: info.ground,
    attendance: info.attendance || undefined,
    home: team(homeId, info.homeTeam),
    away: team(awayId, info.awayTeam),
    halfTime:
      info.homeTeam.halfTimeScore !== undefined && status !== "upcoming"
        ? { home: num(info.homeTeam.halfTimeScore), away: num(info.awayTeam.halfTimeScore) }
        : undefined,
    events: sortEvents(out),
    stats: statRows,
  };
}
