import { REAL_COMPETITIONS, TOURNAMENT_COMPETITIONS, type Competition, type RealCompetition, type TournamentComp } from "@/lib/competitions";
import { RONDO_TOURNAMENTS } from "@/data/rondoTournaments";
import { RONDO_TOURNAMENT_BANK } from "@/data/rondoTournamentBank";
import { RONDO_TOURNAMENT_LIVE } from "@/data/rondoTournamentLive";
import { RONDO_MORE } from "@/data/rondoMore";
import { RONDO_EXTRA } from "@/data/rondoExtra";
import { RONDO_BONUS } from "@/data/rondoBonus";
import { RONDO_BONUS2 } from "@/data/rondoBonus2";
import { RONDO_BONUS3 } from "@/data/rondoBonus3";
import { RONDO_BONUS4 } from "@/data/rondoBonus4";
import { BUNDESLIGA_RONDO } from "@/data/bundesligaContent";
import { LIGUE1_RONDO } from "@/data/ligue1Content";
import { SUPERLIG_RONDO } from "@/data/superligContent";

export type RondoClue = {
  letter: string;
  clue: string;
  answers: string[]; // accepted spellings; the first is shown as the correct answer
  contains?: boolean; // the answer contains the letter instead of starting with it
};

const r = (letter: string, clue: string, answers: string, contains = false): RondoClue => ({
  letter,
  clue,
  answers: answers.split("|"),
  contains,
});

