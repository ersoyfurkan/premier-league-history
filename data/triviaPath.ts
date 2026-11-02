import { REAL_COMPETITIONS, TOURNAMENT_COMPETITIONS, COMPETITION_LABELS, isTournamentComp, type Competition } from "@/lib/competitions";
import { tournamentTriviaCategories, tournamentTeamsCategory, TOURNAMENT_TRIVIA } from "@/data/tournamentTrivia";
import { footballFacts, normalizeFootballPlayerName } from "@/data/footballTicTacToe";
import { DUEL_CLUBS, playersForBoth, playersForClub, searchDuelPlayers } from "@/data/clubDuel";
import { BUNDESLIGA_TRIVIA } from "@/data/bundesligaContent";
import { LIGUE1_TRIVIA } from "@/data/ligue1Content";
import { SUPERLIG_TRIVIA } from "@/data/superligContent";
import { liveTriviaCategories, wikiTriviaCategories, mergeWikiNames } from "@/data/liveTrivia";

export type TriviaEntry = { name: string; aliases: string[] };
export type TriviaQuestion = { id: string; text: string; count: number; noun: string; plural: string; entries: TriviaEntry[]; short?: string };

type Category = { id: string; noun: string; plural: string; entries: TriviaEntry[]; short?: string };

const WORDS = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX"];
const e = (name: string, ...aliases: string[]): TriviaEntry => ({ name, aliases });
const list = (raw: string): TriviaEntry[] =>
  raw.split("|").map((item) => {
    const [name, ...aliases] = item.split("/");
    return e(name.trim(), ...aliases.map((a) => a.trim()));
  });

const BALLON = list(
  "Lionel Messi|Cristiano Ronaldo|Luka Modrić/Modric|Karim Benzema|Rodri|Ousmane Dembélé/Dembele|Harry Kane/Kane|Kaká/Kaka|Ronaldinho|Fabio Cannavaro/Cannavaro|Zinedine Zidane/Zidane|Rivaldo|Michael Owen/Owen|Pavel Nedvěd/Nedved|Andriy Shevchenko/Shevchenko|Luís Figo/Luis Figo/Figo|George Weah/Weah|Hristo Stoichkov/Stoichkov|Roberto Baggio/Baggio|Johan Cruyff/Cruyff|Marco van Basten/Van Basten|Michel Platini/Platini|Franz Beckenbauer/Beckenbauer|George Best|Bobby Charlton|Ronaldo Nazário/Ronaldo|Lothar Matthäus/Matthaus|Kevin Keegan|Gerd Müller/Gerd Muller|Ruud Gullit/Gullit|Matthias Sammer/Sammer|Eusébio/Eusebio|Stanley Matthews",
);
mergeWikiNames(BALLON, "ballon", "player");
const WC_NATIONS = list(
  "Brazil|Germany/West Germany|Italy|Argentina|France|Uruguay|England|Spain",
);
const CL_WINNERS = list(
  "Real Madrid|AC Milan/Milan|Liverpool|Bayern Munich/Bayern|Barcelona|Ajax|Inter Milan/Inter/Internazionale|Manchester United/Man United/Man Utd|Juventus|Benfica|Chelsea|Nottingham Forest/Forest|Porto|Celtic|Hamburg|Steaua Bucharest/Steaua|Marseille|Borussia Dortmund/Dortmund|Feyenoord|Aston Villa|PSV Eindhoven/PSV|Red Star Belgrade/Red Star|Manchester City/Man City|Paris Saint-Germain/PSG",
);
mergeWikiNames(CL_WINNERS, "uclWinners", "club");
const PL_WINNING_MANAGERS = list(
  "Alex Ferguson/Ferguson|Arsène Wenger/Arsene Wenger/Wenger|José Mourinho/Jose Mourinho/Mourinho|Carlo Ancelotti/Ancelotti|Manuel Pellegrini/Pellegrini|Claudio Ranieri/Ranieri|Antonio Conte/Conte|Pep Guardiola/Guardiola|Jürgen Klopp/Jurgen Klopp/Klopp|Kenny Dalglish/Dalglish|Arne Slot/Slot|  Roberto Mancini/Mancini|Mikel Arteta/Arteta",
);
const SCOTTISH_STADIUMS = list(
  "Celtic Park|Ibrox|Hampden Park/Hampden|Pittodrie|Tynecastle|Easter Road|Tannadice|Dens Park|Rugby Park|Fir Park|McDiarmid Park|Almondvale",
);
const PL_STADIUMS = list(
  "Emirates Stadium/Emirates|Villa Park|Vitality Stadium/Dean Court|Gtech Community Stadium/Gtech|Amex Stadium/Amex|Stamford Bridge|Selhurst Park|Goodison Park/Goodison|Craven Cottage|Elland Road|Anfield|Etihad Stadium/Etihad|Old Trafford|St James' Park/St James Park|City Ground|Stadium of Light|Tottenham Hotspur Stadium/White Hart Lane|Portman Road|Coventry Building Society Arena/CBS Arena|MKM Stadium",
);
const LL_STADIUMS = list(
  "Santiago Bernabéu/Santiago Bernabeu/Bernabeu|Camp Nou/Spotify Camp Nou|Metropolitano/Riyadh Air Metropolitano|Mestalla|San Mamés/San Mames|Benito Villamarín/Benito Villamarin|Ramón Sánchez-Pizjuán/Sanchez Pizjuan|Reale Arena/Anoeta|Balaídos/Balaidos|Mendizorroza|Coliseum/Coliseum Alfonso Pérez|La Cerámica/La Ceramica|El Sardinero|Riazor|La Rosaleda|RCDE Stadium/Stage Front Stadium|Ciutat de València/Ciutat de Valencia|Martínez Valero/Martinez Valero|Sadar/El Sadar|Estadio de Vallecas/Vallecas",
);
const SA_STADIUMS = list(
  "San Siro/Giuseppe Meazza|Allianz Stadium|Stadio Olimpico/Olimpico|Diego Armando Maradona/Stadio Maradona/San Paolo|Gewiss Stadium/Atleti Azzurri d'Italia|Stadio Artemio Franchi/Artemio Franchi|Stadio Renato Dall'Ara/Dall'Ara|Stadio Olimpico Grande Torino/Olimpico Grande Torino|Luigi Ferraris|Stadio Friuli/Dacia Arena/Bluenergy Stadium|Via del Mare|Mapei Stadium/Citta del Tricolore|Unipol Domus/Sant'Elia|Stadio Ennio Tardini/Tardini|Stadio Penzo/Penzo|Stadio Giuseppe Sinigaglia/Sinigaglia|Stadio Benito Stirpe/Stirpe|U-Power Stadium",
);
const UCL_STADIUMS = list(
  "Old Trafford|Anfield|Santiago Bernabéu/Santiago Bernabeu/Bernabeu|Camp Nou|San Siro|Allianz Arena|Signal Iduna Park/Westfalenstadion|Parc des Princes|Johan Cruyff Arena/Amsterdam Arena|Estádio da Luz/Estadio da Luz|Estádio do Dragão/Estadio do Dragao/Dragao|Celtic Park|Juventus Stadium/Allianz Stadium|Stamford Bridge|Etihad Stadium/Etihad|Emirates Stadium/Emirates|Wembley|Metropolitano|Stade Vélodrome/Velodrome|De Kuip|Philips Stadion|Ali Sami Yen/Rams Park|Maksimir|Ernst Happel|Olympiastadion",
);

