"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import type { SkillCategory } from "@/content/types";
import { SkillGlobe } from "@/components/viz/SkillGlobe";
import { Tech } from "@/components/ui/TechIcon";
import { prefersReducedMotion, useInView } from "@/components/viz/useInView";
import styles from "./SkillsExplorer.module.css";

/** Shorter labels for the globe only. The full names stay in the list beneath it. */
const SHORT: Record<string, string> = {
  "Retrieval-Augmented Generation (RAG)": "RAG",
  "LLM Integration (Gemini, GPT)": "LLM integration",
  "Time-Series Forecasting (SSA)": "Forecasting",
  "SQL Server Management Studio": "SSMS",
  "Object-Oriented Design": "OOD",
  "Material UI (MUI)": "Material UI",
};

/** Globe plus per-category breakdown. Hover or pick a row to light that group in the globe. */
export function SkillsExplorer({ categories }: { categories: SkillCategory[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  const list = useRef<HTMLDivElement>(null);

  const words = useMemo(() => categories.flatMap((c) => c.skills.map((text) => ({ text: SHORT[text] ?? text, group: c.key }))), [categories]);
  const max = Math.max(...categories.map((c) => c.skills.length));
  const active = hover ?? pinned;

  useEffect(() => {
    const el = list.current;
    if (!seen || !el || prefersReducedMotion()) return;
    const a = animate(el.querySelectorAll("[data-fill]"), { scaleX: [0, 1], duration: 900, delay: stagger(70), ease: "outExpo" });
    return () => {
      a.pause();
    };
  }, [seen]);

  return (
    <div ref={ref}>
      <div className={styles.chips} role="group" aria-label="Highlight a skill group on the globe">
        <button type="button" className={styles.chip} aria-pressed={pinned === null} onClick={() => setPinned(null)}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            className={styles.chip}
            aria-pressed={pinned === c.key}
            onClick={() => setPinned((p) => (p === c.key ? null : c.key))}
          >
            {c.label}
          </button>
        ))}
      </div>
      <SkillGlobe words={words} active={active} />
      <div className={styles.list} ref={list}>
        {categories.map((c) => (
          <div
            key={c.key}
            className={styles.row}
            data-active={active === c.key}
            onPointerEnter={() => setHover(c.key)}
            onPointerLeave={() => setHover(null)}
          >
            <div className={styles.head}>
              <h3>
                <button
                  type="button"
                  className={styles.label}
                  aria-pressed={pinned === c.key}
                  onClick={() => setPinned((p) => (p === c.key ? null : c.key))}
                  onFocus={() => setHover(c.key)}
                  onBlur={() => setHover(null)}
                >
                  {c.label}
                </button>
              </h3>
              <span className={styles.meter} aria-hidden>
                <span data-fill className={styles.fill} style={{ width: `${(c.skills.length / max) * 100}%`, display: "block" }} />
              </span>
              <span className={styles.count}>{c.skills.length} skills</span>
            </div>
            <ul className={styles.items}>
              {c.skills.map((s) => (
                <li key={s}>
                  <Tech name={s} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
