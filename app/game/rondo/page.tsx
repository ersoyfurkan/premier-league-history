"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RondoBoard, { type RondoScore } from "@/components/RondoBoard";
import { randomRondoPicks, rondoQuestions } from "@/data/rondo";
import { lobbyFor, parseComp, type Competition } from "@/lib/gameRoom";
import { COMPETITION_LABELS } from "@/lib/competitions";

type RemoteView = {
  comp: Competition;
  picks: number[];
  you: "p1" | "p2";
  opponentJoined: boolean;
  myScore: RondoScore | null;
  opponentFinished: boolean;
  opponentScore: RondoScore | null;
};
type Api = { error?: string; code?: string; token?: string; view?: RemoteView };

const POLL_MS = 1500;
const LABELS = COMPETITION_LABELS;

// 1 = first beats second, -1 = second beats first, 0 = draw
function compare(a: RondoScore, b: RondoScore) {
  if (a.right !== b.right) return a.right > b.right ? 1 : -1;
  if (a.wrong !== b.wrong) return a.wrong < b.wrong ? 1 : -1;
  return 0;
}

function Shell({ comp, children }: { comp: Competition; children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100svh-5rem)] bg-background text-foreground grid-bg px-4 py-4 md:px-8 md:py-6">
      <section className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link href={lobbyFor(comp)} className="section-title text-2xl md:text-3xl">Game Arena</Link>
          <Link href={lobbyFor(comp)} className="btn-ghost">Leave</Link>
        </div>
        <p className="section-eyebrow mt-3 text-accent">{LABELS[comp]} · Football Rondo</p>
        {children}
      </section>
    </main>
  );
}

const ScoreLine = ({ label, score }: { label: string; score: RondoScore }) => (
  <p className="text-lg">
    <span className="font-bold">{label}:</span>{" "}
    <span className="text-emerald-400">{score.right} correct</span> ·{" "}
    <span className="text-red-400">{score.wrong} wrong</span>
  </p>
);

