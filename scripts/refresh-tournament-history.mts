// Pulls World Cup, Euros and Copa América history tables from Wikipedia into data/tournamentHistory.generated.json.
// Run with: pnpm live:tournaments (also scheduled by .github/workflows/refresh-live-facts.yml)
import { writeFileSync } from "node:fs";

const UA = "football-history-archive-live-facts/1.0 (open-source hobby project)";

async function page(title: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&formatversion=2&redirects=1`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.ok) {
        const json = (await res.json()) as { parse?: { text?: string } };
        if (json.parse?.text) return json.parse.text;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
  }
  return "";
}

const ENTITIES: Record<string, string> = { "&amp;": "&", "&nbsp;": " ", "&#160;": " ", "&quot;": '"', "&#39;": "'", "&#x27;": "'", "&lt;": "<", "&gt;": ">" };
const clean = (html: string) =>
  html
    .replace(/<sup[\s\S]*?<\/sup>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<br\s*\/?>/g, ", ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#?\w+;/g, (m) => ENTITIES[m] ?? " ")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/[†‡*^]/g, "")
    .replace(/\s+([,.)])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+/g, " ")
    .trim();

type Table = { headers: string[]; rows: string[][] };

// Expands rowspan/colspan so every row lines up with the header
function tables(html: string): Table[] {
  const out: Table[] = [];
  for (const match of html.matchAll(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/g)) {
    const pending: { text: string; left: number }[] = [];
    const rows: string[][] = [];
    for (const row of match[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
      const cells = [...row[1].matchAll(/<t([hd])([^>]*)>([\s\S]*?)<\/t[hd]>/g)];
      const line: string[] = [];
      let col = 0;
      const fillPending = () => {
        while (pending[col]?.left > 0) {
          line[col] = pending[col].text;
          pending[col].left -= 1;
          col += 1;
        }
      };
      for (const cell of cells) {
        fillPending();
        const text = clean(cell[3]);
        const rowspan = Number(/rowspan="?(\d+)/.exec(cell[2])?.[1] ?? 1);
        const colspan = Number(/colspan="?(\d+)/.exec(cell[2])?.[1] ?? 1);
        for (let i = 0; i < colspan; i += 1) {
          line[col] = text;
          if (rowspan > 1) pending[col] = { text, left: rowspan - 1 };
          col += 1;
        }
      }
      fillPending();
      if (line.length) rows.push(line.map((value) => value ?? ""));
    }
    if (rows.length > 3) {
      const width = rows[0].length;
      const body = rows
        .slice(1)
        .filter((row) => row.length >= width - 1 && row.some(Boolean) && !/\b(TBD|To be determined)\b/i.test(row.join(" ")))
        .map((row) => Array.from({ length: width }, (_, i) => row[i] ?? ""));
      out.push({ headers: rows[0].map((header) => header.replace(/,/g, "")), rows: body });
    }
  }
  return out;
}

const find = (all: Table[], test: RegExp, minRows = 5) => all.find((table) => test.test(table.headers.join(" ")) && table.rows.length >= minRows);

function pick(all: Table[], test: RegExp, keep: number, minRows?: number): Table | null {
  const table = find(all, test, minRows);
  return table ? { headers: table.headers.slice(0, keep), rows: table.rows.map((row) => row.slice(0, keep)) } : null;
}

async function main() {
  const out: Record<string, Record<string, Table | null>> = {};

  const wcFinals = tables(await page("List of FIFA World Cup finals"));
  const wcStats = tables(await page("FIFA World Cup records and statistics"));
  const wcScorers = tables(await page("List of FIFA World Cup top goalscorers"));
  out.worldcup = {
    finals: pick(wcFinals, /^Year Winners Score Runners-up/, 5),
    editions: pick(wcStats, /^Year Host Champions Winning coach/, 6),
    standings: pick(wcStats, /^Rank Team Part\. Pld/, 11),
    medals: pick(wcStats, /^Team Titles Runners-up Third/, 6),
    scorers: pick(wcScorers, /^Rank Player Team Goals scored Matches played/, 7),
  };

  const euStats = tables(await page("UEFA European Championship records and statistics"));
  const euFinals = tables(await page("List of UEFA European Championship finals"));
  const euScorers = tables(await page("UEFA European Championship top goalscorers"));
  out.euros = {
    finals: pick(euFinals, /^Year Winners Score Runners-up/, 5),
    editions: pick(euStats, /^Year Hosts Champions Winning coach/, 5),
    standings: pick(euStats, /^Rank Team Part\. Pld/, 11),
    medals: pick(euStats, /^Rank Team Gold Silver/, 6),
    scorers: pick(euScorers, /^Rank Player Team Goals/, 6, 5),
  };

  const cpFinals = tables(await page("List of Copa América finals"));
  const cpStats = tables(await page("Copa América records and statistics"));
  out.copa = {
    finals: pick(cpFinals, /^Ed\. Year Winners Score Runners-up/, 6),
    editions: pick(cpStats, /^Year Hosts Champions Winning coach/, 6),
    standings: pick(cpStats, /^Rank Team Part\. Pld/, 11),
    medals: pick(cpStats, /^Rank Nation Gold Silver/, 6),
    scorers: pick(cpStats, /^Rank Player Country Goals$/, 4),
    assists: pick(cpStats, /^Rank Player Country Assists$/, 4),
  };

  for (const [key, group] of Object.entries(out)) {
    console.log(key, Object.entries(group).map(([name, table]) => `${name}:${table ? table.rows.length : "MISSING"}`).join(" "));
  }
  writeFileSync(new URL("../data/tournamentHistory.generated.json", import.meta.url), JSON.stringify({ updatedAt: new Date().toISOString(), tournaments: out }, null, 1));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
