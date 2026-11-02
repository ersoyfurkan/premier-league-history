import GameLobby from "@/components/GameLobby";
import GameModeChooser from "@/components/GameModeChooser";

export default function LaLigaGamePage() {
  return (
    <GameModeChooser label="La Liga" leagueHref="/la-liga/game">
      <GameLobby comp="laliga" />
    </GameModeChooser>
  );
}
