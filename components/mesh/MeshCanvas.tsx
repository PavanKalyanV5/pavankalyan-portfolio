"use client";

import { useState } from "react";
import type React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
  PerformanceMonitor,
} from "@react-three/drei";

interface MeshCanvasProps {
  children: React.ReactNode;
  /** Lower quality trims dpr and disables adaptive events; default "high". */
  quality?: "high" | "low";
}

/**
 * Inner component that uses useThree to adjust pixel ratio on degradation.
 * This avoids the complexity of lifting dpr state up to Canvas props.
 */
function PerformanceController({
  degraded,
}: {
  degraded: boolean;
}): null {
  const { gl } = useThree();

  // Adjust pixel ratio based on degradation
  const targetDpr = degraded ? 1 : 1.75;
  gl.setPixelRatio(targetDpr);

  return null;
}

export function MeshCanvas({
  children,
  quality = "high",
}: MeshCanvasProps): React.ReactNode {
  const [degraded, setDegraded] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-canvas)",
        pointerEvents: "auto",
      }}
    >
      <Canvas
        dpr={quality === "high" ? [1, 1.75] : [1, 1]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{
          position: [0, 1.5, 16],
          fov: 45,
          near: 0.1,
          far: 200,
        }}
        frameloop="always"
      >
        <color attach="background" args={["#05070E"]} />
        {children}
        <PerformanceMonitor
          onDecline={() => setDegraded(true)}
        >
          <AdaptiveDpr pixelated={false} />
          {quality === "high" && <AdaptiveEvents />}
          <Preload all />
          <PerformanceController degraded={degraded} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
