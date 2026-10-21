import Link from "next/link";

const competitions = [
  {
    name: "Premier League",
    eyebrow: "England · 1992–present",
    description:
      "Explore the current season, clubs, rivalries, historical tables, and the Premier League Stat Duel.",
    href: "/premier-league",
    accent: "text-primary",
    border: "border-primary/25 hover:border-primary/60",
    glow: "glow-orb-cyan",
    mark: (
      <span
        role="img"
        aria-label="Premier League logo"
        className="h-20 w-20 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url(https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg)" }}
      />
    ),
  },
  {
    name: "Champions League",
    eyebrow: "Europe · since 1955",
    description:
      "Follow the league phase and fixtures, browse all-time records and winners, and play the UCL Stat Duel.",
    href: "/champions-league",
    accent: "text-accent",
    border: "border-accent/25 hover:border-accent/60",
    glow: "glow-orb-purple",
    mark: (
      <span
        aria-hidden="true"
        className="h-20 w-20 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url(https://img.uefa.com/imgml/uefacom/elements/logos/competitions/color/full/1.svg)" }}
      />
    ),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground grid-bg px-6 py-14 md:py-20">
      <section className="relative mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col justify-center">
        <div className="glow-orb glow-orb-cyan -left-24 top-0 h-[420px] w-[420px]" />
        <div className="glow-orb glow-orb-purple -right-24 bottom-0 h-[500px] w-[500px]" />

        <div className="relative z-10 text-center">
          <p className="section-eyebrow text-primary">Football History Archive</p>
          <h1 className="hero-title mt-4">Choose Your Competition</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-fore-muted md:text-lg">
            Pick a competition to explore its seasons, stats, records, and player games.
          </p>

          <div className="mt-12 grid gap-5 text-left md:grid-cols-2">
            {competitions.map((competition) => (
              <Link
                key={competition.name}
                href={competition.href}
                className={`group relative overflow-hidden rounded-3xl border bg-surface/80 p-7 shadow-glow-card transition hover:-translate-y-1 md:p-9 ${competition.border}`}
              >
                <div className={`glow-orb ${competition.glow} -right-16 -top-24 h-64 w-64`} />
                <div className="relative z-10 flex h-full flex-col">
                  <div className={`mb-7 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-black/25 ${competition.accent}`}>
                    {competition.mark}
                  </div>
                  <p className={`section-eyebrow ${competition.accent}`}>{competition.eyebrow}</p>
                  <h2 className="mt-3 text-4xl md:text-5xl">{competition.name}</h2>
                  <p className="mt-4 max-w-lg flex-1 leading-7 text-fore-muted">
                    {competition.description}
                  </p>
                  <span className={`mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] ${competition.accent}`}>
                    Enter competition <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
