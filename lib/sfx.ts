/**
 * Interface sounds, synthesised with the Web Audio API so there are no audio files to load.
 *
 * Layers:
 *  - events: stage separation, parts pulling apart and snapping back, section motifs, leader ticks
 *  - ambience: a quiet drone that changes root note per section, plus air that follows scroll speed
 *  - interface: hover and click sounds, checkpoint jumps, the pulse passing each coupler
 * Everything runs through a small synthetic reverb and a compressor so sounds have space and can
 * never get loud.
 *
 * Sound is opt-in: it stays silent until the visitor turns it on, the choice is remembered, and
 * browsers only allow audio after a real gesture, so the context is created on that click (or on
 * the first click or key press of a later visit that remembered "on").
 */

type Listener = () => void;

const KEY = "sound";
/** Overall level of every tone and sweep. Tuned by measuring output: events peak near -10 dBFS, the ambient bed far below. */
const LEVEL = 0.8;

const listeners = new Set<Listener>();
let enabled = false;
let ctx: AudioContext | null = null;
let bus: GainNode | null = null;
let reverbIn: GainNode | null = null;
let noise: AudioBuffer | null = null;
let unlockBound = false;
let lastDetent = 0;
let lastHover = 0;

const emit = () => listeners.forEach((l) => l());

/** A synthetic room: exponentially decaying stereo noise. */
function impulse(c: AudioContext, seconds: number, decay: number) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.knee.value = 12;
  comp.ratio.value = 4;
  comp.attack.value = 0.003;
  comp.release.value = 0.2;
  const master = ctx.createGain();
  master.gain.value = 0.8;
  master.connect(comp).connect(ctx.destination);

  bus = ctx.createGain();
  bus.connect(master);

  // Reverb send: sounds feed this to sit in a space instead of sounding like bare beeps.
  reverbIn = ctx.createGain();
  const room = ctx.createConvolver();
  room.buffer = impulse(ctx, 1.8, 2.6);
  const wet = ctx.createGain();
  wet.gain.value = 0.32;
  reverbIn.connect(room).connect(wet).connect(master);

  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return ctx;
}

function ready() {
  return enabled && ctx !== null && bus !== null && ctx.state === "running";
}

/** Route a node to the dry bus and, by `send`, to the reverb. */
function route(node: AudioNode, send: number) {
  if (!ctx || !bus || !reverbIn) return;
  node.connect(bus);
  if (send > 0) {
    const s = ctx.createGain();
    s.gain.value = send;
    node.connect(s).connect(reverbIn);
  }
}

/** A short pitched note with a fast attack and an exponential fade. */
function tone(freq: number, delay: number, dur: number, peak: number, type: OscillatorType = "sine", endFreq?: number, send = 0.45) {
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak * LEVEL, t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  route(g, send);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Filtered noise: an air sweep, rising when parts open and falling when they close. */
function sweep(delay: number, dur: number, from: number, to: number, peak: number, send = 0.3) {
  if (!ctx || !noise) return;
  const t0 = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.1;
  filter.frequency.setValueAtTime(from, t0);
  filter.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak * LEVEL, t0 + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(g);
  route(g, send);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

/** A mechanical knock, like a latch letting go. The upper partial keeps it audible on small speakers. */
function thump(delay: number, peak: number) {
  tone(150, delay, 0.22, peak, "sine", 52, 0.25);
  tone(310, delay, 0.1, peak * 0.55, "triangle", 120, 0.25);
  tone(2400, delay, 0.025, peak * 0.25, "triangle", 900, 0.1);
}

/** Pentatonic ratios, one root per section so travelling down the machine climbs a tune. */
const RATIOS = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2];
const SCALE = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];

/** The ambient bed: two soft oscillators through a low-pass, and an air layer that follows scroll speed. */
type Ambient = { a: OscillatorNode; b: OscillatorNode; lp: BiquadFilterNode; drone: GainNode; air: GainNode; bp: BiquadFilterNode; air_src: AudioBufferSourceNode };
let ambient: Ambient | null = null;

