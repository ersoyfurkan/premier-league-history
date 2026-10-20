"use client";

import { useEffect, useMemo, useState } from "react";
import { clubs } from "@/data/clubs";

type FixtureStatus = "scheduled" | "played";

type Fixture = {
  id: number;
  round: number;
  home: string;
  away: string;
  venue: string;
  status: FixtureStatus;
  homeGoals?: number;
  awayGoals?: number;
};

type TeamStats = {
  id: string;
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

const liveClubIds = [
  "man-city",
  "man-utd",
  "arsenal",
  "chelsea",
  "liverpool",
  "tottenham",
  "aston-villa",
  "newcastle",
  "brighton",
  "brentford",
  "west-ham",
  "crystal-palace",
];

const clubLookup = Object.fromEntries(clubs.map((club) => [club.id, club]));

const initialFixtures: Fixture[] = [
  { id: 1, round: 12, home: "man-city", away: "chelsea", venue: "Etihad Stadium", status: "scheduled" },
  { id: 2, round: 12, home: "liverpool", away: "arsenal", venue: "Anfield", status: "scheduled" },
  { id: 3, round: 12, home: "man-utd", away: "brighton", venue: "Old Trafford", status: "scheduled" },
  { id: 4, round: 12, home: "tottenham", away: "newcastle", venue: "Tottenham Hotspur Stadium", status: "scheduled" },
  { id: 5, round: 12, home: "aston-villa", away: "west-ham", venue: "Villa Park", status: "scheduled" },
  { id: 6, round: 13, home: "brentford", away: "man-city", venue: "Gtech Community Stadium", status: "scheduled" },
  { id: 7, round: 13, home: "chelsea", away: "liverpool", venue: "Stamford Bridge", status: "scheduled" },
  { id: 8, round: 13, home: "crystal-palace", away: "man-utd", venue: "Selhurst Park", status: "scheduled" },
  { id: 9, round: 13, home: "newcastle", away: "arsenal", venue: "St James' Park", status: "scheduled" },
  { id: 10, round: 13, home: "brighton", away: "aston-villa", venue: "Amex Stadium", status: "scheduled" },
  { id: 11, round: 14, home: "west-ham", away: "liverpool", venue: "London Stadium", status: "scheduled" },
  { id: 12, round: 14, home: "arsenal", away: "chelsea", venue: "Emirates Stadium", status: "scheduled" },
  { id: 13, round: 14, home: "man-utd", away: "newcastle", venue: "Old Trafford", status: "scheduled" },
  { id: 14, round: 14, home: "brighton", away: "man-city", venue: "Amex Stadium", status: "scheduled" },
  { id: 15, round: 14, home: "tottenham", away: "crystal-palace", venue: "Tottenham Hotspur Stadium", status: "scheduled" },
];

const seededNumber = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const makeInitialStats = (): TeamStats[] =>
  liveClubIds.map((clubId) => {
    const club = clubLookup[clubId];

    return {
      id: clubId,
      name: club?.name ?? clubId,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

const getTeamStrength = (team: TeamStats) => {
  const recentWeight = Math.min(6, team.points / 3);
  return 1 + recentWeight / 8 + team.goalDifference / 18;
};

const resolveFixtureResult = (homeId: string, awayId: string, fixtureId: number, homeStats: TeamStats, awayStats: TeamStats) => {
  const homeStrength = getTeamStrength(homeStats);
  const awayStrength = getTeamStrength(awayStats);
  const homeBias = 1.18 + (homeStrength - awayStrength) * 0.7;
  const noise = seededNumber(fixtureId * 7 + homeStats.points + awayStats.points);

  const homeGoals = Math.max(
    0,
    Math.min(5, Math.round(1.2 + homeBias + noise * 1.7 - (awayStrength / 4)))
  );
  const awayGoals = Math.max(
    0,
    Math.min(5, Math.round(0.9 + (1.2 - homeBias) + seededNumber(fixtureId * 13 + 41) * 1.8 + (awayStrength / 4)))
  );

  return {
    homeGoals: Math.max(homeGoals, 0),
    awayGoals: Math.max(awayGoals, 0),
  };
};

const sortStandings = (stats: TeamStats[]) =>
  [...stats].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.name.localeCompare(b.name);
  });

export default function LiveSeasonBoard() {
  const [fixtures, setFixtures] = useState<Fixture[]>(initialFixtures);
  const [teamStats, setTeamStats] = useState<TeamStats[]>(makeInitialStats);
  const [isLive, setIsLive] = useState(true);

  const standings = useMemo(() => sortStandings(teamStats), [teamStats]);
  const nextFixture = fixtures.find((fixture) => fixture.status === "scheduled");
  const lastResults = fixtures.filter((fixture) => fixture.status === "played").slice(-5).reverse();

  const playNextFixture = () => {
    const scheduledFixture = fixtures.find((fixture) => fixture.status === "scheduled");
    if (!scheduledFixture) {
      setIsLive(false);
      return;
    }

    const homeTeam = teamStats.find((entry) => entry.id === scheduledFixture.home);
    const awayTeam = teamStats.find((entry) => entry.id === scheduledFixture.away);

    if (!homeTeam || !awayTeam) {
      return;
    }

    const result = resolveFixtureResult(scheduledFixture.home, scheduledFixture.away, scheduledFixture.id, homeTeam, awayTeam);

    const updatedStats = teamStats.map((team) => {
      if (team.id === scheduledFixture.home) {
        const newGoalsFor = team.goalsFor + result.homeGoals;
        const newGoalsAgainst = team.goalsAgainst + result.awayGoals;
        const newGoalDifference = newGoalsFor - newGoalsAgainst;

        return {
          ...team,
          played: team.played + 1,
          wins: team.wins + (result.homeGoals > result.awayGoals ? 1 : 0),
          draws: team.draws + (result.homeGoals === result.awayGoals ? 1 : 0),
          losses: team.losses + (result.homeGoals < result.awayGoals ? 1 : 0),
          goalsFor: newGoalsFor,
          goalsAgainst: newGoalsAgainst,
          goalDifference: newGoalDifference,
          points: team.points + (result.homeGoals > result.awayGoals ? 3 : result.homeGoals === result.awayGoals ? 1 : 0),
        };
      }

      if (team.id === scheduledFixture.away) {
        const newGoalsFor = team.goalsFor + result.awayGoals;
        const newGoalsAgainst = team.goalsAgainst + result.homeGoals;
        const newGoalDifference = newGoalsFor - newGoalsAgainst;

        return {
          ...team,
          played: team.played + 1,
          wins: team.wins + (result.awayGoals > result.homeGoals ? 1 : 0),
          draws: team.draws + (result.homeGoals === result.awayGoals ? 1 : 0),
          losses: team.losses + (result.awayGoals < result.homeGoals ? 1 : 0),
          goalsFor: newGoalsFor,
          goalsAgainst: newGoalsAgainst,
          goalDifference: newGoalDifference,
          points: team.points + (result.awayGoals > result.homeGoals ? 3 : result.homeGoals === result.awayGoals ? 1 : 0),
        };
      }

      return team;
    });

    setTeamStats(updatedStats);
    setFixtures((currentFixtures) =>
      currentFixtures.map((fixture) =>
        fixture.id === scheduledFixture.id
          ? {
              ...fixture,
              status: "played",
              homeGoals: result.homeGoals,
              awayGoals: result.awayGoals,
            }
          : fixture
      )
    );
  };

  useEffect(() => {
    if (!isLive) return;
    const scheduledCount = fixtures.filter((fixture) => fixture.status === "scheduled").length;
    if (scheduledCount === 0) {
      setIsLive(false);
      return;
    }

    const timer = window.setTimeout(() => {
      playNextFixture();
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [fixtures, isLive]);

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="data-card p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="section-eyebrow text-primary">Current Season</p>
            <h2 className="mt-2 text-3xl md:text-4xl">Premier League Table</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsLive((current) => !current)}
            className="rounded-full border border-primary/30 bg-primary-dim px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-primary"
          >
            {isLive ? "Pause live" : "Resume live"}
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/80 p-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fore-muted">Season state</p>
            <p className="mt-1 text-xl font-semibold">Matchday {Math.max(1, 12 + (15 - fixtures.filter((fixture) => fixture.status === "scheduled").length))}</p>
          </div>
          <button
            type="button"
            onClick={playNextFixture}
            disabled={!nextFixture || !isLive}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            {nextFixture ? "Play next match" : "Season complete"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-border bg-surface2">
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">Pos</th>
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">Club</th>
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">P</th>
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">W</th>
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">D</th>
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">L</th>
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">GF</th>
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">GA</th>
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">GD</th>
                <th className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr key={team.id} className="border-b border-border-dim text-sm">
                  <td className="px-3 py-3 font-mono text-primary">{index + 1}</td>
                  <td className="px-3 py-3 font-semibold text-foreground">{team.name}</td>
                  <td className="px-3 py-3 text-fore-muted">{team.played}</td>
                  <td className="px-3 py-3 text-fore-muted">{team.wins}</td>
                  <td className="px-3 py-3 text-fore-muted">{team.draws}</td>
                  <td className="px-3 py-3 text-fore-muted">{team.losses}</td>
                  <td className="px-3 py-3 text-fore-muted">{team.goalsFor}</td>
                  <td className="px-3 py-3 text-fore-muted">{team.goalsAgainst}</td>
                  <td className={`px-3 py-3 font-semibold ${team.goalDifference >= 0 ? "text-success" : "text-warning"}`}>
                    {team.goalDifference > 0 ? "+" : ""}
                    {team.goalDifference}
                  </td>
                  <td className="px-3 py-3 font-semibold text-primary">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="data-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="section-eyebrow text-accent">Fixture board</p>
              <h3 className="mt-2 text-3xl">Upcoming</h3>
            </div>
            <span className="pill-badge border border-border bg-surface text-fore-muted">
              {fixtures.filter((fixture) => fixture.status === "scheduled").length} left
            </span>
          </div>

          <div className="space-y-3">
            {fixtures
              .filter((fixture) => fixture.status === "scheduled")
              .slice(0, 5)
              .map((fixture) => (
                <div key={fixture.id} className="rounded-2xl border border-border bg-surface/80 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fore-muted">Round {fixture.round}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{clubLookup[fixture.home]?.name}</p>
                      <p className="font-semibold text-foreground">{clubLookup[fixture.away]?.name}</p>
                    </div>
                    <div className="text-right font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
                      {fixture.venue}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="data-card p-6">
          <p className="section-eyebrow text-warning">Latest results</p>
          <h3 className="mt-2 text-3xl">Pulse</h3>

          <div className="mt-4 space-y-3">
            {lastResults.length === 0 ? (
              <p className="text-fore-muted">No results yet. The season is about to kick off.</p>
            ) : (
              lastResults.map((fixture) => (
                <div key={fixture.id} className="rounded-2xl border border-border bg-surface/70 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fore-muted">Round {fixture.round}</p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    {clubLookup[fixture.home]?.name} {fixture.homeGoals}:{fixture.awayGoals} {clubLookup[fixture.away]?.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
