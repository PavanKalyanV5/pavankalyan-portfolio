"use client";

import React, { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import styles from "./AnimeCircuit.module.css";

interface AnimeCircuitProps {
  className?: string;
  tone?: "cool" | "violet" | "warm";
}

export function AnimeCircuit({
  className = "",
  tone = "cool",
}: AnimeCircuitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const paths = containerRef.current.querySelectorAll(`.${styles.trace}`);
    const dots = containerRef.current.querySelectorAll(`.${styles.nodeDot}`);

    // Staggered line trace drawing
    const pathAnim = animate(paths, {
      strokeDashoffset: [400, 0],
      duration: 1800,
      delay: stagger(150),
      ease: "outCubic",
      loop: true,
      direction: "alternate",
    });

    // Pulsing nodes
    const dotAnim = animate(dots, {
      scale: [1, 1.45, 1],
      opacity: [0.4, 1, 0.4],
      duration: 1200,
      delay: stagger(120),
      ease: "inOutQuad",
      loop: true,
    });

    return () => {
      pathAnim.pause();
      dotAnim.pause();
    };
  }, []);

  const strokeColor =
    tone === "cool"
      ? "#5EE7D6"
      : tone === "violet"
      ? "#8A6BFF"
      : "#FFB35C";

  return (
    <div ref={containerRef} className={`${styles.circuitWrap} ${className}`}>
      <svg
        viewBox="0 0 400 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
      >
        <defs>
          <filter id={`circuitGlow_${tone}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Traces */}
        <path
          d="M 20 90 L 100 90 L 140 40 L 260 40 L 300 90 L 380 90"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray="400"
          strokeDashoffset="400"
          className={styles.trace}
          filter={`url(#circuitGlow_${tone})`}
        />
        <path
          d="M 60 140 L 120 140 L 160 100 L 240 100 L 280 140 L 340 140"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="400"
          strokeDashoffset="400"
          className={styles.trace}
          opacity="0.75"
        />
        <path
          d="M 140 40 L 140 10"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray="100"
          strokeDashoffset="100"
          className={styles.trace}
        />
        <path
          d="M 260 40 L 260 10"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray="100"
          strokeDashoffset="100"
          className={styles.trace}
        />

        {/* Terminal and junction dots */}
        <circle cx="20" cy="90" r="3.5" fill={strokeColor} className={styles.nodeDot} />
        <circle cx="100" cy="90" r="3" fill="#FFFFFF" className={styles.nodeDot} />
        <circle cx="140" cy="40" r="3" fill="#FFFFFF" className={styles.nodeDot} />
        <circle cx="140" cy="10" r="3.5" fill={strokeColor} className={styles.nodeDot} />
        <circle cx="260" cy="10" r="3.5" fill={strokeColor} className={styles.nodeDot} />
        <circle cx="260" cy="40" r="3" fill="#FFFFFF" className={styles.nodeDot} />
        <circle cx="300" cy="90" r="3" fill="#FFFFFF" className={styles.nodeDot} />
        <circle cx="380" cy="90" r="3.5" fill={strokeColor} className={styles.nodeDot} />
        <circle cx="60" cy="140" r="3" fill={strokeColor} className={styles.nodeDot} />
        <circle cx="340" cy="140" r="3" fill={strokeColor} className={styles.nodeDot} />
      </svg>
    </div>
  );
}
