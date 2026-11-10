// Header: once the page scrolls past 24px, the one-line nav becomes a pill.
const header = document.querySelector('[data-site-header]');

// Split a label into the letters its long and short versions share and the
// letters that differ ("Photo" + "graphy"/"s", "Cris" + "tian"/"" + " Valencia",
// "My " + "life"), so CSS can collapse one part and open the other. Letters
// are matched ignoring case, since the labels are shown in capitals. The
// link keeps its full name for screen readers.
const splitLabel = (el) => {
  const long = el.textContent;
  const short = el.dataset.shrink;
  let start = 0;
  while (start < long.length && start < short.length && long[start].toLowerCase() === short[start].toLowerCase()) start++;
  let end = 0;
  while (end < long.length - start && end < short.length - start
    && long[long.length - 1 - end].toLowerCase() === short[short.length - 1 - end].toLowerCase()) end++;

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

  // Classes are only set when they change: Safari repaints the header for
  // every rewrite of its class attribute, even an identical one.
  const set = (name, on) => {
    if (header.classList.contains(name) !== on) header.classList.toggle(name, on);
  };

  // Changes made in here skip the header's own transitions (.is-instant),
  // which come back once the new state has been drawn; then `after` runs,
  // animated.
  let instantFrame = 0;
  const instantly = (change, after) => {
    set('is-instant', true);
    change();
    getComputedStyle(header).translate; // apply the state before transitions return
    cancelAnimationFrame(instantFrame);
    instantFrame = requestAnimationFrame(() => {
      instantFrame = requestAnimationFrame(() => {
        set('is-instant', false);
        if (after) after();
      });
    });
  };

  // While Safari plays a page change (.is-revealing, default.html) the bar
  // doesn't stick to the top (main.css) and its look doesn't change: a
  // sticky bar scrolled then, or changed at all, flickered in Safari. The
  // pill is held in view by hand; the hiding bar scrolls away with the page.
  // When the change ends (the revealed event) each carries on from there.
  const revealing = () => document.documentElement.classList.contains('is-revealing');

  // The pill (home, posts): once the page scrolls past 24px the row narrows
  // into the pill. A static header (data-static, e.g. Contact) never does:
  // it stays as it is at the top and scrolls away with the page. Nor does a
  // hiding one (data-hide, below).
  if (!header.hasAttribute('data-static') && !header.hasAttribute('data-hide')) {
    let ticking = false;
    const update = () => {
      ticking = false;
      if (!revealing()) set('is-scrolled', window.scrollY > 24);
    };

    // While Safari plays a page change the bar isn't sticky, so it's held in
    // view by hand instead: moved down by as far as the page has scrolled,
    // in the same frame as the scroll, so it stays at the top.
    window.addEventListener('scroll', () => {
      if (revealing()) header.style.translate = `0 ${Math.max(0, window.scrollY)}px`;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    // When the change ends it sticks to the top again, where it already is
    // (nothing moves), and narrows into the pill if the page has scrolled.
    window.addEventListener('revealed', () => {
      if (!header.style.translate) {
        update();
        return;
      }
      instantly(() => {
        header.style.translate = '';
      }, update);
    });

    update();
  }

  // Fit: the bar takes the roomiest version that fits on one line. First the
  // full labels; if Contact would run off the end, the short ones (Cris,
  // Photos, Life), as in the scrolled pill; if even those don't fit, the
  // phone layout (.is-narrow). Phones always get the phone layout. A hidden
  // copy of the header (the probe) is laid out at its natural width in each
  // version, so the check never depends on what the bar shows right now.
  const phone = window.matchMedia('(max-width: 700px)');
  const keep = ['site-header', 'has-section', 'site-header--home', 'site-header--static', 'site-header--hide'];
  const setProbe = (probe, extra) => {
    probe.className = [...keep.filter((c) => header.classList.contains(c)), 'site-header--probe', ...extra].join(' ');
  };
  // The width a version of the bar needs, without the max-width that caps it.
  const needs = (probe, extra) => {
    setProbe(probe, extra);
    return Math.ceil(probe.querySelector('.site-header__bar').getBoundingClientRect().width);
  };
  const fit = () => {
    let narrow = phone.matches;
    let compact = false;
    if (!narrow) {
      const probe = header.cloneNode(true);
      const bar = probe.querySelector('.site-header__bar');
      probe.removeAttribute('data-site-header');
      probe.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
      probe.setAttribute('aria-hidden', 'true');
      probe.inert = true;
      probe.style.cssText = 'position:absolute;top:0;left:0;visibility:hidden;pointer-events:none;view-transition-name:none;';
      header.after(probe);
      const room = header.clientWidth;
      // Room in the scrolled pill: its own max-width, or less on a small window.
      setProbe(probe, ['is-scrolled']);
      const pillRoom = Math.min(room, parseFloat(getComputedStyle(bar).maxWidth) || room);
      bar.style.cssText = 'width:max-content;max-width:none;';
      const full = needs(probe, []);
      const short = needs(probe, ['is-compact']);
      const pill = needs(probe, ['is-scrolled']);
      probe.remove();
      // The phone layout holds at the top and in the pill alike, so the bar
      // doesn't change shape as the page scrolls.
      narrow = short > room || pill > pillRoom;
      compact = !narrow && full > room;
    }
    header.classList.toggle('is-compact', compact);
    if (header.classList.contains('is-narrow') !== narrow) {
      header.classList.toggle('is-narrow', narrow);
      header.dispatchEvent(new CustomEvent('header:narrow'));
    }
  };

  let fitting = false;
  window.addEventListener('resize', () => {
    if (!fitting) {
      fitting = true;
      requestAnimationFrame(() => { fit(); fitting = false; });
    }
  });
  phone.addEventListener('change', fit);
  fit();
  if (document.fonts) document.fonts.ready.then(fit);

  // Main sections (data-hide: Photography, Journal, My life, Work): the full
  // bar, never the pill. On wider screens it follows the page down from the
  // top, slides up out of view after a steady scroll down (a slow, soft
  // 900ms glide) and comes back on a real scroll up (500ms). At the top of
  // the page it's always there. The narrow bar (phones) stays static: it
  // scrolls away with the page.
  //
  // What counts, so it stays calm:
  // - Down: 48px of steady scrolling, once past the bar's own height.
  // - Up: the wheel or trackpad moving up (24px), a finger dragging down,
  //   ↑ / Page Up / Home, or 160px of upward travel any other way (dragging
  //   the scrollbar, Back to top). Trackpad momentum keeps going the way the
  //   scroll went, and the page springing back from a bounce sends no wheel
  //   and moves it far less than that, so neither counts.
  // - A leap of most of a screen at once (Back/Forward putting the page
  //   where it was left, a link further down) isn't a scroll: the bar keeps
  //   its state (shown at the top) and lands there without animating.
  // - Keyboard focus in the header always shows it.
  if (header.hasAttribute('data-hide')) {
    const DOWN = 48;
    const UP = 24;
    const TRAVEL = 160;
    const wide = () => !header.classList.contains('is-narrow');
    // The scroll position, kept inside the page (a bounce can report past it).
    const pageY = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return Math.min(Math.max(window.scrollY, 0), Math.max(max, 0));
    };
    // The top of the page: as far down as the bar itself reaches there.
    const topZone = () => header.offsetHeight + (parseFloat(getComputedStyle(header).top) || 0);
    const focusInside = () => {
      const el = document.activeElement;
      return !!el && header.contains(el) && el.matches(':focus-visible');
    };
    const show = () => { if (wide()) set('is-hidden', false); };
    const hide = () => { if (!focusInside()) set('is-hidden', true); };
    // Shown by the visitor's hand (wheel, finger, key, focus): hiding again
    // takes a fresh 48px down from here.
    const reach = () => {
      show();
      turnY = lastY;
      dir = 0;
    };

    let lastY = 0; // the position at the last check
    let turnY = 0; // where the current run in one direction began
    let dir = 0; // that run's direction: 1 down, -1 up
    let wheelUp = 0; // the wheel's upward travel, in one go
    let lastWheel = -Infinity;
    let touchTop = null; // a finger's highest point since it went down

    const restart = () => {
      lastY = turnY = pageY();
      dir = 0;
      wheelUp = 0;
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      if (!wide()) return;
      if (revealing()) {
        restart();
        return;
      }
      const y = pageY();
      const dy = y - lastY;
      const atTop = y <= topZone();
      if (Math.abs(dy) > window.innerHeight * 0.75) {
        instantly(() => {
          set('is-stuck', y > 24);
          if (atTop) show();
        });
        restart();
        return;
      }
      set('is-stuck', y > 24);
      if (dy !== 0) {
        const now = dy > 0 ? 1 : -1;
        if (now !== dir) {
          dir = now;
          turnY = lastY;
        }
        lastY = y;
        if (!atTop && dir === 1 && y - turnY >= DOWN) hide();
        else if (dir === -1 && turnY - y >= TRAVEL) show();
      }
      if (atTop) show();
    };
    const queue = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', queue, { passive: true });

    window.addEventListener('wheel', (event) => {
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = event.deltaY * unit;
      if (delta >= 0 || event.timeStamp - lastWheel > 300) wheelUp = 0;
      lastWheel = event.timeStamp;
      if (delta < 0) {
        wheelUp -= delta;
        if (wheelUp >= UP) reach();
      }
    }, { passive: true });

    window.addEventListener('touchstart', (event) => {
      touchTop = event.touches.length === 1 ? event.touches[0].clientY : null;
    }, { passive: true });
    window.addEventListener('touchmove', (event) => {
      if (touchTop === null || event.touches.length !== 1) return;
      const fingerY = event.touches[0].clientY;
      if (fingerY - touchTop >= UP) reach();
      touchTop = Math.min(touchTop, fingerY);
    }, { passive: true });

    window.addEventListener('keydown', (event) => {
      const up = event.key === 'ArrowUp' || event.key === 'PageUp' || event.key === 'Home' || (event.key === ' ' && event.shiftKey);
      if (up && !(event.target.closest && event.target.closest('input, textarea, select, [contenteditable]'))) reach();
    });

    // Focus coming into the header shows it at once, not sliding: the
    // browser scrolls the page to whatever takes focus, and would otherwise
    // see the bar still above the screen and jump the page to the top.
    header.addEventListener('focusin', () => {
      if (header.classList.contains('is-hidden')) instantly(reach);
    });

    // The page change has ended (Safari): the bar sticks to the top again,
    // carrying on from where scrolling left it. Scrolled out of view, it
    // stays out (hidden). Part way out, near the top, it's held right there
    // and then slides back into place.
    window.addEventListener('revealed', () => {
      restart();
      const y = pageY();
      if (!wide() || y <= 0) return;
      if (y > topZone()) {
        instantly(() => {
          set('is-stuck', true);
          set('is-hidden', true);
        });
        dir = 1;
      } else {
        instantly(() => {
          set('is-stuck', y > 24);
          header.style.translate = `0 ${-y}px`;
        }, () => { header.style.translate = ''; });
      }
    });

    // Back to the tab or the page (Back/Forward from Safari's cache, as it
    // was left): count from here.
    document.addEventListener('visibilitychange', restart);
    window.addEventListener('pageshow', restart);

    // Turning narrow (phones), the bar goes back to the static small bar.
    header.addEventListener('header:narrow', () => {
      instantly(() => {
        set('is-hidden', false);
        set('is-stuck', wide() && pageY() > 24);
      });
      restart();
    });

    restart();
    update();
  }

  // Narrow header: the hamburger opens and closes the menu line. Escape, a
  // tap outside the header, scrolling down, or the bar going back to one
  // line closes it (it folds away with its usual transition).
  const toggle = header.querySelector('.site-header__toggle');
  if (toggle) {
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

    header.addEventListener('header:narrow', () => setOpen(false));
  }
}

// Safari on iPhone only shows :active (pressed) styles on pages that listen
// for touches; an empty passive listener is enough, and costs nothing. The
// pickers on Photography and the reason chips on Contact use it.
document.addEventListener('touchstart', () => {}, { passive: true });

// Turn transitions on only after the first styled frame (see .is-loading).
// A timer backs it up for tabs that don't paint (frames pause in the background).
window.addEventListener('load', () => {
  const ready = () => document.documentElement.classList.remove('is-loading');
  requestAnimationFrame(() => requestAnimationFrame(ready));
  setTimeout(ready, 300);
});
