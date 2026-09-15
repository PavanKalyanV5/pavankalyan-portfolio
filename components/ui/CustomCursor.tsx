"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import styles from "./CustomCursor.module.css";

interface HoverTarget {
  active: boolean;
  kind: string | null;
  label: string | null;
}

const IDLE: HoverTarget = { active: false, kind: null, label: null };

const FINE_POINTER = "(pointer: fine)";

function subscribeFinePointer(onChange: () => void) {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getFinePointer() {
  return window.matchMedia(FINE_POINTER).matches;
}

/** Server render has no pointer; assume coarse so nothing is emitted during SSR. */
function getServerFinePointer() {
  return false;
}

export function CustomCursor() {
  // Every hook below runs on every render, unconditionally. Whether the cursor
  // is shown is decided in the returned JSX — never by skipping hooks, which is
  // what previously crashed this component with a hook-order error.
  const reducedMotion = useReducedMotion();
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointer,
    getServerFinePointer
  );
  const [hover, setHover] = useState<HoverTarget>(IDLE);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 220, damping: 28, mass: 0.6 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 28, mass: 0.6 });

  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    const onPointerMove = (event: PointerEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);

      const target = event.target as Element | null;
      const match = target?.closest?.("[data-cursor]") ?? null;

      setHover(
        match
          ? {
              active: true,
              kind: match.getAttribute("data-cursor"),
              label: match.getAttribute("data-cursor-label"),
            }
          : IDLE
      );
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [enabled, dotX, dotY]);

  if (!enabled) return null;

  const ringSize = hover.active ? 44 : 28;
  const ringBorderColor = hover.active
    ? "var(--signal-warm)"
    : "rgb(94 231 214 / 0.5)";

  return (
    <>
      <motion.div className={styles.dot} style={{ x: dotX, y: dotY }} />
      <motion.div
        className={styles.ring}
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          borderColor: ringBorderColor,
        }}
      >
        {hover.active && hover.kind === "node" && hover.label && (
          <span className={styles.label}>{hover.label}</span>
        )}
      </motion.div>
    </>
  );
}
