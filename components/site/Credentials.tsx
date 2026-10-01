import { education } from "@/content/education";
import { certifications } from "@/content/certifications";
import type { CertificationEntry } from "@/content/types";
import { CertDonut } from "@/components/viz/CertDonut";
import { SplitHeading } from "./SplitHeading";
import layout from "./layout.module.css";
import styles from "./Credentials.module.css";

function Cert({ c }: { c: CertificationEntry }) {
  return (
    <li className={styles.row}>
      <span className={styles.main}>
        {c.title}
        {c.verificationUrl && (
          <>
            {" "}
            <a className={styles.verify} href={c.verificationUrl} target="_blank" rel="noopener noreferrer">
              Verify
            </a>
          </>
        )}
      </span>
      <span className={styles.meta}>
        {c.issuer}, {c.dateLabel}
      </span>
    </li>
  );
}

export function Credentials() {
  const featured = certifications.filter((c) => c.featured);
  const rest = certifications.filter((c) => !c.featured);

  return (
    <section id="credentials" className={layout.section} data-scene="4" aria-labelledby="cred-h">
      <div className={layout.column}>
        <SplitHeading id="cred-h" className={layout.heading}>
          Education and certifications
        </SplitHeading>
        <p className={layout.lede} data-depth>Computer science degree first, then cloud, security, and machine learning credentials you can verify.</p>

        <div className={styles.group} data-depth>
          <h3 className={styles.groupTitle}>Education</h3>
          <ul>
            {education.map((e) => (
              <li key={e.id} className={styles.row}>
                <span>
                  <span className={styles.main}>{e.institution}</span>
                  <br />
                  <span className={styles.meta}>{e.credential}</span>
                </span>
                <span className={styles.meta}>
                  <span className={styles.grade}>{e.grade}</span>
                  <br />
                  {e.dateLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.group} data-depth>
          <h3 className={styles.groupTitle}>Certifications</h3>
          <CertDonut issuers={certifications.map((c) => c.issuer)} />
          <ul>
            {featured.map((c) => (
              <Cert key={c.id} c={c} />
            ))}
          </ul>
          <details className={layout.more} style={{ marginTop: 18 }}>
            <summary>{rest.length} more</summary>
            <ul>
              {rest.map((c) => (
                <Cert key={c.id} c={c} />
              ))}
            </ul>
          </details>
        </div>
      </div>
    </section>
  );
}
