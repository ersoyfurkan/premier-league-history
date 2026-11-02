import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function WorldCupGamePage() {
  return (
    <GameModeChooser label="World Cup" leagueHref="/world-cup/game">
      <GameLobby comp="worldcup" />
    </GameModeChooser>
  );
}
