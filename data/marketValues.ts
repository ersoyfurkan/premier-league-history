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
  ],
};
