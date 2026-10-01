"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./Viz.module.css";

const BEFORE = 41906;
const AFTER = 220;
const BAR_W = 640;

/** The measured result of one scrub pass, drawn to scale. */
export function ScrubBars() {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const root = useRef<SVGSVGElement>(null);
  const reduction = ((1 - AFTER / BEFORE) * 100).toFixed(1);

  useEffect(() => {
    const el = root.current;
    if (!seen || !el || prefersReducedMotion()) return;
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const nb = q<SVGTextElement>("[data-nb]");
    const na = q<SVGTextElement>("[data-na]");
    const sb = { v: 0 };
    const sa = { v: 0 };
    const anims = [
      animate(q("[data-bar-b]"), { scaleX: [0, 1], duration: 1400, ease: "outExpo" }),
      animate(sb, { v: BEFORE, duration: 1400, ease: "outExpo", onUpdate: () => (nb.textContent = Math.round(sb.v).toLocaleString("en-US")) }),
      animate(q("[data-bar-a]"), { scaleX: [0, 1], duration: 900, delay: 1500, ease: "outExpo" }),
      animate(sa, { v: AFTER, duration: 900, delay: 1500, ease: "outExpo", onUpdate: () => (na.textContent = Math.round(sa.v).toLocaleString("en-US")) }),
      animate(q("[data-big]"), { opacity: [0, 1], translateY: [10, 0], duration: 600, delay: 2300, ease: "outCubic" }),
    ];
    return () => {
      anims.forEach((a) => a.pause());
    };
  }, [seen]);

  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox={`0 0 ${BAR_W} 200`} role="img" aria-label={`Personal values found on disk: ${BEFORE.toLocaleString("en-US")} before one scrub pass, ${AFTER} after. That is ${reduction} percent fewer.`}>
        <text className={styles.label} x={0} y={18}>Before one scrub pass</text>
        <text data-nb className={styles.big} x={BAR_W} y={22} textAnchor="end">{BEFORE.toLocaleString("en-US")}</text>
        <rect className={styles.bar} x={0} y={30} width={BAR_W} height={16} rx={3} />
        <rect data-bar-b className={styles.barFill} x={0} y={30} width={BAR_W} height={16} rx={3} />

        <text className={styles.label} x={0} y={90}>After</text>
        <text data-na className={`${styles.big} ${styles.accentText}`} x={BAR_W} y={94} textAnchor="end">{AFTER}</text>
        <rect className={styles.bar} x={0} y={102} width={BAR_W} height={16} rx={3} />
        <rect data-bar-a className={styles.query} x={0} y={102} width={(AFTER / BEFORE) * BAR_W} height={16} rx={3} style={{ transformBox: "fill-box", transformOrigin: "0 50%" }} />

        <g data-big>
          <text className={`${styles.big} ${styles.accentText}`} x={0} y={170}>{reduction}% fewer personal values</text>
          <text className={styles.small} x={0} y={190}>on a real machine, found on disk</text>
        </g>
      </svg>
      <figcaption className={styles.caption}>Bars are drawn to scale. The figures come from the project&apos;s own README.</figcaption>
    </figure>
  );
}
