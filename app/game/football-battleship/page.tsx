"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COMPETITION_LABELS, type Competition } from "@/lib/competitions";
import { lobbyFor } from "@/lib/gameNavigation";
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

function Rules() {
  return (
    <details className="mt-5 rounded-xl border border-border bg-surface p-4 text-sm">
      <summary className="cursor-pointer font-bold">How to play</summary>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-fore-muted">
        <li>Secretly place one small ship (2 squares), one medium (3) and one large (4) on your 8 by 8 board.</li>
        <li>Ships must be straight, horizontal or vertical, and cannot overlap. They may touch. Lock your fleet when ready; it stays hidden from your opponent.</li>
        <li>Both players share the same football row and column clues. Choose a target square and name a footballer who satisfies both clues.</li>
        <li>A correct answer fires your shot. A hit keeps your turn; a miss passes it. A wrong answer also passes the turn, without revealing that square.</li>
        <li>You cannot shoot a square you already hit or missed. A footballer may answer different squares if they satisfy both clues each time.</li>
        <li>Destroy all nine squares of your opponent&apos;s three ships to win. A new game starts only after both players vote.</li>
      </ul>
    </details>
  );
}

function FleetBoard({ ships, incoming, interactive, onCell }: {
  ships: ShipPlacement[]; incoming: BattleshipView["shots"]; interactive: boolean; onCell: (cell: number) => void;
}) {
  const occupied = new Map(ships.flatMap((ship) => cellsOf(ship).map((cell) => [cell, ship.size] as const)));
  return (
    <div className="grid grid-cols-8 gap-1" aria-label="Your fleet board">
      {Array.from({ length: 64 }, (_, cell) => {
        const shot = incoming.find((item) => item.cell === cell);
        const size = occupied.get(cell);
        return (
          <button key={cell} type="button" disabled={!interactive} onClick={() => onCell(cell)}
            data-testid={`fleet-cell-${cell}`}
            aria-label={`${coordinate(cell)}${size ? `, size ${size} ship` : ", water"}${shot ? shot.hit ? ", hit" : ", miss" : ""}`}
            className={`aspect-square rounded-md border text-xs font-bold disabled:cursor-default ${
              shot?.hit ? "border-red-400 bg-red-500/25 text-red-200"
                : shot ? "border-border bg-surface text-fore-muted"
                  : size ? "border-cyan-300 bg-cyan-400/25 text-cyan-100"
                    : "border-border bg-background text-fore-muted hover:border-primary"
            }`}>
            {shot ? shot.hit ? "HIT" : "-" : size ?? coordinate(cell)}
          </button>
        );
      })}
    </div>
  );
}

