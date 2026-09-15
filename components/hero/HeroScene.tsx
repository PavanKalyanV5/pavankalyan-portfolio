"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, Octahedron, TorusKnot, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Box } from "@mui/material";
import type { Group } from "three";

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetX = pointer.y * 0.35;
    const targetY = pointer.x * 0.5;
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, delta * 2.5);
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 2.5);
  });

  return <group ref={group}>{children}</group>;
}

export function HeroScene() {
  return (
    <Box sx={{ position: "absolute", inset: 0 }} aria-hidden>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <color attach="background" args={["#05070d"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.4} color="#4F9DFF" />
        <pointLight position={[-5, -3, 2]} intensity={1.1} color="#8A5CFF" />
        <pointLight position={[0, -4, -3]} intensity={0.8} color="#38D9C4" />

        <Stars radius={60} depth={40} count={2200} factor={2.4} saturation={0} fade speed={0.6} />

        <ParallaxRig>
          <Float speed={1.4} rotationIntensity={1.1} floatIntensity={1.4}>
            <Icosahedron args={[1.7, 1]}>
              <meshStandardMaterial
                color="#4F9DFF"
                emissive="#4F9DFF"
                emissiveIntensity={0.5}
                wireframe
              />
            </Icosahedron>
          </Float>

          <Float speed={2.1} rotationIntensity={2} floatIntensity={2.2}>
            <Octahedron args={[0.55, 0]} position={[2.6, 1.4, -1.2]}>
              <meshStandardMaterial
                color="#8A5CFF"
                emissive="#8A5CFF"
                emissiveIntensity={0.8}
                wireframe
              />
            </Octahedron>
          </Float>

          <Float speed={1.7} rotationIntensity={1.6} floatIntensity={1.8}>
            <TorusKnot args={[0.5, 0.16, 128, 16]} position={[-2.4, -1.2, -0.8]}>
              <meshStandardMaterial
                color="#38D9C4"
                emissive="#38D9C4"
                emissiveIntensity={0.7}
                wireframe
              />
            </TorusKnot>
          </Float>
        </ParallaxRig>

        <EffectComposer>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </Box>
  );
}
