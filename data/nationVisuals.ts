import { NATION_INFO } from "@/data/nations";
import crestData from "@/data/nationCrests.generated.json";

export type NationVisual = { name: string; src: string };
export type NationMention = NationVisual & { start: number; end: number };

const extraNations: Record<string, [string, string]> = {
  bol: ["Bolivia", "bo"], ven: ["Venezuela", "ve"], hon: ["Honduras", "hn"],
  nir: ["Northern Ireland", "gb-nir"], rsa: ["South Africa", "za"], nzl: ["New Zealand", "nz"],
  chn: ["China", "cn"], prk: ["North Korea", "kp"], irn: ["Iran", "ir"], irq: ["Iraq", "iq"],
  isr: ["Israel", "il"], ksa: ["Saudi Arabia", "sa"], qat: ["Qatar", "qa"],
  uae: ["United Arab Emirates", "ae"], uzb: ["Uzbekistan", "uz"], jor: ["Jordan", "jo"],
  kuw: ["Kuwait", "kw"], idn: ["Indonesia", "id"], ang: ["Angola", "ao"], tog: ["Togo", "tg"],
  cpv: ["Cape Verde", "cv"], cuw: ["Cura\u00e7ao", "cw"], cub: ["Cuba", "cu"], hai: ["Haiti", "ht"],
  slv: ["El Salvador", "sv"], pan: ["Panama", "pa"], tri: ["Trinidad and Tobago", "tt"],
  lva: ["Latvia", "lv"], blr: ["Belarus", "by"], ltu: ["Lithuania", "lt"], mne: ["Montenegro", "me"],
  arm: ["Armenia", "am"], aze: ["Azerbaijan", "az"], cyp: ["Cyprus", "cy"], lux: ["Luxembourg", "lu"],
  mlt: ["Malta", "mt"], mda: ["Moldova", "md"], fro: ["Faroe Islands", "fo"],
  gui: ["Guinea", "gn"],
};

const adjectives: Record<string, string[]> = {
  eng: ["English"], por: ["Portuguese"], wal: ["Welsh"], fra: ["French"], ned: ["Dutch"],
  irl: ["Irish"], egy: ["Egyptian"], sen: ["Senegalese"], uru: ["Uruguayan"], fin: ["Finnish"],
  bra: ["Brazilian"], gab: ["Gabonese"], ger: ["German"], kor: ["South Korean"], bel: ["Belgian"],
  aus: ["Australian"], usa: ["American"], sco: ["Scottish"], isl: ["Icelandic"], swe: ["Swedish"],
  arg: ["Argentine", "Argentinian"], jam: ["Jamaican"], ita: ["Italian"], alg: ["Algerian"],
  den: ["Danish"], nga: ["Nigerian"], bul: ["Bulgarian"], nor: ["Norwegian"], srb: ["Serbian"],
  civ: ["Ivorian"], cze: ["Czech"], cro: ["Croatian"], aut: ["Austrian"], cmr: ["Cameroonian"],
  pol: ["Polish"], chi: ["Chilean"], mar: ["Moroccan"], gha: ["Ghanaian"], svn: ["Slovenian"],
  mex: ["Mexican"], mli: ["Malian"], tur: ["Turkish"], bih: ["Bosnian"], ukr: ["Ukrainian"],
  col: ["Colombian"], svk: ["Slovak", "Slovakian"], geo: ["Georgian"], rou: ["Romanian"],
  jpn: ["Japanese"], sui: ["Swiss"], est: ["Estonian"], par: ["Paraguayan"], hun: ["Hungarian"],
  tun: ["Tunisian"], alb: ["Albanian"], per: ["Peruvian"], can: ["Canadian"], rus: ["Russian"],
  ecu: ["Ecuadorian"], kos: ["Kosovan", "Kosovar"], cod: ["Congolese"], gre: ["Greek"],
  crc: ["Costa Rican"], mkd: ["Macedonian", "North Macedonian"], esp: ["Spanish"],
  bol: ["Bolivian"], ven: ["Venezuelan"], hon: ["Honduran"], nir: ["Northern Irish"],
  rsa: ["South African"], nzl: ["New Zealander"], chn: ["Chinese"], prk: ["North Korean"],
  irn: ["Iranian"], irq: ["Iraqi"], isr: ["Israeli"], ksa: ["Saudi", "Saudi Arabian"], qat: ["Qatari"],
  uae: ["Emirati"], uzb: ["Uzbek"], jor: ["Jordanian"], kuw: ["Kuwaiti"], idn: ["Indonesian"],
  ang: ["Angolan"], tog: ["Togolese"], cpv: ["Cape Verdean"], cuw: ["Curacaoan"],
  cub: ["Cuban"], hai: ["Haitian"], slv: ["Salvadoran"], pan: ["Panamanian"], tri: ["Trinidadian"],
  lva: ["Latvian"], blr: ["Belarusian"], ltu: ["Lithuanian"], mne: ["Montenegrin"],
  arm: ["Armenian"], aze: ["Azerbaijani"], cyp: ["Cypriot"], lux: ["Luxembourgish"],
  mlt: ["Maltese"], mda: ["Moldovan"], fro: ["Faroese"],
  gui: ["Guinean"],
};

