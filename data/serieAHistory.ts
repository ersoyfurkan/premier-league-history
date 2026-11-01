export type SerieASeason = { season: string; champion: string; runnerUp: string; thirdPlace: string; topScorer: string; goals: number };
export type SerieAAllTimeEntry = { club: string; seasons: number; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number; titles: number };

export const serieASeasons: SerieASeason[] = [
  {
    "season": "1929-30",
    "champion": "Inter",
    "runnerUp": "Genoa",
    "thirdPlace": "Juventus",
    "topScorer": "Giuseppe Meazza",
    "goals": 31
  },
  {
    "season": "1930-31",
    "champion": "Juventus",
    "runnerUp": "Roma",
    "thirdPlace": "Bologna",
    "topScorer": "Rodolfo Volk",
    "goals": 28
  },
  {
    "season": "1931-32",
    "champion": "Juventus",
    "runnerUp": "Bologna",
    "thirdPlace": "Roma",
    "topScorer": "Angelo Schiavio",
    "goals": 25
  },
  {
    "season": "1932-33",
    "champion": "Juventus",
    "runnerUp": "Inter",
    "thirdPlace": "Bologna",
    "topScorer": "Felice Borel",
    "goals": 29
  },
  {
    "season": "1933-34",
    "champion": "Juventus",
    "runnerUp": "Inter",
    "thirdPlace": "Napoli",
    "topScorer": "Felice Borel",
    "goals": 32
  },
  {
    "season": "1934-35",
    "champion": "Juventus",
    "runnerUp": "Inter",
    "thirdPlace": "Fiorentina",
    "topScorer": "Enrique Guaita",
    "goals": 28
  },
  {
    "season": "1935-36",
    "champion": "Bologna",
    "runnerUp": "Roma",
    "thirdPlace": "Torino",
    "topScorer": "Giuseppe Meazza",
    "goals": 25
  },
  {
    "season": "1936-37",
    "champion": "Bologna",
    "runnerUp": "Lazio",
    "thirdPlace": "Torino",
    "topScorer": "Silvio Piola",
    "goals": 21
  },
  {
    "season": "1937-38",
    "champion": "Inter",
    "runnerUp": "Juventus",
    "thirdPlace": "Genoa",
    "topScorer": "Giuseppe Meazza",
    "goals": 20
  },
  {
    "season": "1938-39",
    "champion": "Bologna",
    "runnerUp": "Torino",
    "thirdPlace": "Inter",
    "topScorer": "Ettore Puricelli",
    "goals": 19
  },
  {
    "season": "1939-40",
    "champion": "Inter",
    "runnerUp": "Bologna",
    "thirdPlace": "Juventus",
    "topScorer": "Aldo Boffi",
    "goals": 24
  },
  {
    "season": "1940-41",
    "champion": "Bologna",
    "runnerUp": "Inter",
    "thirdPlace": "Milan",
    "topScorer": "Ettore Puricelli",
    "goals": 22
  },
  {
    "season": "1941-42",
    "champion": "Roma",
    "runnerUp": "Torino",
    "thirdPlace": "Venezia",
    "topScorer": "Aldo Boffi",
    "goals": 22
  },
  {
    "season": "1942-43",
    "champion": "Torino",
    "runnerUp": "Livorno",
    "thirdPlace": "Juventus",
    "topScorer": "Silvio Piola",
    "goals": 21
  },
  {
    "season": "1945-46",
    "champion": "Torino",
    "runnerUp": "Juventus",
    "thirdPlace": "Milan",
    "topScorer": "Guglielmo Gabetto",
    "goals": 23
  },
  {
    "season": "1946-47",
    "champion": "Torino",
    "runnerUp": "Juventus",
    "thirdPlace": "Modena",
    "topScorer": "Valentino Mazzola",
    "goals": 29
  },
  {
    "season": "1947-48",
    "champion": "Torino",
    "runnerUp": "Milan",
    "thirdPlace": "Juventus",
    "topScorer": "Giampiero Boniperti",
    "goals": 27
  },
  {
    "season": "1948-49",
    "champion": "Torino",
    "runnerUp": "Inter",
    "thirdPlace": "Milan",
    "topScorer": "István Nyers",
    "goals": 26
  },
  {
    "season": "1949-50",
    "champion": "Juventus",
    "runnerUp": "Milan",
    "thirdPlace": "Inter",
    "topScorer": "Gunnar Nordahl",
    "goals": 35
  },
  {
    "season": "1950-51",
    "champion": "Milan",
    "runnerUp": "Inter",
    "thirdPlace": "Juventus",
    "topScorer": "Gunnar Nordahl",
    "goals": 34
  },
  {
    "season": "1951-52",
    "champion": "Juventus",
    "runnerUp": "Milan",
    "thirdPlace": "Inter",
    "topScorer": "John Hansen",
    "goals": 30
  },
  {
    "season": "1952-53",
    "champion": "Inter",
    "runnerUp": "Juventus",
    "thirdPlace": "Milan",
    "topScorer": "Gunnar Nordahl",
    "goals": 26
  },
  {
    "season": "1953-54",
    "champion": "Inter",
    "runnerUp": "Juventus",
    "thirdPlace": "Milan",
    "topScorer": "Gunnar Nordahl",
    "goals": 23
  },
  {
    "season": "1954-55",
    "champion": "Milan",
    "runnerUp": "Udinese",
    "thirdPlace": "Roma",
    "topScorer": "Gunnar Nordahl",
    "goals": 27
  },
  {
    "season": "1955-56",
    "champion": "Fiorentina",
    "runnerUp": "Milan",
    "thirdPlace": "Inter",
    "topScorer": "Gino Pivatelli",
    "goals": 29
  },
  {
    "season": "1956-57",
    "champion": "Milan",
    "runnerUp": "Fiorentina",
    "thirdPlace": "Lazio",
    "topScorer": "Dino da Costa",
    "goals": 22
  },
  {
    "season": "1957-58",
    "champion": "Juventus",
    "runnerUp": "Fiorentina",
    "thirdPlace": "Padova",
    "topScorer": "John Charles",
    "goals": 28
  },
  {
    "season": "1958-59",
    "champion": "Milan",
    "runnerUp": "Fiorentina",
    "thirdPlace": "Inter",
    "topScorer": "Antonio Valentín Angelillo",
    "goals": 33
  },
  {
    "season": "1959-60",
    "champion": "Juventus",
    "runnerUp": "Fiorentina",
    "thirdPlace": "Milan",
    "topScorer": "Omar Sívori",
    "goals": 28
  },
  {
    "season": "1960-61",
    "champion": "Juventus",
    "runnerUp": "Milan",
    "thirdPlace": "Inter",
    "topScorer": "Sergio Brighenti",
    "goals": 27
  },
  {
    "season": "1961-62",
    "champion": "Milan",
    "runnerUp": "Inter",
    "thirdPlace": "Fiorentina",
    "topScorer": "José Altafini",
    "goals": 22
  },
  {
    "season": "1962-63",
    "champion": "Inter",
    "runnerUp": "Juventus",
    "thirdPlace": "Milan",
    "topScorer": "Harald Nielsen",
    "goals": 19
  },
  {
    "season": "1963-64",
    "champion": "Bologna",
    "runnerUp": "Inter",
    "thirdPlace": "Milan",
    "topScorer": "Harald Nielsen",
    "goals": 21
  },
  {
    "season": "1964-65",
    "champion": "Inter",
    "runnerUp": "Milan",
    "thirdPlace": "Torino",
    "topScorer": "Sandro Mazzola",
    "goals": 17
  },
  {
    "season": "1965-66",
    "champion": "Inter",
    "runnerUp": "Bologna",
    "thirdPlace": "Napoli",
    "topScorer": "Luís Vinício",
    "goals": 25
  },
  {
    "season": "1966-67",
    "champion": "Juventus",
    "runnerUp": "Inter",
    "thirdPlace": "Bologna",
    "topScorer": "Gigi Riva",
    "goals": 18
  },
  {
    "season": "1967-68",
    "champion": "Milan",
    "runnerUp": "Napoli",
    "thirdPlace": "Juventus",
    "topScorer": "Pierino Prati",
    "goals": 15
  },
  {
    "season": "1968-69",
    "champion": "Fiorentina",
    "runnerUp": "Cagliari",
    "thirdPlace": "Milan",
    "topScorer": "Gigi Riva",
    "goals": 21
  },
  {
    "season": "1969-70",
    "champion": "Cagliari",
    "runnerUp": "Inter",
    "thirdPlace": "Juventus",
    "topScorer": "Gigi Riva",
    "goals": 21
  },
  {
    "season": "1970-71",
    "champion": "Inter",
    "runnerUp": "Milan",
    "thirdPlace": "Napoli",
    "topScorer": "Roberto Boninsegna",
    "goals": 24
  },
  {
    "season": "1971-72",
    "champion": "Juventus",
    "runnerUp": "Milan",
    "thirdPlace": "Torino",
    "topScorer": "Roberto Boninsegna",
    "goals": 22
  },
  {
    "season": "1972-73",
    "champion": "Juventus",
    "runnerUp": "Milan",
    "thirdPlace": "Lazio",
    "topScorer": "Giuseppe Savoldi",
    "goals": 17
  },
  {
    "season": "1973-74",
    "champion": "Lazio",
    "runnerUp": "Juventus",
    "thirdPlace": "Napoli",
    "topScorer": "Giorgio Chinaglia",
    "goals": 24
  },
  {
    "season": "1974-75",
    "champion": "Juventus",
    "runnerUp": "Napoli",
    "thirdPlace": "Roma",
    "topScorer": "Paolino Pulici",
    "goals": 18
  },
  {
    "season": "1975-76",
    "champion": "Torino",
    "runnerUp": "Juventus",
    "thirdPlace": "Milan",
    "topScorer": "Paolino Pulici",
    "goals": 21
  },
  {
    "season": "1976-77",
    "champion": "Juventus",
    "runnerUp": "Torino",
    "thirdPlace": "Fiorentina",
    "topScorer": "Francesco Graziani",
    "goals": 21
  },
  {
    "season": "1977-78",
    "champion": "Juventus",
    "runnerUp": "Vicenza",
    "thirdPlace": "Torino",
    "topScorer": "Paolo Rossi",
    "goals": 24
  },
  {
    "season": "1978-79",
    "champion": "Milan",
    "runnerUp": "Perugia",
    "thirdPlace": "Juventus",
    "topScorer": "Bruno Giordano",
    "goals": 19
  },
  {
    "season": "1979-80",
    "champion": "Inter",
    "runnerUp": "Juventus",
    "thirdPlace": "Torino",
    "topScorer": "Roberto Bettega",
    "goals": 16
  },
  {
    "season": "1980-81",
    "champion": "Juventus",
    "runnerUp": "Roma",
    "thirdPlace": "Napoli",
    "topScorer": "Roberto Pruzzo",
    "goals": 18
  },
  {
    "season": "1981-82",
    "champion": "Juventus",
    "runnerUp": "Fiorentina",
    "thirdPlace": "Roma",
    "topScorer": "Roberto Pruzzo",
    "goals": 15
  },
  {
    "season": "1982-83",
    "champion": "Roma",
    "runnerUp": "Juventus",
    "thirdPlace": "Inter",
    "topScorer": "Michel Platini",
    "goals": 16
  },
  {
    "season": "1983-84",
    "champion": "Juventus",
    "runnerUp": "Roma",
    "thirdPlace": "Fiorentina",
    "topScorer": "Michel Platini",
    "goals": 20
  },
  {
    "season": "1984-85",
    "champion": "Verona",
    "runnerUp": "Torino",
    "thirdPlace": "Inter",
    "topScorer": "Michel Platini",
    "goals": 18
  },
  {
    "season": "1985-86",
    "champion": "Juventus",
    "runnerUp": "Roma",
    "thirdPlace": "Napoli",
    "topScorer": "Roberto Pruzzo",
    "goals": 19
  },
  {
    "season": "1986-87",
    "champion": "Napoli",
    "runnerUp": "Juventus",
    "thirdPlace": "Inter",
    "topScorer": "Pietro Paolo Virdis",
    "goals": 17
  },
  {
    "season": "1987-88",
    "champion": "Milan",
    "runnerUp": "Napoli",
    "thirdPlace": "Roma",
    "topScorer": "Diego Maradona",
    "goals": 15
  },
  {
    "season": "1988-89",
    "champion": "Inter",
    "runnerUp": "Napoli",
    "thirdPlace": "Milan",
    "topScorer": "Aldo Serena",
    "goals": 22
  },
  {
    "season": "1989-90",
    "champion": "Napoli",
    "runnerUp": "Milan",
    "thirdPlace": "Inter",
    "topScorer": "Marco van Basten",
    "goals": 19
  },
  {
    "season": "1990-91",
    "champion": "Sampdoria",
    "runnerUp": "Milan",
    "thirdPlace": "Inter",
    "topScorer": "Gianluca Vialli",
    "goals": 19
  },
  {
    "season": "1991-92",
    "champion": "Milan",
    "runnerUp": "Juventus",
    "thirdPlace": "Torino",
    "topScorer": "Marco van Basten",
    "goals": 25
  },
  {
    "season": "1992-93",
    "champion": "Milan",
    "runnerUp": "Inter",
    "thirdPlace": "Parma",
    "topScorer": "Giuseppe Signori",
    "goals": 26
  },
  {
    "season": "1993-94",
    "champion": "Milan",
    "runnerUp": "Juventus",
    "thirdPlace": "Lazio",
    "topScorer": "Giuseppe Signori",
    "goals": 23
  },
  {
    "season": "1994-95",
    "champion": "Juventus",
    "runnerUp": "Parma",
    "thirdPlace": "Lazio",
    "topScorer": "Gabriel Batistuta",
    "goals": 26
  },
  {
    "season": "1995-96",
    "champion": "Milan",
    "runnerUp": "Juventus",
    "thirdPlace": "Lazio",
    "topScorer": "Igor Protti",
    "goals": 24
  },
  {
    "season": "1996-97",
    "champion": "Juventus",
    "runnerUp": "Parma",
    "thirdPlace": "Inter",
    "topScorer": "Filippo Inzaghi",
    "goals": 24
  },
  {
    "season": "1997-98",
    "champion": "Juventus",
    "runnerUp": "Inter",
    "thirdPlace": "Udinese",
    "topScorer": "Oliver Bierhoff",
    "goals": 27
  },
  {
    "season": "1998-99",
    "champion": "Milan",
    "runnerUp": "Lazio",
    "thirdPlace": "Fiorentina",
    "topScorer": "Márcio Amoroso",
    "goals": 22
  },
  {
    "season": "1999-00",
    "champion": "Lazio",
    "runnerUp": "Juventus",
    "thirdPlace": "Milan",
    "topScorer": "Andriy Shevchenko",
    "goals": 24
  },
  {
    "season": "2000-01",
    "champion": "Roma",
    "runnerUp": "Juventus",
    "thirdPlace": "Lazio",
    "topScorer": "Hernán Crespo",
    "goals": 26
  },
  {
    "season": "2001-02",
    "champion": "Juventus",
    "runnerUp": "Roma",
    "thirdPlace": "Inter",
    "topScorer": "David Trezeguet",
    "goals": 24
  },
  {
    "season": "2002-03",
    "champion": "Juventus",
    "runnerUp": "Inter",
    "thirdPlace": "Milan",
    "topScorer": "Christian Vieri",
    "goals": 24
  },
  {
    "season": "2003-04",
    "champion": "Milan",
    "runnerUp": "Roma",
    "thirdPlace": "Juventus",
    "topScorer": "Andriy Shevchenko",
    "goals": 24
  },
  {
    "season": "2004-05",
    "champion": "Not awarded (Juventus stripped)",
    "runnerUp": "Milan",
    "thirdPlace": "Inter",
    "topScorer": "Cristiano Lucarelli",
    "goals": 24
  },
  {
    "season": "2005-06",
    "champion": "Inter",
    "runnerUp": "Roma",
    "thirdPlace": "Milan",
    "topScorer": "Luca Toni",
    "goals": 31
  },
  {
    "season": "2006-07",
    "champion": "Inter",
    "runnerUp": "Roma",
    "thirdPlace": "Lazio",
    "topScorer": "Francesco Totti",
    "goals": 26
  },
  {
    "season": "2007-08",
    "champion": "Inter",
    "runnerUp": "Roma",
    "thirdPlace": "Juventus",
    "topScorer": "Alessandro Del Piero",
    "goals": 21
  },
  {
    "season": "2008-09",
    "champion": "Inter",
    "runnerUp": "Juventus",
    "thirdPlace": "Milan",
    "topScorer": "Zlatan Ibrahimović",
    "goals": 25
  },
  {
    "season": "2009-10",
    "champion": "Inter",
    "runnerUp": "Roma",
    "thirdPlace": "Milan",
    "topScorer": "Antonio Di Natale",
    "goals": 29
  },
  {
    "season": "2010-11",
    "champion": "Milan",
    "runnerUp": "Inter",
    "thirdPlace": "Napoli",
    "topScorer": "Antonio Di Natale",
    "goals": 28
  },
  {
    "season": "2011-12",
    "champion": "Juventus",
    "runnerUp": "Milan",
    "thirdPlace": "Udinese",
    "topScorer": "Zlatan Ibrahimović",
    "goals": 28
  },
  {
    "season": "2012-13",
    "champion": "Juventus",
    "runnerUp": "Napoli",
    "thirdPlace": "Milan",
    "topScorer": "Edinson Cavani",
    "goals": 29
  },
  {
    "season": "2013-14",
    "champion": "Juventus",
    "runnerUp": "Roma",
    "thirdPlace": "Napoli",
    "topScorer": "Ciro Immobile",
    "goals": 22
  },
  {
    "season": "2014-15",
    "champion": "Juventus",
    "runnerUp": "Roma",
    "thirdPlace": "Lazio",
    "topScorer": "Mauro Icardi",
    "goals": 22
  },
  {
    "season": "2015-16",
    "champion": "Juventus",
    "runnerUp": "Napoli",
    "thirdPlace": "Roma",
    "topScorer": "Gonzalo Higuaín",
    "goals": 36
  },
  {
    "season": "2016-17",
    "champion": "Juventus",
    "runnerUp": "Roma",
    "thirdPlace": "Napoli",
    "topScorer": "Edin Džeko",
    "goals": 29
  },
  {
    "season": "2017-18",
    "champion": "Juventus",
    "runnerUp": "Napoli",
    "thirdPlace": "Roma",
    "topScorer": "Mauro Icardi",
    "goals": 29
  },
  {
    "season": "2018-19",
    "champion": "Juventus",
    "runnerUp": "Napoli",
    "thirdPlace": "Atalanta",
    "topScorer": "Fabio Quagliarella",
    "goals": 26
  },
  {
    "season": "2019-20",
    "champion": "Juventus",
    "runnerUp": "Inter",
    "thirdPlace": "Atalanta",
    "topScorer": "Ciro Immobile",
    "goals": 36
  },
  {
    "season": "2020-21",
    "champion": "Inter",
    "runnerUp": "Milan",
    "thirdPlace": "Atalanta",
    "topScorer": "Cristiano Ronaldo",
    "goals": 29
  },
  {
    "season": "2021-22",
    "champion": "Milan",
    "runnerUp": "Inter",
    "thirdPlace": "Napoli",
    "topScorer": "Ciro Immobile",
    "goals": 27
  },
  {
    "season": "2022-23",
    "champion": "Napoli",
    "runnerUp": "Lazio",
    "thirdPlace": "Inter",
    "topScorer": "Victor Osimhen",
    "goals": 26
  },
  {
    "season": "2023-24",
    "champion": "Inter",
    "runnerUp": "Milan",
    "thirdPlace": "Juventus",
    "topScorer": "Lautaro Martínez",
    "goals": 24
  },
  {
    "season": "2024-25",
    "champion": "Napoli",
    "runnerUp": "Inter",
    "thirdPlace": "Atalanta",
    "topScorer": "Mateo Retegui",
    "goals": 25
  },
  {
    "season": "2025-26",
    "champion": "Inter",
    "runnerUp": "Napoli",
    "thirdPlace": "Roma",
    "topScorer": "Lautaro Martínez",
    "goals": 17
  }
];

