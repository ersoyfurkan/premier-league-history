import Link from "next/link";
import { rivalries } from "@/data/rivalries";

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rivalries.map((rivalry) => {
            const total = rivalry.club1Wins + rivalry.club2Wins + rivalry.draws;
            const club1Percent = Math.round((rivalry.club1Wins / total) * 100);
            const drawsPercent = Math.round((rivalry.draws / total) * 100);
            const club2Percent = 100 - club1Percent - drawsPercent;

            return (
              <div key={rivalry.id} className="cyber-card scanline">
                {/* Header with both clubs */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">{rivalry.name}</h2>
                  <div className="flex items-center justify-between text-sm text-fore-muted mb-4">
                    <span className="font-semibold">{rivalry.club1}</span>
                    <span>vs</span>
                    <span className="font-semibold">{rivalry.club2}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-fore-muted text-sm mb-4 leading-7">{rivalry.description}</p>

                {/* Win/Draw/Loss Record */}
                <div className="mb-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary mb-2">
                    PL Meetings: {rivalry.plMeetings}
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
                    <span className="pill-badge bg-primary/15 border border-primary/35 text-primary justify-center">{rivalry.club1Wins}W</span>
                    <span className="pill-badge bg-accent/15 border border-accent/35 text-accent justify-center">{rivalry.draws}D</span>
                    <span className="pill-badge bg-danger/15 border border-danger/35 text-danger justify-center">{rivalry.club2Wins}W</span>
                  </div>
                </div>

                {/* Biggest Win */}
                <div className="border-t border-border pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-success mb-1">Biggest Win</p>
                  <p className="font-semibold text-success">{rivalry.biggestWin}</p>
                </div>

                {/* Most Goals */}
                <div className="mt-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-warning mb-1">Most Goals</p>
                  <p className="font-semibold text-foreground">{rivalry.mostGoals}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
