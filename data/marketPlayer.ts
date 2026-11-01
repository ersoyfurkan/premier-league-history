export type MarketValueSnapshot = {
  value: number;
  year: number;
  club: string;
};

export type MarketValuePlayer = {
  name: string;
  nationality: string;
  countryCode: string;
  source: string;
  values: MarketValueSnapshot[];
};

const transfermarktHistory = (name: string, playerId: string) => {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://www.transfermarkt.com/${slug}/marktwertverlauf/spieler/${playerId}`;
};

export const player = (
  name: string,
  nationality: string,
  countryCode: string,
  transfermarktId: string,
  values: MarketValueSnapshot[],
): MarketValuePlayer => ({
  name,
  nationality,
  countryCode,
  source: transfermarktHistory(name, transfermarktId),
  values,
});
