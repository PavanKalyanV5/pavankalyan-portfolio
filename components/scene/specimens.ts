import * as THREE from "three";

/**
 * Exploded-view drawings. Each specimen is a module of the master machine: a stack of parts
 * along local Y, drawn as hairline outlines. Parts can carry small motion (spins, staggered
 * bobbing, traveling dots, live line work) so the drawing reads as a working mechanism.
 */

/** A small accent dot that travels along a path in the part's local space. */
export type Actor = { path: (t: number) => [number, number, number] };

export type Part = {
  /** Height along the stacking axis. */
  h: number;
  /** Distance from the part's axis where its leader line attaches. */
  reach: number;
  /** Solid shapes, drawn as hard-edge outlines only. */
  solids: () => THREE.BufferGeometry[];
  /** Optional raw line work such as grids and text rules. */
  lines?: () => THREE.BufferGeometry;
  /** Per-frame transform of the part's outline group. Children are the solids, in order. */
  anim?: (g: THREE.Object3D, t: number) => void;
  /** Rewrites the raw line positions each frame (bars, rules, meters). */
  lineAnim?: (pos: Float32Array, t: number) => void;
  /** Dots that travel through the part. */
  actors?: Actor[];
};

export type Specimen = {
  id: string;
  /** Size relative to the hero instrument, so flat stacks fill the same space. */
  scale: number;
  /** Horizontal nudge while focused, as a fraction of the viewport width. Keeps long shapes clear of the text column. */
  offsetX?: number;
  /** Resting rotation about X and Z, in radians. */
  tilt: [number, number];
  gap: number;
  parts: Part[];
  labels: { label: string; part: number }[];
};

const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt: number, rb: number, h: number, seg: number) => new THREE.CylinderGeometry(rt, rb, h, seg);

/** Build a line-segment geometry from flat [x1,y1,z1,x2,y2,z2,...] data. */
const segs = (pts: number[]) => new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));

/** A cols x rows grid of lines on a w x d plate, lying at height y. */
const grid = (w: number, d: number, cols: number, rows: number, y: number) => {
  const p: number[] = [];
  for (let i = 0; i <= cols; i++) {
    const x = -w / 2 + (w * i) / cols;
    p.push(x, y, -d / 2, x, y, d / 2);
  }
  for (let j = 0; j <= rows; j++) {
    const z = -d / 2 + (d * j) / rows;
    p.push(-w / 2, y, z, w / 2, y, z);
  }
  return segs(p);
};

/** Horizontal rules, like lines of text on a sheet. */
const rules = (w: number, d: number, n: number, y: number, inset = 0.12) => {
  const p: number[] = [];
  for (let i = 0; i < n; i++) {
    const z = -d / 2 + inset + ((d - inset * 2) * i) / Math.max(1, n - 1);
    p.push(-w / 2 + inset, y, z, w / 2 - inset, y, z);
  }
  return segs(p);
};

/** Live version of `rules`: every line types out and back at its own pace. */
const typingRules = (w: number, d: number, n: number, y: number, inset = 0.12) => (pos: Float32Array, t: number) => {
  for (let i = 0; i < n; i++) {
    const z = -d / 2 + inset + ((d - inset * 2) * i) / Math.max(1, n - 1);
    const full = w - inset * 2;
    const len = full * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 1.3 + i * 0.9)));
    pos.set([-w / 2 + inset, y, z, -w / 2 + inset + len, y, z], i * 6);
  }
};

const ring = (r: number, tube: number) => new THREE.TorusGeometry(r, tube, 8, 56).rotateX(Math.PI / 2);

/** Stagger helper: a 0..1 pulse that ripples through indexed children. */
const wave = (t: number, i: number, speed = 1.6, step = 0.7) => 0.5 + 0.5 * Math.sin(t * speed - i * step);

/** A dot that runs back and forth along x at a fixed y and z, offset in phase. */
const runX = (x0: number, x1: number, y: number, z: number, speed: number, phase = 0): Actor => ({
  path: (t) => [x0 + (x1 - x0) * ((t * speed + phase) % 1), y, z],
});

