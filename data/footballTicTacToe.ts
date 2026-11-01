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

type Fact = { name: string; nat: string[]; clubs: string[]; tags: string[] };
type Def = { clue: FootballClue; test: (fact: Fact) => boolean };

const flag = (country: string) => `https://flagcdn.com/w40/${country}.png`;

// name | nationalities | clubs | tags. Stat tags are career totals in the competition
// (every club combined), so a player counts for any club they played for.
const f = (name: string, nat: string, clubs: string, tags = ""): Fact => {
  const list = tags ? tags.split(" ") : [];
  if (list.includes("g100") && !list.includes("g50")) list.push("g50");
  return { name, nat: nat.split(" "), clubs: clubs.split(" "), tags: list };
};

// PL tags: won (title), g100, g50, a300, as50 (assists)
const PL_FACTS: Fact[] = [
  f("Wayne Rooney", "eng", "mun", "won g100 a300 as50"),
  f("Cristiano Ronaldo", "por", "mun", "won g50"),
  f("Ryan Giggs", "wal", "mun", "won g100 a300 as50"),
  f("Paul Scholes", "eng", "mun", "won g100 a300 as50"),
  f("Eric Cantona", "fra", "mun", "won g50"),
  f("Andy Cole", "eng", "mun ars mci", "won g100 a300"),
  f("Andrew Cole", "eng", "mun ars mci", "won g100 a300"),
  f("Ruud van Nistelrooy", "ned", "mun", "won g50"),
  f("Robin van Persie", "ned", "ars mun", "won g100"),
  f("David Beckham", "eng", "mun", "won g50 as50"),
  f("Gary Neville", "eng", "mun", "won a300"),
  f("Roy Keane", "irl", "mun", "won a300"),
  f("Rio Ferdinand", "eng", "mun", "won a300"),
  f("Michael Carrick", "eng", "mun tot", "won a300"),
  f("Marcus Rashford", "eng", "mun", "g50"),
  f("Bruno Fernandes", "por", "mun", "g50 as50"),
  f("Anthony Martial", "fra", "mun", "g50"),
  f("Paul Pogba", "fra", "mun"),
  f("Juan Mata", "esp", "che mun", "as50"),
  f("Ashley Cole", "eng", "ars che", "won a300 as50"),
  f("Steven Gerrard", "eng", "liv", "g100 a300 as50"),
  f("Michael Owen", "eng", "liv mun", "won g100"),
  f("Robbie Fowler", "eng", "liv mci", "g100 a300"),
  f("Jamie Carragher", "eng", "liv", "a300"),
  f("Jordan Henderson", "eng", "liv", "won a300"),
  f("Trent Alexander-Arnold", "eng", "liv", "won as50"),
  f("Mohamed Salah", "egy", "liv che", "won g100 a300 as50"),
  f("Sadio Mané", "sen", "liv", "won g100"),
  f("Luis Suárez", "uru", "liv", "g50"),
  f("Fernando Torres", "esp", "liv che", "g50"),
  f("Peter Crouch", "eng", "liv tot", "g100 a300"),
  f("James Milner", "eng", "liv mci", "won a300 as50"),
  f("Sami Hyypiä", "fin", "liv", "a300"),
  f("Roberto Firmino", "bra", "liv", "won g50"),
  f("Thiago Alcântara", "esp", "liv", "won"),
  f("Thierry Henry", "fra", "ars", "won g100 as50"),
  f("Ian Wright", "eng", "ars", "g100"),
  f("Dennis Bergkamp", "ned", "ars", "won g50 as50"),
  f("Patrick Vieira", "fra", "ars mci", "won a300"),
  f("Cesc Fàbregas", "esp", "ars che", "won g50 a300 as50"),
  f("Tony Adams", "eng", "ars", "won a300"),
  f("Theo Walcott", "eng", "ars", "g50"),
  f("Bukayo Saka", "eng", "ars", "g50 as50"),
  f("Jack Wilshere", "eng", "ars"),
  f("Pierre-Emerick Aubameyang", "gab", "ars", "g50"),
  f("Olivier Giroud", "fra", "ars che", "g50"),
  f("David Seaman", "eng", "ars", "won a300"),
  f("Ray Parlour", "eng", "ars", "won a300"),
  f("Mesut Özil", "ger", "ars", "as50"),
  f("Nicolas Anelka", "fra", "ars che mci", "won g100 a300"),
  f("Samir Nasri", "fra", "ars mci", "won"),
  f("Gaël Clichy", "fra", "ars mci", "won a300"),
  f("Bacary Sagna", "fra", "ars mci", "won a300"),
  f("Gilberto Silva", "bra", "ars", "won"),
  f("Gabriel Jesus", "bra", "mci ars", "won g50"),
  f("David Luiz", "bra", "che ars", "won"),
  f("Willian", "bra", "che ars", "won a300 as50"),
  f("William Gallas", "fra", "che ars tot", "won"),
  f("César Azpilicueta", "esp", "che", "won a300"),
  f("Pedro", "esp", "che", "won"),
  f("Diego Costa", "esp bra", "che", "won g50"),
  f("Marcos Alonso", "esp", "che", "won"),
  f("Álvaro Morata", "esp", "che"),
  f("N'Golo Kanté", "fra", "che", "won"),
  f("Claude Makélélé", "fra", "che", "won"),
  f("Ramires", "bra", "che", "won"),
  f("Oscar", "bra", "che", "won"),
  f("Thiago Silva", "bra", "che"),
  f("Alex", "bra", "che", "won"),
  f("David Silva", "esp", "mci", "won a300 as50"),
  f("Rodri", "esp", "mci", "won"),
  f("Ferran Torres", "esp", "mci"),
  f("Nolito", "esp", "mci"),
  f("Aymeric Laporte", "esp", "mci", "won"),
  f("Benjamin Mendy", "fra", "mci", "won"),
  f("Fernandinho", "bra", "mci", "won a300"),
  f("Ederson", "bra", "mci", "won"),
  f("Robinho", "bra", "mci"),
  f("Jô", "bra", "mci"),
  f("Hugo Lloris", "fra", "tot", "a300"),
  f("Tanguy Ndombele", "fra", "tot"),
  f("Pedro Porro", "esp", "tot"),
  f("Sergio Reguilón", "esp", "tot"),
  f("Roberto Soldado", "esp", "tot"),
  f("Richarlison", "bra", "tot"),
  f("Sandro", "bra", "tot"),
  f("Emerson Royal", "bra", "tot"),
  f("Gilberto", "bra", "tot"),
  f("Harry Kane", "eng", "tot", "g100 a300 as50"),
  f("Son Heung-min", "kor", "tot", "g100 a300 as50"),
  f("Gareth Bale", "wal", "tot"),
  f("Ledley King", "eng", "tot", "a300"),
];

