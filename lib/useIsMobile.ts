"use client";

import { useSyncExternalStore } from "react";

/**
 * React 19 hook to check if the viewport is mobile (< 840px).
 * Evaluates cleanly without triggering cascading renders or hydration mismatches.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("resize", onChange);
      return () => window.removeEventListener("resize", onChange);
    },
    () => window.innerWidth < 840,
    () => false
  );
}
