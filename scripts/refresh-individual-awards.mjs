import { mkdir, readFile, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { pathToFileURL } from "node:url";
import { cleanHtml } from "./refresh-club-history.mjs";

const award = (id, label, comp, page, section = "", image = "player") => ({ id, label, comp, page, section, image });
export const AWARD_SOURCES = [
  award("ballon", "Ballon d'Or", "general", "Ballon d'Or", "Winners", "ballon"),
  award("fifa-best", "The Best FIFA Men's Player", "general", "The Best FIFA Men's Player", "Winners"),
  award("fifa-world", "FIFA World Player of the Year", "general", "FIFA World Player of the Year", "Winners"),
  award("fifa-keeper", "The Best FIFA Men's Goalkeeper", "general", "The Best FIFA Goalkeeper", "Men's winners", "glove"),
  award("puskas", "FIFA Puskas Award", "general", "FIFA Puskás Award", "Winners", "puskas"),
  award("golden-boy", "Golden Boy", "general", "Golden Boy (award)", "Winners", "young"),
  award("kopa", "Kopa Trophy", "general", "Kopa Trophy", "Winners", "young"),
  award("yashin", "Yashin Trophy", "general", "Yashin Trophy", "Winners", "glove"),
  award("european-shoe", "European Golden Shoe", "general", "European Golden Shoe", "Winners", "boot"),
  award("pfa-player", "PFA Players' Player of the Year", "pl", "PFA Players' Player of the Year", "Winners"),
  award("pfa-young", "PFA Young Player of the Year", "pl", "PFA Young Player of the Year", "Winners", "young"),
  award("fwa", "FWA Footballer of the Year", "pl", "FWA Footballer of the Year", "Winners"),
  award("pl-player", "Premier League Player of the Season", "pl", "Premier League Player of the Season", "Winners"),
  award("pl-young", "Premier League Young Player of the Season", "pl", "Premier League Young Player of the Season", "Winners", "young"),
  award("pl-boot", "Premier League Golden Boot", "pl", "Premier League Golden Boot", "Winners", "boot"),
  award("pl-glove", "Premier League Golden Glove", "pl", "Premier League Golden Glove", "Winners", "glove"),
  award("pl-playmaker", "Premier League Playmaker of the Season", "pl", "Premier League Playmaker of the Season", "Winners"),
  award("pichichi", "Pichichi Trophy", "laliga", "Pichichi Trophy", "Winners", "boot"),
  award("zamora", "Zamora Trophy", "laliga", "Ricardo Zamora Trophy", "Winners", "glove"),
  award("laliga-player", "La Liga Best Player", "laliga", "La Liga Awards", "Best Player"),
  award("laliga-young", "La Liga U23 Player of the Season", "laliga", "La Liga Awards", "U23 Player of the season", "young"),
  award("laliga-breakthrough", "La Liga Breakthrough Player", "laliga", "La Liga Awards", "Breakthrough Player", "young"),
  award("laliga-keeper", "La Liga Goalkeeper of the Season", "laliga", "La Liga Awards", "Goalkeeper of the season", "glove"),
  award("seriea-player", "Serie A Footballer of the Year", "seriea", "Serie A Footballer of the Year", "Winners"),
  award("seriea-young", "Serie A Young Footballer of the Year", "seriea", "Serie A Young Footballer of the Year", "Winners", "young"),
  award("seriea-mvp", "Serie A Most Valuable Player", "seriea", "Serie A Awards", "Most Valuable Player"),
  award("seriea-keeper", "Serie A Best Goalkeeper", "seriea", "Serie A Awards", "Best Goalkeeper", "glove"),
  award("seriea-defender", "Serie A Best Defender", "seriea", "Serie A Awards", "Best Defender"),
  award("seriea-midfielder", "Serie A Best Midfielder", "seriea", "Serie A Awards", "Best Midfielder"),
  award("seriea-striker", "Serie A Best Striker", "seriea", "Serie A Awards", "Best Striker", "boot"),
  award("seriea-u23", "Serie A Best Under-23 / Rising Star", "seriea", "Serie A Awards", "Rising Star (Best Under-23)", "young"),
  award("capocannoniere", "Capocannoniere", "seriea", "Capocannoniere", "Winners", "boot"),
  award("bundesliga-player", "Bundesliga Player of the Season", "bundesliga", "Bundesliga Awards", "Player of the Season"),
  award("german-player", "German Footballer of the Year", "bundesliga", "Footballer of the Year (Germany)", "Winners"),
  award("bundesliga-rookie", "Bundesliga Rookie of the Season", "bundesliga", "Bundesliga Awards", "Rookie of the Season", "young"),
  award("bundesliga-scorer", "Bundesliga top scorer (Torjagerkanone)", "bundesliga", "List of Bundesliga top scorers by season", "Top scorers", "boot"),
  award("ligue1-player", "UNFP Ligue 1 Player of the Year", "ligue1", "Ligue 1 Player of the Year", "Winners"),
  award("ligue1-young", "UNFP Ligue 1 Young Player of the Year", "ligue1", "Ligue 1 Young Player of the Year", "Winners", "young"),
  award("ligue1-keeper", "UNFP Ligue 1 Goalkeeper of the Year", "ligue1", "Trophées UNFP du football", "Goalkeeper", "glove"),
  award("ligue1-scorer", "Ligue 1 top scorer", "ligue1", "List of Ligue 1 top scorers", "Winners", "boot"),
  award("uefa-player", "UEFA Men's Player of the Year", "ucl", "UEFA Men's Player of the Year Award", "Winners"),
  award("uefa-club", "UEFA Club Footballer of the Year", "ucl", "UEFA Club Footballer of the Year", "Winners"),
  award("ucl-player", "UEFA Champions League Player of the Season", "ucl", "UEFA Champions League", "Player of the Season"),
  award("ucl-young", "UEFA Champions League Young Player of the Season", "ucl", "UEFA Champions League", "Young Player of the Season", "young"),
  award("ucl-scorer", "Champions League season top scorer", "ucl", "List of UEFA Champions League top scorers", "By season", "boot"),
  award("wc-ball", "World Cup Golden Ball", "worldcup", "FIFA World Cup awards", "Golden Ball", "ballon"),
  award("wc-boot", "World Cup Golden Boot", "worldcup", "FIFA World Cup awards", "Golden Boot", "boot"),
  award("wc-glove", "World Cup Golden Glove", "worldcup", "FIFA World Cup awards", "Golden Glove", "glove"),
  award("wc-young", "World Cup Best Young Player (including retrospective selections)", "worldcup", "FIFA World Cup awards", "FIFA Young Player Award", "young"),
  award("euro-player", "European Championship Player of the Tournament", "euros", "UEFA European Championship awards", "Player of the Tournament"),
  award("euro-boot", "European Championship Golden Boot", "euros", "UEFA European Championship awards", "Top Goalscorer", "boot"),
  award("euro-young", "European Championship Young Player of the Tournament", "euros", "UEFA European Championship awards", "Young Player of the Tournament", "young"),
  award("copa-player", "Copa America Best Player", "copa", "Copa América awards", "Best Player"),
  award("copa-boot", "Copa America top scorer", "copa", "Copa América awards", "Top goalscorer", "boot"),
  award("copa-glove", "Copa America Best Goalkeeper", "copa", "Copa América awards", "Best Goalkeeper", "glove"),
  award("copa-young", "Copa America Best Young Player", "copa", "Copa América awards", "Best Young Player", "young"),
];

const TABLE_INDEX = {
  ballon: [1], "fifa-best": [0], "fifa-world": [0], puskas: Array.from({ length: 17 }, (_, i) => i),
  "golden-boy": [0], kopa: [1], yashin: [1], "european-shoe": [1],
  "pfa-player": [0], "pfa-young": [0], fwa: [0], "pl-player": [1], "pl-young": [1], "fifa-keeper": [0],
  "pl-boot": [1], "pl-glove": [1], "pl-playmaker": [2], pichichi: [0], zamora: [0],
  "laliga-player": [0], "laliga-young": [3], "laliga-breakthrough": [13], "laliga-keeper": [8],
  "seriea-player": [1], "seriea-young": [0], "seriea-mvp": [0], capocannoniere: [0],
  "seriea-keeper": [0], "seriea-defender": [0], "seriea-midfielder": [0], "seriea-striker": [0], "seriea-u23": [0],
  "bundesliga-player": [0], "german-player": [0], "bundesliga-rookie": [0], "bundesliga-scorer": [0],
  "ligue1-player": [0], "ligue1-young": [0], "ligue1-keeper": [2], "ligue1-scorer": [1],
  "uefa-player": [0], "uefa-club": [0], "ucl-player": [8], "ucl-young": [9], "ucl-scorer": [1],
  "wc-ball": [0], "wc-boot": [3], "wc-glove": [4], "wc-young": [5],
  "euro-player": [0], "euro-boot": [3], "euro-young": [1],
  "copa-player": [1], "copa-boot": [2], "copa-glove": [3], "copa-young": [6],
};

export function awardTables(html) {
  html = html.replace(/\s(?:data-[\w-]+|title|about|typeof|style)=(?:"[^"]*"|'[^']*')/gi, "");
  const tables = [];
  let section = "";
  const headings = [];
  for (const match of html.matchAll(/<h[2-4]\b[^>]*>[\s\S]*?<\/h[2-4]>|<table\b[^>]*class="[^"]*\bwikitable\b[^"]*"[^>]*>[\s\S]*?<\/table>/gi)) {
    if (/^<h/i.test(match[0])) {
      section = cleanHtml(match[0]).replace(/\s*\[edit\]$/, "");
      headings.push(section);
      continue;
    }
    const grid = [];
    const rawRows = [...match[0].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
    for (let r = 0; r < rawRows.length; r += 1) {
      grid[r] ??= [];
      let column = 0;
      for (const cell of rawRows[r][1].matchAll(/<(th|td)\b([^>]*)>([\s\S]*?)<\/t[hd]>/gi)) {
        while (grid[r][column]) column += 1;
        const rowSpan = Number(cell[2].match(/rowspan="?(\d+)/i)?.[1] ?? 1);
        const colSpan = Number(cell[2].match(/colspan="?(\d+)/i)?.[1] ?? 1);
        const value = { text: cleanHtml(cell[3]), html: cell[3] };
        for (let dr = 0; dr < rowSpan; dr += 1) {
          grid[r + dr] ??= [];
          for (let dc = 0; dc < colSpan; dc += 1) grid[r + dr][column + dc] = value;
        }
        column += colSpan;
      }
    }
    tables.push({ section, headings: [...headings], grid });
  }
  return tables;
}

export function extractAwardWinners(tables, definition) {
  const winners = [];
  for (const index of TABLE_INDEX[definition.id]) {
    const table = tables[index];
    if (!table) throw new Error(`${definition.id}: missing winner table ${index}`);
    const header = table.grid.find((row) => row.some((cell) => /^(?:Year|Season|Edition|World Cup|Rank)$/i.test(cell.text))
      && row.some((cell) => /^(?:Player(?:\(s\))?|Winner(?:\(s\))?|Recipient|Golden Ball|Lev Yashin Award|Top goalscorer|FIFA Young Player|Most Valuable Player|Player of the Season|Rookie of the Season)$/i.test(cell.text)));
    if (!header) throw new Error(`${definition.id}: winner header not found in table ${index} (${table.section})`);
    const columnName = definition.id === "bundesliga-player" ? "Player of the Season" : definition.id === "bundesliga-rookie" ? "Rookie of the Season" : definition.id.startsWith("seriea-") && ["seriea-mvp", "seriea-keeper", "seriea-defender", "seriea-midfielder", "seriea-striker", "seriea-u23"].includes(definition.id) ? definition.section : null;
    const nameColumn = header.findIndex((cell) => columnName ? cell.text === columnName : /^(?:Player(?:\(s\))?|Winner(?:\(s\))?|Recipient|Golden Ball|Lev Yashin Award|Top goalscorer|FIFA Young Player)$/i.test(cell.text));
    const dateColumn = header.findIndex((cell) => /^(?:Year|Season|Edition|World Cup)$/i.test(cell.text));
    const rankColumn = header.findIndex((cell) => /^Rank$/i.test(cell.text));
    for (const row of table.grid.slice(table.grid.indexOf(header) + 1)) {
      if (rankColumn >= 0 && !/^1(?:st)?$/.test(row[rankColumn]?.text ?? "")) continue;
      const season = dateColumn >= 0 ? row[dateColumn]?.text.match(/(?:18|19|20)\d{2}(?:[–−-]\d{2,4})?/)?.[0] : table.section.match(/20\d{2}/)?.[0];
      if (!season || Number(season.slice(0, 4)) > new Date().getUTCFullYear()) continue;
      const cell = row[nameColumn];
      if (!cell) continue;
      if (row.every((value) => value === row[0])) continue;
      if (/\b(?:not awarded|not held|no award|N\/a|COVID|cancelled)\b/i.test(cell.text) || !/\p{L}/u.test(cell.text)) continue;
      let linked = [...cell.html.matchAll(/<a\b[^>]*href="(?:\.\/|\/wiki\/|https:\/\/en\.wikipedia\.org\/wiki\/)[^"]+"[^>]*>([\s\S]*?)<\/a>/gi)]
        .filter((match) => !/<img\b/.test(match[1]))
        .map((match) => cleanHtml(match[1])).filter((name) => /\p{L}/u.test(name) && name.length > 1);
      if ((definition.id.startsWith("bundesliga-") && definition.id !== "bundesliga-scorer") || columnName?.startsWith("Best ") || definition.id === "seriea-mvp" || definition.id === "seriea-u23") linked = linked.slice(0, 1);
      const names = linked.length ? linked : [cell.text.replace(/\([^)]*\)/g, "").trim()];
      for (let name of names) {
        name = name.replace(/[†‡*]/g, "").replace(/\s*\(\d+\)/g, "").trim();
        if (definition.id === "ballon" && season === "1960") name = "Luis Suarez Miramontes";
        if (!name || /^(?:N\/a|None|Not awarded|Not held|No award|—|–|-)$|award.*(?:cancel|given)|cancelled|runner|coronavirus/i.test(name)) continue;
        if (/\d|[{}<>]|&lt;|:/.test(name)) throw new Error(`${definition.id}: invalid winner name: ${name}`);
        if (!winners.some((winner) => winner.name === name && winner.season === season)) winners.push({ name, season });
      }
    }
  }
  if (!winners.length) throw new Error(`${definition.id}: no winners extracted`);
  return winners;
}

const TROPHY_PHOTOS = {
  ballon: ["0/04", "2016_Ballon_dOr_CR7Museum.jpg"],
  puskas: ["d/da", "FIFA_Puskas_Award_2009_CR7_Museum.jpg"],
  "pl-boot": ["8/88", "2008_Premier_League_GoldenBoot_CR7Museum.jpg"],
};
const SUPPLEMENTAL_WINNERS = {
  "copa-player": [{
    name: "Neymar", season: "2021",
    source: "https://www.conmebol.com/noticias/get-messi-y-neymar-los-mejores-jugadores-del-torneo-continental/",
  }],
};

function awardArtwork(definition) {
  const escape = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const shapes = {
    ballon: '<circle cx="80" cy="58" r="32"/><path d="m80 38 17 12-6 20H69l-6-20 17-12M53 39l10 11m34 0 10-11M69 70l-9 13m31-13 9 13M80 26v12"/><path d="m59 94-8 17h58l-8-17Z"/>',
    boot: '<path d="M37 32h39v35l26 15 24 6v20H30V82l7-21V32Z"/><path d="M47 48h29M47 59h29m-36 49v9m22-9v9m24-9v9m24-9v9"/>',
    glove: '<path d="M45 75V39a7 7 0 0 1 14 0v28-38a7 7 0 0 1 14 0v38-44a7 7 0 0 1 14 0v44-36a7 7 0 0 1 14 0v45l9-13a9 9 0 0 1 15 10l-23 42H55L31 81a9 9 0 0 1 14-10l11 12"/><path d="M56 99h44"/>',
    young: '<path d="m80 22 10 24 26 2-20 17 6 26-22-14-22 14 6-26-20-17 26-2 10-24Z"/><path d="M80 86v20m-23 9h46"/>',
    puskas: '<circle cx="94" cy="29" r="10"/><path d="m86 42-19 24 19 13 30-7M67 66 44 88 30 88m56-9-5 24-19 12m6-67-18 6m35-8 27 9"/><circle cx="124" cy="37" r="12"/>',
    player: '<circle cx="80" cy="27" r="11"/><path d="m63 45 17 9 17-9 12 13-14 17 6 32H59l6-32-14-17 12-13Zm17 9v43m-30 20h60"/>',
  };
  const words = definition.label.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    if (`${line} ${word}`.trim().length > 24 && line) { lines.push(line); line = word; }
    else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180" role="img" aria-labelledby="title"><title id="title">${escape(definition.label)} - illustrated award</title><rect x="3" y="3" width="154" height="174" rx="18" fill="#101825" stroke="#cfaa54" stroke-width="2"/><g fill="#e1b654" fill-opacity=".2" stroke="#ffda79" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${shapes[definition.image]}</g><text x="80" y="${143 - Math.max(0, lines.length - 2) * 5}" text-anchor="middle" fill="#ffedbd" font-family="Arial,sans-serif" font-size="10" font-weight="700">${lines.map((text, index) => `<tspan x="80" dy="${index ? 12 : 0}">${escape(text)}</tspan>`).join("")}</text></svg>\n`;
}

async function main() {
  const output = new URL("../data/individualAwards.generated.json", import.meta.url);
  let previous = { awards: [] };
  if (process.argv.includes("--resume")) previous = JSON.parse(await readFile(output, "utf8"));
  const replace = process.argv.find((arg) => arg.startsWith("--replace="))?.slice(10).split(",") ?? [];
  const awards = previous.awards.filter((item) => !replace.includes(item.id));
  await mkdir(new URL("../public/awards/", import.meta.url), { recursive: true });
  const pages = new Map();
  for (const definition of AWARD_SOURCES) {
    if (awards.some((item) => item.id === definition.id)) continue;
    const source = `https://en.wikipedia.org/wiki/${encodeURIComponent(definition.page.replaceAll(" ", "_"))}`;
    let html = pages.get(source);
    if (!html) {
      await delay(1200);
      const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`${definition.id}: HTTP ${response.status}`);
      html = await response.text();
      pages.set(source, html);
    }
    const winners = extractAwardWinners(awardTables(html), definition);
    const supplements = SUPPLEMENTAL_WINNERS[definition.id] ?? [];
    for (const { name, season } of supplements) {
      if (!winners.some((winner) => winner.season === season)) throw new Error(`${definition.id}: missing supplemented edition ${season}`);
      if (!winners.some((winner) => winner.name === name && winner.season === season)) winners.push({ name, season });
    }
    console.log(`${definition.id}: ${winners.length} winner-seasons; ${new Set(winners.map((winner) => winner.name)).size} players`);
    const fallback = `/awards/${definition.id}.svg`;
    const photo = TROPHY_PHOTOS[definition.id];
    const src = photo ? `https://thumb.wikimedia.org/wikipedia/commons/thumb/${photo[0]}/${photo[1]}/250px-${photo[1]}` : fallback;
    await writeFile(new URL(`../public${fallback}`, import.meta.url), awardArtwork(definition));
    awards.push({ ...definition, source, ...(supplements.length ? { supplementalSources: [...new Set(supplements.map(({ source }) => source))] } : {}), winners, src, fallback, imageKind: photo ? "trophy-photo" : "labelled-illustration" });
    const sourceOrder = new Map(AWARD_SOURCES.map((definition, index) => [definition.id, index]));
    awards.sort((a, b) => sourceOrder.get(a.id) - sourceOrder.get(b.id));
    await writeFile(output, `${JSON.stringify({ checkedAt: new Date().toISOString(), awards }, null, 2)}\n`);
  }
  await writeFile(output, `${JSON.stringify({ checkedAt: new Date().toISOString(), awards }, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
