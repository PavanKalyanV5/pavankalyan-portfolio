"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/lib/sfx";
import styles from "./ScrollScrubber.module.css";

const TICKS = 48;

/** Where each checkpoint sits. Ids are the page's own section ids, so they glide via the site's anchor handling. */
const CHECKPOINTS = [
  { id: "top", label: "Intro" },
  { id: "recruiters", label: "Recruiters" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
] as const;

/** Scroll offset the anchor handler lands at, kept in step with the fixed bar. */
const LAND_OFFSET = 64;

/**
 * A timeline ruler with a playhead, the way the anime.js homepage shows scroll progress, with a
 * checkpoint at every section. Checkpoints are real links, so they glide, are reachable by
 * keyboard, and work without scripting. The playhead is a CSS scroll-driven animation.
 */
export function ScrollScrubber() {
  // Evenly spaced until the real section positions are measured.
  const [marks, setMarks] = useState<number[]>(() => CHECKPOINTS.map((_, i) => i / (CHECKPOINTS.length - 1)));
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setMarks(
        CHECKPOINTS.map(({ id }) => {
          const el = document.getElementById(id);
          if (!el || max <= 0 || id === "top") return 0;
          const top = el.getBoundingClientRect().top + window.scrollY - LAND_OFFSET;
          return Math.min(1, Math.max(0, top / max));
        }),
      );
    };
    // The observer reports once on start and again whenever the page changes size.
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    // The section crossing the middle of the screen is the current one.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -54% 0px" },
    );
    CHECKPOINTS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <nav className={styles.scrubber} aria-label="Page checkpoints">
      <div className={styles.track}>
        <div className={styles.ticks} aria-hidden>
          {Array.from({ length: TICKS }, (_, i) => (
            <span key={i} className={i % 6 === 0 ? styles.major : styles.tick} />
          ))}
        </div>
        <span className={styles.head} aria-hidden />
        {CHECKPOINTS.map((c, i) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={styles.cp}
            data-checkpoint
            data-label={c.label}
            aria-label={`Go to ${c.label}`}
            aria-current={active === c.id ? "location" : undefined}
            style={{ left: `${marks[i] * 100}%` }}
            onClick={() => sfx.checkpoint()}
          />
        ))}
      </div>
    </nav>
  );
}
