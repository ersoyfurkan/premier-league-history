import type { RealCompetition } from "@/lib/competitions";
import type { RondoClue } from "@/data/rondo";

const r = (letter: string, clue: string, answers: string, contains = false): RondoClue => ({
  letter,
  clue,
  answers: answers.split("|"),
  contains,
});

const PL: RondoClue[] = [
  r("A", "Club that won the 2025/26 Premier League, their first title since 2004", "Arsenal"),
  r("H", "Norwegian striker who won the 2025/26 Premier League Golden Boot", "Haaland|Erling Haaland"),
  r("L", "Club that won the 2015/16 Premier League as 5000-1 outsiders", "Leicester|Leicester City"),
  r("W", "Frenchman who managed Arsenal for 22 years", "Wenger|Arsene Wenger|Arsène Wenger"),
  r("F", "Scottish manager who won 13 Premier League titles with Manchester United", "Ferguson|Alex Ferguson|Sir Alex Ferguson"),
  r("S", "Alan ___, the Premier League's all-time top scorer with 260 goals", "Shearer|Alan Shearer"),
  r("K", "England captain who is Tottenham's all-time record goalscorer", "Kane|Harry Kane"),
  r("S", "Liverpool's Egyptian forward who has won multiple Premier League Golden Boots", "Salah|Mohamed Salah"),
  r("C", "London club that won the Premier League in 2004/05, 2005/06, 2009/10, 2014/15 and 2016/17", "Chelsea"),
];

const LL: RondoClue[] = [
  r("B", "Club that won the 2025/26 La Liga title", "Barcelona|Barca|FC Barcelona"),
  r("M", "French forward who won the 2025/26 Pichichi", "Mbappe|Mbappé|Kylian Mbappe|Kylian Mbappé"),
  r("M", "Argentine who won eight Ballon d'Or awards, six of them with Barcelona", "Messi|Lionel Messi"),
  r("R", "Madrid club with a record number of La Liga titles", "Real Madrid"),
  r("A", "Madrid club that won La Liga in 2013/14 and 2020/21 under Diego Simeone", "Atletico Madrid|Atlético Madrid|Atletico|Atlético"),
  r("V", "Valencia legend of the 2000s: club that won La Liga in 2001/02 and 2003/04", "Valencia"),
  r("C", "Stadium name of Barcelona's famous home: Camp ___", "Camp Nou|Nou"),
  r("B", "Madrid stadium named after a legendary Real Madrid president: Santiago ___", "Bernabeu|Bernabéu|Santiago Bernabeu"),
  r("S", "Stadium of Atletico Madrid's rival Sevilla: Ramón Sánchez-___", "Sanchez-Pizjuan|Sánchez-Pizjuán|Pizjuan|Pizjuán"),
];

const SA: RondoClue[] = [
  r("I", "Club that won the 2025/26 Serie A title, their 21st", "Inter|Internazionale|Inter Milan"),
  r("J", "Turin club with a record number of Scudetti", "Juventus|Juve"),
  r("M", "Milan club with seven European Cups and Champions Leagues", "AC Milan|Milan"),
  r("N", "Naples club that won Serie A in 1989/90, 2022/23 and 2024/25", "Napoli"),
  r("M", "Stadium shared by Inter and AC Milan: San Siro, officially named after Giuseppe ___", "Meazza|Giuseppe Meazza"),
  r("D", "Argentine legend nicknamed 'El Pibe de Oro' who led Napoli to two Scudetti", "Diego Maradona|Maradona"),
  r("B", "Legendary Milan and Italy defender who spent his whole career at AC Milan, Franco ___", "Baresi|Franco Baresi"),
  r("B", "Goalkeeper who won the 2006 World Cup with Italy and spent most of his career at Juventus", "Buffon|Gianluigi Buffon"),
];

const UCL: RondoClue[] = [
  r("P", "Club that won the 2025/26 Champions League by beating Arsenal on penalties", "PSG|Paris Saint-Germain|Paris"),
  r("R", "Club with a record number of European Cup and Champions League titles", "Real Madrid"),
  r("I", "Istanbul 2005 final: Liverpool came back from 3-0 down to beat this Italian side", "AC Milan|Milan"),
  r("N", "Barcelona won the 2015 final in Berlin; their front three was Messi, Suarez and ___", "Neymar"),
  r("B", "Club that completed the treble in 2012/13 under Jupp Heynckes", "Bayern Munich|Bayern"),
  r("W", "Venue for the 2011 and 2013 finals in London", "Wembley|Wembley Stadium"),
  r("B", "Hungarian capital that hosted the 2026 Champions League final", "Budapest"),
];

const BUNDESLIGA: RondoClue[] = [
  r("B", "Club that won the 2025/26 Bundesliga title", "Bayern|Bayern Munich|FC Bayern"),
  r("K", "England captain who scored heavily for Bayern and won the 2026 Ballon d'Or", "Kane|Harry Kane"),
  r("L", "Club that won the 2023/24 Bundesliga unbeaten under Xabi Alonso", "Leverkusen|Bayer Leverkusen"),
  r("D", "Club known for the 'Yellow Wall' at Signal Iduna Park", "Dortmund|Borussia Dortmund"),
  r("M", "Gerd ___, 'Der Bomber', Bayern's legendary 1970s striker", "Muller|Müller|Gerd Muller|Gerd Müller"),
  r("L", "Polish striker who scored 41 Bundesliga goals in 2020/21, breaking Gerd Müller's record", "Lewandowski|Robert Lewandowski"),
];

const LIGUE1: RondoClue[] = [
  r("P", "Club that won the 2025/26 Ligue 1 title", "PSG|Paris Saint-Germain|Paris"),
  r("L", "Club that won seven straight Ligue 1 titles from 2001/02 to 2007/08", "Lyon|Olympique Lyonnais"),
  r("M", "Club that won the 1993 Champions League", "Marseille|Olympique de Marseille|OM"),
  r("M", "French forward who won the 2018 World Cup and first joined PSG from Monaco", "Mbappe|Mbappé|Kylian Mbappe|Kylian Mbappé"),
  r("L", "Club that won the 2020/21 Ligue 1 title ahead of PSG", "Lille|LOSC"),
  r("P", "Stadium in Paris used by PSG: Parc des ___", "Princes|Parc des Princes"),
];

const SUPERLIG: RondoClue[] = [
  r("G", "Club that won the 2025/26 Süper Lig title", "Galatasaray"),
  r("F", "Istanbul club that plays at Ülker Stadium in Kadıköy", "Fenerbahce|Fenerbahçe"),
  r("B", "Istanbul club that plays at Beşiktaş Stadium (Vodafone Park)", "Besiktas|Beşiktaş"),
  r("T", "Black Sea club that won the 2021/22 Süper Lig title", "Trabzonspor|Trabzon"),
  r("O", "Nigerian striker who shared the 2025/26 Gol Kralı with Shomurodov on 22 goals", "Onuachu|Paul Onuachu"),
];

export const RONDO_BONUS4: Record<RealCompetition, RondoClue[]> = {
  pl: PL,
  laliga: LL,
  seriea: SA,
  ucl: UCL,
  bundesliga: BUNDESLIGA,
  ligue1: LIGUE1,
  superlig: SUPERLIG,
};
