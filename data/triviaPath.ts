import type { Competition } from "@/lib/gameRoom";
import { normalizeFootballPlayerName } from "@/data/footballTicTacToe";
import { DUEL_CLUBS, playersForBoth, playersForClub } from "@/data/clubDuel";

export type TriviaEntry = { name: string; aliases: string[] };
export type TriviaQuestion = { id: string; text: string; count: number; entries: TriviaEntry[] };

type Category = { id: string; noun: string; plural: string; entries: TriviaEntry[] };

const WORDS = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX"];
const e = (name: string, ...aliases: string[]): TriviaEntry => ({ name, aliases });
const list = (raw: string): TriviaEntry[] =>
  raw.split("|").map((item) => {
    const [name, ...aliases] = item.split("/");
    return e(name.trim(), ...aliases.map((a) => a.trim()));
  });

const BALLON = list(
  "Lionel Messi|Cristiano Ronaldo|Luka Modrić/Modric|Karim Benzema|Rodri|Ousmane Dembélé/Dembele|Kaká/Kaka|Ronaldinho|Fabio Cannavaro/Cannavaro|Zinedine Zidane/Zidane|Rivaldo|Michael Owen/Owen|Pavel Nedvěd/Nedved|Andriy Shevchenko/Shevchenko|Luís Figo/Luis Figo/Figo|George Weah/Weah|Hristo Stoichkov/Stoichkov|Roberto Baggio/Baggio|Johan Cruyff/Cruyff|Marco van Basten/Van Basten|Michel Platini/Platini|Franz Beckenbauer/Beckenbauer|George Best|Bobby Charlton|Ronaldo Nazário/Ronaldo|Lothar Matthäus/Matthaus|Kevin Keegan|Gerd Müller/Gerd Muller|Ruud Gullit/Gullit|Matthias Sammer/Sammer|Eusébio/Eusebio|Stanley Matthews",
);
const WC_NATIONS = list(
  "Brazil|Germany/West Germany|Italy|Argentina|France|Uruguay|England|Spain",
);
const CL_WINNERS = list(
  "Real Madrid|AC Milan/Milan|Liverpool|Bayern Munich/Bayern|Barcelona|Ajax|Inter Milan/Inter/Internazionale|Manchester United/Man United/Man Utd|Juventus|Benfica|Chelsea|Nottingham Forest/Forest|Porto|Celtic|Hamburg|Steaua Bucharest/Steaua|Marseille|Borussia Dortmund/Dortmund|Feyenoord|Aston Villa|PSV Eindhoven/PSV|Red Star Belgrade/Red Star|Manchester City/Man City|Paris Saint-Germain/PSG",
);
const PL_WINNING_MANAGERS = list(
  "Alex Ferguson/Ferguson|Arsène Wenger/Arsene Wenger/Wenger|José Mourinho/Jose Mourinho/Mourinho|Carlo Ancelotti/Ancelotti|Manuel Pellegrini/Pellegrini|Claudio Ranieri/Ranieri|Antonio Conte/Conte|Pep Guardiola/Guardiola|Jürgen Klopp/Jurgen Klopp/Klopp|Kenny Dalglish/Dalglish|Arne Slot/Slot|Roberto Mancini/Mancini",
);
const SCOTTISH_STADIUMS = list(
  "Celtic Park|Ibrox|Hampden Park/Hampden|Pittodrie|Tynecastle|Easter Road|Tannadice|Dens Park|Rugby Park|Fir Park|McDiarmid Park|Almondvale",
);
const PL_STADIUMS = list(
  "Emirates Stadium/Emirates|Villa Park|Vitality Stadium/Dean Court|Gtech Community Stadium/Gtech|Amex Stadium/Amex|Turf Moor|Stamford Bridge|Selhurst Park|Goodison Park/Goodison|Craven Cottage|Elland Road|Anfield|Etihad Stadium/Etihad|Old Trafford|St James' Park/St James Park|City Ground|Stadium of Light|Tottenham Hotspur Stadium/White Hart Lane|London Stadium|Molineux",
);
const LL_STADIUMS = list(
  "Santiago Bernabéu/Santiago Bernabeu/Bernabeu|Camp Nou/Spotify Camp Nou|Metropolitano/Riyadh Air Metropolitano|Mestalla|San Mamés/San Mames|Benito Villamarín/Benito Villamarin|Ramón Sánchez-Pizjuán/Sanchez Pizjuan|Reale Arena/Anoeta|Balaídos/Balaidos|Mendizorroza|Coliseum/Coliseum Alfonso Pérez|La Cerámica/La Ceramica|Montilivi|Son Moix|Ciutat de València/Ciutat de Valencia|Municipal de Butarque|Carlos Tartiere|Nuevo Mirandilla|Martínez Valero/Martinez Valero|Sadar/El Sadar|Estadio de Vallecas/Vallecas",
);
const SA_STADIUMS = list(
  "San Siro/Giuseppe Meazza|Allianz Stadium|Stadio Olimpico/Olimpico|Diego Armando Maradona/Stadio Maradona/San Paolo|Gewiss Stadium/Atleti Azzurri d'Italia|Stadio Artemio Franchi/Artemio Franchi|Stadio Renato Dall'Ara/Dall'Ara|Stadio Olimpico Grande Torino/Olimpico Grande Torino|Marcantonio Bentegodi/Bentegodi|Luigi Ferraris|Stadio Friuli/Dacia Arena/Bluenergy Stadium|Via del Mare|Mapei Stadium/Citta del Tricolore|Unipol Domus/Sant'Elia|Stadio Ennio Tardini/Tardini|Giovanni Zini/Zini|Arechi|Stadio Penzo/Penzo",
);
const UCL_STADIUMS = list(
  "Old Trafford|Anfield|Santiago Bernabéu/Santiago Bernabeu/Bernabeu|Camp Nou|San Siro|Allianz Arena|Signal Iduna Park/Westfalenstadion|Parc des Princes|Johan Cruyff Arena/Amsterdam Arena|Estádio da Luz/Estadio da Luz|Estádio do Dragão/Estadio do Dragao/Dragao|Celtic Park|Juventus Stadium/Allianz Stadium|Stamford Bridge|Etihad Stadium/Etihad|Emirates Stadium/Emirates|Wembley|Metropolitano|Stade Vélodrome/Velodrome|De Kuip|Philips Stadion|Ali Sami Yen/Rams Park|Maksimir|Ernst Happel|Olympiastadion",
);

