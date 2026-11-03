"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COMPETITION_LABELS, type Competition } from "@/lib/competitions";
import { lobbyFor } from "@/lib/gameNavigation";
import UclImage from "@/components/UclImage";
import type { BattleshipClue } from "@/data/footballBattleship";
import type { BattleshipSide, BattleshipView, ShipPlacement } from "@/lib/footballBattleship";

const ENDPOINT = "/api/game/football-battleship";
const SIZES = [2, 3, 4] as const;
const coordinate = (cell: number) => `${String.fromCharCode(65 + Math.floor(cell / 8))}${cell % 8 + 1}`;
const sideLabel = (side: BattleshipSide) => side === "p1" ? "Player 1" : "Player 2";
const cellsOf = (ship: ShipPlacement) => Array.from({ length: ship.size }, (_, offset) =>
  ship.start + offset * (ship.vertical ? 8 : 1));
const validPlacement = (ship: ShipPlacement, others: ShipPlacement[]) => {
  const cells = cellsOf(ship);
  return cells.every((cell) => cell >= 0 && cell < 64 &&
    (ship.vertical || Math.floor(cell / 8) === Math.floor(ship.start / 8))) &&
    !others.some((other) => cellsOf(other).some((cell) => cells.includes(cell)));
};
type Api = { error?: string; code?: string; token?: string; view?: BattleshipView };
const hitStyle = "border-red-400 bg-red-600/60 text-white";
const missStyle = "border-blue-400 bg-blue-600/60 text-white";

