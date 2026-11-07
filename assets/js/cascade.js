// Photography cascade: each photo goes into the column that is shortest so
// far, so the photos run across the page in order (like VSCO) and the
// columns end at about the same height. Heights come from each image's
// width and height attributes, so the layout is set before the images load.
// The column count comes from CSS (--cols); a resize that changes it lays
// the photos out again.
//
// The buttons above pick which photos show: Curated (the default), All,
// Black & White or Color. Picking one lays out just those photos, and they
// fade up in place.
const cascade = document.querySelector('[data-cascade]');
const filters = document.querySelector('[data-cascade-filters]');

if (cascade) {
  const items = [...cascade.querySelectorAll('.cascade__item')];
  const shows = {
    curated: (item) => item.hasAttribute('data-curated'),
    all: () => true,
    bw: (item) => item.dataset.category === 'bw',
    color: (item) => item.dataset.category === 'color',
  };
  let filter = filters ? 'curated' : 'all';
  let cols = 0;

  const layout = (force) => {
    const style = getComputedStyle(cascade);
    const count = parseInt(style.getPropertyValue('--cols'), 10) || 1;
    if (count === cols && !force) return;
    cols = count;

    const gap = parseFloat(style.getPropertyValue('--gap')) || 0;
    const width = (cascade.clientWidth - gap * (count - 1)) / count;
    const columns = Array.from({ length: count }, () => {
      const column = document.createElement('div');
      column.className = 'cascade__col';
      return column;
    });
    const heights = new Array(count).fill(0);

    items.filter(shows[filter]).forEach((item) => {
      const img = item.querySelector('img');
      const ratio = img.getAttribute('height') / img.getAttribute('width');
      const shortest = heights.indexOf(Math.min(...heights));
      columns[shortest].append(item);
      heights[shortest] += width * ratio + gap;
    });

    cascade.replaceChildren(...columns);
    cascade.classList.add('is-laid-out');
  };

  if (filters) {
    const buttons = [...filters.querySelectorAll('[data-filter]')];
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.filter === filter) return;
        filter = button.dataset.filter;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        cascade.classList.remove('is-switching');
        void cascade.offsetWidth; // restart the fade
        cascade.classList.add('is-switching');
        layout(true);
      });
    });
    filters.hidden = false;
  }

  layout(true);
  window.addEventListener('resize', () => layout());
}
