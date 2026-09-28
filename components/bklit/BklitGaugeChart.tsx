"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./BklitGaugeChart.module.css";

interface BklitGaugeChartProps {
  value: number; // 0 to 100
  label: string;
  sublabel?: string;
  tone?: "cool" | "violet" | "emerald" | "warm";
  size?: number;
}

export function BklitGaugeChart({
  value,
  label,
  sublabel,
  tone = "cool",
  size = 120,
}: BklitGaugeChartProps) {
  const prefersReduced = useReducedMotion();

  const radius = (size - 18) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference * 0.75; // 270 degree arc

  const strokeColor =
    tone === "cool"
      ? "#5EE7D6"
      : tone === "violet"
      ? "#8A6BFF"
      : tone === "emerald"
      ? "#10B981"
      : "#FFB35C";

  return (
    <div className={styles.container} style={{ width: size }}>
      <div className={styles.gaugeWrap} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.svg}>
          {/* Background Track Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="7"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={-circumference * 0.125}
            strokeLinecap="round"
          />

          {/* Active Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="7"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={prefersReduced ? strokeDashoffset : circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            className={styles.activeArc}
          />
        </svg>

        {/* Center Readout */}
        <div className={styles.centerText}>
          <span className={styles.value} style={{ color: strokeColor }}>
            {value}%
          </span>
          <span className={styles.unit}>OPTIMAL</span>
        </div>
      </div>

      <div className={styles.labelWrap}>
        <div className={styles.label}>{label}</div>
        {sublabel && <div className={styles.sublabel}>{sublabel}</div>}
      </div>
    </div>
  );
}
