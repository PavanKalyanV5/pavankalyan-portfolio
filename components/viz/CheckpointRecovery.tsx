"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./Viz.module.css";

const STEPS = ["Plan", "Search", "Read", "Draft", "Review", "Write", "Done"];
const X0 = 118;
const GAP = 76;
const Y = 70;
const KILL_AT = 3;

/** An agent run that is killed mid-way and resumes from its last checkpoint. */
export function CheckpointRecovery() {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!seen || !el) return;
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const nodes = Array.from(el.querySelectorAll<SVGCircleElement>("[data-step]"));
    const cps = Array.from(el.querySelectorAll<SVGRectElement>("[data-cp]"));
    const pulse = q<SVGCircleElement>("[data-pulse]");
    const killText = q<SVGTextElement>("[data-kill]");
    const status = q<SVGTextElement>("[data-status]");
    const reduced = prefersReducedMotion();
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const x = (i: number) => X0 + i * GAP;

    const mark = (i: number) => {
      nodes[i].classList.add(styles.nodeDone);
      cps[i].classList.add(styles.cpOn);
    };

    if (reduced) {
      nodes.forEach((_, i) => mark(i));
      status.textContent = "Resumed from checkpoint 4. State intact.";
      return;
    }

    const run = async () => {
      while (!cancelled) {
        nodes.forEach((n) => n.classList.remove(styles.nodeDone, styles.nodeOn));
        cps.forEach((c) => c.classList.remove(styles.cpOn));
        status.textContent = "Running";
        pulse.setAttribute("cx", String(x(0)));
        pulse.setAttribute("opacity", "1");
        killText.setAttribute("opacity", "0");
        for (let i = 0; i <= KILL_AT; i++) {
          if (cancelled) return;
          if (i > 0) await animate(pulse, { cx: x(i), duration: 520, ease: "inOutQuad" });
          if (i === KILL_AT) break;
          mark(i);
          await wait(120);
        }
        // Process dies on the fourth step, before its checkpoint is written.
        killText.setAttribute("x", String(x(KILL_AT) - 28));
        animate(killText, { opacity: [0, 1], translateY: [-8, 0], duration: 250 });
        await animate(pulse, { translateX: [0, -5, 5, -4, 4, 0], duration: 360 });
        status.textContent = "Process killed (SIGKILL)";
        await animate(pulse, { opacity: 0, duration: 220 });
        await wait(900);
        // Restart picks up from the last checkpoint, not the beginning.
        status.textContent = `Resuming from checkpoint ${KILL_AT}`;
        animate(killText, { opacity: 0, duration: 200 });
        pulse.setAttribute("cx", String(x(KILL_AT - 1)));
        await animate(pulse, { opacity: 1, duration: 300 });
        for (let i = KILL_AT; i < STEPS.length; i++) {
          if (cancelled) return;
          await animate(pulse, { cx: x(i), duration: 520, ease: "inOutQuad" });
          mark(i);
          await wait(120);
        }
        status.textContent = "Finished with state intact";
        await wait(2600);
        await animate(pulse, { opacity: 0, duration: 250 });
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [seen]);

  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox="0 0 640 170" role="img" aria-label="An agent run through seven steps. The process is killed at the fourth step, restarts from the last SQLite checkpoint, and finishes without losing state.">
        <line className={styles.rule} x1={X0} x2={X0 + GAP * 6} y1={Y} y2={Y} strokeWidth={2} />
        {STEPS.map((s, i) => (
          <g key={s}>
            <circle data-step className={styles.node} cx={X0 + i * GAP} cy={Y} r={13} />
            <text className={styles.label} x={X0 + i * GAP} y={Y - 26} textAnchor="middle">
              {s}
            </text>
            <rect data-cp className={styles.cp} x={X0 + i * GAP - 6} y={Y + 26} width={12} height={12} rx={2} />
          </g>
        ))}
        <text className={styles.small} x={X0 - 24} y={Y + 36} textAnchor="end">
          checkpoint
        </text>
        <circle data-pulse className={styles.pulse} cx={X0} cy={Y} r={7} opacity={0} />
        <text data-kill className={styles.kill} y={Y + 62} opacity={0}>
          SIGKILL
        </text>
        <text data-status className={`${styles.label} ${styles.accentText}`} x={X0} y={152} />
      </svg>
      <figcaption className={styles.caption}>The plan is saved to SQLite at every tool call, so a crash costs one step, not the run.</figcaption>
    </figure>
  );
}
