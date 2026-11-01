import { player, type MarketValuePlayer } from "@/data/marketPlayer";
import type { RondoClue } from "@/data/rondo";

export const BUNDESLIGA_MARKET: MarketValuePlayer[] = [
  player("Harry Kane", "England", "gb-eng", "132098", [{ value: 5, year: 2014, club: "Tottenham Hotspur" }, { value: 40, year: 2016, club: "Tottenham Hotspur" }, { value: 150, year: 2018, club: "Tottenham Hotspur" }, { value: 110, year: 2023, club: "Bayern Munich" }, { value: 90, year: 2025, club: "Bayern Munich" }]),
  player("Jamal Musiala", "Germany", "de", "580195", [{ value: 1, year: 2020, club: "Bayern Munich" }, { value: 25, year: 2021, club: "Bayern Munich" }, { value: 80, year: 2022, club: "Bayern Munich" }, { value: 110, year: 2023, club: "Bayern Munich" }, { value: 140, year: 2025, club: "Bayern Munich" }]),
  player("Florian Wirtz", "Germany", "de", "598577", [{ value: 1, year: 2020, club: "Bayer Leverkusen" }, { value: 45, year: 2022, club: "Bayer Leverkusen" }, { value: 70, year: 2023, club: "Bayer Leverkusen" }, { value: 130, year: 2024, club: "Bayer Leverkusen" }, { value: 140, year: 2025, club: "Bayer Leverkusen" }]),
  player("Robert Lewandowski", "Poland", "pl", "38253", [{ value: 10, year: 2010, club: "Borussia Dortmund" }, { value: 25, year: 2013, club: "Borussia Dortmund" }, { value: 50, year: 2014, club: "Bayern Munich" }, { value: 90, year: 2019, club: "Bayern Munich" }, { value: 50, year: 2022, club: "Bayern Munich" }]),
  player("Erling Haaland", "Norway", "no", "418560", [{ value: 5, year: 2019, club: "Red Bull Salzburg" }, { value: 45, year: 2020, club: "Borussia Dortmund" }, { value: 100, year: 2021, club: "Borussia Dortmund" }, { value: 150, year: 2022, club: "Borussia Dortmund" }, { value: 200, year: 2023, club: "Manchester City" }]),
  player("Leroy Sané", "Germany", "de", "192565", [{ value: 1, year: 2014, club: "Schalke 04" }, { value: 20, year: 2016, club: "Manchester City" }, { value: 100, year: 2018, club: "Manchester City" }, { value: 80, year: 2020, club: "Bayern Munich" }, { value: 45, year: 2024, club: "Bayern Munich" }]),
  player("Joshua Kimmich", "Germany", "de", "161056", [{ value: 1, year: 2014, club: "RB Leipzig" }, { value: 8, year: 2015, club: "Bayern Munich" }, { value: 40, year: 2017, club: "Bayern Munich" }, { value: 85, year: 2020, club: "Bayern Munich" }, { value: 50, year: 2024, club: "Bayern Munich" }]),
  player("Alphonso Davies", "Canada", "ca", "424204", [{ value: 1, year: 2018, club: "Vancouver Whitecaps" }, { value: 10, year: 2019, club: "Bayern Munich" }, { value: 60, year: 2020, club: "Bayern Munich" }, { value: 70, year: 2021, club: "Bayern Munich" }, { value: 50, year: 2024, club: "Bayern Munich" }]),
  player("Leon Goretzka", "Germany", "de", "153084", [{ value: 8, year: 2015, club: "VfL Bochum" }, { value: 25, year: 2017, club: "Schalke 04" }, { value: 40, year: 2018, club: "Bayern Munich" }, { value: 70, year: 2020, club: "Bayern Munich" }, { value: 30, year: 2024, club: "Bayern Munich" }]),
  player("Dayot Upamecano", "France", "fr", "344695", [{ value: 5, year: 2017, club: "Red Bull Salzburg" }, { value: 15, year: 2019, club: "RB Leipzig" }, { value: 60, year: 2020, club: "RB Leipzig" }, { value: 50, year: 2021, club: "Bayern Munich" }, { value: 45, year: 2024, club: "Bayern Munich" }]),
  player("Granit Xhaka", "Switzerland", "ch", "111455", [{ value: 8, year: 2012, club: "Borussia Mönchengladbach" }, { value: 25, year: 2015, club: "Borussia Mönchengladbach" }, { value: 30, year: 2016, club: "Arsenal" }, { value: 20, year: 2022, club: "Arsenal" }, { value: 20, year: 2024, club: "Bayer Leverkusen" }]),
  player("Jeremie Frimpong", "Netherlands", "nl", "476530", [{ value: 4, year: 2021, club: "Bayer Leverkusen" }, { value: 8, year: 2022, club: "Bayer Leverkusen" }, { value: 25, year: 2023, club: "Bayer Leverkusen" }, { value: 50, year: 2024, club: "Bayer Leverkusen" }, { value: 50, year: 2025, club: "Bayer Leverkusen" }]),
  player("Nico Schlotterbeck", "Germany", "de", "359701", [{ value: 2, year: 2020, club: "SC Freiburg" }, { value: 8, year: 2021, club: "SC Freiburg" }, { value: 25, year: 2022, club: "Borussia Dortmund" }, { value: 40, year: 2023, club: "Borussia Dortmund" }, { value: 40, year: 2025, club: "Borussia Dortmund" }]),
  player("Karim Adeyemi", "Germany", "de", "496232", [{ value: 10, year: 2021, club: "Red Bull Salzburg" }, { value: 35, year: 2022, club: "Borussia Dortmund" }, { value: 40, year: 2023, club: "Borussia Dortmund" }, { value: 28, year: 2024, club: "Borussia Dortmund" }, { value: 25, year: 2025, club: "Borussia Dortmund" }]),
  player("Xavi Simons", "Netherlands", "nl", "566931", [{ value: 10, year: 2022, club: "PSV Eindhoven" }, { value: 40, year: 2023, club: "RB Leipzig" }, { value: 70, year: 2024, club: "RB Leipzig" }, { value: 70, year: 2025, club: "RB Leipzig" }]),
  player("Michael Olise", "France", "fr", "566723", [{ value: 8, year: 2022, club: "Crystal Palace" }, { value: 18, year: 2023, club: "Crystal Palace" }, { value: 50, year: 2024, club: "Bayern Munich" }, { value: 65, year: 2025, club: "Bayern Munich" }]),
  player("Serhou Guirassy", "Guinea", "gn", "270541", [{ value: 2, year: 2021, club: "Stade Rennais" }, { value: 5, year: 2022, club: "VfB Stuttgart" }, { value: 14, year: 2023, club: "VfB Stuttgart" }, { value: 40, year: 2024, club: "Borussia Dortmund" }, { value: 35, year: 2025, club: "Borussia Dortmund" }]),
];

