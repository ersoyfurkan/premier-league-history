import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function SuperLigGamePage() {
  return (
    <GameModeChooser label="Süper Lig" leagueHref="/super-lig/game">
      <GameLobby comp="superlig" />
    </GameModeChooser>
  );
}
