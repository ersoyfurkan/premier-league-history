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
const { BOARD_SIZE, NORMAL_TILE_MIN_ANSWERS, FINAL_TILE_MIN_ANSWERS, uniqueTriviaEntries, generateBoardIds, tileById, triviaDifficulty, answersFor, matchTriviaAnswer, suggestTrivia } = await import("../data/triviaPath.ts");
const { RONDO_CLUES, isRondoAnswer } = await import("../data/rondo.ts");
const { KNOWLEDGE_TRIVIA_CATEGORIES, KNOWLEDGE_RONDO_CLUES } = await import("../data/knowledgeTrivia.ts");
const { FOOTBALL_KNOWLEDGE_GROUPS, MODERN_SQUADS, MODERN_MANAGER_GROUPS, TEAMMATE_GROUPS, knowledgeMatches } = await import("../data/footballKnowledge.ts");
const { STADIUM_COUNTRIES } = await import("../data/stadiumTrivia.ts");
const { FOOTBALL_TIC_TAC_TOE, footballFacts, randomFootballTicTacToePuzzle, isFootballTicTacToeAnswer } = await import("../data/footballTicTacToe.ts");
const { triviaTileVisuals, triviaBoardPresentation } = await import("../data/triviaPathVisuals.ts");
const { NATION_INFO } = await import("../data/nations.ts");
const { nationFlagSrc, nationMentions } = await import("../data/nationVisuals.ts");
const { default: tournamentHistory } = await import("../data/tournamentHistory.generated.json");
const { freshState, pathView, startPlay } = await import("../lib/triviaPathState.ts");
const { extractClubPlayers } = await import("./refresh-club-history.mjs");
const comps = ["general", ...REAL_COMPETITIONS, ...TOURNAMENT_COMPETITIONS];

test("nation visuals cover every historical tournament nation, aliases and combined hosts", () => {
  for (const [code, [name, iso]] of Object.entries(NATION_INFO)) {
    assert.equal(nationFlagSrc(code), nationFlagSrc(iso), name);
    assert.equal(nationFlagSrc(name), nationFlagSrc(code), name);
    assert.equal(nationMentions(name)[0]?.name, name);
  }
  for (const [comp, tables] of Object.entries(tournamentHistory.tournaments)) {
    for (const [kind, table] of Object.entries(tables)) {
      if (!table) continue;
      const columns = table.headers.flatMap((header, index) => /^(team|nation|country|hosts?|champions|winners|runners-up)$/i.test(header) ? [index] : []);
      for (const row of table.rows) {
        for (const column of columns) {
          const text = row[column];
          if (/^(Totals|Various|Europe)\b/.test(text) || !/\p{L}/u.test(text)) continue;
          const mentions = nationMentions(text);
          assert.ok(mentions.length, `${comp} ${kind}: ${text}`);
          let cursor = 0;
          let remainder = "";
          for (const mention of mentions) {
            assert.ok(mention.src.startsWith("https://"));
            remainder += text.slice(cursor, mention.start);
            cursor = mention.end;
          }
          remainder += text.slice(cursor);
          assert.ok(!/\p{L}/u.test(remainder), `Unrecognized country text: ${text} -> ${remainder}`);
        }
      }
    }
  }
  assert.deepEqual(nationMentions("Canada, Mexico, United States").map((nation) => nation.name), ["Canada", "Mexico", "United States"]);
  assert.deepEqual(nationMentions("West Germany, Germany").map((nation) => nation.name), ["West Germany", "Germany"]);
  assert.deepEqual(nationMentions("FR Yugoslavia").map((nation) => nation.name), ["FR Yugoslavia"]);
  assert.notEqual(nationFlagSrc("Soviet Union"), nationFlagSrc("Russia"));
  assert.notEqual(nationFlagSrc("East Germany"), nationFlagSrc("Germany"));
  for (const text of ["Argentinian", "Finnish", "Ivorian", "Nigerian", "South African", "Northern Irish", "Uruguayan"]) {
    assert.equal(nationMentions(`${text} players`, true).length, 1, text);
  }
  for (const text of ["C\u00f4te d\u2019Ivoire", "T\u00fcrkiye", "Curacao"]) {
    const [mention] = nationMentions(text);
    assert.equal(text.slice(mention.start, mention.end), text);
  }
  assert.deepEqual(nationMentions("International totals (10 entries)"), []);
  assert.deepEqual(nationMentions("South American nations", true), []);
  assert.deepEqual(nationMentions("North American players", true), []);
  assert.throws(() => nationFlagSrc("not a nation"), /Unknown nation visual/);
});

