export type LaLigaSeason = { season: string; champion: string; runnerUp: string; thirdPlace: string; topScorer: string; goals: number };
export type LaLigaAllTimeEntry = { club: string; seasons: number; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number; titles: number };

export const laLigaSeasons: LaLigaSeason[] = [
  {
    "season": "1929",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Paco Bienzobas",
    "goals": 14
  },
  {
    "season": "1929-30",
    "champion": "Athletic Bilbao",
    "runnerUp": "Barcelona",
    "thirdPlace": "Arenas",
    "topScorer": "Guillermo Gorostiza",
    "goals": 19
  },
  {
    "season": "1930-31",
    "champion": "Athletic Bilbao",
    "runnerUp": "Racing de Santander",
    "thirdPlace": "Real Sociedad",
    "topScorer": "Bata",
    "goals": 27
  },
  {
    "season": "1931-32",
    "champion": "Real Madrid",
    "runnerUp": "Athletic Bilbao",
    "thirdPlace": "Barcelona",
    "topScorer": "Guillermo Gorostiza",
    "goals": 12
  },
  {
    "season": "1932-33",
    "champion": "Real Madrid",
    "runnerUp": "Athletic Bilbao",
    "thirdPlace": "Espanyol",
    "topScorer": "Manuel Olivares",
    "goals": 16
  },
  {
    "season": "1933-34",
    "champion": "Athletic Bilbao",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Racing de Santander",
    "topScorer": "Isidro Lángara",
    "goals": 27
  },
  {
    "season": "1934-35",
    "champion": "Real Betis",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Real Oviedo",
    "topScorer": "Isidro Lángara",
    "goals": 26
  },
  {
    "season": "1935-36",
    "champion": "Athletic Bilbao",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Real Oviedo",
    "topScorer": "Isidro Lángara",
    "goals": 27
  },
  {
    "season": "1939-40",
    "champion": "Atlético Madrid",
    "runnerUp": "Sevilla",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Víctor Unamuno",
    "goals": 22
  },
  {
    "season": "1940-41",
    "champion": "Atlético Madrid",
    "runnerUp": "Athletic Bilbao",
    "thirdPlace": "Valencia",
    "topScorer": "Pruden",
    "goals": 30
  },
  {
    "season": "1941-42",
    "champion": "Valencia",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Edmundo Suárez",
    "goals": 27
  },
  {
    "season": "1942-43",
    "champion": "Athletic Bilbao",
    "runnerUp": "Sevilla",
    "thirdPlace": "Barcelona",
    "topScorer": "Mariano Martín",
    "goals": 32
  },
  {
    "season": "1943-44",
    "champion": "Valencia",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Sevilla",
    "topScorer": "Edmundo Suárez",
    "goals": 27
  },
  {
    "season": "1944-45",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Telmo Zarra",
    "goals": 19
  },
  {
    "season": "1945-46",
    "champion": "Sevilla",
    "runnerUp": "Barcelona",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Telmo Zarra",
    "goals": 24
  },
  {
    "season": "1946-47",
    "champion": "Valencia",
    "runnerUp": "Athletic Bilbao",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Telmo Zarra",
    "goals": 34
  },
  {
    "season": "1947-48",
    "champion": "Barcelona",
    "runnerUp": "Valencia",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Pahiño",
    "goals": 23
  },
  {
    "season": "1948-49",
    "champion": "Barcelona",
    "runnerUp": "Valencia",
    "thirdPlace": "Real Madrid",
    "topScorer": "César Rodríguez",
    "goals": 28
  },
  {
    "season": "1949-50",
    "champion": "Atlético Madrid",
    "runnerUp": "Deportivo La Coruña",
    "thirdPlace": "Valencia",
    "topScorer": "Telmo Zarra",
    "goals": 25
  },
  {
    "season": "1950-51",
    "champion": "Atlético Madrid",
    "runnerUp": "Sevilla",
    "thirdPlace": "Valencia",
    "topScorer": "Telmo Zarra",
    "goals": 38
  },
  {
    "season": "1951-52",
    "champion": "Barcelona",
    "runnerUp": "Athletic Bilbao",
    "thirdPlace": "Real Madrid",
    "topScorer": "Pahiño",
    "goals": 28
  },
  {
    "season": "1952-53",
    "champion": "Barcelona",
    "runnerUp": "Valencia",
    "thirdPlace": "Real Madrid",
    "topScorer": "Telmo Zarra",
    "goals": 24
  },
  {
    "season": "1953-54",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Valencia",
    "topScorer": "Alfredo Di Stéfano",
    "goals": 27
  },
  {
    "season": "1954-55",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Juan Arza",
    "goals": 28
  },
  {
    "season": "1955-56",
    "champion": "Athletic Bilbao",
    "runnerUp": "Barcelona",
    "thirdPlace": "Real Madrid",
    "topScorer": "Alfredo Di Stéfano",
    "goals": 24
  },
  {
    "season": "1956-57",
    "champion": "Real Madrid",
    "runnerUp": "Sevilla",
    "thirdPlace": "Barcelona",
    "topScorer": "Alfredo Di Stéfano",
    "goals": 31
  },
  {
    "season": "1957-58",
    "champion": "Real Madrid",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Barcelona",
    "topScorer": "Ricardo Alós / Manuel Badenes / Alfredo Di Stéfano",
    "goals": 19
  },
  {
    "season": "1958-59",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Alfredo Di Stéfano",
    "goals": 23
  },
  {
    "season": "1959-60",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Ferenc Puskás",
    "goals": 26
  },
  {
    "season": "1960-61",
    "champion": "Real Madrid",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Zaragoza",
    "topScorer": "Ferenc Puskás",
    "goals": 27
  },
  {
    "season": "1961-62",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Juan Seminario",
    "goals": 25
  },
  {
    "season": "1962-63",
    "champion": "Real Madrid",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Real Oviedo",
    "topScorer": "Ferenc Puskás",
    "goals": 26
  },
  {
    "season": "1963-64",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Real Betis",
    "topScorer": "Ferenc Puskás",
    "goals": 20
  },
  {
    "season": "1964-65",
    "champion": "Real Madrid",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Zaragoza",
    "topScorer": "Cayetano Ré",
    "goals": 25
  },
  {
    "season": "1965-66",
    "champion": "Atlético Madrid",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Barcelona",
    "topScorer": "Vavá II",
    "goals": 19
  },
  {
    "season": "1966-67",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Espanyol",
    "topScorer": "Waldo",
    "goals": 24
  },
  {
    "season": "1967-68",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Las Palmas",
    "topScorer": "Fidel Uriarte",
    "goals": 22
  },
  {
    "season": "1968-69",
    "champion": "Real Madrid",
    "runnerUp": "Las Palmas",
    "thirdPlace": "Barcelona",
    "topScorer": "Amancio Amaro / José Eulogio Gárate",
    "goals": 14
  },
  {
    "season": "1969-70",
    "champion": "Atlético Madrid",
    "runnerUp": "Athletic Bilbao",
    "thirdPlace": "Sevilla",
    "topScorer": "Amancio Amaro / Luis Aragonés / José Eulogio Gárate",
    "goals": 16
  },
  {
    "season": "1970-71",
    "champion": "Valencia",
    "runnerUp": "Barcelona",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "José Eulogio Gárate / Carles Rexach",
    "goals": 17
  },
  {
    "season": "1971-72",
    "champion": "Real Madrid",
    "runnerUp": "Valencia",
    "thirdPlace": "Barcelona",
    "topScorer": "Enrique Porta",
    "goals": 20
  },
  {
    "season": "1972-73",
    "champion": "Atlético Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Espanyol",
    "topScorer": "Marianín",
    "goals": 19
  },
  {
    "season": "1973-74",
    "champion": "Barcelona",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Zaragoza",
    "topScorer": "Quini",
    "goals": 20
  },
  {
    "season": "1974-75",
    "champion": "Real Madrid",
    "runnerUp": "Zaragoza",
    "thirdPlace": "Barcelona",
    "topScorer": "Carlos",
    "goals": 19
  },
  {
    "season": "1975-76",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Quini",
    "goals": 21
  },
  {
    "season": "1976-77",
    "champion": "Atlético Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Mario Kempes",
    "goals": 24
  },
  {
    "season": "1977-78",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Mario Kempes",
    "goals": 28
  },
  {
    "season": "1978-79",
    "champion": "Real Madrid",
    "runnerUp": "Sporting Gijón",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Hans Krankl",
    "goals": 29
  },
  {
    "season": "1979-80",
    "champion": "Real Madrid",
    "runnerUp": "Real Sociedad",
    "thirdPlace": "Sporting Gijón",
    "topScorer": "Quini",
    "goals": 24
  },
  {
    "season": "1980-81",
    "champion": "Real Sociedad",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Quini",
    "goals": 20
  },
  {
    "season": "1981-82",
    "champion": "Real Sociedad",
    "runnerUp": "Barcelona",
    "thirdPlace": "Real Madrid",
    "topScorer": "Quini",
    "goals": 26
  },
  {
    "season": "1982-83",
    "champion": "Athletic Bilbao",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Poli Rincón",
    "goals": 20
  },
  {
    "season": "1983-84",
    "champion": "Athletic Bilbao",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Barcelona",
    "topScorer": "Jorge da Silva / Juanito",
    "goals": 17
  },
  {
    "season": "1984-85",
    "champion": "Barcelona",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Hugo Sánchez",
    "goals": 19
  },
  {
    "season": "1985-86",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Athletic Bilbao",
    "topScorer": "Hugo Sánchez",
    "goals": 22
  },
  {
    "season": "1986-87",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Espanyol",
    "topScorer": "Hugo Sánchez",
    "goals": 34
  },
  {
    "season": "1987-88",
    "champion": "Real Madrid",
    "runnerUp": "Real Sociedad",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Hugo Sánchez",
    "goals": 29
  },
  {
    "season": "1988-89",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Valencia",
    "topScorer": "Baltazar",
    "goals": 35
  },
  {
    "season": "1989-90",
    "champion": "Real Madrid",
    "runnerUp": "Valencia",
    "thirdPlace": "Barcelona",
    "topScorer": "Hugo Sánchez",
    "goals": 38
  },
  {
    "season": "1990-91",
    "champion": "Barcelona",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Real Madrid",
    "topScorer": "Emilio Butragueño",
    "goals": 19
  },
  {
    "season": "1991-92",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Manolo",
    "goals": 27
  },
  {
    "season": "1992-93",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Deportivo La Coruña",
    "topScorer": "Bebeto",
    "goals": 29
  },
  {
    "season": "1993-94",
    "champion": "Barcelona",
    "runnerUp": "Deportivo La Coruña",
    "thirdPlace": "Zaragoza",
    "topScorer": "Romário",
    "goals": 30
  },
  {
    "season": "1994-95",
    "champion": "Real Madrid",
    "runnerUp": "Deportivo La Coruña",
    "thirdPlace": "Real Betis",
    "topScorer": "Iván Zamorano",
    "goals": 28
  },
  {
    "season": "1995-96",
    "champion": "Atlético Madrid",
    "runnerUp": "Valencia",
    "thirdPlace": "Barcelona",
    "topScorer": "Juan Antonio Pizzi",
    "goals": 31
  },
  {
    "season": "1996-97",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Deportivo La Coruña",
    "topScorer": "Ronaldo",
    "goals": 34
  },
  {
    "season": "1997-98",
    "champion": "Barcelona",
    "runnerUp": "Athletic Bilbao",
    "thirdPlace": "Real Sociedad",
    "topScorer": "Christian Vieri",
    "goals": 24
  },
  {
    "season": "1998-99",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Mallorca",
    "topScorer": "Raúl",
    "goals": 25
  },
  {
    "season": "1999-2000",
    "champion": "Deportivo La Coruña",
    "runnerUp": "Barcelona",
    "thirdPlace": "Valencia",
    "topScorer": "Salva Ballesta",
    "goals": 27
  },
  {
    "season": "2000-01",
    "champion": "Real Madrid",
    "runnerUp": "Deportivo La Coruña",
    "thirdPlace": "Mallorca",
    "topScorer": "Raúl",
    "goals": 24
  },
  {
    "season": "2001-02",
    "champion": "Valencia",
    "runnerUp": "Deportivo La Coruña",
    "thirdPlace": "Real Madrid",
    "topScorer": "Diego Tristán",
    "goals": 21
  },
  {
    "season": "2002-03",
    "champion": "Real Madrid",
    "runnerUp": "Real Sociedad",
    "thirdPlace": "Deportivo La Coruña",
    "topScorer": "Roy Makaay",
    "goals": 29
  },
  {
    "season": "2003-04",
    "champion": "Valencia",
    "runnerUp": "Barcelona",
    "thirdPlace": "Deportivo La Coruña",
    "topScorer": "Ronaldo",
    "goals": 25
  },
  {
    "season": "2004-05",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Villarreal",
    "topScorer": "Diego Forlán",
    "goals": 25
  },
  {
    "season": "2005-06",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Valencia",
    "topScorer": "Samuel Eto'o",
    "goals": 26
  },
  {
    "season": "2006-07",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Sevilla",
    "topScorer": "Ruud van Nistelrooy",
    "goals": 25
  },
  {
    "season": "2007-08",
    "champion": "Real Madrid",
    "runnerUp": "Villarreal",
    "thirdPlace": "Barcelona",
    "topScorer": "Dani Güiza",
    "goals": 27
  },
  {
    "season": "2008-09",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Sevilla",
    "topScorer": "Diego Forlán",
    "goals": 32
  },
  {
    "season": "2009-10",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Valencia",
    "topScorer": "Lionel Messi",
    "goals": 34
  },
  {
    "season": "2010-11",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Valencia",
    "topScorer": "Cristiano Ronaldo",
    "goals": 40
  },
  {
    "season": "2011-12",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Valencia",
    "topScorer": "Lionel Messi",
    "goals": 50
  },
  {
    "season": "2012-13",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Lionel Messi",
    "goals": 46
  },
  {
    "season": "2013-14",
    "champion": "Atlético Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Real Madrid",
    "topScorer": "Cristiano Ronaldo",
    "goals": 31
  },
  {
    "season": "2014-15",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Cristiano Ronaldo",
    "goals": 48
  },
  {
    "season": "2015-16",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Luis Suárez",
    "goals": 40
  },
  {
    "season": "2016-17",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Lionel Messi",
    "goals": 37
  },
  {
    "season": "2017-18",
    "champion": "Barcelona",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Real Madrid",
    "topScorer": "Lionel Messi",
    "goals": 34
  },
  {
    "season": "2018-19",
    "champion": "Barcelona",
    "runnerUp": "Atlético Madrid",
    "thirdPlace": "Real Madrid",
    "topScorer": "Lionel Messi",
    "goals": 36
  },
  {
    "season": "2019-20",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Lionel Messi",
    "goals": 25
  },
  {
    "season": "2020-21",
    "champion": "Atlético Madrid",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Barcelona",
    "topScorer": "Lionel Messi",
    "goals": 30
  },
  {
    "season": "2021-22",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Karim Benzema",
    "goals": 27
  },
  {
    "season": "2022-23",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Robert Lewandowski",
    "goals": 23
  },
  {
    "season": "2023-24",
    "champion": "Real Madrid",
    "runnerUp": "Barcelona",
    "thirdPlace": "Girona",
    "topScorer": "Artem Dovbyk",
    "goals": 24
  },
  {
    "season": "2024-25",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Atlético Madrid",
    "topScorer": "Kylian Mbappé",
    "goals": 31
  },
  {
    "season": "2025-26",
    "champion": "Barcelona",
    "runnerUp": "Real Madrid",
    "thirdPlace": "Villarreal",
    "topScorer": "Kylian Mbappé",
    "goals": 25
  }
];

