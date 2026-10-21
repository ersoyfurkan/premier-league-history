import { NextRequest, NextResponse } from "next/server";
import { fetchLaLigaMatch } from "@/lib/espn";
import { fetchPlMatch, fetchUclMatch } from "@/lib/matchDetail";

export async function GET(request: NextRequest) {
  const comp = request.nextUrl.searchParams.get("comp");
  const id = request.nextUrl.searchParams.get("id") ?? "";

  if ((comp !== "pl" && comp !== "ucl" && comp !== "laliga") || !/^\d{1,10}$/.test(id)) {
    return NextResponse.json({ error: "Invalid match." }, { status: 400 });
  }

  try {
    const match =
      comp === "ucl" ? await fetchUclMatch(id) : comp === "laliga" ? await fetchLaLigaMatch(id) : await fetchPlMatch(id);
    return NextResponse.json(match, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Match request failed", error);
    return NextResponse.json({ error: "Could not load this match right now." }, { status: 502 });
  }
}
