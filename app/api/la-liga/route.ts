import { NextRequest, NextResponse } from "next/server";
import { ESPN_STANDINGS, espnBadge, espnHeadshot, espnJson, seasonFixtures, withLiveScores } from "@/lib/espn";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");

  try {
    if (type === "table") {
      const data = await espnJson(ESPN_STANDINGS);
      const entries = (data.children?.[0]?.standings?.entries ?? []).map((entry: any) => {
        const stat = (name: string) => Number(entry.stats.find((s: any) => s.name === name)?.value ?? 0);
        return {
          team: { id: String(entry.team.id), name: entry.team.displayName, logo: espnBadge(String(entry.team.id)) },
          rank: stat("rank"),
          played: stat("gamesPlayed"),
          won: stat("wins"),
          drawn: stat("ties"),
          lost: stat("losses"),
          goalsFor: stat("pointsFor"),
          goalsAgainst: stat("pointsAgainst"),
          points: stat("points"),
        };
      });
      entries.sort((a: any, b: any) => a.rank - b.rank);
      return NextResponse.json(entries, { headers: { "Cache-Control": "public, max-age=10, s-maxage=15" } });
    }

    if (type === "fixtures") {
      const fixtures = await withLiveScores(await seasonFixtures());
      const requested = Number(params.get("matchweek"));
      // Default to the latest week that is played or under way
      const started = fixtures.filter((f) => f.state !== "pre").map((f) => f.matchweek);
      const current = Math.min(38, Math.max(1, ...started, 1));
      const week = Number.isInteger(requested) && requested >= 1 && requested <= 38 ? requested : current;
      const matches = fixtures
        .filter((f) => f.matchweek === week)
        .map((f) => ({ ...f, home: { ...f.home, logo: espnBadge(f.home.id) }, away: { ...f.away, logo: espnBadge(f.away.id) } }));
      return NextResponse.json({ matchweek: week, current, matches }, { headers: { "Cache-Control": "public, max-age=10, s-maxage=15" } });
    }

    if (type === "goals" || type === "assists") {
      const data = await espnJson("https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/statistics", 300);
      const board = (data.stats ?? []).find((s: any) => s.name === (type === "goals" ? "goalsLeaders" : "assistsLeaders"));
      const rows = (board?.leaders ?? []).slice(0, 20).map((leader: any) => ({
        id: String(leader.athlete.id),
        name: leader.athlete.displayName,
        photo: espnHeadshot(String(leader.athlete.id)),
        club: leader.athlete.team?.displayName ?? "",
        clubId: leader.athlete.team?.id ? String(leader.athlete.team.id) : undefined,
        value: Number(leader.value ?? 0),
      }));
      return NextResponse.json(rows, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("La Liga data request failed", error);
    return NextResponse.json({ error: "Could not load La Liga data." }, { status: 502 });
  }
}
