import { triviaClueTeams } from "@/data/triviaTeams";
import { playerFaceUrl } from "@/data/playerFaces";
import { FOOTBALL_KNOWLEDGE_GROUPS, MODERN_SQUADS } from "@/data/footballKnowledge";
import type { BoardTile } from "@/data/triviaPath";
import { AWARD_GROUPS, awardsInText, individualAward } from "@/data/individualAwards";

export type TriviaIcon = "ball" | "boot" | "trophy" | "stadium" | "glove" | "players" | "manager" | "award" | "cards" | "question";
export type TriviaVisual =
  | { kind: "image"; src: string; label: string; fallback?: string }
  | { kind: "icon"; icon: TriviaIcon; label: string }
  | { kind: "badge"; text: string; label: string };

const icon = (name: TriviaIcon, label: string): TriviaVisual => ({ kind: "icon", icon: name, label });
const badge = (text: string, label = text): TriviaVisual => ({ kind: "badge", text, label });
const image = (src: string, label: string, fallback?: string): TriviaVisual => ({ kind: "image", src, label, ...(fallback ? { fallback } : {}) });
// Wikimedia Commons portraits from the managers' public biography infoboxes.
const MANAGER_PORTRAITS: Record<string, [string, string]> = {
  klopp: ["6/6e", "2022-07-21_Fu%C3%9Fball%2C_M%C3%A4nner%2CFreundschaftsspiel%2C_RB_Leipzig_-_FC_Liverpool_1DX_2243_by_Stepro_%28cropped%29_%28cropped%29.jpg"],
  tuchel: ["5/57", "Thomas_Tuchel_England_v_Ghana_23_June_2026-081.jpg"],
  mourinho: ["e/e1", "Jos%C3%A9_Mourinho_20250206_%281%29.jpg"],
  ancelotti: ["b/b3", "Carlo_Ancelotti_Brazil_V_Morocco_13_June_2026-47.jpg"],
  zidane: ["f/f3", "Zinedine_Zidane_by_Tasnim_03.jpg"],
  luisenrique: ["f/f3", "Luis_Enrique_2014.jpg"],
  ferguson: ["1/14", "Alex_Ferguson.jpg"],
  wenger: ["8/87", "25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Ars%C3%A8ne_Wenger_-_240422_192850_%28cropped%29.jpg"],
  flick: ["0/04", "2022_Hansi_Flick_%28cropped%29.jpg"],
  pochettino: ["0/04", "Mauricio_Pochettino_USMNT_v_Belgium_Mar_28_2026-2.jpg"],
  allegri: ["9/90", "Incontro_con_le_squadre_finaliste_della_Coppa_Italia_di_calcio_Frecciarossa_Atalanta_-_Juventus_01_-_Massimiliano_Allegri_%28cropped%29.jpg"],
  conte: ["c/c6", "20150616_Antonio_Conte.jpg"],
  simeone: ["9/9b", "25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Diego_Simeone_-_240422_192621-2_%28cropped%29.jpg"],
};
const LEAGUES = [
  ["Premier League", 23], ["La Liga", 15], ["Serie A", 12], ["Bundesliga", 10], ["Ligue 1", 9],
  ["Champions League", 2], ["World Cup", 4], ["European Championship", 74], ["Copa America", 83],
] as const;
const normal = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function triviaTileVisuals(tile: BoardTile): TriviaVisual[] {
  const text = normal(`${tile.noun} ${tile.short}`);
  const visuals: TriviaVisual[] = [];
  const add = (visual: TriviaVisual) => {
    if (!visuals.some((existing) => JSON.stringify(existing) === JSON.stringify(visual))) visuals.push(visual);
  };
  const awardGroup = AWARD_GROUPS.find((group) => group.id === tile.id);
  const awards = awardGroup ? awardGroup.awardIds.map(individualAward) : awardsInText(`${tile.noun} ${tile.short}`);
  for (const award of awards.slice(0, 3)) add(image(award.src, award.label, award.fallback));
  if (awards.length > 3) add(badge(`+${awards.length - 3}`, `${awards.length} eligible awards; full list in the active question`));
  if (awardGroup?.awardOperator === "OR") add(badge("OR", "Win any one of these awards"));
  if (awardGroup?.operator === "AND") add(badge("+", "Match every condition"));
  const relation = FOOTBALL_KNOWLEDGE_GROUPS.find((group) => tile.id === `s-knowledge-${group.id}` || group.id === awardGroup?.relationId);
  const squad = MODERN_SQUADS.find((squad) => relation?.id.includes(squad.id));
  if (squad && /teammate|manager/.test(relation?.id ?? "")) {
    const person = relation?.id.startsWith("manager-") ? squad.manager : squad.anchors.find((anchor) => relation?.label.includes(anchor));
    if (person) {
      const portrait = relation?.id.startsWith("manager-") ? MANAGER_PORTRAITS[squad.managerKey] : undefined;
      const src = portrait ? `https://upload.wikimedia.org/wikipedia/commons/thumb/${portrait[0]}/${portrait[1]}/250px-${portrait[1]}` : playerFaceUrl(person);
      add(src ? image(src, person) : icon("manager", person));
    }
    const season = squad.id === "che2021" ? "01-05/21" : squad.id === "bay1920" ? "11/19-08/20" : squad.season;
    add(badge(season, "Club season"));
  }
  const teams = triviaClueTeams(tile);
  for (const club of teams.clubs) {
    if (club.badge) add(image(club.badge, club.label));
  }
  for (const nation of teams.nations) add(image(nation.src, nation.name));
  for (const [name, id] of LEAGUES) {
    if (awards.length <= 3 && text.includes(normal(name))) add(image(`https://a.espncdn.com/i/leaguelogos/soccer/500/${id}.png`, name));
  }
  if (/stadium|ground|venue/.test(text)) add(icon("stadium", "Stadiums"));
  if (/assist/.test(text)) add(icon("boot", "Assists"));
  if (!awardGroup && /goal(?!keeper)|scor/.test(text)) add(icon("ball", "Goals"));
  if (!awardGroup && /goalkeeper|saves|penalt.*sav/.test(text)) add(icon("glove", "Goalkeepers / saves"));
  if (/red card|sending|sent off/.test(text)) add(icon("cards", "Red cards"));
  if (/ballon|golden ball|yashin|kopa trophy|award/.test(text)) { if (!awards.length) add(icon("award", "Individual award")); }
  else if (/won|winner|champion|title|troph/.test(text)) add(icon("trophy", "Trophy winners"));
  if (/teammate/.test(text)) add(icon("players", "Teammates"));
  if (!awardGroup && /appearances/.test(text)) add(icon("players", "Appearances"));
  if (/managed|manager|coach/.test(text) && !visuals.some((visual) => visual.kind === "icon" && visual.icon === "manager")) add(icon("manager", "Manager"));
  const times = text.match(/(?:at least |won .*?)(\d+) times|(\d+)\+? (?:champions league |world cup )?titles/);
  const wordTimes = text.match(/(?:at least )?(three|four|five|six|two) times/);
  const numbers: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, six: 6 };
  if (times) add(badge(`${times[1] ?? times[2]}x`, "Title count"));
  else if (wordTimes) add(badge(`${numbers[wordTimes[1]]}x`, "Title count"));
  for (const threshold of text.matchAll(/(?:at least |scored |provided |recorded |made )?(\d+)(?:\+| or more| goals| assists| appearances| penalty saves)/g)) {
    add(badge(`${threshold[1]}+`, "Stat threshold"));
  }
  const years = [...text.matchAll(/\b(?:19|20)\d{2}(?:\/\d{2})?\b/g)].map((match) => match[0]);
  if (years.length && !squad) add(badge([...new Set(years)].slice(0, 2).join("-"), "Reference years"));
  if (!visuals.some((visual) => visual.kind === "image")) {
    for (const src of tile.logos) add(image(src, "Competition"));
  }
  if (!visuals.length) add(icon("players", "Football players"));
  return visuals;
}

export function triviaBoardPresentation(tiles: BoardTile[], finalRevealed: boolean) {
  return tiles.map((tile, index) => {
    const hidden = index === tiles.length - 1 && !finalRevealed;
    return { hidden, visuals: hidden ? [] : triviaTileVisuals(tile) };
  });
}
