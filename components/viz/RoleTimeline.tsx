"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, stagger } from "animejs";
import type { ExperienceEntry } from "@/content/types";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./RoleTimeline.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Jul 2022 – Sep 2022" becomes a pair of month indices. */
function parse(label: string): [number, number] | null {
  const m = [...label.matchAll(/([A-Z][a-z]{2})\s(\d{4})/g)].map((x) => Number(x[2]) * 12 + MONTHS.indexOf(x[1]));
  return m.length >= 2 ? [m[0], m[1]] : null;
}

function shortName(e: ExperienceEntry) {
  const org = e.organization.split(" \u2014 ")[0].replace(" Pvt Ltd", "");
  if (!org.startsWith("Kovalty")) return org;
  return e.role.includes("Intern") ? "Kovalty, intern" : "Kovalty, engineer";
}

/** Every role on one shared time axis, so overlaps and the Kovalty stretch read at a glance. */
export function RoleTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const plot = useRef<HTMLDivElement>(null);

  const { rows, ticks, span } = useMemo(() => {
    const parsed = entries
      .map((e) => ({ e, r: parse(e.dateLabel) }))
      .filter((x): x is { e: ExperienceEntry; r: [number, number] } => x.r !== null);
    const min = Math.min(...parsed.map((p) => p.r[0]));
    const max = Math.max(...parsed.map((p) => p.r[1])) + 1;
    const total = max - min;
    const firstYear = Math.ceil(min / 12);
    const lastYear = Math.floor(max / 12);
    return {
      span: total,
      rows: parsed.map(({ e, r }) => ({
        id: e.id,
        name: shortName(e),
        title: `${e.role}, ${e.dateLabel}`,
        left: ((r[0] - min) / total) * 100,
        width: ((r[1] + 1 - r[0]) / total) * 100,
        hot: e.tier === "primary",
      })),
      ticks: Array.from({ length: lastYear - firstYear + 1 }, (_, i) => ({
        year: firstYear + i,
        left: (((firstYear + i) * 12 - min) / total) * 100,
      })),
    };
  }, [entries]);

  useEffect(() => {
    const el = plot.current;
    if (!seen || !el || prefersReducedMotion()) return;
    const a = animate(el.querySelectorAll("[data-bar]"), {
      scaleX: [0, 1],
      duration: 1100,
      delay: stagger(120),
      ease: "outExpo",
    });
    return () => {
      a.pause();
    };
  }, [seen]);

  return (
    <figure ref={ref} className={styles.chart}>
      <figcaption className={styles.cap}>Roles on one timeline</figcaption>
      <div ref={plot} className={styles.plot} role="img" aria-label={`Timeline of ${rows.length} roles across ${Math.round(span / 12)} years. The two Kovalty Technologies roles are highlighted.`}>
        <div className={styles.grid} aria-hidden>
          {ticks.map((t) => (
            <span key={t.year} className={styles.gridline} style={{ left: `${t.left}%` }} />
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.id} className={styles.row} title={r.title}>
            <span className={styles.name}>{r.name}</span>
            <div className={styles.track}>
              <span data-bar className={`${styles.bar} ${r.hot ? styles.hot : ""}`} style={{ left: `${r.left}%`, width: `${Math.max(r.width, 1.2)}%` }} />
            </div>
          </div>
        ))}
        <div className={styles.axis} aria-hidden>
          <span />
          <div className={styles.ticks}>
            {ticks.map((t) => (
              <span key={t.year} className={styles.tick} style={{ left: `${t.left}%` }}>
                {t.year}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
