import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import "./register-data.mjs";


const { REAL_COMPETITIONS, TOURNAMENT_COMPETITIONS } = await import("../lib/competitions.ts");
const { STAT_TRIVIA_CATEGORIES, STAT_RONDO_CLUES } = await import("../data/statTrivia.ts");
const { AUTHORED_STAT_CATEGORIES, STAT_RECORDS } = await import("../data/statTriviaRecords.ts");
const { STAT_SEASONS } = await import("../data/statTriviaSeasons.ts");
const { BOARD_SIZE, NORMAL_TILE_MIN_ANSWERS, FINAL_TILE_MIN_ANSWERS, uniqueTriviaEntries, generateBoardIds, tileById, triviaDifficulty, answersFor, matchTriviaAnswer, suggestTrivia, triviaAnswerType, checkTriviaAnswer, REPEATED_TRIVIA_ANSWER, rollPathDice, pathTurnMovement } = await import("../data/triviaPath.ts");
const { RONDO_CLUES, RONDO_LETTERS, RONDO_DIFFICULTY_COUNTS, rondoDifficulty, randomRondoPicks, rondoQuestions, isRondoAnswer } = await import("../data/rondo.ts");
const { KNOWLEDGE_TRIVIA_CATEGORIES, KNOWLEDGE_RONDO_CLUES } = await import("../data/knowledgeTrivia.ts");
const { FOOTBALL_KNOWLEDGE_GROUPS, MODERN_SQUADS, MODERN_MANAGER_GROUPS, TEAMMATE_GROUPS, knowledgeMatches } = await import("../data/footballKnowledge.ts");
const { STADIUM_COUNTRIES } = await import("../data/stadiumTrivia.ts");
const { FOOTBALL_TIC_TAC_TOE, footballFacts, randomFootballTicTacToePuzzle, isFootballTicTacToeAnswer } = await import("../data/footballTicTacToe.ts");
const { triviaTileVisuals, triviaBoardPresentation } = await import("../data/triviaPathVisuals.ts");
const { NATION_INFO } = await import("../data/nations.ts");
const { MARKET_VALUE_PLAYERS } = await import("../data/marketValues.ts");
const { nationLogoSrc, nationMentions } = await import("../data/nationVisuals.ts");
const { default: nationCrests } = await import("../data/nationCrests.generated.json");
const { default: tournamentHistory } = await import("../data/tournamentHistory.generated.json");
const { freshState, pathView, startPlay, answerPath, finishTurn, rollPath, startPathRoll, tickPath } = await import("../lib/triviaPathState.ts");
const { extractClubPlayers } = await import("./refresh-club-history.mjs");
const { INDIVIDUAL_AWARDS, AWARD_GROUPS, AWARD_TRIVIA_CATEGORIES, AWARD_RONDO_CLUES, individualAward, awardPlayerKey, awardsInText } = await import("../data/individualAwards.ts");
const { AWARD_SOURCES, awardTables, extractAwardWinners } = await import("./refresh-individual-awards.mjs");
const comps = ["general", ...REAL_COMPETITIONS, ...TOURNAMENT_COMPETITIONS];
const {
  newFootballTicTacToeRoom, applyFootballTicTacToeMove, footballTicTacToeView,
  requestFootballTicTacToeRematch, expireFootballTicTacToeTurn, isFootballTicTacToeMode,
} = await import("../lib/footballTicTacToe.ts");
const { normalizeFootballPlayerName } = await import("../data/footballNames.ts");
const { submitDuelGuess, skipDuelGuess } = await import("../lib/clubDuelRound.ts");
const { playersForBoth, DUEL_WIN_SCORE } = await import("../data/clubDuel.ts");

function guessingDuel() {
  return {
    comp: "general", phase: "guess", clubs: { p1: "che", p2: "mun" },
    scores: { p1: 0, p2: 0 }, used: [], pass: { p1: false, p2: false },
    last: null, winner: null, deadline: 60_000,
  };
}

test("Club Duel allows one guess each, two wrong guesses score zero, and repeats cannot retry", () => {
  const state = guessingDuel();
  const correct = playersForBoth("che", "mun", "general")[0];
  assert.ok(correct);
  assert.equal(submitDuelGuess(state, "p1", "Not A Player", 100).correct, false);
  assert.equal(state.phase, "guess");
  assert.equal(submitDuelGuess(state, "p1", correct, 200).correct, false);
  assert.equal(state.guesses.p1, true);
  assert.deepEqual(state.scores, { p1: 0, p2: 0 });
  assert.equal(submitDuelGuess(state, "p2", "Another Wrong Name", 300).correct, false);
  assert.equal(state.phase, "result");
  assert.equal(state.last.reason, "wrong");
  assert.deepEqual(state.scores, { p1: 0, p2: 0 });
});

test("Club Duel awards only the fastest correct guess, including after an opponent's wrong guess", () => {
  const correct = playersForBoth("che", "mun", "general")[0];
  for (const first of ["p1", "p2"]) {
    const second = first === "p1" ? "p2" : "p1";
    const state = guessingDuel();
    assert.equal(submitDuelGuess(state, first, correct, 100).correct, true);
    assert.equal(submitDuelGuess(state, second, correct, 101).correct, false);
    assert.equal(state.scores[first], 1);
    assert.equal(state.scores[second], 0);
    assert.equal(state.last.winner, first);
    const afterWrong = guessingDuel();
    submitDuelGuess(afterWrong, first, "Wrong Name", 100);
    assert.equal(submitDuelGuess(afterWrong, second, correct, 200).correct, true);
    assert.equal(afterWrong.scores[second], 1);
    assert.equal(afterWrong.scores[first], 0);
  }
});

