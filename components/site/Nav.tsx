"use client";

import { useEffect, useState } from "react";
import { OPEN_TO_WORK, OPEN_TO_WORK_LABEL } from "@/lib/config";
import { profile } from "@/content/profile";
import { FIELD, HITS } from "@/lib/brandMark";
import styles from "./Nav.module.css";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

const firstName = profile.name.split(/\s+/)[0];

/** The site mark as inline SVG, so it follows the theme colours. */
function Mark() {
  return (
    <svg className={styles.glyph} viewBox="0 0 100 100" aria-hidden>
      {FIELD.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r * 1.25} fill="currentColor" opacity={0.55} />
      ))}
      <circle cx={52} cy={50} r={23} fill="none" stroke="var(--sodium)" strokeWidth={4.5} opacity={0.9} />
      <circle cx={52} cy={50} r={11} fill="var(--sodium)" />
      {HITS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r * 1.2} fill="var(--sodium)" />
      ))}
    </svg>
  );
}

export function Nav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const targets = [...LINKS.map((l) => l.id), "recruiters", "credentials"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id === "credentials" ? "skills" : entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <header className={styles.nav}>
      <a className={styles.mark} href="#top" aria-label={`${profile.name}, back to top`}>
        <Mark />
        <span>{firstName}</span>
      </a>
      <nav aria-label="Sections" className={styles.links}>
        {OPEN_TO_WORK && (
          <span className={styles.status}>
            <span className={styles.dot} aria-hidden />
            {OPEN_TO_WORK_LABEL}
          </span>
        )}
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className={`${styles.link} ${l.id === "skills" ? styles.hideXs : ""} ${active === l.id ? styles.active : ""}`}
            aria-current={active === l.id ? "location" : undefined}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#recruiters"
          className={`${styles.cta} ${active === "recruiters" ? styles.ctaActive : ""}`}
          aria-current={active === "recruiters" ? "location" : undefined}
        >
          <span className={styles.forWord}>For </span>recruiters
        </a>
      </nav>
    </header>
  );
}
