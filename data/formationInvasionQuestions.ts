import type { FormationQuestion } from "@/data/formationInvasion";

const q = (text: string, answers: string[], hint: string): FormationQuestion => ({ text, answers, hint });

// Original career questions; each player's biography source is recorded in formationInvasion.ts.
export const EXTRA_FORMATION_QUESTIONS: Record<string, [FormationQuestion, FormationQuestion, FormationQuestion]> = {
  neuer: [
    q("Which shirt number did Neuer wear for Germany at the 2014 World Cup?", ["1", "one"], "The traditional starting goalkeeper's number."),
    q("Who coached Bayern when Neuer won the Champions League in 2013?", ["Jupp Heynckes", "Heynckes"], "A German coach who also won it with Real Madrid in 1998."),
    q("Which English club did Neuer face in the 2012 Champions League final?", ["Chelsea", "Chelsea FC"], "Drogba scored the winning shootout penalty."),
  ],
  buffon: [
    q("Which Juventus teammate captained Italy when Buffon won the 2006 World Cup?", ["Fabio Cannavaro", "Cannavaro"], "A centre-back who won that year's Ballon d'Or."),
    q("Which shirt number did Buffon usually wear as Juventus's first-choice goalkeeper?", ["1", "one"], "The smallest positive whole number."),
    q("Which Spanish club beat Buffon's Juventus in the 2015 Champions League final?", ["Barcelona", "FC Barcelona", "Barca"], "Their attack included Messi, Suarez and Neymar."),
  ],
  casillas: [
    q("Which shirt number did Casillas wear for Spain in the 2010 World Cup final?", ["1", "one"], "A classic first-choice goalkeeper's number."),
    q("Which Dutch winger did Casillas deny in a famous one-on-one in the 2010 World Cup final?", ["Arjen Robben", "Robben"], "A left-footed Bayern winger."),
    q("Who coached Spain when Casillas lifted the 2010 World Cup?", ["Vicente del Bosque", "Del Bosque"], "He had also coached Casillas at Real Madrid."),
  ],
  cech: [
    q("Which shirt number did Cech wear at Arsenal during his first three seasons there?", ["33", "thirty three", "thirty-three"], "Three repeated twice."),
    q("Who coached Chelsea when Cech won the 2012 Champions League?", ["Roberto Di Matteo", "Di Matteo"], "An Italian former Chelsea midfielder."),
    q("Which German club did Cech face in the 2012 Champions League final?", ["Bayern Munich", "Bayern", "Bayern Munchen", "FC Bayern"], "The final was played in their own stadium."),
  ],
  muslera: [
    q("Which shirt number did Muslera wear for Uruguay at the 2010 World Cup?", ["1", "one"], "The usual first-choice goalkeeper's number."),
    q("Which country did Muslera face in the 2011 Copa America final?", ["Paraguay"], "Their capital is Asuncion."),
    q("Which Uruguay teammate won the best-player award at the 2011 Copa America?", ["Luis Suarez", "Suarez"], "He joined Liverpool earlier that year."),
  ],
  navas: [
    q("Which English club took Navas on loan from PSG in January 2023?", ["Nottingham Forest", "Forest", "Notts Forest"], "They play at the City Ground."),
    q("Who coached Real Madrid for all three of Navas's Champions League titles from 2016 to 2018?", ["Zinedine Zidane", "Zidane", "Zizou"], "A French World Cup-winning midfielder."),
    q("Which country knocked Navas's Costa Rica out of the 2014 World Cup on penalties?", ["Netherlands", "Holland", "The Netherlands"], "Tim Krul came on for the shootout."),
  ],
  ederson: [
    q("Which shirt number did Ederson wear at Manchester City in their 2022/23 treble season?", ["31", "thirty one", "thirty-one"], "One more than thirty."),
    q("Which Italian club did Ederson face in the 2023 Champions League final?", ["Inter", "Inter Milan", "Internazionale", "Inter Milano"], "The Nerazzurri."),
    q("Which midfielder scored City's winner as Ederson kept a clean sheet in the 2023 Champions League final?", ["Rodri", "Rodrigo Hernandez", "Rodrigo"], "A Spanish holding midfielder."),
  ],
  ramos: [
    q("Which shirt number did Ramos wear for Real Madrid from 2005 to 2021?", ["4", "four"], "The number previously worn by Fernando Hierro."),
    q("Who coached Real Madrid when Ramos scored in the 2014 Champions League final?", ["Carlo Ancelotti", "Ancelotti"], "An Italian coach nicknamed Carletto."),
    q("Which Real Madrid teammate scored an extra-time header after Ramos's equaliser in the 2014 final?", ["Gareth Bale", "Bale"], "A Welsh winger signed from Tottenham."),
  ],
  pique: [
    q("Which shirt number did Pique wear for Barcelona throughout his 2008-2022 spell?", ["3", "three"], "One more than two."),
    q("Which centre-back partnered Pique in Spain's starting XI in the 2010 World Cup final?", ["Carles Puyol", "Puyol"], "Barcelona's long-haired captain."),
    q("Who coached Barcelona when Pique won the 2009 treble?", ["Pep Guardiola", "Guardiola", "Josep Guardiola"], "He later coached Bayern and Manchester City."),
  ],
  silva: [
    q("Which shirt number did Thiago Silva wear at Chelsea during their 2020/21 Champions League-winning season?", ["6", "six"], "Half a dozen."),
    q("Who coached Chelsea when Thiago Silva won the 2021 Champions League?", ["Thomas Tuchel", "Tuchel"], "A German coach who had also coached him at PSG."),
    q("Which Brazilian club did Thiago Silva return to in 2024 after leaving Chelsea?", ["Fluminense", "Fluminense FC", "Flu"], "The Rio club nicknamed the Tricolor."),
  ],
  marquinhos: [
    q("Which shirt number did Marquinhos wear for PSG in the 2020 Champions League final?", ["5", "five"], "The number of fingers on one hand."),
    q("Which German club beat Marquinhos's PSG in the 2020 Champions League final?", ["Bayern Munich", "Bayern", "Bayern Munchen", "FC Bayern"], "Kingsley Coman scored the only goal."),
    q("Who coached PSG when Marquinhos reached the 2020 Champions League final?", ["Thomas Tuchel", "Tuchel"], "A German coach who joined Chelsea the following year."),
  ],
  hummels: [
    q("Which shirt number did Hummels wear for Germany at the 2014 World Cup?", ["5", "five"], "One more than four."),
    q("Who coached Dortmund when Hummels won the 2011/12 Bundesliga and German Cup double?", ["Jurgen Klopp", "Klopp"], "He later managed Liverpool."),
    q("Which club beat Hummels's Dortmund in the 2024 Champions League final?", ["Real Madrid", "Madrid"], "Dani Carvajal and Vinicius Junior scored."),
  ],
  boateng: [
    q("Which shirt number did Jerome Boateng wear for Bayern in their 2019/20 treble season?", ["17", "seventeen"], "Ten plus seven."),
    q("Who coached Germany when Boateng won the 2014 World Cup?", ["Joachim Low", "Low", "Joachim Loew", "Loew"], "His first name is Joachim."),
    q("Which brother of Jerome Boateng represented Ghana at the 2014 World Cup?", ["Kevin-Prince Boateng", "Kevin Prince Boateng", "Kevin-Prince", "Kevin Prince"], "His double-barrelled first name ends in Prince."),
  ],
  pepe: [
    q("Which shirt number did Pepe wear for Portugal in the Euro 2016 final?", ["3", "three"], "One fewer than four."),
    q("Who coached Portugal when Pepe won Euro 2016?", ["Fernando Santos", "Santos"], "His first name is Fernando."),
    q("Which French forward hit the post late in normal time against Pepe's Portugal in the Euro 2016 final?", ["Andre-Pierre Gignac", "Andre Pierre Gignac", "Gignac"], "The striker played for Tigres in Mexico."),
  ],
  lugano: [
    q("Which shirt number did Lugano wear for Uruguay at the 2010 World Cup?", ["2", "two"], "The smallest prime number."),
    q("Which English club signed Lugano from PSG in 2013?", ["West Bromwich Albion", "West Brom", "WBA", "West Bromwich"], "The Baggies at The Hawthorns."),
    q("Which Spanish club took Lugano on loan from PSG in January 2013?", ["Malaga", "Malaga CF"], "An Andalusian club that reached that season's Champions League quarter-finals."),
  ],
  chiellini: [
    q("Which shirt number did Chiellini wear for Italy in the Euro 2020 final?", ["3", "three"], "One fewer than four."),
    q("Which centre-back partnered Chiellini in Italy's starting XI in the Euro 2020 final?", ["Leonardo Bonucci", "Bonucci"], "He scored Italy's equaliser."),
    q("Who coached Italy when Chiellini lifted the Euro 2020 trophy?", ["Roberto Mancini", "Mancini"], "A former Manchester City manager."),
  ],
  alba: [
    q("Which shirt number did Alba wear for Barcelona in their 2014/15 treble season?", ["18", "eighteen"], "Twice nine."),
    q("Against which country did Alba score in Spain's 4-0 Euro 2012 final win?", ["Italy", "Italia"], "The Azzurri."),
    q("Which Barcelona teammate assisted Alba's goal in the Euro 2012 final?", ["Xavi", "Xavi Hernandez"], "The midfielder who later coached Barcelona."),
  ],
  evra: [
    q("Which shirt number did Evra wear at Manchester United from 2006 to 2014?", ["3", "three"], "One fewer than four."),
    q("Who managed Manchester United when Evra won the 2008 Champions League?", ["Alex Ferguson", "Sir Alex Ferguson", "Ferguson"], "The Scottish manager knighted in 1999."),
    q("Which English club did Evra join in February 2018?", ["West Ham United", "West Ham", "WHU"], "The Hammers."),
  ],
  alaba: [
    q("Which shirt number did Alaba take at Real Madrid in 2021?", ["4", "four"], "Sergio Ramos had just vacated it."),
    q("Who coached Bayern when Alaba won the 2020 Champions League?", ["Hansi Flick", "Hans-Dieter Flick", "Hans Dieter Flick", "Flick"], "His nickname is Hansi."),
    q("Which French club did Alaba face in the 2020 Champions League final?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "Kingsley Coman scored against his former club."),
  ],
  filipe: [
    q("Who coached Atletico Madrid when Filipe Luis won La Liga in 2013/14?", ["Diego Simeone", "Simeone", "Cholo Simeone"], "An Argentine nicknamed El Cholo."),
    q("Which Spanish club sold Filipe Luis to Atletico Madrid in 2010?", ["Deportivo La Coruna", "Deportivo", "Deportivo de La Coruna", "Depor"], "The Galician club at Riazor."),
    q("Which shirt number did Filipe Luis wear at Chelsea in 2014/15?", ["3", "three"], "Ashley Cole had worn it before him."),
  ],
  telles: [
    q("Which Spanish club took Alex Telles on loan from Manchester United in 2022?", ["Sevilla", "Sevilla FC"], "He won the Europa League there in 2023."),
    q("Which Italian club took Telles on loan from Galatasaray in 2015?", ["Inter", "Inter Milan", "Internazionale", "Inter Milano"], "The Nerazzurri."),
    q("Which Saudi club signed Telles from Manchester United in 2023?", ["Al Nassr", "Al-Nassr", "Al Nassr FC"], "He reunited with Cristiano Ronaldo."),
  ],
  lahm: [
    q("Which shirt number did Lahm wear for Germany at the 2014 World Cup?", ["16", "sixteen"], "Four squared."),
    q("Who coached Bayern when Lahm captained them to the 2013 Champions League?", ["Jupp Heynckes", "Heynckes"], "He returned for a fourth Bayern spell in 2017."),
    q("Against which country did Lahm score the opening goal of the 2006 World Cup?", ["Costa Rica"], "The Central American team whose goalkeeper later included Keylor Navas."),
  ],
  walker: [
    q("Which shirt number did Walker wear for Manchester City in the 2022/23 treble season?", ["2", "two"], "The traditional right-back number."),
    q("Which club did Walker play for before joining Tottenham in 2009?", ["Sheffield United", "Sheffield Utd", "The Blades"], "The Blades, not the Owls."),
    q("Who coached Manchester City when Walker won the 2023 Champions League?", ["Pep Guardiola", "Guardiola", "Josep Guardiola"], "A former Barcelona and Bayern manager."),
  ],
  alves: [
    q("Which shirt number did Alves wear during his first Barcelona season in 2008/09?", ["20", "twenty"], "Two times ten."),
    q("Which French club did Alves join after Juventus in 2017?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "He won domestic trophies alongside Neymar."),
    q("Which Brazilian club did Alves leave to join Sevilla in 2002?", ["Bahia", "EC Bahia", "Esporte Clube Bahia"], "A Salvador club named after its state."),
  ],
  zanetti: [
    q("Which shirt number did Inter retire in honour of Zanetti?", ["4", "four"], "The same number he wore as their long-serving captain."),
    q("Who coached Inter when Zanetti lifted the 2010 Champions League?", ["Jose Mourinho", "Mourinho"], "The Portuguese Special One."),
    q("Which compatriot scored both goals when Zanetti's Inter won the 2010 Champions League final?", ["Diego Milito", "Milito"], "The striker nicknamed Il Principe, not his defender brother Gabriel."),
  ],
  hakimi: [
    q("Which shirt number did Hakimi wear for Morocco at the 2022 World Cup?", ["2", "two"], "A traditional right-back number."),
    q("Against which country did Hakimi score the winning shootout penalty at the 2022 World Cup?", ["Spain", "Espana"], "He was born in their capital, Madrid."),
    q("Who coached Inter when Hakimi won Serie A in 2020/21?", ["Antonio Conte", "Conte"], "An Italian coach who also won the Premier League with Chelsea."),
  ],
  gonul: [
    q("Which shirt number did Gonul wear for Turkey at Euro 2016?", ["7", "seven"], "A number often associated with wingers, not full-backs."),
    q("Which Brazilian coach managed Fenerbahce when Gonul joined in 2007?", ["Zico", "Arthur Antunes Coimbra"], "A Flamengo legend known as the White Pele."),
    q("Which Black Sea club did Gonul join after leaving Fenerbahce in 2021?", ["Rizespor", "Caykur Rizespor"], "Their name includes the tea-growing city of Rize."),
  ],
  xavi: [
    q("Which shirt number did Xavi wear for Barcelona in the 2010/11 season?", ["6", "six"], "Half a dozen."),
    q("Which Spain teammate scored from Xavi's pass in the Euro 2008 final?", ["Fernando Torres", "Torres"], "A striker nicknamed El Nino."),
    q("Against which English club did Xavi win the 2011 Champions League final?", ["Manchester United", "Man United", "Man Utd", "United"], "The final was at Wembley against Ferguson's side."),
  ],
  iniesta: [
    q("Which shirt number did Iniesta wear for Spain in the 2010 World Cup final?", ["6", "six"], "Two fewer than his famous Barcelona number."),
    q("Which Spain teammate supplied the final pass for Iniesta's 2010 World Cup-winning goal?", ["Cesc Fabregas", "Fabregas", "Francesc Fabregas"], "An Arsenal midfielder at the time."),
    q("Against which English club did Iniesta score a late away goal in the 2009 Champions League semi-final?", ["Chelsea", "Chelsea FC"], "The match was at Stamford Bridge."),
  ],
  pirlo: [
    q("Which shirt number did Pirlo wear for Italy at the 2006 World Cup?", ["21", "twenty one", "twenty-one"], "Three times seven."),
    q("Who coached Juventus when Pirlo won Serie A in 2011/12?", ["Antonio Conte", "Conte"], "A former Juventus midfielder who later coached Chelsea."),
    q("Which England goalkeeper faced Pirlo's Panenka in the Euro 2012 quarter-final shootout?", ["Joe Hart", "Hart"], "Manchester City's goalkeeper at the time."),
  ],
  kimmich: [
    q("Which shirt number did Kimmich wear for Bayern in their 2019/20 treble season?", ["32", "thirty two", "thirty-two"], "Two to the fifth power."),
    q("Who coached Bayern when Kimmich joined their first team in 2015?", ["Pep Guardiola", "Guardiola", "Josep Guardiola"], "He moved to Manchester City in 2016."),
    q("Which club did Kimmich score a chipped winner against in May 2020?", ["Borussia Dortmund", "Dortmund", "BVB"], "The goal came in Der Klassiker."),
  ],
  kroos: [
    q("Which shirt number did Kroos wear at Real Madrid from 2014 to 2024?", ["8", "eight"], "Two cubed."),
    q("Which German club took Kroos on loan from Bayern in 2009?", ["Bayer Leverkusen", "Leverkusen", "Bayer 04 Leverkusen"], "The Werkself."),
    q("Which Real Madrid teammate headed in Kroos's corner to open the scoring in the 2024 Champions League final?", ["Dani Carvajal", "Daniel Carvajal", "Carvajal"], "The Spanish right-back."),
  ],
  modric: [
    q("Which Croatian club did Modric leave to join Tottenham in 2008?", ["Dinamo Zagreb", "Dinamo", "GNK Dinamo Zagreb"], "They play at Maksimir."),
    q("Which shirt number did Modric wear at Real Madrid in the 2017/18 season?", ["10", "ten"], "James Rodriguez had worn it before him."),
    q("Which award did Modric receive as the best player of the 2018 World Cup?", ["Golden Ball", "Golden Ball award", "FIFA Golden Ball"], "Not the Ballon d'Or: this award is specific to the tournament."),
  ],
  kante: [
    q("Which shirt number did Kante wear at Chelsea in their 2020/21 Champions League-winning season?", ["7", "seven"], "One more than six."),
    q("Who coached Leicester when Kante won the Premier League in 2015/16?", ["Claudio Ranieri", "Ranieri"], "The Italian manager nicknamed the Tinkerman."),
    q("Which Saudi club signed Kante in 2023?", ["Al Ittihad", "Al-Ittihad", "Ittihad"], "He joined Karim Benzema in Jeddah."),
  ],
  verratti: [
    q("Which shirt number did Verratti wear at PSG in the 2020 Champions League final?", ["6", "six"], "Half a dozen."),
    q("Who coached Italy when Verratti won Euro 2020?", ["Roberto Mancini", "Mancini"], "A former Manchester City title-winning manager."),
    q("Which Qatari club signed Verratti from PSG in 2023?", ["Al Arabi", "Al-Arabi", "Al Arabi SC"], "A Doha club whose name means The Arab."),
  ],
  matuidi: [
    q("Which shirt number did Matuidi wear for France at the 2018 World Cup?", ["14", "fourteen"], "Twice seven."),
    q("Which MLS club did Matuidi join after Juventus in 2020?", ["Inter Miami", "Inter Miami CF", "Miami"], "David Beckham co-owns this Florida club."),
    q("Who coached France when Matuidi won the 2018 World Cup?", ["Didier Deschamps", "Deschamps"], "He captained France to the 1998 title."),
  ],
  casemiro: [
    q("Which Brazilian club did Casemiro leave to join Real Madrid's reserve team in 2013?", ["Sao Paulo", "Sao Paulo FC", "SPFC"], "The Tricolor from Brazil's largest city."),
    q("Which shirt number did Casemiro take at Manchester United in 2022?", ["18", "eighteen"], "Paul Scholes's old number."),
    q("Against which club did Casemiro score in the 2017 Champions League final?", ["Juventus", "Juve"], "The final was in Cardiff against the Italian champions."),
  ],
  vidal: [
    q("Which shirt number did Vidal wear at Juventus in the 2014/15 season?", ["23", "twenty three", "twenty-three"], "Michael Jordan's famous number."),
    q("Which German club signed Vidal from Juventus in 2015?", ["Bayern Munich", "Bayern", "Bayern Munchen", "FC Bayern"], "He joined Pep Guardiola's team."),
    q("Which national team did Vidal face in both the 2015 and 2016 Copa America finals?", ["Argentina"], "Lionel Messi captained the opposition."),
  ],
  alex: [
    q("Which shirt number did Alex de Souza famously wear at Fenerbahce?", ["10", "ten"], "The classic playmaker's number."),
    q("Which Brazilian club did Alex leave to join Fenerbahce in 2004?", ["Cruzeiro", "Cruzeiro EC"], "A Belo Horizonte club in blue."),
    q("Which Brazilian coach led Alex's Fenerbahce to the 2007/08 Champions League quarter-finals?", ["Zico", "Arthur Antunes Coimbra"], "A legendary Flamengo number 10."),
  ],
  melo: [
    q("Which shirt number did Felipe Melo wear for Galatasaray in the 2012/13 season?", ["10", "ten"], "An unusual number for a holding midfielder."),
    q("Which Italian club sold Felipe Melo to Juventus in 2009?", ["Fiorentina", "ACF Fiorentina"], "The Florence club in purple."),
    q("Against which country was Felipe Melo sent off in Brazil's 2010 World Cup quarter-final?", ["Netherlands", "Holland", "The Netherlands"], "Wesley Sneijder scored both goals for the opposition."),
  ],
  sneijder: [
    q("Which shirt number did Sneijder wear for the Netherlands at the 2010 World Cup?", ["10", "ten"], "The classic playmaker's number."),
    q("Which Spanish club sold Sneijder to Inter in 2009?", ["Real Madrid", "Madrid"], "He left the Bernabeu after two seasons."),
    q("Against which country did Sneijder score twice in the 2010 World Cup quarter-final?", ["Brazil", "Brasil"], "The Selecao."),
  ],
  ronaldo: [
    q("Which shirt number did Cristiano Ronaldo wear in his first Real Madrid season?", ["9", "nine"], "Raul still wore number 7."),
    q("Who managed Manchester United when Ronaldo won his first Ballon d'Or in 2008?", ["Alex Ferguson", "Sir Alex Ferguson", "Ferguson"], "The club's long-serving Scottish manager."),
    q("Which Italian goalkeeper faced Ronaldo's bicycle kick in the 2018 Champions League quarter-final?", ["Gianluigi Buffon", "Buffon", "Gigi Buffon"], "Juventus's long-serving number 1."),
  ],
  messi: [
    q("Which shirt number did Messi wear at PSG during his 2021-2023 spell?", ["30", "thirty"], "Three times ten."),
    q("Who coached Argentina when Messi won the 2022 World Cup?", ["Lionel Scaloni", "Scaloni"], "He shares Messi's first name."),
    q("Which Barcelona teammate formed MSN with Messi and Neymar?", ["Luis Suarez", "Suarez"], "A Uruguayan striker signed from Liverpool."),
  ],
  neymar: [
    q("Which shirt number did Neymar wear at Barcelona from 2013 to 2017?", ["11", "eleven"], "One more than ten."),
    q("Which Saudi club signed Neymar from PSG in 2023?", ["Al Hilal", "Al-Hilal", "Al Hilal SFC"], "The Riyadh club nicknamed the Blue Waves."),
    q("Against which Italian club did Neymar score in the 2015 Champions League final?", ["Juventus", "Juve"], "Barcelona won 3-1 in Berlin."),
  ],
  dimaria: [
    q("Which shirt number did Di Maria wear for Argentina in the 2022 World Cup final?", ["11", "eleven"], "One more than Messi's number."),
    q("Which Portuguese club sold Di Maria to Real Madrid in 2010?", ["Benfica", "SL Benfica"], "The Lisbon Eagles."),
    q("Which Italian club did Di Maria join after PSG in 2022?", ["Juventus", "Juve"], "He stayed in Turin for one season."),
  ],
  robben: [
    q("Which shirt number did Robben wear at Bayern throughout his 2009-2019 spell?", ["10", "ten"], "The classic attacking playmaker's number."),
    q("Which English club sold Robben to Real Madrid in 2007?", ["Chelsea", "Chelsea FC"], "The Blues."),
    q("Which French Bayern teammate supplied the backheeled pass for Robben's 2013 Champions League final winner?", ["Franck Ribery", "Ribery"], "Together they were nicknamed Robbery."),
  ],
  ribery: [
    q("Which shirt number did Ribery wear at Bayern Munich from 2007 to 2019?", ["7", "seven"], "Three fewer than Robben's number."),
    q("Which Italian club did Ribery join after Bayern in 2019?", ["Fiorentina", "ACF Fiorentina"], "The Florence club in purple."),
    q("Which Dutch winger formed Bayern's famous Robbery partnership with Ribery?", ["Arjen Robben", "Robben"], "A left-footed winger who liked cutting in from the right."),
  ],
  salah: [
    q("Which shirt number did Salah wear at Liverpool in the 2018/19 season?", ["11", "eleven"], "One more than ten."),
    q("Which Swiss club sold Salah to Chelsea in 2014?", ["Basel", "FC Basel", "Basle"], "Their name is also a city on the Rhine."),
    q("Who managed Liverpool when Salah won the 2019 Champions League?", ["Jurgen Klopp", "Klopp"], "A German manager previously at Dortmund."),
  ],
  henry: [
    q("Which shirt number did Henry wear during his first Arsenal spell?", ["14", "fourteen"], "Twice seven."),
    q("Which manager brought Henry to Arsenal in 1999?", ["Arsene Wenger", "Wenger"], "A French manager nicknamed Le Professeur."),
    q("Which MLS club did Henry join from Barcelona in 2010?", ["New York Red Bulls", "NY Red Bulls", "New York Redbulls", "Red Bulls"], "Not New York City FC."),
  ],
  benzema: [
    q("Which shirt number did Benzema wear at Real Madrid in the 2021/22 season?", ["9", "nine"], "The traditional centre-forward's number."),
    q("Which Saudi club signed Benzema from Real Madrid in 2023?", ["Al Ittihad", "Al-Ittihad", "Ittihad"], "The Jeddah club in yellow and black."),
    q("Against which French club did Benzema score a second-leg hat-trick in the 2022 Champions League last 16?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "Their attack included Messi, Neymar and Mbappe."),
  ],
  lewandowski: [
    q("Which shirt number did Lewandowski wear at Bayern in their 2019/20 treble season?", ["9", "nine"], "Three squared."),
    q("Which Polish club sold Lewandowski to Dortmund in 2010?", ["Lech Poznan", "Lech", "KKS Lech Poznan"], "The Railwaymen from Poznan."),
    q("Against which Spanish club did Lewandowski score four goals in a 2013 Champions League semi-final?", ["Real Madrid", "Madrid"], "Jose Mourinho coached the opposition."),
  ],
  suarez: [
    q("Which shirt number did Suarez wear at Liverpool from 2011 to 2014?", ["7", "seven"], "Kenny Dalglish's famous Liverpool number."),
    q("Which Madrid club did Suarez join from Barcelona in 2020?", ["Atletico Madrid", "Atletico", "Atleti"], "He won La Liga there in his first season."),
    q("Which Uruguay teammate scored twice alongside Suarez in the 2011 Copa America final?", ["Diego Forlan", "Forlan"], "The 2010 World Cup Golden Ball winner."),
  ],
  drogba: [
    q("Which shirt number did Drogba wear when Chelsea won the 2012 Champions League?", ["11", "eleven"], "One more than ten."),
    q("Which Bayern goalkeeper faced Drogba's winning penalty in the 2012 final shootout?", ["Manuel Neuer", "Neuer"], "Germany's future 2014 World Cup-winning goalkeeper."),
    q("Which Chelsea teammate delivered the corner for Drogba's equaliser in the 2012 Champions League final?", ["Juan Mata", "Mata"], "A Spanish playmaker later signed by Manchester United."),
  ],
  etoo: [
    q("Which shirt number did Eto'o wear at Barcelona in the 2008/09 treble season?", ["9", "nine"], "The traditional centre-forward's number."),
    q("Which Spanish island club sold Eto'o to Barcelona in 2004?", ["Mallorca", "RCD Mallorca", "Real Mallorca"], "A Balearic Islands club."),
    q("Against which English club did Eto'o open the scoring in the 2009 Champions League final?", ["Manchester United", "Man United", "Man Utd", "United"], "Messi scored Barcelona's other goal in Rome."),
  ],
  alexis: [
    q("Which shirt number did Alexis Sanchez wear at Arsenal in the 2016/17 season?", ["7", "seven"], "He changed from number 17 that summer."),
    q("Which Armenian player moved to Arsenal in the January 2018 swap involving Alexis?", ["Henrikh Mkhitaryan", "Mkhitaryan"], "He had played for Dortmund before Manchester United."),
    q("Which club did Alexis join from Arsenal in January 2018?", ["Manchester United", "Man United", "Man Utd", "United"], "He took number 7 at Old Trafford."),
  ],
  dzeko: [
    q("Which shirt number did Dzeko wear at Manchester City in their 2011/12 title-winning season?", ["10", "ten"], "Sergio Aguero wore 16 at the time."),
    q("Which City teammate scored the title-winning goal shortly after Dzeko's equaliser against QPR in 2012?", ["Sergio Aguero", "Aguero", "Kun Aguero"], "An Argentine striker nicknamed Kun."),
    q("Which Italian club did Dzeko join from Roma in 2021?", ["Inter", "Inter Milan", "Internazionale", "Inter Milano"], "He replaced Romelu Lukaku at the Nerazzurri."),
  ],
  quaresma: [
    q("Which shirt number did Quaresma wear for Portugal at Euro 2016?", ["20", "twenty"], "Twice ten."),
    q("Which English club took Quaresma on loan from Inter in 2009?", ["Chelsea", "Chelsea FC"], "He briefly played at Stamford Bridge."),
    q("Against which country did Quaresma score Portugal's extra-time winner at Euro 2016?", ["Croatia", "Hrvatska"], "The team in red-and-white checks."),
  ],
  mbappe: [
    q("Which shirt number did Mbappe wear for France at the 2018 World Cup?", ["10", "ten"], "The number Zidane wore for France."),
    q("Which Spanish club did Mbappe join from PSG in 2024?", ["Real Madrid", "Madrid"], "They had just won their fifteenth European Cup."),
    q("Against which country did Mbappe score twice in France's 4-3 win in the 2018 World Cup last 16?", ["Argentina"], "Lionel Messi played for the opposition."),
  ],
  haaland: [
    q("Which shirt number did Haaland wear at Manchester City in the 2022/23 season?", ["9", "nine"], "The classic centre-forward's number."),
    q("Which Austrian club sold Haaland to Dortmund in January 2020?", ["Red Bull Salzburg", "Salzburg", "RB Salzburg", "FC Salzburg"], "The Red Bulls from Mozart's birthplace."),
    q("Against which German club did Haaland score five goals for City in the 2023 Champions League last 16?", ["RB Leipzig", "Leipzig", "RasenBallsport Leipzig"], "The Saxony club named after the Red Bulls."),
  ],
};