test("Club Duel handles used names, skips, timeouts and the winning point without extra guesses", () => {
  const correct = playersForBoth("che", "mun", "general")[0];
  const state = guessingDuel();
  state.used = [normalizeFootballPlayerName(correct)];
  assert.equal(submitDuelGuess(state, "p1", correct, 100).correct, false);
  skipDuelGuess(state, "p2", 200);
  assert.equal(state.phase, "result");
  assert.deepEqual(state.scores, { p1: 0, p2: 0 });
  const skipped = guessingDuel();
  skipDuelGuess(skipped, "p1", 100);
  assert.equal(submitDuelGuess(skipped, "p1", correct, 200).correct, false);
  skipDuelGuess(skipped, "p2", 300);
  assert.equal(skipped.last.reason, "pass");
  const late = guessingDuel();
  assert.equal(submitDuelGuess(late, "p1", correct, 60_000).correct, false);
  assert.equal(late.last.reason, "timeout");
  const winning = guessingDuel();
  winning.scores.p1 = DUEL_WIN_SCORE - 1;
  assert.equal(submitDuelGuess(winning, "p1", correct, 100).correct, true);
  assert.equal(winning.phase, "finished");
  assert.equal(winning.winner, "p1");
});

function playingGrid(mode = "normal") {
  const state = newFootballTicTacToeRoom("creator", "general", mode);
  state.p2Token = "guest";
  state.status = "playing";
  state.turn = "p1";
  state.turnDeadline = 60_000;
  state.puzzle = {
    rows: [{ label: "Row 1" }, { label: "Row 2" }, { label: "Row 3" }],
    columns: [{ label: "Column 1" }, { label: "Column 2" }, { label: "Column 3" }],
    answers: Array.from({ length: 3 }, (_, row) => Array.from({ length: 3 }, (_, column) => [
      `Trap Player ${row * 3 + column}`, `Safe Player ${row * 3 + column}`,
    ])),
  };
  if (mode === "hidden-trap") {
    state.traps = state.puzzle.answers.flatMap((row) => row.map((answers) => normalizeFootballPlayerName(answers[0])));
  }
  return state;
}

test("Hidden Trap picks one valid answer per square and never exposes traps or answer pools in room views", () => {
  for (const comp of comps) {
    const state = newFootballTicTacToeRoom("creator", comp, "hidden-trap");
    assert.equal(state.traps.length, 9);
    for (let cell = 0; cell < 9; cell += 1) {
      assert.ok(state.puzzle.answers[Math.floor(cell / 3)][cell % 3].some((name) =>
        normalizeFootballPlayerName(name) === state.traps[cell]), `${comp} ${cell}`);
    }
    for (const side of ["p1", "p2"]) {
      const view = footballTicTacToeView(state, side);
      assert.equal(view.mode, "hidden-trap");
      assert.ok(!("traps" in view));
      assert.ok(!("answers" in view.puzzle));
      assert.ok(!("p1Token" in view));
      assert.ok(!("p2Token" in view));
      assert.equal(view.lastTrap, null);
      assert.deepEqual(view.revealedTraps, Array(9).fill(null));
    }
  }
  assert.ok(isFootballTicTacToeMode("normal"));
  assert.ok(isFootballTicTacToeMode("hidden-trap"));
  assert.ok(!isFootballTicTacToeMode("other"));
});

test("normal rules stay unchanged and legacy rooms default to normal", () => {
  const state = playingGrid();
  assert.equal(state.traps, undefined);
  delete state.mode;
  assert.equal(footballTicTacToeView(state, "p1").mode, "normal");
  assert.equal(applyFootballTicTacToeMove(state, "p1", 0, "Trap Player 0", 100), null);
  assert.equal(state.board[0].side, "p1");
  assert.equal(state.turn, "p2");
  assert.equal(state.lastTrap, null);
  assert.deepEqual(footballTicTacToeView(state, "p1").revealedTraps, Array(9).fill(null));
});

test("Tic-Tac-Toe new-game votes require both players during or after play", () => {
  for (const status of ["playing", "finished"]) {
    const state = playingGrid("hidden-trap");
    state.status = status;
    state.board[0] = { side: "p1", player: "Safe Player 0" };
    const puzzle = state.puzzle;
    assert.equal(requestFootballTicTacToeRematch(state, "p1", 100), null);
    assert.equal(requestFootballTicTacToeRematch(state, "p1", 200), null);
    assert.equal(state.puzzle, puzzle);
    assert.ok(state.board[0]);
    assert.equal(state.status, status);
    assert.equal(footballTicTacToeView(state, "p2").opponentWantsRematch, true);
    assert.equal(requestFootballTicTacToeRematch(state, "p2", 300), null);
    assert.notEqual(state.puzzle, puzzle);
    assert.ok(state.board.every((cell) => cell === null));
    assert.equal(state.status, "playing");
    assert.equal(state.mode, "hidden-trap");
    assert.equal(state.turnDeadline, 60_300);
    assert.deepEqual(state.rematch, { p1: false, p2: false });
  }
  const waiting = newFootballTicTacToeRoom("creator", "general");
  assert.match(requestFootballTicTacToeRematch(waiting, "p1", 100), /both players/);
});

