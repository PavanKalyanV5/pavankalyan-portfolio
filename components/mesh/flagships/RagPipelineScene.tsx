"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Stage {
  id: string;
  name: string;
  color: string;
  x: number;
}

const STAGES: Stage[] = [
  { id: "query", name: "User Query", color: "#E8ECF5", x: -2.0 },
  { id: "embed", name: "Embedding", color: "#5EE7D6", x: -1.0 },
  { id: "retrieve", name: "Vector Search", color: "#8A6BFF", x: 0 },
  { id: "plan", name: "Semantic Planner", color: "#FFB35C", x: 1.0 },
  { id: "answer", name: "Grounded Answer", color: "#10B981", x: 2.0 },
];

function PipelineGroup({ onHoverStage }: { onHoverStage: (stage: Stage | null) => void }) {
  const packetRef = useRef<THREE.Mesh>(null);
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  useFrame(() => {
    const elapsed = performance.now() * 0.001;
    const progress = (elapsed * 0.5) % 1; // 0 to 1 cycle
    const currentX = -2.0 + progress * 4.0;

    if (packetRef.current) {
      packetRef.current.position.x = currentX;
      packetRef.current.position.y = Math.sin(progress * Math.PI * 4) * 0.12;
    }

    const stageIndex = Math.min(
      STAGES.length - 1,
      Math.floor(progress * STAGES.length)
    );
    setActiveStageIdx(stageIndex);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Pipeline Connecting Beam */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 4.2, 12]} />
        <meshBasicMaterial color="#1B2540" />
      </mesh>

      {/* Traveling Query Particle */}
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#5EE7D6" />
      </mesh>

      {/* Pipeline Stage Portals */}
      {STAGES.map((stage, idx) => {
        const isCurrent = activeStageIdx === idx;
        return (
          <group
            key={stage.id}
            position={[stage.x, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHoverStage(stage);
            }}
            onPointerOut={() => onHoverStage(null)}
          >
            <mesh scale={isCurrent ? 1.3 : 1}>
              <octahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial
                color={stage.color}
                emissive={stage.color}
                emissiveIntensity={isCurrent ? 2.2 : 0.6}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Stage Rings */}
            <mesh scale={1.4}>
              <torusGeometry args={[0.22, 0.015, 8, 24]} />
              <meshBasicMaterial
                color={stage.color}
                transparent
                opacity={isCurrent ? 0.8 : 0.25}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function RagPipelineScene() {
  const [hovered, setHovered] = useState<Stage | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden" }}>
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        gl={{ antialias: false, alpha: true, depth: true }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={80} color="#5EE7D6" />
        <PipelineGroup onHoverStage={setHovered} />
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
        <span>{hovered ? `${hovered.name.toUpperCase()} // PIPELINE STAGE` : "AGENTIC RAG PIPELINE // 5 STAGES"}</span>
        <span style={{ color: "#10B981" }}>42ms INFERENCE</span>
      </div>
    </div>
  );
}
