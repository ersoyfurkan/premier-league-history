"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FOOTBALL_TIC_TAC_TOE,
  FOOTBALL_TIC_TAC_TOE_VARIANTS,
  isFootballTicTacToeAnswer,
  normalizeFootballPlayerName,
} from "@/data/footballTicTacToe";
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
  const playerInputRef = useRef<HTMLInputElement>(null);

  const [token, setToken] = useState<string | null>(null);
  const [remoteView, setRemoteView] = useState<FootballTicTacToeRoomView | null>(null);
  const [localRoom, setLocalRoom] = useState<FootballTicTacToeRoomState | null>(null);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
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
    if (selectedCell === null) return;
    const frame = requestAnimationFrame(() => {
      playerInputRef.current?.focus();
      playerInputRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedCell]);

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
    const players = poolFor(activeComp);
    const names = new Map<string, string>();
    for (const player of players) names.set(normalizeFootballPlayerName(player.name), player.name);
    for (const variant of FOOTBALL_TIC_TAC_TOE_VARIANTS[activeComp]) {
      for (const row of variant.answers) {
        for (const answers of row) {
          for (const name of answers) {
            const normalized = normalizeFootballPlayerName(name);
            if (!names.has(normalized)) names.set(normalized, name);
          }
        }
      }
    }

    return [...names.entries()]
      .filter(([normalized]) => normalized.includes(query) && !usedPlayers.has(normalized))
      .sort(([a], [b]) => Number(!a.startsWith(query)) - Number(!b.startsWith(query)))
      .slice(0, 10)
      .map(([normalized, name]) => ({
        name,
        card: players.find((player) => normalizeFootballPlayerName(player.name) === normalized),
        fitsClues: isFootballTicTacToeAnswer(activeComp, selectedCell, name, puzzle),
      }));
  }, [activeComp, playerName, puzzle, selectedCell, view]);

  const playAnswer = async (player: string) => {
    if (selectedCell === null || submittingAnswer) return;
    setError(null);
    setSubmittingAnswer(true);
    if (isLocal && localRoom) {
      const next = { ...localRoom, board: [...localRoom.board] };
      const moveError = applyFootballTicTacToeMove(
        next,
        next.turn,
        selectedCell,
        player,
        clockNow,
      );
      if (moveError) {
        setLocalRoom(next);
        setError(moveError);
        setSubmittingAnswer(false);
        return;
      }
      setLocalRoom(next);
      setSelectedCell(null);
      setPlayerName("");
      setSubmittingAnswer(false);
      return;
    }
    if (!token) {
      setSubmittingAnswer(false);
      return;
    }
    try {
      const res = await fetch("/api/game/football-tic-tac-toe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "move",
          code,
          token,
          cell: selectedCell,
          player,
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
    } finally {
      setSubmittingAnswer(false);
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

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3 lg:mt-2">
        <div>
          <p className="section-eyebrow text-accent">{competitionLabel} · {isLocal ? "Same device" : "Online vs Friend"}</p>
          <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl">Tik Tak Toe</h2>
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
      <div
        className="mx-auto mt-3 w-full rounded-2xl border border-emerald-500/20 bg-surface/70 p-2 sm:p-3 lg:mt-2"
        style={{ maxWidth: "min(920px, max(300px, calc(100svh - 400px)))" }}
      >
        <div className="grid aspect-square grid-cols-4 grid-rows-4 overflow-hidden rounded-xl border border-emerald-500/20">
            <div className="flex min-h-0 min-w-0 flex-col items-center justify-center gap-1 bg-indigo-800 p-1 text-center text-[9px] font-black uppercase tracking-wide text-white sm:gap-2 sm:text-sm">
              <span className="text-xl sm:text-4xl" aria-hidden="true">⚽</span>
            </div>
            {puzzle.columns.map((column) => (
              <div key={column.label} className="flex min-h-0 min-w-0 flex-col items-center justify-center gap-1 border border-emerald-950 bg-emerald-900 p-1 text-center text-[clamp(7px,1.05vw,14px)] font-semibold leading-tight text-white sm:gap-2 sm:p-2">
                {column.badge && (
                  <UclImage src={column.badge} alt={column.badgeAlt ?? column.label} className="h-5 w-5 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
                )}
                <span className="min-w-0 max-w-full [overflow-wrap:anywhere]">{column.label}</span>
              </div>
            ))}
            {puzzle.rows.map((row, rowIndex) => (
              <div key={row.label} className="contents">
                <div className="flex min-h-0 min-w-0 flex-col items-center justify-center gap-1 border border-emerald-950 bg-emerald-900 p-1 text-center text-[clamp(7px,1.05vw,14px)] font-semibold leading-tight text-white sm:gap-2 sm:p-2">
                  {row.badge && (
                    <UclImage src={row.badge} alt={row.badgeAlt ?? row.label} className="h-5 w-5 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
                  )}
                  <span className="min-w-0 max-w-full [overflow-wrap:anywhere]">{row.label}</span>
                </div>
                {puzzle.columns.map((column, columnIndex) => {
                  const index = rowIndex * 3 + columnIndex;
                  const cell = view.board[index];
                  const selectable = view.status === "playing" && isMyTurn && !cell;
                  return (
                    <button
                      key={`${rowIndex}-${columnIndex}`}
                      type="button"
                      disabled={!selectable}
                      onClick={() => {
                        setSelectedCell(index);
                        setPlayerName("");
                        setError(null);
                      }}
                      className={`relative flex min-h-0 min-w-0 touch-manipulation flex-col items-center justify-center gap-1 border border-emerald-950 p-1 text-center transition sm:gap-2 sm:p-3 ${
                        selectedCell === index
                          ? "bg-lime-500/30 ring-2 ring-inset ring-lime-300"
                          : cell?.side === "p1"
                            ? "bg-emerald-600"
                            : cell?.side === "p2"
                              ? "bg-teal-600"
                              : "bg-emerald-700/80 hover:bg-emerald-600"
                      } disabled:cursor-default disabled:hover:border-border`}
                      aria-label={`${row.label} and ${column.label}${cell ? `: ${cell.player}` : ""}`}
                    >
                      {cell ? (
                        <>
                          <JerseyIcon className="h-8 w-8 text-white/50 sm:h-16 sm:w-16" />
                          <span className={`absolute top-1 text-[9px] font-black sm:top-2 sm:text-xs ${cell.side === "p1" ? "text-lime-200" : "text-cyan-100"}`}>
                            {cell.side === "p1" ? "X" : "O"}
                          </span>
                          <span className="line-clamp-2 max-w-full break-words text-[9px] font-bold leading-tight text-white sm:text-sm">{cell.player}</span>
                        </>
                      ) : (
                        <>
                          <span className="relative">
                            <JerseyIcon className="h-8 w-8 text-emerald-950/30 sm:h-16 sm:w-16" />
                            <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-emerald-300/70 sm:text-4xl">+</span>
                          </span>
                          <span className="max-w-full [overflow-wrap:anywhere] text-[clamp(6px,0.8vw,11px)] font-black uppercase leading-tight text-emerald-950/60">
                            {selectable ? (selectedCell === index ? "Search player" : "Choose player") : "—"}
                          </span>
                        </>
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
          <div className="mt-4 flex flex-wrap items-start gap-3">
            <div className="w-full">
              <h3 className="text-lg font-bold">Player Search</h3>
              <p className="mt-1 text-sm leading-6 text-fore-muted">
                Find a past or present player who matches <strong>{puzzle.rows[Math.floor(selectedCell / 3)].label}</strong> and <strong>{puzzle.columns[selectedCell % 3].label}</strong>.
              </p>
            </div>
            <label htmlFor="football-player-answer" className="sr-only">Player name</label>
            <div className="relative min-w-0 flex-1">
              <input
                id="football-player-answer"
                ref={playerInputRef}
                autoComplete="off"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Type a player name"
                className="w-full rounded-xl border-2 border-lime-400/80 bg-background px-4 py-3 text-foreground outline-none focus:border-lime-300 focus:ring-2 focus:ring-lime-400/20"
                maxLength={80}
                role="combobox"
                aria-expanded={suggestions.length > 0}
                aria-controls="football-player-suggestions"
              />
              {suggestions.length > 0 && (
                <div id="football-player-suggestions" role="listbox" className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-surface shadow-xl">
                  {suggestions.map(({ name, card, fitsClues }) => (
                    <button
                      key={name}
                      type="button"
                      role="option"
                      aria-selected={playerName === name}
                      disabled={submittingAnswer}
                      onClick={() => void playAnswer(name)}
                      className="flex w-full items-center gap-3 border-b border-border/50 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-primary/10 disabled:opacity-60"
                    >
                      {card?.photo ? (
                        <UclImage src={card.photo} alt="" className="h-9 w-9" shape="circle" />
                      ) : activeComp === "pl" && card ? (
                        <PlayerPhoto id={card.id} name={name} />
                      ) : (
                        <UclImage alt={name} className="h-9 w-9" shape="circle" />
                      )}
                      <span className="min-w-0 flex-1 truncate">{name}</span>
                      <span className={`shrink-0 text-[10px] font-semibold ${fitsClues ? "text-emerald-400" : "text-fore-muted"}`}>
                        {submittingAnswer ? "Playing…" : fitsClues ? "Tap to play" : "Tap to try"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
    <main className="min-h-[calc(100svh-5rem)] bg-background text-foreground grid-bg px-4 py-4 md:px-8 md:py-6 lg:py-4">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/game" className="section-title text-2xl md:text-4xl lg:text-3xl">Game Arena</Link>
          <Link href="/game" className="btn-ghost">Leave</Link>
        </div>
        {children}
      </section>
    </main>
  );
}

function JerseyIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} fill="currentColor">
      <path d="M21 7 11 12 3 28l10 5 5-8v32h28V25l5 8 10-5-8-16L43 7c-2 5-6 8-11 8s-9-3-11-8Z" />
      <path d="M25 8c1 4 4 6 7 6s6-2 7-6l-4-2h-6l-4 2Z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function FootballTicTacToePage() {
  return (
    <Suspense fallback={<Shell><p className="mt-6 text-fore-muted">Loading game…</p></Shell>}>
      <FootballTicTacToeClient />
    </Suspense>
  );
}
