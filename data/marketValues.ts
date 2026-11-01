import type { Competition } from "@/lib/gameRoom";

export type MarketValueSnapshot = {
  value: number;
  year: number;
  club: string;
};

export type MarketValuePlayer = {
  name: string;
  nationality: string;
  countryCode: string;
  source: string;
  values: MarketValueSnapshot[];
};

const transfermarktHistory = (name: string, playerId: string) => {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://www.transfermarkt.com/${slug}/marktwertverlauf/spieler/${playerId}`;
};

const player = (
  name: string,
  nationality: string,
  countryCode: string,
  transfermarktId: string,
  values: MarketValueSnapshot[],
): MarketValuePlayer => ({
  name,
  nationality,
  countryCode,
  source: transfermarktHistory(name, transfermarktId),
  values,
});

export const MARKET_VALUE_PLAYERS: Record<Competition, MarketValuePlayer[]> = {
  pl: [
    player("Erling Haaland", "Norway", "no", "418560", [
      { value: 8, year: 2020, club: "Red Bull Salzburg" },
      { value: 60, year: 2021, club: "Borussia Dortmund" },
      { value: 150, year: 2022, club: "Manchester City" },
      { value: 200, year: 2024, club: "Manchester City" },
    ]),
    player("Raheem Sterling", "England", "gb-eng", "134425", [
      { value: 5, year: 2014, club: "Liverpool" },
      { value: 35, year: 2015, club: "Manchester City" },
      { value: 90, year: 2018, club: "Manchester City" },
      { value: 160, year: 2019, club: "Manchester City" },
    ]),
    player("Mohamed Salah", "Egypt", "eg", "148455", [
      { value: 15, year: 2014, club: "Chelsea" },
      { value: 25, year: 2016, club: "Roma" },
      { value: 50, year: 2017, club: "Liverpool" },
      { value: 150, year: 2018, club: "Liverpool" },
      { value: 100, year: 2022, club: "Liverpool" },
    ]),
    player("Harry Kane", "England", "gb-eng", "132098", [
      { value: 5, year: 2014, club: "Tottenham Hotspur" },
      { value: 40, year: 2016, club: "Tottenham Hotspur" },
      { value: 150, year: 2018, club: "Tottenham Hotspur" },
      { value: 120, year: 2021, club: "Tottenham Hotspur" },
      { value: 90, year: 2023, club: "Tottenham Hotspur" },
    ]),
    player("Kevin De Bruyne", "Belgium", "be", "88755", [
      { value: 8, year: 2013, club: "Chelsea" },
      { value: 45, year: 2015, club: "Manchester City" },
      { value: 150, year: 2018, club: "Manchester City" },
      { value: 120, year: 2020, club: "Manchester City" },
      { value: 70, year: 2023, club: "Manchester City" },
    ]),
    player("Eden Hazard", "Belgium", "be", "50202", [
      { value: 32, year: 2012, club: "Chelsea" },
      { value: 45, year: 2014, club: "Chelsea" },
      { value: 150, year: 2018, club: "Chelsea" },
      { value: 100, year: 2019, club: "Real Madrid" },
    ]),
    player("Paul Pogba", "France", "fr", "122153", [
      { value: 4, year: 2012, club: "Juventus" },
      { value: 70, year: 2016, club: "Manchester United" },
      { value: 90, year: 2018, club: "Manchester United" },
      { value: 100, year: 2019, club: "Manchester United" },
    ]),
    player("Sadio Mané", "Senegal", "sn", "200512", [
      { value: 10, year: 2014, club: "Southampton" },
      { value: 30, year: 2016, club: "Liverpool" },
      { value: 80, year: 2018, club: "Liverpool" },
      { value: 150, year: 2019, club: "Liverpool" },
    ]),
    player("Phil Foden", "England", "gb-eng", "406635", [
      { value: 1, year: 2018, club: "Manchester City" },
      { value: 40, year: 2020, club: "Manchester City" },
      { value: 90, year: 2022, club: "Manchester City" },
      { value: 150, year: 2024, club: "Manchester City" },
    ]),
    player("Cristiano Ronaldo", "Portugal", "pt", "8198", [
      { value: 18, year: 2004, club: "Manchester United" },
      { value: 25, year: 2006, club: "Manchester United" },
      { value: 60, year: 2009, club: "Real Madrid" },
      { value: 120, year: 2014, club: "Real Madrid" },
      { value: 100, year: 2018, club: "Real Madrid" },
    ]),
    player("Bukayo Saka", "England", "gb-eng", "433177", [
      { value: 10, year: 2019, club: "Arsenal" },
      { value: 40, year: 2021, club: "Arsenal" },
      { value: 90, year: 2023, club: "Arsenal" },
      { value: 150, year: 2025, club: "Arsenal" },
    ]),
    player("Declan Rice", "England", "gb-eng", "357662", [
      { value: 8, year: 2018, club: "West Ham United" },
      { value: 35, year: 2021, club: "West Ham United" },
      { value: 90, year: 2023, club: "Arsenal" },
      { value: 120, year: 2024, club: "Arsenal" },
    ]),
    player("Bruno Fernandes", "Portugal", "pt", "240306", [
      { value: 35, year: 2019, club: "Sporting CP" },
      { value: 70, year: 2020, club: "Manchester United" },
      { value: 90, year: 2021, club: "Manchester United" },
      { value: 70, year: 2024, club: "Manchester United" },
    ]),
    player("Alexander Isak", "Sweden", "se", "349066", [
      { value: 10, year: 2019, club: "Real Sociedad" },
      { value: 30, year: 2021, club: "Real Sociedad" },
      { value: 70, year: 2023, club: "Newcastle United" },
      { value: 100, year: 2024, club: "Newcastle United" },
    ]),
    player("Ollie Watkins", "England", "gb-eng", "324358", [
      { value: 8, year: 2020, club: "Aston Villa" },
      { value: 25, year: 2022, club: "Aston Villa" },
      { value: 50, year: 2024, club: "Aston Villa" },
      { value: 60, year: 2025, club: "Aston Villa" },
    ]),
    player("Son Heung-min", "South Korea", "kr", "91845", [
      { value: 25, year: 2015, club: "Tottenham Hotspur" },
      { value: 50, year: 2018, club: "Tottenham Hotspur" },
      { value: 90, year: 2022, club: "Tottenham Hotspur" },
      { value: 45, year: 2024, club: "Tottenham Hotspur" },
    ]),
    player("Rodri", "Spain", "es", "357565", [
      { value: 40, year: 2019, club: "Manchester City" },
      { value: 70, year: 2021, club: "Manchester City" },
      { value: 100, year: 2023, club: "Manchester City" },
      { value: 130, year: 2024, club: "Manchester City" },
    ]),
    player("Cole Palmer", "England", "gb-eng", "568177", [
      { value: 18, year: 2023, club: "Chelsea" },
      { value: 55, year: 2024, club: "Chelsea" },
      { value: 130, year: 2025, club: "Chelsea" },
    ]),
  ],
  laliga: [
    player("Vinícius Júnior", "Brazil", "br", "371998", [
      { value: 35, year: 2018, club: "Real Madrid" },
      { value: 45, year: 2020, club: "Real Madrid" },
      { value: 100, year: 2022, club: "Real Madrid" },
      { value: 200, year: 2024, club: "Real Madrid" },
    ]),
    player("Kylian Mbappé", "France", "fr", "342229", [
      { value: 35, year: 2017, club: "Monaco" },
      { value: 200, year: 2018, club: "Paris Saint-Germain" },
      { value: 160, year: 2022, club: "Paris Saint-Germain" },
      { value: 180, year: 2024, club: "Real Madrid" },
    ]),
    player("Lionel Messi", "Argentina", "ar", "28003", [
      { value: 80, year: 2010, club: "Barcelona" },
      { value: 120, year: 2013, club: "Barcelona" },
      { value: 180, year: 2018, club: "Barcelona" },
      { value: 150, year: 2019, club: "Barcelona" },
      { value: 80, year: 2020, club: "Barcelona" },
    ]),
    player("Jude Bellingham", "England", "gb-eng", "581678", [
      { value: 11, year: 2020, club: "Borussia Dortmund" },
      { value: 55, year: 2022, club: "Borussia Dortmund" },
      { value: 120, year: 2023, club: "Real Madrid" },
      { value: 180, year: 2024, club: "Real Madrid" },
    ]),
    player("Neymar", "Brazil", "br", "68290", [
      { value: 10, year: 2013, club: "Barcelona" },
      { value: 70, year: 2015, club: "Barcelona" },
      { value: 100, year: 2017, club: "Paris Saint-Germain" },
      { value: 180, year: 2018, club: "Paris Saint-Germain" },
    ]),
    player("Antoine Griezmann", "France", "fr", "125781", [
      { value: 30, year: 2014, club: "Atlético Madrid" },
      { value: 80, year: 2016, club: "Atlético Madrid" },
      { value: 150, year: 2018, club: "Atlético Madrid" },
      { value: 50, year: 2022, club: "Atlético Madrid" },
    ]),
    player("Cristiano Ronaldo", "Portugal", "pt", "8198", [
      { value: 18, year: 2004, club: "Manchester United" },
      { value: 25, year: 2006, club: "Manchester United" },
      { value: 60, year: 2009, club: "Real Madrid" },
      { value: 120, year: 2014, club: "Real Madrid" },
      { value: 100, year: 2018, club: "Real Madrid" },
    ]),
    player("Luis Suárez", "Uruguay", "uy", "44352", [
      { value: 10, year: 2011, club: "Ajax" },
      { value: 52, year: 2014, club: "Liverpool" },
      { value: 90, year: 2016, club: "Barcelona" },
      { value: 70, year: 2018, club: "Barcelona" },
      { value: 25, year: 2020, club: "Atlético Madrid" },
    ]),
    player("Karim Benzema", "France", "fr", "18922", [
      { value: 35, year: 2010, club: "Real Madrid" },
      { value: 40, year: 2014, club: "Real Madrid" },
      { value: 60, year: 2018, club: "Real Madrid" },
      { value: 30, year: 2022, club: "Real Madrid" },
    ]),
    player("Luka Modrić", "Croatia", "hr", "27992", [
      { value: 30, year: 2012, club: "Real Madrid" },
      { value: 45, year: 2014, club: "Real Madrid" },
      { value: 25, year: 2018, club: "Real Madrid" },
      { value: 10, year: 2022, club: "Real Madrid" },
    ]),
    player("Mikel Oyarzabal", "Spain", "es", "351816", [
      { value: 12, year: 2016, club: "Real Sociedad" },
      { value: 30, year: 2019, club: "Real Sociedad" },
      { value: 60, year: 2021, club: "Real Sociedad" },
      { value: 45, year: 2024, club: "Real Sociedad" },
    ]),
    player("Gerard Moreno", "Spain", "es", "192279", [
      { value: 10, year: 2016, club: "Villarreal" },
      { value: 25, year: 2019, club: "Villarreal" },
      { value: 40, year: 2021, club: "Villarreal" },
      { value: 15, year: 2024, club: "Villarreal" },
    ]),
    player("Iago Aspas", "Spain", "es", "72071", [
      { value: 5, year: 2015, club: "Celta Vigo" },
      { value: 12, year: 2017, club: "Celta Vigo" },
      { value: 18, year: 2019, club: "Celta Vigo" },
      { value: 5, year: 2023, club: "Celta Vigo" },
    ]),
    player("Nabil Fekir", "France", "fr", "203496", [
      { value: 15, year: 2015, club: "Lyon" },
      { value: 60, year: 2018, club: "Lyon" },
      { value: 40, year: 2020, club: "Real Betis" },
      { value: 15, year: 2023, club: "Real Betis" },
    ]),
    player("Dani Olmo", "Spain", "es", "293385", [
      { value: 15, year: 2019, club: "Dinamo Zagreb" },
      { value: 35, year: 2021, club: "RB Leipzig" },
      { value: 50, year: 2023, club: "RB Leipzig" },
      { value: 60, year: 2024, club: "Barcelona" },
    ]),
    player("Pedri", "Spain", "es", "683840", [
      { value: 15, year: 2020, club: "Barcelona" },
      { value: 70, year: 2021, club: "Barcelona" },
      { value: 100, year: 2022, club: "Barcelona" },
      { value: 80, year: 2024, club: "Barcelona" },
    ]),
    player("Gavi", "Spain", "es", "646740", [
      { value: 25, year: 2021, club: "Barcelona" },
      { value: 60, year: 2022, club: "Barcelona" },
      { value: 90, year: 2023, club: "Barcelona" },
      { value: 70, year: 2024, club: "Barcelona" },
    ]),
    player("Takefusa Kubo", "Japan", "jp", "405398", [
      { value: 2, year: 2019, club: "Real Madrid" },
      { value: 12, year: 2021, club: "Real Mallorca" },
      { value: 30, year: 2023, club: "Real Sociedad" },
      { value: 60, year: 2024, club: "Real Sociedad" },
    ]),
    player("Raphinha", "Brazil", "br", "411295", [
      { value: 25, year: 2021, club: "Leeds United" },
      { value: 50, year: 2022, club: "Barcelona" },
      { value: 60, year: 2023, club: "Barcelona" },
      { value: 80, year: 2025, club: "Barcelona" },
    ]),
  ],
  seriea: [
    player("Lautaro Martínez", "Argentina", "ar", "406625", [
      { value: 20, year: 2018, club: "Inter" },
      { value: 70, year: 2020, club: "Inter" },
      { value: 110, year: 2023, club: "Inter" },
      { value: 120, year: 2025, club: "Inter" },
    ]),
    player("Victor Osimhen", "Nigeria", "ng", "401923", [
      { value: 12, year: 2019, club: "Lille" },
      { value: 50, year: 2021, club: "Napoli" },
      { value: 110, year: 2023, club: "Napoli" },
      { value: 75, year: 2025, club: "Galatasaray" },
    ]),
    player("Paulo Dybala", "Argentina", "ar", "206050", [
      { value: 12, year: 2015, club: "Palermo" },
      { value: 100, year: 2018, club: "Juventus" },
      { value: 60, year: 2021, club: "Juventus" },
      { value: 30, year: 2024, club: "Roma" },
    ]),
    player("Rafael Leão", "Portugal", "pt", "357164", [
      { value: 8, year: 2018, club: "Lille" },
      { value: 25, year: 2020, club: "Milan" },
      { value: 90, year: 2023, club: "Milan" },
      { value: 80, year: 2025, club: "Milan" },
    ]),
    player("Nicolò Barella", "Italy", "it", "269370", [
      { value: 12, year: 2018, club: "Cagliari" },
      { value: 50, year: 2020, club: "Inter" },
      { value: 80, year: 2023, club: "Inter" },
      { value: 70, year: 2025, club: "Inter" },
    ]),
    player("Khvicha Kvaratskhelia", "Georgia", "ge", "495666", [
      { value: 2, year: 2020, club: "Rubin Kazan" },
      { value: 15, year: 2022, club: "Napoli" },
      { value: 85, year: 2023, club: "Napoli" },
      { value: 80, year: 2025, club: "Paris Saint-Germain" },
    ]),
    player("Dušan Vlahović", "Serbia", "rs", "357498", [
      { value: 8, year: 2019, club: "Fiorentina" },
      { value: 60, year: 2021, club: "Fiorentina" },
      { value: 80, year: 2022, club: "Juventus" },
      { value: 50, year: 2025, club: "Juventus" },
    ]),
    player("Ciro Immobile", "Italy", "it", "105521", [
      { value: 6, year: 2013, club: "Torino" },
      { value: 38, year: 2018, club: "Lazio" },
      { value: 30, year: 2021, club: "Lazio" },
      { value: 6, year: 2024, club: "Beşiktaş" },
    ]),
    player("Mike Maignan", "France", "fr", "182906", [
      { value: 8, year: 2019, club: "Lille" },
      { value: 25, year: 2021, club: "Milan" },
      { value: 40, year: 2023, club: "Milan" },
      { value: 35, year: 2025, club: "Milan" },
    ]),
    player("Federico Chiesa", "Italy", "it", "341092", [
      { value: 10, year: 2018, club: "Fiorentina" },
      { value: 60, year: 2020, club: "Juventus" },
      { value: 40, year: 2023, club: "Juventus" },
      { value: 25, year: 2025, club: "Liverpool" },
    ]),
    player("Edin Džeko", "Bosnia and Herzegovina", "ba", "42092", [
      { value: 30, year: 2016, club: "Roma" },
      { value: 25, year: 2019, club: "Roma" },
      { value: 7, year: 2022, club: "Inter" },
      { value: 3, year: 2025, club: "Fiorentina" },
    ]),
    player("Giovanni Di Lorenzo", "Italy", "it", "212763", [
      { value: 2, year: 2018, club: "Empoli" },
      { value: 22, year: 2020, club: "Napoli" },
      { value: 30, year: 2023, club: "Napoli" },
      { value: 20, year: 2025, club: "Napoli" },
    ]),
    player("Ademola Lookman", "Nigeria", "ng", "475483", [
      { value: 10, year: 2018, club: "Everton" },
      { value: 15, year: 2021, club: "RB Leipzig" },
      { value: 45, year: 2024, club: "Atalanta" },
      { value: 50, year: 2025, club: "Atalanta" },
    ]),
    player("Riccardo Calafiori", "Italy", "it", "431060", [
      { value: 2, year: 2021, club: "Basel" },
      { value: 10, year: 2023, club: "Bologna" },
      { value: 50, year: 2024, club: "Arsenal" },
    ]),
    player("Matteo Politano", "Italy", "it", "180957", [
      { value: 14, year: 2018, club: "Sassuolo" },
      { value: 20, year: 2020, club: "Napoli" },
      { value: 15, year: 2023, club: "Napoli" },
    ]),
  ],
  ucl: [
    player("Erling Haaland", "Norway", "no", "418560", [
      { value: 8, year: 2020, club: "Red Bull Salzburg" },
      { value: 60, year: 2021, club: "Borussia Dortmund" },
      { value: 150, year: 2022, club: "Manchester City" },
      { value: 200, year: 2024, club: "Manchester City" },
    ]),
    player("Kylian Mbappé", "France", "fr", "342229", [
      { value: 35, year: 2017, club: "Monaco" },
      { value: 200, year: 2018, club: "Paris Saint-Germain" },
      { value: 160, year: 2022, club: "Paris Saint-Germain" },
      { value: 180, year: 2024, club: "Real Madrid" },
    ]),
    player("Vinícius Júnior", "Brazil", "br", "371998", [
      { value: 35, year: 2018, club: "Real Madrid" },
      { value: 45, year: 2020, club: "Real Madrid" },
      { value: 100, year: 2022, club: "Real Madrid" },
      { value: 200, year: 2024, club: "Real Madrid" },
    ]),
    player("Lionel Messi", "Argentina", "ar", "28003", [
      { value: 80, year: 2010, club: "Barcelona" },
      { value: 120, year: 2013, club: "Barcelona" },
      { value: 180, year: 2018, club: "Barcelona" },
      { value: 150, year: 2019, club: "Barcelona" },
      { value: 80, year: 2020, club: "Barcelona" },
    ]),
    player("Neymar", "Brazil", "br", "68290", [
      { value: 10, year: 2013, club: "Barcelona" },
      { value: 70, year: 2015, club: "Barcelona" },
      { value: 100, year: 2017, club: "Paris Saint-Germain" },
      { value: 180, year: 2018, club: "Paris Saint-Germain" },
    ]),
    player("Jude Bellingham", "England", "gb-eng", "581678", [
      { value: 11, year: 2020, club: "Borussia Dortmund" },
      { value: 55, year: 2022, club: "Borussia Dortmund" },
      { value: 120, year: 2023, club: "Real Madrid" },
      { value: 180, year: 2024, club: "Real Madrid" },
    ]),
    player("Harry Kane", "England", "gb-eng", "132098", [
      { value: 5, year: 2014, club: "Tottenham Hotspur" },
      { value: 40, year: 2016, club: "Tottenham Hotspur" },
      { value: 150, year: 2018, club: "Tottenham Hotspur" },
      { value: 120, year: 2021, club: "Tottenham Hotspur" },
      { value: 90, year: 2023, club: "Tottenham Hotspur" },
    ]),
    player("Mohamed Salah", "Egypt", "eg", "148455", [
      { value: 15, year: 2014, club: "Chelsea" },
      { value: 25, year: 2016, club: "Roma" },
      { value: 50, year: 2017, club: "Liverpool" },
      { value: 150, year: 2018, club: "Liverpool" },
      { value: 100, year: 2022, club: "Liverpool" },
    ]),
    player("Kevin De Bruyne", "Belgium", "be", "88755", [
      { value: 8, year: 2013, club: "Chelsea" },
      { value: 45, year: 2015, club: "Manchester City" },
      { value: 150, year: 2018, club: "Manchester City" },
      { value: 120, year: 2020, club: "Manchester City" },
      { value: 70, year: 2023, club: "Manchester City" },
    ]),
    player("Cristiano Ronaldo", "Portugal", "pt", "8198", [
      { value: 18, year: 2004, club: "Manchester United" },
      { value: 25, year: 2006, club: "Manchester United" },
      { value: 60, year: 2009, club: "Real Madrid" },
      { value: 120, year: 2014, club: "Real Madrid" },
      { value: 100, year: 2018, club: "Real Madrid" },
    ]),
    player("Robert Lewandowski", "Poland", "pl", "38253", [
      { value: 10, year: 2011, club: "Borussia Dortmund" },
      { value: 45, year: 2014, club: "Bayern Munich" },
      { value: 90, year: 2020, club: "Bayern Munich" },
      { value: 45, year: 2022, club: "Barcelona" },
    ]),
    player("Thomas Müller", "Germany", "de", "58358", [
      { value: 30, year: 2010, club: "Bayern Munich" },
      { value: 45, year: 2012, club: "Bayern Munich" },
      { value: 75, year: 2014, club: "Bayern Munich" },
      { value: 25, year: 2020, club: "Bayern Munich" },
    ]),
    player("Bernardo Silva", "Portugal", "pt", "241641", [
      { value: 15, year: 2015, club: "Monaco" },
      { value: 50, year: 2017, club: "Manchester City" },
      { value: 80, year: 2021, club: "Manchester City" },
      { value: 70, year: 2024, club: "Manchester City" },
    ]),
    player("Son Heung-min", "South Korea", "kr", "91845", [
      { value: 25, year: 2015, club: "Tottenham Hotspur" },
      { value: 50, year: 2018, club: "Tottenham Hotspur" },
      { value: 90, year: 2022, club: "Tottenham Hotspur" },
      { value: 45, year: 2024, club: "Tottenham Hotspur" },
    ]),
    player("Lautaro Martínez", "Argentina", "ar", "406625", [
      { value: 25, year: 2018, club: "Inter Milan" },
      { value: 70, year: 2021, club: "Inter Milan" },
      { value: 90, year: 2023, club: "Inter Milan" },
      { value: 110, year: 2024, club: "Inter Milan" },
    ]),
    player("Rodri", "Spain", "es", "357565", [
      { value: 40, year: 2019, club: "Manchester City" },
      { value: 70, year: 2021, club: "Manchester City" },
      { value: 100, year: 2023, club: "Manchester City" },
      { value: 130, year: 2024, club: "Manchester City" },
    ]),
    player("Achraf Hakimi", "Morocco", "ma", "398073", [
      { value: 40, year: 2019, club: "Borussia Dortmund" },
      { value: 60, year: 2021, club: "Paris Saint-Germain" },
      { value: 70, year: 2023, club: "Paris Saint-Germain" },
      { value: 80, year: 2024, club: "Paris Saint-Germain" },
    ]),
    player("Julián Álvarez", "Argentina", "ar", "576024", [
      { value: 20, year: 2022, club: "Manchester City" },
      { value: 50, year: 2023, club: "Manchester City" },
      { value: 90, year: 2024, club: "Atlético Madrid" },
      { value: 100, year: 2025, club: "Atlético Madrid" },
    ]),
    player("Bukayo Saka", "England", "gb-eng", "433177", [
      { value: 10, year: 2019, club: "Arsenal" },
      { value: 40, year: 2021, club: "Arsenal" },
      { value: 90, year: 2023, club: "Arsenal" },
      { value: 150, year: 2025, club: "Arsenal" },
    ]),
    player("Jamal Musiala", "Germany", "de", "580195", [
      { value: 10, year: 2020, club: "Bayern Munich" },
      { value: 50, year: 2022, club: "Bayern Munich" },
      { value: 110, year: 2023, club: "Bayern Munich" },
      { value: 140, year: 2025, club: "Bayern Munich" },
    ]),
  ],
};
