"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function GamePage() {
  const [mode, setMode] = useState<Mode>("pvp");
  const [p1Card, setP1Card] = useState<PlayerCard | null>(null);
  const [p2Card, setP2Card] = useState<PlayerCard | null>(null);
  const [currentPicker, setCurrentPicker] = useState<Side>("p1");
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [round, setRound] = useState(1);
  const [roundResolved, setRoundResolved] = useState(false);
  const [selectedStat, setSelectedStat] = useState<StatKey | null>(null);
  const [message, setMessage] = useState("Pick a mode and start the game.");
  const [winner, setWinner] = useState<Side | null>(null);
  const [showP1Card, setShowP1Card] = useState(false);
  const [showP2Card, setShowP2Card] = useState(false);

  const roundReady = useMemo(() => Boolean(p1Card && p2Card), [p1Card, p2Card]);

  const setupRound = () => {
    setP1Card(randomFrom(TEST_PLAYERS));
    setP2Card(randomFrom(TEST_PLAYERS));
    setCurrentPicker(randomFrom<Side>(["p1", "p2"]));
    setRoundResolved(false);
    setSelectedStat(null);
    setShowP1Card(false);
    setShowP2Card(false);
  };

  const startNewGame = (nextMode: Mode) => {
    setMode(nextMode);
    setScores({ p1: 0, p2: 0 });
    setRound(1);
    setWinner(null);
    setMessage(nextMode === "ai" ? "You are Player 1. The AI is Player 2." : "Local 1v1 mode. Keep cards hidden from each other.");
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

  const goNextRound = () => {
    if (winner) {
      return;
    }
    setRound((prev) => prev + 1);
    setupRound();
  };

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
    <main className="min-h-screen bg-background text-foreground grid-bg px-6 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-surface/80 p-6 md:p-8 shadow-glow-card">
          <div className="glow-orb glow-orb-cyan h-72 w-72 -top-24 -left-16" />
          <div className="glow-orb glow-orb-purple h-80 w-80 -right-24 top-1/3" />

          <div className="relative z-10">
            <p className="section-eyebrow text-primary">Minigame Test Build</p>
            <h1 className="section-title mt-2">Stat Duel: 1v1 or AI</h1>
            <p className="mt-4 max-w-3xl text-sm md:text-base text-fore-muted leading-7">
              Each round both sides receive a random player card. The picker is chosen randomly. Picker selects a
              stat, higher value wins the point. First to 10 points wins the match.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => startNewGame("pvp")}>
                Start 1v1
              </button>
              <button className="btn-ghost" onClick={() => startNewGame("ai")}>
                Start vs AI
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="data-card p-5">
            <p className="section-eyebrow text-fore-muted">Score</p>
            <p className="mt-3 font-display text-3xl text-primary">
              {scores.p1} - {scores.p2}
            </p>
            <p className="mt-2 text-sm text-fore-muted">
              Player 1 vs {mode === "ai" ? "AI" : "Player 2"}
            </p>
          </div>

          <div className="data-card p-5">
            <p className="section-eyebrow text-fore-muted">Round</p>
            <p className="mt-3 font-display text-3xl text-accent">{round}</p>
            <p className="mt-2 text-sm text-fore-muted">Picker: {turnLabel}</p>
          </div>

          <div className="data-card p-5">
            <p className="section-eyebrow text-fore-muted">Match State</p>
            <p className="mt-3 font-display text-2xl text-foreground">
              {winnerLabel ? `${winnerLabel} wins!` : roundReady ? "In Progress" : "Not Started"}
            </p>
            <p className="mt-2 text-sm text-fore-muted">First to 10 points.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-5">
          <p className="text-sm md:text-base text-foreground">{message}</p>
        </div>

        {roundReady && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="cyber-card">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl">Player 1 Card</h2>
                {mode === "pvp" && (
                  <button className="btn-ghost" onClick={() => setShowP1Card((prev) => !prev)}>
                    {showP1Card ? "Hide" : "Show"}
                  </button>
                )}
              </div>
              {(showP1Card || mode === "ai" || roundResolved) && p1Card ? (
                <div className="mt-4 space-y-2 font-mono text-sm">
                  <p className="text-primary uppercase tracking-[0.08em]">{p1Card.name}</p>
                  <p>Appearances: {p1Card.appearances}</p>
                  <p>Goals: {p1Card.goals}</p>
                  <p>Assists: {p1Card.assists}</p>
                </div>
              ) : (
                <p className="mt-4 text-fore-muted">Card hidden.</p>
              )}
            </div>

            <div className="cyber-card">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl">{mode === "ai" ? "AI Card" : "Player 2 Card"}</h2>
                {mode === "pvp" && (
                  <button className="btn-ghost" onClick={() => setShowP2Card((prev) => !prev)}>
                    {showP2Card ? "Hide" : "Show"}
                  </button>
                )}
              </div>
              {(showP2Card || roundResolved) && p2Card ? (
                <div className="mt-4 space-y-2 font-mono text-sm">
                  <p className="text-primary uppercase tracking-[0.08em]">{p2Card.name}</p>
                  <p>Appearances: {p2Card.appearances}</p>
                  <p>Goals: {p2Card.goals}</p>
                  <p>Assists: {p2Card.assists}</p>
                </div>
              ) : (
                <p className="mt-4 text-fore-muted">Card hidden.</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-5">
          <p className="section-eyebrow text-fore-muted">Choose Stat</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {STAT_KEYS.map((stat) => (
              <button
                key={stat}
                className={`btn-ghost ${selectedStat === stat ? "!border-primary !text-primary" : ""}`}
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
            <button className="btn-primary" disabled={!roundResolved || Boolean(winner)} onClick={goNextRound}>
              Next Round
            </button>
            <button className="btn-ghost" onClick={() => startNewGame(mode)}>
              Restart Game
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}