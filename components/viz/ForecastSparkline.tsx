"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, svg } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./ForecastSparkline.module.css";

const W = 640;
const H = 190;
const SPLIT = 400;

function curve(t: number) {
  // Trend + weekly-ish seasonality + a slow cycle: the three things SSA separates.
  return 112 - t * 38 + Math.sin(t * 24) * 11 + Math.sin(t * 7 + 1) * 16;
}

/** Illustrates the method (history, forecast, widening uncertainty). It is not production data. */
export function ForecastSparkline() {
  const [ref, seen] = useInView<HTMLElement>(0.4);
  const root = useRef<SVGSVGElement>(null);

  const { history, forecast, band } = useMemo(() => {
    const pts = (from: number, to: number) =>
      Array.from({ length: 90 }, (_, i) => {
        const t = from + ((to - from) * i) / 89;
        return [t * W, curve(t)] as const;
      });
    const h = pts(0, SPLIT / W);
    const f = pts(SPLIT / W, 1);
    const toPath = (p: readonly (readonly [number, number])[]) => p.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    const spread = (x: number) => 4 + ((x - SPLIT) / (W - SPLIT)) ** 1.6 * 38;
    const up = f.map(([x, y]) => [x, y - spread(x)] as const);
    const lo = f.map(([x, y]) => [x, y + spread(x)] as const).reverse();
    return {
      history: toPath(h),
      forecast: toPath(f),
      band: `${toPath(up)} ${lo.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")} Z`,
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!seen || !el || prefersReducedMotion()) return;
    const [h] = svg.createDrawable(el.querySelector(`.${styles.history}`) as SVGPathElement);
    const [f] = svg.createDrawable(el.querySelector(`.${styles.forecast}`) as SVGPathElement);
    const a1 = animate(h, { draw: ["0 0", "0 1"], duration: 1800, ease: "inOutQuad" });
    const a2 = animate(f, { draw: ["0 0", "0 1"], duration: 1400, delay: 1700, ease: "inOutQuad" });
    const a3 = animate(el.querySelector(`.${styles.band}`) as SVGPathElement, { opacity: [0, 0.14], duration: 1200, delay: 2300, ease: "outQuad" });
    return () => [a1, a2, a3].forEach((a) => a.pause());
  }, [seen]);

  // Hover scrubber: shows how wide the uncertainty is at any point along the curve.
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(W, Math.max(0, ((e.clientX - r.left) / r.width) * W));
    const y = curve(x / W);
    const sp = x > SPLIT ? 4 + ((x - SPLIT) / (W - SPLIT)) ** 1.6 * 38 : 0;
    const g = el.querySelector("[data-scrub]")!;
    g.setAttribute("opacity", "1");
    g.querySelector("line")!.setAttribute("x1", String(x));
    g.querySelector("line")!.setAttribute("x2", String(x));
    const band = g.querySelector<SVGLineElement>("[data-spread]")!;
    band.setAttribute("x1", String(x));
    band.setAttribute("x2", String(x));
    band.setAttribute("y1", String(y - sp));
    band.setAttribute("y2", String(y + sp));
    const dot = g.querySelector("circle")!;
    dot.setAttribute("cx", String(x));
    dot.setAttribute("cy", String(y));
    dot.setAttribute("class", x > SPLIT ? styles.dotHot : styles.dotInk);
    const t = g.querySelector("text")!;
    t.setAttribute("x", String(Math.min(x + 10, W - 150)));
    t.textContent = x > SPLIT ? (sp > 20 ? "Far out: wide range" : "Near term: narrow range") : "Observed history";
  };

  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox={`0 0 ${W} ${H}`} onPointerMove={onMove} onPointerLeave={() => root.current?.querySelector("[data-scrub]")?.setAttribute("opacity", "0")} role="img" aria-label="Line chart: a noisy history on the left continues as a dashed forecast that fans out into a widening uncertainty band.">
        <line className={styles.axis} x1="0" x2={W} y1={H - 8} y2={H - 8} />
        <line className={`${styles.axis} ${styles.split}`} x1={SPLIT} x2={SPLIT} y1="4" y2={H - 8} />
        <path className={styles.band} d={band} />
        <path className={styles.history} d={history} />
        <path className={styles.forecast} d={forecast} />
        <g data-scrub opacity={0} pointerEvents="none">
          <line className={styles.axis} y1="4" y2={H - 8} />
          <line data-spread className={styles.spread} />
          <circle r={5} />
          <text className={styles.tag} y={H - 16} />
        </g>
        <text className={styles.tag} x={SPLIT - 8} y={18} textAnchor="end">History</text>
        <text className={`${styles.tag} ${styles.tagAccent}`} x={SPLIT + 8} y={18}>Forecast and uncertainty</text>
      </svg>
      <figcaption className={styles.caption}>Move across the chart to see the range widen. An illustration of the method, not production data.</figcaption>
    </figure>
  );
}