const f = (name: string, nat: string, clubs: string, tags = "") => `${name}|${nat}|${clubs}|${tags}`;
export const BUNDESLIGA_FACTS: string = [
  // Bayern Munich: current names and club legends
  f("Gerd Müller", "ger", "bay", "won g100 a300"), f("Franz Beckenbauer", "ger", "bay", "won a300"), f("Thomas Müller", "ger", "bay", "won g100 a300"), f("Manuel Neuer", "ger", "bay s04", "won a300"), f("Robert Lewandowski", "pol", "dor bay", "won g100 a300"), f("Harry Kane", "eng", "tot bay", "won g100"), f("Jamal Musiala", "ger eng", "bay", "won"), f("Lothar Matthäus", "ger", "bmg bay inter nys", "won a300"), f("Karl-Heinz Rummenigge", "ger", "bay", "won g100 a300"),
  // Dortmund
  f("Marco Reus", "ger", "bmg dor", "g100 a300"), f("Michael Zorc", "ger", "dor", "won a300"), f("Mats Hummels", "ger", "bay dor", "won a300"), f("Erling Haaland", "nor", "dor mci", ""), f("Pierre-Emerick Aubameyang", "gab", "dor ars che", ""), f("Shinji Kagawa", "jpn", "dor mun", "won"), f("Jürgen Klopp", "ger", "sge mai", ""), f("Andreas Möller", "ger", "sge dor juv s04", "won"), f("Robert Lewandowski", "pol", "dor bay", "won g100 a300"),
  // Leverkusen
  f("Ulf Kirsten", "ger", "lev", "g100 a300"), f("Rudi Völler", "ger", "wer rom mar", "g100"), f("Michael Ballack", "ger", "fck lev bay che", "won"), f("Florian Wirtz", "ger", "lev", "won"), f("Jens Nowotny", "ger", "lev", "a300"), f("Bernd Schneider", "ger", "lev", "a300"), f("Dimitar Berbatov", "bul", "lev tot mun fulham", ""), f("Granit Xhaka", "sui", "bmg lev ars", "won"), f("Jupp Heynckes", "ger", "h96 bmg", "won g100"),
  // Gladbach
  f("Jupp Heynckes", "ger", "h96 bmg", "won g100"), f("Berti Vogts", "ger", "bmg", "won"), f("Günter Netzer", "ger", "bmg", "won"), f("Lothar Matthäus", "ger", "bmg bay inter nys", "won a300"), f("Rainer Bonhof", "ger", "bmg koe her", "won"), f("Marco Reus", "ger", "bmg dor", "g100 a300"), f("Stefan Effenberg", "ger", "bmg bay fio wob", "won"), f("Marc-André ter Stegen", "ger", "bmg bar", "a300"), f("Rafael", "bra", "bmg", ""),
  // Frankfurt
  f("Alexander Meier", "ger", "sge", ""), f("Kevin Trapp", "ger", "sge psg fck", ""), f("Luka Jović", "srb", "sge rma ben mil", "won"), f("Jay-Jay Okocha", "nga", "sge psg fen bol", ""), f("Bernd Hölzenbein", "ger", "sge", "won"), f("Uwe Bein", "ger", "sge", ""), f("Omar Marmoush", "egy", "sge wol mci", ""), f("Randal Kolo Muani", "fra", "sge psg juv", ""), f("Andreas Möller", "ger", "sge dor juv s04", "won"),
  // Augsburg
  f("André Hahn", "ger", "fca bmg", ""), f("Ragnar Klavan", "est", "fca liv", ""), f("Raúl Bobadilla", "par", "fca", ""), f("Daniel Baier", "ger", "fca", "a300"), f("Philipp Max", "ger", "fca psv", ""), f("Alfred Finnbogason", "isl", "fca", ""), f("Ermedin Demirović", "bih", "fca stu", ""), f("Jeffrey Gouweleeuw", "ned", "fca", ""), f("Ruben Vargas", "sui", "fca sev", ""),
  // Köln
  f("Lukas Podolski", "ger pol", "koe bay ars inter gal", ""), f("Hannes Löhr", "ger", "koe", "won"), f("Dieter Müller", "ger", "koe", "g100"), f("Pierre Littbarski", "ger", "koe", "won a300"), f("Toni Schumacher", "ger", "koe s04", "won"), f("Anthony Modeste", "fra", "koe dor", ""), f("Jonas Hector", "ger", "koe", "a300"), f("Florian Kainz", "aut", "koe wer", ""), f("Davie Selke", "ger", "koe rbl her", ""),
  // Hamburg
  f("Uwe Seeler", "ger", "hsv", "g100 a300"), f("Horst Hrubesch", "ger", "hsv", ""), f("Kevin Keegan", "eng", "hsv new liv sou", "won"), f("Rafael van der Vaart", "ned", "hsv tot rma ajax", ""), f("Sergej Barbarez", "bih", "hsv lev dor fre", "a300"), f("Son Heung-min", "kor", "hsv lev tot", ""), f("Jörg Albertz", "ger", "hsv ran", ""), f("Rudi Kargus", "ger", "hsv", "won"), f("Mladen Petrić", "cro", "hsv dor fulham", ""),
  // Mainz
  f("Jürgen Klopp", "ger", "sge mai", ""), f("André Schürrle", "ger", "mai che wol dor fulham", ""), f("Shinji Okazaki", "jpn", "mai lei stu", ""), f("Mohamed Zidan", "egy", "mai dor hsv wer", ""), f("Ádám Szalai", "hun", "mai hof s04 h96", ""), f("Niko Bungert", "ger", "mai", ""), f("Sami Allagui", "tun", "mai her", ""), f("Jean-Philippe Mateta", "fra", "mai cry", ""), f("Jonathan Burkardt", "ger", "mai", ""),
  // Leipzig
  f("Timo Werner", "ger", "rbl che stu tot", ""), f("Dani Olmo", "esp", "rbl bar", ""), f("Christopher Nkunku", "fra", "rbl che", ""), f("Yussuf Poulsen", "den", "rbl", "a300"), f("Dominik Szoboszlai", "hun", "rbl liv", ""), f("Peter Gulácsi", "hun", "rbl", ""), f("Emil Forsberg", "swe", "rbl", ""), f("Dayot Upamecano", "fra", "rbl bay", "won"), f("Benjamin Henrichs", "ger", "rbl mon", ""),
  // Freiburg
  f("Nils Petersen", "ger", "fre wer bay", ""), f("Joachim Löw", "ger", "fre stu sge ksc", ""), f("Christian Günter", "ger", "fre", "a300"), f("Vincenzo Grifo", "ita ger", "fre bmg hof", ""), f("Papiss Cissé", "sen", "fre new", ""), f("Ritsu Dōan", "jpn", "fre psv bie", ""), f("Max Kruse", "ger", "fre wer wol bmg fcu", ""), f("Ralf Fährmann", "ger", "fre s04", ""), f("Oliver Baumann", "ger", "fre hof", "a300"),
  // Paderborn
  f("Sven Michel", "ger", "pad fcu", ""), f("Moritz Stoppelkamp", "ger", "pad", ""), f("Uwe Hünemeier", "ger", "pad", ""), f("Lukas Kruse", "ger", "fre wer wol bmg fcu", ""), f("Klaus Gjasula", "alb", "pad hsv", ""), f("Streli Mamba", "ger", "pad", ""), f("Ben Zolinski", "ger", "pad", ""), f("Rafael Obermair", "ger", "pad", ""), f("Sven Bender", "ger", "pad dor", "won"),
  // Elversberg (well-known recent squad fixtures and former players)
  f("Jannik Rochelt", "ger", "els h96", ""), f("Luca Schnellbacher", "ger", "els", ""), f("Thore Jacobsen", "ger", "els", ""), f("Robin Fellhauer", "ger", "els", ""), f("Manuel Feil", "ger", "els", ""), f("Nicolas Kristof", "ger", "els", ""), f("Kevin Koffi", "civ", "els", ""), f("Lukas Pinckert", "ger", "els", ""), f("Paul Wanner", "ger aut", "bay els", ""),
  // Schalke
  f("Klaus Fischer", "ger", "s04 boc m60 koe", "g100 a300"), f("Raúl", "esp", "s04 rma", ""), f("Manuel Neuer", "ger", "s04 bay", "won a300"), f("Mesut Özil", "ger", "s04 wer ars rma fen", ""), f("Jens Lehmann", "ger", "s04 ars dor mil", ""), f("Leroy Sané", "ger", "s04 bay mci", "won"), f("Ivan Rakitić", "cro", "s04 sev bar", ""), f("Jefferson Farfán", "per", "s04 psv", ""), f("Mladen Krstajić", "srb", "s04 wer", "won"),
  // Hoffenheim
  f("Andrej Kramarić", "cro", "hof lei", "g100 a300"), f("Roberto Firmino", "bra", "hof liv", ""), f("Demba Ba", "sen", "hof che wham new", ""), f("Vedad Ibišević", "bih", "hof her stu s04", ""), f("Kevin Volland", "ger", "hof lev mon fcu", ""), f("Sejad Salihović", "bih", "hof", ""), f("Sandro Wagner", "ger", "hof bay d98 fca her", ""), f("David Raum", "ger", "hof rbl", ""), f("Oliver Baumann", "ger", "hof fre", "a300"),
  // Stuttgart
  f("Jürgen Klinsmann", "ger", "stu bay inter sam tot mon", ""), f("Mario Gómez", "ger esp", "stu bay fio wob", "g100"), f("Sami Khedira", "ger", "stu rma juv her", "won"), f("Serhou Guirassy", "gui", "stu dor", ""), f("Cacau", "bra ger", "stu", ""), f("Timo Werner", "ger", "rbl che stu tot", ""), f("Pavel Pardo", "mex", "stu", ""), f("Guido Buchwald", "ger", "stu", "won"), f("Wataru Endō", "jpn", "stu liv", ""),
  // Werder Bremen
  f("Claudio Pizarro", "per", "wer bay che", "g100 a300"), f("Aílton", "bra", "wer s04", ""), f("Miroslav Klose", "ger pol", "wer bay laz fck", "g100"), f("Diego Ribas", "bra", "wer juv wol", ""), f("Mesut Özil", "ger", "s04 wer ars rma fen", ""), f("Rudi Völler", "ger", "wer rom mar", "g100"), f("Frank Baumann", "ger", "wer", "a300"), f("Max Kruse", "ger", "fre wer wol bmg fcu", ""), f("Niclas Füllkrug", "ger", "wer dor h96", ""),
  f("Frederik Rønnow", "den", "fcu her sge s04", ""), f("Christopher Trimmel", "aut", "fcu", ""), f("Diogo Leite", "por", "fcu", ""), f("Rani Khedira", "ger", "rbl fca fcu", ""), f("Janik Haberer", "ger", "fcu fre", ""), f("András Schäfer", "hun", "dac gen fcu", ""), f("Benedict Hollerbach", "ger", "fcu", ""), f("Kevin Volland", "ger", "hof lev mon fcu", ""), f("Sheraldo Becker", "sur", "fcu", ""), f("Taiwo Awoniyi", "nga", "fcu nfo", ""), f("Robin Knoche", "ger", "fcu wob", ""), f("Marius Bülter", "ger", "fcu hof s04", ""), f("Sebastian Polter", "ger", "fcu boc", ""), f("Max Kruse", "ger", "fre wer wol bmg fcu", ""), f("Julian Ryerson", "nor", "fcu dor", ""), f("Jordan Siebatcheu", "usa", "fcu", ""),
].join("\n");