test("completed squares reveal the AI pick on hits and safe moves for both players only", () => {
  const state = playingGrid("hidden-trap");
  assert.match(applyFootballTicTacToeMove(state, "p1", 0, "Invalid Player", 100), /both clues/);
  assert.deepEqual(footballTicTacToeView(state, "p1").revealedTraps, Array(9).fill(null));
  assert.equal(applyFootballTicTacToeMove(state, "p1", 0, "TRAP PLAYER 0", 200), null);
  assert.equal(applyFootballTicTacToeMove(state, "p2", 1, "Safe Player 1", 300), null);
  for (const side of ["p1", "p2"]) {
    const view = JSON.parse(JSON.stringify(footballTicTacToeView(state, side)));
    assert.deepEqual(view.revealedTraps, ["Trap Player 0", "Trap Player 1", ...Array(7).fill(null)]);
    assert.ok(!("traps" in view));
    assert.ok(!("answers" in view.puzzle));
    assert.equal(view.board[0].side, "p2");
    assert.equal(view.board[1].side, "p2");
  }
  state.status = "finished";
  requestFootballTicTacToeRematch(state, "p1", 400);
  requestFootballTicTacToeRematch(state, "p2", 500);
  assert.deepEqual(footballTicTacToeView(state, "p1").revealedTraps, Array(9).fill(null));
});

test("trap hits award the square and next turn to the opponent, while safe answers behave normally", () => {
  const state = playingGrid("hidden-trap");
  assert.equal(applyFootballTicTacToeMove(state, "p1", 0, "TRAP PLAYER 0", 100), null);
  assert.deepEqual(state.board[0], { side: "p2", player: "TRAP PLAYER 0" });
  assert.equal(state.turn, "p2");
  assert.equal(state.turnDeadline, 60_100);
  assert.deepEqual(state.lastTrap, { cell: 0, player: "TRAP PLAYER 0", side: "p1" });
  assert.match(applyFootballTicTacToeMove(state, "p1", 1, "Safe Player 1", 200), /opponent/);
  assert.match(applyFootballTicTacToeMove(state, "p2", 0, "Safe Player 0", 200), /empty/);
  assert.match(applyFootballTicTacToeMove(state, "p2", 1, "Not a matching player", 200), /both clues/);
  assert.equal(state.turn, "p2");
  assert.equal(applyFootballTicTacToeMove(state, "p2", 1, "Safe Player 1", 200), null);
  assert.equal(state.board[1].side, "p2");
  assert.equal(state.turn, "p1");
  assert.equal(state.lastTrap, null);
  state.board[2] = { side: "p1", player: "Safe Player 3" };
  assert.match(applyFootballTicTacToeMove(state, "p1", 3, "Safe Player 3", 300), /already been used/);
});

test("a trap can complete the opponent's winning line or fill the board for a draw", () => {
  const state = playingGrid("hidden-trap");
  state.board[0] = { side: "p2", player: "Safe Player 0" };
  state.board[1] = { side: "p2", player: "Safe Player 1" };
  assert.equal(applyFootballTicTacToeMove(state, "p1", 2, "Trap Player 2", 100), null);
  assert.equal(state.winner, "p2");
  assert.equal(state.status, "finished");
  assert.equal(state.turnDeadline, null);
  const draw = playingGrid("hidden-trap");
  const sides = ["p1", "p2", "p1", "p1", "p2", "p2", "p2", "p1"];
  draw.board = [...sides.map((side, index) => ({ side, player: `Safe Player ${index}` })), null];
  assert.equal(applyFootballTicTacToeMove(draw, "p1", 8, "Trap Player 8", 100), null);
  assert.equal(draw.status, "finished");
  assert.equal(draw.winner, null);
  assert.equal(draw.turnDeadline, null);
});

test("trap rematches regenerate private picks and preserve rules; timeouts do not award squares", () => {
  const state = playingGrid("hidden-trap");
  const oldTraps = state.traps;
  state.status = "finished";
  assert.equal(requestFootballTicTacToeRematch(state, "p1", 100), null);
  assert.equal(state.traps, oldTraps);
  assert.equal(requestFootballTicTacToeRematch(state, "p2", 200), null);
  assert.notEqual(state.traps, oldTraps);
  assert.equal(state.mode, "hidden-trap");
  assert.equal(state.lastTrap, null);
  assert.ok(state.board.every((cell) => cell === null));
  assert.equal(state.status, "playing");
  const priorTurn = state.turn;
  assert.ok(expireFootballTicTacToeTurn(state, 60_200));
  assert.notEqual(state.turn, priorTurn);
  assert.ok(state.board.every((cell) => cell === null));
  for (const [index, trap] of state.traps.entries()) {
    assert.ok(state.puzzle.answers[Math.floor(index / 3)][index % 3].some((name) => normalizeFootballPlayerName(name) === trap));
  }
});

test("prepared football facts and awards match their authored builders without changing Rondo indices", async () => {
  const football = await import("./builders/footballTicTacToe.ts");
  const awards = await import("./builders/individualAwards.ts");
  const { AWARD_RONDO_CLUES } = await import("../data/individualAwards.ts");
  assert.deepEqual(INDIVIDUAL_AWARDS, awards.INDIVIDUAL_AWARDS);
  assert.deepEqual(AWARD_GROUPS, awards.AWARD_GROUPS);
  for (const comp of comps) {
    assert.deepEqual(AWARD_RONDO_CLUES[comp].map(({ letter, clue, answers }) => ({ letter, clue, answers })), awards.AWARD_RONDO_CLUES[comp]);
  }
  for (const comp of comps) {
    assert.deepEqual(footballFacts(comp), football.footballFacts(comp), comp);
    const previous = randomRondoPicks(comp);
    const picks = randomRondoPicks(comp, previous);
    const questions = rondoQuestions(comp, picks);
    for (const [index, letter] of RONDO_LETTERS.entries()) {
      const options = RONDO_CLUES[comp].filter((clue) => clue.letter === letter);
      const selected = options[picks[index]];
      assert.deepEqual(questions[index], { ...selected, difficulty: rondoDifficulty(selected), index }, `${comp} ${letter}`);
      if (options.length > 1) assert.notEqual(picks[index], previous[index], `${comp} ${letter}`);
    }
  }
});

