import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { createHash } from "node:crypto";
import "./register-data.mjs";

const { FORMATION_PLAYERS, FORMATION_SLOTS, formationLineup, formationPlayer, formationPortrait } = await import("../data/formationInvasion.ts");
const { playerFaceUrl } = await import("../data/playerFaces.ts");
const { COMPETITION_LABELS } = await import("../lib/competitions.ts");
const {
  newFormationGame, joinFormationGame, applyFormationAction, formationView, formationSideOf, formationQuestionFor,
  expireFormationStanding, FORMATION_STANDING_TURN_MS,
} = await import("../lib/formationInvasion.ts");
const { FORMATION_STANDING_CATEGORIES, formationStandingCategory } = await import("../data/formationStanding.ts");
const { normalizeFootballPlayerName } = await import("../data/footballNames.ts");
const { lobbyFor } = await import("../lib/gameNavigation.ts");

const expected = (state) => ({ gameId: state.gameId, revision: state.revision });
const play = (state, side, action, now) => applyFormationAction(state, side, action, expected(state), now);
const answer = (state, index) => formationQuestionFor(state.slots[index]).answers[0];
const solve = (state, index, side = state.turn) => play(state, side, {
  action: "answer", slot: index, question: state.slots[index].progress, answer: answer(state, index),
});
const playing = () => {
  const state = newFormationGame("general", "online", "creator");
  assert.equal(joinFormationGame(state, "guest"), null);
  return state;
};
const openRace = (state, slot = 0) => {
  for (const side of ["p1", "p2"]) {
    assert.equal(play(state, side, { action: "hint", slot, question: state.slots[slot].progress }), null);
  }
};
const threeClues = (state, index = 0) => {
  for (let clue = 0; clue < 3; clue += 1) {
    for (const side of ["p1", "p2"]) {
      assert.equal(play(state, side, { action: "hint", slot: index, question: state.slots[index].progress, clue }), null);
    }
    if (clue < 2) {
      for (const side of ["p1", "p2"]) {
        assert.equal(play(state, side, { action: "answer", slot: index, question: state.slots[index].progress, answer: "wrong" }), null);
      }
    }
  }
};
const startStanding = (state, index = 0, now = 1000) => {
  threeClues(state, index);
  for (const side of ["p1", "p2"]) {
    assert.equal(play(state, side, { action: "standing-vote", slot: index, question: state.slots[index].progress }, now), null);
  }
};

test("Formation Invasion has eleven unique position-correct players in every scope, including tournaments", () => {
  assert.equal(new Set(FORMATION_PLAYERS.map((player) => player.id)).size, FORMATION_PLAYERS.length);
  for (const comp of Object.keys(COMPETITION_LABELS)) {
    const lineups = new Set();
    for (let round = 0; round < 100; round += 1) {
      const lineup = formationLineup(comp);
      assert.equal(lineup.length, 11);
      assert.equal(new Set(lineup).size, 11);
      lineup.forEach((id, index) => {
        const player = formationPlayer(id);
        assert.ok(player.positions.includes(FORMATION_SLOTS[index].position), `${comp}: ${player.name}`);
        assert.ok(comp === "general" || player.competitions.includes(comp));
      });
      lineups.add(lineup.join(","));
    }
    assert.ok(lineups.size > 1, `${comp} should have lineup variety`);
  }
});

