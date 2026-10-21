const fs = require("fs");
const B = ["Barcelona", "83"], R = ["Real Madrid", "86"], A = ["Atlético Madrid", "1068"], AT = ["Athletic Club", "93"],
  S = ["Sevilla", "243"], V = ["Valencia", "94"], RS = ["Real Sociedad", "89"], C = ["Celta Vigo", "85"],
  VI = ["Villarreal", "102"], E = ["Espanyol", "88"], D = ["Deportivo", "90"], O = ["Osasuna", "97"], N = [];
// [name, apps, goals, assists, club, search name (optional)]
const rows = [
  ["Lionel Messi", 520, 474, 217, B],
  ["Cristiano Ronaldo", 292, 311, 91, R],
  ["Telmo Zarra", 277, 251, 15, AT],
  ["Karim Benzema", 439, 238, 104, R],
  ["Hugo Sánchez", 347, 234, 45, R],
  ["Raúl", 550, 228, 70, R, "Raúl González"],
  ["Alfredo Di Stéfano", 329, 227, 60, R],
  ["César Rodríguez", 353, 221, 35, B],
  ["Quini", 448, 219, 55, ["Sporting Gijón"]],
  ["Pahiño", 278, 212, 25, C],
  ["Antoine Griezmann", 564, 205, 108, A],
  ["Mundo", 231, 195, 20, V],
  ["David Villa", 352, 186, 45, V],
  ["Santillana", 461, 186, 75, R],
  ["Guillermo Gorostiza", 255, 183, 30, AT],
  ["Juan Arza", 349, 182, 40, S],
  ["Luis Suárez", 258, 179, 80, B, "Luis Suárez"],
  ["Iago Aspas", 426, 171, 80, C],
  ["Samuel Eto'o", 280, 162, 40, B],
  ["Luis Aragonés", 360, 160, 55, A],
  ["Aritz Aduriz", 443, 158, 40, AT],
  ["Ferenc Puskás", 180, 156, 30, R],
  ["Julio Salinas", 417, 152, 40, B],
  ["Adrián Escudero", 287, 150, 25, A],
  ["Dani", 303, 147, 40, AT],
  ["Raúl Tamudo", 407, 146, 45, E],
  ["José Mari Bakero", 484, 139, 85, B],
  ["László Kubala", 215, 138, 35, B],
  ["José Luis Panizo", 326, 136, 30, AT],
  ["Jesús María Satrústegui", 297, 133, 50, RS],
  ["Gerard Moreno", 352, 133, 55, VI],
  ["Ismael Urzaiz", 438, 133, 35, AT],
  ["Lyuboslav Penev", 305, 129, 40, V],
  ["Roberto Soldado", 323, 129, 30, V],
  ["Paco Gento", 437, 129, 70, R],
  ["Diego Forlán", 240, 128, 35, A],
  ["Álvaro Negredo", 361, 128, 40, S],
  ["Mario Kempes", 222, 126, 25, V],
  ["Fernando Morientes", 337, 124, 35, R],
  ["Emilio Butragueño", 341, 123, 60, R],
  ["Pirri", 417, 123, 40, R],
  ["Amancio", 344, 119, 55, R],
  ["Ronaldo", 164, 117, 30, R, "Ronaldo Nazário"],
  ["Cristhian Stuani", 345, 116, 28, ["Girona"]],
  ["Waldo", 216, 115, 25, V],
  ["Davor Šuker", 239, 114, 25, R],
  ["Raúl García", 609, 112, 50, AT],
  ["Fernando Gómez", 420, 108, 50, V],
  ["Gonzalo Higuaín", 190, 107, 45, R],
  ["Rivaldo", 198, 107, 45, B],
  ["Fernando Torres", 281, 102, 35, A],
  ["Mikel Oyarzabal", 358, 102, 60, RS],
  ["Fernando Hierro", 497, 105, 40, R],
  ["Luis Enrique", 400, 103, 65, B],
  ["Julen Guerrero", 372, 101, 40, AT],
  ["Roy Makaay", 205, 100, 25, D],
  ["Juan Araujo", 207, 139, 25, S],
  ["Hermidita", 160, 104, 15, C],
  ["José Eulogio Gárate", 241, 109, 25, A],
  ["Bata", 118, 108, 10, AT],
  ["José Luis Artetxe", 276, 107, 25, AT],
  ["Guillermo Campanal", 157, 102, 15, S],
  ["Agustín Gaínza", 380, 117, 40, AT],
  ["Eneko Arieta", 244, 128, 25, AT],
  ["José Ángel Ziganda", 381, 111, 30, O],
  ["Roberto López Ufarte", 418, 112, 60, RS],
  ["Mariano Martín", 130, 107, 10, B],
  ["Robert Lewandowski", 134, 83, 22, B],
  ["Kylian Mbappé", 74, 65, 8, R],
  ["Vinícius Júnior", 250, 78, 68, R],
  ["Lamine Yamal", 110, 38, 32, B],
  ["Xavi", 505, 58, 95, B, "Xavi Hernández"],
  ["Andrés Iniesta", 442, 35, 70, B],
  ["Sergio Busquets", 481, 11, 25, B],
  ["Carles Puyol", 392, 12, 15, B],
  ["Sergio Ramos", 536, 77, 25, R],
  ["Luka Modrić", 394, 30, 60, R],
  ["Toni Kroos", 306, 22, 68, R],
  ["Gareth Bale", 176, 81, 45, R],
  ["Neymar", 123, 68, 43, B, "Neymar"],
  ["Ronaldinho", 145, 70, 45, B],
  ["Luís Figo", 336, 68, 70, B, "Luis Figo"],
  ["Zinedine Zidane", 155, 37, 33, R],
  ["Michael Laudrup", 228, 53, 50, B],
  ["Hristo Stoichkov", 175, 83, 40, B],
  ["Predrag Mijatović", 194, 85, 30, R],
  ["Roberto Carlos", 370, 47, 70, R],
  ["Fernando Redondo", 268, 12, 15, R],
  ["Pep Guardiola", 263, 6, 20, B],
  ["Ronald Koeman", 192, 67, 25, B],
  ["Bebeto", 154, 104, 40, D],
  ["Jorge Valdano", 333, 106, 40, R],
  ["Iván Zamorano", 196, 98, 30, R],
  ["Cesc Fàbregas", 96, 28, 36, B],
  ["Dani Alves", 422, 25, 100, B],
  ["Gerard Piqué", 419, 31, 16, B],
  ["Marcelo", 386, 26, 52, R, "Marcelo Vieira"],
  ["Casemiro", 222, 24, 18, R],
  ["Isco", 399, 72, 60, R],
  ["Álvaro Morata", 187, 71, 20, A],
  ["Raphaël Varane", 236, 8, 6, R],
  ["Jordi Alba", 387, 22, 85, B],
  ["Santi Cazorla", 323, 54, 50, VI],
  ["Ivan Rakitić", 438, 61, 65, B],
  ["Pedri", 174, 23, 25, B],
  ["Gavi", 121, 6, 12, B],
  ["Raphinha", 130, 56, 35, B],
  ["Rodrygo", 191, 33, 28, R],
  ["Jude Bellingham", 96, 37, 20, R],
  ["Federico Valverde", 253, 25, 34, R],
  ["Julián Álvarez", 71, 25, 14, A],
  ["Ferran Torres", 211, 47, 28, B],
  ["Dani Olmo", 67, 18, 12, B],
  ["Juan Mata", 129, 33, 40, V],
  ["David Silva", 193, 27, 40, V],
  ["Xabi Alonso", 272, 13, 35, R],
  ["Nico Williams", 163, 23, 30, AT],
  ["Sergio Agüero", 179, 75, 35, A],
  ["Diego Simeone", 198, 35, 15, A],
];
const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z ]/g, "").trim();
async function photo(name) {
  try {
    const r = await fetch("https://site.web.api.espn.com/apis/common/v3/search?query=" + encodeURIComponent(name) + "&type=player&limit=5");
    const j = await r.json();
    const hit = (j.items || []).find((i) => i.sport === "soccer" && norm(i.displayName) === norm(name));
    if (!hit) return { cand: (j.items || []).map((i) => i.displayName + ":" + i.id).join(", ") };
    const url = `https://a.espncdn.com/i/headshots/soccer/players/full/${hit.id}.png`;
    const h = await fetch(url);
    if (h.status === 200 && (h.headers.get("content-type") || "").startsWith("image/")) {
      const buf = await h.arrayBuffer();
      if (buf.byteLength > 1500) return { url, id: hit.id, dn: hit.displayName, desc: hit.description || "" };
    }
    return { cand: "headshot missing for " + hit.id };
  } catch (e) { return { cand: "err " + e.message }; }
}
(async () => {
  const out = [];
  let withPhoto = 0;
  for (let i = 0; i < rows.length; i++) {
    const [name, apps, goals, assists, club, q] = rows[i];
    const p = await photo(q || name);
    const o = { id: "ll" + (i + 1), name, appearances: apps, goals, assists };
    if (p.url) { o.photo = p.url; withPhoto++; }
    o.club = club[0];
    if (club[1]) o.clubId = club[1];
    out.push(o);
    console.log(o.id, name, p.url ? "OK " + p.id + " " + p.desc : "NO " + (p.cand || ""));
  }
  const body = out.map((o) => "  " + JSON.stringify(o).replace(/"(\w+)":/g, "$1: ").replace(/,(\w)/g, ", $1").replace(/^\{/, "{ ").replace(/\}$/, " }") + ",").join("\n");
  fs.writeFileSync("data/laLigaCards.ts", `import type { PlayerCard } from "@/data/players";\n\nexport const LALIGA_CARDS: PlayerCard[] = [\n${body}\n];\n`, "utf8");
  console.log("total", out.length, "photos", withPhoto);
})();
