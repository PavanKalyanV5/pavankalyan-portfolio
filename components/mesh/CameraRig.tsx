"use client";

import { useEffect, useRef } from "react";
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
const SMOOTH = 0.0018;

function centreShift(viewportWidth: number): number {
  if (viewportWidth >= 1400) return 4.5;
  if (viewportWidth >= 1100) return 3.2;
  return 0;
}

export function CameraRig(props: CameraRigProps) {
  const { home, focus, still = false } = props;
  const { camera, pointer, clock, size, gl } = useThree();

  // Persistent refs for lerped camera position and look target
  const targetPos = useRef(new THREE.Vector3(...home));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  // Manual drag orbit offsets when inspecting
  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });
  const orbitOffset = useRef({ yaw: 0, pitch: 0 });

  // Listen for canvas drag on 3D view to allow free rotation around focused node
  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    const handlePointerDown = (e: PointerEvent) => {
      // Only drag with primary mouse button
      if (e.button !== 0) return;
      isDragging.current = true;
      previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = (e.clientX - previousPointer.current.x) * 0.004;
      const deltaY = (e.clientY - previousPointer.current.y) * 0.004;

      orbitOffset.current.yaw += deltaX;
      orbitOffset.current.pitch = Math.max(-0.6, Math.min(0.6, orbitOffset.current.pitch - deltaY));

      previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [gl]);

  // Reset orbit offset when focus changes
  useEffect(() => {
    orbitOffset.current = { yaw: 0, pitch: 0 };
  }, [focus]);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(SMOOTH, delta);
    const shift = centreShift(size.width);

    if (still) {
      if (focus) {
        camera.position.set(focus[0] - 1.4, focus[1] + 0.3, focus[2] + 3.8);
        currentLook.current.set(focus[0], focus[1], focus[2]);
      } else {
        camera.position.set(home[0] - shift, home[1], home[2]);
        currentLook.current.set(-shift, 0, 0);
      }
      camera.lookAt(currentLook.current);
      return;
    }

    if (focus === null) {
      // Unfocused home view: subtle ambient drift + slight cursor parallax
      const driftX = Math.sin(clock.elapsedTime * 0.12) * 0.7;
      const driftY = Math.cos(clock.elapsedTime * 0.1) * 0.4;
      const parallaxX = pointer.x * 0.9;
      const parallaxY = pointer.y * 0.6;

      targetPos.current.set(
        home[0] - shift + driftX + parallaxX,
        home[1] + driftY + parallaxY,
        home[2]
      );
      targetLook.current.set(-shift, 0, 0);
    } else {
      // FOCUSED NODE VIEW:
      // ZERO cursor-following jitter! The camera locks stably on the node.
      // Allows intentional user drag-orbiting without wobbling on mouse movement.
      const isWide = size.width >= 1024;
      const focusOffsetX = isWide ? -1.4 : 0; // Offset camera left so detail panel on right doesn't obscure node
      const focusOffsetY = isWide ? 0.3 : 0.8;
      const distance = isWide ? 3.8 : 4.4;

      // Apply intentional user drag-orbit around focus point
      const yaw = orbitOffset.current.yaw;
      const pitch = orbitOffset.current.pitch;

      const camX = focus[0] + focusOffsetX + Math.sin(yaw) * distance;
      const camY = focus[1] + focusOffsetY + Math.sin(pitch) * 2;
      const camZ = focus[2] + Math.cos(yaw) * distance;

      targetPos.current.set(camX, camY, camZ);
      targetLook.current.set(focus[0], focus[1], focus[2]);
    }

    // Smooth lerp to target position
    camera.position.lerp(targetPos.current, k);

    // Smooth lerp look target
    currentLook.current.lerp(targetLook.current, k);
    camera.lookAt(currentLook.current);
  });

  return null;
}