// Points are 3 for a win and 1 for a draw, applied to every season
export const serieAAllTime: SerieAAllTimeEntry[] = [
  {
    "club": "Juventus",
    "seasons": 93,
    "played": 3152,
    "won": 1730,
    "drawn": 858,
    "lost": 564,
    "goalsFor": 5476,
    "goalsAgainst": 2972,
    "points": 6048,
    "titles": 34
  },
  {
    "club": "Inter",
    "seasons": 94,
    "played": 3190,
    "won": 1624,
    "drawn": 868,
    "lost": 698,
    "goalsFor": 5474,
    "goalsAgainst": 3266,
    "points": 5740,
    "titles": 19
  },
  {
    "club": "Milan",
    "seasons": 92,
    "played": 3130,
    "won": 1526,
    "drawn": 912,
    "lost": 692,
    "goalsFor": 5136,
    "goalsAgainst": 3216,
    "points": 5490,
    "titles": 16
  },
  {
    "club": "Roma",
    "seasons": 93,
    "played": 3152,
    "won": 1347,
    "drawn": 923,
    "lost": 882,
    "goalsFor": 4656,
    "goalsAgainst": 3553,
    "points": 4964,
    "titles": 3
  },
  {
    "club": "Fiorentina",
    "seasons": 88,
    "played": 2990,
    "won": 1178,
    "drawn": 909,
    "lost": 903,
    "goalsFor": 4156,
    "goalsAgainst": 3474,
    "points": 4443,
    "titles": 2
  },
  {
    "club": "Lazio",
    "seasons": 83,
    "played": 2852,
    "won": 1108,
    "drawn": 823,
    "lost": 921,
    "goalsFor": 3996,
    "goalsAgainst": 3533,
    "points": 4147,
    "titles": 2
  },
  {
    "club": "Napoli",
    "seasons": 80,
    "played": 2698,
    "won": 1117,
    "drawn": 818,
    "lost": 763,
    "goalsFor": 3729,
    "goalsAgainst": 3036,
    "points": 4169,
    "titles": 4
  },
  {
    "club": "Torino",
    "seasons": 82,
    "played": 2762,
    "won": 993,
    "drawn": 900,
    "lost": 869,
    "goalsFor": 3598,
    "goalsAgainst": 3287,
    "points": 3879,
    "titles": 6
  },
  {
    "club": "Bologna",
    "seasons": 79,
    "played": 2688,
    "won": 960,
    "drawn": 841,
    "lost": 887,
    "goalsFor": 3522,
    "goalsAgainst": 3295,
    "points": 3721,
    "titles": 5
  },
  {
    "club": "Atalanta",
    "seasons": 65,
    "played": 2264,
    "won": 729,
    "drawn": 713,
    "lost": 822,
    "goalsFor": 2719,
    "goalsAgainst": 2897,
    "points": 2900,
    "titles": 0
  },
  {
    "club": "Sampdoria",
    "seasons": 66,
    "played": 2278,
    "won": 753,
    "drawn": 702,
    "lost": 823,
    "goalsFor": 2838,
    "goalsAgainst": 2932,
    "points": 2961,
    "titles": 1
  },
  {
    "club": "Udinese",
    "seasons": 53,
    "played": 1866,
    "won": 597,
    "drawn": 546,
    "lost": 723,
    "goalsFor": 2332,
    "goalsAgainst": 2628,
    "points": 2337,
    "titles": 0
  },
  {
    "club": "Genoa",
    "seasons": 58,
    "played": 2010,
    "won": 618,
    "drawn": 611,
    "lost": 781,
    "goalsFor": 2471,
    "goalsAgainst": 2820,
    "points": 2465,
    "titles": 0
  },
  {
    "club": "Cagliari",
    "seasons": 45,
    "played": 1558,
    "won": 446,
    "drawn": 501,
    "lost": 611,
    "goalsFor": 1707,
    "goalsAgainst": 2037,
    "points": 1839,
    "titles": 1
  },
  {
    "club": "Parma",
    "seasons": 29,
    "played": 1046,
    "won": 372,
    "drawn": 308,
    "lost": 366,
    "goalsFor": 1328,
    "goalsAgainst": 1354,
    "points": 1424,
    "titles": 0
  },
  {
    "club": "Verona",
    "seasons": 35,
    "played": 1170,
    "won": 300,
    "drawn": 375,
    "lost": 495,
    "goalsFor": 1211,
    "goalsAgainst": 1626,
    "points": 1275,
    "titles": 1
  },
  {
    "club": "Palermo",
    "seasons": 29,
    "played": 1030,
    "won": 307,
    "drawn": 284,
    "lost": 439,
    "goalsFor": 1153,
    "goalsAgainst": 1535,
    "points": 1205,
    "titles": 0
  },
  {
    "club": "Vicenza",
    "seasons": 30,
    "played": 986,
    "won": 296,
    "drawn": 300,
    "lost": 390,
    "goalsFor": 1014,
    "goalsAgainst": 1261,
    "points": 1188,
    "titles": 0
  },
  {
    "club": "Bari",
    "seasons": 30,
    "played": 1010,
    "won": 258,
    "drawn": 286,
    "lost": 466,
    "goalsFor": 979,
    "goalsAgainst": 1514,
    "points": 1060,
    "titles": 0
  },
  {
    "club": "Triestina",
    "seasons": 26,
    "played": 874,
    "won": 253,
    "drawn": 268,
    "lost": 353,
    "goalsFor": 1004,
    "goalsAgainst": 1280,
    "points": 1027,
    "titles": 0
  },
  {
    "club": "Chievo",
    "seasons": 17,
    "played": 634,
    "won": 186,
    "drawn": 185,
    "lost": 263,
    "goalsFor": 659,
    "goalsAgainst": 837,
    "points": 743,
    "titles": 0
  },
  {
    "club": "Brescia",
    "seasons": 23,
    "played": 774,
    "won": 194,
    "drawn": 225,
    "lost": 355,
    "goalsFor": 790,
    "goalsAgainst": 1123,
    "points": 807,
    "titles": 0
  },
  {
    "club": "Lecce",
    "seasons": 20,
    "played": 716,
    "won": 157,
    "drawn": 205,
    "lost": 354,
    "goalsFor": 700,
    "goalsAgainst": 1154,
    "points": 676,
    "titles": 0
  },
  {
    "club": "Empoli",
    "seasons": 17,
    "played": 614,
    "won": 153,
    "drawn": 174,
    "lost": 287,
    "goalsFor": 604,
    "goalsAgainst": 904,
    "points": 633,
    "titles": 0
  },
  {
    "club": "Catania",
    "seasons": 17,
    "played": 602,
    "won": 162,
    "drawn": 181,
    "lost": 259,
    "goalsFor": 617,
    "goalsAgainst": 862,
    "points": 667,
    "titles": 0
  },
  {
    "club": "SPAL",
    "seasons": 19,
    "played": 658,
    "won": 175,
    "drawn": 196,
    "lost": 287,
    "goalsFor": 666,
    "goalsAgainst": 913,
    "points": 721,
    "titles": 0
  },
  {
    "club": "Livorno",
    "seasons": 18,
    "played": 626,
    "won": 171,
    "drawn": 172,
    "lost": 283,
    "goalsFor": 717,
    "goalsAgainst": 1029,
    "points": 685,
    "titles": 0
  },
  {
    "club": "Sassuolo",
    "seasons": 12,
    "played": 456,
    "won": 147,
    "drawn": 122,
    "lost": 187,
    "goalsFor": 614,
    "goalsAgainst": 722,
    "points": 563,
    "titles": 0
  },
  {
    "club": "Padova",
    "seasons": 16,
    "played": 560,
    "won": 182,
    "drawn": 130,
    "lost": 248,
    "goalsFor": 710,
    "goalsAgainst": 900,
    "points": 676,
    "titles": 0
  },
  {
    "club": "Como",
    "seasons": 15,
    "played": 502,
    "won": 142,
    "drawn": 155,
    "lost": 205,
    "goalsFor": 525,
    "goalsAgainst": 653,
    "points": 581,
    "titles": 0
  },
  {
    "club": "Perugia",
    "seasons": 13,
    "played": 418,
    "won": 126,
    "drawn": 140,
    "lost": 152,
    "goalsFor": 476,
    "goalsAgainst": 554,
    "points": 518,
    "titles": 0
  },
  {
    "club": "Ascoli",
    "seasons": 16,
    "played": 508,
    "won": 110,
    "drawn": 190,
    "lost": 208,
    "goalsFor": 425,
    "goalsAgainst": 629,
    "points": 520,
    "titles": 0
  },
  {
    "club": "Modena",
    "seasons": 13,
    "played": 444,
    "won": 130,
    "drawn": 125,
    "lost": 189,
    "goalsFor": 492,
    "goalsAgainst": 646,
    "points": 515,
    "titles": 0
  },
  {
    "club": "Alessandria",
    "seasons": 13,
    "played": 440,
    "won": 136,
    "drawn": 109,
    "lost": 195,
    "goalsFor": 564,
    "goalsAgainst": 720,
    "points": 517,
    "titles": 0
  },
  {
    "club": "Novara",
    "seasons": 13,
    "played": 446,
    "won": 133,
    "drawn": 107,
    "lost": 206,
    "goalsFor": 545,
    "goalsAgainst": 705,
    "points": 506,
    "titles": 0
  },
  {
    "club": "Venezia",
    "seasons": 14,
    "played": 476,
    "won": 105,
    "drawn": 130,
    "lost": 241,
    "goalsFor": 479,
    "goalsAgainst": 756,
    "points": 445,
    "titles": 0
  },
  {
    "club": "Siena",
    "seasons": 9,
    "played": 338,
    "won": 83,
    "drawn": 107,
    "lost": 148,
    "goalsFor": 356,
    "goalsAgainst": 472,
    "points": 356,
    "titles": 0
  },
  {
    "club": "Reggina",
    "seasons": 9,
    "played": 326,
    "won": 83,
    "drawn": 107,
    "lost": 136,
    "goalsFor": 324,
    "goalsAgainst": 467,
    "points": 356,
    "titles": 0
  },
  {
    "club": "Cesena",
    "seasons": 13,
    "played": 426,
    "won": 80,
    "drawn": 159,
    "lost": 187,
    "goalsFor": 364,
    "goalsAgainst": 570,
    "points": 399,
    "titles": 0
  },
  {
    "club": "Pro Patria",
    "seasons": 12,
    "played": 430,
    "won": 118,
    "drawn": 102,
    "lost": 210,
    "goalsFor": 526,
    "goalsAgainst": 784,
    "points": 456,
    "titles": 0
  }
];
