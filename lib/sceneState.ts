/**
 * Mutable state shared between the DOM (scroll, pointer) and the WebGL loop.
 * Kept outside React so per-frame updates never trigger a render.
 */
export const sceneState = {
  /** Morph target (0..4) derived from scroll position. */
  target: 0,
  /** Pointer in normalised device coordinates (-1..1). */
  pointer: { x: 0, y: 0 },
  /** Timestamp (ms) of the last real pointer movement. */
  lastPointerAt: -Infinity,
  reducedMotion: false,
};
