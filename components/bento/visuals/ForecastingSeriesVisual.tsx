"use client";

import React, { useState } from "react";
import styles from "./Visuals.module.css";

export function ForecastingSeriesVisual() {
  const [view, setView] = useState<"forecast" | "trend" | "seasonality">("forecast");

  return (
    <div className={styles.visualContainer}>
      <div className={styles.visualHeader}>
        <span className={styles.visualTag}>LIGHTGBM + SSA FORECASTING</span>
        <div className={styles.tabToggles}>
          <button
            className={`${styles.miniTab} ${view === "forecast" ? styles.miniTabActive : ""}`}
            onClick={() => setView("forecast")}
          >
            Composite
          </button>
          <button
            className={`${styles.miniTab} ${view === "trend" ? styles.miniTabActive : ""}`}
            onClick={() => setView("trend")}
          >
            Trend
          </button>
          <button
            className={`${styles.miniTab} ${view === "seasonality" ? styles.miniTabActive : ""}`}
            onClick={() => setView("seasonality")}
          >
            Seasonality
          </button>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <svg viewBox="0 0 400 100" className={styles.chartSvg} preserveAspectRatio="none">
          <defs>
            <linearGradient id="forecastingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5EE7D6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#5EE7D6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="25" x2="400" y2="25" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

          {/* Forecast Composite Curve */}
          {view === "forecast" && (
            <>
              <path
                d="M 10 75 Q 70 85, 120 45 T 220 55 T 320 25 T 390 15 L 390 95 L 10 95 Z"
                fill="url(#forecastingGrad)"
              />
              <path
                d="M 10 75 Q 70 85, 120 45 T 220 55 T 320 25 T 390 15"
                fill="none"
                stroke="#5EE7D6"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Trend Curve */}
          {view === "trend" && (
            <path
              d="M 10 75 Q 180 65, 260 40 T 390 18"
              fill="none"
              stroke="#8A6BFF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}

          {/* Seasonality Sine Wave */}
          {view === "seasonality" && (
            <path
              d="M 10 50 Q 40 15, 70 50 T 130 50 T 190 50 T 250 50 T 310 50 T 370 50"
              fill="none"
              stroke="#FFB35C"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>

        <div className={styles.chartFoot}>
          <span>HISTORICAL SAMPLES</span>
          <span style={{ color: "#FFB35C" }}>82% AUTOMATION</span>
        </div>
      </div>
    </div>
  );
}