const r = (letter: string, clue: string, answers: string, contains = false): RondoClue => ({ letter, clue, answers: answers.split("|"), contains });
const EXTRA_CAREERS = `
Arjen Robben:bay che rma
Franck Ribéry:bay fio
Xabi Alonso:bay lev liv rma
Ze Roberto:bay lev hsv
Luca Toni:bay fio rom
Roy Makaay:bay dep fey
Ivica Olić:bay hsv wol
Mario Mandžukić:bay juv atm wol
Thiago Alcântara:bay bar liv
James Rodríguez:bay rma mon
Douglas Costa:bay juv
Rafinha:bay s04 gen fla
Dante:bmg bay nice wol
Javi Martínez:bay
Bixente Lizarazu:bay bdx
Mehmet Scholl:bay
Hasan Salihamidžić:bay juv wob
Willy Sagnol:bay
Miroslav Klose:wer bay laz fck
Mario Götze:dor bay psv sge
Kevin-Prince Boateng:s04 sge mil bar
Edin Džeko:wob mci inter rom
Grafite:wob
André Schürrle:mai che wol dor fulham
Ivan Perišić:bay dor wol inter tot psv
Toni Kroos:bay lev rma
Lúcio:bay inter
Jérôme Boateng:bay her
David Alaba:bay rma
Kingsley Coman:bay juv psg
Corentin Tolisso:bay lyon
Bouna Sarr:bay mar
Eric Maxim Choupo-Moting:bay psg
Sadio Mané:bay liv
Matthijs de Ligt:bay juv ajax mun
Kim Min-jae:bay nap
Eric Dier:bay tot
Aleksandar Pavlović:bay
Konrad Laimer:rbl bay
Willi Orbán:rbl
Timo Werner:rbl che stu tot
Lucas Barrios:dor
Shinji Kagawa:dor mun
Nuri Şahin:dor liv wer rma fey
Ilkay Gündogan:dor mci bar
Henrikh Mkhitaryan:dor mun ars rom inter
Jadon Sancho:dor mun che
Ousmane Dembélé:dor bar psg
Christian Pulisic:dor che mil
Łukasz Piszczek:dor
Neven Subotić:dor
Sebastian Kehl:dor
Kevin Großkreutz:dor
Dede:dor
Andriy Yarmolenko:dor wham
Axel Witsel:dor atm
Raphaël Guerreiro:dor bay
Nelson Valdez:wer dor
Naldo:wer wol s04
Mesut Özil:s04 wer ars rma fen
Per Mertesacker:wer ars
Mladen Petrić:hsv dor fulham
Ruud van Nistelrooy:hsv rma mun
Nigel de Jong:hsv mil mci
Vincent Kompany:hsv mci
Paolo Guerrero:hsv bay
Jörg Albertz:hsv ran
Jay-Jay Okocha:sge psg fen bol
Anthony Yeboah:sge hsv lee
André Silva:sge rbl mil
Filip Kostić:sge juv
Daichi Kamada:sge laz
Sebastian Rode:sge dor bay
Luka Jović:sge rma ben mil
Amin Younes:sge nap
Theofanis Gekas:hof lev
Roberto Firmino:hof liv
Demba Ba:hof che wham new
Vedad Ibišević:hof her stu s04
Kevin Volland:hof lev mon fcu
Sejad Salihović:hof
Sandro Wagner:hof bay d98 fca her
David Raum:hof rbl
Joelinton:hof new
Ihlas Bebou:hof h96
Krassimir Balakov:stu
Fernando Meira:stu
Zdravko Kuzmanović:stu inter
Sami Khedira:stu rma juv her
Arthur Boka:stu
Cédric Makiadi:fre wer
Max Kruse:fre wer wol bmg fcu
Papiss Cissé:fre new
Ritsu Dōan:fre psv bie
Ragnar Klavan:fca liv
Philipp Max:fca psv
Yussuf Poulsen:rbl
Emil Forsberg:rbl
Dani Olmo:rbl bar
Christopher Nkunku:rbl che
Dominik Szoboszlai:rbl liv
Peter Gulácsi:rbl
Dayot Upamecano:rbl bay
Benjamin Henrichs:rbl mon
Marcel Sabitzer:rbl bay mun
Naby Keïta:rbl liv wer
Josko Gvardiol:rbl mci
Sven Michel:pad fcu
Moritz Stoppelkamp:pad
Uwe Hünemeier:pad
Klaus Gjasula:pad hsv d98 fca
Ralf Fährmann:s04 nor
Raúl:s04 rma
Ivan Rakitić:s04 bar sev
Jefferson Farfán:s04 psv
Benedikt Höwedes:s04 juv
Klaas-Jan Huntelaar:s04 ajax
Julian Draxler:s04 psg wol
Joel Matip:s04 liv
Sead Kolašinac:s04 ars ata
Ebbe Sand:s04
Jens Lehmann:s04 ars dor mil
Mladen Krstajić:s04 wer
Hakan Çalhanoğlu:hsv lev mil inter
Emre Can:lev dor juv
Rolfes:lev
Jens Nowotny:lev
Bernd Schneider:lev
Dimitar Berbatov:lev tot mun fulham
Stefan Kießling:lev
Patrick Helmes:lev
Lars Bender:lev
Sven Bender:lev dor
Arturo Vidal:lev bay juv inter
Kai Havertz:lev che ars
Javier Hernández:lev mun
Julian Brandt:lev dor
Alejandro Grimaldo:lev ben
Edmond Tapsoba:lev
Piero Hincapié:lev
Jonathan Tah:lev
Moussa Diaby:lev avl
Jonas Hector:koe
Pierre Littbarski:koe
Toni Polster:koe
Thomas Häßler:koe rom
Morten Olsen:koe ajax
Jürgen Kohler:koe dor juv
Stefan Effenberg:bmg bay fio wob
Andreas Brehme:bmg inter
Martin Stranzl:bmg
Rainer Bonhof:bmg koe her
Klaus Allofs:koe wer
Manfred Kaltz:hsv
Milan Badelj:hsv fio
Hakan Çalhanoğlu:hsv lev mil inter
Sadio Mané:bay liv
Rúrik Gíslason:hsv
Dieter Eilts:wer
Thomas Schaaf:wer
Ivan Klasnić:wer
Torsten Frings:wer bay dor
Tim Borowski:wer bay
Frank Rost:wer hsv
Ludovic Obraniak:wer
Johan Micoud:wer bdx par
Yussuf Poulsen:rbl
Ritsu Doan:fre psv bie
Nils Petersen:fre wer bay
Vincenzo Grifo:fre bmg hof
Daniel Baier:fca
André Hahn:fca bmg
Alfred Finnbogason:fca
Ermedin Demirović:fca stu
Uwe Seeler:hsv
Horst Hrubesch:hsv
Kevin Keegan:hsv new liv sou
Felix Magath:hsv
Mladen Petrić:hsv dor fulham
`;
const factCareers = BUNDESLIGA_FACTS.split("\n").map((line) => { const [name, , clubs] = line.split("|"); return `${name}:${clubs}`; });
const careerMap = new Map<string, Set<string>>();
for (const line of [...factCareers, ...EXTRA_CAREERS.trim().split("\n")]) {
  const [name, ...clubParts] = line.split(":");
  const clubs = careerMap.get(name) ?? new Set<string>();
  for (const key of clubParts.join(":").split(/\s+/).filter(Boolean)) clubs.add(key);
  careerMap.set(name, clubs);
}
export const BUNDESLIGA_CAREERS: string = Array.from(careerMap, ([name, clubs]) => `${name}:${Array.from(clubs).join(" ")}`).join("\n");
export const BUNDESLIGA_RONDO: RondoClue[] = [
  r("A", "Dutch right winger curled the winning goal in the 2013 Wembley final.", "Arjen Robben|Robben"),
  r("A", "A Canadian left-back became a Champions League winner in Munich.", "Alphonso Davies|Davies"),
  r("A", "A Brazilian striker won the 2004-05 scoring title with Bremen.", "Aílton|Ailton"),
  r("A", "Frankfurt forward won the 2014-15 scoring title with 19 goals.", "Alexander Meier|Meier"),
  r("A", "A Croatian forward has been a longtime Hoffenheim captain.", "Andrej Kramarić|Andrej Kramaric"),
  r("A", "A midfielder won league titles with Dortmund and Munich in the 1990s.", "Andreas Möller|Andreas Moeller"),
  r("A", "A Bavarian side reached the top flight for the first time in 2011.", "Augsburg|FC Augsburg"),
  r("A", "A Chilean midfielder won titles at Turin, Munich and Milan.", "Arturo Vidal|Vidal"),
  r("B", "A German midfielder lifted the World Cup after starring for Munich.", "Bastian Schweinsteiger|Schweinsteiger"),
  r("B", "A defender captained the national team at the 1974 World Cup.", "Berti Vogts|Vogts"),
  r("B", "A German striker later coached Hamburg, Stuttgart and Leverkusen.", "Bruno Labbadia|Labbadia"),
  r("B", "A German keeper transferred from Stuttgart to a club on the Rhine.", "Bernd Leno|Leno"),
  r("B", "A German midfielder played for the works club for over a decade.", "Bernd Schneider|Schneider"),
  r("B", "A Lower Saxony club won its only league title in 1967.", "Braunschweig|Eintracht Braunschweig"),
  r("B", "A defender came through a local academy and represented Monaco.", "Benjamin Henrichs|Henrichs"),
  r("B", "A Bavarian side won the domestic treble in 2020.", "Bayern Munich|Bayern"),
  r("C", "A Peruvian striker made hundreds of appearances for Bremen and Munich.", "Claudio Pizarro|Pizarro"),
  r("C", "A midfielder won the World Cup while playing for Borussia Mönchengladbach.", "Christoph Kramer|Kramer"),
  r("C", "A Brazilian-born striker scored more than 50 goals for Stuttgart.", "Cacau"),
  r("C", "A Mexican striker was nicknamed for his small stature.", "Chicharito|Javier Hernández"),
  r("C", "A Germany centre-back spent spells with Bayern and Dortmund.", "Christian Wörns|Christian Woerns"),
  r("C", "A Freiburg full-back holds a club appearance record.", "Christian Günter|Christian Guenter"),
  r("C", "A defender captained Bremen before becoming its sporting director.", "Clemens Fritz|Fritz"),
  r("C", "A Romanian midfielder played for Leverkusen and Bayern.", "Ciriaco Sforza|Sforza"),
  r("D", "A Cologne striker scored six goals in a single match in 1977.", "Dieter Müller|Dieter Mueller"),
  r("D", "A Senegalese striker became a cult hero at Hoffenheim.", "Demba Ba"),
  r("D", "A Brazilian playmaker won the 2008-09 championship with Bremen.", "Diego Ribas|Diego"),
  r("D", "A Bosnian striker won the 2009 title with a club from Lower Saxony.", "Edin Džeko|Edin Dzeko", true),
  r("D", "A Hungarian midfielder was a long-time captain for the club in Saxony.", "Dominik Szoboszlai|Szoboszlai"),
  r("D", "A German midfielder reached the Champions League final with Liverpool.", "Dietmar Hamann|Hamann"),
  r("D", "A Brazilian defender played for Munich and Borussia Mönchengladbach.", "Dante|Dante"),
  r("D", "A German midfielder became a prominent leader at Augsburg.", "Daniel Baier|Baier"),
  r("E", "A Danish striker became Schalke's leading marksman in the late 1990s.", "Ebbe Sand|Sand"),
  r("E", "A Norwegian striker won two scoring crowns during his Dortmund career.", "Erling Haaland|Haaland"),
  r("E", "A Swedish midfielder made over 200 appearances for Leipzig.", "Emil Forsberg|Forsberg"),
  r("E", "A Cameroon-born striker played for Mainz and Bayern.", "Eric Maxim Choupo-Moting|Choupo-Moting"),
  r("E", "The Frankfurt side plays its home matches at Deutsche Bank Park.", "Eintracht Frankfurt|Frankfurt"),
  r("E", "A Turkish international striker played for Leverkusen and Hoffenheim.", "Eren Derdiyok|Derdiyok"),
  r("E", "A former defender coached Gladbach and became a prominent pundit.", "Ewald Lienen|Lienen"),
  r("E", "A Ghanaian international forward played for Dortmund in the 1990s.", "Emmanuel Amunike|Amunike"),
  r("F", "A German manager coached Frankfurt and Fortuna Duesseldorf.", "Friedhelm Funkel|Funkel"),
  r("F", "A German midfielder led Leverkusen through its unbeaten title campaign.", "Florian Wirtz|Wirtz"),
  r("F", "A German forward finished top of the scoring chart for Bochum in 2006-07.", "Theofanis Gekas|Gekas", true),
  r("F", "A former Stuttgart striker won the scoring award in 1991-92.", "Fritz Walter|Walter"),
  r("F", "A Gladbach midfielder scored the winning goal in the 2021 cup final.", "Florian Neuhaus|Neuhaus"),
  r("F", "A German forward played for Augsburg and Freiburg in the top division.", "Florian Niederlechner|Niederlechner"),
  r("F", "A Dortmund forward scored the first goal in Bundesliga history.", "Friedhelm Konietzka|Konietzka"),
  r("F", "A former coach won league titles with Frankfurt and Kaiserslautern.", "Friedel Rausch|Rausch"),
  r("F", "A German striker led the charts for Stuttgart in 1995-96.", "Fredi Bobic|Bobic"),
  r("G", "A German striker scored 40 league goals in a single season.", "Gerd Müller|Gerd Muller"),
  r("G", "A Brazilian forward scored 28 times in a championship-winning campaign.", "Grafite"),
  r("G", "A Hungarian keeper became a long-serving starter in Saxony.", "Péter Gulácsi|Peter Gulacsi", true),
  r("G", "A Guinea international scored 28 league goals in 2023-24.", "Serhou Guirassy|Guirassy", true),
  r("G", "A Gladbach playmaker became famous for his long-range passing.", "Guenter Netzer|Gunter Netzer"),
  r("G", "The Foals play home matches at Borussia-Park.", "Gladbach|Borussia Moenchengladbach"),
  r("G", "A German fullback was part of the 2007 champions from Stuttgart.", "Gōtoku Sakai|Gotoku Sakai"),
  r("G", "A Spanish coach joined Munich after winning titles in England.", "Pep Guardiola|Guardiola", true),
  r("H", "An English striker moved to Munich from Tottenham in 2023.", "Harry Kane|Kane"),
  r("H", "A Hamburg striker led the league in goals during 1981-82.", "Horst Hrubesch|Hrubesch"),
  r("H", "A midfielder from Bosnia played for Hamburg and Hertha.", "Haris Seferović|Haris Seferovic"),
  r("H", "A German forward won the scoring award for Cologne in 1967-68.", "Hannes Löhr|Hannes Loehr"),
  r("H", "A Stuttgart midfielder represented Germany at the 1982 World Cup.", "Hansi Mueller|Hansi Mueller"),
  r("H", "A Polish-born winger scored in the 2014 World Cup final.", "André Schürrle|Andre Schuerrle", true),
  r("H", "A German midfielder became manager of the national team after playing for Freiburg.", "Joachim Löw|Joachim Loew", true),
  r("H", "A Bayern defender rose from the academy to win titles.", "Holger Badstuber|Badstuber"),
  r("I", "A Croatian midfielder joined Barcelona after a spell in Germany.", "Ivan Rakitić|Ivan Rakitic"),
  r("I", "A German midfielder played for Manchester City and Barcelona after Dortmund.", "Ilkay Gündogan|Ilkay Gundogan"),
  r("I", "A French defender played for Munich and later joined Inter.", "Ismaël|Ismael"),
  r("I", "A Croatian forward scored for Hamburg and later played in Munich.", "Ivica Olić|Ivica Olic"),
  r("I", "A midfielder from Bosnia played for Hamburg and Kaiserslautern.", "Ivo Iličević|Ivo Ilicevic"),
  r("I", "A Ghanaian forward represented Dortmund in the late 1990s.", "Ibrahim Tanko|Tanko"),
  r("I", "A Ghanaian defender played for Hoffenheim and Augsburg.", "Isaac Vorsah|Vorsah"),
  r("I", "A club from Upper Bavaria joined the top division in 2015.", "Ingolstadt|FC Ingolstadt 04"),
  r("J", "A German striker scored 19 goals for Stuttgart in 1987-88.", "Jürgen Klinsmann|Jurgen Klinsmann"),
  r("J", "A young midfielder rose through Munich's academy and represented Germany.", "Jamal Musiala|Musiala"),
  r("J", "A German international moved from Leipzig to Munich in 2015.", "Joshua Kimmich|Kimmich"),
  r("J", "A former Mainz coach later won two league titles in Dortmund.", "Jürgen Klopp|Jurgen Klopp"),
  r("J", "A Spanish midfielder won the 2013 Champions League with Munich.", "Javi Martínez|Javi Martinez"),
  r("J", "An English winger joined the club in Saxony on loan from Manchester United.", "Jadon Sancho|Sancho"),
  r("J", "A German captain played his entire senior career in Cologne.", "Jonas Hector|Hector"),
  r("J", "A German goalkeeper won the Champions League with Dortmund in 1997.", "Jens Lehmann|Lehmann"),
  r("K", "A Schalke forward sits second on the league's all-time scoring list.", "Klaus Fischer|Fischer"),
  r("K", "A German striker won two scoring crowns with Bayern in 1980 and 1981.", "Karl-Heinz Rummenigge|Rummenigge"),
  r("K", "A Dutch striker led the charts for Schalke in 2011-12.", "Klaas-Jan Huntelaar|Huntelaar"),
  r("K", "A Belgian midfielder played for Bremen, Wolfsburg and Manchester City.", "Kevin De Bruyne|De Bruyne"),
  r("K", "A Ghanaian-born attacker played for Schalke, Frankfurt and Barcelona.", "Kevin-Prince Boateng|Boateng"),
  r("K", "An Austrian midfielder joined Bayern from Leipzig in 2023.", "Konrad Laimer|Laimer"),
  r("K", "A club from Baden-Württemberg is nicknamed the Blue-Whites.", "Karlsruher SC|Karlsruhe"),
  r("K", "A German forward won the league scoring title with Bremen in 1985.", "Klaus Allofs|Allofs"),
  r("L", "A German midfielder won the World Cup and played for Bayern and Inter.", "Lothar Matthäus|Lothar Matthaus"),
  r("L", "A German winger moved from Schalke to Manchester City in 2016.", "Leroy Sané|Leroy Sane"),
  r("L", "An Italian striker scored 24 goals in his first Bayern season.", "Luca Toni|Toni"),
  r("L", "A German forward became a World Cup winner after playing for Cologne.", "Lukas Podolski|Podolski"),
  r("L", "A Gladbach midfielder later captained the club in the Bundesliga.", "Lars Stindl|Stindl"),
  r("L", "A German midfielder played for Leverkusen and later captained his twin brother's side.", "Lars Bender|Bender"),
  r("L", "A Serbian striker scored for Eintracht Frankfurt before moving to Madrid.", "Luka Jović|Luka Jovic"),
  r("L", "A German side from the Rhine won its first league championship in 2024.", "Bayer Leverkusen|Leverkusen", true),
  r("M", "A German striker scored 213 league goals across several clubs.", "Manfred Burgsmüller|Manfred Burgsmueller"),
  r("M", "A German striker won the World Cup after playing for Werder and Munich.", "Miroslav Klose|Klose"),
  r("M", "A Hamburg defender set an appearance record for his club.", "Manfred Kaltz|Kaltz"),
  r("M", "A Dortmund captain became a club legend and attacking midfielder.", "Marco Reus|Reus"),
  r("M", "A German striker won the scoring crown with Stuttgart in 2009-10.", "Mario Gómez|Mario Gomez"),
  r("M", "A German midfielder scored for Munich and later became a club executive.", "Michael Ballack|Ballack"),
  r("M", "A former Germany international coached the 2002 Champions League winners.", "Matthias Sammer|Sammer"),
  r("M", "A German defender won league titles with both Dortmund and Munich.", "Mats Hummels|Hummels"),
  r("N", "A German striker shared the 2022-23 scoring award with a player at Leipzig.", "Niclas Füllkrug|Niclas Fullkrug"),
  r("N", "A Freiburg forward became the club's all-time Bundesliga leading scorer.", "Nils Petersen|Petersen"),
  r("N", "A Turkish-German midfielder spent time at Liverpool and Borussia Dortmund.", "Nuri Şahin|Nuri Sahin"),
  r("N", "A Croatian midfielder coached Munich after winning titles with them as a player.", "Niko Kovač|Niko Kovac"),
  r("N", "A Franconian club won nine German titles before the national league was founded.", "Nuernberg|1. FC Nuernberg|Nuremberg"),
  r("N", "A Brazilian centre-back scored 13 league goals for Werder Bremen.", "Naldo"),
  r("N", "A Serbian defender played for Dortmund, Mainz and Union Berlin.", "Neven Subotić|Neven Subotic"),
  r("N", "A Guinean midfielder moved from Leipzig to Liverpool.", "Naby Keïta|Naby Keita"),
  r("O", "A German keeper lifted the Champions League trophy with Munich in 2001.", "Oliver Kahn|Kahn"),
  r("O", "A German coach won the 1998 title with Kaiserslautern after promotion.", "Otto Rehhagel|Rehhagel"),
  r("O", "A former Bayern coach won the league title twice in the 2000s.", "Ottmar Hitzfeld|Hitzfeld"),
  r("O", "A French forward played in Germany before winning the World Cup.", "Ousmane Dembélé|Ousmane Dembele"),
  r("O", "A German goalkeeper became a long-serving starter for Hoffenheim.", "Oliver Baumann|Baumann"),
  r("O", "A North Macedonian keeper spent much of his career with Frankfurt.", "Oka Nikolov|Nikolov"),
  r("O", "An Egyptian attacker scored for Frankfurt before moving to England.", "Omar Marmoush|Marmoush"),
  r("O", "A Ruhr club spent three seasons in the Bundesliga during the 1970s.", "Oberhausen|Rot-Weiss Oberhausen"),
  r("P", "A Gabonese forward won the 2016-17 scoring crown for Dortmund.", "Pierre-Emerick Aubameyang|Aubameyang"),
  r("P", "A German captain lifted the World Cup after winning many titles at Munich.", "Philipp Lahm|Lahm"),
  r("P", "A Mexican midfielder helped Stuttgart win the 2007 championship.", "Pavel Pardo|Pardo"),
  r("P", "A German international won league titles at Munich and Kaiserslautern.", "Paul Breitner|Breitner"),
  r("P", "A German defender played for Bremen before joining Arsenal.", "Per Mertesacker|Mertesacker"),
  r("P", "A Czech forward scored 24 league goals in the 2021-22 season.", "Patrik Schick|Schick"),
  r("P", "A Senegalese striker scored 37 goals in his Bundesliga career.", "Papiss Cissé|Papiss Cisse"),
  r("P", "A club from East Westphalia won promotion to the top division in 2026.", "Paderborn|SC Paderborn 07"),
  r("Q", "A Swedish international striker scored regularly for Mainz.", "Quaison|Robin Quaison"),
  r("Q", "A midfielder struck within seconds of kick-off to set a league speed record.", "Quickest Bundesliga goal record", true),
  r("Q", "A substitute scored five times in a short spell during a famous match in Munich.", "Quickfire five-goal performance", true),
  r("Q", "A German coach earned a nickname from his first name and a famous cartoon character.", "Quälix Magath|Qualix Magath", true),
  r("Q", "A league match produced a record tally for one player in just nine minutes.", "Quintuple by a substitute", true),
  r("Q", "A dramatic end-of-season event left a Ruhr club heartbroken in 2001.", "Quest for the title on the final day", true),
  r("R", "A Poland striker scored 41 goals in the 2020-21 campaign.", "Robert Lewandowski|Lewandowski"),
  r("R", "A German forward won the 1982-83 scoring crown with Bremen.", "Rudi Voeller|Rudi Voeller"),
  r("R", "A German coach led Leipzig to the 2020 Champions League semi-final.", "Ralf Rangnick|Rangnick"),
  r("R", "A German midfielder became a key figure in Gladbach's 1970s side.", "Rainer Bonhof|Bonhof"),
  r("R", "A Croatia international joined Frankfurt from Juventus in 2022.", "Randal Kolo Muani|Kolo Muani"),
  r("R", "A former Leverkusen goalkeeper later became Germany's first-choice keeper.", "Rene Adler|Rene Adler"),
  r("R", "A former Schalke manager later served as the club's sporting director.", "Rudi Assauer|Assauer"),
  r("R", "A German manager coached several leading clubs in the 1970s.", "Rudi Gutendorf|Gutendorf"),
  r("S", "A Korean forward scored for Hamburg and Leverkusen before moving to England.", "Son Heung-min|Son"),
  r("S", "A German midfielder captained the 2007 champions from Stuttgart.", "Sami Khedira|Khedira"),
  r("S", "A Serbian winger won the 2022 Europa League with Frankfurt.", "Filip Kostić|Filip Kostic", true),
  r("S", "A German midfielder represented his country at the 2006 World Cup.", "Sascha Riether|Riether"),
  r("S", "A Bosnian forward shared the scoring award in 2000-01.", "Sergej Barbarez|Barbarez"),
  r("S", "A German striker won the scoring award for Leverkusen in 2012-13.", "Stefan Kiessling|Stefan Kiessling"),
  r("S", "A Senegalese forward played in Germany before winning the Premier League.", "Sadio Mane|Sadio Mane"),
  r("S", "A midfielder from Japan played for Mainz and Leicester City.", "Shinji Okazaki|Okazaki"),
  r("T", "A Dortmund striker scored the first goal in Bundesliga history.", "Timo Konietzka|Konietzka"),
  r("T", "A Germany midfielder stayed with Munich for nearly two decades.", "Thomas Müller|Thomas Mueller"),
  r("T", "A Cologne striker won the 1988-89 scoring award.", "Thomas Allofs|Allofs"),
  r("T", "A winger moved from Saxony to Chelsea in 2020.", "Timo Werner|Werner"),
  r("T", "A French international midfielder joined Bayern from Lyon.", "Corentin Tolisso|Tolisso", true),
  r("T", "A German goalkeeper won the 2007 league title with Stuttgart.", "Timo Hildebrand|Hildebrand"),
  r("T", "A French defender played for Bayern before moving to Spain.", "Tanguy Nianzou|Nianzou"),
  r("T", "A German midfielder won the World Cup before moving to Madrid.", "Toni Kroos|Kroos"),
  r("U", "A German-born forward won three league scoring awards in Leverkusen.", "Ulf Kirsten|Kirsten"),
  r("U", "A Hamburg legend was a runner-up at the 1966 World Cup.", "Uwe Seeler|Seeler"),
  r("U", "A striker from Bremen became a Germany international in the 1980s.", "Uwe Reinders|Reinders"),
  r("U", "A German forward won the 1991 title with Kaiserslautern.", "Uwe Rösler|Uwe Roesler"),
  r("U", "A Bayern president played in the club's 1970s European triumphs.", "Uli Hoeneß|Uli Hoeness"),
  r("U", "A goalkeeper spent much of his Bundesliga career with Eintracht Frankfurt.", "Uli Stein|Stein"),
  r("U", "A German coach won league titles with Bayern in the 1970s.", "Udo Lattek|Lattek"),
  r("U", "A German playmaker starred for Frankfurt in the 1980s.", "Uwe Bein|Bein"),
  r("V", "A Bosnian striker scored 18 goals in one season for Stuttgart.", "Vedad Ibišević|Vedad Ibisevic"),
  r("V", "A club from Baden-Wuerttemberg won the league in 2007.", "VfB Stuttgart|Stuttgart"),
  r("V", "A German coach won the 2007 title with Stuttgart.", "Armin Veh|Veh", true),
  r("V", "A Dutch midfielder captained Bayern after spells in Spain and Italy.", "Mark van Bommel|Van Bommel", true),
  r("V", "A Lower Saxony club won its first league championship in 2009.", "VfL Wolfsburg|Wolfsburg"),
  r("V", "A Ukrainian midfielder played for Bremen and later coached the club.", "Viktor Skrypnyk|Skrypnyk"),
  r("V", "A club from the Ruhr has played in the Bundesliga for decades.", "VfL Bochum|Bochum"),
  r("V", "A Swiss midfielder played for Hamburg and several Italian clubs.", "Valon Behrami|Behrami"),
  r("W", "A German side from the north plays at a riverside ground.", "Werder Bremen|Werder"),
  r("W", "A Japanese midfielder captained Stuttgart before moving to England.", "Wataru Endo|Wataru Endo"),
  r("W", "A North Rhine club had a brief top-flight spell in the 1970s.", "Wuppertaler SV|Wuppertal"),
  r("W", "A Brazilian midfielder spent one season with the green-and-white side.", "Wesley|Wesley Lopes"),
  r("W", "A famous Leipzig ground hosted matches before the current arena opened.", "Weserstadion|Weser Stadium"),
  r("W", "A Hungarian defender captained the side from Leipzig.", "Willi Orban|Willi Orban"),
  r("W", "A club from Lower Saxony won promotion to the Bundesliga in 1990.", "Waldhof Mannheim|Mannheim"),
  r("W", "A midfielder from Dortmund played for clubs in Germany and Italy.", "Wolfram Wuttke|Wuttke"),
  r("X", "A manager guided the Rhineland side through an unbeaten domestic season.", "Xabi Alonso's unbeaten title season|Xabi Alonso title"),
  r("X", "An Austrian midfielder plays for Leipzig and the national team.", "Xaver Schlager|Schlager"),
  r("X", "A Swiss winger played for Bayern, Inter and Liverpool.", "Xherdan Shaqiri|Shaqiri"),
  r("X", "A German midfielder won titles for Munich and played for England's champions.", "Felix Magath|Magath", true),
  r("X", "A German forward played for Freiburg, Bremen and Wolfsburg.", "Max Kruse|Kruse", true),
  r("X", "A former Bayern forward later became a club official.", "Alexander Zickler|Zickler", true),
  r("Y", "A Denmark international became a long-serving striker in Saxony.", "Yussuf Poulsen|Poulsen"),
  r("Y", "A German-born forward of Turkish heritage became a Dortmund teenager.", "Youssoufa Moukoko|Moukoko"),
  r("Y", "A midfielder from Turkey played for Mainz and Borussia Mönchengladbach.", "Yunus Mallı|Yunus Malli"),
  r("Y", "A former Turkey international midfielder played for Stuttgart and Hertha.", "Yıldıray Baştürk|Yildiray Basturk"),
  r("Y", "A Swiss keeper moved from Gladbach to Inter in 2023.", "Yann Sommer|Sommer"),
  r("Y", "A Ukrainian winger played for Schalke before moving to the Bundesliga.", "Yevhen Konoplyanka|Konoplyanka"),
  r("Z", "A Brazilian playmaker won titles for Bayern and later played for Hamburg.", "Zé Roberto|Ze Roberto"),
  r("Z", "A former Bremen midfielder was known for his precise set pieces.", "Zlatko Junuzović|Zlatko Junuzovic"),
  r("Z", "A Serbian midfielder played for Stuttgart and Inter.", "Zdravko Kuzmanović|Zdravko Kuzmanovic"),
  r("Z", "A Hungarian midfielder played for Hamburg and Darmstadt.", "Zoltan Stieber|Zoltan Stieber"),
  r("Z", "A Croatian defender captained Stuttgart in the late 2000s.", "Zvonimir Soldo|Soldo"),
  r("Z", "A football ground in Saxony was Leipzig's home before the new arena.", "Zentralstadion|Central Stadium"),
];

