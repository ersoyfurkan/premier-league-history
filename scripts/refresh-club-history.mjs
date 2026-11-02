import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const CLUB_HISTORY_SOURCES = {
  ars: "Arsenal F.C.", avl: "Aston Villa F.C.", bou: "AFC Bournemouth", bre: "Brentford F.C.",
  bha: "Brighton & Hove Albion F.C.", che: "Chelsea F.C.", cry: "Crystal Palace F.C.", eve: "Everton F.C.",
  fulham: "Fulham F.C.", lee: "Leeds United F.C.", liv: "Liverpool F.C.", mci: "Manchester City F.C.",
  mun: "Manchester United F.C.", new: "Newcastle United F.C.", nfo: "Nottingham Forest F.C.",
  sun: "Sunderland A.F.C.", tot: "Tottenham Hotspur F.C.", wham: "West Ham United F.C.",
  wol: "Wolverhampton Wanderers F.C.", bur: "Burnley F.C.", sou: "Southampton F.C.",
  ips: "Ipswich Town F.C.", hul: "Hull City A.F.C.", cov: "Coventry City F.C.",
  bar: "FC Barcelona", rma: "Real Madrid CF", atm: "Atlético Madrid", val: "Valencia CF",
  sev: "Sevilla FC", bet: "Real Betis", ath: "Athletic Bilbao", soc: "Real Sociedad",
  vil: "Villarreal CF", cel: "RC Celta de Vigo", esp: "RCD Espanyol", osa: "CA Osasuna",
  get: "Getafe CF", lvt: "Levante UD", mal: "Málaga CF", dep: "Deportivo de La Coruña",
  juv: "Juventus FC", mil: "AC Milan", inter: "Inter Milan", rom: "AS Roma", laz: "SS Lazio",
  nap: "SSC Napoli", fio: "ACF Fiorentina", ata: "Atalanta BC", bol: "Bologna FC 1909",
  par: "Parma Calcio 1913", gen: "Genoa CFC", tor: "Torino FC", udi: "Udinese Calcio",
  bay: "FC Bayern Munich", dor: "Borussia Dortmund", lev: "Bayer 04 Leverkusen", s04: "FC Schalke 04",
  bmg: "Borussia Mönchengladbach", wer: "SV Werder Bremen", hsv: "Hamburger SV", sge: "Eintracht Frankfurt",
  stu: "VfB Stuttgart", rbl: "RB Leipzig", fre: "SC Freiburg", mai: "1. FSV Mainz 05",
  psg: "Paris Saint-Germain FC", mar: "Olympique de Marseille", lyon: "Olympique Lyonnais",
  mon: "AS Monaco FC", lil: "Lille OSC", lens: "RC Lens", nan: "FC Nantes", ren: "Stade Rennais FC",
  ajax: "AFC Ajax", ben: "S.L. Benfica", por: "FC Porto", spo: "Sporting CP", psv: "PSV Eindhoven",
  fey: "Feyenoord", gal: "Galatasaray S.K.", fen: "Fenerbahçe S.K.", bes: "Beşiktaş J.K.",
};

const entities = { amp: "&", nbsp: " ", quot: '"', apos: "'", ndash: "-", mdash: "-", eacute: "e" };
export const cleanHtml = (html) => html.replace(/<sup\b[\s\S]*?<\/sup>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "")
  .replace(/<[^>]+>/g, " ").replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code)))
  .replace(/&(\w+);/g, (entity, name) => entities[name] ?? entity).replace(/\s+/g, " ").trim();

