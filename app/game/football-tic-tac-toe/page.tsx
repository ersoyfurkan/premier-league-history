"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FOOTBALL_TIC_TAC_TOE, normalizeFootballPlayerName } from "@/data/footballTicTacToe";
import PlayerPhoto from "@/components/PlayerPhoto";
import UclImage from "@/components/UclImage";
import { poolFor, lobbyFor, parseComp, type Competition } from "@/lib/gameRoom";
import {
  applyFootballTicTacToeMove,
  expireFootballTicTacToeTurn,
  footballTicTacToeView,
  newFootballTicTacToeRoom,
  type FootballTicTacToeRoomState,
  type FootballTicTacToeRoomView,
} from "@/lib/footballTicTacToe";

type Api = {
  error?: string;
  code?: string;
  token?: string;
  view?: FootballTicTacToeRoomView;
};

const POLL_MS = 1500;
const TURN_MS = 60_000;

function FootballTicTacToeClient() {
  const search = useSearchParams();
  const router = useRouter();
  const code = (search.get("code") ?? "").toUpperCase();
  const isLocal = search.get("local") === "1";
  const comp = parseComp(search.get("comp")) as Competition;
  const storageKey = `plttt:${code}`;
  const joining = useRef(false);

  const [token, setToken] = useState<string | null>(null);
  const [remoteView, setRemoteView] = useState<FootballTicTacToeRoomView | null>(null);
  const [localRoom, setLocalRoom] = useState<FootballTicTacToeRoomState | null>(null);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [serverFatal, setFatal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [clockNow, setClockNow] = useState(0);
  const view = isLocal && localRoom
    ? footballTicTacToeView(localRoom, localRoom.turn)
    : remoteView;
  const fatal = serverFatal ?? (!isLocal && !code ? "No room code in this link." : null);
  const activeComp = view?.comp ?? comp;
  const puzzle = view?.puzzle ?? FOOTBALL_TIC_TAC_TOE[activeComp];

  useEffect(() => {
    if (!isLocal) return;
    const timer = setTimeout(() => {
      const room = newFootballTicTacToeRoom("local-player-1", comp);
      room.p2Token = "local-player-2";
      room.status = "playing";
      room.turnDeadline = Date.now() + TURN_MS;
      setLocalRoom(room);
    }, 0);
    return () => clearTimeout(timer);
  }, [comp, isLocal]);

  useEffect(() => {
    const first = setTimeout(() => setClockNow(Date.now()), 0);
    const interval = setInterval(() => setClockNow(Date.now()), 250);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isLocal) return;
    const interval = setInterval(() => {
      setLocalRoom((current) => {
        if (!current) return current;
        const next = { ...current };
        return expireFootballTicTacToeTurn(next, Date.now()) ? next : current;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isLocal]);

  useEffect(() => {
    if (isLocal || !code || joining.current) return;
    joining.current = true;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      queueMicrotask(() => setToken(saved));
      return;
    }

    fetch("/api/game/football-tic-tac-toe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", code }),
    })
      .then(async (res) => {
        const data = (await res.json()) as Api;
        if (!res.ok || !data.token) throw new Error(data.error ?? "Could not join game");
        localStorage.setItem(storageKey, data.token);
        setToken(data.token);
      })
      .catch((cause: Error) => setFatal(cause.message));
  }, [code, isLocal, storageKey]);

  const refresh = useCallback(async () => {
    if (isLocal || !token) return;
    try {
      const res = await fetch(
        `/api/game/football-tic-tac-toe?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as Api;
      if (!res.ok) {
        if (res.status === 404 || res.status === 403) setFatal(data.error ?? "Room unavailable");
        return;
      }
      setRemoteView(data.view ?? null);
      setError(null);
    } catch {
      setError("Connection interrupted. Reconnecting…");
    }
  }, [code, isLocal, token]);

  useEffect(() => {
    if (!token) return;
    const first = setTimeout(refresh, 0);
    const timer = setInterval(refresh, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [isLocal, token, refresh]);

  const suggestions = useMemo(() => {
    if (selectedCell === null || !playerName.trim()) return [];
    const query = normalizeFootballPlayerName(playerName);
    const usedPlayers = new Set(
      view?.board
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
        .map((entry) => normalizeFootballPlayerName(entry.player)),
    );
    const answers = puzzle.answers[Math.floor(selectedCell / 3)][selectedCell % 3]
      .filter((name, index, list) =>
        normalizeFootballPlayerName(name).includes(query) &&
        !usedPlayers.has(normalizeFootballPlayerName(name)) &&
        list.findIndex((other) => normalizeFootballPlayerName(other) === normalizeFootballPlayerName(name)) === index,
      )
      .slice(0, 8);
    const players = poolFor(activeComp);
    return answers.map((name) => ({
      name,
      card: players.find((player) => normalizeFootballPlayerName(player.name) === normalizeFootballPlayerName(name)),
    }));
  }, [activeComp, playerName, puzzle, selectedCell, view]);

  const submitMove = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedCell === null) return;
    setError(null);
    if (isLocal && localRoom) {
      const next = { ...localRoom, board: [...localRoom.board] };
      const moveError = applyFootballTicTacToeMove(
        next,
        next.turn,
        selectedCell,
        playerName,
        Date.now(),
      );
      if (moveError) {
        setLocalRoom(next);
        setError(moveError);
        return;
      }
      setLocalRoom(next);
      setSelectedCell(null);
      setPlayerName("");
      return;
    }
    if (!token) return;
    try {
      const res = await fetch("/api/game/football-tic-tac-toe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "move",
          code,
          token,
          cell: selectedCell,
          player: playerName,
        }),
      });
      const data = (await res.json()) as Api;
      if (!res.ok) {
        setError(data.error ?? "Could not play that answer");
        void refresh();
        return;
      }
      setRemoteView(data.view ?? null);
      setSelectedCell(null);
      setPlayerName("");
    } catch {
      setError("Could not submit your move. Please try again.");
    }
  };

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/game/football-tic-tac-toe?code=${code}&comp=${activeComp}`
      : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the invite link. Copy it from the text above.");
    }
  };

  const playAgain = async () => {
    if (isLocal) {
      const room = newFootballTicTacToeRoom("local-player-1", activeComp);
      room.p2Token = "local-player-2";
      room.status = "playing";
      room.turnDeadline = Date.now() + TURN_MS;
      setLocalRoom(room);
      setSelectedCell(null);
      setPlayerName("");
      setError(null);
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/game/football-tic-tac-toe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", comp: activeComp }),
      });
      const data = (await res.json()) as Api;
      if (!res.ok || !data.code || !data.token) throw new Error(data.error ?? "Could not create another game");
      localStorage.setItem(`plttt:${data.code}`, data.token);
      router.push(`/game/football-tic-tac-toe?code=${data.code}&comp=${activeComp}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create another game");
      setCreating(false);
    }
  };

  if (fatal) {
    return (
      <Shell>
        <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-6">
          <p className="text-lg text-warning">{fatal}</p>
          <Link href={lobbyFor(activeComp)} className="btn-primary mt-4 inline-block">Back to lobby</Link>
        </div>
      </Shell>
    );
  }

  if (!view) {
    return (
      <Shell>
        <p className="mt-6 text-fore-muted">Connecting to the game…</p>
      </Shell>
    );
  }

  const isMyTurn = view.turn === view.you;
  const competitionLabel = activeComp === "pl" ? "Premier League" : activeComp === "laliga" ? "La Liga" : "Champions League";
  const secondsLeft = view.status === "playing" && view.turnDeadline
    ? Math.min(60, Math.max(0, Math.ceil((view.turnDeadline - clockNow) / 1000)))
    : null;
  const currentPlayerName = isLocal ? (view.turn === "p1" ? "Player 1" : "Player 2") : "You";
  const turnMessage = view.status === "waiting"
    ? "Waiting for your friend to join."
    : view.status === "finished"
      ? view.winner === null
        ? "It's a draw!"
        : view.timedOut
          ? `${view.timedOut === view.you ? (isLocal ? `Player ${view.you === "p1" ? "1" : "2"}` : "You") : (isLocal ? `Player ${view.timedOut === "p1" ? "1" : "2"}` : "Your friend")} ran out of time.`
        : view.winner === view.you
          ? isLocal ? `${currentPlayerName} wins!` : "You win!"
          : isLocal ? `${view.winner === "p1" ? "Player 1" : "Player 2"} wins!` : "Your friend wins!"
      : isMyTurn
        ? `${isLocal ? `${currentPlayerName}'s turn` : "Your turn"} — choose a square and name a player.`
        : "Your friend is choosing a player…";

  return (
    <Shell>
      {view.status === "waiting" && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary-dim p-6 md:p-8">
          <p className="section-eyebrow text-primary">Invite a friend to play online</p>
          <p className="mt-3 break-all font-mono text-sm md:text-base">{shareUrl}</p>
          <button type="button" className="btn-primary mt-4" onClick={copyLink}>
            {copied ? "Copied!" : "Copy invite link"}
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow text-accent">{competitionLabel} · {isLocal ? "Same device" : "Online vs Friend"}</p>
          <h2 className="mt-2 text-3xl md:text-5xl">Football Tic-Tac-Toe</h2>
        </div>
        <div className="text-right">
          <p className="text-lg text-fore-muted">{turnMessage}</p>
          {secondsLeft !== null && (
            <p className={`mt-1 font-mono text-sm font-bold ${secondsLeft <= 10 ? "text-warning" : "text-primary"}`}>
              {isLocal ? currentPlayerName : isMyTurn ? "Your" : "Opponent"} timer: {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </p>
          )}
        </div>
      </div>

      {view.status !== "waiting" && (
      <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-2 sm:p-4 md:p-6">
          <div className="grid grid-cols-[minmax(64px,0.8fr)_repeat(3,minmax(0,1.35fr))] gap-1.5 sm:gap-2">
            <div />
            {puzzle.columns.map((column) => (
              <div key={column.label} className="flex min-h-20 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-accent/30 bg-accent/5 p-1.5 text-center text-[10px] font-semibold leading-tight break-words sm:flex-row sm:gap-2 sm:rounded-xl sm:p-3 sm:text-sm">
                {column.badge && (
                  <UclImage src={column.badge} alt={column.badgeAlt ?? column.label} className="h-6 w-6 sm:h-8 sm:w-8" />
                )}
                <span className="min-w-0">{column.label}</span>
              </div>
            ))}
            {puzzle.rows.map((row, rowIndex) => (
              <div key={row.label} className="contents">
                <div className="flex min-h-24 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-primary/30 bg-primary/5 p-1.5 text-center text-[10px] font-semibold leading-tight break-words sm:min-h-32 sm:flex-row sm:gap-2 sm:rounded-xl sm:p-3 sm:text-sm sm:text-left">
                  {row.badge && (
                    <UclImage src={row.badge} alt={row.badgeAlt ?? row.label} className="h-6 w-6 sm:h-8 sm:w-8" />
                  )}
                  <span className="min-w-0">{row.label}</span>
                </div>
                {puzzle.columns.map((column, columnIndex) => {
                  const index = rowIndex * 3 + columnIndex;
                  const cell = view.board[index];
                  const selectable = view.status === "playing" && isMyTurn && !cell;
                  return (
                    <button
                      key={`${row}-${column}`}
                      type="button"
                      disabled={!selectable}
                      onClick={() => {
                        setSelectedCell(index);
                        setError(null);
                      }}
                      className={`min-h-24 min-w-0 touch-manipulation rounded-lg border p-1.5 text-center transition sm:min-h-32 sm:rounded-xl sm:p-3 ${
                        selectedCell === index
                          ? "border-primary bg-primary/15"
                          : cell?.side === "p1"
                            ? "border-primary/40 bg-primary/10"
                            : cell?.side === "p2"
                              ? "border-accent/40 bg-accent/10"
                              : "border-border bg-background/70 hover:border-primary/50"
                      } disabled:cursor-default disabled:hover:border-border`}
                      aria-label={`${row.label} and ${column.label}${cell ? `: ${cell.player}` : ""}`}
                    >
                      {cell ? (
                        <>
                          <span className={`block text-xs font-mono ${cell.side === "p1" ? "text-primary" : "text-accent"}`}>
                            {cell.side === "p1" ? "X" : "O"}
                          </span>
                          <span className="mt-1 block break-words text-[10px] font-semibold leading-tight sm:text-sm">{cell.player}</span>
                        </>
                      ) : (
                        <span className="text-[10px] text-fore-muted sm:text-sm">
                          {selectable ? (selectedCell === index ? "Selected" : "Choose square") : "—"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
      </div>
      )}

      <div className="mt-5 rounded-2xl border border-border bg-surface/70 p-5 md:p-6">
        <p className="text-sm text-fore-muted">
          {isLocal ? `${currentPlayerName} is` : "You are"} <span className={view.you === "p1" ? "font-bold text-primary" : "font-bold text-accent"}>{view.you === "p1" ? "X" : "O"}</span>.
          Take turns naming a real player who matches both clues. First to complete a line wins.
        </p>
        {view.status === "playing" && isMyTurn && selectedCell !== null && (
          <form onSubmit={submitMove} className="mt-4 flex flex-wrap items-start gap-3">
            <label htmlFor="football-player-answer" className="sr-only">Player name</label>
            <div className="relative min-w-0 flex-1">
              <input
                id="football-player-answer"
                autoComplete="off"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Type a player name"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
                maxLength={80}
                role="combobox"
                aria-expanded={suggestions.length > 0}
                aria-controls="football-player-suggestions"
              />
              {suggestions.length > 0 && (
                <div id="football-player-suggestions" role="listbox" className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-surface shadow-xl">
                  {suggestions.map(({ name, card }) => (
                    <button
                      key={name}
                      type="button"
                      role="option"
                      aria-selected={playerName === name}
                      onClick={() => setPlayerName(name)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-primary/10"
                    >
                      {card?.photo ? (
                        <UclImage src={card.photo} alt="" className="h-9 w-9" shape="circle" />
                      ) : activeComp === "pl" && card ? (
                        <PlayerPhoto id={card.id} name={name} />
                      ) : (
                        <UclImage alt={name} className="h-9 w-9" shape="circle" />
                      )}
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={!playerName.trim()} className="btn-primary disabled:opacity-50">
              Play answer
            </button>
          </form>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-warning">{error}</p>}
        {view.status === "finished" && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={playAgain} disabled={creating} className="btn-primary disabled:opacity-60">
              {creating ? "Creating…" : "Play again"}
            </button>
            <Link href={lobbyFor(activeComp)} className="btn-ghost">Back to lobby</Link>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground grid-bg px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/game" className="section-title text-3xl md:text-5xl">Game Arena</Link>
          <Link href="/game" className="btn-ghost">Leave</Link>
        </div>
        {children}
      </section>
    </main>
  );
}

export default function FootballTicTacToePage() {
  return (
    <Suspense fallback={<Shell><p className="mt-6 text-fore-muted">Loading game…</p></Shell>}>
      <FootballTicTacToeClient />
    </Suspense>
  );
}
