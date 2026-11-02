import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { registerHooks } from "node:module";
import { test } from "node:test";
import "./register-data.mjs";

const {
  BATTLESHIP_SIZE, BATTLESHIP_SHIP_SIZES, battleshipShipCells, validBattleshipPlacement,
  newBattleshipGame, joinBattleshipGame, applyBattleshipAction, battleshipView, battleshipSideOf,
} = await import("../lib/footballBattleship.ts");
const { BATTLESHIP_BOARDS, BATTLESHIP_LEGACY_VARIANTS, battleshipAnswer, battleshipClues, battleshipPlayerKey: awardPlayerKey } =
  await import("../data/footballBattleship.ts");
const { COMPETITION_LABELS } = await import("../lib/competitions.ts");
const prepared = JSON.parse(readFileSync(new URL("../data/quizFootball.generated.json", import.meta.url), "utf8"));
const snapshot = JSON.parse(readFileSync(new URL("../data/footballBattleship.generated.json", import.meta.url), "utf8"));
const fleet = [
  { size: 2, start: 0, vertical: false },
  { size: 3, start: 8, vertical: false },
  { size: 4, start: 16, vertical: false },
];
const expected = (state) => ({ gameId: state.gameId, revision: state.revision });
const play = (state, side, action) => applyBattleshipAction(state, side, action, expected(state));
const answerFor = (state, cell) => {
  const row = state.board.rows[Math.floor(cell / 8)];
  const column = state.board.columns[cell % 8];
  return snapshot.names[BATTLESHIP_BOARDS[state.comp][state.board.variant].answers[row * 8 + column][0]];
};
const ready = (comp = "general") => {
  const state = newBattleshipGame(comp, "creator");
  assert.equal(play(state, "p1", { action: "place", ships: fleet }), null);
  assert.equal(state.phase, "waiting");
  assert.equal(joinBattleshipGame(state, "guest"), null);
  assert.equal(play(state, "p2", { action: "place", ships: fleet }), null);
  assert.equal(state.phase, "playing");
  return state;
};

test("All eleven scopes have mixed single-category 8x8 boards, unique clubs/nations, visuals and verified answers in every square", () => {
  assert.equal(BATTLESHIP_SIZE, 8);
  assert.deepEqual(BATTLESHIP_SHIP_SIZES, [2, 3, 4]);
  assert.deepEqual(Object.keys(BATTLESHIP_BOARDS).sort(), Object.keys(COMPETITION_LABELS).sort());
  for (const [comp, variants] of Object.entries(BATTLESHIP_BOARDS)) {
    const source = prepared.competitions[comp];
    const byClue = new Map([...source.pool, ...source.nations].map(({ clue, members }) => [clue.label, new Set(members.map((index) =>
      awardPlayerKey(prepared.records[source.facts[index]].name),
    ))]));
    const scoped = new Set(source.facts.map((id) => awardPlayerKey(prepared.records[id].name)));
    assert.ok(variants.length >= BATTLESHIP_LEGACY_VARIANTS + 8);
    const kinds = new Set();
    let hasBallon = false;
    for (const [variant, board] of variants.entries()) {
      const legacy = variant < BATTLESHIP_LEGACY_VARIANTS;
      assert.equal(board.rows.length, 8);
      assert.equal(board.columns.length, 8);
      assert.equal(board.answers.length, 64);
      assert.equal(new Set([...board.rows, ...board.columns].map(({ id }) => id)).size, 16);
      if (!legacy) {
        const clues = [...board.rows, ...board.columns];
        assert.equal(new Set(clues.map((clue) => clue.identity)).size, 16, `${comp}: repeated identity`);
        assert.ok(new Set(clues.map((clue) => clue.kind)).size >= 4);
        assert.ok(clues.some((clue) => clue.kind === "club"));
        assert.ok(clues.some((clue) => clue.kind === "nation"));
        for (const clue of clues) {
          assert.doesNotMatch(clue.label, /\b(?:OR|AND)\b|\s\+\s/);
          kinds.add(clue.kind);
          if (clue.kind === "club" || clue.kind === "nation") assert.ok(clue.badge, `${comp}: missing logo ${clue.label}`);
          if (clue.kind === "award") assert.equal(clue.awardIds.length, 1);
          if (clue.awardIds?.includes("ballon")) hasBallon = true;
        }
      }
      const matches = (clue, key) => clue.id.slice(comp.length + 1).split("|").some((id) => byClue.get(id)?.has(key));
      for (let cell = 0; cell < 64; cell += 1) {
        const keys = board.answers[cell].map((id) => awardPlayerKey(snapshot.names[id]));
        assert.ok(keys.length >= (legacy ? 3 : 1), `${comp} ${cell}`);
        assert.equal(new Set(keys).size, keys.length);
        for (const key of keys) {
          assert.ok(scoped.has(key), `${comp}: scope leaked ${key}`);
          assert.ok(matches(board.rows[Math.floor(cell / 8)], key), `${comp}: row mismatch ${key}`);
          assert.ok(matches(board.columns[cell % 8], key), `${comp}: column mismatch ${key}`);
        }
      }
    }
    assert.deepEqual([...kinds].sort(), ["award", "club", "manager", "nation", "teammate", "trophy"]);
    assert.ok(hasBallon, `${comp}: no Ballon d'Or category`);
    const boards = new Set();
    for (let iteration = 0; iteration < 20; iteration += 1) {
      const state = newBattleshipGame(comp, "creator");
      assert.ok(state.board.variant >= BATTLESHIP_LEGACY_VARIANTS, "New games must never select legacy OR boards");
      const view = battleshipClues(comp, state.board);
      assert.equal(new Set(state.board.rows).size, 8);
      assert.equal(new Set(state.board.columns).size, 8);
      assert.equal(view.rows.length, 8);
      boards.add(JSON.stringify(state.board));
      for (let cell = 0; cell < 64; cell += 1) {
        const answer = answerFor(state, cell);
        assert.equal(battleshipAnswer(comp, state.board, cell, ` ${answer.toUpperCase()} `), answer);
      }
    }
    assert.ok(boards.size > 1, `${comp}: no board variety`);
  }
});