/* ---------- Module 0: the instrument ---------- */
const BARS = 21;
const instrument: Specimen = {
  id: "instrument",
  scale: 1,
  tilt: [0.38, -0.5],
  gap: 0.46,
  labels: [
    { label: "agentic rag", part: 0 },
    { label: "vector search", part: 1 },
    { label: "ml forecasting", part: 2 },
    { label: "event-driven", part: 3 },
    { label: ".net", part: 4 },
    { label: "rabbitmq", part: 5 },
    { label: "docker", part: 6 },
  ],
  parts: [
    {
      // lens barrel: turning knurled ring, with a live stagger waveform on the glass
      h: 0.2,
      reach: 0.9,
      solids: () => [cyl(0.95, 0.95, 0.2, 56), cyl(0.99, 0.99, 0.12, 96), ring(0.68, 0.045)],
      lines: () => segs(Array.from({ length: BARS * 2 }, (_, i) => [-0.55 + (1.1 * Math.floor(i / 2)) / (BARS - 1), 0, 0]).flat()),
      lineAnim: (pos, t) => {
        for (let i = 0; i < BARS; i++) {
          const x = -0.55 + (1.1 * i) / (BARS - 1);
          const env = Math.sqrt(Math.max(0, 1 - (x / 0.58) ** 2));
          const hgt = env * (0.12 + 0.4 * wave(t, i, 2.4, 0.5));
          pos.set([x, 0.0, -hgt, x, 0.0, hgt], i * 6);
        }
      },
      anim: (g, t) => {
        g.children[0].rotation.y = t * 0.5;
        g.children[1].rotation.y = t * 0.5;
      },
    },
    {
      h: 0.42,
      reach: 0.85,
      solids: () => {
        const lugs = [0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2 + 0.5;
          return box(0.3, 0.36, 0.22).rotateY(-a).translate(Math.cos(a) * 0.62, 0, Math.sin(a) * 0.62);
        });
        return [cyl(0.46, 0.46, 0.34, 32), ...lugs];
      },
      // The lugs orbit the drum like a turret indexing.
      anim: (g, t) => {
        for (let i = 1; i <= 3; i++) g.children[i].rotation.y = Math.sin(t * 0.7) * 0.5;
      },
    },
    {
      h: 0.34,
      reach: 0.8,
      solids: () => [0, 1, 2, 3].map((i) => cyl(0.78 - i * 0.03, 0.78 - i * 0.03, 0.04, 48).translate(0, 0.15 - i * 0.1, 0)),
      // The fins breathe in a stagger, like a shutter.
      anim: (g, t) => g.children.forEach((c, i) => (c.position.y = (wave(t, i, 1.4, 0.8) - 0.5) * 0.07)),
    },
    {
      h: 0.24,
      reach: 0.9,
      solids: () => [cyl(0.9, 0.9, 0.24, 72), cyl(0.7, 0.7, 0.26, 40)],
      actors: [
        { path: (t) => [Math.cos(t * 1.1) * 0.9, 0.0, Math.sin(t * 1.1) * 0.9] },
        { path: (t) => [Math.cos(t * 1.1 + Math.PI) * 0.9, 0.0, Math.sin(t * 1.1 + Math.PI) * 0.9] },
      ],
    },
    {
      h: 0.52,
      reach: 0.9,
      solids: () => [cyl(0.85, 0.85, 0.52, 48), ...[-0.5, 0, 0.5].map((x) => cyl(0.1, 0.1, 0.12, 20).rotateX(Math.PI / 2).translate(x * 0.9, 0, 0.84))],
      // The three dials push in and out in sequence.
      anim: (g, t) => {
        for (let i = 1; i <= 3; i++) g.children[i].position.z = (wave(t, i, 2, 1.1) - 0.5) * 0.06;
      },
    },
    { h: 0.7, reach: 0.7, solids: () => [cyl(0.55, 0.85, 0.7, 14)], actors: [{ path: (t) => [0.7 * Math.cos(t * 0.9), 0.35 - ((t * 0.35) % 1) * 0.7, 0.7 * Math.sin(t * 0.9)] }] },
    { h: 0.1, reach: 0.98, solids: () => [cyl(0.98, 0.98, 0.1, 56)], anim: (g, t) => (g.rotation.y = -t * 0.3) },
  ],
};

