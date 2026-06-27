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
    <main className="min-h-screen bg-purple-950 text-white p-8">
      <Link href="/" className="text-purple-300 hover:text-purple-200 mb-8 inline-block">
        ← Home
      </Link>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Premier League Seasons</h1>

        {/* Decade Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(["all", "1990s", "2000s", "2010s", "2020s"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDecade(d)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                decade === d
                  ? "bg-purple-500 text-white"
                  : "bg-purple-900 text-purple-300 hover:bg-purple-800"
              }`}
            >
              {d === "all" ? "All Seasons" : d}
            </button>
          ))}
        </div>

        {/* Seasons Table */}
        <div className="overflow-x-auto bg-purple-900 rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-700">
                <th className="px-6 py-4 text-left font-bold text-purple-200">Season</th>
                <th className="px-6 py-4 text-left font-bold text-purple-200">Champion</th>
                <th className="px-6 py-4 text-left font-bold text-purple-200">Runner-up</th>
                <th className="px-6 py-4 text-left font-bold text-purple-200">Third Place</th>
                <th className="px-6 py-4 text-left font-bold text-purple-200">Top Scorer</th>
              </tr>
            </thead>
            <tbody>
              {filteredSeasons.map((season) => (
                <tr key={season.year} className="border-b border-purple-800 hover:bg-purple-800 transition">
                  <td className="px-6 py-4 font-semibold">{season.year}</td>
                  <td className="px-6 py-4 text-green-400 font-semibold">{season.champion}</td>
                  <td className="px-6 py-4">{season.runnerUp}</td>
                  <td className="px-6 py-4 text-purple-300">{season.thirdPlace}</td>
                  <td className="px-6 py-4">
                    {season.topScorer} ({season.topScorerGoals} goals)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSeasons.length === 0 && (
          <div className="text-center text-purple-400 mt-12">
            <p className="text-lg">No seasons found</p>
          </div>
        )}
      </div>
    </main>
  );
}
