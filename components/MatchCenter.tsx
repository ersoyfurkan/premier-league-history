"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PlayerPhoto from "@/components/PlayerPhoto";
import UclImage from "@/components/UclImage";
import type { Comp, EventKind, LineupPlayer, MatchDetail, MatchEvent, Side, TeamDetail } from "@/lib/matchDetail";

type Tab = "timeline" | "lineups" | "stats";

const POLL_MS = 15_000;

const EVENT_ICON: Record<EventKind, string> = {
  goal: "⚽",
  penalty: "⚽",
  own_goal: "⚽",
  yellow: "🟨",
  red: "🟥",
  second_yellow: "🟥",
  sub: "🔁",
};

const tabClass = (active: boolean) =>
  `rounded-lg border px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] transition ${
    active
      ? "border-primary/40 bg-primary-dim text-primary shadow-glow-cyan"
      : "border-border-dim bg-surface text-fore-muted hover:border-accent/40 hover:text-accent"
  }`;

const minuteLabel = (event: Pick<MatchEvent, "minute" | "extra">) =>
  `${event.minute}${event.extra ? `+${event.extra}` : ""}'`;

function Crest({ comp, team, className }: { comp: Comp; team: TeamDetail; className: string }) {
  return comp === "ucl" ? (
    <UclImage src={team.logo} alt={team.name} className={className} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={team.logo} alt={team.name} className={`${className} object-contain`} />
  );
}

function Avatar({ comp, player }: { comp: Comp; player: LineupPlayer }) {
  return comp === "ucl" ? (
    <UclImage src={player.photo} alt={player.name} shape="circle" className="h-10 w-10 border border-white/30" />
  ) : (
    <PlayerPhoto id={player.id} name={player.name} size="sm" />
  );
}

type Marks = { goals: number; yellow: boolean; red: boolean; offAt?: string; onAt?: string };

function buildMarks(events: MatchEvent[]) {
  const marks = new Map<string, Marks>();
  const get = (id: string) => {
    let entry = marks.get(id);
    if (!entry) {
      entry = { goals: 0, yellow: false, red: false };
      marks.set(id, entry);
    }
    return entry;
  };
  for (const event of events) {
    if (event.kind === "goal" || event.kind === "penalty") get(event.playerId).goals += 1;
    else if (event.kind === "yellow") get(event.playerId).yellow = true;
    else if (event.kind === "red" || event.kind === "second_yellow") get(event.playerId).red = true;
    else if (event.kind === "sub") {
      get(event.playerId).offAt = minuteLabel(event);
      if (event.otherId) get(event.otherId).onAt = minuteLabel(event);
    }
  }
  return marks;
}

function Badges({ mark }: { mark?: Marks }) {
  if (!mark) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] leading-none">
      {mark.goals > 0 && <span>{"⚽".repeat(Math.min(mark.goals, 3))}</span>}
      {mark.red ? <span>🟥</span> : mark.yellow ? <span>🟨</span> : null}
      {mark.offAt && <span className="text-danger">↓{mark.offAt}</span>}
      {mark.onAt && <span className="text-success">↑{mark.onAt}</span>}
    </span>
  );
}

