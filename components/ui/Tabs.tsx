"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Tabs({
  tabs,
  activeId,
  onChange,
  className = "",
  size = "md",
}: TabsProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className={`${styles.tabsList} ${styles[size]} ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`${styles.tabTrigger} ${isActive ? styles.active : ""}`}
            onClick={() => onChange(tab.id)}
            data-cursor="link"
          >
            {isActive && !prefersReduced && (
              <motion.div
                layoutId="activeTabIndicator"
                className={styles.activeIndicator}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className={styles.tabContent}>
              {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
              <span className={styles.label}>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className={styles.count}>{tab.count}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