test("Each footballer has eighteen specific questions, six per difficulty, with aliases, clues, portraits and provenance", () => {
  assert.equal(FORMATION_PLAYERS.length, 125);
  assert.equal(FORMATION_PLAYERS.reduce((total, player) => total + player.questions.length, 0), 2250);
  for (const player of FORMATION_PLAYERS) {
    assert.match(player.source, /^https:\/\/en.wikipedia.org\/wiki\//);
    assert.ok(playerFaceUrl(player.name) || formationPortrait(player.id), `${player.name} needs a portrait`);
    assert.equal(player.questions.length, 18);
    assert.equal(new Set(player.questions.map((question) => question.text)).size, 18);
    for (const tier of ["easy", "medium", "hard"]) {
      assert.equal(player.questions.filter((question) => question.difficulty === tier).length, 6, `${player.name}: ${tier}`);
    }
    for (const [index, question] of player.questions.entries()) {
      assert.ok(question.text.length > 30);
      assert.ok(question.hint.trim().length > 0);
      assert.equal(question.clues.length, 3, `${player.name}: three clues`);
      assert.equal(new Set(question.clues.map((clue) => clue.trim().toLowerCase())).size, 3);
      assert.equal(question.clues[0], question.hint);
      assert.ok(question.clues.every((clue) => clue.trim().length > 0));
      assert.ok(question.answers.length > 0);
      const state = newFormationGame("general", "solo");
      state.slots[0].playerId = player.id;
      state.slots[0].questionPicks = [index, (index + 1) % 18, (index + 2) % 18];
      for (const alias of question.answers) {
        const copy = structuredClone(state);
        assert.equal(play(copy, "p1", { action: "answer", slot: 0, question: 0, answer: ` ${alias.toUpperCase()} ` }), null);
        assert.equal(copy.slots[0].progress, 1, `${player.name}: ${alias}`);
      }
      for (let step = 0; step < 3; step += 1) assert.equal(solve(state, 0), null);
      assert.equal(state.slots[0].owner, "p1");
    }
  }
});

test("The 66-player expansion preserves the original bank and adds top-five-league players with non-revealing clues", () => {
  const words = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  assert.equal(createHash("sha256").update(JSON.stringify(FORMATION_PLAYERS.slice(0, 59))).digest("hex"),
    "dfd5b96f7ca6f6a5413728cffd9415bcf98e29505b8db7c350e9e7e51c75ae7a");
  const added = FORMATION_PLAYERS.slice(59);
  assert.equal(added.length, 66);
  assert.equal(new Set(FORMATION_PLAYERS.map((player) => normalizeFootballPlayerName(player.name))).size, 125);
  for (const player of added) {
    assert.ok(player.competitions.some((comp) => ["pl", "laliga", "seriea", "bundesliga", "ligue1"].includes(comp)), player.name);
    for (const question of player.questions) {
      for (const clue of question.clues) {
        const text = ` ${words(clue)} `;
        for (const alias of question.answers) {
          const normalized = words(alias);
          if (normalized.length < 3) continue;
          assert.ok(!text.includes(` ${normalized} `), `${player.name}: clue reveals ${alias}: ${clue}`);
        }
      }
    }
  }
});

test("Easy-medium-hard question picks persist through JSON, wrong answers, passes and clue votes", () => {
  for (const mode of ["online", "local", "solo"]) {
    const seen = new Set();
    for (let round = 0; round < 50; round += 1) {
      let state = newFormationGame("superlig", mode, "creator");
      if (mode === "online") joinFormationGame(state, "guest");
      for (const slot of state.slots) {
        assert.equal(slot.questionPicks.length, 3);
        assert.equal(new Set(slot.questionPicks).size, 3);
        assert.ok(slot.questionPicks.every((index) => Number.isInteger(index) && index >= 0 && index < 18));
        assert.deepEqual(slot.questionPicks.map((index) => formationPlayer(slot.playerId).questions[index].difficulty),
          ["easy", "medium", "hard"]);
      }
      seen.add(state.slots[10].questionPicks.join(","));
      const originalPicks = state.slots.map((slot) => [...slot.questionPicks]);
      play(state, "p1", { action: "select", slot: 0, question: 0 });
      const before = formationQuestionFor(state.slots[0]).text;
      state = JSON.parse(JSON.stringify(state));
      play(state, "p1", { action: "answer", slot: 0, question: 0, answer: "not correct" });
      assert.equal(formationQuestionFor(state.slots[0]).text, before);
      play(state, "p1", { action: "hint", slot: 0, question: 0 });
      if (mode !== "solo") {
        play(state, "p2", { action: "hint", slot: 0, question: 0 });
        assert.match(play(state, "p2", { action: "pass" }), /race/);
      }
      assert.equal(formationView(state, "p1").slots[0].hint, formationQuestionFor(state.slots[0]).hint);
      solve(state, 0);
      assert.equal(formationView(state, "p1").slots[0].question, null);
      assert.equal(play(state, state.turn, { action: "select", slot: 0, question: 1 }), null);
      assert.equal(formationView(state, state.turn).slots[0].question,
        formationPlayer(state.slots[0].playerId).questions[originalPicks[0][1]].text);
      assert.deepEqual(state.slots.map((slot) => slot.questionPicks), originalPicks);
    }
    assert.ok(seen.size > 1, `${mode} should vary the questions between games`);
  }
});

test("Legacy saved rooms without question picks retain their original questions and can still be completed", () => {
  const state = newFormationGame("general", "local");
  state.slots.forEach((slot) => { delete slot.questionPicks; });
  const player = formationPlayer(state.slots[0].playerId);
  for (let question = 0; question < 3; question += 1) {
    assert.equal(play(state, state.turn, { action: "select", slot: 0, question }), null);
    assert.equal(formationView(state, "p1").slots[0].question, player.questions[question].text);
    assert.equal(solve(state, 0), null);
  }
  assert.equal(state.slots[0].owner, "p1");
});

test("Existing six-question room picks are not reordered when new games switch to difficulty tiers", () => {
  const state = newFormationGame("general", "local");
  state.slots[0].questionPicks = [5, 0, 3];
  const player = formationPlayer(state.slots[0].playerId);
  for (const index of [5, 0, 3]) {
    assert.equal(formationQuestionFor(state.slots[0]), player.questions[index]);
    assert.equal(solve(state, 0), null);
  }
  assert.equal(state.slots[0].owner, "p1");
});

test("Shared progress lets the opponent claim question three; correct keeps turn, wrong passes without revealing answer", () => {
  const state = playing();
  const questions = structuredClone(formationPlayer(state.slots[0].playerId).questions);
  const thirdAnswer = questions[state.slots[0].questionPicks[2]].answers[0];
  assert.equal(solve(state, 0), null);
  assert.equal(state.turn, "p1");
  assert.equal(solve(state, 0), null);
  assert.equal(state.slots[0].progress, 2);
  assert.equal(state.slots[0].owner, null);
  assert.equal(play(state, "p1", { action: "answer", slot: 0, question: 2, answer: "not the answer" }), null);
  assert.equal(state.turn, "p2");
  assert.equal(state.slots[0].progress, 2);
  assert.equal(state.mistakes.p1, 1);
  assert.ok(!state.notice.includes(thirdAnswer));
  assert.equal(solve(state, 0, "p2"), null);
  assert.equal(state.slots[0].owner, "p2");
  assert.equal(state.turn, "p2");
  assert.deepEqual(formationPlayer(state.slots[0].playerId).questions, questions);
  assert.match(play(state, "p1", { action: "hint", slot: 0, question: 2 }), /locked/);
  assert.equal(formationView(state, "p2").scores.p2, 1);
});

test("Players can switch footballers, pass, and preserve partial progress", () => {
  const state = newFormationGame("pl", "local");
  solve(state, 0);
  solve(state, 1);
  assert.equal(state.turn, "p1");
  assert.equal(play(state, "p1", { action: "pass" }), null);
  assert.equal(state.turn, "p2");
  assert.equal(solve(state, 0, "p2"), null);
  assert.equal(state.slots[0].progress, 2);
  assert.equal(state.slots[1].progress, 1);
  assert.match(solve(state, 1, "p1"), /not your turn/);
});

test("Selecting commits the turn to one question across reloads; correct unlocks choice and wrong passes a fresh choice", () => {
  for (const mode of ["online", "local", "solo"]) {
    let state = mode === "online" ? playing() : newFormationGame("general", mode);
    assert.equal(play(state, "p1", { action: "select", slot: 0, question: 0 }), null);
    state = JSON.parse(JSON.stringify(state));
    const before = structuredClone(state);
    assert.match(play(state, "p1", { action: "select", slot: 1, question: 0 }), /selected footballer/);
    assert.match(solve(state, 1, "p1"), /selected footballer/);
    assert.match(play(state, "p1", { action: "hint", slot: 1, question: 0 }), /selected footballer/);
    assert.match(play(state, "p1", { action: "pass" }), /selected footballer/);
    assert.deepEqual(state, before);
    assert.equal(solve(state, 0), null);
    assert.equal(state.selectedSlot, null);
    assert.equal(state.turn, "p1");
    assert.equal(play(state, "p1", { action: "select", slot: 1, question: 0 }), null);
    assert.equal(play(state, "p1", { action: "answer", slot: 1, question: 0, answer: "wrong" }), null);
    if (mode === "solo") {
      assert.equal(state.turn, "p1");
      assert.equal(state.selectedSlot, 1);
      assert.match(play(state, "p1", { action: "select", slot: 2, question: 0 }), /selected footballer/);
    } else {
      assert.equal(state.turn, "p2");
      assert.equal(state.selectedSlot, null);
      assert.equal(play(state, "p2", { action: "select", slot: 2, question: 0 }), null);
      assert.match(play(state, "p1", { action: "select", slot: 2, question: 0 }), /not your turn/);
    }
  }
});

test("Online views share the chosen question with both players but hide unchosen questions and restrict normal answers to the turn-holder", () => {
  const state = playing();
  for (const side of ["p1", "p2"]) assert.ok(formationView(state, side).slots.every((slot) => slot.question === null && slot.hint === null && !slot.clues.length));
  assert.match(play(state, "p2", { action: "select", slot: 0, question: 0 }), /not your turn/);
  assert.equal(play(state, "p1", { action: "select", slot: 0, question: 0 }), null);
  assert.equal(formationView(state, "p1").slots[0].question, formationQuestionFor(state.slots[0]).text);
  assert.ok(formationView(state, "p1").slots.slice(1).every((slot) => slot.question === null));
  assert.equal(formationView(state, "p2").slots[0].question, formationQuestionFor(state.slots[0]).text);
  assert.ok(formationView(state, "p2").slots.slice(1).every((slot) => slot.question === null));
  const before = JSON.stringify(state);
  assert.match(play(state, "p2", { action: "answer", slot: 0, question: 0, answer: answer(state, 0) }), /not your turn/);
  assert.equal(JSON.stringify(state), before);
  assert.equal(play(state, "p1", { action: "hint", slot: 0, question: 0, clue: 0 }), null);
  assert.equal(formationView(state, "p2").slots[0].question, formationQuestionFor(state.slots[0]).text);
  assert.deepEqual(formationView(state, "p2").slots[0].clues, []);
  assert.equal(formationView(state, "p2").slots[0].hints.p1, true);
  assert.equal(play(state, "p2", { action: "hint", slot: 0, question: 0, clue: 0 }), null);
  for (const side of ["p1", "p2"]) {
    const view = formationView(state, side);
    assert.equal(view.slots[0].question, formationQuestionFor(state.slots[0]).text);
    assert.equal(view.slots[0].clues.length, 1);
    assert.ok(view.slots.slice(1).every((slot) => slot.question === null));
  }
  for (const side of ["p1", "p2"]) {
    assert.equal(play(state, side, { action: "answer", slot: 0, question: 0, answer: "wrong" }), null);
  }
  assert.equal(formationView(state, "p1").slots[0].clues.length, 1);
  assert.equal(formationView(state, "p2").slots[0].question, formationQuestionFor(state.slots[0]).text);
  assert.equal(formationView(state, "p2").slots[0].hint, formationQuestionFor(state.slots[0]).hint);
  assert.deepEqual(formationView(state, "p2").slots[0].clues, formationView(state, "p1").slots[0].clues);
  for (let clue = 1; clue < 3; clue += 1) {
    for (const side of ["p1", "p2"]) play(state, side, { action: "hint", slot: 0, question: 0, clue });
    if (clue === 1) for (const side of ["p1", "p2"]) play(state, side, { action: "answer", slot: 0, question: 0, answer: "wrong" });
  }
  for (const side of ["p1", "p2"]) play(state, side, { action: "standing-vote", slot: 0, question: 0 }, 1000);
  assert.ok(state.standing);
  for (const side of ["p1", "p2"]) assert.ok(formationView(state, side).slots[0].question);
  assert.equal(expireFormationStanding(state, 8000), true);
  assert.ok(formationView(state, state.turn).slots.every((slot) => slot.question === null));
  const local = newFormationGame("general", "local");
  play(local, "p1", { action: "select", slot: 0, question: 0 });
  assert.ok(formationView(local, "p2").slots[0].question, "same-device screen stays shared");
});

test("Clues need two votes for that exact question and reset on progress; solo reveals immediately", () => {
  const state = playing();
  assert.equal(play(state, "p1", { action: "hint", slot: 0, question: 0 }), null);
  assert.equal(formationView(state, "p1").slots[0].hint, null);
  assert.equal(play(state, "p2", { action: "hint", slot: 1, question: 0 }), null);
  assert.equal(formationView(state, "p1").slots[1].hint, null);
  assert.equal(play(state, "p2", { action: "hint", slot: 0, question: 0 }), null);
  assert.equal(formationView(state, "p1").slots[0].hint, formationQuestionFor(state.slots[0]).hint);
  assert.equal(state.turn, "p1");
  solve(state, 0);
  assert.deepEqual(state.slots[0].hints, { p1: false, p2: false });
  assert.equal(formationView(state, "p1").slots[0].hint, null);
  assert.match(play(state, "p1", { action: "hint", slot: 0, question: 0 }), /no longer active/);
  const solo = newFormationGame("copa", "solo");
  play(solo, "p1", { action: "select", slot: 0, question: 0 });
  play(solo, "p1", { action: "hint", slot: 0, question: 0 });
  assert.ok(formationView(solo, "p1").slots[0].hint);
  assert.equal(formationView(solo, "p1").clueRace, null);
});

test("A shared clue opens a one-attempt race; the off-turn winner advances and continues, claiming only question three", () => {
  for (const mode of ["online", "local"]) {
    const state = mode === "online" ? playing() : newFormationGame("general", mode);
    openRace(state);
    assert.deepEqual(formationView(state, "p2").clueRace, { slot: 0, question: 0, attempted: { p1: false, p2: false } });
    assert.match(play(state, "p1", { action: "pass" }), /race/);
    assert.match(solve(state, 1, "p2"), /race/);
    assert.equal(solve(state, 0, "p2"), null);
    assert.equal(state.turn, "p2");
    assert.equal(state.slots[0].progress, 1);
    assert.equal(state.slots[0].owner, null);
    assert.equal(state.clueRace, null);
    assert.equal(solve(state, 0, "p2"), null);
    openRace(state);
    assert.equal(solve(state, 0, "p1"), null);
    assert.equal(state.slots[0].owner, "p1");
    assert.equal(state.turn, "p1");
    assert.equal(state.clueRace, null);
    assert.deepEqual(state.slots[0].hints, { p1: false, p2: false });
  }
});

test("Race attempts survive serialization; invalid input costs none, wrong answers lock only that side, and two wrongs resume original turn", () => {
  let state = playing();
  openRace(state);
  state = JSON.parse(JSON.stringify(state));
  const start = expected(state);
  const before = structuredClone(state);
  for (const value of ["", "!", "x".repeat(151)]) {
    assert.ok(play(state, "p2", { action: "answer", slot: 0, question: 0, answer: value }));
  }
  assert.deepEqual(state, before);
  assert.equal(play(state, "p1", { action: "answer", slot: 0, question: 0, answer: "wrong" }), null);
  assert.match(solve(state, 0, "p1"), /already used/);
  assert.equal(state.turn, "p1");
  assert.equal(applyFormationAction(state, "p2", {
    action: "answer", slot: 0, question: 0, answer: "also wrong",
  }, start), null);
  assert.equal(state.clueRace, null);
  assert.equal(state.slots[0].progress, 0);
  assert.equal(state.turn, "p1");
  assert.deepEqual(state.mistakes, { p1: 1, p2: 1 });
  assert.ok(formationView(state, "p1").slots[0].hint);
  assert.match(play(state, "p2", { action: "hint", slot: 0, question: 0 }), /already requested/);
  assert.match(solve(state, 0, "p2"), /not your turn/);
  assert.equal(solve(state, 0, "p1"), null);
});

test("A wrong race answer cannot block the other side's in-flight correct answer or allow pre-race and duplicate attempts", () => {
  const state = playing();
  const beforeRace = expected(state);
  openRace(state);
  const opened = expected(state);
  assert.match(applyFormationAction(state, "p2", {
    action: "answer", slot: 0, question: 0, answer: answer(state, 0),
  }, beforeRace), /game changed/);
  assert.equal(play(state, "p1", { action: "answer", slot: 0, question: 0, answer: "wrong" }), null);
  const action = { action: "answer", slot: 0, question: 0, answer: answer(state, 0) };
  assert.equal(applyFormationAction(state, "p2", action, opened), null);
  assert.equal(state.turn, "p2");
  assert.equal(state.slots[0].progress, 1);
  assert.match(applyFormationAction(state, "p1", action, opened), /game changed/);
  assert.equal(state.correct.p2, 1);
});

test("Winning question three in a clue race can claim the sixth footballer and finish the game", () => {
  const state = playing();
  for (let index = 0; index < 5; index += 1) {
    state.turn = "p2";
    for (let question = 0; question < 3; question += 1) assert.equal(solve(state, index), null);
  }
  state.turn = "p1";
  assert.equal(solve(state, 5), null);
  assert.equal(solve(state, 5), null);
  openRace(state, 5);
  assert.equal(solve(state, 5, "p2"), null);
  assert.equal(state.winner, "p2");
  assert.equal(state.phase, "finished");
  assert.equal(formationView(state, "p2").scores.p2, 6);
  assert.equal(formationView(state, "p2").clueRace, null);
  assert.match(solve(state, 6), /finished/);
});

test("Three sequential mutual clue votes reveal only approved clues; solo reveals one at a time without a race", () => {
  const state = playing();
  const question = formationQuestionFor(state.slots[0]);
  assert.deepEqual(formationView(state, "p1").slots[0].clues, []);
  assert.match(play(state, "p1", { action: "standing-vote", slot: 0, question: 0 }), /three clues/);
  assert.match(play(state, "p1", { action: "hint", slot: 0, question: 0, clue: 1 }), /no longer active/);
  for (let clue = 0; clue < 3; clue += 1) {
    assert.equal(play(state, "p1", { action: "hint", slot: 0, question: 0, clue }), null);
    assert.deepEqual(formationView(state, "p2").slots[0].clues, question.clues.slice(0, clue));
    assert.match(play(state, "p1", { action: "hint", slot: 0, question: 0, clue }), /already requested/);
    assert.equal(play(state, "p2", { action: "hint", slot: 0, question: 0, clue }), null);
    assert.deepEqual(formationView(state, "p1").slots[0].clues, question.clues.slice(0, clue + 1));
    assert.equal(state.clueRace.question, 0);
    assert.match(play(state, "p1", { action: "hint", slot: 0, question: 0, clue: clue + 1 }), /race/);
    for (const side of ["p1", "p2"]) {
      assert.equal(play(state, side, { action: "answer", slot: 0, question: 0, answer: "wrong" }), null);
    }
  }
  assert.match(play(state, "p1", { action: "hint", slot: 0, question: 0, clue: 3 }), /All three/);
  assert.equal(solve(state, 0), null);
  assert.equal(formationView(state, "p1").slots[0].cluesRevealed, 0);
  assert.deepEqual(formationView(state, "p1").slots[0].clues, []);
  const solo = newFormationGame("general", "solo");
  play(solo, "p1", { action: "select", slot: 0, question: 0 });
  for (let clue = 0; clue < 3; clue += 1) {
    assert.equal(play(solo, "p1", { action: "hint", slot: 0, question: 0, clue }), null);
    assert.equal(formationView(solo, "p1").slots[0].clues.length, clue + 1);
    assert.equal(solo.clueRace, null);
  }
  assert.match(play(solo, "p1", { action: "standing-vote", slot: 0, question: 0 }), /two players/);
});

test("Legacy revealed-clue rooms retain their first clue and can mutually unlock the second without losing a vote", () => {
  const state = playing();
  const slot = state.slots[0];
  delete slot.cluesRevealed;
  delete slot.standingVotes;
  slot.hints = { p1: true, p2: true };
  play(state, "p1", { action: "select", slot: 0, question: 0 });
  assert.equal(formationView(state, "p1").slots[0].clues.length, 1);
  assert.equal(play(state, "p1", { action: "hint", slot: 0, question: 0, clue: 1 }), null);
  assert.equal(slot.cluesRevealed, 1);
  assert.deepEqual(slot.hints, { p1: true, p2: false });
  assert.equal(play(state, "p2", { action: "hint", slot: 0, question: 0, clue: 1 }), null);
  assert.equal(formationView(state, "p1").slots[0].clues.length, 2);
  assert.equal(state.clueRace.slot, 0);
});

test("Last Man Standing requires three clues, matching votes, a random starter and an exact seven-second deadline", (t) => {
  const state = playing();
  threeClues(state);
  assert.equal(state.slots[0].progress, 0);
  assert.equal(state.standing, null);
  assert.match(play(state, "p1", { action: "standing-vote", slot: 1, question: 0 }), /race/);
  assert.equal(play(state, "p1", { action: "standing-vote", slot: 0, question: 0 }), null);
  assert.equal(state.standing, null);
  assert.match(play(state, "p1", { action: "standing-vote", slot: 0, question: 0 }), /already voted/);
  t.mock.method(Math, "random", () => 0.9);
  assert.equal(play(state, "p2", { action: "standing-vote", slot: 0, question: 0 }, 1000), null);
  assert.equal(state.standing.turn, "p2");
  assert.equal(state.standing.deadline, 1000 + FORMATION_STANDING_TURN_MS);
  assert.equal(state.clueRace, null);
  assert.match(play(state, "p2", { action: "pass" }, 1000), /Last Man Standing/);
  assert.match(play(state, "p2", { action: "hint", slot: 0, question: 0 }, 1000), /Last Man Standing/);
  const view = formationView(state, "p1", 1000);
  assert.ok(view.standing.prompt);
  assert.deepEqual(view.standing.used, []);
  assert.equal(view.serverNow, 1000);
  assert.ok(!JSON.stringify(view.standing).includes('"entries"'));
  assert.ok(!JSON.stringify(view.standing).includes('"aliases"'));
});

test("Standing answer aliases alternate turns, reset seven seconds, and a repeated alias loses only the current question", () => {
  const state = playing();
  startStanding(state);
  state.standing.categoryId = "world-cup-winners";
  const first = state.standing.turn;
  const second = first === "p1" ? "p2" : "p1";
  const deadline = state.standing.deadline;
  assert.match(play(state, second, { action: "standing-answer", answer: "Brazil", deadline }, 1001), /not your/);
  assert.match(play(state, first, { action: "standing-answer", answer: "!", deadline }, 1001), /Enter/);
  assert.match(play(state, first, { action: "standing-timeout", deadline }, 1001), /still time/);
  assert.equal(play(state, first, { action: "standing-answer", answer: "  BRASIL  ", deadline }, 2000), null);
  assert.deepEqual(state.standing.used, ["Brazil"]);
  assert.equal(state.standing.turn, second);
  assert.equal(state.standing.deadline, 9000);
  assert.match(play(state, second, { action: "standing-answer", answer: "Italy", deadline }, 2001), /turn has ended/);
  assert.equal(play(state, second, { action: "standing-answer", answer: "Brazil", deadline: 9000 }, 3000), null);
  assert.equal(state.standing, null);
  assert.equal(state.turn, first);
  assert.equal(state.slots[0].progress, 1);
  assert.equal(state.slots[0].owner, null);
  assert.deepEqual(state.slots[0].standingVotes, { p1: false, p2: false });
  assert.equal(state.slots[0].cluesRevealed, 0);
  assert.match(state.notice, /repeated an answer/);
});

test("Standing timeout at exactly seven seconds is persisted once and cannot spill into a later question or rematch", () => {
  for (const mode of ["online", "local"]) {
    let state = mode === "online" ? playing() : newFormationGame("general", mode);
    startStanding(state);
    state = JSON.parse(JSON.stringify(state));
    const loser = state.standing.turn;
    const winner = loser === "p1" ? "p2" : "p1";
    const old = expected(state);
    const action = { action: "standing-answer", answer: "Brazil", deadline: state.standing.deadline };
    assert.equal(expireFormationStanding(state, 7999), false);
    assert.equal(applyFormationAction(state, loser, action, old, 8000), null);
    assert.equal(state.turn, winner);
    assert.equal(state.slots[0].progress, 1);
    assert.match(state.notice, /ran out of time/);
    assert.equal(expireFormationStanding(state, 10000), false);
    assert.match(applyFormationAction(state, loser, action, old, 10000), /game changed/);
    assert.equal(state.slots[0].progress, 1);
  }
});

test("Standing wrong answers on question three award a permanent claim and can win the match", () => {
  const state = playing();
  for (let index = 0; index < 5; index += 1) {
    for (let step = 0; step < 3; step += 1) solve(state, index);
  }
  solve(state, 5);
  solve(state, 5);
  startStanding(state, 5);
  state.standing.turn = "p2";
  const deadline = state.standing.deadline;
  assert.equal(play(state, "p2", { action: "standing-answer", answer: "not a football answer", deadline }, 1001), null);
  assert.equal(state.slots[5].owner, "p1");
  assert.equal(state.phase, "finished");
  assert.equal(state.winner, "p1");
  assert.equal(state.turn, "p1");
  assert.equal(state.standing, null);
  assert.equal(formationView(state, "p1").scores.p1, 6);
  const previous = { gameId: state.gameId, revision: state.revision - 1 };
  assert.equal(play(state, "p1", { action: "rematch" }), null);
  assert.equal(play(state, "p2", { action: "rematch" }), null);
  assert.equal(state.standing, null);
  assert.equal(state.clueRace, null);
  assert.ok(state.slots.every((slot) => slot.cluesRevealed === 0 && !slot.standingVotes.p1 && !slot.standingVotes.p2));
  assert.match(applyFormationAction(state, "p2", { action: "standing-timeout", deadline }, previous, deadline), /game changed/);
});

test("Both players share the same standing category across turns and reconnects", () => {
  for (const category of FORMATION_STANDING_CATEGORIES) {
    const state = playing();
    startStanding(state);
    state.standing.categoryId = category.id;
    const first = state.standing.turn;
    for (let index = 0; index < 2; index++) {
      const before = formationView(state, "p1", 1001 + index);
      assert.deepEqual(before.standing, formationView(state, "p2", 1001 + index).standing);
      assert.equal(before.standing.prompt, category.prompt);
      assert.equal(play(state, state.standing.turn, {
        action: "standing-answer", answer: category.entries[index].name, deadline: state.standing.deadline,
      }, 1001 + index), null);
      const reloaded = JSON.parse(JSON.stringify(state));
      for (const side of ["p1", "p2"]) {
        const view = formationView(reloaded, side, 1002 + index);
        assert.equal(view.standing.prompt, category.prompt);
        assert.deepEqual(view.standing.used, category.entries.slice(0, index + 1).map((entry) => entry.name));
        assert.equal(view.standing.turn, index === 0 ? (first === "p1" ? "p2" : "p1") : first);
      }
    }
  }
});

test("South American Premier League winners use the stated medal and season limits", () => {
  const category = formationStandingCategory("south-american-premier-league-winners");
  assert.match(category.prompt, /South American.*Premier League.*1992\/93.*2022\/23/);
  for (const answer of ["Aguero", "Forlan", "Cuadrado", "Bravo", "Valencia", "Firmino", "Alvarez"]) {
    const state = playing();
    startStanding(state);
    state.standing.categoryId = category.id;
    assert.equal(play(state, state.standing.turn, {
      action: "standing-answer", answer, deadline: state.standing.deadline,
    }, 1001), null);
    assert.equal(state.standing.used.length, 1, answer);
  }
  for (const answer of ["Lionel Messi", "Luis Suarez", "Riyad Mahrez", "Alexis Mac Allister", "Luis Diaz"]) {
    const state = playing();
    startStanding(state);
    state.standing.categoryId = category.id;
    const loser = state.standing.turn;
    assert.equal(play(state, loser, {
      action: "standing-answer", answer, deadline: state.standing.deadline,
    }, 1001), null);
    assert.equal(state.standing, null, answer);
    assert.notEqual(state.turn, loser, answer);
    assert.equal(state.slots[0].progress, 1, answer);
  }
});

test("Standing categories accept all aliases and rotate without awarding progress if every answer is used", () => {
  for (const category of FORMATION_STANDING_CATEGORIES) {
    assert.ok(category.entries.length >= 7);
    assert.ok(category.source.startsWith("https://"));
    const aliases = new Map();
    for (const entry of category.entries) {
      for (const alias of [entry.name, ...entry.aliases]) {
        const key = normalizeFootballPlayerName(alias);
        assert.ok(!aliases.has(key) || aliases.get(key) === entry.name, `${category.id}: ambiguous ${alias}`);
        aliases.set(key, entry.name);
        const state = playing();
        startStanding(state);
        state.standing.categoryId = category.id;
        const side = state.standing.turn;
        assert.equal(play(state, side, { action: "standing-answer", answer: alias, deadline: state.standing.deadline }, 1001), null);
        assert.deepEqual(state.standing.used, [entry.name]);
        assert.equal(state.slots[0].progress, 0);
      }
    }
    const state = playing();
    startStanding(state);
    state.standing.categoryId = category.id;
    state.standing.categories = [category.id];
    state.standing.used = category.entries.slice(0, -1).map((entry) => entry.name);
    const first = state.standing.turn;
    assert.equal(play(state, first, { action: "standing-answer",
      answer: category.entries.at(-1).name, deadline: state.standing.deadline }, 1001), null);
    assert.notEqual(state.standing.categoryId, category.id);
    assert.equal(state.standing.turn, first === "p1" ? "p2" : "p1");
    assert.equal(state.standing.deadline, 8001);
    assert.deepEqual(state.standing.used, []);
    assert.equal(state.slots[0].progress, 0);
  }
});

test("Solo counts mistakes without an opponent and ends at exactly six claims; multiplayer rematches need both votes", () => {
  for (const mode of ["solo", "local", "online"]) {
    const state = mode === "online" ? playing() : newFormationGame("euros", mode);
    if (mode === "solo") {
      play(state, "p1", { action: "answer", slot: 0, question: 0, answer: "wrong" });
      assert.equal(state.turn, "p1");
      assert.equal(state.mistakes.p1, 1);
    }
    for (let index = 0; index < 6; index += 1) {
      for (let question = 0; question < 3; question += 1) assert.equal(solve(state, index), null);
      assert.equal(state.phase, index === 5 ? "finished" : "playing");
    }
    assert.equal(state.winner, "p1");
    assert.equal(formationView(state, "p1").scores.p1, 6);
    assert.match(solve(state, 6), /finished/);
    const oldGame = state.gameId;
    play(state, "p1", { action: "rematch" });
    if (mode !== "solo") {
      assert.equal(state.gameId, oldGame);
      play(state, "p2", { action: "rematch" });
    }
    assert.notEqual(state.gameId, oldGame);
    assert.equal(state.phase, "playing");
    assert.deepEqual(formationView(state, "p1").scores, { p1: 0, p2: 0 });
    assert.ok(state.slots.every((slot) => slot.progress === 0 && !slot.owner && !slot.hints.p1 && !slot.hints.p2));
  }
});

test("Stale, repeated, out-of-turn and malformed answers cannot modify a match", () => {
  const state = playing();
  const stale = expected(state);
  const oldAnswer = answer(state, 0);
  solve(state, 0);
  const before = structuredClone(state);
  assert.match(applyFormationAction(state, "p1", { action: "answer", slot: 0, question: 0, answer: oldAnswer }, stale), /game changed/);
  for (const action of [
    { action: "answer", slot: -1, question: 0, answer: "a" },
    { action: "answer", slot: 1.5, question: 0, answer: "a" },
    { action: "answer", slot: 0, question: 0, answer: oldAnswer },
    { action: "answer", slot: 0, question: 1, answer: " " },
    { action: "answer", slot: 0, question: 1, answer: "!" },
    { action: "answer", slot: 0, question: 1, answer: "x".repeat(151) },
  ]) assert.ok(play(state, "p1", action));
  assert.ok(play(state, "p2", { action: "answer", slot: 0, question: 1, answer: answer(state, 0) }));
  assert.deepEqual(state, before);
});

test("A 5-5 final-player decider can be won by Player 2 and locks the match", () => {
  const state = newFormationGame("superlig", "local");
  for (let index = 0; index < 10; index += 1) {
    const side = index < 5 ? "p1" : "p2";
    if (state.turn !== side) play(state, state.turn, { action: "pass" });
    for (let question = 0; question < 3; question += 1) solve(state, index, side);
  }
  assert.deepEqual(formationView(state, "p1").scores, { p1: 5, p2: 5 });
  assert.equal(state.phase, "playing");
  for (let question = 0; question < 3; question += 1) solve(state, 10, "p2");
  assert.equal(state.winner, "p2");
  assert.equal(state.phase, "finished");
  assert.match(play(state, "p1", { action: "pass" }), /finished/);
});

test("Public views never include tokens, accepted answers, future questions or unrevealed clues", () => {
  const state = playing();
  const view = formationView(state, "p1");
  const text = JSON.stringify(view);
  assert.ok(!text.includes("creator") && !text.includes("guest"));
  assert.ok(!text.includes('"answers"') && !text.includes('"questions"') && !text.includes('"p1Token"'));
  assert.ok(!text.includes('"questionPicks"'));
  assert.ok(view.slots.every((slot) => slot.hint === null));
  assert.equal(formationSideOf(state, ""), null);
  assert.equal(formationSideOf(state, "bad"), null);
  assert.equal(formationSideOf(state, "guest"), "p2");
  const waiting = newFormationGame("general", "online", "creator");
  assert.match(solve(waiting, 0), /Wait/);
  assert.equal(joinFormationGame(waiting, "guest"), null);
  assert.ok(joinFormationGame(waiting, "third"));
});

test("Lightweight lobby links preserve every existing competition destination", () => {
  for (const comp of Object.keys(COMPETITION_LABELS)) assert.ok(lobbyFor(comp).includes("game"));
  assert.equal(lobbyFor("pl"), "/game?mode=league");
  assert.equal(lobbyFor("general"), "/game/general");
  assert.equal(lobbyFor("superlig"), "/super-lig/game?mode=league");
  assert.equal(lobbyFor("worldcup"), "/world-cup/game?mode=league");
});

// Exercise the real Next route with an in-memory implementation of D1's conditional writes.
const rows = new Map();
const db = {
  prepare(sql) {
    return {
      bind(...values) {
        return {
          async first() {
            const row = rows.get(values[0]);
            return row ? { ...row } : null;
          },
          async run() {
            if (sql.startsWith("DELETE")) return { meta: { changes: 0 } };
            if (sql.startsWith("INSERT")) {
              const [code, state] = values;
              if (rows.has(code)) throw new Error("UNIQUE constraint failed: formation_invasion_rooms.code");
              rows.set(code, { state, version: 0 });
              return { meta: { changes: 1 } };
            }
            const [state, , code, version] = values;
            const row = rows.get(code);
            if (!row || row.version !== version) return { meta: { changes: 0 } };
            rows.set(code, { state, version: version + 1 });
            return { meta: { changes: 1 } };
          },
        };
      },
    };
  },
};
globalThis.__formationTestEnv = { DB: db };
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "@opennextjs/cloudflare") {
      return { url: "data:text/javascript,export const getCloudflareContext=()=>({env:globalThis.__formationTestEnv})", shortCircuit: true };
    }
    return next(specifier === "next/server" ? "next/server.js" : specifier, context);
  },
});
const { NextRequest } = await import("next/server.js");
const { GET, POST } = await import("../app/api/game/formation-invasion/route.ts");
const api = async (body) => {
  const response = await POST(new NextRequest("http://localhost/api/game/formation-invasion", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  }));
  return { status: response.status, ...await response.json() };
};