test("Rondo prompts stay short without removing answer conditions or questions", () => {
  const unitedGoldenBoot = AWARD_RONDO_CLUES.general.find((clue) =>
    clue.letter === "A" && clue.prompt === "Man Utd player who won the PL Golden Boot");
  assert.ok(unitedGoldenBoot);
  assert.ok(unitedGoldenBoot.answers.includes("Andy Cole"));
  for (const comp of comps) {
    for (const clue of RONDO_CLUES[comp]) {
      const prompt = clue.prompt ?? clue.clue;
      assert.ok(prompt.length <= 140, `${comp} (${prompt.length} characters): ${prompt}`);
      assert.doesNotMatch(prompt, /answer starts with|through the recorded award seasons|Name a (winner|player):/);
      assert.ok(clue.answers.length > 0);
    }
    const youngAward = AWARD_RONDO_CLUES[comp].find((clue) => clue.clue.includes("La Liga U23 Player") && clue.clue.includes("PFA Young"));
    if (youngAward) {
      assert.equal(youngAward.prompt, "Top-five-league young player award");
      assert.match(youngAward.clue, /PFA Young Player of the Year OR/);
      assert.match(youngAward.clue, /La Liga U23/);
    }
  }
});

test("every new Rondo round mixes nine easy, nine medium and eight hard clues without repeats", () => {
  for (const comp of comps) {
    let previous = [];
    for (let round = 0; round < 100; round += 1) {
      const picks = randomRondoPicks(comp, previous);
      const questions = rondoQuestions(comp, picks);
      assert.equal(questions.length, 26, comp);
      assert.deepEqual(questions.map(({ letter }) => letter), RONDO_LETTERS, comp);
      const counts = { easy: 0, medium: 0, hard: 0 };
      for (const [index, question] of questions.entries()) {
        counts[question.difficulty] += 1;
        const options = RONDO_CLUES[comp].filter((clue) => clue.letter === question.letter);
        assert.deepEqual(question.answers, options[picks[index]].answers);
        if (previous.length && options.length > 1) assert.notEqual(picks[index], previous[index], `${comp} ${question.letter}`);
      }
      assert.deepEqual(counts, RONDO_DIFFICULTY_COUNTS, `${comp} round ${round}`);
      previous = picks;
    }
  }
});

