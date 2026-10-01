import { experience } from "@/content/experience";
import { MetricRing } from "@/components/viz/MetricRing";
import { RoleTimeline } from "@/components/viz/RoleTimeline";
import { SplitHeading } from "./SplitHeading";
import layout from "./layout.module.css";
import styles from "./Work.module.css";

/** Figures quoted in the experience entries below. */
const METRICS = [
  { value: 82, label: "of reporting work automated with AI features and an MCP server" },
  { value: 78, label: "less manual intervention through scheduled workflow jobs" },
  { value: 99.9, decimals: 1, label: "uptime kept through proactive Azure Monitor checks" },
  { value: 95, label: "of assigned user stories delivered inside the sprint" },
];

const PREVIEW = 5;

export function Work() {
  const primary = experience.filter((e) => e.tier === "primary").reverse();
  const earlier = experience.filter((e) => e.tier === "compact").reverse();

  return (
    <section id="work" className={layout.section} data-scene="2" aria-labelledby="work-h">
      <div className={layout.column}>
        <SplitHeading id="work-h" className={layout.heading}>
          AI-powered systems and .NET full-stack apps, built for production
        </SplitHeading>
        <p className={layout.lede} data-depth>
          Agentic RAG, ML forecasting, event-driven Orleans services, and the React front ends that put them in people&apos;s hands.
        </p>

        <ul className={styles.metrics} aria-label="Results" data-depth>
          {METRICS.map((m) => (
            <li key={m.label}>
              <MetricRing value={m.value} decimals={m.decimals} label={m.label} />
            </li>
          ))}
        </ul>

        <div data-depth>
          <RoleTimeline entries={experience} />
        </div>

        {primary.map((role) => {
          const [org, client] = role.organization.split(" \u2014 ");
          const shown = role.bullets.slice(0, PREVIEW);
          const rest = role.bullets.slice(PREVIEW);
          return (
            <article key={role.id} className={styles.role} data-depth>
              <p className={styles.when}>{role.dateLabel}</p>
              <div>
                <h3 className={styles.title}>{role.role}</h3>
                <p className={styles.org}>
                  {org}
                  {client ? `, ${client.replace("Client: ", "client: ")}` : ""}
                </p>
                <ul className={styles.bullets}>
                  {shown.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {rest.length > 0 && (
                  <details className={layout.more} style={{ marginTop: 18 }}>
                    <summary>{rest.length} more</summary>
                    <ul className={styles.bullets}>
                      {rest.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </article>
          );
        })}

        <h3 className={styles.earlierTitle} data-depth>
          Earlier internships and leadership
        </h3>
        <ul className={styles.earlier}>
          {earlier.map((e) => (
            <li key={e.id} data-depth>
              <span className={styles.when}>{e.dateLabel}</span>
              <span>
                {e.role}, {e.organization}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
