import { NextRequest, NextResponse } from "next/server";
import { espnBadge, espnHeadshot, espnJson, espnStatistics } from "@/lib/espn";
import { TOURNAMENTS, isTournament } from "@/lib/tournaments";

/* eslint-disable @typescript-eslint/no-explicit-any */
const API = "https://site.api.espn.com/apis";

const stat = (entry: any, name: string) => Number(entry.stats?.find((s: any) => s.name === name)?.value ?? 0);

function side(c: any) {
  const score = typeof c.score === "object" ? c.score?.value : c.score;
  return {
    id: String(c.team?.id ?? ""),
    name: c.team?.shortDisplayName ?? c.team?.displayName ?? "TBD",
    logo: c.team?.id ? espnBadge(String(c.team.id)) : undefined,
    score: score === undefined || score === "" ? undefined : Number(score),
    shootout: c.shootoutScore === undefined ? undefined : Number(c.shootoutScore),
    winner: Boolean(c.winner),
  };
}

function toMatch(event: any) {
  const comp = event.competitions?.[0];
  const home = comp?.competitors?.find((c: any) => c.homeAway === "home");
  const away = comp?.competitors?.find((c: any) => c.homeAway === "away");
  if (!home || !away) return null;
  const type = event.status?.type ?? comp?.status?.type ?? {};
  return {
    id: String(event.id),
    date: event.date as string,
    state: (type.state ?? "pre") as "pre" | "in" | "post",
    detail: type.state === "post" ? type.shortDetail ?? "FT" : type.name === "STATUS_HALFTIME" ? "HT" : type.shortDetail ?? "",
    stage: String(event.season?.slug ?? "group-stage"),
    group: comp?.group?.name ? String(comp.group.name) : undefined,
    venue: comp?.venue?.fullName ? String(comp.venue.fullName) : undefined,
    home: side(home),
    away: side(away),
  };
}

// Tables, fixtures/results and scoring leaders for a World Cup, Euros or Copa América edition or qualifying zone
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const key = params.get("t");
  const type = params.get("type");
  if (!isTournament(key)) return NextResponse.json({ error: "Unknown tournament." }, { status: 400 });
  const meta = TOURNAMENTS[key];
  const qualKey = params.get("qual");
  const qual = qualKey ? meta.qualifiers.find((q) => q.key === qualKey) : undefined;
  if (qualKey && !qual) return NextResponse.json({ error: "Unknown qualifying zone." }, { status: 400 });
  const edition = meta.editions.find((e) => String(e.season) === params.get("edition")) ?? meta.editions[0];
  const league = qual ? qual.espn : meta.espn;
  const season = qual ? qual.season : edition.season;
  const isLatest = qual ? true : edition.season === meta.editions[0].season;
  const ttl = isLatest ? 15 : 3600;
  const cache = { "Cache-Control": `public, max-age=10, s-maxage=${ttl}` };

  try {
    if (type === "groups") {
      const data = await espnJson(`${API}/v2/sports/soccer/${league}/standings?season=${season}`, ttl);
      const groups = (data.children ?? []).map((child: any) => ({
        name: String(child.name ?? "Table"),
        entries: (child.standings?.entries ?? [])
          .map((entry: any) => ({
            team: { id: String(entry.team.id), name: entry.team.shortDisplayName ?? entry.team.displayName, logo: espnBadge(String(entry.team.id)) },
            rank: stat(entry, "rank"),
            played: stat(entry, "gamesPlayed"),
            won: stat(entry, "wins"),
            drawn: stat(entry, "ties"),
            lost: stat(entry, "losses"),
            goalsFor: stat(entry, "pointsFor"),
            goalsAgainst: stat(entry, "pointsAgainst"),
            points: stat(entry, "points"),
          }))
          .sort((a: any, b: any) => a.rank - b.rank),
      }));
      return NextResponse.json(groups, { headers: cache });
    }

    if (type === "matches") {
      const years = qual ? qual.years : [edition.year];
      const boards = await Promise.all(
        years.map((year) => espnJson(`${API}/site/v2/sports/soccer/${league}/scoreboard?dates=${year}&limit=1000`, ttl).catch(() => ({ events: [] }))),
      );
      const seen = new Map<string, NonNullable<ReturnType<typeof toMatch>>>();
      for (const board of boards) {
        for (const event of board.events ?? []) {
          const match = toMatch(event);
          if (match) seen.set(match.id, match);
        }
      }
      const matches = [...seen.values()].sort((a, b) => a.date.localeCompare(b.date));
      return NextResponse.json(matches, { headers: cache });
    }

    if (type === "goals" || type === "assists") {
      if (!isLatest || qual) return NextResponse.json([], { headers: cache });
      const data = await espnJson(espnStatistics(meta.espn), 300).catch(() => ({ stats: [] }));
      const board = (data.stats ?? []).find((s: any) => s.name === (type === "goals" ? "goalsLeaders" : "assistsLeaders"));
      const rows = (board?.leaders ?? []).slice(0, 20).map((leader: any) => ({
        id: String(leader.athlete.id),
        name: leader.athlete.displayName,
        photo: espnHeadshot(String(leader.athlete.id)),
        club: leader.athlete.team?.displayName ?? "",
        value: Number(leader.value ?? 0),
      }));
      return NextResponse.json(rows, { headers: cache });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error(`${meta.label} data request failed`, error);
    return NextResponse.json({ error: `Could not load ${meta.label} data.` }, { status: 502 });
  }
}
