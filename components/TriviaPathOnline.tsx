"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import UclImage from "@/components/UclImage";
import { playerFaceUrl } from "@/data/playerFaces";
import { suggestTrivia } from "@/data/triviaPath";
import { lobbyFor, type Competition } from "@/lib/gameRoom";

type Side = "p1" | "p2";
type PathView = {
  comp: Competition;
  you: Side;
  phase: "waiting" | "roll" | "play" | "result" | "finished";
  opponentJoined: boolean;
  shorts: string[];
  logos?: string[][];
  pos: Record<Side, number>;
  turns: Record<Side, number>;
  turn: Side;
  dice: number | null;
  target: number;
  required: number;
  question: string | null;
  found: string[];
  last: { side: Side; success: boolean; message: string; answers: string[] } | null;
  winner: Side | null;
  boardSize: number;
  youWantRematch: boolean;
  opponentWantsRematch: boolean;
  msLeft: number | null;
};
type Api = { error?: string; code?: string; token?: string; view?: PathView; message?: string };

const POLL_MS = 1000;
const DOTS: Record<Side, string> = { p1: "bg-accent", p2: "bg-warning" };

export default function TriviaPathOnline({ comp, code }: { comp: Competition; code: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<PathView | null>(null);
  const [receivedAt, setReceivedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [guess, setGuess] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const key = `pltrivia:${code}`;
        let stored = localStorage.getItem(key);
        if (!stored) {
          const res = await fetch("/api/game/trivia-path", {
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
    if (!token) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/game/trivia-path?code=${code}&token=${token}`, { cache: "no-store" });
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
    const res = await fetch("/api/game/trivia-path", {
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
      const data = await post(payload);
      if (data.message && data.message !== "Correct") setFeedback(data.message);
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const sendAnswer = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setGuess("");
    void act({ action: "answer", guess: text });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    sendAnswer(guess);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/game/trivia-path?code=${code}&comp=${comp}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const activeComp = view?.comp ?? comp;
  const myTurn = view?.turn === view?.you;
  const suggestions = useMemo(
    () =>
      view?.phase === "play" && myTurn
        ? suggestTrivia(activeComp, guess).filter((name) => !view.found.includes(name))
        : [],
    [activeComp, guess, view, myTurn],
  );
  const secondsLeft = view?.msLeft == null ? null : Math.max(0, Math.ceil((view.msLeft - (now - receivedAt)) / 1000));

  const shell = (children: React.ReactNode) => (
    <section className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <Link href={lobbyFor(comp)} className="section-title text-2xl md:text-3xl">Game Arena</Link>
        <Link href={lobbyFor(comp)} className="btn-ghost">Leave</Link>
      </div>
      <p className="section-eyebrow mt-3 text-accent">Online · Trivia Path · Room {code}</p>
      {children}
    </section>
  );

  if (error && !view) {
    return shell(<p className="mt-6 rounded-2xl border border-line bg-background/60 p-6 text-red-400">{error}</p>);
  }
  if (!view) {
    return shell(<p className="mt-6 text-fore-muted">Connecting…</p>);
  }

  const opp: Side = view.you === "p1" ? "p2" : "p1";
  const tag = (side: Side) => (side === view.you ? "You" : "Opponent");

  return shell(
    <>
      {view.phase === "waiting" ? (
        <div className="mt-6 rounded-2xl border border-line bg-background/60 p-6">
          <h1 className="text-2xl font-bold">Waiting for your opponent</h1>
          <p className="mt-2 text-sm text-fore-muted">Send them the invite link. The game starts as soon as they open it.</p>
          <button type="button" onClick={copyLink} className="btn-primary mt-4">{copied ? "Copied!" : "Copy invite link"}</button>
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {([view.you, opp] as Side[]).map((side) => (
              <div
                key={side}
                className={`rounded-xl border px-4 py-2 text-sm ${
                  view.turn === side && view.phase !== "finished" ? "border-accent text-accent" : "border-line"
                }`}
              >
                <span className={`mr-2 inline-block h-3 w-3 rounded-full align-middle ${DOTS[side]}`} />
                {tag(side)} · {view.pos[side]}/{view.boardSize}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {view.shorts.map((short, i) => (
              <div
                key={i}
                className={`relative flex min-h-24 flex-col justify-between rounded-xl border p-2 text-xs ${
                  view.phase === "play" && view.dice && i === view.target - 1 ? "border-accent bg-accent/10" : "border-line bg-background/60"
                }`}
              >
                <span className="font-mono text-fore-muted">{i + 1}{i === view.boardSize - 1 ? " 🏁" : ""}</span>
                <div className="flex gap-1">
                  {(view.logos?.[i] ?? []).slice(0, 2).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" className="h-5 w-5 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
                  ))}
                </div>
                <span className="text-[11px] leading-tight">{short}</span>
                <div className="absolute -top-2 right-1 flex gap-1">
                  {(["p1", "p2"] as Side[]).map((side) =>
                    view.pos[side] === i + 1 ? (
                      <span key={side} className={`h-4 w-4 rounded-full border border-background ${DOTS[side]}`} />
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>

          {view.phase === "roll" && (
            <div className="mt-6 rounded-2xl border border-line bg-background/60 p-8 text-center">
              <p className="text-lg font-bold">{myTurn ? "Your turn, roll the dice" : "Opponent is rolling…"}</p>
              <div className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-accent text-5xl font-black">?</div>
              {myTurn && <button type="button" onClick={() => act({ action: "roll" })} className="btn-primary mt-6">Roll</button>}
              {secondsLeft !== null && <p className="mt-3 text-xs text-fore-muted">Auto-roll in {secondsLeft}s</p>}
            </div>
          )}

          {(view.phase === "play" || view.phase === "result") && view.dice && (
            <div className="mt-6 rounded-2xl border border-line bg-background/60 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-accent text-3xl font-black">
                  {view.dice}
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-fore-muted">
                    {tag(view.turn)} rolled {view.dice} · space {view.target}
                  </p>
                  <p className="text-xl font-bold leading-snug">{view.question}</p>
                </div>
                {view.phase === "play" && secondsLeft !== null && (
                  <div className={`font-mono text-3xl font-black ${secondsLeft <= 5 ? "text-red-400" : "text-warning"}`}>{secondsLeft}</div>
                )}
              </div>
              <p className="mt-3 text-sm text-fore-muted">{tag(view.turn)}: {view.found.length}/{view.required}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {(view.phase === "result" && view.last ? view.last.answers : view.found).map((name) => (
                  <li key={name} className={`rounded-full border px-3 py-1 text-sm ${view.phase === "result" && view.last && !view.last.success ? "border-red-400/40 bg-red-400/10 text-fore-muted line-through" : "border-accent/50 bg-accent/10"}`}>{name}</li>
                ))}
              </ul>

              {view.phase === "play" && myTurn && (
                <form onSubmit={submit} className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <input
                      autoFocus
                      autoComplete="off"
                      value={guess}
                      onChange={(event) => setGuess(event.target.value)}
                      placeholder="Search a player, club, stadium…"
                      className="w-full rounded-xl border-2 border-lime-400/80 bg-background px-4 py-3 outline-none focus:border-lime-300"
                    />
                    {suggestions.length > 0 && (
                      <div role="listbox" className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-surface shadow-xl">
                        {suggestions.map((name) => (
                          <button
                            key={name}
                            type="button"
                            role="option"
                            aria-selected={false}
                            onClick={() => sendAnswer(name)}
                            className="flex w-full items-center gap-3 border-b border-border/50 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-primary/10"
                          >
                            <UclImage fallback={playerFaceUrl(name)} alt={name} className="h-9 w-9" shape="circle" />
                            <span className="min-w-0 flex-1 truncate">{name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn-primary">Submit</button>
                </form>
              )}
              {view.phase === "play" && !myTurn && <p className="mt-4 text-sm text-fore-muted">Opponent is answering…</p>}
              {feedback && view.phase === "play" && <p className="mt-2 text-sm text-red-400">{feedback}</p>}

              {view.phase === "result" && view.last && (
                <p className={`mt-5 text-lg font-bold ${view.last.success ? "text-accent" : "text-red-400"}`}>
                  {view.last.success
                    ? `${tag(view.last.side)} moved to space ${view.pos[view.last.side]}.`
                    : `${tag(view.last.side)} lost the turn: ${view.last.message}.`}
                </p>
              )}
            </div>
          )}

          {view.phase === "finished" && (
            <div className="mt-6 rounded-2xl border border-line bg-background/60 p-8 text-center">
              <h2 className="text-2xl font-bold">
                {view.winner === view.you ? "You win!" : "Your opponent wins"}
              </h2>
              <p className="mt-1 text-sm text-fore-muted">Finished in {view.turns[view.winner ?? view.you]} turns</p>
              <button type="button" onClick={() => act({ action: "rematch" })} disabled={view.youWantRematch} className="btn-primary mt-5">
                {view.youWantRematch ? "Waiting for opponent…" : view.opponentWantsRematch ? "Accept rematch" : "Rematch"}
              </button>
            </div>
          )}
        </>
      )}
    </>,
  );
}
