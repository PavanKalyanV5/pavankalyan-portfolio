"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import styles from "./ThemeSwitcher.module.css";

export type Theme = "light" | "dark" | "amoled";

const OPTIONS: { id: Theme; label: string; icon: React.ReactNode }[] = [
  {
    id: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
      </svg>
    ),
  },
  {
    id: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
      </svg>
    ),
  },
  {
    id: "amoled",
    label: "AMOLED black",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="8" fill="currentColor" />
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
];

function read(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === "dark" || t === "amoled" ? t : "light";
}

function subscribe(cb: () => void) {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
}

export function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);

  const choose = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: the choice just won't persist */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      getComputedStyle(document.documentElement).getPropertyValue("--chalk").trim(),
    );
    window.dispatchEvent(new Event("themechange"));
  }, []);

  // Press T to cycle themes, unless the visitor is typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "t" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))) return;
      const i = OPTIONS.findIndex((o) => o.id === read());
      choose(OPTIONS[(i + 1) % OPTIONS.length].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose]);

  const index = OPTIONS.findIndex((o) => o.id === theme);

  return (
    <div className={styles.dock} role="radiogroup" aria-label="Color theme">
      <span className={styles.thumb} style={{ transform: `translateX(${index * 40}px)` }} aria-hidden />
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={theme === o.id}
          aria-label={o.label}
          className={styles.opt}
          onClick={() => choose(o.id)}
        >
          {o.icon}
          <span className={styles.tip}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
