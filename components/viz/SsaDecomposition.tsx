"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, stagger, svg } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./Viz.module.css";

const W = 400;
const ROW = 52;

function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const trend = (t: number) => 20 - t * 16;
const season = (t: number) => Math.sin(t * Math.PI * 10) * 9;
const noise = (i: number) => (seeded(i) - 0.5) * 9;

function path(fn: (t: number, i: number) => number, base: number) {
  return Array.from({ length: 80 }, (_, i) => {
    const t = i / 79;
    return `${i ? "L" : "M"}${(t * W).toFixed(1)} ${(base - fn(t, i)).toFixed(1)}`;
  }).join(" ");
}

/** Singular Spectrum Analysis splits one noisy signal into parts a tree model can learn from. */
export function SsaDecomposition() {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const root = useRef<SVGSVGElement>(null);

  const rows = useMemo(
    () => [
      { name: "Signal", d: path((t, i) => trend(t) + season(t) + noise(i) + 14, ROW * 0.7), hot: false },
      { name: "Trend", d: path((t) => trend(t) + 8, ROW * 1.7), hot: false },
      { name: "Seasonality", d: path((t) => season(t), ROW * 2.55), hot: false },
      { name: "Residual noise", d: path((_, i) => noise(i), ROW * 3.35), hot: true },
    ],
    [],
  );

  useEffect(() => {
    const el = root.current;
    if (!seen || !el || prefersReducedMotion()) return;
    const paths = Array.from(el.querySelectorAll<SVGPathElement>("[data-row]"));
    const a1 = animate(svg.createDrawable(paths[0]), { draw: ["0 0", "0 1"], duration: 1400, ease: "inOutQuad" });
    const a2 = animate(svg.createDrawable(paths.slice(1)), { draw: ["0 0", "0 1"], duration: 1200, delay: stagger(260, { start: 1500 }), ease: "inOutQuad" });
    const a3 = animate(el.querySelectorAll("[data-feat]"), { opacity: [0, 1], translateX: [-10, 0], duration: 600, delay: stagger(140, { start: 2600 }), ease: "outCubic" });
    return () => {
      [a1, a2, a3].forEach((a) => a.pause());
    };
  }, [seen]);

  const lanes = [0.7, 1.7, 2.55, 3.35];
  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox={`0 0 640 ${ROW * 4}`} role="img" aria-label="One noisy signal is decomposed into a trend, a seasonal wave, and residual noise. The trend and seasonality become features for a LightGBM model.">
        <g transform="translate(110 0)">
          {rows.map((r) => (
            <path key={r.name} data-row className={r.hot ? styles.faint : styles.line} d={r.d} />
          ))}
        </g>
        {rows.map((r, i) => (
          <text key={r.name} className={styles.small} x={0} y={ROW * lanes[i] + 4}>
            {r.name}
          </text>
        ))}
        <g data-feat>
          <path className={styles.hot} d={`M520 ${ROW * 1.7 - 4} H556 V${ROW * 2.1} M520 ${ROW * 2.55 - 4} H556 V${ROW * 2.1} H580`} />
          <rect className={styles.box} x={580} y={ROW * 2.1 - 22} width={60} height={44} rx={5} />
          <text className={styles.label} x={610} y={ROW * 2.1 - 2} textAnchor="middle">Light</text>
          <text className={styles.label} x={610} y={ROW * 2.1 + 13} textAnchor="middle">GBM</text>
        </g>
      </svg>
      <figcaption className={styles.caption}>Trend and seasonality go in as features; the noise stays out. An illustration, not production data.</figcaption>
    </figure>
  );
}