// Several clues per letter; every game picks one at random for each letter.
const PL: RondoClue[] = [
  r("A", "Only club to complete a Premier League season unbeaten (2003-04)", "Arsenal"),
  r("A", "Birmingham club that won the European Cup in 1982 with a Peter Withe goal", "Aston Villa|Villa"),
  r("B", "Lancashire club that won the 1994-95 title with Kenny Dalglish as manager", "Blackburn Rovers|Blackburn"),
  r("B", "South-coast club nicknamed the Seagulls", "Brighton|Brighton and Hove Albion|Brighton & Hove Albion"),
  r("C", "London club that won its first Premier League title in 2004-05 under José Mourinho", "Chelsea"),
  r("C", "Man United number 7 nicknamed 'The King', who retired in 1997", "Cantona|Eric Cantona"),
  r("D", "Midlands club nicknamed the Rams, champions of England in 1972 and 1975", "Derby County|Derby"),
  r("D", "Ivorian striker, two-time Golden Boot winner who equalised in the 2012 Champions League final", "Drogba|Didier Drogba"),
  r("E", "Merseyside club that plays at Goodison Park", "Everton"),
  r("E", "Brazilian goalkeeper signed by Manchester City from Benfica in 2017", "Ederson"),
  r("F", "London club that plays at Craven Cottage", "Fulham"),
  r("F", "Scottish manager who won 13 Premier League titles with Manchester United", "Ferguson|Alex Ferguson|Sir Alex Ferguson"),
  r("G", "Liverpool captain who spent 17 years at Anfield and never won the Premier League", "Gerrard|Steven Gerrard"),
  r("G", "Manager of Manchester City's record 100-point season in 2017-18", "Guardiola|Pep Guardiola"),
  r("H", "Norwegian striker who scored a record 36 goals in the 2022-23 Premier League season", "Haaland|Erling Haaland"),
  r("H", "French forward and Arsenal's all-time record goalscorer", "Henry|Thierry Henry"),
  r("I", "Suffolk club nicknamed the Tractor Boys, champions of England in 1961-62", "Ipswich Town|Ipswich"),
  r("I", "Swedish striker who joined Manchester United from Paris Saint-Germain in 2016", "Ibrahimović|Ibrahimovic|Zlatan Ibrahimović|Zlatan Ibrahimovic|Zlatan"),
  r("J", "Brazilian striker who left Manchester City for Arsenal in 2022", "Jesus|Gabriel Jesus"),
  r("J", "Liverpool captain who lifted the 2019 Champions League and the 2020 league trophy", "Jordan Henderson|Henderson"),
  r("K", "German manager who ended Liverpool's 30-year title wait in 2019-20", "Klopp|Jürgen Klopp|Jurgen Klopp"),
  r("K", "French midfielder who won the league with Leicester in 2016 and Chelsea in 2017", "Kanté|Kante|N'Golo Kanté|N'Golo Kante"),
  r("L", "Club that won the title in 2015-16 at odds of 5000-1", "Leicester City|Leicester"),
  r("L", "Club with 20 league titles that plays at Anfield", "Liverpool"),
  r("M", "Club with 13 Premier League titles", "Manchester United|Man United|Man Utd"),
  r("M", "Egyptian forward who scored 32 league goals in his first season at Liverpool", "Mohamed Salah|Salah|Mo Salah"),
  r("N", "Tyneside club nicknamed the Magpies", "Newcastle United|Newcastle"),
  r("N", "East Midlands club that won back-to-back European Cups in 1979 and 1980", "Nottingham Forest|Forest"),
  r("O", "Norwegian 'baby-faced assassin' who scored four goals as a substitute against Nottingham Forest in 1999", "Ole Gunnar Solskjær|Ole Gunnar Solskjaer|Ole"),
  r("P", "Danish goalkeeper of Manchester United's 1999 treble team", "Peter Schmeichel|Schmeichel"),
  r("P", "South-coast club that won the FA Cup in 2008, nicknamed Pompey", "Portsmouth"),
  r("Q", "London club nicknamed the Hoops that played in the Premier League between 2011 and 2015", "Queens Park Rangers|QPR"),
  r("R", "Manchester United's all-time record goalscorer with 253 goals", "Wayne Rooney|Rooney"),
  r("R", "Italian manager who won the 2015-16 Premier League with Leicester", "Ranieri|Claudio Ranieri"),
  r("S", "Premier League's all-time top scorer with 260 goals", "Alan Shearer|Shearer"),
  r("S", "South-coast club nicknamed the Saints", "Southampton"),
  r("T", "North London club that Harry Kane left for Bayern Munich in 2023", "Tottenham Hotspur|Tottenham|Spurs"),
  r("T", "Chelsea captain and centre-back who won five Premier League titles", "John Terry|Terry"),
  r("U", "Spanish manager who took charge of Arsenal in 2018 and later Aston Villa", "Unai Emery|Emery"),
  r("V", "Dutch centre-back signed by Liverpool from Southampton in 2018", "Virgil van Dijk|Van Dijk"),
  r("V", "French Arsenal captain of the Invincibles", "Vieira|Patrick Vieira"),
  r("W", "French manager who spent 22 years at Arsenal", "Wenger|Arsène Wenger|Arsene Wenger"),
  r("W", "London club nicknamed the Hammers", "West Ham United|West Ham"),
  r("X", "Spanish Liverpool midfielder who won the 2005 Champions League", "Xabi Alonso|Alonso"),
  r("X", "Chilean forward who joined Arsenal from Barcelona in 2014", "Alexis Sánchez|Alexis Sanchez|Alexis", true),
  r("Y", "Ivorian midfielder who was a powerhouse for Manchester City from 2010 to 2018", "Yaya Touré|Yaya Toure|Yaya"),
  r("Y", "Trinidadian striker who partnered Andy Cole in Manchester United's 1999 treble", "Yorke|Dwight Yorke"),
  r("Z", "Italian forward who was FWA Footballer of the Year at Chelsea in 1997 and 2003", "Zola|Gianfranco Zola"),
  r("Z", "German playmaker who joined Arsenal from Real Madrid in 2013", "Mesut Özil|Mesut Ozil|Özil|Ozil", true),
];

