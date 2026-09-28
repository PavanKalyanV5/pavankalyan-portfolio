"use client";

import React from "react";
import styles from "./ShimmerText.module.css";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  tone?: "cool" | "warm" | "violet" | "silver";
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  speed?: "fast" | "normal" | "slow";
}

export function ShimmerText({
  children,
  className = "",
  tone = "cool",
  as: Component = "span",
  speed = "normal",
}: ShimmerTextProps) {
  return (
    <Component
      className={`${styles.shimmer} ${styles[tone]} ${styles[speed]} ${className}`}
    >
      {children}
    </Component>
  );
}
