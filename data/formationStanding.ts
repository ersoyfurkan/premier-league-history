export type StandingEntry = { name: string; aliases: string[] };
type StandingCategory = { id: string; prompt: string; source: string; entries: StandingEntry[] };
const entries = (items: string): StandingEntry[] => items.split("|").map((item) => {
  const [name, ...aliases] = item.split("/");
  return { name, aliases };
});

export const FORMATION_STANDING_CATEGORIES: StandingCategory[] = [
  {
    id: "world-cup-winners", prompt: "Name a country that won the men's World Cup by the end of 2022.",
    source: "https://www.fifa.com/tournaments/mens/worldcup",
    entries: entries("Brazil/Brasil|Germany/West Germany/Deutschland|Italy/Italia|Argentina|France|Uruguay|England|Spain/Espana"),
  },
  {
    id: "euros-winners", prompt: "Name a country that won the men's European Championship by the end of Euro 2020.",
    source: "https://www.uefa.com/uefaeuro/history/",
    entries: entries("Soviet Union/USSR|Spain/Espana|Italy/Italia|Germany/West Germany/Deutschland|Czechoslovakia|France|Netherlands/Holland/The Netherlands|Denmark|Greece|Portugal"),
  },
  {
    id: "copa-winners", prompt: "Name a country that won the men's Copa America by the end of 2024.",
    source: "https://copaamerica.com/en",
    entries: entries("Argentina|Uruguay|Brazil/Brasil|Paraguay|Peru|Chile|Bolivia|Colombia"),
  },
  {
    id: "premier-league-winners", prompt: "Name a club that won the Premier League between 1992/93 and 2022/23.",
    source: "https://www.premierleague.com/history",
    entries: entries("Manchester United/Man Utd/Man United/United|Blackburn Rovers/Blackburn|Arsenal|Chelsea|Manchester City/Man City/City|Leicester City/Leicester|Liverpool"),
  },
  {
    id: "champions-league-winners", prompt: "Name a club that won the European Cup or Champions League by the end of 2022/23.",
    source: "https://www.uefa.com/uefachampionsleague/history/",
    entries: entries("Real Madrid/Madrid|Benfica|AC Milan/Milan|Inter Milan/Inter/Internazionale|Celtic|Manchester United/Man Utd/Man United|Feyenoord|Ajax|Bayern Munich/Bayern/Bayern Munchen|Liverpool|Nottingham Forest/Forest|Aston Villa/Villa|Hamburg/Hamburger SV/HSV|Juventus/Juve|Steaua Bucharest/Steaua/FCSB|Porto/FC Porto|PSV Eindhoven/PSV|Red Star Belgrade/Red Star/Crvena Zvezda|Barcelona/Barca|Marseille/Olympique Marseille|Borussia Dortmund/Dortmund|Chelsea|Manchester City/Man City"),
  },
  {
    id: "ballon-2000-2023", prompt: "Name a men's Ballon d'Or winner from 2000 to 2023 inclusive.",
    source: "https://www.francefootball.fr/ballon-d-or/palmares/",
    entries: entries("Luis Figo/Figo|Michael Owen/Owen|Ronaldo Nazario/Ronaldo/R9|Pavel Nedved/Nedved|Andriy Shevchenko/Shevchenko|Ronaldinho|Fabio Cannavaro/Cannavaro|Kaka|Cristiano Ronaldo/CR7/Cristiano|Lionel Messi/Messi|Luka Modric/Modric|Karim Benzema/Benzema"),
  },
  {
    id: "world-cup-hosts", prompt: "Name a country that hosted a men's World Cup finals tournament from 1930 to 2022.",
    source: "https://www.fifa.com/tournaments/mens/worldcup",
    entries: entries("Uruguay|Italy/Italia|France|Brazil/Brasil|Switzerland|Sweden|Chile|England|Mexico|Germany/West Germany/Deutschland|Argentina|Spain/Espana|United States/USA/US/United States of America|Japan|South Korea/Korea Republic/Republic of Korea|South Africa|Russia|Qatar"),
  },
  {
    id: "spain-2010-starters", prompt: "Name a player who started for Spain in the 2010 men's World Cup final.",
    source: "https://en.wikipedia.org/wiki/2010_FIFA_World_Cup_final",
    entries: entries("Iker Casillas/Casillas|Sergio Ramos/Ramos|Gerard Pique/Pique|Carles Puyol/Puyol|Joan Capdevila/Capdevila|Sergio Busquets/Busquets|Xabi Alonso|Xavi Hernandez/Xavi|Andres Iniesta/Iniesta|Pedro Rodriguez/Pedro|David Villa/Villa"),
  },
  {
    id: "france-2018-starters", prompt: "Name a player who started for France in the 2018 men's World Cup final.",
    source: "https://en.wikipedia.org/wiki/2018_FIFA_World_Cup_final",
    entries: entries("Hugo Lloris/Lloris|Benjamin Pavard/Pavard|Raphael Varane/Varane|Samuel Umtiti/Umtiti|Lucas Hernandez|Paul Pogba/Pogba|N'Golo Kante/Ngolo Kante/Kante|Kylian Mbappe/Mbappe|Antoine Griezmann/Griezmann|Blaise Matuidi/Matuidi|Olivier Giroud/Giroud"),
  },
  {
    id: "argentina-2022-starters", prompt: "Name a player who started for Argentina in the 2022 men's World Cup final.",
    source: "https://en.wikipedia.org/wiki/2022_FIFA_World_Cup_final",
    entries: entries("Emiliano Martinez/Emi Martinez/Dibu Martinez|Nahuel Molina/Molina|Cristian Romero/Cuti Romero/Romero|Nicolas Otamendi/Otamendi|Nicolas Tagliafico/Tagliafico|Rodrigo De Paul/De Paul|Enzo Fernandez/Enzo|Alexis Mac Allister/Mac Allister|Angel Di Maria/Di Maria|Lionel Messi/Messi|Julian Alvarez/Alvarez"),
  },
  {
    id: "south-american-premier-league-winners",
    prompt: "Name a South American player who won a Premier League winner's medal between 1992/93 and 2022/23.",
    source: "https://en.wikipedia.org/wiki/List_of_Premier_League_winning_players",
    entries: entries("Ederson/Ederson Moraes|Sergio Aguero/Aguero/Kun Aguero|Fernandinho|Gabriel Jesus/Jesus|Anderson|Carlos Tevez/Tevez|Rafael/Rafael da Silva|Edu/Edu Gaspar|Antonio Valencia/Valencia|Pablo Zabaleta/Zabaleta|Oscar|Willian|Danilo|Nicolas Otamendi/Otamendi|Alisson/Alisson Becker|Julian Alvarez/Alvarez|Diego Forlan/Forlan|Juan Sebastian Veron/Veron|Gilberto Silva/Gilberto|Hernan Crespo/Crespo|Gabriel Heinze/Heinze|Alex/Alex Rodrigo Dias da Costa|Juliano Belletti/Belletti|Fabio/Fabio da Silva|Martin Demichelis/Demichelis|Juan Cuadrado/Cuadrado|Filipe Luis|Ramires|Leonardo Ulloa/Ulloa|David Luiz|Claudio Bravo/Bravo|Fabinho|Roberto Firmino/Firmino"),
  },
];

export function formationStandingCategory(id: string) {
  const category = FORMATION_STANDING_CATEGORIES.find((item) => item.id === id);
  if (!category) throw new Error(`Unknown Formation Invasion standing category: ${id}`);
  return category;
}

export function pickFormationStandingCategory(excluded: string[] = []) {
  const available = FORMATION_STANDING_CATEGORIES.filter((category) => !excluded.includes(category.id));
  if (!available.length) throw new Error("No unused Last Man Standing categories remain.");
  return available[Math.floor(Math.random() * available.length)];
}
