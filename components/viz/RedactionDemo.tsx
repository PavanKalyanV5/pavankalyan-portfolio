"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./Viz.module.css";

/** Fictional values, so no real data appears in the demo. */
const ROWS = [
  { from: "Email Jane Doe about the refactor", to: "Email [NAME_1] about the refactor" },
  { from: "jane.doe@example.com", to: "[EMAIL_1]" },
  { from: "C:\\Users\\jdoe\\project", to: "C:\\Users\\example-user\\project" },
  { from: "AKIA-EXAMPLE-KEY-0000", to: "[SECRET_1]" },
  { from: "request from 203.0.113.7", to: "request from [IP_1]" },
];
const Y0 = 62;
const STEP = 32;

/** What you type on the left, what the API receives on the right, then the trip back. */
export function RedactionDemo() {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!seen || !el) return;
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const all = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));
    const status = q<SVGTextElement>("[data-status]");
    const back = q<SVGCircleElement>("[data-back]");
    const reduced = prefersReducedMotion();
    if (reduced) {
      all("[data-r]").forEach((n) => n.setAttribute("opacity", "1"));
      status.textContent = "Your tools get the real values back";
      return;
    }
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const run = async () => {
      while (!cancelled) {
        all("[data-r]").forEach((n) => n.setAttribute("opacity", "0"));
        all("[data-hl]").forEach((n) => n.setAttribute("opacity", "0"));
        back.setAttribute("opacity", "0");
        status.textContent = "Outbound: personal data becomes labels";
        const hl = all<SVGRectElement>("[data-hl]");
        const right = all<SVGTextElement>("[data-r]");
        for (let i = 0; i < ROWS.length; i++) {
          if (cancelled) return;
          await animate(hl[i], { opacity: [0, 0.18], duration: 220 });
          animate(right[i], { opacity: [0, 1], translateX: [-14, 0], duration: 380, ease: "outCubic" });
          await wait(330);
        }
        await wait(700);
        status.textContent = "Back: labels become real values for your tools";
        back.setAttribute("opacity", "1");
        await animate(back, { cx: [350, 290], cy: [Y0 + STEP * 2 + 6, Y0 + STEP * 2 + 6], duration: 900, ease: "inOutCubic" });
        await animate(hl, { opacity: [0.18, 0.4, 0.18], duration: 600, delay: (_: unknown, i: number) => i * 70 } as never);
        await wait(2400);
        await animate(back, { opacity: 0, duration: 200 });
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [seen]);

  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox="0 0 640 240" role="img" aria-label="Five example lines before and after redaction. A name, an email address, a file path, a secret key and an IP address each become a label on the way out, and are restored on the way back.">
        <text className={styles.label} x={0} y={22}>What you type</text>
        <text className={styles.label} x={350} y={22}>What the API receives</text>
        <rect className={styles.box} x={0} y={32} width={310} height={ROWS.length * STEP + 12} rx={5} />
        <rect className={styles.box} x={350} y={32} width={290} height={ROWS.length * STEP + 12} rx={5} />
        {ROWS.map((r, i) => (
          <g key={r.from}>
            <rect data-hl className={styles.ins} x={6} y={Y0 + i * STEP - 17} width={298} height={24} rx={3} opacity={0} />
            <text className={styles.small} style={{ fill: "var(--ink)" }} x={14} y={Y0 + i * STEP}>{r.from}</text>
            <text data-r className={`${styles.small} ${styles.accentText}`} x={362} y={Y0 + i * STEP} opacity={0}>{r.to}</text>
          </g>
        ))}
        <path className={styles.faint} d={`M312 ${Y0 + STEP * 2 + 6} H348`} strokeDasharray="3 4" />
        <circle data-back className={styles.pulse} cx={350} cy={Y0 + STEP * 2 + 6} r={5} opacity={0} />
        <text data-status className={`${styles.label} ${styles.accentText}`} x={0} y={ROWS.length * STEP + 74} />
      </svg>
      <figcaption className={styles.caption}>Example values are fictional. The real proxy handles 20 secret patterns and personal data.</figcaption>
    </figure>
  );
}
