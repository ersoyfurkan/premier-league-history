import type { FormationQuestion } from "@/data/formationInvasion";

type Difficulty = FormationQuestion["difficulty"];
type Fact = Omit<FormationQuestion, "difficulty">;
type Legacy = [Difficulty, Difficulty, Difficulty, Difficulty, Difficulty, Difficulty];
const q = (text: string, answers: string | string[], hint: string): Fact => ({
  text, answers: typeof answers === "string" ? [answers] : answers, hint,
});
const bank = (legacy: Legacy, easy: Fact[], medium: Fact[], hard: Fact[]) => ({
  legacy,
  questions: [
    ...easy.map((fact) => ({ ...fact, difficulty: "easy" as const })),
    ...medium.map((fact) => ({ ...fact, difficulty: "medium" as const })),
    ...hard.map((fact) => ({ ...fact, difficulty: "hard" as const })),
  ],
});
const E = "easy", M = "medium";

// Each biography URL in formationInvasion.ts remains the player's primary source.
// Match-specific cross-checks and additional public provenance are listed below.
export const FORMATION_FACT_SOURCES = [
  "https://www.uefa.com/uefachampionsleague/history/",
  "https://www.uefa.com/uefaeuro/history/",
  "https://www.fifa.com/tournaments/mens/worldcup",
  "https://en.wikipedia.org/wiki/2005_FIFA_Club_World_Championship_final",
  "https://en.wikipedia.org/wiki/2009_Coppa_Italia_final",
  "https://en.wikipedia.org/wiki/2011_Copa_Am%C3%A9rica",
  "https://en.wikipedia.org/wiki/1999_Copa_Libertadores_finals",
  "https://en.wikipedia.org/wiki/2023_Copa_Libertadores_final",
  "https://www.uefa.com/uefachampionsleague/news/0208-0e9f4110320f-ccf57ff59b7d-1000/",
  "https://en.wikipedia.org/wiki/G%C3%B6khan_G%C3%B6n%C3%BCl#International_goals",
  "https://www.uefa.com/under21/news/0257-0de65a8c43b5-6c6eb175036a-1000--czechs-savour-penalty-glory/",
  "https://www.dgabc.com.br/Noticia/377750/alex-fecha-acordo-com-o-parma",
  "https://datencenter.dfb.de/datencenter/bundesliga/2010-2011/19-spieltag/1899-hoffenheim-fc-st-pauli-191524",
  "https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Thierry_Henry",
];

