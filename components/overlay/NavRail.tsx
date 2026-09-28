"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LAYER_ORDER, type LayerId } from "@/lib/mesh/types";
import { LAYER_GRAPHS } from "@/lib/mesh/layers";
import styles from "./NavRail.module.css";

export interface NavRailProps {
  active: LayerId;
  onSelect: (id: LayerId) => void;
}

export function NavRail(props: NavRailProps) {
  const prefersReduced = useReducedMotion();

  return (
    <nav aria-label="3D Layers" className={styles.navRail}>
      <ul className={styles.list}>
        {LAYER_ORDER.map((layerId) => {
          const graph = LAYER_GRAPHS[layerId];
          const isActive = props.active === layerId;

          return (
            <motion.li
              key={layerId}
              whileHover={prefersReduced ? undefined : { x: -4, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <button
                className={`${styles.button} ${isActive ? styles.buttonActive : ""}`}
                data-cursor="link"
                aria-current={isActive ? "page" : undefined}
                aria-label={graph.label}
                onClick={() => props.onSelect(layerId)}
              >
                <span className={styles.label}>{graph.label}</span>
                <span
                  className={`${styles.dot} ${
                    isActive ? styles.dotActive : ""
                  }`}
                />
              </button>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}
