import { NextRequest, NextResponse } from "next/server";

const BASE = "https://sdp-prem-prod.premier-league-prod.pulselive.com/api";
const SEASON_ID = 2026; // 2026/27

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
    } else if (type === "goals" || type === "assists") {
      const stat = type === "goals" ? "goals" : "goalAssists";
      data = await upstream(
        `/v2/competitions/8/seasons/${SEASON_ID}/players/stats/leaderboard?_sort=${stat}:desc&_limit=20`
      );
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
