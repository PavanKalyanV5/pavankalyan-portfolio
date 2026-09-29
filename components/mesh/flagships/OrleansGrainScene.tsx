"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GrainNode {
  id: string;
  name: string;
  type: string;
  color: string;
  position: [number, number, number];
}

const GRAINS: GrainNode[] = [
  { id: "core", name: "Coordinator Grain", type: "Virtual Actor", color: "#5EE7D6", position: [0, 0, 0] },
  { id: "loc1", name: "Location Grain #41", type: "Stateful Actor", color: "#8A6BFF", position: [-1.8, 1.1, 0.4] },
  { id: "loc2", name: "Location Grain #42", type: "Stateful Actor", color: "#8A6BFF", position: [-1.5, -1.2, -0.3] },
  { id: "alert", name: "Alerting Actor", type: "Stateless Worker", color: "#FFB35C", position: [1.9, 0.8, -0.4] },
  { id: "queue", name: "Azure Queue Consumer", type: "Stream Ingestion", color: "#38BDF8", position: [1.6, -1.1, 0.5] },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [3, 4],
];

function GrainsGroup({ onHoverGrain }: { onHoverGrain: (grain: GrainNode | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const packetRef = useRef<THREE.Mesh>(null);
  const [activeGrain, setActiveGrain] = useState<string | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x = Math.sin(performance.now() * 0.0008) * 0.15;
    }

    if (packetRef.current) {
      const t = (performance.now() * 0.0012) % 1;
      const start = GRAINS[0].position;
      const end = GRAINS[1].position;
      packetRef.current.position.set(
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t,
        start[2] + (end[2] - start[2]) * t
      );
    }
  });

  const edgeLines = useMemo(() => {
    const points: number[] = [];
    EDGES.forEach(([i, j]) => {
      points.push(...GRAINS[i].position, ...GRAINS[j].position);
    });
    return new Float32Array(points);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Edge lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edgeLines, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1B2540" transparent opacity={0.65} />
      </lineSegments>

      {/* Moving Message Packet */}
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#5EE7D6" />
      </mesh>

      {/* Virtual Actor Grains */}
      {GRAINS.map((grain) => {
        const isHovered = activeGrain === grain.id;
        return (
          <mesh
            key={grain.id}
            position={grain.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              setActiveGrain(grain.id);
              onHoverGrain(grain);
            }}
            onPointerOut={() => {
              setActiveGrain(null);
              onHoverGrain(null);
            }}
            scale={isHovered ? 1.35 : 1}
          >
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color={grain.color}
              emissive={grain.color}
              emissiveIntensity={isHovered ? 1.8 : 0.8}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function OrleansGrainScene() {
  const [hovered, setHovered] = useState<GrainNode | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden" }}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: false, alpha: true, depth: true }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={80} color="#5EE7D6" />
        <GrainsGroup onHoverGrain={setHovered} />
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
        <span>{hovered ? `${hovered.name.toUpperCase()} // ${hovered.type}` : "ORLEANS CLUSTER // 2,450+ GRAINS"}</span>
        <span style={{ color: "var(--signal-cool)" }}>{hovered ? "ACTIVE" : "ONLINE"}</span>
      </div>
    </div>
  );
}
