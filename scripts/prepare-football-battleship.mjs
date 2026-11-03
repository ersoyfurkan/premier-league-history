import { readFileSync, writeFileSync } from "node:fs";
import "./register-data.mjs";
import { awardPlayerKey } from "../data/footballNames.ts";

const source = JSON.parse(readFileSync(new URL("../data/quizFootball.generated.json", import.meta.url), "utf8"));
const awardSource = JSON.parse(readFileSync(new URL("../data/individualAwards.generated.json", import.meta.url), "utf8"));
const awardById = new Map(awardSource.awards.map((award) => [award.id, award]));
const output = new URL("../data/footballBattleship.generated.json", import.meta.url);
const previous = JSON.parse(readFileSync(output, "utf8"));
// Retain the original four variants and name indices for rooms already in D1.
const legacyVariantCount = previous.legacyVariantCount ?? 4;
const names = [...previous.names];
const nameIds = new Map(names.map((name, index) => [awardPlayerKey(name.replace(/ı/g, "i")), index]));
const playerId = (name) => {
  const key = awardPlayerKey(name.replace(/ı/g, "i"));
  if (!nameIds.has(key)) {
    nameIds.set(key, names.length);
    names.push(name);
  }
  return nameIds.get(key);
};
let seed = 924731;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 0x100000000;
};
const shuffle = (items) => items.map((value) => ({ value, rank: random() }))
  .sort((a, b) => a.rank - b.rank).map(({ value }) => value);
const intersect = (first, second) => first.filter((id) => second.has(id));
const kinds = ["club", "nation", "award", "trophy", "manager", "teammate"];
const kindOf = (clue) => {
  if (/\b(?:OR|AND)\b/.test(clue.label)) return null;
  if (clue.label.startsWith("Played for ")) return "club";
  if (clue.label.endsWith(" international")) return "nation";
  if (clue.awardIds?.length === 1) return "award";
  if (clue.label.startsWith("Managed by ")) return "manager";
  if (clue.label.startsWith("Teammate of ")) return "teammate";
  if (/winner|champion/i.test(clue.label) && !clue.awardIds?.length) return "trophy";
  return null;
};

function candidates(comp, prepared) {
  const conditions = [];
  const identities = new Set();
  for (const { clue, members: indices } of [...prepared.pool, ...prepared.nations]) {
    const kind = kindOf(clue);
    if (!kind || !indices.length) continue;
    if ((kind === "club" || kind === "nation") && !clue.badge) {
      throw new Error(`Missing ${kind} logo: ${clue.label}`);
    }
    const identity = `${kind}:${kind === "club" || kind === "nation" ? clue.badge : clue.label}`;
    if (identities.has(identity)) continue;
    identities.add(identity);
    const members = new Set(indices.map((index) =>
      playerId(source.records[prepared.facts[index]].name),
    ));
    const award = kind === "award" ? awardById.get(clue.awardIds[0]) : undefined;
    const reference = award && clue.label === `${award.label} winner`
      ? `Recorded winners: ${award.winners[0].season} to ${award.winners.at(-1).season}` : undefined;
    if (award) {
      const winners = new Set(award.winners.map(({ name }) => awardPlayerKey(name.replace(/ı/g, "i"))));
      for (const id of members) {
        if (!winners.has(awardPlayerKey(names[id].replace(/ı/g, "i")))) {
          throw new Error(`Incorrect award membership: ${names[id]} / ${clue.label}`);
        }
      }
    }
    conditions.push({
      ...clue,
      reference,
      source: award?.source,
      id: `${comp}:${clue.label}`,
      kind,
      identity,
      members: [...members].sort((a, b) => a - b),
      set: members,
    });
  }
  return conditions;
}

const competitions = {};
for (const [comp, prepared] of Object.entries(source.competitions)) {
  const pool = candidates(comp, prepared);
  const compatible = pool.map((row) => pool.map((column, index) =>
    row.identity !== column.identity && row.members.some((id) => column.set.has(id)) ? index : -1,
  ).filter((index) => index >= 0));
  const variants = [];
  const signatures = new Set();
  const covered = new Set();
  for (let attempt = 0; attempt < 12000 && (variants.length < 8 || covered.size < kinds.length); attempt += 1) {
    const rows = [];
    let columns = pool.map((_, index) => index);
    const missing = kinds.filter((kind) => !covered.has(kind));
    const desired = (missing.length ? missing : kinds)[attempt % (missing.length || kinds.length)];
    const order = shuffle(pool.map((_, index) => index));
    const seedNation = order.find((index) => pool[index].kind === "nation" && compatible[index].length >= 8);
    const priority = (index) => index === seedNation ? 2 : pool[index].kind === desired ? 1 : 0;
    order.sort((a, b) => priority(b) - priority(a));
    for (const row of order) {
      if (columns.length < 8) break;
      const allowed = new Set(compatible[row]);
      const next = columns.filter((index) => allowed.has(index) && !rows.includes(index));
      if (next.length < 8 || next.filter((index) => !rows.includes(index) && index !== row).length < 8) continue;
      rows.push(row);
      columns = next.filter((index) => index !== row);
      if (rows.length === 8) break;
    }
    if (rows.length !== 8) continue;
    const usedKinds = new Set(rows.map((index) => pool[index].kind));
    const picked = [];
    for (const index of shuffle(columns)) {
      if (!usedKinds.has(pool[index].kind)) {
        picked.push(index);
        usedKinds.add(pool[index].kind);
      }
    }
    for (const index of shuffle(columns)) {
      if (picked.length === 8) break;
      if (!picked.includes(index)) picked.push(index);
    }
    if (picked.length !== 8 || !usedKinds.has(desired) || !usedKinds.has("club") || !usedKinds.has("nation") || usedKinds.size < 4) continue;
    const answers = rows.flatMap((row) => picked.map((column) => intersect(pool[row].members, pool[column].set)));
    if (!answers.every((cell) => cell.length >= 1)) continue;
    const signature = [...rows].sort((a, b) => a - b).join(",") + ":" + [...picked].sort((a, b) => a - b).join(",");
    if (signatures.has(signature)) continue;
    signatures.add(signature);
    const clue = (index) => {
      const { id, label, kind, identity, badge, badgeAlt, badgeFallback, awardIds, reference, source } = pool[index];
      return { id, label, kind, identity, badge, badgeAlt, badgeFallback, awardIds, reference, source };
    };
    variants.push({ rows: rows.map(clue), columns: picked.map(clue), answers });
    usedKinds.forEach((kind) => covered.add(kind));
  }
  if (variants.length < 8 || covered.size < kinds.length) {
    throw new Error(`Could not prepare mixed ${comp} boards (${variants.length}; categories ${[...covered]})`);
  }
  competitions[comp] = [...previous.competitions[comp].slice(0, legacyVariantCount), ...variants];
}
const content = JSON.stringify({ legacyVariantCount, awardsCheckedAt: awardSource.checkedAt, names, competitions }) + "\n";
if (process.argv.includes("--check")) {
  if (readFileSync(output, "utf8") !== content) throw new Error("Football Battleship snapshot is out of date");
} else {
  writeFileSync(output, content);
}
console.log(`Football Battleship: ${Object.keys(competitions).length} scopes, single-category mixed 8x8 boards, >=1 verified answer/cell.`);
