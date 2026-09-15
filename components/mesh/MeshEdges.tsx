"use client";

import { useMemo } from "react";
import type { LayerGraph, MeshNode } from "@/lib/mesh/types";
import { EDGE_DIM, EDGE_ACTIVE } from "@/lib/mesh/nodeStyle";
import { edgeControlPoint, pointOnEdge } from "@/lib/mesh/curve";

export interface MeshEdgesProps {
  graph: LayerGraph;
  activeId: string | null;
}

const SEGMENTS = 14;

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

  // Dim set: all edges with curved path
  const dimPositions = useMemo(() => {
    const positions: number[] = [];
    for (const edge of graph.edges) {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);
      if (!fromNode || !toNode) continue;

      const from = fromNode.position;
      const to = toNode.position;
      const control = edgeControlPoint(from, to);

      // Emit SEGMENTS consecutive line segments
      for (let k = 0; k < SEGMENTS; k++) {
        const p1 = pointOnEdge(from, control, to, k / SEGMENTS);
        const p2 = pointOnEdge(from, control, to, (k + 1) / SEGMENTS);
        positions.push(...p1, ...p2);
      }
    }
    return new Float32Array(positions);
  }, [graph.edges, nodeMap]);

  // Active set: only edges connected to activeId with curved path
  const activePositions = useMemo(() => {
    if (!activeId) return null;

    const positions: number[] = [];
    for (const edge of graph.edges) {
      if (edge.from !== activeId && edge.to !== activeId) continue;

      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);
      if (!fromNode || !toNode) continue;

      const from = fromNode.position;
      const to = toNode.position;
      const control = edgeControlPoint(from, to);

      // Emit SEGMENTS consecutive line segments
      for (let k = 0; k < SEGMENTS; k++) {
        const p1 = pointOnEdge(from, control, to, k / SEGMENTS);
        const p2 = pointOnEdge(from, control, to, (k + 1) / SEGMENTS);
        positions.push(...p1, ...p2);
      }
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
