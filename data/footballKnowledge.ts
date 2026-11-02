import type { Competition } from "@/lib/competitions";

export type KnowledgeEntry = { name: string; aliases: string[] };
export type KnowledgeGroup = {
  id: string;
  label: string;
  noun: string;
  plural: string;
  entries: KnowledgeEntry[];
  difficulty: number;
  competitions: Competition[];
  sources: string[];
};

export const knowledgeNames = (raw: string): KnowledgeEntry[] => raw.split("|").map((item) => {
  const [name, ...aliases] = item.split("/");
  return { name, aliases };
});

export const knowledgeNameKey = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
export const knowledgeMatches = (entries: KnowledgeEntry[], name: string) => {
  const key = knowledgeNameKey(name);
  return entries.some((entry) => [entry.name, ...entry.aliases].some((alias) => knowledgeNameKey(alias) === key));
};

export type ModernSquad = {
  id: string;
  team: string;
  season: string;
  manager: string;
  managerKey: string;
  comp: Competition;
  anchors: string[];
  entries: KnowledgeEntry[];
  source: string;
};
const squad = (id: string, team: string, season: string, manager: string, managerKey: string, comp: Competition, anchors: string[], names: string, title: string): ModernSquad => ({
  id, team, season, manager, managerKey, comp, anchors, entries: knowledgeNames(names),
  source: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
});

