"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./CertDonut.module.css";

const R = 70;
const C = 2 * Math.PI * R;
const TONES = ["var(--sodium)", "var(--ink)", "var(--ink-soft)", "var(--ink-faint)", "color-mix(in srgb, var(--ink) 30%, transparent)", "color-mix(in srgb, var(--ink) 16%, transparent)"];

/** Certifications by issuer. Counts come straight from the credentials list. */
export function CertDonut({ issuers }: { issuers: string[] }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.4);
  const svg = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const slices = useMemo(() => {
    const counts = new Map<string, number>();
    for (const raw of issuers) {
      const name = raw.startsWith("Google") ? "Google" : raw.startsWith("Zscaler") ? "Zscaler" : raw;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 5);
    const other = sorted.slice(5).reduce((n, [, c]) => n + c, 0);
    if (other) top.push(["Other issuers", other]);
    const lens = top.map(([, count]) => (count / issuers.length) * C);
    return top.map(([name, count], i) => ({
      name,
      count,
      len: lens[i],
      offset: lens.slice(0, i).reduce((a, b) => a + b, 0),
      color: TONES[i] ?? TONES[TONES.length - 1],
    }));
  }, [issuers]);

  useEffect(() => {
    const el = svg.current;
    if (!seen || !el || prefersReducedMotion()) return;
    const segs = Array.from(el.querySelectorAll<SVGCircleElement>("[data-seg]"));
    const anims = segs.map((seg, i) =>
      animate(seg, {
        strokeDasharray: [`0 ${C}`, `${Math.max(slices[i].len - 2, 0.5)} ${C}`],
        duration: 1200,
        delay: i * 140,
        ease: "outCubic",
      }),
    );
    return () => {
      anims.forEach((a) => a.pause());
    };
  }, [seen, slices]);

  return (
    <div ref={ref} className={styles.wrap}>
      <div className={styles.center}>
        <svg ref={svg} className={styles.svg} viewBox="0 0 190 190" role="img" aria-label={`${issuers.length} certifications across ${slices.length} issuer groups. ${slices.map((s) => `${s.name}: ${s.count}`).join(", ")}.`}>
          {slices.map((s, i) => (
            <circle
              key={s.name}
              data-seg
              className={`${styles.seg} ${active !== null && active !== i ? styles.dim : ""}`}
              cx="95"
              cy="95"
              r={R}
              stroke={s.color}
              strokeDasharray={`${Math.max(s.len - 2, 0.5)} ${C}`}
              strokeDashoffset={-s.offset}
              style={active === i ? { strokeWidth: 26 } : undefined}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className={styles.total} aria-hidden>
          <strong>{issuers.length}</strong>
          <span>certifications</span>
        </div>
      </div>
      <ul className={styles.legend}>
        {slices.map((s, i) => (
          <li key={s.name} className={styles.item} data-active={active === i} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)}>
            <span className={styles.swatch} style={{ background: s.color }} />
            <span>{s.name}</span>
            <span className={styles.n}>{s.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
