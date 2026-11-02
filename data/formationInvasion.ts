import type { Competition } from "@/lib/competitions";
import { EXTRA_FORMATION_QUESTIONS } from "@/data/formationInvasionQuestions";
import { ADDITIONAL_FORMATION_QUESTIONS, LEGACY_FORMATION_DIFFICULTIES } from "@/data/formationInvasionExpansion";
import { formationClues } from "@/data/formationInvasionClues";
import { ADDITIONAL_FORMATION_DEFENDERS } from "@/data/formationInvasionDefenders";
import { ADDITIONAL_FORMATION_MIDFIELDERS } from "@/data/formationInvasionMidfielders";
import { ADDITIONAL_FORMATION_FORWARDS } from "@/data/formationInvasionForwards";

export type FormationPosition = "GK" | "LB" | "CB" | "RB" | "CM" | "DM" | "LW" | "ST" | "RW";
export type FormationQuestion = { text: string; answers: string[]; hint: string; clues: [string, string, string]; difficulty: "easy" | "medium" | "hard" };
export type FormationPlayer = {
  id: string;
  name: string;
  positions: FormationPosition[];
  competitions: Competition[];
  source: string;
  questions: FormationQuestion[];
};

type Fact = Omit<FormationQuestion, "clues">;
const q = (text: string, answers: string[], hint: string): Fact => ({ text, answers, hint, difficulty: "easy" });
const p = (
  id: string, name: string, positions: FormationPosition[], competitions: Competition[],
  article: string, questions: [Fact, Fact, Fact],
): FormationPlayer => ({
  id, name, positions, competitions,
  questions: [
    ...[...questions, ...EXTRA_FORMATION_QUESTIONS[id]].map((question, index) => ({
      ...question, difficulty: LEGACY_FORMATION_DIFFICULTIES[id][index],
    })),
    ...ADDITIONAL_FORMATION_QUESTIONS[id],
  ].map((question) => ({ ...question, clues: formationClues(question) })),
  source: `https://en.wikipedia.org/wiki/${article}`,
});