test("Saved rooms using original variant indices still resolve the same clues and answers", () => {
  const legacy = Object.fromEntries(Object.entries(snapshot.competitions).map(([comp, boards]) => [
    comp, boards.slice(0, BATTLESHIP_LEGACY_VARIANTS).map((board) => ({
      ...board, answers: board.answers.map((answers) => answers.map((id) => snapshot.names[id])),
    })),
  ]));
  assert.equal(createHash("sha256").update(JSON.stringify(legacy)).digest("hex"),
    "b007cdd1ba99291445cba20a024aa3d65170e5894e8067d9f3ab4cdccbb34ffb");
  for (const comp of Object.keys(COMPETITION_LABELS)) {
    const state = newBattleshipGame(comp, "creator");
    state.board = { variant: 0, rows: [0, 1, 2, 3, 4, 5, 6, 7], columns: [0, 1, 2, 3, 4, 5, 6, 7] };
    const view = battleshipView(state, "p1");
    assert.deepEqual(view.rows, snapshot.competitions[comp][0].rows);
    for (let cell = 0; cell < 64; cell += 1) {
      assert.equal(battleshipAnswer(comp, state.board, cell, answerFor(state, cell)), answerFor(state, cell));
    }
  }
});

test("Placement is atomic, straight, in bounds, exactly one size 2/3/4, no overlaps; touching is allowed", () => {
  assert.equal(validBattleshipPlacement(fleet), true);
  assert.deepEqual(battleshipShipCells({ size: 4, start: 39, vertical: true }), [39, 47, 55, 63]);
  assert.deepEqual(battleshipShipCells({ size: 4, start: 60, vertical: false }), [60, 61, 62, 63]);
  for (const invalid of [
    null, {}, [], fleet.slice(1), [...fleet, fleet[0]],
    [fleet[0], fleet[0], fleet[2]],
    [{ size: 2, start: 7, vertical: false }, ...fleet.slice(1)],
    [{ size: 2, start: 56, vertical: true }, ...fleet.slice(1)],
    [{ size: 2, start: -1, vertical: false }, ...fleet.slice(1)],
    [{ size: 2, start: 0.5, vertical: false }, ...fleet.slice(1)],
    [{ size: 2, start: 64, vertical: false }, ...fleet.slice(1)],
    [{ size: 2, start: 0, vertical: "false" }, ...fleet.slice(1)],
    [{ size: 5, start: 0, vertical: false }, ...fleet.slice(1)],
    [fleet[0], { size: 3, start: 1, vertical: true }, fleet[2]],
    [null, ...fleet.slice(1)],
  ]) {
    assert.equal(validBattleshipPlacement(invalid), false, JSON.stringify(invalid));
    const state = newBattleshipGame("general", "creator");
    const before = JSON.stringify(state);
    assert.ok(play(state, "p1", { action: "place", ships: invalid }));
    assert.equal(JSON.stringify(state), before);
  }
  const state = ready();
  assert.ok(play(state, "p1", { action: "place", ships: fleet }));
});

