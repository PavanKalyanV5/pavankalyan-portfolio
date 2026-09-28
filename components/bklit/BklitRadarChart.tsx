"use client";

import React, { useState } from "react";
import styles from "./BklitRadarChart.module.css";

export interface RadarDimension {
  key: string;
  label: string;
  score: number; // 0 - 100
  detail: string;
  tags: string[];
}

export const ENGINEERING_PILLARS: RadarDimension[] = [
  {
    key: "distributed",
    label: "Distributed .NET & DDD",
    score: 98,
    detail: "Orleans virtual actors, Domain-Driven Design, MediatR, MassTransit, CQRS",
    tags: [".NET 8", "Orleans", "DDD", "Microservices"],
  },
  {
    key: "ai_rag",
    label: "AI & Agentic RAG",
    score: 96,
    detail: "Autonomous vector search retrieval, Semantic Kernel, Fast-API MCP, Multi-agent Council",
    tags: ["Semantic Kernel", "RAG", "Vector DB", "FastAPI"],
  },
  {
    key: "event_sourcing",
    label: "Event Sourcing & Streams",
    score: 95,
    detail: "Event store projections, RabbitMQ message brokers, Azure Queues, idempotent handlers",
    tags: ["RabbitMQ", "Event Sourcing", "CQRS", "Projections"],
  },
  {
    key: "high_throughput",
    label: "High-Throughput & ML",
    score: 94,
    detail: "LightGBM & SSA time-series forecasting, low-latency API gateways, query optimization",
    tags: ["LightGBM", "SSA Forecasting", "Cosmos DB", "SQL Server"],
  },
  {
    key: "cloud_devops",
    label: "Cloud & Reliability",
    score: 92,
    detail: "Microsoft Azure, Docker containerization, Azure Monitor, 99.99% uptime maintenance",
    tags: ["Azure", "Docker", "CI/CD", "Azure Monitor"],
  },
  {
    key: "polyglot_systems",
    label: "Polyglot & AST Parsing",
    score: 89,
    detail: "Rust CRDT synchronization, TypeScript GraphQL gateways, Game AST parser engines",
    tags: ["Rust", "TypeScript", "GraphQL", "CRDTs"],
  },
];

interface BklitRadarChartProps {
  data?: RadarDimension[];
  size?: number;
}

export function BklitRadarChart({
  data = ENGINEERING_PILLARS,
  size = 380,
}: BklitRadarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const center = size / 2;
  const radius = center - 52;
  const count = data.length;

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Helper to compute coordinate for a given angle and normalized radius
  const getPoint = (index: number, valueRatio: number) => {
    const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
    const r = radius * valueRatio;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
    };
  };

  // Compute polygon vertices for data
  const dataPoints = data.map((d, i) => getPoint(i, d.score / 100));
  const polygonPointsStr = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const activeDim = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          BKLIT_RADAR_TELEMETRY // ARCHITECTURE METRICS
        </div>
        <div className={styles.metricAvg}>
          TOPOLOGY_POWER: <span className={styles.metricVal}>94.0%</span>
        </div>
      </div>

      <div className={styles.chartContainer} style={{ width: size, height: size }} suppressHydrationWarning>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={styles.svg}
          suppressHydrationWarning
        >
          <defs suppressHydrationWarning>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%" suppressHydrationWarning>
              <stop offset="0%" stopColor="#5EE7D6" stopOpacity="0.45" suppressHydrationWarning />
              <stop offset="70%" stopColor="#8A6BFF" stopOpacity="0.22" suppressHydrationWarning />
              <stop offset="100%" stopColor="#0B1020" stopOpacity="0.05" suppressHydrationWarning />
            </radialGradient>

            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%" suppressHydrationWarning>
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Polygonal Grid Rings */}
          {levels.map((level, lIndex) => {
            const levelPoints = data
              .map((_, i) => {
                const pt = getPoint(i, level);
                return `${pt.x},${pt.y}`;
              })
              .join(" ");

            return (
              <polygon
                key={lIndex}
                points={levelPoints}
                className={styles.gridRing}
                stroke={lIndex === levels.length - 1 ? "rgba(94, 231, 214, 0.25)" : "rgba(255, 255, 255, 0.08)"}
                suppressHydrationWarning
              />
            );
          })}

          {/* Radial Spokes from Center */}
          {data.map((_, i) => {
            const pt = getPoint(i, 1.0);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={pt.x}
                y2={pt.y}
                className={styles.spoke}
                suppressHydrationWarning
              />
            );
          })}

          {/* Filled Data Shape with Glowing Stroke */}
          <polygon
            points={polygonPointsStr}
            fill="url(#radarFill)"
            stroke="#5EE7D6"
            strokeWidth="2.2"
            filter="url(#radarGlow)"
            className={styles.dataPolygon}
            suppressHydrationWarning
          />

          {/* Interactive Vertex Nodes */}
          {dataPoints.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                className={styles.vertexGroup}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                suppressHydrationWarning
              >
                {/* Hit area */}
                <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" cursor="pointer" suppressHydrationWarning />

                {/* Ambient pulse halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 10 : 6}
                  fill={isHovered ? "#5EE7D6" : "#8A6BFF"}
                  opacity={isHovered ? 0.8 : 0.35}
                  className={styles.vertexHalo}
                  suppressHydrationWarning
                />

                {/* Core dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 4.5 : 3}
                  fill="#FFFFFF"
                  stroke="#5EE7D6"
                  strokeWidth="1.5"
                  suppressHydrationWarning
                />
              </g>
            );
          })}

          {/* Axis Labels positioned at periphery */}
          {data.map((dim, i) => {
            const pt = getPoint(i, 1.15);
            const isHovered = hoveredIndex === i;
            return (
              <text
                key={i}
                x={pt.x}
                y={pt.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`${styles.axisLabel} ${isHovered ? styles.activeLabel : ""}`}
                onClick={() => setHoveredIndex(i)}
              >
                {dim.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Active Dimension Details card */}
      <div className={styles.detailCard}>
        {activeDim ? (
          <div>
            <div className={styles.dimHeader}>
              <span className={styles.dimTitle}>{activeDim.label}</span>
              <span className={styles.dimScore}>{activeDim.score}%</span>
            </div>
            <p className={styles.dimDetail}>{activeDim.detail}</p>
            <div className={styles.tagsRow}>
              {activeDim.tags.map((tag, tIdx) => (
                <span key={tIdx} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.dimPlaceholder}>
            Hover any telemetry vertex to inspect architectural competencies & stack integration.
          </div>
        )}
      </div>
    </div>
  );
}
