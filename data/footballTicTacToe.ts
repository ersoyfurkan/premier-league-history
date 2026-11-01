import type { Competition } from "@/lib/gameRoom";
import { CAREERS } from "@/data/clubDuelCareers";

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

// Extra clubs for players already listed above.
const PL_ALSO: Record<string, string> = {
  "Wayne Rooney": "eve", "Michael Owen": "new", "Sadio Mané": "sou", "N'Golo Kanté": "lei",
  "Theo Walcott": "eve sou", "Gareth Bale": "sou", "Rio Ferdinand": "wham", "Peter Crouch": "sou",
  "Michael Carrick": "wham", "Richarlison": "eve", "Jordan Henderson": "", "James Milner": "avl new lee",
  "Fernando Torres": "", "Roberto Soldado": "", "Mohamed Salah": "", "Ashley Cole": "",
  "Gaël Clichy": "", "Marcos Alonso": "", "Harry Kane": "", "Robin van Persie": "",
  "Michail Antonio": "",
};
const PL_EXTRA: Fact[] = [
  f("Romelu Lukaku", "bel", "eve che mun wba", "g100 a300"),
  f("Tim Cahill", "aus", "eve", "g50 a300"),
  f("Leighton Baines", "eng", "eve", "a300 as50"),
  f("Phil Jagielka", "eng", "eve sou", "a300"),
  f("Seamus Coleman", "irl", "eve", "a300"),
  f("Marouane Fellaini", "bel", "eve mun", "g50 a300"),
  f("Tim Howard", "usa", "eve mun", "a300"),
  f("Duncan Ferguson", "sco", "eve new", "g50"),
  f("Gylfi Sigurdsson", "isl", "eve sou tot", "g50 as50"),
  f("Jordan Pickford", "eng", "eve", "a300"),
  f("Dominic Calvert-Lewin", "eng", "eve", "g50"),
  f("Lucas Digne", "fra", "eve avl", ""),
  f("Joleon Lescott", "eng", "eve mci", "won a300"),
  f("Gareth Barry", "eng", "avl mci eve wba", "won a300 as50"),
  f("Mikel Arteta", "esp", "eve ars", "a300 as50"),
  f("Ross Barkley", "eng", "eve che avl", ""),
  f("Alan Shearer", "eng", "new sou bla", "won g100 a300 as50"),
  f("Andy Carroll", "eng", "new liv wham", "g50"),
  f("Kieran Trippier", "eng", "tot new mun", "a300 as50"),
  f("Les Ferdinand", "eng", "new tot qpr wham", "g100 a300"),
  f("Craig Bellamy", "wal", "new liv mci wham cardiff", "g50 a300"),
  f("Yohan Cabaye", "fra", "new", "g50"),
  f("Papiss Cissé", "sen", "new", "g50"),
  f("Demba Ba", "sen", "new che wham", "g50"),
  f("Shay Given", "irl", "new mci avl", "a300"),
  f("Alexander Isak", "swe", "new liv", "g50"),
  f("Bruno Guimarães", "bra", "new", ""),
  f("Joelinton", "bra", "new", ""),
  f("Fabricio Coloccini", "arg", "new", "a300"),
  f("Rob Lee", "eng", "new wham", ""),
  f("Declan Rice", "eng", "wham ars", "a300"),
  f("Mark Noble", "eng", "wham", "a300"),
  f("Michail Antonio", "jam", "wham", "g50 a300"),
  f("Dimitri Payet", "fra", "wham", "as50"),
  f("Carlos Tevez", "arg", "wham mci mun", "won g50"),
  f("Javier Mascherano", "arg", "wham liv", ""),
  f("Joe Cole", "eng", "wham che liv", "won a300"),
  f("Frank Lampard", "eng", "wham che mci", "won g100 a300 as50"),
  f("Paolo Di Canio", "ita", "wham", "g50"),
  f("Jarrod Bowen", "eng", "wham", "g50"),
  f("Lucas Paquetá", "bra", "wham", ""),
  f("Pablo Zabaleta", "arg", "mci wham", "won a300"),
  f("Scott Parker", "eng", "wham che tot new", "a300"),
  f("Robert Green", "eng", "wham", "a300"),
  f("Jamie Vardy", "eng", "lei", "won g100 a300 as50"),
  f("Riyad Mahrez", "alg", "lei mci", "won g50 as50"),
  f("Wes Morgan", "jam", "lei", "won a300"),
  f("Kasper Schmeichel", "den", "lei mci", "won a300"),
  f("Danny Drinkwater", "eng", "lei che", "won"),
  f("Harry Maguire", "eng", "lei mun", "a300"),
  f("Wilfred Ndidi", "nga", "lei", ""),
  f("James Maddison", "eng", "lei tot", "g50 as50"),
  f("Kelechi Iheanacho", "nga", "lei mci", ""),
  f("Ben Chilwell", "eng", "lei che", ""),
  f("Emile Heskey", "eng", "lei liv avl wham bir", "g50 a300"),
  f("Youri Tielemans", "bel", "lei avl", ""),
  f("Marc Albrighton", "eng", "lei avl", "won a300"),
  f("Gabriel Agbonlahor", "eng", "avl", "g50 a300"),
  f("Ashley Young", "eng", "avl mun", "won a300 as50"),
  f("Ollie Watkins", "eng", "avl", "g50"),
  f("Jack Grealish", "eng", "avl mci", "won as50"),
  f("Emiliano Martínez", "arg", "avl ars", ""),
  f("Philippe Coutinho", "bra", "liv avl", "as50"),
  f("Dwight Yorke", "tri", "avl mun bla", "won g100"),
  f("Stiliyan Petrov", "bul", "avl", "a300"),
  f("Darren Bent", "eng", "avl tot sun", "g100"),
  f("Stewart Downing", "eng", "avl liv new wham", "a300 as50"),
  f("Brad Friedel", "usa", "avl bla tot liv", "a300"),
  f("John Carew", "nor", "avl wham", ""),
  f("Matt Le Tissier", "eng", "sou", "g100 a300"),
  f("Luke Shaw", "eng", "sou mun", ""),
  f("Adam Lallana", "eng", "sou liv", "won"),
  f("Virgil van Dijk", "ned", "sou liv", "won"),
  f("Dušan Tadić", "srb", "sou", "as50"),
  f("James Ward-Prowse", "eng", "sou wham", "as50 a300"),
  f("Rickie Lambert", "eng", "sou liv", "g50"),
  f("Morgan Schneiderlin", "fra", "sou mun eve", ""),
  f("Nathaniel Clyne", "eng", "sou liv", ""),
  f("Danny Ings", "eng", "sou liv avl wham", "g50"),
  f("Wayne Bridge", "eng", "sou che mci wham", "won a300"),
  f("Ryan Bertrand", "eng", "sou che lei", "won"),
  f("Pierre-Emile Højbjerg", "den", "sou tot", ""),
  f("Kevin De Bruyne", "bel", "che mci", "won g50 as50"),
  f("Raheem Sterling", "eng", "liv mci che ars", "won g100 a300 as50"),
  f("Kyle Walker", "eng", "tot mci", "won a300"),
  f("Sergio Agüero", "arg", "mci", "won g100 a300"),
  f("Yaya Touré", "civ", "mci", "won g50"),
  f("Vincent Kompany", "bel", "mci", "won a300"),
  f("Didier Drogba", "civ", "che", "won g100 a300"),
  f("John Terry", "eng", "che", "won a300"),
  f("Petr Čech", "cze", "che ars", "won a300"),
  f("Eden Hazard", "bel", "che", "won g50 as50"),
  f("Cole Palmer", "eng", "mci che", "g50"),
  f("Jermain Defoe", "eng", "tot wham por sun", "g100 a300"),
  f("Teddy Sheringham", "eng", "tot mun wham", "won g100 a300"),
  f("Dimitar Berbatov", "bul", "tot mun fulham", "won g100"),
  f("Emmanuel Adebayor", "tog", "ars mci tot", "g100"),
];

