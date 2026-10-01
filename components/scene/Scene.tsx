"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";
import { Callouts, Specimens } from "./ExplodedInstrument";

/** Colours come from CSS custom properties so one source of truth drives DOM and WebGL. */
function usePalette() {
  const ink = useRef(new THREE.Color("#101a2b"));
  const accent = useRef(new THREE.Color("#d9480f"));
  const target = useRef({ ink: new THREE.Color("#101a2b"), accent: new THREE.Color("#d9480f") });

  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      target.current.ink.set(cs.getPropertyValue("--particle").trim() || "#101a2b");
      target.current.accent.set(cs.getPropertyValue("--sodium").trim() || "#d9480f");
    };
    read();
    // Snap on first read so there is no flash from the default colours.
    ink.current.copy(target.current.ink);
    accent.current.copy(target.current.accent);
    window.addEventListener("themechange", read);
    return () => window.removeEventListener("themechange", read);
  }, []);

  const step = (k: number) => {
    ink.current.lerp(target.current.ink, k);
    accent.current.lerp(target.current.accent, k);
  };
  return { ink, accent, step };
}

function Stage() {
  const palette = usePalette();
  const morph = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    palette.step(1 - Math.exp(-dt * 5));
    // Eased scroll position (0 = overview, 1..5 = modules) that decides which drawing is showing.
    morph.current += (sceneState.target - morph.current) * (1 - Math.exp(-dt * (sceneState.reducedMotion ? 12 : 2.4)));
  });

  return (
    <>
      <Specimens palette={palette} morph={morph} />
    </>
  );
}

export default function Scene() {
  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
        aria-hidden
      >
        <Stage />
      </Canvas>
      <Callouts />
    </>
  );
}
