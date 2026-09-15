"use client";

import React from "react";
import styles from "./GlassPanel.module.css";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "aside" | "header" | "section";
}

export function GlassPanel({
  children,
  className,
  as: Component = "div",
}: GlassPanelProps) {
  return (
    <Component className={`${styles.panel} ${className || ""}`}>
      {children}
    </Component>
  );
}