const LL: RondoClue[] = [
  r("A", "Red-and-white striped club that plays at the Metropolitano", "Atlético Madrid|Atletico Madrid|Atletico|Atlético"),
  r("A", "Basque club that only fields Basque players, playing at San Mamés", "Athletic Club|Athletic Bilbao|Athletic"),
  r("B", "Catalan club whose stadium is the Camp Nou", "Barcelona|FC Barcelona|Barça|Barca"),
  r("B", "French striker who won the 2022 Ballon d'Or with Real Madrid", "Benzema|Karim Benzema"),
  r("C", "Portuguese forward who scored 450 goals for Real Madrid in all competitions", "Cristiano Ronaldo|Ronaldo|Cristiano"),
  r("C", "Spanish goalkeeper and Real Madrid captain nicknamed 'The Saint'", "Casillas|Iker Casillas"),
  r("D", "Galician club that won La Liga in 1999-2000", "Deportivo La Coruña|Deportivo|Deportivo La Coruna|Depor"),
  r("D", "Argentine manager of Atlético Madrid since 2011", "Diego Simeone|Simeone"),
  r("E", "Barcelona's neighbouring club that plays in Cornellà", "Espanyol|RCD Espanyol"),
  r("E", "Cameroonian striker who won the treble with Barcelona in 2009", "Eto'o|Samuel Eto'o|Etoo"),
  r("F", "Portuguese winger who crossed from Barcelona to Real Madrid in 2000", "Figo|Luis Figo"),
  r("F", "Colombian who played for Atlético Madrid", "Falcao|Radamel Falcao"),
  r("G", "Club from a suburb of Madrid that plays at the Coliseum", "Getafe"),
  r("G", "Catalan club that finished third in La Liga in 2023-24", "Girona"),
  r("H", "Mexican striker who won five Pichichis in Spain", "Hugo Sánchez|Hugo Sanchez"),
  r("H", "Spanish defender and Real Madrid captain", "Hierro|Fernando Hierro"),
  r("I", "Barcelona midfielder who scored the 2010 World Cup final winner", "Iniesta|Andrés Iniesta|Andres Iniesta"),
  r("I", "Croatian midfielder who played for Sevilla and Barcelona", "Ivan Rakitić|Rakitic|Rakitić"),
  r("J", "Spanish left-back who joined Barcelona from Valencia in 2012", "Jordi Alba|Alba"),
  r("J", "Slovenian goalkeeper at Atlético Madrid", "Oblak|Jan Oblak"),
  r("K", "German midfielder who won four Champions Leagues with Real Madrid", "Toni Kroos|Kroos"),
  r("K", "Japanese winger at Real Sociedad", "Takefusa Kubo|Kubo"),
  r("L", "Argentine with the most La Liga goals of all time (474)", "Lionel Messi|Messi"),
  r("L", "Valencia-based club nicknamed Granotas", "Levante"),
  r("M", "Balearic club that won the Copa del Rey in 2003", "Mallorca|RCD Mallorca"),
  r("M", "Brazilian left-back with 25 trophies at Real Madrid", "Marcelo"),
  r("N", "Brazilian forward who joined Barcelona in 2013 and left for PSG for €222m", "Neymar"),
  r("N", "Spanish defender who spent over 20 years at Real Madrid before leaving in 2024", "Nacho|Nacho Fernández|Nacho Fernandez"),
  r("O", "Navarre club that plays in Pamplona", "Osasuna|CA Osasuna"),
  r("O", "Slovenian goalkeeper who has won several Zamora trophies at Atlético", "Oblak|Jan Oblak"),
  r("P", "Hungarian who scored four goals in the 1960 European Cup final for Real Madrid", "Puskás|Ferenc Puskás|Puskas|Ferenc Puskas"),
  r("P", "Long-haired Barcelona captain and centre-back", "Puyol|Carles Puyol"),
  r("Q", "Spanish manager who took charge of Barcelona in January 2020", "Quique Setién|Quique Setien|Setién|Setien|Quique"),
  r("R", "Club with 15 European Cups", "Real Madrid"),
  r("R", "Madrid legend nicknamed 'El Ángel de Madrid'", "Raúl|Raul|Raúl González"),
  r("S", "Andalusian club with a record seven Europa League titles", "Sevilla"),
  r("S", "Real Madrid captain who headed the 93rd-minute equaliser in the 2014 Champions League final", "Sergio Ramos|Ramos"),
  r("T", "Athletic Club striker who scored 38 league goals in 1950-51, a record for a season", "Telmo Zarra|Zarra"),
  r("T", "German goalkeeper who has played for Barcelona since 2014", "Marc-André ter Stegen|ter Stegen|Ter Stegen"),
  r("U", "Spanish manager who won three straight Europa Leagues with Sevilla", "Unai Emery|Emery"),
  r("U", "Uruguayan striker who joined Barcelona from Liverpool in 2014", "Luis Suárez|Luis Suarez|Suárez|Suarez", true),
  r("V", "Club from Mestalla nicknamed Los Che", "Valencia"),
  r("V", "Brazilian winger who scored in the 2022 Champions League final for Real Madrid", "Vinícius Júnior|Vinicius Junior|Vinicius|Vini Jr"),
  r("W", "Polish striker who joined Barcelona in 2022 and won the Pichichi", "Robert Lewandowski|Lewandowski", true),
  r("X", "Barcelona midfield maestro who later managed the club (2021-2024)", "Xavi|Xavi Hernández|Xavi Hernandez"),
  r("X", "Spanish midfielder who played for Real Madrid and later managed Bayer Leverkusen", "Xabi Alonso|Alonso"),
  r("Y", "Barcelona teenager who starred at Euro 2024", "Yamal|Lamine Yamal"),
  r("Y", "Moroccan goalkeeper who starred for Sevilla and at the 2022 World Cup", "Yassine Bounou|Bounou|Bono"),
  r("Z", "French manager who won three straight Champions Leagues with Real Madrid", "Zinedine Zidane|Zidane"),
  r("Z", "Goalkeeper after whom the trophy for fewest goals conceded in La Liga is named", "Ricardo Zamora|Zamora"),
];