// The six legacy difficulties follow the original three, then the original extra three.
// Only the twelve authored facts below are appended; saved-room question indices do not move.
const BANK = {
  neuer: bank([E, M, E, E, M, M], [
    q("In which German city was Neuer born?", "Gelsenkirchen", "A Ruhr city also associated with Schalke."),
    q("Which Germany substitute scored twice with Neuer in goal in the 7-1 win over Brazil in 2014?", ["Andre Schurrle", "Schurrle"], "The winger was a Chelsea player at the time."),
    q("Which Spanish club did Neuer's Bayern beat 8-2 in August 2020?", ["Barcelona", "Barca", "FC Barcelona"], "The one-legged quarter-final was played in Lisbon."),
  ], [
    q("Who coached Germany when Neuer made his senior international debut in 2009?", ["Joachim Low", "Joachim Loew", "Low", "Loew"], "He had succeeded Jurgen Klinsmann."),
    q("Which Bayern midfielder scored Germany's winner with Neuer in goal in the 2014 World Cup final?", ["Mario Gotze", "Gotze", "Mario Goetze", "Goetze"], "He replaced Miroslav Klose."),
    q("Which Bayern winger scored the only goal of Neuer's 2020 Champions League final?", ["Kingsley Coman", "Coman"], "He had previously played for the losing finalists."),
  ], [
    q("Which Portuguese club did Neuer shut out in a penalty shootout for Schalke in the 2008 Champions League last 16?", ["Porto", "FC Porto"], "The return leg was played at the Dragao."),
    q("Which Schalke midfielder scored the decisive penalty after Neuer's saves against Porto in March 2008?", ["Jermaine Jones", "Jones"], "He later represented the United States."),
    q("Which Algerian striker scored past Neuer in extra time in Germany's 2014 World Cup last-16 win?", ["Abdelmoumene Djabou", "Djabou"], "His consolation came after Schurrle and Ozil had scored."),
    q("Against which country did Neuer make his senior Germany debut in a 7-2 win in June 2009?", ["United Arab Emirates", "UAE", "Emirates"], "The match was played in Dubai."),
    q("Who coached Schalke when Neuer won the German Cup in May 2011?", ["Ralf Rangnick", "Rangnick"], "He had replaced Felix Magath that March."),
    q("Which second-tier club lost 5-0 to Neuer's Schalke in the 2011 German Cup final?", ["Duisburg", "MSV Duisburg"], "The Zebras reached the final in Berlin."),
  ]),
  buffon: bank([E, M, E, M, E, M], [
    q("In which Italian city was Buffon born?", "Carrara", "A Tuscan city famous for marble."),
    q("Which European trophy did Buffon win with Parma in 1999?", ["UEFA Cup", "UEFA Europa League", "Europa League"], "The competition was renamed in 2009."),
    q("Which Italian defender was Buffon's long-serving Juventus teammate nicknamed King Kong?", ["Giorgio Chiellini", "Chiellini"], "He later joined Los Angeles FC."),
  ], [
    q("Who coached Italy when Buffon won the 2006 World Cup?", ["Marcello Lippi", "Lippi"], "The silver-haired coach had also managed Juventus."),
    q("Which Spanish club defeated Buffon's Juventus in the 2017 Champions League final?", ["Real Madrid", "Madrid"], "Cristiano Ronaldo scored twice in Cardiff."),
    q("Which American club did Buffon's Juventus teammate Andrea Pirlo join in 2015?", ["New York City FC", "New York City", "NYCFC"], "Not the Red Bulls."),
  ], [
    q("Against which club did Buffon keep a clean sheet on his Serie A debut for Parma in 1995?", ["AC Milan", "Milan"], "Their attack included George Weah and Roberto Baggio."),
    q("Which French club did Buffon's Parma beat 3-0 in the 1999 UEFA Cup final?", ["Marseille", "Olympique de Marseille", "OM"], "The match took place in Moscow."),
    q("Which Milan striker scored the decisive penalty against Buffon in the 2003 Champions League final shootout?", ["Andriy Shevchenko", "Shevchenko"], "A Ukrainian Ballon d'Or winner."),
    q("Which Czech midfielder was suspended for Buffon's 2003 Champions League final?", ["Pavel Nedved", "Nedved"], "He won the Ballon d'Or later that year."),
    q("Which Romanian forward's penalty did Buffon save at Euro 2008?", ["Adrian Mutu", "Mutu"], "He had played for Juventus and Chelsea."),
    q("Which PSG coach managed Buffon during his 2018/19 season in Paris?", ["Thomas Tuchel", "Tuchel"], "A German who later won the Champions League with Chelsea."),
  ]),
  casillas: bank([E, E, M, E, M, M], [
    q("Which Madrid suburb is Casillas's birthplace?", ["Mostoles", "Móstoles"], "It lies southwest of Spain's capital."),
    q("Which goalkeeper captained Spain at the 1998 World Cup before Casillas's senior career?", ["Andoni Zubizarreta", "Zubizarreta"], "A former Barcelona and Athletic goalkeeper."),
    q("Which major international trophy did Casillas lift for Spain in both 2008 and 2012?", ["European Championship", "Euros", "UEFA European Championship", "Euro"], "A continental national-team tournament."),
  ], [
    q("Which club did Casillas beat 3-0 in the 2000 Champions League final?", ["Valencia", "Valencia CF"], "The first final between two Spanish clubs."),
    q("Which country did Casillas face in Spain's Euro 2012 final?", ["Italy", "Italia"], "The national side nicknamed the Azzurri."),
    q("Which Real Madrid captain handed the armband to Casillas after leaving in 2010?", ["Raul", "Raul Gonzalez"], "He moved to Schalke."),
  ], [
    q("Which injured goalkeeper did Casillas replace during the 2002 Champions League final?", ["Cesar Sanchez", "Cesar", "Sanchez"], "He later played for Valencia and Tottenham."),
    q("Which club was Casillas facing when he made crucial late saves in the 2002 Champions League final?", ["Bayer Leverkusen", "Leverkusen", "Bayer 04"], "The German side had Michael Ballack in midfield."),
    q("Which Irish left-back had a penalty saved by Casillas during normal time at the 2002 World Cup?", ["Ian Harte", "Harte"], "He played for Leeds United."),
    q("Which Paraguayan striker had a penalty saved by Casillas in the 2010 World Cup quarter-final?", ["Oscar Cardozo", "Cardozo"], "A powerful left-footed Benfica forward."),
    q("Which Real Madrid coach gave Casillas his first-team debut in September 1999?", ["John Toshack", "Toshack"], "A Welsh former Liverpool striker."),
    q("Which Greek club hosted Casillas's Champions League debut in September 1999?", ["Olympiacos", "Olympiakos"], "The match ended 3-3 in Piraeus."),
  ]),
  cech: bank([E, E, M, M, M, E], [
    q("Which national team did Cech represent at the 2006 World Cup?", ["Czech Republic", "Czechia"], "A Central European country whose capital is Prague."),
    q("In which Czech city was Cech born?", ["Plzen", "Pilsen"], "The city gave its name to pilsner beer."),
    q("Which Chelsea manager won the Premier League with Cech in 2004/05?", ["Jose Mourinho", "Mourinho"], "The Portuguese Special One."),
  ], [
    q("Which protective item became Cech's trademark after his 2006 head injury?", ["Helmet", "Headguard", "Head guard", "Protective helmet"], "He wore padded protection rather than a cap."),
    q("Which Czech club sold Cech to Rennes in 2002?", ["Sparta Prague", "Sparta Praha", "Sparta"], "One of Prague's two famous rivals."),
    q("How many Premier League clean sheets did Cech keep in Chelsea's 2004/05 title season?", ["24", "twenty four", "twenty-four"], "Two dozen, a single-season record."),
  ], [
    q("Which Bayern striker had his shootout penalty saved by Cech in the 2012 Champions League final?", ["Ivica Olic", "Olic"], "The Croatian took Bayern's fourth kick."),
    q("Which Chelsea player scored the decisive penalty after Cech's saves in the 2012 final?", ["Didier Drogba", "Drogba"], "He had also headed in the late equaliser."),
    q("Which French goalkeeper was Cech's opposite number in the 2002 European Under-21 final?", ["Mickael Landreau", "Landreau"], "A Nantes goalkeeper who later joined PSG."),
    q("Which Czech club gave Cech his senior league debut in 1999?", ["Chmel Blsany", "Blsany", "FK Chmel Blsany"], "A small-town club associated with hop growing."),
    q("Which Reading defender collided with Carlo Cudicini after Cech's injury in October 2006?", ["Ibrahima Sonko", "Sonko"], "A Senegal international centre-back."),
    q("Which Portuguese club did Cech's Chelsea beat in the 2013 Europa League final?", ["Benfica", "SL Benfica"], "Branislav Ivanovic headed the winner in Amsterdam."),
  ]),
  muslera: bank([E, E, M, E, M, M], [
    q("In which city was Muslera born?", ["Buenos Aires"], "Argentina's capital, despite his Uruguay international career."),
    q("Which position did Muslera play in Galatasaray's 2012 title-winning team?", ["Goalkeeper", "Keeper", "Goalie"], "The only player allowed to use his hands in his own penalty area."),
    q("Which Galatasaray teammate was a Dutch playmaker signed from Inter in 2013?", ["Wesley Sneijder", "Sneijder"], "A 2010 World Cup finalist."),
  ], [
    q("Which Uruguayan club first fielded Muslera in senior football?", ["Montevideo Wanderers", "Wanderers"], "Their name includes the Uruguayan capital."),
    q("Who coached Uruguay when Muslera won the 2011 Copa America?", ["Oscar Tabarez", "Tabarez", "Oscar Washington Tabarez"], "Nicknamed El Maestro."),
    q("Which domestic cup did Muslera win with Lazio in 2009?", ["Italian Cup", "Coppa Italia"], "Italy's national knockout trophy."),
  ], [
    q("Which club did Muslera's Lazio beat on penalties in the 2009 Coppa Italia final?", ["Sampdoria", "Samp"], "The Genoa club wore blue shirts with horizontal bands."),
    q("Which Lazio teammate scored the opening goal of the 2009 Coppa Italia final?", ["Mauro Zarate", "Zarate"], "An Argentine forward who later played for West Ham."),
    q("Which Argentine striker had his shootout penalty saved by Muslera in the 2011 Copa America quarter-final?", ["Carlos Tevez", "Tevez"], "He played for Manchester City at the time."),
    q("Which Ghanaian defender's penalty did Muslera save in the 2010 World Cup quarter-final shootout?", ["John Mensah", "Mensah"], "Ghana's captain that night; not Dominic Adiyiah."),
    q("Which club loaned Muslera in Uruguay before he moved to Lazio in 2007?", ["Nacional", "Club Nacional de Football"], "The Montevideo giants in white, blue and red."),
    q("Which veteran Italian goalkeeper competed with Muslera at Lazio in 2007/08?", ["Marco Ballotta", "Ballotta"], "He played Champions League football in his forties."),
  ]),
  navas: bank([E, M, E, E, M, M], [
    q("Which position did Navas play for Real Madrid in their 2018 European title win?", ["Goalkeeper", "Keeper", "Goalie"], "He wore gloves and guarded the net."),
    q("Which Costa Rican club launched Navas's senior career?", ["Saprissa", "Deportivo Saprissa"], "The Purple Monster from San Jose."),
    q("Which trophy did Navas win with Real Madrid in 2016, 2017 and 2018?", ["Champions League", "UEFA Champions League", "UCL", "European Cup"], "Europe's leading club competition."),
  ], [
    q("Which Spanish second-division club brought Navas to Europe in 2010?", ["Albacete", "Albacete Balompie"], "Their home is the Carlos Belmonte stadium."),
    q("Which Belgian goalkeeper succeeded Navas as Real Madrid's first choice?", ["Thibaut Courtois", "Courtois"], "He joined from Chelsea in 2018."),
    q("Which country did Costa Rica beat on penalties with Navas in the 2014 World Cup last 16?", ["Greece", "Hellas"], "The 2004 European champions."),
  ], [
    q("Which Greek striker's penalty did Navas save in the 2014 World Cup shootout?", ["Theofanis Gekas", "Fanis Gekas", "Gekas"], "A former Bundesliga top scorer."),
    q("Which English club beat Navas's Saprissa in the 2005 Club World Championship semi-final?", ["Liverpool", "Liverpool FC", "LFC"], "The European champions had won in Istanbul that year."),
    q("Which Brazilian club did Navas's Real Madrid beat in the 2017 Club World Cup final?", ["Gremio", "Gremio FBPA"], "Cristiano Ronaldo scored the only goal."),
    q("Which Italian coach managed Navas during his first Real Madrid season in 2014/15?", ["Carlo Ancelotti", "Ancelotti"], "He had just won La Decima."),
    q("Which Costa Rica captain scored against Greece before Navas's 2014 shootout heroics?", ["Bryan Ruiz", "Ruiz"], "An attacking midfielder formerly of Fulham."),
    q("Which German coach led PSG when Navas played the 2020 Champions League final?", ["Thomas Tuchel", "Tuchel"], "He had previously managed Dortmund."),
  ]),
  ederson: bank([E, M, E, E, M, M], [
    q("Which position did Ederson play for Manchester City in their 2023 treble?", ["Goalkeeper", "Keeper", "Goalie"], "He was the last line of defence."),
    q("Which Brazilian forward joined Ederson at Manchester City from Palmeiras in 2017?", ["Gabriel Jesus", "Jesus"], "He later moved to Arsenal."),
    q("Which English city is home to the club Ederson joined in 2017?", ["Manchester"], "City and United share it."),
  ], [
    q("Which Portuguese club did Ederson represent between Ribeirao and Benfica?", ["Rio Ave", "Rio Ave FC"], "A Vila do Conde club in green and white."),
    q("Which Brazil goalkeeper started the 2019 Copa America final while Ederson was on the bench?", ["Alisson", "Alisson Becker"], "Liverpool's number one."),
    q("Which English side beat Ederson's Manchester City in the 2021 Champions League final?", ["Chelsea", "Chelsea FC"], "Kai Havertz scored the only goal in Porto."),
  ], [
    q("Which Portuguese lower-league club gave Ederson his senior debut?", ["Ribeirao", "GD Ribeirao"], "Its name differs from the Brazilian city Ribeirao Preto."),
    q("Which Benfica coach won the Portuguese league with Ederson in 2016/17?", ["Rui Vitoria", "Vitoria"], "He later coached Egypt's national team."),
    q("Which Inter left-back's header did Ederson save late in the 2023 Champions League final?", ["Robin Gosens", "Gosens"], "A German international who came on as a substitute."),
    q("Which Liverpool forward collided with Ederson and was sent off in September 2017?", ["Sadio Mane", "Mane"], "The Senegalese winger challenged for a high ball."),
    q("Which City midfielder scored from Ederson's long clearance against Tottenham in February 2021?", ["Ilkay Gundogan", "Gundogan"], "He scored twice in the 3-0 win."),
    q("Which Premier League award did Ederson share with Alisson for the 2021/22 season?", ["Golden Glove", "Premier League Golden Glove"], "It rewards the most clean sheets."),
  ]),
  ramos: bank([E, M, E, E, M, M], [
    q("Which country did Ramos represent when winning the 2010 World Cup?", ["Spain", "Espana"], "La Roja."),
    q("Which Spanish club did Ramos rejoin in 2023?", ["Sevilla", "Sevilla FC"], "He returned to his first senior club after leaving PSG."),
    q("Which position did Ramos play for Spain in the 2010 World Cup final?", ["Right back", "Right-back", "RB"], "Pique and Puyol occupied the centre."),
  ], [
    q("Which Real Madrid captain left in 2015 before Ramos became club captain?", ["Iker Casillas", "Casillas"], "A goalkeeper who moved to Porto."),
    q("Which goalkeeper took Ramos's headed equaliser in the 2014 European final?", ["Thibaut Courtois", "Courtois"], "The Belgian was on loan from Chelsea."),
    q("Which Real Madrid coach won the 2016 and 2017 Champions Leagues with Ramos as captain?", ["Zinedine Zidane", "Zidane", "Zizou"], "A French former Ballon d'Or winner."),
  ], [
    q("Which Sevilla teammate was honoured by Ramos's Spain shirt number 15?", ["Antonio Puerta", "Puerta"], "The young wing-back died in 2007."),
    q("Which club conceded Ramos's first Real Madrid goal in December 2005?", ["Olympiacos", "Olympiakos"], "The European away match was in Piraeus."),
    q("Which goalkeeper did Ramos chip with a Panenka in the Euro 2012 semi-final shootout?", ["Rui Patricio", "Patricio"], "Portugal's number one."),
    q("Which Mexican striker scored Madrid's winner with Ramos playing in midfield in the 2015 Champions League quarter-final?", ["Javier Hernandez", "Chicharito", "Hernandez"], "He was on loan from Manchester United."),
    q("Which team did Ramos score twice against in the 2014 Champions League semi-final second leg?", ["Bayern Munich", "Bayern"], "Madrid won 4-0 at the Allianz Arena."),
    q("Which team did Ramos equalise against in stoppage time in the 2016 UEFA Super Cup?", ["Sevilla", "Sevilla FC"], "The match was played in Trondheim, not a Champions League final."),
  ]),
  pique: bank([E, E, M, E, M, M], [
    q("In which Spanish city was Pique born?", "Barcelona", "The capital of Catalonia."),
    q("Which Barcelona youth academy developed Pique before his move to England?", ["La Masia", "Masia"], "Its name means the farmhouse."),
    q("Which goalkeeper played behind Pique in Barcelona's 2009 Champions League final win?", ["Victor Valdes", "Valdes"], "A La Masia graduate, not Casillas."),
  ], [
    q("Which coach signed Pique for Manchester United in 2004?", ["Alex Ferguson", "Sir Alex Ferguson", "Ferguson"], "The long-serving Scottish manager."),
    q("Which competition did Pique win with Spain in 2012?", ["European Championship", "Euros", "Euro 2012", "UEFA European Championship"], "Spain retained their continental crown."),
    q("Which Italian club did Pique beat in Barcelona's 2015 Champions League final?", ["Juventus", "Juve"], "The match was in Berlin."),
  ], [
    q("Which club conceded Pique's first Champions League goal for Manchester United in 2007?", ["Dynamo Kyiv", "Dynamo Kiev", "Dynamo"], "The Ukrainian visitors lost 4-0 at Old Trafford."),
    q("Which manager coached Pique during his Real Zaragoza loan?", ["Victor Fernandez", "Fernandez"], "A Spanish coach who had won the 1995 Cup Winners' Cup with Zaragoza."),
    q("Which Barcelona teammate supplied the assist for Pique's goal in the 6-2 Clasico win in May 2009?", ["Samuel Eto'o", "Samuel Eto o", "Etoo", "Eto'o"], "The Cameroonian striker set up the sixth goal."),
    q("Which country did Pique score against in Spain's opening Euro 2016 match?", ["Czech Republic", "Czechia"], "His late header secured a 1-0 win."),
    q("Which Czech club faced Pique in his final Champions League appearance in November 2022?", ["Viktoria Plzen", "Viktoria Pilsen", "Plzen"], "Its city is famous for pilsner beer."),
    q("Which Spanish club did Pique face in his final playing appearance at Camp Nou in November 2022?", ["Almeria", "UD Almeria"], "Barcelona won 2-0 against the Andalusians."),
  ]),
  silva: bank([E, M, E, E, M, M], [
    q("In which Brazilian city was Thiago Silva born?", ["Rio de Janeiro", "Rio"], "The city of the Maracana."),
    q("Which club did Thiago Silva captain in the 2020 Champions League final?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "They lost 1-0 in Lisbon."),
    q("Which goalkeeper played behind Silva for Brazil at the 2018 World Cup?", ["Alisson", "Alisson Becker"], "He moved from Roma to Liverpool that summer."),
  ], [
    q("Which Brazilian club sold Silva to Milan in 2009?", ["Fluminense", "Fluminense FC", "Flu"], "He had reached the 2008 Libertadores final there."),
    q("Who coached Milan when Silva won Serie A in 2010/11?", ["Massimiliano Allegri", "Allegri", "Max Allegri"], "He later won multiple titles with Juventus."),
    q("Which club did Silva face when Chelsea won the 2021 Champions League final?", ["Manchester City", "Man City"], "The final was played in Porto."),
  ], [
    q("Which Ecuadorian team beat Silva's Fluminense in the 2008 Libertadores final?", ["LDU Quito", "Liga de Quito", "Liga Deportiva Universitaria", "LDU"], "They won the shootout at the Maracana."),
    q("Which Russian club signed Silva in 2005 before his return to Brazil?", ["Dynamo Moscow", "Dinamo Moscow", "Dynamo Moskva"], "He did not make a competitive first-team appearance there."),
    q("Which Chelsea defender replaced the injured Silva during the 2021 Champions League final?", ["Andreas Christensen", "Christensen"], "A Danish international who later joined Barcelona."),
    q("Which country did Silva score against in Brazil's 2018 World Cup group stage?", ["Serbia"], "His header sealed a 2-0 win in Moscow."),
    q("Which Colombian full-back fouled Neymar in the 2014 quarter-final Silva also scored in?", ["Juan Camilo Zuniga", "Camilo Zuniga", "Zuniga"], "He played for Napoli."),
    q("Which Brazil coach appointed Silva captain before the 2013 Confederations Cup?", ["Luiz Felipe Scolari", "Scolari", "Felipao"], "He had previously won the 2002 World Cup."),
  ]),
  marquinhos: bank([E, M, E, E, M, M], [
    q("In which Brazilian city was Marquinhos born?", ["Sao Paulo", "São Paulo"], "Brazil's largest city."),
    q("Which goalkeeper was Marquinhos's PSG teammate in the 2020 Champions League final?", ["Keylor Navas", "Navas"], "The Costa Rican joined from Real Madrid."),
    q("Which international youth tournament did Marquinhos win with Brazil at Rio 2016?", ["Olympics", "Olympic Games", "Olympic football", "Olympic gold"], "Neymar scored the decisive shootout penalty."),
  ], [
    q("Which defender did Marquinhos succeed as PSG captain in 2020?", ["Thiago Silva", "Silva"], "His compatriot moved to Chelsea."),
    q("Which Italian side did Marquinhos face in the 2013 Coppa Italia final with Roma?", ["Lazio", "SS Lazio"], "A Rome derby decided by Senad Lulic."),
    q("Which country beat Marquinhos's Brazil on penalties in the 2022 World Cup quarter-final?", ["Croatia", "Hrvatska"], "The 2018 runners-up."),
  ], [
    q("Against which Italian club did Marquinhos equalise late in PSG's 2020 Champions League quarter-final?", ["Atalanta", "Atalanta BC"], "The Bergamo side led until the 90th minute."),
    q("Which PSG teammate scored the winner after Marquinhos's equaliser against Atalanta in 2020?", ["Eric Maxim Choupo-Moting", "Choupo-Moting", "Choupo Moting"], "A Cameroon striker later signed by Bayern."),
    q("Which German club did Marquinhos score against in the 2020 Champions League semi-final?", ["RB Leipzig", "Leipzig"], "PSG won 3-0 in Lisbon."),
    q("Which German forward scored against Marquinhos's Brazil in the Rio 2016 Olympic final?", ["Max Meyer", "Meyer"], "A Schalke academy midfielder."),
    q("Which Roma coach was in charge when Marquinhos arrived in 2012?", ["Zdenek Zeman", "Zeman"], "The Czech-born coach was renowned for attacking football."),
    q("Which country did Marquinhos score against in Brazil's opening match of the 2021 Copa America?", ["Venezuela"], "Brazil won 3-0 in Brasilia."),
  ]),
  hummels: bank([E, E, M, E, M, M], [
    q("Which Italian club signed Hummels in September 2024?", ["Roma", "AS Roma"], "The Giallorossi."),
    q("Which Bayern youth academy did Hummels join as a child?", ["Bayern Munich", "Bayern", "FC Bayern"], "His father also coached in their youth setup."),
    q("Which Polish striker played alongside Hummels in Dortmund's 2012 double-winning team?", ["Robert Lewandowski", "Lewandowski"], "He later joined Bayern and Barcelona."),
  ], [
    q("Which club did Hummels face in the 2013 Champions League final?", ["Bayern Munich", "Bayern"], "The all-German final was at Wembley."),
    q("Which position did Hummels occupy alongside Jerome Boateng in the 2014 World Cup final?", ["Centre back", "Center back", "Central defender", "CB"], "The heart of the defence."),
    q("Who coached Dortmund when Hummels reached the 2024 Champions League final?", ["Edin Terzic", "Terzic"], "A German-Croatian coach born in Menden."),
  ], [
    q("Which French defender did Hummels outjump to score in the 2014 World Cup quarter-final?", ["Raphael Varane", "Varane"], "The Real Madrid centre-back was only 21."),
    q("Which German midfielder delivered the free-kick for Hummels's winner against France in 2014?", ["Toni Kroos", "Kroos"], "He joined Real Madrid that summer."),
    q("Which PSG goalkeeper conceded Hummels's winning header in the 2024 Champions League semi-final second leg?", ["Gianluigi Donnarumma", "Donnarumma"], "Italy's Euro 2020 final goalkeeper."),
    q("Which German midfielder supplied the corner for Hummels's 2024 semi-final goal in Paris?", ["Julian Brandt", "Brandt"], "He had joined Dortmund from Leverkusen."),
    q("Which German club did Hummels face on his Bundesliga debut for Bayern in May 2007?", ["Mainz", "Mainz 05", "FSV Mainz 05"], "Bayern won 5-2 on the final day."),
    q("Which country did Hummels score against in Germany's opening match of the 2014 World Cup?", ["Portugal"], "Germany won 4-0 in Salvador."),
  ]),
  boateng: bank([E, E, M, E, M, M], [
    q("In which German city was Jerome Boateng born?", ["Berlin"], "Germany's capital."),
    q("Which German club sold Boateng to Manchester City in 2010?", ["Hamburg", "Hamburger SV", "HSV"], "The northern club play at the Volksparkstadion."),
    q("Which goalkeeper played behind Boateng in Bayern's 2020 Champions League win?", ["Manuel Neuer", "Neuer"], "A fellow 2014 World Cup winner."),
  ], [
    q("Which Berlin club gave Boateng his Bundesliga debut?", ["Hertha Berlin", "Hertha", "Hertha BSC"], "They play at the Olympiastadion."),
    q("Which Italian club signed Boateng in February 2024?", ["Salernitana", "US Salernitana"], "The Campania club in maroon."),
    q("Which Bayern coach led Boateng to the 2013 treble?", ["Jupp Heynckes", "Heynckes"], "It was his third spell at Bayern."),
  ], [
    q("Against which country did Boateng make his senior Germany debut in October 2009?", ["Russia"], "He was sent off in the World Cup qualifier in Moscow."),
    q("Which Bayern centre-back replaced the injured Boateng in the 2020 Champions League final?", ["Niklas Sule", "Sule", "Niklas Suele"], "He had joined Bayern from Hoffenheim."),
    q("Which country did Boateng score against in Germany's Euro 2016 last-16 win?", ["Slovakia"], "Germany won 3-0 in Lille."),
    q("Which Austrian club signed Boateng in 2024 after his Salernitana spell?", ["LASK", "LASK Linz", "Linzer ASK"], "They are based in Linz."),
    q("Which winger scored Bayern's winner with Boateng in defence in the 2013 Champions League final?", ["Arjen Robben", "Robben"], "The Dutchman scored in the 89th minute at Wembley."),
    q("Which Hamburg coach managed Boateng in the 2009 UEFA Cup semi-final run?", ["Martin Jol", "Jol"], "A Dutch former Tottenham manager."),
  ]),
  pepe: bank([E, E, M, E, M, M], [
    q("In which country was Portugal international Pepe born?", ["Brazil", "Brasil"], "He was born in Maceio."),
    q("Which club did Pepe rejoin in January 2019 after leaving Besiktas?", ["Porto", "FC Porto"], "He returned to the Dragons."),
    q("Which Portugal striker scored the extra-time winner alongside Pepe in the Euro 2016 final?", ["Eder", "Eder Lopes"], "He had played for Swansea."),
  ], [
    q("Which Portuguese island club first brought Pepe to European football?", ["Maritimo", "CS Maritimo"], "They are based in Funchal on Madeira."),
    q("Who coached Real Madrid when Pepe joined in 2007?", ["Bernd Schuster", "Schuster"], "A German former Barcelona midfielder."),
    q("Which position did Pepe play in Portugal's 2016 European title-winning defence?", ["Centre back", "Center back", "Central defender", "CB"], "Alongside Jose Fonte in the final."),
  ], [
    q("Which Southampton defender partnered Pepe in the Euro 2016 final?", ["Jose Fonte", "Fonte"], "He later joined West Ham and Lille."),
    q("Which German forward was headbutted by Pepe at the 2014 World Cup?", ["Thomas Muller", "Muller", "Thomas Mueller", "Mueller"], "He scored a hat-trick in that 4-0 game."),
    q("Against which country did Pepe open Portugal's scoring in the Euro 2012 group stage?", ["Denmark"], "Portugal won 3-2 in Lviv."),
    q("Which Belgian club conceded a goal to 40-year-old Pepe in the Champions League in November 2023?", ["Royal Antwerp", "Antwerp"], "The visitors had won the 2022/23 Belgian title."),
    q("Which coach led Porto when Pepe won his first Portuguese league title in 2005/06?", ["Co Adriaanse", "Adriaanse"], "A Dutch coach who had managed AZ."),
    q("Which Swiss goalkeeper conceded Pepe's header in Portugal's 6-1 World Cup win in 2022?", ["Yann Sommer", "Sommer"], "He later played for Bayern and Inter."),
  ]),
  lugano: bank([E, E, M, E, M, M], [
    q("Which Brazilian club did Lugano represent before Fenerbahce?", ["Sao Paulo", "Sao Paulo FC", "SPFC"], "The Tricolor won the 2005 world club title."),
    q("Which position did Lugano play for Uruguay at the 2010 World Cup?", ["Centre back", "Center back", "Central defender", "CB"], "He captained from the middle of defence."),
    q("Which Uruguay forward won the 2010 World Cup Golden Ball alongside Lugano?", ["Diego Forlan", "Forlan"], "An Atletico Madrid striker at the time."),
  ], [
    q("Which coach led Lugano's Uruguay to the 2011 Copa America title?", ["Oscar Tabarez", "Tabarez", "Oscar Washington Tabarez"], "Nicknamed El Maestro."),
    q("Which English club did Lugano beat with Sao Paulo in the 2005 Club World Championship final?", ["Liverpool", "Liverpool FC", "LFC"], "Rafael Benitez managed them."),
    q("Which Uruguayan club did Lugano join in 1999 before his Sao Paulo move?", ["Nacional", "Club Nacional de Football"], "Penarol's great Montevideo rivals."),
  ], [
    q("Which Swedish club signed Lugano in March 2015?", ["BK Hacken", "Hacken"], "A Gothenburg club in yellow and black."),
    q("Which Paraguayan club did Lugano join later in 2015?", ["Cerro Porteno", "Cerro Porteño"], "The Asuncion club nicknamed El Ciclon."),
    q("Which Uruguayan club took Lugano on loan from Nacional in 2001?", ["Plaza Colonia", "Plaza"], "A club from Colonia del Sacramento."),
    q("Which midfielder scored Sao Paulo's winner with Lugano in the 2005 world club final?", ["Mineiro", "Carlos Luciano da Silva"], "A Brazilian who later had a short Chelsea spell."),
    q("Which coach led Sao Paulo in Lugano's 2005 world club final?", ["Paulo Autuori", "Autuori"], "He had won the Libertadores with Cruzeiro in 1997."),
    q("Against which club did Lugano score his only Premier League goal in January 2014?", ["Everton", "Everton FC"], "His header earned West Brom a 1-1 draw."),
  ]),
  chiellini: bank([E, E, M, E, M, M], [
    q("Which Italian club launched Chiellini's senior career in 2000?", ["Livorno", "AS Livorno"], "A Tuscan port city's club in dark red."),
    q("Which city hosted Chiellini's Euro 2020 final victory?", ["London"], "Wembley staged the final."),
    q("Which Portuguese superstar became Chiellini's Juventus teammate in 2018?", ["Cristiano Ronaldo", "Ronaldo", "CR7"], "He joined from Real Madrid."),
  ], [
    q("Which Serie A club did Chiellini play for in 2004/05 before Juventus?", ["Fiorentina", "ACF Fiorentina"], "The Florence club in purple."),
    q("Which England player did Chiellini pull back by the collar in the Euro 2020 final?", ["Bukayo Saka", "Saka"], "Arsenal's young winger."),
    q("Which coach led Juventus to their unbeaten 2011/12 league title with Chiellini?", ["Antonio Conte", "Conte"], "A former Juventus captain."),
  ], [
    q("Which Uruguay striker bit Chiellini at the 2014 World Cup?", ["Luis Suarez", "Suarez"], "He moved from Liverpool to Barcelona that summer."),
    q("Which club did Chiellini's LAFC beat in the 2022 MLS Cup final?", ["Philadelphia Union", "Philadelphia", "Union"], "The final ended 3-3 before penalties."),
    q("Which former Real Madrid winger scored LAFC's late extra-time equaliser in that 2022 final?", ["Gareth Bale", "Bale"], "A Welsh international."),
    q("Which Italian international replaced injured Chiellini in the Euro 2012 final?", ["Federico Balzaretti", "Balzaretti"], "A left-back then playing for Palermo."),
    q("Which country did Chiellini face in the 2022 Finalissima at Wembley?", ["Argentina"], "Messi captained the South American champions."),
    q("Which manager coached Chiellini's LAFC to the 2022 MLS Cup?", ["Steve Cherundolo", "Cherundolo"], "A former United States right-back."),
  ]),
  alba: bank([E, E, M, E, M, M], [
    q("Which position did Alba occupy in Barcelona's 2015 Champions League final?", ["Left back", "Left-back", "LB"], "He patrolled the opposite flank from Dani Alves."),
    q("Which Argentine forward reunited with Alba at Inter Miami in 2023?", ["Lionel Messi", "Messi", "Leo Messi"], "They had combined frequently at Barcelona."),
    q("Who coached Barcelona when Alba won the 2014/15 treble?", ["Luis Enrique", "Luis Enrique Martinez"], "A former Spain midfielder and later national-team coach."),
  ], [
    q("Which Catalan club did Alba join after leaving Barcelona's youth system in 2005?", ["Cornella", "UE Cornella"], "A club from the same municipality as Espanyol's stadium."),
    q("Which Spain coach gave Alba his senior international debut in 2011?", ["Vicente del Bosque", "Del Bosque"], "He had won the 2010 World Cup."),
    q("Which Uruguayan striker joined Alba and Messi in Miami in 2024?", ["Luis Suarez", "Suarez"], "The third member of Barcelona's old MSN attack."),
  ], [
    q("Which club took Alba on loan from Valencia for the 2008/09 season?", ["Gimnastic", "Gimnastic de Tarragona", "Nastic"], "A Catalan club based in Tarragona."),
    q("Which club conceded Alba's late winner in a 2-1 Champions League match in October 2012?", ["Celtic", "Celtic FC"], "The Scottish visitors were beaten deep into added time."),
    q("Which Barcelona teammate crossed for Alba's 2012 stoppage-time winner against Celtic?", ["Adriano", "Adriano Correia"], "A Brazilian who could play on either defensive flank."),
    q("Which country did Alba score twice against in Spain's last group match at the 2013 Confederations Cup?", ["Nigeria"], "Spain won 3-0 in Fortaleza."),
    q("Which Real Madrid defender started at right-back opposite Alba in Spain's 2013 Confederations Cup final?", ["Alvaro Arbeloa", "Arbeloa"], "He had previously played for Liverpool."),
    q("Which rival did Alba score a volley against in Barcelona's 4-2 league win in February 2022?", ["Atletico Madrid", "Atletico", "Atleti"], "Diego Simeone's side had opened the scoring."),
  ]),
  evra: bank([E, E, M, E, M, M], [
    q("In which Senegalese city was Evra born?", ["Dakar"], "The country's capital."),
    q("Which position did Evra play in Manchester United's 2008 European final?", ["Left back", "Left-back", "LB"], "Wes Brown was on the other side."),
    q("Which French club did Evra join from Juventus in January 2017?", ["Marseille", "Olympique de Marseille", "OM"], "The Stade Velodrome is their home."),
  ], [
    q("Which club beat Evra's Monaco in the 2004 Champions League final?", ["Porto", "FC Porto"], "Jose Mourinho's side won 3-0."),
    q("Which Italian club gave Evra his first senior football in 1998?", ["Marsala", "SC Marsala", "Marsala 1912"], "A Sicilian club named after a fortified wine."),
    q("Which goalkeeper was Evra's France captain at Euro 2016?", ["Hugo Lloris", "Lloris"], "Tottenham's goalkeeper at the time."),
  ], [
    q("Which Italian second-division club did Evra represent in 1999/2000?", ["Monza", "AC Monza"], "The town is also famous for its Formula One circuit."),
    q("Which French club did Evra leave for Monaco in 2002?", ["Nice", "OGC Nice"], "The Riviera club in red and black."),
    q("Which Manchester derby opponent did Evra face on his United debut in January 2006?", ["Manchester City", "Man City"], "United lost 3-1 at the City of Manchester Stadium."),
    q("Which German club conceded Evra's long-range goal in the 2014 Champions League quarter-final?", ["Bayern Munich", "Bayern"], "United lost the second leg 3-1 despite taking the lead."),
    q("Which Monaco coach led Evra to the 2004 Champions League final?", ["Didier Deschamps", "Deschamps"], "He later coached Evra with France."),
    q("Which Juventus teammate scored in their 2015 Champions League final defeat?", ["Alvaro Morata", "Morata"], "The Spanish striker temporarily made it 1-1."),
  ]),
  alaba: bank([E, E, M, E, M, M], [
    q("In which Austrian city was Alaba born?", ["Vienna", "Wien"], "The national capital."),
    q("Which shirt number did Alaba wear at Bayern during their 2019/20 treble season?", ["27", "twenty seven", "twenty-seven"], "Three cubed."),
    q("Which French striker was Alaba's Real Madrid teammate and won the 2022 Ballon d'Or?", ["Karim Benzema", "Benzema"], "Madrid's number nine."),
  ], [
    q("Which Austrian club did Alaba leave to join Bayern's academy in 2008?", ["Austria Vienna", "Austria Wien", "FK Austria Wien"], "The purple half of the capital's rivalry."),
    q("Who coached Real Madrid when Alaba won the 2022 Champions League?", ["Carlo Ancelotti", "Ancelotti"], "An Italian in his second spell at the club."),
    q("Which English club did Alaba beat in the 2022 Champions League final?", ["Liverpool", "Liverpool FC", "LFC"], "The final was at the Stade de France."),
  ], [
    q("Which club conceded Alaba's first Bundesliga goal for Hoffenheim in January 2011?", ["St Pauli", "St. Pauli", "FC St Pauli"], "A Hamburg club associated with the skull-and-crossbones symbol."),
    q("Which Italian club conceded Alaba's goal after 25 seconds in an April 2013 Champions League quarter-final?", ["Juventus", "Juve"], "Bayern won the first leg 2-0."),
    q("Against which country did Alaba make his senior Austria debut in October 2009?", ["France"], "The World Cup qualifier was in Saint-Denis."),
    q("Which Brazilian midfielder assisted Alaba's opener against Eintracht in the 2022 UEFA Super Cup?", ["Casemiro"], "He left for Manchester United later that month."),
    q("Which Spanish club conceded Alaba's first Real Madrid goal in October 2021?", ["Barcelona", "Barca"], "He scored in his first Clasico."),
    q("Which Austria coach led Alaba's team to the Euro 2020 last 16?", ["Franco Foda", "Foda"], "A German who previously managed Sturm Graz."),
  ]),
  filipe: bank([E, E, M, M, M, E], [
    q("Which position did Filipe Luis play in Atletico Madrid's 2014 league-winning side?", ["Left back", "Left-back", "LB"], "Juanfran played on the opposite flank."),
    q("Which European club did Filipe Luis rejoin after leaving Chelsea in 2015?", ["Atletico Madrid", "Atletico", "Atleti"], "He returned to Diego Simeone's team."),
    q("Which Chelsea manager won the 2014/15 Premier League with Filipe Luis?", ["Jose Mourinho", "Mourinho"], "A Portuguese coach in his second Chelsea spell."),
  ], [
    q("Which Brazilian club gave Filipe Luis his senior debut?", ["Figueirense", "Figueirense FC"], "A Florianopolis club in black and white."),
    q("Which Dutch club took Filipe Luis on loan before his spell with Real Madrid Castilla?", ["Ajax", "AFC Ajax"], "The Amsterdam club."),
    q("Which European trophy did Filipe Luis win with Atletico in 2012 and 2018?", ["Europa League", "UEFA Europa League"], "The successor to the UEFA Cup."),
  ], [
    q("Which Argentine club did Filipe Luis's Flamengo beat in the 2019 Libertadores final?", ["River Plate", "River"], "They led until Gabriel Barbosa's late double."),
    q("Who coached Flamengo when Filipe Luis won the 2019 Libertadores?", ["Jorge Jesus", "Jesus"], "The Portuguese coach had previously managed Benfica."),
    q("Which French club did Filipe Luis beat in the 2018 Europa League final?", ["Marseille", "Olympique de Marseille", "OM"], "Antoine Griezmann scored twice in Lyon."),
    q("Which Basque club did Filipe Luis beat in the 2012 Europa League final?", ["Athletic Bilbao", "Athletic Club", "Athletic"], "Radamel Falcao scored twice in Bucharest."),
    q("Which Palmeiras substitute scored the extra-time winner against Filipe Luis's Flamengo in the 2021 Libertadores final?", ["Deyverson"], "The striker punished a defensive error."),
    q("Which Atletico teammate scored their goal in the 2014 Champions League final?", ["Diego Godin", "Godin"], "The Uruguayan centre-back headed in the opener."),
  ]),
  telles: bank([E, E, M, M, M, E], [
    q("Which position did Telles play for Brazil at the 2022 World Cup?", ["Left back", "Left-back", "LB"], "He competed with Alex Sandro."),
    q("Which Portuguese club signed Telles from Galatasaray in 2016?", ["Porto", "FC Porto"], "The Dragons."),
    q("Which Brazilian club did Telles join after leaving Al Nassr in 2024?", ["Botafogo", "Botafogo FR"], "A Rio club with a lone white star on its badge."),
  ], [
    q("Which Brazilian club launched Telles's senior career in 2011?", ["Juventude", "EC Juventude"], "The Caxias do Sul club in green and white."),
    q("Which Brazilian club signed Telles from Juventude in 2013?", ["Gremio", "Gremio FBPA"], "The Porto Alegre club in blue, black and white."),
    q("Which coach managed Manchester United when Telles arrived in 2020?", ["Ole Gunnar Solskjaer", "Solskjaer"], "A Norwegian former United striker."),
  ], [
    q("Which club did Telles's Sevilla beat on penalties in the 2023 Europa League final?", ["Roma", "AS Roma"], "Jose Mourinho managed the opponents."),
    q("Which club did Telles score his only Manchester United competitive goal against in September 2021?", ["Villarreal", "Villarreal CF"], "His volley helped United win 2-1."),
    q("Which coach led Porto when Telles won the 2017/18 Portuguese league?", ["Sergio Conceicao", "Conceicao"], "A former Portugal winger."),
    q("Which rival did Telles beat with Botafogo in the 2024 Libertadores final?", ["Atletico Mineiro", "Atletico MG", "Galo"], "Another Brazilian side, based in Belo Horizonte."),
    q("Which Brazil coach handed Telles his international debut against Panama in March 2019?", ["Tite", "Adenor Bacchi"], "He also selected him for the 2022 World Cup."),
    q("Which striker scored against Telles's Brazil in their 2022 World Cup group defeat?", ["Vincent Aboubakar", "Aboubakar"], "Cameroon's captain scored the only goal."),
  ]),
  lahm: bank([E, E, M, E, M, M], [
    q("In which German city was Lahm born?", ["Munich", "Munchen", "Muenchen"], "The capital of Bavaria."),
    q("Which position did Lahm play in Germany's 2014 World Cup final?", ["Right back", "Right-back", "RB"], "He returned there after starting the tournament in midfield."),
    q("Which Bayern coach used Lahm extensively as a holding midfielder from 2013?", ["Pep Guardiola", "Guardiola", "Josep Guardiola"], "The Catalan arrived after Bayern's treble."),
  ], [
    q("Which country did Lahm score against in Germany's Euro 2008 semi-final?", ["Turkey", "Turkiye"], "His late goal secured a 3-2 win."),
    q("Which national-team captain did Lahm succeed before the 2010 World Cup?", ["Michael Ballack", "Ballack"], "The injured Chelsea midfielder missed the tournament."),
    q("Which Bayern captain did Lahm succeed after his departure in 2011?", ["Mark van Bommel", "Van Bommel"], "The Dutch midfielder moved to Milan."),
  ], [
    q("Which Stuttgart coach gave Lahm his Bundesliga debut in 2003?", ["Felix Magath", "Magath"], "He later coached Lahm at Bayern."),
    q("Which Germany striker scored Stuttgart's second goal against Manchester United with Lahm at left-back in October 2003?", ["Kevin Kuranyi", "Kuranyi"], "He later joined Schalke and Dynamo Moscow."),
    q("Against which country did Lahm make his senior Germany debut in February 2004?", ["Croatia", "Hrvatska"], "Germany won 2-1 in Split."),
    q("Which French club did Lahm face on his Bayern first-team debut in November 2002?", ["Lens", "RC Lens"], "The visitors wore red and yellow."),
    q("Which club did Lahm beat 4-1 on his final professional appearance in May 2017?", ["Freiburg", "SC Freiburg"], "The opponents were from Germany's Black Forest."),
    q("Which Bayern teammate scored their opening goal in Lahm's 2013 Champions League final?", ["Mario Mandzukic", "Mandzukic"], "A Croatian striker who later joined Atletico and Juventus."),
  ]),
  walker: bank([E, E, M, E, M, M], [
    q("In which English city was Walker born?", ["Sheffield"], "The city of the Blades and the Owls."),
    q("Which position did Walker usually play for Manchester City in their 2023 treble season?", ["Right back", "Right-back", "RB"], "He defended the right flank."),
    q("Which Italian club took Walker on loan from Manchester City in January 2025?", ["AC Milan", "Milan"], "The Rossoneri."),
  ], [
    q("Which London club took Walker on loan in 2010 before his Aston Villa spell?", ["Queens Park Rangers", "QPR", "Queens Park"], "They play at Loftus Road."),
    q("Which England manager selected Walker for the 2018 World Cup?", ["Gareth Southgate", "Southgate"], "He used Walker in a back three."),
    q("Which England teammate joined Tottenham from Sheffield United in the same 2009 deal as Walker?", ["Kyle Naughton", "Naughton"], "The two players shared a first name."),
  ], [
    q("Which club did Walker beat with Sheffield United in the 2009 Championship play-off semi-final?", ["Preston North End", "Preston", "PNE"], "They played the second leg at Bramall Lane."),
    q("Which club beat Walker's Sheffield United in the 2009 Championship play-off final?", ["Burnley", "Burnley FC"], "Wade Elliott scored at Wembley."),
    q("Which club did Walker score against on his Aston Villa debut in the 2011 FA Cup?", ["Sheffield United", "Sheffield Utd", "The Blades"], "He scored against his first senior club."),
    q("Which goalkeeper was sent off before Walker went in goal for City against Atalanta in 2019?", ["Claudio Bravo", "Bravo"], "A Chilean who had replaced Ederson at half-time."),
    q("Which Tottenham defender scored England's first goal in Walker's 2018 World Cup semi-final?", ["Kieran Trippier", "Trippier"], "A direct free-kick against Croatia."),
    q("Which Manchester City defender started at right-back instead of Walker in the 2023 Champions League final?", ["Manuel Akanji", "Akanji"], "The Swiss international had joined from Dortmund."),
  ]),
  alves: bank([E, E, M, E, M, M], [
    q("Which position did Alves play in Barcelona's 2009 treble-winning team?", ["Right back", "Right-back", "RB"], "An attacking role down the right defensive flank."),
    q("Which Argentine winger was Alves's long-serving Barcelona teammate?", ["Lionel Messi", "Messi", "Leo Messi"], "Their right-flank combinations became a hallmark."),
    q("Which Brazilian club signed Alves in 2019 after PSG?", ["Sao Paulo", "Sao Paulo FC", "SPFC"], "The Morumbi is their home."),
  ], [
    q("Which English club did Alves's Sevilla beat in the 2006 UEFA Cup final?", ["Middlesbrough", "Boro"], "Sevilla won 4-0 in Eindhoven."),
    q("Which coach led Barcelona during Alves's 2014/15 treble?", ["Luis Enrique", "Luis Enrique Martinez"], "A former Spain midfielder."),
    q("Which national team did Alves face in the 2019 Copa America final?", ["Peru"], "Brazil won 3-1 at the Maracana."),
  ], [
    q("Which suspension kept Alves out of the 2009 Champions League final?", ["Accumulated yellow cards", "Yellow cards", "Yellow card suspension", "Booking accumulation"], "A booking at Stamford Bridge ruled him out."),
    q("Which defender played right-back in Alves's absence in the 2009 Champions League final?", ["Carles Puyol", "Puyol"], "Barcelona's captain shifted from the centre."),
    q("Which goalkeeper conceded Alves's volley in the 2017 Champions League semi-final second leg?", ["Danijel Subasic", "Subasic"], "Monaco's Croatian goalkeeper."),
    q("Which club did Alves's Sevilla beat on penalties in the 2007 UEFA Cup final?", ["Espanyol", "RCD Espanyol"], "Another Spanish club, based in Barcelona."),
    q("Which country did Alves beat with Brazil in the Tokyo Olympics men's final?", ["Spain", "Espana"], "Malcom scored the extra-time winner."),
    q("Which Mexican club signed Alves in 2022?", ["Pumas", "Pumas UNAM", "UNAM", "Club Universidad Nacional"], "A Mexico City university club."),
  ]),
  zanetti: bank([E, E, M, E, M, M], [
    q("In which Argentine city was Zanetti born?", ["Buenos Aires"], "The national capital."),
    q("Which nickname, meaning the Tractor, was commonly used for Zanetti?", ["El Tractor", "Tractor", "Il Trattore"], "A farming vehicle symbolising his relentless running."),
    q("Which Inter goalkeeper was Zanetti's teammate in the 2010 Champions League final?", ["Julio Cesar", "Cesar"], "A Brazilian international."),
  ], [
    q("Which Argentine lower-division club gave Zanetti his senior debut?", ["Talleres", "Talleres de Remedios de Escalada", "Talleres RE"], "The Buenos Aires-area club, not the one in Cordoba."),
    q("Which country conceded Zanetti's goal at the 1998 World Cup?", ["England"], "The last-16 game ended 2-2 before penalties."),
    q("Which competition did Zanetti win with Inter in 1998?", ["UEFA Cup", "Europa League", "UEFA Europa League"], "He scored in the Paris final."),
  ], [
    q("Which Italian rival did Zanetti score against in the 1998 UEFA Cup final?", ["Lazio", "SS Lazio"], "Inter won 3-0 at the Parc des Princes."),
    q("Which Inter president signed Zanetti in 1995?", ["Massimo Moratti", "Moratti"], "He was the son of former president Angelo."),
    q("Which Argentine coach left Zanetti out of the 2010 World Cup squad?", ["Diego Maradona", "Maradona"], "He also omitted Esteban Cambiasso."),
    q("Which Spanish coach managed Zanetti when Inter won the 2010 Club World Cup?", ["Rafael Benitez", "Rafa Benitez", "Benitez"], "He had previously managed Liverpool."),
    q("Which club did Zanetti face on his 1995 Inter competitive debut?", ["Vicenza", "LR Vicenza"], "The opponents were from Italy's Veneto region."),
    q("Which African club did Zanetti's Inter beat in the 2010 Club World Cup final?", ["TP Mazembe", "Mazembe"], "The first African side to reach that final."),
  ]),
  hakimi: bank([E, E, M, E, M, M], [
    q("In which Spanish city was Hakimi born?", ["Madrid"], "He came through Real's academy there."),
    q("Which Morocco captain played in central defence alongside Hakimi at the 2022 World Cup?", ["Romain Saiss", "Saiss"], "A former Wolverhampton Wanderers player."),
    q("Which position did Hakimi play for Morocco at the 2022 World Cup?", ["Right back", "Right-back", "RB"], "The defensive flank opposite Noussair Mazraoui."),
  ], [
    q("Who coached Morocco when Hakimi reached the 2022 World Cup semi-finals?", ["Walid Regragui", "Regragui"], "He took charge shortly before the tournament."),
    q("Which country knocked Hakimi's Morocco out in the 2022 semi-final?", ["France"], "The defending champions won 2-0."),
    q("Which English winger was Hakimi's Dortmund teammate from 2018 to 2020?", ["Jadon Sancho", "Sancho"], "He later moved to Manchester United."),
  ], [
    q("Which Italian club conceded two Hakimi goals for Dortmund in November 2019?", ["Inter", "Inter Milan", "Internazionale"], "Dortmund recovered from 2-0 down to win 3-2."),
    q("Which Czech club conceded Hakimi's first Champions League goals in October 2019?", ["Slavia Prague", "Slavia Praha", "Slavia"], "Dortmund won 2-0 away."),
    q("Which country did Hakimi score a free-kick against in the 2021 Africa Cup of Nations last 16, played in 2022?", ["Malawi"], "Morocco won 2-1 in Yaounde."),
    q("Which club conceded Hakimi's first Real Madrid league goal in December 2017?", ["Sevilla", "Sevilla FC"], "Real won 5-0 at the Bernabeu."),
    q("Which PSG teammate assisted Hakimi's opener in the 2025 Champions League final?", ["Desire Doue", "Doue"], "The young French winger also scored twice."),
    q("Which country did Hakimi beat in the bronze-medal match at the Paris 2024 Olympics?", ["Egypt"], "Morocco won 6-0."),
  ]),
  gonul: bank([E, E, M, E, M, M], [
    q("Which position did Gokhan Gonul play in Besiktas's 2016/17 title-winning team?", ["Right back", "Right-back", "RB"], "He patrolled the right defensive flank."),
    q("Which Istanbul club did Gonul rejoin in 2020?", ["Fenerbahce", "Fenerbahce SK"], "His return followed four seasons with their Black-and-White rivals."),
    q("Which goalkeeper played behind Gonul in Fenerbahce's 2010/11 title squad?", ["Volkan Demirel", "Demirel"], "Not the winger Volkan Sen."),
  ], [
    q("Who coached Besiktas when Gonul won the 2016/17 league title?", ["Senol Gunes", "Gunes"], "He had led Turkey to third place at the 2002 World Cup."),
    q("Who coached Fenerbahce when Gonul won his first Super Lig title in 2010/11?", ["Aykut Kocaman", "Kocaman"], "A former Fenerbahce striker."),
    q("Which country hosted Gonul's only European Championship finals appearance in 2016?", ["France"], "The final took place in Saint-Denis."),
  ], [
    q("Which amateur club did Gonul join as a youth player in 1999?", ["Bursayolspor", "Bursa Yolspor", "Bursa Yol Spor"], "Its name combines Bursa with a word meaning road."),
    q("Which position did Gonul first play as a child before moving outfield?", ["Goalkeeper", "Keeper", "Goalie"], "He initially wore gloves."),
    q("Which town in Samsun province is Gonul's birthplace?", ["Bafra"], "A town in the Kizilirmak delta."),
    q("Against which country did Gonul make his senior Turkey debut in November 2007?", ["Norway", "Norge"], "Turkey won the qualifier 2-1 in Oslo."),
    q("Against which country did Gonul score his only senior international goal in March 2011?", ["Austria", "Osterreich"], "Turkey won the Euro qualifier 2-0 in Istanbul."),
    q("Which Turkish national youth team did Gonul take charge of in 2024?", ["Under 21", "U21", "Turkey U21", "Under-21"], "One age group below the senior side."),
  ]),
  xavi: bank([E, E, M, E, M, M], [
    q("Which Barcelona academy did Xavi graduate from?", ["La Masia", "Masia"], "The name means the farmhouse."),
    q("Which position did Xavi play for Spain at the 2010 World Cup?", ["Midfielder", "Central midfielder", "Midfield", "CM"], "He organised passing in the centre of the pitch."),
    q("Who coached Barcelona when Xavi captained their 2015 treble-winning squad?", ["Luis Enrique", "Luis Enrique Martinez"], "A former Barcelona and Real Madrid midfielder."),
  ], [
    q("Which individual award did Xavi win at Euro 2008?", ["Player of the tournament", "Best player", "UEFA player of the tournament"], "It recognised the best performer across the finals."),
    q("Which defender captained Xavi's Barcelona in their 2009 Champions League final?", ["Carles Puyol", "Puyol"], "The long-haired centre-back played right-back that night."),
    q("Which Barcelona teammate succeeded Xavi as club captain in 2015?", ["Andres Iniesta", "Iniesta"], "The midfielder who scored Spain's 2010 World Cup-winning goal."),
  ], [
    q("Which club conceded Xavi's first senior Barcelona goal in the 1998 Spanish Super Cup?", ["Mallorca", "RCD Mallorca"], "A Balearic Islands club."),
    q("Which club conceded Xavi's first La Liga goal in December 1998?", ["Valladolid", "Real Valladolid"], "Barcelona won 1-0 away."),
    q("Which Dutch coach gave Xavi his Barcelona first-team debut?", ["Louis van Gaal", "Van Gaal"], "He later coached Bayern and Manchester United."),
    q("Which country did Xavi beat with Spain in the 1999 World Youth Championship final?", ["Japan"], "Spain won 4-0 in Lagos."),
    q("Which Barcelona forward scored from Xavi's pass to open the 2011 Champions League final?", ["Pedro", "Pedro Rodriguez"], "He later joined Chelsea and Roma."),
    q("Which Portuguese coach led Al Sadd to the 2018/19 league title with Xavi as a player?", ["Jesualdo Ferreira", "Ferreira"], "A former Porto title-winning coach."),
  ]),
  iniesta: bank([E, E, M, E, M, M], [
    q("Which club developed Iniesta before he entered La Masia?", ["Albacete", "Albacete Balompie"], "A club from Castilla-La Mancha."),
    q("Which Barcelona coach won the 2009 treble with Iniesta?", ["Pep Guardiola", "Guardiola", "Josep Guardiola"], "A former Barcelona holding midfielder."),
    q("Which position did Iniesta usually play at Barcelona?", ["Midfielder", "Central midfielder", "Attacking midfielder", "Midfield", "CM"], "His creativity came from the middle rather than in goal."),
  ], [
    q("Which award did Iniesta win as the best player of Euro 2012?", ["Player of the tournament", "Best player", "UEFA player of the tournament"], "UEFA selected him after Spain's second successive title."),
    q("Which UAE club signed Iniesta after Vissel Kobe in 2023?", ["Emirates Club", "Emirates", "Emirates FC"], "They are based in Ras Al Khaimah."),
    q("Which Dutch goalkeeper conceded Iniesta's winning goal in the 2010 World Cup final?", ["Maarten Stekelenburg", "Stekelenburg"], "He played for Ajax at the time."),
  ], [
    q("Which Belgian club hosted Iniesta's Barcelona first-team debut in October 2002?", ["Club Brugge", "Brugge", "Club Bruges"], "Barcelona won 1-0 in the Champions League."),
    q("Which Barcelona teammate passed to Iniesta before his 2009 goal at Stamford Bridge?", ["Lionel Messi", "Messi", "Leo Messi"], "The Argentine wore number ten."),
    q("Which club conceded Iniesta's first Barcelona league goal in April 2004?", ["Valladolid", "Real Valladolid"], "Barcelona won 3-1 at the Jose Zorrilla."),
    q("Which late Espanyol captain did Iniesta honour on his shirt after the 2010 World Cup-winning goal?", ["Dani Jarque", "Daniel Jarque", "Jarque"], "His friend had died in August 2009."),
    q("Which Barcelona midfielder scored from Iniesta's assist in the 2015 Champions League final?", ["Ivan Rakitic", "Rakitic"], "The Croatian opened the scoring in Berlin."),
    q("Which country did Iniesta beat with Spain in the 2002 European Under-19 final?", ["Germany", "Deutschland"], "Fernando Torres scored the final's only goal."),
  ]),
  pirlo: bank([E, E, M, E, M, M], [
    q("Which Italian club gave Pirlo his senior debut in 1995?", ["Brescia", "Brescia Calcio"], "His hometown-area club in blue and white."),
    q("Which Milan rival did Pirlo represent before joining AC Milan in 2001?", ["Inter", "Inter Milan", "Internazionale"], "The Nerazzurri."),
    q("Which coach won two Champions Leagues with Pirlo at Milan?", ["Carlo Ancelotti", "Ancelotti"], "An Italian former Milan midfielder."),
  ], [
    q("Which Milan teammate formed a midfield partnership with Pirlo and was nicknamed Rino?", ["Gennaro Gattuso", "Gattuso"], "A combative Italian ball-winner."),
    q("Which club did Pirlo beat in the 2007 Champions League final?", ["Liverpool", "Liverpool FC", "LFC"], "Milan gained revenge for Istanbul."),
    q("Which country beat Pirlo's Italy 4-0 in the 2012 European Championship final?", ["Spain", "Espana"], "The reigning world champions won in Kyiv."),
  ], [
    q("Which coach handed Pirlo his Brescia Serie A debut?", ["Mircea Lucescu", "Lucescu"], "A Romanian who later enjoyed a long Shakhtar spell."),
    q("Which southern Italian club took Pirlo on loan in 1999/2000?", ["Reggina", "Reggina Calcio"], "They are based in Reggio Calabria."),
    q("Which Italy defender scored from Pirlo's corner in the 2006 World Cup final?", ["Marco Materazzi", "Materazzi"], "The Inter centre-back equalised with a header."),
    q("Which Italy left-back scored from Pirlo's pass in the 2006 World Cup semi-final?", ["Fabio Grosso", "Grosso"], "His curling shot broke the deadlock in extra time."),
    q("Which country conceded Pirlo's long-range goal in Italy's opening 2006 World Cup match?", ["Ghana"], "Italy won 2-0 in Hanover."),
    q("Which country conceded both Pirlo goals in the 2000 European Under-21 final?", ["Czech Republic", "Czechia"], "Italy won 2-1 in Bratislava."),
  ]),
  kimmich: bank([E, E, M, E, M, M], [
    q("Which national-team captain did Kimmich succeed as Bayern's regular right-back after 2017?", ["Philipp Lahm", "Lahm"], "He retired after captaining Germany to the 2014 World Cup."),
    q("Which Bayern striker was Kimmich's teammate in the 2020 treble?", ["Robert Lewandowski", "Lewandowski"], "A Polish international."),
    q("Which French club did Kimmich beat in the 2020 Champions League final?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "The final was in Lisbon."),
  ], [
    q("Which club developed Kimmich before his 2013 move to Leipzig?", ["Stuttgart", "VfB Stuttgart"], "Their shirts feature a red chest band."),
    q("Which Bayern coach led Kimmich to the 2019/20 treble?", ["Hansi Flick", "Hans-Dieter Flick", "Flick"], "He succeeded Niko Kovac in November 2019."),
    q("Which Germany coach gave Kimmich his senior debut in May 2016?", ["Joachim Low", "Joachim Loew", "Low", "Loew"], "The 2014 World Cup-winning manager."),
  ], [
    q("Which club conceded both Kimmich goals in a 5-0 Champions League win in September 2016?", ["Rostov", "FC Rostov"], "The visitors came from southern Russia."),
    q("Which club did Kimmich score against from Alphonso Davies's assist in the 2020 Champions League quarter-final?", ["Barcelona", "FC Barcelona", "Barca"], "Bayern won the one-legged match 8-2."),
    q("Which Real Madrid goalkeeper conceded Kimmich's opening goal in the 2018 semi-final first leg?", ["Keylor Navas", "Navas"], "The Costa Rican was beaten at his near post."),
    q("Which Bayern midfielder opened the scoring before Kimmich's winner in the 2020 German Super Cup?", ["Corentin Tolisso", "Tolisso"], "The French international had joined from Lyon."),
    q("Which country did Kimmich face on his Germany debut in May 2016?", ["Slovakia"], "Germany lost 3-1 in Augsburg."),
    q("Which Bayern teammate supplied the cross for Kimmich's winning header against Arsenal in April 2024?", ["Raphael Guerreiro", "Guerreiro"], "The Portuguese left-footer joined from Dortmund."),
  ]),
  kroos: bank([E, E, M, E, M, M], [
    q("In which German city was Kroos born?", ["Greifswald"], "A Baltic university city in Mecklenburg-Vorpommern."),
    q("Which midfield partner wore number 10 alongside Kroos at Real Madrid after 2017?", ["Luka Modric", "Modric"], "The Croatian won the 2018 Ballon d'Or."),
    q("Which club did Kroos beat with Real Madrid in the 2024 Champions League final?", ["Borussia Dortmund", "Dortmund", "BVB"], "The Black and Yellows."),
  ], [
    q("Which midfielder completed Real Madrid's famous trio with Kroos and Modric from 2015 to 2022?", ["Casemiro"], "A Brazilian who then joined Manchester United."),
    q("Which country conceded twice to Kroos in the 2014 World Cup semi-final?", ["Brazil", "Brasil"], "The hosts lost 7-1."),
    q("Which Bayern coach won the 2013 treble with Kroos?", ["Jupp Heynckes", "Heynckes"], "He also coached Kroos during his Leverkusen loan."),
  ], [
    q("Which youth club did Kroos leave to join Bayern in 2006?", ["Hansa Rostock", "Hansa", "FC Hansa Rostock"], "A Baltic-coast club with a ship on its badge."),
    q("Which German striker scored twice from Kroos assists on his Bundesliga debut in 2007?", ["Miroslav Klose", "Klose"], "A future all-time World Cup goals record holder."),
    q("Which Serbian club conceded Kroos's first Bayern senior goal in October 2007?", ["Red Star Belgrade", "Crvena Zvezda", "Red Star"], "It came in a UEFA Cup away win."),
    q("Which age-group World Cup awarded Kroos its Golden Ball in 2007?", ["Under 17 World Cup", "U17 World Cup", "FIFA U-17 World Cup", "Under-17"], "The tournament was hosted by South Korea."),
    q("Which German forward laid the ball back for Kroos's late free-kick against Sweden in 2018?", ["Marco Reus", "Reus"], "He had missed the 2014 World Cup through injury."),
    q("Which Real Madrid coach signed Kroos in 2014?", ["Carlo Ancelotti", "Ancelotti"], "He had just won La Decima."),
  ]),
  modric: bank([E, E, M, M, E, M], [
    q("In which Croatian city was Modric born?", ["Zadar"], "An Adriatic-coast city in northern Dalmatia."),
    q("Which Spain captain became Modric's Real Madrid teammate in 2012?", ["Iker Casillas", "Casillas"], "A goalkeeper who later joined Porto."),
    q("Which country beat Modric's Croatia in the 2018 World Cup final?", ["France"], "A national team captained by Hugo Lloris."),
  ], [
    q("Who coached Tottenham when Modric arrived in 2008?", ["Juande Ramos", "Ramos"], "A Spanish coach who had won two UEFA Cups with Sevilla."),
    q("Who coached Croatia during Modric's run to the 2018 World Cup final?", ["Zlatko Dalic", "Dalic"], "He took charge shortly before the qualifying play-offs."),
    q("Which English club conceded Modric's long-range goal in the 2013 Champions League last 16?", ["Manchester United", "Man United", "Man Utd"], "The goal came at Old Trafford."),
  ], [
    q("Which Bosnian club took Modric on loan from Dinamo Zagreb in 2003?", ["Zrinjski Mostar", "Zrinjski", "HSK Zrinjski"], "A Mostar club, not Velez."),
    q("Which Croatian club took Modric on loan in 2004/05?", ["Inter Zapresic", "Inter", "NK Inter Zapresic"], "A club from a town near Zagreb."),
    q("Which country conceded Modric's first senior international goal in August 2006?", ["Italy", "Italia"], "The friendly was played in Livorno."),
    q("Which Argentine goalkeeper conceded Modric's long-range goal at the 2018 World Cup?", ["Willy Caballero", "Caballero"], "He was a Chelsea goalkeeper at the time."),
    q("Which Real Madrid forward scored from Modric's outside-of-the-foot pass against Chelsea in April 2022?", ["Rodrygo", "Rodrygo Goes"], "The Brazilian's volley took the tie to extra time."),
    q("Which goalkeeper saved Modric's extra-time penalty against Denmark at the 2018 World Cup?", ["Kasper Schmeichel", "Schmeichel"], "The Dane played for Leicester."),
  ]),
  kante: bank([E, E, M, E, M, M], [
    q("In which French city was Kante born?", ["Paris"], "The French capital."),
    q("Which London club signed Kante in 2016?", ["Chelsea", "Chelsea FC"], "He won the league in his first season there."),
    q("Which France midfielder played alongside Kante in the 2018 World Cup final?", ["Paul Pogba", "Pogba"], "He scored France's third goal."),
  ], [
    q("Which club gave Kante his senior debut before Caen?", ["Boulogne", "US Boulogne", "Boulogne sur Mer"], "A northern French Channel-port club."),
    q("Who coached Chelsea when Kante won the Premier League in 2016/17?", ["Antonio Conte", "Conte"], "The Italian used a 3-4-3 system."),
    q("Which club did Kante beat in the 2021 Champions League final?", ["Manchester City", "Man City"], "Kai Havertz scored the only goal."),
  ], [
    q("Which amateur club did Kante represent before joining Boulogne in 2010?", ["Suresnes", "JS Suresnes"], "A western suburb of Paris."),
    q("Which country did Kante score against on his first France start in March 2016?", ["Russia"], "France won 4-2 at the Stade de France."),
    q("Which Leicester teammate won the 2015/16 PFA Players' Player of the Year award ahead of Kante?", ["Riyad Mahrez", "Mahrez"], "The Algerian winger later joined Manchester City."),
    q("Which Manchester United goalkeeper conceded Kante's winner in the 2017 FA Cup quarter-final?", ["David de Gea", "De Gea"], "The Spanish keeper was beaten from outside the box."),
    q("Which club conceded Kante's first Chelsea goal in a 4-0 league win in October 2016?", ["Manchester United", "Man United", "Man Utd"], "Jose Mourinho returned to Stamford Bridge as their manager."),
    q("Which award did UEFA give Kante after the 2021 Champions League final?", ["Player of the match", "Man of the match", "Final player of the match"], "It recognised his individual display in Porto."),
  ]),
  verratti: bank([E, E, M, E, M, M], [
    q("In which Italian city was Verratti born?", ["Pescara"], "An Adriatic port in Abruzzo."),
    q("Which position did Verratti usually play for PSG?", ["Midfielder", "Central midfielder", "Midfield", "CM"], "He controlled possession in the centre."),
    q("Which Argentine World Cup winner joined Verratti at PSG in 2021?", ["Lionel Messi", "Messi", "Leo Messi"], "He arrived from Barcelona."),
  ], [
    q("Who coached Pescara when Verratti won Serie B in 2011/12?", ["Zdenek Zeman", "Zeman"], "The Czech-born coach favoured attacking football."),
    q("Which German club beat Verratti's PSG in the 2020 Champions League final?", ["Bayern Munich", "Bayern"], "Kingsley Coman scored the only goal."),
    q("Which Italian forward was Verratti's Pescara teammate on loan from Napoli in 2011/12?", ["Lorenzo Insigne", "Insigne"], "A small winger who later captained Napoli."),
  ], [
    q("Which club conceded Verratti's first PSG goal in September 2014?", ["Barcelona", "FC Barcelona", "Barca"], "His header helped PSG win 3-2 in Europe."),
    q("Which country conceded Verratti's first senior Italy goal in February 2013?", ["Netherlands", "Holland", "The Netherlands"], "His late equaliser made it 1-1 in Amsterdam."),
    q("Which goalkeeper saved Verratti's header immediately before Bonucci equalised in the Euro 2020 final?", ["Jordan Pickford", "Pickford"], "Everton's England goalkeeper."),
    q("Which Italy winger delivered the corner before Verratti's header in the Euro 2020 final?", ["Domenico Berardi", "Berardi"], "A Sassuolo player who had replaced Immobile."),
    q("Which coach led Verratti's Italy to the 2013 European Under-21 final?", ["Devis Mangia", "Mangia"], "A former Palermo manager."),
    q("Which club did Verratti face on his PSG competitive debut in August 2012?", ["Lorient", "FC Lorient"], "The Breton visitors drew 2-2 in Paris."),
  ]),
  matuidi: bank([E, E, M, E, M, M], [
    q("In which French city was Matuidi born?", ["Toulouse"], "The Pink City in southern France."),
    q("Which club gave Matuidi his senior debut in 2004?", ["Troyes", "ESTAC", "ESTAC Troyes"], "A Champagne-region club in blue."),
    q("Which France forward scored a penalty alongside Matuidi in the 2018 World Cup final?", ["Antoine Griezmann", "Griezmann"], "Atletico Madrid's number seven at the time."),
  ], [
    q("Which coach led PSG to the 2012/13 league title with Matuidi?", ["Carlo Ancelotti", "Ancelotti"], "He moved to Real Madrid that summer."),
    q("Who coached Juventus when Matuidi joined in 2017?", ["Massimiliano Allegri", "Allegri", "Max Allegri"], "He had also won Serie A with Milan."),
    q("Which position did Matuidi usually play for Juventus?", ["Midfielder", "Central midfielder", "Midfield", "CM"], "A ball-winning role in the middle."),
  ], [
    q("Which country hosted Matuidi's senior France debut in August 2010?", ["Norway", "Norge"], "The friendly was played in Oslo."),
    q("Which country conceded Matuidi's first senior France goal in March 2014?", ["Netherlands", "Holland", "The Netherlands"], "His acrobatic finish helped France win 2-0."),
    q("Which country did Matuidi score against in France's 5-2 win at the 2014 World Cup?", ["Switzerland"], "France's neighbours had Diego Benaglio in goal."),
    q("Which Italian club conceded Matuidi's first Juventus goal in December 2017?", ["Bologna", "Bologna FC"], "Juventus won 3-0 away."),
    q("Which Uruguayan coach managed Matuidi at Inter Miami in 2020?", ["Diego Alonso", "Alonso"], "He later coached Uruguay at the 2022 World Cup."),
    q("Which Saint-Etienne coach managed Matuidi immediately before his 2011 PSG move?", ["Christophe Galtier", "Galtier"], "He later won Ligue 1 with Lille."),
  ]),
  casemiro: bank([E, E, M, M, E, M], [
    q("Which position did Casemiro usually occupy in Real Madrid's midfield?", ["Defensive midfielder", "Holding midfielder", "DM", "Midfielder"], "He protected the defence behind Kroos and Modric."),
    q("Which Brazilian left-back was Casemiro's Real Madrid teammate from 2013 to 2022?", ["Marcelo", "Marcelo Vieira"], "The curly-haired defender became club captain."),
    q("Which Dutch coach was in charge when Casemiro joined Manchester United?", ["Erik ten Hag", "Ten Hag"], "He had arrived from Ajax."),
  ], [
    q("Which team did Casemiro score against in the 2023 League Cup final?", ["Newcastle United", "Newcastle"], "United won 2-0 at Wembley."),
    q("Which country did Casemiro face in the 2019 Copa America final?", ["Peru"], "Brazil won 3-1 in Rio."),
    q("Which city staged Casemiro's 2017 Champions League final victory?", ["Cardiff"], "The Welsh capital."),
  ], [
    q("Which club did Casemiro face on his Real Madrid league debut in April 2013?", ["Real Betis", "Betis"], "Madrid won 3-1 at the Bernabeu."),
    q("Which coach managed Real Madrid Castilla when Casemiro arrived in 2013?", ["Alberto Toril", "Toril"], "He later coached Real Madrid's women's team."),
    q("Which coach managed Porto during Casemiro's 2014/15 loan?", ["Julen Lopetegui", "Lopetegui"], "He later briefly coached Spain and Real Madrid."),
    q("Which Swiss club conceded Casemiro's free-kick in a 2015 Champions League last-16 second leg?", ["Basel", "FC Basel", "Basle"], "Porto won 4-0 at the Dragao."),
    q("Which country conceded Casemiro's winner in Brazil's second match at the 2022 World Cup?", ["Switzerland"], "Brazil won 1-0 at Stadium 974."),
    q("Which Norwegian city hosted Casemiro's 2016 UEFA Super Cup victory?", ["Trondheim"], "The match was played at Rosenborg's Lerkendal stadium."),
  ]),
  vidal: bank([E, M, E, E, M, M], [
    q("Which Chilean club launched Vidal's senior career?", ["Colo-Colo", "Colo Colo", "Colocolo"], "The Santiago club play in white and black."),
    q("Which position did Vidal usually play for Chile?", ["Midfielder", "Central midfielder", "Midfield", "CM"], "A box-to-box role in the middle."),
    q("Which Italian club signed Vidal from Barcelona in 2020?", ["Inter", "Inter Milan", "Internazionale"], "He reunited with Antonio Conte."),
  ], [
    q("Who coached Chile when Vidal won the 2015 Copa America?", ["Jorge Sampaoli", "Sampaoli"], "An Argentine coach who later managed Sevilla."),
    q("Which Brazilian club signed Vidal in 2022?", ["Flamengo", "CR Flamengo"], "A Rio club in red and black."),
    q("Which major European final did Vidal lose with Juventus in 2015?", ["Champions League final", "UEFA Champions League", "Champions League", "UCL"], "Barcelona won 3-1 in Berlin."),
  ], [
    q("Which country did Vidal beat with Chile to finish third at the 2007 Under-20 World Cup?", ["Austria", "Osterreich"], "Chile won the bronze-medal game 1-0."),
    q("Which German club conceded Vidal's first Bundesliga goal in September 2007?", ["Hannover", "Hannover 96"], "Leverkusen won 3-0."),
    q("Which Bolivia goalkeeper conceded Vidal's stoppage-time penalty at the 2016 Copa America?", ["Carlos Lampe", "Lampe"], "The penalty secured Chile's 2-1 group-stage win."),
    q("Which Chile coach led Vidal to the 2016 Copa America title?", ["Juan Antonio Pizzi", "Pizzi"], "A former Spain international striker."),
    q("Which club signed Vidal after his Flamengo spell in July 2023?", ["Athletico Paranaense", "Athletico PR", "Atletico Paranaense"], "The Curitiba club, not Coritiba."),
    q("Which coach led Colo-Colo when Vidal reached the 2006 Copa Sudamericana final?", ["Claudio Borghi", "Borghi"], "An Argentine nicknamed Bichi."),
  ]),
  alex: bank([E, E, M, E, M, M], [
    q("Which Brazilian club gave Alex de Souza his senior debut in 1995?", ["Coritiba", "Coritiba FC"], "A Curitiba club in green and white."),
    q("Which position did Alex de Souza usually play at Fenerbahce?", ["Attacking midfielder", "Playmaker", "Midfielder", "CM"], "He created chances behind the forwards."),
    q("Which continental tournament did Alex captain Brazil to victory in during 2004?", ["Copa America", "Copa América"], "The final against Argentina was decided on penalties."),
  ], [
    q("Which Brazilian club won the 1999 Libertadores with Alex?", ["Palmeiras", "Sociedade Esportiva Palmeiras"], "A Sao Paulo club in green."),
    q("Which coach led Cruzeiro's 2003 triple-crown team featuring Alex?", ["Vanderlei Luxemburgo", "Luxemburgo", "Wanderley Luxemburgo"], "He later coached Real Madrid."),
    q("Which Brazilian club did Alex rejoin after leaving Fenerbahce in 2012?", ["Coritiba", "Coritiba FC"], "His first senior club."),
  ], [
    q("Which Italian club signed Alex in 2000 without fielding him in a competitive first-team match?", ["Parma", "Parma Calcio"], "The club were owned by the Parmalat group."),
    q("Which Colombian club did Alex's Palmeiras beat in the 1999 Libertadores final?", ["Deportivo Cali", "Cali"], "The second leg ended in a shootout in Sao Paulo."),
    q("Which team conceded five goals to Alex in a 6-0 league win in May 2011?", ["Ankaragucu", "MKE Ankaragucu"], "The visitors came from Turkey's capital."),
    q("Which Fenerbahce coach managed Alex in the 2010/11 title season?", ["Aykut Kocaman", "Kocaman"], "A former Fenerbahce striker."),
    q("Which 2007/08 Champions League quarter-final opponent eliminated Alex's Fenerbahce?", ["Chelsea", "Chelsea FC"], "A 2-0 win in London overturned Fenerbahce's first-leg lead."),
    q("Which Argentina goalkeeper faced Alex's Brazil in the 2004 Copa America final shootout?", ["Roberto Abbondanzieri", "Abbondanzieri"], "Boca Juniors' goalkeeper at the time."),
  ]),
  melo: bank([E, E, M, E, M, M], [
    q("Which Brazilian club launched Felipe Melo's senior career in 2001?", ["Flamengo", "CR Flamengo"], "The Rio club in red and black."),
    q("Which position did Melo mainly play for Brazil at the 2010 World Cup?", ["Defensive midfielder", "Holding midfielder", "DM", "Midfielder"], "He partnered Gilberto Silva in front of the defence."),
    q("Which Brazilian club signed Melo from Inter in 2017?", ["Palmeiras", "Sociedade Esportiva Palmeiras"], "A Sao Paulo club in green."),
  ], [
    q("Which club did Melo join in 2022 and win the 2023 Libertadores with?", ["Fluminense", "Fluminense FC", "Flu"], "A Rio club nicknamed the Tricolor."),
    q("Who coached Brazil when Melo won the 2009 Confederations Cup?", ["Dunga", "Carlos Caetano Bledorn Verri"], "Brazil's 1994 World Cup-winning captain."),
    q("Which Spanish club did Melo join first when moving to Europe in 2005?", ["Mallorca", "RCD Mallorca"], "A Balearic Islands club."),
  ], [
    q("Which Galatasaray opponent had a late penalty saved by emergency goalkeeper Melo in November 2012?", ["Elazigspor", "Elazig"], "Muslera had been sent off with no substitutions left."),
    q("Which Spanish club sold Melo to Fiorentina in 2008?", ["Almeria", "UD Almeria"], "He had played their debut La Liga season."),
    q("Which Brazilian club did Melo leave immediately before joining Mallorca?", ["Gremio", "Gremio FBPA"], "The Porto Alegre side had been relegated in 2004."),
    q("Which coach managed Melo at Almeria in 2007/08?", ["Unai Emery", "Emery"], "He later won multiple Europa Leagues with Sevilla."),
    q("Which Argentine club did Melo's Fluminense beat in the 2023 Libertadores final?", ["Boca Juniors", "Boca"], "John Kennedy scored the extra-time winner."),
    q("Which opponent conceded Melo's first Racing Santander goal in December 2005?", ["Real Madrid", "Madrid"], "Racing won 2-1 at the Bernabeu."),
  ]),
  sneijder: bank([E, E, M, E, M, M], [
    q("Which Dutch club developed Sneijder and gave him his senior debut?", ["Ajax", "AFC Ajax"], "The Amsterdam club."),
    q("In which Dutch city was Sneijder born?", ["Utrecht"], "A central city with a famous Dom Tower."),
    q("Which coach led Inter to the 2010 treble with Sneijder?", ["Jose Mourinho", "Mourinho"], "The Portuguese Special One."),
  ], [
    q("Which French club did Sneijder join after Galatasaray in 2017?", ["Nice", "OGC Nice"], "The Riviera club in red and black."),
    q("Which coach led the Netherlands when Sneijder reached the 2010 World Cup final?", ["Bert van Marwijk", "Van Marwijk"], "He had won the UEFA Cup with Feyenoord."),
    q("Which Qatari club did Sneijder join in January 2018?", ["Al Gharafa", "Al-Gharafa"], "A Doha club nicknamed the Cheetahs."),
  ], [
    q("Which goalkeeper was beaten by Sneijder's long-range goal against Japan at the 2010 World Cup?", ["Eiji Kawashima", "Kawashima"], "The shot gave the Netherlands a 1-0 win."),
    q("Which Uruguayan goalkeeper conceded Sneijder's free-kick for Real Madrid against Villarreal in September 2007?", ["Sebastian Viera", "Viera"], "Madrid won 5-0 at El Madrigal."),
    q("Which Inter striker scored from Sneijder's through ball for the opener in the 2010 Champions League final?", ["Diego Milito", "Milito"], "The Argentine scored both goals in Madrid."),
    q("Which club conceded Sneijder's late winner that put Galatasaray into the 2013/14 Champions League last 16?", ["Juventus", "Juve"], "The snow-affected game was completed the following day."),
    q("Which country conceded Sneijder's late equaliser in the 2014 World Cup last 16?", ["Mexico"], "Huntelaar then scored the winning penalty."),
    q("Which Ajax coach gave Sneijder his senior debut in December 2002?", ["Ronald Koeman", "Koeman"], "A former Netherlands defender who later coached Barcelona."),
  ]),
  ronaldo: bank([E, E, M, E, M, M], [
    q("In which Madeiran city was Cristiano Ronaldo born?", ["Funchal"], "The island's capital."),
    q("Which Saudi club signed Ronaldo at the end of 2022?", ["Al Nassr", "Al-Nassr", "Al Nassr FC"], "The Riyadh club in yellow and blue."),
    q("In which year did Ronaldo win his first Ballon d'Or?", ["2008"], "He had just won the league and Champions League with United."),
  ], [
    q("Which English club did Ronaldo face in his first Champions League final in 2008?", ["Chelsea", "Chelsea FC"], "The final went to penalties in Moscow."),
    q("Which Portugal striker scored the winner after Ronaldo went off injured in the Euro 2016 final?", ["Eder", "Eder Lopes"], "He struck in extra time from outside the area."),
    q("Who coached Real Madrid when Ronaldo arrived in 2009?", ["Manuel Pellegrini", "Pellegrini"], "A Chilean who later won the Premier League with City."),
  ], [
    q("Which club conceded Ronaldo's first Manchester United goal in November 2003?", ["Portsmouth", "Pompey"], "He scored a free-kick at Old Trafford."),
    q("Which club did Ronaldo face on his Manchester United league debut in August 2003?", ["Bolton", "Bolton Wanderers"], "He came off the bench in a 4-0 home win."),
    q("Which Dutch club conceded Ronaldo's first Champions League hat-trick in October 2012?", ["Ajax", "AFC Ajax"], "Real Madrid won 4-1 in Amsterdam."),
    q("Which United defender crossed for Ronaldo's header in the 2008 Champions League final?", ["Wes Brown", "Brown"], "A United academy graduate playing right-back."),
    q("Which Atletico goalkeeper faced Ronaldo's decisive penalty in the 2016 European final shootout?", ["Jan Oblak", "Oblak"], "A Slovenian international."),
    q("Which country did Ronaldo face on his senior Portugal debut in August 2003?", ["Kazakhstan"], "The friendly was played in Chaves."),
  ]),
  messi: bank([E, E, M, E, M, M], [
    q("In which Argentine city was Messi born?", ["Rosario"], "Also the birthplace of Angel Di Maria."),
    q("Which Argentine club did Messi play for as a child before Barcelona?", ["Newell's Old Boys", "Newells Old Boys", "Newells", "Newell's"], "A Rosario club in red and black."),
    q("Which American club did Messi join in 2023?", ["Inter Miami", "Inter Miami CF", "Miami"], "David Beckham co-owns the Florida club."),
  ], [
    q("In which year did Messi win his first Ballon d'Or?", ["2009"], "Barcelona had just completed their first treble."),
    q("Which goalkeeper conceded Messi's header in the 2009 Champions League final?", ["Edwin van der Sar", "Van der Sar"], "Manchester United's Dutch goalkeeper."),
    q("Which Argentina teammate scored the winner in Messi's 2021 Copa America final?", ["Angel Di Maria", "Di Maria"], "The winger chipped Ederson."),
  ], [
    q("Which club conceded Messi's first La Liga goal in May 2005?", ["Albacete", "Albacete Balompie"], "The match was played at Camp Nou."),
    q("Which Barcelona teammate assisted Messi's first La Liga goal?", ["Ronaldinho", "Ronaldinho Gaucho"], "The Brazilian chipped the ball into his path."),
    q("Which city rival did Messi face on his competitive Barcelona debut in October 2004?", ["Espanyol", "RCD Espanyol"], "He replaced Deco at Montjuic."),
    q("Which country did Messi beat in the 2005 World Youth Championship final?", ["Nigeria"], "He scored both Argentina goals from penalties."),
    q("Which country did Messi face on his senior Argentina debut in August 2005?", ["Hungary"], "He was sent off shortly after coming on in Budapest."),
    q("Which country conceded Messi's first World Cup goal in June 2006?", ["Serbia and Montenegro", "Serbia Montenegro", "Serbia & Montenegro"], "Argentina won 6-0 in Gelsenkirchen."),
  ]),
  neymar: bank([E, E, M, E, M, M], [
    q("In which Brazilian city was Neymar born?", ["Mogi das Cruzes", "Mogi"], "A city in Sao Paulo state."),
    q("Which gold medal did Neymar win with Brazil at Rio 2016?", ["Olympic gold", "Olympics", "Olympic Games", "Olympic football"], "It was Brazil's first men's title at that multisport event."),
    q("Which Brazilian club did Neymar rejoin in January 2025?", ["Santos", "Santos FC"], "He returned to Vila Belmiro."),
  ], [
    q("Who coached Barcelona when Neymar won the 2015 treble?", ["Luis Enrique", "Luis Enrique Martinez"], "A former Barcelona and Spain midfielder."),
    q("Which country did Neymar score against in the 2013 Confederations Cup final?", ["Spain", "Espana"], "Brazil beat the reigning world champions 3-0."),
    q("Which coach led Santos to the 2011 Libertadores title with Neymar?", ["Muricy Ramalho", "Ramalho"], "He had won three consecutive Brazilian titles with Sao Paulo."),
  ], [
    q("Which Uruguayan club did Neymar beat in the 2011 Libertadores final?", ["Penarol", "Peñarol"], "Santos won the second leg 2-1."),
    q("Which club conceded the Neymar solo goal that won the 2011 Puskas Award?", ["Flamengo", "CR Flamengo"], "Ronaldinho scored a hat-trick in the same 5-4 match."),
    q("Which country did Neymar score against on his senior Brazil debut in August 2010?", ["United States", "USA", "US"], "The friendly was played in New Jersey."),
    q("Which club conceded Neymar's first competitive Barcelona goal in the 2013 Spanish Super Cup?", ["Atletico Madrid", "Atletico", "Atleti"], "He equalised with a header at the Calderon."),
    q("Which club did Neymar score against on his PSG debut in August 2017?", ["Guingamp", "EA Guingamp"], "The Breton hosts lost 3-0."),
    q("Which Germany goalkeeper faced Neymar's decisive shootout penalty in the 2016 Olympic final?", ["Timo Horn", "Horn"], "Cologne's long-serving goalkeeper."),
  ]),
  dimaria: bank([E, E, M, E, M, M], [
    q("In which Argentine city was Di Maria born?", ["Rosario"], "A major city on the Parana River."),
    q("Which Argentine club gave Di Maria his senior debut?", ["Rosario Central", "Central"], "The Canallas, not Newell's Old Boys."),
    q("Which French club signed Di Maria from Manchester United in 2015?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "They play at the Parc des Princes."),
  ], [
    q("Which country did Di Maria score against in the 2008 Olympic men's final?", ["Nigeria"], "His chip secured Argentina's second straight gold."),
    q("Which Argentina midfielder assisted Di Maria's 2021 Copa America final winner?", ["Rodrigo De Paul", "De Paul"], "He moved from Udinese to Atletico that summer."),
    q("Which individual honour did Di Maria receive after the 2014 Champions League final?", ["Man of the match", "Player of the match", "Final man of the match"], "UEFA recognised his performance in Lisbon."),
  ], [
    q("Which Argentina teammate supplied the final pass for Di Maria's goal in the 2022 World Cup final?", ["Alexis Mac Allister", "Mac Allister", "MacAllister"], "A Brighton midfielder at the time."),
    q("Which Real Madrid winger headed in the rebound after Di Maria's shot was saved in the 2014 final?", ["Gareth Bale", "Bale"], "The Welshman made it 2-1 in extra time."),
    q("Which club conceded Di Maria's first Manchester United goal in September 2014?", ["Queens Park Rangers", "QPR"], "His free-kick went straight in during a 4-0 win."),
    q("Which country conceded Di Maria's extra-time winner in the 2014 World Cup last 16?", ["Switzerland"], "Messi supplied the assist in Sao Paulo."),
    q("Which country did Di Maria beat with Argentina in the 2007 Under-20 World Cup final?", ["Czech Republic", "Czechia"], "Argentina won 2-1 in Toronto."),
    q("Which Benfica coach won the Portuguese league with Di Maria in 2009/10?", ["Jorge Jesus", "Jesus"], "He later coached Flamengo and Fenerbahce."),
  ]),
  robben: bank([E, E, M, E, M, M], [
    q("Which Dutch club gave Robben his senior debut in 2000?", ["Groningen", "FC Groningen"], "The northern club play in green and white."),
    q("Which Dutch club did Robben leave to join Chelsea in 2004?", ["PSV", "PSV Eindhoven", "Eindhoven"], "The Eindhoven club."),
    q("Which Dutch club did Robben rejoin as a player in 2020?", ["Groningen", "FC Groningen"], "He returned to his first senior club after a year in retirement."),
  ], [
    q("Who coached Bayern when Robben scored the 2013 Champions League final winner?", ["Jupp Heynckes", "Heynckes"], "A German who also won the trophy with Real Madrid."),
    q("Which Spain goalkeeper denied Robben in a one-on-one in the 2010 World Cup final?", ["Iker Casillas", "Casillas"], "Real Madrid's captain."),
    q("Which Chelsea coach won two Premier Leagues with Robben in 2005 and 2006?", ["Jose Mourinho", "Mourinho"], "The Portuguese Special One."),
  ], [
    q("Which club conceded Robben's volley that sent Bayern through the 2010 Champions League quarter-final?", ["Manchester United", "Man United", "Man Utd"], "Bayern advanced on away goals at Old Trafford."),
    q("Which Bayern teammate delivered the corner for Robben's 2010 volley at Old Trafford?", ["Franck Ribery", "Ribery"], "The French winger played a measured ball to the edge of the box."),
    q("Which Fiorentina goalkeeper conceded Robben's long-range goal in the 2010 Champions League last 16?", ["Sebastien Frey", "Frey"], "A French goalkeeper who had also played for Inter."),
    q("Which club conceded Robben's extra-time winner in the 2010 German Cup semi-final?", ["Schalke", "Schalke 04"], "The Royal Blues lost 1-0 in Gelsenkirchen."),
    q("Which Chile goalkeeper was beaten by Depay from Robben's cross at the 2014 World Cup?", ["Claudio Bravo", "Bravo"], "The captain moved from Real Sociedad to Barcelona that summer."),
    q("Which coach led the Netherlands when Robben finished third at the 2014 World Cup?", ["Louis van Gaal", "Van Gaal"], "He joined Manchester United after the tournament."),
  ]),
  ribery: bank([E, E, M, E, M, M], [
    q("In which French city was Ribery born?", ["Boulogne sur Mer", "Boulogne-sur-Mer", "Boulogne"], "A fishing port on the English Channel."),
    q("Which Italian club did Ribery join in 2021 after Fiorentina?", ["Salernitana", "US Salernitana"], "The Salerno club in maroon."),
    q("Who coached Bayern when Ribery won the 2013 treble?", ["Jupp Heynckes", "Heynckes"], "A German coach in his third Bayern spell."),
  ], [
    q("Which UEFA award did Ribery win in 2013 ahead of Messi and Ronaldo?", ["UEFA Best Player in Europe", "UEFA Men's Player of the Year", "UEFA Best Player in Europe Award"], "It was Europe's annual best-player prize."),
    q("Which French club did Ribery leave to join Galatasaray in January 2005?", ["Metz", "FC Metz"], "The Lorraine club in maroon."),
    q("Which World Cup did Ribery finish as a runner-up with France?", ["2006", "2006 World Cup"], "Italy won the final on penalties in Berlin."),
  ], [
    q("Which Istanbul rival did Ribery score against in the 2005 Turkish Cup final?", ["Fenerbahce", "Fenerbahce SK"], "Galatasaray won the final 5-1."),
    q("Which Spanish goalkeeper conceded Ribery's goal in the 2006 World Cup last 16?", ["Iker Casillas", "Casillas"], "France beat Spain 3-1."),
    q("Which German club conceded Ribery's first Bayern competitive goal in July 2007?", ["Werder Bremen", "Bremen"], "It came in the German League Cup."),
    q("Which Chelsea striker opened the scoring before Ribery's equaliser in the 2013 UEFA Super Cup?", ["Fernando Torres", "Torres"], "The Spaniard had joined from Liverpool."),
    q("Which French club did Ribery represent in 2003/04 before Metz?", ["Brest", "Stade Brestois", "Brest 29"], "A Breton club that won promotion from the third tier."),
    q("Which English club did Ribery face in the 2013 UEFA Super Cup?", ["Chelsea", "Chelsea FC"], "Bayern won on penalties in Prague."),
  ]),
  salah: bank([E, E, M, E, M, M], [
    q("In which Egyptian village was Salah born?", ["Nagrig"], "A village in Gharbia governorate near Basyoun."),
    q("Which Egyptian club gave Salah his senior debut?", ["Al Mokawloon", "Al Mokawloon Al Arab", "Arab Contractors", "El Mokawloon"], "Their English name refers to construction workers."),
    q("How many Premier League goals did Salah score in the 2017/18 season?", ["32", "thirty two", "thirty-two"], "A then-record for a 38-game season."),
  ], [
    q("Which Italian club took Salah on loan from Chelsea in February 2015?", ["Fiorentina", "ACF Fiorentina"], "The Florence club in purple."),
    q("Which country beat Salah's Egypt in the 2017 Africa Cup of Nations final?", ["Cameroon"], "Vincent Aboubakar scored the winner."),
    q("Which country conceded Salah's first World Cup goal in 2018?", ["Russia"], "He scored a penalty against the tournament hosts."),
  ], [
    q("Which English club eliminated Salah's Basel in the 2013 Europa League semi-final?", ["Chelsea", "Chelsea FC"], "He scored against them before joining them the next year."),
    q("Which club did Salah score against on his Liverpool league debut in August 2017?", ["Watford", "Watford FC"], "The game finished 3-3 at Vicarage Road."),
    q("Which Tottenham midfielder handled the ball before Salah's penalty in the 2019 European final?", ["Moussa Sissoko", "Sissoko"], "The incident happened inside the first minute."),
    q("Which Liverpool midfielder replaced injured Salah in the 2018 Champions League final?", ["Adam Lallana", "Lallana"], "A former Southampton captain."),
    q("Which Senegal goalkeeper faced Salah in the 2022 World Cup qualifying shootout?", ["Edouard Mendy", "Mendy"], "Chelsea's goalkeeper at the time."),
    q("Which Merseyside rival conceded the Salah goal that won the 2018 Puskas Award?", ["Everton", "Everton FC"], "He curled in Liverpool's opener at Anfield."),
  ]),
  henry: bank([E, E, M, E, M, M], [
    q("Which French club gave Henry his senior debut in 1994?", ["Monaco", "AS Monaco"], "The principality club."),
    q("Which season did Henry's Arsenal complete unbeaten in the Premier League?", ["2003/04", "2003-04", "2003/2004", "2003-2004"], "The Invincibles season."),
    q("Which coach won the 2009 treble with Henry at Barcelona?", ["Pep Guardiola", "Guardiola", "Josep Guardiola"], "It was his first season coaching the senior side."),
  ], [
    q("Which country conceded Henry's first senior France goal in June 1998?", ["South Africa"], "France won their World Cup opener 3-0 in Marseille."),
    q("Which country did Henry beat with France in the Euro 2000 final?", ["Italy", "Italia"], "The Azzurri led until stoppage time."),
    q("Which Dutch forward was Henry's Arsenal strike partner and wore number 10?", ["Dennis Bergkamp", "Bergkamp"], "A former Ajax and Inter player."),
  ], [
    q("Which club conceded Henry's first Arsenal goal in September 1999?", ["Southampton", "Saints"], "His turn and shot won the game at The Dell."),
    q("Which club conceded Henry's winner on his Arsenal comeback in January 2012?", ["Leeds United", "Leeds"], "It was an FA Cup tie at the Emirates."),
    q("Which Real Madrid goalkeeper conceded Henry's solo winner at the Bernabeu in February 2006?", ["Iker Casillas", "Casillas"], "Arsenal won the Champions League away leg 1-0."),
    q("Which France striker scored the golden goal alongside Henry in the Euro 2000 final?", ["David Trezeguet", "Trezeguet"], "He soon joined Juventus."),
    q("Which country conceded Henry's golden goal in the 2003 Confederations Cup final?", ["Cameroon"], "The final followed the death of Marc-Vivien Foe."),
    q("Which France midfielder's free-kick assisted Henry's winner against Brazil in the 2006 World Cup quarter-final?", ["Zinedine Zidane", "Zidane", "Zizou"], "France's captain was playing his final tournament."),
  ]),
  benzema: bank([E, E, M, E, M, M], [
    q("Which Welsh winger completed Real Madrid's BBC attack alongside Benzema and Ronaldo?", ["Gareth Bale", "Bale"], "He arrived from Tottenham in 2013."),
    q("Which position did Benzema usually play for Real Madrid?", ["Striker", "Centre forward", "Center forward", "ST", "Forward"], "The central goalscoring role."),
    q("Which country did Benzema score against in France's 2021 Nations League final win?", ["Spain", "Espana"], "Kylian Mbappe scored France's other goal."),
  ], [
    q("Who coached Real Madrid during Benzema's Ballon d'Or-winning 2021/22 season?", ["Carlo Ancelotti", "Ancelotti"], "An Italian in his second spell at the club."),
    q("Which English club conceded Benzema's first-leg hat-trick in the 2022 Champions League quarter-final?", ["Chelsea", "Chelsea FC"], "He scored twice with headers at Stamford Bridge."),
    q("Which manager coached Benzema's France at the 2014 World Cup?", ["Didier Deschamps", "Deschamps"], "France's captain at the 1998 tournament."),
  ], [
    q("Which Norwegian club conceded Benzema's first Champions League goal in December 2005?", ["Rosenborg", "Rosenborg BK"], "Lyon won 2-1 at the Stade de Gerland."),
    q("Which country conceded Benzema's debut France goal in March 2007?", ["Austria", "Osterreich"], "He scored the only goal at the Stade de France."),
    q("Which Liverpool goalkeeper's throw did Benzema intercept to score in the 2018 European final?", ["Loris Karius", "Karius"], "The German's error broke the deadlock in Kyiv."),
    q("Which Real Madrid teammate scored twice after Benzema's opener in the 2018 final?", ["Gareth Bale", "Bale"], "His first goal was a bicycle kick."),
    q("Which coach gave Benzema his Lyon first-team debut in January 2005?", ["Paul Le Guen", "Le Guen"], "The Breton coach later managed Rangers."),
    q("Which goalkeeper was beaten by Benzema's Panenka in the 2022 semi-final first leg?", ["Ederson", "Ederson Moraes"], "Manchester City's Brazilian goalkeeper."),
  ]),
  lewandowski: bank([E, E, M, E, M, M], [
    q("In which Polish city was Lewandowski born?", ["Warsaw", "Warszawa"], "The national capital."),
    q("Which Spanish club signed Lewandowski from Bayern in 2022?", ["Barcelona", "FC Barcelona", "Barca"], "They play at Camp Nou."),
    q("Who coached Dortmund when Lewandowski won the 2011/12 domestic double?", ["Jurgen Klopp", "Klopp"], "He later managed Liverpool."),
  ], [
    q("How many Bundesliga goals did Lewandowski score in 2020/21?", ["41", "forty one", "forty-one"], "One more than Gerd Muller's old single-season record."),
    q("Which Bayern coach led Lewandowski to the 2020 treble?", ["Hansi Flick", "Hans-Dieter Flick", "Flick"], "He took over from Niko Kovac."),
    q("Which French club did Lewandowski face in the 2020 Champions League final?", ["Paris Saint-Germain", "PSG", "Paris Saint Germain"], "Bayern won 1-0 in Lisbon."),
  ], [
    q("Which Polish club did Lewandowski represent before Lech Poznan?", ["Znicz Pruszkow", "Znicz"], "A club from a town near Warsaw."),
    q("Which country conceded Lewandowski's first senior Poland goal in September 2008?", ["San Marino"], "He scored as a substitute on his debut."),
    q("Which goalkeeper conceded Lewandowski's record-breaking 41st Bundesliga goal in May 2021?", ["Rafal Gikiewicz", "Gikiewicz"], "A fellow Pole playing for Augsburg."),
    q("Which club conceded all three Lewandowski goals in the 2012 German Cup final?", ["Bayern Munich", "Bayern"], "Dortmund won the final 5-2."),
    q("Which country did Lewandowski score against in the opening match of Euro 2012?", ["Greece", "Hellas"], "The hosts drew 1-1 in Warsaw."),
    q("Which Czech club conceded Lewandowski's first Barcelona Champions League hat-trick in September 2022?", ["Viktoria Plzen", "Viktoria Pilsen", "Plzen"], "Barcelona won 5-1 at Camp Nou."),
  ]),
  suarez: bank([E, E, M, E, M, M], [
    q("Which Uruguayan club gave Suarez his senior debut in 2005?", ["Nacional", "Club Nacional de Football"], "Penarol's Montevideo rivals."),
    q("Which American club did Suarez join for the 2024 season?", ["Inter Miami", "Inter Miami CF", "Miami"], "He reunited with Messi, Busquets and Alba."),
    q("Which position did Suarez play in Barcelona's MSN attack?", ["Striker", "Centre forward", "Center forward", "ST"], "Messi and Neymar played either side of him."),
  ], [
    q("Which Dutch club first brought Suarez to Europe in 2006?", ["Groningen", "FC Groningen"], "He joined Ajax after one season there."),
    q("Who coached Atletico when Suarez won La Liga in 2020/21?", ["Diego Simeone", "Simeone", "Cholo Simeone"], "An Argentine nicknamed El Cholo."),
    q("Which Italian club did Suarez score against in the 2015 Champions League final?", ["Juventus", "Juve"], "His goal put Barcelona 2-1 up in Berlin."),
  ], [
    q("Which club conceded Suarez's first Liverpool goal on his February 2011 debut?", ["Stoke City", "Stoke"], "Liverpool won 2-0 at Anfield."),
    q("Which Norwich goalkeeper conceded four Suarez goals in a December 2013 match?", ["John Ruddy", "Ruddy"], "The England international was beaten four times in a 5-1 defeat."),
    q("Which club conceded Suarez's league-title-clinching goal for Atletico in May 2021?", ["Valladolid", "Real Valladolid"], "Atletico came from behind to win 2-1 away."),
    q("Which Ghana striker missed the penalty following Suarez's handball in the 2010 World Cup quarter-final?", ["Asamoah Gyan", "Gyan"], "His kick hit the crossbar in extra-time stoppage time."),
    q("Which country conceded both Suarez goals in Uruguay's 2010 World Cup last-16 win?", ["South Korea", "Korea Republic", "Republic of Korea"], "His second was a curling shot in Port Elizabeth."),
    q("Which country did Suarez score twice against at the 2014 World Cup?", ["England"], "Uruguay won 2-1 in Sao Paulo."),
  ]),
  drogba: bank([E, E, M, E, M, M], [
    q("In which Ivorian city was Drogba born?", ["Abidjan"], "The country's largest city and former capital."),
    q("Which Chinese club did Drogba join after Chelsea in 2012?", ["Shanghai Shenhua", "Shenhua"], "He joined Nicolas Anelka there."),
    q("Which MLS club did Drogba join in 2015?", ["Montreal Impact", "Impact Montreal", "CF Montreal", "Montreal"], "A Canadian club based in Quebec."),
  ], [
    q("Which French club did Drogba leave to join Marseille in 2003?", ["Guingamp", "EA Guingamp"], "The Breton club in red and black."),
    q("Who coached Chelsea when Drogba won his first Premier League in 2004/05?", ["Jose Mourinho", "Mourinho"], "The Portuguese Special One."),
    q("Which club conceded Drogba's extra-time winner in the 2007 FA Cup final?", ["Manchester United", "Man United", "Man Utd"], "The first final at the rebuilt Wembley."),
  ], [
    q("Which French club gave Drogba his senior debut before Guingamp?", ["Le Mans", "Le Mans UC72", "Le Mans UC 72"], "The city is famous for a 24-hour motor race."),
    q("Which Marseille goalkeeper played behind Drogba in the 2004 UEFA Cup final?", ["Fabien Barthez", "Barthez"], "France's 1998 World Cup goalkeeper."),
    q("Which Spanish club beat Drogba's Marseille in the 2004 UEFA Cup final?", ["Valencia", "Valencia CF"], "Rafael Benitez's side won 2-0."),
    q("Which country conceded Ivory Coast's first World Cup goal, scored by Drogba in 2006?", ["Argentina"], "The Elephants lost 2-1 in Hamburg."),
    q("Which Galatasaray teammate crossed for Drogba's backheeled goal against Real Madrid in April 2013?", ["Nordin Amrabat", "Amrabat"], "The Moroccan winger came on at half-time."),
    q("Which Chelsea midfielder exchanged passes with Drogba before the 2007 FA Cup final winner?", ["Frank Lampard", "Lampard"], "A one-two created the extra-time breakthrough."),
  ]),
  etoo: bank([E, E, M, E, M, M], [
    q("Who coached Barcelona when Eto'o won the 2009 treble?", ["Pep Guardiola", "Guardiola", "Josep Guardiola"], "It was his first season in charge of the senior team."),
    q("Which Russian club signed Eto'o from Inter in 2011?", ["Anzhi", "Anzhi Makhachkala", "Anji"], "A club from Dagestan that spent heavily at the time."),
    q("Which English club signed Eto'o in 2013?", ["Chelsea", "Chelsea FC"], "He reunited with Jose Mourinho."),
  ], [
    q("Which Spanish giant signed Eto'o as a teenager before his Mallorca career?", ["Real Madrid", "Madrid"], "Their first team offered him very few opportunities."),
    q("Which English club did Eto'o join after Chelsea in 2014?", ["Everton", "Everton FC"], "The blue half of Merseyside."),
    q("Which country did Eto'o beat with Cameroon in the 2000 Africa Cup of Nations final?", ["Nigeria"], "The match went to penalties in Lagos."),
  ], [
    q("Which Arsenal goalkeeper conceded Eto'o's equaliser in the 2006 Champions League final?", ["Manuel Almunia", "Almunia"], "He had replaced Jens Lehmann after a red card."),
    q("Which Barcelona teammate assisted Eto'o's opening goal in the 2009 Champions League final?", ["Andres Iniesta", "Iniesta"], "The midfielder drove forward before releasing the ball."),
    q("Which country did Eto'o beat with Cameroon in the Sydney 2000 Olympic final?", ["Spain", "Espana"], "Cameroon recovered from 2-0 down and won on penalties."),
    q("Which club conceded two Eto'o goals in the 2003 Copa del Rey final?", ["Recreativo", "Recreativo de Huelva", "Huelva"], "Mallorca won the final 3-0."),
    q("Who coached Inter when Eto'o won the 2010 treble?", ["Jose Mourinho", "Mourinho"], "The Portuguese left for Real Madrid afterward."),
    q("Which coach managed Sampdoria when Eto'o joined in January 2015?", ["Sinisa Mihajlovic", "Mihajlovic"], "A Serbian former defender famed for free-kicks."),
  ]),
  alexis: bank([E, E, M, E, M, M], [
    q("In which Chilean city was Alexis Sanchez born?", ["Tocopilla"], "A northern port in the Atacama Desert region."),
    q("Which Chilean club gave Alexis his senior debut?", ["Cobreloa", "CD Cobreloa"], "The Calama club play in orange."),
    q("Which French club signed Alexis in 2022?", ["Marseille", "Olympique de Marseille", "OM"], "He played at the Stade Velodrome."),
  ], [
    q("Which Argentine club took Alexis on loan in 2007/08?", ["River Plate", "River"], "They won the 2008 Clausura."),
    q("Which Chilean club took Alexis on loan for the 2006/07 season?", ["Colo-Colo", "Colo Colo", "Colocolo"], "The Santiago club play in white and black."),
    q("Which award did Alexis win as the best player of the 2016 Copa America?", ["Golden Ball", "Player of the tournament", "Best player"], "Chile retained their title in the United States."),
  ], [
    q("Which club conceded Alexis's opening goal in the 2017 FA Cup final?", ["Chelsea", "Chelsea FC"], "Arsenal won 2-1 at Wembley."),
    q("Which club conceded Alexis's long-range goal in the 2015 FA Cup final?", ["Aston Villa", "Villa"], "Arsenal won the final 4-0."),
    q("Which Argentina goalkeeper faced Alexis's winning Panenka in the 2015 Copa America final?", ["Sergio Romero", "Romero"], "He joined Manchester United that summer."),
    q("Which country did Alexis score against in the 2014 World Cup last 16?", ["Brazil", "Brasil"], "Chile later lost the shootout to the hosts."),
    q("Which coach managed Udinese when Alexis first played for them in 2008/09?", ["Pasquale Marino", "Marino"], "An Italian coach who had previously managed Catania."),
    q("Which Argentina winger opened the scoring against Alexis's Chile in the 2007 Under-20 World Cup semi-final?", ["Angel Di Maria", "Di Maria"], "The Benfica-bound winger later played for Real Madrid."),
  ]),
  dzeko: bank([E, E, M, E, M, M], [
    q("In which Bosnian city was Dzeko born?", ["Sarajevo"], "The national capital."),
    q("Which Italian club signed Dzeko from Manchester City in 2015?", ["Roma", "AS Roma", "A.S. Roma"], "He initially joined the Giallorossi on loan."),
    q("Who coached Wolfsburg when Dzeko won the 2008/09 Bundesliga?", ["Felix Magath", "Magath"], "He had previously won league titles with Bayern."),
  ], [
    q("Which Brazilian striker partnered Dzeko in Wolfsburg's 2008/09 title-winning attack?", ["Grafite", "Edinaldo Batista Libanio"], "He finished as Bundesliga top scorer that season."),
    q("Which country conceded Dzeko's first World Cup goal in 2014?", ["Iran"], "Bosnia won 3-1 in Salvador."),
    q("How many Serie A goals made Dzeko the 2016/17 league top scorer?", ["29", "twenty nine", "twenty-nine"], "One fewer than thirty."),
  ], [
    q("Which Czech club signed Dzeko in 2005 before Wolfsburg?", ["Teplice", "FK Teplice"], "A spa-town club in yellow and blue."),
    q("Which Czech club took Dzeko on loan from Teplice in 2005?", ["Usti nad Labem", "Usti", "FK Usti nad Labem"], "A city on the Elbe."),
    q("Which Bosnian club gave Dzeko his senior debut?", ["Zeljeznicar", "FK Zeljeznicar", "Zeljeznicar Sarajevo"], "The Sarajevo Railwaymen."),
    q("Which country conceded Dzeko's senior international debut goal in June 2007?", ["Turkey", "Turkiye"], "Bosnia won the qualifier 3-2 in Sarajevo."),
    q("Who coached Inter when Dzeko reached the 2023 Champions League final?", ["Simone Inzaghi", "Inzaghi"], "A former Lazio striker, not his brother Filippo."),
    q("Which Spanish club did Dzeko score against in both legs of a 2018 Champions League quarter-final?", ["Barcelona", "FC Barcelona", "Barca"], "Roma overturned a 4-1 first-leg deficit."),
  ]),
  quaresma: bank([E, E, M, E, M, M], [
    q("In which Portuguese city was Quaresma born?", ["Lisbon", "Lisboa"], "The national capital."),
    q("Which Portuguese club signed Quaresma from Barcelona in 2004?", ["Porto", "FC Porto"], "He moved in the summer Deco went the other way."),
    q("Which position did Quaresma usually play for Portugal?", ["Winger", "Right winger", "RW", "Wide forward"], "He attacked down the flank rather than in central defence."),
  ], [
    q("What Portuguese name describes Quaresma's trademark outside-of-the-foot kick?", ["Trivela"], "It produces curl without using the inside of the boot."),
    q("Who coached Portugal during Quaresma's Euro 2016 title win?", ["Fernando Santos", "Santos"], "He had previously coached Greece."),
    q("Who was Chelsea manager when Quaresma arrived on loan in February 2009?", ["Luiz Felipe Scolari", "Scolari", "Felipao"], "The Brazilian was dismissed shortly afterward."),
  ], [
    q("Which UAE club signed Quaresma in January 2013?", ["Al Ahli", "Al-Ahli", "Al Ahli Dubai", "Shabab Al Ahli"], "A Dubai club, not the Saudi side of the same name."),
    q("Which Istanbul club signed Quaresma from Besiktas in 2019?", ["Kasimpasa", "Kasimpasa SK"], "They play at the Recep Tayyip Erdogan Stadium."),
    q("Which Portuguese club signed Quaresma in 2020?", ["Vitoria Guimaraes", "Vitoria SC", "Guimaraes"], "Not the Setubal club of a similar name."),
    q("Which goalkeeper saved Ronaldo's header before Quaresma scored against Croatia at Euro 2016?", ["Danijel Subasic", "Subasic"], "Monaco's Croatia goalkeeper."),
    q("Which Poland goalkeeper faced Quaresma's winning shootout kick at Euro 2016?", ["Lukasz Fabianski", "Fabianski"], "The Swansea goalkeeper started ahead of Szczesny."),
    q("Which country conceded Quaresma's outside-of-the-foot goal at the 2018 World Cup?", ["Iran"], "The match ended 1-1 in Saransk."),
  ]),
  mbappe: bank([E, E, M, E, M, M], [
    q("Which French club developed Mbappe before he entered Monaco's academy?", ["AS Bondy", "Bondy"], "His father coached at this Paris-suburb club."),
    q("Which award for scoring the most goals did Mbappe win at the 2022 World Cup?", ["Golden Boot", "Golden Shoe", "FIFA Golden Boot"], "His eight goals included three in the final."),
    q("Who coached France when Mbappe won the 2018 World Cup?", ["Didier Deschamps", "Deschamps"], "France's 1998 World Cup-winning captain."),
  ], [
    q("Which country conceded Mbappe's first World Cup goal in 2018?", ["Peru"], "France won 1-0 in Yekaterinburg."),
    q("Who coached Monaco when Mbappe won Ligue 1 in 2016/17?", ["Leonardo Jardim", "Jardim"], "A Portuguese coach born in Venezuela."),
    q("Which country did Mbappe score against in the 2018 World Cup final?", ["Croatia", "Hrvatska"], "France won 4-2 in Moscow."),
  ], [
    q("Which club conceded Mbappe's first senior Monaco goal in February 2016?", ["Troyes", "ESTAC", "ESTAC Troyes"], "He broke Thierry Henry's club record for youngest goalscorer."),
    q("Which English club conceded Mbappe's first Champions League goal in February 2017?", ["Manchester City", "Man City"], "Monaco lost the first leg 5-3 but later advanced."),
    q("Which goalkeeper saved Mbappe's decisive penalty in France's Euro 2020 shootout defeat?", ["Yann Sommer", "Sommer"], "Switzerland won the last-16 tie in Bucharest."),
    q("Which club conceded Mbappe's first Real Madrid goal in the 2024 UEFA Super Cup?", ["Atalanta", "Atalanta BC"], "Madrid won 2-0 in Warsaw."),
    q("Which Real Madrid teammate assisted Mbappe's 2024 UEFA Super Cup goal?", ["Jude Bellingham", "Bellingham"], "An England midfielder signed from Dortmund."),
    q("Which Barcelona goalkeeper conceded Mbappe's hat-trick at Camp Nou in February 2021?", ["Marc-Andre ter Stegen", "Ter Stegen"], "PSG won the Champions League away leg 4-1."),
  ]),
  haaland: bank([E, E, M, E, M, M], [
    q("In which English city was Haaland born?", ["Leeds"], "His father played for the local United club."),
    q("Which former Norway international is Haaland's father?", ["Alf-Inge Haaland", "Alf Inge Haaland", "Alfie Haaland", "Alfie"], "A former Leeds and Manchester City player."),
    q("Which position did Haaland play for Manchester City in their 2023 treble?", ["Striker", "Centre forward", "Center forward", "ST"], "The central goalscoring role."),
  ], [
    q("Which Norwegian club signed Haaland from Bryne in 2017?", ["Molde", "Molde FK"], "Their home is the Aker Stadion."),
    q("Who coached Haaland at Molde before taking charge of Manchester United?", ["Ole Gunnar Solskjaer", "Solskjaer"], "A former United striker."),
    q("Which country conceded Haaland's nine goals in one match at the 2019 Under-20 World Cup?", ["Honduras"], "Norway won 12-0 in Lublin."),
  ], [
    q("Which Norwegian club gave Haaland his senior league debut in 2016?", ["Bryne", "Bryne FK"], "A club in Rogaland where he grew up."),
    q("Which Belgian club conceded Haaland's Champions League debut hat-trick in September 2019?", ["Genk", "KRC Genk"], "Salzburg won 6-2."),
    q("Which club conceded Haaland's hat-trick on his Dortmund debut in January 2020?", ["Augsburg", "FC Augsburg"], "He came off the bench in a 5-3 win."),
    q("Which goalkeeper conceded Haaland's first Manchester City league goals in August 2022?", ["Alphonse Areola", "Areola"], "The West Ham substitute had replaced injured Fabianski."),
    q("Which Manchester City full-back assisted Haaland's acrobatic winner against Dortmund in September 2022?", ["Joao Cancelo", "Cancelo"], "He used the outside of his right foot."),
    q("Which goalkeeper was beaten by Haaland's five goals against Leipzig in March 2023?", ["Janis Blaswich", "Blaswich"], "He was deputising for the injured Peter Gulacsi."),
  ]),
} satisfies Record<string, ReturnType<typeof bank>>;

export const LEGACY_FORMATION_DIFFICULTIES: Record<string, Legacy> = Object.fromEntries(
  Object.entries(BANK).map(([id, entry]) => [id, entry.legacy]),
);
export const ADDITIONAL_FORMATION_QUESTIONS: Record<string, FormationQuestion[]> = Object.fromEntries(
  Object.entries(BANK).map(([id, entry]) => [id, entry.questions]),
);
