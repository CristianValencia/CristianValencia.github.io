// Contact postcard: Send is off until the postcard is complete. Sending
// lifts the card away, then opens the visitor's email app with the postcard
// filled in. The reason goes first in the subject, so the inbox sorts itself.
{
  // Contact in the header points to this page: tapping it here does nothing.
  const here = document.querySelector('.site-header__contact[aria-current="page"]');
  if (here) here.addEventListener('click', (event) => event.preventDefault());

  const form = document.querySelector('[data-postcard]');

  // The stamp grows with the room the card gives it on wider screens: as
  // tall as its area allows (less a little air), from 154px up to 308px,
  // keeping its proportions. Both sides snap to multiples of 14, so the
  // perforations stay even on every edge. Phones keep the CSS size.
  const area = form && form.querySelector('.postcard__stamp-area');
  const stamp = area && area.querySelector('.postcard__stamp');
  if (stamp && 'ResizeObserver' in window) {
    const wide = window.matchMedia('(min-width: 761px)');
    const fit = () => {
      if (!wide.matches) {
        stamp.style.cssText = '';
        return;
      }
      const room = area.clientHeight - 24;
      const height = Math.max(154, Math.min(308, Math.floor(room / 14) * 14));
      const width = Math.round((height * 0.818) / 14) * 14;
      stamp.style.width = `${width}px`;
      stamp.style.height = `${height}px`;
      stamp.style.left = `calc(50% - ${width / 2}px)`;
      stamp.style.top = `calc(50% - ${height / 2}px)`;
    };
    new ResizeObserver(fit).observe(area);
    wide.addEventListener('change', fit);
  }

  // The footer's light on the postcard's edge and its dashed divider: one
  // soft circle that eases after the cursor while it's over the card (or a
  // finger while it touches it) and fades out when it leaves. Each part
  // draws it from its own box, with its own reach: the edge a circle 60% of
  // the card's width; the divider an ellipse, 80% of the card's width across
  // and 45% of its height tall, so it reaches far from side to side but
  // lights only the stretch of the divider level with the cursor. Off for reduced motion.
  const divider = form && form.querySelector('.postcard__divider');
  if (divider && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const head = { x: 0, y: 0 };
    let target = null;
    let frame = 0;
    const place = () => {
      const card = form.getBoundingClientRect();
      const line = divider.getBoundingClientRect();
      form.style.setProperty('--ex', `${(head.x - card.left).toFixed(1)}px`);
      form.style.setProperty('--ey', `${(head.y - card.top).toFixed(1)}px`);
      divider.style.setProperty('--lx', `${(head.x - line.left).toFixed(1)}px`);
      divider.style.setProperty('--ly', `${(head.y - line.top).toFixed(1)}px`);
    };
    const move = () => {
      head.x += (target.x - head.x) * 0.2;
      head.y += (target.y - head.y) * 0.2;
      place();
      frame = Math.hypot(target.x - head.x, target.y - head.y) > 0.5 ? requestAnimationFrame(move) : 0;
    };
    const at = (event) => ({ x: event.clientX, y: event.clientY });
    form.addEventListener('pointerenter', (event) => {
      target = at(event);
      head.x = target.x;
      head.y = target.y;
      form.style.setProperty('--er', `${(form.offsetWidth * 0.6).toFixed(0)}px`);
      divider.style.setProperty('--lrx', `${(form.offsetWidth * 0.8).toFixed(0)}px`);
      divider.style.setProperty('--lry', `${(form.offsetHeight * 0.45).toFixed(0)}px`);
      form.classList.add('is-lit');
      divider.classList.add('is-lit');
      move();
    });
    form.addEventListener('pointermove', (event) => {
      target = at(event);
      if (!frame) frame = requestAnimationFrame(move);
    });
    form.addEventListener('pointerleave', () => {
      form.classList.remove('is-lit');
      divider.classList.remove('is-lit');
    });
  }

  if (form) {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const send = form.querySelector('[type="submit"]');

    // Send stays off until every field is filled in (and the email looks
    // like one) and a reason is picked. It's turned off here, not in the
    // HTML, so the form still works if this script doesn't load.
    const texts = [...form.querySelectorAll('textarea, input:not([type="radio"])')];
    const update = () => {
      send.disabled = !form.checkValidity() || texts.some((el) => !el.value.trim());
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = data.get('name').trim();
      const reply = data.get('email').trim();
      const subject = `${data.get('reason')} · A postcard from ${name}`;
      const body = `${data.get('message').trim()}\n\n${name}\n${reply}`;
      const url = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (still.matches) { window.location.href = url; return; }
      form.classList.add('is-sending');
      const go = (e) => {
        if (e.target !== form || e.propertyName !== 'opacity') return;
        form.removeEventListener('transitionend', go);
        window.location.href = url;
      };
      form.addEventListener('transitionend', go);
    });

    // Back from the email app: bring the postcard back.
    window.addEventListener('pageshow', () => { form.classList.remove('is-sending'); update(); });
  }
}