const SA: RondoClue[] = [
  r("A", "Bergamo club that won the Europa League in 2024 under Gian Piero Gasperini", "Atalanta"),
  r("A", "Juventus' all-time top scorer with 290 goals", "Alessandro Del Piero|Del Piero"),
  r("B", "Emilia-Romagna club that last won Serie A in 1963-64", "Bologna"),
  r("B", "Italian goalkeeper who moved from Parma to Juventus in 2001 for a world-record fee", "Gianluigi Buffon|Buffon"),
  r("C", "Sardinian club that won its only Scudetto in 1969-70 with Gigi Riva", "Cagliari"),
  r("C", "Italian manager who won two Champions Leagues with AC Milan", "Carlo Ancelotti|Ancelotti"),
  r("D", "Argentine who won two Scudetti with Napoli", "Diego Maradona|Maradona"),
  r("D", "Roma midfielder and one-club man, Italy's 2006 World Cup winner", "Daniele De Rossi|De Rossi"),
  r("E", "Tuscan club that plays at the Castellani", "Empoli"),
  r("E", "Cameroonian striker who won the treble with Inter in 2010", "Samuel Eto'o|Eto'o|Etoo"),
  r("F", "Tuscan club that won Serie A in 1955-56 and 1968-69, 'La Viola'", "Fiorentina|ACF Fiorentina"),
  r("F", "Roma's one-club captain with 250 Serie A goals", "Francesco Totti|Totti"),
  r("G", "Italy's oldest football club, nine times champions before 1925", "Genoa"),
  r("G", "Italian midfielder nicknamed 'Ringhio' who won two Champions Leagues with AC Milan", "Gattuso|Gennaro Gattuso"),
  r("H", "Veneto club that won its only Serie A title in 1984-85", "Hellas Verona|Verona"),
  r("H", "Argentine striker who scored a record 36 league goals in Serie A 2015-16", "Higuaín|Higuain|Gonzalo Higuaín|Gonzalo Higuain"),
  r("I", "Nerazzurri club that won the treble in 2010", "Inter|Inter Milan|Internazionale"),
  r("I", "Swedish striker who played for Juventus, Inter and AC Milan", "Zlatan Ibrahimović|Ibrahimovic|Zlatan|Ibrahimović"),
  r("J", "Turin club that won nine straight Scudetti from 2011-12 to 2019-20", "Juventus|Juve"),
  r("J", "Portuguese manager who won the 2010 treble with Inter and the 2022 Conference League with Roma", "José Mourinho|Jose Mourinho|Mourinho"),
  r("K", "Brazilian who won the Ballon d'Or in 2007 with AC Milan", "Kaká|Kaka"),
  r("K", "Georgian winger who helped Napoli win the Scudetto in 2022-23", "Kvaratskhelia|Khvicha Kvaratskhelia|Kvara"),
  r("L", "Rome club that won the Scudetto in 1999-2000", "Lazio|SS Lazio"),
  r("L", "Argentine captain of Inter who was Serie A top scorer in 2023-24", "Lautaro Martínez|Lautaro Martinez|Lautaro"),
  r("M", "Rossoneri club with seven European Cups", "AC Milan|Milan"),
  r("M", "One-club AC Milan defender with 902 appearances", "Paolo Maldini|Maldini"),
  r("N", "Naples club that won the 2022-23 title", "Napoli|SSC Napoli"),
  r("N", "Czech midfielder who won the 2003 Ballon d'Or at Juventus", "Pavel Nedvěd|Nedved|Nedvěd|Pavel Nedved"),
  r("O", "Nigerian striker who won the 2022-23 Scudetto with Napoli", "Victor Osimhen|Osimhen"),
  r("P", "Emilia-Romagna club that won the UEFA Cup in 1995 and 1999", "Parma"),
  r("P", "Italian regista who won the 2006 World Cup and played for Milan and Juventus", "Andrea Pirlo|Pirlo"),
  r("Q", "Italian forward who won the 2018-19 Capocannoniere at age 36 with Sampdoria", "Fabio Quagliarella|Quagliarella", true),
  r("R", "Rome club that won the 2000-01 Scudetto under Fabio Capello", "Roma|AS Roma"),
  r("R", "Brazilian 'R9' who scored 25 league goals for Inter in 1997-98", "Ronaldo|Ronaldo Nazário|Ronaldo Nazario"),
  r("S", "Genoa club that won the 1990-91 Scudetto with Vialli and Mancini", "Sampdoria"),
  r("S", "Emilia club that plays in green and black at the Mapei Stadium", "Sassuolo"),
  r("T", "Granata club of the 1940s side lost in the 1949 Superga air disaster", "Torino"),
  r("T", "Argentine forward who won Serie A with Juventus in 2013-14 and 2014-15", "Tevez|Carlos Tevez"),
  r("U", "Friuli club that plays at the Bluenergy Stadium", "Udinese"),
  r("V", "Sampdoria striker and Mancini's partner who won the 1991 Scudetto, later Chelsea manager", "Vialli|Gianluca Vialli"),
  r("W", "Liberian who won the 1995 Ballon d'Or with AC Milan", "George Weah|Weah", true),
  r("X", "Chilean forward who played for Udinese and later Inter", "Alexis Sánchez|Alexis Sanchez|Alexis", true),
  r("Y", "Turkish teenager who wears Juventus' number 10", "Yıldız|Yildiz|Kenan Yıldız|Kenan Yildiz"),
  r("Y", "Argentine forward nicknamed 'La Joya' who joined Roma from Juventus", "Paulo Dybala|Dybala", true),
  r("Z", "Argentine captain of Inter with 858 appearances", "Javier Zanetti|Zanetti"),
  r("Z", "Italy's 1982 World Cup-winning goalkeeper and captain", "Dino Zoff|Zoff"),
];

