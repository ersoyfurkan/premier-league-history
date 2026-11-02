"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = { label: string; leagueHref: string; children: ReactNode };

function Chooser({ label, leagueHref, children }: Props) {
  const params = useSearchParams();
  if (params.get("mode") === "league") return <>{children}</>;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-6 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-black text-white">Choose your game mode</h1>
        <p className="mt-2 text-sm text-white/60">Play games about {label}, or mix every competition together.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={`${leagueHref}?mode=league`}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30 hover:bg-white/10"
        >
          <div className="text-4xl">🏆</div>
          <h2 className="mt-3 text-xl font-bold text-white">{label} games</h2>
          <p className="mt-1 text-sm text-white/60">Questions, players and clubs only from {label}.</p>
        </Link>
        <Link
          href="/game/general"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30 hover:bg-white/10"
        >
          <div className="text-4xl">🌍</div>
          <h2 className="mt-3 text-xl font-bold text-white">General</h2>
          <p className="mt-1 text-sm text-white/60">
            Champions League, Premier League, La Liga, Bundesliga, Serie A, Ligue 1, World Cup, Euros and Copa América.
          </p>
        </Link>
      </div>
    </main>
  );
}

export default function GameModeChooser(props: Props) {
  return (
    <Suspense fallback={null}>
      <Chooser {...props} />
    </Suspense>
  );
}