const STATIC: Record<Competition, Category[]> = {
  pl: [
    { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
    { id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS },
    { id: "s-plmgr", noun: "manager who has won the Premier League", plural: "managers who have won the Premier League", entries: PL_WINNING_MANAGERS },
    { id: "s-plstad", noun: "stadium of a current Premier League club", plural: "stadiums of current Premier League clubs", entries: PL_STADIUMS },
    { id: "s-scotstad", noun: "Scottish football stadium", plural: "Scottish football stadiums", entries: SCOTTISH_STADIUMS },
    { id: "s-clwin", noun: "club that has won the Champions League", plural: "clubs that have won the Champions League", entries: CL_WINNERS },
  ],
  laliga: [
    { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
    { id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS },
    { id: "s-llstad", noun: "stadium of a current La Liga club", plural: "stadiums of current La Liga clubs", entries: LL_STADIUMS },
    { id: "s-clwin", noun: "club that has won the Champions League", plural: "clubs that have won the Champions League", entries: CL_WINNERS },
  ],
  seriea: [
    { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
    { id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS },
    { id: "s-sastad", noun: "stadium of a current Serie A club", plural: "stadiums of current Serie A clubs", entries: SA_STADIUMS },
    { id: "s-clwin", noun: "club that has won the Champions League", plural: "clubs that have won the Champions League", entries: CL_WINNERS },
  ],
  ucl: [
    { id: "s-ballon", noun: "Ballon d'Or winner", plural: "Ballon d'Or winners", entries: BALLON },
    { id: "s-wc", noun: "nation that has won the World Cup", plural: "nations that have won the World Cup", entries: WC_NATIONS },
    { id: "s-uclstad", noun: "stadium that has hosted Champions League football", plural: "stadiums that have hosted Champions League football", entries: UCL_STADIUMS },
    { id: "s-clwin", noun: "club that has won the Champions League", plural: "clubs that have won the Champions League", entries: CL_WINNERS },
  ],
};

const CLUB_ALIASES: Record<string, string[]> = {
  mun: ["Man United", "Man Utd", "Manchester Utd"],
  mci: ["Man City"],
  tot: ["Spurs", "Tottenham Hotspur"],
  wol: ["Wolverhampton", "Wolverhampton Wanderers"],
  new: ["Newcastle United"],
  nfo: ["Forest", "Notts Forest"],
  wham: ["West Ham United"],
  bha: ["Brighton and Hove Albion", "Brighton & Hove Albion"],
  atm: ["Atletico Madrid", "Atletico"],
  ath: ["Athletic Bilbao", "Bilbao"],
  inter: ["Inter Milan", "Internazionale"],
  mil: ["Milan"],
  psg: ["Paris Saint-Germain", "Paris"],
  bay: ["Bayern Munich", "Bayern"],
};

function leagueClubCategory(comp: Competition): Category {
  const names = { pl: "Premier League", laliga: "La Liga", seriea: "Serie A", ucl: "Champions League" }[comp];
  return {
    id: "s-clubs",
    noun: `club in the ${names} this season`,
    plural: `clubs in the ${names} this season`,
    entries: DUEL_CLUBS[comp].map((club) => e(club.label, ...(CLUB_ALIASES[club.key] ?? []))),
  };
}

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const playerEntries = (names: string[]) => names.map((name) => e(name));

export function rollDice() {
  return 1 + Math.floor(Math.random() * 6);
}

export function triviaSeconds(count: number) {
  return 12 + count * 7;
}

// Picks a category whose answer pool is comfortably bigger than the number asked for.
export function pickTriviaQuestion(comp: Competition, count: number, used: Set<string>): TriviaQuestion {
  const clubs = DUEL_CLUBS[comp];
  const need = count + 3;
  const build = (id: string, category: Category): TriviaQuestion => ({
    id,
    count,
    entries: category.entries,
    text: `Name ${WORDS[count]} ${count === 1 ? category.noun : category.plural}`,
  });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const roll = Math.random();
    if (roll < 0.5) {
      const club = pick(clubs);
      const id = `c-${club.key}`;
      if (used.has(id)) continue;
      const names = playersForClub(club.key);
      if (names.length < Math.max(need, count * 3)) continue;
      return build(id, {
        id,
        noun: `player who played for ${club.label}`,
        plural: `players who played for ${club.label}`,
        entries: playerEntries(names),
      });
    }
    if (roll < 0.75) {
      const a = pick(clubs);
      const b = pick(clubs);
      if (a.key >= b.key) continue;
      const id = `p-${a.key}-${b.key}`;
      if (used.has(id)) continue;
      const names = playersForBoth(a.key, b.key);
      if (names.length < need) continue;
      return build(id, {
        id,
        noun: `player who played for both ${a.label} and ${b.label}`,
        plural: `players who played for both ${a.label} and ${b.label}`,
        entries: playerEntries(names),
      });
    }
    const statics = [...STATIC[comp], leagueClubCategory(comp)].filter(
      (category) => !used.has(category.id) && category.entries.length >= need,
    );
    if (statics.length === 0) continue;
    const category = pick(statics);
    return build(category.id, category);
  }

  const fallback = leagueClubCategory(comp);
  return build(fallback.id, fallback);
}

function distance(a: string, b: string) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return prev[b.length];
}

// Returns the matching entry for a guess, or null. Accepts full names, aliases, unique surnames and small typos.
export function matchTriviaAnswer(entries: TriviaEntry[], guess: string): TriviaEntry | null {
  const g = normalizeFootballPlayerName(guess);
  if (g.length < 3) return null;
  const forms = entries.map((entry) => ({
    entry,
    full: [entry.name, ...entry.aliases].map(normalizeFootballPlayerName),
  }));
  const exact = forms.find((form) => form.full.includes(g));
  if (exact) return exact.entry;

  if (g.length >= 4) {
    const byWord = forms.filter((form) =>
      form.full.some((full) => full.split(" ").some((word) => word === g)),
    );
    if (byWord.length === 1) return byWord[0].entry;
  }

  const tolerance = g.length >= 10 ? 2 : g.length >= 5 ? 1 : 0;
  if (tolerance === 0) return null;
  let best: TriviaEntry | null = null;
  let bestScore = tolerance + 1;
  let ties = 0;
  for (const form of forms) {
    for (const full of form.full) {
      const words = full.split(" ");
      const candidates = [full, ...(words.length > 1 ? [words[words.length - 1]] : [])];
      for (const candidate of candidates) {
        const d = distance(g, candidate);
        if (d < bestScore) {
          bestScore = d;
          best = form.entry;
          ties = 1;
        } else if (d === bestScore && best !== form.entry) {
          ties += 1;
        }
      }
    }
  }
  return best && ties === 1 ? best : null;
}
