const fs = require('fs');
let h = fs.readFileSync('rsssf.html', 'utf8');
const rows = h.split(/<tr/i).slice(1);
const out = rows.map((r) => [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()).join(' | '));
fs.writeFileSync('rsssf.txt', out.join('\n'));
console.log(out.length);
console.log(out.slice(0, 12).join('\n'));