/* ---------- Module 1, work: layered pipeline slabs ---------- */
const pipeline: Specimen = {
  id: "pipeline",
  scale: 1.3,
  tilt: [0.62, -0.32],
  gap: 0.5,
  labels: [
    { label: "ai reporting", part: 0 },
    { label: "mcp server", part: 1 },
    { label: "workflow jobs", part: 2 },
    { label: "azure monitor", part: 3 },
    { label: "sprint delivery", part: 4 },
  ],
  parts: [
    {
      // data pulses cross the grid
      h: 0.08,
      reach: 1.0,
      solids: () => [box(2.0, 0.08, 1.5)],
      lines: () => grid(1.8, 1.3, 9, 6, 0.045),
      actors: [runX(-0.9, 0.9, 0.06, -0.433, 0.5, 0), runX(-0.9, 0.9, 0.06, 0, 0.5, 0.33), runX(-0.9, 0.9, 0.06, 0.433, 0.5, 0.66)],
    },
    {
      h: 0.3,
      reach: 1.0,
      solids: () => [box(1.8, 0.1, 1.4).translate(0, -0.1, 0), ...[-0.55, 0, 0.55].map((x) => box(0.4, 0.18, 0.4).translate(x, 0.04, 0))],
      anim: (g, t) => {
        for (let i = 1; i <= 3; i++) g.children[i].position.y = (wave(t, i, 1.8, 1.0) - 0.5) * 0.12;
      },
    },
    { h: 0.08, reach: 1.0, solids: () => [box(2.0, 0.08, 1.5)], lines: () => rules(1.8, 1.3, 7, 0.045), lineAnim: typingRules(2.0, 1.5, 7, 0.045, 0.1) },
    {
      h: 0.3,
      reach: 1.0,
      solids: () => [box(1.8, 0.1, 1.4).translate(0, -0.1, 0), ...[-0.55, 0, 0.55].map((x) => cyl(0.18, 0.18, 0.2, 28).translate(x, 0.05, 0))],
      anim: (g, t) => {
        for (let i = 1; i <= 3; i++) g.children[i].position.y = (wave(t, i, 2.2, 0.9) - 0.5) * 0.14;
      },
    },
    {
      h: 0.08,
      reach: 1.0,
      solids: () => [box(2.0, 0.08, 1.5), ...[-0.6, -0.2, 0.2, 0.6].flatMap((x) => [-0.35, 0.05, 0.45].map((z) => box(0.28, 0.04, 0.28).translate(x, 0.06, z)))],
      // Tiles complete one after another.
      anim: (g, t) => {
        for (let i = 1; i < g.children.length; i++) g.children[i].position.y = Math.max(0, Math.sin(t * 1.5 - i * 0.55)) * 0.06;
      },
    },
  ],
};

