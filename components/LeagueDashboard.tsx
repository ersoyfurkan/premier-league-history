"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import type {
  serieAAllTime,
  serieAClubs,
  serieARivalries,
  serieASeasons,
  serieAWinners,
} from "@/data/serieA";
import type { EspnComp } from "@/lib/leagues";
import UclImage from "@/components/UclImage";
import { playerFaceUrl } from "@/data/playerFaces";
import { ClubSearch, type ClubTeam } from "@/components/ClubFixtures";
import { espnBadge } from "@/lib/clubArt";
import { fmtUclKickoff } from "@/lib/dates";
import { ESPN_SEASON } from "@/lib/espn";

type View = "current" | "seasons" | "players" | "clubs" | "rivalries" | "alltime" | "winners";
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

const apiError = (body: unknown, fallback: string) =>
  typeof body === "object" && body !== null && "error" in body && typeof body.error === "string"
    ? body.error
    : fallback;

// Club names in the static history data may differ slightly from ESPN's names
export type LeagueConfig = {
  comp: EspnComp;
  name: string;
  api: string;
  home: string;
  weeks: number;
  logoId: string;
  region: string;
  since: string;
  seasons: typeof serieASeasons;
  clubs: typeof serieAClubs;
  rivalries: typeof serieARivalries;
  allTime: typeof serieAAllTime;
  winners: typeof serieAWinners;
  seasonDecades: string[];
};

const Cfg = createContext<LeagueConfig | null>(null);
const useCfg = () => {
  const cfg = useContext(Cfg);
  if (!cfg) throw new Error("LeagueDashboard config missing");
  return cfg;
};

// Club names in the static history data may differ slightly from ESPN's names
const useLogo = () => {
  const { clubs } = useCfg();
  return (name: string) => {
    const club = clubs.find((c) => c.name === name || c.short === name || c.aliases.includes(name));
    return club?.espnId ? espnBadge(club.espnId) : undefined;
  };
};

