"use client";

import React, { useEffect, useState } from "react";
import styles from "./Visuals.module.css";

const STAGES = [
  { id: "query", name: "User Query", tag: "INPUT", color: "#E8ECF5" },
  { id: "embed", name: "Embedding", tag: "VECTOR", color: "#5EE7D6" },
  { id: "retrieve", name: "ChromaDB", tag: "RETRIEVAL", color: "#8A6BFF" },
  { id: "plan", name: "Semantic Kernel", tag: "PLANNER", color: "#FFB35C" },
  { id: "answer", name: "Grounded Answer", tag: "OUTPUT", color: "#10B981" },
];

export function RagPipelineVisual() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.visualContainer}>
      <div className={styles.visualHeader}>
        <span className={styles.visualTag}>AGENTIC_RAG // 5-STAGE PIPELINE</span>
        <span className={styles.visualMetric}>42ms INFERENCE</span>
      </div>

      <div className={styles.pipelineTrack}>
        {STAGES.map((stage, idx) => {
          const isActive = activeStage === idx;
          return (
            <React.Fragment key={stage.id}>
              <div
                className={`${styles.pipelineStage} ${isActive ? styles.stageActive : ""}`}
                style={{
                  borderColor: isActive ? stage.color : "rgba(255, 255, 255, 0.08)",
                  boxShadow: isActive ? `0 0 16px ${stage.color}40` : "none",
                }}
              >
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: stage.color }}
                />
                <span className={styles.stageName}>{stage.name}</span>
                <span className={styles.stageSub}>{stage.tag}</span>
              </div>

              {idx < STAGES.length - 1 && (
                <div className={styles.pipelineConnector}>
                  <div
                    className={styles.connectorBeam}
                    style={{
                      opacity: isActive ? 1 : 0.25,
                      background: isActive
                        ? `linear-gradient(90deg, ${stage.color}, ${STAGES[idx + 1].color})`
                        : "rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
