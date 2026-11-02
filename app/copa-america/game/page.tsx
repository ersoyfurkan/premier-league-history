import TournamentQuiz from "@/components/TournamentQuiz";
import GameModeChooser from "@/components/GameModeChooser";

export default function CopaGamePage() {
  return (
    <GameModeChooser label="Copa América" leagueHref="/copa-america/game">
      <TournamentQuiz tk="copa" />
    </GameModeChooser>
  );
}