test("Wrong answers pass the turn without inspecting, exposing, or consuming the square", () => {
  const first = ready();
  const second = structuredClone(first);
  second.ships.p2 = fleet.map((ship) => ({ ...ship, start: ship.start + 4 }));
  first.turn = second.turn = "p1";
  const before = battleshipView(first, "p1");
  assert.equal(play(first, "p1", { action: "attack", cell: 0, answer: "not a footballer" }), null);
  assert.equal(play(second, "p1", { action: "attack", cell: 0, answer: "not a footballer" }), null);
  assert.deepEqual(battleshipView(first, "p1"), battleshipView(second, "p1"));
  assert.equal(first.turn, "p2");
  assert.equal(first.shots.length, 0);
  assert.equal(first.revision, before.revision + 1);
  assert.equal(play(first, "p2", { action: "attack", cell: 63, answer: "wrong" }), null);
  assert.equal(play(first, "p1", { action: "attack", cell: 0, answer: answerFor(first, 0) }), null);
  assert.equal(first.shots[0].hit, true);
  assert.equal(first.turn, "p1");
});

test("Valid shots resolve hit, miss, sinking and all-nine victory; repeat shots and out-of-turn actions are rejected", () => {
  const state = ready();
  const attacker = state.turn;
  const defender = attacker === "p1" ? "p2" : "p1";
  assert.ok(play(state, defender, { action: "attack", cell: 0, answer: answerFor(state, 0) }));
  for (const cell of [0, 1, 8, 9, 10, 16, 17, 18, 19]) {
    assert.equal(play(state, attacker, { action: "attack", cell, answer: answerFor(state, cell) }), null);
    assert.equal(state.turn, attacker);
    assert.equal(state.shots.at(-1).hit, true);
    assert.ok(play(state, attacker, { action: "attack", cell, answer: answerFor(state, cell) }));
  }
  assert.equal(state.phase, "finished");
  assert.equal(state.winner, attacker);
  assert.deepEqual(state.shots.filter(({ sunk }) => sunk).map(({ sunk }) => sunk), [2, 3, 4]);
  assert.deepEqual(battleshipView(state, attacker).opponentShips, fleet);
  assert.ok(play(state, attacker, { action: "attack", cell: 63, answer: answerFor(state, 63) }));
  const miss = ready();
  const side = miss.turn;
  assert.equal(play(miss, side, { action: "attack", cell: 63, answer: answerFor(miss, 63) }), null);
  assert.equal(miss.shots[0].hit, false);
  assert.notEqual(miss.turn, side);
});

test("A footballer may be reused on different matching squares, with canonical spelling in shots", () => {
  const state = ready();
  const cellsByPlayer = new Map();
  let pair;
  for (let cell = 0; cell < 64 && !pair; cell += 1) {
    const row = state.board.rows[Math.floor(cell / 8)];
    const column = state.board.columns[cell % 8];
    for (const id of BATTLESHIP_BOARDS[state.comp][state.board.variant].answers[row * 8 + column]) {
      if (cellsByPlayer.has(id)) { pair = [cellsByPlayer.get(id), cell, snapshot.names[id]]; break; }
      cellsByPlayer.set(id, cell);
    }
  }
  assert.ok(pair);
  const side = state.turn;
  for (const cell of pair.slice(0, 2)) {
    if (state.turn !== side) assert.equal(play(state, state.turn, { action: "attack", cell: 62, answer: "wrong" }), null);
    assert.equal(play(state, side, { action: "attack", cell, answer: pair[2].toUpperCase() }), null);
    assert.equal(state.shots.at(-1).player, pair[2]);
  }
});

