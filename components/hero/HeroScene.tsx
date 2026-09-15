"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Icosahedron } from "@react-three/drei";
import { Box } from "@mui/material";

export function HeroScene() {
  return (
    <Box sx={{ position: "absolute", inset: 0 }} aria-hidden>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#4F9DFF" />
        <pointLight position={[-5, -3, 2]} intensity={0.8} color="#8A5CFF" />
        <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.5}>
          <Icosahedron args={[1.6, 1]}>
            <meshStandardMaterial color="#4F9DFF" wireframe />
          </Icosahedron>
        </Float>
      </Canvas>
    </Box>
  );
}
