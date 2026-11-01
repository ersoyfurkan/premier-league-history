"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FOOTBALL_TIC_TAC_TOE } from "@/data/footballTicTacToe";
import { lobbyFor, parseComp, type Competition } from "@/lib/gameRoom";
import type { FootballTicTacToeRoomView } from "@/lib/footballTicTacToe";

type Api = {
  error?: string;
  code?: string;
  token?: string;
  view?: FootballTicTacToeRoomView;
};

const POLL_MS = 1500;

function FootballTicTacToeClient() {
  const search = useSearchParams();
  const router = useRouter();
  const code = (search.get("code") ?? "").toUpperCase();
  const comp = parseComp(search.get("comp")) as Competition;
  const storageKey = `plttt:${code}`;
  const joining = useRef(false);

  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<FootballTicTacToeRoomView | null>(null);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fatal, setFatal] = useState<string | null>(code ? null : "No room code in this link.");
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const activeComp = view?.comp ?? comp;
  const puzzle = FOOTBALL_TIC_TAC_TOE[activeComp];

  useEffect(() => {
    if (!code || joining.current) return;
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
  }, [code, storageKey]);

  const refresh = useCallback(async () => {
    if (!token) return;
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
      setView(data.view ?? null);
      setError(null);
    } catch {
      setError("Connection interrupted. Reconnecting…");
    }
  }, [code, token, setError]);

  useEffect(() => {
    if (!token) return;
    const first = setTimeout(refresh, 0);
    const timer = setInterval(refresh, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [token, refresh]);

  const submitMove = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedCell === null || !token) return;
    setError(null);
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
      setView(data.view ?? null);
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
  const turnMessage = view.status === "waiting"
    ? "Waiting for your friend to join."
    : view.status === "finished"
      ? view.winner === null
        ? "It's a draw!"
        : view.winner === view.you
          ? "You win!"
          : "Your friend wins!"
      : isMyTurn
        ? "Your turn — choose an empty square and name a player."
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
          <p className="section-eyebrow text-accent">{competitionLabel} · Online vs Friend</p>
          <h2 className="mt-2 text-3xl md:text-5xl">Football Tic-Tac-Toe</h2>
        </div>
        <p className="text-lg text-fore-muted">{turnMessage}</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface/70 p-4 md:p-6">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[150px_repeat(3,minmax(130px,1fr))] gap-2">
            <div />
            {puzzle.columns.map((column) => (
              <div key={column} className="flex min-h-20 items-center justify-center rounded-xl border border-accent/30 bg-accent/5 p-3 text-center text-sm font-semibold">
                {column}
              </div>
            ))}

            {puzzle.rows.map((row, rowIndex) => (
              <div key={row} className="contents">
                <div className="flex min-h-32 items-center rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm font-semibold">
                  {row}
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
                      className={`min-h-32 rounded-xl border p-3 text-center transition ${
                        selectedCell === index
                          ? "border-primary bg-primary/15"
                          : cell?.side === "p1"
                            ? "border-primary/40 bg-primary/10"
                            : cell?.side === "p2"
                              ? "border-accent/40 bg-accent/10"
                              : "border-border bg-background/70 hover:border-primary/50"
                      } disabled:cursor-default disabled:hover:border-border`}
                      aria-label={`${row} and ${column}${cell ? `: ${cell.player}` : ""}`}
                    >
                      {cell ? (
                        <>
                          <span className={`block text-xs font-mono ${cell.side === "p1" ? "text-primary" : "text-accent"}`}>
                            {cell.side === "p1" ? "X" : "O"}
                          </span>
                          <span className="mt-1 block font-semibold">{cell.player}</span>
                        </>
                      ) : (
                        <span className="text-sm text-fore-muted">
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
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-surface/70 p-5 md:p-6">
        <p className="text-sm text-fore-muted">
          You are <span className={view.you === "p1" ? "font-bold text-primary" : "font-bold text-accent"}>{view.you === "p1" ? "X" : "O"}</span>.
          Take turns naming a real player who matches both clues. First to complete a line wins.
        </p>
        {view.status === "playing" && isMyTurn && selectedCell !== null && (
          <form onSubmit={submitMove} className="mt-4 flex flex-wrap gap-3">
            <label htmlFor="football-player-answer" className="sr-only">Player name</label>
            <input
              id="football-player-answer"
              autoComplete="off"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Enter a player matching both clues"
              className="min-w-60 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              maxLength={80}
            />
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