test("Room API creates, joins, authenticates and validates all actions without leaking answers", async () => {
  const created = await api({ action: "create", comp: "superlig" });
  assert.equal(created.status, 200);
  assert.equal(created.view.comp, "superlig");
  const joined = await api({ action: "join", code: created.code });
  assert.equal(joined.status, 200);
  assert.equal(joined.view.you, "p2");
  assert.equal((await api({ action: "join", code: created.code })).status, 409);
  assert.equal((await api({ action: "pass", code: created.code, token: "outsider" })).status, 403);
  assert.equal((await api({ action: "create", comp: "not-a-competition" })).status, 400);
  assert.equal((await api(null)).status, 400);
  assert.equal((await api({ action: "answer", code: created.code, token: created.token, slot: "0" })).status, 400);
  const response = await GET(new NextRequest(`http://localhost/api/game/formation-invasion?code=${created.code}&token=${created.token}`));
  const { view } = await response.json();
  assert.equal(response.status, 200);
  assert.equal(view.you, "p1");
  assert.ok(!JSON.stringify(view).includes('"answers"'));
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("Concurrent answers and stale requests can advance a shared online question only once", async () => {
  const created = await api({ action: "create", comp: "copa" });
  const joined = await api({ action: "join", code: created.code });
  const state = JSON.parse(rows.get(created.code).state);
  const payload = {
    action: "answer", code: created.code, token: created.token, slot: 0, question: 0,
    answer: answer(state, 0), gameId: joined.view.gameId, revision: joined.view.revision,
  };
  const results = await Promise.all([api(payload), api(payload)]);
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 409]);
  const saved = JSON.parse(rows.get(created.code).state);
  assert.equal(saved.slots[0].progress, 1);
  assert.equal(saved.correct.p1, 1);
  assert.equal((await api(payload)).status, 409);
  assert.equal((await api({ ...payload, token: joined.token, revision: saved.revision, question: 1, answer: answer(saved, 0) })).status, 409);
});