const aliases: Record<string, string[]> = {
  usa: ["USA", "U.S.A.", "US", "United States of America"], cze: ["Czechia"],
  civ: ["Cote d'Ivoire", "C\u00f4te d'Ivoire", "C\u00f4te d\u2019Ivoire"],
  bih: ["Bosnia", "Bosnia-Herzegovina", "Bosnia & Herzegovina"],
  tur: ["Turkiye", "T\u00fcrkiye"], irl: ["Ireland"], kor: ["Korea Republic", "Korea, South"],
  prk: ["Korea DPR"], cod: ["Congo DR", "Congo, Democratic Republic of the"],
  cpv: ["Cabo Verde"], cuw: ["Curacao"], ned: ["Holland"],
};

const key = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const byIdentifier = new Map<string, NationVisual>();
const byName = new Map<string, NationVisual>();
const byClue = new Map<string, NationVisual>();
const crests: Record<string, { src: string; source: string }> = crestData.crests;

function crestFor(name: string): string {
  const crest = crests[name];
  if (!crest) throw new Error(`Missing national team crest: ${name}`);
  return crest.src;
}

function register(code: string, visual: NationVisual, names: string[], clueNames: string[] = []) {
  byIdentifier.set(key(code), visual);
  for (const name of names) {
    byName.set(key(name), visual);
    byClue.set(key(name), visual);
    byIdentifier.set(key(name), visual);
  }
  for (const adjective of clueNames) byClue.set(key(adjective), visual);
}

for (const [code, [name, iso]] of Object.entries({ ...NATION_INFO, ...extraNations })) {
  const visual = { name, src: crestFor(name) };
  register(code, visual, [name, ...(aliases[code] ?? [])], adjectives[code]);
  byIdentifier.set(iso, visual);
}

// Keep historical national teams distinct from their present-day successors.
for (const [code, name] of [
  ["urs", "Soviet Union"],
  ["tch", "Czechoslovakia"],
  ["yug", "Yugoslavia"],
  ["fr-yug", "FR Yugoslavia"],
  ["gdr", "East Germany"],
  ["frg", "West Germany"],
  ["scg", "Serbia and Montenegro"],
] as const) {
  register(code, { name, src: crestFor(name) }, [name, ...(code === "urs" ? ["USSR"] : [])]);
}
const patternFor = (names: Map<string, NationVisual>) =>
  new RegExp(`(?<![\\p{L}\\p{N}])(?:${[...names.keys()].sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![\\p{L}\\p{N}])`, "gu");
const namePattern = patternFor(byName);
const cluePattern = patternFor(byClue);

export function nationLogoSrc(identifier: string): string {
  const visual = byIdentifier.get(key(identifier));
  if (!visual) throw new Error(`Unknown nation visual: ${identifier}`);
  return visual.src;
}

export function nationMentions(text: string, includeAdjectives = false): NationMention[] {
  const names = includeAdjectives ? byClue : byName;
  const pattern = includeAdjectives ? cluePattern : namePattern;
  // Normalize one code point at a time so accents do not change the original text offsets.
  const offsets: number[] = [];
  let normalized = "";
  let offset = 0;
  for (const character of text) {
    const part = key(character);
    for (let index = 0; index < part.length; index += 1) offsets.push(offset);
    normalized += part;
    offset += character.length;
  }
  offsets.push(text.length);
  return [...normalized.matchAll(pattern)]
    .filter((match) => match[0] !== "american" || !/\b(south|north|central|latin)\s+$/.test(normalized.slice(0, match.index)))
    .map((match) => ({
      ...names.get(match[0])!,
      start: offsets[match.index],
      end: offsets[match.index + match[0].length],
    }));
}
