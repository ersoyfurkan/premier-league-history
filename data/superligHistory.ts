export type SuperligSeason = { season: string; champion: string; runnerUp: string; thirdPlace: string; topScorer: string; goals: number };
export type SuperligAllTimeEntry = { club: string; seasons: number; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number; titles: number };

const winners = `1959|Fenerbahçe
1959-60|Beşiktaş
1960-61|Fenerbahçe
1961-62|Galatasaray
1962-63|Galatasaray
1963-64|Fenerbahçe
1964-65|Fenerbahçe
1965-66|Beşiktaş
1966-67|Beşiktaş
1967-68|Fenerbahçe
1968-69|Galatasaray
1969-70|Fenerbahçe
1970-71|Galatasaray
1971-72|Galatasaray
1972-73|Galatasaray
1973-74|Fenerbahçe
1974-75|Fenerbahçe
1975-76|Trabzonspor
1976-77|Trabzonspor
1977-78|Fenerbahçe
1978-79|Trabzonspor
1979-80|Trabzonspor
1980-81|Trabzonspor
1981-82|Beşiktaş
1982-83|Fenerbahçe
1983-84|Trabzonspor
1984-85|Fenerbahçe
1985-86|Beşiktaş
1986-87|Galatasaray
1987-88|Galatasaray
1988-89|Fenerbahçe
1989-90|Beşiktaş
1990-91|Beşiktaş
1991-92|Beşiktaş
1992-93|Galatasaray
1993-94|Galatasaray
1994-95|Beşiktaş
1995-96|Fenerbahçe
1996-97|Galatasaray
1997-98|Galatasaray
1998-99|Galatasaray
1999-00|Galatasaray
2000-01|Fenerbahçe
2001-02|Galatasaray
2002-03|Beşiktaş
2003-04|Fenerbahçe
2004-05|Fenerbahçe
2005-06|Galatasaray
2006-07|Fenerbahçe
2007-08|Galatasaray
2008-09|Beşiktaş
2009-10|Bursaspor
2010-11|Fenerbahçe
2011-12|Galatasaray
2012-13|Galatasaray
2013-14|Fenerbahçe
2014-15|Galatasaray
2015-16|Beşiktaş
2016-17|Beşiktaş
2017-18|Galatasaray
2018-19|Galatasaray
2019-20|İstanbul Başakşehir
2020-21|Beşiktaş
2021-22|Trabzonspor
2022-23|Galatasaray
2023-24|Galatasaray
2024-25|Galatasaray
2025-26|Galatasaray`;
export const superligSeasons: SuperligSeason[] = winners.split("\n").map((line) => {
  const [season, champion] = line.split("|");
  const verified = season === "2025-26" ? { runnerUp: "Fenerbahçe", thirdPlace: "Trabzonspor", topScorer: "Eldor Shomurodov / Paul Onuachu", goals: 22 } : season === "2024-25" ? { runnerUp: "Fenerbahçe", thirdPlace: "Samsunspor", topScorer: "Victor Osimhen", goals: 26 } : season === "2023-24" ? { runnerUp: "Fenerbahçe", thirdPlace: "Trabzonspor", topScorer: "Mauro Icardi", goals: 25 } : season === "2022-23" ? { runnerUp: "Fenerbahçe", thirdPlace: "Beşiktaş", topScorer: "Enner Valencia", goals: 29 } : { runnerUp: "", thirdPlace: "", topScorer: "", goals: 0 };
  return { season, champion, ...verified };
});

// The cumulative table is deliberately limited to entries with cross-checked totals; season counts and match totals require a single consistent end-of-season source.
export const superligAllTime: SuperligAllTimeEntry[] = [
  { club: "Fenerbahçe", seasons: 68, played: 2276, won: 1314, drawn: 586, lost: 376, goalsFor: 4135, goalsAgainst: 2023, points: 4528, titles: 19 },
  { club: "Galatasaray", seasons: 68, played: 2276, won: 1316, drawn: 555, lost: 405, goalsFor: 4089, goalsAgainst: 2005, points: 4503, titles: 26 },
  { club: "Beşiktaş", seasons: 68, played: 2273, won: 1226, drawn: 615, lost: 432, goalsFor: 3740, goalsAgainst: 1997, points: 4293, titles: 16 },
  { club: "Trabzonspor", seasons: 52, played: 1765, won: 882, drawn: 477, lost: 406, goalsFor: 2767, goalsAgainst: 1762, points: 3123, titles: 7 },
];

