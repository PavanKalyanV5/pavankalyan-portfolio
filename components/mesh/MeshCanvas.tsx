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

// Filter out upstream Three.js r186 deprecation warning caused by @react-three/fiber's internal default clock
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("THREE.Clock: This module has been deprecated")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

interface MeshCanvasProps {
  children: React.ReactNode;
  /** Lower quality trims dpr and disables adaptive events; default "high". */
  quality?: "high" | "low";
  onContextLost?: () => void;
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
  onContextLost,
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
          preserveDrawingBuffer: false,
        }}
        camera={{
          position: [0, 1.5, 16],
          fov: 45,
          near: 0.1,
          far: 200,
        }}
        frameloop="always"
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const handleContextLost = (event: Event) => {
            // Prevent default behavior so WebGL can be restored or handled cleanly
            event.preventDefault();
            if (onContextLost) {
              onContextLost();
            }
          };
          canvas.addEventListener("webglcontextlost", handleContextLost, false);
        }}
      >
        <color attach="background" args={["#05070E"]} />
        <fogExp2 attach="fog" args={["#05070E", 0.028]} />
        {children}
        <PerformanceMonitor onDecline={() => setDegraded(true)}>
          <AdaptiveDpr pixelated={false} />
          {quality === "high" && <AdaptiveEvents />}
          <Preload all />
          <PerformanceController degraded={degraded} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
