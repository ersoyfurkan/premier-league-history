import type { RondoClue } from "@/data/rondo";

const r = (letter: string, clue: string, answers: string): RondoClue => ({
  letter,
  clue,
  answers: answers.split("|"),
  contains: false,
});

// International tournament history (World Cup, Euros, Copa América) for the general Rondo.
export const RONDO_TOURNAMENTS: RondoClue[] = [
  r("A", "Nation that beat France on penalties in the 2022 World Cup final", "Argentina"),
  r("B", "Nation that has won the World Cup five times, more than any other", "Brazil"),
  r("C", "Nation that lost the 2018 World Cup final and finished third in 2022", "Croatia"),
  r("D", "Nation that won Euro 1992 after replacing Yugoslavia at the last minute", "Denmark"),
  r("E", "Nation that won the 1966 World Cup on home soil", "England"),
  r("F", "Nation that won the 1998 World Cup as hosts", "France"),
  r("G", "Nation that won the 2014 World Cup with a Mario Götze goal in extra time", "Germany"),
  r("H", "Nation of the 'Magical Magyars' who lost the 1954 World Cup final", "Hungary"),
  r("I", "Nation that beat France on penalties in the 2006 World Cup final", "Italy"),
  r("J", "Asian nation that co-hosted the 2002 World Cup", "Japan"),
  r("K", "German striker who scored 16 World Cup goals, the all-time record for many years", "Klose|Miroslav Klose"),
  r("L", "Argentine who won the Golden Ball at the 2022 World Cup", "Lionel Messi|Messi"),
  r("M", "Stadium in Rio that hosted the 1950 and 2014 World Cup finals", "Maracana|Maracanã"),
  r("N", "Nation that lost the World Cup finals of 1974, 1978 and 2010", "Netherlands|Holland"),
  r("O", "Berlin stadium that hosted the 2006 World Cup final and the Euro 2024 final", "Olympiastadion|Olympic Stadium"),
  r("P", "Nation that won Euro 2016 after an extra-time goal from Éder", "Portugal"),
  r("Q", "Nation that hosted the first World Cup in the Middle East", "Qatar"),
  r("R", "Nation that hosted the 2018 World Cup", "Russia"),
  r("S", "Nation that won Euro 2024 by beating England 2-1 in Berlin", "Spain"),
  r("T", "Nation that finished third at the 2002 World Cup, its best-ever finish", "Turkey|Türkiye|Turkiye"),
  r("U", "Nation that won the first World Cup in 1930 as hosts", "Uruguay"),
  r("V", "Dutch striker whose volley won Euro 1988 against the USSR", "Van Basten|Marco van Basten"),
  r("W", "Nation of Gareth Bale that reached the Euro 2016 semi-finals", "Wales"),
  r("X", "Barcelona midfielder named Player of the Tournament at Euro 2008", "Xavi"),
  r("Y", "Nation that lost the Euro 1960 and Euro 1968 finals", "Yugoslavia"),
  r("Z", "French midfielder who scored twice in the 1998 World Cup final", "Zidane|Zinedine Zidane"),
  r("D", "Argentine whose 'Hand of God' goal came at the 1986 World Cup", "Diego Maradona|Maradona"),
  r("P", "Brazilian who won three World Cups, in 1958, 1962 and 1970", "Pelé|Pele"),
  r("G", "Nation that won Euro 2004 as huge outsiders under Otto Rehhagel", "Greece"),
  r("C", "Nation that won back-to-back Copa Américas in 2015 and 2016", "Chile"),
];
