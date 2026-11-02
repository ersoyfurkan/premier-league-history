// Pulls historical award/winner lists from Wikipedia (open API) into data/wikiFacts.generated.json.
// Run with: pnpm live:wiki (also scheduled by .github/workflows/refresh-live-facts.yml)
import { writeFileSync } from "node:fs";

const UA = "football-history-archive-live-facts/1.0 (open-source hobby project)";

async function page(title: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&formatversion=2&redirects=1`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.ok) {
        const json = (await res.json()) as { parse?: { text?: string } };
        if (json.parse?.text) return json.parse.text;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
  }
  return "";
}

const ENTITIES: Record<string, string> = { "&amp;": "&", "&nbsp;": " ", "&#160;": " ", "&quot;": '"', "&#39;": "'", "&#x27;": "'", "&lt;": "<", "&gt;": ">" };
const clean = (html: string) =>
  html
    .replace(/<sup[\s\S]*?<\/sup>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#?\w+;/g, (m) => ENTITIES[m] ?? " ")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/[†‡*^]/g, "")
    .replace(/\s+/g, " ")
    .trim();

type Table = { headers: string[]; rows: string[][] };

function tables(html: string): Table[] {
  const out: Table[] = [];
  for (const match of html.matchAll(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/g)) {
    const rows = [...match[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((row) =>
      [...row[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((cell) => clean(cell[1])),
    );
    if (rows.length > 3) out.push({ headers: rows[0], rows: rows.slice(1) });
  }
  return out;
}

const col = (table: Table, test: RegExp) => table.headers.findIndex((header) => test.test(header));
const uniq = (values: string[]) =>
  [...new Set(values.map((v) => v.replace(/\(\d+\)/g, "").replace(/\s+/g, " ").trim()).filter((v) => v.length > 2 && v.length < 40 && !/[,;]/.test(v)))];

async function playerColumn(title: string, headerTest: RegExp): Promise<string[]> {
  const html = await page(title);
  for (const table of tables(html)) {
    const season = col(table, /season|year/i);
    const player = col(table, headerTest);
    if (season < 0 || player < 0) continue;
    const names = table.rows.filter((row) => /\d{4}/.test(row[season] ?? "") && row.length >= table.headers.length - 1).map((row) => row[player]);
    if (names.length >= 8) return uniq(names);
  }
  return [];
}

async function main() {
  const lists: Record<string, string[]> = {};

  const ballonHtml = await page("Ballon d'Or");
  const ballon = tables(ballonHtml).find((t) => col(t, /rank/i) >= 0 && col(t, /player/i) >= 0);
  if (ballon) {
    const rank = col(ballon, /rank/i);
    const player = col(ballon, /player/i);
    lists.ballon = uniq(ballon.rows.filter((row) => /^1st/i.test(row[rank] ?? "")).map((row) => row[player]));
  }

  const finals = tables(await page("List of European Cup and UEFA Champions League finals")).find((t) => col(t, /winners/i) >= 0 && col(t, /runners/i) >= 0);
  if (finals) {
    const winners = col(finals, /winners/i);
    const runners = col(finals, /runners/i);
    const names = (index: number) => uniq(finals.rows.filter((row) => /\d{4}/.test(row[0] ?? "")).map((row) => row[index]));
    lists.uclWinners = names(winners);
    lists.uclRunnersUp = names(runners);
  }

  lists.plGoldenBoot = await playerColumn("Premier League Golden Boot", /^player/i);
  lists.laligaPichichi = await playerColumn("Pichichi Trophy", /player|top scorer|winner/i);
  lists.serieaCapocannoniere = await playerColumn("Capocannoniere", /player|top scorer|winner/i);
  lists.bundesligaTop = await playerColumn("Torjägerkanone", /player|top scorer|winner/i);
  lists.ligue1Top = await playerColumn("List of Ligue 1 top scorers", /player|top scorer|winner/i);
  lists.superligTop = await playerColumn("List of Süper Lig top scorers", /player|top scorer|winner/i);

  for (const [key, values] of Object.entries(lists)) console.log(key, values.length, values.slice(-3).join(" | "));
  writeFileSync(new URL("../data/wikiFacts.generated.json", import.meta.url), JSON.stringify({ updatedAt: new Date().toISOString(), lists }, null, 1));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