test("Room API commits one selection atomically, shares only that question with the opponent and enforces turn locks", async () => {
  const created = await api({ action: "create", comp: "general" });
  const joined = await api({ action: "join", code: created.code });
  const payload = { action: "select", code: created.code, token: created.token, question: 0,
    gameId: joined.view.gameId, revision: joined.view.revision };
  assert.equal((await api({ ...payload, token: joined.token, slot: 0 })).status, 409);
  assert.equal((await api({ ...payload, slot: "0" })).status, 400);
  const picks = await Promise.all([api({ ...payload, slot: 0 }), api({ ...payload, slot: 1 })]);
  assert.deepEqual(picks.map((response) => response.status).sort(), [200, 409]);
  const state = JSON.parse(rows.get(created.code).state);
  const chosen = state.selectedSlot;
  const waiting = await GET(new NextRequest(`http://localhost/api/game/formation-invasion?code=${created.code}&token=${joined.token}`));
  const view = (await waiting.json()).view;
  assert.equal(view.selectedSlot, chosen);
  assert.equal(view.slots[chosen].question, formationQuestionFor(state.slots[chosen]).text);
  assert.ok(view.slots.every((slot, index) => (index === chosen || slot.question === null) && slot.hint === null && slot.clues.length === 0));
  assert.equal((await api({ ...payload, token: joined.token, action: "answer",
    slot: chosen, answer: answer(state, chosen), ...expected(state) })).status, 409);
  assert.equal(JSON.parse(rows.get(created.code).state).revision, state.revision);
  assert.equal((await api({ ...payload, slot: chosen === 0 ? 1 : 0, ...expected(state) })).status, 409);
  assert.equal((await api({ ...payload, action: "pass", ...expected(state) })).status, 409);
  const wrong = await api({ ...payload, action: "answer", slot: chosen, answer: "wrong", ...expected(state) });
  assert.equal(wrong.status, 200);
  assert.ok(wrong.view.slots.every((slot) => slot.question === null));
  const current = JSON.parse(rows.get(created.code).state);
  assert.equal(current.turn, "p2");
  assert.equal(current.selectedSlot, null);
  const next = await api({ ...payload, token: joined.token, slot: chosen === 0 ? 1 : 0, ...expected(current) });
  assert.equal(next.status, 200);
  assert.ok(next.view.slots[next.view.selectedSlot].question);
});
test("Room API resolves both-side clue races atomically, retaining simultaneous attempts after a wrong answer", async () => {
  for (const scenario of ["both-correct", "offturn-first", "first-wrong", "both-wrong"]) {
    const created = await api({ action: "create", comp: "general" });
    const joined = await api({ action: "join", code: created.code });
    for (const token of [created.token, joined.token]) {
      const current = JSON.parse(rows.get(created.code).state);
      assert.equal((await api({ action: "hint", code: created.code, token, slot: 0, question: 0,
        ...expected(current) })).status, 200);
    }
    const state = JSON.parse(rows.get(created.code).state);
    const payload = { action: "answer", code: created.code, slot: 0, question: 0, ...expected(state) };
    const attempts = [
      { ...payload, token: created.token, answer: ["both-correct", "offturn-first"].includes(scenario) ? answer(state, 0) : "wrong" },
      { ...payload, token: joined.token, answer: scenario === "both-wrong" ? "wrong" : answer(state, 0) },
    ];
    if (scenario === "offturn-first") attempts.reverse();
    const results = await Promise.all(attempts.map(api));
    assert.deepEqual(results.map((result) => result.status).sort(),
      ["both-correct", "offturn-first"].includes(scenario) ? [200, 409] : [200, 200], scenario);
    const saved = JSON.parse(rows.get(created.code).state);
    assert.equal(saved.clueRace, null);
    assert.equal(saved.slots[0].progress, scenario === "both-wrong" ? 0 : 1);
    assert.equal(saved.turn, ["first-wrong", "offturn-first"].includes(scenario) ? "p2" : "p1");
    assert.equal(saved.correct.p1 + saved.correct.p2, scenario === "both-wrong" ? 0 : 1);
    assert.equal(saved.mistakes.p1 + saved.mistakes.p2,
      scenario === "both-wrong" ? 2 : scenario === "first-wrong" ? 1 : 0);
    assert.equal((await api({ ...payload, token: joined.token, answer: answer(saved, 0) })).status, 409);
  }
});

