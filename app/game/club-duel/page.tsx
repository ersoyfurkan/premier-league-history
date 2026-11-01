"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DUEL_CLUBS, clubByKey } from "@/data/clubDuel";
import { lobbyFor, parseComp, type Competition } from "@/lib/gameRoom";

type Side = "p1" | "p2";
type DuelView = {
  comp: Competition;
  you: Side;
  phase: "waiting" | "pick" | "guess" | "result" | "finished";
  round: number;
  scores: Record<Side, number>;
  opponentJoined: boolean;
  myPick: string | null;
  opponentPicked: boolean;
  opponentPick: string | null;
  club: string | null;
  youPassed: boolean;
  opponentPassed: boolean;
  last: { winner: Side | null; player: string | null; reason: "correct" | "pass" | "timeout" } | null;
  usedCount: number;
  winner: Side | null;
  youWantRematch: boolean;
  opponentWantsRematch: boolean;
  msLeft: number | null;
  winScore: number;
};
type Api = { error?: string; code?: string; token?: string; view?: DuelView; correct?: boolean; message?: string };

const POLL_MS = 1000;
const LABELS: Record<Competition, string> = {
  pl: "Premier League",
  laliga: "La Liga",
  seriea: "Serie A",
  ucl: "Champions League",
};

function Shell({ comp, children }: { comp: Competition; children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100svh-5rem)] bg-background text-foreground grid-bg px-4 py-4 md:px-8 md:py-6">
      <section className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link href={lobbyFor(comp)} className="section-title text-2xl md:text-3xl">Game Arena</Link>
          <Link href={lobbyFor(comp)} className="btn-ghost">Leave</Link>
        </div>
        <p className="section-eyebrow mt-3 text-accent">{LABELS[comp]} · Club Duel</p>
        {children}
      </section>
    </main>
  );
}

const Badge = ({ src, label, size = 48 }: { src: string; label: string; size?: number }) => (
  <Image src={src} alt={`${label} crest`} width={size} height={size} unoptimized className="object-contain" style={{ width: size, height: size }} />
);