// Extra clubs for players already listed above.
const LL_ALSO: Record<string, string> = {
  "David Villa": "val", "David Silva": "", "Fernando Torres": "", "Roberto Soldado": "val vil",
  "Jordi Alba": "val", "Raúl Albiol": "val vil", "Xabi Alonso": "soc", "Antoine Griezmann": "soc",
  "Isco": "mal bet", "Dani Alves": "sev", "Sergio Ramos": "sev", "Aymeric Laporte": "ath val",
  "Raúl García": "ath", "Luis Enrique": "cel", "Álvaro Morata": "",
};
const LL_EXTRA: Fact[] = [
  f("David Silva", "esp", "val", "won"),
  f("Santi Cazorla", "esp", "vil mal", ""),
  f("Pablo Aimar", "arg", "val", ""),
  f("Gaizka Mendieta", "esp", "val", ""),
  f("Rubén Baraja", "esp", "val atm", "a300"),
  f("Carlos Marchena", "esp", "val sev", "a300"),
  f("David Albelda", "esp", "val", "a300"),
  f("Daniel Parejo", "esp", "val vil", "a300"),
  f("Edinson Cavani", "uru", "val", ""),
  f("Paco Alcácer", "esp", "val bar vil", ""),
  f("Ferran Torres", "esp", "val bar", ""),
  f("Roberto Ayala", "arg", "val", ""),
  f("Jesús Navas", "esp", "sev", "a300"),
  f("Ivan Rakitić", "cro", "sev bar", "won"),
  f("Frédéric Kanouté", "mli", "sev", "g100"),
  f("Luis Fabiano", "bra", "sev", ""),
  f("Julio Baptista", "bra", "sev rma", ""),
  f("Éver Banega", "arg", "sev val", ""),
  f("José Antonio Reyes", "esp", "sev rma atm", "won"),
  f("Kevin Gameiro", "fra", "sev atm val", ""),
  f("Jules Koundé", "fra", "sev bar", ""),
  f("Diego Carlos", "bra", "sev", ""),
  f("Papu Gómez", "arg", "sev", ""),
  f("Andrés Palop", "esp", "sev val", "a300"),
  f("Adriano", "bra", "sev bar", ""),
  f("Juan Román Riquelme", "arg", "vil bar", ""),
  f("Diego Forlán", "uru", "vil atm", "g100"),
  f("Marcos Senna", "bra", "vil", ""),
  f("Gerard Moreno", "esp", "vil", "g50"),
  f("Bruno Soriano", "esp", "vil", "a300"),
  f("Pepe Reina", "esp", "vil atm", ""),
  f("Joan Capdevila", "esp", "vil atm", "a300"),
  f("Giuseppe Rossi", "ita", "vil", ""),
  f("Aritz Aduriz", "esp", "ath val", "g100 a300"),
  f("Fernando Llorente", "esp", "ath", ""),
  f("Iker Muniain", "esp", "ath", "a300"),
  f("Óscar de Marcos", "esp", "ath", "a300"),
  f("Ander Herrera", "esp", "ath", ""),
  f("Javi Martínez", "esp", "ath", ""),
  f("Iñaki Williams", "gha esp", "ath", "a300"),
  f("Kepa Arrizabalaga", "esp", "ath", ""),
  f("Joseba Etxeberria", "esp", "ath", "a300"),
  f("Bixente Lizarazu", "fra", "ath", ""),
  f("Markel Susaeta", "esp", "ath", "a300"),
  f("Martin Ødegaard", "nor", "soc rma", ""),
  f("Carlos Vela", "mex", "soc", ""),
  f("Mikel Oyarzabal", "esp", "soc", "g50"),
  f("Mikel Merino", "esp", "soc", ""),
  f("Asier Illarramendi", "esp", "soc rma", ""),
  f("Nihat Kahveci", "tur", "soc", ""),
  f("Álvaro Odriozola", "esp", "soc rma", ""),
  f("Alexander Isak", "swe", "soc", ""),
  f("Willian José", "bra", "soc bet", ""),
  f("Joaquín", "esp", "bet val", "a300"),
  f("Nabil Fekir", "fra", "bet", ""),
  f("Andrés Guardado", "mex", "bet val", "a300"),
  f("Sergio Canales", "esp", "bet val soc", ""),
  f("Giovani Lo Celso", "arg", "bet", ""),
  f("Borja Iglesias", "esp", "bet", ""),
  f("Rubén Castro", "esp", "bet", "g100 a300"),
  f("Héctor Bellerín", "esp", "bet", ""),
  f("Marc Bartra", "esp", "bet bar", ""),
  f("William Carvalho", "por", "bet", ""),
  f("Emerson Royal", "bra", "bet bar", ""),
  f("Claudio Bravo", "chi", "bet bar", ""),
  f("Rafael van der Vaart", "ned", "bet rma", ""),
  f("Fabián Ruiz", "esp", "bet", ""),
];

// Extra clubs for players already listed above.
const UCL_ALSO: Record<string, string> = {
  "Cristiano Ronaldo": "mun juv", "Kylian Mbappé": "psg", "Lionel Messi": "psg", "Neymar": "psg",
  "Sergio Ramos": "psg", "Xabi Alonso": "liv", "Luka Modrić": "tot", "Gareth Bale": "tot",
  "Casemiro": "mun", "Raphaël Varane": "mun", "Claude Makélélé": "che psg", "Roberto Carlos": "inter",
  "Ronaldo": "inter mil", "Ronaldinho": "psg mil", "Dani Alves": "juv psg", "Samuel Eto'o": "inter che",
  "Gerard Piqué": "mun", "David Villa": "atm", "Luis Suárez": "liv atm ajax", "Robert Lewandowski": "dor",
  "Arjen Robben": "che", "Mario Mandžukić": "juv atm", "Kingsley Coman": "juv psg",
  "Benjamin Pavard": "inter", "Lucas Hernández": "atm psg", "Ousmane Dembélé": "dor psg",
  "Thiago Alcântara": "liv", "João Cancelo": "juv mci", "Deco": "che", "Pedro": "che",
  "Éric Abidal": "lyon", "Harry Kane": "tot", "Javier Mascherano": "liv", "Raúl": "",
};
const UCL_EXTRA: Fact[] = [
  f("Zlatan Ibrahimović", "swe", "ajax juv inter bar mil psg mun", "g50 a100"),
  f("Thierry Henry", "fra", "ars bar juv", "g50 a100 final"),
  f("Didier Drogba", "civ", "che", "g50 a100 final"),
  f("Frank Lampard", "eng", "che", "g50 a100"),
  f("Steven Gerrard", "eng", "liv", "g50 a100 final"),
  f("Mohamed Salah", "egy", "liv che", "g50 a100 final"),
  f("Sadio Mané", "sen", "liv bay", "a100"),
  f("Roberto Firmino", "bra", "liv", ""),
  f("Jordan Henderson", "eng", "liv", "a100"),
  f("Virgil van Dijk", "ned", "liv", ""),
  f("Ole Gunnar Solskjær", "nor", "mun", "final"),
  f("Teddy Sheringham", "eng", "mun tot", "final"),
  f("Ryan Giggs", "wal", "mun", "a100"),
  f("Wayne Rooney", "eng", "mun", "g50"),
  f("Paul Scholes", "eng", "mun", "a100"),
  f("Dwight Yorke", "tri", "mun", ""),
  f("Paul Pogba", "fra", "juv mun", ""),
  f("Andrea Pirlo", "ita", "mil juv inter", "a100"),
  f("Gianluigi Buffon", "ita", "juv psg", "a100"),
  f("Paolo Maldini", "ita", "mil", "a100"),
  f("Filippo Inzaghi", "ita", "mil juv", "g50 final"),
  f("Alessandro Del Piero", "ita", "juv", "g50 a100"),
  f("Zinedine Zidane", "fra", "juv rma", "a100 final"),
  f("David Trezeguet", "fra", "juv", "g50"),
  f("Lilian Thuram", "fra", "juv bar", "a100"),
  f("Gonzalo Higuaín", "arg", "juv rma", ""),
  f("Paulo Dybala", "arg", "juv", ""),
  f("Arturo Vidal", "chi", "juv bay bar inter", ""),
  f("Carlos Tevez", "arg", "juv mun mci", ""),
  f("Ángel Di María", "arg", "rma mun psg juv", "a100 final"),
  f("Javier Zanetti", "arg", "inter", "a100"),
  f("Diego Milito", "arg", "inter", "final"),
  f("Esteban Cambiasso", "arg", "inter rma", "a100"),
  f("Wesley Sneijder", "ned", "ajax rma inter", ""),
  f("Clarence Seedorf", "ned", "ajax rma inter mil", "a100"),
  f("Edgar Davids", "ned", "ajax mil juv inter tot", ""),
  f("Patrick Kluivert", "ned", "ajax mil bar", "final"),
  f("Marc Overmars", "ned", "ajax ars bar", ""),
  f("Dennis Bergkamp", "ned", "ajax inter ars", ""),
  f("Frenkie de Jong", "ned", "ajax bar", ""),
  f("Matthijs de Ligt", "ned", "ajax juv bay", ""),
  f("Cesc Fàbregas", "esp", "ars bar che", ""),
  f("Robin van Persie", "ned", "ars mun", ""),
  f("Patrick Vieira", "fra", "ars juv inter mci", ""),
  f("Edinson Cavani", "uru", "psg mun", "g50"),
  f("Marco Verratti", "ita", "psg", "a100"),
  f("Marquinhos", "bra", "psg", "a100"),
  f("Thiago Silva", "bra", "mil psg che", "a100"),
  f("Achraf Hakimi", "mar", "dor inter psg rma", ""),
  f("Erling Haaland", "nor", "dor mci", "g50"),
  f("Marco Reus", "ger", "dor", "a100"),
  f("Mats Hummels", "ger", "dor bay", "a100"),
  f("Mario Götze", "ger", "dor bay", ""),
  f("Pierre-Emerick Aubameyang", "gab", "dor ars", ""),
  f("Sergio Agüero", "arg", "mci atm", "g50 a100"),
  f("Kevin De Bruyne", "bel", "che mci", "a100"),
  f("David Silva", "esp", "mci", "a100"),
  f("Raheem Sterling", "eng", "liv mci che", "a100"),
  f("Kyle Walker", "eng", "tot mci", "a100"),
  f("Riyad Mahrez", "alg", "lei mci", ""),
  f("Eden Hazard", "bel", "che rma", "a100"),
  f("Thibaut Courtois", "bel", "che rma atm", "a100"),
  f("John Terry", "eng", "che", "a100"),
  f("Petr Čech", "cze", "che", "a100"),
  f("Ashley Cole", "eng", "ars che", "a100"),
  f("Kai Havertz", "ger", "che ars", "final"),
  f("Michael Essien", "gha", "che mil", ""),
  f("N'Golo Kanté", "fra", "che", ""),
  f("Antoine Griezmann", "fra", "atm bar", "g50 a100"),
  f("Diego Simeone", "arg", "atm inter", ""),
  f("Koke", "esp", "atm", "a100"),
  f("Diego Godín", "uru", "atm inter", "a100"),
  f("Jan Oblak", "svn", "atm", "a100"),
  f("Fernando Torres", "esp", "atm liv che mil", ""),
  f("Diego Costa", "esp", "atm che", ""),
];

