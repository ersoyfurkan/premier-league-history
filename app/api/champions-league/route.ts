import { NextRequest, NextResponse } from "next/server";

const STANDINGS_URL = "https://standings.uefa.com/v1/standings";
const MATCHES_URL = "https://match.uefa.com/v5/matches";

async function fetchUefa<T>(url: URL): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 15 },
  });
  if (!response.ok) {
    throw new Error(`UEFA feed returned ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const seasonYear = new Date().getUTCMonth() >= 6
    ? new Date().getUTCFullYear() + 1
    : new Date().getUTCFullYear();

  try {
    if (type === "table") {
      const url = new URL(STANDINGS_URL);
      url.searchParams.set("competitionId", "1");
      url.searchParams.set("seasonYear", String(seasonYear));
      const [group] = await fetchUefa<{ items: unknown[] }[]>(url);
      if (!group) {
        throw new Error("UEFA standings feed returned no groups");
      }
      return NextResponse.json({ ...group, seasonYear }, {
        headers: { "Cache-Control": "public, max-age=30, s-maxage=60" },
      });
    }

    if (type === "fixtures") {
      const matchday = Number(params.get("matchday"));
      if (!Number.isInteger(matchday) || matchday < 1 || matchday > 8) {
        return NextResponse.json({ error: "Matchday must be between 1 and 8." }, { status: 400 });
      }
      const fetchMatchPage = (offset: number) => {
        const url = new URL(MATCHES_URL);
        url.searchParams.set("competitionId", "1");
        url.searchParams.set("seasonYear", String(seasonYear));
        url.searchParams.set("limit", "18");
        url.searchParams.set("offset", String(offset));
        return fetchUefa<{
          competitionPhase: string;
          matchday: { sequenceNumber: number | string };
        }[]>(url);
      };
      const page = await fetchMatchPage((8 - matchday) * 18);
      const matches = page.filter(
        (match) =>
          match.competitionPhase === "TOURNAMENT" &&
          Number(match.matchday.sequenceNumber) === matchday
      );
      return NextResponse.json(matches, {
        headers: { "Cache-Control": "public, max-age=10, s-maxage=15" },
      });
    }

    return NextResponse.json({ error: "Invalid data type." }, { status: 400 });
  } catch (error) {
    console.error("Champions League data request failed", error);
    return NextResponse.json({ error: "Could not load Champions League data from UEFA." }, { status: 502 });
  }
}
