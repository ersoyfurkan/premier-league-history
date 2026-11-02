import { readFileSync, writeFileSync } from "node:fs";
import "./register-data.mjs";
import { awardPlayerKey } from "../data/footballNames.ts";

const source = JSON.parse(readFileSync(new URL("../data/quizFootball.generated.json", import.meta.url), "utf8"));
const output = new URL("../data/footballBattleship.generated.json", import.meta.url);
const names = [];
const nameIds = new Map();
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
const hasThree = (first, second) => {
  let count = 0;
  for (const id of first) if (second.has(id) && ++count === 3) return true;
  return false;
};

function candidates(comp, prepared) {
  const clubs = prepared.pool.filter(({ clue, members }) =>
    clue.label.startsWith("Played for ") && members.length >= 5,
  ).sort((a, b) => b.members.length - a.members.length).slice(0, 24);
  const conditions = [];
  const add = (entries) => {
    const members = new Set(entries.flatMap(({ members }) => members.map((index) =>
      playerId(source.records[prepared.facts[index]].name),
    )));
    const ids = entries.map(({ clue }) => clue.label).sort();
    conditions.push({
      id: `${comp}:${ids.join("|")}`,
      label: entries.length === 1 ? entries[0].clue.label :
        `Played for ${entries.map(({ clue }) => clue.label.slice("Played for ".length)).join(" OR ")}`,
      members: [...members].sort((a, b) => a - b),
      set: members,
      width: entries.length,
    });
  };
  clubs.forEach((club) => add([club]));
  for (let a = 0; a < clubs.length; a += 1) {
    for (let b = a + 1; b < clubs.length; b += 1) add([clubs[a], clubs[b]]);
  }
  return conditions;
}

function distinctAssignments(answers) {
  const assigned = new Map();
  function match(cell, seen) {
    for (const id of answers[cell]) {
      if (seen.has(id)) continue;
      seen.add(id);
      if (!assigned.has(id) || match(assigned.get(id), seen)) {
        assigned.set(id, cell);
        return true;
      }
    }
    return false;
  }
  return answers.every((_, cell) => match(cell, new Set()));
}

const competitions = {};
for (const [comp, prepared] of Object.entries(source.competitions)) {
  const pool = candidates(comp, prepared);
  const compatible = pool.map((row) => pool.map((column, index) =>
    row.id !== column.id && hasThree(row.members, column.set) ? index : -1,
  ).filter((index) => index >= 0));
  const variants = [];
  const signatures = new Set();
  for (let attempt = 0; attempt < 1500 && variants.length < 4; attempt += 1) {
    const rows = [];
    let columns = pool.map((_, index) => index);
    const order = shuffle(pool.map((_, index) => index))
      .sort((a, b) => pool[a].width - pool[b].width);
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
    const picked = shuffle(columns).sort((a, b) => pool[a].width - pool[b].width).slice(0, 8);
    const answers = rows.flatMap((row) => picked.map((column) => intersect(pool[row].members, pool[column].set)));
    if (!answers.every((cell) => cell.length >= 3) || !distinctAssignments(answers)) continue;
    const signature = [...rows].sort((a, b) => a - b).join(",") + ":" + [...picked].sort((a, b) => a - b).join(",");
    if (signatures.has(signature)) continue;
    signatures.add(signature);
    const clue = (index) => ({ id: pool[index].id, label: pool[index].label });
    variants.push({ rows: rows.map(clue), columns: picked.map(clue), answers });
  }
  if (variants.length !== 4) throw new Error(`Could not prepare four complete ${comp} boards`);
  competitions[comp] = variants;
}
const content = JSON.stringify({ names, competitions }) + "\n";
if (process.argv.includes("--check")) {
  if (readFileSync(output, "utf8") !== content) throw new Error("Football Battleship snapshot is out of date");
} else {
  writeFileSync(output, content);
}
console.log(`Football Battleship: ${Object.keys(competitions).length} scopes, four 8x8 boards each, >=3 answers/cell, 64 distinct answer assignments.`);
