"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useIsMounted } from "@/lib/useIsMounted";
import styles from "./LiquidGlassCard.module.css";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "cool" | "warm" | "violet" | "emerald";
  highlightBorder?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function LiquidGlassCard({
  children,
  className = "",
  glow = "cool",
  highlightBorder = true,
  interactive = true,
  onClick,
  style,
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mounted = useIsMounted();
  const prefersReduced = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 200 });

  const spotX = useTransform(smoothX, (v) => `${v * 100}%`);
  const spotY = useTransform(smoothY, (v) => `${v * 100}%`);
  const spotlightBackground = useTransform(
    [spotX, spotY],
    ([x, y]) =>
      `radial-gradient(400px circle at ${x} ${y}, rgba(255, 255, 255, 0.08), transparent 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.container} ${styles[glow]} ${interactive ? styles.interactive : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={style}
      suppressHydrationWarning
    >
      {/* Dynamic Refraction Spotlight - mounted on client only */}
      {mounted && !prefersReduced && interactive && (
        <motion.div
          className={styles.spotlight}
          style={{ background: spotlightBackground }}
          suppressHydrationWarning
        />
      )}

      {/* Radiant Border Beam */}
      {highlightBorder && (
        <div className={`${styles.borderBeam} ${styles[`beam_${glow}`]}`} />
      )}

      {/* Internal Glass Highlight */}
      <div className={styles.innerSpecular} />

      {/* Content */}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
