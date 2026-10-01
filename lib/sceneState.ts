/**
 * Mutable state shared between the DOM (scroll, pointer) and the WebGL loop.
 * Kept outside React so per-frame updates never trigger a render.
 */
export const sceneState = {
  /** Scene (0 = overview at the hero, then 1..5 for the five modules in page order), eased from scroll position. */
  target: 0,
  /** Pointer in normalised device coordinates (-1..1). */
  pointer: { x: 0, y: 0 },
  /** Timestamp (ms) of the last real pointer movement. */
  lastPointerAt: -Infinity,
  reducedMotion: false,
};
