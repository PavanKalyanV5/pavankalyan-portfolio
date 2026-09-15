"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import styles from "./CustomCursor.module.css";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  // Early return if SSR or if reduced motion is enabled
  if (!mounted || reducedMotion) {
    useEffect(() => {
      setMounted(true);
    }, []);
    return null;
  }

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  const ringX = useSpring(dotX, { stiffness: 220, damping: 28, mass: 0.6 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 28, mass: 0.6 });

  const [cursorState, setCursorState] = useState<{
    isCoarse: boolean;
    isHovering: boolean;
    hoveredElement: HTMLElement | null;
    cursorLabel: string | null;
  }>({
    isCoarse: false,
    isHovering: false,
    hoveredElement: null,
    cursorLabel: null,
  });

  useEffect(() => {
    setMounted(true);

    // Check pointer type
    const isCoarse = !window.matchMedia("(pointer: fine)").matches;
    if (isCoarse) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      const target = e.target as HTMLElement;
      const hoveredElement = target.closest("[data-cursor]");

      if (hoveredElement) {
        const label = hoveredElement.getAttribute("data-cursor-label");
        setCursorState({
          isCoarse: false,
          isHovering: true,
          hoveredElement: hoveredElement as HTMLElement,
          cursorLabel: label,
        });
      } else {
        setCursorState({
          isCoarse: false,
          isHovering: false,
          hoveredElement: null,
          cursorLabel: null,
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [dotX, dotY]);

  // Return null if coarse pointer or reduced motion
  if (cursorState.isCoarse || reducedMotion) {
    return null;
  }

  const ringSize = cursorState.isHovering ? 44 : 28;
  const ringBorderColor = cursorState.isHovering
    ? "var(--signal-warm)"
    : "rgb(94 231 214 / 0.5)";

  return (
    <>
      {/* Dot */}
      <motion.div
        className={styles.dot}
        style={{
          x: dotX,
          y: dotY,
        }}
      />

      {/* Ring */}
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
        {/* Label when hovering over a node */}
        {cursorState.isHovering &&
          cursorState.hoveredElement?.getAttribute("data-cursor") ===
            "node" &&
          cursorState.cursorLabel && (
            <span
              className={styles.label}
              style={{
                left: `calc(100% + 26px)`,
              }}
            >
              {cursorState.cursorLabel}
            </span>
          )}
      </motion.div>
    </>
  );
}
