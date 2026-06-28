import Link from "next/link";
import Image from "next/image";
import { clubs } from "@/data/clubs";
import { managers } from "@/data/managers";
import { notFound } from "next/navigation";
import FavouriteButton from "@/components/FavouriteButton";
import { getClubLogo } from "@/data/clubLogos";

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
  const clubLogo = getClubLogo(club.id);

  return (
    <main className="min-h-screen bg-background text-foreground p-8 grid-bg">
      <Link href="/clubs" className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent mb-8 inline-block">
        ← Back to Clubs
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="data-card p-8 mb-10 scanline">
          <p className="section-eyebrow text-primary mb-2">Club Signal</p>
          <div className="flex items-start gap-8">
          {clubLogo ? (
            <div className="relative w-32 h-32 rounded-xl flex-shrink-0 border-4 border-white/60 bg-white/95 shadow-lg overflow-hidden">
              <Image src={clubLogo} alt={`${club.name} logo`} fill className="object-contain p-3" />
            </div>
          ) : (
            <div
              className="w-32 h-32 rounded-xl flex-shrink-0 border-4 shadow-lg"
              style={{ backgroundColor: club.colors, borderColor: club.colors }}
            ></div>
          )}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-3">
              <h1 className="text-[clamp(42px,8vw,74px)] leading-[0.95] font-black bg-[linear-gradient(135deg,#ffffff_30%,#00e5ff_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] flex-1">{club.name}</h1>
              <FavouriteButton clubId={club.id} clubName={club.name} />
            </div>
            <p className="text-fore-muted text-base mb-4">Founded {club.founded}</p>
            {club.titles > 0 && (
              <div className="inline-block rounded-xl border border-primary/30 bg-primary-dim px-6 py-3 shadow-glow-cyan">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary mb-1">Premier League Titles</p>
                <p className="font-display text-3xl text-primary stat-number">{club.titles}</p>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Stadium Info */}
          <div className="cyber-card">
            <h2 className="text-lg font-bold mb-3 text-primary">Stadium</h2>
            <p className="text-2xl font-semibold mb-2">{club.stadium}</p>
            <p className="text-fore-muted">Capacity: <span className="font-mono text-foreground">{club.capacity.toLocaleString()}</span></p>
          </div>

          {/* Current Manager */}
          <div className="cyber-card">
            <h2 className="text-lg font-bold mb-3 text-accent">Manager</h2>
            <p className="text-2xl font-semibold">{club.manager}</p>
          </div>

          {/* Best Season */}
          <div className="cyber-card">
            <h2 className="text-lg font-bold mb-3 text-success">Best Season</h2>
            <p className="text-2xl font-semibold text-success">{club.bestSeason}</p>
          </div>

          {/* Worst Season */}
          <div className="cyber-card">
            <h2 className="text-lg font-bold mb-3 text-danger">Worst Season</h2>
            <p className="text-2xl font-semibold text-danger">{club.worstSeason}</p>
          </div>

          {/* Top Scorer */}
          <div className="cyber-card">
            <h2 className="text-lg font-bold mb-3 text-primary">All-Time Top Scorer</h2>
            <p className="text-2xl font-semibold">{club.topScorer}</p>
          </div>

          {/* Legend Player */}
          <div className="cyber-card">
            <h2 className="text-lg font-bold mb-3 text-accent">Club Legend</h2>
            <p className="text-2xl font-semibold">{club.legendPlayer}</p>
          </div>
        </div>

        {/* Rivals */}
        {rivalClubs.length > 0 && (
          <div className="data-card p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 text-primary">Rivals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rivalClubs.map((rival) => (
                <Link
                  key={rival.id}
                  href={`/clubs/${rival.id}`}
                  className="rounded-lg border border-border bg-surface2 hover:border-primary/40 hover:bg-primary-dim p-4 transition font-semibold"
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
            <p className="section-eyebrow text-primary mb-1">Performance Matrix</p>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Top 5 Managers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {managers[club.id as keyof typeof managers].best.map((manager, index) => (
                <div key={index} className="cyber-card">
                  <div className="flex items-start gap-4">
                    <div className="bg-success text-background rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{manager.name}</h3>
                      <p className="text-fore-muted text-sm mb-2">{manager.years}</p>
                      <p className="text-success font-semibold mb-2">{manager.titles} PL Titles</p>
                      <p className="text-fore-muted text-sm">{manager.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6 text-foreground">Top 5 Worst Managers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {managers[club.id as keyof typeof managers].worst.map((manager, index) => (
                <div key={index} className="cyber-card border-danger/40">
                  <div className="flex items-start gap-4">
                    <div className="bg-danger text-background rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{manager.name}</h3>
                      <p className="text-fore-muted text-sm mb-2">{manager.years}</p>
                      <p className="text-danger font-semibold mb-2">{manager.titles} PL Titles</p>
                      <p className="text-fore-muted text-sm">{manager.note}</p>
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
