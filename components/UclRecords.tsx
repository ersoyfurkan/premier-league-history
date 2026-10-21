"use client";

import { useEffect, useMemo, useState } from "react";
import type { UclStat } from "@/data/championsLeague";
import UclImage from "@/components/UclImage";
import { clubLogoUrl, loadUclPlayers, rankPlayers, type UclPlayer } from "@/lib/uclPlayers";

const statOptions: { key: UclStat; label: string }[] = [
  { key: "goals", label: "Goals" },
  { key: "appearances", label: "Appearances" },
  { key: "assists", label: "Assists" },
];

const PAGE_SIZE = 100;

const buttonClass = (active: boolean) =>
  `rounded-lg border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
    active
      ? "border-primary/40 bg-primary-dim text-primary shadow-glow-cyan"
      : "border-border-dim bg-surface text-fore-muted hover:border-accent/40 hover:text-accent"
  }`;

const fold = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function UclRecords() {
  const [stat, setStat] = useState<UclStat>("goals");
  const [players, setPlayers] = useState<UclPlayer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    loadUclPlayers()
      .then((data) => !cancelled && setPlayers(data))
      .catch((reason: Error) => !cancelled && setError(reason.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const ranked = useMemo(() => (players ? rankPlayers(players, stat) : []), [players, stat]);
  const filtered = useMemo(() => {
    const needle = fold(query.trim());
    if (!needle) return ranked;
    return ranked.filter(({ player }) => fold(player.name).includes(needle) || fold(player.club).includes(needle));
  }, [ranked, query]);
  const label = statOptions.find((option) => option.key === stat)!.label;

  return (
    <section className="space-y-5">
      <div className="text-center">
        <p className="section-eyebrow text-accent">European Cup & Champions League since 1992/93</p>
        <h2 className="mt-2 text-4xl">All-Time Player Stats</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-fore-muted">
          Career totals for every player in the Champions League era. The player duel draws from the same list.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {statOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => {
              setStat(option.key);
              setVisible(PAGE_SIZE);
            }}
            className={buttonClass(stat === option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-md">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder="Search a player or club"
          aria-label="Search players or clubs"
          className="w-full rounded-lg border border-border-dim bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </div>

      <div className="data-card overflow-x-auto p-4 md:p-6">
        {error ? (
          <p role="alert" className="py-8 text-center text-warning">{error}</p>
        ) : !players ? (
          <p className="py-8 text-center text-fore-muted">Loading players…</p>
        ) : (
          <>
            <table className="w-full min-w-[480px] text-left">
              <thead>
                <tr className="border-b border-border bg-surface2">
                  {["Rank", "Player", "Club", label].map((heading) => (
                    <th key={heading} className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, visible).map(({ player, rank }, index) => (
                  <tr key={`${player.name}-${player.photo}-${index}`} className="border-b border-border-dim text-sm">
                    <td className="px-3 py-3 font-mono text-primary">{rank}</td>
                    <td className="px-3 py-3 font-semibold">
                      <span className="flex items-center gap-3">
                        <UclImage src={player.photo} alt={player.name} shape="circle" className="h-10 w-10" />
                        {player.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-fore-muted">
                      <span className="flex items-center gap-2">
                        <UclImage src={clubLogoUrl(player.clubId)} alt={player.club || "Club"} className="h-6 w-6" />
                        {player.club}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-semibold text-primary">{player[stat]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="py-8 text-center text-fore-muted">No players match your search.</p>}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-fore-muted">
              <span>
                Showing {Math.min(visible, filtered.length).toLocaleString()} of {filtered.length.toLocaleString()} players
              </span>
              {visible < filtered.length && (
                <button type="button" onClick={() => setVisible((count) => count + PAGE_SIZE)} className={buttonClass(false)}>
                  Show more
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
