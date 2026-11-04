// Footer line: each tap shows the next message, then wraps around.
document.querySelectorAll('[data-footer-cycle]').forEach((button) => {
  const lines = Array.from(button.children);
  let current = 0;

  button.addEventListener('click', () => {
    lines[current].hidden = true;
    current = (current + 1) % lines.length;
    lines[current].hidden = false;
  });
});

// Footer reveal: a soft circle shows a stronger plaid. A short trail of
// smaller circles follows the head, so the areas it leaves fade back to the
// soft plaid. With a mouse the circle follows the cursor. On touch screens it
// wanders on its own: slow, random, and drawn toward the center, only while
// the footer is on screen. Off for reduced motion.
const footer = document.querySelector('.site-footer');
const reveal = footer && footer.querySelector('.site-footer__reveal');
const calm = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (reveal && calm) {
  const RADIUS = 400;
  const TRAIL = 7;
  let points = [];
  let target = null;
  let active = false;
  let strength = 0;
  let frame = 0;
  let radius = RADIUS;

  // Wandering (touch screens only).
  const velocity = { x: 0, y: 0 };
  let nextTargetAt = 0;

  const fill = (p) => {
    points = Array.from({ length: TRAIL }, () => ({ ...p }));
  };

  // Roughly bell-shaped from -1.5 to 1.5, so most picks land near the center.
  const centered = () => Math.random() + Math.random() + Math.random() - 1.5;

  const pickTarget = (now) => {
    const w = footer.clientWidth;
    const h = footer.clientHeight;
    target = {
      x: Math.min(w, Math.max(0, w / 2 + centered() * w * 0.24)),
      y: Math.min(h, Math.max(0, h / 2 + centered() * h * 0.26)),
    };
    nextTargetAt = now + 5000 + Math.random() * 3000;
  };

  const paint = () => {
    const mask = strength > 0
      ? points.map((p, i) => {
          const r = Math.max(1, radius * strength * (1 - i * 0.09));
          return `radial-gradient(circle ${r.toFixed(1)}px at ${p.x.toFixed(1)}px ${p.y.toFixed(1)}px, #000 0%, rgba(0, 0, 0, 0.85) 40%, transparent 100%)`;
        }).join(', ')
      : 'linear-gradient(transparent, transparent)';
    reveal.style.webkitMaskImage = mask;
    reveal.style.maskImage = mask;
  };

  // Mouse: the head eases toward the cursor.
  const followCursor = () => {
    points[0].x += (target.x - points[0].x) * 0.2;
    points[0].y += (target.y - points[0].y) * 0.2;
  };

  // Touch: the head is gently pulled toward a target and keeps some momentum,
  // so it drifts in soft curves at a capped, slow speed.
  const wander = (now) => {
    const head = points[0];
    const dx = target.x - head.x;
    const dy = target.y - head.y;
    if (now > nextTargetAt || Math.hypot(dx, dy) < 40) pickTarget(now);
    velocity.x = (velocity.x + dx * 0.0004) * 0.985;
    velocity.y = (velocity.y + dy * 0.0004) * 0.985;
    const speed = Math.hypot(velocity.x, velocity.y);
    const MAX_SPEED = 0.8;
    if (speed > MAX_SPEED) {
      velocity.x *= MAX_SPEED / speed;
      velocity.y *= MAX_SPEED / speed;
    }
    head.x += velocity.x;
    head.y += velocity.y;
  };

  const tick = (now) => {
    if (hasMouse) followCursor();
    else wander(now);
    for (let i = 1; i < points.length; i++) {
      points[i].x += (points[i - 1].x - points[i].x) * 0.28;
      points[i].y += (points[i - 1].y - points[i].y) * 0.28;
    }
    strength += ((active ? 1 : 0) - strength) * (hasMouse ? 0.08 : 0.03);

    if (!active && strength < 0.01) {
      strength = 0;
      frame = 0;
      paint();
      return;
    }
    paint();
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  if (hasMouse) {
    const pointFrom = (event) => {
      const box = footer.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };

    footer.addEventListener('mouseenter', (event) => {
      target = pointFrom(event);
      if (strength < 0.01) fill(target);
      active = true;
      start();
    });

    footer.addEventListener('mousemove', (event) => {
      target = pointFrom(event);
      if (!points.length) fill(target);
      active = true;
      start();
    });

    footer.addEventListener('mouseleave', () => {
      active = false;
    });
  } else if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (!active) return;
      // A narrow footer gets a smaller circle, so the soft plaid still shows.
      radius = Math.min(RADIUS, footer.clientWidth * 0.45);
      if (!points.length) {
        fill({ x: footer.clientWidth / 2, y: footer.clientHeight / 2 });
        pickTarget(performance.now());
      }
      start();
    }).observe(footer);
  }
}