function merge(base: Fact[], also: Record<string, string>, extra: Fact[]): Fact[] {
  const map = new Map<string, Fact>();
  const put = (fact: Fact) => {
    const existing = map.get(fact.name);
    if (!existing) {
      map.set(fact.name, { ...fact, nat: [...fact.nat], clubs: [...fact.clubs], tags: [...fact.tags] });
      return;
    }
    for (const nat of fact.nat) if (!existing.nat.includes(nat)) existing.nat.push(nat);
    for (const club of fact.clubs) if (!existing.clubs.includes(club)) existing.clubs.push(club);
    for (const tag of fact.tags) if (!existing.tags.includes(tag)) existing.tags.push(tag);
  };
  base.forEach(put);
  extra.forEach(put);
  for (const [name, clubs] of Object.entries(also)) {
    const fact = map.get(name);
    if (fact) for (const club of clubs.split(" ").filter(Boolean)) if (!fact.clubs.includes(club)) fact.clubs.push(club);
  }
  return [...map.values()];
}

// Serie A tags: won (title), g100, a300
const SA_FACTS: Fact[] = [
  f("Alessandro Del Piero", "ita", "juv", "won g100 a300"),
  f("Gianluigi Buffon", "ita", "par juv", "won a300"),
  f("Giorgio Chiellini", "ita", "fio juv", "won a300"),
  f("Andrea Pirlo", "ita", "inter mil juv", "won a300"),
  f("Claudio Marchisio", "ita", "juv", "won a300"),
  f("Leonardo Bonucci", "ita", "inter mil juv", "won a300"),
  f("Andrea Barzagli", "ita", "juv", "won a300"),
  f("Fabio Cannavaro", "ita", "par inter juv", "won a300"),
  f("Giampiero Boniperti", "ita", "juv", "won g100 a300"),
  f("Roberto Baggio", "ita", "juv mil inter bol", "won g100 a300"),
  f("Gianluca Vialli", "ita", "sam juv", "won g100"),
  f("David Trezeguet", "fra", "juv", "won g100"),
  f("Pavel Nedvěd", "cze", "laz juv", "won"),
  f("Zinedine Zidane", "fra", "juv", "won"),
  f("Lilian Thuram", "fra", "par juv", "won a300"),
  f("Patrick Vieira", "fra", "mil juv inter", "won"),
  f("Edgar Davids", "ned", "mil juv inter", "won"),
  f("Zlatan Ibrahimović", "swe", "juv inter mil", "won g100"),
  f("Carlos Tevez", "arg", "juv", "won"),
  f("Gonzalo Higuaín", "arg", "nap juv mil", "won g100"),
  f("Paulo Dybala", "arg", "juv rom", "won g100"),
  f("Cristiano Ronaldo", "por", "juv", "won"),
  f("Paul Pogba", "fra", "juv", "won"),
  f("Arturo Vidal", "chi", "juv inter", "won"),
  f("Michel Platini", "fra", "juv", "won"),
  f("Francesco Totti", "ita", "rom", "won g100 a300"),
  f("Daniele De Rossi", "ita", "rom", "a300"),
  f("Gabriel Batistuta", "arg", "fio rom", "won g100 a300"),
  f("Vincenzo Montella", "ita", "sam rom", "won g100"),
  f("Marco Delvecchio", "ita", "rom", "won"),
  f("Vincent Candela", "fra", "rom", "won a300"),
  f("Cafu", "bra", "rom mil", "won"),
  f("Aldair", "bra", "rom", "won a300"),
  f("Walter Samuel", "arg", "rom inter", "won a300"),
  f("Emerson", "bra", "rom juv mil", "won"),
  f("Edin Džeko", "bih", "rom inter", "won g100"),
  f("Antonio Cassano", "ita", "rom inter mil sam par", "a300"),
  f("Paolo Maldini", "ita", "mil", "won a300"),
  f("Franco Baresi", "ita", "mil", "won a300"),
  f("Alessandro Costacurta", "ita", "mil", "won a300"),
  f("Alessandro Nesta", "ita", "laz mil", "won a300"),
  f("Gennaro Gattuso", "ita", "mil", "won a300"),
  f("Massimo Ambrosini", "ita", "mil fio", "won a300"),
  f("Filippo Inzaghi", "ita", "juv mil", "won g100"),
  f("Andriy Shevchenko", "ukr", "mil", "won g100"),
  f("Kaká", "bra", "mil", "won"),
  f("Clarence Seedorf", "ned", "inter mil", "won a300"),
  f("Marco van Basten", "ned", "mil", "won"),
  f("Ruud Gullit", "ned", "mil sam", "won"),
  f("Frank Rijkaard", "ned", "mil", "won"),
  f("Jaap Stam", "ned", "laz mil", ""),
  f("Thiago Silva", "bra", "mil", "won"),
  f("Ronaldinho", "bra", "mil", ""),
  f("Robinho", "bra", "mil", "won"),
  f("Zvonimir Boban", "cro", "mil", "won"),
  f("George Weah", "lib", "mil", "won"),
  f("Olivier Giroud", "fra", "mil", "won"),
  f("Theo Hernández", "fra", "mil", "won"),
  f("Mike Maignan", "fra", "mil", "won"),
  f("Rafael Leão", "por", "mil", "won"),
  f("Sandro Tonali", "ita", "mil", "won"),
  f("Hakan Çalhanoğlu", "tur", "mil inter", "won"),
  f("Javier Zanetti", "arg", "inter", "won a300"),
  f("Esteban Cambiasso", "arg", "inter", "won a300"),
  f("Diego Milito", "arg", "gen inter", "won"),
  f("Wesley Sneijder", "ned", "inter", "won"),
  f("Samuel Eto'o", "cmr", "inter", "won"),
  f("Marco Materazzi", "ita", "per inter", "won a300"),
  f("Iván Córdoba", "col", "inter", "won a300"),
  f("Maicon", "bra", "inter", "won"),
  f("Lúcio", "bra", "inter juv", "won"),
  f("Julio Cesar", "bra", "inter", "won"),
  f("Adriano", "bra", "inter par", "won"),
  f("Álvaro Recoba", "uru", "inter", "won"),
  f("Christian Vieri", "ita", "juv ata inter mil", "g100"),
  f("Ronaldo", "bra", "inter mil", ""),
  f("Hernán Crespo", "arg", "par laz inter mil", ""),
  f("Mauro Icardi", "arg", "sam inter", "g100"),
  f("Lautaro Martínez", "arg", "inter", "won g100"),
  f("Samir Handanović", "svn", "udi inter", "won a300"),
  f("Marcelo Brozović", "cro", "inter", "won"),
  f("Nicolò Barella", "ita", "cag inter", "won"),
  f("Milan Škriniar", "svk", "sam inter", "won"),
  f("Radja Nainggolan", "bel", "cag rom inter", "a300"),
  f("Romelu Lukaku", "bel", "inter nap", "won"),
  f("Diego Maradona", "arg", "nap", "won"),
  f("Careca", "bra", "nap", "won"),
  f("Edinson Cavani", "uru", "pal nap", ""),
  f("Marek Hamšík", "svk", "nap", "a300"),
  f("Lorenzo Insigne", "ita", "nap", "g100 a300"),
  f("Dries Mertens", "bel", "nap", "g100 a300"),
  f("José Callejón", "esp", "nap", "a300"),
  f("Giovanni Di Lorenzo", "ita", "emp nap", "won a300"),
  f("Piotr Zieliński", "pol", "udi nap inter", "won a300"),
  f("Victor Osimhen", "nga", "nap", "won"),
  f("Khvicha Kvaratskhelia", "geo", "nap", "won"),
  f("Stanislav Lobotka", "svk", "nap", "won"),
  f("Ezequiel Lavezzi", "arg", "nap", ""),
  f("Ciro Immobile", "ita", "tor laz", "g100 a300"),
  f("Giuseppe Signori", "ita", "laz bol", "g100 a300"),
  f("Juan Sebastián Verón", "arg", "par laz inter", "won"),
  f("Sinisa Mihajlović", "srb", "sam laz inter", "won a300"),
  f("Dejan Stanković", "srb", "laz inter", "won a300"),
  f("Diego Simeone", "arg", "inter laz ata", "won"),
  f("Miroslav Klose", "ger", "laz", ""),
  f("Sergej Milinković-Savić", "srb", "laz", "a300"),
  f("Luis Alberto", "esp", "laz", ""),
  f("Felipe Anderson", "bra", "laz", ""),
  f("Rui Costa", "por", "fio mil", "won a300"),
  f("Luca Toni", "ita", "fio", "g100"),
  f("Alberto Gilardino", "ita", "ver par mil fio gen", "g100 a300"),
  f("Adrian Mutu", "rou", "par juv fio", ""),
  f("Federico Chiesa", "ita", "fio juv", "won"),
  f("Dušan Vlahović", "srb", "fio juv", ""),
  f("Franck Ribéry", "fra", "fio", ""),
  f("Antonio Di Natale", "ita", "udi", "g100 a300"),
  f("Alexis Sánchez", "chi", "udi inter", ""),
  f("Fabio Quagliarella", "ita", "tor nap juv sam udi", "won g100 a300"),
  f("Roberto Mancini", "ita", "sam laz", "won a300"),
  f("Gianluca Pagliuca", "ita", "sam inter bol", "a300"),
  f("Andrea Belotti", "ita", "pal tor", "g100"),
  f("Paolo Pulici", "ita", "tor", "g100 a300"),
  f("Duván Zapata", "col", "nap sam ata tor", "g100"),
  f("Luis Muriel", "col", "udi sam ata", ""),
  f("Josip Iličić", "svn", "pal fio ata", ""),
  f("Papu Gómez", "arg", "cat ata", ""),
  f("Robin Gosens", "ger", "ata inter fio", ""),
  f("Alessandro Bastoni", "ita", "par ata inter", "won"),
  f("Sebastian Giovinco", "ita", "par juv", ""),
  f("Thiago Motta", "bra ita", "gen inter", "won"),
  f("Domenico Criscito", "ita", "gen", "a300"),
  f("Rodrigo Palacio", "arg", "gen inter bol", "a300"),
  f("Mattia Perin", "ita", "gen juv", ""),
  f("Dino Baggio", "ita", "tor juv par laz", "won"),
  f("Amoroso", "bra", "udi par", ""),
  f("Dario Hübner", "ita", "bre pia ces par", "g100"),
];

