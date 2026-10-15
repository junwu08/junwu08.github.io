(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menu = document.querySelector('.menu-toggle');
  const links = document.getElementById('main-links');
  if (menu && links) {
    menu.hidden = false;
    const closeMenu = () => {
      menu.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      links.classList.toggle('is-open', open);
    });
    links.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menu.focus();
      }
    });
    window.matchMedia('(min-width: 925px)').addEventListener('change', closeMenu);
  }
  const aliases = {
    '#home': '#about-me', '#about': '#about-me', '#research': '#about-me',
    '#education': '#-educations', '#news': '#-news', '#awards': '#-honors-and-awards',
    '#publications': '#-publications', '#service': '#-academic-service', '#contact': '#about-me'
  };
  const resolveHash = () => {
    const replacement = aliases[window.location.hash];
    if (replacement) {
      history.replaceState(null, '', replacement);
      document.getElementById(replacement.slice(1))?.scrollIntoView();
    }
  };
  resolveHash();
  window.addEventListener('hashchange', resolveHash);
  const navLinks = [...document.querySelectorAll('.main-links a')];
  const sections = navLinks.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
  const topLink = document.querySelector('.back-to-top');
  let scrollQueued = false;
  const updateNavigation = () => {
    const mastheadHeight = document.querySelector('.masthead')?.offsetHeight || 53;
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= mastheadHeight + 40) current = section.id;
    }
    for (const link of navLinks) {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    if (topLink) topLink.hidden = window.scrollY < 500;
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateNavigation); }
  }, {passive: true});
  updateNavigation();
  document.querySelectorAll('.copy-bibtex').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const source = document.getElementById(button.dataset.copy);
      const status = document.getElementById('copy-status');
      if (!source) return;
      try {
        await navigator.clipboard.writeText(source.textContent);
        button.textContent = 'Copied!';
        if (status) status.textContent = 'BibTeX citation copied to clipboard.';
        window.setTimeout(() => { button.textContent = 'Copy BibTeX'; }, 2000);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(source);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Selected — press Ctrl/Cmd+C';
        if (status) status.textContent = 'Automatic copy is unavailable. The citation is selected; press Control+C or Command+C to copy.';
      }
    });
  });
})();
