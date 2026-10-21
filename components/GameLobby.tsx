"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Competition } from "@/lib/gameRoom";

export default function GameLobby({ comp }: { comp: Competition }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isUcl = comp === "ucl";

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
      router.push(`/game/room?code=${data.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create room");
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground grid-bg px-6 py-10">
      <section className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-surface/80 p-8 md:p-12 shadow-glow-card">
          <div className="glow-orb glow-orb-cyan h-80 w-80 -top-24 -left-16" />
          <div className="glow-orb glow-orb-purple h-96 w-96 -right-20 top-1/3" />

          <div className="relative z-10 text-center">
            <p className="section-eyebrow text-primary">{isUcl ? "Champions League Game Lobby" : "Game Lobby"}</p>
            <h1 className="section-title mt-3">Choose Mode</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base md:text-lg text-fore-muted leading-8">
              Pick how you want to play, then you will be sent to a dedicated full-size battle screen.
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

            <Link
              href={isUcl ? "/champions-league" : "/premier-league"}
              className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent"
            >
              ← Back to {isUcl ? "Champions League" : "Premier League"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
