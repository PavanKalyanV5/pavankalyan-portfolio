"use client";

import { useEffect, useMemo, useRef } from "react";
import styles from "./SkillGlobe.module.css";

export interface GlobeWord { text: string; group: string }

/**
 * A draggable CSS-3D sphere of every skill. Words are placed on a Fibonacci
 * sphere and projected each frame; the selected group lights up in the accent colour.
 */
export function SkillGlobe({ words, active }: { words: GlobeWord[]; active: string | null }) {
  const stage = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);
  const state = useRef({ rx: -0.25, ry: 0, vx: 0, vy: 0.0035, drag: false, lx: 0, ly: 0, radius: 160 });

  const points = useMemo(
    () =>
      words.map((_, i) => {
        const y = 1 - ((i + 0.5) / words.length) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = i * 2.399963;
        return [Math.cos(t) * r, y, Math.sin(t) * r] as const;
      }),
    [words],
  );

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;
    let frame = 0;
    let visible = true;

    const measure = () => (s.radius = Math.min(el.clientWidth, el.clientHeight) * (el.clientWidth < 420 ? 0.34 : 0.4));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;
      if (!s.drag) {
        s.ry += s.vy + s.vx;
        s.rx += s.vx * 0.2;
        s.vx *= 0.94;
        s.vy += ((reduced ? 0 : 0.0035) - s.vy) * 0.02;
      }
      const cy = Math.cos(s.ry), sy = Math.sin(s.ry), cx = Math.cos(s.rx), sx = Math.sin(s.rx);
      points.forEach(([x, y, z], i) => {
        const node = nodes.current[i];
        if (!node) return;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2;
        node.style.transform = `translate3d(calc(-50% + ${x1 * s.radius}px), calc(-50% + ${y2 * s.radius}px), ${z2 * s.radius}px) scale(${0.68 + depth * 0.5})`;
        // Only the front of the sphere is drawn: back-row words add clutter and cannot be read anyway.
        const front = depth >= 0.32;
        node.style.visibility = front ? "visible" : "hidden";
        node.style.opacity = front ? String(0.6 + depth * 0.4) : "0";
        node.style.zIndex = String(Math.round(depth * 100));
      });
    };
    frame = requestAnimationFrame(draw);

    const down = (e: PointerEvent) => {
      s.drag = true;
      s.lx = e.clientX;
      s.ly = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!s.drag) return;
      const dx = e.clientX - s.lx;
      const dy = e.clientY - s.ly;
      s.lx = e.clientX;
      s.ly = e.clientY;
      s.ry += dx * 0.008;
      s.rx = Math.max(-1.1, Math.min(1.1, s.rx + dy * 0.008));
      s.vx = dx * 0.0012;
    };
    const up = () => (s.drag = false);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [points]);

  return (
    <div ref={stage} className={styles.stage} aria-hidden>
      <span className={styles.core} />
      {words.map((w, i) => (
        <span
          key={`${w.group}-${w.text}`}
          ref={(n) => {
            nodes.current[i] = n;
          }}
          className={`${styles.word} ${active === w.group ? styles.on : ""}`}
        >
          {w.text}
        </span>
      ))}
      <span className={styles.hint}>Drag to spin</span>
    </div>
  );
}
