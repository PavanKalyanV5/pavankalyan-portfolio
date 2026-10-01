"use client";

import { useState } from "react";
import styles from "./Recruiters.module.css";

/** Copies the address and says so. Falls back to leaving the mailto link usable. */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2200);
  }

  return (
    <button type="button" className={styles.copy} onClick={copy}>
      {state === "copied" ? "Email copied" : state === "failed" ? "Copy failed, use the link" : "Copy email"}
    </button>
  );
}
