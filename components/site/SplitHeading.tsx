"use client";

import { Fragment, useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { prefersReducedMotion } from "@/components/viz/useInView";
import styles from "./SplitHeading.module.css";

/** Section heading whose words rise out of a mask when it scrolls into view. Plain text until hydrated. */
export function SplitHeading({ id, className, children }: { id: string; className?: string; children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll<HTMLElement>("[data-w]");
    words.forEach((w) => (w.style.transform = "translateY(112%)"));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        animate(words, { translateY: ["112%", "0%"], duration: 950, delay: stagger(60), ease: "outExpo" });
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <h2 ref={ref} id={id} className={className} data-depth>
      {children.split(" ").map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className={styles.mask}>
            <span data-w className={styles.word}>
              {w}
            </span>
          </span>
        </Fragment>
      ))}
    </h2>
  );
}
