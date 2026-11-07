// Photography cascade: each photo goes into the column that is shortest so
// far, so the photos run across the page in order (like VSCO) and the
// columns end at about the same height. Heights come from each image's
// width and height attributes, so the layout is set before the images load.
// The column count comes from CSS (--cols); a resize that changes it lays
// the photos out again.
const cascade = document.querySelector('[data-cascade]');

if (cascade) {
  const items = [...cascade.querySelectorAll('.cascade__item')];
  let cols = 0;

  const layout = () => {
    const style = getComputedStyle(cascade);
    const count = parseInt(style.getPropertyValue('--cols'), 10) || 1;
    if (count === cols) return;
    cols = count;

    const gap = parseFloat(style.getPropertyValue('--gap')) || 0;
    const width = (cascade.clientWidth - gap * (count - 1)) / count;
    const columns = Array.from({ length: count }, () => {
      const column = document.createElement('div');
      column.className = 'cascade__col';
      return column;
    });
    const heights = new Array(count).fill(0);

    items.forEach((item) => {
      const img = item.querySelector('img');
      const ratio = img.getAttribute('height') / img.getAttribute('width');
      const shortest = heights.indexOf(Math.min(...heights));
      columns[shortest].append(item);
      heights[shortest] += width * ratio + gap;
    });

    cascade.replaceChildren(...columns);
    cascade.classList.add('is-laid-out');
  };

  layout();
  window.addEventListener('resize', layout);
}
