// Journal posts: the post journey, the Sections / Share / Sources / no-AI
// buttons, and the light on quotes. Loaded only on posts (see default.html).
// Without this script the buttons stay hidden and every panel stays open.
// Wrapped in a block: the site's scripts share one global scope.
{

const calm = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const phone = window.matchMedia('(max-width: 700px)');

// Folding panels: each button opens and closes the panel it controls.
const setupFold = (button, panel) => {
  panel.classList.add('is-collapsed');
  button.hidden = false;
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-collapsed', !open);
  });
};

document.querySelectorAll('[data-fold-toggle]').forEach((button) => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  if (panel) setupFold(button, panel);
});

// Share: copies the post's link and says so for two seconds.
const share = document.querySelector('[data-share]');
if (share && navigator.clipboard) {
  const label = share.querySelector('[data-share-label]');
  let timer = 0;
  share.hidden = false;
  share.addEventListener('click', () => {
    const url = window.location.href.split('#')[0];
    navigator.clipboard.writeText(url).then(() => {
      label.textContent = 'Link copied';
      clearTimeout(timer);
      timer = setTimeout(() => { label.textContent = 'Share'; }, 2000);
    }, () => {});
  });
}

// Spring scroll: glides the page to a section on a spring (Motion), stopping
// just below the sticky header. A wheel, touch or key press hands control
// back to the visitor at once. Reduced motion jumps straight there.
let glide = null;
const stopGlide = () => {
  if (glide) glide.stop();
  glide = null;
  window.removeEventListener('wheel', stopGlide);
  window.removeEventListener('touchstart', stopGlide);
  window.removeEventListener('keydown', stopGlide);
};

const scrollToSection = (target) => {
  const header = document.querySelector('[data-site-header]');
  const offset = (header ? header.getBoundingClientRect().bottom : 0) + 24;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const to = Math.max(0, Math.min(max, window.scrollY + target.getBoundingClientRect().top - offset));
  const from = window.scrollY;
  const land = () => {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.replaceState(null, '', `#${target.id}`);
  };
  stopGlide();
  if (!calm || !window.Motion || Math.abs(to - from) < 2) {
    window.scrollTo(0, to);
    land();
    return;
  }
  window.addEventListener('wheel', stopGlide, { passive: true });
  window.addEventListener('touchstart', stopGlide, { passive: true });
  window.addEventListener('keydown', stopGlide);
  // Critically damped (no bounce): settles in about a second.
  glide = window.Motion.animate(from, to, {
    type: 'spring',
    stiffness: 90,
    damping: 19,
    restDelta: 0.5,
    onUpdate: (y) => window.scrollTo(0, y),
    onComplete: () => { stopGlide(); land(); },
  });
};

// Post journey: one stop per section title (h2, h3) of the post, three per
// row. Rows alternate direction and join with a rounded turn. Each stop shows
// the title and the first sentence after it.
const journey = document.querySelector('[data-journey]');
const journeyToggle = document.querySelector('[data-journey-toggle]');
const headings = [...document.querySelectorAll('.post__body h2[id], .post__body h3[id]')];

const firstSentence = (heading) => {
  let next = heading.nextElementSibling;
  while (next && !(next.matches('p') && next.textContent.trim())) {
    if (next.matches('h2, h3')) return '';
    next = next.nextElementSibling;
  }
  if (!next) return '';
  const text = next.textContent.trim().replace(/\s+/g, ' ');
  const sentence = (text.match(/^.*?[.!?:](\s|$)/) || [text])[0].trim();
  return sentence.length > 60 ? `${sentence.slice(0, 57).trim()}…` : sentence;
};

