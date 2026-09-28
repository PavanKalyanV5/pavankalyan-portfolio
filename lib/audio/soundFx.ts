"use client";

/**
 * Advanced Procedural Web Audio API Synthesizer for 3D Interactive Models.
 * Generates zero-latency sci-fi acoustic feedback with zero external sound files.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    playClickSound();
  }
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export type ModelArchetype = "hub" | "crystal" | "cube" | "torus" | "polyhedron";

/**
 * Intuitive 3D model hover audio with distinct acoustic timbres based on geometry.
 */
export function playModelHoverSound(archetype: ModelArchetype = "polyhedron"): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    if (archetype === "crystal") {
      // AI & RAG: Crystalline bell shimmer (dual sine harmonics)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1760, now);
      osc1.frequency.exponentialRampToValueAtTime(2640, now + 0.05);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(3520, now);
      osc2.frequency.exponentialRampToValueAtTime(4400, now + 0.04);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.065);
      osc2.stop(now + 0.065);
    } else if (archetype === "cube") {
      // .NET & Distributed Systems: Digital square-harmonic low-end pulse
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.075);
    } else if (archetype === "torus") {
      // Cloud & Network: Quantum laser blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } else if (archetype === "hub") {
      // Core Hub: Ethereal dual Solfeggio frequency chime (528Hz & 792Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(528, now);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(792, now);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.095);
      osc2.stop(now + 0.095);
    } else {
      // Standard Node: Crisp holographic tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.035);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Audio context may be restricted before user gesture
  }
}

/**
 * Cinematic 3D model activation sequence:
 * Target lock-on chirp + deep sub-bass quantum ignition + harmonic resolution.
 */
export function playModelSelectSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Digital lock-on chirp
    const chirp = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    chirp.type = "sine";
    chirp.frequency.setValueAtTime(2400, now);
    chirp.frequency.exponentialRampToValueAtTime(900, now + 0.04);
    chirpGain.gain.setValueAtTime(0.05, now);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    chirp.connect(chirpGain);
    chirpGain.connect(ctx.destination);
    chirp.start(now);
    chirp.stop(now + 0.05);

    // 2. Sub-bass quantum surge (80Hz deep kick)
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(220, now + 0.01);
    sub.frequency.exponentialRampToValueAtTime(55, now + 0.16);
    subGain.gain.setValueAtTime(0.12, now + 0.01);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now + 0.01);
    sub.stop(now + 0.19);

    // 3. Shimmering harmonic chord
    const chord = ctx.createOscillator();
    const chordGain = ctx.createGain();
    chord.type = "triangle";
    chord.frequency.setValueAtTime(1056, now + 0.03);
    chord.frequency.exponentialRampToValueAtTime(1320, now + 0.14);
    chordGain.gain.setValueAtTime(0.035, now + 0.03);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    chord.connect(chordGain);
    chordGain.connect(ctx.destination);
    chord.start(now + 0.03);
    chord.stop(now + 0.16);
  } catch {
    // Audio context may be restricted
  }
}

export const playHoverSound = playModelHoverSound;
export const playSelectSound = playModelSelectSound;

/**
 * Neural synthesis processing chirp when AI answers queries.
 */
export function playAiChirpSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Audio context may be restricted
  }
}

/**
 * Camera flight Doppler whoosh when hopping between 3D nodes.
 */
export function playFlightWhooshSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.09);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.2);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  } catch {
    // Audio context may be restricted
  }
}

/**
 * Hyperspace warp boom when switching 3D sectors.
 */
export function playLayerWarpSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.28);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.33);
  } catch {
    // Audio context may be restricted
  }
}

/**
 * Tactile micro-click for UI buttons.
 */
export function playClickSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Audio context may be restricted
  }
}
