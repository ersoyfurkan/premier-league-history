"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { uclLeaderboards, uclWinners, type UclStat } from "@/data/championsLeague";
import { uclClubLogos, uclPlayerPhotos } from "@/data/championsLeagueMedia";
import UclImage from "@/components/UclImage";

type View = "current" | "records" | "winners";
type Team = {
  internationalName: string;
  logoUrl?: string;
};
type Standing = {
  rank: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};
type StandingsData = { items: Standing[]; seasonYear: number };
type Match = {
  id: string;
  status: string;
  kickOffTime: { dateTime?: string; date: string };
  homeTeam: Team;
  awayTeam: Team;
  score?: { total?: { home?: number; away?: number } };
};

const statOptions: { key: UclStat; label: string }[] = [
  { key: "goals", label: "Goals" },
  { key: "appearances", label: "Appearances" },
  { key: "assists", label: "Assists" },
];

const buttonClass = (active: boolean) =>
  `rounded-lg border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
    active
      ? "border-primary/40 bg-primary-dim text-primary shadow-glow-cyan"
      : "border-border-dim bg-surface text-fore-muted hover:border-accent/40 hover:text-accent"
  }`;

function Records() {
  const [stat, setStat] = useState<UclStat>("goals");
  const source = statOptions.find((option) => option.key === stat)!;
  const rows = uclLeaderboards[stat];
  const rankedRows = rows.map((row, index) => ({
    ...row,
    rank: index > 0 && row.value === rows[index - 1].value ? index : index + 1,
  }));

  return (
    <section className="space-y-5">
      <div className="text-center">
        <p className="section-eyebrow text-accent">UEFA career records</p>
        <h2 className="mt-2 text-4xl">All-Time Player Stats</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-fore-muted">
          Official UEFA top-20 rankings. The player duel uses the same published leaderboard set.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {statOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setStat(option.key)}
            className={buttonClass(stat === option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="data-card overflow-x-auto p-4 md:p-6">
        <table className="w-full min-w-[480px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface2">
              {["Rank", "Player", "Club", source.label].map((heading) => (
                <th key={heading} className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rankedRows.map((row) => (
              <tr key={`${row.name}-${row.value}`} className="border-b border-border-dim text-sm">
                <td className="px-3 py-3 font-mono text-primary">{row.rank}</td>
                <td className="px-3 py-3 font-semibold">
                  <span className="flex items-center gap-3">
                    <UclImage src={uclPlayerPhotos[row.name]} alt={row.name} shape="circle" className="h-10 w-10" />
                    {row.name}
                  </span>
                </td>
                <td className="px-3 py-3 text-fore-muted">
                  <span className="flex items-center gap-2">
                    <UclImage src={uclClubLogos[row.club]} alt={row.club} className="h-6 w-6" />
                    {row.club}
                  </span>
                </td>
                <td className="px-3 py-3 font-semibold text-primary">{row.value}</td>
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
        <p className="section-eyebrow text-accent">European Cup & Champions League</p>
        <h2 className="mt-2 text-4xl">Season Winners</h2>
        <p className="mt-3 text-sm text-fore-muted">
          Champions from the inaugural 1955/56 season through 2025/26.
        </p>
      </div>
      <div className="data-card overflow-x-auto p-4 md:p-6">
        <table className="w-full min-w-[360px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface2">
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">Season</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">Winner</th>
            </tr>
          </thead>
          <tbody>
            {[...uclWinners].reverse().map((entry) => (
              <tr key={entry.season} className="border-b border-border-dim text-sm">
                <td className="px-4 py-3 font-mono text-fore-muted">{entry.season}</td>
                <td className="px-4 py-3 font-semibold text-success">
                  <span className="flex items-center gap-3">
                    <UclImage src={uclClubLogos[entry.winner]} alt={entry.winner} className="h-7 w-7" />
                    {entry.winner}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CurrentSeason() {
  const [table, setTable] = useState<Standing[] | null>(null);
  const [seasonYear, setSeasonYear] = useState<number | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const [matchday, setMatchday] = useState(0);
  const [fixtures, setFixtures] = useState<{ matchday: number; matches: Match[] } | null>(null);
  const [fixtureFailure, setFixtureFailure] = useState<{ matchday: number; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/champions-league?type=table")
      .then(async (response) => {
        const body = (await response.json()) as StandingsData | { error?: string };
        if (!response.ok) throw new Error("error" in body ? body.error : "Could not load standings.");
        return body as StandingsData;
      })
      .then((body) => {
        if (!active) return;
        const entries = body.items ?? [];
        setTable(entries);
        setSeasonYear(body.seasonYear);
        const mostPlayed = Math.max(0, ...entries.map((entry) => entry.played));
        setMatchday(Math.min(8, Math.max(1, mostPlayed + 1)));
      })
      .catch((error: unknown) => {
        if (active) {
          setTableError(error instanceof Error ? error.message : "Could not load standings.");
          setMatchday(1);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (matchday === 0) return;
    let active = true;
    fetch(`/api/champions-league?type=fixtures&matchday=${matchday}`)
      .then(async (response) => {
        const body = (await response.json()) as Match[] | { error?: string };
        if (!response.ok) throw new Error("error" in body ? body.error : "Could not load fixtures.");
        return body as Match[];
      })
      .then((body) => {
        if (active) setFixtures({ matchday, matches: body });
      })
      .catch((error: unknown) => {
        if (active) {
          setFixtureFailure({
            matchday,
            message: error instanceof Error ? error.message : "Could not load fixtures.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [matchday]);

  const matches = fixtures?.matchday === matchday ? fixtures.matches : null;
  const matchesError = fixtureFailure?.matchday === matchday ? fixtureFailure.message : null;
  const seasonName = seasonYear
    ? `${seasonYear - 1}/${String(seasonYear).slice(-2)}`
    : "Current season";

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Live UEFA data</p>
        <h2 className="mt-2 text-4xl">{seasonName} Champions League</h2>
        <p className="mt-3 text-sm text-fore-muted">Current league-phase table and matchday fixtures.</p>
      </div>

      <div className="data-card overflow-x-auto p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-3xl">League Phase Table</h3>
          <span className="font-mono text-[10px] uppercase tracking-widest text-fore-muted">UEFA · 36 teams</span>
        </div>
        {tableError ? (
          <p role="alert" className="py-8 text-center text-warning">{tableError}</p>
        ) : table ? (
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b border-border bg-surface2">
                {["Pos", "Club", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((heading) => (
                  <th key={heading} className="px-2 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-primary">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((entry) => (
                <tr key={entry.team.internationalName} className="border-b border-border-dim text-sm">
                  <td className="px-2 py-3 font-mono text-primary">{entry.rank}</td>
                  <td className="px-2 py-3 font-semibold">
                    <span className="flex items-center gap-2">
                      <UclImage src={entry.team.logoUrl} alt={entry.team.internationalName} className="h-7 w-7" />
                      {entry.team.internationalName}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-fore-muted">{entry.played}</td>
                  <td className="px-2 py-3 text-fore-muted">{entry.won}</td>
                  <td className="px-2 py-3 text-fore-muted">{entry.drawn}</td>
                  <td className="px-2 py-3 text-fore-muted">{entry.lost}</td>
                  <td className="px-2 py-3 text-fore-muted">{entry.goalsFor}</td>
                  <td className="px-2 py-3 text-fore-muted">{entry.goalsAgainst}</td>
                  <td className="px-2 py-3 text-fore-muted">{entry.goalDifference}</td>
                  <td className="px-2 py-3 font-semibold text-primary">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="py-8 text-center text-fore-muted">Loading standings…</p>
        )}
      </div>

      <div className="data-card p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-eyebrow text-accent">Fixtures & results</p>
            <h3 className="mt-2 text-3xl">Matchday {matchday || "…"}</h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!matchday || matchday <= 1}
              onClick={() => setMatchday((day) => Math.max(1, day - 1))}
              className={`${buttonClass(false)} disabled:opacity-40`}
            >
              ← Previous
            </button>
            <button
              type="button"
              disabled={!matchday || matchday >= 8}
              onClick={() => setMatchday((day) => Math.min(8, day + 1))}
              className={`${buttonClass(false)} disabled:opacity-40`}
            >
              Next →
            </button>
          </div>
        </div>
        {matchesError ? (
          <p role="alert" className="py-6 text-center text-warning">{matchesError}</p>
        ) : matches ? (
          matches.length ? (
            <ul className="space-y-2">
              {matches.map((match) => {
                const played = match.status === "FINISHED";
                const date = new Date(match.kickOffTime.dateTime ?? match.kickOffTime.date);
                return (
                  <li key={match.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-border-dim bg-surface/80 px-3 py-3 text-sm md:px-4">
                    <span className="flex items-center justify-end gap-2 text-right font-semibold">
                      {match.homeTeam.internationalName}
                      <UclImage src={match.homeTeam.logoUrl} alt={match.homeTeam.internationalName} className="h-7 w-7" />
                    </span>
                    <span className="min-w-24 text-center font-mono text-primary">
                      {played
                        ? `${match.score?.total?.home ?? 0} - ${match.score?.total?.away ?? 0}`
                        : date.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}
                    </span>
                    <span className="flex items-center gap-2 font-semibold">
                      <UclImage src={match.awayTeam.logoUrl} alt={match.awayTeam.internationalName} className="h-7 w-7" />
                      {match.awayTeam.internationalName}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-6 text-center text-fore-muted">No matches are listed for this matchday yet.</p>
          )
        ) : (
          <p className="py-6 text-center text-fore-muted">Loading fixtures…</p>
        )}
      </div>

      <div className="grid gap-4">
        <Link
          href="/champions-league/game"
          className="rounded-2xl border border-primary/25 bg-primary-dim p-5 transition hover:border-primary/60"
        >
          <p className="section-eyebrow text-primary">Player game</p>
          <h3 className="mt-2 text-2xl">Play UCL Stat Duel →</h3>
          <p className="mt-2 text-sm leading-6 text-fore-muted">Test your knowledge of UEFA’s all-time player leaders.</p>
        </Link>
      </div>
    </section>
  );
}

export default function ChampionsLeagueDashboard() {
  const [view, setView] = useState<View>("current");

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground grid-bg md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent">
            ← Competitions
          </Link>
          <div className="flex items-center gap-3">
            <span
              role="img"
              aria-label="UEFA Champions League logo"
              className="h-12 w-12 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: "url(https://img.uefa.com/imgml/uefacom/elements/logos/competitions/color/full/1.svg)" }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-fore-muted">            Official competition mark</span>
                      </div>
        </div>

        <header className="mb-8 text-center">
          <p className="section-eyebrow text-accent">European football archive</p>
          <h1 className="section-title mt-2">UEFA Champions League</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-fore-muted">
            Current league-phase data, all-time player records, historic winners, and the UCL Stat Duel.
          </p>
        </header>

        <nav aria-label="Champions League sections" className="mb-8 flex flex-wrap justify-center gap-3">
          {([
            ["current", "Current season"],
            ["records", "All-time stats"],
            ["winners", "Winners"],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setView(id)} className={buttonClass(view === id)}>
              {label}
            </button>
          ))}
        </nav>

        {view === "current" && <CurrentSeason />}
        {view === "records" && <Records />}
        {view === "winners" && <Winners />}
      </section>
    </main>
  );
}