// La Liga tags: won (title), g100, a300
const LALIGA_FACTS: Fact[] = [
  f("Raúl", "esp", "rma", "won g100 a300"),
  f("Iker Casillas", "esp", "rma", "won a300"),
  f("Sergio Ramos", "esp", "rma", "won a300"),
  f("Xabi Alonso", "esp", "rma", "won"),
  f("Fernando Hierro", "esp", "rma", "won a300"),
  f("Dani Carvajal", "esp", "rma", "won"),
  f("Guti", "esp", "rma", "won a300"),
  f("Raúl Albiol", "esp", "rma", "won"),
  f("Álvaro Arbeloa", "esp", "rma", "won"),
  f("Isco", "esp", "rma", "won"),
  f("Marcos Llorente", "esp", "rma atm", "won"),
  f("Álvaro Morata", "esp", "rma atm", "won"),
  f("Xavi", "esp", "bar", "won a300"),
  f("Andrés Iniesta", "esp", "bar", "won a300"),
  f("Carles Puyol", "esp", "bar", "won a300"),
  f("Sergio Busquets", "esp", "bar", "won a300"),
  f("Gerard Piqué", "esp", "bar", "won a300"),
  f("Jordi Alba", "esp", "bar", "won a300"),
  f("Pedro", "esp", "bar", "won"),
  f("Cesc Fàbregas", "esp", "bar", "won"),
  f("Luis Enrique", "esp", "rma bar", "won a300"),
  f("David Villa", "esp", "bar atm", "won g100"),
  f("Fernando Torres", "esp", "atm"),
  f("Koke", "esp", "atm", "won a300"),
  f("Gabi", "esp", "atm", "won a300"),
  f("Saúl Ñíguez", "esp", "atm", "won"),
  f("Raúl García", "esp", "atm", "won a300"),
  f("Luis Aragonés", "esp", "atm", "won g100 a300"),
  f("Santillana", "esp", "rma", "won g100 a300"),
  f("César Rodríguez", "esp", "bar", "g100"),
  f("Diego Costa", "esp bra", "atm", "won"),
  f("Roberto Carlos", "bra", "rma", "won a300"),
  f("Marcelo", "bra", "rma", "won a300"),
  f("Casemiro", "bra", "rma", "won"),
  f("Vinícius Júnior", "bra", "rma", "won"),
  f("Rodrygo", "bra", "rma", "won"),
  f("Éder Militão", "bra", "rma", "won"),
  f("Ronaldo", "bra", "rma bar", "won g100"),
  f("Ronaldinho", "bra", "bar", "won"),
  f("Rivaldo", "bra", "bar", "won"),
  f("Neymar", "bra", "bar", "won"),
  f("Dani Alves", "bra", "bar", "won a300"),
  f("Raphinha", "bra", "bar", "won"),
  f("Philippe Coutinho", "bra", "bar"),
  f("Filipe Luís", "bra", "atm", "won"),
  f("João Miranda", "bra", "atm", "won"),
  f("Renan Lodi", "bra", "atm"),
  f("Ángel Di María", "arg", "rma", "won"),
  f("Gonzalo Higuaín", "arg", "rma", "won g100"),
  f("Fernando Redondo", "arg", "rma", "won"),
  f("Alfredo Di Stéfano", "arg esp", "rma bar", "won g100 a300"),
  f("Gabriel Heinze", "arg", "rma", "won"),
  f("Esteban Cambiasso", "arg", "rma", "won"),
  f("Lionel Messi", "arg", "bar", "won g100 a300"),
  f("Javier Mascherano", "arg", "bar", "won"),
  f("Javier Saviola", "arg", "bar rma", "won"),
  f("Sergio Agüero", "arg", "atm bar"),
  f("Ángel Correa", "arg", "atm", "won"),
  f("Rodrigo De Paul", "arg", "atm"),
  f("Diego Simeone", "arg", "atm", "won"),
  f("Julián Álvarez", "arg", "atm"),
  f("Karim Benzema", "fra", "rma", "won g100 a300"),
  f("Cristiano Ronaldo", "por", "rma", "won g100"),
  f("Hugo Sánchez", "mex", "rma atm", "won g100 a300"),
  f("Samuel Eto'o", "cmr", "bar", "won g100"),
  f("Luis Suárez", "uru", "bar atm", "won g100"),
  f("Antoine Griezmann", "fra", "atm bar", "won g100 a300"),
  f("Diego Godín", "uru", "atm", "won a300"),
  f("Jan Oblak", "svn", "atm", "won a300"),
  f("Luka Modrić", "cro", "rma", "won a300"),
  f("Toni Kroos", "ger", "rma", "won"),
  f("Gareth Bale", "wal", "rma", "won"),
  f("Thibaut Courtois", "bel", "atm rma", "won"),
  f("Marc-André ter Stegen", "ger", "bar", "won a300"),
  f("Robert Lewandowski", "pol", "bar", "won"),
  f("Alfredo Di Stefano", "arg esp", "rma bar", "won g100 a300"),
];

