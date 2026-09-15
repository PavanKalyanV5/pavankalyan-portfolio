"use client";

import { useEffect, useState } from "react";

export interface Capabilities {
  /** True when a WebGL2 (or WebGL1 fallback) context could actually be created. */
  webgl: boolean;
  /** True when the user has asked for reduced motion. */
  reducedMotion: boolean;
  /** True for touch-primary devices (no fine pointer). */
  touch: boolean;
  /** Coarse "this device will struggle" signal. */
  lowPower: boolean;
  /** False until detection has run on the client. */
  ready: boolean;
}

const DEFAULT_CAPABILITIES: Capabilities = {
  webgl: false,
  reducedMotion: false,
  touch: false,
  lowPower: false,
  ready: false,
};

/**
 * Detects WebGL support by creating a throwaway canvas and attempting to get a WebGL2 or WebGL1 context.
 */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl");

    if (!gl) {
      return false;
    }

    // Try to lose the context to clean up
    try {
      const loseContextExt = gl.getExtension("WEBGL_lose_context");
      if (loseContextExt) {
        loseContextExt.loseContext();
      }
    } catch {
      // Ignore cleanup errors
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Detects reduced motion preference from system settings.
 */
function detectReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * Detects touch capability by checking for fine pointer support.
 */
function detectTouch(): boolean {
  try {
    return !window.matchMedia("(pointer: fine)").matches;
  } catch {
    return false;
  }
}

/**
 * Detects low-power devices based on hardware and viewport characteristics.
 */
function detectLowPower(): boolean {
  try {
    const hardwareConcurrency = navigator.hardwareConcurrency;
    if (hardwareConcurrency !== undefined && hardwareConcurrency <= 4) {
      return true;
    }

    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory !== undefined && deviceMemory < 4) {
      return true;
    }

    if (window.innerWidth < 640) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Hook that detects device capabilities for WebGL rendering.
 * Returns conservative values during SSR and first render, then detects real values in an effect.
 */
export function useCapabilities(): Capabilities {
  const [capabilities, setCapabilities] = useState<Capabilities>(
    DEFAULT_CAPABILITIES
  );

  useEffect(() => {
    // Detect all capabilities on the client
    const detected: Capabilities = {
      webgl: detectWebGL(),
      reducedMotion: detectReducedMotion(),
      touch: detectTouch(),
      lowPower: detectLowPower(),
      ready: true,
    };

    setCapabilities(detected);

    // Subscribe to reduced motion changes
    try {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = (e: MediaQueryListEvent) => {
        setCapabilities((prev) => ({
          ...prev,
          reducedMotion: e.matches,
        }));
      };

      // Use addEventListener for better compatibility
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    } catch {
      // If media query fails, just skip the listener
      return;
    }
  }, []);

  return capabilities;
}

/**
 * Determines whether the 3D experience should render or fall back to DOM.
 */
export function shouldRender3D(c: Capabilities): boolean {
  return c.ready && c.webgl && !c.reducedMotion;
}
