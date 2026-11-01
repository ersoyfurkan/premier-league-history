import {
  footballTicTacToeWinner,
  isFootballTicTacToeAnswer,
  normalizeFootballPlayerName,
  type FootballTicTacToeCell,
} from "@/data/footballTicTacToe";
import { other, parseComp, type Competition, type Side } from "@/lib/gameRoom";

export type FootballTicTacToeRoomState = {
  comp: Competition;
  p1Token: string;
  p2Token: string | null;
  status: "waiting" | "playing" | "finished";
  turn: Side;
  board: (FootballTicTacToeCell | null)[];
  winner: Side | null;
};

export type FootballTicTacToeRoomView = Omit<FootballTicTacToeRoomState, "p1Token" | "p2Token"> & {
  you: Side;
};

export function newFootballTicTacToeRoom(token: string, comp: Competition): FootballTicTacToeRoomState {
  return {
    comp,
    p1Token: token,
    p2Token: null,
    status: "waiting",
    turn: "p1",
    board: Array(9).fill(null),
    winner: null,
  };
}

export function footballTicTacToeSideOf(state: FootballTicTacToeRoomState, token: string): Side | null {
  if (token === state.p1Token) return "p1";
  if (state.p2Token && token === state.p2Token) return "p2";
  return null;
}

export function footballTicTacToeView(
  state: FootballTicTacToeRoomState,
  you: Side,
): FootballTicTacToeRoomView {
  return {
    comp: state.comp,
    status: state.status,
    turn: state.turn,
    board: state.board,
    winner: state.winner,
    you,
  };
}

export function applyFootballTicTacToeMove(
  state: FootballTicTacToeRoomState,
  side: Side,
  cell: number,
  player: string,
): string | null {
  if (state.status !== "playing") return "The game is not in progress";
  if (state.turn !== side) return "It is your opponent's turn";
  if (!Number.isInteger(cell) || cell < 0 || cell > 8 || state.board[cell]) return "Choose an empty square";
  if (typeof player !== "string" || player.trim().length < 2 || player.trim().length > 80) {
    return "Enter a valid player name";
  }
  if (!isFootballTicTacToeAnswer(state.comp, cell, player)) {
    return "That player does not match both clues. Try another name.";
  }

  const normalizedPlayer = normalizeFootballPlayerName(player);
  if (state.board.some((entry) => entry && normalizeFootballPlayerName(entry.player) === normalizedPlayer)) {
    return "That player has already been used";
  }

  state.board[cell] = { side, player: player.trim() };
  const winner = footballTicTacToeWinner(state.board);
  if (winner) {
    state.status = "finished";
    state.winner = winner;
  } else if (state.board.every(Boolean)) {
    state.status = "finished";
  } else {
    state.turn = other(side);
  }
  return null;
}

export const parseFootballTicTacToeComp = (value: unknown) => parseComp(value);
