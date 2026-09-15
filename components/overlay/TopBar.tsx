"use client";

import React from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatusPill } from "@/components/ui/StatusPill";
import styles from "./TopBar.module.css";

export function TopBar() {
  return (
    <GlassPanel
      as="header"
      className={styles.topBar}
    >
      <div className={styles.leftCluster}>
        <div className={styles.monogram}>PKV</div>
        <div className={styles.divider} />
        <div className={styles.fullName}>Pavan Kalyan Vetla</div>
      </div>

      <div className={styles.rightCluster}>
        <StatusPill label="open to work" tone="live" />
      </div>
    </GlassPanel>
  );
}
