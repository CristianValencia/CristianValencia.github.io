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