// UCL tags: g50, a100 (appearances), final (scored in a Champions League final)
const UCL_FACTS: Fact[] = [
  f("Cristiano Ronaldo", "por", "rma", "g50 a100 final"),
  f("Karim Benzema", "fra", "rma", "g50 a100"),
  f("Raúl", "esp", "rma", "g50 a100 final"),
  f("Gareth Bale", "wal", "rma", "final"),
  f("Sergio Ramos", "esp", "rma", "a100 final"),
  f("Luka Modrić", "cro", "rma", "a100"),
  f("Toni Kroos", "ger", "rma bay", "a100"),
  f("Marcelo", "bra", "rma", "a100"),
  f("Casemiro", "bra", "rma", "final"),
  f("Vinícius Júnior", "bra", "rma", "final"),
  f("Roberto Carlos", "bra", "rma", "a100"),
  f("Pepe", "por", "rma", "a100"),
  f("Fábio Coentrão", "por", "rma"),
  f("Raphaël Varane", "fra", "rma"),
  f("Kylian Mbappé", "fra", "rma", "g50"),
  f("Claude Makélélé", "fra", "rma"),
  f("Rodrygo", "bra", "rma"),
  f("Xabi Alonso", "esp", "rma bay", "a100 final"),
  f("David Alaba", "aut", "bay rma", "a100"),
  f("Arjen Robben", "ned", "bay rma", "a100 final"),
  f("Lionel Messi", "arg", "bar", "g50 a100 final"),
  f("Xavi", "esp", "bar", "a100"),
  f("Andrés Iniesta", "esp", "bar", "a100"),
  f("Gerard Piqué", "esp", "bar", "a100"),
  f("Sergio Busquets", "esp", "bar", "a100"),
  f("Samuel Eto'o", "cmr", "bar", "final"),
  f("Luis Suárez", "uru", "bar", "final"),
  f("Neymar", "bra", "bar", "final"),
  f("Pedro", "esp", "bar", "final"),
  f("David Villa", "esp", "bar", "final"),
  f("Ivan Rakitić", "cro", "bar", "final"),
  f("Ronaldinho", "bra", "bar"),
  f("Dani Alves", "bra", "bar", "a100"),
  f("Raphinha", "bra", "bar"),
  f("Ousmane Dembélé", "fra", "bar"),
  f("Jules Koundé", "fra", "bar"),
  f("Éric Abidal", "fra", "bar"),
  f("Ludovic Giuly", "fra", "bar"),
  f("Deco", "por", "bar", "final"),
  f("André Gomes", "por", "bar"),
  f("Trincão", "por", "bar"),
  f("João Cancelo", "por", "bar bay"),
  f("Robert Lewandowski", "pol", "bar bay", "g50 a100"),
  f("Thomas Müller", "ger", "bay", "g50 a100"),
  f("Manuel Neuer", "ger", "bay", "a100"),
  f("Franck Ribéry", "fra", "bay", "a100"),
  f("Kingsley Coman", "fra", "bay", "final"),
  f("Lucas Hernández", "fra", "bay"),
  f("Benjamin Pavard", "fra", "bay"),
  f("Mario Mandžukić", "cro", "bay", "final"),
  f("Joshua Kimmich", "ger", "bay", "a100"),
  f("Harry Kane", "eng", "bay", "g50"),
  f("Dante", "bra", "bay"),
  f("Zé Roberto", "bra", "bay"),
  f("Douglas Costa", "bra", "bay"),
  f("Luiz Gustavo", "bra", "bay"),
  f("Renato Sanches", "por", "bay"),
  f("João Palhinha", "por", "bay"),
  f("Thiago Alcântara", "esp", "bar bay", "a100"),
];