function PlayerSearch({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled: boolean }) {
  const [results, setResults] = useState<{ query: string; names: string[]; error: string | null } | null>(null);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  useEffect(() => {
    if (disabled || value.trim().length < 2 || !focused) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${ENDPOINT}?search=${encodeURIComponent(value)}`, { signal: controller.signal, cache: "no-store" });
        const data = await response.json() as { players?: string[]; error?: string };
        if (!response.ok || !data.players) throw new Error(data.error ?? "Could not search players.");
        if (!controller.signal.aborted) setResults({ query: value, names: data.players, error: null });
      } catch (error) {
        if (!controller.signal.aborted) setResults({ query: value, names: [], error: error instanceof Error ? error.message : "Could not search players." });
      }
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [value, disabled, focused]);
  const current = results?.query === value ? results : null;
  const names = focused && !disabled ? current?.names ?? [] : [];
  const choose = (name: string) => { onChange(name); setFocused(false); setActive(-1); };
  return (
    <div className="relative">
      <label htmlFor="battleship-answer" className="mb-2 block text-sm">Footballer&apos;s name</label>
      <input id="battleship-answer" className="w-full rounded-xl border border-border bg-background px-4 py-3"
        role="combobox" aria-autocomplete="list" aria-expanded={names.length > 0} aria-controls="battleship-player-results"
        aria-activedescendant={active >= 0 && names[active] ? `battleship-player-${active}` : undefined}
        disabled={disabled} value={value} onChange={(event) => { onChange(event.target.value); setFocused(true); setActive(-1); }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") { setFocused(false); setActive(-1); }
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && names.length) {
            event.preventDefault();
            setActive((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + names.length) % names.length);
          }
          if (event.key === "Enter" && active >= 0 && names[active]) { event.preventDefault(); choose(names[active]); }
        }} autoComplete="off" maxLength={100} placeholder="Type at least 2 letters to search" />
      {names.length > 0 && (
        <ul id="battleship-player-results" role="listbox" aria-label="Player search results"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-surface shadow-xl">
          {names.map((name, index) => (
            <li key={name} id={`battleship-player-${index}`} role="option" aria-selected={active === index}
              onMouseDown={(event) => event.preventDefault()} onClick={() => choose(name)}
              className={`cursor-pointer px-4 py-3 text-sm hover:bg-primary-dim ${active === index ? "bg-primary-dim text-primary" : ""}`}>{name}</li>
          ))}
        </ul>
      )}
      {current?.error && <p role="alert" className="mt-2 text-sm text-warning">{current.error} You can still type a name.</p>}
      {focused && current && !current.error && !names.length && <p role="status" className="mt-2 text-sm text-fore-muted">No matching player names. You can still type your answer.</p>}
      <p className="mt-2 text-xs text-fore-muted">Search finds names only, not answers to this square. Choose a name, then fire.</p>
    </div>
  );
}

function Rules() {
  return (
    <details className="mt-5 rounded-xl border border-border bg-surface p-4 text-sm">
      <summary className="cursor-pointer font-bold">How to play</summary>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-fore-muted">
        <li>Secretly place one small ship (2 squares), one medium (3) and one large (4) on your 8 by 8 board.</li>
        <li>Ships must be straight: place right, left, down or up, never diagonally. Ships cannot overlap but may touch. Lock your fleet when ready; it stays hidden from your opponent.</li>
        <li>Each player gets a different attack board. Your fleet placement shows the clues your opponent will answer; your attack board shows the clues you must answer.</li>
        <li>New boards mix single club, nation, trophy, award, manager and teammate criteria. Club and nation headers do not repeat. The labelled board is visible while you place your fleet.</li>
        <li>A correct answer fires your shot. A hit keeps your turn; a miss passes it. A wrong answer also passes the turn, without revealing that square.</li>
        <li>You cannot shoot a square you already hit or missed. A footballer may answer different squares if they satisfy both clues each time.</li>
        <li>Destroy all nine squares of your opponent&apos;s three ships to win. A new game starts only after both players vote.</li>
      </ul>
    </details>
  );
}

function Clue({ clue }: { clue: BattleshipClue }) {
  return (
    <span className="flex flex-col items-center justify-center gap-2 text-center">
      {clue.badge ? (
        <UclImage src={clue.badge} fallback={clue.badgeFallback} alt={clue.badgeAlt ?? clue.label} className="h-9 w-9" />
      ) : clue.kind && (
        <span className="rounded border border-primary/30 px-2 py-1 text-[10px] uppercase text-primary">{clue.kind}</span>
      )}
      <span>{clue.label}</span>
      {clue.reference && <span className="text-[10px] text-fore-muted">{clue.reference}</span>}
      {clue.source && <a href={clue.source} target="_blank" rel="noreferrer" className="text-[10px] text-primary underline">Award source</a>}
    </span>
  );
}

function ClueGrid({ view, label, renderCell }: {
  view: { rows: BattleshipClue[]; columns: BattleshipClue[] }; label: string; renderCell: (cell: number) => React.ReactNode;
}) {
  return (
    <div className="mt-4 max-w-full overflow-x-auto pb-3" tabIndex={0} role="region" aria-label={label}>
      <div className="grid min-w-[980px] gap-1" style={{ gridTemplateColumns: "180px repeat(8, minmax(94px, 1fr))" }}>
        <div className="flex items-center p-2 text-xs font-bold text-fore-muted">Row + column</div>
        {view.columns.map((clue, index) => (
          <div key={clue.id} className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-border p-2 text-xs">
            <span className="mb-2 font-mono text-primary">{index + 1}</span><Clue clue={clue} />
          </div>
        ))}
        {view.rows.map((clue, row) => (
          <div key={clue.id} className="contents">
            <div className="flex min-h-24 items-center justify-center gap-2 rounded-lg border border-border p-2 text-xs">
              <span className="font-mono font-bold text-primary">{String.fromCharCode(65 + row)}</span><Clue clue={clue} />
            </div>
            {view.columns.map((column, col) => <div key={column.id} className="flex [&>button]:w-full">{renderCell(row * 8 + col)}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function FleetBoard({ view, ships, incoming, interactive, onCell }: {
  view: BattleshipView; ships: ShipPlacement[]; incoming: BattleshipView["shots"]; interactive: boolean; onCell: (cell: number) => void;
}) {
  const occupied = new Map(ships.flatMap((ship) => cellsOf(ship).map((cell) => [cell, ship.size] as const)));
  const clues = { rows: view.ownRows, columns: view.ownColumns };
  return (
    <ClueGrid view={clues} label="Your fleet board with football clues" renderCell={(cell) => {
      const shot = incoming.find((item) => item.cell === cell);
      const size = occupied.get(cell);
      return (
        <button key={cell} type="button" disabled={!interactive} onClick={() => onCell(cell)}
          data-testid={`fleet-cell-${cell}`}
          aria-label={`${coordinate(cell)}: ${clues.rows[Math.floor(cell / 8)].label}; ${clues.columns[cell % 8].label}${size ? `, size ${size} ship` : ", water"}${shot ? shot.hit ? ", hit" : ", miss" : ""}`}
          className={`min-h-24 rounded-md border text-xs font-bold disabled:cursor-default ${
            shot?.hit ? hitStyle
              : shot ? missStyle
                : size ? "border-cyan-300 bg-cyan-400/25 text-cyan-100"
                  : "border-border bg-background text-fore-muted hover:border-primary"
          }`}>
          {shot ? shot.hit ? "HIT" : "-" : size ?? coordinate(cell)}
        </button>
      );
    }} />
  );
}

function FleetPlacement({ view, busy, onLock }: {
  view: BattleshipView; busy: boolean; onLock: (ships: ShipPlacement[]) => Promise<boolean>;
}) {
  const [ships, setShips] = useState<ShipPlacement[]>([]);
  const [size, setSize] = useState<2 | 3 | 4>(2);
  const [direction, setDirection] = useState<"Right" | "Left" | "Down" | "Up">("Right");
  const [error, setError] = useState<string | null>(null);
  const place = (cell: number) => {
    const others = ships.filter((ship) => ship.size !== size);
    const vertical = direction === "Up" || direction === "Down";
    const backwards = direction === "Left" || direction === "Up";
    const start = backwards ? cell - (size - 1) * (vertical ? 8 : 1) : cell;
    const next = { size, start, vertical };
    if ((!vertical && Math.floor(start / 8) !== Math.floor(cell / 8)) || !validPlacement(next, others)) {
      setError("That ship would overlap another ship or extend beyond the board. Choose another starting square.");
      return;
    }
    const updated = [...others, next];
    setShips(updated);
    setError(null);
    setSize(SIZES.find((candidate) => !updated.some((ship) => ship.size === candidate)) ?? size);
  };
  return (
    <section className="mt-6 space-y-5">
      <div className="min-w-0 rounded-2xl border border-primary/30 bg-surface p-4 md:p-6">
        <h2 className="text-xl font-bold">{view.youReady ? "Your fleet is locked" : "Place your hidden fleet"}</h2>
        <p className="mt-2 text-sm text-fore-muted">
          {view.youReady ? "Your opponent cannot see these positions." : "Choose a ship and direction, then click its starting square. Reposition a ship by selecting its size again."}
        </p>
        {!view.youReady && (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {SIZES.map((candidate) => (
                <button key={candidate} type="button" disabled={busy} aria-pressed={candidate === size}
                  className={`rounded-lg border px-3 py-2 text-sm ${candidate === size ? "border-primary bg-primary-dim" : "border-border"}`}
                  onClick={() => setSize(candidate)}>
                  {candidate === 2 ? "Small" : candidate === 3 ? "Medium" : "Large"} ({candidate})
                  {ships.some((ship) => ship.size === candidate) ? " - placed" : ""}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Ship direction">
              {(["Right", "Left", "Down", "Up"] as const).map((option) => (
                <button key={option} type="button" disabled={busy} aria-pressed={direction === option}
                  className={`rounded-lg border px-4 py-3 text-sm font-bold ${direction === option ? "border-primary bg-primary-dim text-primary" : "border-border"}`}
                  onClick={() => setDirection(option)}>{option} ({option === "Left" || option === "Right" ? "horizontal" : "vertical"})</button>
              ))}
            </div>
          </>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-warning">{error}</p>}
        <p className="mt-4 text-sm text-fore-muted">These are the clues your opponent will answer when attacking your fleet. Your attack board has different clues. Scroll sideways to see every column.</p>
        <FleetBoard view={view} ships={view.youReady ? view.ownShips : ships} incoming={[]} interactive={!busy && !view.youReady} onCell={place} />
        {!view.youReady && (
          <button type="button" className="btn-primary mt-4 w-full" disabled={busy || ships.length !== 3}
            onClick={() => void onLock([...ships].sort((a, b) => a.size - b.size))}>Lock fleet</button>
        )}
      </div>
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-xl font-bold">Ready for battle</h2>
        <p className="mt-4">{sideLabel(view.you)}: {view.youReady ? "Fleet locked" : "Placing ships"}</p>
        <p className="mt-2">Opponent: {!view.opponentJoined ? "Waiting to join" : view.opponentReady ? "Fleet locked" : "Placing ships"}</p>
        <p className="mt-4 text-sm text-fore-muted">The first turn is chosen randomly when both fleets are locked.</p>
        <p className="mt-4 text-sm text-fore-muted">Fleet: small 2 + medium 3 + large 4 = 9 squares to destroy.</p>
      </div>
    </section>
  );
}

function Battle({ view, busy, attack }: { view: BattleshipView; busy: boolean; attack: (cell: number, answer: string) => Promise<boolean> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [board, setBoard] = useState<"target" | "fleet">("target");
  const mine = view.shots.filter((shot) => shot.side === view.you);
  const incoming = view.shots.filter((shot) => shot.side !== view.you);
  const canAttack = view.phase === "playing" && view.turn === view.you && !busy;
  const targetShips = new Set((view.opponentShips ?? []).flatMap(cellsOf));
  const selectedShot = selected === null ? null : mine.find((shot) => shot.cell === selected);
  return (
    <section className="mt-6">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-ghost" aria-pressed={board === "target"} onClick={() => setBoard("target")}>Attack board</button>
        <button type="button" className="btn-ghost" aria-pressed={board === "fleet"} onClick={() => setBoard("fleet")}>Your fleet</button>
      </div>
      <p className="mt-3 text-xs text-fore-muted">Curated historical answers, not a live or exhaustive transfer database. Clue dates apply.
        {" "}Award source snapshot checked {view.awardsCheckedAt.slice(0, 10)}.</p>
      {board === "fleet" ? (
        <div className="mt-4 min-w-0 rounded-2xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-xl font-bold">Your fleet</h2>
          <p className="text-sm text-fore-muted">Your opponent answers these clues to attack these positions.</p>
          <FleetBoard view={view} ships={view.ownShips} incoming={incoming} interactive={false} onCell={() => {}} />
          <p className="mt-3 text-sm text-fore-muted">Numbers show ship sizes. Red = hit. Blue = miss.</p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-border bg-surface p-3 md:p-5">
          <h2 className="text-xl font-bold">Find your opponent&apos;s ships</h2>
          <p className="mt-2 text-sm text-fore-muted">This is your attack board, with different clues from your fleet board. Scroll sideways to see every column. Select a square, then answer below.</p>
          <p className="mt-2 text-sm"><span className="text-red-400">Red = hit.</span>{" "}<span className="text-blue-400">Blue = miss.</span></p>
          <ClueGrid view={view} label="Scrollable attack board" renderCell={(cell) => {
            const shot = mine.find((item) => item.cell === cell);
            return (
              <button type="button" disabled={!canAttack || Boolean(shot)}
                aria-pressed={selected === cell} aria-label={`${coordinate(cell)}: ${view.rows[Math.floor(cell / 8)].label}; ${view.columns[cell % 8].label}${shot ? shot.hit ? ", hit" : ", miss" : ""}`}
                data-testid={`target-cell-${cell}`} onClick={() => { setSelected(cell); setAnswer(""); }}
                className={`min-h-24 rounded-lg border px-1 text-xs font-bold disabled:cursor-default ${
                  shot?.hit ? hitStyle : shot ? missStyle
                    : selected === cell ? "border-primary bg-primary-dim text-primary"
                      : targetShips.has(cell) ? "border-warning bg-warning/15"
                        : "border-border bg-background/70 hover:border-primary"
                }`}>
                {shot ? `${shot.hit ? "HIT" : "MISS"}${shot.sunk ? ` - sunk ${shot.sunk}` : ""}` : targetShips.has(cell) ? "Ship" : coordinate(cell)}
              </button>
            );
          }} />
          {selected !== null && !selectedShot && view.phase === "playing" && (
            <form className="mt-4 max-w-xl space-y-3" onSubmit={(event) => {
              event.preventDefault();
              if (!canAttack || !answer.trim()) return;
              void attack(selected, answer).then((success) => {
                if (success) { setAnswer(""); setSelected(null); }
              });
            }}>
              <h3 className="font-bold">Target {coordinate(selected)}</h3>
              <p className="text-sm text-fore-muted">Name a footballer matching both criteria: <strong>{view.rows[Math.floor(selected / 8)].label}</strong>; <strong>{view.columns[selected % 8].label}</strong>.</p>
              <PlayerSearch key={selected} value={answer} onChange={setAnswer} disabled={!canAttack} />
              <button type="submit" className="btn-primary w-full" disabled={!canAttack || !answer.trim()}>Answer and fire</button>
            </form>
          )}
        </div>
      )}
      <div className="mt-5 rounded-xl border border-border bg-surface p-4">
        <h2 className="font-bold">Recent shots</h2>
        {view.shots.length ? (
          <ol className="mt-2 space-y-1 text-sm text-fore-muted">
            {view.shots.slice(-8).reverse().map((shot) => (
              <li key={`${shot.side}:${shot.cell}`}>{sideLabel(shot.side)}: {coordinate(shot.cell)} - {shot.player} - {shot.hit ? "Hit" : "Miss"}{shot.sunk ? `; size ${shot.sunk} ship sunk` : ""}</li>
            ))}
          </ol>
        ) : <p className="mt-2 text-sm text-fore-muted">No shots yet.</p>}
      </div>
    </section>
  );
}

function BattleshipClient({ comp, code }: { comp: Competition; code: string }) {
  const router = useRouter();
  const [view, setView] = useState<BattleshipView | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const submitting = useRef(false);
  const acceptView = useCallback((next: BattleshipView) => {
    setView((current) => !current || next.revision > current.revision ? next : current);
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const stored = code ? localStorage.getItem(`battleship:${code}`) : null;
        if (active) { setToken(stored); setReady(true); }
      } catch {
        if (active) { setError("Browser storage is unavailable. Enable it to keep your player token."); setReady(true); }
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
        const response = await fetch(`${ENDPOINT}?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const data = await response.json() as Api;
        if (!response.ok || !data.view) throw new Error(data.error ?? "Could not load Football Battleship.");
        if (active) { acceptView(data.view); setConnectionError(null); }
      } catch (e) {
        if (active) setConnectionError(e instanceof Error ? e.message : "Could not connect to your room.");
      } finally {
        if (active) timer = setTimeout(poll, 1200);
      }
    };
    void poll();
    return () => { active = false; clearTimeout(timer); };
  }, [code, token, acceptView]);

  const request = async (payload: Record<string, unknown>) => {
    const response = await fetch(ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const data = await response.json() as Api;
    if (data.view) acceptView(data.view);
    if (!response.ok) throw new Error(data.error ?? "Could not update Football Battleship.");
    return data;
  };
  const guarded = async (work: () => Promise<void>) => {
    if (submitting.current) return false;
    submitting.current = true;
    setBusy(true);
    setError(null);
    try { await work(); return true; } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update the game.");
      return false;
    } finally { submitting.current = false; setBusy(false); }
  };
  const create = () => guarded(async () => {
    const data = await request({ action: "create", comp });
    if (!data.code || !data.token) throw new Error("The server did not return a room code and player token.");
    localStorage.setItem(`battleship:${data.code}`, data.token);
    router.push(`/game/football-battleship?comp=${comp}&code=${data.code}`);
  });
  const join = () => guarded(async () => {
    const data = await request({ action: "join", code });
    if (!data.token) throw new Error("The server did not return your player token.");
    localStorage.setItem(`battleship:${code}`, data.token);
    setToken(data.token);
  });
  const act = (action: Record<string, unknown>) => guarded(async () => {
    if (!view || !token) throw new Error("Join the room before playing.");
    const data = await request({ code, token, gameId: view.gameId, revision: view.revision, ...action });
    if (!data.view) throw new Error("The server did not return the updated game.");
  });
  const activeComp = view?.comp ?? comp;
  const myHits = view?.shots.filter((shot) => shot.side === view.you && shot.hit).length ?? 0;
  const enemyHits = view?.shots.filter((shot) => shot.side !== view.you && shot.hit).length ?? 0;
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between gap-3">
          <Link className="btn-ghost" href={lobbyFor(activeComp)}>Game Arena</Link>
          {code && <Link className="btn-ghost" href={lobbyFor(activeComp)}>Leave</Link>}
        </div>
        <p className="section-eyebrow mt-6 text-primary">{COMPETITION_LABELS[activeComp]}</p>
        <h1 className="mt-2 text-3xl font-bold md:text-5xl">Football Battleship</h1>
        <p className="mt-3 text-fore-muted">Hide your fleet. Match the football clues. Sink all three ships.</p>
        <Rules />
        {error && <p role="alert" className="mt-4 rounded-xl border border-warning p-4 text-warning">{error}</p>}
        {connectionError && <p role="alert" className="mt-3 text-warning">{connectionError} Reconnecting automatically...</p>}
        {!code ? (
          <section className="mt-6 grid gap-5 md:grid-cols-2">
            <button type="button" disabled={busy} onClick={() => void create()} className="rounded-2xl border border-primary/40 bg-surface p-6 text-left">
              <span className="section-eyebrow text-primary">Online 1v1</span>
              <span className="mt-3 block text-2xl font-bold">{busy ? "Creating room..." : "Invite a friend"}</span>
              <span className="mt-3 block text-sm text-fore-muted">Each player places a hidden fleet on their own device.</span>
            </button>
            <form className="rounded-2xl border border-border bg-surface p-6" onSubmit={(event) => {
              event.preventDefault();
              router.push(`/game/football-battleship?comp=${comp}&code=${joinCode.trim().toUpperCase()}`);
            }}>
              <label htmlFor="battleship-code" className="block font-bold">Have a room code?</label>
              <input id="battleship-code" className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 font-mono uppercase"
                value={joinCode} onChange={(event) => setJoinCode(event.target.value)} maxLength={6} autoComplete="off" />
              <button type="submit" disabled={!/^[A-HJ-NP-Z2-9]{6}$/.test(joinCode.trim().toUpperCase())} className="btn-primary mt-3 w-full">Open room</button>
            </form>
          </section>
        ) : !ready ? <p className="mt-6">Loading player token...</p> : !token ? (
          <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-xl font-bold">Join room {code}</h2>
            <button type="button" className="btn-primary mt-4" disabled={busy} onClick={() => void join()}>Join as Player 2</button>
          </section>
        ) : !view ? <p className="mt-6">Loading your game...</p> : (
          <>
            <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
              <div><p className="font-mono font-bold">Room {code} - {sideLabel(view.you)}</p>
                <p className="mt-2 text-sm text-fore-muted">Your hits: {myHits}/9 - Opponent&apos;s hits: {enemyHits}/9</p></div>
              <button type="button" className="btn-ghost" onClick={() => void guarded(async () => {
                await navigator.clipboard.writeText(`${window.location.origin}/game/football-battleship?comp=${activeComp}&code=${code}`);
                setCopied(true);
              })}>{copied ? "Invite copied" : "Copy invite link"}</button>
            </section>
            <p className="mt-5 text-xl font-bold" data-testid="battleship-turn">
              {view.phase === "finished" ? `${view.winner === view.you ? "You win!" : `${sideLabel(view.winner ?? view.turn)} wins!`} All three ships sunk.`
                : view.phase === "playing" ? view.turn === view.you ? "Your turn - choose a square" : "Your opponent is answering"
                  : "Place your fleet before battle"}
            </p>
            {view.notice && <p role="status" className="mt-3 rounded-xl border border-primary/30 bg-surface p-4">{view.notice}</p>}
            {(view.phase === "waiting" || view.phase === "placing") ? (
              <FleetPlacement key={view.gameId} view={view} busy={busy} onLock={(ships) => act({ action: "place", ships })} />
            ) : (
              <Battle key={view.gameId} view={view} busy={busy} attack={(cell, answer) => act({ action: "attack", cell, answer })} />
            )}
            {view.phase === "finished" && (
              <div className="mt-6 rounded-xl border border-border bg-surface p-5">
                <h2 className="text-xl font-bold">Play again?</h2>
                <p className="mt-2 text-sm text-fore-muted">Both players must agree. You will place new fleets on a fresh football grid.</p>
                <button type="button" className="btn-primary mt-4" disabled={busy || view.rematch[view.you]}
                  onClick={() => void act({ action: "rematch" })}>{view.rematch[view.you] ? "Waiting for opponent's vote" : "Vote for a new game"}</button>
                {view.rematch[view.you === "p1" ? "p2" : "p1"] && <p className="mt-2 text-sm text-warning">Your opponent wants a new game.</p>}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function Content() {
  const search = useSearchParams();
  const comp = search.get("comp") ?? "pl";
  const code = (search.get("code") ?? "").trim().toUpperCase();
  if (!Object.hasOwn(COMPETITION_LABELS, comp) || (code && !/^[A-HJ-NP-Z2-9]{6}$/.test(code))) {
    return <main className="p-8"><p role="alert">Unsupported competition or invalid room code.</p><Link className="btn-ghost mt-4" href="/game">Game Arena</Link></main>;
  }
  return <BattleshipClient key={`${comp}:${code}`} comp={comp as Competition} code={code} />;
}

export default function FootballBattleshipPage() {
  return <Suspense fallback={<p className="p-8">Loading Football Battleship...</p>}><Content /></Suspense>;
}