function CurrentSeason() {
  const cfg = useCfg();
  const [table, setTable] = useState<TableEntry[] | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const [week, setWeek] = useState(0);
  const [data, setData] = useState<{ matchweek: number; matches: Match[] } | null>(null);
  const [fixtureError, setFixtureError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ClubTeam | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${cfg.api}?type=table`)
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(apiError(body, "Could not load the table."));
        return body as TableEntry[];
      })
      .then((body) => active && setTable(body))
      .catch((e: unknown) => active && setTableError(e instanceof Error ? e.message : "Could not load the table."));
    return () => {
      active = false;
    };
  }, [cfg.api]);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = () =>
      fetch(`${cfg.api}?type=fixtures${week ? `&matchweek=${week}` : ""}`)
        .then(async (r) => {
          const body = await r.json();
            if (!r.ok) throw new Error(apiError(body, "Could not load fixtures."));
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
  }, [week, cfg.api]);

  const shown = week || data?.matchweek || 0;
  const matches = data && data.matchweek === shown ? data.matches : null;

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Live data</p>
        <h2 className="mt-2 text-4xl">{cfg.name} {ESPN_SEASON}/{String(ESPN_SEASON + 1).slice(-2)}</h2>
        <p className="mt-3 text-sm text-fore-muted">Current table and matchweek fixtures.</p>
      </div>

      <div className="data-card overflow-x-auto p-4 md:p-6">
        <h3 className="mb-4 text-3xl">League Table</h3>
        {tableError ? (
          <p role="alert" className="py-8 text-center text-warning">{tableError}</p>
        ) : table ? (
          <>
            <ClubSearch
              comp={cfg.comp}
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
              disabled={!shown || shown >= cfg.weeks}
              onClick={() => setWeek(Math.min(cfg.weeks, shown + 1))}
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
                      href={`${cfg.home}/match/${m.id}`}
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
        href={`${cfg.home}/game`}
        className="block rounded-2xl border border-primary/25 bg-primary-dim p-5 transition hover:border-primary/60"
      >
        <p className="section-eyebrow text-primary">Player game</p>
        <h3 className="mt-2 text-2xl">Play {cfg.name} Mini-Games →</h3>
        <p className="mt-2 text-sm leading-6 text-fore-muted">Tik Tak Toe, Rondo, Club Duel, Trivia Path and more.</p>
      </Link>
    </section>
  );
}

function Leaders({ type, title }: { type: "goals" | "assists"; title: string }) {
  const { api } = useCfg();
  const [rows, setRows] = useState<Leader[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${api}?type=${type}`)
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(apiError(body, "Could not load leaders."));
        return body as Leader[];
      })
      .then((b) => active && setRows(b))
      .catch((e: unknown) => active && setError(e instanceof Error ? e.message : "Could not load leaders."));
    return () => {
      active = false;
    };
  }, [type, api]);

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
                    <UclImage src={r.photo} fallback={playerFaceUrl(r.name)} alt={r.name} shape="circle" className="h-9 w-9" />
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
        <p className="section-eyebrow text-primary">{ESPN_SEASON}/{String(ESPN_SEASON + 1).slice(-2)}</p>
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
  const { api, name } = useCfg();
  const [clubs, setClubs] = useState<TableEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${api}?type=table`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(apiError(body, `Could not load ${name} clubs.`));
        return body as TableEntry[];
      })
      .then((body) => active && setClubs(body))
      .catch((cause: unknown) => active && setError(cause instanceof Error ? cause.message : `Could not load ${name} clubs.`));
    return () => {
      active = false;
    };
  }, [api, name]);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Current season</p>
        <h2 className="mt-2 text-4xl">{name} Clubs</h2>
      </div>
      {error ? (
        <p role="alert" className="py-8 text-center text-warning">{error}</p>
      ) : clubs ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clubs.map((entry) => (
            <article key={entry.team.id} className="data-card p-5">
              <div className="flex items-center gap-3">
                <UclImage src={entry.team.logo} alt={entry.team.name} className="h-12 w-12" />
                <div>
                  <p className="font-mono text-xs text-primary">#{entry.rank}</p>
                  <h3 className="text-xl font-semibold">{entry.team.name}</h3>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-fore-muted">Played</dt>
                  <dd className="font-semibold">{entry.played}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-fore-muted">Points</dt>
                  <dd className="font-semibold text-primary">{entry.points}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-fore-muted">Record</dt>
                  <dd>{entry.won}W · {entry.drawn}D · {entry.lost}L</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-fore-muted">Goal difference</dt>
                  <dd>{entry.goalsFor - entry.goalsAgainst}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-fore-muted">Loading clubs…</p>
      )}
    </section>
  );
}

function Rivalries() {
  const { name, rivalries } = useCfg();
  const logoByName = useLogo();
  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Derbies</p>
        <h2 className="mt-2 text-4xl">Team Rivalries</h2>
        <p className="mt-3 text-sm text-fore-muted">
          {name} head-to-head records through the 2025/26 season. Rivalry top scorers include all competitions.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {rivalries.map((r) => (
          <article key={r.id} className="data-card space-y-4 p-5">
            <div>
              <h3 className="text-2xl">{r.name}</h3>
              <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
                {[r.club1, "vs", r.club2].map((club, index) =>
                  index === 1 ? (
                    <span key="vs" aria-hidden="true" className="font-mono text-primary">vs</span>
                  ) : (
                    <div
                      key={club}
                      className={`flex min-w-0 items-center gap-3 ${index === 2 ? "flex-row-reverse text-right" : ""}`}
                    >
                      <UclImage src={logoByName(club)} alt={`${club} logo`} className="h-12 w-12" />
                      <span className="font-semibold">{club}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <p className="text-sm leading-6 text-fore-muted">{r.description}</p>

            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                {name} record · {r.leagueMeetings} meetings
              </p>
              <div className="flex h-2 overflow-hidden rounded-sm bg-white/5">
                <div
                  className="bg-gradient-to-r from-primary to-primary/80"
                  style={{ width: `${(r.club1Wins / r.leagueMeetings) * 100}%` }}
                />
                <div
                  className="bg-gradient-to-r from-accent to-accent/80"
                  style={{ width: `${(r.draws / r.leagueMeetings) * 100}%` }}
                />
                <div
                  className="bg-gradient-to-r from-danger to-danger/80"
                  style={{ width: `${(r.club2Wins / r.leagueMeetings) * 100}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <span className="pill-badge justify-center border border-primary/35 bg-primary/15 text-primary">
                  {r.club1}: {r.club1Wins}W
                </span>
                <span className="pill-badge justify-center border border-accent/35 bg-accent/15 text-accent">
                  {r.draws}D
                </span>
                <span className="pill-badge justify-center border border-danger/35 bg-danger/15 text-danger">
                  {r.club2}: {r.club2Wins}W
                </span>
              </div>
              {r.club1Goals !== undefined && r.club2Goals !== undefined && (
                <p className="mt-3 text-xs text-fore-muted">
                  Goals: {r.club1} {r.club1Goals} · {r.club2} {r.club2Goals}
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-success">
                Biggest wins
              </p>
              <div className="space-y-2">
                {r.biggestWins.map((win) => (
                  <p key={win.club} className="flex items-center gap-2 text-sm font-semibold text-success">
                    <UclImage src={logoByName(win.club)} alt="" className="h-6 w-6" />
                    <span>{win.score} <span className="font-normal text-fore-muted">· {win.date}</span></span>
                  </p>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-warning">
                Rivalry top scorer · all competitions
              </p>
              {r.topScorers.map((scorer) => (
                <p key={scorer.player} className="flex items-center gap-2 text-sm font-semibold">
                  <UclImage src={logoByName(scorer.club)} alt="" className="h-5 w-5" />
                  {scorer.player} <span className="font-mono text-warning">{scorer.goals} goals</span>
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SeasonArchive() {
  const { name, seasons, since, seasonDecades } = useCfg();
  const [decade, setDecade] = useState("all");
  const decades = ["all", ...seasonDecades];
  const rows = seasons.filter((season) => {
    if (decade === "all") return true;
    const start = Number(decade.slice(0, 3)) * 10;
    const year = Number(season.season.slice(0, 4));
    return year >= start && year < start + 10;
  });

  return (
    <section className="space-y-5">
      <div className="text-center">
        <p className="section-eyebrow text-primary">{since}–present</p>
        <h2 className="mt-2 text-4xl">{name} Season Archive</h2>
        <p className="mt-3 text-sm text-fore-muted">Champions, top-three finishes, and leading scorers for every completed season.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {decades.map((option) => (
          <button key={option} type="button" onClick={() => setDecade(option)} className={buttonClass(decade === option)}>
            {option === "all" ? "All seasons" : option}
          </button>
        ))}
      </div>
      <div className="data-card overflow-x-auto p-4 md:p-6">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface2">
              {["Season", "Champion", "Runner-up", "Third place", "Top scorer"].map((heading) => (
                <th key={heading} className={th}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((season) => (
              <tr key={season.season} className="border-b border-border-dim text-sm transition hover:bg-primary/5">
                <td className="px-3 py-3 whitespace-nowrap font-mono text-fore-muted">{season.season}</td>
                <td className="px-3 py-3 font-semibold text-success">{season.champion}</td>
                <td className="px-3 py-3 text-fore-muted">{season.runnerUp}</td>
                <td className="px-3 py-3 text-fore-muted">{season.thirdPlace}</td>
                <td className="px-3 py-3">
                  {season.topScorer} <span className="font-mono text-primary">({season.goals})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs text-fore-muted">{rows.length} completed seasons shown</p>
    </section>
  );
}

function AllTime() {
  const { name, allTime, since } = useCfg();
  const logoByName = useLogo();
  const rows = [...allTime].sort((a, b) => b.points - a.points);
  return (
    <section className="space-y-5">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Since {since}</p>
        <h2 className="mt-2 text-4xl">All-Time {name} Table</h2>
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
  const { name, winners } = useCfg();
  const logoByName = useLogo();
  return (
    <section className="space-y-5">
      <div className="text-center">
        <p className="section-eyebrow text-accent">{name} champions</p>
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
            {[...winners].reverse().map((w) => (
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

export default function LeagueDashboard({ config }: { config: LeagueConfig }) {
  const [view, setView] = useState<View>("current");

  return (
    <Cfg.Provider value={config}>
    <main className="min-h-screen bg-background px-5 py-8 text-foreground grid-bg md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent">
            ← Competitions
          </Link>
          <span
            role="img"
            aria-label={`${config.name} logo`}
            className="h-12 w-12 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://a.espncdn.com/i/leaguelogos/soccer/500/${config.logoId}.png)` }}
          />
        </div>

        <header className="mb-8 text-center">
          <p className="section-eyebrow text-accent">{config.region} football archive</p>
          <h1 className="section-title mt-2">{config.name}</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-fore-muted">
            Live matches, the current table and fixtures, club and player stats, derbies, all-time records, and the
            {" "}{config.name} mini-games.
          </p>
        </header>

        <nav aria-label={`${config.name} sections`} className="mb-8 flex flex-wrap justify-center gap-3">
          {([
            ["current", "Current season"],
            ["seasons", "Past seasons"],
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
        {view === "seasons" && <SeasonArchive />}
        {view === "players" && <PlayerStats />}
        {view === "clubs" && <Clubs />}
        {view === "rivalries" && <Rivalries />}
        {view === "alltime" && <AllTime />}
        {view === "winners" && <Winners />}
      </section>
    </main>
    </Cfg.Provider>
  );
}
