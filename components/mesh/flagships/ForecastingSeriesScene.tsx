"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function RibbonGroup({ onHoverMode }: { onHoverMode: (mode: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [exploded, setExploded] = useState(false);

  // Generate 32 time-series sample vertices
  const { trendPoints, seasonPoints, compositePoints } = useMemo(() => {
    const count = 32;
    const trend: number[] = [];
    const season: number[] = [];
    const composite: number[] = [];

    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * 4.2 - 2.1;
      const t = i / count;

      // Trend: gentle upward curve
      const yTrend = Math.sin(t * 1.5) * 0.6 - 0.2;
      trend.push(x, yTrend, 0);

      // Seasonality: cyclical sine harmonic
      const ySeason = Math.sin(t * Math.PI * 6) * 0.45;
      season.push(x, ySeason, 0);

      // Composite: combined forecast
      const yComp = yTrend + ySeason * 0.6;
      composite.push(x, yComp, 0);
    }

    return {
      trendPoints: new Float32Array(trend),
      seasonPoints: new Float32Array(season),
      compositePoints: new Float32Array(composite),
    };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(performance.now() * 0.0006) * 0.25;
      const targetZ = exploded ? 0.6 : 0;
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 3);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => {
        setExploded(true);
        onHoverMode("SSA DECOMPOSED // TREND + HARMONICS");
      }}
      onPointerOut={() => {
        setExploded(false);
        onHoverMode("LIGHTGBM + SSA TIME-SERIES");
      }}
    >
      {/* Composite Forecast Ribbon */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[compositePoints, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#5EE7D6" />
      </lineSegments>

      {/* Trend Line (offset in Z when exploded) */}
      <group position={[0, exploded ? 0.4 : 0, exploded ? -0.4 : 0]}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[trendPoints, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#8A6BFF" transparent opacity={exploded ? 0.85 : 0.25} />
        </lineSegments>
      </group>

      {/* Seasonality Wave (offset in Y when exploded) */}
      <group position={[0, exploded ? -0.4 : 0, exploded ? 0.4 : 0]}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[seasonPoints, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#FFB35C" transparent opacity={exploded ? 0.85 : 0.25} />
        </lineSegments>
      </group>
    </group>
  );
}

export function ForecastingSeriesScene() {
  const [mode, setMode] = useState("LIGHTGBM + SSA TIME-SERIES");

  return (
    <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden" }}>
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ antialias: false, alpha: true, depth: true }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={80} color="#5EE7D6" />
        <RibbonGroup onHoverMode={setMode} />
      </Canvas>

      {/* Hover Info Badge */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "12px",
          right: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "10px",
          fontFamily: "var(--font-code)",
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      >
        <span>{mode}</span>
        <span style={{ color: "#FFB35C" }}>82% AUTOMATION</span>
      </div>
    </div>
  );
}
