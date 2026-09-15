"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GlassPanel } from "../ui/GlassPanel";
import { ContactPanel } from "./ContactPanel";
import styles from "./ContactLauncher.module.css";

export function ContactLauncher(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const launcherButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Focus management and keyboard listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("pointerdown", handlePointerDown);

      // Move focus to popover on open
      const timer = setTimeout(() => {
        popoverRef.current?.focus();
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("pointerdown", handlePointerDown);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Return focus to launcher button
    launcherButtonRef.current?.focus();
  };

  // Animation variants
  const popoverVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 12, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
      };

  const popoverTransition = {
    duration: 0.28,
    ease: [0.16, 1, 0.3, 1],
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <>
      {/* Launcher pill */}
      <button
        ref={launcherButtonRef}
        className={styles.launcher}
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label="Open contact form"
        data-cursor="link"
      >
        <span className={styles.dot} />
        <span className={styles.text}>Message me</span>
      </button>

      {/* Popover */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            ref={popoverRef}
            className={styles.popoverContainer}
            variants={popoverVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={popoverTransition}
            style={{ transformOrigin: "bottom right" }}
            role="dialog"
            aria-modal="false"
            aria-label="Contact"
            tabIndex={-1}
          >
            <GlassPanel>
              <div className={styles.popover}>
                {/* Header */}
                <div className={styles.header}>
                  <div className={styles.headerContent}>
                    <span className={styles.headerDot} />
                    <div className={styles.headerText}>
                      <h3 className={styles.title}>Message Pavan</h3>
                      <p className={styles.subtitle}>
                        Usually replies by email
                      </p>
                    </div>
                  </div>
                  <button
                    className={styles.closeButton}
                    onClick={handleClose}
                    aria-label="Close contact form"
                    data-cursor="link"
                  >
                    ×
                  </button>
                </div>

                {/* Form content */}
                <ContactPanel />
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
