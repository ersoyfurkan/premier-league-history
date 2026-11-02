"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RONDO_LETTERS, RONDO_SECONDS, isRondoAnswer, type RondoQuestion } from "@/data/rondo";

export type RondoScore = { right: number; wrong: number };
type Status = "idle" | "right" | "wrong" | "passed";

const ringClass: Record<Status, string> = {
  idle: "border-primary/40 bg-surface text-foreground",
  passed: "border-warning/70 bg-warning/20 text-warning",
  right: "border-emerald-400 bg-emerald-500 text-white",
  wrong: "border-red-400 bg-red-500 text-white",
};

export default function RondoBoard({
  questions,
  onFinish,
}: {
  questions: RondoQuestion[];
  onFinish: (score: RondoScore) => void;
}) {
  const [statuses, setStatuses] = useState<Status[]>(() => questions.map(() => "idle"));
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState("");
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [now, setNow] = useState(0);
  const [endsAt, setEndsAt] = useState(0);
  const finished = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const first = setTimeout(() => {
      setEndsAt(Date.now() + RONDO_SECONDS * 1000);
      setNow(Date.now());
    }, 0);
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  const score = useMemo<RondoScore>(
    () => ({
      right: statuses.filter((status) => status === "right").length,
      wrong: statuses.filter((status) => status === "wrong").length,
    }),
    [statuses],
  );
  const open = statuses.filter((status) => status === "idle" || status === "passed").length;
  const secondsLeft = endsAt ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : RONDO_SECONDS;
  const over = open === 0 || secondsLeft === 0;

  useEffect(() => {
    if (!over || finished.current) return;
    finished.current = true;
    onFinish(score);
  }, [over, score, onFinish]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [current]);

  const nextOpen = (from: number, list: Status[]) => {
    for (let step = 1; step <= list.length; step += 1) {
      const index = (from + step) % list.length;
      if (list[index] === "idle" || list[index] === "passed") return index;
    }
    return from;
  };

  const resolve = (status: Status) => {
    const list = statuses.slice();
    list[current] = status;
    setStatuses(list);
    setGuess("");
    setCurrent(nextOpen(current, list));
  };

  const submit = () => {
    if (over || !guess.trim()) return;
    const question = questions[current];
    const ok = isRondoAnswer(question, guess);
    setFlash({ ok, text: ok ? `${question.letter}: Correct!` : `${question.letter}: Wrong — it was ${question.answers[0]}` });
    resolve(ok ? "right" : "wrong");
  };

  const pass = () => {
    if (over) return;
    const list = statuses.slice();
    list[current] = "passed";
    setStatuses(list);
    setGuess("");
    setCurrent(nextOpen(current, list));
    setFlash(null);
  };

  const question = questions[current];
  const prompt = question.prompt ?? question.clue;
  const mins = Math.floor(secondsLeft / 60);

  return (
    <div className="rondo-board mx-auto w-full" style={{ maxWidth: "min(640px, max(340px, calc(100svh - 230px)))" }}>
      <div className="mb-2 flex items-center justify-between font-mono text-sm font-bold">
        <span className="text-emerald-400">✓ {score.right}</span>
        <span className={secondsLeft <= 20 ? "text-warning" : "text-primary"}>
          {mins}:{String(secondsLeft % 60).padStart(2, "0")}
        </span>
        <span className="text-red-400">✗ {score.wrong}</span>
      </div>

      <div className="rondo-stage relative aspect-square w-full">
        <div className="rondo-ring absolute inset-0">
        {RONDO_LETTERS.map((letter, index) => {
          const angle = (index / RONDO_LETTERS.length) * 2 * Math.PI;
          return (
            <span
              key={letter}
              className={`absolute flex h-[9%] w-[9%] items-center justify-center rounded-full border-2 text-[clamp(9px,2.6vw,16px)] font-black ${ringClass[statuses[index]]} ${index === current && !over ? "ring-2 ring-white scale-110" : ""}`}
              style={{
                left: `${50 + 44 * Math.sin(angle) - 4.5}%`,
                top: `${50 - 44 * Math.cos(angle) - 4.5}%`,
              }}
            >
              {letter}
            </span>
          );
        })}
          <span aria-hidden="true" className="rondo-current hidden">{question.letter}</span>
        </div>

        <div className="rondo-question absolute inset-[15%] flex flex-col items-center justify-center gap-2 rounded-full text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
            {question.contains ? `Contains ${question.letter}` : `Starts with ${question.letter}`}
          </p>
          <p className="rondo-clue-text max-w-full text-balance text-[clamp(11px,2.4vw,16px)] font-semibold leading-snug"
            style={prompt.length > 110 ? { fontSize: prompt.length > 130 ? 13 : 14 } : undefined}>
            {prompt}
          </p>
          <input
            ref={inputRef}
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit()}
            disabled={over}
            placeholder="Type your answer…"
            aria-label="Rondo answer"
            enterKeyHint="send"
            autoComplete="off"
            className="w-full max-w-xs rounded-lg border border-primary/30 bg-background px-3 py-1.5 text-center text-sm"
          />
          <div className="flex gap-2">
            <button type="button" className="btn-primary !px-4 !py-1.5 text-sm" onClick={submit} disabled={over}>
              Answer
            </button>
            <button type="button" className="btn-ghost !px-4 !py-1.5 text-sm" onClick={pass} disabled={over}>
              Pass
            </button>
          </div>
          <p className={`h-4 text-xs ${flash?.ok ? "text-emerald-400" : "text-red-400"}`}>{flash?.text ?? ""}</p>
        </div>
      </div>
      {question.prompt && question.prompt !== question.clue && (
        <details key={current} className="mt-3 rounded-lg border border-border px-3 py-2 text-sm text-fore-muted">
          <summary className="cursor-pointer">Question scope</summary>
          <p className="mt-2">{question.clue.replace(/ \(answer starts with [A-Z]\)\.$/, ".")}</p>
        </details>
      )}
    </div>
  );
}
