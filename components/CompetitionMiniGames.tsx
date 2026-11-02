"use client";

import { useState } from "react";
import CardFace from "@/components/CardFace";
import PlayerPhoto from "@/components/PlayerPhoto";
import { playerFaceUrl } from "@/data/playerFaces";
import UclImage from "@/components/UclImage";
import { UCL_CARDS } from "@/data/uclCards";
import { MARKET_VALUE_PLAYERS, type MarketValuePlayer, type MarketValueSnapshot } from "@/data/marketValues";
import { normalizeFootballPlayerName } from "@/data/footballTicTacToe";
import type { PlayerCard } from "@/data/players";
import { poolFor, type Competition } from "@/lib/gameRoom";
import { COMPETITION_LABELS, isTournamentComp } from "@/lib/competitions";
import { espnHeadshot } from "@/lib/clubArt";

export type MiniGameMode = "higher-lower" | "transfer-market";

const STAT_LABELS = {
  goals: "career goals",
  appearances: "appearances",
  assists: "assists",
} as const;

function samplePlayers<T extends { id?: string; name: string }>(pool: T[], count: number, excluded: string[] = []) {
  const available = pool.filter((player) => !excluded.includes(player.id ?? player.name));
  for (let index = available.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [available[index], available[swapIndex]] = [available[swapIndex], available[index]];
  }
  return available.slice(0, count);
}

function HigherLower({ comp, onBack }: { comp: Competition; onBack: () => void }) {
  const players = poolFor(comp);
  const [stat, setStat] = useState<keyof typeof STAT_LABELS>("goals");
  const [pair, setPair] = useState<[PlayerCard, PlayerCard] | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");

  const start = () => {
    const [first, second] = samplePlayers(players, 2);
    if (!first || !second) return;
    setPair([first, second]);
    setScore(0);
    setGameOver(false);
    setFeedback("");
  };

  const guess = (direction: "higher" | "lower") => {
    if (!pair || gameOver) return;
    const [current, challenger] = pair;
    const currentValue = current[stat];
    const challengerValue = challenger[stat];
    const correct =
      currentValue === challengerValue ||
      (direction === "higher" ? challengerValue > currentValue : challengerValue < currentValue);

    if (correct) {
      const nextPlayer = samplePlayers(players, 1, [challenger.id])[0];
      setPair(nextPlayer ? [challenger, nextPlayer] : null);
      setScore((value) => value + 1);
      setFeedback(`${challenger.name} has ${challengerValue} ${STAT_LABELS[stat]} — correct!`);
    } else {
      setGameOver(true);
      setFeedback(`Not quite — ${challenger.name} has ${challengerValue} ${STAT_LABELS[stat]}.`);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-primary/25 bg-surface/80 p-5 text-left md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow text-primary">Quick game</p>
          <h2 className="mt-2 text-3xl">Higher or Lower</h2>
          <p className="mt-2 text-sm text-fore-muted">Guess who has more in the selected competition stat.</p>
        </div>
        <p className="font-mono text-lg text-accent">Streak: {score}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(STAT_LABELS) as (keyof typeof STAT_LABELS)[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setStat(key)}
            disabled={Boolean(pair) && !gameOver}
            className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-wide ${
              stat === key ? "border-primary/50 bg-primary/15 text-primary" : "border-border text-fore-muted"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {key}
          </button>
        ))}
      </div>

      {pair ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="data-card p-5">
            <CardFace card={pair[0]} nation={isTournamentComp(comp)} />
            <p className="mt-4 text-2xl font-bold">{pair[0].name}</p>
            <p className="mt-1 text-sm text-fore-muted">{pair[0].club ?? "Career record"}</p>
            <p className="mt-4 font-mono text-primary">{pair[0][stat]} {STAT_LABELS[stat]}</p>
          </div>
          <div className="data-card p-5">
            <CardFace card={pair[1]} nation={isTournamentComp(comp)} />
            <p className="mt-4 text-2xl font-bold">{pair[1].name}</p>
            <p className="mt-1 text-sm text-fore-muted">{pair[1].club ?? "Career record"}</p>
            <p className="mt-4 font-mono text-accent">
              {gameOver ? `${pair[1][stat]} ${STAT_LABELS[stat]}` : "How many?"}
            </p>
            {!gameOver && (
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => guess("higher")} className="btn-primary">Higher ↑</button>
                <button type="button" onClick={() => guess("lower")} className="btn-ghost">Lower ↓</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-background/50 p-8 text-center">
          <p className="text-fore-muted">See how long you can keep your streak going.</p>
          <button type="button" onClick={start} className="btn-primary mt-5">Start guessing</button>
        </div>
      )}

      {feedback && <p aria-live="polite" className="mt-4 text-sm text-foreground">{feedback}</p>}
      {gameOver && <button type="button" onClick={start} className="btn-primary mt-4">Play again</button>}
      <button type="button" onClick={onBack} className="btn-ghost mt-6">← All game modes</button>
    </div>
  );
}