const UCL: RondoClue[] = [
  r("A", "London club beaten by Barcelona in the 2006 final", "Arsenal"),
  r("A", "Dutch club that won four European Cups, the last in 1995", "Ajax"),
  r("B", "Catalan club that won the Champions League in 2006, 2009, 2011 and 2015", "Barcelona|FC Barcelona|Barça|Barca"),
  r("B", "German club with six European Cups", "Bayern Munich|Bayern"),
  r("C", "Portuguese forward with a record 140 Champions League goals", "Cristiano Ronaldo|Ronaldo"),
  r("C", "London club that won the 2012 final on penalties against Bayern at the Allianz Arena", "Chelsea"),
  r("D", "Ivorian striker who equalised with a header in the 2012 final", "Drogba|Didier Drogba"),
  r("D", "Ruhr club beaten in the finals of 2013 and 2024", "Borussia Dortmund|Dortmund"),
  r("E", "Portuguese 'Black Panther' who scored two in Benfica's 1962 final against Real Madrid", "Eusébio|Eusebio"),
  r("E", "Cameroonian striker who scored in the 2006 and 2009 finals for Barcelona", "Samuel Eto'o|Eto'o|Etoo"),
  r("F", "Scottish manager who won the trophy in 1999 and 2008 with Manchester United", "Ferguson|Alex Ferguson|Sir Alex Ferguson"),
  r("F", "French winger who won the 2013 trophy with Bayern Munich", "Franck Ribéry|Ribéry|Ribery|Franck Ribery"),
  r("G", "Welsh winger who scored a bicycle kick in the 2018 final", "Gareth Bale|Bale"),
  r("G", "Manager who won the trophy with Barcelona in 2009 and 2011 and with Manchester City in 2023", "Pep Guardiola|Guardiola"),
  r("H", "French forward who lost the 2006 final with Arsenal and won the 2009 final with Barcelona", "Thierry Henry|Henry"),
  r("H", "German manager who won the trophy with Real Madrid in 1998 and Bayern in 2013", "Heynckes|Jupp Heynckes"),
  r("I", "Nerazzurri club that won the treble under José Mourinho in 2010", "Inter|Inter Milan|Internazionale"),
  r("I", "Barcelona midfielder who scored a stoppage-time equaliser at Stamford Bridge in 2009", "Iniesta|Andrés Iniesta|Andres Iniesta"),
  r("J", "Turin club that has lost seven European Cup finals", "Juventus|Juve"),
  r("J", "German manager who won the 2019 final with Liverpool", "Jürgen Klopp|Jurgen Klopp|Klopp"),
  r("K", "Brazilian playmaker who won the 2007 trophy with AC Milan", "Kaká|Kaka"),
  r("K", "French striker who won five Champions Leagues with Real Madrid", "Karim Benzema|Benzema"),
  r("L", "Merseyside club that came back from 3-0 down in the 2005 final", "Liverpool"),
  r("L", "Argentine who scored in the 2009 and 2011 finals for Barcelona", "Lionel Messi|Messi"),
  r("M", "Club that won the 1999 final with two goals in injury time", "Manchester United|Man United|Man Utd"),
  r("M", "Croatian midfielder who won five Champions Leagues with Real Madrid", "Luka Modrić|Luka Modric|Modrić|Modric"),
  r("N", "German goalkeeper who won the trophy with Bayern in 2013 and 2020", "Manuel Neuer|Neuer"),
  r("N", "Brazilian forward in Barcelona's 2015 treble 'MSN' attack", "Neymar"),
  r("O", "French club that won the first Champions League-era final in 1993", "Olympique de Marseille|Marseille|Olympique Marseille"),
  r("O", "French club that won seven straight league titles but never reached a European Cup final", "Olympique Lyonnais|Lyon|Olympique Lyon"),
  r("P", "French club that won its first Champions League in 2025 with a 5-0 win over Inter", "Paris Saint-Germain|PSG|Paris SG"),
  r("P", "Portuguese club that won the 2004 final under José Mourinho", "Porto|FC Porto"),
  r("Q", "Brazilian PSG captain and centre-back", "Marquinhos", true),
  r("R", "Club with 15 European Cups", "Real Madrid"),
  r("R", "Spanish striker nicknamed 'El Ángel de Madrid' who scored in the 2000 final", "Raúl|Raul|Raúl González"),
  r("S", "Romanian club that won the 1986 final on penalties", "Steaua București|Steaua Bucharest|Steaua|Steaua Bucuresti"),
  r("S", "Liverpool captain who scored in the 2005 final", "Steven Gerrard|Gerrard"),
  r("T", "North London club that lost the 2019 final to Liverpool", "Tottenham Hotspur|Tottenham|Spurs"),
  r("T", "German manager who won the 2021 trophy with Chelsea", "Thomas Tuchel|Tuchel"),
  r("U", "Uruguayan striker who scored for Barcelona in the 2015 final against Juventus", "Luis Suárez|Luis Suarez|Suárez|Suarez", true),
  r("V", "Dutch centre-back who captained Liverpool to the 2019 title", "Virgil van Dijk|Van Dijk"),
  r("V", "Spanish club that lost the 2000 and 2001 finals", "Valencia"),
  r("W", "English stadium that hosted the finals of 2011, 2013 and 2024", "Wembley|Wembley Stadium"),
  r("W", "English striker who scored for Manchester United in the 2011 final against Barcelona", "Wayne Rooney|Rooney"),
  r("X", "Barcelona midfield maestro who won four Champions Leagues", "Xavi|Xavi Hernández|Xavi Hernandez"),
  r("X", "Spanish midfielder who won the trophy with Liverpool in 2005 and Real Madrid in 2014", "Xabi Alonso|Alonso"),
  r("Y", "Ivorian midfielder who played in Barcelona's 2009 final win", "Yaya Touré|Yaya Toure|Yaya"),
  r("Y", "Trinidadian striker who partnered Andy Cole in Manchester United's 1999 treble", "Yorke|Dwight Yorke"),
  r("Z", "French midfielder who scored a left-footed volley in the 2002 final", "Zinedine Zidane|Zidane"),
  r("Z", "Swedish striker who has played for Ajax, Juventus, Inter, Barcelona, AC Milan and PSG", "Zlatan Ibrahimović|Zlatan|Ibrahimovic|Zlatan Ibrahimovic"),
];

