"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { prefersReducedMotion, useInView } from "./useInView";

interface Props {
  to: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

/** Counts up once when scrolled into view. Server HTML holds the final value. */
export function AnimeCounter({ to, decimals = 0, suffix = "", className }: Props) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const text = useRef<HTMLSpanElement>(null);
  const format = (v: number) => `${v.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = text.current;
    if (!seen || !el || prefersReducedMotion()) return;
    const state = { v: 0 };
    el.textContent = format(0);
    const anim = animate(state, {
      v: to,
      duration: 1600,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = format(state.v);
      },
    });
    return () => {
      anim.pause();
      el.textContent = format(to);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, to, decimals, suffix]);

  return (
    <span ref={ref} className={className}>
      <span ref={text}>{format(to)}</span>
    </span>
  );
}
