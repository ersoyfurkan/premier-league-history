import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-purple-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-purple-700 bg-purple-900/70 px-4 py-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white/90">
            <Image src="/club-logos/liverpool.webp" alt="Liverpool logo" fill className="object-contain p-1" />
          </div>
          <Link href="/clubs/liverpool" className="text-sm font-semibold text-purple-200 hover:text-white">
            Featured club crest: Liverpool
          </Link>
        </div>
        <h1 className="text-5xl font-bold mb-4">Premier League History</h1>
        <p className="text-xl text-purple-300 mb-8">1992 – 2026 · Every season, every club, every story</p>
        <Link href="/clubs" className="bg-purple-500 hover:bg-purple-400 px-8 py-3 rounded-full font-semibold transition">
          Explore Clubs
        </Link>
      </div>
    </main>
  );
}