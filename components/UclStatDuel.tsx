"use client";

import Link from "next/link";
import { useState } from "react";
import { uclLeaderboards, type UclLeaderboardEntry, type UclStat } from "@/data/championsLeague";

const statLabels: Record<UclStat, string> = {
  goals: "Goals",
  appearances: "Appearances",
  assists: "Assists",
};

type Pair = [UclLeaderboardEntry, UclLeaderboardEntry];

function drawPair(stat: UclStat): Pair {
  const players = uclLeaderboards[stat];
  const firstIndex = Math.floor(Math.random() * players.length);
  let secondIndex = Math.floor(Math.random() * players.length);
  while (secondIndex === firstIndex || players[secondIndex].value === players[firstIndex].value) {
    secondIndex = Math.floor(Math.random() * players.length);
  }
  return [players[firstIndex], players[secondIndex]];
}

const statButton = (active: boolean) =>
  `rounded-lg border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
    active
      ? "border-primary/40 bg-primary-dim text-primary"
      : "border-border-dim bg-surface text-fore-muted hover:border-accent/40 hover:text-accent"
  }`;

export default function UclStatDuel() {
  const [stat, setStat] = useState<UclStat>("goals");
  const [cards, setCards] = useState<Pair>([
    uclLeaderboards.goals[0],
    uclLeaderboards.goals[1],
  ]);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const higherIndex = cards[0].value > cards[1].value ? 0 : 1;

  const choose = (index: number) => {
    if (picked !== null) return;
    if (index === higherIndex) setScore((current) => current + 1);
    setPicked(index);
  };

  const nextRound = () => {
    setRound((current) => current + 1);
    setCards(drawPair(stat));
    setPicked(null);
  };

  const changeStat = (next: UclStat) => {
    setStat(next);
    setCards(drawPair(next));
    setRound(1);
    setScore(0);
    setPicked(null);
  };

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground grid-bg md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-5xl">
        <Link href="/champions-league" className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent">
          ← Champions League
        </Link>

        <header className="my-8 text-center">
          <p className="section-eyebrow text-accent">UEFA all-time top-20 leaders</p>
          <h1 className="section-title mt-2">UCL Stat Duel</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-fore-muted">
            Pick the player with the higher Champions League career total. These cards use the UEFA all-time top-20 lists.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {(Object.keys(statLabels) as UclStat[]).map((key) => (
            <button key={key} type="button" onClick={() => changeStat(key)} className={statButton(stat === key)}>
              {statLabels[key]}
            </button>
          ))}
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="data-card p-5 text-center">
            <p className="section-eyebrow text-fore-muted">Correct picks</p>
            <p className="mt-3 font-display text-5xl text-primary">{score}</p>
          </div>
          <div className="data-card p-5 text-center">
            <p className="section-eyebrow text-fore-muted">Round</p>
            <p className="mt-3 font-display text-5xl text-accent">{round}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card, index) => {
            const correct = picked !== null && index === higherIndex;
            const wrong = picked === index && index !== higherIndex;
            return (
              <button
                key={`${card.name}-${index}`}
                type="button"
                onClick={() => choose(index)}
                disabled={picked !== null}
                className={`cyber-card min-h-64 p-6 text-left transition ${
                  correct ? "border-success/60" : wrong ? "border-danger/60" : "hover:border-primary/50"
                } disabled:cursor-default`}
              >
                <p className="section-eyebrow text-primary">Player {index + 1}</p>
                <h2 className="mt-4 text-3xl md:text-4xl">{card.name}</h2>
                <p className="mt-2 text-sm text-fore-muted">{card.club}</p>
                <p className="mt-8 font-mono text-sm uppercase tracking-widest text-accent">
                  {picked === null ? "Tap to pick" : `${card.value} ${statLabels[stat].toLowerCase()}`}
                </p>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-5 text-center">
            <p className="text-lg font-semibold">
              {picked === higherIndex ? "Correct pick!" : "Not quite — the other player has the higher total."}
            </p>
            <p className="mt-2 text-sm text-fore-muted">
              {cards[0].name}: {cards[0].value} · {cards[1].name}: {cards[1].value} {statLabels[stat].toLowerCase()}
            </p>
            <button type="button" onClick={nextRound} className="btn-primary mt-5">
              Next round
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-xs leading-5 text-fore-muted">
          The duel is limited to players appearing in UEFA’s published top-20 all-time ranking for the selected stat.
        </p>
      </section>
    </main>
  );
}
