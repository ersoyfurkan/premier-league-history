const fs = require('fs');
const w = JSON.parse(fs.readFileSync('rec.json', 'utf8')).parse.wikitext;
fs.writeFileSync('rec.txt', w);
const i = w.search(/all-time/i);
console.log(w.length, i);
const heads = [...w.matchAll(/^==+[^=\n]+==+/gm)].map((m) => m.index + ' ' + m[0]);
console.log(heads.join('\n'));
