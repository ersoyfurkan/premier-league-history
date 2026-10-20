const CLUBS_WITH_LOGOS = new Set([
  "man-city",
  "man-utd",
  "arsenal",
  "chelsea",
  "liverpool",
  "tottenham",
  "aston-villa",
  "newcastle",
  "leicester",
  "everton",
  "brighton",
  "brentford",
  "fulham",
  "west-ham",
  "crystal-palace",
  "nottingham-forest",
  "wolverhampton",
  "blackburn",
  "southampton",
  "ipswich-town",
]);

export function getClubLogo(clubId: string): string | null {
  return CLUBS_WITH_LOGOS.has(clubId) ? `/club-logos/${clubId}.png` : null;
}