test("Views conceal opponent fleets, tokens and answer banks in every pre-finish phase; rematch resets setup only after both votes", () => {
  const waiting = newBattleshipGame("copa", "creator");
  assert.equal(battleshipSideOf(waiting, ""), null);
  assert.equal(battleshipSideOf(waiting, "outsider"), null);
  assert.equal(battleshipSideOf(waiting, "creator"), "p1");
  assert.deepEqual(battleshipView(waiting, "p1").ownShips, []);
  const state = ready("copa");
  assert.equal(battleshipSideOf(state, "guest"), "p2");
  assert.ok(joinBattleshipGame(state, "third"));
  const view = battleshipView(state, "p1");
  assert.equal(view.opponentShips, null);
  assert.equal(view.youReady, true);
  assert.equal(view.opponentReady, true);
  assert.doesNotMatch(JSON.stringify(view), /creator|guest|"answers"|"board"|"p1Token"|"p2Token"|"deadline"/);
  assert.ok(play(state, "p1", { action: "rematch" }));
  const old = expected(state);
  state.phase = "finished";
  state.winner = "p1";
  assert.equal(play(state, "p1", { action: "rematch" }), null);
  assert.equal(state.phase, "finished");
  assert.ok(play(state, "p1", { action: "rematch" }));
  assert.equal(play(state, "p2", { action: "rematch" }), null);
  assert.equal(state.phase, "placing");
  assert.notEqual(state.gameId, old.gameId);
  assert.deepEqual(state.ships, { p1: null, p2: null });
  assert.deepEqual(state.shots, []);
  assert.deepEqual(state.rematch, { p1: false, p2: false });
  assert.equal(state.winner, null);
  assert.equal(state.p1Token, "creator");
  assert.equal(state.p2Token, "guest");
  assert.equal(battleshipView(state, "p1").opponentShips, null);
  const unchanged = JSON.stringify(state);
  assert.ok(applyBattleshipAction(state, "p1", { action: "place", ships: fleet }, old));
  assert.equal(JSON.stringify(state), unchanged);
});

const rows = new Map();
let missingTable = false;
let failNextWrite = false;
const db = {
  prepare(sql) {
    if (missingTable) throw new Error("D1_ERROR: no such table: football_battleship_rooms");
    return {
      bind(...values) {
        return {
          async first() {
            const row = rows.get(values[0]);
            return row && row.updated_at >= values[1] ? { ...row } : null;
          },
          async run() {
            if (sql.startsWith("DELETE")) {
              let changes = 0;
              for (const [code, row] of rows) if (row.updated_at < values[0]) { rows.delete(code); changes += 1; }
              return { meta: { changes } };
            }
            if (sql.startsWith("INSERT")) {
              const [code, state, updated_at] = values;
              if (rows.has(code)) throw new Error("UNIQUE constraint failed: football_battleship_rooms.code");
              rows.set(code, { state, version: 0, updated_at });
              return { meta: { changes: 1 } };
            }
            const [state, updated_at, code, version] = values;
            const row = rows.get(code);
            if (failNextWrite) { failNextWrite = false; return { meta: { changes: 0 } }; }
            if (!row || row.version !== version) return { meta: { changes: 0 } };
            rows.set(code, { state, version: version + 1, updated_at });
            return { meta: { changes: 1 } };
          },
        };
      },
    };
  },
};
globalThis.__battleshipTestEnv = { DB: db };
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "@opennextjs/cloudflare") {
      return { url: "data:text/javascript,export const getCloudflareContext=()=>({env:globalThis.__battleshipTestEnv})", shortCircuit: true };
    }
    return next(specifier === "next/server" ? "next/server.js" : specifier, context);
  },
});
const { NextRequest } = await import("next/server.js");
const { GET, POST } = await import("../app/api/game/football-battleship/route.ts");
const api = async (body) => {
  const response = await POST(new NextRequest("http://localhost/api/game/football-battleship", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  }));
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  return { status: response.status, ...await response.json() };
};
const getApi = async (code, token) => {
  const response = await GET(new NextRequest(`http://localhost/api/game/football-battleship?code=${code}&token=${token}`));
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  return { status: response.status, ...await response.json() };
};
const current = (code) => JSON.parse(rows.get(code).state);
const mutation = (created, token, action) => ({ code: created.code, token, ...expected(current(created.code)), ...action });
const online = async (comp = "general") => {
  const created = await api({ action: "create", comp });
  const joined = await api({ action: "join", code: created.code });
  assert.equal((await api(mutation(created, created.token, { action: "place", ships: fleet }))).status, 200);
  assert.equal((await api(mutation(created, joined.token, { action: "place", ships: fleet }))).status, 200);
  return { ...created, tokens: { p1: created.token, p2: joined.token } };
};

