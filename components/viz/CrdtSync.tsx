"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./Viz.module.css";

/** Two replicas edit the same line at once and converge on identical text. */
export function CrdtSync() {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!seen || !el) return;
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const qa = (s: string) => Array.from(el.querySelectorAll<SVGElement>(s));
    const reduced = prefersReducedMotion();
    const status = q<SVGTextElement>("[data-status]");
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const reset = () => {
      qa("[data-local]").forEach((n) => n.setAttribute("opacity", "0"));
      qa("[data-remote]").forEach((n) => n.setAttribute("opacity", "0"));
      qa("[data-packet]").forEach((n) => n.setAttribute("opacity", "0"));
      status.textContent = "Two people type at once";
    };

    if (reduced) {
      qa("[data-local], [data-remote]").forEach((n) => n.setAttribute("opacity", "1"));
      status.textContent = "Both replicas hold the same text";
      return;
    }

    const run = async () => {
      while (!cancelled) {
        reset();
        await animate(qa("[data-local]"), { opacity: [0, 1], duration: 160, delay: stagger(90) });
        await wait(350);
        status.textContent = "Edits travel as operations";
        const a = q<SVGCircleElement>("[data-packet='a']");
        const b = q<SVGCircleElement>("[data-packet='b']");
        a.setAttribute("opacity", "1");
        b.setAttribute("opacity", "1");
        await Promise.all([
          animate(a, { cx: [150, 490], cy: [64, 150], duration: 900, ease: "inOutCubic" }),
          animate(b, { cx: [490, 150], cy: [150, 64], duration: 900, ease: "inOutCubic" }),
        ]);
        a.setAttribute("opacity", "0");
        b.setAttribute("opacity", "0");
        await animate(qa("[data-remote]"), { opacity: [0, 1], duration: 200, delay: stagger(80) });
        status.textContent = "Both replicas hold the same text";
        await wait(2800);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [seen]);

  // Replica A types " alpha" locally and receives " beta"; replica B is the mirror image.
  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox="0 0 640 214" role="img" aria-label="Two replicas of a text line. Replica A types alpha while replica B types beta. They exchange operations and both end with the text notes alpha beta.">
        <text className={styles.small} x={40} y={22}>Replica A</text>
        <rect className={styles.box} x={40} y={32} width={310} height={52} rx={5} />
        <text className={styles.mono} x={56} y={64}>
          <tspan>notes</tspan>
          <tspan data-local className={styles.accentText}> alpha</tspan>
          <tspan data-remote className={styles.accentText}> beta</tspan>
        </text>
        <text className={styles.small} x={290} y={108}>Replica B</text>
        <rect className={styles.box} x={290} y={118} width={310} height={52} rx={5} />
        <text className={styles.mono} x={306} y={150}>
          <tspan>notes</tspan>
          <tspan data-remote className={styles.accentText}> alpha</tspan>
          <tspan data-local className={styles.accentText}> beta</tspan>
        </text>
        <circle data-packet="a" className={styles.pulse} r={6} opacity={0} cx={150} cy={64} />
        <circle data-packet="b" className={styles.pulse} r={6} opacity={0} cx={490} cy={150} />
        <text data-status className={`${styles.label} ${styles.accentText}`} x={40} y={200} />
      </svg>
      <figcaption className={styles.caption}>Operations commute, so replicas converge without a central lock.</figcaption>
    </figure>
  );
}
