"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  applyFootballMinesweeperAction,
  footballMinesweeperView,
  newFootballMinesweeperRoom,
  type FootballMinesweeperState,
  type FootballMinesweeperView,
  type MinesweeperAction,
  type MinesweeperSide,
} from "@/lib/footballMinesweeper";
import { COMPETITION_LABELS, type Competition } from "@/lib/competitions";
import { lobbyFor } from "@/lib/gameNavigation";

type Api = {
  error?: string;
  code?: string;
  token?: string;
  view?: FootballMinesweeperView;
};

const ENDPOINT = "/api/game/football-minesweeper";
const CODE_PATTERN = /^[A-HJ-NP-Z2-9]{6}$/;
const numberColors = ["", "text-sky-300", "text-lime-300", "text-amber-300", "text-rose-300", "text-fuchsia-300", "text-cyan-200", "text-white", "text-white"];

function Shell({ children, comp }: { children: ReactNode; comp: Competition }) {
  return (
    <main className="grid-bg min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <section className="mx-auto max-w-5xl">
        <Link href={lobbyFor(comp)} className="font-mono text-xs uppercase tracking-wider text-primary hover:text-accent">
          ← Game Arena
        </Link>
        <div className="mt-5 rounded-3xl border border-primary/20 bg-surface/80 p-5 shadow-glow-card sm:p-8">
          {children}
        </div>
      </section>
    </main>
  );
}