// Senior players who appeared during a specified manager's spell, not merely at the same club in another year.
export const MODERN_SQUADS: ModernSquad[] = [
  squad("bar1415", "Barcelona", "2014/15", "Luis Enrique", "luisenrique", "laliga", ["Lionel Messi", "Neymar", "Luis Suarez"],
    "Marc-Andre ter Stegen|Claudio Bravo|Jordi Masip|Dani Alves|Gerard Pique|Javier Mascherano|Marc Bartra|Jeremy Mathieu|Thomas Vermaelen|Adriano|Jordi Alba|Martin Montoya|Douglas|Sergio Busquets|Xavi/Xavi Hernandez|Andres Iniesta|Ivan Rakitic|Rafinha|Sergi Roberto|Sergi Samper|Lionel Messi|Neymar/Neymar Jr|Luis Suarez|Pedro|Munir El Haddadi|Sandro Ramirez|Adama Traore",
    "2014\u201315 FC Barcelona season"),
  squad("rma1617", "Real Madrid", "2016/17", "Zinedine Zidane", "zidane", "laliga", ["Cristiano Ronaldo", "Luka Modric"],
    "Keylor Navas|Kiko Casilla|Ruben Yanez|Dani Carvajal/Daniel Carvajal|Pepe|Sergio Ramos|Raphael Varane|Nacho/Nacho Fernandez|Marcelo|Fabio Coentrao|Danilo|Casemiro|Toni Kroos|Luka Modric|Isco|James Rodriguez|Mateo Kovacic|Marco Asensio|Lucas Vazquez|Cristiano Ronaldo|Karim Benzema|Gareth Bale|Alvaro Morata|Mariano Diaz|Enzo Zidane",
    "2016\u201317 Real Madrid CF season"),
  squad("mci2223", "Manchester City", "2022/23", "Pep Guardiola", "guardiola", "pl", ["Erling Haaland", "Kevin De Bruyne"],
    "Ederson|Stefan Ortega|Kyle Walker|Ruben Dias|John Stones|Nathan Ake|Manuel Akanji|Aymeric Laporte|Joao Cancelo|Rico Lewis|Sergio Gomez|Rodri|Kalvin Phillips|Ilkay Gundogan|Kevin De Bruyne|Bernardo Silva|Phil Foden|Riyad Mahrez|Jack Grealish|Cole Palmer|Erling Haaland|Julian Alvarez",
    "2022\u201323 Manchester City F.C. season"),
  squad("liv1920", "Liverpool", "2019/20", "Jurgen Klopp", "klopp", "pl", ["Mohamed Salah", "Sadio Mane"],
    "Alisson/Alisson Becker|Adrian|Caoimhin Kelleher|Trent Alexander-Arnold|Andrew Robertson/Andy Robertson|Virgil van Dijk|Joe Gomez|Joel Matip|Dejan Lovren|James Milner|Jordan Henderson|Fabinho|Georginio Wijnaldum|Naby Keita|Alex Oxlade-Chamberlain|Adam Lallana|Curtis Jones|Harvey Elliott|Mohamed Salah|Sadio Mane|Roberto Firmino|Divock Origi|Xherdan Shaqiri|Takumi Minamino|Neco Williams|Yasser Larouci|Sepp van den Berg|Ki-Jana Hoever|Rhian Brewster|Pedro Chirivella|Herbie Kane",
    "2019\u201320 Liverpool F.C. season"),
  squad("che1415", "Chelsea", "2014/15", "Jose Mourinho", "mourinho", "pl", ["Eden Hazard"],
    "Thibaut Courtois|Petr Cech|Branislav Ivanovic|Gary Cahill|John Terry|Kurt Zouma|Cesar Azpilicueta|Filipe Luis|Nathan Ake|Nemanja Matic|Cesc Fabregas|Ramires|John Obi Mikel|Oscar|Eden Hazard|Willian|Andre Schurrle|Mohamed Salah|Juan Cuadrado|Diego Costa|Didier Drogba|Loic Remy|Ruben Loftus-Cheek|Andreas Christensen|Dominic Solanke|Isaiah Brown",
    "2014\u201315 Chelsea F.C. season"),
  squad("mun1011", "Manchester United", "2010/11", "Alex Ferguson", "ferguson", "pl", ["Wayne Rooney"],
    "Edwin van der Sar|Tomasz Kuszczak|Ben Amos|Rafael|Fabio|John O'Shea|Wes Brown|Gary Neville|Rio Ferdinand|Nemanja Vidic|Chris Smalling|Jonny Evans|Patrice Evra|Michael Carrick|Darren Fletcher|Paul Scholes|Ryan Giggs|Darron Gibson|Anderson|Antonio Valencia|Nani|Park Ji-sung/Ji-sung Park|Gabriel Obertan|Bebe|Wayne Rooney|Dimitar Berbatov|Javier Hernandez/Chicharito|Michael Owen|Federico Macheda",
    "2010\u201311 Manchester United F.C. season"),
  squad("ars1516", "Arsenal", "2015/16", "Arsene Wenger", "wenger", "pl", ["Alexis Sanchez", "Mesut Ozil"],
    "Petr Cech|David Ospina|Hector Bellerin|Mathieu Debuchy|Per Mertesacker|Laurent Koscielny|Gabriel Paulista|Calum Chambers|Nacho Monreal|Kieran Gibbs|Mikel Arteta|Mathieu Flamini|Francis Coquelin|Santi Cazorla|Aaron Ramsey|Jack Wilshere|Mesut Ozil|Tomas Rosicky|Alex Oxlade-Chamberlain|Alexis Sanchez|Theo Walcott|Olivier Giroud|Danny Welbeck|Joel Campbell|Alex Iwobi|Mohamed Elneny|Jeff Reine-Adelaide",
    "2015\u201316 Arsenal F.C. season"),
  squad("bay1920", "Bayern Munich", "November 2019-August 2020", "Hansi Flick", "flick", "bundesliga", ["Robert Lewandowski", "Thomas Muller"],
    "Manuel Neuer|Sven Ulreich|Benjamin Pavard|Jerome Boateng|David Alaba|Alphonso Davies|Lucas Hernandez|Joshua Kimmich|Javi Martinez|Thiago Alcantara|Leon Goretzka|Corentin Tolisso|Mickael Cuisance|Thomas Muller|Serge Gnabry|Kingsley Coman|Ivan Perisic|Philippe Coutinho|Robert Lewandowski|Joshua Zirkzee|Leon Dajaku|Sarpreet Singh|Oliver Batista Meier|Alvaro Odriozola",
    "2019\u201320 FC Bayern Munich season"),
  squad("psg2122", "Paris Saint-Germain", "2021/22", "Mauricio Pochettino", "pochettino", "ligue1", ["Lionel Messi", "Kylian Mbappe"],
    "Gianluigi Donnarumma|Keylor Navas|Sergio Rico|Achraf Hakimi|Presnel Kimpembe|Sergio Ramos|Marquinhos|Abdou Diallo|Thilo Kehrer|Colin Dagba|Juan Bernat|Nuno Mendes|Layvin Kurzawa|Marco Verratti|Danilo Pereira|Leandro Paredes|Idrissa Gueye|Ander Herrera|Georginio Wijnaldum|Julian Draxler|Eric Junior Dina Ebimbe|Xavi Simons|Edouard Michut|Angel Di Maria|Lionel Messi|Neymar/Neymar Jr|Kylian Mbappe|Mauro Icardi|Ismael Gharbi",
    "2021\u201322 Paris Saint-Germain F.C. season"),
  squad("juv1415", "Juventus", "2014/15", "Massimiliano Allegri", "allegri", "seriea", ["Paul Pogba", "Andrea Pirlo"],
    "Gianluigi Buffon|Marco Storari|Stephan Lichtsteiner|Giorgio Chiellini|Leonardo Bonucci|Andrea Barzagli|Angelo Ogbonna|Patrice Evra|Simone Padoin|Martin Caceres|Andrea Pirlo|Claudio Marchisio|Arturo Vidal|Paul Pogba|Roberto Pereyra|Stefano Sturaro|Simone Pepe|Federico Mattiello|Carlos Tevez|Alvaro Morata|Fernando Llorente|Alessandro Matri|Sebastian Giovinco|Kingsley Coman",
    "2014\u201315 Juventus FC season"),
  squad("rma1314", "Real Madrid", "2013/14", "Carlo Ancelotti", "ancelotti", "laliga", ["Cristiano Ronaldo"],
    "Iker Casillas|Diego Lopez|Dani Carvajal/Daniel Carvajal|Alvaro Arbeloa|Pepe|Sergio Ramos|Raphael Varane|Nacho/Nacho Fernandez|Marcelo|Fabio Coentrao|Xabi Alonso|Sami Khedira|Luka Modric|Casemiro|Asier Illarramendi|Isco|Angel Di Maria|Cristiano Ronaldo|Karim Benzema|Gareth Bale|Jese Rodriguez|Alvaro Morata",
    "2013\u201314 Real Madrid CF season"),
  squad("inter2021", "Inter Milan", "2020/21", "Antonio Conte", "conte", "seriea", ["Romelu Lukaku", "Lautaro Martinez"],
    "Samir Handanovic|Ionut Radu|Daniele Padelli|Milan Skriniar|Stefan de Vrij|Alessandro Bastoni|Andrea Ranocchia|Danilo D'Ambrosio|Aleksandar Kolarov|Achraf Hakimi|Matteo Darmian|Ashley Young|Ivan Perisic|Marcelo Brozovic|Nicolo Barella|Christian Eriksen|Arturo Vidal|Roberto Gagliardini|Stefano Sensi|Radja Nainggolan|Matias Vecino|Romelu Lukaku|Lautaro Martinez|Alexis Sanchez|Andrea Pinamonti",
    "2020\u201321 Inter Milan season"),
  squad("atm1314", "Atletico Madrid", "2013/14", "Diego Simeone", "simeone", "laliga", ["Diego Costa"],
    "Thibaut Courtois|Daniel Aranzubia|Juanfran|Miranda|Diego Godin|Jose Maria Gimenez/Jose Gimenez|Toby Alderweireld|Filipe Luis|Emiliano Insua|Gabi|Tiago|Mario Suarez|Koke|Raul Garcia|Arda Turan|Cristian Rodriguez|Oliver Torres|Jose Sosa|Diego/Diego Ribas|Adrian Lopez|Diego Costa|David Villa|Leo Baptistao",
    "2013\u201314 Atletico Madrid season"),
  squad("che2021", "Chelsea", "January-May 2021", "Thomas Tuchel", "tuchel", "pl", ["N'Golo Kante"],
    "Edouard Mendy|Kepa Arrizabalaga|Cesar Azpilicueta|Thiago Silva|Antonio Rudiger|Andreas Christensen|Kurt Zouma|Reece James|Ben Chilwell|Marcos Alonso|Emerson Palmieri|N'Golo Kante|Jorginho|Mateo Kovacic|Billy Gilmour|Mason Mount|Kai Havertz|Hakim Ziyech|Christian Pulisic|Callum Hudson-Odoi|Timo Werner|Olivier Giroud|Tammy Abraham",
    "2020\u201321 Chelsea F.C. season"),
];

