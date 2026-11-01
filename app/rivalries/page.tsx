import Link from "next/link";
import Image from "next/image";
import { rivalries } from "@/data/rivalries";
import { clubs } from "@/data/clubs";
import { getClubLogo } from "@/data/clubLogos";

export default function RivalriesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8 grid-bg">
      <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent mb-8 inline-block">
        ← Home
      </Link>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="section-eyebrow text-accent">Conflict Radar</p>
          <h1 className="section-title bg-[linear-gradient(135deg,#ffffff_30%,#a855f7_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            Premier League Rivalries
          </h1>
          <p className="mt-3 text-sm text-fore-muted">
            Premier League head-to-head records through the 2025/26 season. Rivalry top scorers include all competitions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rivalries.map((rivalry) => {
            const total = rivalry.club1Wins + rivalry.club2Wins + rivalry.draws;
            const club1Percent = Math.round((rivalry.club1Wins / total) * 100);
            const drawsPercent = Math.round((rivalry.draws / total) * 100);
            const club2Percent = 100 - club1Percent - drawsPercent;
            const club1 = clubs.find((club) => club.id === rivalry.club1);
            const club2 = clubs.find((club) => club.id === rivalry.club2);

            return (
              <div key={rivalry.id} className="cyber-card scanline">
                {/* Header with both clubs */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">{rivalry.name}</h2>
                  <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm text-fore-muted">
                    {[club1, club2].map((club, index) => {
                      const badge = club ? getClubLogo(club.id) : null;
                      return (
                        <div
                          key={club?.id ?? index}
                          className={`flex min-w-0 items-center gap-3 ${index === 1 ? "flex-row-reverse text-right" : ""}`}
                        >
                          {badge && club && (
                            <Image
                              src={badge}
                              alt={`${club.name} logo`}
                              width={48}
                              height={48}
                              unoptimized
                              className="h-12 w-12 shrink-0 object-contain"
                            />
                          )}
                          <span className="font-semibold text-foreground">{club?.name ?? "Unknown club"}</span>
                        </div>
                      );
                    })}
                    <span className="font-mono text-primary">vs</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-fore-muted text-sm mb-4 leading-7">{rivalry.description}</p>

                {/* Win/Draw/Loss Record */}
                <div className="mb-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary mb-2">
                    Premier League record · {rivalry.plMeetings} meetings
                  </p>
                  <div className="flex h-2 rounded-sm overflow-hidden bg-white/5">
                    {rivalry.club1Wins > 0 && (
                      <div
                        className="bg-gradient-to-r from-primary to-primary/80 shadow-[0_0_8px_rgba(0,229,255,0.45)]"
                        style={{ width: `${club1Percent}%` }}
                      />
                    )}
                    {rivalry.draws > 0 && (
                      <div
                        className="bg-gradient-to-r from-accent to-accent/80 shadow-[0_0_8px_rgba(168,85,247,0.45)]"
                        style={{ width: `${drawsPercent}%` }}
                      />
                    )}
                    {rivalry.club2Wins > 0 && (
                      <div
                        className="bg-gradient-to-r from-danger to-danger/80 shadow-[0_0_8px_rgba(239,68,68,0.45)]"
                        style={{ width: `${club2Percent}%` }}
                      />
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <span className="pill-badge bg-primary/15 border border-primary/35 text-primary justify-center">{club1?.name ?? rivalry.club1}: {rivalry.club1Wins}W</span>
                    <span className="pill-badge bg-accent/15 border border-accent/35 text-accent justify-center">{rivalry.draws}D</span>
                    <span className="pill-badge bg-danger/15 border border-danger/35 text-danger justify-center">{club2?.name ?? rivalry.club2}: {rivalry.club2Wins}W</span>
                  </div>
                  <p className="mt-3 text-xs text-fore-muted">
                    Goals: {club1?.name} {rivalry.club1Goals} · {club2?.name} {rivalry.club2Goals}
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-success mb-2">Biggest Premier League wins</p>
                  <div className="space-y-2">
                    {rivalry.biggestWins.map((win) => {
                      const badge = getClubLogo(win.clubId);
                      return (
                        <p key={win.clubId} className="flex items-center gap-2 text-sm font-semibold text-success">
                          {badge && (
                            <Image
                              src={badge}
                              alt=""
                              width={24}
                              height={24}
                              unoptimized
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <span>{win.score} <span className="font-normal text-fore-muted">· {win.date}</span></span>
                        </p>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-warning mb-1">Rivalry top scorer · all competitions</p>
                  {rivalry.topScorers.map((scorer) => {
                    const badge = getClubLogo(scorer.clubId);
                    return (
                      <p key={scorer.player} className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        {badge && (
                          <Image
                            src={badge}
                            alt=""
                            width={20}
                            height={20}
                            unoptimized
                            className="h-5 w-5 object-contain"
                          />
                        )}
                        {scorer.player} <span className="font-mono text-warning">{scorer.goals} goals</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
