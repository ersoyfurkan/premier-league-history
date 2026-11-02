import type { Competition } from "@/lib/competitions";

export type StatRecord = { name: string; value: number; aliases?: string[] };
export type StatRecordSet = {
  id: string;
  comp: Competition;
  scope: string;
  metric: string;
  source: string;
  minimum: number;
  thresholds: number[];
  rows: StatRecord[];
};

const records = (raw: string): StatRecord[] => raw.split("|").map((item) => {
  const [name, value, ...aliases] = item.split("/");
  return { name, value: Number(value), aliases };
});

export const STAT_RECORDS: StatRecordSet[] = [
  {
    id: "laliga-career-goals", comp: "laliga", scope: "La Liga careers, through 2023/24",
    metric: "goals", source: "https://en.wikipedia.org/wiki/List_of_La_Liga_top_scorers",
    minimum: 200, thresholds: [200, 225, 250, 300],
    rows: records("Lionel Messi/474|Cristiano Ronaldo/311|Telmo Zarra/251|Karim Benzema/238|Hugo Sanchez/234|Raul/228/Raul Gonzalez|Alfredo Di Stefano/227|Cesar Rodriguez/221/Cesar|Quini/219|Pahino/212"),
  },
  {
    id: "bundesliga-career-goals", comp: "bundesliga", scope: "Bundesliga careers, through 2023/24",
    metric: "goals", source: "https://en.wikipedia.org/wiki/List_of_Bundesliga_top_scorers",
    minimum: 160, thresholds: [160, 175, 200, 300],
    rows: records("Gerd Muller/365|Robert Lewandowski/312|Klaus Fischer/268|Jupp Heynckes/220|Manfred Burgsmuller/213|Claudio Pizarro/197|Ulf Kirsten/181|Stefan Kuntz/179|Dieter Muller/177|Klaus Allofs/177|Mario Gomez/170|Hannes Lohr/166|Karl-Heinz Rummenigge/162|Bernd Holzenbein/160"),
  },
  {
    id: "seriea-career-goals", comp: "seriea", scope: "Serie A careers, through 2023/24",
    metric: "goals", source: "https://en.wikipedia.org/wiki/Football_records_and_statistics_in_Italy",
    minimum: 200, thresholds: [200, 225, 250],
    rows: records("Silvio Piola/274|Francesco Totti/250|Gunnar Nordahl/225|Giuseppe Meazza/216|Jose Altafini/216|Antonio Di Natale/209|Roberto Baggio/205|Ciro Immobile/201"),
  },
  {
    id: "ligue1-career-goals", comp: "ligue1", scope: "French top-flight careers, through 2023/24",
    metric: "goals", source: "https://en.wikipedia.org/wiki/Ligue_1",
    minimum: 175, thresholds: [175, 190, 200, 250],
    rows: records("Delio Onnis/299|Bernard Lacombe/255|Herve Revelli/216|Roger Courtois/210|Thadee Cisowski/206|Roger Piantoni/203|Kylian Mbappe/191|Joseph Ujlaki/190|Fleury Di Nallo/187|Carlos Bianchi/179|Gunnar Andersson/179"),
  },
  {
    id: "worldcup-career-goals", comp: "worldcup", scope: "men's World Cup finals careers, through Qatar 2022 (no qualifiers)",
    metric: "goals", source: "https://en.wikipedia.org/wiki/FIFA_World_Cup_top_goalscorers",
    minimum: 10, thresholds: [10, 12, 13, 15],
    rows: records("Miroslav Klose/16|Ronaldo Nazario/15/Ronaldo|Gerd Muller/14|Just Fontaine/13|Lionel Messi/13|Pele/12|Kylian Mbappe/12|Sandor Kocsis/11|Jurgen Klinsmann/11|Helmut Rahn/10|Gary Lineker/10|Gabriel Batistuta/10|Teofilo Cubillas/10|Thomas Muller/10|Grzegorz Lato/10"),
  },
  {
    id: "euros-career-goals", comp: "euros", scope: "men's European Championship finals careers, through Euro 2024 (no qualifiers)",
    metric: "goals", source: "https://en.wikipedia.org/wiki/UEFA_European_Championship_records_and_statistics",
    minimum: 6, thresholds: [6, 7, 9],
    rows: records("Cristiano Ronaldo/14|Michel Platini/9|Antoine Griezmann/7|Alan Shearer/7|Harry Kane/7|Alvaro Morata/7|Thierry Henry/6|Zlatan Ibrahimovic/6|Patrick Kluivert/6|Nuno Gomes/6|Wayne Rooney/6|Ruud van Nistelrooy/6|Romelu Lukaku/6"),
  },
  {
    id: "copa-career-goals", comp: "copa", scope: "men's Copa America careers, through the 2024 final",
    metric: "goals", source: "https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica_records_and_statistics",
    minimum: 12, thresholds: [12, 14, 15],
    rows: records("Norberto Mendez/17|Zizinho/17|Teodoro Fernandez/15|Severino Varela/15|Paolo Guerrero/14|Lionel Messi/14|Eduardo Vargas/14|Ademir/13|Gabriel Batistuta/13|Jair/13|Jose Manuel Moreno/13|Hector Scarone/13|Roberto Porta/12|Angel Romano/12"),
  },
  {
    id: "seriea-career-assists", comp: "seriea", scope: "Serie A career assists in the source's historical record, through 2023/24",
    metric: "assists", source: "https://en.wikipedia.org/wiki/Football_records_and_statistics_in_Italy",
    minimum: 100, thresholds: [100, 110, 150],
    rows: records("Francesco Totti/162|Roberto Baggio/119|Alessandro Del Piero/111|Gianni Rivera/105|Andrea Pirlo/100|Antonio Candreva/100"),
  },
  {
    id: "seriea-career-penalty-saves", comp: "seriea", scope: "Serie A careers, through 2023/24 (shootouts excluded)",
    metric: "penalty saves", source: "https://en.wikipedia.org/wiki/Football_records_and_statistics_in_Italy",
    minimum: 16, thresholds: [16, 20, 24],
    rows: records("Samir Handanovic/26|Gianluca Pagliuca/24|Andrea Consigli/20|Luca Marchegiani/17|Giuseppe Moro/16|Gianluigi Buffon/16"),
  },
  {
    id: "bundesliga-duels", comp: "bundesliga", scope: "Bundesliga 2023/24",
    metric: "duels won", source: "https://www.bundesliga.com/en/bundesliga/stats/players/duels-won/2023-2024",
    minimum: 327, thresholds: [327, 350, 380, 400],
    rows: records("Bernardo/504|Anton Stach/408|Tim Kleindienst/384|Sepp van den Berg/373|Patrick Mainka/368|Xavi Simons/364|Eric Martel/340|Timo Hubers/329|Nico Schlotterbeck/329|Jeff Chabot/327"),
  },
  {
    id: "bundesliga-saves", comp: "bundesliga", scope: "Bundesliga 2023/24",
    metric: "saves", source: "https://www.bundesliga.com/en/bundesliga/stats/players/duels-won/2023-2024",
    minimum: 118, thresholds: [118, 125, 150],
    rows: records("Oliver Baumann/157|Kevin Muller/130|Marcel Schuhen/127|Manuel Riemann/122|Moritz Nicolas/118"),
  },
  {
    id: "laliga-season-assists-record", comp: "laliga", scope: "a single La Liga season, through 2023/24 (historical record definition)",
    metric: "assists", source: "https://en.wikipedia.org/wiki/La_Liga_records_and_statistics",
    minimum: 21, thresholds: [21],
    rows: records("Michel/21/Jose Miguel Gonzalez|Xavi/21/Xavi Hernandez|Lionel Messi/21"),
  },
  {
    id: "laliga-career-penalty-saves-record", comp: "laliga", scope: "La Liga careers, through 2023/24 (shootouts excluded)",
    metric: "penalty saves", source: "https://en.wikipedia.org/wiki/La_Liga_records_and_statistics",
    minimum: 22, thresholds: [22],
    rows: records("Diego Alves/22"),
  },
];

