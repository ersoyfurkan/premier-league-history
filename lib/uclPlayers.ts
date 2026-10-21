import type { UclStat } from "@/data/championsLeague";

export type UclPlayer = {
  name: string;
  club: string;
  clubId: string;
  photo: string;
  goals: number;
  assists: number;
  appearances: number;
};

type RawDataset = {
  teams: Record<string, string>;
  players: [string, string, string, number, number, number][];
};

const PHOTO_PREFIX = "https://img.uefa.com/imgml/TP/players/1/";
const LOGO_PREFIX = "https://img.uefa.com/imgml/TP/teams/logos/70x70/";

export const clubLogoUrl = (clubId: string) => (/^\d+$/.test(clubId) ? `${LOGO_PREFIX}${clubId}.png` : undefined);

let cache: Promise<UclPlayer[]> | null = null;

export function loadUclPlayers(): Promise<UclPlayer[]> {
  if (!cache) {
    cache = fetch("/ucl/players.json")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load Champions League player data.");
        return response.json() as Promise<RawDataset>;
      })
      .then((data) =>
        data.players.map(([name, clubId, photo, goals, assists, appearances]) => ({
          name,
          clubId,
          club: data.teams[clubId] ?? "",
          photo: !photo ? "" : photo.startsWith("http") ? photo : `${PHOTO_PREFIX}${photo}`,
          goals,
          assists,
          appearances,
        })),
      )
      .catch((error) => {
        cache = null;
        throw error;
      });
  }
  return cache;
}

export const statValue = (player: UclPlayer, stat: UclStat) => player[stat];

export function rankPlayers(players: UclPlayer[], stat: UclStat) {
  const sorted = players
    .filter((player) => player[stat] > 0)
    .sort((a, b) => b[stat] - a[stat] || a.name.localeCompare(b.name));
  let rank = 0;
  return sorted.map((player, index) => {
    if (index === 0 || player[stat] !== sorted[index - 1][stat]) rank = index + 1;
    return { player, rank };
  });
}
