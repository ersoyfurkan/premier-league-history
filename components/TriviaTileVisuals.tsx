import type { TriviaIcon, TriviaVisual } from "@/data/triviaPathVisuals";
import UclImage from "@/components/UclImage";

function Pictogram({ name }: { name: TriviaIcon }) {
  const shapes: Record<TriviaIcon, React.ReactNode> = {
    ball: <><circle cx="12" cy="12" r="10" /><path d="m12 6 5 4-2 6H9l-2-6 5-4Zm0-4v4M2 9l5 1m10 0 5-1M6 20l3-4m6 0 3 4" /></>,
    boot: <><path d="M5 3h7v8l4 3 5 2v4H3v-6l2-4V3Zm0 17v2m6-2v2m6-2v2M8 8h4m-4 3h4" /></>,
    trophy: <><path d="M7 3h10v6a5 5 0 0 1-10 0V3Zm0 2H3v3a5 5 0 0 0 5 5m9-8h4v3a5 5 0 0 1-5 5m-4 1v6m-5 2h10" /></>,
    stadium: <><ellipse cx="12" cy="10" rx="10" ry="5" /><path d="M2 10v7c4 6 16 6 20 0v-7M6 7V2m12 5V2M6 16v4m6-4v6m6-6v4" /><ellipse cx="12" cy="10" rx="5" ry="2" /></>,
    glove: <path d="M6 12V6a1 1 0 0 1 2 0v4-7a1 1 0 0 1 2 0v7-8a1 1 0 0 1 2 0v8-7a1 1 0 0 1 2 0v8l2-3a2 2 0 0 1 3 2l-4 8H8l-5-7a2 2 0 0 1 3-2l2 2" />,
    players: <><circle cx="8" cy="7" r="3" /><circle cx="17" cy="8" r="3" /><path d="M2 22v-6a6 6 0 0 1 12 0v6m1-8a5 5 0 0 1 7 4v4" /></>,
    manager: <><circle cx="12" cy="6" r="4" /><path d="m8 12 4 3 4-3 5 3v7H3v-7l5-3Zm4 3-2 6h4l-2-6" /></>,
    award: <><circle cx="12" cy="8" r="6" /><path d="m8 13-3 9 7-3 7 3-3-9m-4-9 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3" /></>,
    cards: <><rect x="3" y="6" width="12" height="16" rx="2" /><path d="M8 2h11a2 2 0 0 1 2 2v14" /></>,
    question: <><rect x="4" y="10" width="16" height="12" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v3" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 sm:h-11 sm:w-11" aria-hidden="true">{shapes[name]}</svg>;
}

export default function TriviaTileVisuals({ visuals, hidden = false }: { visuals: TriviaVisual[]; hidden?: boolean }) {
  if (hidden) return (
    <div className="flex flex-1 items-center justify-center py-3 text-fore-muted" aria-label="Final question hidden until a player reaches this tile">
      <Pictogram name="question" />
    </div>
  );
  return (
    <div className="flex flex-1 flex-wrap items-center justify-center gap-2 py-2 sm:gap-3">
      {visuals.map((visual, index) => (
        <span key={index} role="img" aria-label={visual.label} className="inline-flex items-center justify-center text-accent">
          {visual.kind === "image" ? (
            <UclImage src={visual.src} fallback={visual.fallback} alt={visual.label} className="h-9 w-9 sm:h-12 sm:w-12" />
          ) : visual.kind === "badge" ? (
            <span className="rounded-lg border border-accent/40 px-1.5 py-1 font-mono text-xs font-black sm:text-sm">{visual.text}</span>
          ) : <Pictogram name={visual.icon} />}
        </span>
      ))}
    </div>
  );
}
