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
      [
        ["David Beckham", "Wayne Rooney", "Paul Scholes", "Michael Carrick", "Rio Ferdinand", "Gary Neville", "Ashley Cole"],
        ["Steven Gerrard", "Michael Owen", "Robbie Fowler", "Jordan Henderson", "Trent Alexander-Arnold", "Jamie Carragher", "Peter Crouch"],
        ["Ian Wright", "Theo Walcott", "Ashley Cole", "Bukayo Saka", "Jack Wilshere", "Tony Adams"],
      ],
      [
        ["Eric Cantona", "Wayne Rooney", "David Beckham", "Paul Scholes", "Cristiano Ronaldo", "Ryan Giggs", "Andy Cole"],
        ["Sadio Mané", "Sadio Mane", "Mohamed Salah", "Steven Gerrard", "Robbie Fowler", "Jordan Henderson", "Trent Alexander-Arnold"],
        ["Dennis Bergkamp", "Thierry Henry", "Ian Wright", "Patrick Vieira", "Cesc Fàbregas", "Cesc Fabregas", "Tony Adams"],
      ],
      [
        ["Wayne Rooney", "Cristiano Ronaldo", "Andrew Cole", "Robin van Persie", "Eric Cantona", "Ruud van Nistelrooy"],
        ["Robbie Fowler", "Steven Gerrard", "Mohamed Salah", "Fernando Torres", "Luis Suárez", "Luis Suarez", "Michael Owen"],
        ["Thierry Henry", "Ian Wright", "Dennis Bergkamp", "Robin van Persie", "Pierre-Emerick Aubameyang", "Olivier Giroud"],
      ],
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

const club = (label: string, badge: string, badgeAlt = `${label} crest`): FootballClue => ({
  label,
  badge,
  badgeAlt,
});
const national = (label: string, country: string): FootballClue => ({
  label,
  badge: flag(country),
  badgeAlt: `${label.replace(" international", "")} flag`,
});

