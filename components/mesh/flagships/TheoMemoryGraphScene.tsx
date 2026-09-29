"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TheoNode {
  id: string;
  label: string;
  type: "crdt" | "agent" | "graph" | "gateway";
  color: string;
  position: [number, number, number];
}

const THEO_NODES: TheoNode[] = [
  { id: "core", label: "Theo Sync Core", type: "crdt", color: "#5EE7D6", position: [0, 0, 0] },
  { id: "council", label: "Agentic Council", type: "agent", color: "#8A6BFF", position: [-1.4, 0.9, 0.5] },
  { id: "crdt", label: "Rust Yrs Engine", type: "crdt", color: "#FFB35C", position: [1.5, 0.8, -0.4] },
  { id: "neo4j", label: "Knowledge Graph", type: "graph", color: "#38BDF8", position: [-1.2, -1.1, -0.5] },
  { id: "graphql", label: "Federated Gateway", type: "gateway", color: "#10B981", position: [1.3, -1.0, 0.6] },
];

const THEO_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [3, 4],
];

function MemoryGraphGroup({ onHoverNode }: { onHoverNode: (node: TheoNode | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x = Math.sin(performance.now() * 0.0007) * 0.12;
    }
  });

  const edgeData = useMemo(() => {
    const points: number[] = [];
    THEO_EDGES.forEach(([i, j]) => {
      points.push(...THEO_NODES[i].position, ...THEO_NODES[j].position);
    });
    return new Float32Array(points);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Semantic Graph Edges */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edgeData, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1B2540" transparent opacity={0.7} />
      </lineSegments>

      {/* Nodes */}
      {THEO_NODES.map((node) => {
        const isHovered = activeId === node.id;
        return (
          <mesh
            key={node.id}
            position={node.position}
            scale={isHovered ? 1.4 : 1}
            onPointerOver={(e) => {
              e.stopPropagation();
              setActiveId(node.id);
              onHoverNode(node);
            }}
            onPointerOut={() => {
              setActiveId(null);
              onHoverNode(null);
            }}
          >
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={isHovered ? 2.0 : 0.7}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function TheoMemoryGraphScene() {
  const [hovered, setHovered] = useState<TheoNode | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden" }}>
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        gl={{ antialias: false, alpha: true, depth: true }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={80} color="#5EE7D6" />
        <MemoryGraphGroup onHoverNode={setHovered} />
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
        <span>{hovered ? `${hovered.label.toUpperCase()} // ${hovered.type.toUpperCase()}` : "THEO MEMORY GRAPH // RUST CRDT"}</span>
        <span style={{ color: "var(--signal-violet)" }}>COLLABORATIVE</span>
      </div>
    </div>
  );
}
