"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UclImage from "@/components/UclImage";
import { playerFaceUrl } from "@/data/playerFaces";
import { formationPortrait, FORMATION_SLOTS } from "@/data/formationInvasion";
import { COMPETITION_LABELS, type Competition } from "@/lib/competitions";
import { lobbyFor } from "@/lib/gameNavigation";
import {
  applyFormationAction, expireFormationStanding, formationSideLabel, formationView, isFormationComp, newFormationGame,
  type FormationAction, type FormationSide, type FormationState, type FormationView,
} from "@/lib/formationInvasion";

type Api = { error?: string; code?: string; token?: string; view?: FormationView };
const ENDPOINT = "/api/game/formation-invasion";
const sideColor = (side: FormationSide) => side === "p1" ? "text-cyan-300" : "text-fuchsia-300";

function Shell({ comp, children }: { comp: Competition; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background grid-bg px-4 py-6 text-foreground md:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3">
          <Link className="btn-ghost" href={lobbyFor(comp)}>Game Arena</Link>
          <Link className="btn-ghost" href={lobbyFor(comp)}>Leave</Link>
        </div>
        <p className="section-eyebrow mt-6 text-primary">{COMPETITION_LABELS[comp]}</p>
        <h1 className="mt-2 text-3xl font-black md:text-5xl">Formation Invasion</h1>
        <p className="mt-2 text-sm text-fore-muted">Three questions. One shared pitch. First to claim six wins.</p>
        {children}
      </section>
    </main>
  );
}

function Rules() {
  return (
    <details className="mt-5 rounded-xl border border-border bg-surface/80 p-4 text-sm">
      <summary className="cursor-pointer font-bold">How to play</summary>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-fore-muted">
        <li>Pick any unlocked footballer in the 4-3-3. New games use one easy and two different medium career questions per footballer, randomly chosen and fixed for this match.</li>
        <li>Choosing a footballer commits you to their current question. You cannot browse other questions or pass after choosing. A correct answer keeps your turn and lets you choose that footballer again or someone else.</li>
        <li>Once a footballer is chosen, both players see the same question and any revealed clues. Only the turn-holder can answer unless a shared-clue race is active.</li>
        <li>A wrong answer passes the turn without resetting progress. Your opponent can finish your work.</li>
        <li>Whoever answers question 3 claims the footballer permanently. Own six of the eleven to win.</li>
        <li>Both players must request a clue for that same question. This starts a race: one attempt each, and the first correct answer advances progress and takes the turn. Question 3 still claims the footballer.</li>
        <li>During a clue race, finish that question before switching or passing. If both answers are wrong, normal turns resume with the original player and the clue remains visible.</li>
        <li>Each question has three progressively stronger clues. Both players agree to each clue, one at a time; each revealed clue starts a new answer race.</li>
        <li>After clue 3, both can vote for Last Man Standing. Both get the same football category, such as South American Premier League winners. A random player starts. Alternate unique answers, with seven seconds per turn. Wrong, repeated or late answers lose.</li>
        <li>The Last Man Standing winner completes the current question and keeps the turn. Only question 3 claims the footballer. If a category runs out of answers, a new category starts.</li>
        <li>You can pass your turn. In solo practice, mistakes are counted; claim six without an opponent and reveal clues immediately.</li>
        <li>Lineups use well-known players active this century with senior appearances in this competition. Questions cover their wider careers.</li>
      </ul>
    </details>
  );
}

