"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Competition } from "@/lib/gameRoom";
import CompetitionMiniGames, { type MiniGameMode } from "@/components/CompetitionMiniGames";
import { LEAGUE_META, isEspnComp } from "@/lib/leagues";
import { COMPETITION_LABELS, type TournamentComp } from "@/lib/competitions";
import { TOURNAMENTS, isTournament } from "@/lib/tournaments";

export default function GameLobby({ comp }: { comp: Competition }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [miniGame, setMiniGame] = useState<MiniGameMode | null>(null);
  const [creatingGrid, setCreatingGrid] = useState(false);
  const [gridError, setGridError] = useState<string | null>(null);
  const isUcl = comp === "ucl";
  const isGeneral = comp === "general";
  const tournament = isTournament(comp) ? TOURNAMENTS[comp] : null;
  const label = tournament ? COMPETITION_LABELS[comp as TournamentComp] : isGeneral ? "All Competitions" : isUcl ? "Champions League" : isEspnComp(comp) ? LEAGUE_META[comp].label : "Premier League";
  const home = tournament ? tournament.home : isGeneral ? "/game" : isUcl ? "/champions-league" : isEspnComp(comp) ? LEAGUE_META[comp].home : "/premier-league";

  const createRoom = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/game/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", comp }),
      });
      const data = (await res.json()) as { error?: string; code?: string; token?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not create room");
      localStorage.setItem(`plroom:${data.code}`, data.token ?? "");
      router.push(`/game/room?code=${data.code}&comp=${comp}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create room");
      setCreating(false);
    }
  };

  const createFootballTicTacToe = async () => {
    setCreatingGrid(true);
    setGridError(null);
    try {
      const res = await fetch("/api/game/football-tic-tac-toe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", comp }),
      });
      const data = (await res.json()) as { error?: string; code?: string; token?: string };
      if (!res.ok || !data.code || !data.token) throw new Error(data.error ?? "Could not create game");
      localStorage.setItem(`plttt:${data.code}`, data.token);
      router.push(`/game/football-tic-tac-toe?code=${data.code}&comp=${comp}`);
    } catch (e) {
      setGridError(e instanceof Error ? e.message : "Could not create game");
      setCreatingGrid(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground grid-bg px-6 py-10">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mobile-lobby relative overflow-hidden rounded-3xl border border-primary/20 bg-surface/80 p-8 md:p-12 shadow-glow-card">
          <div className="glow-orb glow-orb-cyan h-80 w-80 -top-24 -left-16" />
          <div className="glow-orb glow-orb-purple h-96 w-96 -right-20 top-1/3" />

          <div className="relative z-10 text-center">
            <p className="section-eyebrow text-primary">{comp === "pl" ? "Game Lobby" : `${label} Game Lobby`}</p>
            <h1 className="section-title mt-3">Choose Mode</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base md:text-lg text-fore-muted leading-8">
              Challenge a friend, take on the AI, or try a quick football mini-game.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={createRoom}
                disabled={creating}
                className="rounded-2xl border border-primary/30 bg-primary-dim px-6 py-8 text-left transition hover:shadow-glow-card disabled:opacity-60"
              >
                <p className="section-eyebrow text-primary">Online</p>
                <h2 className="mt-2 text-3xl md:text-4xl">{creating ? "Creating…" : "1v1 with a Friend"}</h2>
                <p className="mt-3 text-sm md:text-base text-fore-muted">
                  Get an invite link to send to a friend. Each of you plays on your own device and cards stay hidden until the round resolves.
                </p>
                {error && <p className="mt-3 text-sm text-warning">{error}</p>}
              </button>

              <Link
                href={`/game/play?mode=ai&comp=${comp}`}
                className="rounded-2xl border border-accent/30 bg-surface px-6 py-8 text-left transition hover:border-accent/60"
              >
                <p className="section-eyebrow text-accent">Solo</p>
                <h2 className="mt-2 text-3xl md:text-4xl">vs AI</h2>
                <p className="mt-3 text-sm md:text-base text-fore-muted">
                  You are Player 1. The AI takes Player 2 and picks automatically on its turns.
                </p>
              </Link>
            </div>

            <div className="mt-10 border-t border-border/70 pt-8">
              <p className="section-eyebrow text-warning">Quick games</p>
              <h2 className="mt-2 text-3xl">Play a Mini-Game</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-fore-muted">
                Each game uses {label} players and stats where relevant.
              </p>

              {miniGame ? (
                <CompetitionMiniGames comp={comp} mode={miniGame} onBack={() => setMiniGame(null)} />
              ) : (
                <div className="mt-5 grid gap-3 text-left md:grid-cols-3">
                  {([
                    ["higher-lower", "Player Stats: Higher or Lower", "Guess the next player’s goals, appearances, or assists."],
                    ["transfer-market", "Transfer Market: Higher or Lower", "Guess random historical market-value snapshots, with no repeat players in a game."],
                  ] as const).map(([mode, title, description]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setMiniGame(mode)}
                      className="rounded-2xl border border-warning/25 bg-background/60 p-5 text-left transition hover:border-warning/60 hover:bg-warning/5"
                    >
                      <h3 className="text-xl font-bold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-fore-muted">{description}</p>
                      <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-warning">
                        Play now →
                      </span>
                    </button>
                  ))}
                  <div className="rounded-2xl border border-warning/25 bg-background/60 p-5 text-left transition hover:border-warning/60 hover:bg-warning/5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-warning">Online · Invite a friend</p>
                    <h3 className="mt-2 text-xl font-bold">Tik Tak Toe</h3>
                    <p className="mt-2 text-sm leading-6 text-fore-muted">
                      Randomized clue grid, player portraits, and a one-minute timer for every turn.
                    </p>
                    {gridError && <p className="mt-3 text-sm text-warning">{gridError}</p>}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={createFootballTicTacToe}
                        disabled={creatingGrid}
                        className="btn-primary disabled:opacity-60"
                      >
                        {creatingGrid ? "Creating…" : "Invite a friend"}
                      </button>
                      <Link
                        href={`/game/football-tic-tac-toe?local=1&comp=${comp}`}
                        className="btn-ghost"
                      >
                        Play on this device
                      </Link>
                    </div>
                  </div>
                  <Link
                    href={`/game/rondo?comp=${comp}`}
                    className="rounded-2xl border border-warning/25 bg-background/60 p-5 text-left transition hover:border-warning/60 hover:bg-warning/5"
                  >
                    <h3 className="text-xl font-bold">Football Rondo</h3>
                    <p className="mt-2 text-sm leading-6 text-fore-muted">
                      One question per letter, A to Z, in 3 minutes. Play solo, on one device, or 1v1 via a link.
                    </p>
                    <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-warning">
                      Play now →
                    </span>
                  </Link>
                  <Link
                    href={`/game/trivia-path?comp=${comp}`}
                    className="rounded-2xl border border-primary/25 bg-background/60 p-5 text-left transition hover:border-primary/60 hover:bg-primary/5"
                  >
                    <h3 className="text-xl font-bold">Trivia Path</h3>
                    <p className="mt-2 text-sm leading-6 text-fore-muted">
                      Roll the dice, then name that many answers before time runs out. Miss and you&apos;re out. Solo or 1v1 on one device.
                    </p>
                    <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
                      Play now →
                    </span>
                  </Link>
                  <Link
                    href={`/game/club-duel?comp=${comp}`}
                    className="rounded-2xl border border-accent/25 bg-background/60 p-5 text-left transition hover:border-accent/60 hover:bg-accent/5"
                  >
                    <h3 className="text-xl font-bold">Club Duel</h3>
                    <p className="mt-2 text-sm leading-6 text-fore-muted">
                      1v1 by invite link. Each pick a club, then race to name a player who played for both.
                    </p>
                    <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                      Invite a friend →
                    </span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href={home}
              className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent"
            >
              ← Back to {label}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
