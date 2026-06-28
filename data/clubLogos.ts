export function getClubLogo(clubId: string): string | null {
  if (clubId === "liverpool") {
    return "/club-logos/liverpool.webp";
  }

  return null;
}