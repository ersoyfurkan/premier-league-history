import { NextRequest, NextResponse } from "next/server";
import { fmtPlKickoff, fmtUclKickoff } from "@/lib/dates";

const PL_BASE = "https://sdp-prem-prod.premier-league-prod.pulselive.com/api";
const PL_SEASON = 2026;

type Side = { id: string; name: string; logo?: string; score?: number };
export type ClubFixture = {
  id: string;
  when: string;
  sort: string;
  live: boolean;
  round: string;
  home: Side;
  away: Side;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
async function plFixtures(team: string): Promise<ClubFixture[]> {
  const res = await fetch(
    `${PL_BASE}/v2/matches?competition=8&season=${PL_SEASON}&team=${team}&_limit=50`,
    { headers: { Origin: "https://www.premierleague.com", Accept: "application/json" }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`PL feed ${res.status}`);
  const body = (await res.json()) as { data: any[] };
  return body.data
    .filter((m) => m.period !== "FullTime")
    .map((m) => ({
      id: String(m.matchId),
      when: fmtPlKickoff(m.kickoff),
      sort: String(m.kickoff),
      live: m.period !== "PreMatch",
      round: `Matchweek ${m.matchWeek}`,
      home: { id: String(m.homeTeam.id), name: m.homeTeam.shortName, score: m.homeTeam.score },
      away: { id: String(m.awayTeam.id), name: m.awayTeam.shortName, score: m.awayTeam.score },
    }));
}

async function uclFixtures(team: string): Promise<ClubFixture[]> {
  const year = new Date().getUTCMonth() >= 6 ? new Date().getUTCFullYear() + 1 : new Date().getUTCFullYear();
  const res = await fetch(
    `https://match.uefa.com/v5/matches?competitionId=1&seasonYear=${year}&teamId=${team}&limit=30&offset=0`,
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`UEFA feed ${res.status}`);
  const body = (await res.json()) as any[];
  return body
    .filter((m) => m.status !== "FINISHED")
    .map((m) => ({
      id: String(m.id),
      when: fmtUclKickoff(m.kickOffTime?.dateTime ?? m.kickOffTime?.date),
      sort: String(m.kickOffTime?.dateTime ?? m.kickOffTime?.date ?? ""),
      live: m.status === "LIVE",
      round: m.matchday?.longName ?? "",
      home: { id: String(m.homeTeam.id), name: m.homeTeam.internationalName, logo: m.homeTeam.logoUrl, score: m.score?.total?.home },
      away: { id: String(m.awayTeam.id), name: m.awayTeam.internationalName, logo: m.awayTeam.logoUrl, score: m.score?.total?.away },
    }));
}

export async function GET(request: NextRequest) {
  const comp = request.nextUrl.searchParams.get("comp");
  const team = request.nextUrl.searchParams.get("team") ?? "";
  if ((comp !== "pl" && comp !== "ucl") || !/^\d{1,8}$/.test(team)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const list = comp === "pl" ? await plFixtures(team) : await uclFixtures(team);
    list.sort((a, b) => a.sort.localeCompare(b.sort));
    return NextResponse.json(list, { headers: { "Cache-Control": "public, max-age=10, s-maxage=15" } });
  } catch {
    return NextResponse.json({ error: "Could not load fixtures." }, { status: 502 });
  }
}
