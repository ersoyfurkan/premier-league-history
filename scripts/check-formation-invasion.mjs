import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import "./register-data.mjs";

const { FORMATION_PLAYERS, FORMATION_SLOTS, formationLineup, formationPlayer, formationPortrait } = await import("../data/formationInvasion.ts");
const { playerFaceUrl } = await import("../data/playerFaces.ts");
const { COMPETITION_LABELS } = await import("../lib/competitions.ts");
const {
  newFormationGame, joinFormationGame, applyFormationAction, formationView, formationSideOf, formationQuestionFor,
} = await import("../lib/formationInvasion.ts");
const { lobbyFor } = await import("../lib/gameNavigation.ts");

const expected = (state) => ({ gameId: state.gameId, revision: state.revision });
const play = (state, side, action) => applyFormationAction(state, side, action, expected(state));
const answer = (state, index) => formationQuestionFor(state.slots[index]).answers[0];
const solve = (state, index, side = state.turn) => play(state, side, {
  action: "answer", slot: index, question: state.slots[index].progress, answer: answer(state, index),
});
const playing = () => {
  const state = newFormationGame("general", "online", "creator");
  assert.equal(joinFormationGame(state, "guest"), null);
  return state;
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

test("Each footballer has six specific questions with accepted aliases, clues, portraits and provenance", () => {
  assert.equal(FORMATION_PLAYERS.reduce((total, player) => total + player.questions.length, 0), 354);
  for (const player of FORMATION_PLAYERS) {
    assert.match(player.source, /^https:\/\/en.wikipedia.org\/wiki\//);
    assert.ok(playerFaceUrl(player.name) || formationPortrait(player.id), `${player.name} needs a portrait`);
    assert.equal(player.questions.length, 6);
    assert.equal(new Set(player.questions.map((question) => question.text)).size, 6);
    for (const [index, question] of player.questions.entries()) {
      assert.ok(question.text.length > 30);
      assert.ok(question.hint.trim().length > 0);
      const state = newFormationGame("general", "solo");
      state.slots[0].playerId = player.id;
      state.slots[0].questionPicks = [index, (index + 1) % 6, (index + 2) % 6];
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

test("Three distinct random question picks per player persist through JSON, wrong answers, passes and clue votes", () => {
  for (const mode of ["online", "local", "solo"]) {
    const seen = new Set();
    for (let round = 0; round < 50; round += 1) {
      let state = newFormationGame("superlig", mode, "creator");
      if (mode === "online") joinFormationGame(state, "guest");
      for (const slot of state.slots) {
        assert.equal(slot.questionPicks.length, 3);
        assert.equal(new Set(slot.questionPicks).size, 3);
        assert.ok(slot.questionPicks.every((index) => Number.isInteger(index) && index >= 0 && index < 6));
      }
      seen.add(state.slots[10].questionPicks.join(","));
      const originalPicks = state.slots.map((slot) => [...slot.questionPicks]);
      const before = formationView(state, "p1").slots[0].question;
      state = JSON.parse(JSON.stringify(state));
      play(state, "p1", { action: "answer", slot: 0, question: 0, answer: "not correct" });
      assert.equal(formationView(state, "p1").slots[0].question, before);
      play(state, "p1", { action: "hint", slot: 0, question: 0 });
      if (mode !== "solo") {
        play(state, "p2", { action: "hint", slot: 0, question: 0 });
        play(state, "p2", { action: "pass" });
      }
      assert.equal(formationView(state, "p1").slots[0].hint, formationQuestionFor(state.slots[0]).hint);
      solve(state, 0);
      assert.equal(formationView(state, "p1").slots[0].question,
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
    assert.equal(formationView(state, "p1").slots[0].question, player.questions[question].text);
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
  play(solo, "p1", { action: "hint", slot: 0, question: 0 });
  assert.ok(formationView(solo, "p1").slots[0].hint);
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