const list = (raw: string) => raw.split("|").map((item) => { const [name, ...aliases] = item.split("/"); return { name: name.trim(), aliases: aliases.map((alias) => alias.trim()) }; });
export const BUNDESLIGA_TRIVIA: { id: string; noun: string; plural: string; raw: string }[] = [
  { id: "s-bl-champs", noun: "Bundesliga champion", plural: "Bundesliga champions", raw: "Bayern Munich/Bayern|Borussia Dortmund/Dortmund|Werder Bremen/Werder|VfB Stuttgart/Stuttgart|Borussia Mönchengladbach/Gladbach|Hamburger SV/Hamburg|1. FC Köln/Köln/Cologne|1. FC Kaiserslautern/Kaiserslautern|1. FC Nürnberg/Nürnberg/Nuremberg|Eintracht Braunschweig/Braunschweig|VfL Wolfsburg/Wolfsburg|Bayer Leverkusen/Leverkusen" },
  { id: "s-bl-scorers", noun: "Bundesliga top scorer", plural: "Bundesliga top scorers", raw: "Gerd Müller/Gerd Muller|Robert Lewandowski/Lewandowski|Klaus Fischer/Fischer|Jupp Heynckes/Heynckes|Manfred Burgsmüller/Manfred Burgsmueller|Claudio Pizarro/Pizarro|Ulf Kirsten/Kirsten|Dieter Müller/Dieter Mueller|Klaus Allofs/Allofs|Karl-Heinz Rummenigge/Rummenigge|Harry Kane/Kane|Stefan Kuntz/Kuntz" },
  { id: "s-bl-stadia", noun: "stadium of a current Bundesliga club", plural: "stadiums of current Bundesliga clubs", raw: "Allianz Arena|Signal Iduna Park/Westfalenstadion|BayArena|MHPArena/Neckarstadion|Europa-Park Stadion/Europa Park Stadion|Deutsche Bank Park/Waldstadion|Volksparkstadion|RheinEnergieStadion/Müngersdorfer Stadion|Weserstadion|Red Bull Arena/Zentralstadion|MEWA Arena/Opel Arena|WWK Arena|PreZero Arena|Stadion An der Alten Försterei/Alte Försterei|Rudolf-Harbig-Stadion|Veltins-Arena/Arena AufSchalke|URSAPHARM-Arena an der Kaiserlinde|Home Deluxe Arena|Borussia-Park" },
  { id: "s-bl-managers", noun: "manager who won the Bundesliga", plural: "managers who won the Bundesliga", raw: "Udo Lattek|Ottmar Hitzfeld|Jupp Heynckes|Hennes Weisweiler|Felix Magath|Ernst Happel|Otto Rehhagel|Thomas Schaaf|Jürgen Klopp/Jurgen Klopp|Pep Guardiola|Louis van Gaal|Matthias Sammer|Branko Zebec|Udo Klug" },
  { id: "s-bl-footballers", noun: "German Footballer of the Year who played in the Bundesliga", plural: "German Footballers of the Year who played in the Bundesliga", raw: "Franz Beckenbauer|Gerd Müller/Gerd Muller|Lothar Matthäus/Lothar Matthaus|Karl-Heinz Rummenigge|Jürgen Klinsmann/Jurgen Klinsmann|Matthias Sammer|Michael Ballack|Philipp Lahm|Manuel Neuer|Marco Reus|Toni Kroos|Thomas Müller/Thomas Mueller" },
  { id: "s-bl-30goals", noun: "player who scored 30 or more goals in a Bundesliga season", plural: "players who scored 30 or more goals in a Bundesliga season", raw: "Gerd Müller/Gerd Muller|Robert Lewandowski/Lewandowski|Harry Kane/Kane|Pierre-Emerick Aubameyang/Aubameyang|Lothar Emmerich/Emmerich|Jupp Heynckes/Heynckes|Dieter Müller/Dieter Mueller|Uwe Seeler/Seeler|Grafite|Claudio Pizarro/Pizarro|Klaus Fischer/Fischer|Ulf Kirsten/Kirsten" },
  { id: "s-bl-relegated", noun: "club relegated from the Bundesliga", plural: "clubs relegated from the Bundesliga", raw: "Hertha BSC/Hertha Berlin|Schalke 04/Schalke|1. FC Kaiserslautern/Kaiserslautern|VfL Bochum/Bochum|1. FC Nürnberg/Nürnberg|Hannover 96/Hannover|MSV Duisburg/Duisburg|Fortuna Düsseldorf/Düsseldorf|Karlsruher SC/Karlsruhe|Eintracht Braunschweig/Braunschweig|Arminia Bielefeld/Bielefeld|Hansa Rostock/Rostock|FC St. Pauli/St Pauli|Energie Cottbus/Cottbus|Alemannia Aachen/Aachen|Darmstadt 98/Darmstadt|SC Paderborn/Paderborn|Holstein Kiel/Kiel" },
  { id: "s-bl-captains", noun: "captain who lifted the Bundesliga title", plural: "captains who lifted the Bundesliga title", raw: "Franz Beckenbauer|Klaus Augenthaler|Lothar Matthäus/Lothar Matthaus|Stefan Effenberg|Oliver Kahn|Philipp Lahm|Manuel Neuer|Michael Zorc|Sebastian Kehl|Stefan Reuter|Guido Buchwald|Bruno Pezzey" },
  { id: "s-bl-2014", noun: "2014 World Cup-winning Germany player who played in the Bundesliga", plural: "2014 World Cup-winning Germany players who played in the Bundesliga", raw: "Manuel Neuer|Philipp Lahm|Mats Hummels|Jerome Boateng|Benedikt Höwedes/Benedikt Howedes|Bastian Schweinsteiger|Toni Kroos|Thomas Müller/Thomas Mueller|Mario Götze/Mario Gotze|Miroslav Klose|Mesut Özil/Mesut Ozil|André Schürrle/Andre Schurrle|Sami Khedira|Per Mertesacker|Kevin Großkreutz/Kevin Grosskreutz" },
  { id: "s-bl-gk", noun: "goalkeeper who won a Bundesliga title", plural: "goalkeepers who won a Bundesliga title", raw: "Sepp Maier|Oliver Kahn|Manuel Neuer|Jens Lehmann|Andreas Köpke/Andreas Koepke|Toni Schumacher|Bodo Illgner|Hans-Jörg Butt/Hans-Joerg Butt|Rene Adler|Marc-André ter Stegen/Marc-Andre ter Stegen|Roman Weidenfeller|Jean-Marie Pfaff" },
  { id: "s-bl-europe", noun: "German club that won a major European trophy", plural: "German clubs that won a major European trophy", raw: "Bayern Munich/Bayern|Borussia Dortmund/Dortmund|Hamburger SV/Hamburg|Werder Bremen/Werder|Bayer Leverkusen/Leverkusen|Eintracht Frankfurt/Frankfurt|Schalke 04/Schalke|1. FC Magdeburg/Magdeburg|1. FC Köln/Köln|Borussia M?nchengladbach/Gladbach" },
  { id: "s-bl-non-ger", noun: "non-German Bundesliga top scorer", plural: "non-German Bundesliga top scorers", raw: "Rudolf Brunnenmeier/Brunnenmeier|Lothar Emmerich/Emmerich|Lothar Kobluhn/Kobluhn|Jørn Andersen/Jorn Andersen|Aílton/Ailton|Marek Mintál/Marek Mintal|Theofanis Gekas/Gekas|Grafite|Edin Džeko/Edin Dzeko|Robert Lewandowski/Lewandowski|Harry Kane/Kane|Pierre-Emerick Aubameyang/Aubameyang" },
  { id: "s-bl-hattrick", noun: "player who scored a Bundesliga hat-trick", plural: "players who scored a Bundesliga hat-trick", raw: "Gerd Müller/Gerd Muller|Robert Lewandowski/Lewandowski|Claudio Pizarro/Pizarro|Harry Kane/Kane|Lothar Emmerich/Emmerich|Dieter Müller/Dieter Mueller|Mario Gómez/Mario Gomez|Erling Haaland/Haaland|Jupp Heynckes/Heynckes|Ulf Kirsten/Kirsten" },
  { id: "s-bl-dfb", noun: "club that won the DFB-Pokal", plural: "clubs that won the DFB-Pokal", raw: "Bayern Munich/Bayern|Borussia Dortmund/Dortmund|Werder Bremen/Werder|VfB Stuttgart/Stuttgart|Hamburger SV/Hamburg|Borussia Mönchengladbach/Gladbach|Eintracht Frankfurt/Frankfurt|1. FC Köln/Köln|Schalke 04/Schalke|VfL Wolfsburg/Wolfsburg|1. FC Nürnberg/Nürnberg|Kaiserslautern" },
  { id: "s-bl-milestones", noun: "Bundesliga record holder", plural: "Bundesliga record holders", raw: "Gerd Müller/Gerd Muller|Karl-Heinz Körbel/Karl-Heinz Koerbel|Robert Lewandowski/Lewandowski|Thomas Müller/Thomas Mueller|Manuel Neuer|Claudio Pizarro/Pizarro|Uwe Seeler/Seeler|Klaus Fischer/Fischer|Harry Kane/Kane|Kevin Volland/Volland" },
];
if (BUNDESLIGA_TRIVIA.some((category) => list(category.raw).length < 10)) throw new Error("Bundesliga trivia categories must contain at least ten entries.");





