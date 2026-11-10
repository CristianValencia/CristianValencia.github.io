// Cards like Contact's postcard (.lit-card in main.css): the footer's light
// on the edge, a soft circle 60% of the card's width that eases after the
// cursor (or a finger) while it's over the card and fades out when it
// leaves, as contact.js does for the postcard. A two-column card (.split)
// lights its dashed divider too, the way the postcard's does. Off for
// reduced motion. Loaded on pages with cards: true in front matter.
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('.lit-card').forEach((card) => {
    const head = { x: 0, y: 0 };
    let target = null;
    let frame = 0;
    // The divider's light: an ellipse 80% of the card's width across and
    // 45% of its height tall (contact.js).
    const divider = card.querySelector('.split__divider');
    const place = () => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--ex', `${(head.x - r.left).toFixed(1)}px`);
      card.style.setProperty('--ey', `${(head.y - r.top).toFixed(1)}px`);
      if (divider) {
        const d = divider.getBoundingClientRect();
        divider.style.setProperty('--lx', `${(head.x - d.left).toFixed(1)}px`);
        divider.style.setProperty('--ly', `${(head.y - d.top).toFixed(1)}px`);
      }
    };
    const move = () => {
      head.x += (target.x - head.x) * 0.2;
      head.y += (target.y - head.y) * 0.2;
      place();
      frame = Math.hypot(target.x - head.x, target.y - head.y) > 0.5 ? requestAnimationFrame(move) : 0;
    };
    card.addEventListener('pointerenter', (event) => {
      target = { x: event.clientX, y: event.clientY };
      head.x = target.x;
      head.y = target.y;
      card.style.setProperty('--er', `${(card.offsetWidth * 0.6).toFixed(0)}px`);
      card.classList.add('is-lit');
      if (divider) {
        divider.style.setProperty('--lrx', `${(card.offsetWidth * 0.8).toFixed(0)}px`);
        divider.style.setProperty('--lry', `${(card.offsetHeight * 0.45).toFixed(0)}px`);
        divider.classList.add('is-lit');
      }
      move();
    });
    card.addEventListener('pointermove', (event) => {
      target = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(move);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-lit');
      if (divider) divider.classList.remove('is-lit');
    });
  });
}