function ambientStart() {
  if (!ctx || !bus || !noise || ambient) return;
  const now = ctx.currentTime;
  const a = ctx.createOscillator();
  const b = ctx.createOscillator();
  a.type = "triangle";
  b.type = "sine";
  a.frequency.value = 110;
  b.frequency.value = 165;
  b.detune.value = 6;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  const drone = ctx.createGain();
  drone.gain.setValueAtTime(0.0001, now);
  drone.gain.exponentialRampToValueAtTime(0.0065 * LEVEL, now + 2.5);
  a.connect(lp);
  b.connect(lp);
  lp.connect(drone);
  route(drone, 0.6);

  const air_src = ctx.createBufferSource();
  air_src.buffer = noise;
  air_src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.8;
  bp.frequency.value = 400;
  const air = ctx.createGain();
  air.gain.value = 0;
  air_src.connect(bp).connect(air);
  route(air, 0.35);

  a.start();
  b.start();
  air_src.start();
  ambient = { a, b, lp, drone, air, bp, air_src };
}

function ambientStop() {
  if (!ctx || !ambient) return;
  const { a, b, drone, air, air_src } = ambient;
  const now = ctx.currentTime;
  drone.gain.cancelScheduledValues(now);
  drone.gain.setTargetAtTime(0.0001, now, 0.25);
  air.gain.cancelScheduledValues(now);
  air.gain.setTargetAtTime(0, now, 0.1);
  window.setTimeout(() => {
    a.stop();
    b.stop();
    air_src.stop();
  }, 1200);
  ambient = null;
}

/**
 * One short motif per section, in that section's own character. `at` is when it begins, so it
 * lands just after the parts have finished pulling apart.
 */
function motif(section: number, at: number) {
  switch (section) {
    case 0: {
      // The instrument: a shutter click, then a focus ding.
      thump(at, 0.12);
      tone(660, at + 0.06, 0.5, 0.07);
      tone(990, at + 0.1, 0.55, 0.05);
      break;
    }
    case 1: {
      // Work: a pipeline job completing, a two-note ding.
      tone(784, at, 0.32, 0.09);
      tone(1046.5, at + 0.12, 0.6, 0.09);
      sweep(at, 0.3, 200, 600, 0.05);
      break;
    }
    case 2: {
      // Projects: data packets hopping between services.
      [0, 1, 2, 3].forEach((i) => tone(1100 + (i % 2) * 320 + i * 40, at + i * 0.07, 0.07, 0.07));
      tone(520, at + 0.3, 0.35, 0.07);
      break;
    }
    case 3: {
      // Skills: a short digital arpeggio, like a chip booting.
      [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5, 1568].forEach((f, i) => tone(f, at + i * 0.05, 0.1, 0.034, "square", undefined, 0.3));
      break;
    }
    default: {
      // Contact: a pen click, a stroke of paper, then a soft bell.
      thump(at, 0.12);
      tone(3000, at, 0.014, 0.07, "square", undefined, 0.1);
      tone(2600, at + 0.09, 0.014, 0.055, "square", undefined, 0.1);
      sweep(at + 0.2, 0.35, 3200, 1800, 0.06);
      tone(1318.5, at + 0.55, 1.3, 0.07, "sine", undefined, 0.7);
      tone(1760, at + 0.6, 1.1, 0.045, "sine", undefined, 0.7);
    }
  }
}

function startAudio() {
  ensure();
  void ctx?.resume().then(() => {
    if (enabled) ambientStart();
  });
}

