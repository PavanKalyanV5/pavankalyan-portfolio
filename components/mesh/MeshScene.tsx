"use client";

import type { LayerGraph } from "@/lib/mesh/types";
import { MeshNodeObject } from "./MeshNodeObject";
import { MeshEdges } from "./MeshEdges";
import { FlowParticles } from "./FlowParticles";
import { NodeLabel } from "./NodeLabel";
import { QuantumField } from "./QuantumField";
import { CyberGrid } from "./CyberGrid";

export interface MeshSceneProps {
  graph: LayerGraph;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  /**
   * Hold the scene still for visitors who asked for reduced motion: no particle
   * flow, no node bob. The topology is still fully visible and interactive.
   */
  still?: boolean;
}

export function MeshScene(props: MeshSceneProps) {
  const { graph, hoveredId, selectedId, onHover, onSelect, still = false } = props;

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={1.3} />
      <pointLight position={[9, 7, 11]} intensity={180} distance={50} color="#5EE7D6" />
      <pointLight position={[-9, -5, 6]} intensity={140} distance={50} color="#8A6BFF" />
      <pointLight position={[0, -6, -6]} intensity={100} distance={45} color="#FFB35C" />
      <directionalLight position={[0, 10, 5]} intensity={0.6} color="#FFFFFF" />

      {/* Cosmic Quantum Particle Field */}
      <QuantumField still={still} />

      {/* Futuristic Receding Cyber Grid */}
      <CyberGrid still={still} />

      {/* Edges and particles */}
      <MeshEdges graph={graph} activeId={hoveredId ?? selectedId} />
      {!still && <FlowParticles graph={graph} />}

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
            still={still}
          />
        );
      })}

      {/* Micro-Labels: for unselected nodes so the topology remains readable */}
      {graph.nodes.map((node) => {
        const isHub = node.kind === "hub" || node.id.startsWith("link-");
        const isHovered = hoveredId === node.id && selectedId !== node.id;
        if (isHub || isHovered) {
          return (
            <NodeLabel
              key={`label-${node.id}`}
              node={node}
              emphasis={isHovered ? "strong" : "soft"}
            />
          );
        }
        return null;
      })}
    </group>
  );
}
