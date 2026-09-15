"use client";

import {
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import type { MeshNode } from "@/lib/mesh/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoTag } from "@/components/ui/MonoTag";
import { ActionButton } from "@/components/ui/ActionButton";
import styles from "./DetailPanel.module.css";

export interface DetailPanelProps {
  /** The selected node, or null when nothing is selected. */
  node: MeshNode | null;
  onClose: () => void;
}

export function DetailPanel({ node, onClose }: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Focus management and keyboard listener
  useEffect(() => {
    if (!node) return;

    // Move focus to panel on open
    const timer = setTimeout(() => {
      panelRef.current?.focus();
    }, 0);

    // Handle Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [node, onClose]);

  // Animation variants
  const desktopVariants = {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  };

  // For reduced motion, animate opacity only
  const reducedMotionVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : desktopVariants;

  const transition = {
    duration: prefersReducedMotion ? 0.15 : 0.42,
    ease: [0.16, 1, 0.3, 1],
  } as any;

  return (
    <AnimatePresence mode="wait">
      {node && (
        <motion.div
          key={node.id}
          ref={panelRef}
          className={styles.panelContainer}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          role="dialog"
          aria-modal="false"
          aria-label={node.title}
          tabIndex={-1}
        >
          <GlassPanel className={styles.panel}>
            {/* Header row with close button */}
            <div className={styles.header}>
              <div className={styles.identifier}>
                <span className={styles.nodeId}>{node.id}</span>
                <span className={styles.nodeSeparator}>·</span>
                <span className={styles.nodeKind}>{node.kind}</span>
              </div>
              <button
                aria-label="Close details"
                onClick={onClose}
                className={styles.closeButton}
                data-cursor="link"
              >
                ×
              </button>
            </div>

            {/* Title */}
            {node.title && (
              <h2 className={styles.title}>{node.title}</h2>
            )}

            {/* Subtitle */}
            {node.subtitle && (
              <div className={styles.subtitle}>{node.subtitle}</div>
            )}

            {/* Meta */}
            {node.meta && (
              <div className={styles.meta}>{node.meta}</div>
            )}

            {/* Hairline divider */}
            <div className={styles.divider} />

            {/* Note (inset callout) */}
            {node.detail.note && (
              <div className={styles.note}>
                {node.detail.note}
              </div>
            )}

            {/* Body paragraph */}
            {node.detail.body && (
              <p className={styles.body}>
                {node.detail.body}
              </p>
            )}

            {/* Bullets list */}
            {node.detail.bullets && node.detail.bullets.length > 0 && (
              <ul className={styles.bulletsList}>
                {node.detail.bullets.map((bullet, index) => (
                  <li key={index} className={styles.bulletItem}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {/* Tags */}
            {node.detail.tags && node.detail.tags.length > 0 && (
              <div className={styles.tagsContainer}>
                {node.detail.tags.map((tag, index) => (
                  <MonoTag key={index}>{tag}</MonoTag>
                ))}
              </div>
            )}

            {/* Links */}
            {node.detail.links && node.detail.links.length > 0 && (
              <div className={styles.linksContainer}>
                {node.detail.links.map((link, index) => (
                  <ActionButton
                    key={index}
                    href={link.url}
                    variant="ghost"
                    external
                  >
                    {link.label}
                  </ActionButton>
                ))}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
