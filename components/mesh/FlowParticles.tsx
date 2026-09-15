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

  // One buffer per particle set, rebuilt only when the particle count changes.
  const positions = useMemo(
    () => new Float32Array(totalCount * 3),
    [totalCount]
  );

  useFrame(({ clock }) => {
    const geometry = geometryRef.current;
    if (!geometry || particleData.length === 0) return;

    // Write straight into the geometry's own attribute buffer rather than into a
    // value captured from render scope — per-frame mutation is the point here,
    // and this keeps it owned by three.js instead of by React.
    const attribute = geometry.attributes.position;
    const buffer = attribute.array as Float32Array;

    for (let i = 0; i < particleData.length; i++) {
      const { startPos, endPos, phase } = particleData[i];
      const t = (clock.elapsedTime * 0.18 + phase) % 1;

      buffer[i * 3] = startPos[0] + (endPos[0] - startPos[0]) * t;
      buffer[i * 3 + 1] = startPos[1] + (endPos[1] - startPos[1]) * t;
      buffer[i * 3 + 2] = startPos[2] + (endPos[2] - startPos[2]) * t;
    }

    attribute.needsUpdate = true;
  });

  // Guard sits after every hook: a zero-length buffer would be invalid geometry,
  // but bailing out before the hooks above would change this component's hook
  // order between renders.
  if (totalCount === 0) return null;

  return (
    <points raycast={() => null}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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