test("Trivia Path and Tic-Tac-Toe share nation assets without ambiguous partial matches", () => {
  const base = tileById("general", "s-clubs");
  for (const [word, name] of [["Uruguayan", "Uruguay"], ["Nigerian", "Nigeria"], ["Finnish", "Finland"], ["South African", "South Africa"], ["Bolivia", "Bolivia"]]) {
    const visuals = triviaTileVisuals({ ...base, id: "test-nation", noun: `${word} players`, short: word, logos: [] });
    assert.ok(visuals.some((visual) => visual.kind === "image" && visual.label === name && visual.src === nationFlagSrc(name)), word);
  }
  for (const comp of comps) {
    const puzzles = [FOOTBALL_TIC_TAC_TOE[comp], randomFootballTicTacToePuzzle(comp)];
    for (const puzzle of puzzles) {
      for (const clue of [...puzzle.rows, ...puzzle.columns]) {
        if (!/international/.test(clue.label)) continue;
        const [nation] = nationMentions(clue.label, true);
        assert.ok(nation, `${comp}: ${clue.label}`);
        assert.equal(clue.badge, nation.src, `${comp}: ${clue.label}`);
      }
    }
  }
});

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
    const categories = [...STAT_TRIVIA_CATEGORIES[comp], ...KNOWLEDGE_TRIVIA_CATEGORIES[comp]];
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
      const bankMaximum = Math.max(...[...STAT_TRIVIA_CATEGORIES[comp], ...KNOWLEDGE_TRIVIA_CATEGORIES[comp]]
        .filter((category) => uniqueTriviaEntries(category.entries).length >= FINAL_TILE_MIN_ANSWERS).map(triviaDifficulty));
      if (Number.isFinite(bankMaximum)) assert.ok(scores.at(-1) >= bankMaximum, comp);
      assert.ok(scores.slice(0, -1).every((score) => score < scores.at(-1)), `${comp}: finish must be strictly hardest`);
      for (let index = 0; index < tiles.length; index += 1) {
        const minimum = index === BOARD_SIZE - 1 ? FINAL_TILE_MIN_ANSWERS : NORMAL_TILE_MIN_ANSWERS;
        assert.ok(tiles[index].entries.length >= minimum, `${comp}: ${ids[index]} has fewer than ${minimum} answers`);
        assert.equal(tiles[index].entries.length, uniqueTriviaEntries(tiles[index].entries).length);
      }
    }
  }
});

test("Origi is accepted for Forest and other senior clubs, including loans", () => {
  for (const [comp, key] of [["general", "nfo"], ["pl", "nfo"], ["general", "lil"], ["seriea", "mil"]]) {
    const tile = tileById(comp, `c-${key}`);
    assert.ok(tile, `${comp}: ${key}`);
    assert.equal(matchTriviaAnswer(tile.entries, "Divock Origi")?.name, "Divock Origi");
    assert.equal(matchTriviaAnswer(tile.entries, "Origi")?.name, "Divock Origi");
  }
  for (const key of ["udi", "lec", "fio", "che", "juv", "inter", "ata"]) {
    const tile = tileById("general", `c-${key}`);
    assert.ok(tile, key);
    assert.equal(matchTriviaAnswer(tile.entries, "Juan Cuadrado")?.name, "Juan Cuadrado");
    assert.equal(matchTriviaAnswer(tile.entries, "Cuadrado")?.name, "Juan Cuadrado");
  }
});

test("tile visual clues encode combined stats, trophies, flags and teammates without question prose", () => {
  const tile = (noun) => ({ id: "visual-test", short: "", noun, plural: noun, entries: [], logos: [] });
  const goals = triviaTileVisuals(tile("player who scored 100+ goals for Barcelona"));
  assert.ok(goals.some((visual) => visual.kind === "image" && visual.label === "Barcelona"));
  assert.ok(goals.some((visual) => visual.kind === "icon" && visual.icon === "ball"));
  assert.ok(goals.some((visual) => visual.kind === "badge" && visual.text === "100+"));
  const assists = triviaTileVisuals(tile("player who provided 50+ assists for Barcelona"));
  assert.ok(assists.some((visual) => visual.kind === "image" && visual.label === "Barcelona"));
  assert.ok(assists.some((visual) => visual.kind === "icon" && visual.icon === "boot"));
  const ucl = triviaTileVisuals(tile("player who won the Champions League at least 3 times"));
  assert.ok(ucl.some((visual) => visual.kind === "icon" && visual.icon === "trophy"));
  assert.ok(ucl.some((visual) => visual.kind === "badge" && visual.text === "3x"));
  const brazil = triviaTileVisuals(tile("football stadium in Brazil"));
  assert.ok(brazil.some((visual) => visual.kind === "image" && visual.label === "Brazil"));
  assert.ok(brazil.some((visual) => visual.kind === "icon" && visual.icon === "stadium"));
  const teammates = triviaTileVisuals(tileById("general", "s-knowledge-teammate-bar1415-lionelmessi"));
  assert.ok(teammates.some((visual) => visual.kind === "image" && visual.label === "Lionel Messi"));
  assert.ok(teammates.some((visual) => visual.kind === "icon" && visual.icon === "players"));
  const england = triviaTileVisuals(tile("England international"));
  assert.ok(!england.some((visual) => visual.label === "Inter"));
});

