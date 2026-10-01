"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, svg } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./Viz.module.css";

/** [x, y] per node, in 5 layers. Choice points branch; some routes merge back. */
const N: [number, number][] = [
  [40, 105],
  [150, 50], [150, 160],
  [270, 25], [270, 100], [270, 185],
  [390, 60], [390, 150],
  [510, 105],
  [600, 105],
];
const E: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 6], [4, 6], [4, 7], [5, 7], [6, 8], [7, 8], [8, 9],
];
/** Three playthroughs the highlight cycles through (node indices). */
const ROUTES = [
  [0, 1, 3, 6, 8, 9],
  [0, 1, 4, 7, 8, 9],
  [0, 2, 5, 7, 8, 9],
];

/** A branching story graph; a route lights up node by node, resolving each condition. */
export function RouteMap() {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!seen || !el) return;
    const nodes = Array.from(el.querySelectorAll<SVGCircleElement>("[data-n]"));
    const edges = Array.from(el.querySelectorAll<SVGLineElement>("[data-e]"));
    const label = el.querySelector<SVGTextElement>("[data-label]")!;
    const reduced = prefersReducedMotion();
    if (reduced) {
      label.textContent = "Route 1 of 3";
      ROUTES[0].forEach((i) => nodes[i].classList.add(styles.nodeOn));
      return;
    }
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    animate(svg.createDrawable(edges), { draw: ["0 0", "0 1"], duration: 700, delay: stagger(50), ease: "outCubic" });
    animate(nodes, { scale: [0, 1], duration: 400, delay: stagger(60, { start: 200 }), ease: "outBack" });

    const run = async () => {
      await wait(1400);
      let r = 0;
      while (!cancelled) {
        const route = ROUTES[r % ROUTES.length];
        label.textContent = `Route ${(r % ROUTES.length) + 1} of ${ROUTES.length}`;
        nodes.forEach((n) => n.classList.remove(styles.nodeOn));
        edges.forEach((e) => e.setAttribute("class", styles.faint));
        for (let k = 0; k < route.length; k++) {
          if (cancelled) return;
          nodes[route[k]].classList.add(styles.nodeOn);
          animate(nodes[route[k]], { scale: [1, 1.45, 1], duration: 400, ease: "outQuad" });
          if (k > 0) {
            const idx = E.findIndex(([a, b]) => a === route[k - 1] && b === route[k]);
            if (idx >= 0) edges[idx].setAttribute("class", styles.hot);
          }
          await wait(420);
        }
        await wait(1800);
        r++;
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [seen]);

  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox="0 0 640 210" role="img" aria-label="A branching story graph with ten nodes. Three different routes light up in turn from the first node to the ending.">
        {E.map(([a, b], i) => (
          <line key={i} data-e className={styles.faint} x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} />
        ))}
        {N.map(([x, y], i) => (
          <circle key={i} data-n className={styles.node} style={{ transformBox: "fill-box", transformOrigin: "center" }} cx={x} cy={y} r={9} />
        ))}
        <text data-label className={`${styles.label} ${styles.accentText}`} x={8} y={204} />
      </svg>
      <figcaption className={styles.caption}>The route map resolves branching conditions and state changes without running the game.</figcaption>
    </figure>
  );
}
