import type { Competition } from "@/lib/gameRoom";

export type MarketValuePlayer = {
  name: string;
  club: string;
  peakValue: number;
  peakYear: number;
  source: string;
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

export const MARKET_VALUE_PLAYERS: Record<Competition, MarketValuePlayer[]> = {
  pl: [
    { name: "Erling Haaland", club: "Manchester City", peakValue: 200, peakYear: 2024, source: transfermarktHistory("Erling Haaland", "418560") },
    { name: "Raheem Sterling", club: "Manchester City", peakValue: 160, peakYear: 2019, source: transfermarktHistory("Raheem Sterling", "134425") },
    { name: "Mohamed Salah", club: "Liverpool", peakValue: 150, peakYear: 2018, source: transfermarktHistory("Mohamed Salah", "148455") },
    { name: "Harry Kane", club: "Tottenham Hotspur", peakValue: 150, peakYear: 2018, source: transfermarktHistory("Harry Kane", "132098") },
    { name: "Kevin De Bruyne", club: "Manchester City", peakValue: 150, peakYear: 2018, source: transfermarktHistory("Kevin De Bruyne", "88755") },
    { name: "Eden Hazard", club: "Chelsea", peakValue: 150, peakYear: 2018, source: transfermarktHistory("Eden Hazard", "50202") },
    { name: "Paul Pogba", club: "Manchester United", peakValue: 100, peakYear: 2019, source: transfermarktHistory("Paul Pogba", "122153") },
    { name: "Sadio Mané", club: "Liverpool", peakValue: 150, peakYear: 2019, source: transfermarktHistory("Sadio Mane", "200512") },
    { name: "Phil Foden", club: "Manchester City", peakValue: 150, peakYear: 2024, source: transfermarktHistory("Phil Foden", "406635") },
    { name: "Cristiano Ronaldo", club: "Real Madrid", peakValue: 120, peakYear: 2014, source: transfermarktHistory("Cristiano Ronaldo", "8198") },
  ],
  laliga: [
    { name: "Vinícius Júnior", club: "Real Madrid", peakValue: 200, peakYear: 2024, source: transfermarktHistory("Vinicius Junior", "371998") },
    { name: "Kylian Mbappé", club: "Paris Saint-Germain", peakValue: 200, peakYear: 2018, source: transfermarktHistory("Kylian Mbappe", "342229") },
    { name: "Lionel Messi", club: "Barcelona", peakValue: 180, peakYear: 2018, source: transfermarktHistory("Lionel Messi", "28003") },
    { name: "Jude Bellingham", club: "Real Madrid", peakValue: 180, peakYear: 2024, source: transfermarktHistory("Jude Bellingham", "581678") },
    { name: "Neymar", club: "Paris Saint-Germain", peakValue: 180, peakYear: 2018, source: transfermarktHistory("Neymar", "68290") },
    { name: "Antoine Griezmann", club: "Atlético Madrid", peakValue: 150, peakYear: 2018, source: transfermarktHistory("Antoine Griezmann", "125781") },
    { name: "Cristiano Ronaldo", club: "Real Madrid", peakValue: 120, peakYear: 2014, source: transfermarktHistory("Cristiano Ronaldo", "8198") },
    { name: "Luis Suárez", club: "Barcelona", peakValue: 90, peakYear: 2016, source: transfermarktHistory("Luis Suarez", "44352") },
    { name: "Karim Benzema", club: "Real Madrid", peakValue: 60, peakYear: 2022, source: transfermarktHistory("Karim Benzema", "18922") },
    { name: "Luka Modrić", club: "Real Madrid", peakValue: 50, peakYear: 2018, source: transfermarktHistory("Luka Modric", "27992") },
  ],
  ucl: [
    { name: "Erling Haaland", club: "Manchester City", peakValue: 200, peakYear: 2024, source: transfermarktHistory("Erling Haaland", "418560") },
    { name: "Kylian Mbappé", club: "Paris Saint-Germain", peakValue: 200, peakYear: 2018, source: transfermarktHistory("Kylian Mbappe", "342229") },
    { name: "Vinícius Júnior", club: "Real Madrid", peakValue: 200, peakYear: 2024, source: transfermarktHistory("Vinicius Junior", "371998") },
    { name: "Lionel Messi", club: "Barcelona", peakValue: 180, peakYear: 2018, source: transfermarktHistory("Lionel Messi", "28003") },
    { name: "Neymar", club: "Paris Saint-Germain", peakValue: 180, peakYear: 2018, source: transfermarktHistory("Neymar", "68290") },
    { name: "Jude Bellingham", club: "Real Madrid", peakValue: 180, peakYear: 2024, source: transfermarktHistory("Jude Bellingham", "581678") },
    { name: "Harry Kane", club: "Tottenham Hotspur", peakValue: 150, peakYear: 2018, source: transfermarktHistory("Harry Kane", "132098") },
    { name: "Mohamed Salah", club: "Liverpool", peakValue: 150, peakYear: 2018, source: transfermarktHistory("Mohamed Salah", "148455") },
    { name: "Kevin De Bruyne", club: "Manchester City", peakValue: 150, peakYear: 2018, source: transfermarktHistory("Kevin De Bruyne", "88755") },
    { name: "Cristiano Ronaldo", club: "Real Madrid", peakValue: 120, peakYear: 2014, source: transfermarktHistory("Cristiano Ronaldo", "8198") },
    { name: "Robert Lewandowski", club: "Bayern Munich", peakValue: 90, peakYear: 2020, source: transfermarktHistory("Robert Lewandowski", "38253") },
    { name: "Thomas Müller", club: "Bayern Munich", peakValue: 75, peakYear: 2014, source: transfermarktHistory("Thomas Muller", "58358") },
  ],
};