const apiStanding = async () => {
  const created = await api({ action: "create", comp: "general" });
  const joined = await api({ action: "join", code: created.code });
  const tokens = [created.token, joined.token];
  const send = async (side, action) => {
    const state = JSON.parse(rows.get(created.code).state);
    const response = await api({ code: created.code, token: tokens[side], ...expected(state), ...action });
    assert.equal(response.status, 200, response.error);
    return response;
  };
  for (let clue = 0; clue < 3; clue += 1) {
    for (const side of [0, 1]) {
      const response = await send(side, { action: "hint", slot: 0, question: 0, clue });
      assert.equal(response.view.slots[0].clues.length, side === 0 ? clue : clue + 1);
    }
    if (clue < 2) {
      for (const side of [0, 1]) await send(side, { action: "answer", slot: 0, question: 0, answer: "wrong" });
    }
  }
  await send(0, { action: "standing-vote", slot: 0, question: 0 });
  const response = await send(1, { action: "standing-vote", slot: 0, question: 0 });
  return { code: created.code, tokens, view: response.view };
};

test("Room API enforces three clues, mutual standing votes, private answers, seven-second turns and stale-action rejection", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  const room = await apiStanding();
  const state = JSON.parse(rows.get(room.code).state);
  const side = state.standing.turn;
  const token = room.tokens[side === "p1" ? 0 : 1];
  const wrongToken = room.tokens[side === "p1" ? 1 : 0];
  const goodAnswer = formationStandingCategory(state.standing.categoryId).entries[0].name;
  const payload = { action: "standing-answer", code: room.code, token, answer: goodAnswer,
    deadline: state.standing.deadline, ...expected(state) };
  assert.equal((await api({ ...payload, token: wrongToken })).status, 409);
  assert.equal((await api({ ...payload, deadline: "8000" })).status, 400);
  assert.equal((await api({ ...payload, action: "hint", slot: 0, question: 0, clue: "1" })).status, 400);
  assert.equal((await api({ ...payload, action: "standing-timeout" })).status, 409);
  assert.equal((await api({ ...payload, answer: "!" })).status, 409);
  assert.ok(!JSON.stringify(room.view.standing).includes(goodAnswer));
  assert.equal(room.view.standing.deadline, 8000);
  now = 7999;
  const responses = await Promise.all([api(payload), api(payload)]);
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 409]);
  const saved = JSON.parse(rows.get(room.code).state);
  assert.equal(saved.standing.deadline, 14999);
  assert.deepEqual(saved.standing.used, [goodAnswer]);
  assert.equal(saved.slots[0].progress, 0);
  assert.equal((await api({ ...payload, action: "standing-timeout", ...expected(saved) })).status, 409);
});

