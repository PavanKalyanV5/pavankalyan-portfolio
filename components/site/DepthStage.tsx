"use client";

import { useEffect } from "react";
import styles from "./DepthStage.module.css";

/**
 * Scroll-linked 3D. Each [data-depth] block tilts back and recedes as it enters from
 * below and folds away toward the top as it leaves. Blocks in the middle of the viewport
 * are perfectly flat, so reading is never fought by the effect.
 *
 * Each block eases toward its target instead of snapping to it, so the motion stays
 * fluid even when the scroll position arrives in coarse steps.
 */
export function DepthStage() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let els: HTMLElement[] = [];
    let current: number[] = [];
    let frame = 0;
    let lastScroll = 0;

    const collect = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>("[data-depth]"));
      current = els.map(() => 0);
    };
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const ease = (u: number) => u * u * (3 - 2 * u);

    const clear = (el: HTMLElement) => {
      if (el.style.transform) {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.willChange = "";
      }
    };

    const tick = (now: number) => {
      frame = 0;
      const vh = window.innerHeight;
      const max = root.scrollHeight - vh;
      root.style.setProperty("--progress", max > 0 ? String(clamp01(window.scrollY / max)) : "0");

      const amp = vh < 700 || window.innerWidth < 700 ? 0.65 : 1;
      let moving = false;

      const rects = els.map((el) => el.getBoundingClientRect());
      els.forEach((el, i) => {
        const r = rects[i];
        if (reduced.matches || r.bottom < -vh * 0.6 || r.top > vh * 1.6) {
          current[i] = 0;
          clear(el);
          return;
        }
        // Signed target: positive while entering from below, negative while leaving upward.
        const enter = clamp01((r.top - vh * 0.7) / (vh * 0.3));
        const leave = clamp01((vh * 0.3 - r.bottom) / (vh * 0.3));
        const target = enter >= leave ? enter : -leave;

        current[i] += (target - current[i]) * 0.2;
        if (Math.abs(target - current[i]) > 0.002) moving = true;
        const s = current[i];
        if (Math.abs(s) < 0.002) {
          current[i] = 0;
          clear(el);
          return;
        }

        const u = ease(Math.min(1, Math.abs(s)));
        const entering = s > 0;
        el.style.willChange = "transform, opacity";
        el.style.transformOrigin = entering ? "50% 0%" : "50% 100%";
        el.style.transform = entering
          ? `perspective(1200px) translate3d(0, ${u * 34 * amp}px, ${-u * 190 * amp}px) rotateX(${u * 24 * amp}deg) rotateY(${u * -3 * amp}deg)`
          : `perspective(1200px) translate3d(0, ${-u * 22 * amp}px, ${-u * 170 * amp}px) rotateX(${-u * 18 * amp}deg) rotateY(${u * 3 * amp}deg)`;
        // Opacity lags the motion a little, so a block never vanishes before it has moved.
        // Off-screen blocks stay fully opaque: nobody sees them, and tools that measure
        // contrast would otherwise read them mid-fade.
        const offscreen = r.top >= vh || r.bottom <= 0;
        el.style.opacity = offscreen ? "" : String(1 - clamp01((u - 0.12) / 0.88) * 0.9);
      });

      if (moving || now - lastScroll < 250) frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      lastScroll = performance.now();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    collect();
    wake();
    const ro = new ResizeObserver(() => {
      collect();
      wake();
    });
    ro.observe(document.body);
    // <details> toggles change layout without a scroll event.
    const onToggle = () => {
      collect();
      wake();
    };
    document.addEventListener("toggle", onToggle, true);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    reduced.addEventListener("change", wake);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      document.removeEventListener("toggle", onToggle, true);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      reduced.removeEventListener("change", wake);
    };
  }, []);

  return <div className={styles.bar} aria-hidden />;
}