// Extra clubs for Serie A players already listed above.
const SA_ALSO: Record<string, string> = {
  "Cristiano Ronaldo": "rma mun",
  "Zlatan Ibrahimović": "bar psg mun ajax",
  "Gonzalo Higuaín": "rma che",
  "Kaká": "rma",
  "Ronaldo": "bar rma",
  "Ronaldinho": "bar psg",
  "Andriy Shevchenko": "che",
  "Hernán Crespo": "che",
  "Patrick Vieira": "ars mci",
  "Zinedine Zidane": "rma",
  "Clarence Seedorf": "ajax rma",
  "Edgar Davids": "ajax bar tot",
  "Thiago Silva": "psg che",
  "Romelu Lukaku": "che mun",
  "Edinson Cavani": "psg mun",
  "Carlos Tevez": "mun mci",
  "Adrian Mutu": "che",
  "Cafu": "bar",
  "Samuel Eto'o": "bar che",
  "Diego Simeone": "atm",
  "Christian Vieri": "atm",
  "Fabio Cannavaro": "rma",
  "Gianluigi Buffon": "psg",
  "Marco van Basten": "ajax",
  "Ruud Gullit": "ajax che",
  "Alexis Sánchez": "bar ars mun",
  "Arturo Vidal": "bay bar",
  "Dušan Vlahović": "ars",
  "Wesley Sneijder": "rma ajax",
};

