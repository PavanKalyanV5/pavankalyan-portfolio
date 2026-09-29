"use client";

import React from "react";
import styles from "./Visuals.module.css";

export function EducationMilestoneVisual() {
  return (
    <div className={styles.visualContainer}>
      <div className={styles.visualHeader}>
        <span className={styles.visualTag}>ACADEMIC_ACHIEVEMENTS // HIGHER EDUCATION</span>
        <span className={styles.visualMetric}>GRADUATION HONORS</span>
      </div>

      <div className={styles.eduTimelineGrid}>
        {/* B.Tech Milestone */}
        <div className={styles.eduMilestoneCard}>
          <div className={styles.eduCardTop}>
            <span className={styles.eduGradeBadge}>CGPA 9.19 / 10</span>
            <span className={styles.eduYearBadge}>2020 – 2024</span>
          </div>
          <h4 className={styles.eduDegree}>Bachelor of Technology — Computer Science</h4>
          <p className={styles.eduCollege}>Gayatri Vidya Parishad College of Engineering (Autonomous)</p>
          <div className={styles.eduHonorList}>
            <span className={styles.eduHonorTag}>✦ GDSC Machine Learning Lead</span>
            <span className={styles.eduHonorTag}>✦ Capstone: T5 News Summarizer</span>
          </div>
        </div>

        {/* Intermediate Milestone */}
        <div className={styles.eduMilestoneCard}>
          <div className={styles.eduCardTop}>
            <span className={styles.eduGradeBadge}>CGPA 9.94 / 10</span>
            <span className={styles.eduYearBadge}>2018 – 2020</span>
          </div>
          <h4 className={styles.eduDegree}>Intermediate (MPC — Maths, Physics, Chemistry)</h4>
          <p className={styles.eduCollege}>Sri Chaitanya Jr College</p>
          <div className={styles.eduHonorList}>
            <span className={styles.eduHonorTag}>✦ Top 0.5% State Academic Percentile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
