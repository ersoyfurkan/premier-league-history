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
  {
    id: "premier-league-golden-boot-1992-2023",
    prompt: "Name a player who won or shared the Premier League Golden Boot between 1992/93 and 2022/23.",
    source: "https://en.wikipedia.org/wiki/Premier_League_Golden_Boot",
    entries: entries("Teddy Sheringham/Sheringham|Andy Cole/Andrew Cole/Cole|Alan Shearer/Shearer|Chris Sutton/Sutton|Dion Dublin/Dublin|Michael Owen/Owen|Dwight Yorke/Yorke|Jimmy Floyd Hasselbaink/Hasselbaink|Kevin Phillips/Phillips|Thierry Henry/Henry|Ruud van Nistelrooy/Van Nistelrooy|Didier Drogba/Drogba|Cristiano Ronaldo/Cristiano/CR7/Ronaldo|Nicolas Anelka/Anelka|Carlos Tevez/Tevez|Dimitar Berbatov/Berbatov|Robin van Persie/Van Persie/RVP|Luis Suarez/Suarez|Sergio Aguero/Aguero/Kun Aguero|Harry Kane/Kane|Mohamed Salah/Mo Salah/Salah|Pierre-Emerick Aubameyang/Aubameyang|Sadio Mane/Mane|Jamie Vardy/Vardy|Son Heung-min/Heung-min Son/Son|Erling Haaland/Haaland"),
  },
  {
    id: "world-cup-golden-boot-1982-2022",
    prompt: "Name a player who won or shared the men's World Cup Golden Boot (formerly Golden Shoe) from 1982 to 2022.",
    source: "https://en.wikipedia.org/wiki/FIFA_World_Cup_awards#Golden_Boot",
    entries: entries("Paolo Rossi/Rossi|Gary Lineker/Lineker|Salvatore Schillaci/Schillaci/Toto Schillaci|Oleg Salenko/Salenko|Hristo Stoichkov/Stoichkov|Davor Suker/Suker|Ronaldo Nazario/Ronaldo/R9|Miroslav Klose/Klose|Thomas Muller/Muller|James Rodriguez/James|Harry Kane/Kane|Kylian Mbappe/Mbappe"),
  },
  {
    id: "world-cup-golden-ball-1982-2022",
    prompt: "Name a player who won the men's World Cup Golden Ball from 1982 to 2022.",
    source: "https://en.wikipedia.org/wiki/FIFA_World_Cup_awards#Golden_Ball",
    entries: entries("Paolo Rossi/Rossi|Diego Maradona/Maradona|Salvatore Schillaci/Schillaci/Toto Schillaci|Romario|Ronaldo Nazario/Ronaldo/R9|Oliver Kahn/Kahn|Zinedine Zidane/Zidane/Zizou|Diego Forlan/Forlan|Lionel Messi/Messi|Luka Modric/Modric"),
  },
  {
    id: "la-liga-champions-through-2023",
    prompt: "Name a club that won Spain's La Liga between its first season in 1929 and 2022/23.",
    source: "https://en.wikipedia.org/wiki/List_of_Spanish_football_champions",
    entries: entries("Real Madrid/Madrid|Barcelona/FC Barcelona/Barca|Atletico Madrid/Atletico/Atleti|Athletic Bilbao/Athletic Club/Bilbao|Valencia/Valencia CF|Real Sociedad/Sociedad|Deportivo La Coruna/Deportivo/Deportivo de La Coruna|Sevilla/Sevilla FC|Real Betis/Betis"),
  },
  {
    id: "bundesliga-champions-through-2023",
    prompt: "Name a club that won Germany's Bundesliga between 1963/64 and 2022/23 (not earlier German championships).",
    source: "https://en.wikipedia.org/wiki/List_of_German_football_champions",
    entries: entries("Bayern Munich/Bayern/Bayern Munchen|Borussia Dortmund/Dortmund/BVB|Borussia Monchengladbach/Monchengladbach/Gladbach|Werder Bremen/Bremen|Hamburg/Hamburger SV/HSV|VfB Stuttgart/Stuttgart|FC Koln/1. FC Koln/Cologne/Koln|Kaiserslautern/1. FC Kaiserslautern|1860 Munich/1860 Munchen/TSV 1860 Munich|Nuremberg/Nurnberg/1. FC Nurnberg|Eintracht Braunschweig/Braunschweig|VfL Wolfsburg/Wolfsburg"),
  },
  {
    id: "serie-a-champions-1929-2023",
    prompt: "Name a club that won Italy's Serie A between 1929/30 and 2022/23.",
    source: "https://en.wikipedia.org/wiki/List_of_Italian_football_champions",
    entries: entries("Juventus/Juve|Inter Milan/Inter/Internazionale|AC Milan/Milan|Torino/Torino FC|Bologna/Bologna FC|Fiorentina|Roma/AS Roma|Lazio/SS Lazio|Napoli/SSC Napoli|Cagliari|Hellas Verona/Verona|Sampdoria"),
  },
  {
    id: "french-league-champions-1932-2023",
    prompt: "Name a club that won France's professional top division (Division 1 or Ligue 1) between 1932/33 and 2022/23.",
    source: "https://en.wikipedia.org/wiki/List_of_French_football_champions",
    entries: entries("Paris Saint-Germain/PSG/Paris Saint Germain|Saint-Etienne/AS Saint-Etienne/St Etienne|Marseille/Olympique Marseille/Olympique de Marseille|Monaco/AS Monaco|Nantes/FC Nantes|Lyon/Olympique Lyonnais|Bordeaux/Girondins de Bordeaux|Reims/Stade de Reims|Nice/OGC Nice|Lille/LOSC/Lille OSC|Strasbourg/RC Strasbourg|Lens/RC Lens|Racing Club de France/Racing Paris/RC Paris/Racing Club de Paris|Roubaix-Tourcoing/CO Roubaix-Tourcoing/CORT|Sochaux/FC Sochaux|Sete/FC Sete|Montpellier/Montpellier HSC|Auxerre/AJ Auxerre|Olympique Lillois"),
  },
  {
    id: "premier-league-clubs-2015-16",
    prompt: "Name a club that played in the Premier League in the 2015/16 season.",
    source: "https://en.wikipedia.org/wiki/2015%E2%80%9316_Premier_League",
    entries: entries("Arsenal|Aston Villa/Villa|Bournemouth/AFC Bournemouth|Chelsea|Crystal Palace/Palace|Everton|Leicester City/Leicester|Liverpool|Manchester City/Man City|Manchester United/Man Utd/Man United|Newcastle United/Newcastle|Norwich City/Norwich|Southampton|Stoke City/Stoke|Sunderland|Swansea City/Swansea|Tottenham Hotspur/Tottenham/Spurs|Watford|West Bromwich Albion/West Brom/WBA|West Ham United/West Ham"),
  },
  {
    id: "world-cup-quarter-finalists-2022",
    prompt: "Name a country that reached the quarter-finals of the 2022 men's World Cup.",
    source: "https://en.wikipedia.org/wiki/2022_FIFA_World_Cup_knockout_stage#Quarter-finals",
    entries: entries("Argentina|France|Croatia|Morocco|Brazil/Brasil|England|Netherlands/Holland/The Netherlands|Portugal"),
  },
  {
    id: "world-cup-runners-up-through-2022",
    prompt: "Name a country that finished runner-up at a men's World Cup from 1930 to 2022.",
    source: "https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_finals",
    entries: entries("Argentina|Brazil/Brasil|Germany/West Germany/Deutschland|Italy/Italia|France|Czechoslovakia|Hungary|Sweden|Netherlands/Holland/The Netherlands|Croatia"),
  },
  {
    id: "brazil-2002-starters",
    prompt: "Name a player who started for Brazil in the 2002 men's World Cup final.",
    source: "https://en.wikipedia.org/wiki/2002_FIFA_World_Cup_final",
    entries: entries("Marcos/Marcos Roberto Silveira Reis|Lucio|Edmilson|Roque Junior|Cafu|Gilberto Silva/Gilberto|Kleberson|Roberto Carlos|Ronaldinho|Rivaldo|Ronaldo Nazario/Ronaldo/R9"),
  },
  {
    id: "italy-2006-starters",
    prompt: "Name a player who started for Italy in the 2006 men's World Cup final.",
    source: "https://en.wikipedia.org/wiki/2006_FIFA_World_Cup_final",
    entries: entries("Gianluigi Buffon/Buffon/Gigi Buffon|Gianluca Zambrotta/Zambrotta|Fabio Cannavaro/Cannavaro|Marco Materazzi/Materazzi|Fabio Grosso/Grosso|Gennaro Gattuso/Gattuso|Andrea Pirlo/Pirlo|Mauro Camoranesi/Camoranesi|Francesco Totti/Totti|Simone Perrotta/Perrotta|Luca Toni/Toni"),
  },
  {
    id: "germany-2014-starters",
    prompt: "Name a player who started for Germany in the 2014 men's World Cup final (not a substitute).",
    source: "https://en.wikipedia.org/wiki/2014_FIFA_World_Cup_final",
    entries: entries("Manuel Neuer/Neuer|Philipp Lahm/Lahm|Jerome Boateng/Boateng|Mats Hummels/Hummels|Benedikt Howedes/Howedes|Christoph Kramer/Kramer|Bastian Schweinsteiger/Schweinsteiger|Toni Kroos/Kroos|Thomas Muller/Muller|Mesut Ozil/Ozil|Miroslav Klose/Klose"),
  },
  {
    id: "france-1998-starters",
    prompt: "Name a player who started for France in the 1998 men's World Cup final.",
    source: "https://en.wikipedia.org/wiki/1998_FIFA_World_Cup_final",
    entries: entries("Fabien Barthez/Barthez|Lilian Thuram/Thuram|Frank Leboeuf/Leboeuf|Marcel Desailly/Desailly|Bixente Lizarazu/Lizarazu|Christian Karembeu/Karembeu|Didier Deschamps/Deschamps|Emmanuel Petit/Petit|Zinedine Zidane/Zidane/Zizou|Youri Djorkaeff/Djorkaeff|Stephane Guivarc'h/Guivarch"),
  },
  {
    id: "portugal-2016-starters",
    prompt: "Name a player who started for Portugal in the Euro 2016 final.",
    source: "https://en.wikipedia.org/wiki/UEFA_Euro_2016_final",
    entries: entries("Rui Patricio/Patricio|Cedric Soares/Cedric|Pepe|Jose Fonte/Fonte|Raphael Guerreiro/Guerreiro|William Carvalho/Carvalho|Adrien Silva/Adrien|Joao Mario|Renato Sanches/Sanches|Nani|Cristiano Ronaldo/Cristiano/Ronaldo/CR7"),
  },
  {
    id: "italy-euro-2020-starters",
    prompt: "Name a player who started for Italy in the Euro 2020 final, played in July 2021.",
    source: "https://en.wikipedia.org/wiki/UEFA_Euro_2020_final",
    entries: entries("Gianluigi Donnarumma/Donnarumma|Giovanni Di Lorenzo/Di Lorenzo|Leonardo Bonucci/Bonucci|Giorgio Chiellini/Chiellini|Emerson Palmieri/Emerson|Nicolo Barella/Barella|Jorginho|Marco Verratti/Verratti|Federico Chiesa/Chiesa|Ciro Immobile/Immobile|Lorenzo Insigne/Insigne"),
  },
  {
    id: "arsenal-2006-final-starters",
    prompt: "Name a player who started for Arsenal in the 2006 Champions League final.",
    source: "https://en.wikipedia.org/wiki/2006_UEFA_Champions_League_final",
    entries: entries("Jens Lehmann/Lehmann|Emmanuel Eboue/Eboue|Kolo Toure/Kolo|Sol Campbell/Campbell|Ashley Cole/Cole|Robert Pires/Pires|Gilberto Silva/Gilberto|Cesc Fabregas/Fabregas|Alexander Hleb/Hleb|Freddie Ljungberg/Fredrik Ljungberg/Ljungberg|Thierry Henry/Henry"),
  },
  {
    id: "liverpool-2005-final-starters",
    prompt: "Name a player who started for Liverpool in the 2005 Champions League final.",
    source: "https://en.wikipedia.org/wiki/2005_UEFA_Champions_League_final",
    entries: entries("Jerzy Dudek/Dudek|Steve Finnan/Finnan|Jamie Carragher/Carragher|Sami Hyypia/Hyypia|Djimi Traore/Traore|Luis Garcia|Steven Gerrard/Gerrard|Xabi Alonso/Alonso|John Arne Riise/Riise|Harry Kewell/Kewell|Milan Baros/Baros"),
  },
  {
    id: "barcelona-2009-final-starters",
    prompt: "Name a player who started for Barcelona in the 2009 Champions League final.",
    source: "https://en.wikipedia.org/wiki/2009_UEFA_Champions_League_final",
    entries: entries("Victor Valdes/Valdes|Carles Puyol/Puyol|Yaya Toure/Yaya|Gerard Pique/Pique|Sylvinho|Sergio Busquets/Busquets|Xavi Hernandez/Xavi|Andres Iniesta/Iniesta|Lionel Messi/Messi|Thierry Henry/Henry|Samuel Eto'o/Etoo/Eto'o"),
  },
  {
    id: "man-city-2023-final-starters",
    prompt: "Name a player who started for Manchester City in the 2023 Champions League final.",
    source: "https://en.wikipedia.org/wiki/2023_UEFA_Champions_League_final",
    entries: entries("Ederson/Ederson Moraes|Manuel Akanji/Akanji|Ruben Dias/Dias|Nathan Ake/Ake|John Stones/Stones|Rodri/Rodrigo Hernandez|Bernardo Silva/Bernardo|Kevin De Bruyne/De Bruyne/KDB|Ilkay Gundogan/Gundogan|Jack Grealish/Grealish|Erling Haaland/Haaland"),
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
