"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useIsMounted } from "@/lib/useIsMounted";
import styles from "./Card3D.module.css";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: "cool" | "warm" | "violet" | "emerald";
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card3D({
  children,
  className = "",
  intensity = 4.5, // Subtle, rock-solid tilt that never flies away
  glowColor = "cool",
  onClick,
  style,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useIsMounted();
  const prefersReduced = useReducedMotion();

  // Mouse coordinates strictly clamped between -0.5 and 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Calibrated spring physics for smooth, non-oscillating tilt
  const springConfig = { damping: 26, stiffness: 180, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]),
    springConfig
  );

  // Specular sheen hotspot coordinates (0% to 100%)
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle 350px at ${x}% ${y}%, rgba(255, 255, 255, 0.12), transparent 70%)`
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Strictly clamp normalized coordinates
    const rawX = (event.clientX - rect.left) / rect.width - 0.5;
    const rawY = (event.clientY - rect.top) / rect.height - 0.5;
    const clampedX = Math.max(-0.5, Math.min(0.5, rawX));
    const clampedY = Math.max(-0.5, Math.min(0.5, rawY));

    mouseX.set(clampedX);
    mouseY.set(clampedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (prefersReduced) {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${styles[glowColor]} ${className}`}
        onClick={onClick}
        style={style}
        suppressHydrationWarning
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={styles.perspectiveWrap}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      suppressHydrationWarning
    >
      <motion.div
        className={`${styles.card} ${styles[glowColor]} ${className}`}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
        whileHover={{ translateY: -3 }}
        whileTap={{ scale: 0.98 }}
        suppressHydrationWarning
      >
        {/* Specular Glare Layer - mounted on client only */}
        {mounted && (
          <motion.div
            className={styles.glare}
            style={{ background: glareBackground }}
            suppressHydrationWarning
          />
        )}

        {/* Card Content */}
        <div className={styles.inner}>{children}</div>
      </motion.div>
    </div>
  );
}
