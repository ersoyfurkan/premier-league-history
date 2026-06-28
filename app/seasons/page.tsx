"use client";

import { useState } from "react";
import Link from "next/link";
import { seasons } from "@/data/seasons";

type Decade = "all" | "1990s" | "2000s" | "2010s" | "2020s";

export default function SeasonsPage() {
  const [decade, setDecade] = useState<Decade>("all");

  const filteredSeasons = seasons.filter((season) => {
    const year = parseInt(season.year.split("-")[0]);
    switch (decade) {
      case "1990s":
        return year >= 1992 && year < 2000;
      case "2000s":
        return year >= 2000 && year < 2010;
      case "2010s":
        return year >= 2010 && year < 2020;
      case "2020s":
        return year >= 2020;
      default:
        return true;
    }
  });

  return (
    <main className="min-h-screen bg-background text-foreground p-8 grid-bg">
      <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent mb-8 inline-block">
        ← Home
      </Link>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="section-eyebrow text-warning">Timeline Matrix</p>
          <h1 className="section-title bg-[linear-gradient(135deg,#ffffff_30%,#f59e0b_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            Premier League Seasons
          </h1>
        </div>

        {/* Decade Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(["all", "1990s", "2000s", "2010s", "2020s"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDecade(d)}
              className={`font-mono text-[12px] uppercase tracking-[0.1em] px-5 py-2 rounded-lg border transition ${
                decade === d
                  ? "bg-primary-dim text-primary border-primary/40 shadow-glow-cyan"
                  : "bg-surface text-fore-muted border-border-dim hover:border-accent/40 hover:text-accent"
              }`}
            >
              {d === "all" ? "All Seasons" : d}
            </button>
          ))}
        </div>

        {/* Seasons Table */}
        <div className="overflow-x-auto data-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface2">
                <th className="px-6 py-4 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Season</th>
                <th className="px-6 py-4 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Champion</th>
                <th className="px-6 py-4 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Runner-up</th>
                <th className="px-6 py-4 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Third Place</th>
                <th className="px-6 py-4 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Top Scorer</th>
              </tr>
            </thead>
            <tbody>
              {filteredSeasons.map((season, index) => (
                <tr
                  key={season.year}
                  className={`border-b border-border-dim transition hover:bg-primary/5 ${
                    index % 2 === 0 ? "bg-primary/2" : "bg-transparent"
                  }`}
                >
                  <td className="px-6 py-4 font-mono text-sm font-semibold">{season.year}</td>
                  <td className="px-6 py-4 text-success font-semibold">{season.champion}</td>
                  <td className="px-6 py-4 text-foreground">{season.runnerUp}</td>
                  <td className="px-6 py-4 text-fore-muted">{season.thirdPlace}</td>
                  <td className="px-6 py-4">
                    <span className="text-foreground">{season.topScorer}</span>{" "}
                    <span className="font-mono text-primary">({season.topScorerGoals} goals)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSeasons.length === 0 && (
          <div className="text-center text-fore-muted mt-12">
            <p className="text-lg">No seasons found</p>
          </div>
        )}
      </div>
    </main>
  );
}
