"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { skillCategories } from "@/content/skills";
import { LAYER_GRAPHS } from "@/lib/mesh/layers";
import { LAYER_ORDER, type LayerId } from "@/lib/mesh/types";
import {
  synthesizeNeuralAnswer,
  PRESET_PROMPTS,
} from "@/lib/ai/neuralSearch";
import { playAiChirpSound, playClickSound } from "@/lib/audio/soundFx";
import styles from "./CommandPalette.module.css";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateLayer: (layer: LayerId) => void;
  onSelectNode?: (nodeId: string) => void;
  onToggleViewMode?: () => void;
  viewMode?: "spatial" | "bento";
}

interface CommandItem {
  id: string;
  category: "Navigation" | "Projects" | "Experience" | "Skills" | "Actions";
  title: string;
  subtitle?: string;
  action: () => void;
  badge?: string;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigateLayer,
  onSelectNode,
  onToggleViewMode,
  viewMode = "spatial",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const handleClose = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    onClose();
  }, [onClose]);

  // Compute real-time neural synthesis answer
  const aiAnswer = useMemo(() => {
    return synthesizeNeuralAnswer(query);
  }, [query]);

  // Play subtle neural sound when AI answer is discovered
  useEffect(() => {
    if (aiAnswer) {
      playAiChirpSound();
    }
  }, [aiAnswer]);

  // Build searchable items catalogue
  const allItems: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [];

    // Quick Actions
    if (onToggleViewMode) {
      items.push({
        id: "action-toggle-view",
        category: "Actions",
        title: viewMode === "spatial" ? "Switch to 3D Bento Matrix" : "Switch to 3D Spatial Universe",
        subtitle: "Toggle between 3D WebGL Canvas and 3D Interactive Bento Showcase",
        action: () => {
          onToggleViewMode();
          handleClose();
        },
        badge: "VIEW_MODE",
      });
    }

    items.push({
      id: "action-resume",
      category: "Actions",
      title: "Download Resume",
      subtitle: "Open Pavan Kalyan Vetla's official resume PDF",
      action: () => {
        window.open("/resume.pdf", "_blank");
        handleClose();
      },
      badge: "PDF",
    });

    items.push({
      id: "action-email",
      category: "Actions",
      title: "Send Email to Pavan",
      subtitle: "vetlapavankalyan5@gmail.com",
      action: () => {
        window.open("mailto:vetlapavankalyan5@gmail.com", "_self");
        handleClose();
      },
      badge: "MAIL",
    });

    // Navigation Layers
    LAYER_ORDER.forEach((layerId) => {
      const graph = LAYER_GRAPHS[layerId];
      items.push({
        id: `nav-${layerId}`,
        category: "Navigation",
        title: `Jump to ${graph.label}`,
        subtitle: graph.caption,
        action: () => {
          onNavigateLayer(layerId);
          handleClose();
        },
        badge: "3D_LAYER",
      });
    });

    // Projects
    projects.forEach((proj) => {
      items.push({
        id: `proj-${proj.id}`,
        category: "Projects",
        title: proj.name,
        subtitle: `${proj.techStack.join(" · ")} — ${proj.description.slice(0, 75)}...`,
        action: () => {
          onNavigateLayer("projects");
          if (onSelectNode) onSelectNode(`proj-${proj.id}`);
          handleClose();
        },
        badge: proj.tier === "featured" ? "FEATURED" : "PROJECT",
      });
    });

    // Experience
    experience.forEach((exp) => {
      items.push({
        id: `exp-${exp.id}`,
        category: "Experience",
        title: `${exp.role} @ ${exp.organization.split("—")[0].trim()}`,
        subtitle: `${exp.dateLabel} · ${exp.location}`,
        action: () => {
          onNavigateLayer("experience");
          if (onSelectNode) onSelectNode(`exp-${exp.id}`);
          handleClose();
        },
        badge: exp.tier === "primary" ? "CURRENT" : "CAREER",
      });
    });

    // Skills
    skillCategories.forEach((cat) => {
      cat.skills.forEach((skill) => {
        items.push({
          id: `skill-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          category: "Skills",
          title: skill,
          subtitle: `${cat.label} domain capability`,
          action: () => {
            onNavigateLayer("skills");
            handleClose();
          },
          badge: cat.label.toUpperCase(),
        });
      });
    });

    return items;
  }, [handleClose, onNavigateLayer, onSelectNode, onToggleViewMode, viewMode]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 16);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.badge?.toLowerCase().includes(q)
      )
      .slice(0, 24);
  }, [allItems, query]);

  const clampedIndex = activeIndex >= filteredItems.length ? 0 : activeIndex;

  const handleQueryChange = (val: string) => {
    playClickSound();
    setQuery(val);
    setActiveIndex(0);
  };

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[clampedIndex]) {
          filteredItems[clampedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, clampedIndex, handleClose]);

  // Scroll active item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const activeEl = listEl.querySelector(`[data-index="${clampedIndex}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [clampedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <motion.div
            className={styles.dialog}
            onClick={(e) => e.stopPropagation()}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -16 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Search Input Bar */}
            <div className={styles.inputBar}>
              <span className={styles.searchIcon}>✦</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask anything (e.g. 'Tell me about Agentic RAG', 'How does he use Orleans?')..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className={styles.input}
              />
              {query && (
                <button className={styles.clearBtn} onClick={() => handleQueryChange("")}>
                  ×
                </button>
              )}
              <span className={styles.escBadge}>ESC</span>
            </div>

            {/* Neural Preset Chips when query is empty */}
            {!query.trim() && (
              <div className={styles.presetsWrap}>
                <div className={styles.presetsHeader}>✦ AI NEURAL SUGGESTIONS</div>
                <div className={styles.presetsRow}>
                  {PRESET_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      className={styles.presetChip}
                      onClick={() => handleQueryChange(prompt)}
                      data-cursor="link"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Neural Synthesis Result Card */}
            {aiAnswer && (
              <motion.div
                className={styles.aiResultCard}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.aiCardHeader}>
                  <span className={styles.aiDot} />
                  <span className={styles.aiBadge}>AI_NEURAL_SYNTHESIS</span>
                </div>
                <div className={styles.aiHeadline}>{aiAnswer.headline}</div>
                <p className={styles.aiSummary}>{aiAnswer.summary}</p>
                <ul className={styles.aiBullets}>
                  {aiAnswer.keyPoints.map((pt, kIdx) => (
                    <li key={kIdx}>{pt}</li>
                  ))}
                </ul>
                <div className={styles.aiFooter}>
                  <button
                    className={styles.aiActionBtn}
                    onClick={() => {
                      onNavigateLayer(aiAnswer.actionLayer);
                      if (aiAnswer.actionNodeId && onSelectNode) {
                        onSelectNode(aiAnswer.actionNodeId);
                      }
                      handleClose();
                    }}
                    data-cursor="link"
                  >
                    {aiAnswer.actionLabel} ↗
                  </button>
                  <div className={styles.aiTechRow}>
                    {aiAnswer.relatedTech.map((t, idx) => (
                      <span key={idx} className={styles.aiTechTag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results List */}
            <div ref={listRef} className={styles.list}>
              {filteredItems.length === 0 && !aiAnswer ? (
                <div className={styles.empty}>
                  No matching telemetry results found for &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === clampedIndex;
                  return (
                    <div
                      key={item.id}
                      data-index={index}
                      className={`${styles.item} ${isSelected ? styles.selected : ""}`}
                      onClick={item.action}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className={styles.itemContent}>
                        <div className={styles.itemHeader}>
                          <span className={styles.itemTitle}>{item.title}</span>
                          {item.badge && (
                            <span className={styles.itemBadge}>{item.badge}</span>
                          )}
                        </div>
                        {item.subtitle && (
                          <div className={styles.itemSubtitle}>{item.subtitle}</div>
                        )}
                      </div>
                      <span className={styles.selectIndicator}>↵</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Command Palette Footer */}
            <div className={styles.footer}>
              <span>Navigate <kbd>↑</kbd><kbd>↓</kbd></span>
              <span>Select <kbd>↵</kbd></span>
              <span>Close <kbd>ESC</kbd></span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
