"use client";

import { useId, useState, type ReactNode } from "react";
import { Tilt } from "./Tilt";
import styles from "./Viz.module.css";

export interface VizTab { id: string; label: string; node: ReactNode }

/** Switchable animated views. Only the active one mounts, so each switch replays its animation. */
export function VizTabs({ tabs }: { tabs: VizTab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const uid = useId();
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    setActive(next.id);
    document.getElementById(`${uid}-${next.id}`)?.focus();
  };

  return (
    <Tilt>
      <div className={styles.tabs} role="tablist" aria-label="Project views">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            id={`${uid}-${t.id}`}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            aria-controls={`${uid}-panel`}
            tabIndex={active === t.id ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${current.id}`} className={styles.panel} key={current.id}>
        {current.node}
      </div>
    </Tilt>
  );
}
