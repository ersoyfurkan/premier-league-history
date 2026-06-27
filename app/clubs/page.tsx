import { clubs } from "@/data/clubs";

export default function ClubsPage() {
  return (
    <main className="min-h-screen bg-purple-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Premier League Clubs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {clubs.map((club) => (
          <div key={club.id} className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition">
            <h2 className="text-xl font-bold mb-1">{club.name}</h2>
            <p className="text-purple-300">Titles: {club.titles}</p>
            <p className="text-purple-300">Stadium: {club.stadium}</p>
          </div>
        ))}
      </div>
    </main>
  );
}