import Link from "next/link";
import Image from "next/image";

export default function Home() {
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

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/clubs" className="btn-primary">
              Explore Clubs
            </Link>
            <Link href="/seasons" className="btn-ghost">
              Season Matrix
            </Link>
          </div>

          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-border bg-surface/80 px-4 py-2 shadow-glow-card">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white/90">
              <Image src="/club-logos/liverpool.webp" alt="Liverpool logo" fill className="object-contain p-1" />
            </div>
            <Link href="/clubs/liverpool" className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent hover:text-primary">
              Featured Crest: Liverpool
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Seasons Logged", value: "34" },
              { label: "Legend Clubs", value: "20+" },
              { label: "Rivalries", value: "20" },
              { label: "Top Managers", value: "200+" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-primary/15 bg-primary-dim p-5 text-center shadow-glow-card">
                <p className="font-display stat-number text-primary text-[clamp(36px,5vw,48px)] leading-none">
                  {stat.value}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fore-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}