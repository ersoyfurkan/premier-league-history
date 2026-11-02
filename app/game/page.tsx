import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function GameModePage() {
  return (
    <GameModeChooser label="Premier League" leagueHref="/game">
      <GameLobby comp="pl" />
    </GameModeChooser>
  );
}