function FleetPlacement({ view, busy, onLock }: {
  view: BattleshipView; busy: boolean; onLock: (ships: ShipPlacement[]) => Promise<boolean>;
}) {
  const [ships, setShips] = useState<ShipPlacement[]>([]);
  const [size, setSize] = useState<2 | 3 | 4>(2);
  const [vertical, setVertical] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const place = (cell: number) => {
    const others = ships.filter((ship) => ship.size !== size);
    const next = { size, start: cell, vertical };
    if (!validPlacement(next, others)) {
      setError("That ship would overlap another ship or extend beyond the board. Choose another starting square.");
      return;
    }
    const updated = [...others, next];
    setShips(updated);
    setError(null);
    setSize(SIZES.find((candidate) => !updated.some((ship) => ship.size === candidate)) ?? size);
  };
  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-primary/30 bg-surface p-4 md:p-6">
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
            <button type="button" disabled={busy} className="btn-ghost mt-3 text-sm"
              onClick={() => setVertical((current) => !current)} data-testid="fleet-direction">
              Direction: {vertical ? "Vertical" : "Horizontal"}
            </button>
          </>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-warning">{error}</p>}
        <div className="mt-4 max-w-md">
          <FleetBoard ships={view.youReady ? view.ownShips : ships} incoming={[]} interactive={!busy && !view.youReady} onCell={place} />
        </div>
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
      {board === "fleet" ? (
        <div className="mt-4 max-w-md rounded-2xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-xl font-bold">Your fleet</h2>
          <FleetBoard ships={view.ownShips} incoming={incoming} interactive={false} onCell={() => {}} />
          <p className="mt-3 text-sm text-fore-muted">Numbers show ship sizes. Red squares have been hit; dashes are missed enemy shots.</p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-border bg-surface p-3 md:p-5">
          <h2 className="text-xl font-bold">Find your opponent&apos;s ships</h2>
          <p className="mt-2 text-sm text-fore-muted">Scroll sideways to see every column. Select a square, then answer below.</p>
          <div className="mt-4 max-w-full overflow-x-auto pb-3" tabIndex={0} role="region" aria-label="Scrollable attack board">
            <div className="grid min-w-[850px] gap-1" style={{ gridTemplateColumns: "170px repeat(8, minmax(78px, 1fr))" }}>
              <div className="flex items-center p-2 text-xs font-bold text-fore-muted">Row + column</div>
              {view.columns.map((clue, index) => (
                <div key={clue.id} className="flex min-h-24 flex-col justify-center rounded-lg border border-border p-2 text-center text-xs">
                  <span className="mb-1 font-mono text-primary">{index + 1}</span><span>{clue.label}</span>
                </div>
              ))}
              {view.rows.map((clue, row) => (
                <div key={clue.id} className="contents">
                  <div className="flex min-h-16 items-center gap-2 rounded-lg border border-border p-2 text-xs">
                    <span className="font-mono font-bold text-primary">{String.fromCharCode(65 + row)}</span>{clue.label}
                  </div>
                  {view.columns.map((column, col) => {
                    const cell = row * 8 + col;
                    const shot = mine.find((item) => item.cell === cell);
                    return (
                      <button key={column.id} type="button" disabled={!canAttack || Boolean(shot)}
                        aria-pressed={selected === cell} aria-label={`${coordinate(cell)}: ${clue.label} and ${column.label}${shot ? shot.hit ? ", hit" : ", miss" : ""}`}
                        data-testid={`target-cell-${cell}`} onClick={() => { setSelected(cell); setAnswer(""); }}
                        className={`min-h-16 rounded-lg border px-1 text-xs font-bold disabled:cursor-default ${
                          shot?.hit ? "border-red-400 bg-red-500/25 text-red-200" : shot ? "border-border bg-background text-fore-muted"
                            : selected === cell ? "border-primary bg-primary-dim text-primary"
                              : targetShips.has(cell) ? "border-warning bg-warning/15"
                                : "border-border bg-background/70 hover:border-primary"
                        }`}>
                        {shot ? `${shot.hit ? "HIT" : "MISS"}${shot.sunk ? ` - sunk ${shot.sunk}` : ""}` : targetShips.has(cell) ? "Ship" : coordinate(cell)}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {selected !== null && !selectedShot && view.phase === "playing" && (
            <form className="mt-4 max-w-xl space-y-3" onSubmit={(event) => {
              event.preventDefault();
              if (!canAttack || !answer.trim()) return;
              void attack(selected, answer).then((success) => {
                if (success) { setAnswer(""); setSelected(null); }
              });
            }}>
              <h3 className="font-bold">Target {coordinate(selected)}</h3>
              <p className="text-sm text-fore-muted">Name a footballer matching <strong>{view.rows[Math.floor(selected / 8)].label}</strong> AND <strong>{view.columns[selected % 8].label}</strong>.</p>
              <label htmlFor="battleship-answer" className="block text-sm">Footballer&apos;s name</label>
              <input id="battleship-answer" className="w-full rounded-xl border border-border bg-background px-4 py-3"
                disabled={!canAttack} value={answer} onChange={(event) => setAnswer(event.target.value)} autoComplete="off" maxLength={150} />
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
