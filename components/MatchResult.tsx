"use client";

import { useState } from "react";

const GOLDS = ["#FFD700", "#FFC400", "#FFE766", "#E6A800", "#FFF1A8"];

type Piece = { left: number; delay: number; duration: number; size: number; color: string; round: boolean };

function makePieces(): Piece[] {
  return Array.from({ length: 90 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 3,
    size: 6 + Math.random() * 8,
    color: GOLDS[i % GOLDS.length],
    round: Math.random() < 0.3,
  }));
}

export default function MatchResult({
  won,
  subtitle,
  children,
}: {
  won: boolean;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [pieces] = useState<Piece[]>(() => (won ? makePieces() : []));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      {won && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {pieces.map((p, i) => (
            <span
              key={i}
              className="absolute top-0 block"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.round ? p.size : p.size * 1.6,
                borderRadius: p.round ? "9999px" : "2px",
                backgroundColor: p.color,
                animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative text-center">
        {won ? (
          <>
            <div className="text-[clamp(72px,14vw,160px)] leading-none" style={{ animation: "trophy-pop 0.8s ease-out both" }}>
              🏆
            </div>
            <h2
              className="mt-4 font-display text-[clamp(48px,10vw,130px)] leading-none"
              style={{ color: "#FFD700", animation: "gold-shine 2s ease-in-out infinite" }}
            >
              YOU WIN!
            </h2>
          </>
        ) : (
          <h2 className="font-display text-[clamp(40px,8vw,110px)] leading-tight text-foreground">
            You lost, try again
          </h2>
        )}
        {subtitle && <p className="mt-4 text-lg text-fore-muted">{subtitle}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}
