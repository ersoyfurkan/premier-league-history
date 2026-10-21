const fs = require('fs');
const w = JSON.parse(fs.readFileSync('d_Galician_derby.json', 'utf8')).parse.wikitext;
const sec = w.slice(w.indexOf('==League matches=='), w.indexOf('==Cup matches=='));
let comp = '';
const res = [];
for (const l of sec.split('\n')) {
  if (!l.startsWith('|') || l.startsWith('|-')) continue;
  const m = l.match(/\[\[\d{4}(?:–\d\d)? ([^\]|]*)\|?/);
  if (l.includes('rowspan=2 |[[') || l.includes('rowspan=2|[[')) {
    comp = /La Liga/.test(l) ? 'LL' : 'other';
  } else if (!/rowspan/.test(l) && comp === '' ) comp = '';
  const sc = l.match(/'''(\d+)–(\d+)'''/);
  if (sc && comp === 'LL') res.push([+sc[1], +sc[2], l.slice(0, 120)]);
}
console.log(res.length);
const pairs = res.filter((r) => Math.abs(r[0] - r[1]) >= 3);
pairs.forEach((p) => console.log(p[0] + '-' + p[1] + ' ' + p[2]));