export const MODERN_MANAGER_GROUPS: KnowledgeGroup[] = MODERN_SQUADS.map((squad) => ({
  id: `manager-${squad.id}`,
  label: `Managed by ${squad.manager} (${squad.team}, ${squad.season})`,
  noun: `player managed by ${squad.manager} at ${squad.team} in ${squad.season}`,
  plural: `players managed by ${squad.manager} at ${squad.team} in ${squad.season}`,
  entries: squad.entries,
  difficulty: 3,
  competitions: [squad.comp, "ucl", "general"],
  sources: [squad.source],
}));

export const TEAMMATE_GROUPS: KnowledgeGroup[] = MODERN_SQUADS.flatMap((squad) => squad.anchors.map((anchor) => ({
  id: `teammate-${squad.id}-${knowledgeNameKey(anchor)}`,
  label: `Teammate of ${anchor} (${squad.team}, ${squad.season})`,
  noun: `club teammate of ${anchor} at ${squad.team} in ${squad.season}`,
  plural: `club teammates of ${anchor} at ${squad.team} in ${squad.season}`,
  entries: squad.entries.filter((entry) => !knowledgeMatches([entry], anchor)),
  difficulty: 3,
  competitions: [squad.comp, "ucl", "general"] as Competition[],
  sources: [squad.source],
})));