function QuestionPanel({ view, index, busy, act }: {
  view: FormationView; index: number; busy: boolean;
  act: (action: FormationAction, side?: FormationSide) => Promise<void>;
}) {
  const [answers, setAnswers] = useState({ p1: "", p2: "" });
  const slot = view.slots[index];
  const race = view.clueRace;
  const raceHere = race?.slot === index;
  const answeringSides: FormationSide[] = view.mode === "local" && raceHere ? ["p1", "p2"]
    : [view.mode === "online" ? view.you : view.turn];
  const canAnswer = (side: FormationSide) => view.phase === "playing" &&
    (race ? raceHere && !race.attempted[side] : side === view.turn);
  const voters: FormationSide[] = view.mode === "local" ? ["p1", "p2"] : [view.you];
  const submit = async (event: FormEvent, side: FormationSide) => {
    event.preventDefault();
    if (!answers[side].trim() || !canAnswer(side) || busy) return;
    await act({ action: "answer", slot: index, question: slot.progress, answer: answers[side] }, side);
    setAnswers((current) => ({ ...current, [side]: "" }));
  };
  return (
    <div className="rounded-2xl border border-primary/30 bg-surface p-5 md:p-6">
      <p className="section-eyebrow text-primary">{slot.position} · {slot.owner ? "Locked" : `Question ${slot.progress + 1} of 3`}</p>
      <h2 className="mt-2 text-2xl font-bold">{slot.name}</h2>
      {slot.owner ? (
        <p className={`mt-4 font-bold ${sideColor(slot.owner)}`}>Claimed by {formationSideLabel(slot.owner)}. Choose another player.</p>
      ) : !slot.question ? (
        <p className="mt-4 text-fore-muted">{view.mode === "online" && view.you !== view.turn
          ? "Waiting for your opponent to choose a footballer. Their selected question will appear here."
          : "Choose this footballer on the pitch to reveal and commit to the question."}</p>
      ) : (
        <>
          <p className="mt-4 text-lg font-semibold leading-relaxed" data-testid="formation-question">{slot.question}</p>
          {raceHere && <p className="mt-4 font-bold text-warning">Clue race: first correct answer takes the turn. One attempt each.</p>}
          {race && !raceHere && <p className="mt-4 text-warning">Finish the clue race on {view.slots[race.slot].name} first.</p>}
          {view.phase === "playing" && answeringSides.map((side) => (
            <form key={side} onSubmit={(event) => void submit(event, side)} className="mt-5 space-y-3">
              <label htmlFor={raceHere ? `formation-answer-${side}` : "formation-answer"} className="block text-sm text-fore-muted">
                {raceHere && race.attempted[side] ? `${formationSideLabel(side)}: attempt used`
                  : canAnswer(side) ? view.mode === "solo" ? "Your answer" : `${formationSideLabel(side)}'s answer` : "Your opponent is answering"}
              </label>
              <input id={raceHere ? `formation-answer-${side}` : "formation-answer"} value={answers[side]}
                onChange={(event) => setAnswers((current) => ({ ...current, [side]: event.target.value }))}
                disabled={!canAnswer(side) || busy} maxLength={150} autoComplete="off"
                placeholder="Type your answer..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base disabled:opacity-50" />
              <button type="submit" className="btn-primary w-full" disabled={!canAnswer(side) || busy || !answers[side].trim()}>
                {view.mode === "local" && raceHere ? `${formationSideLabel(side)}: Submit answer` : "Submit answer"}
              </button>
            </form>
          ))}
          {slot.clues.length > 0 && (
            <ol className="mt-4 space-y-2" aria-label="Revealed clues">
              {slot.clues.map((clue, number) => (
                <li role="note" key={number} className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
                  <strong>Clue {number + 1}:</strong> {clue}
                </li>
              ))}
            </ol>
          )}
        </>
      )}
          {!slot.owner && view.phase === "playing" && view.selectedSlot === index && slot.cluesRevealed < 3 && (
            <div className="mt-5 border-t border-border pt-4">
              <p className="mb-3 text-xs text-fore-muted">{view.mode === "solo" ? "Need help with this question?" : "Stuck? Both players must agree on a clue for this question."}</p>
              <div className="flex flex-wrap gap-2">
                {voters.map((side) => (
                  <button type="button" key={side} className="btn-ghost text-sm"
                    disabled={busy || slot.hints[side] || Boolean(race)}
                    onClick={() => void act({ action: "hint", slot: index, question: slot.progress, clue: slot.cluesRevealed }, side)}>
                    {view.mode === "solo" ? `Reveal clue ${slot.cluesRevealed + 1}` : `${formationSideLabel(side)}: ${slot.hints[side] ? "Clue requested" : `Request clue ${slot.cluesRevealed + 1}`}`}
                  </button>
                ))}
              </div>
              {view.mode === "online" && slot.hints[view.you === "p1" ? "p2" : "p1"] && (
                <p className="mt-2 text-sm text-warning">Your opponent requested this clue.</p>
              )}
            </div>
          )}
          {!slot.owner && view.phase === "playing" && view.selectedSlot === index && view.mode !== "solo" && slot.cluesRevealed === 3 && (
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-sm text-fore-muted">Still stuck after three clues? Both players must agree to Last Man Standing for this question.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {voters.map((side) => (
                  <button type="button" key={side} className="btn-ghost text-sm"
                    disabled={busy || slot.standingVotes[side]}
                    onClick={() => void act({ action: "standing-vote", slot: index, question: slot.progress }, side)}>
                    {formationSideLabel(side)}: {slot.standingVotes[side] ? "Voted for Last Man Standing" : "Start Last Man Standing"}
                  </button>
                ))}
              </div>
            </div>
          )}
    </div>
  );
}

