"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CursorReticle.module.css";

const HOT = "a, button, summary, input, textarea, [role='radio'], [data-tilt]";

/** A trailing ring plus a precise dot. It swells over anything clickable. */
export function CursorReticle() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ on: false, hot: false, down: false });

  useEffect(() => {
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let frame = 0;
    let seen = false;

    let started = false;
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    const move = (e: PointerEvent) => {
      // Decide by what actually moved, not by what the browser claims about the device.
      if (e.pointerType === "touch") return;
      if (!started) {
        started = true;
        frame = requestAnimationFrame(loop);
      }
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        seen = true;
        rx = x;
        ry = y;
        setState((s) => ({ ...s, on: true }));
      }
      const hot = !!(e.target as Element | null)?.closest?.(HOT);
      setState((s) => (s.hot === hot ? s : { ...s, hot }));
    };
    const down = () => setState((s) => ({ ...s, down: true }));
    const up = () => setState((s) => ({ ...s, down: false }));
    const leave = () => setState((s) => ({ ...s, on: false }));
    const enter = () => seen && setState((s) => ({ ...s, on: true }));

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  const cls = (base: string) => `${base} ${state.on ? styles.on : ""}`;
  return (
    <div aria-hidden>
      <div ref={ring} className={`${cls(styles.ring)} ${state.hot ? styles.hot : ""} ${state.down ? styles.down : ""}`} />
      <div ref={dot} className={cls(styles.dot)} />
    </div>
  );
}