const FACTS: Record<Competition, Fact[]> = {
  pl: PL_FACTS,
  laliga: LALIGA_FACTS,
  ucl: UCL_FACTS,
};

const club = (label: string, badge: string, key: string, short = label): Def => ({
  clue: { label, badge, badgeAlt: `${short} crest` },
  test: (fact) => fact.clubs.includes(key),
});
const NAT_KEYS: Record<string, string> = { es: "esp", fr: "fra", br: "bra", ar: "arg", pt: "por", "gb-eng": "eng" };
const national = (label: string, country: string): Def => ({
  clue: { label, badge: flag(country), badgeAlt: `${label.replace(" international", "")} flag` },
  test: (fact) => fact.nat.includes(NAT_KEYS[country] ?? country),
});
const stat = (label: string, tag: string): Def => ({
  clue: { label },
  test: (fact) => fact.tags.includes(tag),
});

const PL_CLUBS = {
  mun: (prefix = "") => club(`${prefix}Manchester United`, "/club-logos/man-utd.svg", "mun", "Manchester United"),
  liv: (prefix = "") => club(`${prefix}Liverpool`, "/club-logos/liverpool.svg", "liv", "Liverpool"),
  ars: (prefix = "") => club(`${prefix}Arsenal`, "/club-logos/arsenal.svg", "ars", "Arsenal"),
  che: (prefix = "") => club(`${prefix}Chelsea`, "/club-logos/chelsea.svg", "che", "Chelsea"),
  mci: (prefix = "") => club(`${prefix}Manchester City`, "/club-logos/man-city.svg", "mci", "Manchester City"),
  tot: (prefix = "") => club(`${prefix}Tottenham`, "/club-logos/tottenham.svg", "tot", "Tottenham"),
};
const LL_BADGE = {
  rma: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
  bar: "https://a.espncdn.com/i/teamlogos/soccer/500/83.png",
  atm: "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png",
};
const LL_CLUBS = {
  rma: (prefix = "") => club(`${prefix}Real Madrid`, LL_BADGE.rma, "rma", "Real Madrid"),
  bar: (prefix = "") => club(`${prefix}Barcelona`, LL_BADGE.bar, "bar", "Barcelona"),
  atm: (prefix = "") => club(`${prefix}Atlético Madrid`, LL_BADGE.atm, "atm", "Atlético Madrid"),
};
const UCL_BADGE = {
  rma: "https://img.uefa.com/imgml/TP/teams/logos/70x70/50051.png",
  bar: "https://img.uefa.com/imgml/TP/teams/logos/70x70/50080.png",
  bay: "https://img.uefa.com/imgml/TP/teams/logos/70x70/50037.png",
};
const UCL_CLUBS = {
  rma: (prefix = "") => club(`${prefix}Real Madrid`, UCL_BADGE.rma, "rma", "Real Madrid"),
  bar: (prefix = "") => club(`${prefix}Barcelona`, UCL_BADGE.bar, "bar", "Barcelona"),
  bay: (prefix = "") => club(`${prefix}Bayern Munich`, UCL_BADGE.bay, "bay", "Bayern Munich"),
};