if (journey && journeyToggle && headings.length) {
  const PER_ROW = 3;
  const TURN = 48;
  const rows = journey.querySelector('[data-journey-rows]');
  const el = (tag, cls) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  };

  journey.querySelector('[data-journey-count]').textContent =
    `${headings.length} ${headings.length === 1 ? 'section' : 'sections'}`;

  const chunks = [];
  for (let i = 0; i < headings.length; i += PER_ROW) chunks.push(headings.slice(i, i + PER_ROW));

  chunks.forEach((chunk, r) => {
    const ltr = r % 2 === 0;
    const first = r === 0;
    const next = r < chunks.length - 1;
    const row = el('div', ltr ? 'jr-row' : 'jr-row jr-row--rtl');

    const line = el('div', 'jr-line');
    line.setAttribute('aria-hidden', 'true');
    line.style.setProperty('--line-left', `${ltr ? (first ? 0 : TURN) : (next ? TURN : 0)}px`);
    line.style.setProperty('--line-right', `${ltr ? (next ? TURN : 0) : (first ? 0 : TURN)}px`);
    row.append(line);

    if (next) {
      const turn = el('div', `jr-turn ${ltr ? 'jr-turn--right' : 'jr-turn--left'}`);
      turn.setAttribute('aria-hidden', 'true');
      row.append(turn);
    }

    const list = el('ol', 'jr-list');
    list.start = r * PER_ROW + 1;
    chunk.forEach((heading) => {
      const item = el('li');
      const link = el('a', 'jr-stop');
      link.href = `#${heading.id}`;
      const dot = el('span', 'jr-dot');
      dot.setAttribute('aria-hidden', 'true');
      const title = el('span', 'jr-title');
      title.textContent = heading.textContent.trim();
      link.append(dot, title);
      const summary = firstSentence(heading);
      if (summary) {
        const line2 = el('span', 'jr-summary');
        line2.textContent = summary;
        link.append(line2);
      }
      link.addEventListener('click', (event) => {
        event.preventDefault();
        scrollToSection(heading);
      });
      item.append(link);
      list.append(item);
    });
    row.append(list);
    rows.append(row);
  });

  journey.hidden = false;
  setupFold(journeyToggle, journey);
}

// Quote light: the footer's effect on each quote's plaid frame. With a mouse,
// a soft circle of stronger plaid follows the cursor with a short trail,
// easing in on enter and out on leave. On touch screens it wanders around
// the frame on its own while the quote is on screen, like the footer's.
// The circle's radius is 65% of the quote's width (70% on phones), never
// under 240px.
const TRAIL = 7;
const centered = () => Math.random() + Math.random() + Math.random() - 1.5;

