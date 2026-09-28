"use client";

import type { LayerId, MeshNode } from "@/lib/mesh/types";
import { LAYER_GRAPHS } from "@/lib/mesh/layers";
import { LAYER_ORDER } from "@/lib/mesh/types";
import { ActionButton } from "@/components/ui/ActionButton";
import { MonoTag } from "@/components/ui/MonoTag";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { LiquidGlassCard } from "@/components/kokonutui/LiquidGlassCard";
import { ShimmerText } from "@/components/kokonutui/ShimmerText";
import { BackgroundPaths } from "@/components/kokonutui/BackgroundPaths";
import { BklitTelemetryRibbon } from "@/components/bklit/BklitTelemetryRibbon";
import { BklitRadarChart } from "@/components/bklit/BklitRadarChart";
import styles from "./StaticPortfolio.module.css";

export function StaticPortfolio() {
  return (
    <div className={styles.container}>
      <BackgroundPaths opacity={0.35} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.monogram}>PKV</div>
        <h1 className={styles.title}>
          <ShimmerText tone="cool" speed="normal">
            Pavan Kalyan Vetla
          </ShimmerText>
        </h1>
        <p className={styles.tagline}>
          Software Engineer — AI-Powered Backend Systems & .NET Full-Stack Developer
        </p>
        <div className={styles.headerActions}>
          <ActionButton
            href="/resume.pdf"
            variant="primary"
            external
          >
            Resume
          </ActionButton>
          <ActionButton
            href="mailto:vetlapavankalyan5@gmail.com"
            variant="ghost"
          >
            Email
          </ActionButton>
        </div>
      </header>

      {/* Bklit Telemetry & Radar Overview */}
      <div className={styles.telemetrySection}>
        <BklitTelemetryRibbon />
        <div className={styles.radarWrap}>
          <LiquidGlassCard glow="cool">
            <BklitRadarChart size={340} />
          </LiquidGlassCard>
        </div>
      </div>

      {/* Content Sections */}
      {LAYER_ORDER.map((layerId: LayerId) => {
        // Skip overview layer
        if (layerId === "overview") return null;

        const layer = LAYER_GRAPHS[layerId];

        return (
          <section key={layer.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{layer.label}</h2>
            <p className={styles.sectionCaption}>{layer.caption}</p>
            <div className={styles.divider} />

            <div className={styles.articlesContainer}>
              {layer.nodes.map((node: MeshNode) => (
                <LiquidGlassCard
                  key={node.id}
                  glow={node.emphasis === "live" ? "cool" : "violet"}
                  className={`${styles.article} ${
                    node.emphasis === "live" ? styles.articleLive : ""
                  }`}
                >
                  {/* Title */}
                  {node.title && (
                    <h3 className={styles.nodeTitle}>{node.title}</h3>
                  )}

                  {/* Subtitle */}
                  {node.subtitle && (
                    <p className={styles.nodeSubtitle}>{node.subtitle}</p>
                  )}

                  {/* Meta */}
                  {node.meta && (
                    <p className={styles.nodeMeta}>{node.meta}</p>
                  )}

                  {/* Note / Callout */}
                  {node.detail.note && (
                    <div className={styles.note}>
                      {node.detail.note}
                    </div>
                  )}

                  {/* Body */}
                  {node.detail.body && (
                    <p className={styles.body}>{node.detail.body}</p>
                  )}

                  {/* Bullets */}
                  {node.detail.bullets && node.detail.bullets.length > 0 && (
                    <ul className={styles.bullets}>
                      {node.detail.bullets.map((bullet: string, idx: number) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {/* Tags */}
                  {node.detail.tags && node.detail.tags.length > 0 && (
                    <div className={styles.tagsRow}>
                      {node.detail.tags.map((tag: string, idx: number) => (
                        <MonoTag key={idx}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <BrandIcon name={tag} size={12} />
                            {tag}
                          </span>
                        </MonoTag>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  {node.detail.links && node.detail.links.length > 0 && (
                    <div className={styles.linksRow}>
                      {node.detail.links.map((link, idx: number) => (
                        <ActionButton
                          key={idx}
                          href={link.url}
                          variant="ghost"
                          external
                        >
                          {link.label}
                        </ActionButton>
                      ))}
                    </div>
                  )}
                </LiquidGlassCard>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