test("final tile stays secret in both online views and is permanently revealed on the first landing", () => {
  const state = freshState("general", "secret-host-token");
  state.p2Token = "secret-guest-token";
  state.phase = "roll";
  const finalTile = tileById(state.comp, state.board.at(-1));
  assert.ok(finalTile.entries.length >= FINAL_TILE_MIN_ANSWERS);
  for (const side of ["p1", "p2"]) {
    const view = pathView(state, side, 0);
    assert.deepEqual(view.tiles.at(-1), { hidden: true, visuals: [] });
    const serialized = JSON.stringify(view);
    for (const forbidden of ["secret-host-token", "secret-guest-token", finalTile.id, finalTile.noun, finalTile.short]) {
      if (forbidden) assert.ok(!serialized.includes(forbidden), forbidden);
    }
    assert.ok(!("shorts" in view));
    assert.ok(!("board" in view));
  }
  state.pos.p1 = BOARD_SIZE - 6;
  startPlay(state, 1000, 6);
  assert.equal(state.required, 6);
  assert.equal(state.finalRevealed, true);
  for (const side of ["p1", "p2"]) {
    const view = pathView(state, side, 1000);
    assert.equal(view.tiles.at(-1).hidden, false);
    assert.ok(view.tiles.at(-1).visuals.length > 0);
    assert.equal(view.question, state.question);
  }
  // A failed attempt leaves positions unchanged; reveal must survive later turns and reloads.
  state.phase = "roll";
  state.dice = null;
  state.question = null;
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(pathView(restored, "p2", 2000).tiles.at(-1).hidden, false);
  const fresh = freshState("general", "new-token");
  assert.equal(pathView(fresh, "p1", 0).tiles.at(-1).hidden, true);
  const tiles = fresh.board.map((id) => tileById(fresh.comp, id));
  assert.deepEqual(triviaBoardPresentation(tiles, false).at(-1), { hidden: true, visuals: [] });
  assert.equal(triviaBoardPresentation(tiles, true).at(-1).hidden, false);
});

test("club-history import requires actual positive appearances, not a transfer or a squad listing", () => {
  const html = `<table class="wikitable"><tr><th>Name</th><th>Career</th><th>Appearances</th></tr>
    <tr><td><a href="/wiki/Divock_Origi">Divock Origi</a></td><td>2023-2024</td><td>22</td></tr>
    <tr><td>Unused Signing</td><td>2024-2025</td><td>0</td></tr>
    <tr><td>Unknown appearances</td><td>2024-2025</td><td>-</td></tr></table>`;
  assert.deepEqual(extractClubPlayers(html), ["Divock Origi"]);
  const substitute = `<table class="wikitable"><tr><th rowspan="2">Player</th><th colspan="3">Appearances</th></tr>
    <tr><th>Starts</th><th>Subs</th><th>Total</th></tr>
    <tr><td>Senior Substitute</td><td>0</td><td>1</td><td>1</td></tr></table>`;
  assert.deepEqual(extractClubPlayers(substitute), ["Senior Substitute"]);
  const appearances = uniqueTriviaEntries([{ name: "Luka Modric", aliases: ["Modric"] }, { name: "Luka Modrić", aliases: [] }]);
  assert.equal(appearances.length, 1);
  assert.equal(uniqueTriviaEntries([{ name: "Xavi", aliases: [] }, { name: "Xavi Hernandez", aliases: ["Xavi"] }]).length, 1);
});

