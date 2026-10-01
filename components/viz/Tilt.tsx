"use client";

import { useRef, type ReactNode } from "react";
import { animate } from "animejs";
import { prefersReducedMotion } from "./useInView";
import styles from "./Tilt.module.css";

/** Pointer-driven 3D tilt with a moving highlight. Springs back on leave. */
export function Tilt({ children, max = 5 }: { children: ReactNode; max?: number }) {
  const el = useRef<HTMLDivElement>(null);
  const s = useRef({ x: 0, y: 0, gx: 50, gy: 50 });
  const spring = useRef<{ pause: () => void } | null>(null);

  const apply = () => {
    const node = el.current;
    if (!node) return;
    node.style.transform = `perspective(900px) rotateX(${s.current.x}deg) rotateY(${s.current.y}deg)`;
    node.style.setProperty("--gx", `${s.current.gx}%`);
    node.style.setProperty("--gy", `${s.current.gy}%`);
  };

  const onMove = (e: React.PointerEvent) => {
    if (prefersReducedMotion() || e.pointerType === "touch") return;
    const r = el.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    spring.current?.pause();
    s.current = { x: (0.5 - py) * max * 2, y: (px - 0.5) * max * 2, gx: px * 100, gy: py * 100 };
    apply();
  };

  const onLeave = () => {
    if (prefersReducedMotion()) return;
    spring.current = animate(s.current, {
      x: 0,
      y: 0,
      gx: 50,
      gy: 50,
      duration: 900,
      ease: "outElastic(1, .55)",
      onUpdate: apply,
    });
  };

  return (
    <div ref={el} className={styles.tilt} data-tilt onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
      <span className={styles.glare} aria-hidden />
    </div>
  );
}