function formatValue(value: number) {
  return `€${value}m`;
}

type MarketRoundPlayer = {
  player: MarketValuePlayer;
  snapshot: MarketValueSnapshot;
};

function shuffledPlayers(players: MarketValuePlayer[]) {
  const shuffled = [...players];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function marketRoundPlayer(player: MarketValuePlayer): MarketRoundPlayer {
  const snapshot = player.values[Math.floor(Math.random() * player.values.length)];
  return { player, snapshot };
}

const CLUB_BADGES: Record<string, string> = {
  "Manchester City": "/club-logos/man-city.svg",
  "Manchester United": "/club-logos/man-utd.svg",
  Chelsea: "/club-logos/chelsea.svg",
  Liverpool: "/club-logos/liverpool.svg",
  "Tottenham Hotspur": "/club-logos/tottenham.svg",
  "Real Madrid": "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
  Barcelona: "https://a.espncdn.com/i/teamlogos/soccer/500/83.png",
  "Atlético Madrid": "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png",
  "Paris Saint-Germain": "https://img.uefa.com/imgml/TP/teams/logos/70x70/52747.png",
  "Bayern Munich": "https://img.uefa.com/imgml/TP/teams/logos/70x70/50037.png",
  Monaco: "https://a.espncdn.com/i/teamlogos/soccer/500/174.png",
  Juventus: "https://img.uefa.com/imgml/TP/teams/logos/70x70/50139.png",
  "Borussia Dortmund": "https://img.uefa.com/imgml/TP/teams/logos/70x70/52758.png",
  "Red Bull Salzburg": "https://img.uefa.com/imgml/TP/teams/logos/70x70/50166.png",
  Roma: "https://img.uefa.com/imgml/TP/teams/logos/70x70/50137.png",
  "Southampton": "/club-logos/southampton.svg",
  "AS Monaco": "https://a.espncdn.com/i/teamlogos/soccer/500/174.png",
  Ajax: "https://img.uefa.com/imgml/TP/teams/logos/70x70/50143.png",
};

const FALLBACK_PLAYER_PHOTOS: Record<string, string> = {
  "Kylian Mbappé": espnHeadshot("231388"),
  "Luka Modrić": espnHeadshot("125859"),
  "Vinícius Júnior": espnHeadshot("252107"),
  "Alexander Isak": espnHeadshot("234613"),
  "Ollie Watkins": espnHeadshot("229647"),
  "Cole Palmer": espnHeadshot("294357"),
  "Mikel Oyarzabal": espnHeadshot("229018"),
  "Nabil Fekir": espnHeadshot("212888"),
  "Takefusa Kubo": espnHeadshot("254453"),
  "Lautaro Martínez": espnHeadshot("219713"),
  "Julián Álvarez": espnHeadshot("277206"),
};

function marketPlayerCard(comp: Competition, name: string) {
  const normalizedName = normalizeFootballPlayerName(name);
  const candidates: PlayerCard[] = [...poolFor(comp), ...UCL_CARDS];
  return candidates.find(
    (candidate) => normalizeFootballPlayerName(candidate.name) === normalizedName,
  );
}

function MarketPlayerPhoto({ comp, name }: { comp: Competition; name: string }) {
  const card = marketPlayerCard(comp, name);
  if (card?.id && !/^(ll|sa|bl|l1|sl|ucl)/.test(card.id)) {
    return <PlayerPhoto id={card.id} name={name} size="lg" />;
  }
  if (card?.photo) {
    return <UclImage src={card.photo} fallback={playerFaceUrl(name)} alt={name} shape="circle" className="h-20 w-20 border border-border md:h-24 md:w-24" />;
  }
  const photoFallback = UCL_CARDS.find(
    (candidate) => normalizeFootballPlayerName(candidate.name) === normalizeFootballPlayerName(name),
  )?.photo;
  const photo = photoFallback ?? FALLBACK_PLAYER_PHOTOS[name];
  return <UclImage src={photo} fallback={playerFaceUrl(name)} alt={name} shape="circle" className="h-20 w-20 border border-border md:h-24 md:w-24" />;
}

function TransferMarketHigherLower({ comp, onBack }: { comp: Competition; onBack: () => void }) {
  const players = MARKET_VALUE_PLAYERS[comp];
  const [pair, setPair] = useState<[MarketRoundPlayer, MarketRoundPlayer] | null>(null);
  const [remaining, setRemaining] = useState<MarketValuePlayer[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [marketCleared, setMarketCleared] = useState(false);
  const [feedback, setFeedback] = useState("");

  const start = () => {
    const [first, second, ...rest] = shuffledPlayers(players);
    if (!first || !second) return;
    setPair([marketRoundPlayer(first), marketRoundPlayer(second)]);
    setRemaining(rest);
    setScore(0);
    setGameOver(false);
    setMarketCleared(false);
    setFeedback("");
  };

  const guess = (direction: "higher" | "lower") => {
    if (!pair || gameOver) return;
    const [current, challenger] = pair;
    const correct =
      current.snapshot.value === challenger.snapshot.value ||
      (direction === "higher"
        ? challenger.snapshot.value > current.snapshot.value
        : challenger.snapshot.value < current.snapshot.value);

    if (correct) {
      const [nextPlayer, ...nextRemaining] = remaining;
      if (nextPlayer) {
        setPair([challenger, marketRoundPlayer(nextPlayer)]);
        setRemaining(nextRemaining);
      } else {
        setPair([current, challenger]);
        setGameOver(true);
        setMarketCleared(true);
      }
      setScore((value) => value + 1);
      setFeedback(
        `${challenger.player.name} was valued at ${formatValue(challenger.snapshot.value)} in ${challenger.snapshot.year} — correct!`,
      );
    } else {
      setGameOver(true);
      setFeedback(
        `${challenger.player.name} was valued at ${formatValue(challenger.snapshot.value)} in ${challenger.snapshot.year}.`,
      );
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-warning/25 bg-surface/80 p-5 text-left md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow text-warning">Quick game</p>
          <h2 className="mt-2 text-3xl">Transfer Market: Higher or Lower</h2>
          <p className="mt-2 max-w-2xl text-sm text-fore-muted">
            Compare random snapshots from players’ market-value histories. Every player appears only once per game.
          </p>
        </div>
        <p className="font-mono text-lg text-warning">Streak: {score}</p>
      </div>

      {pair ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {pair.map(({ player, snapshot }, index) => {
            const reveal = index === 0 || gameOver;
            const clubBadge = CLUB_BADGES[snapshot.club];
            return (
              <article key={`${player.name}-${index}`} className="data-card flex flex-col p-5">
                <p className="section-eyebrow text-fore-muted">{index === 0 ? "Known value" : "Guess the value"}</p>
                <div className="mt-4 flex items-center gap-4">
                  <MarketPlayerPhoto comp={comp} name={player.name} />
                  <div>
                    <h3 className="text-xl font-bold md:text-2xl">{player.name}</h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-fore-muted">
                      {clubBadge && <UclImage src={clubBadge} alt={`${snapshot.club} crest`} className="h-6 w-6" />}
                      {snapshot.club}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-fore-muted">
                      <UclImage
                        src={`https://flagcdn.com/w40/${player.countryCode}.png`}
                        alt={`${player.nationality} flag`}
                        className="h-4 w-6"
                      />
                      {player.nationality}
                    </p>
                  </div>
                </div>
                <p className={`mt-5 font-display text-5xl ${reveal ? "text-primary" : "text-accent"}`}>
                  {reveal ? formatValue(snapshot.value) : "€?"}
                </p>
                <p className="mt-1 text-sm text-fore-muted">
                  {reveal ? "Market value" : "Value in"} · {snapshot.year}
                </p>
                {reveal && (
                  <>
                    <a href={player.source} target="_blank" rel="noreferrer" className="mt-3 text-xs text-primary underline">
                      View Transfermarkt value history
                    </a>
                  </>
                )}
                {index === 1 && !gameOver && (
                  <div className="mt-auto flex gap-3 pt-5">
                    <button type="button" onClick={() => guess("higher")} className="btn-primary">Higher ↑</button>
                    <button type="button" onClick={() => guess("lower")} className="btn-ghost">Lower ↓</button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-background/50 p-8 text-center">
          <p className="text-fore-muted">Can you beat your best streak using {COMPETITION_LABELS[comp]} stars?</p>
          <button type="button" onClick={start} className="btn-primary mt-5">Open the market</button>
        </div>
      )}

      {feedback && <p aria-live="polite" className="mt-4 text-sm text-foreground">{feedback}</p>}
      {marketCleared && <p className="mt-2 font-semibold text-success">You played every player without a repeat!</p>}
      {gameOver && <button type="button" onClick={start} className="btn-primary mt-4">Play again</button>}
      <p className="mt-5 text-xs leading-5 text-fore-muted">
        Historical market values are Transfermarkt estimates, not transfer fees. A new random year/value snapshot is selected for each player when a game starts.
      </p>
      <button type="button" onClick={onBack} className="btn-ghost mt-4">← All game modes</button>
    </div>
  );
}

export default function CompetitionMiniGames({
  comp,
  mode,
  onBack,
}: {
  comp: Competition;
  mode: MiniGameMode;
  onBack: () => void;
}) {
  if (mode === "higher-lower") return <HigherLower comp={comp} onBack={onBack} />;
  return <TransferMarketHigherLower comp={comp} onBack={onBack} />;
}
