import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function SerieAGamePage() {
  return (
    <GameModeChooser label="Serie A" leagueHref="/serie-a/game">
      <GameLobby comp="seriea" />
    </GameModeChooser>
  );
}