test("Actual route creates and joins all scopes, validates authentication and malformed actions, and never returns banks or opponent placement", async () => {
  for (const comp of Object.keys(COMPETITION_LABELS)) {
    const created = await api({ action: "create", comp });
    assert.equal(created.status, 200);
    assert.match(created.code, /^[A-HJ-NP-Z2-9]{6}$/);
    assert.match(created.token, /^[0-9a-f-]{36}$/);
    assert.equal(created.view.comp, comp);
    assert.equal(created.view.phase, "waiting");
    const placed = await api(mutation(created, created.token, { action: "place", ships: fleet }));
    assert.equal(placed.status, 200);
    assert.equal(placed.view.phase, "waiting");
    const joined = await api({ action: "join", code: created.code.toLowerCase() });
    assert.equal(joined.status, 200);
    assert.notEqual(joined.token, created.token);
    assert.equal(joined.view.phase, "placing");
    assert.equal(joined.view.opponentReady, true);
    assert.equal(joined.view.opponentShips, null);
    assert.doesNotMatch(JSON.stringify(joined.view), /"answers"|"p1Token"|"p2Token"|"board"/);
    assert.equal((await api({ action: "join", code: created.code })).status, 409);
    assert.equal((await getApi(created.code, "outsider")).status, 403);
    assert.equal((await getApi(created.code, created.token)).view.you, "p1");
    assert.equal((await api({ action: "place", code: created.code, token: "outsider", ships: fleet })).status, 403);
    for (const malformed of [
      { action: "place", ships: [] }, { action: "attack", cell: 64, answer: "Lionel Messi" },
      { action: "attack", cell: "0", answer: "Lionel Messi" },
      { action: "attack", cell: 0, answer: "" }, { action: "attack", cell: 0, answer: "a".repeat(101) },
      { action: "unknown" }, { action: "rematch", revision: "0" }, { action: "rematch", gameId: null },
    ]) assert.equal((await api(mutation(created, created.token, malformed))).status, 400);
    assert.equal((await api({ code: created.code, token: created.token, action: "rematch" })).status, 400);
  }
  assert.equal((await api({ action: "create", comp: "__proto__" })).status, 400);
  assert.equal((await api({ action: "create", comp: "unsupported" })).status, 400);
  assert.equal((await api(null)).status, 400);
  assert.equal((await api([])).status, 400);
  assert.equal((await api({ action: "join", code: "IIIIII" })).status, 400);
  assert.equal((await getApi("AAAAAA", "outsider")).status, 404);
  const badJson = await POST(new NextRequest("http://localhost/api/game/football-battleship", { method: "POST", body: "{" }));
  assert.equal(badJson.status, 400);
});

test("Real route conditional writes resolve simultaneous setup, joins and attacks once; stale actions have no effect", async () => {
  const created = await api({ action: "create", comp: "copa" });
  const joins = await Promise.all([api({ action: "join", code: created.code }), api({ action: "join", code: created.code })]);
  assert.deepEqual(joins.map(({ status }) => status).sort(), [200, 409]);
  const guest = joins.find(({ status }) => status === 200).token;
  const setup = expected(current(created.code));
  const placements = await Promise.all([created.token, guest].map((token) =>
    api({ action: "place", code: created.code, token, ships: fleet, ...setup }),
  ));
  assert.deepEqual(placements.map(({ status }) => status).sort(), [200, 409]);
  const notReady = current(created.code).ships.p1 ? guest : created.token;
  assert.equal((await api(mutation(created, notReady, { action: "place", ships: fleet }))).status, 200);
  const state = current(created.code);
  const attacker = state.turn === "p1" ? created.token : guest;
  const request = mutation(created, attacker, { action: "attack", cell: 0, answer: answerFor(state, 0) });
  const attacks = await Promise.all([api(request), api(request)]);
  assert.deepEqual(attacks.map(({ status }) => status).sort(), [200, 409]);
  assert.equal(current(created.code).shots.length, 1);
  const unchanged = rows.get(created.code).state;
  assert.equal((await api(request)).status, 409);
  assert.equal(rows.get(created.code).state, unchanged);
  assert.equal((await api({ ...request, ...expected(current(created.code)), gameId: "old-game" })).status, 409);
  failNextWrite = true;
  const conflict = await api(mutation(created, attacker, { action: "attack", cell: 1, answer: answerFor(state, 1) }));
  assert.equal(conflict.status, 409);
  assert.equal(conflict.view.opponentShips, null);
  assert.equal(rows.get(created.code).state, unchanged);
});