function RondoClient() {
  const search = useSearchParams();
  const router = useRouter();
  const comp = parseComp(search.get("comp"));
  const code = (search.get("code") ?? "").toUpperCase();
  const mode = search.get("mode");

  const [picks, setPicks] = useState<number[] | null>(null);
  const [started, setStarted] = useState(false);
  const [localScores, setLocalScores] = useState<RondoScore[]>([]);
  const [handoff, setHandoff] = useState(false);
  const [view, setView] = useState<RemoteView | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const playersNeeded = mode === "local" ? 2 : 1;
  const questions = rondoQuestions(view?.comp ?? comp, view?.picks ?? picks ?? []);

  // Online: join (or reuse the stored token), then load the shared questions.
  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    (async () => {
      try {
        const key = `plrondo:${code}`;
        let stored = localStorage.getItem(key);
        if (!stored) {
          const res = await fetch("/api/game/rondo", {
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

  const finished = Boolean(view?.myScore && view.opponentScore);
  useEffect(() => {
    if (!code || !token || finished) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/game/rondo?code=${code}&token=${token}`, { cache: "no-store" });
        const data = (await res.json()) as Api;
        if (cancelled) return;
        if (!res.ok || !data.view) throw new Error(data.error ?? "Could not load the game");
        setView(data.view);
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
  }, [code, token, finished]);

  const start = (nextMode: "solo" | "local") => {
    let previous: number[] = [];
    try {
      previous = JSON.parse(localStorage.getItem(`plrondo:last:${comp}`) ?? "[]") as number[];
    } catch {}
    const next = randomRondoPicks(comp, previous);
    localStorage.setItem(`plrondo:last:${comp}`, JSON.stringify(next));
    setPicks(next);
    setLocalScores([]);
    setStarted(false);
    setHandoff(false);
    router.replace(`/game/rondo?comp=${comp}&mode=${nextMode}`);
  };

  const createInvite = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/game/rondo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", comp }),
      });
      const data = (await res.json()) as Api;
      if (!res.ok || !data.code || !data.token) throw new Error(data.error ?? "Could not create the game");
      localStorage.setItem(`plrondo:${data.code}`, data.token);
      router.push(`/game/rondo?code=${data.code}&comp=${comp}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the game");
      setBusy(false);
    }
  };

  const finishLocal = useCallback(
    (score: RondoScore) => {
      setLocalScores((scores) => [...scores, score]);
      if (playersNeeded === 2) setHandoff(true);
    },
    [playersNeeded],
  );

  const finishRemote = useCallback(
    async (score: RondoScore) => {
      try {
        const res = await fetch("/api/game/rondo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "submit", code, token, ...score }),
        });
        const data = (await res.json()) as Api;
        if (!res.ok || !data.view) throw new Error(data.error ?? "Could not save your score");
        setView(data.view);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save your score");
      }
    },
    [code, token],
  );

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/game/rondo?code=${code}&comp=${comp}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const rules = (
    <p className="mt-2 text-sm text-fore-muted">
      One specific answer for every letter A–Z: 9 easy, 9 medium and 8 hard questions. You have 3 minutes. Pass to return later. Most correct answers wins; fewest wrong breaks a tie.
    </p>
  );

  if (!code && !mode) {
    return (
      <Shell comp={comp}>
        <h2 className="mt-1 text-3xl md:text-4xl">Football Rondo</h2>
        {rules}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <button type="button" onClick={() => start("solo")} className="rounded-2xl border border-accent/30 bg-surface p-6 text-left transition hover:border-accent/60">
            <p className="section-eyebrow text-accent">Solo</p>
            <h3 className="mt-2 text-2xl">Test yourself</h3>
            <p className="mt-2 text-sm text-fore-muted">Play alone and see how many you can get.</p>
          </button>
          <button type="button" onClick={() => start("local")} className="rounded-2xl border border-warning/30 bg-surface p-6 text-left transition hover:border-warning/60">
            <p className="section-eyebrow text-warning">Same device</p>
            <h3 className="mt-2 text-2xl">1v1, take turns</h3>
            <p className="mt-2 text-sm text-fore-muted">Both players get the same questions, one after the other.</p>
          </button>
          <button type="button" onClick={createInvite} disabled={busy} className="rounded-2xl border border-primary/30 bg-primary-dim p-6 text-left transition hover:shadow-glow-card disabled:opacity-60">
            <p className="section-eyebrow text-primary">Online</p>
            <h3 className="mt-2 text-2xl">{busy ? "Creating…" : "1v1 via link"}</h3>
            <p className="mt-2 text-sm text-fore-muted">Send a link to a friend; you each play on your own device.</p>
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-warning">{error}</p>}
      </Shell>
    );
  }

  if (code) {
    const activeComp = view?.comp ?? comp;
    if (error && !view) {
      return <Shell comp={activeComp}><p className="mt-6 text-warning">{error}</p></Shell>;
    }
    if (!view) return <Shell comp={activeComp}><p className="mt-6 text-fore-muted">Connecting to the game…</p></Shell>;

    if (view.myScore) {
      const mine = view.myScore;
      const theirs = view.opponentScore;
      const outcome = theirs ? compare(mine, theirs) : null;
      return (
        <Shell comp={activeComp}>
          <h2 className="mt-1 text-3xl md:text-4xl">
            {!theirs ? "Waiting for your friend to finish…" : outcome === 0 ? "It's a draw!" : outcome === 1 ? "You win!" : "Your friend wins!"}
          </h2>
          <div className="mt-5 space-y-2 rounded-2xl border border-primary/30 bg-surface/80 p-6">
            <ScoreLine label="You" score={mine} />
            {theirs ? <ScoreLine label="Friend" score={theirs} /> : <p className="text-fore-muted">Their score appears when they finish.</p>}
          </div>
          {error && <p className="mt-3 text-sm text-warning">{error}</p>}
          <Link href={`/game/rondo?comp=${activeComp}`} className="btn-primary mt-6 inline-block">Play again</Link>
        </Shell>
      );
    }

    if (!started) {
      return (
        <Shell comp={activeComp}>
          <h2 className="mt-1 text-3xl md:text-4xl">Ready?</h2>
          {rules}
          {view.you === "p1" && !view.opponentJoined && (
            <div className="mt-5 rounded-2xl border border-primary/30 bg-primary-dim p-5">
              <p className="section-eyebrow text-primary">Invite a friend</p>
              <p className="mt-2 break-all font-mono text-sm">{typeof window !== "undefined" ? `${window.location.origin}/game/rondo?code=${code}&comp=${comp}` : ""}</p>
              <button type="button" className="btn-primary mt-3" onClick={copyLink}>{copied ? "Copied!" : "Copy invite link"}</button>
              <p className="mt-3 text-xs text-fore-muted">You can start now — your friend plays the same questions whenever they open the link.</p>
            </div>
          )}
          <button type="button" className="btn-primary mt-6" onClick={() => setStarted(true)}>Start — 3:00</button>
        </Shell>
      );
    }

    return (
      <Shell comp={activeComp}>
        <div className="mt-2">
          <RondoBoard questions={questions} onFinish={finishRemote} />
        </div>
      </Shell>
    );
  }

  // solo / same-device
  if (!picks) {
    return (
      <Shell comp={comp}>
        <p className="mt-6 text-fore-muted">Preparing questions…</p>
        <button type="button" className="btn-primary mt-4" onClick={() => start(mode === "local" ? "local" : "solo")}>Start a new game</button>
      </Shell>
    );
  }

  const done = localScores.length >= playersNeeded;
  if (done) {
    const [a, b] = localScores;
    const outcome = b ? compare(a, b) : null;
    return (
      <Shell comp={comp}>
        <h2 className="mt-1 text-3xl md:text-4xl">
          {!b ? "Time!" : outcome === 0 ? "It's a draw!" : outcome === 1 ? "Player 1 wins!" : "Player 2 wins!"}
        </h2>
        <div className="mt-5 space-y-2 rounded-2xl border border-primary/30 bg-surface/80 p-6">
          <ScoreLine label={b ? "Player 1" : "You"} score={a} />
          {b && <ScoreLine label="Player 2" score={b} />}
        </div>
        <Link href={`/game/rondo?comp=${comp}`} className="btn-primary mt-6 inline-block">Play again</Link>
      </Shell>
    );
  }

  const turn = localScores.length;
  if (!started || handoff) {
    return (
      <Shell comp={comp}>
        <h2 className="mt-1 text-3xl md:text-4xl">{playersNeeded === 2 ? `Player ${turn + 1}, get ready` : "Ready?"}</h2>
        {rules}
        {handoff && <p className="mt-3 text-fore-muted">Player 1 scored {localScores[0].right} correct, {localScores[0].wrong} wrong. Pass the device — no peeking at the answers!</p>}
        <button
          type="button"
          className="btn-primary mt-6"
          onClick={() => {
            setStarted(true);
            setHandoff(false);
          }}
        >
          Start — 3:00
        </button>
      </Shell>
    );
  }

  return (
    <Shell comp={comp}>
      {playersNeeded === 2 && <h2 className="mt-1 text-xl">Player {turn + 1}</h2>}
      <div className="mt-2">
        <RondoBoard key={turn} questions={questions} onFinish={finishLocal} />
      </div>
    </Shell>
  );
}

export default function RondoPage() {
  return (
    <Suspense fallback={null}>
      <RondoClient />
    </Suspense>
  );
}
