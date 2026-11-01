import type { Competition } from "@/lib/gameRoom";

export type FootballTicTacToeCell = {
  player: string;
  side: "p1" | "p2";
};

export type FootballTicTacToePuzzle = {
  rows: [string, string, string];
  columns: [string, string, string];
  answers: string[][][];
};

export const FOOTBALL_TIC_TAC_TOE: Record<Competition, FootballTicTacToePuzzle> = {
  pl: {
    rows: ["England international", "Premier League winner", "100+ Premier League goals"],
    columns: ["Played for Manchester United", "Played for Liverpool", "Played for Arsenal"],
    answers: [
      [["David Beckham"], ["Steven Gerrard"], ["Ian Wright"]],
      [["Eric Cantona"], ["Sadio Mané", "Sadio Mane"], ["Dennis Bergkamp"]],
      [["Wayne Rooney"], ["Robbie Fowler"], ["Thierry Henry"]],
    ],
  },
  laliga: {
    rows: ["Spanish international", "La Liga winner", "100+ La Liga goals"],
    columns: ["Played for Real Madrid", "Played for Barcelona", "Played for Atlético Madrid"],
    answers: [
      [["Raúl", "Raul"], ["Xavi"], ["Fernando Torres"]],
      [["Cristiano Ronaldo"], ["Ronaldinho"], ["Diego Costa"]],
      [["Karim Benzema"], ["Lionel Messi"], ["Antoine Griezmann"]],
    ],
  },
  ucl: {
    rows: ["Won the Champions League", "Scored in a Champions League final", "100+ Champions League appearances"],
    columns: ["Played for Real Madrid", "Played for Barcelona", "Played for Bayern Munich"],
    answers: [
      [["Cristiano Ronaldo"], ["Lionel Messi"], ["Thomas Müller", "Thomas Muller"]],
      [["Gareth Bale"], ["Samuel Eto'o", "Samuel Eto’o"], ["Arjen Robben"]],
      [["Luka Modrić", "Luka Modric"], ["Gerard Piqué", "Gerard Pique"], ["Manuel Neuer"]],
    ],
  },
};

export function normalizeFootballPlayerName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

export function isFootballTicTacToeAnswer(comp: Competition, cell: number, guess: string) {
  if (!Number.isInteger(cell) || cell < 0 || cell > 8) return false;
  const row = Math.floor(cell / 3);
  const column = cell % 3;
  const normalizedGuess = normalizeFootballPlayerName(guess);
  return FOOTBALL_TIC_TAC_TOE[comp].answers[row][column].some(
    (answer) => normalizeFootballPlayerName(answer) === normalizedGuess,
  );
}

export function footballTicTacToeWinner(board: (FootballTicTacToeCell | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a].side === board[b]?.side && board[a].side === board[c]?.side) {
      return board[a].side;
    }
  }
  return null;
}
