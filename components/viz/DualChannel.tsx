"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, stagger } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./Viz.module.css";

const BARS = 46;

/** Two audio lanes: the other speaker talks, a question is detected, an answer streams in. */
export function DualChannel() {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const root = useRef<SVGSVGElement>(null);
  const heights = useMemo(() => Array.from({ length: BARS }, (_, i) => 0.25 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)) * 0.75), []);

  useEffect(() => {
    const el = root.current;
    if (!seen || !el) return;
    const lane = (n: string) => Array.from(el.querySelectorAll<SVGRectElement>(`[data-lane='${n}'] rect`));
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const pill = q<SVGGElement>("[data-pill]");
    const answer = q<SVGGElement>("[data-answer]");
    const status = q<SVGTextElement>("[data-status]");
    const reduced = prefersReducedMotion();
    if (reduced) {
      pill.setAttribute("opacity", "1");
      answer.setAttribute("opacity", "1");
      status.textContent = "Question detected, answer ready";
      return;
    }
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const pulseLane = (n: string, on: boolean) =>
      animate(lane(n), {
        scaleY: on ? [0.2, 1] : 0.15,
        duration: on ? 420 : 300,
        delay: stagger(18),
        ease: "outQuad",
        loop: on ? 4 : false,
        alternate: on,
      });

    const run = async () => {
      while (!cancelled) {
        pill.setAttribute("opacity", "0");
        answer.setAttribute("opacity", "0");
        lane("you").forEach((r) => r.setAttribute("style", "transform: scaleY(0.15)"));
        lane("them").forEach((r) => r.setAttribute("style", "transform: scaleY(0.15)"));
        status.textContent = "The other speaker is talking";
        await pulseLane("them", true);
        await pulseLane("them", false);
        status.textContent = "Question detected";
        await animate(pill, { opacity: [0, 1], translateY: [8, 0], duration: 400, ease: "outBack" });
        await wait(500);
        status.textContent = "Grounded answer streams in";
        await animate(answer, { opacity: [0, 1], translateX: [-12, 0], duration: 500, ease: "outCubic" });
        await wait(2600);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [seen]);

  const bar = (lane: string, y: number) => (
    <g data-lane={lane} transform={`translate(0 ${y})`}>
      {heights.map((h, i) => (
        <rect
          key={i}
          className={styles.barFill}
          x={i * 7.4}
          y={-h * 22}
          width={4}
          height={h * 44}
          rx={2}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%", transform: "scaleY(0.15)" }}
        />
      ))}
    </g>
  );

  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox="0 0 640 214" role="img" aria-label="Two audio lanes, one for the other speaker and one for you. When the other speaker finishes a question, a Question detected tag appears and a grounded answer streams into a panel.">
        <text className={styles.small} x={0} y={14}>Other speaker (loopback)</text>
        {bar("them", 50)}
        <text className={styles.small} x={0} y={110}>You (microphone)</text>
        {bar("you", 146)}
        <g data-pill opacity={0}>
          <rect className={styles.pill} x={350} y={30} width={150} height={26} rx={13} />
          <text className={styles.label} style={{ fill: "var(--paper)" }} x={425} y={48} textAnchor="middle">Question detected</text>
        </g>
        <g data-answer opacity={0}>
          <rect className={styles.box} x={350} y={70} width={290} height={96} rx={6} />
          <text className={styles.label} x={364} y={92}>Suggested answer</text>
          <rect className={styles.bar} x={364} y={104} width={250} height={7} rx={3} />
          <rect className={styles.bar} x={364} y={118} width={210} height={7} rx={3} />
          <rect className={styles.bar} x={364} y={132} width={230} height={7} rx={3} />
          <text className={`${styles.small} ${styles.accentText}`} x={364} y={156}>[1] [2] cited from your documents</text>
        </g>
        <text data-status className={`${styles.label} ${styles.accentText}`} x={0} y={206} />
      </svg>
      <figcaption className={styles.caption}>Speech recognition runs on your machine, with each speaker kept on a separate channel.</figcaption>
    </figure>
  );
}
