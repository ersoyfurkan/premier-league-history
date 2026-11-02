"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import history from "@/data/tournamentHistory.generated.json";
import { TOURNAMENTS, type TournamentKey } from "@/lib/tournaments";

type Table = { headers: string[]; rows: string[][] };
type Question = { prompt: string; answer: string; options: string[] };

const tables = history.tournaments as unknown as Record<TournamentKey, Record<string, Table | null>>;

const shuffle = <T,>(list: T[]) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const clean = (value: string) => value.replace(/\[[^\]]*\]/g, "").trim();

function buildQuestions(tk: TournamentKey, count: number): Question[] {
  const meta = TOURNAMENTS[tk];
  const table = tables[tk].editions;
  if (!table) return [];
  const col = (re: RegExp) => table.headers.findIndex((h) => re.test(h));
  const year = col(/^year/i);
  const asks = [
    { idx: col(/^champions/i), make: (y: string) => `Who won the ${meta.short} in ${y}?` },
    { idx: col(/^host/i), make: (y: string) => `Who hosted the ${meta.short} in ${y}?` },
    { idx: col(/coach/i), make: (y: string) => `Who coached the ${meta.short} winners in ${y}?` },
    { idx: col(/(most goals|top scorer|golden boot)/i), make: (y: string) => `Who was top scorer at the ${meta.short} in ${y}?` },
  ].filter((a) => a.idx >= 0);

  const pool: Question[] = [];
  for (const row of table.rows) {
    const y = clean(row[year] ?? "");
    if (!/^\d{4}$/.test(y)) continue;
    for (const ask of asks) {
      const answer = clean(row[ask.idx] ?? "");
      if (!answer || answer.length > 60) continue;
      const others = [...new Set(table.rows.map((r) => clean(r[ask.idx] ?? "")).filter((v) => v && v !== answer && v.length <= 60))];
      if (others.length < 3) continue;
      pool.push({ prompt: ask.make(y), answer, options: shuffle([answer, ...shuffle(others).slice(0, 3)]) });
    }
  }
  return shuffle(pool).slice(0, count);
}

export default function TournamentQuiz({ tk }: { tk: TournamentKey }) {
  const meta = TOURNAMENTS[tk];
  const [round, setRound] = useState(0);
  const questions = useMemo(() => buildQuestions(tk, 10), [tk, round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const done = index >= questions.length;
  const q = questions[index];

  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };
  const restart = () => {
    setRound((r) => r + 1);
    setIndex(0);
    setScore(0);
    setPicked(null);
  };

  return (
    <main className="min-h-screen bg-background px-5 pb-16 pt-24 text-foreground grid-bg md:px-8">
      <section className="mx-auto w-full max-w-2xl space-y-6">
        <header className="text-center">
          <p className="section-eyebrow text-accent">{meta.label} mini-game</p>
          <h1 className="section-title mt-2">{meta.short} Quiz</h1>
          <p className="mt-2 text-sm text-fore-muted">10 questions built from the full tournament history (winners, hosts, coaches, top scorers).</p>
        </header>
        <div className="data-card p-6">
          {questions.length === 0 ? (
            <p className="text-center text-fore-muted">Quiz data isn&apos;t available yet.</p>
          ) : done ? (
            <div className="space-y-4 text-center">
              <p className="font-display text-5xl text-primary">{score}/{questions.length}</p>
              <button type="button" onClick={restart} className="rounded-lg border border-primary/40 bg-primary-dim px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] text-primary">Play again</button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">Question {index + 1} / {questions.length} · Score {score}</p>
              <h2 className="text-2xl">{q.prompt}</h2>
              <div className="grid gap-2">
                {q.options.map((option) => {
                  const state = picked === null ? "" : option === q.answer ? "border-success text-success" : option === picked ? "border-danger text-danger" : "opacity-50";
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={picked !== null}
                      onClick={() => {
                        setPicked(option);
                        if (option === q.answer) setScore((s) => s + 1);
                      }}
                      className={`rounded-lg border border-border-dim bg-surface px-4 py-3 text-left text-sm transition hover:border-primary/40 ${state}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <button type="button" onClick={next} className="rounded-lg border border-primary/40 bg-primary-dim px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  {index + 1 === questions.length ? "See score" : "Next"}
                </button>
              )}
            </div>
          )}
        </div>
        <p className="text-center"><Link href={meta.home} className="text-sm text-accent hover:underline">← Back to {meta.label}</Link></p>
      </section>
    </main>
  );
}