export const sfx = {
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot: () => enabled,
  getServerSnapshot: () => false,

  /** True once the visitor has made a choice, so the toggle can stop inviting them. */
  hasChosen() {
    try {
      return localStorage.getItem(KEY) !== null;
    } catch {
      return true;
    }
  },

  /** Read the remembered choice. Audio itself waits for a gesture. */
  restore() {
    try {
      if (localStorage.getItem(KEY) !== "on" || enabled) return;
    } catch {
      return;
    }
    enabled = true;
    emit();
    if (unlockBound) return;
    unlockBound = true;
    const unlock = () => {
      startAudio();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
  },

  /** Must be called from a click or key press so the browser allows audio. */
  async set(next: boolean) {
    enabled = next;
    try {
      localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
      /* private mode: the choice just will not be remembered */
    }
    if (next) {
      ensure();
      await ctx?.resume();
      if (ready()) {
        ambientStart();
        // A small confirming chord so the toggle itself is audible.
        tone(SCALE[0], 0, 0.6, 0.12, "sine", undefined, 0.6);
        tone(SCALE[2], 0.07, 0.6, 0.1, "sine", undefined, 0.6);
        tone(SCALE[3], 0.14, 0.9, 0.09, "sine", undefined, 0.6);
      }
    } else {
      ambientStop();
    }
    emit();
  },

  /**
   * Called every frame with scroll speed (0..1) and the current section. The drone's root note
   * follows the section; the air layer swells and brightens as you scroll faster.
   */
  scroll(speed: number, section: number) {
    if (!ready() || !ctx || !ambient) return;
    const now = ctx.currentTime;
    const root = 110 * RATIOS[Math.min(RATIOS.length - 1, Math.max(0, Math.round(section)))];
    ambient.a.frequency.setTargetAtTime(root, now, 0.5);
    ambient.b.frequency.setTargetAtTime(root * 1.5, now, 0.5);
    ambient.lp.frequency.setTargetAtTime(380 + speed * 700, now, 0.15);
    ambient.air.gain.setTargetAtTime(speed * 0.1 * LEVEL, now, 0.08);
    ambient.bp.frequency.setTargetAtTime(350 + speed * 2600, now, 0.1);
  },

  /** The housing opens: air rushes, then each stage lets go in turn. */
  stageSeparation() {
    if (!ready()) return;
    sweep(0, 0.7, 380, 2600, 0.18);
    [0, 0.09, 0.18, 0.27, 0.36].forEach((d, i) => thump(d, 0.3 - i * 0.04));
  },

  /** The housing closes again. */
  stageClose() {
    if (!ready()) return;
    sweep(0, 0.5, 2200, 360, 0.14);
    thump(0.3, 0.2);
  },

  /**
   * A module comes into focus. The camera travels (air sweep), the module pulls apart (one rising
   * metallic tick per part), and a short motif says what the section is about.
   */
  arrive(section: number, parts: number) {
    if (!ready()) return;
    sweep(0, 0.5, 320, 1500, 0.1);
    for (let i = 0; i < parts; i++) {
      const f = 880 + i * 150;
      tone(f, 0.12 + i * 0.055, 0.1, 0.09, "triangle", f * 1.18, 0.35);
      sweep(0.12 + i * 0.055, 0.08, 1600, 3200, 0.04);
    }
    motif(section, 0.12 + parts * 0.055);
  },

  /** A module leaves focus: its parts snap back together, descending, ending in a latch. */
  fold(parts: number) {
    if (!ready()) return;
    for (let i = 0; i < parts; i++) tone(1500 - i * 120, i * 0.045, 0.08, 0.075, "triangle", 1300 - i * 120, 0.3);
    thump(parts * 0.045 + 0.02, 0.2);
  },

  /** A ratchet click as the scrubber playhead crosses a ruler tick, so scrolling feels like turning a dial. */
  detent(direction: 1 | -1) {
    if (!ready() || !ctx) return;
    const now = ctx.currentTime;
    if (now - lastDetent < 0.04) return;
    lastDetent = now;
    tone(direction > 0 ? 2300 : 1900, 0, 0.02, 0.05, "triangle", undefined, 0.1);
  },

  /** One tick per leader line as it draws in, rising a little each time. */
  leaders(count: number) {
    if (!ready()) return;
    for (let i = 0; i < count; i++) tone(1300 + i * 110, 0.25 + i * 0.11, 0.08, 0.06, "sine", undefined, 0.35);
  },

  /** Jumping to a checkpoint: a quick rising sweep with a two-note confirmation. */
  checkpoint() {
    if (!ready()) return;
    sweep(0, 0.35, 400, 1900, 0.14);
    tone(784, 0.05, 0.28, 0.1, "sine", undefined, 0.5);
    tone(1175, 0.12, 0.45, 0.08, "sine", undefined, 0.5);
  },

  /** The request pulse passes a coupler on its way down the axis. */
  ping(index: number) {
    if (!ready()) return;
    tone(660 + index * 110, 0, 1.2, 0.05, "sine", undefined, 0.8);
  },

  /** Hovering something clickable. */
  hover() {
    if (!ready() || !ctx) return;
    const now = ctx.currentTime;
    if (now - lastHover < 0.06) return;
    lastHover = now;
    tone(2000, 0, 0.035, 0.07, "sine", undefined, 0.2);
  },

  /** Pressing something clickable. */
  click() {
    if (!ready()) return;
    tone(1200, 0, 0.06, 0.1, "triangle", 700, 0.25);
    tone(1800, 0.03, 0.08, 0.06, "sine", undefined, 0.3);
  },
};
