const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');
const contentDir = path.join(appDir, 'content');
if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

const chapters = [
  'fanfic_1_001', 'fanfic_1_002', 'fanfic_1_003', 'fanfic_1_004', 'fanfic_1_005',
  'fanfic_2_001', 'fanfic_2_002',
  'original_0001_prologo', 'original_0002_0001',
  'poesia_1_001'
];

chapters.forEach(name => {
  const html = fs.readFileSync(path.join(appDir, name + '.html'), 'utf8');

  const titleMatch = html.match(/<title>([^|<]+)/);
  const title = titleMatch ? titleMatch[1].trim() : name;

  const sectionMatch = html.match(/<main[^>]*>[\s\S]*<section>([\s\S]*?)<\/section>/);
  const content = sectionMatch ? sectionMatch[1].trim() : '';

  const navLinks = [...html.matchAll(/href="([a-z_0-9]+\.html)"/g)].map(m => m[1]);
  const bookLink = navLinks.find(l => l.match(/^(fanfic|original|poesia)_\d{4}\.html$/));
  const chapterLinks = navLinks.filter(l => l.match(/_(?:prologo|\d{3})\.html$/));

  let prev = null, next = null;
  const currentIdx = chapterLinks.indexOf(name + '.html');
  if (currentIdx > 0) prev = chapterLinks[currentIdx - 1];
  if (currentIdx < chapterLinks.length - 1) next = chapterLinks[currentIdx + 1];

  // Fallback: detect from HTML structure
  if (!prev && !next) {
    const homeLink = navLinks.find(l => l.match(/^(fanfic|original|poesia)_\d{4}\.html$/));
    const allLinks = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    const chapterNavLinks = allLinks.filter(l => l.match(/_(?:prologo|\d{3})\.html$/) && l !== name + '.html');
    if (chapterNavLinks.length === 1) {
      // Only one other chapter link - check direction
      const posInHtml = html.indexOf('chapter-nav');
      const linkPos = html.indexOf(chapterNavLinks[0]);
      if (linkPos > posInHtml) next = chapterNavLinks[0];
      else prev = chapterNavLinks[0];
    } else if (chapterNavLinks.length >= 2) {
      prev = chapterNavLinks[0];
      next = chapterNavLinks[1];
    }
  }

  const data = { title, book: bookLink || null, prev, next, content };
  fs.writeFileSync(path.join(contentDir, name + '.json'), JSON.stringify(data, null, 2));
  console.log(`✓ ${name}.json (${content.length} chars)`);
});
