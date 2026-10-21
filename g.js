const fs = require('fs');
const [, , f, ...pats] = process.argv;
const w = JSON.parse(fs.readFileSync(f, 'utf8')).parse.wikitext;
const re = new RegExp(pats.join('|'), 'i');
const lines = w.split('\n');
lines.forEach((l, i) => {
  if (re.test(l)) console.log(i + ': ' + l.slice(0, 400));
});
