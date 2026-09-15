"use client";

import React from "react";
import styles from "./StatusPill.module.css";

interface StatusPillProps {
  label: string;
  tone?: "live" | "idle";
}

export function StatusPill({ label, tone = "live" }: StatusPillProps) {
  return (
    <div className={`${styles.container} ${styles[tone]}`}>
      <span className={styles.dot} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
