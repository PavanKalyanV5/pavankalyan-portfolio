"use client";

import React, { useState, useMemo } from "react";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { skillCategories } from "@/content/skills";
import { certifications } from "@/content/certifications";
import { Card3D } from "@/components/kokonutui/Card3D";
import { LiquidGlassCard } from "@/components/kokonutui/LiquidGlassCard";
import { ParticleButton } from "@/components/kokonutui/ParticleButton";
import { ShimmerText } from "@/components/kokonutui/ShimmerText";
import { BackgroundPaths } from "@/components/kokonutui/BackgroundPaths";
import { BklitRadarChart } from "@/components/bklit/BklitRadarChart";
import { BklitTelemetryRibbon } from "@/components/bklit/BklitTelemetryRibbon";
import { BklitMetricsChart } from "@/components/bklit/BklitMetricsChart";
import { BklitGaugeChart } from "@/components/bklit/BklitGaugeChart";
import { AnimeCounter } from "@/components/anime/AnimeCounter";
import { AnimeCircuit } from "@/components/anime/AnimeCircuit";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { MonoTag } from "@/components/ui/MonoTag";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ContactPanel } from "@/components/overlay/ContactPanel";
import { getCyberAvatarUrl, getProjectVisual } from "@/lib/assets/icons";
import styles from "./BentoPortfolio.module.css";
import nodeIconStyles from "@/components/overlay/NodeIcons.module.css";

interface BentoPortfolioProps {
  onSwitchToSpatial?: () => void;
  onOpenCommandPalette?: () => void;
}

