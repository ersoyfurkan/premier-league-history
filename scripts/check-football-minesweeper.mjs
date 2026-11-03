import assert from "node:assert/strict";
import { test } from "node:test";
import "./register-data.mjs";

const {
  MINESWEEPER_CELLS,
  MINESWEEPER_MINES,
  applyFootballMinesweeperAction,
  footballMinesweeperView,
  minesweeperSideOf,
  newFootballMinesweeperRoom,
} = await import("../lib/footballMinesweeper.ts");

const started = () => {
  const state = newFootballMinesweeperRoom("p1", () => 0);
  state.p2Token = "p2";
  state.phase = "playing";
  return state;
};
const act = (state, side, action, revision = state.revision) =>
  applyFootballMinesweeperAction(state, side, action, revision);

test("A room hides unrevealed mines from both players and accepts only its player tokens", () => {
  const state = started();
  assert.equal(MINESWEEPER_CELLS, 64);
  assert.equal(state.mines.length, MINESWEEPER_MINES);
  assert.equal(minesweeperSideOf(state, "p1"), "p1");
  assert.equal(minesweeperSideOf(state, "p2"), "p2");
  assert.equal(minesweeperSideOf(state, "stranger"), null);
  for (const side of ["p1", "p2"]) {
    const view = footballMinesweeperView(state, side);
    assert.equal(view.cells.length, 64);
    assert.ok(view.cells.every((cell) => cell.state === "hidden" && cell.adjacent === null));
  }
});

test("Turns alternate, safe squares score, flags protect squares, and mines cost a life", () => {
  const state = started();
  assert.equal(act(state, "p1", { action: "flag", cell: 63 }), null);
  assert.equal(act(state, "p1", { action: "reveal", cell: 63 }), "Remove the flag before opening this square.");
  assert.equal(act(state, "p1", { action: "flag", cell: 63 }), null);
  assert.equal(act(state, "p1", { action: "reveal", cell: 63 }), null);
  assert.equal(state.scores.p1, 1);
  assert.equal(state.turn, "p2");
  assert.equal(footballMinesweeperView(state, "p1").cells[63].adjacent, 0);
  assert.equal(act(state, "p2", { action: "reveal", cell: 0 }), null);
  assert.equal(state.lives.p2, 2);
  assert.equal(state.turn, "p1");
  assert.equal(footballMinesweeperView(state, "p1").cells[0].state, "mine");
});

test("The third mine ends the match, exposes the board, and rematch requires both votes", () => {
  const state = started();
  const sequence = [
    ["p1", 63], ["p2", 0], ["p1", 62], ["p2", 1], ["p1", 61], ["p2", 2],
  ];
  for (const [side, cell] of sequence) {
    assert.equal(act(state, side, { action: "reveal", cell }), null);
  }
  assert.equal(state.phase, "finished");
  assert.equal(state.winner, "p1");
  assert.equal(state.lives.p2, 0);
  assert.ok(footballMinesweeperView(state, "p1").cells.slice(0, 10).every((cell) => cell.state === "mine"));
  assert.equal(act(state, "p1", { action: "rematch" }), null);
  assert.equal(state.phase, "finished");
  assert.equal(act(state, "p2", { action: "rematch" }), null);
  assert.equal(state.phase, "playing");
  assert.equal(state.revealed.length, 0);
  assert.equal(state.scores.p1, 0);
  assert.equal(state.lives.p1, 3);
  assert.equal(state.rematch.p1, false);
  assert.equal(state.rematch.p2, false);
});

test("Stale revisions, out-of-turn moves, and invalid board cells are rejected", () => {
  const state = started();
  assert.equal(act(state, "p2", { action: "reveal", cell: 63 }), "It is your opponent’s turn.");
  assert.equal(act(state, "p1", { action: "reveal", cell: 64 }), "Choose a square on the pitch.");
  assert.equal(act(state, "p1", { action: "flag", cell: 63 }, state.revision - 1), "The game changed. Refresh the board before trying again.");
  assert.equal(state.revision, 0);
});

test("The final score is settled only after every safe square is cleared", () => {
  const state = started();
  state.mines = Array.from({ length: MINESWEEPER_MINES }, (_, index) => index);
  state.revealed = Array.from({ length: MINESWEEPER_CELLS - MINESWEEPER_MINES - 1 }, (_, index) => index + MINESWEEPER_MINES);
  state.scores = { p1: 27, p2: 26 };
  state.turn = "p1";
  assert.equal(act(state, "p1", { action: "reveal", cell: 63 }), null);
  assert.equal(state.phase, "finished");
  assert.equal(state.winner, "p1");
});
