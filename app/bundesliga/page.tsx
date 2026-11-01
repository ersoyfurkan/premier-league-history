import LeagueDashboard from "@/components/LeagueDashboard";
import { bundesligaAllTime, bundesligaClubs, bundesligaRivalries, bundesligaSeasons, bundesligaWinners } from "@/data/bundesliga";

export default function BundesligaPage() {
  return (
    <LeagueDashboard
      config={{
        comp: "bundesliga",
        name: "Bundesliga",
        api: "/api/bundesliga",
        home: "/bundesliga",
        weeks: 34,
        logoId: "10",
        region: "German",
        since: "1963",
        seasons: bundesligaSeasons,
        clubs: bundesligaClubs,
        rivalries: bundesligaRivalries,
        allTime: bundesligaAllTime,
        winners: bundesligaWinners,
        seasonDecades: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
      }}
    />
  );
}