export function BentoPortfolio({
  onSwitchToSpatial,
  onOpenCommandPalette,
}: BentoPortfolioProps) {
  const [projectFilter, setProjectFilter] = useState<string>("featured");
  const [skillSearch, setSkillSearch] = useState<string>("");

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (projectFilter === "all") return projects;
    if (projectFilter === "featured")
      return projects.filter((p) => p.tier === "featured");
    if (projectFilter === "ai")
      return projects.filter((p) =>
        p.techStack.some((t) => ["Python", "TensorFlow", "T5", "Semantic Kernel"].includes(t)) ||
        p.glyph === "ai"
      );
    if (projectFilter === "dotnet")
      return projects.filter((p) =>
        p.techStack.some((t) => [".NET", "Rust", "RabbitMQ"].includes(t))
      );
    return projects;
  }, [projectFilter]);

  // Filter skills
  const filteredSkillCategories = useMemo(() => {
    if (!skillSearch.trim()) return skillCategories;
    const q = skillSearch.toLowerCase();
    return skillCategories
      .map((cat) => ({
        ...cat,
        skills: cat.skills.filter((s) => s.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.skills.length > 0);
  }, [skillSearch]);

  const projectTabs = [
    { id: "featured", label: "Featured Systems", count: 4 },
    { id: "all", label: "All Projects", count: projects.length },
    { id: "ai", label: "AI & RAG", count: 4 },
    { id: "dotnet", label: ".NET & Distributed", count: 2 },
  ];

  return (
    <div className={styles.bentoContainer}>
      {/* Background Animated Energy Paths */}
      <BackgroundPaths opacity={0.4} />

      {/* Hero Section Bento */}
      <header className={styles.heroSection}>
        <Card3D glowColor="cool" intensity={12} className={styles.heroCard}>
          <div className={styles.heroInner}>
            <div className={styles.heroTop}>
              <div className={styles.heroBadgeRow}>
                <Badge variant="cool" icon={<span className={styles.livePulse} />}>
                  HYDERABAD, INDIA · OPEN TO OPPORTUNITIES
                </Badge>
                {onOpenCommandPalette && (
                  <button
                    className={styles.cmdHint}
                    onClick={onOpenCommandPalette}
                    data-cursor="link"
                  >
                    Quick Search <kbd>⌘K</kbd>
                  </button>
                )}
              </div>

              {/* Profile Avatar & Name Group */}
              <div className={styles.heroProfileRow}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCyberAvatarUrl()}
                  alt="Pavan Kalyan Vetla"
                  width={76}
                  height={76}
                  className={styles.heroAvatar}
                  loading="eager"
                />
                <div className={styles.heroNameGroup}>
                  <h1 className={styles.heroName}>
                    <ShimmerText tone="cool" speed="normal">
                      Pavan Kalyan Vetla
                    </ShimmerText>
                  </h1>
                  <p className={styles.heroHeadline}>
                    Software Engineer — AI-Powered Backend Systems & .NET Full-Stack Developer
                  </p>
                </div>
              </div>

              <p className={styles.heroBio}>
                Building enterprise AI backend systems in production, from agentic RAG
                pipelines and ML forecasting engines to distributed .NET Orleans architectures.
                Specialized in Domain-Driven Design, CQRS, and Event Sourcing at business scale.
              </p>

              {/* SkillIcons Stack Banner */}
              <div className={styles.stackBannerWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://skillicons.dev/icons?i=dotnet,cs,azure,docker,py,fastapi,mongodb,react,rust,graphql,rabbitmq,postgres,git,github"
                  alt="Core Engineering Tech Stack"
                  className={styles.skillIconsBanner}
                  loading="lazy"
                />
              </div>

              <div className={styles.heroCtas}>
                <ParticleButton
                  href="/resume.pdf"
                  external
                  variant="primary"
                  size="md"
                >
                  Download Resume ↗
                </ParticleButton>

                <ParticleButton
                  href="#contact"
                  variant="cool"
                  size="md"
                >
                  Get in Touch
                </ParticleButton>

                {onSwitchToSpatial && (
                  <ParticleButton
                    onClick={onSwitchToSpatial}
                    variant="violet"
                    size="md"
                  >
                    Enter 3D Spatial Universe ✦
                  </ParticleButton>
                )}
              </div>
            </div>

            {/* Key Statistics Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  <AnimeCounter to={99.99} decimals={2} suffix="%" />
                </div>
                <div className={styles.statLabel}>PROD UPTIME MAINTAINED</div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  <AnimeCounter to={82} suffix="%" />
                </div>
                <div className={styles.statLabel}>OPS WORKFLOW AUTOMATION</div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  <AnimeCounter to={2450} prefix="" suffix="+" />
                </div>
                <div className={styles.statLabel}>ORLEANS VIRTUAL ACTORS</div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  <AnimeCounter to={14.8} decimals={1} suffix="k" />
                </div>
                <div className={styles.statLabel}>PEAK QPS THROUGHPUT</div>
              </div>
            </div>
          </div>
        </Card3D>
      </header>

      {/* Real-time Bklit Telemetry Ribbon */}
      <section className={styles.sectionWrap}>
        <BklitTelemetryRibbon />
      </section>

      {/* Engineering Architecture & Telemetry Bento Section */}
      <section className={styles.sectionWrap}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>SYSTEM TELEMETRY</div>
          <h2 className={styles.sectionTitle}>
            Engineering Architecture & Capabilities
          </h2>
          <p className={styles.sectionSub}>
            Real-time multi-dimensional assessment of distributed backend & AI proficiencies.
          </p>
        </div>

        <div className={styles.telemetryGrid}>
          {/* Radar Chart Card */}
          <LiquidGlassCard glow="cool" className={styles.radarCard}>
            <BklitRadarChart size={360} />
          </LiquidGlassCard>

          {/* Right Column: Metrics & Reliability Gauges */}
          <div className={styles.sideTelemetry}>
            <LiquidGlassCard glow="violet" className={styles.metricsCard}>
              <BklitMetricsChart
                title="MICROSERVICE_EVENT_SCALING"
                color="violet"
                height={150}
              />
            </LiquidGlassCard>

            <div className={styles.gaugeRow}>
              <LiquidGlassCard glow="emerald" className={styles.gaugeCard}>
                <BklitGaugeChart
                  value={99}
                  label="PROD RELIABILITY"
                  sublabel="Azure Monitor Health"
                  tone="emerald"
                  size={110}
                />
              </LiquidGlassCard>

              <LiquidGlassCard glow="warm" className={styles.gaugeCard}>
                <BklitGaugeChart
                  value={95}
                  label="AGILE VELOCITY"
                  sublabel="Sprint Delivery Rate"
                  tone="warm"
                  size={110}
                />
              </LiquidGlassCard>
            </div>

            <LiquidGlassCard glow="cool" className={styles.circuitCard}>
              <div className={styles.circuitHeader}>
                <span>ORLEANS_MESSAGE_BUS</span>
                <span className={styles.activeTag}>ONLINE</span>
              </div>
              <AnimeCircuit tone="cool" />
            </LiquidGlassCard>
          </div>
        </div>
      </section>

      {/* Featured Projects 3D Bento */}
      <section className={styles.sectionWrap} id="projects">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>PORTFOLIO WORK</div>
          <h2 className={styles.sectionTitle}>
            Production Systems & Personal Projects
          </h2>
          <p className={styles.sectionSub}>
            High-concurrency platforms, AI workspaces, and agentic RAG engines built from the ground up.
          </p>

          <div className={styles.tabsRow}>
            <Tabs
              tabs={projectTabs}
              activeId={projectFilter}
              onChange={setProjectFilter}
            />
          </div>
        </div>

        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => {
            const isFeatured = project.tier === "featured";
            const visual = getProjectVisual(project.id);

            return (
              <Card3D
                key={project.id}
                glowColor={isFeatured ? "cool" : "violet"}
                intensity={14}
                className={`${styles.projectCard} ${
                  isFeatured ? styles.featuredProject : ""
                }`}
              >
                <div className={styles.projectInner}>
                  {/* Visual Preview Header */}
                  <div
                    className={styles.projectVisualBanner}
                    style={{ background: visual.gradient }}
                  >
                    <span className={styles.visualBadge}>{visual.badge}</span>
                    <BrandIcon name={visual.iconSlug} size={24} />
                  </div>

                  <div className={styles.projectHeader}>
                    <Badge
                      variant={isFeatured ? "cool" : "outline"}
                      size="sm"
                    >
                      {project.dateLabel}
                    </Badge>
                    {isFeatured && (
                      <Badge variant="violet" size="sm">
                        FEATURED
                      </Badge>
                    )}
                  </div>

                  <h3 className={styles.projectName}>
                    <ShimmerText tone={isFeatured ? "cool" : "silver"}>
                      {project.name}
                    </ShimmerText>
                  </h3>

                  <p className={styles.projectDesc}>{project.description}</p>

                  {/* Bullet points for featured systems */}
                  {project.bullets && project.bullets.length > 0 && (
                    <ul className={styles.projectBullets}>
                      {project.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}

                  {project.concurrentWith && (
                    <div className={styles.concurrentNote}>
                      ✦ {project.concurrentWith}
                    </div>
                  )}

                  {/* Tech stack tags with real brand icons */}
                  <div className={styles.techRow}>
                    {project.techStack.map((tech, tIdx) => (
                      <MonoTag key={tIdx}>
                        <span className={nodeIconStyles.tagIconWrapper}>
                          <BrandIcon name={tech} size={12} />
                          {tech}
                        </span>
                      </MonoTag>
                    ))}
                  </div>

                  {/* Links */}
                  {project.links && project.links.length > 0 && (
                    <div className={styles.projectLinks}>
                      {project.links.map((link, lIdx) => (
                        <ParticleButton
                          key={lIdx}
                          href={link.url}
                          external
                          variant="cool"
                          size="sm"
                        >
                          {link.label} ↗
                        </ParticleButton>
                      ))}
                    </div>
                  )}
                </div>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* Production Career Experience Bento */}
      <section className={styles.sectionWrap} id="experience">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>CAREER CHRONICLE</div>
          <h2 className={styles.sectionTitle}>
            Engineering Experience & Track Record
          </h2>
          <p className={styles.sectionSub}>
            Delivering high-availability enterprise backends, agentic microservices, and client platforms.
          </p>
        </div>

        <div className={styles.experienceGrid}>
          {experience.map((exp) => {
            const isPrimary = exp.tier === "primary";
            return (
              <LiquidGlassCard
                key={exp.id}
                glow={isPrimary ? "cool" : "violet"}
                className={`${styles.expCard} ${
                  isPrimary ? styles.primaryExp : ""
                }`}
              >
                <div className={styles.expHeader}>
                  <div className={styles.expOrgRow}>
                    <BrandIcon name={exp.organization} type="issuer" size={24} />
                    <div>
                      <h3 className={styles.expRole}>{exp.role}</h3>
                      <div className={styles.expOrg}>{exp.organization}</div>
                    </div>
                  </div>
                  <Badge variant={isPrimary ? "cool" : "outline"} size="sm">
                    {exp.dateLabel}
                  </Badge>
                </div>

                <div className={styles.expLocation}>📍 {exp.location}</div>

                <ul className={styles.expBullets}>
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </LiquidGlassCard>
            );
          })}
        </div>
      </section>

      {/* Skills Matrix Bento */}
      <section className={styles.sectionWrap} id="skills">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>TECHNICAL MASTERY</div>
          <h2 className={styles.sectionTitle}>
            Languages, Frameworks & Tooling
          </h2>
          <p className={styles.sectionSub}>
            Search or filter across backend, AI, cloud, database, and system design skills.
          </p>

          <div className={styles.skillSearchWrap}>
            <input
              type="text"
              placeholder="Filter competencies (e.g. Orleans, Semantic Kernel, C#, Azure)..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className={styles.skillInput}
            />
          </div>
        </div>

        <div className={styles.skillsBento}>
          {filteredSkillCategories.map((category) => (
            <LiquidGlassCard
              key={category.key}
              glow="cool"
              className={styles.skillCategoryCard}
            >
              <div className={styles.skillCategoryTitle}>
                {category.label}
              </div>
              <div className={styles.skillPills}>
                {category.skills.map((skill, sIdx) => (
                  <span key={sIdx} className={styles.skillPill}>
                    <BrandIcon name={skill} size={15} />
                    {skill}
                  </span>
                ))}
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </section>

      {/* Certifications & Licensures Bento */}
      <section className={styles.sectionWrap} id="certifications">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>VALIDATIONS</div>
          <h2 className={styles.sectionTitle}>
            Certifications & Industry Licenses
          </h2>
          <p className={styles.sectionSub}>
            Accredited credentials across Cloud Architecture, Database Systems, Security, and AI/ML.
          </p>
        </div>

        <div className={styles.certsGrid}>
          {certifications.map((cert) => (
            <LiquidGlassCard
              key={cert.id}
              glow="violet"
              className={styles.certCard}
            >
              <div className={styles.certHeader}>
                <div className={styles.certIssuerRow}>
                  <BrandIcon name={cert.issuer} type="issuer" size={22} />
                  <div className={styles.certIssuer}>{cert.issuer}</div>
                </div>
                <Badge variant="outline" size="sm">
                  {cert.dateLabel}
                </Badge>
              </div>
              <h4 className={styles.certTitle}>{cert.title}</h4>
              {cert.credentialId && (
                <div className={styles.certId}>ID: {cert.credentialId}</div>
              )}
              {cert.verificationUrl && (
                <div className={styles.certLinkWrap}>
                  <ParticleButton
                    href={cert.verificationUrl}
                    external
                    variant="ghost"
                    size="sm"
                  >
                    View Certificate ↗
                  </ParticleButton>
                </div>
              )}
            </LiquidGlassCard>
          ))}
        </div>
      </section>

      {/* Contact Section Bento */}
      <section className={styles.sectionWrap} id="contact">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>TRANSMISSION_LINK</div>
          <h2 className={styles.sectionTitle}>Initiate Collaboration</h2>
          <p className={styles.sectionSub}>
            Reach out directly for engineering roles, technical consultations, or architecture inquiries.
          </p>
        </div>

        <Card3D glowColor="cool" intensity={8} className={styles.contactContainer}>
          <ContactPanel />
        </Card3D>
      </section>
    </div>
  );
}