// Managers and the players they coached (any club). Applied as "m_<key>" tags to every league's players.
const MANAGERS: Record<string, { label: string; players: string }> = {
  ferguson: { label: "Alex Ferguson", players: "Wayne Rooney|Cristiano Ronaldo|Ryan Giggs|Paul Scholes|Eric Cantona|Andy Cole|Andrew Cole|Ruud van Nistelrooy|Robin van Persie|David Beckham|Gary Neville|Roy Keane|Rio Ferdinand|Michael Carrick|Dwight Yorke|Teddy Sheringham|Ole Gunnar Solskjær|Dimitar Berbatov|Carlos Tevez|Paul Pogba" },
  wenger: { label: "Arsène Wenger", players: "Thierry Henry|Dennis Bergkamp|Patrick Vieira|Cesc Fàbregas|Tony Adams|Theo Walcott|Jack Wilshere|Olivier Giroud|David Seaman|Ray Parlour|Mesut Özil|Nicolas Anelka|Samir Nasri|Gaël Clichy|Bacary Sagna|Gilberto Silva|Robin van Persie|Ashley Cole|Pierre-Emerick Aubameyang|Ian Wright|Bukayo Saka|Marc Overmars|Emmanuel Adebayor" },
  mourinho: { label: "José Mourinho", players: "Frank Lampard|John Terry|Didier Drogba|Petr Čech|Ashley Cole|Joe Cole|Claude Makélélé|Eden Hazard|Diego Costa|Cesc Fàbregas|Juan Mata|Paul Pogba|Marcus Rashford|Romelu Lukaku|Anthony Martial|Harry Kane|Son Heung-min|Michael Carrick|Luke Shaw|Ashley Young|Ricardo Carvalho|Cristiano Ronaldo|Karim Benzema|Sergio Ramos|Iker Casillas|Xabi Alonso|Marcelo|Ángel Di María|Gonzalo Higuaín|Pepe|Mesut Özil|Zlatan Ibrahimović|Wesley Sneijder|Samuel Eto'o|Diego Milito|Javier Zanetti|Esteban Cambiasso|Maicon|Lúcio|Marco Materazzi|Casemiro|Raphaël Varane|Fábio Coentrão|Kaká|Edin Džeko|Paulo Dybala|Gareth Bale|Emerson Royal|Hugo Lloris|Dele Alli" },
  guardiola: { label: "Pep Guardiola", players: "Kevin De Bruyne|David Silva|Raheem Sterling|Kyle Walker|Sergio Agüero|Rodri|Ederson|Fernandinho|Aymeric Laporte|Gabriel Jesus|Erling Haaland|Riyad Mahrez|Benjamin Mendy|Ferran Torres|Yaya Touré|Vincent Kompany|Lionel Messi|Xavi|Andrés Iniesta|Gerard Piqué|Sergio Busquets|Pedro|Dani Alves|David Villa|Samuel Eto'o|Éric Abidal|Zlatan Ibrahimović|Thiago Alcântara|Jordi Alba|Cesc Fàbregas|Javier Mascherano|Neymar|Luis Suárez|Carles Puyol|Robert Lewandowski|Thomas Müller|Manuel Neuer|Franck Ribéry|Arjen Robben|Joshua Kimmich|David Alaba|Mario Götze|Xabi Alonso|Douglas Costa|Kingsley Coman|Julián Álvarez|Jules Koundé|Philippe Coutinho" },
  klopp: { label: "Jürgen Klopp", players: "Mohamed Salah|Sadio Mané|Roberto Firmino|Jordan Henderson|Virgil van Dijk|James Milner|Trent Alexander-Arnold|Thiago Alcântara|Philippe Coutinho|Adam Lallana|Nathaniel Clyne|Danny Ings|Marco Reus|Mats Hummels|Mario Götze|Robert Lewandowski|Luis Suárez|Steven Gerrard|Daniel Sturridge|Divock Origi|Georginio Wijnaldum|Fabinho|Alisson|Joel Matip|Andy Robertson|Dominik Szoboszlai" },
  ancelotti: { label: "Carlo Ancelotti", players: "Cristiano Ronaldo|Karim Benzema|Gareth Bale|Sergio Ramos|Luka Modrić|Toni Kroos|Marcelo|Casemiro|Xabi Alonso|Ángel Di María|Raphaël Varane|Pepe|Iker Casillas|Isco|Dani Carvajal|Vinícius Júnior|Rodrygo|Éder Militão|Thibaut Courtois|Fábio Coentrão|Frank Lampard|John Terry|Didier Drogba|Petr Čech|Ashley Cole|Michael Essien|Nicolas Anelka|Joe Cole|Andrea Pirlo|Paolo Maldini|Kaká|Clarence Seedorf|Gennaro Gattuso|Filippo Inzaghi|Andriy Shevchenko|Alessandro Nesta|Ronaldinho|Massimo Ambrosini|Thiago Silva|Zlatan Ibrahimović|Robinho|Marco Verratti|Edinson Cavani|Zinedine Zidane|Alessandro Del Piero|Gianluigi Buffon|Edgar Davids|Pavel Nedvěd|David Trezeguet|Lilian Thuram|Lorenzo Insigne|Dries Mertens|Piotr Zieliński|José Callejón|Marek Hamšík|Fabián Ruiz|Richarlison|Dominic Calvert-Lewin|Jordan Pickford|Lucas Digne|Seamus Coleman|Gylfi Sigurdsson|Theo Walcott|Jamie Vardy" },
  zidane: { label: "Zinedine Zidane", players: "Cristiano Ronaldo|Karim Benzema|Gareth Bale|Sergio Ramos|Luka Modrić|Toni Kroos|Marcelo|Casemiro|Isco|Dani Carvajal|Raphaël Varane|Pepe|Marcos Llorente|Álvaro Morata|Fábio Coentrão|Vinícius Júnior|Rodrygo|Éder Militão|Thibaut Courtois|Álvaro Odriozola|Martin Ødegaard|Marco Asensio" },
  luisenrique: { label: "Luis Enrique", players: "Lionel Messi|Neymar|Luis Suárez|Andrés Iniesta|Gerard Piqué|Sergio Busquets|Ivan Rakitić|Dani Alves|Jordi Alba|Javier Mascherano|Marc-André ter Stegen|Pedro|Xavi|Marc Bartra|Philippe Coutinho|Ousmane Dembélé|Antoine Griezmann|Kylian Mbappé|Marquinhos|Achraf Hakimi|Marco Verratti|Francesco Totti|Daniele De Rossi|Edin Džeko" },
  simeone: { label: "Diego Simeone", players: "Antoine Griezmann|Diego Godín|Jan Oblak|Koke|Gabi|Saúl Ñíguez|Diego Costa|Fernando Torres|David Villa|Thibaut Courtois|Raúl García|Filipe Luís|Marcos Llorente|Ángel Correa|Julián Álvarez|Rodrigo De Paul|Luis Suárez|Edinson Cavani|Raúl Albiol|Jose Maria Giménez|Arda Turan|Adrián" },
  benitez: { label: "Rafa Benítez", players: "Steven Gerrard|Jamie Carragher|Fernando Torres|Xabi Alonso|Sami Hyypiä|Peter Crouch|Javier Mascherano|Pepe Reina|Dirk Kuyt|Rubén Baraja|David Albelda|Carlos Marchena|Roberto Ayala|Pablo Aimar|Frank Lampard|Eden Hazard|Juan Mata|David Luiz|Zinedine Zidane|Cristiano Ronaldo|Dimitri Payet|Nacho|Marek Hamšík|Lorenzo Insigne|Gonzalo Higuaín|José Callejón|Dries Mertens|Jordan Henderson|Maxi Rodríguez|Joe Cole|Robbie Keane|Dani Parejo" },
  conte: { label: "Antonio Conte", players: "Eden Hazard|Diego Costa|N'Golo Kanté|César Azpilicueta|Willian|Pedro|Marcos Alonso|David Luiz|Thibaut Courtois|Cesc Fàbregas|Gianluigi Buffon|Andrea Pirlo|Arturo Vidal|Carlos Tevez|Leonardo Bonucci|Giorgio Chiellini|Andrea Barzagli|Claudio Marchisio|Paul Pogba|Fabio Quagliarella|Romelu Lukaku|Lautaro Martínez|Nicolò Barella|Marcelo Brozović|Samir Handanović|Milan Škriniar|Alexis Sánchez|Achraf Hakimi|Alessandro Bastoni|Diego Godín|Harry Kane|Son Heung-min|Hugo Lloris|Pierre-Emile Højbjerg|Giovanni Di Lorenzo|Stanislav Lobotka|Kevin De Bruyne|Hakan Çalhanoğlu" },
  ranieri: { label: "Claudio Ranieri", players: "Jamie Vardy|Riyad Mahrez|Wes Morgan|Kasper Schmeichel|Danny Drinkwater|N'Golo Kanté|Marc Albrighton|Frank Lampard|John Terry|Petr Čech|Claude Makélélé|Ashley Cole|Joe Cole|William Gallas|Francesco Totti|Daniele De Rossi|Julio Baptista|Gabriel Batistuta|Gianfranco Zola|Radamel Falcao|Fernando Torres|Gaizka Mendieta|Rubén Baraja|Roberto Ayala|Pablo Aimar|David Albelda|Carlos Marchena|Marcos Senna|Wayne Bridge|Mikel Arteta|Mauro Icardi|Philippe Coutinho" },
  pochettino: { label: "Mauricio Pochettino", players: "Harry Kane|Son Heung-min|Hugo Lloris|Tanguy Ndombele|Pierre-Emile Højbjerg|Dele Alli|Christian Eriksen|Jan Vertonghen|Morgan Schneiderlin|Nathaniel Clyne|Adam Lallana|Rickie Lambert|Dušan Tadić|Ryan Bertrand|Luke Shaw|Neymar|Kylian Mbappé|Marco Verratti|Marquinhos|Achraf Hakimi|Lionel Messi|Sergio Ramos|Ángel Di María|Cole Palmer|Raheem Sterling|Thiago Silva|Nicolas Jackson|Joan Capdevila" },
  emery: { label: "Unai Emery", players: "Pierre-Emerick Aubameyang|Mesut Özil|Bukayo Saka|Héctor Bellerín|Gerard Moreno|Bruno Soriano|Pepe Reina|Ivan Rakitić|Jesús Navas|Éver Banega|Kevin Gameiro|David Villa|David Silva|Juan Mata|Jordi Alba|Roberto Soldado|Daniel Parejo|Joaquín|Neymar|Kylian Mbappé|Edinson Cavani|Marco Verratti|Thiago Silva|Marquinhos|Gianluigi Buffon|Ángel Di María|Dani Alves|Emiliano Martínez|Ollie Watkins|Philippe Coutinho|Jack Grealish|Aaron Ramsey|Granit Xhaka|Alexandre Lacazette|Nacho Monreal|Joel Campbell" },
  pellegrini: { label: "Manuel Pellegrini", players: "Sergio Agüero|Yaya Touré|Vincent Kompany|David Silva|Fernandinho|Samir Nasri|Edin Džeko|Pablo Zabaleta|Jesús Navas|Michail Antonio|Declan Rice|Mark Noble|Cristiano Ronaldo|Karim Benzema|Xabi Alonso|Iker Casillas|Sergio Ramos|Raúl|Guti|Marcelo|Rafael van der Vaart|Gonzalo Higuaín|Kaká|Juan Román Riquelme|Diego Forlán|Marcos Senna|Giuseppe Rossi|Santi Cazorla|Joan Capdevila|Nabil Fekir|Joaquín|Sergio Canales|Borja Iglesias|Héctor Bellerín|William Carvalho|Giovani Lo Celso|Claudio Bravo|Marc Bartra|Emerson Royal|Willian José|Andrés Guardado|Pepe Reina|Jarrod Bowen|Lucas Paquetá|Raúl Albiol|Mesut Özil|Lucas Silva" },
  mancini: { label: "Roberto Mancini", players: "Sergio Agüero|Carlos Tevez|Yaya Touré|Vincent Kompany|David Silva|Pablo Zabaleta|Samir Nasri|Edin Džeko|Gareth Barry|Emmanuel Adebayor|Zlatan Ibrahimović|Javier Zanetti|Esteban Cambiasso|Marco Materazzi|Adriano|Álvaro Recoba|Iván Córdoba|Maicon|Dejan Stanković|Juan Sebastián Verón|Walter Samuel|Pavel Nedvěd|Diego Simeone|Sinisa Mihajlović|Alessandro Nesta|Hernán Crespo|Julio Cesar|Wesley Sneijder|Mauro Icardi|Radja Nainggolan|Gianluca Pagliuca|Roberto Mancini|Ivan Perišić|Rui Costa|Luca Toni|Adrian Mutu|Alberto Gilardino|Francesco Toldo" },
  allegri: { label: "Massimiliano Allegri", players: "Gianluigi Buffon|Giorgio Chiellini|Leonardo Bonucci|Andrea Barzagli|Claudio Marchisio|Paul Pogba|Paulo Dybala|Gonzalo Higuaín|Carlos Tevez|Andrea Pirlo|Arturo Vidal|Cristiano Ronaldo|Federico Chiesa|Dušan Vlahović|Fabio Quagliarella|Zlatan Ibrahimović|Thiago Silva|Robinho|Kaká|Clarence Seedorf|Gennaro Gattuso|Alessandro Nesta|Filippo Inzaghi|Massimo Ambrosini|Alexis Sánchez|Antonio Cassano|Ronaldinho|Mario Mandžukić|Juan Cuadrado|Sami Khedira|Douglas Costa" },
  spalletti: { label: "Luciano Spalletti", players: "Francesco Totti|Daniele De Rossi|Edin Džeko|Radja Nainggolan|Mohamed Salah|Antonio Rüdiger|Mauro Icardi|Milan Škriniar|Marcelo Brozović|Samir Handanović|João Cancelo|Matteo Politano|Lautaro Martínez|Victor Osimhen|Khvicha Kvaratskhelia|Stanislav Lobotka|Piotr Zieliński|Giovanni Di Lorenzo|Alessandro Florenzi|Philippe Mexès|Vincent Candela|Ciro Immobile|Daniele Padelli|Marco Cassetti|Wesley Sneijder|Nicolò Barella|Gabriel Jesus" },
  sarri: { label: "Maurizio Sarri", players: "Marek Hamšík|Lorenzo Insigne|Dries Mertens|José Callejón|Gonzalo Higuaín|Eden Hazard|N'Golo Kanté|Álvaro Morata|Pedro|Willian|César Azpilicueta|David Luiz|Marcos Alonso|Cesc Fàbregas|Olivier Giroud|Kepa Arrizabalaga|Cristiano Ronaldo|Paulo Dybala|Gianluigi Buffon|Giorgio Chiellini|Leonardo Bonucci|Douglas Costa|Ciro Immobile|Sergej Milinković-Savić|Luis Alberto|Felipe Anderson|Mateo Kovačić|Gabriel Jesus|Daniele Rugani|Emerson" },
  pioli: { label: "Stefano Pioli", players: "Zlatan Ibrahimović|Rafael Leão|Mike Maignan|Theo Hernández|Olivier Giroud|Sandro Tonali|Hakan Çalhanoğlu|Mauro Icardi|Marcelo Brozović|Samir Handanović|Felipe Anderson|Miroslav Klose|Federico Chiesa|Cristian Zapata|Antonio Candreva|Duván Zapata|Alessandro Bastoni|Kalidou Koulibaly|Alexis Sánchez|Marcos Alonso|Fikayo Tomori|Christian Pulisic" },
  inzaghi: { label: "Simone Inzaghi", players: "Lautaro Martínez|Nicolò Barella|Marcelo Brozović|Samir Handanović|Milan Škriniar|Alessandro Bastoni|Hakan Çalhanoğlu|Edin Džeko|Romelu Lukaku|Alexis Sánchez|Ciro Immobile|Sergej Milinković-Savić|Luis Alberto|Felipe Anderson|Mehdi Taremi|Benjamin Pavard|Francesco Acerbi|Henrikh Mkhitaryan|Achraf Hakimi|Marcus Thuram|Federico Dimarco|Matteo Darmian|Piotr Zieliński|Joaquín Correa|Danilo D'Ambrosio" },
  lippi: { label: "Marcello Lippi", players: "Alessandro Del Piero|Zinedine Zidane|Gianluca Vialli|Edgar Davids|Filippo Inzaghi|Lilian Thuram|Pavel Nedvěd|David Trezeguet|Gianluigi Buffon|Fabio Cannavaro|Christian Vieri|Roberto Baggio|Ronaldo|Álvaro Recoba|Javier Zanetti|Alessandro Nesta|Gianfranco Zola|Andrea Pirlo|Gennaro Gattuso|Francesco Totti|Luca Toni|Alberto Gilardino|Marco Materazzi|Simone Pepe|Mauro Camoranesi|Gianluca Zambrotta|Daniele De Rossi|Andrea Barzagli|Vincenzo Montella|Ciro Ferrara|Angelo Peruzzi|Paulo Sousa|Didier Deschamps|Antonio Conte" },
  capello: { label: "Fabio Capello", players: "Paolo Maldini|Franco Baresi|Alessandro Costacurta|Marco van Basten|Ruud Gullit|Frank Rijkaard|Zvonimir Boban|George Weah|Francesco Totti|Gabriel Batistuta|Vincenzo Montella|Marco Delvecchio|Vincent Candela|Cafu|Aldair|Emerson|Walter Samuel|Daniele De Rossi|Zlatan Ibrahimović|Fabio Cannavaro|Gianluigi Buffon|Patrick Vieira|Pavel Nedvěd|Alessandro Del Piero|David Trezeguet|Lilian Thuram|Raúl|Iker Casillas|Fernando Hierro|Roberto Carlos|Guti|Sergio Ramos|Ruud van Nistelrooy|Robinho|Julio Baptista|Gonzalo Higuaín|Wayne Rooney|Steven Gerrard|David Beckham|Frank Lampard|Jermain Defoe|Peter Crouch|Ashley Cole|Rio Ferdinand|John Terry|Michael Owen|Joe Cole" },
  moyes: { label: "David Moyes", players: "Tim Cahill|Leighton Baines|Phil Jagielka|Seamus Coleman|Marouane Fellaini|Tim Howard|Joleon Lescott|Romelu Lukaku|Ross Barkley|Wayne Rooney|Duncan Ferguson|Robin van Persie|Juan Mata|Michael Carrick|Ryan Giggs|Rio Ferdinand|Ashley Young|Declan Rice|Michail Antonio|Mark Noble|Jarrod Bowen|Lucas Paquetá|Carlos Vela|Mikel Arteta|Steven Pienaar|Gareth Barry|Dominic Calvert-Lewin|Jordan Pickford|Aaron Lennon" },
  redknapp: { label: "Harry Redknapp", players: "Gareth Bale|Luka Modrić|Rafael van der Vaart|Jermain Defoe|Peter Crouch|Ledley King|Frank Lampard|Rio Ferdinand|Joe Cole|Paolo Di Canio|Michael Carrick|Emmanuel Adebayor|Darren Bent|Teddy Sheringham|Dimitar Berbatov|Sol Campbell|Kanu|David James|Glen Johnson|Niko Kranjčar|Tim Cahill|Craig Bellamy|Scott Parker|Matt Le Tissier|Shay Given|Robbie Keane" },
  keegan: { label: "Kevin Keegan", players: "Alan Shearer|Les Ferdinand|Rob Lee|Nicolas Anelka|Shay Given|Michael Owen|Peter Beardsley|David Ginola|Craig Bellamy|Joey Barton|Andy Carroll|Joe Cole|Shaun Wright-Phillips|Claudio Reyna|Steve McManaman|Emmanuel Adebayor|Joleon Lescott" },
  hodgson: { label: "Roy Hodgson", players: "Steven Gerrard|Jamie Carragher|Fernando Torres|Pepe Reina|Javier Mascherano|Dirk Kuyt|Ryan Babel|Christian Benteke|Wilfried Zaha|Andros Townsend|Jordan Henderson|Raheem Sterling|Clint Dempsey|Danny Murphy|Zoltán Gera|Mark Schwarzer|Bobby Zamora|Papiss Cissé|Jermaine Beckford" },
  delbosque: { label: "Vicente del Bosque", players: "Raúl|Iker Casillas|Fernando Hierro|Roberto Carlos|Guti|Zinedine Zidane|Ronaldo|Claude Makélélé|Luís Figo|Fernando Morientes|Michel Salgado|Steve McManaman|Xavi|Andrés Iniesta|Sergio Ramos|Carles Puyol|Gerard Piqué|Sergio Busquets|David Villa|Fernando Torres|Xabi Alonso|Cesc Fàbregas|Pedro|Juan Mata|David Silva|Santi Cazorla|Jesús Navas|Álvaro Arbeloa|Joan Capdevila|Carlos Marchena|Raúl Albiol|Fernando Llorente|Pepe Reina|Koke|Diego Costa|Álvaro Morata|Isco" },
  rijkaard: { label: "Frank Rijkaard", players: "Ronaldinho|Samuel Eto'o|Lionel Messi|Xavi|Andrés Iniesta|Carles Puyol|Deco|Ludovic Giuly|Thierry Henry|Éric Abidal|Lilian Thuram|Henrik Larsson|Rafael Márquez|Víctor Valdés|Giovanni van Bronckhorst|Gerard Piqué|Dani Alves|Bojan Krkić|Santiago Ezquerro|Eidur Gudjohnsen|Javier Saviola|Yaya Touré|Ludovic Giuly|Philippe Mexès|Edmílson" },
  lopetegui: { label: "Julen Lopetegui", players: "Karim Benzema|Sergio Ramos|Luka Modrić|Toni Kroos|Gareth Bale|Marcelo|Casemiro|Dani Carvajal|Isco|Marco Asensio|Thibaut Courtois|Vinícius Júnior|Raphaël Varane|Nacho|Ivan Rakitić|Jules Koundé|Diego Carlos|Jesús Navas|Papu Gómez|Lucas Ocampos|Éver Banega|Iago Aspas|Raúl Albiol|Papu|Álvaro Morata|Isco" },
  valverde: { label: "Ernesto Valverde", players: "Lionel Messi|Luis Suárez|Gerard Piqué|Sergio Busquets|Ivan Rakitić|Jordi Alba|Marc-André ter Stegen|Philippe Coutinho|Ousmane Dembélé|Antoine Griezmann|Andrés Iniesta|Arturo Vidal|Frenkie de Jong|Aritz Aduriz|Iker Muniain|Ander Herrera|Javi Martínez|Markel Susaeta|Óscar de Marcos|Kepa Arrizabalaga|Iñaki Williams|Joseba Etxeberria|Giuseppe Rossi|Bruno Soriano|Marcos Senna|Santi Cazorla|Joan Capdevila|Diego Forlán|Carlos Marchena|Dani Parejo|Raphinha|Ousmane Dembélé|Carles Aleñá|Carles Puyol|Neymar|Paulinho|Rodrigo Moreno" },
  xavi: { label: "Xavi Hernández", players: "Robert Lewandowski|Raphinha|Jules Koundé|Frenkie de Jong|Ousmane Dembélé|Gerard Piqué|Sergio Busquets|Jordi Alba|Marc-André ter Stegen|Ferran Torres|Philippe Coutinho|Ansu Fati|Pedri|Gavi|Andreas Christensen|João Cancelo|İlkay Gündoğan|Memphis Depay|Luuk de Jong|Sergio Agüero|Antoine Griezmann|Martin Braithwaite|Eric García|Franck Kessié|Pierre-Emerick Aubameyang|Adama Traoré|Marcos Alonso|Clément Lenglet|Iñigo Martínez" },
  flick: { label: "Hansi Flick", players: "Robert Lewandowski|Thomas Müller|Manuel Neuer|Joshua Kimmich|Kingsley Coman|David Alaba|Thiago Alcântara|Lucas Hernández|Benjamin Pavard|Leon Goretzka|Serge Gnabry|Philippe Coutinho|Ivan Perišić|Raphinha|Jules Koundé|Frenkie de Jong|Marc-André ter Stegen|Ferran Torres|Dani Olmo|Jordi Alba|Gerard Piqué|Ilkay Gündoğan|Eric García|Marcus Rashford|Gavi|Pedri" },
  heynckes: { label: "Jupp Heynckes", players: "Franck Ribéry|Arjen Robben|Thomas Müller|Manuel Neuer|Mario Mandžukić|David Alaba|Toni Kroos|Thiago Alcântara|Bastian Schweinsteiger|Philipp Lahm|Jérôme Boateng|Javi Martínez|Luiz Gustavo|Dante|Mario Gómez|Xherdan Shaqiri|Robert Lewandowski|Joshua Kimmich|Arturo Vidal|Raúl|Fernando Hierro|Roberto Carlos|Clarence Seedorf|Fernando Redondo|Fernando Morientes|Davor Šuker|Predrag Mijatović|Christian Panucci|Iván Helguera" },
  tuchel: { label: "Thomas Tuchel", players: "Kai Havertz|Thiago Silva|N'Golo Kanté|César Azpilicueta|Romelu Lukaku|Edouard Mendy|Antonio Rüdiger|Mason Mount|Timo Werner|Kylian Mbappé|Neymar|Ángel Di María|Marco Verratti|Marquinhos|Edinson Cavani|Marco Reus|Mats Hummels|Pierre-Emerick Aubameyang|Ousmane Dembélé|Harry Kane|Thomas Müller|Manuel Neuer|Joshua Kimmich|Kingsley Coman|Matthijs de Ligt|Mario Götze|Achraf Hakimi|Mauro Icardi|Presnel Kimpembe|Pedro|Hakim Ziyech|Christian Pulisic|Jorginho|Mateo Kovačić" },
  vangaal: { label: "Louis van Gaal", players: "Xavi|Luis Enrique|Rivaldo|Patrick Kluivert|Marc Overmars|Edgar Davids|Clarence Seedorf|Arjen Robben|Franck Ribéry|Thomas Müller|Toni Kroos|David Alaba|Luiz Gustavo|Wayne Rooney|Marcus Rashford|Anthony Martial|Juan Mata|Ander Herrera|Michael Carrick|Luke Shaw|Ashley Young|Ángel Di María|Daley Blind|Memphis Depay|Bastian Schweinsteiger|Philipp Lahm|Frank de Boer|Ronald de Boer|Michael Reiziger|Winston Bogarde|Jari Litmanen|Gerard Piqué|Cesc Fàbregas|Carles Puyol|Víctor Valdés|Andrés Iniesta|Sergio Busquets" },
};

