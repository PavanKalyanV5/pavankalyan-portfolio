"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParallaxGroupProps {
  children: React.ReactNode;
  /** When true, apply no rotation at all. */
  still?: boolean;
}

// Frame-rate independent smooth constant
const SMOOTH = 0.0015;

export function ParallaxGroup(props: ParallaxGroupProps) {
  const { children, still = false } = props;
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current || still) {
      // Ensure group is always at zero rotation in still mode
      if (groupRef.current && still) {
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.z = 0;
      }
      return;
    }

    // Compute frame-rate-independent lerp factor
    const k = 1 - Math.pow(SMOOTH, delta);

    // Target rotations based on pointer position, clamped to ±0.2 rad
    const targetRotY = Math.max(-0.2, Math.min(0.2, pointer.x * 0.12));
    const targetRotX = Math.max(-0.2, Math.min(0.2, -pointer.y * 0.09));

    // Lerp current rotation toward target using scalar lerp
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      k
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      k
    );
  });

  return <group ref={groupRef}>{children}</group>;
}
