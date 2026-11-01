import LeagueDashboard from "@/components/LeagueDashboard";
import { superligAllTime, superligClubs, superligRivalries, superligSeasons, superligWinners } from "@/data/superlig";

export default function SuperLigPage() {
  return (
    <LeagueDashboard
      config={{
        comp: "superlig",
        name: "Süper Lig",
        api: "/api/super-lig",
        home: "/super-lig",
        weeks: 34,
        logoId: "18",
        region: "Turkish",
        since: "1959",
        seasons: superligSeasons,
        clubs: superligClubs,
        rivalries: superligRivalries,
        allTime: superligAllTime,
        winners: superligWinners,
        seasonDecades: ["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
      }}
    />
  );
}
