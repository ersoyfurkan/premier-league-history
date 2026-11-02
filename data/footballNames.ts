export function normalizeFootballPlayerName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

const awardAliases: Record<string, string> = {
  ronaldonazario: "ronaldo", neymarjr: "neymar", alissonbecker: "alisson", xavihernandez: "xavi",
  danielcarvajal: "danicarvajal", andrewcole: "andycole", papugomez: "alejandrogomez",
  vinicius: "viniciusjunior", viniciusjr: "viniciusjunior",
  heungminson: "sonheungmin", gleisonbremer: "bremer",
};

export function awardPlayerKey(name: string) {
  const key = normalizeFootballPlayerName(name);
  return awardAliases[key] ?? key;
}
