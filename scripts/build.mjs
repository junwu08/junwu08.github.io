import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFileSync(path.join(root, name), 'utf8');
const papers = JSON.parse(read('data/publications.json'));
const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const link = (url, text) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
const initials = name => {
  const words = name.split(' ');
  return words.slice(0, -1).map(w => w.includes('-') ? w.split('-').map(c => c[0] + '.').join('-') : w[0] + '.').join(' ') + ' ' + words.at(-1);
};
const authorText = (authors, short = false) => authors.map(name => {
  const text = escape(short ? initials(name) : name);
  return name === 'Jun Wu' ? `<strong>${text}</strong>` : text;
}).join(', ');
const bibliographicTail = p => [
  `<em>${escape(p.venue)}</em>`,
  p.volume && `vol. ${escape(p.volume)}`,
  p.issue && `no. ${escape(p.issue)}`,
  p.articleNumber ? `Art. no. ${escape(p.articleNumber)}` : p.pages && `${p.pages.includes('-') ? 'pp.' : 'Art. no.'} ${escape(p.pages.replaceAll('-', '–'))}`,
  p.type === 'journal' && !p.volume && 'early access',
  String(p.year)
].filter(Boolean).join(', ');
const citation = p => `${authorText(p.authors, true)}, “${escape(p.title)},” ${bibliographicTail(p)}. DOI: ${link(`https://doi.org/${p.doi}`, escape(p.doi))}.`;
const bibEscape = text => String(text).replaceAll('&', '\\&').replaceAll('%', '\\%').replaceAll('_', '\\_');
const bibtex = p => {
  const fields = {
    author: p.authors.join(' and '), title: `{${p.title}}`,
    [p.type === 'conference' ? 'booktitle' : 'journal']: p.venue,
    year: p.year, volume: p.volume, number: p.issue,
    pages: p.articleNumber ? null : p.pages?.replaceAll('-', '--'),
    doi: p.doi, url: `https://doi.org/${p.doi}`
  };
  if (p.articleNumber) fields.note = `Article ${p.articleNumber}`;
  else if (p.type === 'journal' && !p.volume) fields.note = 'Early access';
  return `@${p.type === 'conference' ? 'inproceedings' : 'article'}{wu${p.year}_${p.id.replaceAll('-', '_')},\n${Object.entries(fields).filter(([,v]) => v !== null && v !== undefined).map(([k,v]) => `  ${k} = {${bibEscape(v)}}`).join(',\n')}\n}`;
};

function featured(p, number) {
  const image = p.image;
  const figure = image ? `<div class="paper-box-image"><div><span class="badge">${escape(p.shortVenue)}</span>${link(image.path, `<img src="${escape(image.path)}" alt="${escape(image.caption)}" width="${image.width || 600}" height="${image.height || 360}" loading="lazy" decoding="async">`)}${image.kind === 'conceptual' ? '<small class="figure-note">Conceptual illustration</small>' : ''}</div></div>` : '';
  const summary = p.summary ? `<li><strong>${escape(p.summaryLabel || 'Abstract')}</strong>${p.summaryLabel === 'Research topic' ? '' : ' <span class="abstract-note">(summary)</span>'}:<details class="paper-abstract"><summary>Read more</summary><p>${escape(p.summary)}</p>${link(`https://doi.org/${p.doi}`, 'View the published paper →')}</details></li>` : '';
  const id = `bib-${p.id}`;
  return `<div class="paper-box${image ? '' : ' no-figure'}" id="paper-${escape(p.id)}">
    ${figure}<div class="paper-box-text">
      ${image ? '' : `<span class="venue-tag">${escape(p.shortVenue)}</span>`}
      <h3 class="paper-title">[${number}] ${link(p.url || `https://doi.org/${p.doi}`, escape(p.title))}</h3>
      ${p.highlight ? `<p class="paper-highlight">${escape(p.highlight)}</p>` : ''}
      <p class="paper-authors">🧑‍🎓 ${authorText(p.authors)}</p>
      <ul class="paper-details">${summary}<li><strong>Citation</strong>: ${citation(p)}</li></ul>
      <p class="paper-links">${link(`https://doi.org/${p.doi}`, 'DOI / Publisher')}${p.arxiv ? link(`https://arxiv.org/abs/${p.arxiv}`, 'arXiv') : ''}${p.pdf ? link(p.pdf, 'PDF') : ''}</p>
      <details class="bibtex"><summary>BibTeX</summary><pre id="${id}">${escape(bibtex(p))}</pre><button class="copy-bibtex" type="button" data-copy="${id}" hidden>Copy BibTeX</button></details>
    </div>
  </div>`;
}
function compact(p) {
  return `<li id="paper-${escape(p.id)}"><span class="venue-tag">${escape(p.shortVenue)} ${p.year}</span> ${authorText(p.authors, true)}, “${link(p.url || `https://doi.org/${p.doi}`, escape(p.title))},” ${bibliographicTail(p)}.${p.highlight ? ` <strong class="paper-highlight">${escape(p.highlight)}</strong>` : ''}</li>`;
}
const journalOrder = ['formation-control','lawns-swipt','multifunctional-lawns','lawn-survey','dual-functional-lawn','sdr-otfs-isac','aerial-covert','minimum-ber','uav-isac-security','sensing-communication-interplay'];
const journals = papers.filter(p => p.firstAuthor && p.type === 'journal').sort((a,b) => journalOrder.indexOf(a.id)-journalOrder.indexOf(b.id));
const conferences = papers.filter(p => p.firstAuthor && p.type === 'conference').sort((a,b) => b.year-a.year);
let html = read('templates/index.html');
for (const [marker,content] of [
  ['FIRST_AUTHOR_JOURNALS', journals.map((p,i) => featured(p, journals.length-i)).join('\n')],
  ['FIRST_AUTHOR_CONFERENCES', conferences.map((p,i) => featured(p, conferences.length-i)).join('\n')],
  ['COLLABORATED_JOURNALS', papers.filter(p => !p.firstAuthor && p.type === 'journal').sort((a,b) => b.year-a.year).map(compact).join('\n')],
  ['COLLABORATED_CONFERENCES', papers.filter(p => !p.firstAuthor && p.type === 'conference').sort((a,b) => b.year-a.year).map(compact).join('\n')]
]) html = html.replace(`<!-- ${marker} -->`, content);
writeFileSync(path.join(root, 'index.html'), html.replace(/[ \t]+$/gm, ''));
mkdirSync(path.join(root, 'assets'), {recursive:true});
writeFileSync(path.join(root, 'assets/publications.bib'), papers.map(bibtex).join('\n\n')+'\n');
console.log(`Built ${papers.length} publications (${journals.length} first-author journals, ${conferences.length} first-author conference papers).`);