export function extractClubPlayers(html) {
  html = html.replace(/\s(?:data-[\w-]+|title|about|typeof|style)=(?:"[^"]*"|'[^']*')/gi, "").replace(/<small\b[\s\S]*?<\/small>/gi, "");
  const players = new Map();
  for (const match of html.matchAll(/<table\b[^>]*class="[^"]*\bwikitable\b[^"]*"[^>]*>[\s\S]*?<\/table>/gi)) {
    const rawRows = [...match[0].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
    const grid = [];
    for (let r = 0; r < rawRows.length; r += 1) {
      grid[r] ??= [];
      let column = 0;
      for (const cell of rawRows[r][1].matchAll(/<(th|td)\b([^>]*)>([\s\S]*?)<\/t[hd]>/gi)) {
        while (grid[r][column]) column += 1;
        const rowSpan = Number(cell[2].match(/rowspan="?(\d+)/i)?.[1] ?? 1);
        const colSpan = Number(cell[2].match(/colspan="?(\d+)/i)?.[1] ?? 1);
        const value = { text: cleanHtml(cell[3]), html: cell[3], header: cell[1].toLowerCase() === "th" };
        for (let dr = 0; dr < rowSpan; dr += 1) {
          grid[r + dr] ??= [];
          for (let dc = 0; dc < colSpan; dc += 1) grid[r + dr][column + dc] = value;
        }
        column += colSpan;
      }
    }
    const header = grid.find((row) => row.some((cell) => /^(?:name|player)(?:\s|$)/i.test(cell.text))
      && row.some((cell) => /appearances|\bapps?\b|^M$/i.test(cell.text)));
    if (!header) continue;
    const nameColumn = header.findIndex((cell) => /^(?:name|player)(?:\s|$)/i.test(cell.text));
    const appColumns = header.flatMap((cell, index) => /appearances|\bapps?\b|^M$/i.test(cell.text) ? [index] : []);
    for (const row of grid.slice(grid.indexOf(header) + 1)) {
      const cell = row[nameColumn];
      if (!cell || !appColumns.some((index) => /^\d[\d,]*$/.test(row[index]?.text ?? "") && Number(row[index].text.replaceAll(",", "")) > 0)) continue;
      const linkedName = [...cell.html.matchAll(/<a\b[^>]*href="(?:\.\/|\/wiki\/|https:\/\/en\.wikipedia\.org\/wiki\/)[^"]+"[^>]*>([\s\S]*?)<\/a>/gi)]
        .map((match) => cleanHtml(match[1])).find((name) => /[a-z]/i.test(name) && !/^(?:note|[a-z])$/i.test(name));
      let name = (linkedName ?? cell.text).replace(/[†‡*]/g, "").replace(/\s+\(c\)$/, "").replace(/\s+Spanish article$/, "").trim();
      if (/^[^,]+, [^,]+$/.test(name)) {
        const [surname, first] = name.split(", ");
        name = `${first} ${surname}`;
      }
      if (name === "Antione Semenyo") name = "Antoine Semenyo";
      if (name.length < 3 || name.length > 65 || /\b(?:total|player|unknown)\b/i.test(name)) continue;
      players.set(name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase(), name);
    }
  }
  return [...players.values()];
}

async function main() {
  const clubs = {};
  const unavailable = [];
  for (const [key, title] of Object.entries(CLUB_HISTORY_SOURCES)) {
    const source = `https://en.wikipedia.org/wiki/${encodeURIComponent(`List of ${title} players`.replaceAll(" ", "_"))}`;
    const response = await fetch(source, { headers: { "User-Agent": "football-history-archive/1.0" }, signal: AbortSignal.timeout(30000) });
    if (response.status === 404) {
      unavailable.push({ key, source, reason: "No player-list page at this URL" });
      console.warn(`${key}: no source page`);
    } else {
      if (!response.ok) throw new Error(`${key}: source returned HTTP ${response.status}`);
      const html = await response.text();
      const names = extractClubPlayers(html);
      const base = `List_of_${title.replaceAll(" ", "_")}_players`;
      const linkedSources = [...new Set([...html.matchAll(/href="([^"]+)"/g)].map((match) => {
        const url = new URL(match[1].replaceAll("&amp;", "&"), source);
        const path = decodeURIComponent(url.pathname).replace(/^\/wiki\//, "");
        return url.hostname === "en.wikipedia.org" && path.startsWith(`${base}_(`) && /(?:1[–-](?:24|99)|25[–-]99)_appearances/.test(path) ? url.href : null;
      }).filter(Boolean))];
      for (const extra of linkedSources) {
        const more = await fetch(extra, { signal: AbortSignal.timeout(30000) });
        if (!more.ok) throw new Error(`${key}: lower-appearance source returned HTTP ${more.status}`);
        const additional = extractClubPlayers(await more.text());
        if (!additional.length) throw new Error(`${key}: lower-appearance source has no usable rows`);
        names.push(...additional);
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
      const uniqueNames = [...new Map(names.map((name) => [name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase(), name])).values()];
      if (names.length < 6) {
        unavailable.push({ key, source, reason: "No supported positive-appearance table; manual source review required" });
        console.warn(`${key}: unsupported table`);
      } else {
        clubs[key] = { source, sources: [source, ...linkedSources], names: uniqueNames, coverage: "Listed players with a positive senior appearance count, including linked lower-appearance lists where available; not guaranteed exhaustive" };
        console.log(`${key}: ${uniqueNames.length} (${linkedSources.length} lower-appearance lists)`);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  if (!clubs.nfo || !clubs.liv || !clubs.mun) throw new Error("Required club source coverage missing; keeping existing snapshot");
  writeFileSync(new URL("../data/clubHistory.generated.json", import.meta.url), `${JSON.stringify({
    checkedAt: new Date().toISOString(), clubs, unavailable,
  }, null, 2)}\n`);
  console.log(`Saved ${Object.keys(clubs).length} sourced club histories; ${unavailable.length} sources need manual review.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
