import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function Ligue1GamePage() {
  return (
    <GameModeChooser label="Ligue 1" leagueHref="/ligue-1/game">
      <GameLobby comp="ligue1" />
    </GameModeChooser>
  );
}