function build(
  comp: Competition,
  rows: [Def, Def, Def],
  columns: [Def, Def, Def],
): FootballTicTacToePuzzle {
  const facts = FACTS[comp];
  const names = new Set<string>();
  return {
    rows: rows.map((row) => row.clue) as FootballTicTacToePuzzle["rows"],
    columns: columns.map((column) => column.clue) as FootballTicTacToePuzzle["columns"],
    answers: rows.map((row) =>
      columns.map((column) => {
        names.clear();
        for (const fact of facts) {
          if (row.test(fact) && column.test(fact)) names.add(fact.name);
        }
        return [...names];
      }),
    ),
  };
}

const P = "Played for ";

export const FOOTBALL_TIC_TAC_TOE_VARIANTS: Record<Competition, FootballTicTacToePuzzle[]> = {
  pl: [
    build(
      "pl",
      [national("England international", "gb-eng"), stat("Premier League winner", "won"), stat("100+ Premier League goals", "g100")],
      [PL_CLUBS.mun(P), PL_CLUBS.liv(P), PL_CLUBS.ars(P)],
    ),
    build(
      "pl",
      [national("Spain international", "es"), national("France international", "fr"), national("Brazil international", "br")],
      [PL_CLUBS.che(P), PL_CLUBS.mci(P), PL_CLUBS.tot(P)],
    ),
    build(
      "pl",
      [stat("50+ Premier League goals", "g50"), stat("300+ Premier League appearances", "a300"), stat("50+ Premier League assists", "as50")],
      [PL_CLUBS.mun(), PL_CLUBS.liv(), PL_CLUBS.ars()],
    ),
    build(
      "pl",
      [stat("Premier League winner", "won"), stat("100+ Premier League goals", "g100"), stat("300+ Premier League appearances", "a300")],
      [PL_CLUBS.che(P), PL_CLUBS.mci(P), PL_CLUBS.tot(P)],
    ),
  ],
  laliga: [
    build(
      "laliga",
      [national("Spanish international", "es"), stat("La Liga winner", "won"), stat("100+ La Liga goals", "g100")],
      [LL_CLUBS.rma(P), LL_CLUBS.bar(P), LL_CLUBS.atm(P)],
    ),
    build(
      "laliga",
      [national("Spanish international", "es"), national("Brazil international", "br"), national("Argentina international", "ar")],
      [LL_CLUBS.rma(P), LL_CLUBS.bar(P), LL_CLUBS.atm(P)],
    ),
    build(
      "laliga",
      [stat("100+ La Liga goals", "g100"), stat("300+ La Liga appearances", "a300"), stat("Won La Liga", "won")],
      [LL_CLUBS.rma(), LL_CLUBS.bar(), LL_CLUBS.atm()],
    ),
  ],
  ucl: [
    build(
      "ucl",
      [national("France international", "fr"), stat("Scored in a Champions League final", "final"), stat("100+ Champions League appearances", "a100")],
      [UCL_CLUBS.rma(P), UCL_CLUBS.bar(P), UCL_CLUBS.bay(P)],
    ),
    build(
      "ucl",
      [national("France international", "fr"), national("Brazil international", "br"), national("Portugal international", "pt")],
      [UCL_CLUBS.rma(P), UCL_CLUBS.bar(P), UCL_CLUBS.bay(P)],
    ),
    build(
      "ucl",
      [stat("50+ Champions League goals", "g50"), stat("100+ Champions League appearances", "a100"), stat("Scored in a Champions League final", "final")],
      [UCL_CLUBS.rma(), UCL_CLUBS.bar(), UCL_CLUBS.bay()],
    ),
  ],
};

export const FOOTBALL_TIC_TAC_TOE: Record<Competition, FootballTicTacToePuzzle> = {
  pl: FOOTBALL_TIC_TAC_TOE_VARIANTS.pl[0],
  laliga: FOOTBALL_TIC_TAC_TOE_VARIANTS.laliga[0],
  ucl: FOOTBALL_TIC_TAC_TOE_VARIANTS.ucl[0],
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
