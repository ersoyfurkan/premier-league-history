const fs = require('fs');
const rows = fs.readFileSync('rsssf.txt', 'utf8').split('\n').slice(1, 41);
const names = {
  'Real Madrid CF': 'Real Madrid',
  'FC Barcelona': 'Barcelona',
  'Atl\ufffdtico de Madrid': 'Atlético Madrid',
  'Athletic Club (Bilbao)': 'Athletic Club',
  'Valencia CF': 'Valencia',
  'Sevilla FC': 'Sevilla',
  'RCD Espanyol de Barcelona': 'Espanyol',
  'Real Sociedad (San Sebasti\ufffdn)': 'Real Sociedad',
  'Real Betis Balompi\ufffd': 'Real Betis',
  'RC Celta de Vigo': 'Celta Vigo',
  'Real Zaragoza': 'Real Zaragoza',
  'RC Deportivo de La Coru\ufffda': 'Deportivo La Coruña',
  'Real Valladolid CF': 'Real Valladolid',
  'CA Osasuna (Pamplona)': 'Osasuna',
  'Villarreal CF': 'Villarreal',
  'Real Racing Club de Santander': 'Racing Santander',
  'Real Sporting de Gij\ufffdn': 'Sporting Gijón',
  'Real CD Mallorca': 'Mallorca',
  'Real Oviedo': 'Real Oviedo',
  'UD Las Palmas': 'Las Palmas',
  'Getafe CF': 'Getafe',
  'Rayo Vallecano de Madrid': 'Rayo Vallecano',
  'Granada CF': 'Granada',
  'M\ufffdlaga CF': 'Málaga',
  'Deportivo Alav\ufffds (Vitoria)': 'Alavés',
  'Elche CF': 'Elche',
  'Levante UD (Valencia)': 'Levante',
  'CD M\ufffdlaga\u2009': 'CD Málaga',
  'H\ufffdrcules de Alicante CF': 'Hércules',
  'CD Tenerife': 'Tenerife',
  'C\ufffddiz CF': 'Cádiz',
  'Real Murcia CF': 'Real Murcia',
  'UD Salamanca\u2009': 'UD Salamanca',
  'CE Sabadell FC': 'Sabadell',
  'SD Eibar': 'Eibar',
  'UD Almer\ufffda': 'Almería',
  'CD Logro\ufffd\ufffds\u2009(Logro\ufffdo)': 'CD Logroñés',
  'CD Castell\ufffdn': 'CD Castellón',
  'Girona FC': 'Girona',
  'Albacete Balompi\ufffd': 'Albacete',
};
const titles = { 'Real Madrid': 36, Barcelona: 29, 'Atlético Madrid': 11, 'Athletic Club': 8, Valencia: 6, Sevilla: 1, 'Real Sociedad': 2, 'Real Betis': 1, 'Deportivo La Coruña': 1 };
const out = [];
for (const r of rows) {
  const c = r.split(' | ');
  const raw = c[1].replace('&nbsp;', '').replace('&#8201;', '\u2009');
  const club = names[raw] || 'UNKNOWN:' + raw;
  const [seasons, pts, mp, mw, md, ml, gf, gc] = c.slice(3, 11).map(Number);
  if (mw + md + ml !== mp) console.error('INCONSISTENT', club);
  out.push(`  { club: '${club}', seasons: ${seasons}, played: ${mp}, won: ${mw}, drawn: ${md}, lost: ${ml}, goalsFor: ${gf}, goalsAgainst: ${gc}, points: ${pts}, titles: ${titles[club] || 0} },`);
}
fs.writeFileSync('alltime.out', out.join('\n'));
console.log(out.filter((l) => l.includes('UNKNOWN') || l.includes('\ufffd')).join('\n'));
