import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function CopaGamePage() {
  return (
    <GameModeChooser label="Copa América" leagueHref="/copa-america/game">
      <GameLobby comp="copa" />
    </GameModeChooser>
  );
}
