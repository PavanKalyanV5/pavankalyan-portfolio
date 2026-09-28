"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CyberGridProps {
  still?: boolean;
}

export function CyberGrid({ still = false }: CyberGridProps) {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((_, delta) => {
    if (still || !gridRef.current) return;
    // Slow subtle rotation for infinite spatial depth
    gridRef.current.rotation.y += delta * 0.008;
  });

  return (
    <group position={[0, -7.5, 0]}>
      {/* Primary Cyber Grid */}
      <gridHelper
        ref={gridRef}
        args={[80, 50, "#5EE7D6", "#1B2540"]}
        position={[0, 0, 0]}
      >
        <lineBasicMaterial
          transparent
          opacity={0.16}
          depthWrite={false}
          color="#5EE7D6"
        />
      </gridHelper>

      {/* Deep Ground Horizon Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <ringGeometry args={[18, 38, 48]} />
        <meshBasicMaterial
          color="#0B1020"
          transparent
          opacity={0.45}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