test("Concurrent polling or a late answer commits standing timeout exactly once without applying that answer to the next question", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  for (const trigger of ["poll", "late-answer", "timeout-action"]) {
    now = 1000;
    const room = await apiStanding();
    const state = JSON.parse(rows.get(room.code).state);
    const loser = state.standing.turn;
    const winner = loser === "p1" ? "p2" : "p1";
    now = 8000;
    if (trigger === "poll") {
      const responses = await Promise.all(room.tokens.map((token) => GET(new NextRequest(
        `http://localhost/api/game/formation-invasion?code=${room.code}&token=${token}`,
      ))));
      for (const response of responses) {
        assert.equal(response.status, 200);
        assert.equal((await response.json()).view.slots[0].progress, 1);
      }
    } else {
      const payload = { action: trigger === "late-answer" ? "standing-answer" : "standing-timeout",
        code: room.code, token: room.tokens[loser === "p1" ? 0 : 1], answer: answer(state, 0),
        deadline: state.standing.deadline, ...expected(state) };
      const response = await api(payload);
      assert.equal(response.status, trigger === "late-answer" ? 409 : 200);
      assert.equal(response.view.standing, null);
      assert.equal(response.view.slots[0].progress, 1);
      assert.equal((await api(payload)).status, 409);
    }
    const saved = JSON.parse(rows.get(room.code).state);
    assert.equal(saved.turn, winner);
    assert.equal(saved.correct[winner], 1);
    assert.equal(saved.slots[0].progress, 1);
    assert.equal(saved.mistakes[loser], state.mistakes[loser] + 1);
    assert.equal(saved.standing, null);
  }
});
