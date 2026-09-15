"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { LAYER_GRAPHS } from "@/lib/mesh/layers";
import styles from "./BootSequence.module.css";

interface BootSequenceProps {
  /** Called exactly once when the sequence finishes or is skipped. */
  onComplete: () => void;
}

/**
 * Calculate total nodes and edges from LAYER_GRAPHS
 */
function computeStats() {
  let totalNodes = 0;
  let totalEdges = 0;

  Object.values(LAYER_GRAPHS).forEach((layer) => {
    totalNodes += layer.nodes.length;
    totalEdges += layer.edges.length;
  });

  return { totalNodes, totalEdges };
}

/**
 * Derived from static content at module load: the counts never change, so they
 * belong here rather than in a ref that would have to be read during render.
 */
const STATS = computeStats();

/** Cubic-bezier control points matching the design system's --ease-out. */
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(false);

  // If reduced motion, render null immediately and call onComplete
  useEffect(() => {
    if (prefersReducedMotion) {
      if (!onCompleteRef.current) {
        onCompleteRef.current = true;
        onComplete();
      }
    }
  }, [prefersReducedMotion, onComplete]);

  const handleSkip = () => {
    setVisible(false);
  };

  const handleKeyDown = () => {
    handleSkip();
  };

  const handleExitComplete = () => {
    if (!onCompleteRef.current) {
      onCompleteRef.current = true;
      onComplete();
    }
  };

  const handleClick = () => {
    handleSkip();
  };

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Add keyboard and click listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, [prefersReducedMotion]);

  const traces = [
    "init topology",
    `resolve nodes … ${STATS.totalNodes}`,
    `link edges … ${STATS.totalEdges}`,
    "start message flow",
    "ready",
  ];


  const containerVariants: Variants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 0.5, ease: EASE_OUT }
    },
  };

  const lineVariants: Variants = {
    initial: { opacity: 0, y: 6 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: EASE_OUT }
    },
  };

  const progressVariants: Variants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: { duration: 2.2, ease: "linear" }
    },
  };

  // Stagger offset in ms
  const staggerMs = 340;

  // Time for all traces to appear (4 intervals + first trace = 4*340 + 0)
  const tracesCompleteTime = staggerMs * 4;
  // Add animation duration of last trace
  const sequenceCompleteTime = tracesCompleteTime + 280 + 100;

  // Auto-trigger skip after sequence completes
  useEffect(() => {
    if (prefersReducedMotion || !visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, sequenceCompleteTime);

    return () => clearTimeout(timer);
  }, [visible, prefersReducedMotion, sequenceCompleteTime]);

  // Reduced motion gets no cinematic at all. The bail-out sits below every hook
  // so this component's hook order never changes between renders; the effect
  // above already reported completion.
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          className={styles.overlay}
          variants={containerVariants}
          initial="initial"
          exit="exit"
          role="status"
          aria-live="polite"
        >
          <div className={styles.content}>
            {/* Trace lines */}
            <div className={styles.traces}>
              {traces.map((text, index) => {
                const isLast = index === traces.length - 1;
                return (
                  <motion.div
                    key={index}
                    className={styles.traceLine}
                    variants={lineVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: (index * staggerMs) / 1000 }}
                  >
                    <span className={styles.marker} data-is-last={isLast}>
                      {isLast ? "+" : "·"}
                    </span>
                    <span className={styles.text} data-is-ready={isLast}>
                      {text}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress rail */}
            <div className={styles.progressRail}>
              <motion.div
                className={styles.progressFill}
                variants={progressVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>

          {/* Skip button */}
          <button
            className={styles.skipButton}
            onClick={handleSkip}
            aria-label="Skip intro"
            data-cursor="link"
          >
            skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