const quoteLight = (quote) => {
  const reveal = document.createElement('div');
  reveal.className = 'pq-reveal';
  reveal.setAttribute('aria-hidden', 'true');
  quote.prepend(reveal);

  let points = [];
  let target = null;
  let active = false;
  let strength = 0;
  let frame = 0;
  const velocity = { x: 0, y: 0 };
  let nextTargetAt = 0;

  // Coordinates are relative to the frame's outer edge (the reveal layer).
  const size = () => ({ w: reveal.offsetWidth, h: reveal.offsetHeight });
  const fill = (p) => { points = Array.from({ length: TRAIL }, () => ({ ...p })); };

  const paint = () => {
    const { w } = size();
    const radius = Math.max(240, w * (phone.matches ? 0.7 : 0.65));
    const mask = strength > 0
      ? points.map((p, i) => {
          const r = Math.max(1, radius * strength * (1 - i * 0.09));
          return `radial-gradient(circle ${r.toFixed(1)}px at ${p.x.toFixed(1)}px ${p.y.toFixed(1)}px, #000 0%, rgba(0, 0, 0, 0.85) 40%, transparent 100%)`;
        }).join(', ')
      : 'linear-gradient(transparent, transparent)';
    reveal.style.webkitMaskImage = mask;
    reveal.style.maskImage = mask;
  };

  const pickTarget = (now) => {
    const { w, h } = size();
    target = {
      x: Math.min(w, Math.max(0, w / 2 + centered() * w * 0.24)),
      y: Math.min(h, Math.max(0, h / 2 + centered() * h * 0.26)),
    };
    nextTargetAt = now + 8000 + Math.random() * 4000;
  };

  const wander = (now) => {
    const head = points[0];
    if (!target || now > nextTargetAt || Math.hypot(target.x - head.x, target.y - head.y) < 40) pickTarget(now);
    velocity.x = (velocity.x + (target.x - head.x) * 0.0002) * 0.985;
    velocity.y = (velocity.y + (target.y - head.y) * 0.0002) * 0.985;
    const speed = Math.hypot(velocity.x, velocity.y);
    const MAX_SPEED = 0.4;
    if (speed > MAX_SPEED) {
      velocity.x *= MAX_SPEED / speed;
      velocity.y *= MAX_SPEED / speed;
    }
    head.x += velocity.x;
    head.y += velocity.y;
  };

  const tick = (now) => {
    if (hasMouse) {
      points[0].x += (target.x - points[0].x) * 0.2;
      points[0].y += (target.y - points[0].y) * 0.2;
    } else {
      wander(now);
    }
    for (let i = 1; i < points.length; i++) {
      points[i].x += (points[i - 1].x - points[i].x) * 0.28;
      points[i].y += (points[i - 1].y - points[i].y) * 0.28;
    }
    strength += ((active ? 1 : 0) - strength) * 0.08;
    paint();
    if (!active && strength < 0.01) {
      strength = 0;
      paint();
      frame = 0;
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  const start = () => { if (!frame) frame = requestAnimationFrame(tick); };

  if (hasMouse) {
    const point = (event) => {
      const r = reveal.getBoundingClientRect();
      return { x: event.clientX - r.left, y: event.clientY - r.top };
    };
    quote.addEventListener('pointerenter', (event) => {
      const p = point(event);
      target = p;
      if (strength < 0.01) fill(p);
      active = true;
      start();
    });
    quote.addEventListener('pointermove', (event) => {
      target = point(event);
      if (!points.length) fill(target);
      active = true;
      start();
    });
    quote.addEventListener('pointerleave', () => { active = false; });
  } else if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (!active) return;
      if (!points.length) {
        const { w, h } = size();
        fill({ x: w / 2, y: h / 2 });
      }
      start();
    }).observe(quote);
  }
};

if (calm) document.querySelectorAll('.post__body blockquote').forEach(quoteLight);

// Photo frames: the contact postcard's edge light, kept
// quieter so it doesn't pull the eye from the photo. One soft circle, 35%
// of the frame's width (the postcard's is 60%), eases after the cursor (or a
// finger) while it's over the frame and fades out when it leaves. The frame
// is wider than the figure (main.css), so positions are measured from it.
const frameLight = (figure) => {
  const head = { x: 0, y: 0 };
  let target = null;
  let frame = 0;
  const box = () => {
    const r = figure.getBoundingClientRect();
    const w = Math.min(812, document.documentElement.clientWidth);
    return { left: r.left + r.width / 2 - w / 2, top: r.top, w };
  };
  const place = () => {
    const b = box();
    figure.style.setProperty('--ex', `${(head.x - b.left).toFixed(1)}px`);
    figure.style.setProperty('--ey', `${(head.y - b.top).toFixed(1)}px`);
  };
  const move = () => {
    head.x += (target.x - head.x) * 0.2;
    head.y += (target.y - head.y) * 0.2;
    place();
    frame = Math.hypot(target.x - head.x, target.y - head.y) > 0.5 ? requestAnimationFrame(move) : 0;
  };
  const at = (event) => ({ x: event.clientX, y: event.clientY });
  figure.addEventListener('pointerenter', (event) => {
    target = at(event);
    head.x = target.x;
    head.y = target.y;
    figure.style.setProperty('--er', `${(box().w * 0.35).toFixed(0)}px`);
    figure.classList.add('is-lit');
    move();
  });
  figure.addEventListener('pointermove', (event) => {
    target = at(event);
    if (!frame) frame = requestAnimationFrame(move);
  });
  figure.addEventListener('pointerleave', () => figure.classList.remove('is-lit'));
};

if (calm) document.querySelectorAll('.post__cover, .post__body .figure').forEach(frameLight);
}
