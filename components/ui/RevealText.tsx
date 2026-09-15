"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView, useReducedMotion } from "framer-motion";
import styles from "./RevealText.module.css";

interface RevealTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  className?: string;
}

export function RevealText({
  text,
  as: Component = "h2",
  delay = 0,
  className,
}: RevealTextProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();

  const words = text.split(" ");

  if (reducedMotion) {
    return (
      <Component ref={ref} className={className}>
        {text}
      </Component>
    );
  }

  return (
    <Component ref={ref} className={className}>
      {words.map((word, idx) => (
        <span key={idx} className={styles.wordContainer}>
          <motion.span
            className={styles.word}
            initial={{ y: "110%" }}
            animate={isInView ? { y: "0%" } : { y: "110%" }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + idx * 0.055,
            }}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
          {idx < words.length - 1 && " "}
        </span>
      ))}
    </Component>
  );
}