export type AuthoredStatCategory = {
  id: string;
  comp: Competition;
  condition: string;
  answers: string[];
  difficulty: number;
  sources: string[];
};

const INTERNATIONAL_GOALS = "https://www.rsssf.org/miscellaneous/century.html";
export const AUTHORED_STAT_CATEGORIES: AuthoredStatCategory[] = [
  {
    id: "laliga-goals-assists-double", comp: "laliga", difficulty: 4,
    condition: "scored 25 goals AND provided 21 assists in La Liga 2019/20 (historical La Liga record definition)",
    answers: ["Lionel Messi"], sources: ["https://en.wikipedia.org/wiki/La_Liga_records_and_statistics", "https://en.wikipedia.org/wiki/2019%E2%80%9320_La_Liga"],
  },
  {
    id: "seriea-career-goals-assists", comp: "seriea", difficulty: 4,
    condition: "finished with 250 goals AND 162 assists in Serie A's historical career record",
    answers: ["Francesco Totti"], sources: ["https://en.wikipedia.org/wiki/Football_records_and_statistics_in_Italy"],
  },
  {
    id: "bundesliga-goals-assists-double", comp: "bundesliga", difficulty: 4,
    condition: "scored 10 goals AND provided 13 assists for unbeaten champions Bayer Leverkusen in Bundesliga 2023/24",
    answers: ["Alejandro Grimaldo"], sources: ["https://en.wikipedia.org/wiki/Alejandro_Grimaldo", "https://www.bundesliga.com/en/bundesliga/stats/players/assists/2023-2024"],
  },
  {
    id: "ligue1-goals-assists-double", comp: "ligue1", difficulty: 4,
    condition: "scored 28 goals AND provided 17 assists in Ligue 1 2021/22, leading both rankings",
    answers: ["Kylian Mbappe"], sources: ["https://en.wikipedia.org/wiki/Kylian_Mbapp%C3%A9"],
  },
  {
    id: "worldcup-goals-assists-double", comp: "worldcup", difficulty: 4,
    condition: "scored seven goals AND provided three assists at the 2022 men's World Cup finals, winning its Golden Ball",
    answers: ["Lionel Messi"], sources: ["https://en.wikipedia.org/wiki/2022_FIFA_World_Cup", "https://www.statbunker.com/competitions/MostAssists?comp_id=727"],
  },
  {
    id: "euros-goals-assists-double", comp: "euros", difficulty: 4,
    condition: "scored one goal AND provided four assists at Euro 2024, winning the Young Player of the Tournament award",
    answers: ["Lamine Yamal"], sources: ["https://en.wikipedia.org/wiki/Lamine_Yamal", "https://www.statbunker.com/competitions/MostAssists?comp_id=291"],
  },
  {
    id: "copa-goals-assists-double", comp: "copa", difficulty: 4,
    condition: "scored one goal AND provided six assists at Copa America 2024, winning its best-player award",
    answers: ["James Rodriguez"], sources: ["https://en.wikipedia.org/wiki/James_Rodr%C3%ADguez", "https://www.statbunker.com/competitions/MostAssists?comp_id=595"],
  },
  {
    id: "worldcup-three-shootout-saves", comp: "worldcup", difficulty: 4,
    condition: "saved three penalties in a single men's World Cup shootout through Qatar 2022 (shootout saves only)",
    answers: ["Ricardo", "Danijel Subasic", "Dominik Livakovic"],
    sources: ["https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_penalty_shoot-outs"],
  },
  {
    id: "euros-three-shootout-saves", comp: "euros", difficulty: 4,
    condition: "saved three penalties in Portugal's Euro 2024 shootout against Slovenia (shootout saves only)",
    answers: ["Diogo Costa"], sources: ["https://en.wikipedia.org/wiki/Diogo_Costa"],
  },
  {
    id: "copa-two-shootout-saves", comp: "copa", difficulty: 4,
    condition: "saved two penalties against Ecuador in the 2024 Copa America quarter-final shootout and won that tournament's Golden Glove",
    answers: ["Emiliano Martinez"], sources: ["https://en.wikipedia.org/wiki/Emiliano_Mart%C3%ADnez"],
  },
  {
    id: "euros-eleven-saves", comp: "euros", difficulty: 4,
    condition: "made 11 saves for Georgia in their 1-1 draw with Czechia at Euro 2024",
    answers: ["Giorgi Mamardashvili"], sources: ["https://en.wikipedia.org/wiki/Giorgi_Mamardashvili"],
  },
  {
    id: "career-international-century", comp: "general", difficulty: 4,
    condition: "scored at least 100 senior men's international goals by 31 December 2024",
    answers: ["Cristiano Ronaldo", "Lionel Messi", "Ali Daei"], sources: [INTERNATIONAL_GOALS],
  },
  {
    id: "career-goals-world-champion", comp: "general", difficulty: 4,
    condition: "scored at least 50 senior men's international goals and won a men's World Cup by 31 December 2024",
    answers: ["Lionel Messi", "Pele", "Miroslav Klose", "Gerd Muller", "Ronaldo Nazario", "David Villa", "Olivier Giroud", "Thierry Henry"],
    sources: [INTERNATIONAL_GOALS, "https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_winning_players"],
  },
  {
    id: "career-goals-ballon", comp: "general", difficulty: 4,
    condition: "scored at least 50 senior men's international goals and won the competitive men's Ballon d'Or by 31 December 2024",
    answers: ["Lionel Messi", "Cristiano Ronaldo", "Gerd Muller", "Ronaldo Nazario"],
    sources: [INTERNATIONAL_GOALS, "https://en.wikipedia.org/wiki/Ballon_d%27Or"],
  },
  {
    id: "career-goals-european-champion", comp: "general", difficulty: 4,
    condition: "scored at least 50 senior men's international goals and won the Champions League by 31 December 2024",
    answers: ["Cristiano Ronaldo", "Lionel Messi", "Robert Lewandowski", "Neymar", "Mohamed Salah", "Didier Drogba", "Wayne Rooney", "Thierry Henry", "Samuel Eto'o", "David Villa", "Olivier Giroud", "Luis Suarez"],
    sources: [INTERNATIONAL_GOALS, "https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_winning_players"],
  },
  {
    id: "final-laliga", comp: "laliga", difficulty: 5,
    condition: "scored 50 goals in La Liga 2011/12 and finished his La Liga career with eight Pichichi trophies",
    answers: ["Lionel Messi"], sources: ["https://en.wikipedia.org/wiki/List_of_La_Liga_top_scorers"],
  },
  {
    id: "final-bundesliga", comp: "bundesliga", difficulty: 5,
    condition: "scored 41 Bundesliga goals in 2020/21 and won seven Bundesliga top-scorer awards before leaving Germany in 2022",
    answers: ["Robert Lewandowski"], sources: ["https://en.wikipedia.org/wiki/List_of_Bundesliga_top_scorers"],
  },
  {
    id: "final-seriea", comp: "seriea", difficulty: 5,
    condition: "finished with 250 Serie A goals, won the 2006 World Cup and won the 2006/07 European Golden Shoe",
    answers: ["Francesco Totti"], sources: ["https://en.wikipedia.org/wiki/Francesco_Totti"],
  },
  {
    id: "final-ligue1", comp: "ligue1", difficulty: 5,
    condition: "scored 27 Ligue 1 goals in 2023/24, won the 2018 World Cup and scored a hat-trick in the 2022 World Cup final",
    answers: ["Kylian Mbappe"], sources: ["https://en.wikipedia.org/wiki/Kylian_Mbapp%C3%A9"],
  },
  {
    id: "final-worldcup", comp: "worldcup", difficulty: 5,
    condition: "scored 13 goals in six matches at the 1958 men's World Cup and scored four of them in the third-place match",
    answers: ["Just Fontaine"], sources: ["https://en.wikipedia.org/wiki/Just_Fontaine"],
  },
  {
    id: "final-euros", comp: "euros", difficulty: 5,
    condition: "scored nine goals in five matches at Euro 1984, won that tournament and won the 1984 Ballon d'Or",
    answers: ["Michel Platini"], sources: ["https://en.wikipedia.org/wiki/Michel_Platini"],
  },
  {
    id: "final-copa", comp: "copa", difficulty: 5,
    condition: "scored six goals at the 2007 Copa America and won both its top-scorer and best-player awards with champions Brazil",
    answers: ["Robinho"], sources: ["https://en.wikipedia.org/wiki/2007_Copa_Am%C3%A9rica"],
  },
  {
    id: "final-general", comp: "general", difficulty: 5,
    condition: "won the 1997 and 2002 Ballons d'Or, scored 15 men's World Cup finals goals and was in both Brazil's 1994 and 2002 winning squads",
    answers: ["Ronaldo Nazario"], sources: ["https://en.wikipedia.org/wiki/Ronaldo_(Brazilian_footballer)"],
  },
];
