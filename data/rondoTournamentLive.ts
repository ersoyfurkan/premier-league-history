import history from "@/data/tournamentHistory.generated.json";
import type { RondoClue } from "@/data/rondo";
import type { TournamentComp } from "@/lib/competitions";

type Table = { headers: string[]; rows: string[][] } | null | undefined;
type Tables = Record<string, Table>;

const TITLE: Record<TournamentComp, string> = { worldcup: "World Cup", euros: "European Championship", copa: "Copa América" };
const KEY: Record<TournamentComp, "worldcup" | "euros" | "copa"> = { worldcup: "worldcup", euros: "euros", copa: "copa" };
const GENERIC = /\b(stadium|stadion|estadio|stade|stadio|national|olympic|arena|park|ground|the|de|of)\b/gi;

const clean = (value = "") => value.replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
const noParens = (value = "") => clean(value.replace(/\([^)]*\)/g, ""));
const norm = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();

const col = (table: Table, pattern: RegExp) => table?.headers.findIndex((h) => pattern.test(h)) ?? -1;
const rows = (table: Table) => table?.rows ?? [];
const startsWithLetter = (value: string) => /^[A-Z]/.test(norm(value).toUpperCase().charAt(0));

function clue(letter: string, text: string, answers: string[]): RondoClue | null {
  const names = answers.map(clean).filter(Boolean);
  if (names.length === 0 || !/^[A-Z]$/.test(letter)) return null;
  // Skip clues that give the answer away through a distinctive word.
  const text_ = norm(text);
  const leaks = names.some((name) =>
    name.replace(GENERIC, " ").split(/[\s-]+/).some((word) => norm(word).length >= 5 && text_.includes(norm(word))),
  );
  return leaks ? null : { letter, clue: text, answers: names, contains: false };
}

const surname = (name: string) => name.split(" ").slice(-1)[0];
const person = (name: string) => (name.includes(" ") ? [name, surname(name)] : [name]);

// Builds Rondo clues from the Wikipedia-sourced tournament tables, so new editions and records appear automatically.
function liveClues(comp: TournamentComp): RondoClue[] {
  const t = (history.tournaments as unknown as Record<string, Tables>)[KEY[comp]];
  const title = TITLE[comp];
  const out: (RondoClue | null)[] = [];
  const add = (answer: string, text: string, aliases: string[] = []) => {
    const first = noParens(answer);
    if (!first || !startsWithLetter(first)) return;
    out.push(clue(norm(first).charAt(0).toUpperCase(), text, [first, ...aliases]));
  };

  const finals = t.finals;
  const iYear = col(finals, /^year/i);
  const iWin = col(finals, /^winners/i);
  const iScore = col(finals, /^score/i);
  const iLose = col(finals, /^runners/i);
  const iVenue = col(finals, /^venue/i);
  for (const row of rows(finals)) {
    const year = clean(row[iYear]);
    const winner = noParens(row[iWin]);
    const loser = noParens(row[iLose]);
    if (!/^\d{4}$/.test(year) || !winner || !loser) continue;
    const score = comp === "copa" ? "" : ` ${clean(row[iScore])}`;
    add(winner, `Won the ${year} ${title} final${score} against ${loser}`);
    add(loser, `Lost the ${year} ${title} final to ${winner}`);
    const venue = noParens(row[iVenue]);
    if (venue && !venue.includes(",")) {
      const short = venue.replace(GENERIC, " ").replace(/\s+/g, " ").trim();
      add(venue, `Venue of the ${year} ${title} final`, short && short !== venue ? [short] : []);
    }
  }

  const editions = t.editions;
  const eYear = col(editions, /^year/i);
  const eHost = col(editions, /^host/i);
  const eChamp = col(editions, /^champions/i);
  const eCoach = col(editions, /coach/i);
  const eScorer = col(editions, /(most goals|top scorer|golden boot)/i);
  for (const row of rows(editions)) {
    const year = clean(row[eYear]);
    const champion = noParens(row[eChamp]);
    if (!/^\d{4}$/.test(year) || !champion) continue;
    const coach = noParens(row[eCoach]);
    if (coach && !coach.includes(",")) {
      add(champion, `Won the ${year} ${title} under ${coach}`);
      add(coach, `Coach who led ${champion} to the ${year} ${title} title`, [surname(coach)]);
    }
    const host = noParens(row[eHost]);
    if (host && !host.includes(",") && !/ and /.test(host)) add(host, `Hosted the ${year} ${title}`);
    const scorerCell = clean(row[eScorer]);
    const match = scorerCell.match(/^([^,()]+)\s*\((\d+)\)$/);
    if (match) add(match[1].trim(), `Top scorer at the ${year} ${title} with ${match[2]} goals`, person(match[1].trim()).slice(1));
  }

  const scorers = t.scorers;
  const pPlayer = col(scorers, /^player/i);
  const pTeam = col(scorers, /^(team|country)/i);
  const pGoals = col(scorers, /^goals/i);
  const list = rows(scorers).slice(0, 40);
  for (const row of list) {
    const player = noParens(row[pPlayer]);
    const team = noParens(row[pTeam]);
    const goals = clean(row[pGoals]);
    if (!player || !team || !/^\d+$/.test(goals)) continue;
    const ambiguous = list.some((other) => other !== row && noParens(other[pTeam]) === team && clean(other[pGoals]) === goals);
    if (ambiguous) continue;
    add(player, `${team} forward with ${goals} career ${title} goals`, person(player).slice(1));
  }

  const standings = t.standings;
  const sTeam = col(standings, /^team/i);
  const top = rows(standings)[0];
  if (top) add(noParens(top[sTeam]), `Nation that tops the all-time ${title} table`);

  const seen = new Set<string>();
  return out.filter((item): item is RondoClue => {
    if (!item) return false;
    const key = `${item.letter}|${item.clue}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const RONDO_TOURNAMENT_LIVE: Record<TournamentComp, RondoClue[]> = {
  worldcup: liveClues("worldcup"),
  euros: liveClues("euros"),
  copa: liveClues("copa"),
};
