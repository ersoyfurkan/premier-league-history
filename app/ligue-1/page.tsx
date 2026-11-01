import LeagueDashboard from "@/components/LeagueDashboard";
import { ligue1AllTime, ligue1Clubs, ligue1Rivalries, ligue1Seasons, ligue1Winners } from "@/data/ligue1";

export default function Ligue1Page() {
  return (
    <LeagueDashboard
      config={{
        comp: "ligue1",
        name: "Ligue 1",
        api: "/api/ligue-1",
        home: "/ligue-1",
        weeks: 34,
        logoId: "9",
        region: "French",
        since: "1932",
        seasons: ligue1Seasons,
        clubs: ligue1Clubs,
        rivalries: ligue1Rivalries,
        allTime: ligue1AllTime,
        winners: ligue1Winners,
        seasonDecades: ["1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
      }}
    />
  );
}
