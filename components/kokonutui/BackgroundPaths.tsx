"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIsMounted } from "@/lib/useIsMounted";
import styles from "./BackgroundPaths.module.css";

interface BackgroundPathsProps {
  opacity?: number;
}

export function BackgroundPaths({ opacity = 0.35 }: BackgroundPathsProps) {
  const mounted = useIsMounted();
  const prefersReduced = useReducedMotion();

  const paths = [
    {
      d: "M -100 150 C 300 20, 600 350, 1100 120 C 1500 -50, 1800 280, 2200 180",
      stroke: "url(#grad-cool)",
      duration: 18,
      delay: 0,
    },
    {
      d: "M -50 450 C 400 600, 800 250, 1300 480 C 1700 680, 2000 350, 2300 520",
      stroke: "url(#grad-violet)",
      duration: 24,
      delay: 2,
    },
    {
      d: "M -120 750 C 350 500, 750 900, 1200 650 C 1600 420, 1950 850, 2250 720",
      stroke: "url(#grad-warm)",
      duration: 22,
      delay: 4,
    },
    {
      d: "M 200 -100 C 450 300, 150 700, 500 1100",
      stroke: "url(#grad-cool)",
      duration: 20,
      delay: 1,
    },
    {
      d: "M 1600 -100 C 1350 400, 1750 750, 1450 1100",
      stroke: "url(#grad-violet)",
      duration: 26,
      delay: 3,
    },
  ];

  return (
    <div className={styles.container} style={{ opacity }} suppressHydrationWarning>
      <svg
        className={styles.svg}
        viewBox="0 0 2000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        suppressHydrationWarning
      >
        <defs suppressHydrationWarning>
          <linearGradient id="grad-cool" x1="0%" y1="0%" x2="100%" y2="0%" suppressHydrationWarning>
            <stop offset="0%" stopColor="#5EE7D6" stopOpacity="0.05" suppressHydrationWarning />
            <stop offset="50%" stopColor="#5EE7D6" stopOpacity="0.6" suppressHydrationWarning />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.05" suppressHydrationWarning />
          </linearGradient>

          <linearGradient id="grad-violet" x1="0%" y1="0%" x2="100%" y2="0%" suppressHydrationWarning>
            <stop offset="0%" stopColor="#8A6BFF" stopOpacity="0.05" suppressHydrationWarning />
            <stop offset="50%" stopColor="#8A6BFF" stopOpacity="0.55" suppressHydrationWarning />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.05" suppressHydrationWarning />
          </linearGradient>

          <linearGradient id="grad-warm" x1="0%" y1="0%" x2="100%" y2="0%" suppressHydrationWarning>
            <stop offset="0%" stopColor="#FFB35C" stopOpacity="0.05" suppressHydrationWarning />
            <stop offset="50%" stopColor="#FFB35C" stopOpacity="0.5" suppressHydrationWarning />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.05" suppressHydrationWarning />
          </linearGradient>
        </defs>

        {mounted &&
          paths.map((p, i) => (
            <motion.path
              key={i}
              d={p.d}
              stroke={p.stroke}
              strokeWidth="1.5"
              strokeDasharray="16 24"
              fill="none"
              initial={
                prefersReduced
                  ? false
                  : {
                      strokeDashoffset: 0,
                      opacity: 0.3,
                    }
              }
              animate={
                prefersReduced
                  ? undefined
                  : {
                      strokeDashoffset: [-800, 800],
                      opacity: [0.25, 0.65, 0.25],
                    }
              }
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              suppressHydrationWarning
            />
          ))}
      </svg>
    </div>
  );
}
