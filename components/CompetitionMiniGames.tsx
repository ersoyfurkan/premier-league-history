"use client";

import { useState } from "react";
import CardFace from "@/components/CardFace";
import type { PlayerCard } from "@/data/players";
import { MARKET_VALUE_PLAYERS, type MarketValuePlayer } from "@/data/marketValues";
import { poolFor, type Competition } from "@/lib/gameRoom";

export type MiniGameMode = "higher-lower" | "transfer-market";

const STAT_LABELS = {
  goals: "career goals",
  appearances: "appearances",
  assists: "assists",
} as const;

function samplePlayers<T extends { id?: string; name: string }>(pool: T[], count: number, excluded: string[] = []) {
  const available = pool.filter((player) => !excluded.includes(player.id ?? player.name));
  for (let index = available.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [available[index], available[swapIndex]] = [available[swapIndex], available[index]];
  }
  return available.slice(0, count);
}

function HigherLower({ comp, onBack }: { comp: Competition; onBack: () => void }) {
  const players = poolFor(comp);
  const [stat, setStat] = useState<keyof typeof STAT_LABELS>("goals");
  const [pair, setPair] = useState<[PlayerCard, PlayerCard] | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");

  const start = () => {
    const [first, second] = samplePlayers(players, 2);
    if (!first || !second) return;
    setPair([first, second]);
    setScore(0);
    setGameOver(false);
    setFeedback("");
  };

  const guess = (direction: "higher" | "lower") => {
    if (!pair || gameOver) return;
    const [current, challenger] = pair;
    const currentValue = current[stat];
    const challengerValue = challenger[stat];
    const correct =
      currentValue === challengerValue ||
      (direction === "higher" ? challengerValue > currentValue : challengerValue < currentValue);

    if (correct) {
      const nextPlayer = samplePlayers(players, 1, [challenger.id])[0];
      setPair(nextPlayer ? [challenger, nextPlayer] : null);
      setScore((value) => value + 1);
      setFeedback(`${challenger.name} has ${challengerValue} ${STAT_LABELS[stat]} — correct!`);
    } else {
      setGameOver(true);
      setFeedback(`Not quite — ${challenger.name} has ${challengerValue} ${STAT_LABELS[stat]}.`);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-primary/25 bg-surface/80 p-5 text-left md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow text-primary">Quick game</p>
          <h2 className="mt-2 text-3xl">Higher or Lower</h2>
          <p className="mt-2 text-sm text-fore-muted">Guess who has more in the selected competition stat.</p>
        </div>
        <p className="font-mono text-lg text-accent">Streak: {score}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(STAT_LABELS) as (keyof typeof STAT_LABELS)[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setStat(key)}
            disabled={Boolean(pair) && !gameOver}
            className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-wide ${
              stat === key ? "border-primary/50 bg-primary/15 text-primary" : "border-border text-fore-muted"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {key}
          </button>
        ))}
      </div>

      {pair ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="data-card p-5">
            <CardFace card={pair[0]} />
            <p className="mt-4 text-2xl font-bold">{pair[0].name}</p>
            <p className="mt-1 text-sm text-fore-muted">{pair[0].club ?? "Career record"}</p>
            <p className="mt-4 font-mono text-primary">{pair[0][stat]} {STAT_LABELS[stat]}</p>
          </div>
          <div className="data-card p-5">
            <CardFace card={pair[1]} />
            <p className="mt-4 text-2xl font-bold">{pair[1].name}</p>
            <p className="mt-1 text-sm text-fore-muted">{pair[1].club ?? "Career record"}</p>
            <p className="mt-4 font-mono text-accent">
              {gameOver ? `${pair[1][stat]} ${STAT_LABELS[stat]}` : "How many?"}
            </p>
            {!gameOver && (
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => guess("higher")} className="btn-primary">Higher ↑</button>
                <button type="button" onClick={() => guess("lower")} className="btn-ghost">Lower ↓</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-background/50 p-8 text-center">
          <p className="text-fore-muted">See how long you can keep your streak going.</p>
          <button type="button" onClick={start} className="btn-primary mt-5">Start guessing</button>
        </div>
      )}

      {feedback && <p aria-live="polite" className="mt-4 text-sm text-foreground">{feedback}</p>}
      {gameOver && <button type="button" onClick={start} className="btn-primary mt-4">Play again</button>}
      <button type="button" onClick={onBack} className="btn-ghost mt-6">← All game modes</button>
    </div>
  );
}