const group = (id: string, label: string, condition: string, answers: string, sources: string[], difficulty = 4): KnowledgeGroup => ({
  id, label, noun: `player who ${condition}`, plural: `players who ${condition}`,
  entries: knowledgeNames(answers), difficulty, competitions: ["general", "ucl"], sources,
});
const ballon = "https://en.wikipedia.org/wiki/Ballon_d%27Or";
export const HONOUR_GROUPS: KnowledgeGroup[] = [
  group("ballon-worldcup", "Ballon d'Or AND World Cup winner (through 2025)", "won both the men's Ballon d'Or and the men's World Cup by the end of 2025",
    "Bobby Charlton|Franz Beckenbauer|Gerd Muller|Paolo Rossi|Lothar Matthaus|Zinedine Zidane|Rivaldo|Ronaldo/Ronaldo Nazario|Ronaldinho|Kaka|Fabio Cannavaro|Lionel Messi",
    [ballon, "https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_winning_players"]),
  group("ballon-2016-2025-no-duopoly", "2016-2025 Ballon d'Or, not Messi/Ronaldo", "won the men's Ballon d'Or in the ten completed award years 2016-2025 and is neither Lionel Messi nor Cristiano Ronaldo",
    "Luka Modric|Karim Benzema|Rodri|Ousmane Dembele", [ballon]),
  group("ballon-2021-2025", "2021-2025 Ballon d'Or winner", "won the men's Ballon d'Or in the five completed award years 2021-2025",
    "Lionel Messi|Karim Benzema|Rodri|Ousmane Dembele", [ballon]),
  group("yashin-2021-2025", "2021-2025 Yashin Trophy winner", "won the Yashin Trophy in the five completed award years 2021-2025",
    "Gianluigi Donnarumma|Thibaut Courtois|Emiliano Martinez", ["https://en.wikipedia.org/wiki/Yashin_Trophy"]),
  group("kopa-2021-2025", "2021-2025 Kopa Trophy winner", "won the Kopa Trophy in the five completed award years 2021-2025",
    "Pedri|Gavi|Jude Bellingham|Lamine Yamal", ["https://en.wikipedia.org/wiki/Kopa_Trophy"]),
  group("goldenshoe-2021-2025", "2020/21-2024/25 European Golden Shoe", "won the European Golden Shoe in one of the five seasons 2020/21-2024/25",
    "Robert Lewandowski|Erling Haaland|Harry Kane|Kylian Mbappe", ["https://en.wikipedia.org/wiki/European_Golden_Shoe"]),
  group("worldcup-goldenball", "World Cup Golden Ball winner (1982-2022)", "won the men's World Cup Golden Ball between 1982 and 2022",
    "Paolo Rossi|Diego Maradona|Salvatore Schillaci|Romario|Ronaldo/Ronaldo Nazario|Oliver Kahn|Zinedine Zidane|Diego Forlan|Lionel Messi|Luka Modric",
    ["https://en.wikipedia.org/wiki/FIFA_World_Cup_awards"]),
  group("worldcup-glove", "World Cup best goalkeeper (1994-2022)", "won the men's World Cup best-goalkeeper award between 1994 and 2022 (Yashin Award or Golden Glove)",
    "Michel Preud'homme|Fabien Barthez|Oliver Kahn|Gianluigi Buffon|Iker Casillas|Manuel Neuer|Thibaut Courtois|Emiliano Martinez",
    ["https://en.wikipedia.org/wiki/FIFA_World_Cup_awards"]),
  group("worldcup-2021-2025", "2021-2025 World Cup winner", "was in a men's World Cup-winning squad during 2021-2025 (Argentina, 2022)",
    "Emiliano Martinez|Franco Armani|Geronimo Rulli|Gonzalo Montiel|Nahuel Molina|Cristian Romero|German Pezzella|Nicolas Otamendi|Lisandro Martinez|Marcos Acuna|Nicolas Tagliafico|Rodrigo De Paul|Leandro Paredes|Alexis Mac Allister|Enzo Fernandez|Exequiel Palacios|Guido Rodriguez|Alejandro Gomez/Papu Gomez|Angel Di Maria|Lionel Messi|Lautaro Martinez|Julian Alvarez|Angel Correa|Paulo Dybala|Thiago Almada|Juan Foyth",
    ["https://en.wikipedia.org/wiki/2022_FIFA_World_Cup_squads"]),
  group("euros-2021-2025", "2021-2025 European champion", "was in a men's European Championship-winning squad during 2021-2025 (Italy at Euro 2020, played in 2021, or Spain at Euro 2024)",
    "Gianluigi Donnarumma|Salvatore Sirigu|Alex Meret|Giovanni Di Lorenzo|Leonardo Bonucci|Giorgio Chiellini|Francesco Acerbi|Alessandro Bastoni|Leonardo Spinazzola|Emerson Palmieri|Rafael Toloi|Alessandro Florenzi|Manuel Locatelli|Marco Verratti|Jorginho|Nicolo Barella|Bryan Cristante|Gaetano Castrovilli|Matteo Pessina|Federico Chiesa|Ciro Immobile|Lorenzo Insigne|Domenico Berardi|Andrea Belotti|Giacomo Raspadori|Federico Bernardeschi|Unai Simon|David Raya|Alex Remiro|Dani Carvajal/Daniel Carvajal|Jesus Navas|Robin Le Normand|Nacho/Nacho Fernandez|Aymeric Laporte|Dani Vivian|Marc Cucurella|Alejandro Grimaldo|Rodri|Martin Zubimendi|Fabian Ruiz|Mikel Merino|Pedri|Fermin Lopez|Dani Olmo|Alex Baena|Lamine Yamal|Nico Williams|Ferran Torres|Alvaro Morata|Joselu|Mikel Oyarzabal|Ayoze Perez",
    ["https://en.wikipedia.org/wiki/UEFA_Euro_2020_squads", "https://en.wikipedia.org/wiki/UEFA_Euro_2024_squads"]),
  group("copa-2021-2025", "2021-2025 Copa America champion", "was in a men's Copa America-winning squad during 2021-2025 (Argentina in 2021 or 2024)",
    "Emiliano Martinez|Franco Armani|Geronimo Rulli|Agustin Marchesin|Juan Musso|Gonzalo Montiel|Nahuel Molina|Cristian Romero|German Pezzella|Nicolas Otamendi|Lisandro Martinez|Marcos Acuna|Nicolas Tagliafico|Lucas Martinez Quarta|Rodrigo De Paul|Leandro Paredes|Alexis Mac Allister|Enzo Fernandez|Exequiel Palacios|Guido Rodriguez|Giovani Lo Celso|Nicolas Dominguez|Alejandro Gomez/Papu Gomez|Angel Di Maria|Lionel Messi|Lautaro Martinez|Julian Alvarez|Nicolas Gonzalez|Angel Correa|Joaquin Correa|Sergio Aguero|Alejandro Garnacho|Valentin Carboni",
    ["https://en.wikipedia.org/wiki/2021_Copa_Am%C3%A9rica_squads", "https://en.wikipedia.org/wiki/2024_Copa_Am%C3%A9rica_squads"]),
];

