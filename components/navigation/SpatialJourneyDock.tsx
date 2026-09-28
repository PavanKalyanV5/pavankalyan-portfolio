"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { MeshNode, LayerId } from "@/lib/mesh/types";
import { LAYER_ORDER } from "@/lib/mesh/types";
import { LAYER_GRAPHS } from "@/lib/mesh/layers";
import {
  playClickSound,
  playLayerWarpSound,
  playFlightWhooshSound,
} from "@/lib/audio/soundFx";
import styles from "./SpatialJourneyDock.module.css";

export interface SpatialJourneyDockProps {
  currentLayer: LayerId;
  onSelectLayer: (layer: LayerId) => void;
  nodes: MeshNode[];
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  onSwitchToBento: () => void;
}

export function SpatialJourneyDock({
  currentLayer,
  onSelectLayer,
  nodes,
  selectedId,
  onSelectNode,
  onSwitchToBento,
}: SpatialJourneyDockProps) {
  const [autoTour, setAutoTour] = useState(false);
  const [sectorMenuOpen, setSectorMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Filter selectable nodes (exclude overview hub redirect nodes)
  const selectableNodes = nodes.filter((n) => !n.id.startsWith("hub-"));
  const currentIndex = selectableNodes.findIndex((n) => n.id === selectedId);
  const currentLayerIdx = LAYER_ORDER.indexOf(currentLayer);

  // Close sector menu on outside click
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSectorMenuOpen(false);
      }
    };
    if (sectorMenuOpen) {
      window.addEventListener("pointerdown", handlePointerDown);
      return () => window.removeEventListener("pointerdown", handlePointerDown);
    }
  }, [sectorMenuOpen]);

  // Auto-tour timer: smoothly flies to the next node every 5 seconds
  useEffect(() => {
    if (!autoTour || selectableNodes.length === 0) return;

    const timer = setInterval(() => {
      const nextIdx = (currentIndex + 1) % selectableNodes.length;
      playFlightWhooshSound();
      onSelectNode(selectableNodes[nextIdx].id);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoTour, currentIndex, selectableNodes, onSelectNode]);

  const handleNextNode = () => {
    if (selectableNodes.length === 0) return;
    const nextIdx =
      currentIndex === -1 ? 0 : (currentIndex + 1) % selectableNodes.length;
    playFlightWhooshSound();
    onSelectNode(selectableNodes[nextIdx].id);
  };

  const handlePrevNode = () => {
    if (selectableNodes.length === 0) return;
    const prevIdx =
      currentIndex === -1
        ? selectableNodes.length - 1
        : (currentIndex - 1 + selectableNodes.length) % selectableNodes.length;
    playFlightWhooshSound();
    onSelectNode(selectableNodes[prevIdx].id);
  };

  const handleNextSector = () => {
    playLayerWarpSound();
    setAutoTour(false);
    const next = (currentLayerIdx + 1) % LAYER_ORDER.length;
    onSelectLayer(LAYER_ORDER[next]);
  };

  const handlePrevSector = () => {
    playLayerWarpSound();
    setAutoTour(false);
    const prev = (currentLayerIdx - 1 + LAYER_ORDER.length) % LAYER_ORDER.length;
    onSelectLayer(LAYER_ORDER[prev]);
  };

  const handleSectorSelect = (layer: LayerId) => {
    playLayerWarpSound();
    setAutoTour(false);
    setSectorMenuOpen(false);
    onSelectLayer(layer);
  };

  const handleRecenter = () => {
    playClickSound();
    setAutoTour(false);
    onSelectNode(null);
  };

  const handleToggleAutoTour = () => {
    playClickSound();
    if (!autoTour && currentIndex === -1 && selectableNodes.length > 0) {
      onSelectNode(selectableNodes[0].id);
    }
    setAutoTour((prev) => !prev);
  };

  const activeNode =
    currentIndex !== -1 ? selectableNodes[currentIndex] : null;

  const currentSectorLabel = LAYER_GRAPHS[currentLayer].label;
  const sectorNumber = (currentLayerIdx + 1).toString().padStart(2, "0");

  return (
    <motion.aside
      className={styles.dockContainer}
      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Spatial Journey Navigation"
    >
      <div className={styles.dock}>
        {/* Sector Traversal Group */}
        <div className={styles.group} ref={menuRef}>
          <button
            className={styles.stepBtn}
            onClick={handlePrevSector}
            title="Previous Sector"
            aria-label="Previous Sector"
            data-cursor="link"
          >
            ‹
          </button>

          <button
            className={styles.sectorMenuTrigger}
            onClick={() => setSectorMenuOpen((prev) => !prev)}
            title="Click to view all sectors"
            aria-expanded={sectorMenuOpen}
            data-cursor="link"
          >
            <span className={styles.sectorNum}>{sectorNumber}</span>
            <span className={styles.sectorLabel}>{currentSectorLabel}</span>
            <span className={styles.arrowIcon}>▾</span>
          </button>

          <button
            className={styles.stepBtn}
            onClick={handleNextSector}
            title="Next Sector"
            aria-label="Next Sector"
            data-cursor="link"
          >
            ›
          </button>

          {/* Sector Selection Popover */}
          <AnimatePresence>
            {sectorMenuOpen && (
              <motion.div
                className={styles.sectorDropdown}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.dropdownHeader}>SPATIAL SECTORS</div>
                {LAYER_ORDER.map((layerId, idx) => {
                  const graph = LAYER_GRAPHS[layerId];
                  const isCurrent = layerId === currentLayer;
                  return (
                    <button
                      key={layerId}
                      className={`${styles.dropdownItem} ${isCurrent ? styles.activeDropdownItem : ""}`}
                      onClick={() => handleSectorSelect(layerId)}
                      data-cursor="link"
                    >
                      <span className={styles.dropdownNum}>
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <span className={styles.dropdownText}>{graph.label}</span>
                      <span className={styles.dropdownCount}>
                        {graph.nodes.length}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.divider} />

        {/* 3D Node Hopper Group */}
        <div className={styles.group}>
          <button
            className={styles.stepBtn}
            onClick={handlePrevNode}
            title="Hop to Previous Node (Left Arrow)"
            disabled={selectableNodes.length === 0}
            data-cursor="link"
          >
            ‹
          </button>

          <div className={styles.nodeDisplay}>
            {activeNode ? (
              <div className={styles.activeNodeInfo}>
                <span className={styles.nodeCounter}>
                  NODE {currentIndex + 1}/{selectableNodes.length}
                </span>
                <span className={styles.nodeTitle}>
                  {activeNode.title || activeNode.label}
                </span>
              </div>
            ) : (
              <div className={styles.idleNodeInfo}>
                <span className={styles.idleTag}>EXPLORE GRAPH</span>
                <span className={styles.idleHint}>
                  {selectableNodes.length} Nodes · Click or Hop
                </span>
              </div>
            )}
          </div>

          <button
            className={styles.stepBtn}
            onClick={handleNextNode}
            title="Hop to Next Node (Right Arrow)"
            disabled={selectableNodes.length === 0}
            data-cursor="link"
          >
            ›
          </button>
        </div>

        <div className={styles.divider} />

        {/* Tour & View Controls */}
        <div className={styles.group}>
          <button
            className={`${styles.tourButton} ${autoTour ? styles.tourRunning : ""}`}
            onClick={handleToggleAutoTour}
            title={autoTour ? "Pause Guided Tour" : "Start Guided Camera Tour"}
            data-cursor="link"
          >
            <span className={styles.tourIcon}>{autoTour ? "⏸" : "✦"}</span>
            <span className={styles.tourText}>
              {autoTour ? "PAUSE" : "AUTO TOUR"}
            </span>
          </button>

          {activeNode && (
            <button
              className={styles.recenterBtn}
              onClick={handleRecenter}
              title="Recenter Camera Home (Esc)"
              data-cursor="link"
            >
              ⌂
            </button>
          )}

          <button
            className={styles.bentoBtn}
            onClick={onSwitchToBento}
            title="Switch to 3D Bento Matrix View"
            data-cursor="link"
          >
            ⊞
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