function formatValue(value: number) {
  return `€${value}m`;
}

function TransferMarketHigherLower({ comp, onBack }: { comp: Competition; onBack: () => void }) {
  const players = MARKET_VALUE_PLAYERS[comp];
  const [pair, setPair] = useState<[MarketValuePlayer, MarketValuePlayer] | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");

  const start = () => {
    const first = samplePlayers(players, 1)[0];
    const second = first
      ? samplePlayers(players.filter((player) => player.peakValue !== first.peakValue), 1)[0]
      : undefined;
    if (!first || !second) return;
    setPair([first, second]);
    setScore(0);
    setGameOver(false);
    setFeedback("");
  };

  const guess = (direction: "higher" | "lower") => {
    if (!pair || gameOver) return;
    const [current, challenger] = pair;
    const correct =
      current.peakValue === challenger.peakValue ||
      (direction === "higher" ? challenger.peakValue > current.peakValue : challenger.peakValue < current.peakValue);

    if (correct) {
      const nextPlayer = samplePlayers(
        players.filter((player) => player.peakValue !== challenger.peakValue),
        1,
        [challenger.name],
      )[0];
      setPair(nextPlayer ? [challenger, nextPlayer] : null);
      setScore((value) => value + 1);
      setFeedback(`${challenger.name} peaked at ${formatValue(challenger.peakValue)} in ${challenger.peakYear} — correct!`);
    } else {
      setGameOver(true);
      setFeedback(`${challenger.name} peaked at ${formatValue(challenger.peakValue)} in ${challenger.peakYear}.`);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-warning/25 bg-surface/80 p-5 text-left md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow text-warning">Quick game</p>
          <h2 className="mt-2 text-3xl">Transfer Market: Higher or Lower</h2>
          <p className="mt-2 max-w-2xl text-sm text-fore-muted">
            Compare players’ historical peak market values in euros, not transfer fees. Values are rounded to the nearest €5m.
          </p>
        </div>
        <p className="font-mono text-lg text-warning">Streak: {score}</p>
      </div>

      {pair ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {pair.map((player, index) => {
            const reveal = index === 0 || gameOver;
            return (
              <article key={`${player.name}-${index}`} className="data-card flex flex-col p-5">
                <p className="section-eyebrow text-fore-muted">{index === 0 ? "Known value" : "Guess the peak value"}</p>
                <h3 className="mt-4 text-2xl font-bold">{player.name}</h3>
                <p className="mt-1 text-sm text-fore-muted">Club at peak: {player.club}</p>
                <p className={`mt-5 font-display text-5xl ${reveal ? "text-primary" : "text-accent"}`}>
                  {reveal ? formatValue(player.peakValue) : "€?"}
                </p>
                {reveal && (
                  <>
                    <p className="mt-1 text-sm text-fore-muted">Career peak · {player.peakYear}</p>
                    <a href={player.source} target="_blank" rel="noreferrer" className="mt-3 text-xs text-primary underline">
                      View Transfermarkt value history
                    </a>
                  </>
                )}
                {index === 1 && !gameOver && (
                  <div className="mt-auto flex gap-3 pt-5">
                    <button type="button" onClick={() => guess("higher")} className="btn-primary">Higher ↑</button>
                    <button type="button" onClick={() => guess("lower")} className="btn-ghost">Lower ↓</button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-background/50 p-8 text-center">
          <p className="text-fore-muted">Can you beat your best streak using {comp === "pl" ? "Premier League" : comp === "laliga" ? "La Liga" : "Champions League"} stars?</p>
          <button type="button" onClick={start} className="btn-primary mt-5">Open the market</button>
        </div>
      )}

      {feedback && <p aria-live="polite" className="mt-4 text-sm text-foreground">{feedback}</p>}
      {gameOver && <button type="button" onClick={start} className="btn-primary mt-4">Play again</button>}
      <p className="mt-5 text-xs leading-5 text-fore-muted">
        Historical peak market values are estimates recorded by Transfermarkt, not the player’s transfer fee. Open each source to see its value history.
      </p>
      <button type="button" onClick={onBack} className="btn-ghost mt-4">← All game modes</button>
    </div>
  );
}

export default function CompetitionMiniGames({
  comp,
  mode,
  onBack,
}: {
  comp: Competition;
  mode: MiniGameMode;
  onBack: () => void;
}) {
  if (mode === "higher-lower") return <HigherLower comp={comp} onBack={onBack} />;
  return <TransferMarketHigherLower comp={comp} onBack={onBack} />;
}
