"use client";

import { useEffect, useRef } from "react";
import styles from "./MarqueeBand.module.css";

/** Oversized outlined words that slide sideways as the page scrolls past them. Decorative. */
export function MarqueeBand({ words, dir = 1 }: { words: string[]; dir?: 1 | -1 }) {
  const band = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const b = band.current;
      const t = track.current;
      if (!b || !t) return;
      const r = b.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      const x = reduced.matches ? 0 : p * dir * -window.innerWidth * 0.55;
      t.style.transform = `translate3d(${x - window.innerWidth * 0.2}px, 0, 0)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [dir]);

  const run = (key: number) => (
    <div key={key} className={styles.text}>
      {words.map((w, i) => (
        <span key={w} style={{ display: "contents" }}>
          <span className={i % 3 === 1 ? styles.fill : undefined}>{w}</span>
          <span className={styles.dot} />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={band} className={styles.band} aria-hidden>
      <div ref={track} className={styles.track}>
        {[0, 1, 2, 3].map(run)}
      </div>
    </div>
  );
}
