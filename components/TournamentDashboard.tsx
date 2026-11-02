"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import history from "@/data/tournamentHistory.generated.json";
import { STAGE_LABEL, STAGE_ORDER, TOURNAMENTS, type TournamentKey } from "@/lib/tournaments";

type View = "current" | "qualifiers" | "finals" | "alltime" | "rivalries";
type Entry = { team: { id: string; name: string; logo: string }; rank: number; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number };
type Group = { name: string; entries: Entry[] };
type Side = { id: string; name: string; logo?: string; score?: number; shootout?: number; winner: boolean };
type Match = { id: string; date: string; state: "pre" | "in" | "post"; detail: string; stage: string; group?: string; venue?: string; home: Side; away: Side };
type Leader = { id: string; name: string; photo?: string; club: string; value: number };
type HistTable = { headers: string[]; rows: string[][] };

const tables = history.tournaments as unknown as Record<TournamentKey, Record<string, HistTable | null>>;

const buttonClass = (active: boolean) =>
  `rounded-lg border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
    active ? "border-primary/40 bg-primary-dim text-primary shadow-glow-cyan" : "border-border-dim bg-surface text-fore-muted hover:border-accent/40 hover:text-accent"
  }`;
const th = "px-3 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-primary";

const apiError = (body: unknown, fallback: string) =>
  typeof body === "object" && body !== null && "error" in body && typeof body.error === "string" ? body.error : fallback;

async function load<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok) throw new Error(apiError(body, "Could not load data."));
  return body as T;
}

function useLive<T>(url: string, poll: boolean) {
  const [state, setState] = useState<{ url: string; data?: T; error?: string }>({ url });
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () =>
      load<T>(url)
        .then((data) => {
          if (!active) return;
          setState({ url, data });
          const live = Array.isArray(data) && (data as unknown as Match[]).some((m) => m.state === "in");
          if (poll && live) timer = setTimeout(run, 20_000);
        })
        .catch((e: unknown) => active && setState({ url, error: e instanceof Error ? e.message : "Could not load data." }));
    run();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [url, poll]);
  return state.url === url ? state : { url };
}