const normKey = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Appends extra clues, skipping any whose answer (or leaked word) is already used.
function mergeUnique(base: RondoClue[], ...extras: RondoClue[][]): RondoClue[] {
  const seen = new Set<string>();
  const out: RondoClue[] = [];
  for (const c of base) {
    out.push(c);
    for (const a of c.answers) seen.add(normKey(a));
  }
  for (const list of extras) {
    for (const c of list) {
      const keys = c.answers.map(normKey);
      if (keys.some((k) => seen.has(k))) continue;
      const clueN = normKey(c.clue);
      if (c.answers.some((a) => a.split(/\s+/).some((w) => normKey(w).length >= 5 && clueN.includes(normKey(w))))) continue;
      out.push(c);
      keys.forEach((k) => seen.add(k));
    }
  }
  return out;
}

const REAL_RONDO: Record<RealCompetition, RondoClue[]> = {
  pl: mergeUnique([...PL, ...RONDO_MORE.pl, ...RONDO_EXTRA.pl], RONDO_BONUS.pl, RONDO_BONUS2.pl, RONDO_BONUS3.pl, RONDO_BONUS4.pl),
  laliga: mergeUnique([...LL, ...RONDO_MORE.laliga, ...RONDO_EXTRA.laliga], RONDO_BONUS.laliga, RONDO_BONUS2.laliga, RONDO_BONUS3.laliga, RONDO_BONUS4.laliga),
  seriea: mergeUnique([...SA, ...RONDO_MORE.seriea, ...RONDO_EXTRA.seriea], RONDO_BONUS.seriea, RONDO_BONUS2.seriea, RONDO_BONUS3.seriea, RONDO_BONUS4.seriea),
  ucl: mergeUnique([...UCL, ...RONDO_MORE.ucl, ...RONDO_EXTRA.ucl], RONDO_BONUS.ucl, RONDO_BONUS2.ucl, RONDO_BONUS3.ucl, RONDO_BONUS4.ucl),
  bundesliga: mergeUnique(BUNDESLIGA_RONDO, RONDO_BONUS4.bundesliga),
  ligue1: mergeUnique(LIGUE1_RONDO, RONDO_BONUS4.ligue1),
  superlig: mergeUnique(SUPERLIG_RONDO, RONDO_BONUS4.superlig),
};
const TOURNAMENT_ALL = TOURNAMENT_COMPETITIONS.flatMap((comp) => [...RONDO_TOURNAMENT_BANK[comp], ...RONDO_TOURNAMENT_LIVE[comp]]);

