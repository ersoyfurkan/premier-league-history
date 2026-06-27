"use client";

import { useState } from "react";
import Link from "next/link";
import { clubs } from "@/data/clubs";

export default function ClubsPage() {
  const [search, setSearch] = useState("");

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-purple-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Premier League Clubs</h1>
      
      <div className="max-w-5xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-purple-900 text-white placeholder-purple-400 border border-purple-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filteredClubs.map((club) => (
          <Link key={club.id} href={`/clubs/${club.id}`}>
            <div className="bg-purple-900 rounded-xl p-6 hover:bg-purple-800 transition cursor-pointer h-full">
              <h2 className="text-xl font-bold mb-1">{club.name}</h2>
              <p className="text-purple-300">Titles: {club.titles}</p>
              <p className="text-purple-300">Stadium: {club.stadium}</p>
            </div>
          </Link>
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center text-purple-400 mt-12">
          <p className="text-lg">No clubs found matching "{search}"</p>
        </div>
      )}
    </main>
  );
}