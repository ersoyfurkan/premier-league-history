"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { RoomView, StatKey } from "@/lib/gameRoom";

const STATS: StatKey[] = ["goals", "assists", "appearances"];
const POLL_MS = 1500;

type Api = { error?: string; token?: string; view?: RoomView };

type Card = { name: string; appearances: number; goals: number; assists: number };

function CardPanel({ title, card, hiddenText }: { title: string; card: Card | null; hiddenText: string }) {
  return (
    <div className="cyber-card p-6 md:p-8">
      <h2 className="text-3xl md:text-5xl">{title}</h2>
      {card ? (
        <div className="mt-6 space-y-4 font-mono text-lg md:text-2xl">
          <p className="text-primary uppercase tracking-[0.08em]">{card.name}</p>
          <p>Appearances: {card.appearances}</p>
          <p>Goals: {card.goals}</p>
          <p>Assists: {card.assists}</p>
        </div>
      ) : (
        <p className="mt-6 text-lg text-fore-muted">{hiddenText}</p>
      )}
    </div>
  );
}

function RoomClient() {
  const code = (useSearchParams().get("code") ?? "").toUpperCase();
  const storageKey = `plroom:${code}`;

  const [view, setView] = useState<RoomView | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fatal, setFatal] = useState<string | null>(code ? null : "No room code in this link.");
  const [copied, setCopied] = useState(false);
  const joining = useRef(false);

  // Use the saved token if this browser is already in the room, otherwise join as the second player
  useEffect(() => {
    if (!code || joining.current) return;
    joining.current = true;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      queueMicrotask(() => setToken(saved));
      return;
    }

    fetch("/api/game/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", code }),
    })
      .then(async (res) => {
        const data = (await res.json()) as Api;
        if (!res.ok) throw new Error(data.error ?? "Could not join room");
        const newToken = data.token ?? "";
        localStorage.setItem(storageKey, newToken);
        setToken(newToken);
      })
      .catch((e: Error) => setFatal(e.message));
  }, [code, storageKey]);

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/game/room?code=${code}&token=${token}`, { cache: "no-store" });
      const data = (await res.json()) as Api;
      if (!res.ok) {
        if (res.status === 404 || res.status === 403) setFatal(data.error ?? "Room unavailable");
        return;
      }
      setView(data.view ?? null);
    } catch {
      // transient network error, next poll will retry
    }
  }, [code, token]);

  useEffect(() => {
    if (!token) return;
    const first = setTimeout(refresh, 0);
    const timer = setInterval(refresh, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [token, refresh]);

  const act = async (payload: Record<string, unknown>) => {
    setError(null);
    const res = await fetch("/api/game/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, code, token }),
    });
    const data = (await res.json()) as Api;
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      refresh();
      return;
    }
    setView(data.view ?? null);
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/game/room?code=${code}` : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (fatal) {
    return (
      <Shell>
        <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-6">
          <p className="text-lg text-warning">{fatal}</p>
          <Link href="/game" className="btn-primary mt-4 inline-block">
            Back to lobby
          </Link>
        </div>
      </Shell>
    );
  }

  if (!view) {
    return (
      <Shell>
        <p className="mt-6 text-fore-muted">Connecting…</p>
      </Shell>
    );
  }

  const you = view.you;
  const opp = you === "p1" ? "p2" : "p1";
  const myTurn = view.picker === you;
  const r = view.result;

  let message = "";
  if (view.phase === "waiting") {
    message = "Waiting for your friend to open the link…";
  } else if (view.phase === "picking") {
    message = myTurn ? "Your turn: choose a stat." : "Your opponent is choosing a stat…";
  } else if (r) {
    const mine = you === "p1" ? r.p1Value : r.p2Value;
    const theirs = you === "p1" ? r.p2Value : r.p1Value;
    const outcome = r.pointSide === null ? "Tied, no point." : r.pointSide === you ? "You get the point!" : "Opponent gets the point.";
    message = `Round ${view.round}: ${r.stat.toUpperCase()}, you ${mine} vs opponent ${theirs}. ${outcome}`;
  }

  return (
    <Shell>
      {view.phase === "waiting" && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary-dim p-6 md:p-8">
          <p className="section-eyebrow text-primary">Invite a friend</p>
          <p className="mt-3 break-all font-mono text-base md:text-xl">{shareUrl}</p>
          <button className="btn-primary mt-4" onClick={copyLink}>
            {copied ? "Copied!" : "Copy invite link"}
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="data-card p-6 md:p-8">
          <p className="section-eyebrow text-fore-muted">Score</p>
          <p className="mt-4 font-display text-[clamp(52px,8vw,110px)] leading-none text-primary">
            {view.scores[you]} - {view.scores[opp]}
          </p>
          <p className="mt-3 text-base text-fore-muted">You vs Friend</p>
        </div>
        <div className="data-card p-6 md:p-8">
          <p className="section-eyebrow text-fore-muted">Round</p>
          <p className="mt-4 font-display text-[clamp(52px,8vw,110px)] leading-none text-accent">{view.round}</p>
          <p className="mt-3 text-base text-fore-muted">Picker: {view.picker === you ? "You" : "Friend"}</p>
        </div>
        <div className="data-card p-6 md:p-8">
          <p className="section-eyebrow text-fore-muted">Status</p>
          <p className="mt-4 font-display text-[clamp(30px,4.5vw,64px)] leading-tight">
            {view.winner ? (view.winner === you ? "You win!" : "Friend wins!") : "Battle Live"}
          </p>
          <p className="mt-3 text-base text-fore-muted">First to 10 points wins.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-6 md:p-7">
        <p className="text-base md:text-xl">{message}</p>
        {error && <p className="mt-2 text-warning">{error}</p>}
        {view.phase === "resolved" && (
          <button className="btn-primary mt-4" onClick={() => act({ action: "next", round: view.round })}>
            Next Round
          </button>
        )}
        {view.phase === "finished" && (
          <button className="btn-primary mt-4" onClick={() => act({ action: "restart" })}>
            Rematch
          </button>
        )}
      </div>

      {view.phase !== "waiting" && (
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          <CardPanel title="Your Card" card={view.yourCard} hiddenText="Card hidden." />
          <CardPanel title="Friend's Card" card={view.opponentCard} hiddenText="Hidden until the round ends." />
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-6 md:p-7">
        <p className="section-eyebrow text-fore-muted">Choose Stat</p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STATS.map((stat) => (
            <button
              key={stat}
              className={`btn-ghost py-4 text-base md:text-lg ${view.result?.stat === stat ? "!border-primary !text-primary" : ""}`}
              disabled={view.phase !== "picking" || !myTurn}
              onClick={() => act({ action: "pick", stat })}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground grid-bg px-4 md:px-8 py-8 md:py-12">
      <section className="mx-auto w-full max-w-[110rem]">
        <div className="flex items-center justify-between gap-4">
          <h1 className="section-title text-[clamp(48px,8vw,120px)] leading-[0.9]">Stat Duel Arena</h1>
          <Link href="/game" className="btn-ghost">
            Leave
          </Link>
        </div>
        {children}
      </section>
    </main>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={<Shell><p className="mt-6 text-fore-muted">Loading…</p></Shell>}>
      <RoomClient />
    </Suspense>
  );
}
