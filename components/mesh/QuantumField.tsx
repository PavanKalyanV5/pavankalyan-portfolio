"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface QuantumFieldProps {
  still?: boolean;
}

// Generate static buffer attributes once at module load
const PARTICLE_COUNT = 450;
const POSITIONS = new Float32Array(PARTICLE_COUNT * 3);
const COLORS = new Float32Array(PARTICLE_COUNT * 3);

const PALETTE = [
  new THREE.Color("#5EE7D6"),
  new THREE.Color("#8A6BFF"),
  new THREE.Color("#FFB35C"),
  new THREE.Color("#38BDF8"),
];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  // Deterministic distribution across cylinder
  const seed = i + 1;
  const pseudo1 = Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
  const pseudo2 = Math.abs(Math.sin(seed * 78.233) * 23421.631) % 1;
  const pseudo3 = Math.abs(Math.sin(seed * 45.164) * 85432.124) % 1;

  const radius = 12 + pseudo1 * 28;
  const theta = pseudo2 * Math.PI * 2;
  const y = (pseudo3 - 0.5) * 36;

  POSITIONS[i * 3] = Math.cos(theta) * radius;
  POSITIONS[i * 3 + 1] = y;
  POSITIONS[i * 3 + 2] = Math.sin(theta) * radius - 8;

  const color = PALETTE[i % PALETTE.length];
  COLORS[i * 3] = color.r;
  COLORS[i * 3 + 1] = color.g;
  COLORS[i * 3 + 2] = color.b;
}

export function QuantumField({ still = false }: QuantumFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (still || !pointsRef.current) return;
    // Slow majestic cosmic drift
    pointsRef.current.rotation.y += delta * 0.015;
    pointsRef.current.rotation.x += delta * 0.005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[POSITIONS, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[COLORS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