/* ---------- Module 2, projects: the services of a system ---------- */
const services: Specimen = {
  id: "services",
  scale: 1.0,
  tilt: [0.52, 0.42],
  gap: 0.58,
  labels: [
    { label: "react ui", part: 0 },
    { label: "api", part: 1 },
    { label: "worker", part: 2 },
    { label: "rabbitmq", part: 3 },
    { label: "vector search", part: 4 },
  ],
  parts: [
    { h: 0.14, reach: 1.0, solids: () => [box(2.0, 0.12, 1.4), box(1.7, 0.06, 1.1).translate(0, 0.08, 0)], actors: [runX(-0.75, 0.75, 0.13, 0, 0.35)] },
    {
      // activity meters on the API front
      h: 0.3,
      reach: 0.9,
      solids: () => [box(1.8, 0.3, 1.2)],
      lines: () => segs([-0.7, 0.16, 0.61, 0.7, 0.16, 0.61, -0.7, 0.04, 0.61, 0.7, 0.04, 0.61, -0.7, -0.08, 0.61, 0.7, -0.08, 0.61]),
      lineAnim: (pos, t) => {
        [0.16, 0.04, -0.08].forEach((y, i) => pos.set([-0.7, y, 0.61, -0.7 + 1.4 * (0.25 + 0.75 * wave(t, i, 1.9, 1.3)), y, 0.61], i * 6));
      },
    },
    {
      h: 0.34,
      reach: 0.9,
      solids: () => [box(1.8, 0.1, 1.2).translate(0, -0.12, 0), ...[-0.55, 0, 0.55].flatMap((x) => [-0.28, 0.28].map((z) => cyl(0.14, 0.14, 0.26, 24).translate(x, 0.05, z)))],
      anim: (g, t) => {
        for (let i = 1; i < g.children.length; i++) g.children[i].position.y = (wave(t, i, 2.4, 0.9) - 0.5) * 0.12;
      },
    },
    {
      // the queue: messages march along it
      h: 0.24,
      reach: 1.0,
      solids: () => [-0.8, -0.4, 0, 0.4, 0.8].map((x) => box(0.3, 0.22, 1.0).translate(x, 0, 0)),
      anim: (g, t) => {
        g.children.forEach((c, i) => {
          const base = -0.8 + i * 0.4;
          c.position.x = ((((base + 1.0 + t * 0.3) % 2.0) + 2.0) % 2.0) - 1.0 - base;
        });
      },
    },
    {
      h: 0.5,
      reach: 0.9,
      solids: () => [0, 1, 2].map((i) => cyl(0.8, 0.8, 0.12, 44).translate(0, 0.19 - i * 0.19, 0)),
      anim: (g, t) => g.children.forEach((c, i) => (c.position.y = (wave(t, i, 1.2, 1.2) - 0.5) * 0.08)),
      actors: [{ path: (t) => [0.8 * Math.cos(t * 1.3), 0, 0.8 * Math.sin(t * 1.3)] }],
    },
  ],
};

/* ---------- Module 3, skills: a chip package, one layer per skill category ---------- */
const chip: Specimen = {
  id: "chip",
  scale: 1.0,
  tilt: [0.34, 0.5],
  gap: 0.62,
  labels: [
    { label: "languages", part: 0 },
    { label: "ai & agentic", part: 1 },
    { label: "backend", part: 2 },
    { label: "frontend", part: 3 },
    { label: "databases", part: 4 },
    { label: "cloud & devops", part: 5 },
    { label: "tools & workflow", part: 6 },
  ],
  parts: [
    { h: 0.12, reach: 1.0, solids: () => [box(2.0, 0.1, 2.0), box(1.5, 0.06, 1.5).translate(0, 0.08, 0)] },
    {
      h: 0.16,
      reach: 0.95,
      solids: () => [-0.72, -0.48, -0.24, 0, 0.24, 0.48, 0.72].map((x) => box(0.08, 0.14, 1.6).translate(x, 0, 0)),
      anim: (g, t) => g.children.forEach((c, i) => (c.position.y = (wave(t, i, 1.5, 0.6) - 0.5) * 0.08)),
    },
    {
      h: 0.08,
      reach: 0.5,
      solids: () => [box(0.95, 0.08, 0.95)],
      lines: () => grid(0.8, 0.8, 5, 5, 0.045),
      actors: [runX(-0.4, 0.4, 0.06, -0.16, 0.7, 0.2), runX(-0.4, 0.4, 0.06, 0.16, 0.7, 0.7)],
    },
    { h: 0.06, reach: 0.85, solids: () => [box(1.7, 0.05, 1.7)], lines: () => grid(1.5, 1.5, 5, 5, 0.03), actors: [runX(-0.75, 0.75, 0.05, -0.3, 0.45), runX(-0.75, 0.75, 0.05, 0.3, 0.45, 0.5)] },
    {
      // the pin grid ripples
      h: 0.2,
      reach: 1.0,
      solids: () => [box(2.0, 0.06, 2.0), ...Array.from({ length: 16 }, (_, i) => box(0.18, 0.1, 0.18).translate(-0.6 + (i % 4) * 0.4, -0.08, -0.6 + Math.floor(i / 4) * 0.4))],
      anim: (g, t) => {
        for (let i = 1; i < g.children.length; i++) {
          const k = i - 1;
          g.children[i].position.y = -(wave(t, (k % 4) + Math.floor(k / 4), 2.2, 0.8)) * 0.09;
        }
      },
    },
    { h: 0.06, reach: 1.1, solids: () => [box(2.3, 0.05, 2.3)], lines: () => grid(2.1, 2.1, 6, 6, 0.03), actors: [runX(-1.0, 1.0, 0.05, 0.35, 0.3), runX(-1.0, 1.0, 0.05, -0.7, 0.3, 0.55)] },
    { h: 0.1, reach: 1.1, solids: () => [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => box(0.42, 0.1, 0.42).translate(x * 0.95, 0, z * 0.95)) },
  ],
};

