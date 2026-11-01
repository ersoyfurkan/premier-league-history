export type Ligue1Season = { season: string; champion: string; runnerUp: string; thirdPlace: string; topScorer: string; goals: number };
export type Ligue1AllTimeEntry = { club: string; seasons: number; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number; titles: number };

export const ligue1Seasons: Ligue1Season[] = 
[
    {
        "season":  "1932-33",
        "champion":  "Olympique Lillois",
        "runnerUp":  "Cannes",
        "thirdPlace":  "RC Paris",
        "topScorer":  "Robert Mercier / Walter Kaiser",
        "goals":  15
    },
    {
        "season":  "1933-34",
        "champion":  "Sète",
        "runnerUp":  "Fives",
        "thirdPlace":  "Marseille",
        "topScorer":  "Istvan Lukacs",
        "goals":  28
    },
    {
        "season":  "1934-35",
        "champion":  "Sochaux",
        "runnerUp":  "Strasbourg",
        "thirdPlace":  "RC Paris",
        "topScorer":  "André Abegglen",
        "goals":  30
    },
    {
        "season":  "1935-36",
        "champion":  "RC Paris",
        "runnerUp":  "Olympique Lillois",
        "thirdPlace":  "Strasbourg",
        "topScorer":  "Roger Courtois",
        "goals":  34
    },
    {
        "season":  "1936-37",
        "champion":  "Marseille",
        "runnerUp":  "Sochaux",
        "thirdPlace":  "RC Paris",
        "topScorer":  "Oskar Rohr",
        "goals":  30
    },
    {
        "season":  "1937-38",
        "champion":  "Sochaux",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Sète",
        "topScorer":  "Jean Nicolas",
        "goals":  26
    },
    {
        "season":  "1938-39",
        "champion":  "Sète",
        "runnerUp":  "Marseille",
        "thirdPlace":  "RC Paris",
        "topScorer":  "Roger Courtois / Désiré Koranyi",
        "goals":  27
    },
    {
        "season":  "1939-40",
        "champion":  "Not awarded (World War II)",
        "runnerUp":  "-",
        "thirdPlace":  "-",
        "topScorer":  "-",
        "goals":  0
    },
    {
        "season":  "1940-41",
        "champion":  "Not awarded (World War II)",
        "runnerUp":  "-",
        "thirdPlace":  "-",
        "topScorer":  "-",
        "goals":  0
    },
    {
        "season":  "1941-42",
        "champion":  "Not awarded (World War II)",
        "runnerUp":  "-",
        "thirdPlace":  "-",
        "topScorer":  "-",
        "goals":  0
    },
    {
        "season":  "1942-43",
        "champion":  "Not awarded (World War II)",
        "runnerUp":  "-",
        "thirdPlace":  "-",
        "topScorer":  "-",
        "goals":  0
    },
    {
        "season":  "1943-44",
        "champion":  "Not awarded (World War II)",
        "runnerUp":  "-",
        "thirdPlace":  "-",
        "topScorer":  "-",
        "goals":  0
    },
    {
        "season":  "1944-45",
        "champion":  "Not awarded (World War II)",
        "runnerUp":  "-",
        "thirdPlace":  "-",
        "topScorer":  "-",
        "goals":  0
    },
    {
        "season":  "1945-46",
        "champion":  "Lille",
        "runnerUp":  "Saint-Étienne",
        "thirdPlace":  "CO Roubaix-Tourcoing",
        "topScorer":  "René Bihel",
        "goals":  28
    },
    {
        "season":  "1946-47",
        "champion":  "Roubaix–Tourcoing",
        "runnerUp":  "Reims",
        "thirdPlace":  "Strasbourg",
        "topScorer":  "Pierre Sinibaldi",
        "goals":  33
    },
    {
        "season":  "1947-48",
        "champion":  "Marseille",
        "runnerUp":  "Lille",
        "thirdPlace":  "Reims",
        "topScorer":  "Jean Baratte",
        "goals":  31
    },
    {
        "season":  "1948-49",
        "champion":  "Reims",
        "runnerUp":  "Lille",
        "thirdPlace":  "Marseille",
        "topScorer":  "Jean Baratte",
        "goals":  26
    },
    {
        "season":  "1949-50",
        "champion":  "Bordeaux",
        "runnerUp":  "Lille",
        "thirdPlace":  "Reims",
        "topScorer":  "Jean Grumellon",
        "goals":  24
    },
    {
        "season":  "1950-51",
        "champion":  "Nice",
        "runnerUp":  "Lille",
        "thirdPlace":  "Le Havre",
        "topScorer":  "Roger Piantoni",
        "goals":  28
    },
    {
        "season":  "1951-52",
        "champion":  "Nice",
        "runnerUp":  "Bordeaux",
        "thirdPlace":  "Lille",
        "topScorer":  "Gunnar Andersson",
        "goals":  31
    },
    {
        "season":  "1952-53",
        "champion":  "Reims",
        "runnerUp":  "Sochaux",
        "thirdPlace":  "Bordeaux",
        "topScorer":  "Gunnar Andersson",
        "goals":  35
    },
    {
        "season":  "1953-54",
        "champion":  "Lille",
        "runnerUp":  "Reims",
        "thirdPlace":  "Bordeaux",
        "topScorer":  "Édouard Kargu",
        "goals":  27
    },
    {
        "season":  "1954-55",
        "champion":  "Reims",
        "runnerUp":  "Toulouse",
        "thirdPlace":  "Lens",
        "topScorer":  "René Bliard",
        "goals":  30
    },
    {
        "season":  "1955-56",
        "champion":  "Nice",
        "runnerUp":  "Lens",
        "thirdPlace":  "Monaco",
        "topScorer":  "Thadée Cisowski",
        "goals":  31
    },
    {
        "season":  "1956-57",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Lens",
        "thirdPlace":  "Reims",
        "topScorer":  "Thadée Cisowski",
        "goals":  33
    },
    {
        "season":  "1957-58",
        "champion":  "Reims",
        "runnerUp":  "Nîmes",
        "thirdPlace":  "Monaco",
        "topScorer":  "Just Fontaine",
        "goals":  34
    },
    {
        "season":  "1958-59",
        "champion":  "Nice",
        "runnerUp":  "Nîmes",
        "thirdPlace":  "RC Paris",
        "topScorer":  "Thadée Cisowski",
        "goals":  30
    },
    {
        "season":  "1959-60",
        "champion":  "Reims",
        "runnerUp":  "Nîmes",
        "thirdPlace":  "RC Paris",
        "topScorer":  "Just Fontaine",
        "goals":  28
    },
    {
        "season":  "1960-61",
        "champion":  "Monaco",
        "runnerUp":  "RC Paris",
        "thirdPlace":  "Reims",
        "topScorer":  "Roger Piantoni",
        "goals":  28
    },
    {
        "season":  "1961-62",
        "champion":  "Reims",
        "runnerUp":  "RC Paris",
        "thirdPlace":  "Nîmes",
        "topScorer":  "Touré Sékou",
        "goals":  25
    },
    {
        "season":  "1962-63",
        "champion":  "Monaco",
        "runnerUp":  "Reims",
        "thirdPlace":  "Sedan",
        "topScorer":  "Serge Masnaghetti",
        "goals":  35
    },
    {
        "season":  "1963-64",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Monaco",
        "thirdPlace":  "RC Lens",
        "topScorer":  "Ahmed Oudjani",
        "goals":  30
    },
    {
        "season":  "1964-65",
        "champion":  "Nantes",
        "runnerUp":  "Bordeaux",
        "thirdPlace":  "Valenciennes",
        "topScorer":  "Jacques Simon",
        "goals":  24
    },
    {
        "season":  "1965-66",
        "champion":  "Nantes",
        "runnerUp":  "Bordeaux",
        "thirdPlace":  "Valenciennes",
        "topScorer":  "Philippe Gondet",
        "goals":  36
    },
    {
        "season":  "1966-67",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Nantes",
        "thirdPlace":  "Angers",
        "topScorer":  "Hervé Revelli",
        "goals":  31
    },
    {
        "season":  "1967-68",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Nice",
        "thirdPlace":  "Sochaux",
        "topScorer":  "Étienne Sansonetti",
        "goals":  26
    },
    {
        "season":  "1968-69",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Bordeaux",
        "thirdPlace":  "Metz",
        "topScorer":  "André Guy",
        "goals":  25
    },
    {
        "season":  "1969-70",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Marseille",
        "thirdPlace":  "RC Paris-Sedan",
        "topScorer":  "Hervé Revelli",
        "goals":  28
    },
    {
        "season":  "1970-71",
        "champion":  "Marseille",
        "runnerUp":  "Saint-Étienne",
        "thirdPlace":  "Nantes",
        "topScorer":  "Josip Skoblar",
        "goals":  44
    },
    {
        "season":  "1971-72",
        "champion":  "Marseille",
        "runnerUp":  "Nîmes",
        "thirdPlace":  "Sochaux",
        "topScorer":  "Josip Skoblar",
        "goals":  30
    },
    {
        "season":  "1972-73",
        "champion":  "Nantes",
        "runnerUp":  "Nice",
        "thirdPlace":  "Marseille",
        "topScorer":  "Josip Skoblar",
        "goals":  26
    },
    {
        "season":  "1973-74",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Nantes",
        "thirdPlace":  "Lyon",
        "topScorer":  "Carlos Bianchi",
        "goals":  30
    },
    {
        "season":  "1974-75",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Lyon",
        "topScorer":  "Delio Onnis",
        "goals":  30
    },
    {
        "season":  "1975-76",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Nice",
        "thirdPlace":  "Sochaux",
        "topScorer":  "Carlos Bianchi",
        "goals":  34
    },
    {
        "season":  "1976-77",
        "champion":  "Nantes",
        "runnerUp":  "Lens",
        "thirdPlace":  "Bastia",
        "topScorer":  "Carlos Bianchi",
        "goals":  28
    },
    {
        "season":  "1977-78",
        "champion":  "Monaco",
        "runnerUp":  "Nantes",
        "thirdPlace":  "Strasbourg",
        "topScorer":  "Carlos Bianchi",
        "goals":  37
    },
    {
        "season":  "1978-79",
        "champion":  "Strasbourg",
        "runnerUp":  "Nantes",
        "thirdPlace":  "Saint-Étienne",
        "topScorer":  "Carlos Bianchi",
        "goals":  27
    },
    {
        "season":  "1979-80",
        "champion":  "Nantes",
        "runnerUp":  "Sochaux",
        "thirdPlace":  "Saint-Étienne",
        "topScorer":  "Erwin Kostedde / Delio Onnis",
        "goals":  21
    },
    {
        "season":  "1980-81",
        "champion":  "Saint-Étienne",
        "runnerUp":  "Nantes",
        "thirdPlace":  "Bordeaux",
        "topScorer":  "Delio Onnis",
        "goals":  24
    },
    {
        "season":  "1981-82",
        "champion":  "Monaco",
        "runnerUp":  "Saint-Étienne",
        "thirdPlace":  "Sochaux",
        "topScorer":  "Delio Onnis",
        "goals":  29
    },
    {
        "season":  "1982-83",
        "champion":  "Nantes",
        "runnerUp":  "Bordeaux",
        "thirdPlace":  "Paris Saint-Germain",
        "topScorer":  "Vahid Halilhodzic",
        "goals":  27
    },
    {
        "season":  "1983-84",
        "champion":  "Bordeaux",
        "runnerUp":  "Monaco",
        "thirdPlace":  "Auxerre",
        "topScorer":  "Patrice Garande / Delio Onnis",
        "goals":  21
    },
    {
        "season":  "1984-85",
        "champion":  "Bordeaux",
        "runnerUp":  "Nantes",
        "thirdPlace":  "Monaco",
        "topScorer":  "Vahid Halilhodzic",
        "goals":  28
    },
    {
        "season":  "1985-86",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Nantes",
        "thirdPlace":  "Bordeaux",
        "topScorer":  "Jules Bocandé",
        "goals":  23
    },
    {
        "season":  "1986-87",
        "champion":  "Bordeaux",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Toulouse",
        "topScorer":  "Bernard Zénier",
        "goals":  18
    },
    {
        "season":  "1987-88",
        "champion":  "Monaco",
        "runnerUp":  "Bordeaux",
        "thirdPlace":  "Montpellier",
        "topScorer":  "Jean-Pierre Papin",
        "goals":  19
    },
    {
        "season":  "1988-89",
        "champion":  "Marseille",
        "runnerUp":  "Paris Saint-Germain",
        "thirdPlace":  "Monaco",
        "topScorer":  "Jean-Pierre Papin",
        "goals":  22
    },
    {
        "season":  "1989-90",
        "champion":  "Marseille",
        "runnerUp":  "Bordeaux",
        "thirdPlace":  "Monaco",
        "topScorer":  "Jean-Pierre Papin",
        "goals":  30
    },
    {
        "season":  "1990-91",
        "champion":  "Marseille",
        "runnerUp":  "Monaco",
        "thirdPlace":  "Auxerre",
        "topScorer":  "Jean-Pierre Papin",
        "goals":  23
    },
    {
        "season":  "1991-92",
        "champion":  "Marseille",
        "runnerUp":  "Monaco",
        "thirdPlace":  "Paris Saint-Germain",
        "topScorer":  "Jean-Pierre Papin",
        "goals":  27
    },
    {
        "season":  "1992-93",
        "champion":  "Not awarded (title stripped)",
        "runnerUp":  "Paris Saint-Germain",
        "thirdPlace":  "Monaco",
        "topScorer":  "Alen Bokšić",
        "goals":  23
    },
    {
        "season":  "1993-94",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Auxerre",
        "topScorer":  "Youri Djorkaeff",
        "goals":  20
    },
    {
        "season":  "1994-95",
        "champion":  "Nantes",
        "runnerUp":  "Lyon",
        "thirdPlace":  "Paris Saint-Germain",
        "topScorer":  "Patrice Loko",
        "goals":  22
    },
    {
        "season":  "1995-96",
        "champion":  "Auxerre",
        "runnerUp":  "Paris Saint-Germain",
        "thirdPlace":  "Monaco",
        "topScorer":  "Sonny Anderson",
        "goals":  21
    },
    {
        "season":  "1996-97",
        "champion":  "Monaco",
        "runnerUp":  "Paris Saint-Germain",
        "thirdPlace":  "Nantes",
        "topScorer":  "Stéphane Guivarc\u0027h",
        "goals":  22
    },
    {
        "season":  "1997-98",
        "champion":  "1955–56, 1956–57, 1976–77, 2001–02, 2022–23, 2025–26",
        "runnerUp":  "-",
        "thirdPlace":  "Club Français",
        "topScorer":  "Stéphane Guivarc\u0027h",
        "goals":  21
    },
    {
        "season":  "1998-99",
        "champion":  "Bordeaux",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Lyon",
        "topScorer":  "Sylvain Wiltord",
        "goals":  22
    },
    {
        "season":  "1999-00",
        "champion":  "Monaco",
        "runnerUp":  "Paris Saint-Germain",
        "thirdPlace":  "Lyon",
        "topScorer":  "Sonny Anderson",
        "goals":  23
    },
    {
        "season":  "2000-01",
        "champion":  "Nantes",
        "runnerUp":  "Lyon",
        "thirdPlace":  "Lille",
        "topScorer":  "Sonny Anderson",
        "goals":  22
    },
    {
        "season":  "2001-02",
        "champion":  "Lyon",
        "runnerUp":  "Lens",
        "thirdPlace":  "Auxerre",
        "topScorer":  "Djibril Cissé",
        "goals":  22
    },
    {
        "season":  "2002-03",
        "champion":  "Lyon",
        "runnerUp":  "Monaco",
        "thirdPlace":  "Marseille",
        "topScorer":  "Shabani Nonda",
        "goals":  26
    },
    {
        "season":  "2003-04",
        "champion":  "Lyon",
        "runnerUp":  "Paris Saint-Germain",
        "thirdPlace":  "Monaco",
        "topScorer":  "Djibril Cissé",
        "goals":  26
    },
    {
        "season":  "2004-05",
        "champion":  "Lyon",
        "runnerUp":  "Lille",
        "thirdPlace":  "Monaco",
        "topScorer":  "Alexander Frei",
        "goals":  20
    },
    {
        "season":  "2005-06",
        "champion":  "Lyon",
        "runnerUp":  "Bordeaux",
        "thirdPlace":  "Lille",
        "topScorer":  "Pauleta",
        "goals":  21
    },
    {
        "season":  "2006-07",
        "champion":  "Lyon",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Toulouse",
        "topScorer":  "Pauleta",
        "goals":  15
    },
    {
        "season":  "2007-08",
        "champion":  "Lyon",
        "runnerUp":  "Bordeaux",
        "thirdPlace":  "Marseille",
        "topScorer":  "Karim Benzema",
        "goals":  20
    },
    {
        "season":  "2008-09",
        "champion":  "Bordeaux",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Lyon",
        "topScorer":  "André-Pierre Gignac",
        "goals":  24
    },
    {
        "season":  "2009-10",
        "champion":  "Marseille",
        "runnerUp":  "Lyon",
        "thirdPlace":  "Auxerre",
        "topScorer":  "Mamadou Niang",
        "goals":  18
    },
    {
        "season":  "2010-11",
        "champion":  "Lille",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Lyon",
        "topScorer":  "Moussa Sow",
        "goals":  25
    },
    {
        "season":  "2011-12",
        "champion":  "Montpellier",
        "runnerUp":  "Paris Saint-Germain",
        "thirdPlace":  "Lille",
        "topScorer":  "Olivier Giroud / Nenê",
        "goals":  21
    },
    {
        "season":  "2012-13",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Lyon",
        "topScorer":  "Zlatan Ibrahimovic",
        "goals":  30
    },
    {
        "season":  "2013-14",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Monaco",
        "thirdPlace":  "Lille",
        "topScorer":  "Zlatan Ibrahimovic",
        "goals":  26
    },
    {
        "season":  "2014-15",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Lyon",
        "thirdPlace":  "Monaco",
        "topScorer":  "Alexandre Lacazette",
        "goals":  27
    },
    {
        "season":  "2015-16",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Lyon",
        "thirdPlace":  "Monaco",
        "topScorer":  "Zlatan Ibrahimović",
        "goals":  38
    },
    {
        "season":  "2016-17",
        "champion":  "Monaco",
        "runnerUp":  "Paris Saint-Germain",
        "thirdPlace":  "Nice",
        "topScorer":  "Edinson Cavani",
        "goals":  35
    },
    {
        "season":  "2017-18",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Monaco",
        "thirdPlace":  "Lyon",
        "topScorer":  "Edinson Cavani",
        "goals":  28
    },
    {
        "season":  "2018-19",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Lille",
        "thirdPlace":  "Lyon",
        "topScorer":  "Kylian Mbappé",
        "goals":  33
    },
    {
        "season":  "2019-20",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Rennes",
        "topScorer":  "Wissam Ben Yedder / Kylian Mbappé",
        "goals":  18
    },
    {
        "season":  "2020-21",
        "champion":  "Lille",
        "runnerUp":  "Paris Saint-Germain",
        "thirdPlace":  "Monaco",
        "topScorer":  "Kylian Mbappé",
        "goals":  26
    },
    {
        "season":  "2021-22",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Monaco",
        "topScorer":  "Kylian Mbappé",
        "goals":  28
    },
    {
        "season":  "2022-23",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Lens",
        "thirdPlace":  "Marseille",
        "topScorer":  "Kylian Mbappé",
        "goals":  29
    },
    {
        "season":  "2023-24",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Monaco",
        "thirdPlace":  "Brest",
        "topScorer":  "Kylian Mbappé",
        "goals":  27
    },
    {
        "season":  "2024-25",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Marseille",
        "thirdPlace":  "Monaco",
        "topScorer":  "Ousmane Dembélé",
        "goals":  21
    },
    {
        "season":  "2025-26",
        "champion":  "Paris Saint-Germain",
        "runnerUp":  "Lens",
        "thirdPlace":  "Lille",
        "topScorer":  "Estéban Lepaul",
        "goals":  21
    }
];

