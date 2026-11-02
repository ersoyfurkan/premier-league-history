import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function EurosGamePage() {
  return (
    <GameModeChooser label="Euros" leagueHref="/euros/game">
      <GameLobby comp="euros" />
    </GameModeChooser>
  );
}
