"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectEntry } from "@/content/types";
import { LiquidGlassCard } from "@/components/kokonutui/LiquidGlassCard";
import { ParticleButton } from "@/components/kokonutui/ParticleButton";
import { ShimmerText } from "@/components/kokonutui/ShimmerText";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MonoTag } from "@/components/ui/MonoTag";
import styles from "./CaseStudyModal.module.css";

interface CaseStudyModalProps {
  project: ProjectEntry | null;
  onClose: () => void;
}

export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (project) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [project, onClose]);

  if (!project || !project.caseStudy) return null;
  const cs = project.caseStudy;

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div
          className={styles.dialog}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
        >
          <LiquidGlassCard glow="cool" highlightBorder className={styles.card}>
            {/* Header */}
            <div className={styles.header}>
              <div>
                <span className={styles.badge}>ARCHITECTURE CASE STUDY</span>
                <h2 className={styles.title}>
                  <ShimmerText tone="cool">{project.name}</ShimmerText>
                </h2>
                <div className={styles.dateLabel}>{project.dateLabel}</div>
              </div>
              <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close Case Study"
                data-cursor="link"
              >
                ×
              </button>
            </div>

            {/* Metrics Bar */}
            {cs.metrics && cs.metrics.length > 0 && (
              <div className={styles.metricsBar}>
                {cs.metrics.map((m, idx) => (
                  <div key={idx} className={styles.metricItem}>
                    <span className={styles.metricVal}>{m.value}</span>
                    <span className={styles.metricLbl}>{m.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.body}>
              {/* Problem */}
              <div className={styles.section}>
                <h3 className={styles.sectionHeading}>01 // Problem & Context</h3>
                <p className={styles.sectionText}>{cs.problem}</p>
              </div>

              {/* Architecture */}
              <div className={styles.section}>
                <h3 className={styles.sectionHeading}>02 // System Architecture & Topology</h3>
                <p className={styles.sectionText}>{cs.architecture}</p>

                {/* SVG Architecture Topology Diagram */}
                <div className={styles.diagramWrap}>
                  <svg viewBox="0 0 500 120" className={styles.diagramSvg} fill="none">
                    <rect x="10" y="40" width="100" height="40" rx="8" fill="rgba(94, 231, 214, 0.1)" stroke="#5EE7D6" strokeWidth="1.5" />
                    <text x="60" y="65" textAnchor="middle" fill="#E8ECF5" fontSize="10" fontFamily="var(--font-code)">Client / API</text>

                    <path d="M 110 60 L 150 60" stroke="#5EE7D6" strokeWidth="1.5" strokeDasharray="4 4" />

                    <rect x="150" y="40" width="100" height="40" rx="8" fill="rgba(138, 107, 255, 0.1)" stroke="#8A6BFF" strokeWidth="1.5" />
                    <text x="200" y="65" textAnchor="middle" fill="#E8ECF5" fontSize="10" fontFamily="var(--font-code)">Event Bus / Core</text>

                    <path d="M 250 60 L 290 60" stroke="#8A6BFF" strokeWidth="1.5" strokeDasharray="4 4" />

                    <rect x="290" y="40" width="100" height="40" rx="8" fill="rgba(255, 179, 92, 0.1)" stroke="#FFB35C" strokeWidth="1.5" />
                    <text x="340" y="65" textAnchor="middle" fill="#E8ECF5" fontSize="10" fontFamily="var(--font-code)">Microservice Worker</text>

                    <path d="M 390 60 L 430 60" stroke="#FFB35C" strokeWidth="1.5" strokeDasharray="4 4" />

                    <rect x="430" y="40" width="60" height="40" rx="8" fill="rgba(16, 185, 129, 0.1)" stroke="#10B981" strokeWidth="1.5" />
                    <text x="460" y="65" textAnchor="middle" fill="#E8ECF5" fontSize="10" fontFamily="var(--font-code)">Store</text>
                  </svg>
                </div>
              </div>

              {/* Key Decisions */}
              <div className={styles.section}>
                <h3 className={styles.sectionHeading}>03 // Technical Decisions & Trade-offs</h3>
                <ul className={styles.decisionList}>
                  {cs.keyDecisions.map((dec, idx) => (
                    <li key={idx} className={styles.decisionItem}>
                      {dec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Results */}
              <div className={styles.section}>
                <h3 className={styles.sectionHeading}>04 // Verified Results</h3>
                <ul className={styles.resultsList}>
                  {cs.results.map((res, idx) => (
                    <li key={idx} className={styles.resultItem}>
                      {res}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Pills */}
              <div className={styles.section}>
                <h3 className={styles.sectionHeading}>05 // Technology Stack</h3>
                <div className={styles.techPills}>
                  {project.techStack.map((tech, idx) => (
                    <MonoTag key={idx}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <BrandIcon name={tech} size={13} />
                        {tech}
                      </span>
                    </MonoTag>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              {project.links && project.links.length > 0 ? (
                project.links.map((link, idx) => (
                  <ParticleButton
                    key={idx}
                    href={link.url}
                    external
                    variant="primary"
                    size="sm"
                  >
                    {link.label} ↗
                  </ParticleButton>
                ))
              ) : (
                <div className={styles.privateRepoNote}>
                  ✦ Enterprise Production Repository (Closed Source / Client NDA)
                </div>
              )}
            </div>
          </LiquidGlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
