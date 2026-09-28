"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./BklitMetricsChart.module.css";

interface DataPoint {
  label: string;
  value: number; // e.g. throughput in requests / minute or volume
  formatted: string;
}

const DEFAULT_METRICS: DataPoint[] = [
  { label: "Q1", value: 1200, formatted: "1.2k req/s" },
  { label: "Q2", value: 2400, formatted: "2.4k req/s" },
  { label: "Q3", value: 4100, formatted: "4.1k req/s" },
  { label: "Q4", value: 7200, formatted: "7.2k req/s" },
  { label: "Q5", value: 11500, formatted: "11.5k req/s" },
  { label: "Q6", value: 14800, formatted: "14.8k req/s (Peak)" },
];

interface BklitMetricsChartProps {
  title?: string;
  data?: DataPoint[];
  color?: "cool" | "violet" | "warm";
  height?: number;
}

export function BklitMetricsChart({
  title = "EVENT_THROUGHPUT_SCALE",
  data = DEFAULT_METRICS,
  color = "cool",
  height = 160,
}: BklitMetricsChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  const width = 420;
  const paddingX = 30;
  const paddingY = 24;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;
  const minVal = 0;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Calculate points
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartW;
    const y = paddingY + chartH - ((d.value - minVal) / (maxVal - minVal)) * chartH;
    return { x, y, ...d };
  });

  // Construct smooth SVG cubic bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX1 = curr.x + (next.x - curr.x) * 0.45;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (next.x - curr.x) * 0.55;
    const cpY2 = next.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  // Area path: line + down to bottom + back to start
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1];

  const strokeColor = color === "cool" ? "#5EE7D6" : color === "violet" ? "#8A6BFF" : "#FFB35C";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.badge}>
          <span className={styles.activeVal}>{activePoint.formatted}</span>
          <span className={styles.activeLabel}>[{activePoint.label}]</span>
        </div>
      </div>

      <div className={styles.svgWrap}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={styles.svg}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`gradArea_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingY + chartH / 2}
            x2={width - paddingX}
            y2={paddingY + chartH / 2}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="rgba(255,255,255,0.08)"
          />

          {/* Area Fill */}
          <motion.path
            d={areaD}
            fill={`url(#gradArea_${color})`}
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Stroke Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            initial={prefersReduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Interactive Nodes */}
          {points.map((pt, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g
                key={i}
                className={styles.pointGroup}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle cx={pt.x} cy={pt.y} r={18} fill="transparent" cursor="pointer" />
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={7}
                    fill={strokeColor}
                    opacity={0.35}
                    className={styles.pointHalo}
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 4.5 : 3}
                  fill="#FFFFFF"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.xLabels}>
        {data.map((d, i) => (
          <span
            key={i}
            className={`${styles.xLabel} ${hoveredIdx === i ? styles.activeX : ""}`}
            onClick={() => setHoveredIdx(i)}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
