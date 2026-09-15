"use client";

import {
  useEffect,
  useRef,
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
import { NodeKindIcon, TechIcon } from "@/components/overlay/NodeIcons";
import styles from "./DetailPanel.module.css";
import nodeIconStyles from "./NodeIcons.module.css";

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
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  const contentVariants = prefersReducedMotion
    ? { animate: { transition: { staggerChildren: 0 } } }
    : {
        animate: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.08,
          },
        },
      };

  const itemVariants = prefersReducedMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
      };

  const itemTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

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
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
          >
            <GlassPanel className={styles.panel}>
            {/* Header row with close button */}
            <motion.div
              className={styles.header}
              variants={itemVariants}
              transition={itemTransition}
            >
              <div className={styles.identifier}>
                <NodeKindIcon kind={node.kind} size={14} />
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
            </motion.div>

            {/* Title */}
            {node.title && (
              <motion.div
                variants={itemVariants}
                transition={itemTransition}
              >
                <h2 className={styles.title}>{node.title}</h2>
              </motion.div>
            )}

            {/* Subtitle */}
            {node.subtitle && (
              <motion.div
                className={styles.subtitle}
                variants={itemVariants}
                transition={itemTransition}
              >
                {node.subtitle}
              </motion.div>
            )}

            {/* Meta */}
            {node.meta && (
              <motion.div
                className={styles.meta}
                variants={itemVariants}
                transition={itemTransition}
              >
                {node.meta}
              </motion.div>
            )}

            {/* Hairline divider */}
            <motion.div
              className={styles.divider}
              variants={itemVariants}
              transition={itemTransition}
            />

            {/* Note (inset callout) */}
            {node.detail.note && (
              <motion.div
                className={styles.note}
                variants={itemVariants}
                transition={itemTransition}
              >
                {node.detail.note}
              </motion.div>
            )}

            {/* Body paragraph */}
            {node.detail.body && (
              <motion.div
                variants={itemVariants}
                transition={itemTransition}
              >
                <p className={styles.body}>
                  {node.detail.body}
                </p>
              </motion.div>
            )}

            {/* Bullets list */}
            {node.detail.bullets && node.detail.bullets.length > 0 && (
              <motion.div
                variants={itemVariants}
                transition={itemTransition}
              >
                <ul className={styles.bulletsList}>
                  {node.detail.bullets.map((bullet, index) => (
                    <li key={index} className={styles.bulletItem}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Tags */}
            {node.detail.tags && node.detail.tags.length > 0 && (
              <motion.div
                className={styles.tagsContainer}
                variants={itemVariants}
                transition={itemTransition}
              >
                {node.detail.tags.map((tag, index) => (
                  <MonoTag key={index}>
                    <span className={nodeIconStyles.tagIconWrapper}>
                      <TechIcon name={tag} size={11} />
                      {tag}
                    </span>
                  </MonoTag>
                ))}
              </motion.div>
            )}

            {/* Links */}
            {node.detail.links && node.detail.links.length > 0 && (
              <motion.div
                className={styles.linksContainer}
                variants={itemVariants}
                transition={itemTransition}
              >
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
              </motion.div>
            )}
          </GlassPanel>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
