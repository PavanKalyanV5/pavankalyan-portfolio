"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ActionButton } from "@/components/ui/ActionButton";
import { RevealText } from "@/components/ui/RevealText";
import type { LayerGraph } from "@/lib/mesh/types";
import styles from "./LayerIntro.module.css";

interface LayerIntroProps {
  graph: LayerGraph;
  /** Hidden while a node is selected so it never competes with the detail panel. */
  dimmed: boolean;
}

const GITHUB_URL = "https://github.com/PavanKalyanV5";

export function LayerIntro({ graph, dimmed }: LayerIntroProps) {
  const reduced = useReducedMotion();
  const isOverview = graph.id === "overview";

  return (
    <motion.div
      className={styles.root}
      animate={{ opacity: dimmed ? 0 : 1, y: dimmed ? 12 : 0 }}
      transition={{ duration: reduced ? 0.12 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: dimmed ? "none" : "auto" }}
    >
      {isOverview ? (
        <>
          <RevealText
            text="Pavan Kalyan Vetla"
            as="h1"
            className={styles.heroName}
          />
          <p className={styles.heroTagline}>
            Software Engineer building AI-powered backend systems — agentic RAG
            pipelines, ML forecasting, and the distributed .NET architecture they
            run on.
          </p>
          <div className={styles.actions}>
            <ActionButton variant="primary" href="/resume.pdf" external>
              Resume
            </ActionButton>
            <ActionButton variant="ghost" href={GITHUB_URL} external>
              GitHub
            </ActionButton>
          </div>
          <p className={styles.hint}>
            Select a node to inspect it. Use the rail to change layer.
          </p>
        </>
      ) : (
        <>
          <h2 className={styles.layerLabel}>{graph.label}</h2>
          <p className={styles.layerCaption}>{graph.caption}</p>
        </>
      )}
    </motion.div>
  );
}