export const laLigaAllTime: LaLigaAllTimeEntry[] = [
  {
    "club": "Real Madrid",
    "seasons": 95,
    "points": 5129,
    "played": 3104,
    "won": 1873,
    "drawn": 618,
    "lost": 613,
    "goalsFor": 6638,
    "goalsAgainst": 3449,
    "titles": 36
  },
  {
    "club": "Barcelona",
    "seasons": 95,
    "points": 5031,
    "played": 3104,
    "won": 1818,
    "drawn": 618,
    "lost": 668,
    "goalsFor": 6674,
    "goalsAgainst": 3432,
    "titles": 29
  },
  {
    "club": "Atlético Madrid",
    "seasons": 89,
    "points": 4122,
    "played": 2956,
    "won": 1441,
    "drawn": 678,
    "lost": 837,
    "goalsFor": 5100,
    "goalsAgainst": 3605,
    "titles": 11
  },
  {
    "club": "Athletic Bilbao",
    "seasons": 95,
    "points": 3850,
    "played": 3104,
    "won": 1335,
    "drawn": 737,
    "lost": 1032,
    "goalsFor": 5048,
    "goalsAgainst": 4077,
    "titles": 8
  },
  {
    "club": "Valencia",
    "seasons": 91,
    "points": 3850,
    "played": 3006,
    "won": 1307,
    "drawn": 720,
    "lost": 979,
    "goalsFor": 4830,
    "goalsAgainst": 3900,
    "titles": 6
  },
  {
    "club": "Sevilla",
    "seasons": 82,
    "points": 3327,
    "played": 2750,
    "won": 1130,
    "drawn": 619,
    "lost": 1001,
    "goalsFor": 4134,
    "goalsAgainst": 3798,
    "titles": 1
  },
  {
    "club": "Espanyol",
    "seasons": 89,
    "points": 3086,
    "played": 2892,
    "won": 1020,
    "drawn": 686,
    "lost": 1186,
    "goalsFor": 3877,
    "goalsAgainst": 4237,
    "titles": 0
  },
  {
    "club": "Real Sociedad",
    "seasons": 79,
    "points": 3075,
    "played": 2644,
    "won": 1002,
    "drawn": 665,
    "lost": 977,
    "goalsFor": 3690,
    "goalsAgainst": 3639,
    "titles": 2
  },
  {
    "club": "Real Betis",
    "seasons": 60,
    "points": 2399,
    "played": 2070,
    "won": 746,
    "drawn": 534,
    "lost": 790,
    "goalsFor": 2636,
    "goalsAgainst": 2938,
    "titles": 1
  },
  {
    "club": "Celta Vigo",
    "seasons": 60,
    "points": 2208,
    "played": 2040,
    "won": 693,
    "drawn": 487,
    "lost": 860,
    "goalsFor": 2726,
    "goalsAgainst": 3111,
    "titles": 0
  },
  {
    "club": "Real Zaragoza",
    "seasons": 58,
    "points": 2109,
    "played": 1986,
    "won": 698,
    "drawn": 522,
    "lost": 766,
    "goalsFor": 2683,
    "goalsAgainst": 2847,
    "titles": 0
  },
  {
    "club": "Deportivo La Coru?a",
    "seasons": 46,
    "points": 1843,
    "played": 1568,
    "won": 569,
    "drawn": 403,
    "lost": 596,
    "goalsFor": 2108,
    "goalsAgainst": 2294,
    "titles": 1
  },
  {
    "club": "Real Valladolid",
    "seasons": 47,
    "points": 1641,
    "played": 1656,
    "won": 502,
    "drawn": 437,
    "lost": 717,
    "goalsFor": 1922,
    "goalsAgainst": 2486,
    "titles": 0
  },
  {
    "club": "Osasuna",
    "seasons": 44,
    "points": 1683,
    "played": 1582,
    "won": 511,
    "drawn": 403,
    "lost": 668,
    "goalsFor": 1791,
    "goalsAgainst": 2186,
    "titles": 0
  },
  {
    "club": "Villarreal",
    "seasons": 26,
    "points": 1511,
    "played": 988,
    "won": 418,
    "drawn": 257,
    "lost": 313,
    "goalsFor": 1451,
    "goalsAgainst": 1223,
    "titles": 0
  },
  {
    "club": "Racing de Santander",
    "seasons": 44,
    "points": 1415,
    "played": 1426,
    "won": 453,
    "drawn": 335,
    "lost": 638,
    "goalsFor": 1845,
    "goalsAgainst": 2367,
    "titles": 0
  },
  {
    "club": "Sporting Gij?n",
    "seasons": 42,
    "points": 1389,
    "played": 1458,
    "won": 471,
    "drawn": 358,
    "lost": 629,
    "goalsFor": 1753,
    "goalsAgainst": 2152,
    "titles": 0
  },
  {
    "club": "Mallorca",
    "seasons": 33,
    "points": 1400,
    "played": 1216,
    "won": 398,
    "drawn": 313,
    "lost": 505,
    "goalsFor": 1410,
    "goalsAgainst": 1687,
    "titles": 0
  },
  {
    "club": "Real Oviedo",
    "seasons": 39,
    "points": 1203,
    "played": 1230,
    "won": 414,
    "drawn": 303,
    "lost": 513,
    "goalsFor": 1668,
    "goalsAgainst": 2011,
    "titles": 0
  },
  {
    "club": "UD Las Palmas",
    "seasons": 36,
    "points": 1114,
    "played": 1210,
    "won": 390,
    "drawn": 267,
    "lost": 553,
    "goalsFor": 1444,
    "goalsAgainst": 1928,
    "titles": 0
  },
  {
    "club": "Getafe",
    "seasons": 21,
    "points": 976,
    "played": 798,
    "won": 254,
    "drawn": 214,
    "lost": 330,
    "goalsFor": 856,
    "goalsAgainst": 998,
    "titles": 0
  },
  {
    "club": "Rayo Vallecano",
    "seasons": 23,
    "points": 925,
    "played": 870,
    "won": 254,
    "drawn": 216,
    "lost": 400,
    "goalsFor": 996,
    "goalsAgainst": 1398,
    "titles": 0
  },
  {
    "club": "Granada CF",
    "seasons": 27,
    "points": 828,
    "played": 894,
    "won": 259,
    "drawn": 213,
    "lost": 422,
    "goalsFor": 1000,
    "goalsAgainst": 1408,
    "titles": 0
  },
  {
    "club": "Málaga CF",
    "seasons": 17,
    "points": 791,
    "played": 646,
    "won": 209,
    "drawn": 164,
    "lost": 273,
    "goalsFor": 779,
    "goalsAgainst": 898,
    "titles": 0
  },
  {
    "club": "Deportivo Alav?s",
    "seasons": 20,
    "points": 757,
    "played": 684,
    "won": 213,
    "drawn": 153,
    "lost": 318,
    "goalsFor": 756,
    "goalsAgainst": 1059,
    "titles": 0
  },
  {
    "club": "Elche",
    "seasons": 25,
    "points": 752,
    "played": 830,
    "won": 237,
    "drawn": 224,
    "lost": 369,
    "goalsFor": 903,
    "goalsAgainst": 1253,
    "titles": 0
  },
  {
    "club": "Levante",
    "seasons": 17,
    "points": 673,
    "played": 630,
    "won": 177,
    "drawn": 160,
    "lost": 293,
    "goalsFor": 724,
    "goalsAgainst": 1003,
    "titles": 0
  },
  {
    "club": "CD Málaga",
    "seasons": 20,
    "points": 540,
    "played": 648,
    "won": 186,
    "drawn": 171,
    "lost": 291,
    "goalsFor": 666,
    "goalsAgainst": 930,
    "titles": 0
  },
  {
    "club": "Hércules de Alicante CF",
    "seasons": 20,
    "points": 538,
    "played": 628,
    "won": 184,
    "drawn": 149,
    "lost": 295,
    "goalsFor": 716,
    "goalsAgainst": 1050,
    "titles": 0
  },
  {
    "club": "CD Tenerife",
    "seasons": 13,
    "points": 510,
    "played": 494,
    "won": 155,
    "drawn": 128,
    "lost": 211,
    "goalsFor": 619,
    "goalsAgainst": 744,
    "titles": 0
  },
  {
    "club": "Cádiz CF",
    "seasons": 16,
    "points": 499,
    "played": 598,
    "won": 139,
    "drawn": 178,
    "lost": 281,
    "goalsFor": 518,
    "goalsAgainst": 877,
    "titles": 0
  },
  {
    "club": "Real Murcia CF",
    "seasons": 18,
    "points": 445,
    "played": 586,
    "won": 145,
    "drawn": 143,
    "lost": 298,
    "goalsFor": 607,
    "goalsAgainst": 992,
    "titles": 0
  },
  {
    "club": "UD Salamanca",
    "seasons": 12,
    "points": 377,
    "played": 424,
    "won": 124,
    "drawn": 102,
    "lost": 198,
    "goalsFor": 425,
    "goalsAgainst": 581,
    "titles": 0
  },
  {
    "club": "CE Sabadell FC",
    "seasons": 14,
    "points": 353,
    "played": 426,
    "won": 129,
    "drawn": 95,
    "lost": 202,
    "goalsFor": 492,
    "goalsAgainst": 720,
    "titles": 0
  },
  {
    "club": "SD Eibar",
    "seasons": 7,
    "points": 302,
    "played": 266,
    "won": 77,
    "drawn": 71,
    "lost": 118,
    "goalsFor": 297,
    "goalsAgainst": 375,
    "titles": 0
  },
  {
    "club": "UD Almería",
    "seasons": 8,
    "points": 301,
    "played": 304,
    "won": 76,
    "drawn": 76,
    "lost": 152,
    "goalsFor": 336,
    "goalsAgainst": 506,
    "titles": 0
  },
  {
    "club": "CD Logroñés (Logroño)",
    "seasons": 9,
    "points": 293,
    "played": 346,
    "won": 96,
    "drawn": 92,
    "lost": 158,
    "goalsFor": 291,
    "goalsAgainst": 489,
    "titles": 0
  },
  {
    "club": "CD Castellón",
    "seasons": 11,
    "points": 285,
    "played": 334,
    "won": 103,
    "drawn": 79,
    "lost": 152,
    "goalsFor": 419,
    "goalsAgainst": 588,
    "titles": 0
  },
  {
    "club": "Girona",
    "seasons": 6,
    "points": 300,
    "played": 228,
    "won": 81,
    "drawn": 57,
    "lost": 90,
    "goalsFor": 313,
    "goalsAgainst": 328,
    "titles": 0
  },
  {
    "club": "Albacete Balompié",
    "seasons": 7,
    "points": 257,
    "played": 270,
    "won": 76,
    "drawn": 76,
    "lost": 118,
    "goalsFor": 320,
    "goalsAgainst": 410,
    "titles": 0
  },
  {
    "club": "Córdoba CF",
    "seasons": 9,
    "points": 230,
    "played": 282,
    "won": 82,
    "drawn": 63,
    "lost": 137,
    "goalsFor": 285,
    "goalsAgainst": 430,
    "titles": 0
  },
  {
    "club": "CD Leganés (Madrid)",
    "seasons": 5,
    "points": 199,
    "played": 190,
    "won": 48,
    "drawn": 55,
    "lost": 87,
    "goalsFor": 176,
    "goalsAgainst": 256,
    "titles": 0
  },
  {
    "club": "SD Compostela (Santiago Compostela)",
    "seasons": 4,
    "points": 190,
    "played": 160,
    "won": 52,
    "drawn": 45,
    "lost": 63,
    "goalsFor": 199,
    "goalsAgainst": 241,
    "titles": 0
  },
  {
    "club": "Recreativo de Huelva",
    "seasons": 5,
    "points": 188,
    "played": 186,
    "won": 50,
    "drawn": 46,
    "lost": 90,
    "goalsFor": 202,
    "goalsAgainst": 296,
    "titles": 0
  },
  {
    "club": "Burgos CF",
    "seasons": 6,
    "points": 168,
    "played": 204,
    "won": 59,
    "drawn": 50,
    "lost": 95,
    "goalsFor": 216,
    "goalsAgainst": 310,
    "titles": 0
  },
  {
    "club": "Pontevedra CF",
    "seasons": 6,
    "points": 150,
    "played": 180,
    "won": 53,
    "drawn": 44,
    "lost": 83,
    "goalsFor": 165,
    "goalsAgainst": 221,
    "titles": 0
  },
  {
    "club": "CD Numancia de Soria",
    "seasons": 4,
    "points": 148,
    "played": 152,
    "won": 37,
    "drawn": 37,
    "lost": 78,
    "goalsFor": 155,
    "goalsAgainst": 253,
    "titles": 0
  },
  {
    "club": "Arenas Club (Guecho)",
    "seasons": 7,
    "points": 107,
    "played": 130,
    "won": 43,
    "drawn": 21,
    "lost": 66,
    "goalsFor": 227,
    "goalsAgainst": 308,
    "titles": 0
  },
  {
    "club": "Real Burgos CF",
    "seasons": 3,
    "points": 96,
    "played": 114,
    "won": 26,
    "drawn": 44,
    "lost": 44,
    "goalsFor": 101,
    "goalsAgainst": 139,
    "titles": 0
  },
  {
    "club": "Gimnàstic de Tarragona",
    "seasons": 4,
    "points": 91,
    "played": 116,
    "won": 34,
    "drawn": 16,
    "lost": 66,
    "goalsFor": 181,
    "goalsAgainst": 295,
    "titles": 0
  },
  {
    "club": "CF Extremadura (Almendralejo)",
    "seasons": 2,
    "points": 83,
    "played": 80,
    "won": 20,
    "drawn": 23,
    "lost": 37,
    "goalsFor": 62,
    "goalsAgainst": 117,
    "titles": 0
  },
  {
    "club": "CP Mérida",
    "seasons": 2,
    "points": 81,
    "played": 80,
    "won": 19,
    "drawn": 24,
    "lost": 37,
    "goalsFor": 70,
    "goalsAgainst": 115,
    "titles": 0
  },
  {
    "club": "CD Alcoyano (Alcoy)",
    "seasons": 4,
    "points": 76,
    "played": 108,
    "won": 30,
    "drawn": 16,
    "lost": 62,
    "goalsFor": 145,
    "goalsAgainst": 252,
    "titles": 0
  },
  {
    "club": "Real Jaén CF",
    "seasons": 3,
    "points": 71,
    "played": 90,
    "won": 29,
    "drawn": 13,
    "lost": 48,
    "goalsFor": 121,
    "goalsAgainst": 183,
    "titles": 0
  },
  {
    "club": "SD Huesca",
    "seasons": 2,
    "points": 67,
    "played": 76,
    "won": 14,
    "drawn": 25,
    "lost": 37,
    "goalsFor": 77,
    "goalsAgainst": 118,
    "titles": 0
  },
  {
    "club": "Real Unión Club (Irún)",
    "seasons": 4,
    "points": 56,
    "played": 72,
    "won": 21,
    "drawn": 14,
    "lost": 37,
    "goalsFor": 153,
    "goalsAgainst": 184,
    "titles": 0
  },
  {
    "club": "AD Almería",
    "seasons": 2,
    "points": 52,
    "played": 68,
    "won": 17,
    "drawn": 18,
    "lost": 33,
    "goalsFor": 72,
    "goalsAgainst": 116,
    "titles": 0
  },
  {
    "club": "CE Europa (Barcelona)",
    "seasons": 3,
    "points": 42,
    "played": 54,
    "won": 18,
    "drawn": 6,
    "lost": 30,
    "goalsFor": 97,
    "goalsAgainst": 131,
    "titles": 0
  },
  {
    "club": "UE Lleida",
    "seasons": 2,
    "points": 40,
    "played": 68,
    "won": 13,
    "drawn": 14,
    "lost": 41,
    "goalsFor": 70,
    "goalsAgainst": 182,
    "titles": 0
  },
  {
    "club": "Xerez CD",
    "seasons": 1,
    "points": 34,
    "played": 38,
    "won": 8,
    "drawn": 10,
    "lost": 20,
    "goalsFor": 38,
    "goalsAgainst": 66,
    "titles": 0
  },
  {
    "club": "CD Condal",
    "seasons": 1,
    "points": 22,
    "played": 30,
    "won": 7,
    "drawn": 8,
    "lost": 15,
    "goalsFor": 37,
    "goalsAgainst": 57,
    "titles": 0
  },
  {
    "club": "CA de Tetuán",
    "seasons": 1,
    "points": 19,
    "played": 30,
    "won": 7,
    "drawn": 5,
    "lost": 18,
    "goalsFor": 51,
    "goalsAgainst": 85,
    "titles": 0
  },
  {
    "club": "Cultural y Deportiva Leonesa",
    "seasons": 1,
    "points": 14,
    "played": 30,
    "won": 5,
    "drawn": 4,
    "lost": 21,
    "goalsFor": 34,
    "goalsAgainst": 65,
    "titles": 0
  }
];
