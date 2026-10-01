"use client";

import { useEffect, useId, useRef } from "react";
import { animate, stagger, svg } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";
import styles from "./FlowDiagram.module.css";

export interface FlowNode { id: string; x: number; y: number; label: string; sub: string; accent?: boolean }
export interface FlowConfig {
  nodes: FlowNode[];
  /** SVG path strings, one per connection. */
  edges: string[];
  /** The path one packet travels, looping through the whole system. */
  route: string;
  ariaLabel: string;
  caption: string;
}

const W = 150;
const H = 54;

export function FlowDiagram({ nodes, edges, route, ariaLabel, caption }: FlowConfig) {
  const [ref, seen] = useInView<HTMLElement>(0.4);
  const root = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const el = root.current;
    if (!seen || !el || prefersReducedMotion()) return;
    const anims: { pause: () => void }[] = [];

    anims.push(
      animate(svg.createDrawable(el.querySelectorAll("[data-edge]")), {
        draw: ["0 0", "0 1"],
        duration: 900,
        delay: stagger(240, { start: 500 }),
        ease: "inOutCubic",
      }),
      animate(el.querySelectorAll("[data-node]"), {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 650,
        delay: stagger(110),
        ease: "outCubic",
      }),
    );

    const path = el.querySelector<SVGPathElement>("[data-route]");
    const packet = el.querySelector<SVGCircleElement>("[data-packet]");
    if (path && packet) {
      const { translateX, translateY } = svg.createMotionPath(path);
      anims.push(
        animate(packet, { translateX, translateY, duration: 5400, delay: 1900, ease: "linear", loop: true }),
        animate(packet, { opacity: [0, 1], duration: 400, delay: 1900 }),
      );
    }
    return () => anims.forEach((a) => a.pause());
  }, [seen]);

  return (
    <figure ref={ref} className={styles.figure}>
      <svg ref={root} className={styles.svg} viewBox="0 0 640 214" role="img" aria-label={ariaLabel}>
        <defs>
          <marker id={`arrow-${uid}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--ink-faint)" />
          </marker>
        </defs>
        {edges.map((d) => (
          <path key={d} data-edge className={styles.edge} d={d} markerEnd={`url(#arrow-${uid})`} />
        ))}
        <path data-route d={route} fill="none" stroke="none" />
        {nodes.map((n) => (
          <g key={n.id} data-node>
            <rect className={`${styles.node} ${n.accent ? styles.nodeAccent : ""}`} x={n.x} y={n.y} width={W} height={H} rx={5} />
            <text className={`${styles.label} ${n.accent ? styles.labelAccent : ""}`} x={n.x + W / 2} y={n.y + 23} textAnchor="middle">
              {n.label}
            </text>
            <text className={`${styles.sub} ${n.accent ? styles.subAccent : ""}`} x={n.x + W / 2} y={n.y + 41} textAnchor="middle">
              {n.sub}
            </text>
          </g>
        ))}
        <circle data-packet className={styles.packet} r={5.5} cx={0} cy={0} opacity={0} />
      </svg>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
