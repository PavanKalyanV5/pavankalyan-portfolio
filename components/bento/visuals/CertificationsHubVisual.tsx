"use client";

import React, { useState } from "react";
import styles from "./Visuals.module.css";

const CERT_CLUSTERS = [
  {
    id: "cloud",
    name: "Cloud & Distributed",
    count: 6,
    issuers: ["AWS", "Google Cloud", "Microsoft", "Udemy"],
    highlight: "Microsoft Orleans .NET & Google Cloud Engineer",
    color: "#5EE7D6",
  },
  {
    id: "security",
    name: "Zero Trust & Security",
    count: 5,
    issuers: ["Zscaler", "Cisco"],
    highlight: "Zero Trust Certified Associate (ZTCA) & CCNA",
    color: "#8A6BFF",
  },
  {
    id: "ml",
    name: "Machine Learning & AI",
    count: 7,
    issuers: ["Coursera", "AWS", "Stanford Online"],
    highlight: "Advanced Learning Algorithms & ML Foundations",
    color: "#FFB35C",
  },
  {
    id: "systems",
    name: "Algorithms & Full-Stack",
    count: 6,
    issuers: ["Wipro", "HackerRank", "NPTEL", "Unstop"],
    highlight: "TalentNext Java Full-Stack & DSA Algorithms",
    color: "#10B981",
  },
];

export function CertificationsHubVisual() {
  const [activeCluster, setActiveCluster] = useState(0);
  const current = CERT_CLUSTERS[activeCluster];

  return (
    <div className={styles.visualContainer}>
      <div className={styles.visualHeader}>
        <span className={styles.visualTag}>ACCREDITED_CREDENTIALS // 24 VERIFIED</span>
        <span className={styles.visualMetric}>15 INDUSTRY ISSUERS</span>
      </div>

      <div className={styles.certClustersGrid}>
        {CERT_CLUSTERS.map((c, idx) => {
          const isSelected = activeCluster === idx;
          return (
            <button
              key={c.id}
              className={`${styles.certClusterCard} ${isSelected ? styles.certClusterActive : ""}`}
              onClick={() => setActiveCluster(idx)}
              style={{
                borderColor: isSelected ? c.color : "rgba(255, 255, 255, 0.08)",
              }}
              data-cursor="link"
            >
              <div className={styles.clusterTop}>
                <span className={styles.clusterDot} style={{ backgroundColor: c.color }} />
                <span className={styles.clusterCount}>{c.count} Certs</span>
              </div>
              <div className={styles.clusterName}>{c.name}</div>
              <div className={styles.clusterIssuers}>{c.issuers.join(" · ")}</div>
            </button>
          );
        })}
      </div>

      <div className={styles.activeClusterFoot}>
        <span className={styles.clusterHighlightLbl}>PRIMARY ACCREDITATION:</span>
        <span className={styles.clusterHighlightVal} style={{ color: current.color }}>
          {current.highlight}
        </span>
      </div>
    </div>
  );
}
