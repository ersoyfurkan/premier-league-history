// Client-safe image helpers (lib/espn.ts pulls in server-only fetch caching)
export const espnBadge = (teamId: string) => `https://a.espncdn.com/i/teamlogos/soccer/500/${teamId}.png`;
export const espnHeadshot = (athleteId: string) => `https://a.espncdn.com/i/headshots/soccer/players/full/${athleteId}.png`;
