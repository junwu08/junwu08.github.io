# Jun Wu Academic Homepage

English-language academic homepage: [junwu08.github.io](https://junwu08.github.io/).

The layout follows [Boyu Ning's homepage](https://boyuning.github.io/): top navigation, a profile sidebar, a single-page CV, and illustrated first-author publication entries. Jun Wu's original portrait and academic information are retained.

## Content

- 10 first-author journal articles, 4 first-author conference papers, 14 coauthored journal articles, and 4 coauthored conference papers.
- 2 additional first-author manuscripts listed separately as under review; they are not included in the published-paper count or BibTeX export.
- Research introductions, DOI/publisher links, available arXiv/PDF links, and expandable BibTeX with a copy button.
- Original paper figures for 8 first-author journal articles and 1 ICASSP paper. Two other journal entries use original diagrams explicitly labeled `Conceptual illustration`.
- Research interests, education and GPAs, visiting appointments, awards, tutorials, and academic service.
- Responsive navigation, keyboard focus indicators, a back-to-top link, and support for legacy links.

## Content sources

Publication metadata was checked against ORCID, Crossref, arXiv, and publisher records on **2026-10-15**. Formal publication years and early-access dates are kept distinct; a DOI's year is not treated as the final publication year.

Personal information was reconciled with the owner-provided CV on **2026-10-15**. Awards, service appointments, GPAs, and submission statuses are supplied by the owner rather than independently certified. The owner specifically confirmed that the IEEE Transactions on Mobile Computing Best Paper Award was received in **2025** for **Co-Design of Sensing, Communications, and Control for Low-Altitude Wireless Networks**.

The two additional submissions remain labeled `Under review`. Formation Control for CRLB-Optimal Cooperative Sensing in Low-Altitude Wireless Networks retains its verified published record, which supersedes the CV's earlier submission status. ESI highlights are retained from the original website and CV; no independent ESI database verification is claimed. The source CV is not hosted in this repository.

`data/publications.json` stores per-paper sources, verification dates, and figure attribution. Research introductions are paraphrases labeled `Abstract (summary)`. Three conference entries without an accessible original abstract display only a title-supported `Research topic`.

## Editing

1. Edit personal information, experience, news, awards, and submissions in `templates/index.html`.
2. Update published-paper metadata in `data/publications.json`; place paper thumbnails in `assets/papers/`.
3. Run `node scripts/build.mjs` from the repository root to regenerate `index.html` and `assets/publications.bib`.
4. Run `node scripts/check.mjs` to check internal links, assets, authorship groups, and bibliography completeness.

No dependencies need to be installed. The deployed website is static HTML, CSS, and JavaScript. Publications, abstracts, and primary navigation remain available without JavaScript. Node.js is only needed when regenerating the static files.

## GitHub Pages

Publish from the root of the `main` branch. Keep `index.html` at the repository root. `.nojekyll` prevents Jekyll from excluding static assets.

`publications.html` redirects to the homepage's publications section. The script preserves older anchors such as `#education`, `#publications`, and `#awards`.

## Layout and image attribution

`assets/css/reference-theme.css` is adapted from the compiled stylesheet of [boyuning/boyuning.github.io](https://github.com/boyuning/boyuning.github.io), based on AcadHomepage / Minimal Mistakes. Its MIT license is retained in `LICENSE-THEME`. `styles.css` supplies this site's navigation, accessibility, and mobile adaptations. The reference author's portrait, publication figures, and biography are not reused.

Paper figures come from the author's arXiv submissions; source links are recorded in `data/publications.json`. Only display thumbnails are hosted, not publisher full texts. Conceptual illustrations depict research scenarios, not experimental results.