const BALLON_DOR = "Cristiano Ronaldo|Lionel Messi|Karim Benzema|Luka Modrić|Kaká|Ronaldinho|Ronaldo|Rivaldo|Zinedine Zidane|Michael Owen|Fabio Cannavaro|Andriy Shevchenko|George Weah|Marco van Basten|Ruud Gullit|Michel Platini|Roberto Baggio|Pavel Nedvěd|Alfredo Di Stéfano|Alfredo Di Stefano|Hristo Stoichkov|Luis Figo|Gerd Müller|Rodri";
const WORLD_CUP_WINNERS = "Ronaldo|Cafu|Roberto Carlos|Rivaldo|Ronaldinho|Kaká|Aldair|Iker Casillas|Sergio Ramos|Gerard Piqué|Carles Puyol|Xavi|Andrés Iniesta|Sergio Busquets|David Villa|Fernando Torres|Xabi Alonso|Pedro|Cesc Fàbregas|Juan Mata|Jesús Navas|Pepe Reina|Álvaro Arbeloa|Joan Capdevila|Carlos Marchena|Fernando Llorente|David Silva|Santi Cazorla|Zinedine Zidane|Lilian Thuram|Thierry Henry|David Trezeguet|Patrick Vieira|Bixente Lizarazu|Kylian Mbappé|Antoine Griezmann|Olivier Giroud|Paul Pogba|N'Golo Kanté|Raphaël Varane|Hugo Lloris|Lucas Hernández|Benjamin Pavard|Ousmane Dembélé|Gianluigi Buffon|Fabio Cannavaro|Andrea Pirlo|Francesco Totti|Alessandro Del Piero|Filippo Inzaghi|Gennaro Gattuso|Marco Materazzi|Andrea Barzagli|Luca Toni|Alberto Gilardino|Alessandro Nesta|Manuel Neuer|Thomas Müller|Toni Kroos|Mario Götze|Miroslav Klose|Mats Hummels|Mesut Özil|Lionel Messi|Ángel Di María|Emiliano Martínez|Julián Álvarez|Rodrigo De Paul|Lautaro Martínez|Papu Gómez|Ángel Correa|Gonzalo Montiel|Marcos Acuña|Alexis Mac Allister|Giovani Lo Celso|Ronaldo|Gabriel Batistuta";

