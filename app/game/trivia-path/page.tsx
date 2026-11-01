"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { lobbyFor, parseComp } from "@/lib/gameRoom";
import {
  matchTriviaAnswer,
  pickTriviaQuestion,
  rollDice,
  triviaSeconds,
  type TriviaEntry,
  type TriviaQuestion,
} from "@/data/triviaPath";

const LABELS = { pl: "Premier League", laliga: "La Liga", seriea: "Serie A", ucl: "Champions League" } as const;

type Phase = "setup" | "roll" | "play" | "result" | "over";
type Player = { name: string; cleared: number; out: boolean };

function TriviaClient() {
  const comp = parseComp(useSearchParams().get("comp"));
  const [phase, setPhase] = useState<Phase>("setup");
  const [versus, setVersus] = useState(false);
  const [names, setNames] = useState(["Player 1", "Player 2"]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [question, setQuestion] = useState<TriviaQuestion | null>(null);
  const [found, setFound] = useState<TriviaEntry[]>([]);
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const used = useRef(new Set<string>());
  const finished = useRef(false);

  useEffect(() => {
    if (phase !== "play") return;
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, [phase]);

  const secondsLeft = Math.max(0, Math.ceil((deadline - now) / 1000));

  const start = () => {
    used.current = new Set();
    setPlayers(
      (versus ? names : [names[0]]).map((name, i) => ({ name: name.trim() || `Player ${i + 1}`, cleared: 0, out: false })),
    );
    setTurn(0);
    setDice(null);
    setPhase("roll");
  };

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks += 1;
      setDice(rollDice());
      if (ticks >= 8) {
        window.clearInterval(timer);
        const final = rollDice();
        const q = pickTriviaQuestion(comp, final, used.current);
        used.current.add(q.id);
        setDice(final);
        setQuestion(q);
        setFound([]);
        setGuess("");
        setFeedback(null);
        const t = Date.now();
        setNow(t);
        setDeadline(t + triviaSeconds(final) * 1000);
        finished.current = false;
        setRolling(false);
        setPhase("play");
      }
    }, 80);
  };

  const finishTurn = (success: boolean) => {
    if (finished.current) return;
    finished.current = true;
    setPassed(success);
    setPlayers((prev) =>
      prev.map((p, i) => (i === turn ? { ...p, cleared: p.cleared + (success ? 1 : 0), out: !success } : p)),
    );
    setPhase("result");
  };

  useEffect(() => {
    if (phase === "play" && secondsLeft === 0 && deadline > 0) finishTurn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft, deadline]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!question || phase !== "play") return;
    const entry = matchTriviaAnswer(question.entries, guess);
    setGuess("");
    if (!entry) {
      setFeedback("Not a valid answer");
      return;
    }
    if (found.includes(entry)) {
      setFeedback("Already said that one");
      return;
    }
    const next = [...found, entry];
    setFound(next);
    setFeedback(null);
    if (next.length >= question.count) finishTurn(true);
  };

  const next = () => {
    const alive = players.filter((p) => !p.out);
    if (versus ? alive.length <= 1 : alive.length === 0) {
      setPhase("over");
      return;
    }
    let i = turn;
    do i = (i + 1) % players.length;
    while (players[i].out);
    setTurn(i);
    setDice(null);
    setPhase("roll");
  };

  const current = players[turn];
  const missed =
    question && phase === "result" && !passed
      ? question.entries.filter((entry) => !found.includes(entry)).slice(0, 5)
      : [];
  const winner = versus ? players.find((p) => !p.out) : null;

  return (
    <main className="min-h-[calc(100svh-5rem)] bg-background text-foreground grid-bg px-4 py-4 md:px-8 md:py-6">
      <section className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <Link href={lobbyFor(comp)} className="section-title text-2xl md:text-3xl">Game Arena</Link>
          <Link href={lobbyFor(comp)} className="btn-ghost">Leave</Link>
        </div>
        <p className="section-eyebrow mt-3 text-accent">{LABELS[comp]} · Trivia Path</p>

        {phase === "setup" && (
          <div className="mt-6 rounded-2xl border border-line bg-background/60 p-6">
            <h1 className="text-2xl font-bold">Roll the dice. Name that many.</h1>
            <p className="mt-2 text-sm leading-6 text-fore-muted">
              Each turn you roll a dice (1-6) and get a football category. Name that many correct answers before the
              clock runs out. Miss and you are eliminated. Last player standing wins, or see how long you survive solo.
            </p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setVersus(false)} className={versus ? "btn-ghost" : "btn-primary"}>
                Solo
              </button>
              <button type="button" onClick={() => setVersus(true)} className={versus ? "btn-primary" : "btn-ghost"}>
                1v1 on this device
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(versus ? [0, 1] : [0]).map((i) => (
                <input
                  key={i}
                  value={names[i]}
                  maxLength={16}
                  onChange={(event) => setNames((prev) => prev.map((n, j) => (j === i ? event.target.value : n)))}
                  className="rounded-xl border border-line bg-background px-4 py-3 outline-none focus:border-accent"
                  aria-label={`Player ${i + 1} name`}
                />
              ))}
            </div>
            <button type="button" onClick={start} className="btn-primary mt-5">Start</button>
          </div>
        )}

        {phase !== "setup" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {players.map((p, i) => (
              <div
                key={i}
                className={`rounded-xl border px-4 py-2 text-sm ${
                  p.out ? "border-line opacity-50 line-through" : i === turn ? "border-accent text-accent" : "border-line"
                }`}
              >
                {p.name} · {p.cleared} cleared
              </div>
            ))}
          </div>
        )}

        {phase === "roll" && current && (
          <div className="mt-6 rounded-2xl border border-line bg-background/60 p-8 text-center">
            <p className="text-lg font-bold">{current.name}, roll the dice</p>
            <div className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-accent text-5xl font-black">
              {dice ?? "?"}
            </div>
            <button type="button" onClick={roll} disabled={rolling} className="btn-primary mt-6">
              {rolling ? "Rolling…" : "Roll"}
            </button>
          </div>
        )}

        {(phase === "play" || phase === "result") && question && current && (
          <div className="mt-6 rounded-2xl border border-line bg-background/60 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-accent text-3xl font-black">
                {question.count}
              </div>
              <p className="flex-1 text-xl font-bold leading-snug">{question.text}</p>
              {phase === "play" && (
                <div className={`font-mono text-3xl font-black ${secondsLeft <= 5 ? "text-red-400" : "text-warning"}`}>
                  {secondsLeft}
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-fore-muted">{current.name}: {found.length}/{question.count}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {found.map((entry) => (
                <li key={entry.name} className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-sm">
                  {entry.name}
                </li>
              ))}
            </ul>
            {phase === "play" && (
              <form onSubmit={submit} className="mt-4 flex gap-2">
                <input
                  autoFocus
                  value={guess}
                  onChange={(event) => setGuess(event.target.value)}
                  placeholder="Type an answer"
                  className="flex-1 rounded-xl border border-line bg-background px-4 py-3 outline-none focus:border-accent"
                />
                <button type="submit" className="btn-primary">Submit</button>
              </form>
            )}
            {feedback && phase === "play" && <p className="mt-2 text-sm text-red-400">{feedback}</p>}
            {phase === "result" && (
              <div className="mt-5">
                <p className={`text-lg font-bold ${passed ? "text-accent" : "text-red-400"}`}>
                  {passed ? "Cleared!" : `${current.name} is out!`}
                </p>
                {!passed && missed.length > 0 && (
                  <p className="mt-1 text-sm text-fore-muted">Could have said: {missed.map((m) => m.name).join(", ")}</p>
                )}
                <button type="button" onClick={next} className="btn-primary mt-4">
                  {passed ? "Next turn" : "Continue"}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "over" && (
          <div className="mt-6 rounded-2xl border border-line bg-background/60 p-8 text-center">
            <h2 className="text-2xl font-bold">
              {versus ? `${winner?.name ?? "Nobody"} wins!` : `You cleared ${players[0]?.cleared ?? 0} in a row`}
            </h2>
            <button type="button" onClick={start} className="btn-primary mt-5">Play again</button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function TriviaPathPage() {
  return (
    <Suspense fallback={null}>
      <TriviaClient />
    </Suspense>
  );
}
