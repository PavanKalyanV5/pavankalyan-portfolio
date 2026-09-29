"use client";

import React, { useState } from "react";
import styles from "./Visuals.module.css";

const DOMAINS = [
  {
    id: "backend",
    label: "Backend & Systems",
    skills: [
      { name: ".NET 8 / C# Core", level: 98, detail: "DDD, Orleans, WebAPI, MediatR" },
      { name: "Python FastAPI", level: 94, detail: "MCP Servers, Async Workers" },
      { name: "Rust", level: 88, detail: "CRDT Sync Engine, Memory Safety" },
      { name: "SQL & Cosmos DB", level: 92, detail: "Complex Projections, Caching" },
    ],
  },
  {
    id: "ai",
    label: "AI & ML Systems",
    skills: [
      { name: "Semantic Kernel", level: 96, detail: "Agent Planners, RAG Pipelines" },
      { name: "Vector Search", level: 95, detail: "Embeddings, Hybrid Retrieval" },
      { name: "LightGBM & SSA", level: 92, detail: "Time-Series Volatility Forecasting" },
      { name: "MCP Server Protocol", level: 94, detail: "Tool Execution & LLM Routing" },
    ],
  },
  {
    id: "patterns",
    label: "Architecture & DevOps",
    skills: [
      { name: "CQRS & Event Sourcing", level: 96, detail: "Event Store, Projections, Orleans" },
      { name: "Domain-Driven Design", level: 95, detail: "Aggregates, Bounded Contexts" },
      { name: "Docker & Containerization", level: 92, detail: "5-Microservice Compose Stacks" },
      { name: "Azure Monitor & Reliability", level: 94, detail: "99.9% Uptime, Proactive Alerts" },
    ],
  },
];

export function SkillsProficiencyMatrixVisual() {
  const [activeDomainIdx, setActiveDomainIdx] = useState(0);
  const activeDomain = DOMAINS[activeDomainIdx];

  return (
    <div className={styles.visualContainer}>
      <div className={styles.visualHeader}>
        <span className={styles.visualTag}>MASTERY_TELEMETRY // PROFICIENCY MATRIX</span>
        <div className={styles.tabToggles}>
          {DOMAINS.map((d, idx) => (
            <button
              key={d.id}
              className={`${styles.miniTab} ${activeDomainIdx === idx ? styles.miniTabActive : ""}`}
              onClick={() => setActiveDomainIdx(idx)}
              data-cursor="link"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.proficiencyGrid}>
        {activeDomain.skills.map((item, idx) => (
          <div key={idx} className={styles.meterCard}>
            <div className={styles.meterHeader}>
              <span className={styles.meterName}>{item.name}</span>
              <span className={styles.meterScore}>{item.level}%</span>
            </div>
            <div className={styles.meterTrack}>
              <div
                className={styles.meterBar}
                style={{ width: `${item.level}%` }}
              />
            </div>
            <span className={styles.meterDetail}>{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