export const CROSS_CAREER_GROUPS: KnowledgeGroup[] = [
  group("clubs-bar-psg-mil", "Barcelona + PSG + AC Milan", "made senior competitive appearances for Barcelona, Paris Saint-Germain AND AC Milan by the end of 2025",
    "Ronaldinho|Zlatan Ibrahimovic", ["https://en.wikipedia.org/wiki/Ronaldinho", "https://en.wikipedia.org/wiki/Zlatan_Ibrahimovi%C4%87"]),
  group("clubs-rma-che-mil", "Real Madrid + Chelsea + AC Milan", "made senior competitive appearances for Real Madrid, Chelsea AND AC Milan by the end of 2025",
    "Gonzalo Higuain|Alvaro Morata", ["https://en.wikipedia.org/wiki/Gonzalo_Higua%C3%ADn", "https://en.wikipedia.org/wiki/%C3%81lvaro_Morata"]),
  group("clubs-che-liv", "Chelsea + Liverpool", "made senior competitive appearances for both Chelsea AND Liverpool by the end of 2025",
    "Mohamed Salah|Fernando Torres|Daniel Sturridge|Yossi Benayoun|Joe Cole|Glen Johnson|Dominic Solanke|Raul Meireles|Boudewijn Zenden",
    ["https://en.wikipedia.org/wiki/Chelsea_F.C.%E2%80%93Liverpool_F.C._rivalry"]),
  group("leagues-pl-sevilla", "Premier League + Sevilla", "played in the Premier League AND made senior competitive appearances for Sevilla by the end of 2025",
    "Jesus Navas|Frederic Kanoute|Alvaro Negredo|Jose Antonio Reyes|Steven Nzonzi|Samir Nasri|Stevan Jovetic|Fernando/Fernando Reges|Erik Lamela|Bryan Gil|Anthony Martial|Adnan Januzaj|Dodi Lukebakio",
    ["https://en.wikipedia.org/wiki/List_of_Sevilla_FC_players"]),
  group("leagues-pl-laliga-seriea", "Premier League + La Liga + Serie A", "made league appearances in the Premier League, La Liga AND Serie A by the end of 2025",
    "Cristiano Ronaldo|Alvaro Morata|Gonzalo Higuain|Samuel Eto'o|Philippe Coutinho|Alexis Sanchez|Fernando Torres|Joao Cancelo|Pedro|Gerard Deulofeu|Brahim Diaz|Ricardo Quaresma|Bojan Krkic|Dani Osvaldo|Giuseppe Rossi|Christian Panucci|Fernando Llorente|Nicolas Anelka|Esteban Cambiasso",
    ["https://en.wikipedia.org/wiki/Cristiano_Ronaldo", "https://en.wikipedia.org/wiki/Samuel_Eto%27o"]),
  group("leagues-pl-bundesliga-ligue1", "Premier League + Bundesliga + Ligue 1", "made league appearances in the Premier League, Bundesliga AND Ligue 1 by the end of 2025",
    "Pierre-Emerick Aubameyang|Eric Maxim Choupo-Moting|Benjamin Stambouli|Sead Kolasinac|Moussa Diaby|Salomon Kalou|Anthony Modeste|Valerien Ismael|Thilo Kehrer|Christopher Nkunku",
    ["https://en.wikipedia.org/wiki/Eric_Maxim_Choupo-Moting", "https://en.wikipedia.org/wiki/Christopher_Nkunku"]),
  group("domestic-egypt", "Played domestic football in Egypt", "made senior league appearances for an Egyptian club by the end of 2025 (not merely represented Egypt)",
    "Mohamed Salah|Mohamed Elneny|Mohamed Aboutrika|Essam El-Hadary|Ahmed Hassan|Hossam Hassan|Mido/Ahmed Hossam|Ahmed Fathi|Amr Zaki|Shikabala|Trezeguet/Mahmoud Hassan|Ramadan Sobhi|Mostafa Mohamed|Percy Tau|Ali Maaloul|Ferjani Sassi|Achraf Bencharki|Malick Evouna|John Antwi|Flavio Amado",
    ["https://en.wikipedia.org/wiki/Egyptian_Premier_League"]),
  group("domestic-japan", "Played domestic football in Japan", "made senior J.League appearances by the end of 2025",
    "Andres Iniesta|David Villa|Lukas Podolski|Zico|Dunga|Gary Lineker|Fernando Torres|Diego Forlan|Michael Laudrup|Hulk|Shinji Kagawa|Shinji Okazaki|Shunsuke Nakamura|Hidetoshi Nakata|Takefusa Kubo|Kazuyoshi Miura|Jorginho|Leonardo",
    ["https://en.wikipedia.org/wiki/J1_League"]),
  group("domestic-southafrica", "Played domestic football in South Africa", "made senior top-flight league appearances in South Africa by the end of 2025",
    "Steven Pienaar|Benni McCarthy|Lucas Radebe|Percy Tau|Siphiwe Tshabalala|Itumeleng Khune|Teko Modise|Siyabonga Nomvethe|Shaun Bartlett|Bongani Zungu|Bongani Khumalo",
    ["https://en.wikipedia.org/wiki/South_African_Premier_Division"]),
  group("egypt-pl", "Egypt international + Premier League", "represented Egypt AND made Premier League appearances by the end of 2025",
    "Mohamed Salah|Mohamed Elneny|Mido/Ahmed Hossam|Amr Zaki|Ahmed Fathi|Hossam Ghaly|Trezeguet/Mahmoud Hassan|Ahmed Elmohamady|Ahmed Hegazi|Ramadan Sobhi|Gedo/Mohamed Nagy",
    ["https://en.wikipedia.org/wiki/List_of_foreign_Premier_League_players"]),
  group("morocco-rma", "Morocco international + Real Madrid", "represented Morocco AND made senior competitive appearances for Real Madrid by the end of 2025",
    "Achraf Hakimi|Brahim Diaz", ["https://en.wikipedia.org/wiki/Achraf_Hakimi", "https://en.wikipedia.org/wiki/Brahim_D%C3%ADaz"]),
  group("senegal-liv", "Senegal international + Liverpool", "represented Senegal AND made senior competitive appearances for Liverpool by the end of 2025",
    "Sadio Mane|El Hadji Diouf|Salif Diao", ["https://en.wikipedia.org/wiki/Salif_Diao", "https://en.wikipedia.org/wiki/El_Hadji_Diouf"]),
  group("ghana-inter", "Ghana international + Inter", "represented Ghana AND made senior competitive appearances for Inter Milan by the end of 2025",
    "Sulley Muntari|Kwadwo Asamoah", ["https://en.wikipedia.org/wiki/Sulley_Muntari", "https://en.wikipedia.org/wiki/Kwadwo_Asamoah"]),
];