export const FOOTBALL_TIC_TAC_TOE_VARIANTS: Record<Competition, FootballTicTacToePuzzle[]> = {
  pl: [
    FOOTBALL_TIC_TAC_TOE.pl,
    {
      rows: [
        national("Spain international", "es"),
        national("France international", "fr"),
        national("Brazil international", "br"),
      ],
      columns: [
        club("Played for Chelsea", "/club-logos/chelsea.svg"),
        club("Played for Manchester City", "/club-logos/man-city.svg"),
        club("Played for Tottenham", "/club-logos/tottenham.svg"),
      ],
      answers: [
        [
          ["Juan Mata", "César Azpilicueta", "Cesc Fàbregas", "Cesc Fabregas", "Pedro", "Fernando Torres"],
          ["David Silva", "Rodri", "Ferran Torres", "Nolito", "Aymeric Laporte"],
          ["Pedro Porro", "Sergio Reguilón", "Sergio Reguilon", "Roberto Soldado"],
        ],
        [
          ["N'Golo Kanté", "N'Golo Kante", "Olivier Giroud", "Claude Makélélé", "Claude Makelele", "Nicolas Anelka", "William Gallas"],
          ["Samir Nasri", "Gaël Clichy", "Gael Clichy", "Benjamin Mendy", "Aymeric Laporte"],
          ["Hugo Lloris", "Tanguy Ndombele", "Tanguy Ndombélé", "Wilson Palacios"],
        ],
        [
          ["Willian", "Ramires", "David Luiz", "Oscar", "Thiago Silva", "Alex"],
          ["Fernandinho", "Gabriel Jesus", "Ederson", "Robinho", "Jô", "Jo"],
          ["Richarlison", "Sandro", "Emerson Royal", "Gilberto"],
        ],
      ],
    },
    {
      rows: [
        { label: "50+ Premier League goals" },
        { label: "300+ Premier League appearances" },
        { label: "50+ Premier League assists" },
      ],
      columns: [
        club("Manchester United", "/club-logos/man-utd.svg", "Manchester United crest"),
        club("Liverpool", "/club-logos/liverpool.svg"),
        club("Arsenal", "/club-logos/arsenal.svg"),
      ],
      answers: [
        [
          ["Wayne Rooney", "Ryan Giggs", "Paul Scholes", "Cristiano Ronaldo", "Marcus Rashford", "Eric Cantona", "Ruud van Nistelrooy"],
          ["Steven Gerrard", "Mohamed Salah", "Robbie Fowler", "Michael Owen", "Sadio Mané", "Fernando Torres", "Luis Suárez"],
          ["Thierry Henry", "Ian Wright", "Dennis Bergkamp", "Theo Walcott", "Robin van Persie", "Pierre-Emerick Aubameyang"],
        ],
        [
          ["Ryan Giggs", "Wayne Rooney", "Paul Scholes", "Gary Neville", "David Beckham", "Roy Keane"],
          ["Steven Gerrard", "Jamie Carragher", "Jordan Henderson", "Mohamed Salah", "Sami Hyypiä"],
          ["Tony Adams", "David Seaman", "Ray Parlour", "Thierry Henry", "Cesc Fàbregas"],
        ],
        [
          ["Ryan Giggs", "Wayne Rooney", "David Beckham", "Paul Scholes", "Bruno Fernandes"],
          ["Steven Gerrard", "Mohamed Salah", "Jordan Henderson", "James Milner", "Trent Alexander-Arnold"],
          ["Thierry Henry", "Dennis Bergkamp", "Cesc Fàbregas", "Cesc Fabregas", "Bukayo Saka", "Mesut Özil", "Mesut Ozil"],
        ],
      ],
    },
  ],
  laliga: [
    FOOTBALL_TIC_TAC_TOE.laliga,
    {
      rows: [
        national("Spanish international", "es"),
        national("Brazil international", "br"),
        national("Argentina international", "ar"),
      ],
      columns: [
        club("Played for Real Madrid", "https://a.espncdn.com/i/teamlogos/soccer/500/86.png"),
        club("Played for Barcelona", "https://a.espncdn.com/i/teamlogos/soccer/500/83.png"),
        club("Played for Atlético Madrid", "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png"),
      ],
      answers: [
        [
          ["Raúl", "Iker Casillas", "Sergio Ramos", "Xabi Alonso", "Fernando Hierro", "Dani Carvajal"],
          ["Xavi", "Andrés Iniesta", "Carles Puyol", "Sergio Busquets", "Gerard Piqué", "Gerard Pique", "Luis Enrique"],
          ["Fernando Torres", "Koke", "Gabi", "Saúl Ñíguez", "Saul Niguez", "Marcos Llorente"],
        ],
        [
          ["Roberto Carlos", "Marcelo", "Casemiro", "Vinícius Júnior", "Vinicius Junior", "Rodrygo"],
          ["Ronaldinho", "Rivaldo", "Neymar", "Dani Alves", "Raphinha", "Ronaldo"],
          ["Filipe Luís", "Filipe Luis", "João Miranda", "Joao Miranda", "Renan Lodi"],
        ],
        [
          ["Ángel Di María", "Angel Di Maria", "Gonzalo Higuaín", "Gonzalo Higuain", "Fernando Redondo", "Ángel Di Stéfano"],
          ["Lionel Messi", "Javier Mascherano", "Sergio Agüero", "Sergio Aguero", "Javier Saviola"],
          ["Sergio Agüero", "Sergio Aguero", "Ángel Correa", "Angel Correa", "Rodrigo De Paul", "Diego Simeone"],
        ],
      ],
    },
    {
      rows: [
        { label: "100+ La Liga goals" },
        { label: "300+ La Liga appearances" },
        { label: "Won La Liga" },
      ],
      columns: [
        club("Real Madrid", "https://a.espncdn.com/i/teamlogos/soccer/500/86.png"),
        club("Barcelona", "https://a.espncdn.com/i/teamlogos/soccer/500/83.png"),
        club("Atlético Madrid", "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png"),
      ],
      answers: [
        [
          ["Cristiano Ronaldo", "Karim Benzema", "Raúl", "Hugo Sánchez", "Alfredo Di Stéfano", "Santillana"],
          ["Lionel Messi", "Luis Suárez", "Samuel Eto'o", "Rivaldo", "César Rodríguez"],
          ["Antoine Griezmann", "Fernando Torres", "Luis Aragonés", "Diego Costa", "Adrián Escudero"],
        ],
        [
          ["Raúl", "Sergio Ramos", "Iker Casillas", "Karim Benzema", "Fernando Hierro"],
          ["Lionel Messi", "Xavi", "Andrés Iniesta", "Sergio Busquets", "Gerard Piqué"],
          ["Antoine Griezmann", "Koke", "Fernando Torres", "Gabi", "Raúl García"],
        ],
        [
          ["Cristiano Ronaldo", "Karim Benzema", "Raúl", "Luka Modrić", "Toni Kroos"],
          ["Lionel Messi", "Xavi", "Andrés Iniesta", "Sergio Busquets", "Ronaldinho"],
          ["Antoine Griezmann", "Fernando Torres", "Koke", "Diego Godín", "Jan Oblak"],
        ],
      ],
    },
  ],
  ucl: [
    FOOTBALL_TIC_TAC_TOE.ucl,
    {
      rows: [
        national("France international", "fr"),
        national("Brazil international", "br"),
        national("Portugal international", "pt"),
      ],
      columns: [
        club("Played for Real Madrid", "https://img.uefa.com/imgml/TP/teams/logos/70x70/50051.png"),
        club("Played for Barcelona", "https://img.uefa.com/imgml/TP/teams/logos/70x70/50080.png"),
        club("Played for Bayern Munich", "https://img.uefa.com/imgml/TP/teams/logos/70x70/50037.png"),
      ],
      answers: [
        [
          ["Karim Benzema", "Raphaël Varane", "Raphael Varane", "Kylian Mbappé", "Kylian Mbappe", "Claude Makélélé", "Claude Makelele"],
          ["Ousmane Dembélé", "Ousmane Dembele", "Jules Koundé", "Jules Kounde", "Ludovic Giuly", "Éric Abidal", "Eric Abidal"],
          ["Kingsley Coman", "Franck Ribéry", "Franck Ribery", "Lucas Hernández", "Lucas Hernandez", "Benjamin Pavard"],
        ],
        [
          ["Marcelo", "Casemiro", "Vinícius Júnior", "Vinicius Junior", "Rodrygo", "Roberto Carlos"],
          ["Ronaldinho", "Neymar", "Dani Alves", "Raphinha", "Ronaldo"],
          ["Dante", "Zé Roberto", "Ze Roberto", "Douglas Costa", "Luiz Gustavo"],
        ],
        [
          ["Cristiano Ronaldo", "Pepe", "Fábio Coentrão", "Fabio Coentrao"],
          ["Deco", "André Gomes", "Andre Gomes", "Trincão", "Trincao"],
          ["João Palhinha", "Joao Palhinha", "Renato Sanches"],
        ],
      ],
    },
    {
      rows: [
        { label: "50+ Champions League goals" },
        { label: "100+ Champions League appearances" },
        { label: "Scored in a Champions League final" },
      ],
      columns: [
        club("Real Madrid", "https://img.uefa.com/imgml/TP/teams/logos/70x70/50051.png"),
        club("Barcelona", "https://img.uefa.com/imgml/TP/teams/logos/70x70/50080.png"),
        club("Bayern Munich", "https://img.uefa.com/imgml/TP/teams/logos/70x70/50037.png"),
      ],
      answers: [
        [
          ["Cristiano Ronaldo", "Karim Benzema", "Raúl", "Kylian Mbappé", "Kylian Mbappe"],
          ["Lionel Messi", "Robert Lewandowski"],
          ["Robert Lewandowski", "Thomas Müller", "Thomas Muller"],
        ],
        [
          ["Cristiano Ronaldo", "Karim Benzema", "Raúl", "Luka Modrić", "Luka Modric", "Sergio Ramos", "Toni Kroos"],
          ["Lionel Messi", "Xavi", "Andrés Iniesta", "Andres Iniesta", "Gerard Piqué", "Gerard Pique", "Sergio Busquets"],
          ["Thomas Müller", "Thomas Muller", "Manuel Neuer", "Arjen Robben", "Franck Ribéry", "Franck Ribery"],
        ],
        [
          ["Gareth Bale", "Karim Benzema", "Sergio Ramos", "Vinícius Júnior", "Vinicius Junior"],
          ["Samuel Eto'o", "Samuel Eto’o", "Lionel Messi", "Luis Suárez", "Luis Suarez", "Neymar"],
          ["Arjen Robben", "Kingsley Coman", "Mario Mandžukić", "Mario Mandzukic", "Thomas Müller", "Thomas Muller"],
        ],
      ],
    },
  ],
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
  const variants = FOOTBALL_TIC_TAC_TOE_VARIANTS[comp];
  const puzzle = variants[Math.floor(Math.random() * variants.length)];
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
