import Link from "next/link";

export default function GameModePage() {
  return (
    <main className="min-h-screen bg-background text-foreground grid-bg px-6 py-10">
      <section className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-surface/80 p-8 md:p-12 shadow-glow-card">
          <div className="glow-orb glow-orb-cyan h-80 w-80 -top-24 -left-16" />
          <div className="glow-orb glow-orb-purple h-96 w-96 -right-20 top-1/3" />

          <div className="relative z-10 text-center">
            <p className="section-eyebrow text-primary">Game Lobby</p>
            <h1 className="section-title mt-3">Choose Mode</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base md:text-lg text-fore-muted leading-8">
              Pick how you want to play, then you will be sent to a dedicated full-size battle screen.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Link
                href="/game/play?mode=pvp"
                className="rounded-2xl border border-primary/30 bg-primary-dim px-6 py-8 text-left transition hover:shadow-glow-card"
              >
                <p className="section-eyebrow text-primary">Local</p>
                <h2 className="mt-2 text-3xl md:text-4xl">1v1</h2>
                <p className="mt-3 text-sm md:text-base text-fore-muted">
                  Two players on one device. Cards stay hidden until the round resolves.
                </p>
              </Link>

              <Link
                href="/game/play?mode=ai"
                className="rounded-2xl border border-accent/30 bg-surface px-6 py-8 text-left transition hover:border-accent/60"
              >
                <p className="section-eyebrow text-accent">Solo</p>
                <h2 className="mt-2 text-3xl md:text-4xl">vs AI</h2>
                <p className="mt-3 text-sm md:text-base text-fore-muted">
                  You are Player 1. The AI takes Player 2 and picks automatically on its turns.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}