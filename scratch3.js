const fs = require('fs');
let w = fs.readFileSync('champs.txt', 'utf8');
w = w.slice(w.indexOf('|[[1929 La Liga'));
w = w.slice(0, w.indexOf('|}'));
const clean = (s) =>
  s
    .replace(/\{\{efn[^}]*\}\}/g, '')
    .replace(/\{\{sortname\|([^|}]*)\|([^|}]*)[^}]*\}\}/g, '$1 $2')
    .replace(/<sup>.*?<\/sup>/g, '')
    .replace(/<ref.*?(\/>|<\/ref>)/g, '')
    .replace(/bgcolor=\w+\|/g, '')
    .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2')
    .replace(/\(\d+\)/g, '')
    .trim();
const rows = w.split('\n|-\n');
for (const r of rows) {
  const cells = r.split('\n').filter((l) => l.startsWith('|') && !l.startsWith('|-')).map((l) => clean(l.slice(1)));
  console.log(cells.join(' ; '));
}