function enrich(facts: Fact[]): Fact[] {
  const mark = (names: string, tag: string) => {
    const set = new Set(names.split("|"));
    for (const fact of facts) if (set.has(fact.name) && !fact.tags.includes(tag)) fact.tags.push(tag);
  };
  for (const [key, manager] of Object.entries(MANAGERS)) mark(manager.players, `m_${key}`);
  mark(BALLON_DOR, "bd");
  mark(WORLD_CUP_WINNERS, "wc");
  return facts;
}

// Applies the up-to-date career list (Club Duel data) to players already in a game's pool.
function applyCareers(facts: Fact[]): Fact[] {
  const byName = new Map<string, Fact>();
  for (const fact of facts) byName.set(normalizeFootballPlayerName(fact.name), fact);
  for (const line of CAREERS.split("\n")) {
    const [name, keys] = line.split(":");
    if (!name || !keys) continue;
    const fact = byName.get(normalizeFootballPlayerName(name.trim()));
    if (!fact) continue;
    for (const club of keys.trim().split(/\s+/)) if (!fact.clubs.includes(club)) fact.clubs.push(club);
  }
  return facts;
}

const FACTS: Record<Competition, Fact[]> = {
  pl: applyCareers(enrich(merge(PL_FACTS, PL_ALSO, PL_EXTRA))),
  laliga: applyCareers(enrich(merge(LALIGA_FACTS, LL_ALSO, LL_EXTRA))),
  ucl: applyCareers(enrich(merge(UCL_FACTS, UCL_ALSO, UCL_EXTRA))),
  seriea: applyCareers(enrich(merge(SA_FACTS, SA_ALSO, []))),
};

export function footballTicTacToePlayerNames(comp: Competition) {
  return FACTS[comp].map((fact) => fact.name);
}

export function footballCareers(): { name: string; clubs: string[] }[] {
  return (Object.keys(FACTS) as Competition[]).flatMap((comp) =>
    FACTS[comp].map((fact) => ({ name: fact.name, clubs: fact.clubs })),
  );
}

