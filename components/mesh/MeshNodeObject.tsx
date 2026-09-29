"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MeshNode } from "@/lib/mesh/types";
import { styleFor } from "@/lib/mesh/nodeStyle";
import {
  playModelHoverSound,
  playModelSelectSound,
  type ModelArchetype,
} from "@/lib/audio/soundFx";

export interface MeshNodeObjectProps {
  node: MeshNode;
  state: "idle" | "hovered" | "selected" | "dimmed";
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  /** Snap to state instead of easing, and stop the ambient bob/spin. */
  still?: boolean;
}

const LERP_FACTOR = (delta: number) => 1 - Math.pow(0.001, delta);

export function MeshNodeObject(props: MeshNodeObjectProps) {
  const { node, state, onHover, onSelect, still = false } = props;
  const style = styleFor(node.emphasis);

  const groupRef = useRef<THREE.Group>(null);
  const coreMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const shellMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const satelliteGroupRef = useRef<THREE.Group>(null);

  // Precompute stable phase from node id
  const phase = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < node.id.length; i++) {
      sum += node.id.charCodeAt(i);
    }
    return (sum * 0.37) % (2 * Math.PI);
  }, [node.id]);

  // Determine geometry archetype from node properties
  const archetype: ModelArchetype = useMemo(() => {
    const id = node.id.toLowerCase();
    if (node.kind === "hub" || id === "me") return "hub";
    if (
      id.includes("rag") ||
      id.includes("ai") ||
      id.includes("ml") ||
      id.includes("model")
    )
      return "crystal";
    if (
      id.includes("orleans") ||
      id.includes("backend") ||
      id.includes("csharp") ||
      id.includes("dotnet") ||
      id.includes("system")
    )
      return "cube";
    if (
      id.includes("cloud") ||
      id.includes("docker") ||
      id.includes("azure") ||
      id.includes("network")
    )
      return "torus";
    return "polyhedron";
  }, [node.id, node.kind]);

  // Trigger shockwave expansion when state changes to selected
  const shockwaveProgress = useRef(1);
  useEffect(() => {
    if (state === "selected") {
      shockwaveProgress.current = 0;
    }
  }, [state]);

  // Target animation parameters
  const targets = useMemo(() => {
    switch (state) {
      case "idle":
        return {
          scale: 1,
          coreEmissiveIntensity: style.emissive,
          coreOpacity: 0.95,
          shellOpacity: 0.22,
          rotationSpeed: 0.25,
          ringSpeed: 0.5,
        };
      case "hovered":
        return {
          scale: 1.35,
          coreEmissiveIntensity: style.emissive * 2.8,
          coreOpacity: 1,
          shellOpacity: 0.65,
          rotationSpeed: 1.4,
          ringSpeed: 2.8,
        };
      case "selected":
        return {
          scale: 1.45,
          coreEmissiveIntensity: style.emissive * 3.4,
          coreOpacity: 1,
          shellOpacity: 0.8,
          rotationSpeed: 0.8,
          ringSpeed: 1.8,
        };
      case "dimmed":
        return {
          scale: 0.85,
          coreEmissiveIntensity: style.emissive * 0.35,
          coreOpacity: 0.25,
          shellOpacity: 0.05,
          rotationSpeed: 0.05,
          ringSpeed: 0.1,
        };
    }
  }, [state, style.emissive]);

  useFrame(({ pointer }, delta) => {
    if (!groupRef.current || !coreMaterialRef.current || !shellMaterialRef.current) {
      return;
    }

    if (still) {
      coreMaterialRef.current.emissiveIntensity = targets.coreEmissiveIntensity;
      coreMaterialRef.current.opacity = targets.coreOpacity;
      shellMaterialRef.current.opacity = targets.shellOpacity;
      groupRef.current.scale.setScalar(targets.scale);
      groupRef.current.position.y = node.position[1];
      return;
    }

    const elapsedTime = performance.now() * 0.001;
    const lerpFactor = LERP_FACTOR(delta);

    // Lerp scale
    const currentScale = groupRef.current.scale.x;
    const nextScale = lerp(currentScale, targets.scale, lerpFactor);
    groupRef.current.scale.setScalar(nextScale);

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

    // Ambient floating bob
    groupRef.current.position.y =
      node.position[1] + Math.sin(elapsedTime * 0.8 + phase) * 0.08;

    // Interactive rotation based on state
    groupRef.current.rotation.y += delta * targets.rotationSpeed;

    // Subtle magnetic gaze towards cursor on hover
    if (state === "hovered") {
      groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, pointer.y * 0.2, 0.1);
      groupRef.current.rotation.z = lerp(groupRef.current.rotation.z, -pointer.x * 0.2, 0.1);
    } else {
      groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, 0, 0.1);
      groupRef.current.rotation.z = lerp(groupRef.current.rotation.z, 0, 0.1);
    }

    // Decoupled Gyroscopic Ring Rotation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * (targets.ringSpeed + 0.4);
      ring1Ref.current.rotation.y += delta * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z += delta * (targets.ringSpeed + 0.3);
      ring2Ref.current.rotation.y -= delta * 0.5;
    }

    // Orbiting Satellites Rotation
    if (satelliteGroupRef.current) {
      satelliteGroupRef.current.rotation.y += delta * (targets.ringSpeed * 0.8 + 0.5);
      satelliteGroupRef.current.rotation.x = Math.sin(elapsedTime * 1.2) * 0.25;
    }

    // Expanding Shockwave Wave Animation on Selection
    if (shockwaveRef.current && shockwaveProgress.current < 1) {
      shockwaveProgress.current = Math.min(1, shockwaveProgress.current + delta * 2.2);
      const p = shockwaveProgress.current;
      shockwaveRef.current.scale.setScalar(1 + p * 2.4);
      const shockMat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
      if (shockMat) {
        shockMat.opacity = (1 - p) * 0.7;
      }
    }
  });

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    playModelHoverSound(archetype);
    onHover(node.id);
  };

  const handlePointerOut = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onHover(null);
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    playModelSelectSound();
    onSelect(node.id);
  };

  const r = style.radius;

  return (
    <group ref={groupRef} position={node.position}>
      {/* Hit / Interaction Mesh */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* Core Geometry based on Archetype */}
        {archetype === "hub" && (
          <octahedronGeometry args={[r * 1.15, 0]} />
        )}
        {archetype === "crystal" && (
          <dodecahedronGeometry args={[r, 0]} />
        )}
        {archetype === "cube" && (
          <boxGeometry args={[r * 1.5, r * 1.5, r * 1.5]} />
        )}
        {archetype === "torus" && (
          <torusGeometry args={[r * 0.9, r * 0.38, 16, 24]} />
        )}
        {archetype === "polyhedron" && (
          <icosahedronGeometry args={[r, 1]} />
        )}

        <meshStandardMaterial
          ref={coreMaterialRef}
          color={style.color}
          emissive={style.color}
          emissiveIntensity={style.emissive}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Wireframe Exoskeleton Shell */}
      <mesh scale={1.38}>
        {archetype === "hub" && (
          <octahedronGeometry args={[r * 1.15, 0]} />
        )}
        {archetype === "crystal" && (
          <dodecahedronGeometry args={[r, 0]} />
        )}
        {archetype === "cube" && (
          <boxGeometry args={[r * 1.5, r * 1.5, r * 1.5]} />
        )}
        {archetype === "torus" && (
          <torusGeometry args={[r * 0.9, r * 0.38, 16, 24]} />
        )}
        {archetype === "polyhedron" && (
          <icosahedronGeometry args={[r, 1]} />
        )}

        <meshBasicMaterial
          ref={shellMaterialRef}
          color={style.color}
          wireframe
          transparent
          depthWrite={false}
          opacity={0.22}
        />
      </mesh>

      {/* Holographic Gyroscopic Orbital Rings */}
      {(archetype === "hub" || state === "selected" || state === "hovered") && (
        <>
          <mesh ref={ring1Ref}>
            <torusGeometry args={[r * 1.85, 0.022, 8, 36]} />
            <meshBasicMaterial
              color={style.color}
              transparent
              opacity={state === "hovered" || state === "selected" ? 0.75 : 0.4}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[r * 2.1, 0.016, 8, 36]} />
            <meshBasicMaterial
              color={style.color}
              transparent
              opacity={state === "hovered" || state === "selected" ? 0.6 : 0.25}
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      {/* Orbiting Cyber Micro-Satellites on Hover / Selected */}
      {(state === "selected" || state === "hovered") && (
        <group ref={satelliteGroupRef}>
          <mesh position={[r * 2.3, 0, 0]}>
            <octahedronGeometry args={[0.07, 0]} />
            <meshBasicMaterial color="#5EE7D6" />
          </mesh>
          <mesh position={[-r * 1.6, r * 1.4, 0]}>
            <octahedronGeometry args={[0.055, 0]} />
            <meshBasicMaterial color="#8A6BFF" />
          </mesh>
          <mesh position={[0, -r * 1.8, r * 1.4]}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshBasicMaterial color="#FFB35C" />
          </mesh>
        </group>
      )}

      {/* Expanding Shockwave Wave Ring on Selection */}
      <mesh ref={shockwaveRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r * 0.9, r * 1.15, 32]} />
        <meshBasicMaterial
          color={style.color}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
