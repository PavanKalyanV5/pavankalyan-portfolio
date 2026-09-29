"use client";

import React, { useEffect, useState } from "react";
import styles from "./Visuals.module.css";

const GRAINS = [
  { id: "coord", name: "Coordinator Grain", type: "Stateful Actor", color: "#5EE7D6" },
  { id: "loc", name: "Location Grain #42", type: "Virtual Actor", color: "#8A6BFF" },
  { id: "alert", name: "Alert Worker", type: "Stateless Worker", color: "#FFB35C" },
  { id: "stream", name: "Azure Queue Consumer", type: "Stream Ingestion", color: "#38BDF8" },
];

export function OrleansClusterVisual() {
  const [pulseIdx, setPulseIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIdx((prev) => (prev + 1) % GRAINS.length);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.visualContainer}>
      <div className={styles.visualHeader}>
        <span className={styles.visualTag}>ORLEANS_ACTOR_MESH // CLUSTER</span>
        <span className={styles.visualMetric}>2,450+ GRAINS ACTIVE</span>
      </div>

      <div className={styles.grainsGrid}>
        {GRAINS.map((grain, idx) => {
          const isPulsing = pulseIdx === idx;
          return (
            <div
              key={grain.id}
              className={`${styles.grainCard} ${isPulsing ? styles.grainPulsing : ""}`}
              style={{
                borderColor: isPulsing ? grain.color : "rgba(255, 255, 255, 0.08)",
                boxShadow: isPulsing ? `0 0 16px ${grain.color}35` : "none",
              }}
            >
              <div className={styles.grainTop}>
                <span
                  className={styles.grainDot}
                  style={{ backgroundColor: grain.color }}
                />
                <span className={styles.grainId}>{grain.id.toUpperCase()}</span>
              </div>
              <div className={styles.grainName}>{grain.name}</div>
              <div className={styles.grainType}>{grain.type}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