/* ---------- Module 4, contact: a fountain pen, taken apart ---------- */
const pen: Specimen = {
  id: "pen",
  scale: 0.95,
  offsetX: 0.05,
  tilt: [0.3, -0.75],
  gap: 0.5,
  labels: [
    { label: "write to me", part: 0 },
    { label: "ai ideas", part: 1 },
    { label: "full-stack apps", part: 2 },
    { label: "engineering roles", part: 3 },
    { label: "collaborations", part: 4 },
  ],
  parts: [
    {
      // cap: domed top and a spring clip, turning slowly
      h: 1.1,
      reach: 0.4,
      solids: () => [cyl(0.36, 0.36, 1.1, 48), cyl(0.18, 0.36, 0.14, 48).translate(0, 0.62, 0), box(0.07, 0.8, 0.12).translate(0.4, 0.05, 0), ring(0.37, 0.016).translate(0, -0.4, 0)],
      anim: (g, t) => {
        g.children[0].rotation.y = t * 0.5;
        g.children[1].rotation.y = t * 0.5;
      },
    },
    {
      h: 1.4,
      reach: 0.36,
      solids: () => [cyl(0.32, 0.32, 1.4, 48), ring(0.335, 0.014).translate(0, 0.62, 0), ring(0.335, 0.014).translate(0, -0.62, 0)],
      anim: (g, t) => (g.children[0].rotation.y = -t * 0.35),
    },
    {
      // ink converter: the grooves ripple
      h: 0.9,
      reach: 0.26,
      solids: () => [cyl(0.22, 0.22, 0.9, 40), ...[-0.3, -0.15, 0, 0.15, 0.3].map((y) => ring(0.23, 0.008).translate(0, y, 0))],
      anim: (g, t) => {
        for (let i = 1; i < g.children.length; i++) g.children[i].position.y = (wave(t, i, 2.0, 0.9) - 0.5) * 0.08;
      },
    },
    { h: 0.6, reach: 0.3, solids: () => [cyl(0.3, 0.2, 0.6, 48), ring(0.31, 0.012).translate(0, 0.26, 0)] },
    {
      // nib: an ink drop forms and falls
      h: 0.7,
      reach: 0.2,
      solids: () => [cyl(0.2, 0.025, 0.7, 40)],
      lines: () => segs([0, -0.34, 0.03, 0, 0.0, 0.14]),
      actors: [{ path: (t) => [0, -0.4 - ((t * 0.6) % 1) * 0.55, 0] }],
    },
  ],
};

/**
 * The hero view of the master machine. The first label names the whole body (the engineer);
 * the rest name the five modules in page order. Each module is the same object that its
 * section later pulls apart and labels in detail.
 */
export const OVERVIEW_LABELS = ["software engineer", "ai engineering", "work", "projects", "skills", "contact"] as const;

/** One module per page section, in order. Module k is focused at scene k + 1. */
export const SPECIMENS: Specimen[] = [instrument, pipeline, services, chip, pen];
