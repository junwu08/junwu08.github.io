import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const papers = JSON.parse(readFileSync(path.join(root, 'data/publications.json'), 'utf8'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate HTML IDs');
assert.equal(papers.length, new Set(papers.map(p => p.doi.toLowerCase())).size, 'Duplicate DOIs');
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const url = match[1];
  if (/^(?:https?:|mailto:|data:)/.test(url)) continue;
  if (url.startsWith('#')) assert(ids.includes(url.slice(1)), `Missing anchor: ${url}`);
  else assert(existsSync(path.join(root, url.split('#')[0])), `Missing local file: ${url}`);
}
for (const p of papers) {
  assert(/^10\.\d{4,9}\//.test(p.doi), `Invalid DOI: ${p.title}`);
  assert(p.authors.includes('Jun Wu'), `Missing author: ${p.title}`);
  assert.equal(p.firstAuthor, p.authors[0] === 'Jun Wu', `Wrong authorship group: ${p.title}`);
  assert(p.sources.length > 0, `Missing provenance: ${p.title}`);
  if (p.firstAuthor) {
    assert(p.summary, `Missing first-author introduction: ${p.title}`);
    assert(ids.includes(`paper-${p.id}`), `Missing publication entry: ${p.title}`);
    assert(ids.includes(`bib-${p.id}`), `Missing BibTeX: ${p.title}`);
  }
  if (p.image) {
    assert(p.image.caption && p.image.source, `Missing figure attribution: ${p.title}`);
    assert(existsSync(path.join(root, p.image.path)), `Missing figure: ${p.title}`);
  }
}
for (const image of html.matchAll(/<img\b[^>]*>/g)) assert(/alt="[^"]+"/.test(image[0]), 'Image without alt text');
assert(!/<!-- (?:FIRST_AUTHOR|COLLABORATED)_/.test(html), 'Unrendered template marker');
const bibliography = readFileSync(path.join(root, 'assets/publications.bib'), 'utf8');
assert.equal((bibliography.match(/^@(?:article|inproceedings)\{/gm)||[]).length, papers.length, 'Incomplete bibliography');
console.log(`PASS: ${papers.length} sourced publications; authorship, anchors, assets, figure descriptions, and bibliography verified.`);
