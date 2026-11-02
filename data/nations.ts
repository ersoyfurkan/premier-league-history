import type { TournamentComp } from "@/lib/competitions";

// Nation code (as used in the player facts) -> display name and flagcdn code.
export const NATION_INFO: Record<string, [string, string]> = {
  eng: ["England", "gb-eng"], por: ["Portugal", "pt"], wal: ["Wales", "gb-wls"], fra: ["France", "fr"],
  ned: ["Netherlands", "nl"], irl: ["Republic of Ireland", "ie"], egy: ["Egypt", "eg"], sen: ["Senegal", "sn"],
  uru: ["Uruguay", "uy"], fin: ["Finland", "fi"], bra: ["Brazil", "br"], gab: ["Gabon", "ga"],
  ger: ["Germany", "de"], kor: ["South Korea", "kr"], bel: ["Belgium", "be"], aus: ["Australia", "au"],
  usa: ["United States", "us"], sco: ["Scotland", "gb-sct"], isl: ["Iceland", "is"], swe: ["Sweden", "se"],
  arg: ["Argentina", "ar"], jam: ["Jamaica", "jm"], ita: ["Italy", "it"], alg: ["Algeria", "dz"],
  den: ["Denmark", "dk"], nga: ["Nigeria", "ng"], bul: ["Bulgaria", "bg"], nor: ["Norway", "no"],
  srb: ["Serbia", "rs"], civ: ["Ivory Coast", "ci"], cze: ["Czech Republic", "cz"], cro: ["Croatia", "hr"],
  aut: ["Austria", "at"], cmr: ["Cameroon", "cm"], pol: ["Poland", "pl"], chi: ["Chile", "cl"],
  mar: ["Morocco", "ma"], gha: ["Ghana", "gh"], svn: ["Slovenia", "si"], mex: ["Mexico", "mx"],
  mli: ["Mali", "ml"], tur: ["Turkey", "tr"], bih: ["Bosnia and Herzegovina", "ba"], ukr: ["Ukraine", "ua"],
  col: ["Colombia", "co"], svk: ["Slovakia", "sk"], geo: ["Georgia", "ge"], rou: ["Romania", "ro"],
  jpn: ["Japan", "jp"], sui: ["Switzerland", "ch"], est: ["Estonia", "ee"], par: ["Paraguay", "py"],
  hun: ["Hungary", "hu"], tun: ["Tunisia", "tn"], alb: ["Albania", "al"], per: ["Peru", "pe"],
  can: ["Canada", "ca"], rus: ["Russia", "ru"], ecu: ["Ecuador", "ec"], kos: ["Kosovo", "xk"],
  cod: ["DR Congo", "cd"], gre: ["Greece", "gr"], crc: ["Costa Rica", "cr"], mkd: ["North Macedonia", "mk"],
  esp: ["Spain", "es"],
};

const EUROPE = "eng por wal fra ned irl fin ger bel sco isl swe ita den bul nor srb cze cro aut pol svn bih ukr svk geo rou sui est hun alb mkd kos tur gre rus esp".split(" ");
// Copa América is CONMEBOL plus the CONCACAF guests that regularly play.
const COPA = "bra arg uru col chi par per ecu usa mex can jam crc".split(" ");

export const TOURNAMENT_NATS: Record<TournamentComp, Set<string> | null> = {
  worldcup: null, // every nation
  euros: new Set(EUROPE),
  copa: new Set(COPA),
};

export const natsAllowed = (comp: TournamentComp, nat: string[]) => {
  const set = TOURNAMENT_NATS[comp];
  return !set || nat.some((code) => set.has(code));
};

const CODE_BY_COUNTRY = new Map<string, string>([
  ...Object.entries(NATION_INFO).map(([code, [name]]) => [name.toLowerCase(), code] as [string, string]),
  ["czechia", "cze"], ["cote d'ivoire", "civ"], ["côte d'ivoire", "civ"], ["usa", "usa"], ["united states of america", "usa"],
  ["bosnia-herzegovina", "bih"], ["bosnia & herzegovina", "bih"], ["korea, south", "kor"], ["türkiye", "tur"], ["turkiye", "tur"],
  ["ireland", "irl"], ["dr congo", "cod"], ["congo dr", "cod"],
]);

export const natsAllowedByCountry = (comp: TournamentComp, country: string) => {
  const set = TOURNAMENT_NATS[comp];
  if (!set) return true;
  const code = CODE_BY_COUNTRY.get(country.trim().toLowerCase());
  return !!code && set.has(code);
};
