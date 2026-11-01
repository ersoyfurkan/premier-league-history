import type { Competition } from "@/lib/gameRoom";

export type FootballTicTacToeCell = {
  player: string;
  side: "p1" | "p2";
};

export type FootballClue = {
  label: string;
  badge?: string;
  badgeAlt?: string;
};

export type FootballTicTacToePuzzle = {
  rows: [FootballClue, FootballClue, FootballClue];
  columns: [FootballClue, FootballClue, FootballClue];
  answers: string[][][];
};

const flag = (country: string) => `https://flagcdn.com/w40/${country}.png`;

export const FOOTBALL_TIC_TAC_TOE: Record<Competition, FootballTicTacToePuzzle> = {
  pl: {
    rows: [
      { label: "England international", badge: flag("gb-eng"), badgeAlt: "England flag" },
      { label: "Premier League winner" },
      { label: "100+ Premier League goals" },
    ],
    columns: [
      { label: "Played for Manchester United", badge: "/club-logos/man-utd.svg", badgeAlt: "Manchester United crest" },
      { label: "Played for Liverpool", badge: "/club-logos/liverpool.svg", badgeAlt: "Liverpool crest" },
      { label: "Played for Arsenal", badge: "/club-logos/arsenal.svg", badgeAlt: "Arsenal crest" },
    ],
    answers: [
      [["David Beckham"], ["Steven Gerrard"], ["Ian Wright"]],
      [["Eric Cantona"], ["Sadio Mané", "Sadio Mane"], ["Dennis Bergkamp"]],
      [["Wayne Rooney"], ["Robbie Fowler"], ["Thierry Henry"]],
    ],
  },
  laliga: {
    rows: [
      { label: "Spanish international", badge: flag("es"), badgeAlt: "Spain flag" },
      { label: "La Liga winner" },
      { label: "100+ La Liga goals" },
    ],
    columns: [
      { label: "Played for Real Madrid", badge: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png", badgeAlt: "Real Madrid crest" },
      { label: "Played for Barcelona", badge: "https://a.espncdn.com/i/teamlogos/soccer/500/83.png", badgeAlt: "Barcelona crest" },
      { label: "Played for Atlético Madrid", badge: "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png", badgeAlt: "Atlético Madrid crest" },
    ],
    answers: [
      [["Raúl", "Raul"], ["Xavi"], ["Fernando Torres"]],
      [["Cristiano Ronaldo"], ["Ronaldinho"], ["Diego Costa"]],
      [["Karim Benzema"], ["Lionel Messi"], ["Antoine Griezmann"]],
    ],
  },
  ucl: {
    rows: [
      { label: "France international", badge: flag("fr"), badgeAlt: "France flag" },
      { label: "Scored in a Champions League final" },
      { label: "100+ Champions League appearances" },
    ],
    columns: [
      { label: "Played for Real Madrid", badge: "https://img.uefa.com/imgml/TP/teams/logos/70x70/50051.png", badgeAlt: "Real Madrid crest" },
      { label: "Played for Barcelona", badge: "https://img.uefa.com/imgml/TP/teams/logos/70x70/50080.png", badgeAlt: "Barcelona crest" },
      { label: "Played for Bayern Munich", badge: "https://img.uefa.com/imgml/TP/teams/logos/70x70/50037.png", badgeAlt: "Bayern Munich crest" },
    ],
    answers: [
      [["Karim Benzema", "Raphaël Varane", "Raphael Varane"], ["Ousmane Dembélé", "Ousmane Dembele"], ["Kingsley Coman", "Franck Ribéry", "Franck Ribery"]],
      [["Gareth Bale"], ["Samuel Eto'o", "Samuel Eto’o"], ["Arjen Robben"]],
      [["Luka Modrić", "Luka Modric"], ["Gerard Piqué", "Gerard Pique"], ["Manuel Neuer"]],
    ],
  },
};

function shuffledIndexes() {
  const indexes = [0, 1, 2];
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }
  return indexes;
}

export function randomFootballTicTacToePuzzle(comp: Competition): FootballTicTacToePuzzle {
  const puzzle = FOOTBALL_TIC_TAC_TOE[comp];
  const rowOrder = shuffledIndexes();
  const columnOrder = shuffledIndexes();
  return {
    rows: rowOrder.map((index) => puzzle.rows[index]) as FootballTicTacToePuzzle["rows"],
    columns: columnOrder.map((index) => puzzle.columns[index]) as FootballTicTacToePuzzle["columns"],
    answers: rowOrder.map((row) =>
      columnOrder.map((column) => puzzle.answers[row][column]),
    ),
  };
}

export function normalizeFootballPlayerName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

export function isFootballTicTacToeAnswer(
  comp: Competition,
  cell: number,
  guess: string,
  puzzle: FootballTicTacToePuzzle = FOOTBALL_TIC_TAC_TOE[comp],
) {
  if (!Number.isInteger(cell) || cell < 0 || cell > 8) return false;
  const row = Math.floor(cell / 3);
  const column = cell % 3;
  const normalizedGuess = normalizeFootballPlayerName(guess);
  return puzzle.answers[row][column].some(
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
