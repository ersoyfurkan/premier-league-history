"use client";

import { useState } from "react";
import CardFace from "@/components/CardFace";
import type { PlayerCard } from "@/data/players";
import { poolFor, type Competition } from "@/lib/gameRoom";

export type MiniGameMode = "higher-lower" | "tic-tac-toe" | "transfer-draft";

const STAT_LABELS = {
  goals: "career goals",
  appearances: "appearances",
  assists: "assists",
} as const;

function samplePlayers(pool: PlayerCard[], count: number, excluded: string[] = []) {
  const available = pool.filter((player) => !excluded.includes(player.id));
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
      setFeedback(
        `${challenger.name} has ${challengerValue} ${STAT_LABELS[stat]} — correct!`
      );
    } else {
      setGameOver(true);
      setFeedback(
        `Not quite — ${challenger.name} has ${challengerValue} ${STAT_LABELS[stat]}.`
      );
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
      {gameOver && (
        <button type="button" onClick={start} className="btn-primary mt-4">Play again</button>
      )}
      <button type="button" onClick={onBack} className="btn-ghost mt-6">← All game modes</button>
    </div>
  );
}

function winnerFor(board: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function TicTacToe({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [result, setResult] = useState<string | null>(null);

  const play = (index: number) => {
    if (board[index] || result) return;
    const next = [...board];
    next[index] = "X";
    if (winnerFor(next)) {
      setBoard(next);
      setResult("You win!");
      return;
    }
    const open = next.flatMap((cell, cellIndex) => cell ? [] : [cellIndex]);
    if (!open.length) {
      setBoard(next);
      setResult("It’s a draw!");
      return;
    }
    const cpuMove = (mark: string) => {
      for (const cellIndex of open) {
        const test = [...next];
        test[cellIndex] = mark;
        if (winnerFor(test) === mark) return cellIndex;
      }
      return -1;
    };
    const cpuIndex = cpuMove("O");
    const blockIndex = cpuIndex < 0 ? cpuMove("X") : cpuIndex;
    const fallbackIndex = open.includes(4) ? 4 : open[0];
    next[blockIndex >= 0 ? blockIndex : fallbackIndex] = "O";
    setBoard(next);
    if (winnerFor(next)) setResult("The AI wins this round.");
    else if (next.every(Boolean)) setResult("It’s a draw!");
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setResult(null);
  };

  return (
    <div className="mt-8 rounded-2xl border border-accent/25 bg-surface/80 p-5 text-left md:p-8">
      <p className="section-eyebrow text-accent">Quick game</p>
      <h2 className="mt-2 text-3xl">Tic-Tac-Toe</h2>
      <p className="mt-2 text-sm text-fore-muted">You’re X. Try to beat the football-minded AI.</p>
      <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            onClick={() => play(index)}
            disabled={Boolean(cell) || Boolean(result)}
            aria-label={`Square ${index + 1}${cell ? `, ${cell}` : ""}`}
            className="aspect-square rounded-xl border border-border bg-background text-4xl font-bold text-primary transition hover:border-accent disabled:cursor-default disabled:hover:border-border"
          >
            {cell}
          </button>
        ))}
      </div>
      <div className="mt-5 min-h-8 text-center" aria-live="polite">
        {result ? <p className="text-lg font-semibold text-accent">{result}</p> : <p className="text-sm text-fore-muted">Your turn</p>}
      </div>
      {result && <button type="button" onClick={reset} className="btn-primary mx-auto mt-3 block">Play again</button>}
      <button type="button" onClick={onBack} className="btn-ghost mt-5">← All game modes</button>
    </div>
  );
}

function draftCost(player: PlayerCard, players: PlayerCard[]) {
  const maxGoals = Math.max(...players.map((item) => item.goals), 1);
  const maxAssists = Math.max(...players.map((item) => item.assists), 1);
  return 5 + Math.round((player.goals / maxGoals) * 32 + (player.assists / maxAssists) * 13);
}

function TransferDraft({ comp, onBack }: { comp: Competition; onBack: () => void }) {
  const players = poolFor(comp);
  const rosterSize = 5;
  const startingBudget = 100;
  const [started, setStarted] = useState(false);
  const [budget, setBudget] = useState(startingBudget);
  const [roster, setRoster] = useState<PlayerCard[]>([]);
  const [offers, setOffers] = useState<PlayerCard[]>([]);

  const startDraft = () => {
    setStarted(true);
    setBudget(startingBudget);
    setRoster([]);
    setOffers(samplePlayers(players, 3));
  };

  const buy = (player: PlayerCard) => {
    const cost = draftCost(player, players);
    const nextRoster = [...roster, player];
    const nextBudget = budget - cost;
    setRoster(nextRoster);
    setBudget(nextBudget);
    setOffers(nextRoster.length < rosterSize ? samplePlayers(players, 3, nextRoster.map((item) => item.id)) : []);
  };

  const finished = roster.length === rosterSize;
  const affordableOffers = offers.filter((player) => draftCost(player, players) <= budget);
  const stuck = started && !finished && offers.length > 0 && affordableOffers.length === 0;

  return (
    <div className="mt-8 rounded-2xl border border-warning/25 bg-surface/80 p-5 text-left md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow text-warning">Quick game</p>
          <h2 className="mt-2 text-3xl">Transfer Market Draft</h2>
          <p className="mt-2 max-w-2xl text-sm text-fore-muted">
            Draft five players within a 100-credit budget. Prices are game-only values based on competition stats, not real transfer fees.
          </p>
        </div>
        <p className="font-mono text-lg text-warning">Budget: {budget} credits</p>
      </div>

      {!started ? (
        <button type="button" onClick={startDraft} className="btn-primary mt-6">Open the market</button>
      ) : finished ? (
        <div className="mt-6 rounded-xl border border-success/30 bg-success/10 p-5">
          <h3 className="text-2xl font-bold text-success">Squad complete!</h3>
          <p className="mt-1 text-sm text-fore-muted">You built a five-player squad with {budget} credits left.</p>
        </div>
      ) : stuck ? (
        <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-5">
          <p className="font-semibold">Budget exhausted before your squad was complete.</p>
        </div>
      ) : (
        <>
          <p className="mt-5 text-sm text-fore-muted">Squad: {roster.length}/{rosterSize}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {affordableOffers.map((player) => {
              const cost = draftCost(player, players);
              return (
                <article key={player.id} className="data-card flex flex-col p-4">
                  <CardFace card={player} />
                  <h3 className="mt-3 text-lg font-bold">{player.name}</h3>
                  <p className="mt-1 text-sm text-fore-muted">{player.club ?? "Competition legend"}</p>
                  <p className="mt-3 font-mono text-xs text-primary">
                    {player.goals} goals · {player.appearances} apps
                  </p>
                  <button type="button" onClick={() => buy(player)} className="btn-primary mt-4">
                    Sign · {cost} credits
                  </button>
                </article>
              );
            })}
          </div>
        </>
      )}

      {roster.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="font-mono text-xs uppercase tracking-wide text-fore-muted">Your squad</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {roster.map((player) => (
              <span key={player.id} className="rounded-full border border-success/25 bg-success/10 px-3 py-2 text-sm">
                {player.name}
              </span>
            ))}
          </div>
        </div>
      )}
      {started && (finished || stuck) && <button type="button" onClick={startDraft} className="btn-primary mt-5">Start another draft</button>}
      <button type="button" onClick={onBack} className="btn-ghost mt-5">← All game modes</button>
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
  if (mode === "tic-tac-toe") return <TicTacToe onBack={onBack} />;
  return <TransferDraft comp={comp} onBack={onBack} />;
}
