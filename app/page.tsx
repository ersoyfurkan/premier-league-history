import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-purple-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Premier League History</h1>
        <p className="text-xl text-purple-300 mb-8">1992 – 2026 · Every season, every club, every story</p>
        <Link href="/clubs" className="bg-purple-500 hover:bg-purple-400 px-8 py-3 rounded-full font-semibold transition">
          Explore Clubs
        </Link>
      </div>
    </main>
  );
}