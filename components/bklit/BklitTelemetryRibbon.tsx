"use client";

import React, { useEffect, useState } from "react";
import styles from "./BklitTelemetryRibbon.module.css";

interface MetricItem {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  status: "live" | "optimal" | "active";
}

export function BklitTelemetryRibbon() {
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(
        `${now.getUTCHours().toString().padStart(2, "0")}:${now
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}:${now.getUTCSeconds().toString().padStart(2, "0")} UTC`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const metrics: MetricItem[] = [
    {
      id: "uptime",
      label: "PROD_UPTIME",
      value: "99.99%",
      sublabel: "Azure Monitor Verified",
      status: "live",
    },
    {
      id: "automation",
      label: "OPS_AUTOMATION",
      value: "82%",
      sublabel: "FastAPI MCP & SSA ML",
      status: "optimal",
    },
    {
      id: "latency",
      label: "RAG_INFERENCE",
      value: "42ms",
      sublabel: "Semantic Kernel .NET 8",
      status: "live",
    },
    {
      id: "velocity",
      label: "SPRINT_VELOCITY",
      value: ">95%",
      sublabel: "Agile SDLC Delivery",
      status: "optimal",
    },
    {
      id: "orleans",
      label: "VIRTUAL_ACTORS",
      value: "2,450+",
      sublabel: "Distributed Orleans Grains",
      status: "active",
    },
  ];

  return (
    <div className={styles.ribbon} suppressHydrationWarning>
      <div className={styles.leftCluster}>
        <span className={styles.statusDot} />
        <span className={styles.systemTag}>BKLIT://TELEMETRY_ENGINE</span>
        <span className={styles.timestamp} suppressHydrationWarning>{timestamp || "LIVE_TELEMETRY"}</span>
      </div>

      <div className={styles.metricsRow}>
        {metrics.map((m) => (
          <div key={m.id} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={`${styles.miniPill} ${styles[m.status]}`} />
            </div>
            <div className={styles.metricValue}>{m.value}</div>
            <div className={styles.metricSub}>{m.sublabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