test("Real API wrong/miss/hit turn rules, complete victory, finished fleet disclosure, bilateral rematch and old-game rejection", async () => {
  const room = await online("euros");
  let state = current(room.code);
  const attacker = state.turn;
  const defender = attacker === "p1" ? "p2" : "p1";
  const wrong = await api(mutation(room, room.tokens[attacker], { action: "attack", cell: 0, answer: "wrong" }));
  assert.equal(wrong.status, 200);
  assert.equal(wrong.view.turn, defender);
  assert.deepEqual(wrong.view.shots, []);
  assert.equal(wrong.view.opponentShips, null);
  state = current(room.code);
  const missed = await api(mutation(room, room.tokens[defender], { action: "attack", cell: 63, answer: answerFor(state, 63) }));
  assert.equal(missed.view.turn, attacker);
  assert.equal(missed.view.shots.at(-1).hit, false);
  for (const cell of fleet.flatMap(battleshipShipCells)) {
    state = current(room.code);
    const response = await api(mutation(room, room.tokens[attacker], { action: "attack", cell, answer: answerFor(state, cell) }));
    assert.equal(response.status, 200);
    assert.equal(response.view.shots.at(-1).hit, true);
  }
  const finished = await getApi(room.code, room.tokens[defender]);
  assert.equal(finished.view.winner, attacker);
  assert.equal(finished.view.phase, "finished");
  assert.deepEqual(finished.view.opponentShips, fleet);
  const before = current(room.code);
  const rematch = { action: "rematch", code: room.code, ...expected(before) };
  const votes = await Promise.all(Object.values(room.tokens).map((token) => api({ ...rematch, token })));
  assert.deepEqual(votes.map(({ status }) => status).sort(), [200, 409]);
  const secondSide = current(room.code).rematch.p1 ? "p2" : "p1";
  const reset = await api(mutation(room, room.tokens[secondSide], { action: "rematch" }));
  assert.equal(reset.view.phase, "placing");
  assert.notEqual(reset.view.gameId, before.gameId);
  assert.equal(reset.view.opponentShips, null);
  assert.deepEqual(reset.view.ownShips, []);
  assert.deepEqual(reset.view.shots, []);
  assert.equal((await getApi(room.code, room.tokens.p1)).status, 200);
  assert.equal((await getApi(room.code, room.tokens.p2)).status, 200);
  const stale = await api({ ...mutation(room, room.tokens.p1, { action: "place", ships: fleet }), gameId: before.gameId });
  assert.equal(stale.status, 409);
  assert.deepEqual(stale.view.ownShips, []);
});

test("Rooms expire after 24 hours, create cleans them up, and missing migrations yield explicit no-store errors", async () => {
  const created = await api({ action: "create", comp: "pl" });
  rows.get(created.code).updated_at = Date.now() - 24 * 60 * 60 * 1000 - 1;
  assert.equal((await getApi(created.code, created.token)).status, 404);
  assert.equal((await api({ action: "join", code: created.code })).status, 404);
  await api({ action: "create", comp: "general" });
  assert.equal(rows.has(created.code), false);
  const previous = console.error;
  console.error = () => {};
  missingTable = true;
  try {
    const response = await api({ action: "create", comp: "pl" });
    assert.equal(response.status, 500);
    assert.match(response.error, /D1 database migration/);
  } finally {
    missingTable = false;
    console.error = previous;
  }
});
