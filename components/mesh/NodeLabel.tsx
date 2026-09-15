"use client";

import { Html } from "@react-three/drei";
import type { MeshNode } from "@/lib/mesh/types";
import styles from "./NodeLabel.module.css";

export interface NodeLabelProps {
  node: MeshNode;
  emphasis?: "strong" | "soft";
}

export function NodeLabel({ node, emphasis }: NodeLabelProps) {
  return (
    <Html
      position={node.position}
      center
      distanceFactor={14}
      className={styles.labelContainer}
    >
      <div className={styles.label}>
        <div className={styles.labelText}>{node.label}</div>
        {emphasis === "strong" && (
          <div className={styles.meta}>{node.meta}</div>
        )}
      </div>
    </Html>
  );
}
