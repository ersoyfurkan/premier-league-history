"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UclImage from "@/components/UclImage";
import TriviaPathOnline from "@/components/TriviaPathOnline";
import { playerFaceUrl } from "@/data/playerFaces";
import { lobbyFor, parseComp } from "@/lib/gameRoom";
import {
  BOARD_SIZE,
  answersFor,
  generateBoard,
  matchTriviaAnswer,
  rollDice,
  suggestTrivia,
  tileQuestion,
  triviaSeconds,
  type BoardTile,
  type TriviaEntry,
} from "@/data/triviaPath";

const LABELS = {
  pl: "Premier League",
  laliga: "La Liga",
  seriea: "Serie A",
  ucl: "Champions League",
  bundesliga: "Bundesliga",
  ligue1: "Ligue 1 McDonald's",
  superlig: "Süper Lig",
} as const;
const DOTS = ["bg-accent", "bg-warning"];

type Phase = "setup" | "roll" | "play" | "result" | "over";
// pos is the number of tiles reached: 0 is the start, BOARD_SIZE is the finish.
type Player = { name: string; pos: number; turns: number };

function TriviaClient() {
  const comp = parseComp(useSearchParams().get("comp"));
  const router = useRouter();
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [phase, setPhase] = useState<Phase>("setup");
  const [versus, setVersus] = useState(true);
  const [names, setNames] = useState(["Player 1", "Player 2"]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [board, setBoard] = useState<BoardTile[]>([]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [required, setRequired] = useState(1);
  const [found, setFound] = useState<TriviaEntry[]>([]);
  const [taken, setTaken] = useState<Record<number, string[]>>({});
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const [origin, setOrigin] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    if (phase !== "play") return;
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, [phase]);

  const secondsLeft = Math.max(0, Math.ceil((deadline - now) / 1000));
  const current = players[turn];
  // origin is the position at roll time, so the target stays correct after pos updates in the result phase
  const targetPos = dice ? Math.min(origin + dice, BOARD_SIZE) : 0;
  const tile = dice ? board[targetPos - 1] : undefined;

  const createInvite = async () => {
    setInviting(true);
    setInviteError(null);
    try {
      const res = await fetch("/api/game/trivia-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", comp }),
      });
      const data = (await res.json()) as { error?: string; code?: string; token?: string };
      if (!res.ok || !data.code || !data.token) throw new Error(data.error ?? "Could not create the game");
      localStorage.setItem(`pltrivia:${data.code}`, data.token);
      router.push(`/game/trivia-path?code=${data.code}&comp=${comp}`);
    } catch (e) {
      setInviteError(e instanceof Error ? e.message : "Could not create the game");
      setInviting(false);
    }
  };

  const start = () => {
    setBoard(generateBoard(comp));
    setPlayers((versus ? names : [names[0]]).map((name, i) => ({ name: name.trim() || `Player ${i + 1}`, pos: 0, turns: 0 })));
    setTurn(0);
    setTaken({});
    setDice(null);
    setPhase("roll");
  };

  const roll = () => {
    if (rolling || !current) return;
    setRolling(true);
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks += 1;
      setDice(rollDice());
      if (ticks < 9) return;
      window.clearInterval(timer);
      const final = rollDice();
      const target = board[Math.min(current.pos + final, BOARD_SIZE) - 1];
      const count = answersFor(target, final);
      const stamp = Date.now();
      setDice(final);
      setOrigin(current.pos);
      setRequired(count);
      setFound([]);
      setGuess("");
      setFeedback(null);
      setNow(stamp);
      setDeadline(stamp + triviaSeconds(count) * 1000);
      finished.current = false;
      setRolling(false);
      setPhase("play");
    }, 80);
  };

  const finishTurn = (success: boolean, answers: TriviaEntry[] = found) => {
    if (finished.current) return;
    finished.current = true;
    setPassed(success);
    // Only answers from a completed question are used up; a failed attempt counts for nothing.
    if (success) setTaken((prev) => ({ ...prev, [targetPos - 1]: [...(prev[targetPos - 1] ?? []), ...answers.map((a) => a.name)] }));
    setPlayers((prev) =>
      prev.map((p, i) => (i === turn ? { ...p, pos: success ? targetPos : p.pos, turns: p.turns + 1 } : p)),
    );
    setPhase("result");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (phase === "play" && secondsLeft === 0 && deadline > 0) finishTurn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft, deadline]);

  const submitAnswer = (value: string) => {
    if (!tile || phase !== "play") return;
    const used = taken[targetPos - 1] ?? [];
    const open = tile.entries.filter((e) => !found.includes(e) && !used.includes(e.name));
    // Match against open entries first so a shared name (e.g. "Ronaldo") can still reach the other player.
    const entry = matchTriviaAnswer(open, value);
    setGuess("");
    if (!entry) {
      const repeat = matchTriviaAnswer(tile.entries, value);
      if (repeat) {
        setFeedback(found.includes(repeat) ? "Already said that one" : "Already answered on this question — try another");
        return;
      }
      setFeedback("Wrong answer — you lose your turn");
      finishTurn(false);
      return;
    }
    const next = [...found, entry];
    setFound(next);
    setFeedback(null);
    if (next.length >= required) finishTurn(true, next);
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
    setTurn((turn + 1) % players.length);
    setDice(null);
    setPhase("roll");
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
  const showTarget = (phase === "play" || phase === "result") && dice;

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
            <h1 className="text-2xl font-bold">Roll, move, answer</h1>
            <p className="mt-2 text-sm leading-6 text-fore-muted">
              Take turns rolling the dice. The number is how many spaces you move and how many correct answers you must
              give for the category on the space you land on, before the countdown ends. Get it right and you stay on
              the new space. Get one wrong and you lose your turn and stay where you were. First to the last space wins.
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
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-sm text-fore-muted">Or play a friend on their own device, invite only.</p>
              <button type="button" onClick={createInvite} disabled={inviting} className="btn-ghost mt-3">
                {inviting ? "Creating…" : "Play online"}
              </button>
              {inviteError && <p className="mt-2 text-sm text-red-400">{inviteError}</p>}
            </div>
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
                  {p.name} · {p.pos}/{BOARD_SIZE}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {board.map((t, i) => (
                <div
                  key={i}
                  className={`relative flex min-h-20 flex-col justify-between rounded-xl border p-2 text-xs ${
                    showTarget && i === targetPos - 1 ? "border-accent bg-accent/10" : "border-line bg-background/60"
                  }`}
                >
                  <span className="font-mono text-fore-muted">{i + 1}{i === BOARD_SIZE - 1 ? " 🏁" : ""}</span>
                  <span className="line-clamp-2 leading-tight">{t.short}</span>
                  <div className="absolute -top-2 right-1 flex gap-1">
                    {players.map((p, pi) =>
                      p.pos === i + 1 ? (
                        <span key={pi} className={`h-4 w-4 rounded-full border border-background ${DOTS[pi]}`} />
                      ) : null,
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
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

        {(phase === "play" || phase === "result") && tile && current && dice && (
          <div className="mt-6 rounded-2xl border border-line bg-background/60 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-accent text-3xl font-black">
                {dice}
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-fore-muted">
                  Rolled {dice} · moving to space {targetPos}
                </p>
                <p className="text-xl font-bold leading-snug">{tileQuestion(tile, required)}</p>
              </div>
              {phase === "play" && (
                <div className={`font-mono text-3xl font-black ${secondsLeft <= 5 ? "text-red-400" : "text-warning"}`}>
                  {secondsLeft}
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-fore-muted">{current.name}: {found.length}/{required}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {found.map((entry) => (
                <li key={entry.name} className={`rounded-full border px-3 py-1 text-sm ${phase === "result" && !passed ? "border-red-400/40 bg-red-400/10 text-fore-muted line-through" : "border-accent/50 bg-accent/10"}`}>
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
                  {passed ? `Correct! You move to space ${targetPos}.` : "Wrong. Back to where you were."}
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

function Entry() {
  const search = useSearchParams();
  const code = (search.get("code") ?? "").toUpperCase();
  if (!code) return <TriviaClient />;
  return (
    <main className="min-h-[calc(100svh-5rem)] bg-background text-foreground grid-bg px-4 py-4 md:px-8 md:py-6">
      <TriviaPathOnline comp={parseComp(search.get("comp"))} code={code} />
    </main>
  );
}

export default function TriviaPathPage() {
  return (
    <Suspense fallback={null}>
      <Entry />
    </Suspense>
  );
}
