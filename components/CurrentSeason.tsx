"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PlayerPhoto from "@/components/PlayerPhoto";
import PlTeamBadge from "@/components/PlTeamBadge";

type View = "table" | "stats";
type StatKind = "goals" | "assists";

type TableEntry = {
  team: { id?: string; name: string; shortName: string };
  overall: {
    position: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
};
type TableData = { matchweek: number; tables: { entries: TableEntry[] }[] };

type Match = {
  matchId: string;
  kickoff: string;
  period: string;
  ground?: string;
  homeTeam: { id?: string; shortName: string; score?: number };
  awayTeam: { id?: string; shortName: string; score?: number };
};

type PlayerRow = {
  playerMetadata: { id: string; name: string; position?: string; currentTeam?: { id?: string; shortName: string } };
  stats: Record<string, number>;
};

async function load<T>(query: string): Promise<T> {
  const res = await fetch(`/api/season?${query}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

const th = "px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary";

function tabClass(active: boolean) {
  return `font-mono text-[12px] uppercase tracking-[0.1em] px-5 py-2 rounded-lg border transition ${
    active
      ? "bg-primary-dim text-primary border-primary/40 shadow-glow-cyan"
      : "bg-surface text-fore-muted border-border-dim hover:border-accent/40 hover:text-accent"
  }`;
}

function Status({ error, loading }: { error: boolean; loading: boolean }) {
  if (error) return <p className="p-6 text-center text-warning">Could not load live data. Try again shortly.</p>;
  if (loading) return <p className="p-6 text-center text-fore-muted">Loading…</p>;
  return null;
}

function LeagueTable() {
  const [data, setData] = useState<TableData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    load<TableData>("type=table").then(setData).catch(() => setError(true));
  }, []);

  const entries = data?.tables?.[0]?.entries ?? [];

  return (
    <div className="data-card p-6">
      <Status error={error} loading={!data} />
      {data && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-border bg-surface2">
                {["Pos", "Club", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => {
                const o = e.overall;
                const gd = o.goalsFor - o.goalsAgainst;
                return (
                  <tr key={e.team.name} className="border-b border-border-dim text-sm">
                    <td className="px-3 py-3 font-mono text-primary">{o.position}</td>
                    <td className="px-3 py-2 font-semibold">
                      <div className="flex items-center gap-3">
                        <PlTeamBadge id={e.team.id} name={e.team.name} />
                        {e.team.name}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-fore-muted">{o.played}</td>
                    <td className="px-3 py-3 text-fore-muted">{o.won}</td>
                    <td className="px-3 py-3 text-fore-muted">{o.drawn}</td>
                    <td className="px-3 py-3 text-fore-muted">{o.lost}</td>
                    <td className="px-3 py-3 text-fore-muted">{o.goalsFor}</td>
                    <td className="px-3 py-3 text-fore-muted">{o.goalsAgainst}</td>
                    <td className={`px-3 py-3 font-semibold ${gd >= 0 ? "text-success" : "text-warning"}`}>
                      {gd > 0 ? "+" : ""}{gd}
                    </td>
                    <td className="px-3 py-3 font-semibold text-primary">{o.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PlayerStats() {
  const [kind, setKind] = useState<StatKind>("goals");
  const [rows, setRows] = useState<Record<StatKind, PlayerRow[] | null>>({ goals: null, assists: null });
  const [error, setError] = useState(false);

  useEffect(() => {
    if (rows[kind]) return;
    load<{ data: PlayerRow[] }>(`type=${kind}`)
      .then((res) => setRows((r) => ({ ...r, [kind]: res.data })))
      .catch(() => setError(true));
  }, [kind, rows]);

  const key = kind === "goals" ? "goals" : "goalAssists";
  const list = rows[kind];

  return (
    <div className="data-card p-6">
      <div className="mb-4 flex gap-3">
        <button onClick={() => { setError(false); setKind("goals"); }} className={tabClass(kind === "goals")}>Goals</button>
        <button onClick={() => { setError(false); setKind("assists"); }} className={tabClass(kind === "assists")}>Assists</button>
      </div>
      <Status error={error} loading={!list} />
      {list && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-border bg-surface2">
                <th className={th}>Rank</th>
                <th className={th}>Player</th>
                <th className={th}>Club</th>
                <th className={th}>{kind === "goals" ? "Goals" : "Assists"}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p, i) => (
                <tr key={p.playerMetadata.name + i} className="border-b border-border-dim text-sm">
                  <td className="px-3 py-3 font-mono text-primary">{i + 1}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3 font-semibold">
                      <PlayerPhoto id={p.playerMetadata.id} name={p.playerMetadata.name} />
                      {p.playerMetadata.name}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-fore-muted">
                    <div className="flex items-center gap-2">
                      {p.playerMetadata.currentTeam && (
                        <PlTeamBadge id={p.playerMetadata.currentTeam.id} name={p.playerMetadata.currentTeam.shortName} className="h-6 w-6" />
                      )}
                      {p.playerMetadata.currentTeam?.shortName ?? "-"}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-semibold text-primary">{p.stats[key] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Fixtures({ initialWeek }: { initialWeek: number | null }) {
  const [week, setWeek] = useState<number | null>(initialWeek);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (week === null) return;
    let stale = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () =>
      load<{ data: Match[] }>(`type=fixtures&matchweek=${week}`)
        .then((res) => {
          if (stale) return;
          setMatches(res.data);
          if (res.data.some((m) => ["FirstHalf", "SecondHalf", "HalfTime"].includes(m.period))) {
            timer = setTimeout(run, 20_000);
          }
        })
        .catch(() => !stale && setError(true));
    run();
    return () => {
      stale = true;
      if (timer) clearTimeout(timer);
    };
  }, [week]);

  const go = (delta: number) => {
    setMatches(null);
    setError(false);
    setWeek((w) => (w ? w + delta : w));
  };

  return (
    <div className="data-card p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="section-eyebrow text-accent">Fixtures</p>
          <h3 className="mt-2 text-3xl">Matchweek {week ?? "…"}</h3>
        </div>
        <div className="flex gap-2">
          <button
            disabled={!week || week <= 1}
            onClick={() => go(-1)}
            className={`${tabClass(false)} disabled:opacity-40`}
          >
            ← Prev
          </button>
          <button
            disabled={!week || week >= 38}
            onClick={() => go(1)}
            className={`${tabClass(false)} disabled:opacity-40`}
          >
            Next →
          </button>
        </div>
      </div>
      <Status error={error} loading={week === null || !matches} />
      {matches && (
        <ul className="space-y-2">
          {matches.map((m) => {
            const played = m.period !== "PreMatch";
            const live = ["FirstHalf", "SecondHalf", "HalfTime"].includes(m.period);
            return (
              <li key={m.matchId}>
                <Link
                  href={`/premier-league/match/${m.matchId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border-dim bg-surface/80 px-4 py-3 text-sm transition hover:border-primary/50"
                >
                  <span className="flex flex-1 items-center justify-end gap-2 text-right font-semibold">
                    {m.homeTeam.shortName}
                    <PlTeamBadge id={m.homeTeam.id} name={m.homeTeam.shortName} />
                  </span>
                  <span className="min-w-[110px] text-center font-mono text-primary">
                    {played ? `${m.homeTeam.score ?? 0} - ${m.awayTeam.score ?? 0}` : m.kickoff.slice(5, 16).replace(" ", " · ")}
                    {live && (
                      <span className="mt-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-danger">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" />
                        {m.period === "HalfTime" ? "HT" : "Live"}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-1 items-center gap-2 font-semibold">
                    <PlTeamBadge id={m.awayTeam.id} name={m.awayTeam.shortName} />
                    {m.awayTeam.shortName}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function CurrentSeason() {
  const [view, setView] = useState<View>("table");
  const [week, setWeek] = useState<number | null>(null);

  // Start fixtures on the next matchweek after the last completed one
  useEffect(() => {
    load<TableData>("type=table")
      .then((t) => setWeek(Math.min(38, (t.matchweek ?? 0) + 1)))
      .catch(() => setWeek(1));
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Current Season</p>
        <h2 className="text-3xl md:text-4xl">2026/27 Premier League</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => setView("table")} className={tabClass(view === "table")}>Current Table</button>
        <button onClick={() => setView("stats")} className={tabClass(view === "stats")}>Player Stats</button>
      </div>
      {view === "table" ? <LeagueTable /> : <PlayerStats />}
      <Fixtures key={week ?? "loading"} initialWeek={week} />
    </div>
  );
}
