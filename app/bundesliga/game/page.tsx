import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function BundesligaGamePage() {
  return (
    <GameModeChooser label="Bundesliga" leagueHref="/bundesliga/game">
      <GameLobby comp="bundesliga" />
    </GameModeChooser>
  );
}
