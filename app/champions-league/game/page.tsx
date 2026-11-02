import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function ChampionsLeagueGamePage() {
  return (
    <GameModeChooser label="Champions League" leagueHref="/champions-league/game">
      <GameLobby comp="ucl" />
    </GameModeChooser>
  );
}
