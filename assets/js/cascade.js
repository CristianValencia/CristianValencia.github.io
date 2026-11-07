// Photography cascade: each photo goes into the column that is shortest so
// far, so the photos run across the page in order (like VSCO) and the
// columns end at about the same height. Heights come from each image's
// width and height attributes, so the layout is set before the images load.
// The column count comes from CSS (--cols); a resize that changes it lays
// the photos out again.
//
// Two controls pick which photos show: the subject (Curated, the default;
// one subject; or All) and the tone (Both, the default; Color; or B&W), on
// top of each other. The choice is kept in the link (?subject=…&tone=…),
// so a view can be shared and Back returns to it. A choice that would show
// no photos with the other control as it is gets greyed out. Picking one
// lays out just those photos, and they fade up in place. Each control is a
// picker (the current choice with a chevron) that opens its options in a
// floating menu.
const cascade = document.querySelector('[data-cascade]');
const bar = document.querySelector('[data-cascade-filters]');

if (cascade) {
  const items = [...cascade.querySelectorAll('.cascade__item')];
  const subjectButtons = bar ? [...bar.querySelectorAll('[data-subject]')] : [];
  const toneButtons = bar ? [...bar.querySelectorAll('[data-tone]')] : [];
  const subjects = subjectButtons.map((b) => b.dataset.subject);
  const tones = toneButtons.map((b) => b.dataset.tone);

  const fitsSubject = (item, subject) => {
    if (subject === 'all') return true;
    if (subject === 'curated') return item.hasAttribute('data-curated');
    return item.dataset.subjects.split(' ').includes(subject);
  };
  const fitsTone = (item, tone) => tone === 'both' || item.dataset.tone === tone;
  const count = (subject, tone) => items.filter((i) => fitsSubject(i, subject) && fitsTone(i, tone)).length;

  // Start from the link, falling back to the defaults for anything unknown
  // or empty.
  const params = new URLSearchParams(window.location.search);
  let subject = subjects.includes(params.get('subject')) ? params.get('subject') : 'curated';
  let tone = tones.includes(params.get('tone')) ? params.get('tone') : 'both';
  if (!bar) subject = 'all';
  if (!count(subject, tone)) tone = 'both';
  if (!count(subject, tone)) subject = 'all';

  let cols = 0;
  const layout = (force) => {
    const style = getComputedStyle(cascade);
    const columnCount = parseInt(style.getPropertyValue('--cols'), 10) || 1;
    if (columnCount === cols && !force) return;
    cols = columnCount;

    const gap = parseFloat(style.getPropertyValue('--gap')) || 0;
    const width = (cascade.clientWidth - gap * (columnCount - 1)) / columnCount;
    const columns = Array.from({ length: columnCount }, () => {
      const column = document.createElement('div');
      column.className = 'cascade__col';
      return column;
    });
    const heights = new Array(columnCount).fill(0);

    items.filter((i) => fitsSubject(i, subject) && fitsTone(i, tone)).forEach((item) => {
      const img = item.querySelector('img');
      const ratio = img.getAttribute('height') / img.getAttribute('width');
      const shortest = heights.indexOf(Math.min(...heights));
      columns[shortest].append(item);
      heights[shortest] += width * ratio + gap;
    });

    cascade.replaceChildren(...columns);
    cascade.classList.add('is-laid-out');
  };

  // Each control is a picker (the current choice with a chevron) that opens
  // its options in a floating menu. Picking an option, tapping outside, or
  // Escape closes it.
  const controls = bar ? [...bar.querySelectorAll('.gallery__control')] : [];
  const close = (except) => {
    controls.forEach((control) => {
      if (control === except) return;
      control.classList.remove('is-open');
      control.querySelector('.gallery__picker').setAttribute('aria-expanded', 'false');
    });
  };
  controls.forEach((control) => {
    const picker = control.querySelector('.gallery__picker');
    picker.addEventListener('click', () => {
      const open = !control.classList.contains('is-open');
      close(control);
      control.classList.toggle('is-open', open);
      picker.setAttribute('aria-expanded', String(open));
      if (open) control.querySelector('[aria-pressed="true"]')?.focus();
    });
  });
  document.addEventListener('click', (event) => {
    if (!controls.some((control) => control.contains(event.target))) close();
  });
  document.addEventListener('keydown', (event) => {
    const open = controls.find((control) => control.classList.contains('is-open'));
    if (event.key === 'Escape' && open) {
      close();
      open.querySelector('.gallery__picker').focus();
    }
  });

  // Each picker holds every option's name, from both controls, in one
  // spot, showing only its current one, so both pickers are as wide as the
  // longest option and never change size (main.css stacks the names).
  const all = [...subjectButtons, ...toneButtons];
  const names = [];
  [['gallery-subject-value', 'subject'], ['gallery-tone-value', 'tone']].forEach(([id, kind]) => {
    const value = bar && bar.querySelector(`#${id}`);
    if (!value) return;
    value.replaceChildren(...all.map((b) => {
      const name = document.createElement('span');
      name.textContent = b.textContent;
      if (b.dataset[kind]) {
        name.dataset.kind = kind;
        name.dataset.for = b.dataset[kind];
        names.push(name);
      }
      return name;
    }));
  });

  // Pressed and greyed-out states for both controls, and the pickers show
  // the current choice.
  const mark = () => {
    subjectButtons.forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.subject === subject));
      b.disabled = !count(b.dataset.subject, tone);
    });
    toneButtons.forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.tone === tone));
      b.disabled = !count(subject, b.dataset.tone);
    });
    names.forEach((name) => name.classList.toggle('is-current',
      name.dataset.for === (name.dataset.kind === 'subject' ? subject : tone)));
  };

  // The link shows only what differs from the defaults.
  const remember = () => {
    const next = new URLSearchParams();
    if (subject !== 'curated') next.set('subject', subject);
    if (tone !== 'both') next.set('tone', tone);
    const query = next.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  };

  const pick = () => {
    const open = controls.find((control) => control.classList.contains('is-open'));
    close();
    if (open) open.querySelector('.gallery__picker').focus();
    mark();
    remember();
    cascade.classList.remove('is-switching');
    void cascade.offsetWidth; // restart the fade
    cascade.classList.add('is-switching');
    layout(true);
  };

  subjectButtons.forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.subject === subject) { close(); return; }
    subject = b.dataset.subject;
    pick();
  }));
  toneButtons.forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.tone === tone) { close(); return; }
    tone = b.dataset.tone;
    pick();
  }));

  if (bar) {
    mark();
    bar.hidden = false;
  }
  layout(true);
  window.addEventListener('resize', () => layout());
}
