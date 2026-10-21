"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { UclStat } from "@/data/championsLeague";
import UclImage from "@/components/UclImage";
import { clubLogoUrl, loadUclPlayers, type UclPlayer } from "@/lib/uclPlayers";

const statLabels: Record<UclStat, string> = {
  goals: "Goals",
  appearances: "Appearances",
  assists: "Assists",
};

type Pool = "stars" | "everyone";
type Pair = [UclPlayer, UclPlayer];

const STAR_COUNT = 300;

function drawPair(players: UclPlayer[], stat: UclStat): Pair | null {
  if (players.length < 2) return null;
  for (let attempt = 0; attempt < 200; attempt++) {
    const first = players[Math.floor(Math.random() * players.length)];
    const second = players[Math.floor(Math.random() * players.length)];
    if (first !== second && first[stat] !== second[stat]) return [first, second];
  }
  return null;
}

const toggleButton = (active: boolean) =>
  `rounded-lg border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
    active
      ? "border-primary/40 bg-primary-dim text-primary"
      : "border-border-dim bg-surface text-fore-muted hover:border-accent/40 hover:text-accent"
  }`;

function DuelBoard({ candidates, stat }: { candidates: UclPlayer[]; stat: UclStat }) {
  const [cards, setCards] = useState<Pair | null>(() => drawPair(candidates, stat));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const higherIndex = cards && cards[0][stat] > cards[1][stat] ? 0 : 1;

  const choose = (index: number) => {
    if (picked !== null) return;
    if (index === higherIndex) setScore((current) => current + 1);
    setPicked(index);
  };

  const nextRound = () => {
    setRound((current) => current + 1);
    setCards(drawPair(candidates, stat));
    setPicked(null);
  };

  return (
    <>
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

      {!cards ? (
        <p className="py-8 text-center text-fore-muted">No players available.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card, index) => {
            const correct = picked !== null && index === higherIndex;
            const wrong = picked === index && index !== higherIndex;
            return (
              <button
                key={`${card.name}-${card.photo}-${index}`}
                type="button"
                onClick={() => choose(index)}
                disabled={picked !== null}
                className={`cyber-card min-h-64 p-6 text-left transition ${
                  correct ? "border-success/60" : wrong ? "border-danger/60" : "hover:border-primary/50"
                } disabled:cursor-default`}
              >
                <p className="section-eyebrow text-primary">Player {index + 1}</p>
                <UclImage src={card.photo} alt={card.name} shape="circle" className="mt-4 h-28 w-28" />
                <h2 className="mt-4 text-3xl md:text-4xl">{card.name}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-fore-muted">
                  <UclImage src={clubLogoUrl(card.clubId)} alt={card.club || "Club"} className="h-6 w-6" />
                  {card.club}
                </p>
                <p className="mt-8 font-mono text-sm uppercase tracking-widest text-accent">
                  {picked === null ? "Tap to pick" : `${card[stat]} ${statLabels[stat].toLowerCase()}`}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {cards && picked !== null && (
        <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-5 text-center">
          <p className="text-lg font-semibold">
            {picked === higherIndex ? "Correct pick!" : "Not quite — the other player has the higher total."}
          </p>
          <p className="mt-2 text-sm text-fore-muted">
            {cards[0].name}: {cards[0][stat]} · {cards[1].name}: {cards[1][stat]} {statLabels[stat].toLowerCase()}
          </p>
          <button type="button" onClick={nextRound} className="btn-primary mt-5">
            Next round
          </button>
        </div>
      )}
    </>
  );
}

export default function UclStatDuel() {
  const [stat, setStat] = useState<UclStat>("goals");
  const [pool, setPool] = useState<Pool>("stars");
  const [players, setPlayers] = useState<UclPlayer[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const candidates = useMemo(() => {
    if (!players) return [];
    const withStat = players.filter((player) => player[stat] > 0);
    if (pool === "everyone") return withStat;
    return [...withStat].sort((a, b) => b[stat] - a[stat]).slice(0, STAR_COUNT);
  }, [players, stat, pool]);

  useEffect(() => {
    let cancelled = false;
    loadUclPlayers()
      .then((data) => !cancelled && setPlayers(data))
      .catch((reason: Error) => !cancelled && setError(reason.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground grid-bg md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-5xl">
        <Link href="/champions-league" className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent">
          ← Champions League
        </Link>

        <header className="my-8 text-center">
          <p className="section-eyebrow text-accent">Every Champions League player since 1992/93</p>
          <h1 className="section-title mt-2">UCL Stat Duel</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-fore-muted">
            Pick the player with the higher Champions League career total.
          </p>
        </header>

        <div className="mb-4 flex flex-wrap justify-center gap-3">
          {(Object.keys(statLabels) as UclStat[]).map((key) => (
            <button key={key} type="button" onClick={() => setStat(key)} className={toggleButton(stat === key)}>
              {statLabels[key]}
            </button>
          ))}
        </div>
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => setPool("stars")} className={toggleButton(pool === "stars")}>
            Stars (top {STAR_COUNT})
          </button>
          <button type="button" onClick={() => setPool("everyone")} className={toggleButton(pool === "everyone")}>
            Every player
          </button>
        </div>

        {error ? (
          <p role="alert" className="py-8 text-center text-warning">{error}</p>
        ) : !players ? (
          <p className="py-8 text-center text-fore-muted">Loading players…</p>
        ) : (
          <DuelBoard key={`${stat}-${pool}`} candidates={candidates} stat={stat} />
        )}

        <p className="mt-6 text-center text-xs leading-5 text-fore-muted">
          Totals cover the Champions League era (1992/93 onwards), plus the European Cup-era leaders in UEFA’s all-time rankings.
        </p>
      </section>
    </main>
  );
}