function StandingPanel({ view, now, busy, act }: {
  view: FormationView; now: number; busy: boolean;
  act: (action: FormationAction, side?: FormationSide) => Promise<void>;
}) {
  const [answer, setAnswer] = useState("");
  const standing = view.standing;
  if (!standing) return null;
  const seconds = Math.max(0, Math.min(7, Math.ceil((standing.deadline - now) / 1000)));
  const canAnswer = seconds > 0 && (view.mode === "local" || view.you === standing.turn);
  return (
    <div className="rounded-2xl border border-warning bg-surface p-5 md:p-6" data-testid="formation-standing">
      <h2 className="text-2xl font-bold">Last Man Standing</h2>
      <p className="mt-2 text-sm text-fore-muted">For {view.slots[standing.slot].name}, question {standing.question + 1}. One new answer per turn. Wrong or repeated answers lose.</p>
      <p className="mt-4 text-sm font-bold text-warning">Shared category for both players</p>
      <p className="mt-2 text-lg font-bold" data-testid="standing-prompt">{standing.prompt}</p>
      <p className="mt-2 text-sm text-fore-muted">Take turns giving different answers to this same category.</p>
      <p className={`mt-4 font-bold ${sideColor(standing.turn)}`}>{formationSideLabel(standing.turn)}&apos;s turn</p>
      <p role="timer" className="mt-2 font-mono text-3xl" aria-label="Seconds remaining">{seconds}s</p>
      <form className="mt-4 space-y-3" onSubmit={(event) => {
        event.preventDefault();
        if (!canAnswer || busy || !answer.trim()) return;
        void act({ action: "standing-answer", answer, deadline: standing.deadline }, standing.turn);
      }}>
        <label htmlFor="standing-answer" className="block text-sm">
          {canAnswer ? `${formationSideLabel(standing.turn)}'s answer` : seconds === 0 ? "Time is up" : "Your opponent is answering"}
        </label>
        <input id="standing-answer" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base disabled:opacity-50"
          value={answer} onChange={(event) => setAnswer(event.target.value)} autoComplete="off" maxLength={150}
          disabled={!canAnswer || busy} placeholder="Give a new answer..." />
        <button type="submit" className="btn-primary w-full" disabled={!canAnswer || busy || !answer.trim()}>Submit standing answer</button>
      </form>
      <h3 className="mt-5 text-sm font-bold">Already used in this category</h3>
      {standing.used.length ? <ul className="mt-2 flex flex-wrap gap-2 text-sm">
        {standing.used.map((name) => <li key={name} className="rounded-lg border border-border px-2 py-1">{name}</li>)}
      </ul> : <p className="mt-2 text-sm text-fore-muted">No answers yet.</p>}
    </div>
  );
}

