"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  laLigaAllTime,
  laLigaClubs,
  laLigaRivalries,
  laLigaWinners,
} from "@/data/laLiga";
import UclImage from "@/components/UclImage";
import { ClubSearch, type ClubTeam } from "@/components/ClubFixtures";
import { espnBadge } from "@/lib/clubArt";
import { fmtUclKickoff } from "@/lib/dates";

type View = "current" | "players" | "clubs" | "rivalries" | "alltime" | "winners";
type TableEntry = {
  team: { id: string; name: string; logo?: string };
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};
type Side = { id: string; name: string; logo?: string; score?: number };
type Match = {
  id: string;
  state: "pre" | "in" | "post";
  detail: string;
  date: string;
  home: Side;
  away: Side;
};
type Leader = { id: string; name: string; photo?: string; club: string; clubId?: string; value: number };

const buttonClass = (active: boolean) =>
  `rounded-lg border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
    active
      ? "border-primary/40 bg-primary-dim text-primary shadow-glow-cyan"
      : "border-border-dim bg-surface text-fore-muted hover:border-accent/40 hover:text-accent"
  }`;

const th = "px-3 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-primary";

// Club names in the static history data may differ slightly from ESPN's names
const logoByName = (name: string) => {
  const club = laLigaClubs.find((c) => c.name === name || c.short === name);
  return club ? espnBadge(club.espnId) : undefined;
};

