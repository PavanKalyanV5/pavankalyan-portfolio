import { projects } from "@/content/projects";
import { FlowDiagram } from "@/components/viz/FlowDiagram";
import { FLOWS } from "@/components/viz/flows";
import { VizTabs, type VizTab } from "@/components/viz/VizTabs";
import { ForecastSparkline } from "@/components/viz/ForecastSparkline";
import { SsaDecomposition } from "@/components/viz/SsaDecomposition";
import { VectorSearchViz } from "@/components/viz/VectorSearchViz";
import { CheckpointRecovery } from "@/components/viz/CheckpointRecovery";
import { CrdtSync } from "@/components/viz/CrdtSync";
import { AstGrowth } from "@/components/viz/AstGrowth";
import { RouteMap } from "@/components/viz/RouteMap";
import { RedactionDemo } from "@/components/viz/RedactionDemo";
import { ScrubBars } from "@/components/viz/ScrubBars";
import { DualChannel } from "@/components/viz/DualChannel";
import { Tech } from "@/components/ui/TechIcon";
import { SplitHeading } from "./SplitHeading";
import layout from "./layout.module.css";
import styles from "./Projects.module.css";

/** Each featured project gets three switchable animated views, all drawn from its case study. */
const VIEWS: Record<string, VizTab[]> = {
  "claude-code-privacy-proxy": [
    { id: "flow", label: "Request flow", node: <FlowDiagram {...FLOWS["privacy-proxy"]} /> },
    { id: "redact", label: "Redaction", node: <RedactionDemo /> },
    { id: "scrub", label: "Scrub result", node: <ScrubBars /> },
  ],
  "interview-copilot": [
    { id: "pipe", label: "Pipeline", node: <FlowDiagram {...FLOWS["interview-copilot"]} /> },
    { id: "channels", label: "Two channels", node: <DualChannel /> },
    {
      id: "search",
      label: "Knowledge search",
      node: <VectorSearchViz caption="Hybrid vector and full-text search over your own documents, with local embeddings. The points here are an illustration." />,
    },
  ],
  "agentic-rag": [
    { id: "arch", label: "Architecture", node: <FlowDiagram {...FLOWS["agentic-rag"]} /> },
    { id: "agent", label: "Agent loop", node: <FlowDiagram {...FLOWS["agent-loop"]} /> },
    { id: "search", label: "Vector search", node: <VectorSearchViz /> },
  ],
  "theo-ai-workspace": [
    { id: "arch", label: "Architecture", node: <FlowDiagram {...FLOWS["theo-ai-workspace"]} /> },
    { id: "sync", label: "CRDT sync", node: <CrdtSync /> },
    { id: "recover", label: "Crash recovery", node: <CheckpointRecovery /> },
  ],
  "production-ml-forecasting": [
    { id: "forecast", label: "Forecast", node: <ForecastSparkline /> },
    { id: "ssa", label: "SSA split", node: <SsaDecomposition /> },
    { id: "pipe", label: "Pipeline", node: <FlowDiagram {...FLOWS["forecast-pipeline"]} /> },
  ],
  "game-intelligence-platform": [
    { id: "arch", label: "Architecture", node: <FlowDiagram {...FLOWS["game-intelligence-platform"]} /> },
    { id: "parse", label: "Parser", node: <AstGrowth /> },
    { id: "routes", label: "Route map", node: <RouteMap /> },
  ],
};

export function Projects() {
  const featured = projects.filter((p) => p.tier === "featured");
  const archive = projects.filter((p) => p.tier === "compact");

  return (
    <section id="projects" className={layout.section} data-scene="2" aria-labelledby="projects-h">
      <div className={layout.column}>
        <SplitHeading id="projects-h" className={layout.heading}>
          Systems I built to see how they hold together
        </SplitHeading>
        <p className={layout.lede} data-depth>
          Six larger projects. Each has animated views of how it works, plus the problem, the architecture, and the decisions behind it.
        </p>

        {featured.map((p) => (
          <article key={p.id} id={`project-${p.id}`} className={styles.project} data-depth>
            <div className={styles.top}>
              <h3 className={styles.name}>{p.name}</h3>
              <span className={styles.date}>{p.dateLabel}</span>
            </div>
            <p className={styles.desc}>{p.description}</p>
            {p.concurrentWith && <p className={styles.note}>{p.concurrentWith}.</p>}
            <p className={styles.stack}>
              {p.techStack.map((t) => (
                <Tech key={t} name={t} />
              ))}
            </p>

            {VIEWS[p.id] && <VizTabs tabs={VIEWS[p.id]} />}

            {p.caseStudy?.metrics && (
              <dl className={styles.stats}>
                {p.caseStudy.metrics.map((m) => (
                  <div key={m.label} className={styles.stat}>
                    <dd>{m.value}</dd>
                    <dt>{m.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            {!p.links.some((l) => /github\.com/.test(l.url)) && (
              <p className={styles.private}>Source is private. The case study covers the design and the decisions.</p>
            )}

            {p.links.length > 0 && (
              <div className={styles.links}>
                {p.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
            )}

            {p.caseStudy && (
              <details className={layout.more}>
                <summary>Read the case study</summary>
                <div className={styles.study}>
                  <div>
                    <h4>The problem</h4>
                    <p>{p.caseStudy.problem}</p>
                  </div>
                  <div>
                    <h4>Architecture</h4>
                    <p>{p.caseStudy.architecture}</p>
                  </div>
                  <div>
                    <h4>Decisions</h4>
                    <ul>
                      {p.caseStudy.keyDecisions.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Results</h4>
                    <ul>
                      {p.caseStudy.results.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            )}
          </article>
        ))}

        <h3 className={styles.archiveTitle} data-depth>Earlier and smaller projects</h3>
        <ul className={styles.archive}>
          {archive.map((p) => (
            <li key={p.id} data-depth>
              <strong>{p.name}</strong>
              <small>
                <span className={styles.archiveStack}>
                  {p.techStack.map((t) => (
                    <Tech key={t} name={t} />
                  ))}
                </span>
                {p.links[0] && (
                  <>
                    {" "}
                    <a href={p.links[0].url} target="_blank" rel="noopener noreferrer">
                      {p.links[0].label}
                    </a>
                  </>
                )}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
