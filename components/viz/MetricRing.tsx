"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { AnimeCounter } from "./AnimeCounter";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./MetricRing.module.css";

const R = 48;
const C = 2 * Math.PI * R;

/** A percentage drawn as a ring that fills when scrolled into view. */
export function MetricRing({ value, decimals = 0, label }: { value: number; decimals?: number; label: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.5);
  const bar = useRef<SVGCircleElement>(null);
  const target = C * (1 - value / 100);

  useEffect(() => {
    const el = bar.current;
    if (!seen || !el || prefersReducedMotion()) return;
    const a = animate(el, { strokeDashoffset: [C, target], duration: 1800, ease: "outExpo" });
    return () => {
      a.pause();
    };
  }, [seen, target]);

  return (
    <div ref={ref} className={styles.ring}>
      <div className={styles.wrap}>
        <svg className={styles.svg} viewBox="0 0 112 112" aria-hidden>
          <circle className={styles.track} cx="56" cy="56" r={R} />
          <circle ref={bar} className={styles.bar} cx="56" cy="56" r={R} strokeDasharray={C} strokeDashoffset={target} />
        </svg>
        <AnimeCounter className={styles.value} to={value} decimals={decimals} suffix="%" />
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