function CurrentSeason() {
  const [table, setTable] = useState<TableEntry[] | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const [week, setWeek] = useState(0);
  const [data, setData] = useState<{ matchweek: number; matches: Match[] } | null>(null);
  const [fixtureError, setFixtureError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ClubTeam | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/la-liga?type=table")
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error ?? "Could not load the table.");
        return body as TableEntry[];
      })
      .then((body) => active && setTable(body))
      .catch((e: unknown) => active && setTableError(e instanceof Error ? e.message : "Could not load the table."));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = () =>
      fetch(`/api/la-liga?type=fixtures${week ? `&matchweek=${week}` : ""}`)
        .then(async (r) => {
          const body = await r.json();
          if (!r.ok) throw new Error(body.error ?? "Could not load fixtures.");
          return body as { matchweek: number; matches: Match[] };
        })
        .then((body) => {
          if (!active) return;
          setData(body);
          setFixtureError(null);
          if (week === 0) setWeek(body.matchweek);
          if (body.matches.some((m) => m.state === "in")) timer = setTimeout(load, 20_000);
        })
        .catch((e: unknown) => active && setFixtureError(e instanceof Error ? e.message : "Could not load fixtures."));
    load();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [week]);

  const shown = week || data?.matchweek || 0;
  const matches = data && data.matchweek === shown ? data.matches : null;

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Live data</p>
        <h2 className="mt-2 text-4xl">La Liga 2026/27</h2>
        <p className="mt-3 text-sm text-fore-muted">Current table and matchweek fixtures.</p>
      </div>

      <div className="data-card overflow-x-auto p-4 md:p-6">
        <h3 className="mb-4 text-3xl">League Table</h3>
        {tableError ? (
          <p role="alert" className="py-8 text-center text-warning">{tableError}</p>
        ) : table ? (
          <>
            <ClubSearch
              comp="laliga"
              teams={table.map((e) => ({ id: e.team.id, name: e.team.name, logo: e.team.logo }))}
              selected={selected}
              onSelect={setSelected}
            />
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-border bg-surface2">
                  {["Pos", "Club", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h) => (
                    <th key={h} className={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.map((e) => (
                  <tr
                    key={e.team.id}
                    onClick={() => setSelected({ id: e.team.id, name: e.team.name, logo: e.team.logo })}
                    className={`cursor-pointer border-b border-border-dim text-sm transition hover:bg-primary/5 ${
                      selected?.id === e.team.id ? "bg-primary/10" : ""
                    }`}
                  >
                    <td className="px-3 py-3 font-mono text-primary">{e.rank}</td>
                    <td className="px-3 py-3 font-semibold">
                      <span className="flex items-center gap-2">
                        <UclImage src={e.team.logo} alt={e.team.name} className="h-7 w-7" />
                        {e.team.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-fore-muted">{e.played}</td>
                    <td className="px-3 py-3 text-fore-muted">{e.won}</td>
                    <td className="px-3 py-3 text-fore-muted">{e.drawn}</td>
                    <td className="px-3 py-3 text-fore-muted">{e.lost}</td>
                    <td className="px-3 py-3 text-fore-muted">{e.goalsFor}</td>
                    <td className="px-3 py-3 text-fore-muted">{e.goalsAgainst}</td>
                    <td className="px-3 py-3 text-fore-muted">{e.goalsFor - e.goalsAgainst}</td>
                    <td className="px-3 py-3 font-semibold text-primary">{e.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="py-8 text-center text-fore-muted">Loading table…</p>
        )}
      </div>

      <div className="data-card p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-eyebrow text-accent">Fixtures & results</p>
            <h3 className="mt-2 text-3xl">Matchweek {shown || "…"}</h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!shown || shown <= 1}
              onClick={() => setWeek(Math.max(1, shown - 1))}
              className={`${buttonClass(false)} disabled:opacity-40`}
            >
              ← Previous
            </button>
            <button
              type="button"
              disabled={!shown || shown >= 38}
              onClick={() => setWeek(Math.min(38, shown + 1))}
              className={`${buttonClass(false)} disabled:opacity-40`}
            >
              Next →
            </button>
          </div>
        </div>
        {fixtureError ? (
          <p role="alert" className="py-6 text-center text-warning">{fixtureError}</p>
        ) : matches ? (
          matches.length ? (
            <ul className="space-y-2">
              {matches.map((m) => {
                const live = m.state === "in";
                const started = m.state !== "pre";
                return (
                  <li key={m.id}>
                    <Link
                      href={`/la-liga/match/${m.id}`}
                      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-border-dim bg-surface/80 px-3 py-3 text-sm transition hover:border-primary/50 md:px-4"
                    >
                      <span className="flex items-center justify-end gap-2 text-right font-semibold">
                        {m.home.name}
                        <UclImage src={m.home.logo} alt={m.home.name} className="h-7 w-7" />
                      </span>
                      <span className="min-w-24 text-center font-mono text-primary">
                        {started ? `${m.home.score ?? 0} - ${m.away.score ?? 0}` : fmtUclKickoff(m.date)}
                        {live && (
                          <span className="mt-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-danger">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" />
                            Live{m.detail ? ` ${m.detail}` : ""}
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-2 font-semibold">
                        <UclImage src={m.away.logo} alt={m.away.name} className="h-7 w-7" />
                        {m.away.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-6 text-center text-fore-muted">No matches are listed for this matchweek.</p>
          )
        ) : (
          <p className="py-6 text-center text-fore-muted">Loading fixtures…</p>
        )}
      </div>

      <Link
        href="/la-liga/game"
        className="block rounded-2xl border border-primary/25 bg-primary-dim p-5 transition hover:border-primary/60"
      >
        <p className="section-eyebrow text-primary">Player game</p>
        <h3 className="mt-2 text-2xl">Play La Liga Stat Duel →</h3>
        <p className="mt-2 text-sm leading-6 text-fore-muted">Test your knowledge of La Liga&apos;s player records.</p>
      </Link>
    </section>
  );
}

function Leaders({ type, title }: { type: "goals" | "assists"; title: string }) {
  const [rows, setRows] = useState<Leader[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/la-liga?type=${type}`)
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error ?? "Could not load leaders.");
        return body as Leader[];
      })
      .then((b) => active && setRows(b))
      .catch((e: unknown) => active && setError(e instanceof Error ? e.message : "Could not load leaders."));
    return () => {
      active = false;
    };
  }, [type]);

  return (
    <div className="data-card overflow-x-auto p-4 md:p-6">
      <h3 className="mb-4 text-2xl">{title}</h3>
      {error ? (
        <p role="alert" className="py-6 text-center text-warning">{error}</p>
      ) : rows ? (
        <table className="w-full min-w-[320px] text-left">
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-b border-border-dim text-sm">
                <td className="px-2 py-2 font-mono text-primary">{i + 1}</td>
                <td className="px-2 py-2">
                  <span className="flex items-center gap-3">
                    <UclImage src={r.photo} alt={r.name} shape="circle" className="h-9 w-9" />
                    <span>
                      <span className="block font-semibold">{r.name}</span>
                      <span className="flex items-center gap-1 text-xs text-fore-muted">
                        <UclImage src={espnBadge(r.clubId ?? "")} alt={r.club} className="h-4 w-4" />
                        {r.club}
                      </span>
                    </span>
                  </span>
                </td>
                <td className="px-2 py-2 text-right font-semibold text-primary">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="py-6 text-center text-fore-muted">Loading…</p>
      )}
    </div>
  );
}

function PlayerStats() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="section-eyebrow text-primary">2026/27</p>
        <h2 className="mt-2 text-4xl">Player Stats</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Leaders type="goals" title="Top scorers" />
        <Leaders type="assists" title="Top assists" />
      </div>
    </section>
  );
}

function Clubs() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Club profiles</p>
        <h2 className="mt-2 text-4xl">La Liga Clubs</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {laLigaClubs.map((club) => (
          <article key={club.id} className="data-card p-5">
            <div className="flex items-center gap-3">
              <UclImage src={espnBadge(club.espnId)} alt={club.name} className="h-12 w-12" />
              <div>
                <h3 className="text-xl font-semibold">{club.name}</h3>
                <p className="text-xs text-fore-muted">
                  {club.city} · founded {club.founded}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-fore-muted">Titles</dt>
                <dd className="font-semibold text-primary">{club.titles}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-fore-muted">Best finish</dt>
                <dd className="font-semibold">{club.bestFinish}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-fore-muted">Stadium</dt>
                <dd>
                  {club.stadium} ({club.capacity.toLocaleString("en-GB")})
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-fore-muted">Legend</dt>
                <dd>{club.legend}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function Rivalries() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Derbies</p>
        <h2 className="mt-2 text-4xl">Team Rivalries</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {laLigaRivalries.map((r) => (
          <article key={r.id} className="data-card p-5">
            <h3 className="text-2xl">{r.name}</h3>
            <div className="mt-3 flex items-center justify-center gap-4">
              <UclImage src={logoByName(r.club1)} alt={r.club1} className="h-12 w-12" />
              <span className="font-mono text-primary">
                {r.club1Wins} – {r.draws} – {r.club2Wins}
              </span>
              <UclImage src={logoByName(r.club2)} alt={r.club2} className="h-12 w-12" />
            </div>
            <p className="mt-1 text-center text-xs text-fore-muted">
              {r.club1} wins · draws · {r.club2} wins ({r.meetings} meetings)
            </p>
            <p className="mt-3 text-sm leading-6 text-fore-muted">{r.description}</p>
            <p className="mt-2 text-sm">
              <span className="text-fore-muted">Biggest win: </span>
              {r.biggestWin}
            </p>
            <p className="text-sm">
              <span className="text-fore-muted">Top scorer: </span>
              {r.topScorer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AllTime() {
  const rows = [...laLigaAllTime].sort((a, b) => b.points - a.points);
  return (
    <section className="space-y-5">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Since 1929</p>
        <h2 className="mt-2 text-4xl">All-Time La Liga Table</h2>
      </div>
      <div className="data-card overflow-x-auto p-4 md:p-6">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface2">
              {["Pos", "Club", "Seasons", "P", "W", "D", "L", "GF", "GA", "Pts", "Titles"].map((h) => (
                <th key={h} className={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.club} className="border-b border-border-dim text-sm">
                <td className="px-3 py-3 font-mono text-primary">{i + 1}</td>
                <td className="px-3 py-3 font-semibold">
                  <span className="flex items-center gap-2">
                    <UclImage src={logoByName(r.club)} alt={r.club} className="h-6 w-6" />
                    {r.club}
                  </span>
                </td>
                <td className="px-3 py-3 text-fore-muted">{r.seasons}</td>
                <td className="px-3 py-3 text-fore-muted">{r.played}</td>
                <td className="px-3 py-3 text-fore-muted">{r.won}</td>
                <td className="px-3 py-3 text-fore-muted">{r.drawn}</td>
                <td className="px-3 py-3 text-fore-muted">{r.lost}</td>
                <td className="px-3 py-3 text-fore-muted">{r.goalsFor}</td>
                <td className="px-3 py-3 text-fore-muted">{r.goalsAgainst}</td>
                <td className="px-3 py-3 font-semibold text-primary">{r.points}</td>
                <td className="px-3 py-3 text-success">{r.titles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Winners() {
  return (
    <section className="space-y-5">
      <div className="text-center">
        <p className="section-eyebrow text-accent">La Liga champions</p>
        <h2 className="mt-2 text-4xl">Season Winners</h2>
      </div>
      <div className="data-card overflow-x-auto p-4 md:p-6">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface2">
              {["Season", "Champion", "Runner-up", "Top scorer"].map((h) => (
                <th key={h} className={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...laLigaWinners].reverse().map((w) => (
              <tr key={w.season} className="border-b border-border-dim text-sm">
                <td className="px-3 py-3 font-mono text-fore-muted">{w.season}</td>
                <td className="px-3 py-3 font-semibold text-success">
                  <span className="flex items-center gap-2">
                    <UclImage src={logoByName(w.winner)} alt={w.winner} className="h-6 w-6" />
                    {w.winner}
                  </span>
                </td>
                <td className="px-3 py-3 text-fore-muted">{w.runnerUp}</td>
                <td className="px-3 py-3 text-fore-muted">
                  {w.topScorer} ({w.goals})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function LaLigaDashboard() {
  const [view, setView] = useState<View>("current");

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground grid-bg md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent">
            ← Competitions
          </Link>
          <span
            role="img"
            aria-label="La Liga logo"
            className="h-12 w-12 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url(https://a.espncdn.com/i/leaguelogos/soccer/500/15.png)" }}
          />
        </div>

        <header className="mb-8 text-center">
          <p className="section-eyebrow text-accent">Spanish football archive</p>
          <h1 className="section-title mt-2">La Liga</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-fore-muted">
            Live matches, the current table and fixtures, club and player stats, derbies, all-time records, and the La
            Liga Stat Duel.
          </p>
        </header>

        <nav aria-label="La Liga sections" className="mb-8 flex flex-wrap justify-center gap-3">
          {([
            ["current", "Current season"],
            ["players", "Player stats"],
            ["clubs", "Clubs"],
            ["rivalries", "Rivalries"],
            ["alltime", "All-time table"],
            ["winners", "Winners"],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setView(id)} className={buttonClass(view === id)}>
              {label}
            </button>
          ))}
        </nav>

        {view === "current" && <CurrentSeason />}
        {view === "players" && <PlayerStats />}
        {view === "clubs" && <Clubs />}
        {view === "rivalries" && <Rivalries />}
        {view === "alltime" && <AllTime />}
        {view === "winners" && <Winners />}
      </section>
    </main>
  );
}
