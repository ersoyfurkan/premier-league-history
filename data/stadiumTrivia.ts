import type { Competition } from "@/lib/competitions";
import { knowledgeNames, type KnowledgeEntry, type KnowledgeGroup } from "@/data/footballKnowledge";

type Stadium = KnowledgeEntry & { clue: string };
type StadiumCountry = { country: string; competitions: Competition[]; stadiums: Stadium[]; source: string };
const country = (name: string, competitions: Competition[], venues: [string, string][]): StadiumCountry => ({
  country: name,
  competitions: [...new Set<Competition>(["general", "worldcup", ...competitions])],
  stadiums: venues.map(([entry, clue]) => ({ ...knowledgeNames(entry)[0], clue })),
  source: `https://en.wikipedia.org/wiki/List_of_football_stadiums_in_${name.replace(/ /g, "_")}`,
});

// Historic/sponsor names are aliases of the same physical venue, never extra answers.
export const STADIUM_COUNTRIES: StadiumCountry[] = [
  country("Brazil", ["copa"], [
    ["Maracana/Estadio do Maracana/Estadio Jornalista Mario Filho", "Rio de Janeiro stadium that hosted the 2014 World Cup final."],
    ["Morumbi/Estadio do Morumbi/Estadio Cicero Pompeu de Toledo/MorumBIS", "Sao Paulo FC's traditional home ground."],
    ["Mineirao/Estadio Governador Magalhaes Pinto", "Belo Horizonte stadium that hosted Brazil's 7-1 defeat by Germany in 2014."],
    ["Beira-Rio/Estadio Jose Pinheiro Borda", "Internacional's home stadium in Porto Alegre."],
    ["Vila Belmiro/Estadio Urbano Caldeira", "Santos' traditional home stadium, associated with Pele."],
    ["Allianz Parque/Parque Antarctica Arena", "Palmeiras' modern home ground, opened in 2014."],
    ["Neo Quimica Arena/Arena Corinthians/Itaquerao", "Corinthians' home ground that hosted the opening match of the 2014 World Cup."],
    ["Arena Fonte Nova/Fonte Nova/Itaipava Arena Fonte Nova", "Bahia's home ground in Salvador, rebuilt for the 2014 World Cup."],
    ["Arena do Gremio/Gremio Arena", "Gremio's home stadium in Porto Alegre, opened in 2012."],
    ["Castelao/Arena Castelao/Estadio Governador Placido Castelo", "Fortaleza's major World Cup venue, also used by Ceara."],
  ]),
  country("Argentina", ["copa"], [
    ["La Bombonera/Estadio Alberto J. Armando/Bombonera", "Boca Juniors' famous home stadium in Buenos Aires."],
    ["El Monumental/Estadio Monumental/Estadio Antonio Vespucio Liberti/Mas Monumental", "River Plate's home ground, also used by Argentina's national team."],
    ["Estadio Libertadores de America/Libertadores de America/Ricardo Enrique Bochini", "Independiente's home stadium in Avellaneda."],
    ["El Cilindro/Estadio Presidente Peron", "Racing Club's round stadium in Avellaneda."],
    ["Estadio Jose Amalfitani/Jose Amalfitani/El Fortin", "Velez Sarsfield's home stadium in Buenos Aires."],
    ["Estadio Mario Alberto Kempes/Mario Alberto Kempes/Estadio Cordoba", "Cordoba's principal stadium, named after Argentina's 1978 World Cup hero."],
    ["Estadio Ciudad de La Plata/Estadio Unico Diego Armando Maradona/Estadio Unico de La Plata", "La Plata's major stadium named in honour of Diego Maradona, not Napoli's ground."],
    ["Estadio Pedro Bidegain/Nuevo Gasometro", "San Lorenzo's home stadium, nicknamed the Nuevo Gasometro."],
  ]),
  country("England", ["pl", "euros", "ucl"], [
    ["Anfield", "Liverpool's home stadium since 1892."],
    ["Old Trafford", "Manchester United's home ground, nicknamed the Theatre of Dreams."],
    ["Emirates Stadium/Emirates/Ashburton Grove", "Arsenal's home stadium since 2006."],
    ["Stamford Bridge", "Chelsea's traditional home stadium in west London."],
    ["Etihad Stadium/City of Manchester Stadium", "Manchester City's home ground since 2003."],
    ["Tottenham Hotspur Stadium", "Tottenham's modern stadium, opened in 2019 on the site of their former ground."],
    ["Wembley Stadium/Wembley", "England's national stadium, rebuilt and reopened in 2007."],
    ["Villa Park", "Aston Villa's traditional home ground in Birmingham."],
    ["St James' Park/St James Park", "Newcastle United's traditional home stadium."],
  ]),
  country("Spain", ["laliga", "euros", "ucl"], [
    ["Santiago Bernabeu/Estadio Santiago Bernabeu/Bernabeu", "Real Madrid's traditional home stadium."],
    ["Camp Nou/Spotify Camp Nou/Nou Camp", "Barcelona's traditional home stadium, opened in 1957."],
    ["Metropolitano/Wanda Metropolitano/Civitas Metropolitano/Riyadh Air Metropolitano", "Atletico Madrid's home stadium since 2017."],
    ["Mestalla/Estadio de Mestalla", "Valencia's traditional home ground."],
    ["Ramon Sanchez Pizjuan/Estadio Ramon Sanchez Pizjuan", "Sevilla FC's traditional home stadium."],
    ["San Mames/Estadio San Mames", "Athletic Club's modern home ground, opened in Bilbao in 2013."],
    ["Benito Villamarin/Estadio Benito Villamarin", "Real Betis' traditional stadium in Seville, named after a former president."],
  ]),
  country("Germany", ["bundesliga", "euros", "ucl"], [
    ["Allianz Arena", "Bayern Munich's home stadium since 2005."],
    ["Westfalenstadion/Signal Iduna Park", "Borussia Dortmund's home stadium, famous for the Yellow Wall."],
    ["Olympiastadion/Olympiastadion Berlin/Berlin Olympic Stadium", "Berlin stadium that hosted the 2006 World Cup and Euro 2024 finals."],
    ["Veltins-Arena/Arena AufSchalke", "Schalke 04's home stadium in Gelsenkirchen."],
    ["Volksparkstadion/Imtech Arena/HSH Nordbank Arena/AOL Arena", "Hamburger SV's home stadium in Hamburg."],
    ["Weserstadion/Wohninvest Weserstadion", "Werder Bremen's traditional home stadium beside the River Weser."],
    ["Deutsche Bank Park/Waldstadion/Commerzbank Arena", "Eintracht Frankfurt's home stadium, historically called the Waldstadion."],
  ]),
  country("Italy", ["seriea", "euros", "ucl"], [
    ["San Siro/Stadio Giuseppe Meazza/Giuseppe Meazza", "Milan stadium traditionally shared by AC Milan and Inter."],
    ["Stadio Olimpico/Olimpico/Rome Olympic Stadium", "Rome's stadium traditionally shared by Roma and Lazio."],
    ["Stadio Diego Armando Maradona/Stadio San Paolo/Diego Armando Maradona Stadium", "Napoli's stadium, renamed in honour of an Argentine legend in 2020."],
    ["Allianz Stadium/Juventus Stadium", "Juventus' home stadium in Turin since 2011."],
    ["Stadio Artemio Franchi/Artemio Franchi", "Fiorentina's traditional home stadium in Florence."],
    ["Stadio Luigi Ferraris/Luigi Ferraris/Marassi", "Genoa stadium traditionally shared by Genoa and Sampdoria."],
    ["Stadio Renato Dall'Ara/Renato Dall'Ara", "Bologna's traditional home stadium."],
  ]),
  country("France", ["ligue1", "euros", "ucl"], [
    ["Parc des Princes", "Paris Saint-Germain's traditional home stadium."],
    ["Stade Velodrome/Orange Velodrome/Velodrome", "Marseille's traditional home stadium."],
    ["Stade de France", "Saint-Denis stadium that hosted the 1998 World Cup and Euro 2016 finals."],
    ["Groupama Stadium/Parc Olympique Lyonnais/Stade des Lumieres", "Lyon's modern stadium, opened in 2016."],
    ["Stade Pierre-Mauroy/Decathlon Arena/Pierre Mauroy", "Lille's modern home stadium in Villeneuve-d'Ascq."],
    ["Stade Geoffroy-Guichard/Geoffroy Guichard/Le Chaudron", "Saint-Etienne's traditional stadium, nicknamed the Cauldron."],
    ["Stade de la Beaujoire/La Beaujoire", "Nantes' traditional home stadium."],
  ]),
  country("Portugal", ["euros", "ucl"], [
    ["Estadio da Luz/Estadio do Sport Lisboa e Benfica", "Benfica's modern Lisbon stadium, opened in 2003."],
    ["Estadio do Dragao/Dragao", "Porto's home stadium since 2003."],
    ["Estadio Jose Alvalade/Jose Alvalade", "Sporting CP's modern home stadium in Lisbon."],
    ["Estadio Municipal de Braga/Braga Municipal Stadium/A Pedreira", "Braga's stadium built beside a quarry for Euro 2004."],
    ["Estadio do Bessa/Bessa", "Boavista's home ground in Porto."],
  ]),
  country("Egypt", [], [
    ["Cairo International Stadium/Cairo Stadium", "Egypt's national-team stadium in Cairo's Nasr City district."],
    ["Borg El Arab Stadium/Borg Al Arab Stadium", "Large stadium near Alexandria opened in 2007, used by Egypt's national team."],
    ["Alexandria Stadium", "Historic Alexandria venue that hosted 2019 Africa Cup of Nations matches."],
    ["Al Salam Stadium/Al-Salam Stadium/Al Ahly WE Al Salam Stadium", "Cairo stadium opened in 2009, also used by Al Ahly."],
    ["Suez Stadium/Suez Municipal Stadium", "Suez venue that hosted matches at the 2019 Africa Cup of Nations."],
  ]),
];

export const STADIUM_GROUPS: KnowledgeGroup[] = STADIUM_COUNTRIES.map((country) => ({
  id: `stadiums-${country.country.toLowerCase()}`,
  label: `Stadiums in ${country.country}`,
  noun: `football stadium in ${country.country}`,
  plural: `football stadiums in ${country.country}`,
  entries: country.stadiums.map(({ name, aliases }) => ({ name, aliases })),
  difficulty: country.country === "Egypt" ? 4 : 2,
  competitions: country.competitions,
  sources: [country.source],
}));
