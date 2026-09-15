"use client";

import { useMemo } from "react";
import type React from "react";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Vector2 } from "three";

interface EffectsProps {
  /** "low" trims the stack for weak devices. Default "high". */
  quality?: "high" | "low";
}

export function Effects({
  quality = "high",
}: EffectsProps): React.ReactNode {
  // Memoize the offset vector for ChromaticAberration to prevent unnecessary recreations
  const chromaticOffset = useMemo(
    () => new Vector2(0.0007, 0.0007),
    []
  );

  return (
    <EffectComposer multisampling={0}>
      {/* Bloom: always on. Core glow effect for emissive nodes. */}
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.4}
        mipmapBlur
      />

      {/* ChromaticAberration: only when quality is "high" */}
      {quality === "high" && (
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation={false}
        />
      )}

      {/* Noise: film grain effect, only when quality is "high" */}
      {quality === "high" && (
        <Noise opacity={0.035} premultiply />
      )}

      {/* Vignette: always on. Subtle edge darkening. */}
      <Vignette offset={0.32} darkness={0.72} />
    </EffectComposer>
  );
}
