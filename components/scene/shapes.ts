/** Point-cloud layouts the field morphs between. Each returns a flat xyz array. */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
}

/** Embeddings: loose semantic clusters in a volume. */
export function cloud(n: number): Float32Array {
  const r = rng(11);
  const centers = Array.from({ length: 8 }, () => {
    const u = r() * 2 - 1;
    const a = r() * Math.PI * 2;
    const rad = 1.4 + r() * 1.5;
    const s = Math.sqrt(1 - u * u);
    return [rad * s * Math.cos(a), rad * u * 0.8, rad * s * Math.sin(a)];
  });
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    if (r() < 0.14) {
      const u = r() * 2 - 1;
      const a = r() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const rad = 3.4 * Math.cbrt(r());
      out.set([rad * s * Math.cos(a), rad * u, rad * s * Math.sin(a)], i * 3);
    } else {
      const c = centers[Math.floor(r() * centers.length)];
      out.set([c[0] + gauss(r) * 0.5, c[1] + gauss(r) * 0.5, c[2] + gauss(r) * 0.5], i * 3);
    }
  }
  return out;
}

/** Forecast: a noisy history that fans into a widening confidence cone. */
export function series(n: number): Float32Array {
  const r = rng(23);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = r();
    const x = (t - 0.5) * 7.6;
    const centre = Math.sin(t * 9.5) * 0.55 + Math.sin(t * 3.2 + 1) * 0.7 + (t - 0.5) * 1.3;
    const fan = t > 0.62 ? (t - 0.62) / 0.38 : 0;
    const spread = 0.07 + fan * fan * 1.1;
    out.set([x, centre + gauss(r) * spread * 0.55, gauss(r) * (0.25 + fan * 0.5)], i * 3);
  }
  return out;
}

/** Orleans: a lattice of grains with message lines between neighbours. */
export function lattice(n: number): Float32Array {
  const r = rng(37);
  const size = 4;
  const gap = 1.55;
  const off = ((size - 1) * gap) / 2;
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const ix = Math.floor(r() * size);
    const iy = Math.floor(r() * size);
    const iz = Math.floor(r() * size);
    const base = [ix * gap - off, iy * gap - off, iz * gap - off];
    if (r() < 0.82) {
      out.set([base[0] + gauss(r) * 0.11, base[1] + gauss(r) * 0.11, base[2] + gauss(r) * 0.11], i * 3);
    } else {
      const axis = Math.floor(r() * 3);
      const t = r() * gap;
      const p = [...base];
      p[axis] += Math.min(t, gap);
      out.set([p[0] + gauss(r) * 0.015, p[1] + gauss(r) * 0.015, p[2] + gauss(r) * 0.015], i * 3);
    }
  }
  return out;
}

/** Skills: strands woven through each other. */
export function knot(n: number): Float32Array {
  const r = rng(53);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = r() * Math.PI * 2;
    const p = 2;
    const q = 3;
    const rr = 1.5 + Math.cos(q * t) * 0.65;
    out.set(
      [
        rr * Math.cos(p * t) * 1.15 + gauss(r) * 0.07,
        rr * Math.sin(p * t) * 1.15 + gauss(r) * 0.07,
        Math.sin(q * t) * 0.85 + gauss(r) * 0.07,
      ],
      i * 3,
    );
  }
  return out;
}

/** Contact: everything converges to one answer. */
export function shell(n: number): Float32Array {
  const r = rng(71);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    const R = 2.05 + gauss(r) * 0.025;
    out.set([Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R], i * 3);
  }
  return out;
}

export const SHAPES = [cloud, series, lattice, knot, shell] as const;
