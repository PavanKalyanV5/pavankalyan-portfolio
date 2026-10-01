"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, svg } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./Viz.module.css";

const W = 640;
const H = 230;
const K = 8;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Nearest-neighbour search over embeddings, replayed for a few different queries. */
export function VectorSearchViz({ caption = "Lookups averaged 42 ms across 50,000+ indexed chunks. The points here are an illustration." }: { caption?: string }) {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const root = useRef<SVGSVGElement>(null);

  const { dots, queries } = useMemo(() => {
    const r = rng(7);
    const centers = Array.from({ length: 6 }, () => [60 + r() * 520, 40 + r() * 150]);
    const d = Array.from({ length: 190 }, (_, i) => {
      const c = centers[i % centers.length];
      return { x: c[0] + (r() - 0.5) * 120, y: c[1] + (r() - 0.5) * 80 };
    });
    const q = [centers[1], centers[4], centers[2]].map((c) => ({ x: c[0] + 8, y: c[1] - 6 }));
    return { dots: d, queries: q };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!seen || !el) return;
    const circles = Array.from(el.querySelectorAll<SVGCircleElement>("[data-dot]"));
    const qdot = el.querySelector<SVGCircleElement>("[data-q]")!;
    const ripple = el.querySelector<SVGCircleElement>("[data-ripple]")!;
    const links = el.querySelector<SVGGElement>("[data-links]")!;
    const readout = el.querySelector<SVGTextElement>("[data-readout]")!;
    const reduced = prefersReducedMotion();
    let cancelled = false;
    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const run = async () => {
      let qi = 0;
      while (!cancelled) {
        const q = queries[qi % queries.length];
        qi++;
        const ranked = dots
          .map((d, i) => ({ i, dist: Math.hypot(d.x - q.x, d.y - q.y) }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, K);
        circles.forEach((c) => c.classList.remove(styles.hit));
        links.innerHTML = "";
        readout.textContent = "";
        qdot.setAttribute("cx", String(q.x));
        qdot.setAttribute("cy", String(q.y));
        ripple.setAttribute("cx", String(q.x));
        ripple.setAttribute("cy", String(q.y));
        if (reduced) {
          ranked.forEach((n) => circles[n.i].classList.add(styles.hit));
          readout.textContent = `top ${K} of ${dots.length}`;
          return;
        }
        await animate(qdot, { r: [0, 7], opacity: [0, 1], duration: 450, ease: "outBack" });
        const reach = ranked[K - 1].dist + 6;
        animate(ripple, { r: [4, reach], opacity: [0.9, 0.15], duration: 900, ease: "outCubic" });
        await wait(450);
        for (const n of ranked) {
          if (cancelled) return;
          const d = dots[n.i];
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", String(q.x));
          line.setAttribute("y1", String(q.y));
          line.setAttribute("x2", String(d.x));
          line.setAttribute("y2", String(d.y));
          line.setAttribute("class", styles.hot);
          line.setAttribute("stroke-width", "1.3");
          links.appendChild(line);
          animate(svg.createDrawable(line), { draw: ["0 0", "0 1"], duration: 380, ease: "outCubic" });
          circles[n.i].classList.add(styles.hit);
          animate(circles[n.i], { r: [3.2, 6, 4.2], duration: 500, ease: "outQuad" });
          await wait(90);
        }
        readout.textContent = `top ${K} of ${dots.length} points`;
        await wait(2200);
        await animate([qdot, ripple], { opacity: 0, duration: 300 });
        links.innerHTML = "";
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [seen, dots, queries]);

  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Embeddings drawn as clusters of points. A query appears, and its eight nearest neighbours light up and connect to it.">
        {dots.map((d, i) => (
          <circle key={i} data-dot className={styles.dot} cx={d.x} cy={d.y} r={3.2} />
        ))}
        <g data-links />
        <circle data-ripple className={styles.ripple} r={0} opacity={0} />
        <circle data-q className={styles.query} r={0} opacity={0} />
        <text data-readout className={`${styles.small} ${styles.accentText}`} x={8} y={H - 6} />
      </svg>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
