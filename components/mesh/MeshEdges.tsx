"use client";

import { useMemo } from "react";
import type { LayerGraph, MeshNode } from "@/lib/mesh/types";
import { EDGE_DIM, EDGE_ACTIVE } from "@/lib/mesh/nodeStyle";

export interface MeshEdgesProps {
  graph: LayerGraph;
  activeId: string | null;
}

export function MeshEdges(props: MeshEdgesProps) {
  const { graph, activeId } = props;

  // Build a map of nodes by id for O(1) endpoint lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, MeshNode>();
    for (const node of graph.nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [graph.nodes]);

  // Dim set: all edges
  const dimPositions = useMemo(() => {
    const positions: number[] = [];
    for (const edge of graph.edges) {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);
      if (!fromNode || !toNode) continue;

      positions.push(...fromNode.position, ...toNode.position);
    }
    return new Float32Array(positions);
  }, [graph.edges, nodeMap]);

  // Active set: only edges connected to activeId
  const activePositions = useMemo(() => {
    if (!activeId) return null;

    const positions: number[] = [];
    for (const edge of graph.edges) {
      if (edge.from !== activeId && edge.to !== activeId) continue;

      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);
      if (!fromNode || !toNode) continue;

      positions.push(...fromNode.position, ...toNode.position);
    }

    return positions.length > 0 ? new Float32Array(positions) : null;
  }, [graph.edges, nodeMap, activeId]);

  return (
    <>
      {/* Dim edge set */}
      <lineSegments raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dimPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={EDGE_DIM} transparent opacity={0.55} />
      </lineSegments>

      {/* Active edge set */}
      {activePositions && (
        <lineSegments raycast={() => null}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[activePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={EDGE_ACTIVE} transparent opacity={0.9} />
        </lineSegments>
      )}
    </>
  );
}