const club = (label: string, badge: string, key: string, short = label): Def => ({
  clue: { label, badge, badgeAlt: `${short} crest` },
  test: (fact) => fact.clubs.includes(key),
});
const NAT_KEYS: Record<string, string> = {
  es: "esp", fr: "fra", br: "bra", ar: "arg", pt: "por", "gb-eng": "eng", nl: "ned", be: "bel",
  de: "ger", it: "ita", uy: "uru", mx: "mex", hr: "cro", "gb-wls": "wal", sn: "sen", rs: "srb",
};
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
const SA_CLUBS = {
  juv: (prefix = "") => club(`${prefix}Juventus`, "https://a.espncdn.com/i/teamlogos/soccer/500/111.png", "juv", "Juventus"),
  inter: (prefix = "") => club(`${prefix}Inter`, "https://a.espncdn.com/i/teamlogos/soccer/500/110.png", "inter", "Inter"),
  mil: (prefix = "") => club(`${prefix}AC Milan`, "https://a.espncdn.com/i/teamlogos/soccer/500/103.png", "mil", "AC Milan"),
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
  seriea: [
    build(
      "seriea",
      [national("Italy international", "it"), stat("Serie A winner", "won"), stat("100+ Serie A goals", "g100")],
      [SA_CLUBS.juv(P), SA_CLUBS.inter(P), SA_CLUBS.mil(P)],
    ),
    build(
      "seriea",
      [stat("Serie A winner", "won"), stat("300+ Serie A appearances", "a300"), national("Argentina international", "ar")],
      [SA_CLUBS.juv(P), SA_CLUBS.inter(P), SA_CLUBS.mil(P)],
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
  seriea: FOOTBALL_TIC_TAC_TOE_VARIANTS.seriea[0],
};

function shuffledIndexes() {
  const indexes = [0, 1, 2];
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }
  return indexes;
}

const espn = (id: number) => `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`;
const POOL_CLUBS: Record<Competition, Def[]> = {
  pl: [
    PL_CLUBS.mun(P), PL_CLUBS.liv(P), PL_CLUBS.ars(P), PL_CLUBS.che(P), PL_CLUBS.mci(P), PL_CLUBS.tot(P),
    club(`${P}Everton`, "/club-logos/everton.svg", "eve", "Everton"),
    club(`${P}Newcastle`, "/club-logos/newcastle.svg", "new", "Newcastle"),
    club(`${P}West Ham`, "/club-logos/west-ham.svg", "wham", "West Ham"),
    club(`${P}Leicester City`, "/club-logos/leicester.svg", "lei", "Leicester City"),
    club(`${P}Aston Villa`, "/club-logos/aston-villa.svg", "avl", "Aston Villa"),
    club(`${P}Southampton`, "/club-logos/southampton.svg", "sou", "Southampton"),
  ],
  laliga: [
    LL_CLUBS.rma(P), LL_CLUBS.bar(P), LL_CLUBS.atm(P),
    club(`${P}Valencia`, espn(94), "val", "Valencia"),
    club(`${P}Sevilla`, espn(243), "sev", "Sevilla"),
    club(`${P}Villarreal`, espn(102), "vil", "Villarreal"),
    club(`${P}Athletic Club`, espn(93), "ath", "Athletic Club"),
    club(`${P}Real Sociedad`, espn(89), "soc", "Real Sociedad"),
    club(`${P}Real Betis`, espn(244), "bet", "Real Betis"),
  ],
  seriea: [
    club(`${P}Juventus`, espn(111), "juv", "Juventus"),
    club(`${P}Inter`, espn(110), "inter", "Inter"),
    club(`${P}AC Milan`, espn(103), "mil", "AC Milan"),
    club(`${P}Roma`, espn(104), "rom", "Roma"),
    club(`${P}Napoli`, espn(114), "nap", "Napoli"),
    club(`${P}Lazio`, espn(112), "laz", "Lazio"),
    club(`${P}Fiorentina`, espn(109), "fio", "Fiorentina"),
    club(`${P}Atalanta`, espn(105), "ata", "Atalanta"),
    club(`${P}Torino`, espn(239), "tor", "Torino"),
    club(`${P}Bologna`, espn(107), "bol", "Bologna"),
    club(`${P}Genoa`, espn(3263), "gen", "Genoa"),
    club(`${P}Sampdoria`, espn(2734), "sam", "Sampdoria"),
    club(`${P}Udinese`, espn(118), "udi", "Udinese"),
    club(`${P}Parma`, espn(115), "par", "Parma"),
  ],
  ucl: [
    UCL_CLUBS.rma(P), UCL_CLUBS.bar(P), UCL_CLUBS.bay(P),
    club(`${P}Juventus`, espn(111), "juv", "Juventus"),
    club(`${P}Inter`, espn(110), "inter", "Inter"),
    club(`${P}AC Milan`, espn(103), "mil", "AC Milan"),
    club(`${P}PSG`, espn(160), "psg", "PSG"),
    club(`${P}Manchester City`, espn(382), "mci", "Manchester City"),
    club(`${P}Liverpool`, espn(364), "liv", "Liverpool"),
    club(`${P}Chelsea`, espn(363), "che", "Chelsea"),
    club(`${P}Dortmund`, espn(124), "dor", "Borussia Dortmund"),
    club(`${P}Manchester United`, espn(360), "mun", "Manchester United"),
    club(`${P}Ajax`, espn(139), "ajax", "Ajax"),
    club(`${P}Arsenal`, espn(359), "ars", "Arsenal"),
    club(`${P}Atlético Madrid`, espn(1068), "atm", "Atlético Madrid"),
  ],
};
const POOL_ROWS: Record<Competition, Def[]> = {
  pl: [
    national("England international", "gb-eng"), national("France international", "fr"),
    national("Spain international", "es"), national("Brazil international", "br"),
    national("Netherlands international", "nl"), national("Belgium international", "be"),
    national("Argentina international", "ar"),
    stat("Premier League winner", "won"), stat("100+ Premier League goals", "g100"),
    stat("50+ Premier League goals", "g50"), stat("300+ Premier League appearances", "a300"),
    stat("50+ Premier League assists", "as50"),
  ],
  laliga: [
    national("Spanish international", "es"), national("Brazil international", "br"),
    national("Argentina international", "ar"), national("France international", "fr"),
    national("Uruguay international", "uy"),
    stat("La Liga winner", "won"), stat("100+ La Liga goals", "g100"), stat("300+ La Liga appearances", "a300"),
  ],
  seriea: [
    national("Italy international", "it"), national("France international", "fr"),
    national("Argentina international", "ar"), national("Brazil international", "br"),
    national("Netherlands international", "nl"),
    stat("Serie A winner", "won"), stat("100+ Serie A goals", "g100"), stat("300+ Serie A appearances", "a300"),
  ],
  ucl: [
    national("France international", "fr"), national("Brazil international", "br"),
    national("Portugal international", "pt"), national("Argentina international", "ar"),
    national("Netherlands international", "nl"), national("Germany international", "de"),
    national("Italy international", "it"), national("England international", "gb-eng"),
    stat("50+ Champions League goals", "g50"), stat("100+ Champions League appearances", "a100"),
    stat("Scored in a Champions League final", "final"),
  ],
};

const managed = (key: string): Def => ({
  clue: { label: `Managed by ${MANAGERS[key].label}` },
  test: (fact) => fact.tags.includes(`m_${key}`),
});
const EXTRA_CLUB_BADGES: Record<string, [string, number]> = {
  rma: ["Real Madrid", 86], bar: ["Barcelona", 83], atm: ["Atlético Madrid", 1068], bay: ["Bayern Munich", 132],
  psg: ["PSG", 160], mci: ["Manchester City", 382], liv: ["Liverpool", 364], che: ["Chelsea", 363],
  mun: ["Manchester United", 360], ars: ["Arsenal", 359], tot: ["Tottenham", 367], ajax: ["Ajax", 139],
  dor: ["Dortmund", 124], juv: ["Juventus", 111], inter: ["Inter", 110], mil: ["AC Milan", 103],
  rom: ["Roma", 104], nap: ["Napoli", 114], laz: ["Lazio", 112], val: ["Valencia", 94], sev: ["Sevilla", 243],
  wham: ["West Ham", 371], new: ["Newcastle", 361], eve: ["Everton", 368], avl: ["Aston Villa", 362],
};
const EXTRA_CLUB_CODES: Record<Competition, string> = {
  pl: "rma bar juv inter mil bay psg atm val",
  laliga: "juv inter mil psg mun che liv ars mci bay tot ajax nap",
  ucl: "tot nap rom laz val sev",
  seriea: "rma bar mun che ars psg bay atm ajax mci tot liv",
};
const EXTRA_CLUB_DEFS = (comp: Competition): Def[] =>
  EXTRA_CLUB_CODES[comp].split(" ").map((code) => {
    const [label, id] = EXTRA_CLUB_BADGES[code];
    return club(`${P}${label}`, espn(id), code, label);
  });

const EXTRA_ROWS: Record<Competition, Def[]> = {
  pl: [
    national("Portugal international", "pt"), national("Germany international", "de"),
    national("Uruguay international", "uy"), national("Wales international", "gb-wls"),
    national("Senegal international", "sn"), national("Croatia international", "hr"),
    stat("Ballon d'Or winner", "bd"), stat("World Cup winner", "wc"),
  ],
  laliga: [
    national("Portugal international", "pt"), national("Germany international", "de"),
    national("Netherlands international", "nl"), national("Italy international", "it"),
    national("Croatia international", "hr"), national("England international", "gb-eng"),
    stat("Ballon d'Or winner", "bd"), stat("World Cup winner", "wc"),
  ],
  ucl: [
    national("Spain international", "es"), national("Uruguay international", "uy"),
    national("Belgium international", "be"), national("Croatia international", "hr"),
    stat("Ballon d'Or winner", "bd"), stat("World Cup winner", "wc"),
  ],
  seriea: [
    national("Spain international", "es"), national("Portugal international", "pt"),
    national("Germany international", "de"), national("Uruguay international", "uy"),
    national("Croatia international", "hr"), national("Serbia international", "rs"),
    stat("Ballon d'Or winner", "bd"), stat("World Cup winner", "wc"),
  ],
};
const MANAGER_KEYS: Record<Competition, string> = {
  pl: "ferguson wenger mourinho guardiola klopp ancelotti benitez conte ranieri pochettino emery pellegrini mancini moyes redknapp keegan hodgson vangaal tuchel capello",
  laliga: "ancelotti zidane guardiola luisenrique simeone benitez mourinho pellegrini emery valverde delbosque rijkaard lopetegui xavi flick vangaal capello heynckes",
  ucl: "ferguson wenger mourinho guardiola klopp ancelotti zidane luisenrique simeone conte emery pochettino tuchel flick heynckes vangaal capello allegri lippi",
  seriea: "ancelotti conte allegri spalletti sarri pioli inzaghi mancini lippi capello mourinho ranieri benitez emery",
};

const poolFor = (comp: Competition): Def[] => [
  ...POOL_CLUBS[comp],
  ...EXTRA_CLUB_DEFS(comp).filter((def) => !POOL_CLUBS[comp].some((c) => c.clue.label === def.clue.label)),
  ...POOL_ROWS[comp],
  ...EXTRA_ROWS[comp],
  ...MANAGER_KEYS[comp].split(" ").map(managed),
];

function pick<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy.slice(0, count);
}

// Any mix of clubs, stats, nations and managers on both axes; every square must have several valid players.
function generatePuzzle(comp: Competition): FootballTicTacToePuzzle | null {
  const pool = poolFor(comp);
  for (let attempt = 0; attempt < 1500; attempt += 1) {
    const six = pick(pool, 6);
    const puzzle = build(comp, six.slice(0, 3) as [Def, Def, Def], six.slice(3) as [Def, Def, Def]);
    if (puzzle.answers.every((row) => row.every((answers) => answers.length >= (attempt < 1000 ? 3 : 2)))) return puzzle;
      }
      return null;
    }

export function randomFootballTicTacToePuzzle(comp: Competition): FootballTicTacToePuzzle {
  const generated = generatePuzzle(comp);
  if (generated) return generated;
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
