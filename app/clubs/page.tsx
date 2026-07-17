"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { clubs } from "@/data/clubs";
import { getClubLogo } from "@/data/clubLogos";

export default function ClubsPage() {
  const [search, setSearch] = useState("");

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background text-foreground p-8 grid-bg">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <p className="section-eyebrow text-primary">Club Network</p>
          <h1 className="section-title bg-[linear-gradient(135deg,#ffffff_30%,#00e5ff_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            Premier League Clubs
          </h1>
        </div>

        <div className="data-card max-w-5xl mx-auto mb-8 p-4">
        <input
          type="text"
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-fore-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filteredClubs.map((club) => {
          const logo = getClubLogo(club.id);

          return (
            <Link key={club.id} href={`/clubs/${club.id}`}>
              <div className="cyber-card h-full cursor-pointer">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold mb-1">{club.name}</h2>
                  {logo && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/90 shadow-glow-cyan">
                      <Image src={logo} alt={`${club.name} logo`} fill className="object-contain p-1" />
                    </div>
                  )}
                </div>
              
                <p className="text-fore-muted">Titles: <span className="font-mono text-foreground">{club.titles}</span></p>
                <p className="text-fore-muted">Stadium: <span className="text-foreground">{club.stadium}</span></p>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center text-fore-muted mt-12">
          <p className="text-lg">No clubs found matching "{search}"</p>
        </div>
      )}
      </div>
    </main>
  );
}