test("Rondo includes the sourced additions and preserves valid A-Z questions", () => {
  for (const comp of comps) {
    for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") assert.ok(RONDO_CLUES[comp].some((clue) => clue.letter === letter), `${comp}: ${letter}`);
    for (const clue of [...STAT_RONDO_CLUES[comp], ...KNOWLEDGE_RONDO_CLUES[comp]]) {
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

const knowledge = (id) => {
  const group = FOOTBALL_KNOWLEDGE_GROUPS.find((group) => group.id === id);
  assert.ok(group, id);
  return group;
};
const accepts = (id, name) => knowledgeMatches(knowledge(id).entries, name);

test("stadiums use physical venues, country scopes, searchable aliases, and club-home Rondo clues", () => {
  for (const country of STADIUM_COUNTRIES) {
    const tile = tileById("general", `s-knowledge-stadiums-${country.country.toLowerCase()}`);
    assert.ok(tile);
    assert.equal(new Set(tile.entries.map((entry) => entry.name)).size, tile.entries.length);
    assert.ok(tile.noun.includes(country.country));
    for (const entry of tile.entries) {
      assert.equal(matchTriviaAnswer(tile.entries, entry.name)?.name, entry.name);
      for (const alias of entry.aliases) assert.equal(matchTriviaAnswer(tile.entries, alias)?.name, entry.name);
    }
  }
  const brazil = tileById("general", "s-knowledge-stadiums-brazil");
  assert.equal(brazil.entries.length, 10);
  assert.equal(matchTriviaAnswer(brazil.entries, "Estadio Jornalista Mario Filho")?.name, "Maracana");
  assert.equal(matchTriviaAnswer(brazil.entries, "Anfield"), null);
  assert.ok(suggestTrivia("general", "Maracana").includes("Maracana"));
  assert.ok(suggestTrivia("pl", "Anfield").includes("Anfield"));
  const anfield = KNOWLEDGE_RONDO_CLUES.pl.find((clue) => clue.letter === "A" && /Liverpool's home/.test(clue.clue));
  assert.ok(anfield);
  assert.ok(isRondoAnswer(anfield, "Anfield"));
  assert.ok(!isRondoAnswer(anfield, "Old Trafford"));
});

test("relationships require documented modern spells and exclude self and non-overlapping club eras", () => {
  for (const group of FOOTBALL_KNOWLEDGE_GROUPS) {
    assert.equal(new Set(group.entries.map((entry) => entry.name)).size, group.entries.length, group.id);
    assert.ok(group.entries.length > 0);
    assert.ok(group.sources.every((source) => source.startsWith("https://")));
  }
  for (const squad of MODERN_SQUADS) {
    const years = squad.season.match(/\d{4}/g).map(Number);
    assert.ok(years.every((year) => year >= 2010 && year <= 2025));
    assert.ok(!/capello|keegan|lippi|rijkaard/i.test(squad.manager));
    for (const anchor of squad.anchors) {
      assert.ok(knowledgeMatches(squad.entries, anchor));
      const group = TEAMMATE_GROUPS.find((group) => group.id.startsWith(`teammate-${squad.id}-`) && group.label.includes(anchor));
      assert.ok(group);
      assert.ok(!knowledgeMatches(group.entries, anchor));
    }
  }
  assert.ok(accepts("manager-liv1920", "Mohamed Salah"));
  assert.ok(!accepts("manager-liv1920", "Steven Gerrard"));
  assert.ok(!accepts("manager-liv1920", "Luis Suarez"));
  assert.ok(!accepts("manager-liv1920", "Tom Hill"));
  assert.ok(!accepts("manager-liv1920", "Luis Longstaff"));
  assert.ok(!accepts("manager-liv1920", "Leighton Clarkson"));
  assert.ok(!accepts("manager-rma1314", "Jose Rodriguez"));
  assert.ok(!accepts("manager-mci2223", "Neymar"));
  assert.ok(!accepts("manager-mci2223", "Luis Suarez"));
  assert.ok(accepts("manager-mun1011", "Wayne Rooney"));
  assert.ok(!accepts("manager-mun1011", "Cristiano Ronaldo"));
  assert.ok(!accepts("manager-che2021", "Fikayo Tomori"));
  assert.ok(!accepts("teammate-bar1415-lionelmessi", "Ousmane Dembele"));
  assert.ok(accepts("teammate-psg2122-lionelmessi", "Sergio Ramos"));
  assert.ok(accepts("teammate-liv1920-sadiomane", "Andy Robertson"));
});

test("dated honours and difficult compound categories enforce all their conditions", () => {
  assert.deepEqual(knowledge("ballon-2016-2025-no-duopoly").entries.map((entry) => entry.name),
    ["Luka Modric", "Karim Benzema", "Rodri", "Ousmane Dembele"]);
  for (const name of ["Lionel Messi", "Cristiano Ronaldo", "Harry Kane"]) assert.ok(!accepts("ballon-2016-2025-no-duopoly", name));
  for (const name of ["Lionel Messi", "Ronaldo Nazario", "Kaka"]) assert.ok(accepts("ballon-worldcup", name));
  for (const name of ["Cristiano Ronaldo", "Luka Modric", "Karim Benzema"]) assert.ok(!accepts("ballon-worldcup", name));
  assert.equal(knowledge("worldcup-2021-2025").entries.length, 26);
  assert.ok(!accepts("worldcup-2021-2025", "Giovani Lo Celso"));
  assert.ok(!accepts("worldcup-2021-2025", "Nicolas Gonzalez"));
  assert.ok(accepts("copa-2021-2025", "Giovani Lo Celso"));
  assert.ok(accepts("copa-2021-2025", "Juan Musso"));
  assert.ok(!accepts("copa-2021-2025", "Paulo Dybala"));
  assert.equal(knowledge("euros-2021-2025").entries.length, 52);
  assert.ok(accepts("euros-2021-2025", "Jorginho"));
  assert.ok(accepts("euros-2021-2025", "Lamine Yamal"));
  assert.ok(accepts("leagues-pl-sevilla", "Jesus Navas"));
  assert.ok(!accepts("leagues-pl-sevilla", "Ivan Rakitic"));
  assert.ok(!accepts("leagues-pl-sevilla", "Loic Bade"));
  assert.ok(!accepts("leagues-pl-bundesliga-ligue1", "Takumi Minamino"));
  assert.ok(accepts("domestic-egypt", "Percy Tau"));
  assert.ok(!accepts("egypt-pl", "Percy Tau"));
  assert.ok(accepts("egypt-pl", "Mohamed Elneny"));
  assert.ok(accepts("klopp-egypt", "Mohamed Salah"));
  assert.ok(!accepts("klopp-egypt", "Sadio Mane"));
  assert.ok(accepts("messi-teammate-pl", "Luis Suarez"));
  assert.ok(!accepts("messi-teammate-pl", "Lionel Messi"));
  const facts = footballFacts("general");
  for (const name of ["Giovani Lo Celso", "Gabriel Batistuta", "Santi Cazorla"]) {
    const fact = facts.find((fact) => fact.name === name);
    assert.ok(fact, name);
    assert.ok(!fact.tags.includes("wc"), name);
  }
});

test("generated Tic-Tac-Toe grids use new categories and keep every intersection playable", () => {
  const originalRandom = Math.random;
  let seed = 20251101;
  Math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const seen = new Set();
  const groups = new Map(FOOTBALL_KNOWLEDGE_GROUPS.map((group) => [group.label, group]));
  try {
    for (const comp of [...comps, ...Array(9).fill("general")]) {
      const puzzle = randomFootballTicTacToePuzzle(comp);
      const clues = [...puzzle.rows, ...puzzle.columns];
      assert.ok(!clues.some((clue) => /Capello|Keegan|Lippi|Rijkaard/.test(clue.label)));
      for (const clue of clues) {
        if (clue.label.startsWith("Managed by")) {
          assert.ok(MODERN_MANAGER_GROUPS.some((group) => group.label === clue.label));
          seen.add("manager");
        }
        if (clue.label.startsWith("Teammate of")) seen.add("teammate");
        if (/winner|champion|Golden Shoe/i.test(clue.label)) seen.add("honour");
      }
      for (let row = 0; row < 3; row += 1) {
        for (let column = 0; column < 3; column += 1) {
          const answers = puzzle.answers[row][column];
          assert.ok(answers.length >= 2, `${comp}: ${puzzle.rows[row].label} / ${puzzle.columns[column].label}`);
          for (const name of answers) {
            assert.ok(isFootballTicTacToeAnswer(comp, row * 3 + column, name, puzzle));
            for (const clue of [puzzle.rows[row], puzzle.columns[column]]) {
              const group = groups.get(clue.label);
              if (group) assert.ok(knowledgeMatches(group.entries, name), `${clue.label}: ${name}`);
            }
          }
        }
      }
    }
  } finally {
    Math.random = originalRandom;
  }
  assert.deepEqual([...seen].sort(), ["honour", "manager", "teammate"]);
});

console.info("New question-bank additions:", STAT_SEASONS.map(({ comp }) => `${comp}: ${STAT_TRIVIA_CATEGORIES[comp].length} Trivia Path / ${STAT_RONDO_CLUES[comp].length} Rondo`).join("; "));
