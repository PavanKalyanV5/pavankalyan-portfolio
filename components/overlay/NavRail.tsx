"use client";

import React from "react";
import { LAYER_ORDER, type LayerId } from "@/lib/mesh/types";
import { LAYER_GRAPHS } from "@/lib/mesh/layers";
import styles from "./NavRail.module.css";

export interface NavRailProps {
  active: LayerId;
  onSelect: (id: LayerId) => void;
}

export function NavRail(props: NavRailProps) {
  return (
    <nav aria-label="Layers" className={styles.navRail}>
      <ul className={styles.list}>
        {LAYER_ORDER.map((layerId) => {
          const graph = LAYER_GRAPHS[layerId];
          const isActive = props.active === layerId;

          return (
            <li key={layerId}>
              <button
                className={styles.button}
                data-cursor="link"
                aria-current={isActive ? "page" : undefined}
                aria-label={graph.label}
                onClick={() => props.onSelect(layerId)}
              >
                <span className={styles.label}>
                  {graph.label}
                </span>
                <span className={`${styles.dot} ${isActive ? styles.dotActive : ""}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
