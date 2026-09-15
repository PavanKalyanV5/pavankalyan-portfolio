"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  /** Camera position that frames the whole current layer (from LayerGraph.cameraHome). */
  home: [number, number, number];
  /** World position of the focused node, or null when nothing is focused. */
  focus: [number, number, number] | null;
  /** When true, snap instantly and run no drift or parallax (reduced-motion / low-power). */
  still?: boolean;
}

// Frame-rate independent smooth constant
const SMOOTH = 0.0015;

export function CameraRig(props: CameraRigProps) {
  const { home, focus, still = false } = props;
  const { camera, pointer, clock } = useThree();

  // Persistent refs for lerped camera position and look target
  const targetPos = useRef(new THREE.Vector3(...home));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // Compute frame-rate-independent lerp factor
    const k = 1 - Math.pow(SMOOTH, delta);

    if (still) {
      // Still mode: snap directly without lerping
      if (focus) {
        // Focused offset position
        camera.position.set(
          focus[0] + 2.6,
          focus[1] + 0.9,
          focus[2] + 4.2
        );
        currentLook.current.set(focus[0], focus[1], focus[2]);
      } else {
        // Home position
        camera.position.set(home[0], home[1], home[2]);
        currentLook.current.set(0, 0, 0);
      }
      camera.lookAt(currentLook.current);
      return;
    }

    // Normal mode: with drift and parallax

    if (focus === null) {
      // Unfocused: home position + drift + parallax
      const driftX = Math.sin(clock.elapsedTime * 0.14) * 0.9;
      const driftY = Math.cos(clock.elapsedTime * 0.11) * 0.5;
      const parallaxX = pointer.x * 1.4;
      const parallaxY = pointer.y * 0.9;

      targetPos.current.set(
        home[0] + driftX + parallaxX,
        home[1] + driftY + parallaxY,
        home[2]
      );
      targetLook.current.set(0, 0, 0);
    } else {
      // Focused: position offset with reduced parallax, no drift
      const parallaxX = pointer.x * 0.45;
      const parallaxY = pointer.y * 0.3;

      targetPos.current.set(
        focus[0] + 2.6 + parallaxX,
        focus[1] + 0.9 + parallaxY,
        focus[2] + 4.2
      );
      targetLook.current.set(focus[0], focus[1], focus[2]);
    }

    // Lerp camera position toward target
    camera.position.lerp(targetPos.current, k);

    // Lerp look direction toward target
    currentLook.current.lerp(targetLook.current, k);

    // Apply look direction
    camera.lookAt(currentLook.current);
  });

  return null;
}
