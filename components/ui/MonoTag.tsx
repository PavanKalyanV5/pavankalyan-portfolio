"use client";

import React from "react";
import styles from "./MonoTag.module.css";

interface MonoTagProps {
  children: React.ReactNode;
}

export function MonoTag({ children }: MonoTagProps) {
  return <span className={styles.tag}>{children}</span>;
}
