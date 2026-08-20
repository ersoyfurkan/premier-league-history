"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type StatKey = "appearances" | "goals" | "assists";
type Side = "p1" | "p2";
type Mode = "pvp" | "ai";

type PlayerCard = {
  name: string;
  appearances: number;
  goals: number;
  assists: number;
};

const STAT_KEYS: StatKey[] = ["goals", "assists", "appearances"];

const TEST_PLAYERS: PlayerCard[] = [
  { name: "Haaland", appearances: 132, goals: 112, assists: 24 },
  { name: "Aguero", appearances: 275, goals: 184, assists: 47 },
  { name: "Salah", appearances: 328, goals: 193, assists: 94 },
];

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function drawDistinctPlayers(players: PlayerCard[]): [PlayerCard, PlayerCard] {
  if (players.length < 2) {
    throw new Error("At least two players are required for a round.");
  }

  const firstIndex = Math.floor(Math.random() * players.length);
  let secondIndex = Math.floor(Math.random() * players.length);

  while (secondIndex === firstIndex) {
    secondIndex = Math.floor(Math.random() * players.length);
  }

  return [players[firstIndex], players[secondIndex]];
}

function otherSide(side: Side): Side {
  return side === "p1" ? "p2" : "p1";
}

function pickAiStat(card: PlayerCard) {
  const maxValues = {
    appearances: Math.max(...TEST_PLAYERS.map((p) => p.appearances)),
    goals: Math.max(...TEST_PLAYERS.map((p) => p.goals)),
    assists: Math.max(...TEST_PLAYERS.map((p) => p.assists)),
  };

  const scored = STAT_KEYS.map((key) => ({
    key,
    score: card[key] / maxValues[key],
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0].key;
}

function GamePlayClient() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const mode: Mode = modeParam === "ai" ? "ai" : "pvp";

  const [p1Card, setP1Card] = useState<PlayerCard | null>(null);
  const [p2Card, setP2Card] = useState<PlayerCard | null>(null);
  const [currentPicker, setCurrentPicker] = useState<Side>("p1");
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [round, setRound] = useState(1);
  const [roundResolved, setRoundResolved] = useState(false);
  const [selectedStat, setSelectedStat] = useState<StatKey | null>(null);
  const [message, setMessage] = useState("Preparing match...");
  const [winner, setWinner] = useState<Side | null>(null);
  const [showP1Card, setShowP1Card] = useState(false);
  const [showP2Card, setShowP2Card] = useState(false);

  const roundReady = useMemo(() => Boolean(p1Card && p2Card), [p1Card, p2Card]);

  const setupRound = () => {
    const [nextP1Card, nextP2Card] = drawDistinctPlayers(TEST_PLAYERS);
    setP1Card(nextP1Card);
    setP2Card(nextP2Card);
    setCurrentPicker(randomFrom<Side>(["p1", "p2"]));
    setRoundResolved(false);
    setSelectedStat(null);
    setShowP1Card(false);
    setShowP2Card(false);
  };

  const startNewGame = () => {
    setScores({ p1: 0, p2: 0 });
    setRound(1);
    setWinner(null);
    setMessage(mode === "ai" ? "You are Player 1. The AI is Player 2." : "Local 1v1 mode. Keep cards hidden from each other.");
    setupRound();
  };

  const resolvePick = (stat: StatKey) => {
    if (!p1Card || !p2Card || roundResolved || winner) {
      return;
    }

    const p1Value = p1Card[stat];
    const p2Value = p2Card[stat];
    const pickerValue = currentPicker === "p1" ? p1Value : p2Value;
    const otherValue = currentPicker === "p1" ? p2Value : p1Value;
    const pointSide =
      pickerValue === otherValue
        ? null
        : pickerValue > otherValue
          ? currentPicker
          : otherSide(currentPicker);

    setSelectedStat(stat);
    setRoundResolved(true);
    setShowP1Card(true);
    setShowP2Card(true);

    if (!pointSide) {
      setMessage(
        `Round ${round}: ${stat.toUpperCase()} is tied (${p1Value} - ${p2Value}). No point awarded.`
      );
      return;
    }

    const nextScores = {
      p1: scores.p1 + (pointSide === "p1" ? 1 : 0),
      p2: scores.p2 + (pointSide === "p2" ? 1 : 0),
    };
    setScores(nextScores);

    const pointWinnerLabel =
      pointSide === "p1" ? "Player 1" : mode === "ai" ? "AI" : "Player 2";
    setMessage(
      `Round ${round}: ${stat.toUpperCase()} -> P1 ${p1Value} vs P2 ${p2Value}. ${pointWinnerLabel} gets the point.`
    );

    if (nextScores.p1 >= 10 || nextScores.p2 >= 10) {
      setWinner(nextScores.p1 >= 10 ? "p1" : "p2");
    }
  };

  useEffect(() => {
    startNewGame();
  }, [mode]);

  useEffect(() => {
    if (!roundReady || roundResolved || winner || mode !== "ai" || currentPicker !== "p2") {
      return;
    }

    const timer = setTimeout(() => {
      if (!p2Card) {
        return;
      }
      const aiChoice = pickAiStat(p2Card);
      resolvePick(aiChoice);
    }, 1000);

    return () => clearTimeout(timer);
  }, [roundReady, roundResolved, winner, mode, currentPicker, p2Card]);

  useEffect(() => {
    if (!roundResolved || winner) {
      return;
    }

    const timer = setTimeout(() => {
      setRound((prev) => prev + 1);
      setupRound();
    }, 3000);

    return () => clearTimeout(timer);
  }, [roundResolved, winner]);

  const turnLabel =
    currentPicker === "p1" ? "Player 1" : mode === "ai" ? "AI" : "Player 2";
  const winnerLabel =
    winner === "p1" ? "Player 1" : winner === "p2" ? (mode === "ai" ? "AI" : "Player 2") : null;

  return (
    <main className="min-h-screen bg-background text-foreground grid-bg px-4 md:px-8 py-8 md:py-12">
      <section className="mx-auto w-full max-w-[110rem]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="section-title text-[clamp(48px,8vw,120px)] leading-[0.9]">Stat Duel Arena</h1>
          <Link href="/game" className="btn-ghost">
            Change Mode
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="data-card p-6 md:p-8">
            <p className="section-eyebrow text-fore-muted">Score</p>
            <p className="mt-4 font-display text-[clamp(52px,8vw,110px)] leading-none text-primary">
              {scores.p1} - {scores.p2}
            </p>
            <p className="mt-3 text-base md:text-lg text-fore-muted">
              Player 1 vs {mode === "ai" ? "AI" : "Player 2"}
            </p>
          </div>

          <div className="data-card p-6 md:p-8">
            <p className="section-eyebrow text-fore-muted">Round</p>
            <p className="mt-4 font-display text-[clamp(52px,8vw,110px)] leading-none text-accent">{round}</p>
            <p className="mt-3 text-base md:text-lg text-fore-muted">Picker: {turnLabel}</p>
          </div>

          <div className="data-card p-6 md:p-8">
            <p className="section-eyebrow text-fore-muted">Status</p>
            <p className="mt-4 font-display text-[clamp(30px,4.5vw,64px)] leading-tight text-foreground">
              {winnerLabel ? `${winnerLabel} wins!` : "Battle Live"}
            </p>
            <p className="mt-3 text-base md:text-lg text-fore-muted">First to 10 points wins.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-6 md:p-7">
          <p className="text-base md:text-xl text-foreground">{message}</p>
          {roundResolved && !winner && (
            <p className="mt-2 text-sm md:text-base text-accent">Next round starts in 3 seconds...</p>
          )}
        </div>

        {roundReady && (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <div className="cyber-card p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-3xl md:text-5xl">Player 1 Card</h2>
                {mode === "pvp" && (
                  <button className="btn-ghost" onClick={() => setShowP1Card((prev) => !prev)}>
                    {showP1Card ? "Hide" : "Show"}
                  </button>
                )}
              </div>
              {(showP1Card || mode === "ai" || roundResolved) && p1Card ? (
                <div className="mt-6 space-y-4 font-mono text-lg md:text-2xl">
                  <p className="text-primary uppercase tracking-[0.08em]">{p1Card.name}</p>
                  <p>Appearances: {p1Card.appearances}</p>
                  <p>Goals: {p1Card.goals}</p>
                  <p>Assists: {p1Card.assists}</p>
                </div>
              ) : (
                <p className="mt-6 text-lg text-fore-muted">Card hidden.</p>
              )}
            </div>

            <div className="cyber-card p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-3xl md:text-5xl">{mode === "ai" ? "AI Card" : "Player 2 Card"}</h2>
                {mode === "pvp" && (
                  <button className="btn-ghost" onClick={() => setShowP2Card((prev) => !prev)}>
                    {showP2Card ? "Hide" : "Show"}
                  </button>
                )}
              </div>
              {(showP2Card || roundResolved) && p2Card ? (
                <div className="mt-6 space-y-4 font-mono text-lg md:text-2xl">
                  <p className="text-primary uppercase tracking-[0.08em]">{p2Card.name}</p>
                  <p>Appearances: {p2Card.appearances}</p>
                  <p>Goals: {p2Card.goals}</p>
                  <p>Assists: {p2Card.assists}</p>
                </div>
              ) : (
                <p className="mt-6 text-lg text-fore-muted">Card hidden.</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-6 md:p-7">
          <p className="section-eyebrow text-fore-muted">Choose Stat</p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {STAT_KEYS.map((stat) => (
              <button
                key={stat}
                className={`btn-ghost py-4 text-base md:text-lg ${selectedStat === stat ? "!border-primary !text-primary" : ""}`}
                disabled={
                  !roundReady ||
                  roundResolved ||
                  Boolean(winner) ||
                  (mode === "ai" && currentPicker === "p2")
                }
                onClick={() => resolvePick(stat)}
              >
                {stat}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={startNewGame}>
              Restart Match
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function GamePlayPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background text-foreground grid-bg px-4 md:px-8 py-8 md:py-12">
          <section className="mx-auto w-full max-w-[110rem]">
            <p className="section-eyebrow text-primary">Loading match...</p>
          </section>
        </main>
      }
    >
      <GamePlayClient />
    </Suspense>
  );
}
