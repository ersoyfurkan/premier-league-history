const fs = require('fs');
const o = JSON.parse(fs.readFileSync('espn.json', 'utf8'));
for (const e of o.children[0].standings.entries) console.log(e.team.id, e.team.displayName);
for (const f of ['champs.json', 'pich.json']) {
  const w = JSON.parse(fs.readFileSync(f, 'utf8')).parse.wikitext;
  fs.writeFileSync(f.replace('.json', '.txt'), w);
}
