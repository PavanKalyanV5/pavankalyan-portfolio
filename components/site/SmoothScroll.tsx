"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial wheel scrolling. Mouse wheels move the page in coarse steps, which makes
 * every scroll-linked effect stutter; easing the position makes them glide.
 * Touch and reduced-motion users keep native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true });
    let frame = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page links glide too, and land below the fixed bar.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const id = a.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : document.documentElement;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(id ? target : 0, { offset: id ? -64 : 0, duration: 1.4 });
      history.replaceState(null, "", id ? `#${id}` : location.pathname);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
