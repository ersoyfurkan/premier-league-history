import Link from "next/link";
import { clubs } from "@/data/clubs";
import { managers } from "@/data/managers";
import { notFound } from "next/navigation";
import FavouriteButton from "@/components/FavouriteButton";

export async function generateStaticParams() {
  return clubs.map((club) => ({
    id: club.id,
  }));
}

export default async function ClubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const club = clubs.find((c) => c.id === id);

  if (!club) {
    notFound();
  }

  const rivalClubs = clubs.filter((c) => club.rivals.includes(c.id));

  return (
    <main className="min-h-screen bg-purple-950 text-white p-8">
      <Link href="/clubs" className="text-purple-300 hover:text-purple-200 mb-8 inline-block">
        ← Back to Clubs
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-8 mb-12">
          <div
            className="w-32 h-32 rounded-xl flex-shrink-0 border-4 shadow-lg"
            style={{ backgroundColor: club.colors, borderColor: club.colors }}
          ></div>
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-3">
              <h1 className="text-5xl font-bold flex-1">{club.name}</h1>
              <FavouriteButton clubId={club.id} clubName={club.name} />
            </div>
            <p className="text-purple-300 text-lg mb-4">Founded {club.founded}</p>
            {club.titles > 0 && (
              <div className="bg-purple-600 px-6 py-3 rounded-lg inline-block">
                <p className="text-sm text-purple-200 mb-1">Premier League Titles</p>
                <p className="text-3xl font-bold">{club.titles}</p>
              </div>
            )}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Stadium Info */}
          <div className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition">
            <h2 className="text-lg font-bold mb-3 text-purple-200">Stadium</h2>
            <p className="text-2xl font-semibold mb-2">{club.stadium}</p>
            <p className="text-purple-400">Capacity: {club.capacity.toLocaleString()}</p>
          </div>

          {/* Current Manager */}
          <div className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition">
            <h2 className="text-lg font-bold mb-3 text-purple-200">Manager</h2>
            <p className="text-2xl font-semibold">{club.manager}</p>
          </div>

          {/* Best Season */}
          <div className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition">
            <h2 className="text-lg font-bold mb-3 text-purple-200">Best Season</h2>
            <p className="text-2xl font-semibold text-green-400">{club.bestSeason}</p>
          </div>

          {/* Worst Season */}
          <div className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition">
            <h2 className="text-lg font-bold mb-3 text-purple-200">Worst Season</h2>
            <p className="text-2xl font-semibold text-red-400">{club.worstSeason}</p>
          </div>

          {/* Top Scorer */}
          <div className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition">
            <h2 className="text-lg font-bold mb-3 text-purple-200">All-Time Top Scorer</h2>
            <p className="text-2xl font-semibold">{club.topScorer}</p>
          </div>

          {/* Legend Player */}
          <div className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition">
            <h2 className="text-lg font-bold mb-3 text-purple-200">Club Legend</h2>
            <p className="text-2xl font-semibold">{club.legendPlayer}</p>
          </div>
        </div>

        {/* Rivals */}
        {rivalClubs.length > 0 && (
          <div className="bg-purple-900 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 text-purple-200">Rivals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rivalClubs.map((rival) => (
                <Link
                  key={rival.id}
                  href={`/clubs/${rival.id}`}
                  className="bg-purple-800 hover:bg-purple-700 p-4 rounded-lg transition font-semibold"
                >
                  {rival.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Top Managers */}
        {managers[club.id as keyof typeof managers] && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-purple-200">Top 5 Managers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {managers[club.id as keyof typeof managers].best.map((manager, index) => (
                <div key={index} className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{manager.name}</h3>
                      <p className="text-purple-400 text-sm mb-2">{manager.years}</p>
                      <p className="text-green-400 font-semibold mb-2">{manager.titles} PL Titles</p>
                      <p className="text-purple-300 text-sm">{manager.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6 text-purple-200">Top 5 Worst Managers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {managers[club.id as keyof typeof managers].worst.map((manager, index) => (
                <div key={index} className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition border border-red-500/30">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{manager.name}</h3>
                      <p className="text-purple-400 text-sm mb-2">{manager.years}</p>
                      <p className="text-red-400 font-semibold mb-2">{manager.titles} PL Titles</p>
                      <p className="text-purple-300 text-sm">{manager.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
