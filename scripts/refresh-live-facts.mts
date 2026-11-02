// Pulls finished-season tables and current-season leaders from ESPN into data/liveFacts.generated.json.
// Run with: pnpm live:refresh (also scheduled by .github/workflows/refresh-live-facts.yml)
import { writeFileSync } from "node:fs";

/* eslint-disable @typescript-eslint/no-explicit-any */
const LEAGUES: Record<string, string> = {
  pl: "eng.1", laliga: "esp.1", seriea: "ita.1", bundesliga: "ger.1", ligue1: "fra.1", superlig: "tur.1",
};
const FIRST_SEASON = 2000;
const RELEGATION_SPOTS: Record<string, number> = { pl: 3, laliga: 3, seriea: 3 };

async function getJson(url: string): Promise<any | null> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "football-archive-live-facts" } });
      if (res.ok) return await res.json();
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  return null;
}

const stat = (entry: any, name: string) => Number(entry.stats?.find((s: any) => s.name === name)?.value ?? 0);

function readTable(data: any) {
  const entries: any[] = data?.children?.[0]?.standings?.entries ?? [];
  return entries
    .map((entry) => ({ name: String(entry.team.displayName), rank: stat(entry, "rank"), played: stat(entry, "gamesPlayed") }))
    .sort((a, b) => a.rank - b.rank);
}

async function leaders(league: string, key: string) {
  const data = await getJson(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/statistics`);
  const board = (data?.stats ?? []).find((s: any) => s.name === key);
  return (board?.leaders ?? []).slice(0, 20).map((leader: any) => ({
    name: String(leader.athlete.displayName),
    club: String(leader.athlete.team?.displayName ?? ""),
    value: Number(leader.value ?? 0),
  }));
}

const out: Record<string, any> = {};
for (const [comp, league] of Object.entries(LEAGUES)) {
  const seasons: any[] = [];
  const thisYear = new Date().getFullYear();
  for (let season = FIRST_SEASON; season <= thisYear; season += 1) {
    const table = readTable(await getJson(`https://site.api.espn.com/apis/v2/sports/soccer/${league}/standings?season=${season}`));
    // Only completed seasons: every club has played its full home-and-away schedule
    if (table.length < 16 || table.some((row) => row.played < 2 * (table.length - 1))) continue;
    const spots = RELEGATION_SPOTS[comp] ?? 0;
    seasons.push({
      season,
      champion: table[0].name,
      top4: table.slice(0, 4).map((row) => row.name),
      relegated: spots ? table.slice(-spots).map((row) => row.name) : [],
    });
  }
  const current = readTable(await getJson(`https://site.api.espn.com/apis/v2/sports/soccer/${league}/standings`));
  out[comp] = {
    seasons,
    currentTable: current.map((row) => row.name),
    scorers: await leaders(league, "goalsLeaders"),
    assists: await leaders(league, "assistsLeaders"),
  };
  console.log(comp, seasons.length, "seasons,", current.length, "clubs,", out[comp].scorers.length, "scorers");
}

writeFileSync(new URL("../data/liveFacts.generated.json", import.meta.url), JSON.stringify({ updatedAt: new Date().toISOString(), comps: out }, null, 1) + "\n");