function HistoryTable({ table, limit, highlight }: { table: HistTable | null | undefined; limit?: number; highlight?: number }) {
  if (!table || !table.rows.length) return <p className="py-6 text-center text-fore-muted">No data available yet.</p>;
  const rows = limit ? table.rows.slice(0, limit) : table.rows;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border-dim">
            {table.headers.map((header, i) => (
              <th key={`${header}-${i}`} className={th}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-border-dim/50 hover:bg-white/5">
              {row.map((cell, c) => (
                <td key={c} className={`px-3 py-2 ${c === highlight ? "font-semibold text-foreground" : "text-fore-muted"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupTables({ groups }: { groups: Group[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {groups.map((group) => (
        <div key={group.name} className="data-card overflow-x-auto p-4">
          <h4 className="mb-3 text-xl">{group.name}</h4>
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-dim">
                <th className={th}>#</th>
                <th className={th}>Team</th>
                {["P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h) => (
                  <th key={h} className={`${th} text-right`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.entries.map((e) => (
                <tr key={e.team.id} className="border-b border-border-dim/50">
                  <td className="px-3 py-2 text-fore-muted">{e.rank}</td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={e.team.logo} alt="" className="h-5 w-5 object-contain" />
                      {e.team.name}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">{e.played}</td>
                  <td className="px-3 py-2 text-right">{e.won}</td>
                  <td className="px-3 py-2 text-right">{e.drawn}</td>
                  <td className="px-3 py-2 text-right">{e.lost}</td>
                  <td className="px-3 py-2 text-right">{e.goalsFor}</td>
                  <td className="px-3 py-2 text-right">{e.goalsAgainst}</td>
                  <td className="px-3 py-2 text-right">{e.goalsFor - e.goalsAgainst}</td>
                  <td className="px-3 py-2 text-right font-semibold text-primary">{e.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function MatchRow({ match, base }: { match: Match; base: string }) {
  const played = match.state !== "pre";
  const when = new Date(match.date);
  const status = match.state === "in" ? match.detail || "LIVE" : match.state === "post" ? "FT" : when.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const pens = match.home.shootout !== undefined && match.away.shootout !== undefined && match.state === "post" ? ` (${match.home.shootout}-${match.away.shootout} pens)` : "";
  const name = (side: Side, align: string) => (
    <span className={`flex flex-1 items-center gap-2 ${align} ${side.winner && match.state === "post" ? "font-semibold text-foreground" : ""}`}>
      {align.includes("end") && <span>{side.name}</span>}
      {side.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={side.logo} alt="" className="h-6 w-6 object-contain" />
      )}
      {!align.includes("end") && <span>{side.name}</span>}
    </span>
  );
  return (
    <Link href={`${base}/${match.id}`} className="flex items-center gap-3 rounded-xl border border-border-dim bg-surface/60 px-4 py-3 text-sm transition hover:border-primary/40">
      {name(match.home, "justify-end text-right")}
      <span className="min-w-[88px] text-center">
        <span className={`block font-display text-lg ${match.state === "in" ? "text-danger" : ""}`}>{played ? `${match.home.score ?? 0} - ${match.away.score ?? 0}` : "vs"}</span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-fore-muted">{status}{pens}</span>
      </span>
      {name(match.away, "justify-start")}
    </Link>
  );
}

function MatchList({ matches, base }: { matches: Match[]; base: string }) {
  const stages = useMemo(() => {
    const found = [...new Set(matches.map((m) => m.stage))];
    return found.sort((a, b) => (STAGE_ORDER.indexOf(a) + 1 || 99) - (STAGE_ORDER.indexOf(b) + 1 || 99));
  }, [matches]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [group, setGroup] = useState("all");

  const fallback = useMemo(() => {
    const live = matches.find((m) => m.state === "in");
    if (live) return live.stage;
    const played = [...matches].reverse().find((m) => m.state === "post");
    return played?.stage ?? stages[0];
  }, [matches, stages]);
  const stage = chosen && stages.includes(chosen) ? chosen : fallback;
  const inStage = matches.filter((m) => m.stage === stage);
  const groups = [...new Set(inStage.map((m) => m.group).filter(Boolean))] as string[];
  const shown = group === "all" ? inStage : inStage.filter((m) => m.group === group);
  const label = (s: string) => STAGE_LABEL[s] ?? s.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

  const days = new Map<string, Match[]>();
  for (const m of shown) {
    const key = new Date(m.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    days.set(key, [...(days.get(key) ?? []), m]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {stages.map((s) => (
          <button key={s} type="button" className={buttonClass(s === stage)} onClick={() => { setChosen(s); setGroup("all"); }}>{label(s)}</button>
        ))}
      </div>
      {groups.length > 1 && (
        <select value={group} onChange={(e) => setGroup(e.target.value)} className="rounded-lg border border-border-dim bg-surface px-3 py-2 text-sm" aria-label="Filter by group">
          <option value="all">All groups</option>
          {groups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      )}
      {shown.length === 0 && <p className="py-6 text-center text-fore-muted">No matches here yet.</p>}
      {[...days.entries()].map(([day, list]) => (
        <div key={day} className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">{day}</p>
          {list.map((m) => (
            <MatchRow key={m.id} match={m} base={base} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Data<T>({ state, children }: { state: { data?: T; error?: string }; children: (data: T) => React.ReactNode }) {
  if (state.error) return <p role="alert" className="py-8 text-center text-warning">{state.error}</p>;
  if (!state.data) return <p className="py-8 text-center text-fore-muted">Loading…</p>;
  return <>{children(state.data)}</>;
}

function Current({ tk }: { tk: TournamentKey }) {
  const meta = TOURNAMENTS[tk];
  const [season, setSeason] = useState(meta.editions[0].season);
  const edition = meta.editions.find((e) => e.season === season) ?? meta.editions[0];
  const latest = edition.season === meta.editions[0].season;
  const q = `/api/tournament?t=${tk}&edition=${season}`;
  const groups = useLive<Group[]>(`${q}&type=groups`, false);
  const matches = useLive<Match[]>(`${q}&type=matches`, true);
  const goals = useLive<Leader[]>(`${q}&type=goals`, false);
  const assists = useLive<Leader[]>(`${q}&type=assists`, false);

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Live data</p>
        <h2 className="mt-2 text-4xl">{meta.short} {edition.label}</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {meta.editions.map((e) => (
            <button key={e.season} type="button" className={buttonClass(e.season === season)} onClick={() => setSeason(e.season)}>{e.season}</button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-3xl">Groups</h3>
        <Data state={groups}>{(data) => (data.length ? <GroupTables groups={data} /> : <p className="py-6 text-center text-fore-muted">No group tables for this edition.</p>)}</Data>
      </div>

      <div className="data-card p-4 md:p-6">
        <h3 className="mb-4 text-3xl">Fixtures &amp; results</h3>
        <Data state={matches}>{(data) => <MatchList key={season} matches={data} base={meta.match} />}</Data>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {([["Top scorers", goals], ["Top assists", assists]] as const).map(([title, state]) => (
          <div key={title} className="data-card p-4 md:p-6">
            <h3 className="mb-4 text-2xl">{title}</h3>
            {!latest ? (
              <p className="text-sm text-fore-muted">Live leaders are shown for the latest edition. See the All-time tab for historical scorers.</p>
            ) : (
              <Data state={state}>
                {(rows) =>
                  rows.length ? (
                    <ol className="space-y-2">
                      {rows.map((row, i) => (
                        <li key={row.id} className="flex items-center gap-3 text-sm">
                          <span className="w-6 text-fore-muted">{i + 1}</span>
                          <span className="flex-1">{row.name} <span className="text-fore-muted">· {row.club}</span></span>
                          <span className="font-display text-lg text-primary">{row.value}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-fore-muted">No leaders available.</p>
                  )
                }
              </Data>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Qualifiers({ tk }: { tk: TournamentKey }) {
  const meta = TOURNAMENTS[tk];
  const [zone, setZone] = useState(meta.qualifiers[0]?.key ?? "");
  const [tab, setTab] = useState<"groups" | "matches">("groups");
  const q = `/api/tournament?t=${tk}&qual=${zone}`;
  const groups = useLive<Group[]>(zone ? `${q}&type=groups` : "", false);
  const matches = useLive<Match[]>(zone ? `${q}&type=matches` : "", true);

  if (!meta.qualifiers.length) {
    return (
      <section className="data-card mx-auto max-w-3xl p-8 text-center">
        <h2 className="text-3xl">Qualifiers</h2>
        <p className="mt-4 text-fore-muted">{meta.qualifiersNote}</p>
      </section>
    );
  }
  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Qualifying</p>
        <h2 className="mt-2 text-4xl">{meta.short} qualifiers</h2>
        <p className="mt-3 text-sm text-fore-muted">{meta.qualifiersNote}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {meta.qualifiers.map((z) => (
          <button key={z.key} type="button" className={buttonClass(z.key === zone)} onClick={() => setZone(z.key)}>{z.label}</button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <button type="button" className={buttonClass(tab === "groups")} onClick={() => setTab("groups")}>Tables</button>
        <button type="button" className={buttonClass(tab === "matches")} onClick={() => setTab("matches")}>Matches</button>
      </div>
      {tab === "groups" ? (
        <Data state={groups}>{(data) => (data.length ? <GroupTables groups={data} /> : <p className="py-6 text-center text-fore-muted">No table available for this zone.</p>)}</Data>
      ) : (
        <div className="data-card p-4 md:p-6">
          <Data state={matches}>
            {(data) => (data.length ? <QualMatches key={zone} matches={data} base={meta.match} /> : <p className="py-6 text-center text-fore-muted">No matches available for this zone.</p>)}
          </Data>
        </div>
      )}
    </section>
  );
}

// Qualifying has no fixed stages, so page through it by month
function QualMatches({ matches, base }: { matches: Match[]; base: string }) {
  const months = [...new Set(matches.map((m) => m.date.slice(0, 7)))];
  const [month, setMonth] = useState(() => {
    const now = new Date().toISOString().slice(0, 7);
    return months.includes(now) ? now : months[months.length - 1];
  });
  const shown = matches.filter((m) => m.date.slice(0, 7) === month);
  return (
    <div className="space-y-4">
      <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-lg border border-border-dim bg-surface px-3 py-2 text-sm" aria-label="Month">
        {months.map((m) => (
          <option key={m} value={m}>{new Date(`${m}-01T12:00:00Z`).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</option>
        ))}
      </select>
      <div className="space-y-2">
        {shown.map((m) => (
          <MatchRow key={m.id} match={m} base={base} />
        ))}
      </div>
    </div>
  );
}

function Finals({ tk }: { tk: TournamentKey }) {
  const data = tables[tk];
  const editions = data.editions
    ? { headers: data.editions.headers, rows: [...data.editions.rows].reverse() }
    : null;
  const finals = data.finals ? { headers: data.finals.headers, rows: [...data.finals.rows].reverse() } : null;
  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="section-eyebrow text-primary">History</p>
        <h2 className="mt-2 text-4xl">{TOURNAMENTS[tk].label} finals</h2>
        <p className="mt-3 text-sm text-fore-muted">Every final, newest first. Source: Wikipedia (refreshed automatically).</p>
      </div>
      <div className="data-card p-4 md:p-6">
        <HistoryTable table={finals} highlight={1} />
      </div>
      <div className="data-card p-4 md:p-6">
        <h3 className="mb-4 text-3xl">Every edition</h3>
        <HistoryTable table={editions} />
      </div>
    </section>
  );
}

function AllTime({ tk }: { tk: TournamentKey }) {
  const data = tables[tk];
  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="section-eyebrow text-primary">All-time</p>
        <h2 className="mt-2 text-4xl">{TOURNAMENTS[tk].short} records</h2>
        <p className="mt-3 text-sm text-fore-muted">Source: Wikipedia (refreshed automatically).</p>
      </div>
      <div className="data-card p-4 md:p-6">
        <h3 className="mb-4 text-3xl">Medal table</h3>
        <HistoryTable table={data.medals} highlight={1} />
      </div>
      <div className="data-card p-4 md:p-6">
        <h3 className="mb-4 text-3xl">All-time top scorers</h3>
        <HistoryTable table={data.scorers} limit={30} highlight={1} />
      </div>
      {data.assists && (
        <div className="data-card p-4 md:p-6">
          <h3 className="mb-4 text-3xl">Most assists</h3>
          <HistoryTable table={data.assists} limit={30} highlight={1} />
        </div>
      )}
      <div className="data-card p-4 md:p-6">
        <h3 className="mb-4 text-3xl">All-time team table</h3>
        <HistoryTable table={data.standings} limit={40} highlight={1} />
      </div>
    </section>
  );
}

function Rivalries({ tk }: { tk: TournamentKey }) {
  const finals = tables[tk].finals;
  const rows = useMemo(() => {
    if (!finals) return [];
    const win = finals.headers.findIndex((h) => /^winners/i.test(h));
    const run = finals.headers.findIndex((h) => /^runners/i.test(h));
    const yr = finals.headers.findIndex((h) => /^year/i.test(h));
    const score = finals.headers.findIndex((h) => /^score/i.test(h));
    const pairs = new Map<string, { a: string; b: string; wins: Record<string, number>; years: string[] }>();
    for (const row of finals.rows) {
      const w = row[win];
      const r = row[run];
      if (!w || !r) continue;
      const [a, b] = [w, r].sort();
      const key = `${a}|${b}`;
      const entry = pairs.get(key) ?? { a, b, wins: {}, years: [] };
      entry.wins[w] = (entry.wins[w] ?? 0) + 1;
      entry.years.push(`${row[yr]} (${w} ${row[score]})`);
      pairs.set(key, entry);
    }
    return [...pairs.values()].filter((p) => p.years.length >= 2).sort((x, y) => y.years.length - x.years.length);
  }, [finals]);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="section-eyebrow text-primary">Rivalries</p>
        <h2 className="mt-2 text-4xl">Final rematches</h2>
        <p className="mt-3 text-sm text-fore-muted">Pairs of nations that have met in more than one {TOURNAMENTS[tk].short} final, built from the finals history.</p>
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-fore-muted">No repeated final pairings yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((p) => (
            <div key={`${p.a}-${p.b}`} className="data-card p-5">
              <h3 className="text-2xl">{p.a} <span className="text-fore-muted">vs</span> {p.b}</h3>
              <p className="mt-2 text-sm text-primary">
                {p.a} {p.wins[p.a] ?? 0} – {p.wins[p.b] ?? 0} {p.b} in finals
              </p>
              <ul className="mt-3 space-y-1 text-sm text-fore-muted">
                {p.years.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function TournamentDashboard({ tk }: { tk: TournamentKey }) {
  const meta = TOURNAMENTS[tk];
  const [view, setView] = useState<View>("current");
  const views: [View, string][] = [
    ["current", "Fixtures & tables"],
    ["qualifiers", "Qualifiers"],
    ["finals", "Finals & editions"],
    ["alltime", "All-time stats"],
    ["rivalries", "Rivalries"],
  ];
  return (
    <main className="min-h-screen bg-background px-5 pb-16 pt-24 text-foreground grid-bg md:px-8">
      <section className="mx-auto w-full max-w-6xl space-y-8">
        <header className="text-center">
          <div
            role="img"
            aria-label={`${meta.label} logo`}
            className="mx-auto mb-4 h-24 w-24 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://a.espncdn.com/i/leaguelogos/soccer/500/${meta.logoId}.png)` }}
          />
          <p className="section-eyebrow text-accent">{meta.region} football archive · since {meta.since}</p>
          <h1 className="section-title mt-2">{meta.label}</h1>
          <Link href={meta.game} className={`${buttonClass(false)} mt-5 inline-block`}>Play {meta.short} mini-games</Link>
        </header>
        <nav aria-label={`${meta.label} sections`} className="flex flex-wrap justify-center gap-3">
          {views.map(([key, label]) => (
            <button key={key} type="button" className={buttonClass(view === key)} onClick={() => setView(key)}>{label}</button>
          ))}
        </nav>
        {view === "current" && <Current tk={tk} />}
        {view === "qualifiers" && <Qualifiers tk={tk} />}
        {view === "finals" && <Finals tk={tk} />}
        {view === "alltime" && <AllTime tk={tk} />}
        {view === "rivalries" && <Rivalries tk={tk} />}
      </section>
    </main>
  );
}
