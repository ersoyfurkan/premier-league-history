import Link from "next/link";

export default function PremierLeagueHome() {
  return (
    <main className="min-h-screen bg-background text-foreground grid-bg overflow-hidden">
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-16">
        <div className="glow-orb glow-orb-cyan w-[520px] h-[520px] -top-28 -left-24" />
        <div className="glow-orb glow-orb-purple w-[620px] h-[620px] top-1/4 -right-36" />
        <div className="glow-orb glow-orb-violet w-[460px] h-[460px] -bottom-24 left-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-6xl w-full text-center">
          <div className="mb-4 section-eyebrow text-primary">Live Historical Archive</div>
          <h1 className="hero-title">Premier League Broadcast 2050</h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-7 text-fore-muted">
            Dark, dense, data-forward coverage of every season, every rivalry, and every club.
            Explore the league history through a futuristic command-center experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/clubs" className="btn-primary">
              Explore Clubs
            </Link>
            <Link href="/seasons" className="btn-ghost">
              Season Matrix
            </Link>
            <Link href="/game" className="btn-ghost">
              Play Stat Duel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
