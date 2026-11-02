import { readFile, writeFile } from "node:fs/promises";
import ts from "typescript";
import { setTimeout as delay } from "node:timers/promises";

const root = new URL("../", import.meta.url);
const names = new Set();
for (const [file, variable] of [["data/nations.ts", "NATION_INFO"], ["data/nationVisuals.ts", "extraNations"]]) {
  const source = ts.createSourceFile(file, await readFile(new URL(file, root), "utf8"), ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === variable && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      for (const property of node.initializer.properties) {
        if (ts.isPropertyAssignment(property) && ts.isArrayLiteralExpression(property.initializer)) names.add(property.initializer.elements[0].text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
const pages = {
  "Soviet Union": "Soviet Union national football team",
  Czechoslovakia: "Czechoslovakia national football team",
  Yugoslavia: "Yugoslavia national football team",
  "FR Yugoslavia": "Serbia and Montenegro national football team",
  "East Germany": "East Germany national football team",
  "West Germany": "Germany national football team",
  "Serbia and Montenegro": "Serbia and Montenegro national football team",
  "United States": "United States men's national soccer team",
  Canada: "Canada men's national soccer team",
  Australia: "Australia men's national soccer team",
  "New Zealand": "New Zealand men's national football team",
  "Republic of Ireland": "Republic of Ireland men's national football team",
  Sweden: "Swedish Football Association",
  Mali: "Malian Football Federation",
  Haiti: "Haitian Football Federation",
};
Object.keys(pages).forEach((name) => names.add(name));
const output = new URL("data/nationCrests.generated.json", root);
const crests = process.argv.includes("--missing-only") ? JSON.parse(await readFile(output, "utf8")).crests : {};
const missing = new Set();
const save = () => writeFile(output, `${JSON.stringify({ checkedAt: new Date().toISOString(), crests, missing: [...missing] }, null, 2)}\n`);

async function crestFromPage(page) {
  const api = `https://en.wikipedia.org/w/api.php?action=parse&prop=text&redirects=1&format=json&page=${encodeURIComponent(page)}`;
  await delay(1200);
  let response = await fetch(api);
  for (let retry = 0; response.status === 429 && retry < 4; retry += 1) {
    const seconds = Number(response.headers.get("retry-after"));
    const wait = Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 10000 * (retry + 1);
    console.error(`${page}: rate limited, retrying in ${wait / 1000}s`);
    await delay(wait);
    response = await fetch(api);
  }
  if (!response.ok) throw new Error(`${page}: Wikipedia returned ${response.status}`);
  const body = await response.json();
  if (body.error) throw new Error(`${page}: ${body.error.info}`);
  const html = body.parse.text["*"];
  const infobox = html.match(/<table\b[^>]*class="[^"]*\binfobox\b[^"]*"[\s\S]*?<\/table>/i)?.[0];
  const images = [...(infobox ?? "").matchAll(/<img\b[^>]*>/gi)].map(([tag]) => ({
    alt: tag.match(/\balt="([^"]*)"/)?.[1] ?? "",
    src: tag.match(/\bsrc="([^"]*)"/)?.[1] ?? "",
  }));
  const image = images.find(({ alt, src }) => /badge|crest|logo|emblem|association|Mali_FF_|Federation_Haitienne_de_Football/i.test(`${alt} ${src}`) && !/flag_of|kit_|football_pictogram/i.test(src));
  const association = infobox?.match(/>Association<\/th>[\s\S]*?<a\b[^>]*title="([^"]+)"/i)?.[1]?.replaceAll("&amp;", "&");
  return { image, association, page: body.parse.title };
}

for (const name of names) {
  if (crests[name]) continue;
  const page = pages[name] ?? `${name} national football team`;
  let result = await crestFromPage(page);
  if (!result.image && result.association && result.association !== page) result = await crestFromPage(result.association);
  if (!result.image) {
    missing.add(name);
    console.error(`No verified crest found: ${name} (${result.page})`);
    await save();
    continue;
  }
  const src = new URL(result.image.src.replaceAll("&amp;", "&"), "https://en.wikipedia.org").href.split("?")[0];
  crests[name] = { src, source: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.page.replaceAll(" ", "_"))}` };
  console.log(`${name}: ${src}`);
  await save();
}
await save();
console.log(`Saved ${Object.keys(crests).length} crests; ${missing.size} missing.`);
if (missing.size) process.exitCode = 1;
