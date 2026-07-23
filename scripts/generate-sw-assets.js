const fs = require('fs');
const path = require('path');
const appDir = path.join(__dirname, '..', 'app');

const exts = ['.html', '.css', '.js', '.png', '.jpg', '.json', '.xml', '.ico'];
const skip = ['dsapp'];

const files = [];
function walk(dir, prefix) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (skip.includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, prefix + e.name + '/');
    else if (exts.includes(path.extname(e.name).toLowerCase()))
      files.push('/' + prefix + e.name);
  }
}
walk(appDir, '');

files.sort();

let assets = `const CACHE = 'greatbook-v4'\nconst assets = [\n`;
for (const f of files) {
  assets += `  '${f}',\n`;
}
assets += ']\n\n';

const swPath = path.join(appDir, 'sw.js');
const existing = fs.readFileSync(swPath, 'utf8');
const idx = existing.indexOf('\n\n');
const newSw = assets + existing.slice(idx + 2);

fs.writeFileSync(swPath, newSw);
console.log('sw.js updated with ' + files.length + ' assets');
