import TournamentQuiz from "@/components/TournamentQuiz";
import GameModeChooser from "@/components/GameModeChooser";

export default function WorldCupGamePage() {
  return (
    <GameModeChooser label="World Cup" leagueHref="/world-cup/game">
      <TournamentQuiz tk="worldcup" />
    </GameModeChooser>
  );
}
