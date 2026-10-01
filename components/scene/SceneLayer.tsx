"use client";

import { Component, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { sceneState } from "@/lib/sceneState";
import styles from "./SceneLayer.module.css";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

let particleCount: number | null = null;

/** Particle budget for this device, or 0 when WebGL is unavailable. Computed once. */
function getParticleCount() {
  if (particleCount === null) {
    try {
      const c = document.createElement("canvas");
      const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
      particleCount = ok ? (window.innerWidth < 900 ? 4800 : 11000) : 0;
    } catch {
      particleCount = 0;
    }
  }
  return particleCount;
}

const noopSubscribe = () => () => {};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Fixed WebGL backdrop. The page is complete HTML without it. */
export function SceneLayer() {
  const supported = useSyncExternalStore(noopSubscribe, getParticleCount, () => 0);
  // Build the scene once the page has painted and the browser is idle, so the text appears first.
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setIdle(true), 600);
    return () => clearTimeout(t);
  }, []);
  const count = idle ? supported : 0;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    sceneState.reducedMotion = mq.matches;
    const onMq = () => (sceneState.reducedMotion = mq.matches);
    mq.addEventListener("change", onMq);

    let tops: { top: number; scene: number }[] = [];
    const measure = () => {
      tops = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((el) => ({
        top: el.getBoundingClientRect().top + window.scrollY,
        scene: Number(el.dataset.scene),
      }));
    };
    const onScroll = () => {
      if (tops.length === 0) return;
      const probe = window.scrollY + window.innerHeight * 0.55;
      let i = 0;
      while (i < tops.length - 1 && tops[i + 1].top <= probe) i++;
      const a = tops[i];
      const b = tops[i + 1];
      if (!b) {
        sceneState.target = a.scene;
        return;
      }
      const frac = (probe - a.top) / (b.top - a.top);
      sceneState.target = a.scene + (b.scene - a.scene) * smooth(0.3, 1, frac);
    };
    const onPointer = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      sceneState.lastPointerAt = performance.now();
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    onScroll();
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => {
      mq.removeEventListener("change", onMq);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  if (count === 0) return null;
  return (
    <div className={styles.layer} aria-hidden>
      <SceneBoundary>
        <ParticleField count={count} />
      </SceneBoundary>
    </div>
  );
}
