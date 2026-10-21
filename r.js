const fs = require('fs');
const [, , f, a, b] = process.argv;
const w = JSON.parse(fs.readFileSync(f, 'utf8')).parse.wikitext;
console.log(w.split('\n').slice(+a, +b).map((l) => l.slice(0, 500)).join('\n'));
