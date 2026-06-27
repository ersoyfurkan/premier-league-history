import Link from "next/link";
import { rivalries } from "@/data/rivalries";

export default function RivalriesPage() {
  return (
    <main className="min-h-screen bg-purple-950 text-white p-8">
      <Link href="/" className="text-purple-300 hover:text-purple-200 mb-8 inline-block">
        ← Home
      </Link>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Premier League Rivalries</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rivalries.map((rivalry) => {
            const total = rivalry.club1Wins + rivalry.club2Wins + rivalry.draws;
            const club1Percent = Math.round((rivalry.club1Wins / total) * 100);
            const drawsPercent = Math.round((rivalry.draws / total) * 100);
            const club2Percent = 100 - club1Percent - drawsPercent;

            return (
              <div key={rivalry.id} className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition">
                {/* Header with both clubs */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">{rivalry.name}</h2>
                  <div className="flex items-center justify-between text-sm text-purple-300 mb-4">
                    <span className="font-semibold">{rivalry.club1}</span>
                    <span>vs</span>
                    <span className="font-semibold">{rivalry.club2}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-purple-300 text-sm mb-4">{rivalry.description}</p>

                {/* Win/Draw/Loss Record */}
                <div className="mb-4">
                  <p className="text-xs text-purple-400 mb-2 font-semibold">
                    PL Meetings: {rivalry.plMeetings}
                  </p>
                  <div className="flex h-6 rounded-lg overflow-hidden bg-purple-950">
                    {rivalry.club1Wins > 0 && (
                      <div
                        className="bg-blue-500 flex items-center justify-center text-xs font-bold text-white"
                        style={{ width: `${club1Percent}%` }}
                      >
                        {club1Percent > 15 && `${rivalry.club1Wins}W`}
                      </div>
                    )}
                    {rivalry.draws > 0 && (
                      <div
                        className="bg-purple-500 flex items-center justify-center text-xs font-bold text-white"
                        style={{ width: `${drawsPercent}%` }}
                      >
                        {drawsPercent > 15 && `${rivalry.draws}D`}
                      </div>
                    )}
                    {rivalry.club2Wins > 0 && (
                      <div
                        className="bg-red-500 flex items-center justify-center text-xs font-bold text-white"
                        style={{ width: `${club2Percent}%` }}
                      >
                        {club2Percent > 15 && `${rivalry.club2Wins}W`}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-purple-400 mt-1">
                    <span>{rivalry.club1Wins}W</span>
                    <span>{rivalry.draws}D</span>
                    <span>{rivalry.club2Wins}W</span>
                  </div>
                </div>

                {/* Biggest Win */}
                <div className="border-t border-purple-700 pt-4">
                  <p className="text-xs text-purple-400 mb-1">Biggest Win</p>
                  <p className="font-semibold text-green-400">{rivalry.biggestWin}</p>
                </div>

                {/* Most Goals */}
                <div className="mt-3">
                  <p className="text-xs text-purple-400 mb-1">Most Goals</p>
                  <p className="font-semibold">{rivalry.mostGoals}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