type Compound = { id: string; base: string; label: string; condition: string; answers: string; source: string; difficulty?: number };
const COMPOUNDS: Compound[] = [
  { id: "messi-teammate-pl", base: "teammate-bar1415-lionelmessi", label: "Messi teammate + Premier League",
    condition: "was Lionel Messi's Barcelona club teammate in 2014/15 AND made Premier League appearances by the end of 2025",
    answers: "Claudio Bravo|Gerard Pique|Javier Mascherano|Martin Montoya|Luis Suarez|Pedro|Sandro Ramirez|Adama Traore",
    source: "https://en.wikipedia.org/wiki/List_of_foreign_Premier_League_players" },
  { id: "ronaldo-teammate-pl", base: "teammate-rma1617-cristianoronaldo", label: "Ronaldo teammate + Premier League",
    condition: "was Cristiano Ronaldo's Real Madrid club teammate in 2016/17 AND made Premier League appearances by the end of 2025",
    answers: "Keylor Navas|Danilo|Raphael Varane|Casemiro|Mateo Kovacic|Gareth Bale|Alvaro Morata",
    source: "https://en.wikipedia.org/wiki/List_of_foreign_Premier_League_players" },
  { id: "klopp-egypt", base: "manager-liv1920", label: "Klopp's Liverpool + Egypt",
    condition: "was managed by Jurgen Klopp at Liverpool in 2019/20 AND represented Egypt",
    answers: "Mohamed Salah", source: "https://en.wikipedia.org/wiki/Mohamed_Salah" },
  { id: "pochettino-morocco", base: "manager-psg2122", label: "Pochettino's PSG + Morocco",
    condition: "was managed by Mauricio Pochettino at PSG in 2021/22 AND represented Morocco",
    answers: "Achraf Hakimi", source: "https://en.wikipedia.org/wiki/Achraf_Hakimi" },
  { id: "guardiola-dortmund", base: "manager-mci2223", label: "Guardiola's City + Dortmund",
    condition: "was managed by Pep Guardiola at Manchester City in 2022/23 AND made senior competitive appearances for Borussia Dortmund by the end of 2025",
    answers: "Erling Haaland|Ilkay Gundogan|Manuel Akanji|Sergio Gomez", source: "https://en.wikipedia.org/wiki/2022%E2%80%9323_Manchester_City_F.C._season" },
  { id: "mourinho-seriea", base: "manager-che1415", label: "Mourinho's Chelsea + Serie A",
    condition: "was managed by Jose Mourinho at Chelsea in 2014/15 AND made Serie A appearances by the end of 2025",
    answers: "Mohamed Salah|Juan Cuadrado|Nemanja Matic|Ruben Loftus-Cheek", source: "https://en.wikipedia.org/wiki/List_of_foreign_Serie_A_players" },
];
const RELATION_GROUPS = [...MODERN_MANAGER_GROUPS, ...TEAMMATE_GROUPS];
export const COMPOUND_GROUPS: KnowledgeGroup[] = COMPOUNDS.map((item) => {
  const base = RELATION_GROUPS.find((candidate) => candidate.id === item.base);
  if (!base) throw new Error(`Unknown football knowledge relationship: ${item.base}`);
  const entries = knowledgeNames(item.answers);
  if (entries.some((entry) => !knowledgeMatches(base.entries, entry.name))) {
    throw new Error(`Compound answers must satisfy their dated relationship: ${item.id}`);
  }
  return {
    ...group(item.id, item.label, item.condition, item.answers, [...base.sources, item.source], item.difficulty),
    competitions: ["general"],
  };
});

export const FOOTBALL_KNOWLEDGE_GROUPS = [...RELATION_GROUPS, ...HONOUR_GROUPS, ...CROSS_CAREER_GROUPS, ...COMPOUND_GROUPS];
