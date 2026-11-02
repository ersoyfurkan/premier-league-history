import { LEAGUE_META, isEspnComp } from "@/lib/leagues";
import { isTournamentComp, type Competition, type TournamentComp } from "@/lib/competitions";

const TOURNAMENT_GAME: Record<TournamentComp, string> = { worldcup: "/world-cup/game", euros: "/euros/game", copa: "/copa-america/game" };
export const lobbyFor = (comp: Competition | undefined) =>
  comp === "general"
    ? "/game/general"
    : comp && isTournamentComp(comp)
      ? `${TOURNAMENT_GAME[comp]}?mode=league`
      : `${comp === "ucl" ? "/champions-league/game" : comp && isEspnComp(comp) ? LEAGUE_META[comp].game : "/game"}?mode=league`;
export const parseComp = (value: unknown): Competition =>
  value === "ucl" || value === "general" || isTournamentComp(value) || isEspnComp(value) ? value : "pl";
