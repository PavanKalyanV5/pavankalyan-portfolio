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
import { LiquidGlassCard } from "@/components/kokonutui/LiquidGlassCard";
import { ParticleButton } from "@/components/kokonutui/ParticleButton";
import { ShimmerText } from "@/components/kokonutui/ShimmerText";
import { MonoTag } from "@/components/ui/MonoTag";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { NodeKindIcon } from "@/components/overlay/NodeIcons";
import { getProjectVisual } from "@/lib/assets/icons";
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

  // Animation variants: slides in from right side
  const desktopVariants = {
    initial: { opacity: 0, x: 28, scale: 0.96 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 28, scale: 0.96 },
  };

  const reducedMotionVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : desktopVariants;

  const transition = {
    duration: prefersReducedMotion ? 0.15 : 0.38,
    ease: [0.16, 1, 0.3, 1],
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  const contentVariants = prefersReducedMotion
    ? { animate: { transition: { staggerChildren: 0 } } }
    : {
        animate: {
          transition: {
            staggerChildren: 0.04,
            delayChildren: 0.06,
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
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  const projectVisual = node && node.kind === "project" ? getProjectVisual(node.id.replace("proj-", "")) : null;

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
            <LiquidGlassCard glow="cool" highlightBorder className={styles.panel}>
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

              {/* Project Visual Banner if applicable */}
              {projectVisual && (
                <motion.div
                  className={styles.projectBanner}
                  style={{ background: projectVisual.gradient }}
                  variants={itemVariants}
                  transition={itemTransition}
                >
                  <span className={styles.bannerTag}>{projectVisual.badge}</span>
                  <BrandIcon name={projectVisual.iconSlug} size={28} />
                </motion.div>
              )}

              {/* Portrait Banner for Central Core "me" Node */}
              {node.id === "me" && (
                <motion.div
                  className={styles.portraitBanner}
                  variants={itemVariants}
                  transition={itemTransition}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/profile.jpg"
                    alt="Pavan Kalyan Vetla"
                    width={72}
                    height={72}
                    className={styles.portraitImg}
                  />
                  <div className={styles.portraitMeta}>
                    <span className={styles.portraitRole}>HYDERABAD, INDIA</span>
                    <span className={styles.portraitStatus}>✦ OPEN TO WORK</span>
                  </div>
                </motion.div>
              )}

              {/* Title with Shimmer */}
              {node.title && (
                <motion.div
                  variants={itemVariants}
                  transition={itemTransition}
                >
                  <h2 className={styles.title}>
                    <ShimmerText tone="cool" speed="normal">
                      {node.title}
                    </ShimmerText>
                  </h2>
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
                  <p className={styles.body}>{node.detail.body}</p>
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

              {/* Tags with real SVG Brand Icons */}
              {node.detail.tags && node.detail.tags.length > 0 && (
                <motion.div
                  className={styles.tagsContainer}
                  variants={itemVariants}
                  transition={itemTransition}
                >
                  {node.detail.tags.map((tag, index) => (
                    <MonoTag key={index}>
                      <span className={nodeIconStyles.tagIconWrapper}>
                        <BrandIcon name={tag} size={12} />
                        {tag}
                      </span>
                    </MonoTag>
                  ))}
                </motion.div>
              )}

              {/* Links with ParticleButton */}
              {node.detail.links && node.detail.links.length > 0 && (
                <motion.div
                  className={styles.linksContainer}
                  variants={itemVariants}
                  transition={itemTransition}
                >
                  {node.detail.links.map((link, index) => (
                    <ParticleButton
                      key={index}
                      href={link.url}
                      variant="cool"
                      size="sm"
                      external
                    >
                      {link.label} ↗
                    </ParticleButton>
                  ))}
                </motion.div>
              )}
            </LiquidGlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
