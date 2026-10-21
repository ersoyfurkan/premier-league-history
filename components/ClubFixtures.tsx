"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PlTeamBadge from "@/components/PlTeamBadge";
import UclImage from "@/components/UclImage";
import type { ClubFixture } from "@/app/api/club-fixtures/route";

export type ClubTeam = { id: string; name: string; logo?: string };
type Comp = "pl" | "ucl";

function Crest({ comp, side, className }: { comp: Comp; side: ClubFixture["home"]; className?: string }) {
  return comp === "pl" ? (
    <PlTeamBadge id={side.id} name={side.name} className={className} />
  ) : (
    <UclImage src={side.logo} alt={side.name} className={className} />
  );
}

export function ClubSearch({
  comp,
  teams,
  selected,
  onSelect,
}: {
  comp: Comp;
  teams: ClubTeam[];
  selected: ClubTeam | null;
  onSelect: (team: ClubTeam | null) => void;
}) {
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const q = query.trim().toLowerCase();
  const matches = q ? teams.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 6) : [];

  // Bring the panel into view when a club is picked from far down the table
  useEffect(() => {
    if (selected) wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  return (
    <div ref={wrapRef} className="relative mb-4 scroll-mt-24">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a club to see its upcoming fixtures…"
        aria-label="Search clubs"
        className="w-full rounded-lg border border-border-dim bg-surface px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary/50"
      />
      {matches.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border-dim bg-surface2 shadow-lg">
          {matches.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(t);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-primary/10"
              >
                {comp === "pl" ? <PlTeamBadge id={t.id} name={t.name} className="h-6 w-6" /> : <UclImage src={t.logo} alt={t.name} className="h-6 w-6" />}
                {t.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {q && matches.length === 0 && <p className="mt-2 text-sm text-fore-muted">No club matches “{query}”.</p>}
      {selected && <ClubFixtures comp={comp} team={selected} onClose={() => onSelect(null)} />}
    </div>
  );
}

function ClubFixtures({ comp, team, onClose }: { comp: Comp; team: ClubTeam; onClose: () => void }) {
  const [state, setState] = useState<{ team: string; fixtures?: ClubFixture[]; error?: boolean } | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/club-fixtures?comp=${comp}&team=${team.id}`)
      .then((r) => (r.ok ? (r.json() as Promise<ClubFixture[]>) : Promise.reject(new Error("failed"))))
      .then((fixtures) => active && setState({ team: team.id, fixtures }))
      .catch(() => active && setState({ team: team.id, error: true }));
    return () => {
      active = false;
    };
  }, [comp, team.id]);

  const ready = state?.team === team.id ? state : null;
  const base = comp === "pl" ? "/premier-league/match" : "/champions-league/match";

  return (
    <div className="mt-4 rounded-xl border border-primary/30 bg-primary-dim/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-xl">
          {comp === "pl" ? <PlTeamBadge id={team.id} name={team.name} className="h-8 w-8" /> : <UclImage src={team.logo} alt={team.name} className="h-8 w-8" />}
          {team.name} · Upcoming fixtures
        </h4>
        <button type="button" onClick={onClose} className="font-mono text-[11px] uppercase tracking-widest text-fore-muted hover:text-accent">
          Close ✕
        </button>
      </div>
      {ready?.error ? (
        <p className="py-4 text-center text-warning">Could not load fixtures.</p>
      ) : !ready ? (
        <p className="py-4 text-center text-fore-muted">Loading…</p>
      ) : ready.fixtures?.length ? (
        <ul className="space-y-2">
          {ready.fixtures.map((f) => (
            <li key={f.id}>
              <Link
                href={`${base}/${f.id}`}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-border-dim bg-surface/80 px-3 py-3 text-sm transition hover:border-primary/50"
              >
                <span className="flex items-center justify-end gap-2 text-right font-semibold">
                  {f.home.name}
                  <Crest comp={comp} side={f.home} className="h-7 w-7" />
                </span>
                <span className="min-w-28 text-center font-mono text-primary">
                  {f.live ? `${f.home.score ?? 0} - ${f.away.score ?? 0}` : f.when}
                  <span className="mt-1 block text-[10px] uppercase tracking-widest text-fore-muted">
                    {f.live ? <span className="text-danger">Live</span> : f.round}
                  </span>
                </span>
                <span className="flex items-center gap-2 font-semibold">
                  <Crest comp={comp} side={f.away} className="h-7 w-7" />
                  {f.away.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-4 text-center text-fore-muted">No upcoming fixtures.</p>
      )}
    </div>
  );
}