function Header({ match }: { match: MatchDetail }) {
  const live = match.status === "live";
  const kickoff = new Date(match.kickoff);
  const kickoffText = Number.isNaN(kickoff.getTime())
    ? ""
    : kickoff.toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  const scorers = (side: Side) =>
    match.events
      .filter((event) => event.side === side && (event.kind === "goal" || event.kind === "penalty" || event.kind === "own_goal"))
      .map((event) => `${event.player} ${minuteLabel(event)}${event.kind === "penalty" ? " (pen)" : event.kind === "own_goal" ? " (og)" : ""}`);

  return (
    <div className="data-card p-5 md:p-8">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
        {(["home", "away"] as const).map((side) => {
          const team = match[side];
          return (
            <div key={side} className={`flex flex-col items-center gap-3 text-center ${side === "home" ? "order-1" : "order-3"}`}>
              <Crest comp={match.comp} team={team} className="h-16 w-16 md:h-24 md:w-24" />
              <p className="text-lg font-semibold md:text-2xl">{team.name}</p>
              <ul className="space-y-0.5 text-xs text-fore-muted md:text-sm">
                {scorers(side).map((line, index) => (
                  <li key={`${line}-${index}`}>⚽ {line}</li>
                ))}
              </ul>
            </div>
          );
        })}
        <div className="order-2 text-center">
          {match.status === "upcoming" ? (
            <p className="font-display text-4xl text-primary md:text-6xl">VS</p>
          ) : (
            <p className="font-display text-5xl text-primary md:text-7xl">
              {match.home.score ?? 0} - {match.away.score ?? 0}
            </p>
          )}
          <p
            className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${
              live ? "border-danger/50 bg-danger/10 text-danger" : "border-border-dim text-fore-muted"
            }`}
          >
            {live && <span className="h-2 w-2 animate-pulse rounded-full bg-danger" />}
            {live ? `Live ${match.statusText}` : match.status === "finished" ? "Full time" : kickoffText}
          </p>
          {match.halfTime && <p className="mt-2 font-mono text-[11px] text-fore-muted">HT {match.halfTime.home} - {match.halfTime.away}</p>}
        </div>
      </div>
      <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-fore-muted">
        {[match.round, match.venue, match.attendance ? `Attendance ${match.attendance.toLocaleString("en-GB")}` : null, match.referee ? `Referee ${match.referee}` : null]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </div>
  );
}

function Timeline({ match }: { match: MatchDetail }) {
  if (match.status === "upcoming") {
    return <p className="py-8 text-center text-fore-muted">Match events will appear here once the game kicks off.</p>;
  }
  if (!match.events.length) {
    return <p className="py-8 text-center text-fore-muted">No goals, cards or substitutions yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {[...match.events].reverse().map((event) => {
        const detail =
          event.kind === "sub"
            ? `${event.other ?? "?"} on, ${event.player} off`
            : event.kind === "own_goal"
              ? `${event.player} (own goal)`
              : event.other
                ? `${event.player} · assist ${event.other}`
                : event.kind === "penalty"
                  ? `${event.player} (penalty)`
                  : event.player;
        const home = event.side === "home";
        return (
          <li key={event.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-border-dim bg-surface/80 px-3 py-2 text-sm">
            <span className={`text-right ${home ? "" : "invisible"}`}>{detail}</span>
            <span className="flex min-w-16 items-center justify-center gap-2 font-mono text-primary">
              <span>{EVENT_ICON[event.kind]}</span>
              {minuteLabel(event)}
            </span>
            <span className={home ? "invisible" : ""}>{detail}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Pitch({ comp, team, marks }: { comp: Comp; team: TeamDetail; marks: Map<string, Marks> }) {
  const positioned = team.starters.filter((player) => player.x !== undefined && player.y !== undefined);
  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-b from-emerald-900/70 to-emerald-800/50">
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/25" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
      <div className="absolute inset-x-[22%] top-0 h-[14%] border border-t-0 border-white/25" />
      <div className="absolute inset-x-[22%] bottom-0 h-[14%] border border-b-0 border-white/25" />
      {positioned.map((player) => (
        <div
          key={player.id}
          className="absolute flex w-20 -translate-x-1/2 translate-y-1/2 flex-col items-center text-center"
          style={{ left: `${(player.x ?? 0) / 10}%`, bottom: `${Math.min(92, Math.max(6, (player.y ?? 0) / 10))}%` }}
        >
          <Avatar comp={comp} player={player} />
          <span className="mt-0.5 max-w-full truncate rounded bg-black/55 px-1 text-[10px] leading-4 text-white">
            {player.number ? `${player.number} ` : ""}
            {player.name}
          </span>
          <Badges mark={marks.get(player.id)} />
        </div>
      ))}
    </div>
  );
}

function Lineups({ match }: { match: MatchDetail }) {
  const marks = useMemo(() => buildMarks(match.events), [match.events]);

  if (!match.home.starters.length && !match.away.starters.length) {
    return <p className="py-8 text-center text-fore-muted">Line-ups have not been announced yet. They usually appear about an hour before kick-off.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {(["home", "away"] as const).map((side) => {
        const team = match[side];
        return (
          <div key={side} className="data-card p-4 md:p-5">
            <div className="mb-4 flex items-center gap-3">
              <Crest comp={match.comp} team={team} className="h-8 w-8" />
              <div>
                <p className="text-lg font-semibold">{team.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fore-muted">
                  {[team.formation, team.coach ? `Coach ${team.coach}` : null].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
            <Pitch comp={match.comp} team={team} marks={marks} />
            <p className="section-eyebrow mt-5 text-accent">Substitutes</p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {team.bench.map((player) => (
                <li key={player.id} className="flex items-center justify-between gap-2 rounded-lg border border-border-dim bg-surface/70 px-3 py-1.5 text-sm">
                  <span className="truncate">
                    {player.number ? <span className="mr-2 font-mono text-fore-muted">{player.number}</span> : null}
                    {player.name}
                  </span>
                  <Badges mark={marks.get(player.id)} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function Stats({ match }: { match: MatchDetail }) {
  if (!match.stats.length) {
    return <p className="py-8 text-center text-fore-muted">Match statistics will appear once the game is under way.</p>;
  }
  return (
    <div className="data-card space-y-5 p-5 md:p-8">
      {match.stats.map((row) => {
        const total = row.home + row.away;
        const homeShare = total > 0 ? (row.home / total) * 100 : 50;
        const suffix = row.percent ? "%" : "";
        return (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-mono text-primary">{row.home}{suffix}</span>
              <span className="text-fore-muted">{row.label}</span>
              <span className="font-mono text-accent">{row.away}{suffix}</span>
            </div>
            <div className="flex h-2 gap-1 overflow-hidden rounded-full">
              <div className="rounded-l-full bg-primary/70" style={{ width: `${homeShare}%` }} />
              <div className="rounded-r-full bg-accent/70" style={{ width: `${100 - homeShare}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MatchCenter({ comp, id }: { comp: Comp; id: string }) {
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);

  const finished = match?.status === "finished";

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      try {
        const response = await fetch(`/api/match?comp=${comp}&id=${id}`, { cache: "no-store" });
        const body = (await response.json()) as MatchDetail | { error?: string };
        if (!response.ok) throw new Error("error" in body && body.error ? body.error : "Could not load this match.");
        if (!active) return;
        setMatch(body as MatchDetail);
        setError(null);
        setUpdated(new Date());
        // Finished matches never change, so stop polling
        if ((body as MatchDetail).status === "finished") return;
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "Could not load this match.");
      }
      if (active) timer = setTimeout(load, POLL_MS);
    };

    load();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [comp, id]);

  const activeTab: Tab = tab ?? (match?.status === "upcoming" ? "lineups" : "timeline");
  const back = comp === "ucl" ? "/champions-league" : "/premier-league";

  return (
    <main className="min-h-screen bg-background px-5 pb-12 pt-24 text-foreground grid-bg md:px-8">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <Link href={back} className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent">
          ← {comp === "ucl" ? "Champions League" : "Premier League"}
        </Link>

        {!match ? (
          <p role={error ? "alert" : undefined} className={`py-16 text-center ${error ? "text-warning" : "text-fore-muted"}`}>
            {error ?? "Loading match…"}
          </p>
        ) : (
          <>
            <Header match={match} />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={() => setTab("timeline")} className={tabClass(activeTab === "timeline")}>Timeline</button>
              <button type="button" onClick={() => setTab("lineups")} className={tabClass(activeTab === "lineups")}>Line-ups</button>
              <button type="button" onClick={() => setTab("stats")} className={tabClass(activeTab === "stats")}>Stats</button>
            </div>
            {error && <p role="alert" className="text-center text-sm text-warning">{error} Retrying…</p>}
            {activeTab === "timeline" && <Timeline match={match} />}
            {activeTab === "lineups" && <Lineups match={match} />}
            {activeTab === "stats" && <Stats match={match} />}
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-fore-muted">
              {finished ? "Final result" : `Updating every ${POLL_MS / 1000}s`}
              {updated ? ` · last update ${updated.toLocaleTimeString("en-GB")}` : ""}
            </p>
          </>
        )}
      </section>
    </main>
  );
}
