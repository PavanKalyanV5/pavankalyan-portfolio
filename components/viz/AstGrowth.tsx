"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, svg } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./Viz.module.css";

const LAYERS: [number, number][][] = [
  [[470, 30]],
  [[380, 90], [470, 90], [560, 90]],
  [[340, 150], [410, 150], [450, 150], [500, 150], [540, 150], [590, 150]],
];
const EDGES: [[number, number], [number, number]][] = [
  [[470, 30], [380, 90]], [[470, 30], [470, 90]], [[470, 30], [560, 90]],
  [[380, 90], [340, 150]], [[380, 90], [410, 150]], [[470, 90], [450, 150]],
  [[470, 90], [500, 150]], [[560, 90], [540, 150]], [[560, 90], [590, 150]],
];

/** A script is read once; the parser's work shows as a counter racing a 2.2 second budget while the tree grows. */
export function AstGrowth() {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!seen || !el) return;
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const count = q<SVGTextElement>("[data-count]");
    const fill = q<SVGRectElement>("[data-fill]");
    const reduced = prefersReducedMotion();
    if (reduced) {
      count.textContent = "250,000";
      return;
    }
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const state = { n: 0 };

    const run = async () => {
      while (!cancelled) {
        state.n = 0;
        count.textContent = "0";
        animate(fill, { scaleX: [0, 1], duration: 2200, ease: "inOutQuad" });
        animate(el.querySelectorAll("[data-line]"), { opacity: [0.15, 1], duration: 400, delay: stagger(110), ease: "outQuad" });
        animate(svg.createDrawable(el.querySelectorAll("[data-edge]")), { draw: ["0 0", "0 1"], duration: 500, delay: stagger(220, { start: 400 }), ease: "outCubic" });
        animate(el.querySelectorAll("[data-node]"), { scale: [0, 1], opacity: [0, 1], duration: 450, delay: stagger(200, { start: 300 }), ease: "outBack" });
        await animate(state, {
          n: 250000,
          duration: 2200,
          ease: "inOutQuad",
          onUpdate: () => {
            count.textContent = Math.round(state.n).toLocaleString("en-US");
          },
        });
        await wait(2600);
        if (cancelled) return;
        await animate(el.querySelectorAll("[data-node], [data-edge]"), { opacity: 0, duration: 350 });
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [seen]);

  const widths = [180, 120, 210, 90, 160, 140, 200];
  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox="0 0 640 210" role="img" aria-label="A script's lines are parsed in under 2.2 seconds into a tree of branching nodes while a counter climbs to 250,000 lines.">
        {widths.map((w, i) => (
          <rect key={i} data-line className={styles.barFill} x={10 + (i % 3) * 14} y={14 + i * 17} width={w} height={7} rx={3} />
        ))}
        {EDGES.map(([a, b], i) => (
          <line key={i} data-edge className={styles.faint} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        ))}
        {LAYERS.flat().map(([x, y], i) => (
          <circle key={i} data-node className={i === 0 ? styles.query : styles.node} style={{ transformBox: "fill-box", transformOrigin: "center" }} cx={x} cy={y} r={i === 0 ? 9 : 7.5} />
        ))}
        <text data-count className={styles.big} x={10} y={158}>0</text>
        <text className={styles.small} x={10} y={176}>lines parsed, 2.2 s budget</text>
        <rect className={styles.bar} x={10} y={186} width={250} height={6} rx={3} />
        <rect data-fill className={styles.barFill} x={10} y={186} width={250} height={6} rx={3} />
      </svg>
      <figcaption className={styles.caption}>250,000+ line scripts parse in under 2.2 seconds, then load from the cache.</figcaption>
    </figure>
  );
}