// Historical facts stay fixed during a match; competition membership requires senior appearances.
export const FORMATION_PLAYERS: FormationPlayer[] = [
  p("neuer", "Manuel Neuer", ["GK"], ["bundesliga", "ucl", "worldcup", "euros"], "Manuel_Neuer", [
    q("Which country did Neuer represent when winning the 2014 World Cup?", ["Germany", "Deutschland"], "The host of the 2006 World Cup."),
    q("Which club sold Neuer to Bayern Munich in 2011?", ["Schalke", "Schalke 04", "FC Schalke 04"], "The Royal Blues from Gelsenkirchen."),
    q("Which award for goalkeepers did Neuer win at the 2014 World Cup?", ["Golden Glove", "Golden Glove award"], "Its name combines a precious metal and goalkeeping equipment."),
  ]),
  p("buffon", "Gianluigi Buffon", ["GK"], ["seriea", "ligue1", "ucl", "worldcup", "euros"], "Gianluigi_Buffon", [
    q("Which country won the 2006 World Cup with Buffon in goal?", ["Italy", "Italia"], "The Azzurri."),
    q("Which Italian club did Buffon leave to join Juventus in 2001?", ["Parma", "Parma Calcio"], "The club where he also finished his playing career."),
    q("Which French club did Buffon join in 2018?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "They play at the Parc des Princes."),
  ]),
  p("casillas", "Iker Casillas", ["GK"], ["laliga", "ucl", "worldcup", "euros"], "Iker_Casillas", [
    q("Which national team did Casillas captain to the 2010 World Cup?", ["Spain", "Espana"], "La Roja."),
    q("Which Spanish club did Casillas represent before moving to Portugal in 2015?", ["Real Madrid", "Madrid"], "Their home is the Santiago Bernabeu."),
    q("Which Portuguese club did Casillas join in 2015?", ["Porto", "FC Porto"], "They play at the Estadio do Dragao."),
  ]),
  p("cech", "Petr Cech", ["GK"], ["pl", "ucl", "worldcup", "euros"], "Petr_%C4%8Cech", [
    q("Which London club signed Cech from Rennes in 2004?", ["Chelsea", "Chelsea FC"], "The Blues at Stamford Bridge."),
    q("Which London club did Cech join after Chelsea in 2015?", ["Arsenal", "Arsenal FC"], "The Gunners."),
    q("Which Bayern player had an extra-time penalty saved by Cech in the 2012 Champions League final?", ["Arjen Robben", "Robben"], "A Dutch winger who also played for Chelsea."),
  ]),
  p("muslera", "Fernando Muslera", ["GK"], ["superlig", "ucl", "worldcup", "copa"], "Fernando_Muslera", [
    q("Which country did Muslera help win the 2011 Copa America?", ["Uruguay"], "La Celeste, also the 1930 World Cup winners."),
    q("Which Istanbul club signed Muslera in 2011?", ["Galatasaray", "Galatasaray SK"], "The Lions, in yellow and red."),
    q("Which Italian club did Muslera play for immediately before Galatasaray?", ["Lazio", "SS Lazio"], "Roma's city rivals."),
  ]),
  p("navas", "Keylor Navas", ["GK"], ["laliga", "ligue1", "pl", "ucl", "worldcup"], "Keylor_Navas", [
    q("Which country did Navas help reach the 2014 World Cup quarter-finals?", ["Costa Rica"], "A Central American nation whose capital is San Jose."),
    q("Which Spanish club sold Navas to Real Madrid in 2014?", ["Levante", "Levante UD"], "A Valencia-based club, not Valencia CF."),
    q("Which French club signed Navas from Real Madrid in 2019?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "The Parc des Princes is their home."),
  ]),
  p("ederson", "Ederson", ["GK"], ["pl", "ucl", "copa"], "Ederson_(footballer,_born_1993)", [
    q("Which country does goalkeeper Ederson represent?", ["Brazil", "Brasil"], "The Selecao."),
    q("Which Portuguese club sold Ederson to Manchester City in 2017?", ["Benfica", "SL Benfica"], "The Lisbon Eagles."),
    q("Who managed Manchester City when Ederson won the 2023 Champions League?", ["Pep Guardiola", "Guardiola", "Josep Guardiola"], "A former Barcelona and Bayern manager."),
  ]),
  p("ramos", "Sergio Ramos", ["CB", "RB"], ["laliga", "ligue1", "ucl", "worldcup", "euros"], "Sergio_Ramos", [
    q("Which Spanish club sold Ramos to Real Madrid in 2005?", ["Sevilla", "Sevilla FC"], "An Andalusian club famous for Europa League wins."),
    q("Against which club did Ramos score his late equaliser in the 2014 Champions League final?", ["Atletico Madrid", "Atletico", "Atleti"], "Real Madrid's city rivals."),
    q("Which French club did Ramos join in 2021?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "He reunited there with Keylor Navas."),
  ]),
  p("pique", "Gerard Pique", ["CB"], ["pl", "laliga", "ucl", "worldcup", "euros"], "Gerard_Piqu%C3%A9", [
    q("Which country did Pique represent at the 2010 World Cup?", ["Spain", "Espana"], "They beat the Netherlands in the final."),
    q("Which English club did Pique leave to return to Barcelona in 2008?", ["Manchester United", "Man United", "Man Utd", "United"], "The Red Devils."),
    q("Which Spanish club took Pique on loan for the 2006/07 season?", ["Real Zaragoza", "Zaragoza"], "Their home ground is La Romareda."),
  ]),
  p("silva", "Thiago Silva", ["CB"], ["seriea", "ligue1", "pl", "ucl", "worldcup", "copa"], "Thiago_Silva", [
    q("Which country did Thiago Silva captain at the 2014 World Cup?", ["Brazil", "Brasil"], "The host nation."),
    q("Which Italian club sold Thiago Silva to PSG in 2012?", ["AC Milan", "Milan", "A.C. Milan"], "The red-and-black club at San Siro."),
    q("Which English club did Thiago Silva join in 2020?", ["Chelsea", "Chelsea FC"], "He won the Champions League with them in 2021."),
  ]),
  p("marquinhos", "Marquinhos", ["CB"], ["seriea", "ligue1", "ucl", "worldcup", "copa"], "Marquinhos", [
    q("Which country won the 2019 Copa America with Marquinhos in defence?", ["Brazil", "Brasil"], "They hosted the tournament."),
    q("Which Italian club sold Marquinhos to PSG in 2013?", ["Roma", "AS Roma", "A.S. Roma"], "The Giallorossi."),
    q("At which Brazilian club did Marquinhos make his senior debut?", ["Corinthians", "SC Corinthians Paulista"], "A Sao Paulo club nicknamed Timao."),
  ]),
  p("hummels", "Mats Hummels", ["CB"], ["bundesliga", "seriea", "ucl", "worldcup", "euros"], "Mats_Hummels", [
    q("Which country did Hummels help win the 2014 World Cup?", ["Germany", "Deutschland"], "They beat Argentina in the final."),
    q("Which club did Hummels leave to rejoin Bayern Munich in 2016?", ["Borussia Dortmund", "Dortmund", "BVB"], "The Black and Yellows."),
    q("Against which country did Hummels score Germany's 2014 World Cup quarter-final winner?", ["France"], "Les Bleus."),
  ]),
  p("boateng", "Jerome Boateng", ["CB"], ["bundesliga", "pl", "ligue1", "seriea", "ucl", "worldcup", "euros"], "J%C3%A9r%C3%B4me_Boateng", [
    q("Which country did Jerome Boateng represent when winning the 2014 World Cup?", ["Germany", "Deutschland"], "Not Ghana, his brother Kevin-Prince's national team."),
    q("Which English club sold Boateng to Bayern Munich in 2011?", ["Manchester City", "Man City", "City"], "The blue half of Manchester."),
    q("Which French club signed Boateng in 2021?", ["Lyon", "Olympique Lyonnais", "OL"], "Their men's team won seven straight French league titles from 2002."),
  ]),
  p("pepe", "Pepe", ["CB"], ["laliga", "superlig", "ucl", "worldcup", "euros"], "Pepe_(footballer,_born_1983)", [
    q("Which country did Pepe represent in the Euro 2016 final?", ["Portugal"], "They beat hosts France."),
    q("Which Turkish club did Pepe join in 2017?", ["Besiktas", "Besiktas JK"], "Istanbul's Black Eagles."),
    q("Which Portuguese club sold Pepe to Real Madrid in 2007?", ["Porto", "FC Porto"], "The Dragons."),
  ]),
  p("lugano", "Diego Lugano", ["CB"], ["superlig", "ligue1", "pl", "laliga", "worldcup", "copa"], "Diego_Lugano", [
    q("Which national team did Lugano captain to the 2011 Copa America?", ["Uruguay"], "Luis Suarez and Edinson Cavani were his teammates."),
    q("Which Istanbul club did Lugano join from Sao Paulo in 2006?", ["Fenerbahce", "Fenerbahce SK"], "The Yellow Canaries."),
    q("Which French club did Lugano join after Fenerbahce in 2011?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "The French capital's club."),
  ]),
  p("chiellini", "Giorgio Chiellini", ["CB", "LB"], ["seriea", "ucl", "worldcup", "euros"], "Giorgio_Chiellini", [
    q("Which country did Chiellini captain to the Euro 2020 title?", ["Italy", "Italia"], "They beat England on penalties."),
    q("Which Turin club did Chiellini play for from 2005 to 2022?", ["Juventus", "Juve"], "The Old Lady."),
    q("Which MLS club did Chiellini join in 2022?", ["Los Angeles FC", "LAFC", "Los Angeles Football Club"], "The black-and-gold Los Angeles club, not the Galaxy."),
  ]),
  p("alba", "Jordi Alba", ["LB"], ["laliga", "ucl", "worldcup", "euros"], "Jordi_Alba", [
    q("Which country did Alba score for in the Euro 2012 final?", ["Spain", "Espana"], "They defeated Italy 4-0."),
    q("Which Spanish club sold Alba to Barcelona in 2012?", ["Valencia", "Valencia CF"], "Their home ground is Mestalla."),
    q("Which MLS club did Alba join in 2023?", ["Inter Miami", "Inter Miami CF", "Miami"], "He reunited with Lionel Messi in Florida."),
  ]),
  p("evra", "Patrice Evra", ["LB"], ["pl", "seriea", "ligue1", "ucl", "worldcup", "euros"], "Patrice_Evra", [
    q("Which country did Evra represent in the Euro 2016 final?", ["France"], "The host nation."),
    q("Which club sold Evra to Manchester United in January 2006?", ["Monaco", "AS Monaco"], "A principality club playing in the French league."),
    q("Which Italian club did Evra join in 2014?", ["Juventus", "Juve"], "He reached the 2015 Champions League final with them."),
  ]),
  p("alaba", "David Alaba", ["LB", "CB"], ["bundesliga", "laliga", "ucl", "euros"], "David_Alaba", [
    q("Which national team does Alaba represent?", ["Austria", "Osterreich"], "Their capital is Vienna."),
    q("Which German club did Alaba leave for Real Madrid in 2021?", ["Bayern Munich", "Bayern", "Bayern Munchen", "FC Bayern"], "The Bavarian record champions."),
    q("Which German club took Alaba on loan in 2011?", ["Hoffenheim", "TSG Hoffenheim", "1899 Hoffenheim"], "Their name includes the year 1899."),
  ]),
  p("filipe", "Filipe Luis", ["LB"], ["pl", "laliga", "ucl", "worldcup", "copa"], "Filipe_Lu%C3%ADs", [
    q("Which country did Filipe Luis represent when winning the 2019 Copa America?", ["Brazil", "Brasil"], "The hosts."),
    q("Which English club did Filipe Luis join in 2014?", ["Chelsea", "Chelsea FC"], "He returned to Atletico Madrid a year later."),
    q("Which Brazilian club did Filipe Luis join in 2019?", ["Flamengo", "CR Flamengo"], "A Rio de Janeiro club in red and black."),
  ]),
  p("telles", "Alex Telles", ["LB"], ["superlig", "seriea", "pl", "laliga", "ucl", "worldcup"], "Alex_Telles", [
    q("Which country did Alex Telles represent at the 2022 World Cup?", ["Brazil", "Brasil"], "The Selecao."),
    q("Which Turkish club signed Telles from Gremio in 2014?", ["Galatasaray", "Galatasaray SK"], "The Lions in yellow and red."),
    q("Which English club signed Telles from Porto in 2020?", ["Manchester United", "Man United", "Man Utd", "United"], "Old Trafford is their home."),
  ]),
  p("lahm", "Philipp Lahm", ["RB", "LB", "DM"], ["bundesliga", "ucl", "worldcup", "euros"], "Philipp_Lahm", [
    q("Which national team did Lahm captain to the 2014 World Cup?", ["Germany", "Deutschland"], "They won the final at the Maracana."),
    q("Which Munich club did Lahm captain to the 2013 treble?", ["Bayern Munich", "Bayern", "Bayern Munchen", "FC Bayern"], "The Bavarian giants."),
    q("Which German club took Lahm on loan from 2003 to 2005?", ["Stuttgart", "VfB Stuttgart"], "Their white shirts have a red chest band."),
  ]),
  p("walker", "Kyle Walker", ["RB", "CB"], ["pl", "ucl", "worldcup", "euros"], "Kyle_Walker", [
    q("Which national team did Kyle Walker represent in the Euro 2020 final?", ["England"], "The Three Lions."),
    q("Which London club sold Walker to Manchester City in 2017?", ["Tottenham Hotspur", "Tottenham", "Spurs"], "Their home was White Hart Lane."),
    q("Which Birmingham club took Walker on loan in 2011?", ["Aston Villa", "Villa"], "They play at Villa Park in claret and blue."),
  ]),
  p("alves", "Dani Alves", ["RB"], ["laliga", "seriea", "ligue1", "ucl", "worldcup", "copa"], "Dani_Alves", [
    q("Which country won the 2019 Copa America with Alves as captain?", ["Brazil", "Brasil"], "The hosts."),
    q("Which Spanish club sold Alves to Barcelona in 2008?", ["Sevilla", "Sevilla FC"], "He won two UEFA Cups with this Andalusian club."),
    q("Which Italian club did Alves join in 2016?", ["Juventus", "Juve"], "He reached the 2017 Champions League final there."),
  ]),
  p("zanetti", "Javier Zanetti", ["RB", "LB", "DM"], ["seriea", "ucl", "worldcup", "copa"], "Javier_Zanetti", [
    q("Which country did Javier Zanetti represent?", ["Argentina"], "The Albiceleste."),
    q("Which Milan club did Zanetti captain to the 2010 treble?", ["Inter", "Inter Milan", "Internazionale", "Inter Milano"], "The Nerazzurri."),
    q("Which Argentine club sold Zanetti to Inter in 1995?", ["Banfield", "CA Banfield"], "A Buenos Aires-area club nicknamed El Taladro."),
  ]),
  p("hakimi", "Achraf Hakimi", ["RB"], ["laliga", "bundesliga", "seriea", "ligue1", "ucl", "worldcup"], "Achraf_Hakimi", [
    q("Which country did Hakimi help reach the 2022 World Cup semi-finals?", ["Morocco"], "The Atlas Lions."),
    q("Which Italian club sold Hakimi to PSG in 2021?", ["Inter", "Inter Milan", "Internazionale", "Inter Milano"], "He won Serie A with the Nerazzurri."),
    q("Which German club took Hakimi on loan from Real Madrid in 2018?", ["Borussia Dortmund", "Dortmund", "BVB"], "The Yellow Wall supports them."),
  ]),
  p("gonul", "Gokhan Gonul", ["RB"], ["superlig", "ucl", "euros"], "G%C3%B6khan_G%C3%B6n%C3%BCl", [
    q("Which national team did Gokhan Gonul represent?", ["Turkey", "Turkiye"], "The Crescent-Stars."),
    q("Which Istanbul club did Gonul leave to join Besiktas in 2016?", ["Fenerbahce", "Fenerbahce SK"], "He returned to the Yellow Canaries in 2020."),
    q("Which Ankara club did Gonul leave for Fenerbahce in 2007?", ["Genclerbirligi OFTAS", "Genclerbirligi Oftasspor", "OFTAS", "Hacettepe", "Hacettepespor"], "Their old name included a construction-company sponsor."),
  ]),
  p("xavi", "Xavi", ["CM"], ["laliga", "ucl", "worldcup", "euros"], "Xavi", [
    q("Which country won the 2010 World Cup with Xavi in midfield?", ["Spain", "Espana"], "La Roja."),
    q("Which Spanish club did Xavi leave in 2015 after winning a treble?", ["Barcelona", "FC Barcelona", "Barca"], "He later returned there as head coach."),
    q("Which Qatari club did Xavi join as a player in 2015?", ["Al Sadd", "Al-Sadd", "Al Sadd SC"], "A Doha club nicknamed The Boss."),
  ]),
  p("iniesta", "Andres Iniesta", ["CM"], ["laliga", "ucl", "worldcup", "euros"], "Andr%C3%A9s_Iniesta", [
    q("Against which country did Iniesta score the winning goal in the 2010 World Cup final?", ["Netherlands", "Holland", "The Netherlands"], "The Oranje."),
    q("Which Spanish club did Iniesta leave in 2018?", ["Barcelona", "FC Barcelona", "Barca"], "He came through La Masia."),
    q("Which Japanese club did Iniesta join in 2018?", ["Vissel Kobe", "Kobe"], "A Japanese port city's club whose name starts with V."),
  ]),
  p("pirlo", "Andrea Pirlo", ["DM", "CM"], ["seriea", "ucl", "worldcup", "euros"], "Andrea_Pirlo", [
    q("Which country did Pirlo represent when winning the 2006 World Cup?", ["Italy", "Italia"], "The Azzurri."),
    q("Which club did Pirlo leave for Juventus on a free transfer in 2011?", ["AC Milan", "Milan", "A.C. Milan"], "He had won the 2007 Champions League with them."),
    q("Which MLS club did Pirlo join in 2015?", ["New York City", "New York City FC", "NYCFC"], "The City Football Group club in New York."),
  ]),
  p("kimmich", "Joshua Kimmich", ["DM", "CM", "RB"], ["bundesliga", "ucl", "worldcup", "euros"], "Joshua_Kimmich", [
    q("Which country does Kimmich represent?", ["Germany", "Deutschland"], "Die Mannschaft."),
    q("Which German club sold Kimmich to Bayern Munich in 2015?", ["RB Leipzig", "Leipzig", "RasenBallsport Leipzig"], "The Red Bulls from Saxony."),
    q("Which Bayern teammate headed in Kimmich's cross to win the 2020 Champions League final?", ["Kingsley Coman", "Coman"], "A French winger who had previously played for PSG."),
  ]),
  p("kroos", "Toni Kroos", ["CM", "DM"], ["bundesliga", "laliga", "ucl", "worldcup", "euros"], "Toni_Kroos", [
    q("Which country did Kroos represent when winning the 2014 World Cup?", ["Germany", "Deutschland"], "They beat Brazil 7-1 in the semi-final."),
    q("Which club sold Kroos to Real Madrid in 2014?", ["Bayern Munich", "Bayern", "Bayern Munchen", "FC Bayern"], "He won the 2013 treble there."),
    q("Against which country did Kroos score a stoppage-time free-kick at the 2018 World Cup?", ["Sweden"], "The Scandinavian team in yellow and blue."),
  ]),
  p("modric", "Luka Modric", ["CM"], ["pl", "laliga", "ucl", "worldcup", "euros"], "Luka_Modri%C4%87", [
    q("Which country did Modric captain in the 2018 World Cup final?", ["Croatia", "Hrvatska"], "Their shirts feature red-and-white checks."),
    q("Which English club sold Modric to Real Madrid in 2012?", ["Tottenham Hotspur", "Tottenham", "Spurs"], "The north London club that played at White Hart Lane."),
    q("In which year did Modric win the Ballon d'Or?", ["2018"], "The same year he reached a World Cup final."),
  ]),
  p("kante", "N'Golo Kante", ["DM", "CM"], ["pl", "ligue1", "ucl", "worldcup", "euros"], "N%27Golo_Kant%C3%A9", [
    q("Which country won the 2018 World Cup with Kante in midfield?", ["France"], "Les Bleus."),
    q("Which club did Kante help win the 2015/16 Premier League?", ["Leicester", "Leicester City", "LCFC"], "The Foxes."),
    q("Which French club sold Kante to Leicester in 2015?", ["Caen", "SM Caen", "Stade Malherbe Caen"], "A Normandy club whose name has four letters."),
  ]),
  p("verratti", "Marco Verratti", ["CM", "DM"], ["ligue1", "ucl", "euros"], "Marco_Verratti", [
    q("Which country won Euro 2020 with Verratti in midfield?", ["Italy", "Italia"], "They beat England at Wembley."),
    q("Which French club signed Verratti in 2012?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "He stayed in the French capital until 2023."),
    q("Which Italian club sold Verratti to PSG?", ["Pescara", "Delfino Pescara", "Delfino Pescara 1936"], "An Adriatic-coast club nicknamed the Dolphins."),
  ]),
  p("matuidi", "Blaise Matuidi", ["CM", "DM"], ["ligue1", "seriea", "ucl", "worldcup", "euros"], "Blaise_Matuidi", [
    q("Which country did Matuidi help win the 2018 World Cup?", ["France"], "Les Bleus."),
    q("Which Italian club signed Matuidi from PSG in 2017?", ["Juventus", "Juve"], "The Turin club in black and white."),
    q("Which French club did Matuidi leave to join PSG in 2011?", ["Saint-Etienne", "Saint Etienne", "AS Saint-Etienne", "ASSE"], "Les Verts, who play in green."),
  ]),
  p("casemiro", "Casemiro", ["DM"], ["pl", "laliga", "ucl", "worldcup", "copa"], "Casemiro", [
    q("Which country won the 2019 Copa America with Casemiro in midfield?", ["Brazil", "Brasil"], "The hosts."),
    q("Which Spanish club sold Casemiro to Manchester United in 2022?", ["Real Madrid", "Madrid"], "He won five Champions Leagues with them."),
    q("Which Portuguese club took Casemiro on loan for 2014/15?", ["Porto", "FC Porto"], "The Dragons."),
  ]),
  p("vidal", "Arturo Vidal", ["CM", "DM"], ["seriea", "bundesliga", "laliga", "ucl", "worldcup", "copa"], "Arturo_Vidal", [
    q("Which country won the 2015 Copa America with Vidal in midfield?", ["Chile"], "They hosted the tournament."),
    q("Which German club sold Vidal to Juventus in 2011?", ["Bayer Leverkusen", "Leverkusen", "Bayer 04 Leverkusen"], "The Werkself, not Bayern Munich."),
    q("Which Spanish club did Vidal join from Bayern Munich in 2018?", ["Barcelona", "FC Barcelona", "Barca"], "He played alongside Lionel Messi."),
  ]),
  p("alex", "Alex de Souza", ["CM"], ["superlig", "ucl", "copa"], "Alex_(footballer,_born_1977)", [
    q("Which country did Alex de Souza represent?", ["Brazil", "Brasil"], "The Selecao."),
    q("Which Turkish club did Alex captain and play for from 2004 to 2012?", ["Fenerbahce", "Fenerbahce SK"], "The Yellow Canaries."),
    q("How many league goals made Alex the 2010/11 Super Lig top scorer?", ["28", "twenty eight", "twenty-eight"], "Four times seven."),
  ]),
  p("melo", "Felipe Melo", ["DM", "CM"], ["seriea", "laliga", "superlig", "ucl", "worldcup"], "Felipe_Melo", [
    q("Which country did Felipe Melo represent at the 2010 World Cup?", ["Brazil", "Brasil"], "The Selecao."),
    q("Which Turkish club did Felipe Melo join on loan from Juventus in 2011?", ["Galatasaray", "Galatasaray SK"], "He became known as Pitbull with the Lions."),
    q("Which Italian club signed Felipe Melo from Galatasaray in 2015?", ["Inter", "Inter Milan", "Internazionale", "Inter Milano"], "The Nerazzurri."),
  ]),
  p("sneijder", "Wesley Sneijder", ["CM"], ["laliga", "seriea", "superlig", "ligue1", "ucl", "worldcup", "euros"], "Wesley_Sneijder", [
    q("Which country did Sneijder help reach the 2010 World Cup final?", ["Netherlands", "Holland", "The Netherlands"], "The Oranje."),
    q("Which Italian club won the 2010 treble with Sneijder in midfield?", ["Inter", "Inter Milan", "Internazionale", "Inter Milano"], "They were managed by Jose Mourinho."),
    q("Which Turkish club signed Sneijder in January 2013?", ["Galatasaray", "Galatasaray SK"], "He joined the Lions shortly before Didier Drogba."),
  ]),
  p("ronaldo", "Cristiano Ronaldo", ["LW", "ST"], ["pl", "laliga", "seriea", "ucl", "worldcup", "euros"], "Cristiano_Ronaldo", [
    q("Which country did Cristiano Ronaldo captain to the Euro 2016 title?", ["Portugal"], "They defeated hosts France."),
    q("Which Portuguese club sold Ronaldo to Manchester United in 2003?", ["Sporting", "Sporting CP", "Sporting Lisbon", "Sporting Clube de Portugal"], "The green-and-white Lisbon Lions."),
    q("Against which club did Ronaldo score his famous bicycle kick for Real Madrid in April 2018?", ["Juventus", "Juve"], "He joined that Turin club later in 2018."),
  ]),
  p("messi", "Lionel Messi", ["RW", "ST"], ["laliga", "ligue1", "ucl", "worldcup", "copa"], "Lionel_Messi", [
    q("Which country did Messi captain to the 2022 World Cup?", ["Argentina"], "The Albiceleste."),
    q("Which French club did Messi join in 2021?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "He reunited with Neymar there."),
    q("Which German club conceded five goals to Messi in one Champions League match in March 2012?", ["Bayer Leverkusen", "Leverkusen", "Bayer 04 Leverkusen"], "The Werkself."),
  ]),
  p("neymar", "Neymar", ["LW"], ["laliga", "ligue1", "ucl", "worldcup", "copa"], "Neymar", [
    q("Which country does Neymar represent?", ["Brazil", "Brasil"], "The Selecao."),
    q("Which Brazilian club sold Neymar to Barcelona in 2013?", ["Santos", "Santos FC"], "Pele's famous club."),
    q("Which French club paid Neymar's Barcelona release clause in 2017?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "The transfer fee was 222 million euros."),
  ]),
  p("dimaria", "Angel Di Maria", ["RW", "LW", "CM"], ["pl", "laliga", "ligue1", "seriea", "ucl", "worldcup", "copa"], "%C3%81ngel_Di_Mar%C3%ADa", [
    q("Which country did Di Maria score for in the 2022 World Cup final?", ["Argentina"], "They beat France on penalties."),
    q("Which English club did Di Maria join in 2014?", ["Manchester United", "Man United", "Man Utd", "United"], "He wore number 7 at Old Trafford."),
    q("Against which country did Di Maria score the only goal of the 2021 Copa America final?", ["Brazil", "Brasil"], "The hosts at the Maracana."),
  ]),
  p("robben", "Arjen Robben", ["RW", "LW"], ["pl", "laliga", "bundesliga", "ucl", "worldcup", "euros"], "Arjen_Robben", [
    q("Which country did Robben represent in the 2010 World Cup final?", ["Netherlands", "Holland", "The Netherlands"], "The Oranje."),
    q("Which club sold Robben to Bayern Munich in 2009?", ["Real Madrid", "Madrid"], "The Spanish club at the Bernabeu."),
    q("Against which club did Robben score the winner in the 2013 Champions League final?", ["Borussia Dortmund", "Dortmund", "BVB"], "Bayern's yellow-and-black German rivals."),
  ]),
  p("ribery", "Franck Ribery", ["LW", "RW"], ["bundesliga", "ligue1", "superlig", "seriea", "ucl", "worldcup", "euros"], "Franck_Rib%C3%A9ry", [
    q("Which country did Ribery represent in the 2006 World Cup final?", ["France"], "Les Bleus."),
    q("Which Turkish club did Ribery briefly play for in 2005?", ["Galatasaray", "Galatasaray SK"], "He won the Turkish Cup with the Lions."),
    q("Which French club sold Ribery to Bayern Munich in 2007?", ["Marseille", "Olympique Marseille", "Olympique de Marseille", "OM"], "They play at the Stade Velodrome."),
  ]),
  p("salah", "Mohamed Salah", ["RW"], ["pl", "seriea", "ucl", "worldcup"], "Mohamed_Salah", [
    q("Which country does Salah represent?", ["Egypt"], "The Pharaohs."),
    q("Which Italian club sold Salah to Liverpool in 2017?", ["Roma", "AS Roma", "A.S. Roma"], "The Giallorossi."),
    q("Against which club did Salah score a penalty in the 2019 Champions League final?", ["Tottenham Hotspur", "Tottenham", "Spurs"], "Liverpool's north London opponents in Madrid."),
  ]),
  p("henry", "Thierry Henry", ["LW", "ST"], ["pl", "laliga", "seriea", "ligue1", "ucl", "worldcup", "euros"], "Thierry_Henry", [
    q("Which country won Euro 2000 with Henry in attack?", ["France"], "Les Bleus."),
    q("Which Italian club sold Henry to Arsenal in 1999?", ["Juventus", "Juve"], "The Old Lady."),
    q("Which Spanish club did Henry join from Arsenal in 2007?", ["Barcelona", "FC Barcelona", "Barca"], "He won the 2009 treble there."),
  ]),
  p("benzema", "Karim Benzema", ["ST"], ["laliga", "ligue1", "ucl", "worldcup", "euros"], "Karim_Benzema", [
    q("Which national team did Benzema represent?", ["France"], "Les Bleus."),
    q("Which French club sold Benzema to Real Madrid in 2009?", ["Lyon", "Olympique Lyonnais", "OL"], "His hometown club."),
    q("In which year did Benzema win the Ballon d'Or?", ["2022"], "The year Real Madrid beat Liverpool in the Paris Champions League final."),
  ]),
  p("lewandowski", "Robert Lewandowski", ["ST"], ["bundesliga", "laliga", "ucl", "worldcup", "euros"], "Robert_Lewandowski", [
    q("Which national team does Lewandowski represent?", ["Poland", "Polska"], "Their capital is Warsaw."),
    q("Which German club did Lewandowski leave for Bayern Munich in 2014?", ["Borussia Dortmund", "Dortmund", "BVB"], "The yellow-and-black club."),
    q("Against which club did Lewandowski score five goals in nine minutes in 2015?", ["Wolfsburg", "VfL Wolfsburg"], "The Wolves in green."),
  ]),
  p("suarez", "Luis Suarez", ["ST"], ["pl", "laliga", "ucl", "worldcup", "copa"], "Luis_Su%C3%A1rez", [
    q("Which country won the 2011 Copa America with Suarez in attack?", ["Uruguay"], "La Celeste."),
    q("Which English club sold Suarez to Barcelona in 2014?", ["Liverpool", "Liverpool FC", "LFC"], "He had just won the Premier League Golden Boot there."),
    q("Which Dutch club sold Suarez to Liverpool in 2011?", ["Ajax", "AFC Ajax"], "The Amsterdam club."),
  ]),
  p("drogba", "Didier Drogba", ["ST"], ["pl", "ligue1", "superlig", "ucl", "worldcup"], "Didier_Drogba", [
    q("Which country did Drogba captain at the 2006 World Cup?", ["Ivory Coast", "Cote d'Ivoire", "Cote d Ivoire"], "The Elephants."),
    q("Which French club sold Drogba to Chelsea in 2004?", ["Marseille", "Olympique Marseille", "Olympique de Marseille", "OM"], "The Stade Velodrome is their home."),
    q("Which Turkish club signed Drogba in January 2013?", ["Galatasaray", "Galatasaray SK"], "He played alongside Wesley Sneijder."),
  ]),
  p("etoo", "Samuel Eto'o", ["ST", "RW"], ["laliga", "seriea", "pl", "superlig", "ucl", "worldcup"], "Samuel_Eto%27o", [
    q("Which country did Eto'o represent?", ["Cameroon"], "The Indomitable Lions."),
    q("Which Italian club did Eto'o join from Barcelona in 2009?", ["Inter", "Inter Milan", "Internazionale", "Inter Milano"], "He won another treble there in 2010."),
    q("Which Turkish club signed Eto'o in 2015?", ["Antalyaspor"], "A Mediterranean resort city's club in red and white."),
  ]),
  p("alexis", "Alexis Sanchez", ["LW", "RW", "ST"], ["pl", "laliga", "seriea", "ligue1", "ucl", "worldcup", "copa"], "Alexis_S%C3%A1nchez", [
    q("Which country won the 2015 Copa America with Alexis Sanchez?", ["Chile"], "They beat Argentina on penalties."),
    q("Which English club signed Alexis from Barcelona in 2014?", ["Arsenal", "Arsenal FC"], "The Gunners."),
    q("Which Italian club sold Alexis to Barcelona in 2011?", ["Udinese", "Udinese Calcio"], "The club from Udine in black-and-white stripes."),
  ]),
  p("dzeko", "Edin Dzeko", ["ST"], ["pl", "bundesliga", "seriea", "superlig", "ucl", "worldcup"], "Edin_D%C5%BEeko", [
    q("Which national team did Dzeko represent at the 2014 World Cup?", ["Bosnia and Herzegovina", "Bosnia", "Bosnia Herzegovina", "BiH"], "Their capital is Sarajevo."),
    q("Which German club sold Dzeko to Manchester City in 2011?", ["Wolfsburg", "VfL Wolfsburg"], "He won the 2008/09 Bundesliga with the Wolves."),
    q("Which Turkish club did Dzeko join from Inter in 2023?", ["Fenerbahce", "Fenerbahce SK"], "The Yellow Canaries."),
  ]),
  p("quaresma", "Ricardo Quaresma", ["RW", "LW"], ["pl", "laliga", "seriea", "superlig", "ucl", "worldcup", "euros"], "Ricardo_Quaresma", [
    q("Which country won Euro 2016 with Quaresma in the squad?", ["Portugal"], "He scored their extra-time winner against Croatia."),
    q("Which Istanbul club signed Quaresma from Inter in 2010?", ["Besiktas", "Besiktas JK"], "The Black Eagles."),
    q("Which Portuguese club did Quaresma leave to join Barcelona in 2003?", ["Sporting", "Sporting CP", "Sporting Lisbon", "Sporting Clube de Portugal"], "Cristiano Ronaldo left the same club that summer."),
  ]),
  p("mbappe", "Kylian Mbappe", ["LW", "ST"], ["ligue1", "laliga", "ucl", "worldcup", "euros"], "Kylian_Mbapp%C3%A9", [
    q("Which country did Mbappe help win the 2018 World Cup?", ["France"], "Les Bleus."),
    q("Which club did Mbappe leave to join PSG in 2017?", ["Monaco", "AS Monaco"], "He won Ligue 1 with them in 2016/17."),
    q("Against which country did Mbappe score a hat-trick in the 2022 World Cup final?", ["Argentina"], "Lionel Messi captained the opposition."),
  ]),
  p("haaland", "Erling Haaland", ["ST"], ["pl", "bundesliga", "ucl"], "Erling_Haaland", [
    q("Which national team does Haaland represent?", ["Norway", "Norge"], "Their capital is Oslo."),
    q("Which German club sold Haaland to Manchester City in 2022?", ["Borussia Dortmund", "Dortmund", "BVB"], "The Black and Yellows."),
    q("How many Premier League goals did Haaland score in 2022/23?", ["36", "thirty six", "thirty-six"], "Six squared."),
  ]),
  ...ADDITIONAL_FORMATION_DEFENDERS,
  ...ADDITIONAL_FORMATION_MIDFIELDERS,
  ...ADDITIONAL_FORMATION_FORWARDS,
];

export const FORMATION_SLOTS: { position: FormationPosition; x: number; y: number }[] = [
  { position: "LW", x: 17, y: 15 }, { position: "ST", x: 50, y: 10 }, { position: "RW", x: 83, y: 15 },
  { position: "CM", x: 25, y: 35 }, { position: "CM", x: 75, y: 35 }, { position: "DM", x: 50, y: 51 },
  { position: "LB", x: 14, y: 67 }, { position: "CB", x: 38, y: 73 },
  { position: "CB", x: 62, y: 73 }, { position: "RB", x: 86, y: 67 }, { position: "GK", x: 50, y: 91 },
];

const PORTRAITS: Record<string, string> = {
  alisson: "4/4f/Alisson_Becker_Brazil_V_Morocco_13_June_2026-117_%28cropped%29.jpg/960px-Alisson_Becker_Brazil_V_Morocco_13_June_2026-117_%28cropped%29.jpg",
  degea: "6/68/David_de_Gea_2017.jpg/330px-David_de_Gea_2017.jpg",
  donnarumma: "2/2d/Norway_Italy_-_June_2025_A_17_%28Gianluigi_Donnarumma%29.jpg/960px-Norway_Italy_-_June_2025_A_17_%28Gianluigi_Donnarumma%29.jpg",
  ballack: "5/5d/10._Tag_der_Legenden_2014_69.jpg/960px-10._Tag_der_Legenden_2014_69.jpg",
  schweinsteiger: "a/ac/Re-publica_23_-_Tag_3_%2852957826298%29_%28cropped%29.jpg/1280px-Re-publica_23_-_Tag_3_%2852957826298%29_%28cropped%29.jpg",
  ronaldonazario: "3/36/12.12.2025_%E2%80%93_Cerim%C3%B4nia_de_lan%C3%A7amento_do_SBT_News_-_54980664160_%28cropped2%29.jpg/960px-12.12.2025_%E2%80%93_Cerim%C3%B4nia_de_lan%C3%A7amento_do_SBT_News_-_54980664160_%28cropped2%29.jpg",
  sane: "0/0a/Leroy_Sane_Ecuador_v_Germany_25_June_2026-119_%28cropped%29.jpg/960px-Leroy_Sane_Ecuador_v_Germany_25_June_2026-119_%28cropped%29.jpg",
  navas: "d/dc/Keylor_Navas_2018_%28cropped%29.jpg/330px-Keylor_Navas_2018_%28cropped%29.jpg",
  boateng: "2/22/Jerome_Boateng_Training_2019-04-10_FC_Bayern_Muenchen-2_%28cropped%29.jpg/330px-Jerome_Boateng_Training_2019-04-10_FC_Bayern_Muenchen-2_%28cropped%29.jpg",
  evra: "c/cd/Patrice_Evra_%2852472689279%29_%28cropped%29.jpg/330px-Patrice_Evra_%2852472689279%29_%28cropped%29.jpg",
  lahm: "8/8a/Philipp_Lahm_auf_der_Berlinale_2024%2C_Ausschnitt.jpg/330px-Philipp_Lahm_auf_der_Berlinale_2024%2C_Ausschnitt.jpg",
  matuidi: "0/07/Matuidi_PSG.jpg/330px-Matuidi_PSG.jpg",
  quaresma: "b/be/Ricardo_Quaresma_%28cropped%29_2.jpg/330px-Ricardo_Quaresma_%28cropped%29_2.jpg",
  muslera: "3/38/Fernando_Muslera_in_2021.jpg/330px-Fernando_Muslera_in_2021.jpg",
  lugano: "b/bf/U02_Diego_Lugano_7557.jpg/330px-U02_Diego_Lugano_7557.jpg",
  telles: "7/7b/Alex_Telles_2021.jpg/330px-Alex_Telles_2021.jpg",
  melo: "3/31/FelipeMeloFlu.png/330px-FelipeMeloFlu.png",
  alex: "0/02/Alex_de_Souza_2025.png/330px-Alex_de_Souza_2025.png",
  gonul: "1/1b/G%C3%B6khan_G%C3%B6n%C3%BCl_-_AUT_vs._TUR_2016-03-29_%28244%29.jpg/330px-G%C3%B6khan_G%C3%B6n%C3%BCl_-_AUT_vs._TUR_2016-03-29_%28244%29.jpg",
};
export const formationPortrait = (id: string) => PORTRAITS[id]
  ? `https://upload.wikimedia.org/wikipedia/commons/thumb/${PORTRAITS[id]}` : undefined;

export function formationPlayer(id: string): FormationPlayer {
  const player = FORMATION_PLAYERS.find((entry) => entry.id === id);
  if (!player) throw new Error(`Unknown Formation Invasion player: ${id}`);
  return player;
}

export function formationLineup(comp: Competition): string[] {
  const pool = FORMATION_PLAYERS.filter((player) => comp === "general" || player.competitions.includes(comp));
  // Place the least flexible positions first, then backtrack over this small curated pool.
  const slots = FORMATION_SLOTS.map((slot, index) => ({
    index, candidates: pool.filter((player) => player.positions.includes(slot.position))
      .map((player) => ({ id: player.id, random: Math.random() })).sort((a, b) => a.random - b.random),
  })).sort((a, b) => a.candidates.length - b.candidates.length);
  const result: string[] = [];
  const used = new Set<string>();
  const fill = (depth: number): boolean => {
    if (depth === slots.length) return true;
    const slot = slots[depth];
    for (const player of slot.candidates) {
      if (used.has(player.id)) continue;
      used.add(player.id);
      result[slot.index] = player.id;
      if (fill(depth + 1)) return true;
      used.delete(player.id);
    }
    return false;
  };
  if (!fill(0)) throw new Error(`No complete Formation Invasion lineup for ${comp}`);
  return result;
}
