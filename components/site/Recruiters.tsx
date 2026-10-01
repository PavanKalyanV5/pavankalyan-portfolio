import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { education } from "@/content/education";
import layout from "./layout.module.css";
import styles from "./Recruiters.module.css";
import { SplitHeading } from "./SplitHeading";
import { CopyEmail } from "./CopyEmail";

const NUMS = [
  { n: "82%", t: "of reporting work automated" },
  { n: "78%", t: "less manual intervention" },
  { n: "99.9%", t: "uptime on monitored services" },
  { n: "490+", t: "tests on my open-source proxy" },
];

const PROOF = [
  { href: "#project-claude-code-privacy-proxy", title: "Claude Code Privacy Proxy", note: "Open source, zero dependencies, 490+ tests." },
  { href: "#project-agentic-rag", title: "AgenticRAG platform", note: "Agentic retrieval over local documents, with an architecture write-up." },
  { href: "#project-production-ml-forecasting", title: "Production forecasting engine", note: "LightGBM and SSA behind an API that an AI assistant calls." },
];

export function Recruiters() {
  const linkedin = socials.find((s) => s.id === "linkedin");
  const github = socials.find((s) => s.id === "github");
  const degree = education[0];

  return (
    <section id="recruiters" className={layout.section} data-scene="1" aria-labelledby="rec-h">
      <div className={layout.column}>
        <SplitHeading id="rec-h" className={layout.heading}>
          For recruiters: the 30-second version
        </SplitHeading>
        <p className={layout.lede} data-depth>
          Everything you need to decide whether to talk, in one place. The rest of the page is the proof.
        </p>

        <dl className={styles.sheet} data-depth>
          <div className={styles.row}>
            <dt className={styles.k}>Looking for</dt>
            <dd className={styles.v}>
              Full-stack, backend or AI engineering roles. I work across <strong>.NET 8</strong>, <strong>Python</strong> and <strong>React</strong>, and go deepest on backend and AI systems.
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.k}>What I build</dt>
            <dd className={styles.v}>
              Agentic RAG, ML forecasting, and event-driven services (CQRS, event sourcing, Orleans) that run unattended.
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.k}>Results</dt>
            <dd className={styles.v}>
              <ul className={styles.nums}>
                {NUMS.map((x) => (
                  <li key={x.t} className={styles.num}>
                    <b>{x.n}</b>
                    <span>{x.t}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.k}>Background</dt>
            <dd className={styles.v}>
              2+ years as a software engineer. {degree.credential}, {degree.grade}. Based in {profile.location}.
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.k}>Right now</dt>
            <dd className={styles.v}>
              Building Interview Copilot, a local-first Windows app with on-device speech recognition and a private knowledge base.
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.k}>Best proof</dt>
            <dd className={`${styles.v} ${styles.proof}`}>
              {PROOF.map((p) => (
                <a key={p.href} href={p.href}>
                  {p.title}
                  <small>{p.note}</small>
                </a>
              ))}
            </dd>
          </div>
        </dl>

        <div className={styles.actions} data-depth>
          <a className={styles.primary} href={profile.resume} target="_blank" rel="noopener noreferrer">
            Download résumé
          </a>
          <a className={styles.link} href={`mailto:${profile.email}`}>
            Email me
          </a>
          <CopyEmail email={profile.email} />
          {linkedin && (
            <a className={styles.link} href={linkedin.url} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
          {github && (
            <a className={styles.link} href={github.url} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
