import type { Competition } from "@/lib/competitions";

export type SeasonMetric = "goals" | "assists" | "redCards";
export type SeasonStat = {
  source: string;
  minimum: number;
  rows: { name: string; team: string; value: number }[];
};
export type SeasonSnapshot = {
  comp: Competition;
  label: string;
  champion: string;
  stats: Partial<Record<SeasonMetric, SeasonStat>>;
};
const rows = (raw: string) => raw.split("|").map((item) => {
  const [name, team, value] = item.split("/");
  return { name, team, value: Number(value) };
});

// Each minimum is the lowest total covered completely, including tied players.
export const STAT_SEASONS: SeasonSnapshot[] = [
  {
    comp: "laliga", label: "La Liga 2023/24", champion: "Real Madrid",
    stats: {
      goals: {
        source: "https://en.wikipedia.org/wiki/2023%E2%80%9324_La_Liga", minimum: 16,
        rows: rows("Artem Dovbyk/Girona/24|Alexander Sorloth/Villarreal/23|Jude Bellingham/Real Madrid/19|Robert Lewandowski/Barcelona/19|Ante Budimir/Osasuna/17|Antoine Griezmann/Atletico Madrid/16|Youssef En-Nesyri/Sevilla/16"),
      },
      assists: {
        source: "https://www.statbunker.com/competitions/MostAssists?comp_id=753", minimum: 10,
        rows: rows("Alex Baena/Villarreal/14|Nico Williams/Athletic Bilbao/11|Iago Aspas/Celta Vigo/10|Savinho/Girona/10"),
      },
    },
  },
  {
    comp: "seriea", label: "Serie A 2023/24", champion: "Inter Milan",
    stats: {
      goals: {
        source: "https://en.wikipedia.org/wiki/2023%E2%80%9324_Serie_A", minimum: 13,
        rows: rows("Lautaro Martinez/Inter Milan/24|Dusan Vlahovic/Juventus/16|Olivier Giroud/AC Milan/15|Victor Osimhen/Napoli/15|Albert Gudmundsson/Genoa/14|Hakan Calhanoglu/Inter Milan/13|Paulo Dybala/Roma/13|Romelu Lukaku/Roma/13|Marcus Thuram/Inter Milan/13|Duvan Zapata/Atalanta and Torino/13"),
      },
    },
  },
  {
    comp: "bundesliga", label: "Bundesliga 2023/24", champion: "Bayer Leverkusen",
    stats: {
      goals: {
        source: "https://en.wikipedia.org/wiki/2023%E2%80%9324_Bundesliga", minimum: 13,
        rows: rows("Harry Kane/Bayern Munich/36|Serhou Guirassy/VfB Stuttgart/28|Lois Openda/RB Leipzig/24|Deniz Undav/VfB Stuttgart/18|Maximilian Beier/TSG Hoffenheim/16|Ermedin Demirovic/FC Augsburg/15|Andrej Kramaric/TSG Hoffenheim/15|Victor Boniface/Bayer Leverkusen/14|Benjamin Sesko/RB Leipzig/14|Donyell Malen/Borussia Dortmund/13"),
      },
      assists: {
        source: "https://www.bundesliga.com/en/bundesliga/stats/players/assists/2023-2024", minimum: 10,
        rows: rows("Alejandro Grimaldo/Bayer Leverkusen/13|Leroy Sane/Bayern Munich/11|Julian Brandt/Borussia Dortmund/11|Florian Wirtz/Bayer Leverkusen/11|Xavi Simons/RB Leipzig/11|Jan-Niklas Beste/Heidenheim/11"),
      },
    },
  },
  {
    comp: "ligue1", label: "Ligue 1 2023/24", champion: "Paris Saint-Germain",
    stats: {
      goals: {
        source: "https://en.wikipedia.org/wiki/2023%E2%80%9324_Ligue_1", minimum: 10,
        rows: rows("Kylian Mbappe/Paris Saint-Germain/27|Jonathan David/Lille/19|Alexandre Lacazette/Lyon/19|Pierre-Emerick Aubameyang/Marseille/17|Wissam Ben Yedder/Monaco/16|Thijs Dallinga/Toulouse/14|Georges Mikautadze/Metz/13|Terem Moffi/Nice/11|Goncalo Ramos/Paris Saint-Germain/11|Arnaud Kalimuendo/Rennes/10"),
      },
    },
  },
  {
    comp: "worldcup", label: "2022 men's World Cup finals (no qualifiers)", champion: "Argentina",
    stats: {
      goals: {
        source: "https://en.wikipedia.org/wiki/2022_FIFA_World_Cup", minimum: 3,
        rows: rows("Kylian Mbappe/France/8|Lionel Messi/Argentina/7|Julian Alvarez/Argentina/4|Olivier Giroud/France/4|Goncalo Ramos/Portugal/3|Alvaro Morata/Spain/3|Marcus Rashford/England/3|Bukayo Saka/England/3|Enner Valencia/Ecuador/3|Richarlison/Brazil/3|Cody Gakpo/Netherlands/3"),
      },
      assists: {
        source: "https://www.statbunker.com/competitions/MostAssists?comp_id=727", minimum: 3,
        rows: rows("Antoine Griezmann/France/3|Lionel Messi/Argentina/3|Harry Kane/England/3|Bruno Fernandes/Portugal/3|Ivan Perisic/Croatia/3"),
      },
      redCards: {
        source: "https://www.statbunker.com/competitions/TopRedCards?comp_id=727", minimum: 1,
        rows: rows("Walid Cheddira/Morocco/1|Vincent Aboubakar/Cameroon/1|Wayne Hennessey/Wales/1|Denzel Dumfries/Netherlands/1"),
      },
    },
  },
  {
    comp: "euros", label: "men's Euro 2024 finals (no qualifiers)", champion: "Spain",
    stats: {
      goals: {
        source: "https://en.wikipedia.org/wiki/UEFA_Euro_2024", minimum: 3,
        rows: rows("Dani Olmo/Spain/3|Harry Kane/England/3|Georges Mikautadze/Georgia/3|Jamal Musiala/Germany/3|Cody Gakpo/Netherlands/3|Ivan Schranz/Slovakia/3"),
      },
      assists: {
        source: "https://www.statbunker.com/competitions/MostAssists?comp_id=291", minimum: 3,
        rows: rows("Lamine Yamal/Spain/4|Xavi Simons/Netherlands/3"),
      },
      redCards: {
        source: "https://www.statbunker.com/competitions/TopRedCards?comp_id=291", minimum: 1,
        rows: rows("Bertug Yildirim/Turkey/1|Tomas Chory/Czech Republic/1|Antonin Barak/Czech Republic/1|Ryan Porteous/Scotland/1|Dani Carvajal/Spain/1"),
      },
    },
  },
  {
    comp: "copa", label: "2024 men's Copa America", champion: "Argentina",
    stats: {
      goals: {
        source: "https://en.wikipedia.org/wiki/2024_Copa_Am%C3%A9rica", minimum: 3,
        rows: rows("Lautaro Martinez/Argentina/5|Salomon Rondon/Venezuela/3"),
      },
      assists: {
        source: "https://www.statbunker.com/competitions/MostAssists?comp_id=595", minimum: 2,
        rows: rows("James Rodriguez/Colombia/6|Jon Aramburu/Venezuela/2|Nicolas de la Cruz/Uruguay/2|Alexis Mac Allister/Argentina/2|Enzo Fernandez/Argentina/2"),
      },
      redCards: {
        source: "https://www.statbunker.com/competitions/TopRedCards?comp_id=595", minimum: 1,
        rows: rows("Guillermo Varela/Uruguay/1|Adrian Cubas/Paraguay/1|Gabriel Suazo/Chile/1|Miguel Araujo/Peru/1|Timothy Weah/United States/1|Enner Valencia/Ecuador/1|Nahitan Nandez/Uruguay/1|Daniel Munoz/Colombia/1"),
      },
    },
  },
];
