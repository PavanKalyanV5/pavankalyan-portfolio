"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LayerGraph } from "@/lib/mesh/types";
import { PARTICLE_COLOR } from "@/lib/mesh/nodeStyle";

const PER_EDGE = 5;

export interface FlowParticlesProps {
  graph: LayerGraph;
}

export function FlowParticles(props: FlowParticlesProps) {
  const { graph } = props;
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const positionsRef = useRef<Float32Array | null>(null);

  if (graph.edges.length === 0) {
    return null;
  }

  // Precompute particle data
  const { particleData, totalCount } = useMemo(() => {
    const data: Array<{
      startPos: [number, number, number];
      endPos: [number, number, number];
      phase: number;
    }> = [];

    for (let edgeIdx = 0; edgeIdx < graph.edges.length; edgeIdx++) {
      const edge = graph.edges[edgeIdx];
      const fromNode = graph.nodes.find((n) => n.id === edge.from);
      const toNode = graph.nodes.find((n) => n.id === edge.to);

      if (!fromNode || !toNode) continue;

      for (let particleIdx = 0; particleIdx < PER_EDGE; particleIdx++) {
        const phase =
          edgeIdx * 0.07 + particleIdx * 0.2;
        data.push({
          startPos: fromNode.position,
          endPos: toNode.position,
          phase,
        });
      }
    }

    return {
      particleData: data,
      totalCount: data.length,
    };
  }, [graph.edges, graph.nodes]);

  // Initialize positions buffer
  if (!positionsRef.current) {
    positionsRef.current = new Float32Array(totalCount * 3);
  }

  useFrame(({ clock }) => {
    if (!geometryRef.current || !positionsRef.current) return;

    const positions = positionsRef.current;

    for (let i = 0; i < particleData.length; i++) {
      const { startPos, endPos, phase } = particleData[i];
      const t = (clock.elapsedTime * 0.18 + phase) % 1;

      const x = startPos[0] + (endPos[0] - startPos[0]) * t;
      const y = startPos[1] + (endPos[1] - startPos[1]) * t;
      const z = startPos[2] + (endPos[2] - startPos[2]) * t;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points raycast={() => null}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positionsRef.current || new Float32Array(), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={PARTICLE_COLOR}
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
