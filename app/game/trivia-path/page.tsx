"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import UclImage from "@/components/UclImage";
import { playerFaceUrl } from "@/data/playerFaces";
import { lobbyFor, parseComp } from "@/lib/gameRoom";
import {
  BOARD_SIZE,
  generateBoard,
  matchTriviaAnswer,
  suggestTrivia,
  triviaSeconds,
  type BoardTile,
  type TriviaEntry,
} from "@/data/triviaPath";

const LABELS = { pl: "Premier League", laliga: "La Liga", seriea: "Serie A", ucl: "Champions League" } as const;
const DOTS = ["bg-accent", "bg-warning"];

type Phase = "setup" | "play" | "result" | "over";
type Player = { name: string; pos: number; turns: number };

function TriviaClient() {
  const comp = parseComp(useSearchParams().get("comp"));
  const [phase, setPhase] = useState<Phase>("setup");
  const [versus, setVersus] = useState(true);
  const [names, setNames] = useState(["Player 1", "Player 2"]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [board, setBoard] = useState<BoardTile[]>([]);
  const [turn, setTurn] = useState(0);
  const [found, setFound] = useState<TriviaEntry[]>([]);
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    if (phase !== "play") return;
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, [phase]);

  const secondsLeft = Math.max(0, Math.ceil((deadline - now) / 1000));
  const current = players[turn];
  const tile = current ? board[current.pos] : undefined;

  const beginTurn = (nextTurn: number, nextPlayers: Player[], nextBoard: BoardTile[]) => {
    const t = nextBoard[nextPlayers[nextTurn].pos];
    const stamp = Date.now();
    setTurn(nextTurn);
    setFound([]);
    setGuess("");
    setFeedback(null);
    setNow(stamp);
    setDeadline(stamp + triviaSeconds(t.count) * 1000);
    finished.current = false;
    setPhase("play");
  };

  const start = () => {
    const nextBoard = generateBoard(comp);
    const nextPlayers = (versus ? names : [names[0]]).map((name, i) => ({
      name: name.trim() || `Player ${i + 1}`,
      pos: 0,
      turns: 0,
    }));
    setBoard(nextBoard);
    setPlayers(nextPlayers);
    beginTurn(0, nextPlayers, nextBoard);
  };

  const finishTurn = (success: boolean) => {
    if (finished.current) return;
    finished.current = true;
    setPassed(success);
    setPlayers((prev) =>
      prev.map((p, i) => (i === turn ? { ...p, pos: p.pos + (success ? 1 : 0), turns: p.turns + 1 } : p)),
    );
    setPhase("result");
  };

  useEffect(() => {
    if (phase === "play" && secondsLeft === 0 && deadline > 0) finishTurn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft, deadline]);

  const submitAnswer = (value: string) => {
    if (!tile || phase !== "play") return;
    const entry = matchTriviaAnswer(tile.entries, value);
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
    if (next.length >= tile.count) finishTurn(true);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    submitAnswer(guess);
  };

  const next = () => {
    if (players.some((p) => p.pos >= BOARD_SIZE)) {
      setPhase("over");
      return;
    }
    beginTurn((turn + 1) % players.length, players, board);
  };

  const suggestions = useMemo(
    () => (phase === "play" ? suggestTrivia(comp, guess).filter((n) => !found.some((f) => f.name === n)) : []),
    [comp, guess, phase, found],
  );

  const winner = players.find((p) => p.pos >= BOARD_SIZE);
  const missed =
    tile && phase === "result" && !passed && !versus
      ? tile.entries.filter((entry) => !found.includes(entry)).slice(0, 5)
      : [];

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
            <h1 className="text-2xl font-bold">Race along the board</h1>
            <p className="mt-2 text-sm leading-6 text-fore-muted">
              A random path of {BOARD_SIZE} tiles. On your turn, answer the question on your next tile before the clock
              runs out. Get it right and you move forward. Get it wrong and you stay put. First to the last tile wins.
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
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {players.map((p, i) => (
                <div
                  key={i}
                  className={`rounded-xl border px-4 py-2 text-sm ${
                    i === turn && phase !== "over" ? "border-accent text-accent" : "border-line"
                  }`}
                >
                  <span className={`mr-2 inline-block h-3 w-3 rounded-full align-middle ${DOTS[i]}`} />
                  {p.name} · tile {Math.min(p.pos, BOARD_SIZE)}/{BOARD_SIZE}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {board.map((t, i) => (
                <div
                  key={i}
                  className={`relative flex min-h-20 flex-col justify-between rounded-xl border p-2 text-xs ${
                    current && i === current.pos && phase !== "over" ? "border-accent bg-accent/10" : "border-line bg-background/60"
                  } ${players.every((p) => p.pos > i) ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-fore-muted">{i + 1}</span>
                    <span className="rounded-md border border-line px-1.5 font-bold">{t.count}</span>
                  </div>
                  <span className="line-clamp-2 leading-tight">{t.short}</span>
                  <div className="absolute -top-2 right-1 flex gap-1">
                    {players.map((p, pi) =>
                      p.pos === i ? (
                        <span key={pi} className={`h-4 w-4 rounded-full border border-background ${DOTS[pi]}`} />
                      ) : null,
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {(phase === "play" || phase === "result") && tile && current && (
          <div className="mt-6 rounded-2xl border border-line bg-background/60 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-accent text-3xl font-black">
                {tile.count}
              </div>
              <p className="flex-1 text-xl font-bold leading-snug">{tile.text}</p>
              {phase === "play" && (
                <div className={`font-mono text-3xl font-black ${secondsLeft <= 5 ? "text-red-400" : "text-warning"}`}>
                  {secondsLeft}
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-fore-muted">{current.name}: {found.length}/{tile.count}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {found.map((entry) => (
                <li key={entry.name} className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-sm">
                  {entry.name}
                </li>
              ))}
            </ul>
            {phase === "play" && (
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
                          onClick={() => submitAnswer(name)}
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
            {feedback && phase === "play" && <p className="mt-2 text-sm text-red-400">{feedback}</p>}
            {phase === "result" && (
              <div className="mt-5">
                <p className={`text-lg font-bold ${passed ? "text-accent" : "text-red-400"}`}>
                  {passed ? "Correct! Move forward." : "Wrong. You stay where you are."}
                </p>
                {missed.length > 0 && (
                  <p className="mt-1 text-sm text-fore-muted">Could have said: {missed.map((m) => m.name).join(", ")}</p>
                )}
                <button type="button" onClick={next} className="btn-primary mt-4">
                  {players.some((p) => p.pos >= BOARD_SIZE) ? "Finish" : "Next turn"}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "over" && winner && (
          <div className="mt-6 rounded-2xl border border-line bg-background/60 p-8 text-center">
            <h2 className="text-2xl font-bold">
              {versus ? `${winner.name} wins!` : `Finished in ${winner.turns} turns`}
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
