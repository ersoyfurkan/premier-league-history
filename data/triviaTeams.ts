import { DUEL_CLUBS } from "@/data/clubDuel";
import { nationMentions } from "@/data/nationVisuals";

const normal = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const mentions = (text: string, name: string) =>
  new RegExp(`\\b${normal(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text);

export function triviaClueTeams(clue: { noun: string; short: string }) {
  const text = normal(`${clue.noun} ${clue.short}`);
  const clubs = DUEL_CLUBS.general.filter((club) => {
    const aliases = [club.label, ...(club.key === "psg" ? ["PSG", "Paris Saint-Germain", "Paris Saint Germain"] : []),
      ...(club.key === "bar" ? ["Barca"] : []), ...(club.key === "dor" ? ["Borussia Dortmund"] : [])];
    return aliases.some((label) => mentions(text, label));
  });
  const nations = nationMentions(text, true);
  return {
    clubs, nations,
    keys: [...new Set([...clubs.map((club) => `club:${club.key}`), ...nations.map((nation) => `nation:${nation.name}`)])],
  };
}