function DuelClient() {
  const search = useSearchParams();
  const router = useRouter();
  const comp = parseComp(search.get("comp"));
  const code = (search.get("code") ?? "").toUpperCase();

  const [view, setView] = useState<DuelView | null>(null);
  const [receivedAt, setReceivedAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    (async () => {
      try {
        const key = `plduel:${code}`;
        let stored = localStorage.getItem(key);
        if (!stored) {
          const res = await fetch("/api/game/club-duel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "join", code }),
          });
          const data = (await res.json()) as Api;
          if (!res.ok || !data.token) throw new Error(data.error ?? "Could not join this game");
          stored = data.token;
          localStorage.setItem(key, stored);
        }
        if (!cancelled) setToken(stored);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not join this game");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => {
    if (!code || !token) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/game/club-duel?code=${code}&token=${token}`, { cache: "no-store" });
        const data = (await res.json()) as Api;
        if (cancelled) return;
        if (!res.ok || !data.view) throw new Error(data.error ?? "Could not load the game");
        setView(data.view);
        setReceivedAt(Date.now());
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load the game");
      }
    };
    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [code, token]);

  const post = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/game/club-duel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, token, ...payload }),
    });
    const data = (await res.json()) as Api;
    if (!res.ok) throw new Error(data.error ?? "Something went wrong");
    if (data.view) {
      setView(data.view);
      setReceivedAt(now);
    }
    return data;
  };

  const act = async (payload: Record<string, unknown>) => {
    setFeedback(null);
    try {
      await post(payload);
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const createInvite = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/game/club-duel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", comp }),
      });
      const data = (await res.json()) as Api;
      if (!res.ok || !data.code || !data.token) throw new Error(data.error ?? "Could not create the game");
      localStorage.setItem(`plduel:${data.code}`, data.token);
      router.push(`/game/club-duel?code=${data.code}&comp=${comp}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the game");
      setBusy(false);
    }
  };

  const submitGuess = async (event: FormEvent) => {
    event.preventDefault();
    const text = guess.trim();
    if (!text) return;
    setGuess("");
    try {
      const data = await post({ action: "guess", guess: text });
      setFeedback(data.correct ? null : data.message ?? "Not correct");
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/game/club-duel?code=${code}&comp=${comp}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const activeComp = view?.comp ?? comp;

  if (!code) {
    return (
      <Shell comp={comp}>
        <h2 className="mt-1 text-3xl md:text-4xl">Club Duel</h2>
        <p className="mt-2 max-w-2xl text-sm text-fore-muted">
          1v1, invite only. Both players have 20 seconds to pick a club from the league. One of the picks is chosen, then you race to name a player who played for it. The fastest correct answer wins the round. First to 5 wins. If you are stuck, both vote to pass.
        </p>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button type="button" onClick={createInvite} disabled={busy} className="btn-primary mt-6">
          {busy ? "Creating…" : "Create invite link"}
        </button>
      </Shell>
    );
  }

  if (error && !view) {
    return (
      <Shell comp={comp}>
        <p className="mt-6 text-red-400">{error}</p>
        <Link href={`/game/club-duel?comp=${comp}`} className="btn-ghost mt-4 inline-block">Start a new game</Link>
      </Shell>
    );
  }

  if (!view) {
    return (
      <Shell comp={comp}>
        <p className="mt-6 text-fore-muted">Loading…</p>
      </Shell>
    );
  }

  const me = view.you;
  const opp: Side = me === "p1" ? "p2" : "p1";
  const secondsLeft = view.msLeft === null ? null : Math.max(0, Math.ceil((view.msLeft - (now - receivedAt)) / 1000));
  const club = view.club ? clubByKey(activeComp, view.club) : null;
  const last = view.last;

  const scoreboard = (
    <div className="mt-4 grid grid-cols-2 gap-3 text-center">
      {[me, opp].map((side) => (
        <div key={side} className={`rounded-2xl border bg-surface p-3 ${side === me ? "border-accent/50" : "border-line"}`}>
          <p className="section-eyebrow">{side === me ? "You" : "Opponent"}</p>
          <p className="text-3xl font-bold">{view.scores[side]}</p>
        </div>
      ))}
    </div>
  );

  return (
    <Shell comp={activeComp}>
      {view.phase === "waiting" ? (
        <div className="mt-6 rounded-2xl border border-accent/30 bg-surface p-6">
          <h2 className="text-2xl">Waiting for your opponent</h2>
          <p className="mt-2 text-sm text-fore-muted">Send them this link. The game starts as soon as they open it.</p>
          <p className="mt-4 font-mono text-lg tracking-[0.2em]">{code}</p>
          <button type="button" onClick={copyLink} className="btn-primary mt-4">{copied ? "Copied!" : "Copy invite link"}</button>
        </div>
      ) : (
        <>
          {scoreboard}
          <p className="mt-3 text-center font-mono text-xs uppercase tracking-[0.12em] text-fore-muted">
            Round {view.round} · first to {view.winScore}
          </p>

          {view.phase === "pick" && (
            <div className="mt-4 rounded-2xl border border-line bg-surface p-4 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl">Pick a club</h2>
                <span className="font-mono text-2xl text-warning">{secondsLeft}s</span>
              </div>
              <p className="mt-1 text-sm text-fore-muted">
                {view.myPick ? "Locked in. You can still change it." : "Choose any club."}{" "}
                {view.opponentPicked ? "Opponent has picked." : "Waiting for the opponent."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {DUEL_CLUBS[activeComp].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => act({ action: "pick", club: item.key })}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center text-sm transition ${
                      view.myPick === item.key ? "border-accent bg-accent/10" : "border-line hover:border-accent/50"
                    }`}
                  >
                    <Badge src={item.badge} label={item.label} />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view.phase === "guess" && club && (
            <div className="mt-4 rounded-2xl border border-accent/30 bg-surface p-4 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge src={club.badge} label={club.label} size={64} />
                  <div>
                    <p className="section-eyebrow text-accent">Name a player who played for</p>
                    <h2 className="text-2xl">{club.label}</h2>
                  </div>
                </div>
                <span className="font-mono text-2xl text-warning">{secondsLeft}s</span>
              </div>
              <form onSubmit={submitGuess} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={guess}
                  onChange={(event) => setGuess(event.target.value)}
                  autoFocus
                  autoComplete="off"
                  placeholder="Type a player name…"
                  className="min-w-0 flex-1 rounded-xl border border-line bg-background px-4 py-3 outline-none focus:border-accent"
                />
                <button type="submit" className="btn-primary">Guess</button>
              </form>
              {feedback && <p className="mt-2 text-sm text-red-400">{feedback}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => act({ action: "pass" })}
                  disabled={view.youPassed}
                  className="btn-ghost"
                >
                  {view.youPassed ? "You voted to pass" : "Vote to pass"}
                </button>
                {view.opponentPassed && <span className="text-sm text-warning">Opponent voted to pass</span>}
              </div>
              <p className="mt-3 text-xs text-fore-muted">
                Full names count, and so does a surname when only one player at the club has it. A player can only be used once per match.
              </p>
            </div>
          )}

          {(view.phase === "result" || view.phase === "finished") && last && (
            <div className="mt-4 rounded-2xl border border-line bg-surface p-5 text-center">
              {last.reason === "correct" && last.winner && (
                <p className="text-xl">
                  <span className={last.winner === me ? "text-emerald-400" : "text-red-400"}>
                    {last.winner === me ? "You" : "Opponent"}
                  </span>{" "}
                  got it first: <span className="font-bold">{last.player}</span>
                </p>
              )}
              {last.reason === "pass" && <p className="text-xl">Both players passed. New round next.</p>}
              {last.reason === "timeout" && <p className="text-xl">Time ran out. New round next.</p>}
              {view.phase === "result" && <p className="mt-2 text-sm text-fore-muted">Next round starting…</p>}
            </div>
          )}

          {view.phase === "finished" && (
            <div className="mt-4 rounded-2xl border border-warning/40 bg-surface p-6 text-center">
              <h2 className="text-3xl">{view.winner === me ? "You win!" : "Opponent wins"}</h2>
              <p className="mt-2 text-fore-muted">
                {view.scores[me]} – {view.scores[opp]}
              </p>
              <button
                type="button"
                onClick={() => act({ action: "rematch" })}
                disabled={view.youWantRematch}
                className="btn-primary mt-4"
              >
                {view.youWantRematch ? "Waiting for opponent…" : "Rematch"}
              </button>
              {view.opponentWantsRematch && !view.youWantRematch && (
                <p className="mt-2 text-sm text-warning">Opponent wants a rematch</p>
              )}
            </div>
          )}
        </>
      )}
    </Shell>
  );
}

export default function ClubDuelPage() {
  return (
    <Suspense fallback={null}>
      <DuelClient />
    </Suspense>
  );
}
