"use client";

import React, { useEffect, useState } from "react";
import styles from "./Visuals.module.css";

const NODES = [
  { id: "core", name: "Rust CRDT Engine", role: "Text Sync", color: "#5EE7D6" },
  { id: "agents", name: "Agent Council", role: "MediatR Bus", color: "#8A6BFF" },
  { id: "db", name: "SQLite WAL", role: "Checkpointing", color: "#FFB35C" },
  { id: "graph", name: "Federated GraphQL", role: "Gateway API", color: "#38BDF8" },
];

export function TheoNetworkVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % NODES.length);
    }, 1300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.visualContainer}>
      <div className={styles.visualHeader}>
        <span className={styles.visualTag}>THEO_POLYGLOT_ARCHITECTURE</span>
        <span className={styles.visualMetric}>RUST + .NET 8</span>
      </div>

      <div className={styles.theoGrid}>
        {NODES.map((node, idx) => {
          const isActive = active === idx;
          return (
            <div
              key={node.id}
              className={`${styles.theoNode} ${isActive ? styles.theoNodeActive : ""}`}
              style={{
                borderColor: isActive ? node.color : "rgba(255, 255, 255, 0.08)",
                boxShadow: isActive ? `0 0 16px ${node.color}35` : "none",
              }}
            >
              <div className={styles.theoTop}>
                <span
                  className={styles.theoDot}
                  style={{ backgroundColor: node.color }}
                />
                <span className={styles.theoRole}>{node.role}</span>
              </div>
              <div className={styles.theoName}>{node.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
