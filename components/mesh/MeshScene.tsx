"use client";

import type { LayerGraph } from "@/lib/mesh/types";
import { MeshNodeObject } from "./MeshNodeObject";
import { MeshEdges } from "./MeshEdges";
import { FlowParticles } from "./FlowParticles";

export interface MeshSceneProps {
  graph: LayerGraph;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export function MeshScene(props: MeshSceneProps) {
  const { graph, hoveredId, selectedId, onHover, onSelect } = props;

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={1.1} />
      <pointLight position={[9, 7, 11]} intensity={140} distance={45} color="#5EE7D6" />
      <pointLight position={[-9, -5, 6]} intensity={110} distance={45} color="#8A6BFF" />
      <pointLight position={[0, -6, -6]} intensity={80} distance={40} color="#FFB35C" />

      {/* Edges and particles */}
      <MeshEdges graph={graph} activeId={hoveredId ?? selectedId} />
      <FlowParticles graph={graph} />

      {/* Nodes */}
      {graph.nodes.map((node) => {
        let state: "idle" | "hovered" | "selected" | "dimmed";
        if (selectedId === node.id) {
          state = "selected";
        } else if (hoveredId === node.id) {
          state = "hovered";
        } else if (selectedId !== null) {
          state = "dimmed";
        } else {
          state = "idle";
        }

        return (
          <MeshNodeObject
            key={node.id}
            node={node}
            state={state}
            onHover={onHover}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}