const STATIC: Record<Competition, Category[]> = {
  general: [],
  worldcup: [],
  euros: [],
  copa: [],
  bundesliga: [],
  ligue1: [],
  superlig: [],
  pl: [
    { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
    { id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS },
    { id: "s-plmgr", noun: "manager who has won the Premier League", plural: "managers who have won the Premier League", entries: PL_WINNING_MANAGERS },
    { id: "s-plstad", noun: "stadium of a current Premier League club", plural: "stadiums of current Premier League clubs", entries: PL_STADIUMS },
    { id: "s-scotstad", noun: "Scottish football stadium", plural: "Scottish football stadiums", entries: SCOTTISH_STADIUMS },
    { id: "s-clwin", noun: "club that has won the Champions League", plural: "clubs that have won the Champions League", entries: CL_WINNERS },
  ],
  laliga: [
    { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
    { id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS },
    { id: "s-llstad", noun: "stadium of a current La Liga club", plural: "stadiums of current La Liga clubs", entries: LL_STADIUMS },
    { id: "s-clwin", noun: "club that has won the Champions League", plural: "clubs that have won the Champions League", entries: CL_WINNERS },
  ],
  seriea: [
    { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
    { id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS },
    { id: "s-sastad", noun: "stadium of a current Serie A club", plural: "stadiums of current Serie A clubs", entries: SA_STADIUMS },
    { id: "s-clwin", noun: "club that has won the Champions League", plural: "clubs that have won the Champions League", entries: CL_WINNERS },
  ],
  ucl: [
    { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
    { id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS },
    { id: "s-uclstad", noun: "stadium that has hosted Champions League football", plural: "stadiums that have hosted Champions League football", entries: UCL_STADIUMS },
    { id: "s-clwin", noun: "club that has won the Champions League", plural: "clubs that have won the Champions League", entries: CL_WINNERS },
  ],
};

const cat = (id: string, noun: string, plural: string, raw: string): Category => ({ id, noun, plural, entries: list(raw) });

const SHARED_EXTRA: Category[] = [
  cat("s-euro", "nation that has won the European Championship", "nations that have won the European Championship", "Spain|Germany/West Germany|Italy|France|Portugal|Greece|Denmark|Netherlands/Holland|Czechoslovakia|Soviet Union/USSR"),
  cat("s-wcfinal", "player who scored in a World Cup final", "players who scored in a World Cup final", "Pelé/Pele|Geoff Hurst/Hurst|Zinedine Zidane/Zidane|Kylian Mbappé/Kylian Mbappe/Mbappe|Lionel Messi/Messi|Mario Götze/Mario Gotze/Gotze|Ferran Torres/Torres|Ronaldo Nazário/Ronaldo|Mario Kempes/Kempes|Andrés Iniesta/Andres Iniesta/Iniesta|Paul Breitner/Breitner|Gerd Müller/Gerd Muller|Marco Tardelli/Tardelli|Ángel Di María/Angel Di Maria/Di Maria|Marco Materazzi/Materazzi|Marcel Desailly/Desailly|Emmanuel Petit/Petit"),
  cat("s-clmgr", "manager who has won the Champions League or European Cup", "managers who have won the Champions League or European Cup", "Carlo Ancelotti/Ancelotti|Pep Guardiola/Guardiola|Zinedine Zidane/Zidane|Jürgen Klopp/Jurgen Klopp/Klopp|José Mourinho/Jose Mourinho/Mourinho|Alex Ferguson/Ferguson|Hansi Flick/Flick|Luis Enrique|Jupp Heynckes/Heynckes|Vicente del Bosque/Del Bosque|Frank Rijkaard/Rijkaard|Bob Paisley/Paisley|Ottmar Hitzfeld/Hitzfeld|Marcello Lippi/Lippi|Arrigo Sacchi/Sacchi|Johan Cruyff/Cruyff|Louis van Gaal/Van Gaal|Rafa Benítez/Rafa Benitez/Benitez|Thomas Tuchel/Tuchel|Brian Clough/Clough|Fabio Capello/Capello|Roberto Di Matteo/Di Matteo"),
  cat("s-clmulti", "player who has won the Champions League with two different clubs", "players who have won the Champions League with two different clubs", "Clarence Seedorf/Seedorf|Samuel Eto'o/Eto'o/Etoo|Cristiano Ronaldo|Xabi Alonso|Toni Kroos/Kroos|David Alaba/Alaba|Marcel Desailly/Desailly|Paulo Sousa|Edwin van der Sar/Van der Sar"),
  cat("s-wchost", "country that has hosted the men's World Cup", "countries that have hosted the men's World Cup", "Uruguay|Italy|France|Brazil|Switzerland|Sweden|Chile|England|Mexico|West Germany/Germany|Argentina|Spain|United States/USA|Canada|South Korea/Japan|South Africa|Russia|Qatar"),
  cat("s-wcball", "player who has won the World Cup Golden Ball", "players who have won the World Cup Golden Ball", "Paolo Rossi/Rossi|Diego Maradona/Maradona|Salvatore Schillaci/Schillaci|Romário/Romario|Ronaldo Nazário/Ronaldo|Oliver Kahn/Kahn|Zinedine Zidane/Zidane|Diego Forlán/Diego Forlan/Forlan|Lionel Messi/Messi|  Luka Modrić/Luka Modric/Modric|Rodri|Mario Kempes/Kempes"),
  cat("s-wcboot", "player who has won the World Cup Golden Boot", "players who have won the World Cup Golden Boot", "Just Fontaine/Fontaine|Gerd Müller/Gerd Muller|Gary Lineker/Lineker|Salvatore Schillaci/Schillaci|Davor Šuker/Davor Suker/Suker|Ronaldo Nazário/Ronaldo|Miroslav Klose/Klose|Thomas Müller/Thomas Muller|James Rodríguez/James Rodriguez/James|Harry Kane/Kane|Kylian Mbappé/Kylian Mbappe/Mbappe|Eusébio/Eusebio|Paolo Rossi/Rossi|Mario Kempes/Kempes|Sándor Kocsis/Sandor Kocsis/Kocsis|Ademir"),
  cat("s-wccapt", "captain of a men's World Cup-winning team", "captains of men's World Cup-winning teams", "Lionel Messi/Messi|Hugo Lloris/Lloris|Didier Deschamps/Deschamps|Cafu|Fabio Cannavaro/Cannavaro|Iker Casillas/Casillas|Philipp Lahm/Lahm|Lothar Matthäus/Lothar Matthaus/Matthaus|Diego Maradona/Maradona|Dunga|Bobby Moore/Moore|Franz Beckenbauer/Beckenbauer|Daniel Passarella/Passarella|Dino Zoff/Zoff|Carlos Alberto"),
  cat("s-wcgk", "goalkeeper who has won the World Cup", "goalkeepers who have won the World Cup", "Gianluigi Buffon/Buffon|Iker Casillas/Casillas|Hugo Lloris/Lloris|Manuel Neuer/Neuer|Emiliano Martínez/Emiliano Martinez/Martinez|Unai Simón/Unai Simon/Simon|Fabien Barthez/Barthez|Dino Zoff/Zoff|Gordon Banks/Banks|Gilmar|Cláudio Taffarel/Claudio Taffarel/Taffarel|Marcos|Sepp Maier/Maier|Ubaldo Fillol/Fillol"),
  cat("s-ballonfw", "player who has won the Ballon d'Or while playing for Real Madrid or Barcelona", "players who have won the Ballon d'Or while playing for Real Madrid or Barcelona", "Cristiano Ronaldo|Lionel Messi/Messi|Luka Modrić/Luka Modric/Modric|Karim Benzema/Benzema|Ronaldo Nazário/Ronaldo|Luís Figo/Luis Figo/Figo|Rivaldo|Hristo Stoichkov/Stoichkov|Alfredo Di Stéfano/Alfredo Di Stefano/Di Stefano|Raymond Kopa/Kopa|Ronaldinho|Johan Cruyff/Cruyff"),
];

const LEAGUE_EXTRA: Pick<Record<Competition, Category[]>, "pl" | "laliga" | "seriea" | "ucl"> = {
  pl: [
    cat("s-pllondon", "London club that has played in the Premier League", "London clubs that have played in the Premier League", "Arsenal|Chelsea|Tottenham Hotspur/Tottenham/Spurs|West Ham United/West Ham|Crystal Palace/Palace|Fulham|Brentford|Charlton Athletic/Charlton|Wimbledon|Queens Park Rangers/QPR"),
    cat("s-plnw", "North West England club that has played in the Premier League", "North West England clubs that have played in the Premier League", "Manchester United/Man United/Man Utd|Manchester City/Man City|Liverpool|Everton|Blackburn Rovers/Blackburn|Bolton Wanderers/Bolton|Wigan Athletic/Wigan|Burnley|Oldham Athletic/Oldham|Blackpool"),
    cat("s-plgb",  "player who has won the Premier League Golden Boot", "players who have won the Premier League Golden Boot", "Alan Shearer/Shearer|Thierry Henry/Henry|Mohamed Salah/Salah|Harry Kane/Kane|Erling Haaland/Haaland|Son Heung-min/Heung-min Son/Son|Sergio Agüero/Sergio Aguero/Aguero|Jamie Vardy/Vardy|Luis Suárez/Luis Suarez/Suarez|Robin van Persie/Van Persie|Didier Drogba/Drogba|Cristiano Ronaldo|Ruud van Nistelrooy/Van Nistelrooy|Kevin Phillips|Jimmy Floyd Hasselbaink/Hasselbaink|Andy Cole|Teddy Sheringham/Sheringham|Michael Owen/Owen|Nicolas Anelka/Anelka|Dwight Yorke/Yorke|Carlos Tevez/Tevez|Dimitar Berbatov/Berbatov|Sadio Mané/Sadio Mane/Mane|Pierre-Emerick Aubameyang/Aubameyang"),
    cat("s-plclub", "club that has won the Premier League", "clubs that have won the Premier League", "Manchester United/Man United/Man Utd|Arsenal|Chelsea|Manchester City/Man City|Blackburn Rovers/Blackburn|Leicester City/Leicester|Liverpool"),
    cat("s-plrel", "club that has been relegated from the Premier League", "clubs that have been relegated from the Premier League", "Sunderland|Norwich City/Norwich|Burnley|Sheffield United|Southampton|Leicester City/Leicester|Ipswich Town/Ipswich|Wigan Athletic/Wigan|Bolton Wanderers/Bolton|Blackburn Rovers/Blackburn|Middlesbrough|Hull City/Hull|Queens Park Rangers/QPR|Stoke City/Stoke|Swansea City/Swansea|Watford|Fulham|Derby County/Derby|Portsmouth|Birmingham City/Birmingham|Charlton Athletic/Charlton|Coventry City/Coventry|Leeds United/Leeds|West Ham United/West Ham|Newcastle United/Newcastle|Aston Villa|West Bromwich Albion/West Brom|Cardiff City/Cardiff|Huddersfield Town/Huddersfield|Reading|Wolverhampton Wanderers/Wolves|Wimbledon|Nottingham Forest/Forest|Crystal Palace/Palace|AFC Bournemouth/Bournemouth|Sheffield Wednesday"),
    cat("s-plinv", "member of Arsenal's 2003/04 Invincibles squad", "members of Arsenal's 2003/04 Invincibles squad", "Thierry Henry/Henry|Dennis Bergkamp/Bergkamp|Patrick Vieira/Vieira|Robert Pires/Pires|Freddie Ljungberg/Ljungberg|Sol Campbell/Campbell|Ashley Cole/Cole|Lauren|Kolo Touré/Kolo Toure/Toure|Jens Lehmann/Lehmann|Gilberto Silva/Gilberto|Edu|Nwankwo Kanu/Kanu|Sylvain Wiltord/Wiltord|Ray Parlour/Parlour|Martin Keown/Keown|Jose Antonio Reyes/Reyes|Cesc Fàbregas/Cesc Fabregas/Fabregas"),
    cat("s-plcapt", "player who captained a Premier League title-winning team", "players who captained a Premier League title-winning team", "Tony Adams/Adams|Roy Keane/Keane|Steve Bruce/Bruce|Patrick Vieira/Vieira|John Terry/Terry|Vincent Kompany/Kompany|Wes Morgan|Nemanja Vidić/Nemanja Vidic/Vidic|Rio Ferdinand/Ferdinand|Jordan Henderson/Henderson|Martin Ødegaard/Martin Odegaard/Odegaard|Virgil van Dijk/Van Dijk|İlkay Gündoğan/Ilkay Gundogan/Gundogan"),
    cat("s-plmun7", "player who has worn number 7 for Manchester United", "players who have worn number 7 for Manchester United", "Eric Cantona/Cantona|David Beckham/Beckham|Cristiano Ronaldo|George Best/Best|Bryan Robson/Robson|Ángel Di María/Angel Di Maria/Di Maria|Alexis Sánchez/Alexis Sanchez|Memphis Depay/Memphis|Mason Mount/Mount|Edinson Cavani/Cavani|Michael Owen/Owen"),
  ],
  laliga: [
    cat("s-llclub", "club that has won La Liga", "clubs that have won La Liga", "Real Madrid|Barcelona|Atlético Madrid/Atletico Madrid/Atletico|Athletic Club/Athletic Bilbao/Bilbao|Valencia|Real Sociedad/Sociedad|Real Betis/Betis|Sevilla|Deportivo La Coruña/Deportivo/Depor"),
    cat("s-ll2010", "member of Spain's 2010 World Cup-winning squad", "members of Spain's 2010 World Cup-winning squad", "Iker Casillas/Casillas|Gerard Piqué/Gerard Pique/Pique|Carles Puyol/Puyol|Sergio Ramos/Ramos|Xavi Hernández/Xavi|Andrés Iniesta/Andres Iniesta/Iniesta|Sergio Busquets/Busquets|Xabi Alonso|David Villa/Villa|Fernando Torres/Torres|Cesc Fàbregas/Cesc Fabregas/Fabregas|Pedro|Joan Capdevila/Capdevila|Juan Mata/Mata|David Silva/Silva|Álvaro Arbeloa/Alvaro Arbeloa/Arbeloa|Raúl Albiol/Raul Albiol/Albiol|Víctor Valdés/Victor Valdes/Valdes|Pepe Reina/Reina|Jesús Navas/Jesus Navas/Navas|Fernando Llorente/Llorente|Javi Martínez/Javi Martinez"),
    cat("s-llpich", "player who has won the Pichichi Trophy", "players who have won the Pichichi Trophy", "Lionel Messi/Messi|Cristiano Ronaldo|Raúl/Raul|Hugo Sánchez/Hugo Sanchez|Ronaldo Nazário/Ronaldo|Samuel Eto'o/Eto'o/Etoo|Diego Forlán/Diego Forlan/Forlan|Ruud van Nistelrooy/Van Nistelrooy|Luis Suárez/Luis Suarez/Suarez|Karim Benzema/Benzema|Robert Lewandowski/Lewandowski|Kylian Mbappé/Kylian Mbappe/Mbappe|Telmo Zarra/Zarra|Mario Kempes/Kempes|Artem Dovbyk/Dovbyk|Quini|Alfredo Di Stéfano/Alfredo Di Stefano/Di Stefano"),
    cat("s-llmasia", "Barcelona La Masia graduate", "Barcelona La Masia graduates", "Lionel Messi/Messi|Xavi Hernández/Xavi|Andrés Iniesta/Andres Iniesta/Iniesta|Carles Puyol/Puyol|Gerard Piqué/Gerard Pique/Pique|Sergio Busquets/Busquets|Cesc Fàbregas/Cesc Fabregas/Fabregas|Pedro|Víctor Valdés/Victor Valdes/Valdes|Lamine Yamal/Yamal|Gavi|Pau Cubarsí/Pau Cubarsi/Cubarsi|Alejandro Balde/Balde|Marc Bartra/Bartra|Thiago Alcântara/Thiago Alcantara/Thiago|Sergi Roberto|Jordi Alba/Alba|Pep Guardiola/Guardiola|Bojan Krkić/Bojan"),
    cat("s-llspmgr", "Spanish manager who has won La Liga", "Spanish managers who have won La Liga", "Pep Guardiola/Guardiola|Luis Enrique|Vicente del Bosque/Del Bosque|Rafa Benítez/Rafa Benitez/Benitez|Ernesto Valverde/Valverde|Xavi Hernández/Xavi|Javier Clemente/Clemente|Miguel Muñoz/Miguel Munoz|Quique Sánchez Flores/Quique Flores|Luis Aragonés/Luis Aragones/Aragones"),
    cat("s-lleuro", "La Liga club that has won a major European trophy", "La Liga clubs that have won a major European trophy", "Real Madrid|Barcelona|Atlético Madrid/Atletico Madrid/Atletico|Sevilla|Valencia|Villarreal|Real Zaragoza/Zaragoza"),
  ],
  seriea: [
    cat("s-saclub", "club that has won the Serie A title", "clubs that have won the Serie A title", "Juventus|Inter Milan/Inter/Internazionale|AC Milan/Milan|Genoa|Torino|Bologna|Pro Vercelli|Roma/AS Roma|Lazio|Fiorentina|Napoli|Sampdoria|Cagliari|Hellas Verona/Verona"),
    cat("s-sacap", "player who has won the Serie A top scorer award (Capocannoniere)", "players who have won the Serie A top scorer award (Capocannoniere)", "Gunnar Nordahl/Nordahl|Michel Platini/Platini|Marco van Basten/Van Basten|Gabriel Batistuta/Batistuta|Giuseppe Signori/Signori|Francesco Totti/Totti|Antonio Di Natale/Di Natale|Luca Toni/Toni|Zlatan Ibrahimović/Zlatan Ibrahimovic/Zlatan/Ibrahimovic|Edinson Cavani/Cavani|Gonzalo Higuaín/Gonzalo Higuain/Higuain|Ciro Immobile/Immobile|Cristiano Ronaldo|Mauro Icardi/Icardi|Fabio Quagliarella/Quagliarella|Victor Osimhen/Osimhen|Lautaro Martínez/Lautaro Martinez/Lautaro|Mateo Retegui/Retegui|Paolo Rossi"),
    cat("s-sagk", "goalkeeper who has won Serie A", "goalkeepers who have won Serie A", "Gianluigi Buffon/Buffon|Dida|Júlio César/Julio Cesar|Samir Handanović/Samir Handanovic/Handanovic|Walter Zenga/Zenga|Gianluca Pagliuca/Pagliuca|Angelo Peruzzi/Peruzzi|Mike Maignan/Maignan|Wojciech Szczęsny/Wojciech Szczesny/Szczesny|Francesco Toldo/Toldo|Dino Zoff/Zoff|Sebastiano Rossi"),
    cat("s-sajuve", "non-Italian player who won Serie A with Juventus", "non-Italian players who won Serie A with Juventus", "Michel Platini/Platini|Zinedine Zidane/Zidane|Pavel Nedvěd/Pavel Nedved/Nedved|David Trezeguet/Trezeguet|Cristiano Ronaldo|Paulo Dybala/Dybala|Carlos Tevez/Tevez|Paul Pogba/Pogba|Arturo Vidal/Vidal|Gonzalo Higuaín/Gonzalo Higuain/Higuain|Michael Laudrup/Laudrup|Zbigniew Boniek/Boniek"),
    cat("s-sadef", "legendary Serie A defender", "legendary Serie A defenders", "Paolo Maldini/Maldini|Franco Baresi/Baresi|Fabio Cannavaro/Cannavaro|Alessandro Nesta/Nesta|Giorgio Chiellini/Chiellini|Leonardo Bonucci/Bonucci|Lilian Thuram/Thuram|Gaetano Scirea/Scirea|Alessandro Costacurta/Costacurta|Andrea Barzagli/Barzagli|Jaap Stam/Stam|Javier Zanetti/Zanetti|Walter Samuel/Samuel|Marcel Desailly/Desailly"),
  ],
  ucl: [
    cat("s-uclfinallost", "club that has lost a European Cup or Champions League final", "clubs that have lost a European Cup or Champions League final", "Real Madrid|Juventus|Liverpool|Bayern Munich/Bayern|AC Milan/Milan|Inter Milan/Inter|Barcelona|Manchester United/Man United/Man Utd|Chelsea|Atlético Madrid/Atletico Madrid/Atletico|Borussia Dortmund/Dortmund|Paris Saint-Germain/PSG|Tottenham Hotspur/Tottenham/Spurs|Manchester City/Man City|Arsenal|Valencia|Benfica|Stade de Reims/Reims|Fiorentina|Leeds United/Leeds|Monaco|Bayer Leverkusen/Leverkusen|Club Brugge/Brugge|Panathinaikos|Partizan|Sampdoria|Malmö/Malmo|Roma/AS Roma|Eintracht Frankfurt/Frankfurt|Hamburg|Saint-Étienne/Saint-Etienne/St Etienne"),
    cat("s-uclpens", "club that has won a European Cup or Champions League final on penalties", "clubs that have won a European Cup or Champions League final on penalties", "Liverpool|Steaua Bucharest/Steaua|Juventus|Red Star Belgrade/Red Star|Bayern Munich/Bayern|AC Milan/Milan|Manchester United/Man United/Man Utd|Chelsea|Real Madrid|Paris Saint-Germain/PSG"),
    cat("s-uclscorers",  "player among the Champions League's all-time top scorers", "players among the Champions League's all-time top scorers", "Cristiano Ronaldo|Lionel Messi/Messi|Robert Lewandowski/Lewandowski|Karim Benzema/Benzema|Raúl/Raul|Thomas Müller/Thomas Muller/Muller|Ruud van Nistelrooy/Van Nistelrooy|Thierry Henry/Henry|Kylian Mbappé/Kylian Mbappe/Mbappe|Erling Haaland/Haaland|Andriy Shevchenko/Shevchenko|Alessandro Del Piero/Del Piero"),
  ],
};

const LEAGUE_ONLY = (items: { id: string; noun: string; plural: string; raw: string }[]): Category[] =>
  items.map((item) => ({ id: item.id, noun: item.noun, plural: item.plural, entries: list(item.raw) }));

const newLeagueStatic = (items: { id: string; noun: string; plural: string; raw: string }[]): Category[] => [
  { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
  { id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS },
  { id: "s-clwin", noun: "club that has won the Champions League", plural: "clubs that have won the Champions League", entries: CL_WINNERS },
  ...LEAGUE_ONLY(items),
];

STATIC.bundesliga = newLeagueStatic(BUNDESLIGA_TRIVIA);
STATIC.ligue1 = newLeagueStatic(LIGUE1_TRIVIA);
STATIC.superlig = newLeagueStatic(SUPERLIG_TRIVIA);

for (const comp of ["pl", "laliga", "seriea", "ucl"] as const) {
  STATIC[comp].push(...LEAGUE_EXTRA[comp]);
}
const LIVE_SHORT: Record<string, string> = {};
for (const comp of ["pl", "laliga", "seriea", "bundesliga", "ligue1", "superlig", "ucl"] as const) {
  for (const item of [...liveTriviaCategories(comp), ...wikiTriviaCategories(comp)]) {
    STATIC[comp].push({ id: item.id, noun: item.noun, plural: item.plural, entries: item.entries });
    LIVE_SHORT[item.id] = item.short;
  }
}
// General football / international trivia belongs to the Champions League; domestic leagues keep their own content.
const GENERAL_IDS = new Set(["s-ballon", "s-wc", "s-clwin", "s-scotstad", ...SHARED_EXTRA.map((item) => item.id)]);
const KEEP_FOR: Record<string, Competition[]> = { "s-ballonfw": ["laliga", "ucl"] };
for (const comp of REAL_COMPETITIONS) {
  if (comp === "ucl") {
    STATIC.ucl.push(...SHARED_EXTRA);
    continue;
  }
  STATIC[comp] = STATIC[comp].filter((item) => !GENERAL_IDS.has(item.id));
  if (comp === "laliga") STATIC.laliga.push(...SHARED_EXTRA.filter((item) => KEEP_FOR[item.id]?.includes(comp)));
}

// General mode: every competition's categories (de-duplicated) plus the international tournaments.
const TOURNAMENT_CATEGORIES = tournamentTriviaCategories();
for (const item of TOURNAMENT_CATEGORIES) LIVE_SHORT[item.id] = item.short;
for (const comp of TOURNAMENT_COMPETITIONS) {
  STATIC[comp] = [
    ...TOURNAMENT_TRIVIA[comp],
    { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
    ...(comp === "worldcup" ? [{ id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS }] : []),
  ];
}
STATIC.general = [...new Map([...REAL_COMPETITIONS.flatMap((comp) => STATIC[comp]), ...TOURNAMENT_CATEGORIES].map((item) => [item.id, item])).values()];

const CLUB_ALIASES: Record<string, string[]> = {
  mun: ["Man United", "Man Utd", "Manchester Utd"],
  mci: ["Man City"],
  tot: ["Spurs", "Tottenham Hotspur"],
  wol: ["Wolverhampton", "Wolverhampton Wanderers"],
  new: ["Newcastle United"],
  nfo: ["Forest", "Notts Forest"],
  wham: ["West Ham United"],
  bha: ["Brighton and Hove Albion", "Brighton & Hove Albion"],
  atm: ["Atletico Madrid", "Atletico"],
  ath: ["Athletic Bilbao", "Bilbao"],
  inter: ["Inter Milan", "Internazionale"],
  mil: ["Milan"],
  psg: ["Paris Saint-Germain", "Paris"],
  bay: ["Bayern Munich", "Bayern"],
};

function leagueClubCategory(comp: Competition): Category {
  if (isTournamentComp(comp)) return tournamentTeamsCategory(comp);
  const names = comp === "general" ? "top European leagues" : COMPETITION_LABELS[comp].replace(" McDonald's", "");
  return {
    id: "s-clubs",
    noun: `club in the ${names} this season`,
    plural: `clubs in the ${names} this season`,
    entries: DUEL_CLUBS[comp].map((club) => e(club.label, ...(CLUB_ALIASES[club.key] ?? []))),
  };
}

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const playerEntries = (names: string[]) => names.map((name) => e(name));

export function rollDice() {
  return 1 + Math.floor(Math.random() * 6);
}

export const BOARD_SIZE = 16;

export type BoardTile = { id: string; short: string; noun: string; plural: string; entries: TriviaEntry[] };

export const tileQuestion = (tile: BoardTile, count: number) =>
  `Name ${WORDS[count]} ${count === 1 ? tile.noun : tile.plural}`;

// How many answers a roll really demands: never more than the tile can reasonably supply.
export const answersFor = (tile: BoardTile, roll: number) => Math.max(1, Math.min(roll, tile.entries.length - 2));

const SHORT: Record<string, string> = {
  ...LIVE_SHORT,
  "s-ballon": "Ballon d'Or",
  "s-wc": "World Cup nations",
  "s-plmgr": "PL managers",
  "s-plstad": "Stadiums",
  "s-llstad": "Stadiums",
  "s-sastad": "Stadiums",
  "s-uclstad": "Stadiums",
  "s-scotstad": "Scottish stadiums",
  "s-clwin": "UCL winners",
  "s-clubs": "League clubs",
  "s-wchost": "WC hosts",
  "s-wcball": "WC Golden Ball",
  "s-wcboot": "WC Golden Boot",
  "s-wccapt": "WC captains",
  "s-wcgk": "WC keepers",
  "s-ballonfw": "Madrid/Barça Ballon d'Or",
  "s-pllondon": "London clubs",
  "s-plnw": "North West clubs",
  "s-uclfinallost": "Final losers",
  "s-uclpens": "Penalty winners",
  "s-euro": "Euro winners",
  "s-wcfinal": "WC final scorers",
  "s-clmgr": "UCL managers",
  "s-clmulti": "Double UCL winners",
  "s-plgb": "Golden Boot",
  "s-plclub": "PL champions",
  "s-plrel": "Relegated clubs",
  "s-plinv": "Invincibles",
  "s-plcapt": "Title captains",
  "s-plmun7": "United No. 7",
  "s-llclub": "Liga champions",
  "s-ll2010": "Spain 2010",
  "s-llpich": "Pichichi",
  "s-llmasia": "La Masia",
  "s-llspmgr": "Spanish managers",
  "s-lleuro": "Euro trophies",
  "s-saclub": "Scudetto clubs",
  "s-sacap": "Capocannoniere",
  "s-sagk": "Serie A keepers",
  "s-sajuve": "Juve foreigners",
  "s-sadef": "Defenders",
  "s-uclscorers": "UCL scorers",
};

const NATIONS: Record<string, string> = {
  esp: "Spanish", fra: "French", bra: "Brazilian", arg: "Argentine", por: "Portuguese", eng: "English", ned: "Dutch",
  bel: "Belgian", ger: "German", ita: "Italian", uru: "Uruguayan", mex: "Mexican", cro: "Croatian", wal: "Welsh",
  sen: "Senegalese", srb: "Serbian", col: "Colombian", chi: "Chilean", par: "Paraguayan", per: "Peruvian", ecu: "Ecuadorian",
  usa: "American", sui: "Swiss", den: "Danish", pol: "Polish", tur: "Turkish", aut: "Austrian", sco: "Scottish", nor: "Norwegian", swe: "Swedish",
};

// Questions built from the career dataset, so any player in it is a valid answer.
function dynamicById(comp: Competition, id: string): Category | null {
  const clubs = DUEL_CLUBS[comp];
  const facts = footballFacts(comp);
  const leagueKeys = new Set(clubs.map((club) => club.key));
  const names = (items: typeof facts) => playerEntries(items.map((fact) => fact.name));
  const [kind, a, b] = id.split("-");

  if (kind === "n") {
    const club = clubs.find((item) => item.key === b);
    if (!club || !NATIONS[a]) return null;
    const pool = facts.filter((fact) => fact.nat.includes(a) && fact.clubs.includes(club.key));
    if (pool.length < 7) return null;
    return {
      id,
      short: `${NATIONS[a]} at ${club.label}`,
      noun: `${NATIONS[a]} player who played for ${club.label}`,
      plural: `${NATIONS[a]} players who played for ${club.label}`,
      entries: names(pool),
    };
  }
  if (kind === "l") {
    if (!NATIONS[a]) return null;
    const pool = facts.filter((fact) => fact.nat.includes(a) && fact.clubs.some((key) => leagueKeys.has(key)));
    if (pool.length < 10) return null;
    return {
      id,
      short: `${NATIONS[a]} players`,
      noun: `${NATIONS[a]} player who played for a club in this league this season`,
      plural: `${NATIONS[a]} players who played for a club in this league this season`,
      entries: names(pool),
    };
  }
  if (kind === "h") {
    const club = clubs.find((item) => item.key === (b ?? a));
    if (!club) return null;
    const pool = facts.filter((fact) => fact.tags.includes("wc") && fact.clubs.includes(club.key));
    if (pool.length < 7) return null;
    return {
      id,
      short: `WC winners at ${club.label}`,
      noun: `World Cup winner who played for ${club.label}`,
      plural: `World Cup winners who played for ${club.label}`,
      entries: names(pool),
    };
  }
  if (kind === "m3" || kind === "m4") {
    const min = kind === "m3" ? 3 : 4;
    const pool = facts.filter((fact) => fact.clubs.filter((key) => leagueKeys.has(key)).length >= min);
    if (pool.length < 8) return null;
    const word = min === 3 ? "three" : "four";
    return {
      id,
      short: `${min}+ league clubs`,
      noun: `player who played for at least ${word} of this season's clubs in this league`,
      plural: `players who played for at least ${word} of this season's clubs in this league`,
      entries: names(pool),
    };
  }
  return null;
}

function dynamicCategory(comp: Competition): Category | null {
  const kind = Math.floor(Math.random() * 5);
  const club = pick(DUEL_CLUBS[comp]).key;
  const nat = pick(Object.keys(NATIONS));
  const id = [`n-${nat}-${club}`, `l-${nat}`, `h-wc-${club}`, "m3", "m4"][kind];
  return dynamicById(comp, id);
}

// Rebuilds a board tile from its id, so a server only needs to store the 16 ids.
export function tileById(comp: Competition, id: string): BoardTile | null {
  const clubs = DUEL_CLUBS[comp];
  const clubLabel = (key: string) => clubs.find((club) => club.key === key)?.label ?? key;
  let category: Category | null = null;
  let short = SHORT[id];
  if (id.startsWith("c-")) {
    const club = clubs.find((item) => item.key === id.slice(2));
    if (club) {
      category = { id, noun: `player who played for ${club.label}`, plural: `players who played for ${club.label}`, entries: playerEntries(playersForClub(club.key, comp)) };
      short = club.label;
    }
  } else if (id.startsWith("p-")) {
    const [a, b] = id.slice(2).split("-");
    const ca = clubs.find((item) => item.key === a);
    const cb = clubs.find((item) => item.key === b);
    if (ca && cb) {
      category = {
        id,
        noun: `player who played for both ${ca.label} and ${cb.label}`,
        plural: `players who played for both ${ca.label} and ${cb.label}`,
        entries: playerEntries(playersForBoth(a, b, comp)),
      };
      short = `${clubLabel(a)} + ${clubLabel(b)}`;
    }
  } else if (/^(n|l|h|m\d)/.test(id) && id !== "s-clubs") {
    category = dynamicById(comp, id);
    short = category?.short ?? short;
  } else {
    category = [...STATIC[comp], leagueClubCategory(comp)].find((item) => item.id === id) ?? null;
  }
  return category ? { id, short: short ?? "Trivia", noun: category.noun, plural: category.plural, entries: category.entries } : null;
}

// Builds a random path that gets harder: early squares have big answer pools, the final ones have the smallest.
export function generateBoardIds(comp: Competition): string[] {
  const used = new Set<string>();
  const candidates: { id: string; size: number }[] = [];
  for (let i = 0; i < BOARD_SIZE * 25 && candidates.length < BOARD_SIZE * 5; i += 1) {
    const q = pickTriviaQuestion(comp, 6, used);
    if (used.has(q.id)) continue;
    used.add(q.id);
    candidates.push({ id: q.id, size: q.entries.length });
  }
  candidates.sort((a, b) => b.size - a.size);
  const chunk = Math.max(1, candidates.length / BOARD_SIZE);
  const taken = new Set<string>();
  return Array.from({ length: BOARD_SIZE }, (_, i) => {
    const start = Math.floor(i * chunk);
    const end = Math.max(start + 1, Math.floor((i + 1) * chunk));
    const options = candidates.slice(start, end).filter((c) => !taken.has(c.id));
    const choice = options.length ? options[Math.floor(Math.random() * options.length)] : candidates.find((c) => !taken.has(c.id)) ?? candidates[0];
    taken.add(choice.id);
    return choice.id;
  });
}

export function generateBoard(comp: Competition): BoardTile[] {
  return generateBoardIds(comp).map((id) => tileById(comp, id) as BoardTile);
}

// Search over every possible answer type so suggestions never reveal which ones are correct.
export function suggestTrivia(comp: Competition, query: string, limit = 8): string[] {
  const q = normalizeFootballPlayerName(query);
  if (q.length < 2) return [];
  const names = new Set(searchDuelPlayers(comp, query, limit));
  for (const category of [...STATIC[comp], leagueClubCategory(comp)]) {
    for (const entry of category.entries) {
      if (names.size >= limit * 2) break;
      if ([entry.name, ...entry.aliases].some((n) => normalizeFootballPlayerName(n).includes(q))) names.add(entry.name);
    }
  }
  return [...names].slice(0, limit);
}

export function triviaSeconds(count: number) {
  return 12 + count * 7;
}

// Picks a category whose answer pool is comfortably bigger than the number asked for.
export function pickTriviaQuestion(comp: Competition, count: number, used: Set<string>): TriviaQuestion {
  const clubs = DUEL_CLUBS[comp];
  const need = count + 3;
  const build = (id: string, category: Category): TriviaQuestion => ({
    id,
    count,
    noun: category.noun,
    plural: category.plural,
    entries: category.entries,
    short: category.short,
    text: `Name ${WORDS[count]} ${count === 1 ? category.noun : category.plural}`,
  });

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const roll = Math.random();
    if (roll < 0.25) {
      const club = pick(clubs);
      const id = `c-${club.key}`;
      if (used.has(id)) continue;
      const names = playersForClub(club.key, comp);
      if (names.length < Math.max(need, count * 3)) continue;
      return build(id, {
        id,
        noun: `player who played for ${club.label}`,
        plural: `players who played for ${club.label}`,
        entries: playerEntries(names),
      });
    }
    if (roll < 0.4) {
      const a = pick(clubs);
      const b = pick(clubs);
      if (a.key >= b.key) continue;
      const id = `p-${a.key}-${b.key}`;
      if (used.has(id)) continue;
      const names = playersForBoth(a.key, b.key, comp);
      if (names.length < need) continue;
      return build(id, {
        id,
        noun: `player who played for both ${a.label} and ${b.label}`,
        plural: `players who played for both ${a.label} and ${b.label}`,
        entries: playerEntries(names),
      });
    }
    if (roll < 0.65) {
      const dynamic = dynamicCategory(comp);
      if (!dynamic || used.has(dynamic.id)) continue;
      return build(dynamic.id, dynamic);
    }
    const statics = [...STATIC[comp], leagueClubCategory(comp)].filter(
      (category) => !used.has(category.id) && category.entries.length >= need,
    );
    if (statics.length === 0) continue;
    const category = pick(statics);
    return build(category.id, category);
  }

  const fallback = leagueClubCategory(comp);
  return build(fallback.id, fallback);
}

function distance(a: string, b: string) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return prev[b.length];
}

// Returns the matching entry for a guess, or null. Accepts full names, aliases, unique surnames and small typos.
export function matchTriviaAnswer(entries: TriviaEntry[], guess: string): TriviaEntry | null {
  const g = normalizeFootballPlayerName(guess);
  if (g.length < 3) return null;
  const forms = entries.map((entry) => ({
    entry,
    full: [entry.name, ...entry.aliases].map(normalizeFootballPlayerName),
  }));
  const exact = forms.find((form) => form.full.includes(g));
  if (exact) return exact.entry;

  if (g.length >= 4) {
    const byWord = forms.filter((form) =>
      form.full.some((full) => full.split(" ").some((word) => word === g)),
    );
    if (byWord.length === 1) return byWord[0].entry;
  }

  const tolerance = g.length >= 10 ? 2 : g.length >= 5 ? 1 : 0;
  if (tolerance === 0) return null;
  let best: TriviaEntry | null = null;
  let bestScore = tolerance + 1;
  let ties = 0;
  for (const form of forms) {
    for (const full of form.full) {
      const words = full.split(" ");
      const candidates = [full, ...(words.length > 1 ? [words[words.length - 1]] : [])];
      for (const candidate of candidates) {
        const d = distance(g, candidate);
        if (d < bestScore) {
          bestScore = d;
          best = form.entry;
          ties = 1;
        } else if (d === bestScore && best !== form.entry) {
          ties += 1;
        }
      }
    }
  }
  return best && ties === 1 ? best : null;
}
