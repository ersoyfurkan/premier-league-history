import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";

const root = new URL("../", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) return nextResolve(new URL(`${specifier.slice(2)}${specifier.endsWith(".json") ? "" : ".ts"}`, root).href, context);
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith(root.href) && url.endsWith(".json")) {
      return { format: "module", shortCircuit: true, source: `export default ${readFileSync(fileURLToPath(url), "utf8")};` };
    }
    if (url.startsWith(root.href) && url.endsWith(".ts")) {
      return {
        format: "module",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
          compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
        }).outputText,
      };
    }
    return nextLoad(url, context);
  },
});

const { REAL_COMPETITIONS, TOURNAMENT_COMPETITIONS } = await import("../lib/competitions.ts");
const { STAT_TRIVIA_CATEGORIES, STAT_RONDO_CLUES } = await import("../data/statTrivia.ts");
const { AUTHORED_STAT_CATEGORIES, STAT_RECORDS } = await import("../data/statTriviaRecords.ts");
const { STAT_SEASONS } = await import("../data/statTriviaSeasons.ts");
const { BOARD_SIZE, generateBoardIds, tileById, triviaDifficulty, answersFor, matchTriviaAnswer } = await import("../data/triviaPath.ts");
const { RONDO_CLUES, isRondoAnswer } = await import("../data/rondo.ts");
const comps = ["general", ...REAL_COMPETITIONS, ...TOURNAMENT_COMPETITIONS];

test("all seven requested competitions have dated statistics and combination categories", () => {
  assert.equal(STAT_SEASONS.length, 7);
  for (const { comp, label, stats } of STAT_SEASONS) {
    assert.match(label, /202[234]/);
    for (const [metric, stat] of Object.entries(stats)) {
      assert.ok(stat.source.startsWith("https://"));
      assert.ok(stat.rows.length > 0);
      assert.ok(stat.rows.every((row) => row.value >= stat.minimum));
      assert.equal(new Set(stat.rows.map((row) => row.name)).size, stat.rows.length);
      assert.ok(STAT_TRIVIA_CATEGORIES[comp].some((category) => category.id.includes(`-${metric}-`)), `${comp}: ${metric}`);
    }
    assert.ok(STAT_TRIVIA_CATEGORIES[comp].some((category) => / AND /.test(category.noun)), `${comp}: goals + assists`);
    assert.ok(STAT_TRIVIA_CATEGORIES[comp].some((category) => category.id.endsWith("-goals-and-title")), `${comp}: goals + title`);
  }
});

test("every new tile reconstructs, has provenance, and accepts its answers without impossible dice requirements", () => {
  for (const comp of comps) {
    const categories = STAT_TRIVIA_CATEGORIES[comp];
    assert.equal(new Set(categories.map((category) => category.id)).size, categories.length, comp);
    for (const category of categories) {
      assert.ok(category.sources.length > 0);
      const tile = tileById(comp, category.id);
      assert.ok(tile, `${comp}: ${category.id}`);
      assert.deepEqual(tile.entries, category.entries);
      for (let roll = 1; roll <= 6; roll += 1) {
        assert.ok(answersFor(tile, roll) >= 1);
        assert.ok(answersFor(tile, roll) <= tile.entries.length);
      }
      for (const entry of tile.entries) {
        assert.equal(matchTriviaAnswer(tile.entries, entry.name)?.name, entry.name, `${category.id}: ${entry.name}`);
        for (const alias of entry.aliases) assert.equal(matchTriviaAnswer(tile.entries, alias)?.name, entry.name, `${category.id}: ${alias}`);
      }
    }
  }
});

test("boards are unique, reconstructible and nondecreasing, with the bank's highest difficulty at the finish", () => {
  for (const comp of comps) {
    for (let run = 0; run < 10; run += 1) {
      const ids = generateBoardIds(comp);
      assert.equal(ids.length, BOARD_SIZE);
      assert.equal(new Set(ids).size, BOARD_SIZE);
      const tiles = ids.map((id) => tileById(comp, id));
      assert.ok(tiles.every(Boolean), comp);
      const scores = tiles.map(triviaDifficulty);
      assert.deepEqual(scores, [...scores].sort((a, b) => a - b), comp);
      const bankMaximum = Math.max(...STAT_TRIVIA_CATEGORIES[comp].map(triviaDifficulty));
      if (Number.isFinite(bankMaximum)) assert.ok(scores.at(-1) >= bankMaximum, comp);
      assert.ok(scores.slice(0, -1).every((score) => score < scores.at(-1)), `${comp}: finish must be strictly hardest`);
      if (STAT_TRIVIA_CATEGORIES[comp].some((category) => category.difficulty === 5)) {
        assert.equal(tiles.at(-1).difficulty, 5);
      }
    }
  }
});

test("Rondo includes the sourced additions and preserves valid A-Z questions", () => {
  for (const comp of comps) {
    for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") assert.ok(RONDO_CLUES[comp].some((clue) => clue.letter === letter), `${comp}: ${letter}`);
    for (const clue of STAT_RONDO_CLUES[comp]) {
      assert.match(clue.letter, /^[A-Z]$/);
      assert.ok(RONDO_CLUES[comp].some((question) => question.clue === clue.clue && question.letter === clue.letter));
      assert.ok(isRondoAnswer(clue, clue.answers[0]));
      assert.equal(clue.answers[0][0].toUpperCase(), clue.letter);
    }
  }
});

test("known statistical boundaries and combined answers are correct", () => {
  const find = (comp, suffix) => STAT_TRIVIA_CATEGORIES[comp].find((category) => category.id.endsWith(suffix));
  assert.deepEqual(find("laliga", "laliga-career-goals-300").entries.map((entry) => entry.name), ["Lionel Messi", "Cristiano Ronaldo"]);
  assert.deepEqual(find("worldcup", "worldcup-career-goals-15").entries.map((entry) => entry.name), ["Miroslav Klose", "Ronaldo Nazario"]);
  assert.equal(find("euros", "euros-career-goals-9").entries.length, 2);
  assert.deepEqual(find("seriea", "seriea-career-penalty-saves-24").entries.map((entry) => entry.name), ["Samir Handanovic", "Gianluca Pagliuca"]);
  for (const set of STAT_RECORDS) for (const threshold of set.thresholds) assert.ok(threshold >= set.minimum);
  const season = (comp) => STAT_SEASONS.find((edition) => edition.comp === comp);
  assert.equal(season("bundesliga").stats.goals.rows[0].value, 36);
  assert.equal(season("ligue1").stats.goals.rows[0].value, 27);
  assert.equal(season("copa").stats.goals.rows[0].value, 5);
  assert.equal(season("seriea").stats.goals.rows.find((row) => row.name === "Victor Osimhen").value, 15);
  assert.equal(season("seriea").stats.goals.rows.find((row) => row.name === "Romelu Lukaku").value, 13);
  for (const final of AUTHORED_STAT_CATEGORIES.filter((category) => category.id.startsWith("final-"))) {
    assert.equal(final.difficulty, 5);
    assert.equal(final.answers.length, 1);
  }
});

console.info("New question-bank additions:", STAT_SEASONS.map(({ comp }) => `${comp}: ${STAT_TRIVIA_CATEGORIES[comp].length} Trivia Path / ${STAT_RONDO_CLUES[comp].length} Rondo`).join("; "));