function FormationClient({ comp, code }: { comp: Competition; code: string }) {
  const router = useRouter();
  const [local, setLocal] = useState<FormationState | null>(null);
  const [online, setOnline] = useState<{ view: FormationView; offset: number } | null>(null);
  const [clock, setClock] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const submitting = useRef(false);
  const pitch = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const view = code ? online?.view ?? null : local ? formationView(local, "p1") : null;
  const now = clock + (code ? online?.offset ?? 0 : 0);
  const activeComp = view?.comp ?? comp;

  const acceptView = (next: FormationView) => {
    const offset = next.serverNow - Date.now();
    setOnline((current) => !current || next.revision > current.view.revision ||
      (next.revision === current.view.revision && next.serverNow >= current.view.serverNow) ? { view: next, offset } : current);
  };

  const standingActive = Boolean(view?.standing);
  useEffect(() => {
    if (!standingActive) return;
    const timer = setInterval(() => {
      setClock(Date.now());
      if (!code) setLocal((current) => {
        if (!current?.standing) return current;
        const next = structuredClone(current);
        return expireFormationStanding(next) ? next : current;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [code, standingActive]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = code ? localStorage.getItem(`formation:${code}`) : null;
        if (active) { setToken(stored); setReady(true); }
      } catch {
        if (active) { setError("Browser storage is unavailable. Enable it to keep your online player token."); setReady(true); }
      }
    })();
    return () => { active = false; };
  }, [code]);

  useEffect(() => {
    if (!code || !token) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const res = await fetch(`${ENDPOINT}?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const data = await res.json() as Api;
        if (!res.ok || !data.view) throw new Error(data.error ?? "Could not load the game.");
        if (active) { acceptView(data.view); setConnectionError(null); }
      } catch (e) {
        if (active) setConnectionError(e instanceof Error ? e.message : "Could not load the game.");
      } finally {
        if (active) timer = setTimeout(poll, standingActive ? 250 : 1200);
      }
    };
    void poll();
    return () => { active = false; clearTimeout(timer); };
  }, [code, token, standingActive]);

  const request = async (payload: Record<string, unknown>) => {
    const res = await fetch(ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const data = await res.json() as Api;
    if (data.view) acceptView(data.view);
    if (!res.ok) throw new Error(data.error ?? "Could not update the game.");
    return data;
  };

  const guarded = async (work: () => Promise<void>) => {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError(null);
    try { await work(); } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update the game.");
    } finally { submitting.current = false; setBusy(false); }
  };

  const create = () => guarded(async () => {
    const data = await request({ action: "create", comp });
    if (!data.code || !data.token) throw new Error("The server did not return a room token.");
    localStorage.setItem(`formation:${data.code}`, data.token);
    router.push(`/game/formation-invasion?comp=${comp}&code=${data.code}`);
  });

  const join = () => guarded(async () => {
    const data = await request({ action: "join", code });
    if (!data.token) throw new Error("The server did not return your player token.");
    localStorage.setItem(`formation:${code}`, data.token);
    setToken(data.token);
  });

  const act = (action: FormationAction, side?: FormationSide) => guarded(async () => {
    if (!view) throw new Error("Start or join a game first.");
    if (code) {
      await request({ code, token, gameId: view.gameId, revision: view.revision, ...action });
    } else {
      if (!local) throw new Error("No local game is active.");
      const next = structuredClone(local);
      const error = applyFormationAction(next, side ?? next.turn, action, { gameId: view.gameId, revision: view.revision });
      if (error) throw new Error(error);
      setLocal(next);
    }
  });

  const start = (mode: "local" | "solo") => {
    setError(null);
    try { setLocal(newFormationGame(comp, mode)); } catch (e) {
      setError(e instanceof Error ? e.message : "Could not prepare the formation.");
    }
  };
  const copy = () => guarded(async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/game/formation-invasion?comp=${activeComp}&code=${code}`);
    setCopied(true);
  });
  const activeSelection = view?.standing?.slot ?? view?.clueRace?.slot ?? view?.selectedSlot ?? null;
  const chosen = activeSelection === null ? null : view?.slots[activeSelection];

  return (
    <Shell comp={activeComp}>
      <Rules />
      {error && <p role="alert" className="mt-4 rounded-xl border border-warning/40 p-4 text-warning">{error}</p>}
      {connectionError && <p role="alert" className="mt-4 text-warning">{connectionError} Reconnecting automatically...</p>}
      {!code && !view && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <button type="button" className="data-card p-6 text-left" onClick={() => void create()} disabled={busy}>
            <span className="section-eyebrow text-primary">Online</span>
            <span className="mt-3 block text-xl font-bold">{busy ? "Creating..." : "Invite a friend"}</span>
            <span className="mt-3 block text-sm text-fore-muted">Shared progress, private player tokens, one pitch on two devices.</span>
          </button>
          <button type="button" className="data-card p-6 text-left" onClick={() => start("local")} disabled={busy}>
            <span className="section-eyebrow text-accent">Same device</span>
            <span className="mt-3 block text-xl font-bold">Two players</span>
            <span className="mt-3 block text-sm text-fore-muted">Take turns on this screen. Player 1 is cyan; Player 2 is pink.</span>
          </button>
          <button type="button" className="data-card p-6 text-left" onClick={() => start("solo")} disabled={busy}>
            <span className="section-eyebrow text-warning">Solo</span>
            <span className="mt-3 block text-xl font-bold">Practice alone</span>
            <span className="mt-3 block text-sm text-fore-muted">Claim six players, track mistakes, and reveal clues when needed.</span>
          </button>
          <form className="flex flex-wrap items-end gap-3 md:col-span-3" onSubmit={(event) => {
            event.preventDefault();
            if (/^[A-HJ-NP-Z2-9]{6}$/.test(joinCode.trim().toUpperCase())) {
              router.push(`/game/formation-invasion?comp=${comp}&code=${joinCode.trim().toUpperCase()}`);
            } else setError("Enter a valid six-character invite code.");
          }}>
            <label className="text-sm">Have an invite code?
              <input className="ml-3 w-36 rounded-lg border border-border bg-surface p-3 uppercase" aria-label="Room code"
                value={joinCode} maxLength={6} onChange={(event) => setJoinCode(event.target.value)} />
            </label>
            <button type="submit" className="btn-ghost">Open room</button>
          </form>
        </div>
      )}
      {code && !view && !token && ready && (
        <div className="data-card mt-6 p-6">
          <h2 className="text-xl font-bold">Join room {code}</h2>
          <p className="mt-3 text-sm text-fore-muted">Join as Player 2. The room&apos;s competition will be used.</p>
          <button type="button" className="btn-primary mt-4" disabled={busy} onClick={() => void join()}>Join game</button>
        </div>
      )}
      {code && !view && (!ready || token) && <p className="mt-6">Loading your formation...</p>}
      {view?.phase === "waiting" && (
        <div className="data-card mt-6 p-6">
          <h2 className="text-2xl">Waiting for your opponent</h2>
          <p className="mt-3">Room code: <strong className="font-mono tracking-widest">{code}</strong></p>
          <p className="mt-2 text-sm text-fore-muted">Share the invite link. You are Player 1 and take the first turn.</p>
          <button type="button" onClick={() => void copy()} disabled={busy} className="btn-primary mt-4">{copied ? "Invite link copied" : "Copy invite link"}</button>
        </div>
      )}
      {view && view.phase !== "waiting" && (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
            <p className="font-bold text-cyan-300">{view.mode === "solo" ? "You" : "Player 1"}: {view.scores.p1}/6</p>
            {view.mode !== "solo" && <p className="font-bold text-fuchsia-300">Player 2: {view.scores.p2}/6</p>}
            <p className={`font-bold ${sideColor(view.turn)}`}>
              {view.phase === "finished" ? view.mode === "solo" ? "Practice complete!" : `${formationSideLabel(view.winner!)} wins!`
                : view.standing ? `Last Man Standing: ${formationSideLabel(view.standing.turn)}'s turn`
                : view.clueRace ? "Shared-clue race: both players can answer"
                : view.mode === "solo" ? "Solo practice" : `${formationSideLabel(view.turn)}'s turn${code ? ` (you: ${formationSideLabel(view.you)})` : ""}`}
            </p>
          </div>
          <div role="status" aria-live="polite" className="my-4 min-h-12 rounded-lg bg-surface/70 p-3 text-sm">
            {view.notice ?? "Choose a footballer to start their first question."}
          </div>
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div ref={pitch} className="relative mx-auto aspect-[3/4] min-h-[580px] w-full max-w-[520px] scroll-mt-24 overflow-hidden rounded-3xl border-2 border-emerald-300/60 bg-emerald-950 shadow-xl sm:min-h-0"
              aria-label="4-3-3 formation pitch">
              <div aria-hidden className="pointer-events-none absolute inset-3 rounded-xl border border-emerald-200/30" />
              <div aria-hidden className="pointer-events-none absolute inset-x-3 top-1/2 border-t border-emerald-200/30" />
              <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[20%] w-[27%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/30" />
              {[0, 1].map((end) => <div key={end} aria-hidden className={`pointer-events-none absolute left-[25%] h-[13%] w-1/2 border border-emerald-200/30 ${end ? "bottom-3 border-b-0" : "top-3 border-t-0"}`} />)}
              {view.slots.map((slot, index) => (
                <button type="button" key={slot.playerId} data-testid={`formation-slot-${index}`}
                  aria-label={`${slot.name}, ${slot.position}, ${slot.owner ? `claimed by ${formationSideLabel(slot.owner)}` : `${slot.progress} of 3 completed`}`}
                  aria-pressed={activeSelection === index} disabled={busy || Boolean(view.standing) || Boolean(view.clueRace) ||
                    Boolean(view.selectedSlot != null) || (view.mode === "online" && view.you !== view.turn) || Boolean(slot.owner)}
                  onClick={() => {
                    void act({ action: "select", slot: index, question: slot.progress });
                    if (window.matchMedia("(max-width: 1023px)").matches) panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{ left: `${FORMATION_SLOTS[index].x}%`, top: `${FORMATION_SLOTS[index].y}%` }}
                  className={`absolute flex w-[22%] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl border p-1 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                    ${slot.owner === "p1" ? "border-cyan-300 bg-cyan-950" : slot.owner === "p2" ? "border-fuchsia-300 bg-fuchsia-950" : "border-emerald-200/40 bg-slate-950/85"}
                    ${activeSelection === index ? "ring-2 ring-yellow-300" : "hover:border-yellow-200"}`}>
                  <span className="text-[9px] font-bold text-emerald-100/80">{slot.position}</span>
                  <UclImage src={playerFaceUrl(slot.name)} fallback={formationPortrait(slot.playerId)} alt={slot.name} shape="circle" className="h-8 w-8 sm:h-12 sm:w-12" />
                  <span className="mt-0.5 line-clamp-2 min-h-6 w-full text-[10px] font-bold leading-3 sm:min-h-7 sm:text-xs sm:leading-3.5">{slot.name}</span>
                  <span className={`text-[9px] font-bold sm:text-[10px] ${slot.owner ? sideColor(slot.owner) : "text-emerald-200"}`}>
                    {slot.owner ? `${slot.owner === "p1" ? "P1" : "P2"} LOCKED` : `${slot.progress}/3`}
                  </span>
                </button>
              ))}
            </div>
            <div ref={panel} className="scroll-mt-24 space-y-4">
              <button type="button" className="btn-ghost lg:hidden" onClick={() => pitch.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>Choose a player on the pitch</button>
              {view.standing ? (
                <StandingPanel key={`${view.gameId}:${view.revision}:${view.standing.deadline}`} view={view} now={now} busy={busy} act={act} />
              ) : chosen && activeSelection !== null ? (
                <QuestionPanel key={`${view.gameId}:${activeSelection}:${chosen.progress}:${view.turn}:${Boolean(view.clueRace)}`} view={view} index={activeSelection} busy={busy} act={act} />
              ) : (
                <div className="data-card p-6">
                  <h2 className="text-xl font-bold">Choose your target</h2>
                  <p className="mt-3 text-sm leading-6 text-fore-muted">Tap a player on the pitch. Answer all three questions to claim them, or take over a player your opponent has started.</p>
                </div>
              )}
              <p className="text-xs text-fore-muted">
                Correct answers: {view.mode === "solo" ? view.correct.p1 : `P1 ${view.correct.p1} / P2 ${view.correct.p2}`} ·
                Mistakes: {view.mode === "solo" ? view.mistakes.p1 : `P1 ${view.mistakes.p1} / P2 ${view.mistakes.p2}`}
              </p>
              {view.phase === "playing" && view.mode !== "solo" && (
                <button type="button" className="btn-ghost" disabled={busy || view.selectedSlot != null || Boolean(view.standing) || Boolean(view.clueRace) || (view.mode === "online" && view.you !== view.turn)}
                  onClick={() => void act({ action: "pass" })}>Pass turn</button>
              )}
              {view.phase === "finished" && (
                <div className="data-card p-5">
                  <h2 className="text-xl font-bold">{view.mode === "solo" ? "Six players claimed!" : `${formationSideLabel(view.winner!)} owns the formation!`}</h2>
                  <p className="mt-2 text-sm text-fore-muted">{view.mode === "solo" ? "Play again for a new lineup." : "Both players must vote to start a new game."}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(view.mode === "local" ? ["p1", "p2"] as const : [view.you]).map((side) => (
                      <button type="button" key={side} disabled={busy || view.rematch[side]} className="btn-primary"
                        onClick={() => void act({ action: "rematch" }, side)}>
                        {view.mode === "solo" ? "Play again" : `${formationSideLabel(side)}: ${view.rematch[side] ? "Voted" : "New game"}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <footer className="mt-8 text-xs text-fore-muted">
        <Link href="/game/formation-invasion/credits" className="underline">Image licences</Link>
      </footer>
    </Shell>
  );
}

function PageContent() {
  const search = useSearchParams();
  const rawComp = search.get("comp") ?? "pl";
  if (!isFormationComp(rawComp)) return <main className="p-8"><p role="alert">Unsupported competition.</p><Link href="/game">Game Arena</Link></main>;
  const code = (search.get("code") ?? "").trim().toUpperCase();
  return <FormationClient key={`${rawComp}:${code}`} comp={rawComp} code={code} />;
}

export default function FormationInvasionPage() {
  return <Suspense fallback={<p className="p-8">Loading Formation Invasion...</p>}><PageContent /></Suspense>;
}
