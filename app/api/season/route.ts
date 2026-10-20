import { NextRequest, NextResponse } from "next/server";

const BASE = "https://sdp-prem-prod.premier-league-prod.pulselive.com/api";
const SEASON_ID = 2026; // 2026/27

type PlayerRow = { playerMetadata: { id: string }; stats: Record<string, number> };

async function upstream(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Origin: "https://www.premierleague.com", Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Upstream ${res.status}`);
  return res.json();
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");

  try {
    let data: unknown;

    if (type === "table") {
      data = await upstream(`/v5/competitions/8/seasons/${SEASON_ID}/standings`);
    } else if (type === "fixtures") {
      const mw = Number(params.get("matchweek"));
      if (!Number.isInteger(mw) || mw < 1 || mw > 38) {
        return NextResponse.json({ error: "Invalid matchweek" }, { status: 400 });
      }
      data = await upstream(`/v1/competitions/8/seasons/${SEASON_ID}/matchweeks/${mw}/matches`);
    } else if (type === "goals") {
      data = await upstream(
        `/v2/competitions/8/seasons/${SEASON_ID}/players/stats/leaderboard?_sort=goals:desc&_limit=20`
      );
    } else if (type === "assists") {
      // The API ignores sorting by assists, so page through every player and rank here
      const base = `/v2/competitions/8/seasons/${SEASON_ID}/players/stats/leaderboard?_limit=100`;
      const players = new Map<string, PlayerRow>();
      let next: string | null = null;
      for (let page = 0; page < 15; page++) {
        const res = (await upstream(
          next ? `${base}&_next=${encodeURIComponent(next)}` : base
        )) as { data: PlayerRow[]; pagination?: { _next?: string | null } };
        for (const row of res.data) {
          const existing = players.get(row.playerMetadata.id);
          if (existing) {
            // Player moved clubs: combine stints
            existing.stats.goalAssists = (existing.stats.goalAssists ?? 0) + (row.stats.goalAssists ?? 0);
            existing.stats.goals = (existing.stats.goals ?? 0) + (row.stats.goals ?? 0);
          } else {
            players.set(row.playerMetadata.id, row);
          }
        }
        next = res.pagination?._next ?? null;
        if (!next) break;
      }
      const ranked = [...players.values()]
        .filter((p) => (p.stats.goalAssists ?? 0) > 0)
        .sort(
          (a, b) =>
            (b.stats.goalAssists ?? 0) - (a.stats.goalAssists ?? 0) || (b.stats.goals ?? 0) - (a.stats.goals ?? 0)
        )
        .slice(0, 20);
      data = { data: ranked };
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=30, s-maxage=60" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load data" }, { status: 502 });
  }
}
