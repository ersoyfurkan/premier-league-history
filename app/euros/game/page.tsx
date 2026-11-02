import TournamentQuiz from "@/components/TournamentQuiz";
import GameModeChooser from "@/components/GameModeChooser";

export default function EurosGamePage() {
  return (
    <GameModeChooser label="Euros" leagueHref="/euros/game">
      <TournamentQuiz tk="euros" />
    </GameModeChooser>
  );
}
