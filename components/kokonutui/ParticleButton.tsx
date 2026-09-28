"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./ParticleButton.module.css";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
}

interface ParticleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  variant?: "primary" | "cool" | "violet" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const COLORS = ["#5EE7D6", "#FFB35C", "#8A6BFF", "#38BDF8", "#FFFFFF"];

export function ParticleButton({
  children,
  onClick,
  href,
  external = false,
  variant = "cool",
  size = "md",
  icon,
  className = "",
  disabled = false,
  type = "button",
}: ParticleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const prefersReduced = useReducedMotion();

  const spawnParticles = (e: React.MouseEvent) => {
    if (prefersReduced || disabled) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const originX = e.clientX - rect.left;
    const originY = e.clientY - rect.top;

    const count = 16;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 25 + Math.random() * 45;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: originX,
        y: originY,
        size: 2.5 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }

    setParticles((prev) => [...prev.slice(-30), ...newParticles]);

    // Clear after animation
    setTimeout(() => {
      setParticles([]);
    }, 700);
  };

  const handleClick = (e: React.MouseEvent) => {
    spawnParticles(e);
    if (onClick) onClick();
  };

  const content = (
    <>
      <span className={styles.reflection} />
      <span className={styles.inner}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.text}>{children}</span>
      </span>

      {/* Bursting micro-particles */}
      {!prefersReduced && particles.length > 0 && (
        <span className={styles.particleContainer}>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className={styles.particle}
              initial={{
                x: p.x,
                y: p.y,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: p.x + p.vx,
                y: p.y + p.vy,
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          ))}
        </span>
      )}
    </>
  );

  const baseClassName = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  if (href) {
    return (
      <a
        ref={buttonRef}
        href={href}
        className={baseClassName}
        onClick={handleClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-cursor="link"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      className={baseClassName}
      onClick={handleClick}
      disabled={disabled}
      data-cursor="link"
    >
      {content}
    </button>
  );
}
