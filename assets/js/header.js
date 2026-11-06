// Header: once the page scrolls past 24px, the one-line nav becomes a pill.
const header = document.querySelector('[data-site-header]');

// Split a label into the letters its long and short versions share and the
// letters that differ ("Photo" + "graphy"/"s", "Cris" + "tian"/"" + " Valencia"),
// so CSS can collapse one part and open the other. The link keeps its full
// name for screen readers.
const splitLabel = (el) => {
  const long = el.textContent;
  const short = el.dataset.shrink;
  let start = 0;
  while (start < long.length && start < short.length && long[start] === short[start]) start++;
  let end = 0;
  while (end < long.length - start && end < short.length - start
    && long[long.length - 1 - end] === short[short.length - 1 - end]) end++;

  const part = (text, cls) => {
    const span = document.createElement('span');
    span.textContent = text;
    if (cls) span.className = cls;
    return span;
  };

  el.closest('a').setAttribute('aria-label', long);
  el.setAttribute('aria-hidden', 'true');
  el.replaceChildren(
    part(long.slice(0, start)),
    part(long.slice(start, long.length - end), 'shrink__out'),
    part(short.slice(start, short.length - end), 'shrink__in'),
    part(long.slice(long.length - end)),
  );
};

// Each changing part opens to its own natural width.
const measure = () => {
  header.querySelectorAll('.shrink__out, .shrink__in').forEach((span) => {
    span.style.maxWidth = 'none';
    span.style.setProperty('--w', `${Math.ceil(span.scrollWidth)}px`);
    span.style.maxWidth = '';
  });
};

if (header) {
  header.querySelectorAll('[data-shrink]').forEach(splitLabel);
  measure();
  if (document.fonts) document.fonts.ready.then(measure);

  // A static header (data-static, e.g. Contact) never turns into the pill:
  // it stays as it is at the top and scrolls away with the page.
  if (!header.hasAttribute('data-static')) {
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

  // Phones: the hamburger opens and closes the menu line. Escape, a tap
  // outside the header, scrolling down, or a wider screen closes it (it
  // folds away with its usual transition).
  const toggle = header.querySelector('.site-header__toggle');
  if (toggle) {
    const phone = window.matchMedia('(max-width: 700px)');
    let openedAt = 0; // scroll position when the menu opened
    let closedHeight = 0; // the header's height before it opened
    const setOpen = (open) => {
      if (open && !header.classList.contains('is-open')) {
        openedAt = window.scrollY;
        closedHeight = header.offsetHeight;
      }
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.hidden = false;
    header.classList.add('has-toggle');
    toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) setOpen(false);
    });

    // Opening makes the header taller, and the browser scrolls the page by
    // the same amount to keep the text in place; that isn't the visitor
    // scrolling, so it doesn't count. Past that, a little slack (24px) so a
    // tap's jitter doesn't close it either.
    window.addEventListener('scroll', () => {
      if (!header.classList.contains('is-open')) return;
      const grown = header.offsetHeight - closedHeight;
      if (window.scrollY > openedAt + grown + 24) setOpen(false);
    }, { passive: true });

    phone.addEventListener('change', () => setOpen(false));
  }
}

// Turn transitions on only after the first styled frame (see .is-loading).
// A timer backs it up for tabs that don't paint (frames pause in the background).
window.addEventListener('load', () => {
  const ready = () => document.documentElement.classList.remove('is-loading');
  requestAnimationFrame(() => requestAnimationFrame(ready));
  setTimeout(ready, 300);
});