// Each tournament uses its own hand-written and live-generated clues; a letter it can't cover borrows from the other tournaments.
function tournamentClues(comp: TournamentComp): RondoClue[] {
  const own = [...RONDO_TOURNAMENT_BANK[comp], ...RONDO_TOURNAMENT_LIVE[comp]];
  const missing = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((letter) => !own.some((clue) => clue.letter === letter));
  return [...own, ...[...RONDO_TOURNAMENTS, ...TOURNAMENT_ALL].filter((clue) => missing.includes(clue.letter))];
}

// General mode: every league except the Süper Lig, the Champions League and the international tournaments in one pool.
const TURKISH_LEAGUE = /s[uü]per lig|galatasaray|fenerbah|be[sş]ikta[sş]|trabzonspor|gol krali|gol kralı|turkish (league|cup|super)/i;
export const RONDO_CLUES: Record<Competition, RondoClue[]> = {
  ...REAL_RONDO,
  ...(Object.fromEntries(TOURNAMENT_COMPETITIONS.map((comp) => [comp, tournamentClues(comp)])) as Record<TournamentComp, RondoClue[]>),
  general: mergeUnique([...RONDO_TOURNAMENTS, ...TOURNAMENT_ALL], ...REAL_COMPETITIONS.filter((comp) => comp !== "superlig").map((comp) => REAL_RONDO[comp])).filter(
    (clue) => !TURKISH_LEAGUE.test(`${clue.clue} ${clue.answers.join(" ")}`),
  ),
};
export const RONDO_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const RONDO_SECONDS = 180;