test("nation visuals cover every historical tournament nation, aliases and combined hosts", () => {
  assert.deepEqual(nationCrests.missing, []);
  for (const [name, crest] of Object.entries(nationCrests.crests)) {
    assert.ok(crest.source.startsWith("https://en.wikipedia.org/wiki/"), name);
    assert.ok(crest.src.startsWith("https://"), name);
    assert.doesNotMatch(crest.src, /flagcdn|flag_of|teamlogos\/countries/i, name);
  }
  for (const [code, [name, iso]] of Object.entries(NATION_INFO)) {
    assert.equal(nationLogoSrc(code), nationLogoSrc(iso), name);
    assert.equal(nationLogoSrc(name), nationLogoSrc(code), name);
    assert.equal(nationMentions(name)[0]?.name, name);
  }
  for (const players of Object.values(MARKET_VALUE_PLAYERS)) {
    for (const player of players) assert.equal(nationLogoSrc(player.countryCode), nationLogoSrc(player.nationality), player.name);
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
  assert.notEqual(nationLogoSrc("Soviet Union"), nationLogoSrc("Russia"));
  assert.notEqual(nationLogoSrc("East Germany"), nationLogoSrc("Germany"));
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
  assert.throws(() => nationLogoSrc("not a nation"), /Unknown nation visual/);
});

test("Trivia Path and Tic-Tac-Toe share nation assets without ambiguous partial matches", () => {
  const base = tileById("general", "s-clubs");
  for (const [word, name] of [["Uruguayan", "Uruguay"], ["Nigerian", "Nigeria"], ["Finnish", "Finland"], ["South African", "South Africa"], ["Bolivia", "Bolivia"]]) {
    const visuals = triviaTileVisuals({ ...base, id: "test-nation", noun: `${word} players`, short: word, logos: [] });
    assert.ok(visuals.some((visual) => visual.kind === "image" && visual.label === name && visual.src === nationLogoSrc(name)), word);
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
      const bankMaximum = Math.max(...[...STAT_TRIVIA_CATEGORIES[comp], ...KNOWLEDGE_TRIVIA_CATEGORIES[comp], ...AWARD_TRIVIA_CATEGORIES[comp]]
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

test("tile visual clues encode combined stats, trophies, nation crests and teammates without question prose", () => {
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

test("completed-box answers are reserved for both players and repeats immediately lose a turn", () => {
  const state = freshState("general", "p1");
  state.p2Token = "p2";
  state.board = Array(BOARD_SIZE).fill("s-clwin");
  const tile = tileById("general", "s-clwin");
  const [first, second, third] = tile.entries;
  startPlay(state, 1000, 2);
  assert.equal(pathView(state, "p1", 1000).answerType, "club");
  assert.equal(answerPath(state, first.name, 1100), "Correct");
  assert.deepEqual(state.taken, {});
  assert.equal(answerPath(state, first.name, 1200), "Already said that one");
  assert.equal(state.phase, "play");
  assert.equal(answerPath(state, second.name, 1300), "Correct");
  assert.equal(state.pos.p1, 2);
  assert.deepEqual(state.taken[2], [first.name, second.name]);

  const restored = JSON.parse(JSON.stringify(state));
  restored.turn = "p2";
  startPlay(restored, 2000, 2);
  assert.equal(answerPath(restored, third.name, 2100), "Correct");
  assert.equal(answerPath(restored, second.aliases[0] ?? second.name, 2200), REPEATED_TRIVIA_ANSWER);
  assert.equal(restored.phase, "result");
  assert.equal(restored.pos.p2, 0);
  assert.equal(restored.turns.p2, 1);
  assert.equal(restored.last.success, false);
  assert.equal(restored.last.message, REPEATED_TRIVIA_ANSWER);
  assert.deepEqual(restored.taken[2], [first.name, second.name]);
  // A correct partial answer from a lost turn is not reserved.
  startPlay(restored, 3000, 2);
  assert.equal(answerPath(restored, third.name, 3100), "Correct");
  finishTurn(restored, 3200, false, "Time ran out");
  startPlay(restored, 4000, 2);
  assert.equal(answerPath(restored, third.name, 4100), "Correct");
  // Reservations apply to the same box, not to all boxes with overlapping answers.
  startPlay(restored, 5000, 1);
  assert.equal(answerPath(restored, first.name, 5100), "Correct");
  assert.equal(restored.pos.p2, 1);
  assert.deepEqual(freshState("general", "rematch").taken, {});

  const entries = [{ name: "Luka Modric", aliases: ["Modric"] }, { name: "Lucas Modric", aliases: [] }];
  assert.equal(checkTriviaAnswer(entries, "Modric", [], ["Luka Modric"]).kind, "used");
  assert.equal(checkTriviaAnswer(entries, "Luka Modric", ["Luka Modric"], []).kind, "duplicate");
  assert.equal(checkTriviaAnswer(entries, "not a valid answer", [], []).kind, "wrong");
});

test("search suggestions stay within the active answer type without exposing correct answers", () => {
  const cases = [
    ["player", "Messi", "Lionel Messi"],
    ["nation", "Argentina", "Argentina"],
    ["club", "Arsenal", "Arsenal"],
    ["stadium", "Anfield", "Anfield"],
    ["manager", "Guardiola", "Pep Guardiola"],
    ["nickname", "Les Gones", "Les Gones"],
    ["campaign", "Marseille 1993", "Marseille 1993 European Cup final"],
  ];
  for (const [type, query, expected] of cases) {
    assert.ok(suggestTrivia("general", query, type).includes(expected), `${type}: ${query}`);
    for (const other of cases.map(([kind]) => kind).filter((kind) => kind !== type)) {
      if (["player", "manager"].includes(type) && ["player", "manager"].includes(other)) continue;
      assert.ok(!suggestTrivia("general", query, other).includes(expected), `${expected} leaked into ${other}`);
    }
  }
  for (const [id, type] of [["s-ballon", "player"], ["s-clwin", "club"], ["s-wchost", "nation"], ["s-knowledge-stadiums-brazil", "stadium"], ["s-clmgr", "manager"]]) {
    const tile = tileById("general", id);
    assert.ok(tile, id);
    assert.equal(triviaAnswerType(tile), type, id);
  }
  assert.equal(triviaAnswerType({ noun: "player who was managed by Pep Guardiola at a club in Spain" }), "player");
  assert.equal(triviaAnswerType({ noun: "club teammate of Lionel Messi at Barcelona" }), "player");
  assert.equal(triviaAnswerType({ noun: "Scottish football stadium" }), "stadium");
  assert.equal(triviaAnswerType({ noun: "Ligue 1 title-winning manager" }), "manager");
  assert.equal(triviaAnswerType({ noun: "Bundesliga champion" }), "club");
  assert.deepEqual(suggestTrivia("general", "a", "nation"), []);
  const brazil = tileById("general", "s-knowledge-stadiums-brazil");
  assert.ok(!brazil.entries.some((entry) => entry.name === "Anfield"));
  assert.ok(suggestTrivia("general", "Anfield", triviaAnswerType(brazil)).includes("Anfield"));
});

test("skull is a seventh dice outcome and its follow-up is numeric only", () => {
  const original = Math.random;
  try {
    const first = [];
    const second = [];
    for (let index = 0; index < 7; index += 1) {
      Math.random = () => (index + 0.5) / 7;
      first.push(rollPathDice());
    }
    for (let index = 0; index < 6; index += 1) {
      Math.random = () => (index + 0.5) / 6;
      second.push(rollPathDice(true));
    }
    assert.deepEqual(first, [1, 2, 3, 4, 5, 6, "skull"]);
    assert.deepEqual(second, [1, 2, 3, 4, 5, 6]);
  } finally { Math.random = original; }
});

test("skull failure moves behind the origin and reopens every crossed box for both players", () => {
  const state = freshState("general", "p1");
  state.p2Token = "p2";
  state.board = Array(BOARD_SIZE).fill("s-clwin");
  const [first, second] = tileById("general", "s-clwin").entries;
  state.pos.p1 = 8;
  state.pos.p2 = 4;
  state.taken = Object.fromEntries(Array.from({ length: 12 }, (_, index) => [index + 1, [first.name]]));
  startPathRoll(state, 1000);
  rollPath(state, 1100, "skull");
  assert.equal(state.phase, "roll");
  assert.equal(state.turn, "p1");
  assert.equal(state.dice, null);
  assert.equal(state.deadline, 31100);
  assert.equal(state.turns.p1, 0);
  for (const side of ["p1", "p2"]) {
    const view = pathView(state, side, 1200);
    assert.equal(view.skullTurn, true);
    assert.equal(view.question, null);
    assert.equal(view.answerType, null);
  }
  const restored = JSON.parse(JSON.stringify(state));
  rollPath(restored, 1300, 2);
  assert.equal(restored.origin, 8);
  assert.equal(pathView(restored, "p1", 1300).target, 10);
  assert.equal(restored.required, 2);
  assert.equal(answerPath(restored, second.name, 1400), "Correct");
  assert.equal(restored.phase, "play");
  assert.equal(answerPath(restored, first.name, 1500), REPEATED_TRIVIA_ANSWER);
  assert.equal(restored.pos.p1, 6);
  assert.equal(restored.pos.p2, 4);
  assert.equal(restored.turns.p1, 1);
  assert.equal(restored.last.success, false);
  assert.deepEqual(Object.keys(restored.taken).map(Number), [1, 2, 3, 4, 5, 11, 12]);
  tickPath(restored, restored.deadline);
  assert.equal(restored.turn, "p2");
  assert.equal(restored.skullTurn, false);
  assert.equal(restored.dice, null);
  assert.equal(restored.question, null);
  // Both players can reuse the released answer, including its alias.
  restored.pos.p2 = 8;
  rollPath(restored, 5000, 2);
  assert.equal(answerPath(restored, first.aliases[0] ?? first.name, 5100), "Correct");
  assert.equal(restored.phase, "play");
  assert.equal(answerPath(restored, second.name, 5200), "Correct");
  assert.equal(restored.pos.p2, 10);
  assert.deepEqual(restored.taken[10], [first.name, second.name]);
});

test("skull success, timeout, auto-reroll, start clamp and final reveal preserve game rules", () => {
  const state = freshState("general", "p1");
  state.board = Array(BOARD_SIZE).fill("s-clwin");
  const entries = tileById("general", "s-clwin").entries;
  state.pos.p1 = 8;
  state.taken = { 7: [entries[0].name] };
  startPathRoll(state, 0);
  rollPath(state, 1, "skull");
  rollPath(state, 2, 2);
  answerPath(state, entries[0].name, 3);
  answerPath(state, entries[1].name, 4);
  assert.equal(state.pos.p1, 10);
  assert.equal(state.last.success, true);
  assert.deepEqual(state.taken[7], [entries[0].name]);
  assert.deepEqual(state.taken[10], [entries[0].name, entries[1].name]);

  startPathRoll(state, 100);
  const original = Math.random;
  try {
    Math.random = () => 0.999;
    tickPath(state, state.deadline);
    assert.equal(state.phase, "roll");
    assert.equal(state.skullTurn, true);
    tickPath(state, state.deadline);
    assert.equal(state.phase, "play");
    assert.equal(state.dice, 6);
  } finally { Math.random = original; }
  assert.equal(state.finalRevealed, true);
  tickPath(state, state.deadline);
  assert.equal(state.pos.p1, 4);
  assert.equal(state.last.success, false);
  assert.equal(pathView(state, "p1", 50000).tiles.at(-1).hidden, false);
  assert.equal(state.taken[7], undefined);
  assert.equal(state.taken[10], undefined);
  assert.deepEqual(pathTurnMovement(1, 6, true, false), { position: 0, resetSpaces: [1, 2, 3, 4, 5, 6, 7] });
  assert.deepEqual(pathTurnMovement(8, 2, false, false), { position: 8, resetSpaces: [] });
  assert.deepEqual(pathTurnMovement(15, 6, true, false), { position: 9, resetSpaces: [9, 10, 11, 12, 13, 14, 15, 16] });
  assert.equal(freshState("general", "rematch").skullTurn, false);
  // Legacy stored rooms without the optional skull flag retain ordinary failure behavior.
  delete state.skullTurn;
  startPlay(state, 60000, 2);
  finishTurn(state, 60100, false, "Wrong answer");
  assert.equal(state.pos.p1, 4);
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
  assert.ok(suggestTrivia("general", "Maracana", "stadium").includes("Maracana"));
  assert.ok(suggestTrivia("pl", "Anfield", "stadium").includes("Anfield"));
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

test("56 sourced individual awards retain tied winners, official boundaries and distinct identities", () => {
  assert.equal(INDIVIDUAL_AWARDS.length, 56);
  assert.deepEqual(INDIVIDUAL_AWARDS.map((award) => award.id).sort(), AWARD_SOURCES.map((award) => award.id).sort());
  for (const award of INDIVIDUAL_AWARDS) {
    assert.ok(award.winners.length > 0, award.id);
    assert.match(award.source, /^https:\/\/en\.wikipedia\.org\/wiki\//);
    assert.ok(comps.includes(award.comp), award.id);
    const svg = readFileSync(new URL(`../public${award.fallback}`, import.meta.url), "utf8");
    assert.match(svg, /<svg/);
    assert.match(svg, /illustrated award/);
    assert.equal(new Set(award.entries.map(({ name }) => awardPlayerKey(name))).size, award.entries.length, award.id);
    for (const winner of award.winners) {
      assert.match(winner.season, /^(18|19|20)\d{2}/);
      assert.doesNotMatch(winner.name, /\d|[{}<>]|Not awarded|cancelled/i);
      assert.ok(knowledgeMatches(award.entries, winner.name), `${award.id}: ${winner.name}`);
    }
  }
  const winners = (id, season) => individualAward(id).winners.filter((winner) => winner.season === season).map(({ name }) => name).sort();
  assert.deepEqual(winners("ballon", "1960"), ["Luis Suarez Miramontes"]);
  assert.deepEqual(winners("ballon", "2020"), []);
  assert.ok(!knowledgeMatches(individualAward("ballon").entries, "Luis Suarez"));
  assert.ok(knowledgeMatches(individualAward("pichichi").entries, "Luis Suarez"));
  assert.deepEqual(winners("puskas", "2009"), ["Cristiano Ronaldo"]);
  assert.ok(!winners("puskas", "2009").includes("Andres Iniesta"));
  assert.equal(winners("wc-boot", "1962").length, 6);
  assert.deepEqual(winners("wc-boot", "1994"), ["Hristo Stoichkov", "Oleg Salenko"]);
  assert.deepEqual(winners("euro-boot", "2024"), ["Cody Gakpo", "Dani Olmo", "Georges Mikautadze", "Harry Kane", "Ivan Schranz", "Jamal Musiala"]);
  assert.deepEqual(winners("copa-boot", "1999"), ["Rivaldo", "Ronaldo"]);
  assert.deepEqual(winners("copa-player", "2021"), ["Lionel Messi", "Neymar"]);
  assert.ok(individualAward("copa-player").supplementalSources.some((source) => source.includes("conmebol.com")));
  assert.deepEqual(winners("euro-boot", "2012"), ["Fernando Torres"]);
  assert.deepEqual(winners("wc-boot", "2010"), ["Thomas M\u00fcller"]);
  assert.ok(individualAward("wc-ball").winners.every(({ season }) => Number(season) >= 1982));
  assert.ok(individualAward("copa-player").winners.every(({ season }) => Number(season) >= 1987));
  assert.ok(individualAward("pl-playmaker").winners.every(({ season }) => Number(season.slice(0, 4)) >= 2017));
  assert.ok(!knowledgeMatches(individualAward("pl-playmaker").entries, "Cesc Fabregas"));
  assert.ok(knowledgeMatches(individualAward("seriea-keeper").entries, "Michele Di Gregorio"));
  assert.ok(!knowledgeMatches(individualAward("seriea-keeper").entries, "Monza"));
  for (const [a, b] of [["Ronaldo", "Ronaldo Nazario"], ["Vinicius Junior", "Vinicius Jr"], ["Son Heung-min", "Heung-min Son"], ["Alejandro Gomez", "Papu Gomez"]]) {
    assert.equal(awardPlayerKey(a), awardPlayerKey(b));
  }
  assert.notEqual(awardPlayerKey("Ronaldo"), awardPlayerKey("Cristiano Ronaldo"));
});

test("award extraction expands shared years, preserves joint winners and rejects runner-up rows", () => {
  const ranked = `<table class="wikitable" data-mw='{"text":"<tr>not a real row</tr>"}'>
    <tr><th>Year</th><th>Rank</th><th>Player</th></tr>
    <tr><td rowspan="2">2025</td><td>1</td><td><a href="https://en.wikipedia.org/wiki/Winner">Winning Player</a></td></tr>
    <tr><td>2</td><td><a href="./Runner">Runner Up</a></td></tr>
    <tr><td>2020</td><td>1</td><td>Not awarded (COVID-19)</td></tr></table>`;
  assert.deepEqual(extractAwardWinners(awardTables(ranked), { id: "fifa-best" }), [{ name: "Winning Player", season: "2025" }]);
  const tied = `<table class="wikitable"><tr><th>Season</th><th>Player(s)</th></tr>
    <tr><td rowspan="2">2024–25</td><td><a href="/wiki/First">First Scorer</a><br><a href="https://en.wikipedia.org/wiki/Second">Second Scorer</a></td></tr>
    <tr><td><a href="./Third">Third Scorer</a></td></tr></table>`;
  assert.deepEqual(extractAwardWinners(awardTables(tied), { id: "bundesliga-scorer" }), [
    { name: "First Scorer", season: "2024–25" }, { name: "Second Scorer", season: "2024–25" }, { name: "Third Scorer", season: "2024–25" },
  ]);
  assert.throws(() => extractAwardWinners([], { id: "fifa-best" }), /missing winner table/);
});

test("award questions reconstruct in Trivia Path and Rondo with explicit AND/OR conditions and award images", () => {
  assert.equal(new Set(AWARD_GROUPS.map(({ id }) => id)).size, AWARD_GROUPS.length);
  const byAward = (id) => AWARD_GROUPS.find((group) => group.id === id);
  const both = byAward("s-award-both-ballon-european-shoe");
  assert.ok(both);
  assert.ok(knowledgeMatches(both.entries, "Cristiano Ronaldo"));
  assert.ok(knowledgeMatches(both.entries, "Lionel Messi"));
  assert.ok(!both.entries.some(({ name }) => awardPlayerKey(name) === awardPlayerKey("Neymar")));
  for (const group of AWARD_GROUPS) {
    assert.ok(group.sources.every((source) => source.startsWith("https://")), group.id);
    assert.ok(group.entries.length > 0, group.id);
    if (group.operator === "OR") assert.match(group.noun, /at least one/);
    if (group.operator === "AND") assert.match(group.noun, /AND/);
    const tile = tileById("general", group.id);
    assert.ok(tile, group.id);
    assert.equal(triviaAnswerType(tile), "player", group.id);
    const visuals = triviaTileVisuals(tile);
    const first = individualAward(group.awardIds[0]);
    assert.ok(visuals.some((visual) => visual.kind === "image" && visual.src === first.src && visual.fallback === first.fallback), group.id);
    for (const { name } of group.entries) assert.ok(matchTriviaAnswer(tile.entries, name), `${group.id}: ${name}`);
    for (const id of group.awardIds) {
      if (group.awardOperator !== "OR") {
        const keys = new Set(individualAward(id).entries.map(({ name }) => awardPlayerKey(name)));
        assert.ok(group.entries.every(({ name }) => keys.has(awardPlayerKey(name))), `${group.id}: ${id}`);
      }
    }
    if (group.awardOperator === "OR") {
      const union = new Set(group.awardIds.flatMap((id) => individualAward(id).entries.map(({ name }) => awardPlayerKey(name))));
      assert.ok(group.entries.every(({ name }) => union.has(awardPlayerKey(name))), group.id);
    }
  }
  const legacy = triviaTileVisuals(tileById("general", "s-knowledge-ballon-worldcup"));
  assert.ok(legacy.some((visual) => visual.kind === "image" && visual.src === individualAward("ballon").src));
  assert.equal(awardsInText("PFA Young Player of the Year winner")[0].id, "pfa-young");
  for (const comp of comps) {
    assert.ok(AWARD_TRIVIA_CATEGORIES[comp].length > 0, comp);
    for (const clue of AWARD_RONDO_CLUES[comp]) {
      assert.ok(RONDO_CLUES[comp].some((candidate) => candidate.letter === clue.letter && candidate.clue === clue.clue), comp);
      assert.ok(isRondoAnswer(clue, clue.answers[0]));
      assert.equal(clue.answers[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "")[0].toUpperCase(), clue.letter);
    }
    const board = generateBoardIds(comp);
    assert.ok(board.some((id) => id.startsWith("s-award-")), comp);
    assert.ok(board.slice(0, -1).every((id) => tileById(comp, id).entries.length >= 13), comp);
    assert.ok(tileById(comp, board.at(-1)).entries.length >= 6, comp);
  }
});

test("randomized award Tic-Tac-Toe grids retain playable intersections and precise winner predicates", () => {
  const originalRandom = Math.random;
  let seed = 20261102;
  Math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const groups = new Map(AWARD_GROUPS.map((group) => [group.label, group]));
  const prepared = JSON.parse(readFileSync(new URL("../data/quizFootball.generated.json", import.meta.url), "utf8"));
  const seen = new Set();
  try {
    for (const comp of comps) {
      let found = false;
      for (let run = 0; run < 30; run += 1) {
        const puzzle = randomFootballTicTacToePuzzle(comp);
        const clues = [...puzzle.rows, ...puzzle.columns];
        for (const clue of clues.filter((clue) => clue.awardIds?.length)) {
          found = true;
          seen.add(clue.label);
          assert.equal(clue.badge, individualAward(clue.awardIds[0]).src);
          assert.equal(clue.badgeFallback, individualAward(clue.awardIds[0]).fallback);
        }
        for (let row = 0; row < 3; row += 1) {
          for (let column = 0; column < 3; column += 1) {
            assert.ok(puzzle.answers[row][column].length >= 2, comp);
            for (const clue of [puzzle.rows[row], puzzle.columns[column]]) {
              const group = groups.get(clue.label);
              if (!group) continue;
              const keys = new Set(group.entries.map(({ name }) => awardPlayerKey(name)));
              assert.ok(puzzle.answers[row][column].every((name) => keys.has(awardPlayerKey(name))), `${comp}: ${clue.label}`);
            }
          }
        }
      }
      const bank = prepared.competitions[comp];
      const rows = TOURNAMENT_COMPETITIONS.includes(comp) ? bank.nations : bank.pool;
      const feasibleAward = bank.pool.some((award) => award.clue.awardIds?.length
        && rows.filter((row) => row.members.filter((member) => award.members.includes(member)).length >= 2).length >= 3);
      if (feasibleAward) assert.ok(found, `${comp}: no feasible award sampled`);
    }
  } finally { Math.random = originalRandom; }
  assert.ok(seen.size > 10, "award variety");
});

test("award grids mix single/grouped awards with nation, club, manager and teammate conditions", () => {
  const originalRandom = Math.random;
  let seed = 20261103;
  Math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const seen = new Set();
  try {
    for (let run = 0; run < 150; run += 1) {
      const puzzle = randomFootballTicTacToePuzzle("general");
      for (let row = 0; row < 3; row += 1) {
        for (let column = 0; column < 3; column += 1) {
          assert.ok(puzzle.answers[row][column].length >= 2);
          const axes = [puzzle.rows[row], puzzle.columns[column]];
          for (const [index, clue] of axes.entries()) {
            if (!clue.awardIds?.length) continue;
            seen.add(clue.awardIds.length === 1 ? "single" : "grouped");
            const other = axes[1 - index].label;
            if (/international$/.test(other)) seen.add("nation");
            if (/^Played for /.test(other)) seen.add("club");
            if (/^Managed by /.test(other)) seen.add("manager");
            if (/^Teammate of /.test(other)) seen.add("teammate");
          }
        }
      }
    }
  } finally { Math.random = originalRandom; }
  for (const kind of ["single", "grouped", "nation", "club", "manager", "teammate"]) {
    assert.ok(seen.has(kind), `Missing award intersection variety: ${kind}`);
  }
});

test("Tic-Tac-Toe prepared pools and fallback grids contain no OR award groups", async () => {
  const { default: prepared } = await import("../data/quizFootball.generated.json");
  const groups = new Map(AWARD_GROUPS.map((group) => [group.label, group]));
  for (const comp of comps) {
    const clues = [
      ...prepared.competitions[comp].pool.map(({ clue }) => clue),
      ...prepared.variants[comp].flatMap((puzzle) => [...puzzle.rows, ...puzzle.columns]),
    ];
    for (const clue of clues) {
      const group = groups.get(clue.label);
      if (!group || group.awardIds.length < 2) continue;
      assert.equal(group.awardOperator ?? group.operator, "AND", `${comp}: ${clue.label}`);
    }
  }
});

console.info("New question-bank additions:", STAT_SEASONS.map(({ comp }) => `${comp}: ${STAT_TRIVIA_CATEGORIES[comp].length} Trivia Path / ${STAT_RONDO_CLUES[comp].length} Rondo`).join("; "));
