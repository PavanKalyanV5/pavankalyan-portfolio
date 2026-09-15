"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial, MeshBasicMaterial, Group } from "three";
import type { MeshNode } from "@/lib/mesh/types";
import { styleFor } from "@/lib/mesh/nodeStyle";

export interface MeshNodeObjectProps {
  node: MeshNode;
  state: "idle" | "hovered" | "selected" | "dimmed";
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

const LERP_FACTOR = (delta: number) => 1 - Math.pow(0.001, delta);

export function MeshNodeObject(props: MeshNodeObjectProps) {
  const { node, state, onHover, onSelect } = props;
  const style = styleFor(node.emphasis);

  const groupRef = useRef<Group>(null);
  const coreMaterialRef = useRef<MeshStandardMaterial>(null);
  const shellMaterialRef = useRef<MeshBasicMaterial>(null);

  // Precompute stable phase from node id
  const phase = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < node.id.length; i++) {
      sum += node.id.charCodeAt(i);
    }
    return (sum * 0.37) % (2 * Math.PI);
  }, [node.id]);

  // Animation targets based on state
  const targets = useMemo(() => {
    switch (state) {
      case "idle":
        return {
          coreEmissiveIntensity: style.emissive,
          coreOpacity: 1,
          shellOpacity: 0.18,
        };
      case "hovered":
        return {
          coreEmissiveIntensity: style.emissive * 2.2,
          coreOpacity: 1,
          shellOpacity: 0.45,
        };
      case "selected":
        return {
          coreEmissiveIntensity: style.emissive * 2.6,
          coreOpacity: 1,
          shellOpacity: 0.55,
        };
      case "dimmed":
        return {
          coreEmissiveIntensity: style.emissive * 0.5,
          coreOpacity: 0.35,
          shellOpacity: 0.06,
        };
    }
  }, [state, style.emissive]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !coreMaterialRef.current || !shellMaterialRef.current) {
      return;
    }

    const lerpFactor = LERP_FACTOR(delta);

    // Lerp material properties
    coreMaterialRef.current.emissiveIntensity = lerp(
      coreMaterialRef.current.emissiveIntensity,
      targets.coreEmissiveIntensity,
      lerpFactor
    );
    coreMaterialRef.current.opacity = lerp(
      coreMaterialRef.current.opacity,
      targets.coreOpacity,
      lerpFactor
    );
    shellMaterialRef.current.opacity = lerp(
      shellMaterialRef.current.opacity,
      targets.shellOpacity,
      lerpFactor
    );

    // Ambient life: bob up and down
    groupRef.current.position.y =
      node.position[1] + Math.sin(clock.elapsedTime * 0.6 + phase) * 0.06;

    // Slow rotation when selected
    if (state === "selected") {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={node.position}>
      {/* Core mesh */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
      >
        <icosahedronGeometry args={[style.radius, 1]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          color={style.color}
          emissive={style.color}
          emissiveIntensity={style.emissive}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Shell mesh */}
      <mesh scale={1.42}>
        <icosahedronGeometry args={[style.radius, 1]} />
        <meshBasicMaterial
          ref={shellMaterialRef}
          color={style.color}
          wireframe
          transparent
          depthWrite={false}
          opacity={0.18}
        />
      </mesh>
    </group>
  );
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