export type RondoQuestion = RondoClue & { index: number };

const byLetter = (comp: Competition, letter: string) => RONDO_CLUES[comp].filter((clue) => clue.letter === letter);

// A game is one clue index per letter, so both players in a match get identical questions.
// `avoid` is the previous game's picks, so back-to-back games never repeat a question.
export function randomRondoPicks(comp: Competition, avoid: number[] = []): number[] {
  return RONDO_LETTERS.map((letter, index) => {
    const size = byLetter(comp, letter).length;
    let pick = Math.floor(Math.random() * size);
    if (size > 1 && pick === avoid[index]) pick = (pick + 1 + Math.floor(Math.random() * (size - 1))) % size;
    return pick;
  });
}

export function rondoQuestions(comp: Competition, picks: number[]): RondoQuestion[] {
  return RONDO_LETTERS.map((letter, index) => {
    const options = byLetter(comp, letter);
    return { ...options[(picks[index] ?? 0) % options.length], index };
  });
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

function distance(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

const allowedTypos = (length: number) => (length <= 3 ? 0 : length <= 5 ? 1 : length <= 7 ? 2 : length <= 12 ? 3 : 4);

// Accepts exact matches, then typos (e.g. "bordmunt" for Dortmund) against each answer and its single words.
export function isRondoAnswer(question: RondoClue, guess: string) {
  const typed = normalize(guess);
  if (!typed) return false;
  const targets = new Set<string>();
  for (const answer of question.answers) {
    targets.add(normalize(answer));
    for (const word of answer.split(/[\s-]+/)) if (normalize(word).length >= 4) targets.add(normalize(word));
  }
  for (const target of targets) {
    if (target === typed) return true;
    if (typed.length >= 3 && distance(typed, target) <= allowedTypos(target.length)) return true;
  }
  return false;
}
