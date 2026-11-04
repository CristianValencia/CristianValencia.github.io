// Top bounce, iOS style: a mouse wheel normally stops dead when the page
// reaches the top. Here, at the moment the page actually arrives at the top,
// it keeps going a little with the speed it arrived with, then a single soft,
// critically damped Motion spring (no wobble, like iOS's rubber band) brings
// it back. Repeated wheel ticks add to the motion already under way.
// Trackpads already bounce natively in most browsers, so this only reacts to
// mouse-wheel-like scrolling. Off for reduced motion and touch screens.
const page = document.querySelector('.site');
const { spring } = window.Motion || {};
const canBounce = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;

if (page && spring && canBounce) {
  const FREQUENCY = 10; // rad/s; lower is softer and slower
  const SPRING = { stiffness: FREQUENCY * FREQUENCY, damping: 2 * FREQUENCY }; // critically damped
  const CARRY = 0.6; // share of the arrival speed that carries past the top
  const CARRY_SMOOTH = 0.35; // the same, measured on the browser's smooth scroll
  const ROOM = 25; // the deepest the page goes, px
  // A critically damped spring launched at speed v peaks at v / (FREQUENCY · e).
  const MAX_SPEED = ROOM * FREQUENCY * Math.E;

  let offset = 0;
  let speed = 0;
  let motion = null;
  let startedAt = 0;
  let last = 0;
  let frame = 0;

  const step = (now) => {
    const state = motion.next(now - startedAt);
    const dt = Math.max(1, now - last) / 1000;
    speed = (state.value - offset) / dt;
    offset = state.value;
    last = now;
    if (state.done) {
      offset = 0;
      speed = 0;
      page.style.transform = '';
      frame = 0;
      return;
    }
    page.style.transform = `translateY(${offset.toFixed(2)}px)`;
    frame = requestAnimationFrame(step);
  };

  const bounce = (arrivalSpeed) => {
    // Pushes weaken as the page nears its deepest point.
    const room = Math.max(0, 1 - offset / ROOM);
    const velocity = Math.min(MAX_SPEED, speed + arrivalSpeed * CARRY * room);
    if (velocity <= 0) return;
    const now = performance.now();
    motion = spring({ keyframes: [offset, 0], velocity, ...SPRING });
    startedAt = now;
    if (!frame) {
      last = now;
      frame = requestAnimationFrame(step);
    }
  };

  // Mouse wheels scroll in whole lines or in big, whole-number steps;
  // trackpads send small, fractional ones.
  const isMouseWheel = (event) => event.deltaMode === 1
    || (Math.abs(event.deltaY) >= 50 && Number.isInteger(event.deltaY));

  // Track how fast the page is scrolling, so the bounce can carry that speed.
  let lastY = window.scrollY;
  let lastTime = performance.now();
  let scrollSpeed = 0; // px/s, upward is positive
  let armedUntil = 0; // a wheel-up tick that will overshoot the top was just seen
  let approachSpeed = 0; // fastest upward speed on the way to the top

  window.addEventListener('wheel', (event) => {
    if (event.deltaY >= 0 || !isMouseWheel(event)) return;
    const stepPx = Math.abs(event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY);
    if (stepPx <= window.scrollY) return;
    if (window.scrollY <= 0) {
      // Already at the top: the whole step becomes the push (one wheel step
      // is usually delivered over about 100ms).
      bounce(stepPx / 0.1);
    } else {
      armedUntil = performance.now() + 400; // bounce when the scroll arrives
      approachSpeed = 0;
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const y = window.scrollY;
    const dt = Math.max(1, now - lastTime) / 1000;
    scrollSpeed = (lastY - y) / dt;
    lastY = y;
    lastTime = now;
    if (now < armedUntil) {
      // The browser's smooth scroll slows down just before the top, so use the
      // fastest part of the approach, not the last moment.
      approachSpeed = Math.max(approachSpeed, scrollSpeed);
      if (y <= 0) {
        armedUntil = 0;
        bounce(approachSpeed * (CARRY_SMOOTH / CARRY));
      }
    }
  }, { passive: true });
}
