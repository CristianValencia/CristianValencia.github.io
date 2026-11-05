// Linen: fabric backgrounds generated in code, for photo frames.
// Any element with data-linen="charcoal" or data-linen="neutral" gets a
// seamless 300×301 linen tile as its background. Without this script the
// frame shows its flat base color, set in CSS.
//
// The weave is the classic Photoshop linen recipe: seeded per-pixel noise,
// motion-blurred straight down (vertical threads) and straight across
// (horizontal threads), wrapping around so the tile has no seams, plus fine
// grain, a broad mottle and a light unsharp mask. Its parameters were fitted
// by measuring it against a reference linen (thread length, spacing,
// sparsity and detail at 1–16 px). The tones then follow that linen's
// per-level histogram (COUNTS), so its contrast is exact. The tile is drawn at
// real pixel size, so on Retina screens it scales like an image would.
{
  const W = 300;
  const H = 301;
  const P = { seed: 7, lv1: 26, lv2: 7, lh1: 18, lh2: 19, wv1: 0.5855, wv2: 0.494, wh1: 0.6021, wh2: 0.293, wg: 0.4705, wm: 0.1813, lm: 31, us: 0.426, e: 1.2387 };
  const LO = 20;
  const COUNTS = [1, 7, 6, 13, 26, 38, 64, 121, 205, 289, 379, 598, 829, 1082, 1430, 2181, 3035, 3579, 4395, 5138, 6038, 7000, 6817, 6038, 5729, 5022, 4732, 4490, 3873, 3197, 2928, 2447, 2208, 1630, 1310, 1039, 707, 502, 405, 277, 188, 89, 68, 60, 32, 13, 19, 13, 3, 4, 3, 1, 0, 2];
  const MEAN = 43.3; // the reference linen's average gray

  // Site palette. Charcoal: base #161616, each thread brightens or darkens it
  // by its share of the base (neutral threads, the same in red, green and blue).
  // Neutral: the same weave on the page gray #F7F7F7, at 30% of its contrast.
  const COLORS = {
    charcoal: (g) => 22 + (g / MEAN - 1) * 22,
    neutral: (g) => 247 + (g - MEAN) * 0.3,
  };

  const rng = (seed) => {
    let s = seed >>> 0 || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  };
  const noise = (seed) => {
    const r = rng(seed), a = new Float32Array(W * H);
    for (let i = 0; i < a.length; i++) {
      let u = 0; while (u === 0) u = r();
      a[i] = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
    }
    return a;
  };
  // Box blur of the given length along one axis, wrapping around the tile.
  const motion = (src, len, vertical) => {
    const out = new Float32Array(W * H), R = Math.max(0, Math.round((len - 1) / 2)), n = 2 * R + 1;
    if (vertical) {
      for (let x = 0; x < W; x++) {
        let s = 0;
        for (let k = -R; k <= R; k++) s += src[((k % H + H) % H) * W + x];
        for (let y = 0; y < H; y++) { out[y * W + x] = s / n; s += src[((y + R + 1) % H) * W + x] - src[(((y - R) % H + H) % H) * W + x]; }
      }
    } else {
      for (let y = 0; y < H; y++) {
        let s = 0;
        for (let k = -R; k <= R; k++) s += src[y * W + ((k % W + W) % W)];
        for (let x = 0; x < W; x++) { out[y * W + x] = s / n; s += src[y * W + (x + R + 1) % W] - src[y * W + ((x - R) % W + W) % W]; }
      }
    }
    return out;
  };
  const norm = (a) => {
    let m = 0; for (const v of a) m += v; m /= a.length;
    let s = 0; for (const v of a) s += (v - m) ** 2; s = Math.sqrt(s / a.length) || 1;
    const o = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) o[i] = (a[i] - m) / s;
    return o;
  };
  const box2 = (src, len) => motion(motion(src, len, true), len, false);
  const sh = (x, e) => Math.sign(x) * Math.abs(x) ** e;

  // The weave, as a gray level per pixel (the reference's tones).
  let weave = null;
  const makeWeave = () => {
    const nv = noise(P.seed), nh = noise(P.seed + 101), ng = noise(P.seed + 202), nm = noise(P.seed + 303);
    const v1 = norm(motion(nv, P.lv1, true)), v2 = norm(motion(nv, P.lv2, true));
    const h1 = norm(motion(nh, P.lh1, false)), h2 = norm(motion(nh, P.lh2, false));
    const mo = norm(box2(nm, P.lm));
    let out = new Float32Array(W * H);
    for (let i = 0; i < out.length; i++) {
      out[i] = P.wv1 * sh(v1[i], P.e) + P.wv2 * sh(v2[i], P.e) + P.wh1 * sh(h1[i], P.e) + P.wh2 * sh(h2[i], P.e) + P.wg * ng[i] + P.wm * mo[i];
    }
    const b = box2(out, 3);
    for (let i = 0; i < out.length; i++) out[i] += P.us * (out[i] - b[i]);
    // Rank every pixel and give it the reference's gray at that rank.
    const idx = Array.from(out.keys()).sort((a, c) => out[a] - out[c]);
    const total = COUNTS.reduce((a, c) => a + c);
    const levels = new Uint8Array(W * H);
    let lvl = 0, acc = COUNTS[0];
    for (let r = 0; r < idx.length; r++) {
      while ((r + 0.5) / idx.length > acc / total && lvl < COUNTS.length - 1) { lvl++; acc += COUNTS[lvl]; }
      levels[idx[r]] = LO + lvl;
    }
    return levels;
  };

  const tiles = {};
  const tile = (name) => {
    if (tiles[name]) return tiles[name];
    weave = weave || makeWeave();
    const color = COLORS[name];
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d'), img = ctx.createImageData(W, H);
    for (let i = 0; i < weave.length; i++) {
      const v = Math.max(0, Math.min(255, Math.round(color(weave[i]))));
      img.data[4 * i] = img.data[4 * i + 1] = img.data[4 * i + 2] = v;
      img.data[4 * i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    tiles[name] = c.toDataURL();
    return tiles[name];
  };

  document.querySelectorAll('[data-linen]').forEach((el) => {
    const name = el.dataset.linen;
    if (COLORS[name]) el.style.backgroundImage = `url(${tile(name)})`;
  });
}
