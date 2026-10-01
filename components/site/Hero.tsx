import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import styles from "./Hero.module.css";

export function Hero() {
  const words = profile.name.split(/\s+/);
  const github = socials.find((s) => s.id === "github");
  const linkedin = socials.find((s) => s.id === "linkedin");

  return (
    <section id="top" className={styles.hero} data-scene="0" aria-labelledby="name">
      <h1 id="name" className={styles.name}>
        {words.map((w, i) => (
          <span key={w} className={styles.line}>
            <span className={styles.word} style={{ "--i": i } as React.CSSProperties}>
              {w}
            </span>
          </span>
        ))}
      </h1>

      <div className={styles.intro}>
        <p className={styles.tagline}>
          Software engineer building AI-powered backend systems: agentic RAG, ML forecasting, and event-driven .NET at scale.
        </p>
        <p className={styles.sub}>
          Open to full-stack, backend and AI engineering roles. Based in {profile.location}.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={profile.resume} target="_blank" rel="noopener noreferrer">
            Read my résumé
          </a>
          <a className={styles.text} href={`mailto:${profile.email}`}>
            Email me
          </a>
          {github && (
            <a className={styles.text} href={github.url} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
          {linkedin && (
            <a className={styles.text} href={linkedin.url} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <p className={styles.hint}>
        <span className={styles.forMouse}>Move your cursor. The dots closest to it light up, the way an AI search finds the best matches.</span>
        <span className={styles.forTouch}>Touch the screen. The dots closest to your finger light up, the way an AI search finds the best matches.</span>
      </p>
    </section>
  );
}
