"use client";

import React, { useState } from "react";
import styles from "./Visuals.module.css";

const PILLARS = [
  {
    id: "rag",
    label: "AGENTIC_RAG_SYSTEM",
    title: "Autonomous RAG Chatbot",
    metric: "42ms LATENCY",
    desc: "Autonomous vector search retrieval with live continuous-learning indexing and local LLM execution in .NET 8.",
    tags: [".NET 8", "Semantic Kernel", "ChromaDB", "Vector Search"],
  },
  {
    id: "forecast",
    label: "ML_FORECASTING",
    title: "LightGBM + SSA Engine",
    metric: "82% AUTOMATION",
    desc: "Operational time-series volume forecasting modeling volatility, seasonality, and leading business indicators.",
    tags: ["LightGBM", "SSA", "Python FastAPI", "Cosmos DB"],
  },
  {
    id: "orleans",
    label: "DISTRIBUTED_ACTORS",
    title: "Microsoft Orleans Cluster",
    metric: "2,450+ GRAINS",
    desc: "Event-driven automations using Orleans virtual actors, CQRS, and Event Sourcing across distributed Azure Queues.",
    tags: ["Microsoft Orleans", "CQRS", "Event Sourcing", "Azure Queues"],
  },
  {
    id: "reliability",
    label: "PROD_RELIABILITY",
    title: "Enterprise Architecture",
    metric: "99.9% UPTIME",
    desc: "API Gateway pattern, DDD architecture against SQL Server and Cosmos DB with proactive Azure Monitor alerting.",
    tags: ["Azure Monitor", "API Gateway", "DDD", "SQL Server"],
  },
];

export function ExperienceArchitectureVisual() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activePillar = PILLARS[selectedIdx];

  return (
    <div className={styles.visualContainer}>
      <div className={styles.visualHeader}>
        <span className={styles.visualTag}>KOVALTY_TECH // PRODUCTION ARCHITECTURE</span>
        <span className={styles.visualMetric}>CLIENT: LOCATION SERVICES</span>
      </div>

      <div className={styles.expPillarsRow}>
        {PILLARS.map((p, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={p.id}
              className={`${styles.expPillarBtn} ${isSelected ? styles.expPillarActive : ""}`}
              onClick={() => setSelectedIdx(idx)}
              data-cursor="link"
            >
              <span className={styles.pillarNum}>0{idx + 1}</span>
              <span className={styles.pillarTitle}>{p.title}</span>
              <span className={styles.pillarMetric}>{p.metric}</span>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Card */}
      <div className={styles.activePillarCard}>
        <div className={styles.pillarCardHeader}>
          <span className={styles.pillarBadge}>{activePillar.label}</span>
          <span className={styles.pillarMetricBadge}>{activePillar.metric}</span>
        </div>
        <p className={styles.pillarDesc}>{activePillar.desc}</p>
        <div className={styles.pillarTags}>
          {activePillar.tags.map((t, i) => (
            <span key={i} className={styles.pillarTagPill}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