function MinesweeperClient() {
  const router = useRouter();
  const search = useSearchParams();
  const code = (search.get("code") ?? "").trim().toUpperCase();
  const isLocal = search.get("local") === "1";
  const compValue = search.get("comp") ?? "pl";
  const comp = (Object.hasOwn(COMPETITION_LABELS, compValue) ? compValue : "pl") as Competition;
  const storageKey = `football-minesweeper:${code}`;
  const joinRequests = useRef(new Map<string, Promise<Api>>());
  const [token, setToken] = useState<string | null>(null);
  const [localRoom, setLocalRoom] = useState<FootballMinesweeperState | null>(null);
  const [remoteView, setRemoteView] = useState<FootballMinesweeperView | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);
  const localView = localRoom ? footballMinesweeperView(localRoom, localRoom.turn) : null;
  const view = isLocal ? localView : remoteView;

  useEffect(() => {
    if (isLocal || !code || !CODE_PATTERN.test(code)) return;
    let cancelled = false;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      queueMicrotask(() => {
        if (!cancelled) setToken(saved);
      });
    } else {
      let request = joinRequests.current.get(code);
      if (!request) {
        request = fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "join", code }),
        }).then(async (response) => {
          const data = await response.json() as Api;
          if (!response.ok || !data.token) throw new Error(data.error ?? "Could not join this match.");
          return data;
        });
        joinRequests.current.set(code, request);
      }
      request.then((data) => {
        if (cancelled || !data.token) return;
        localStorage.setItem(storageKey, data.token);
        setToken(data.token);
      }).catch((cause: unknown) => {
        if (!cancelled) setFatal(cause instanceof Error ? cause.message : "Could not join this match.");
      }).finally(() => {
        if (joinRequests.current.get(code) === request) joinRequests.current.delete(code);
      });
    }
    return () => { cancelled = true; };
  }, [code, isLocal, storageKey]);

  const refresh = useCallback(async () => {
    if (isLocal || !token || !code) return;
    try {
      const response = await fetch(`${ENDPOINT}?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      const data = await response.json() as Api;
      if (!response.ok || !data.view) {
        if (response.status === 403 || response.status === 404) setFatal(data.error ?? "This match is unavailable.");
        return;
      }
      setRemoteView(data.view);
      setError(null);
    } catch {
      setError("Connection interrupted. Reconnecting…");
    }
  }, [code, isLocal, token]);

  useEffect(() => {
    if (!token || isLocal) return;
    const first = setTimeout(() => { void refresh(); }, 0);
    const interval = setInterval(() => { void refresh(); }, 1500);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [isLocal, refresh, token]);

  const startLocal = () => {
    const state = newFootballMinesweeperRoom("local-player-1");
    state.p2Token = "local-player-2";
    state.phase = "playing";
    state.notice = "Player 1 kicks off. Good luck!";
    setLocalRoom(state);
    setRemoteView(null);
    setFatal(null);
    setError(null);
    setFlagMode(false);
    router.push(`/game/football-minesweeper?local=1&comp=${comp}`);
  };

  const createOnline = async () => {
    setCreating(true);
    setError(null);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });
      const data = await response.json() as Api;
      if (!response.ok || !data.code || !data.token) throw new Error(data.error ?? "Could not create a match.");
      localStorage.setItem(`football-minesweeper:${data.code}`, data.token);
      router.push(`/game/football-minesweeper?code=${data.code}&comp=${comp}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create a match.");
      setCreating(false);
    }
  };

  const openRoom = () => {
    const normalized = joinCode.trim().toUpperCase();
    if (!CODE_PATTERN.test(normalized)) {
      setError("Enter a valid six-character room code.");
      return;
    }
    router.push(`/game/football-minesweeper?code=${normalized}&comp=${comp}`);
  };

  const playAction = async (action: MinesweeperAction) => {
    if (!view || view.phase !== "playing") return;
    setError(null);
    if (isLocal && localRoom) {
      const next: FootballMinesweeperState = {
        ...localRoom,
        scores: { ...localRoom.scores },
        lives: { ...localRoom.lives },
        rematch: { ...localRoom.rematch },
        mines: [...localRoom.mines],
        revealed: [...localRoom.revealed],
        flags: [...localRoom.flags],
      };
      const actionError = applyFootballMinesweeperAction(next, localRoom.turn, action, localRoom.revision);
      if (actionError) setError(actionError);
      else setLocalRoom(next);
      return;
    }
    if (!token) return;
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...action, code, token, revision: view.revision }),
      });
      const data = await response.json() as Api;
      if (data.view) setRemoteView(data.view);
      if (!response.ok) {
        setError(data.error ?? "Could not make that move.");
        return;
      }
    } catch {
      setError("Could not send your move. Please try again.");
    }
  };

  const requestRematch = async () => {
    if (!view || view.phase !== "finished") return;
    if (isLocal && localRoom) {
      const state = newFootballMinesweeperRoom(localRoom.p1Token);
      state.p2Token = localRoom.p2Token;
      state.phase = "playing";
      state.notice = "New match — Player 1 kicks off.";
      setLocalRoom(state);
      setFlagMode(false);
      setError(null);
      return;
    }
    if (!token) return;
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rematch", code, token, revision: view.revision }),
      });
      const data = await response.json() as Api;
      if (!response.ok || !data.view) throw new Error(data.error ?? "Could not request a rematch.");
      setRemoteView(data.view);
      setFlagMode(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not request a rematch.");
    }
  };

  const shareUrl = typeof window === "undefined"
    ? ""
    : `${window.location.origin}/game/football-minesweeper?code=${code}&comp=${comp}`;
  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy the invite link. Share the room code instead.");
    }
  };

  const currentSide: MinesweeperSide | null = view
    ? isLocal ? view.turn : view.you
    : null;
  const isTurn = Boolean(view && (isLocal || view.turn === view.you));
  const waiting = !isLocal && view?.phase === "waiting";

  if (fatal) {
    return (
      <Shell comp={comp}>
        <p role="alert" className="text-warning">{fatal}</p>
        <Link href={`/game/football-minesweeper?comp=${comp}`} className="btn-primary mt-5 inline-block">Start a new match</Link>
      </Shell>
    );
  }

  if (code && !CODE_PATTERN.test(code)) {
    return (
      <Shell comp={comp}>
        <p role="alert" className="text-warning">Enter a valid six-character room code.</p>
        <Link href={`/game/football-minesweeper?comp=${comp}`} className="btn-primary mt-5 inline-block">Back to game setup</Link>
      </Shell>
    );
  }

  if ((!code && !isLocal) || (isLocal && !localRoom)) {
    return (
      <Shell comp={comp}>
        <p className="section-eyebrow text-primary">Pass and play · Online 1v1</p>
        <h1 className="section-title mt-3">Football Minesweeper</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-fore-muted">
          Take turns clearing the pitch. Safe squares earn a point, the number shows nearby mines, and three red cards send you off.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={startLocal} className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-left transition hover:border-accent/70">
            <span className="section-eyebrow text-accent">Same device</span>
            <h2 className="mt-2 text-2xl">Play pass-and-play</h2>
            <p className="mt-2 text-sm leading-6 text-fore-muted">Take turns on one screen. Player 1 starts.</p>
          </button>
          <button type="button" onClick={() => void createOnline()} disabled={creating} className="rounded-2xl border border-primary/30 bg-primary-dim p-5 text-left transition hover:border-primary/70 disabled:opacity-60">
            <span className="section-eyebrow text-primary">Online</span>
            <h2 className="mt-2 text-2xl">{creating ? "Creating…" : "Invite a friend"}</h2>
            <p className="mt-2 text-sm leading-6 text-fore-muted">Create a private room and send the link to your opponent.</p>
          </button>
        </div>
        <form className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row" onSubmit={(event) => { event.preventDefault(); openRoom(); }}>
          <label htmlFor="minesweeper-code" className="sr-only">Room code</label>
          <input id="minesweeper-code" value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase().slice(0, 6))}
            placeholder="Enter a friend’s room code" maxLength={6} autoComplete="off"
            className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 font-mono uppercase tracking-[0.2em] placeholder:font-sans placeholder:tracking-normal" />
          <button type="submit" className="btn-ghost">Join with code</button>
        </form>
        {error && <p role="alert" className="mt-3 text-sm text-warning">{error}</p>}
        <details className="mt-6 rounded-xl border border-border bg-background/50 p-4 text-sm">
          <summary className="cursor-pointer font-bold">How to play</summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fore-muted">
            <li>The 8 × 8 pitch hides 10 mines. Take turns opening one square at a time.</li>
            <li>A safe square earns a point; its number shows how many mines touch it, including diagonals.</li>
            <li>Hit a mine and lose one of your three lives. Lose all three and your opponent wins.</li>
            <li>Use Flag mode to mark a suspected mine. Clear every safe square to finish; the higher score wins.</li>
          </ul>
        </details>
      </Shell>
    );
  }

  if (!view) {
    return (
      <Shell comp={comp}>
        <h1 className="section-title">Football Minesweeper</h1>
        <p className="mt-4 text-fore-muted">{isLocal ? "Starting the match…" : "Connecting to your match…"}</p>
      </Shell>
    );
  }

  const canPlay = view.phase === "playing" && isTurn;
  const isDraw = view.phase === "finished" && !view.winner;
  const status = waiting
    ? "Waiting for your friend to join."
    : view.phase === "finished"
      ? isDraw ? "Full time — it’s a draw!" : `Player ${view.winner === "p1" ? "1" : "2"} wins!`
      : canPlay ? `Player ${currentSide === "p1" ? "1" : "2"} — you’re up`
        : `Player ${view.turn === "p1" ? "1" : "2"} is taking a turn`;

  return (
    <Shell comp={comp}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow text-primary">Same device · Online 1v1</p>
          <h1 className="section-title mt-2 text-5xl sm:text-6xl">Football Minesweeper</h1>
          <p className="mt-2 text-sm text-fore-muted">Clear the pitch. Avoid the mines. Stay in the game.</p>
        </div>
        {!isLocal && (
          <div className="rounded-xl border border-border bg-background/60 p-3 text-right">
            <p className="section-eyebrow text-fore-muted">Room code</p>
            <p className="mt-1 font-mono text-xl font-bold tracking-[0.2em]">{code}</p>
          </div>
        )}
      </div>

      {!isLocal && (
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background/40 p-3">
          <p className="min-w-0 flex-1 break-all text-xs text-fore-muted">{shareUrl}</p>
          <button type="button" onClick={() => void copyInvite()} className="btn-ghost shrink-0">{copied ? "Copied!" : "Copy invite"}</button>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className={`font-bold ${view.phase === "finished" ? "text-accent" : canPlay ? "text-primary" : "text-fore-muted"}`}>
              {status}
            </p>
            <button type="button" onClick={() => setFlagMode((enabled) => !enabled)} disabled={!canPlay}
              aria-pressed={flagMode} className={`rounded-lg border px-3 py-2 text-xs font-bold transition disabled:opacity-40 ${flagMode ? "border-warning bg-warning/15 text-warning" : "border-border bg-background text-fore-muted hover:border-warning/50"}`}>
              {flagMode ? "🚩 Flag mode on" : "🚩 Flag a mine"}
            </button>
          </div>

          <div role="grid" aria-label="Football Minesweeper pitch" className="grid grid-cols-8 overflow-hidden rounded-xl border-2 border-emerald-300/40 bg-emerald-900 shadow-xl">
            {view.cells.map((cell, index) => {
              const row = Math.floor(index / 8);
              const column = index % 8;
              const label = cell.state === "mine" ? "Mine"
                : cell.state === "safe" ? `${cell.adjacent ?? 0} nearby mines`
                  : cell.flagged ? "Flagged square" : "Hidden square";
              const display = cell.state === "mine" ? "🟥"
                : cell.state === "safe" ? cell.adjacent ? String(cell.adjacent) : "⚽"
                  : cell.flagged ? "🚩" : "";
              const disabled = !canPlay || cell.state !== "hidden" || waiting;
              return (
                <button key={index} type="button" role="gridcell" aria-label={`${String.fromCharCode(65 + row)}${column + 1}: ${label}`}
                  disabled={disabled} onContextMenu={(event) => {
                    event.preventDefault();
                    if (canPlay && cell.state === "hidden") void playAction({ action: "flag", cell: index });
                  }}
                  onClick={() => {
                    if (cell.state !== "hidden") return;
                    void playAction(flagMode ? { action: "flag", cell: index } : { action: "reveal", cell: index });
                  }}
                  className={`flex aspect-square min-h-0 items-center justify-center border border-emerald-200/10 text-[clamp(12px,4vw,25px)] font-black transition focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:cursor-default ${
                    cell.state === "mine" ? "bg-rose-900/80" :
                      cell.state === "safe" ? "bg-emerald-950/80" :
                        (row + column) % 2 ? "bg-emerald-700 hover:bg-emerald-600" : "bg-emerald-800 hover:bg-emerald-700"
                  } ${cell.state === "safe" && cell.adjacent ? numberColors[cell.adjacent] : ""} ${canPlay && cell.state === "hidden" ? "cursor-pointer" : ""}`}>
                  {display}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center text-xs text-fore-muted">Right-click a square or enable Flag mode to mark a suspected mine.</p>
        </div>

        <aside className="space-y-3">
          {(["p1", "p2"] as const).map((side) => (
            <div key={side} className={`rounded-xl border p-4 ${view.turn === side && view.phase === "playing" ? "border-primary/50 bg-primary/5" : "border-border bg-background/40"}`}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl">Player {side === "p1" ? "1" : "2"}</h2>
                {view.turn === side && view.phase === "playing" && <span className="section-eyebrow text-primary">Turn</span>}
              </div>
              <p className="mt-3 text-sm text-fore-muted">Goals: <strong className="text-foreground">{view.scores[side]}</strong></p>
              <p className="mt-1 text-sm text-fore-muted">Lives: <strong className="text-foreground" aria-label={`${view.lives[side]} lives left`}>{"❤️".repeat(view.lives[side]) || "—"}</strong></p>
            </div>
          ))}
          {waiting && (
            <div role="status" className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-fore-muted">
              Share the room link or code above. The match starts as soon as your friend joins.
            </div>
          )}
          {view.notice && <p aria-live="polite" className="rounded-xl border border-border bg-background/40 p-4 text-sm text-fore-muted">{view.notice}</p>}
          {view.phase === "finished" && !isLocal && (
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <button type="button" onClick={() => void requestRematch()} disabled={view.rematch[view.you]}
                className="btn-primary w-full disabled:opacity-50">
                {view.rematch[view.you] ? "Rematch requested" : "Request rematch"}
              </button>
              {view.rematch[view.you] && !view.rematch[view.you === "p1" ? "p2" : "p1"] && <p className="mt-2 text-xs text-fore-muted">Waiting for the other player to vote.</p>}
            </div>
          )}
          {view.phase === "finished" && isLocal && (
            <button type="button" onClick={() => void requestRematch()} className="btn-primary w-full">Play again</button>
          )}
        </aside>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-warning">{error}</p>}
      <p className="mt-5 border-t border-border pt-4 text-xs leading-6 text-fore-muted">
        Each safe square scores one goal. The number counts mines in the eight surrounding squares. Three mine hits equal a red card; clear every safe square to settle the match on goals.
      </p>
    </Shell>
  );
}

export default function FootballMinesweeper() {
  return (
    <Suspense fallback={<main className="p-8 text-fore-muted">Loading Football Minesweeper…</main>}>
      <MinesweeperClient />
    </Suspense>
  );
}