export const ligue1AllTime: Ligue1AllTimeEntry[] = 
[
    {
        "club":  "Olympique Marseille",
        "seasons":  77,
        "played":  2726,
        "won":  1228,
        "drawn":  684,
        "lost":  814,
        "goalsFor":  4417,
        "goalsAgainst":  3488,
        "points":  4368,
        "titles":  9
    },
    {
        "club":  "AS Monaco",
        "seasons":  68,
        "played":  2480,
        "won":  1119,
        "drawn":  670,
        "lost":  691,
        "goalsFor":  3798,
        "goalsAgainst":  2827,
        "points":  4027,
        "titles":  8
    },
    {
        "club":  "Girondins Bordeaux",
        "seasons":  69,
        "played":  2544,
        "won":  1075,
        "drawn":  692,
        "lost":  777,
        "goalsFor":  3757,
        "goalsAgainst":  3121,
        "points":  3917,
        "titles":  6
    },
    {
        "club":  "Olympique Lyonnais",
        "seasons":  69,
        "played":  2510,
        "won":  1086,
        "drawn":  624,
        "lost":  800,
        "goalsFor":  3791,
        "goalsAgainst":  3259,
        "points":  3882,
        "titles":  7
    },
    {
        "club":  "AS Saint-Etienne",
        "seasons":  70,
        "played":  2566,
        "won":  1070,
        "drawn":  672,
        "lost":  824,
        "goalsFor":  3899,
        "goalsAgainst":  3346,
        "points":  3882,
        "titles":  10
    },
    {
        "club":  "LOSC",
        "seasons":  67,
        "played":  2439,
        "won":  954,
        "drawn":  666,
        "lost":  819,
        "goalsFor":  3433,
        "goalsAgainst":  3018,
        "points":  3528,
        "titles":  5
    },
    {
        "club":  "Paris SG",
        "seasons":  54,
        "played":  1980,
        "won":  984,
        "drawn":  502,
        "lost":  494,
        "goalsFor":  3289,
        "goalsAgainst":  2100,
        "points":  3454,
        "titles":  14
    },
    {
        "club":  "OGC Nice",
        "seasons":  68,
        "played":  2453,
        "won":  914,
        "drawn":  632,
        "lost":  907,
        "goalsFor":  3397,
        "goalsAgainst":  3417,
        "points":  3374,
        "titles":  4
    },
    {
        "club":  "Stade Rennais",
        "seasons":  70,
        "played":  2485,
        "won":  886,
        "drawn":  632,
        "lost":  967,
        "goalsFor":  3419,
        "goalsAgainst":  3617,
        "points":  3290,
        "titles":  0
    },
    {
        "club":  "RC Lens",
        "seasons":  65,
        "played":  2345,
        "won":  882,
        "drawn":  625,
        "lost":  838,
        "goalsFor":  3326,
        "goalsAgainst":  3266,
        "points":  3271,
        "titles":  0
    },
    {
        "club":  "FC Nantes",
        "seasons":  58,
        "played":  2146,
        "won":  879,
        "drawn":  601,
        "lost":  666,
        "goalsFor":  2922,
        "goalsAgainst":  2389,
        "points":  3238,
        "titles":  8
    },
    {
        "club":  "FC Sochaux",
        "seasons":  66,
        "played":  2368,
        "won":  859,
        "drawn":  632,
        "lost":  877,
        "goalsFor":  3386,
        "goalsAgainst":  3297,
        "points":  3209,
        "titles":  0
    },
    {
        "club":  "RC Strasbourg",
        "seasons":  66,
        "played":  2343,
        "won":  801,
        "drawn":  637,
        "lost":  905,
        "goalsFor":  3253,
        "goalsAgainst":  3435,
        "points":  3040,
        "titles":  1
    },
    {
        "club":  "FC Metz",
        "seasons":  65,
        "played":  2328,
        "won":  752,
        "drawn":  620,
        "lost":  956,
        "goalsFor":  2948,
        "goalsAgainst":  3494,
        "points":  2876,
        "titles":  0
    },
    {
        "club":  "Stade de Reims",
        "seasons":  40,
        "played":  1450,
        "won":  599,
        "drawn":  364,
        "lost":  487,
        "goalsFor":  2350,
        "goalsAgainst":  1995,
        "points":  2161,
        "titles":  6
    },
    {
        "club":  "Montpellier HSC",
        "seasons":  43,
        "played":  1544,
        "won":  511,
        "drawn":  408,
        "lost":  625,
        "goalsFor":  1981,
        "goalsAgainst":  2260,
        "points":  1941,
        "titles":  1
    },
    {
        "club":  "AJ Auxerre",
        "seasons":  36,
        "played":  1310,
        "won":  513,
        "drawn":  377,
        "lost":  420,
        "goalsFor":  1655,
        "goalsAgainst":  1427,
        "points":  1916,
        "titles":  1
    },
    {
        "club":  "Nîmes Olympique",
        "seasons":  36,
        "played":  1310,
        "won":  489,
        "drawn":  324,
        "lost":  497,
        "goalsFor":  1905,
        "goalsAgainst":  1888,
        "points":  1791,
        "titles":  0
    },
    {
        "club":  "Toulouse FC",
        "seasons":  37,
        "played":  1342,
        "won":  414,
        "drawn":  397,
        "lost":  531,
        "goalsFor":  1445,
        "goalsAgainst":  1687,
        "points":  1639,
        "titles":  0
    },
    {
        "club":  "SC Bastia",
        "seasons":  34,
        "played":  1264,
        "won":  434,
        "drawn":  299,
        "lost":  531,
        "goalsFor":  1542,
        "goalsAgainst":  1813,
        "points":  1601,
        "titles":  0
    },
    {
        "club":  "Racing CF",
        "seasons":  30,
        "played":  1020,
        "won":  426,
        "drawn":  226,
        "lost":  368,
        "goalsFor":  1920,
        "goalsAgainst":  1698,
        "points":  1504,
        "titles":  0
    },
    {
        "club":  "SCO Angers",
        "seasons":  34,
        "played":  1224,
        "won":  387,
        "drawn":  332,
        "lost":  505,
        "goalsFor":  1616,
        "goalsAgainst":  1867,
        "points":  1493,
        "titles":  0
    },
    {
        "club":  "Valenciennes FC",
        "seasons":  33,
        "played":  1214,
        "won":  375,
        "drawn":  337,
        "lost":  502,
        "goalsFor":  1460,
        "goalsAgainst":  1773,
        "points":  1462,
        "titles":  0
    },
    {
        "club":  "AS Nancy Lorraine",
        "seasons":  30,
        "played":  1132,
        "won":  375,
        "drawn":  303,
        "lost":  454,
        "goalsFor":  1433,
        "goalsAgainst":  1545,
        "points":  1428,
        "titles":  0
    },
    {
        "club":  "Le Havre AC",
        "seasons":  28,
        "played":  983,
        "won":  281,
        "drawn":  271,
        "lost":  431,
        "goalsFor":  1118,
        "goalsAgainst":  1464,
        "points":  1114,
        "titles":  0
    },
    {
        "club":  "CS Sedan Ardennes",
        "seasons":  23,
        "played":  834,
        "won":  291,
        "drawn":  229,
        "lost":  314,
        "goalsFor":  1243,
        "goalsAgainst":  1255,
        "points":  1102,
        "titles":  0
    },
    {
        "club":  "Toulouse FC 1937-67",
        "seasons":  19,
        "played":  678,
        "won":  269,
        "drawn":  158,
        "lost":  251,
        "goalsFor":  1072,
        "goalsAgainst":  1031,
        "points":  965,
        "titles":  0
    },
    {
        "club":  "AS Cannes",
        "seasons":  22,
        "played":  748,
        "won":  246,
        "drawn":  194,
        "lost":  308,
        "goalsFor":  985,
        "goalsAgainst":  1137,
        "points":  932,
        "titles":  0
    },
    {
        "club":  "Stade Brestois",
        "seasons":  21,
        "played":  746,
        "won":  227,
        "drawn":  212,
        "lost":  307,
        "goalsFor":  872,
        "goalsAgainst":  1068,
        "points":  893,
        "titles":  0
    },
    {
        "club":  "FC Rouen",
        "seasons":  19,
        "played":  678,
        "won":  233,
        "drawn":  161,
        "lost":  284,
        "goalsFor":  859,
        "goalsAgainst":  980,
        "points":  860,
        "titles":  0
    },
    {
        "club":  "FC Lorient",
        "seasons":  19,
        "played":  676,
        "won":  201,
        "drawn":  201,
        "lost":  274,
        "goalsFor":  798,
        "goalsAgainst":  970,
        "points":  804,
        "titles":  0
    },
    {
        "club":  "SM Caen",
        "seasons":  18,
        "played":  684,
        "won":  200,
        "drawn":  184,
        "lost":  300,
        "goalsFor":  710,
        "goalsAgainst":  951,
        "points":  784,
        "titles":  0
    },
    {
        "club":  "ES Troyes AC",
        "seasons":  20,
        "played":  711,
        "won":  175,
        "drawn":  185,
        "lost":  351,
        "goalsFor":  783,
        "goalsAgainst":  1188,
        "points":  710,
        "titles":  0
    },
    {
        "club":  "SC Sète",
        "seasons":  16,
        "played":  504,
        "won":  198,
        "drawn":  111,
        "lost":  195,
        "goalsFor":  826,
        "goalsAgainst":  877,
        "points":  705,
        "titles":  2
    },
    {
        "club":  "FC Nancy",
        "seasons":  15,
        "played":  530,
        "won":  181,
        "drawn":  123,
        "lost":  226,
        "goalsFor":  794,
        "goalsAgainst":  925,
        "points":  666,
        "titles":  0
    },
    {
        "club":  "Stade Français",
        "seasons":  15,
        "played":  538,
        "won":  168,
        "drawn":  144,
        "lost":  226,
        "goalsFor":  760,
        "goalsAgainst":  896,
        "points":  648,
        "titles":  0
    },
    {
        "club":  "Stade Lavallois",
        "seasons":  13,
        "played":  494,
        "won":  157,
        "drawn":  145,
        "lost":  192,
        "goalsFor":  564,
        "goalsAgainst":  658,
        "points":  616,
        "titles":  0
    },
    {
        "club":  "En Avant Guingamp",
        "seasons":  13,
        "played":  482,
        "won":  150,
        "drawn":  122,
        "lost":  210,
        "goalsFor":  509,
        "goalsAgainst":  653,
        "points":  572,
        "titles":  0
    },
    {
        "club":  "Red Star",
        "seasons":  16,
        "played":  540,
        "won":  142,
        "drawn":  142,
        "lost":  256,
        "goalsFor":  717,
        "goalsAgainst":  996,
        "points":  568,
        "titles":  0
    },
    {
        "club":  "AC Ajaccio",
        "seasons":  14,
        "played":  524,
        "won":  138,
        "drawn":  136,
        "lost":  250,
        "goalsFor":  536,
        "goalsAgainst":  812,
        "points":  550,
        "titles":  0
    },
    {
        "club":  "Sporting Toulon",
        "seasons":  12,
        "played":  452,
        "won":  134,
        "drawn":  127,
        "lost":  191,
        "goalsFor":  454,
        "goalsAgainst":  589,
        "points":  529,
        "titles":  0
    },
    {
        "club":  "CO Roubaix",
        "seasons":  10,
        "played":  344,
        "won":  130,
        "drawn":  83,
        "lost":  131,
        "goalsFor":  550,
        "goalsAgainst":  581,
        "points":  473,
        "titles":  0
    },
    {
        "club":  "LOSC",
        "seasons":  7,
        "played":  194,
        "won":  97,
        "drawn":  35,
        "lost":  62,
        "goalsFor":  361,
        "goalsAgainst":  255,
        "points":  326,
        "titles":  5
    },
    {
        "club":  "Excelsior AC",
        "seasons":  7,
        "played":  194,
        "won":  75,
        "drawn":  46,
        "lost":  73,
        "goalsFor":  404,
        "goalsAgainst":  388,
        "points":  271,
        "titles":  0
    },
    {
        "club":  "Le Mans FC",
        "seasons":  7,
        "played":  237,
        "won":  66,
        "drawn":  73,
        "lost":  98,
        "goalsFor":  249,
        "goalsAgainst":  319,
        "points":  271,
        "titles":  0
    },
    {
        "club":  "SC Fivois",
        "seasons":  7,
        "played":  194,
        "won":  77,
        "drawn":  37,
        "lost":  80,
        "goalsFor":  348,
        "goalsAgainst":  323,
        "points":  268,
        "titles":  0
    },
    {
        "club":  "FC Antibes",
        "seasons":  7,
        "played":  194,
        "won":  65,
        "drawn":  43,
        "lost":  86,
        "goalsFor":  296,
        "goalsAgainst":  387,
        "points":  238,
        "titles":  0
    },
    {
        "club":  "Dijon FCO",
        "seasons":  6,
        "played":  218,
        "won":  50,
        "drawn":  56,
        "lost":  112,
        "goalsFor":  222,
        "goalsAgainst":  364,
        "points":  206,
        "titles":  0
    },
    {
        "club":  "FC Mulhouse",
        "seasons":  6,
        "played":  184,
        "won":  51,
        "drawn":  35,
        "lost":  98,
        "goalsFor":  291,
        "goalsAgainst":  440,
        "points":  188,
        "titles":  0
    },
    {
        "club":  "Paris FC",
        "seasons":  5,
        "played":  156,
        "won":  46,
        "drawn":  42,
        "lost":  68,
        "goalsFor":  210,
        "goalsAgainst":  273,
        "points":  180,
        "titles":  0
    },
    {
        "club":  "Thonon Evian FC",
        "seasons":  4,
        "played":  152,
        "won":  45,
        "drawn":  36,
        "lost":  71,
        "goalsFor":  180,
        "goalsAgainst":  221,
        "points":  171,
        "titles":  0
    },
    {
        "club":  "Tours FC",
        "seasons":  4,
        "played":  152,
        "won":  44,
        "drawn":  38,
        "lost":  70,
        "goalsFor":  217,
        "goalsAgainst":  264,
        "points":  170,
        "titles":  0
    },
    {
        "club":  "Olympique d\u0027Alès",
        "seasons":  6,
        "played":  184,
        "won":  42,
        "drawn":  44,
        "lost":  98,
        "goalsFor":  251,
        "goalsAgainst":  415,
        "points":  170,
        "titles":  0
    },
    {
        "club":  "Grenoble Foot",
        "seasons":  4,
        "played":  152,
        "won":  30,
        "drawn":  51,
        "lost":  71,
        "goalsFor":  138,
        "goalsAgainst":  214,
        "points":  141,
        "titles":  0
    },
    {
        "club":  "Limoges Football",
        "seasons":  3,
        "played":  114,
        "won":  37,
        "drawn":  28,
        "lost":  49,
        "goalsFor":  149,
        "goalsAgainst":  172,
        "points":  139,
        "titles":  0
    },
    {
        "club":  "Angoulême CFC",
        "seasons":  3,
        "played":  110,
        "won":  30,
        "drawn":  33,
        "lost":  47,
        "goalsFor":  122,
        "goalsAgainst":  175,
        "points":  123,
        "titles":  0
    },
    {
        "club":  "Clermont Foot",
        "seasons":  3,
        "played":  110,
        "won":  31,
        "drawn":  27,
        "lost":  52,
        "goalsFor":  109,
        "goalsAgainst":  178,
        "points":  120,
        "titles":  0
    },
    {
        "club":  "FC Martigues",
        "seasons":  3,
        "played":  114,
        "won":  27,
        "drawn":  36,
        "lost":  51,
        "goalsFor":  105,
        "goalsAgainst":  165,
        "points":  117,
        "titles":  0
    },
    {
        "club":  "Amiens SC",
        "seasons":  3,
        "played":  104,
        "won":  25,
        "drawn":  31,
        "lost":  48,
        "goalsFor":  99,
        "goalsAgainst":  144,
        "points":  106,
        "titles":  0
    },
    {
        "club":  "RC Roubaix",
        "seasons":  3,
        "played":  90,
        "won":  26,
        "drawn":  20,
        "lost":  44,
        "goalsFor":  120,
        "goalsAgainst":  188,
        "points":  98,
        "titles":  0
    },
    {
        "club":  "SC Nîmes",
        "seasons":  3,
        "played":  74,
        "won":  24,
        "drawn":  11,
        "lost":  39,
        "goalsFor":  140,
        "goalsAgainst":  177,
        "points":  83,
        "titles":  0
    },
    {
        "club":  "CA Paris",
        "seasons":  2,
        "played":  44,
        "won":  13,
        "drawn":  4,
        "lost":  27,
        "goalsFor":  93,
        "goalsAgainst":  127,
        "points":  43,
        "titles":  0
    },
    {
        "club":  "SR Colmar",
        "seasons":  1,
        "played":  34,
        "won":  12,
        "drawn":  7,
        "lost":  15,
        "goalsFor":  61,
        "goalsAgainst":  78,
        "points":  43,
        "titles":  0
    },
    {
        "club":  "Chamois Niortais SF",
        "seasons":  1,
        "played":  38,
        "won":  11,
        "drawn":  10,
        "lost":  17,
        "goalsFor":  34,
        "goalsAgainst":  42,
        "points":  43,
        "titles":  0
    },
    {
        "club":  "FC Gueugnon",
        "seasons":  1,
        "played":  38,
        "won":  8,
        "drawn":  14,
        "lost":  16,
        "goalsFor":  27,
        "goalsAgainst":  46,
        "points":  38,
        "titles":  0
    },
    {
        "club":  "GFC Ajaccio",
        "seasons":  1,
        "played":  38,
        "won":  8,
        "drawn":  13,
        "lost":  17,
        "goalsFor":  37,
        "goalsAgainst":  58,
        "points":  37,
        "titles":  0
    },
    {
        "club":  "AS Béziers",
        "seasons":  1,
        "played":  34,
        "won":  9,
        "drawn":  6,
        "lost":  19,
        "goalsFor":  38,
        "goalsAgainst":  77,
        "points":  33,
        "titles":  0
    },
    {
        "club":  "Istres FC",
        "seasons":  1,
        "played":  38,
        "won":  6,
        "drawn":  14,
        "lost":  18,
        "goalsFor":  25,
        "goalsAgainst":  51,
        "points":  32,
        "titles":  0
    },
    {
        "club":  "Berrichonne Châteauroux",
        "seasons":  1,
        "played":  34,
        "won":  8,
        "drawn":  7,
        "lost":  19,
        "goalsFor":  31,
        "goalsAgainst":  59,
        "points":  31,
        "titles":  0
    },
    {
        "club":  "US Boulogne",
        "seasons":  1,
        "played":  38,
        "won":  7,
        "drawn":  10,
        "lost":  21,
        "goalsFor":  31,
        "goalsAgainst":  62,
        "points":  31,
        "titles":  0
    },
    {
        "club":  "AC Avignon",
        "seasons":  1,
        "played":  38,
        "won":  7,
        "drawn":  6,
        "lost":  25,
        "goalsFor":  30,
        "goalsAgainst":  80,
        "points":  27,
        "titles":  0
    },
    {
        "club":  "AS Aix",
        "seasons":  1,
        "played":  38,
        "won":  6,
        "drawn":  8,
        "lost":  24,
        "goalsFor":  48,
        "goalsAgainst":  95,
        "points":  26,
        "titles":  0
    },
    {
        "club":  "AC Arlésien",
        "seasons":  1,
        "played":  38,
        "won":  3,
        "drawn":  11,
        "lost":  24,
        "goalsFor":  21,
        "goalsAgainst":  70,
        "points":  20,
        "titles":  0
    },
    {
        "club":  "Club Français",
        "seasons":  1,
        "played":  18,
        "won":  5,
        "drawn":  3,
        "lost":  10,
        "goalsFor":  43,
        "goalsAgainst":  50,
        "points":  18,
        "titles":  0
    },
    {
        "club":  "Hyères FC",
        "seasons":  1,
        "played":  18,
        "won":  4,
        "drawn":  4,
        "lost":  10,
        "goalsFor":  22,
        "goalsAgainst":  29,
        "points":  16,
        "titles":  0
    }
];
