"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * React 19 compliant hook to determine if the component has hydrated on the client.
 * Returns false on SSR, true on client, without triggering set-state-in-effect.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
