import type {
  LayerGraph,
  LayerId,
  MeshNode,
  NodeEmphasis,
  MeshEdge,
} from "./types";
import { LAYER_ORDER } from "./types";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { education } from "@/content/education";
import { skillCategories } from "@/content/skills";
import { certifications } from "@/content/certifications";
import { socials } from "@/content/socials";

// Utility to round to 3 decimals
const round3 = (n: number): number => Math.round(n * 1000) / 1000;

// Utility to slugify issuer names
const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Helper to calculate hostname from URL
const getHostname = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

// ============================================================================
// Layer 1: Overview
// ============================================================================

function buildOverviewLayer(): LayerGraph {
  const nodes: MeshNode[] = [];
  const edges: MeshEdge[] = [];

  // Center hub node: "me"
  nodes.push({
    id: "me",
    layer: "overview",
    kind: "hub",
    emphasis: "live",
    label: "Pavan Kalyan Vetla",
    title: "Pavan Kalyan Vetla",
    subtitle: "Software Engineer — AI-Powered Backend Systems & .NET Full-Stack Developer",
    meta: "Hyderabad, India",
    position: [0, 0, 0],
    detail: {
      body: "Software Engineer building AI-powered backend systems in production, from agentic RAG pipelines and ML forecasting engines to the distributed .NET architecture they run on. Deep expertise in .NET Core, Orleans, and event-driven microservices applying Domain-Driven Design, CQRS, and Event Sourcing to real business-scale problems.",
    },
  });

  // Six hub nodes for each content layer
  const hubIds = [
    "hub-experience",
    "hub-projects",
    "hub-education",
    "hub-certifications",
    "hub-skills",
    "hub-contact",
  ];
  const hubLabels = [
    "Experience",
    "Personal Projects",
    "Education",
    "Certifications & Licenses",
    "Skills",
    "Contact",
  ];

  const hubSubtitles = [
    "7 roles",
    "9 projects",
    "5 schools",
    "15 issuers",
    "8 domains",
    "7 profiles",
  ];

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
    const x = round3(Math.cos(angle) * 6.5);
    const y = round3(Math.sin(angle) * 4.2);
    const z = round3(Math.sin(angle * 2) * 1.5);

    nodes.push({
      id: hubIds[i],
      layer: "overview",
      kind: "hub",
      emphasis: "primary",
      label: hubLabels[i],
      title: hubLabels[i],
      subtitle: hubSubtitles[i],
      meta: hubIds[i].replace("hub-", ""),
      position: [x, y, z],
      detail: {},
    });

    // Add membership edge from "me" to this hub
    edges.push({
      from: "me",
      to: hubIds[i],
      kind: "membership",
    });
  }

  // Add two social profile shortcut nodes
  const github = socials.find((s) => s.id === "github");
  const linkedin = socials.find((s) => s.id === "linkedin");

  if (github) {
    const githubHostname = getHostname(github.url);
    nodes.push({
      id: "link-github",
      layer: "overview",
      kind: "contact",
      emphasis: "normal",
      label: github.label,
      title: github.label,
      subtitle: githubHostname,
      meta: "profile",
      position: [-3.1, -3.4, 1.2],
      detail: {
        links: [
          {
            label: "Open profile",
            url: github.url,
          },
        ],
      },
    });

    edges.push({
      from: "me",
      to: "link-github",
      kind: "membership",
    });
  }

  if (linkedin) {
    const linkedinHostname = getHostname(linkedin.url);
    nodes.push({
      id: "link-linkedin",
      layer: "overview",
      kind: "contact",
      emphasis: "normal",
      label: linkedin.label,
      title: linkedin.label,
      subtitle: linkedinHostname,
      meta: "profile",
      position: [3.1, -3.4, 1.2],
      detail: {
        links: [
          {
            label: "Open profile",
            url: linkedin.url,
          },
        ],
      },
    });

    edges.push({
      from: "me",
      to: "link-linkedin",
      kind: "membership",
    });
  }

  return {
    id: "overview",
    label: "Overview",
    caption: "A live view of the systems, roles and projects behind the work.",
    nodes,
    edges,
    cameraHome: [0, 1.5, 16],
  };
}

// ============================================================================
// Layer 2: Experience
// ============================================================================

function buildExperienceLayer(): LayerGraph {
  const nodes: MeshNode[] = [];
  const edges: MeshEdge[] = [];

  // Map all 7 experience entries
  for (let i = 0; i < experience.length; i++) {
    const entry = experience[i];
    const x = round3(-9 + i * 3);
    const y = round3(i % 2 === 0 ? -1.2 : 1.2);
    const z = round3(i % 3 === 0 ? -0.8 : i % 3 === 1 ? 0.8 : 0);

    let emphasis: NodeEmphasis;
    if (entry.id === "kovalty-swe") {
      emphasis = "live";
    } else if (entry.tier === "primary") {
      emphasis = "primary";
    } else {
      emphasis = "normal";
    }

    nodes.push({
      id: entry.id,
      layer: "experience",
      kind: "role",
      emphasis,
      label: entry.role,
      title: entry.role,
      subtitle: entry.organization,
      meta: entry.dateLabel,
      position: [x, y, z],
      detail: {
        bullets: entry.bullets,
        note: entry.location,
      },
    });
  }

  // Create temporal edges connecting each node to the next
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      from: nodes[i].id,
      to: nodes[i + 1].id,
      kind: "temporal",
    });
  }

  return {
    id: "experience",
    label: "Experience",
    caption: "Roles on a temporal spine. The amber node is where I am now.",
    nodes,
    edges,
    cameraHome: [0, 2, 18],
  };
}

// ============================================================================
// Layer 3: Projects
// ============================================================================

function buildProjectsLayer(): LayerGraph {
  const nodes: MeshNode[] = [];
  const edges: MeshEdge[] = [];

  // Separate projects by tier
  const featuredProjects: typeof projects = [];
  const compactProjects: typeof projects = [];

  for (const proj of projects) {
    if (proj.tier === "featured") {
      featuredProjects.push(proj);
    } else {
      compactProjects.push(proj);
    }
  }

  // Featured projects (inner ring)
  for (let f = 0; f < featuredProjects.length; f++) {
    const proj = featuredProjects[f];
    const angle = (f / 4) * 2 * Math.PI + 0.4;
    const x = round3(Math.cos(angle) * 4);
    const y = round3(Math.sin(angle) * 2.6);
    const z = round3(Math.cos(angle * 1.5) * 1.2);

    nodes.push({
      id: proj.id,
      layer: "projects",
      kind: "project",
      emphasis: "primary",
      label: proj.name,
      title: proj.name,
      subtitle: proj.techStack.join(" / "),
      meta: proj.dateLabel,
      position: [x, y, z],
      detail: {
        body: proj.description,
        bullets: proj.bullets,
        tags: proj.techStack,
        links: proj.links,
        note: proj.concurrentWith,
      },
    });
  }

  // Compact projects (outer ring)
  for (let c = 0; c < compactProjects.length; c++) {
    const proj = compactProjects[c];
    const angle = (c / 5) * 2 * Math.PI - 0.6;
    const x = round3(Math.cos(angle) * 8);
    const y = round3(Math.sin(angle) * 4.4);
    const z = round3(Math.sin(angle * 1.7) * 1.8);

    nodes.push({
      id: proj.id,
      layer: "projects",
      kind: "project",
      emphasis: "muted",
      label: proj.name,
      title: proj.name,
      subtitle: proj.techStack.join(" / "),
      meta: proj.dateLabel,
      position: [x, y, z],
      detail: {
        body: proj.description,
        bullets: proj.bullets,
        tags: proj.techStack,
        links: proj.links,
        note: proj.concurrentWith,
      },
    });
  }

  // Temporal edges following original array order
  for (let i = 0; i < projects.length - 1; i++) {
    edges.push({
      from: projects[i].id,
      to: projects[i + 1].id,
      kind: "temporal",
    });
  }

  return {
    id: "projects",
    label: "Personal Projects",
    caption: "Personal and production systems. The inner ring is the flagship work.",
    nodes,
    edges,
    cameraHome: [0, 2, 16],
  };
}

// ============================================================================
// Layer 4: Education
// ============================================================================

function buildEducationLayer(): LayerGraph {
  const nodes: MeshNode[] = [];
  const edges: MeshEdge[] = [];

  // One node per education entry in chronological order
  for (let i = 0; i < education.length; i++) {
    const entry = education[i];
    const x = round3(-6 + i * 3);
    const y = round3(i % 2 === 0 ? -1.1 : 1.1);
    const z = round3(i % 3 === 0 ? -0.7 : i % 3 === 1 ? 0.7 : 0);

    let emphasis: NodeEmphasis;
    if (entry.id === "gvp-btech") {
      emphasis = "primary";
    } else if (entry.id === "sri-chaitanya-intermediate") {
      emphasis = "normal";
    } else {
      emphasis = "muted";
    }

    nodes.push({
      id: entry.id,
      layer: "education",
      kind: "education",
      emphasis,
      label: entry.credential,
      title: entry.credential,
      subtitle: entry.institution,
      meta: entry.dateLabel,
      position: [x, y, z],
      detail: {
        note: entry.grade !== undefined ? entry.grade : undefined,
      },
    });
  }

  // Create temporal edges connecting each node to the next
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      from: nodes[i].id,
      to: nodes[i + 1].id,
      kind: "temporal",
    });
  }

  return {
    id: "education",
    label: "Education",
    caption: "Every school and degree, oldest first.",
    nodes,
    edges,
    cameraHome: [0, 2, 17],
  };
}

// ============================================================================
// Layer 5: Certifications
// ============================================================================

function buildCertificationsLayer(): LayerGraph {
  const nodes: MeshNode[] = [];
  const edges: MeshEdge[] = [];

  // Group certifications by issuer (preserving first-appearance order)
  const issuerGroups: Record<string, typeof certifications> = {};
  const issuerOrder: string[] = [];

  for (const cert of certifications) {
    if (!issuerGroups[cert.issuer]) {
      issuerGroups[cert.issuer] = [];
      issuerOrder.push(cert.issuer);
    }
    issuerGroups[cert.issuer].push(cert);
  }

  // Calculate totals for hub
  const issuerCount = issuerOrder.length;
  const totalCertificateCount = certifications.length;

  // Center hub
  nodes.push({
    id: "certs-core",
    layer: "certifications",
    kind: "hub",
    emphasis: "primary",
    // Deliberately not the same string as the layer heading — the fallback
    // renders both, and identical titles read as a duplication bug.
    label: "All credentials",
    title: "All credentials",
    subtitle: `${issuerCount} issuers`,
    meta: `${totalCertificateCount} credentials`,
    position: [0, 0, 0],
    detail: {},
  });

  // Create one node per issuer
  const issuerNodeIds: string[] = [];

  for (let j = 0; j < issuerOrder.length; j++) {
    const issuer = issuerOrder[j];
    const issuerCerts = issuerGroups[issuer];
    const issuerNodeId = "issuer-" + slugify(issuer);
    issuerNodeIds.push(issuerNodeId);

    const angle = (j / issuerOrder.length) * 2 * Math.PI - Math.PI / 2;
    const x = round3(Math.cos(angle) * 7);
    const y = round3(Math.sin(angle) * 3.8);
    const z = round3(Math.sin(angle * 2) * 2);

    const count = issuerCerts.length;
    const countStr = count === 1 ? "1 credential" : `${count} credentials`;

    const emphasis: NodeEmphasis = count >= 2 ? "primary" : "normal";

    nodes.push({
      id: issuerNodeId,
      layer: "certifications",
      kind: "certification",
      emphasis,
      label: issuer,
      title: issuer,
      subtitle: "Certifications",
      meta: countStr,
      position: [x, y, z],
      detail: {
        tags: issuerCerts.map((c) => c.title),
        links: issuerCerts
          .filter((c) => c.verificationUrl)
          .map((c) => ({
            label: "Link",
            url: c.verificationUrl!,
          })),
      },
    });

    // Add membership edge from hub to issuer
    edges.push({
      from: "certs-core",
      to: issuerNodeId,
      kind: "membership",
    });
  }

  return {
    id: "certifications",
    label: "Certifications & Licenses",
    caption: "Credentials grouped by the body that issued them.",
    nodes,
    edges,
    cameraHome: [0, 2, 17],
  };
}

// ============================================================================
// Layer 6: Skills
// ============================================================================

function buildSkillsLayer(): LayerGraph {
  const nodes: MeshNode[] = [];
  const edges: MeshEdge[] = [];

  // Center hub
  const totalSkills = skillCategories.reduce(
    (sum, cat) => sum + cat.skills.length,
    0
  );

  nodes.push({
    id: "skills-core",
    layer: "skills",
    kind: "hub",
    emphasis: "primary",
    label: "Technical stack",
    title: "Technical stack",
    subtitle: `${skillCategories.length} domains`,
    meta: `${totalSkills} technologies`,
    position: [0, 0, 0],
    detail: {},
  });

  // One node per skill category
  for (let i = 0; i < skillCategories.length; i++) {
    const category = skillCategories[i];
    const angle = (i / skillCategories.length) * 2 * Math.PI;
    const x = round3(Math.cos(angle) * 6);
    const y = round3(Math.sin(angle) * 3.6);
    const z = round3(Math.sin(angle * 2) * 2.2);

    const emphasis: NodeEmphasis =
      category.key === "ai" || category.key === "backend"
        ? "primary"
        : "normal";

    nodes.push({
      id: "skills-" + category.key,
      layer: "skills",
      kind: "skillCluster",
      emphasis,
      label: category.label,
      title: category.label,
      subtitle: `${category.skills.length} technologies`,
      meta: category.key,
      position: [x, y, z],
      detail: {
        tags: category.skills,
      },
    });

    // Add membership edge from hub to this category
    edges.push({
      from: "skills-core",
      to: "skills-" + category.key,
      kind: "membership",
    });
  }

  return {
    id: "skills",
    label: "Skills",
    caption: "Eight domains, clustered by where they sit in a system.",
    nodes,
    edges,
    cameraHome: [0, 2, 14],
  };
}

// ============================================================================
// Layer 7: Contact
// ============================================================================

function buildContactLayer(): LayerGraph {
  const nodes: MeshNode[] = [];
  const edges: MeshEdge[] = [];

  // Center hub
  nodes.push({
    id: "contact-hub",
    layer: "contact",
    kind: "contact",
    emphasis: "live",
    label: "Get in touch",
    title: "Get in touch",
    subtitle: "Open to opportunities",
    meta: "vetlapavankalyan5@gmail.com",
    position: [0, 0, 0],
    detail: {
      body: "Reach out directly to discuss opportunities or collaborate on distributed systems and AI-driven products.",
    },
  });

  // One node per social profile
  for (let i = 0; i < socials.length; i++) {
    const social = socials[i];
    const angle = (i / socials.length) * 2 * Math.PI - Math.PI / 2;
    const x = round3(Math.cos(angle) * 5.5);
    const y = round3(Math.sin(angle) * 3.2);
    const z = round3(Math.sin(angle * 3) * 1.4);

    const hostname = getHostname(social.url);

    nodes.push({
      id: "social-" + social.id,
      layer: "contact",
      kind: "contact",
      emphasis: "normal",
      label: social.label,
      title: social.label,
      subtitle: hostname,
      meta: "profile",
      position: [x, y, z],
      detail: {
        links: [
          {
            label: "Open profile",
            url: social.url,
          },
        ],
      },
    });

    // Add membership edge from hub to this social
    edges.push({
      from: "contact-hub",
      to: "social-" + social.id,
      kind: "membership",
    });
  }

  return {
    id: "contact",
    label: "Contact",
    caption: "Direct line, plus every profile worth checking.",
    nodes,
    edges,
    cameraHome: [0, 1, 11],
  };
}

// ============================================================================
// Assemble all layers
// ============================================================================

export const LAYER_GRAPHS: Record<LayerId, LayerGraph> = {
  overview: buildOverviewLayer(),
  experience: buildExperienceLayer(),
  projects: buildProjectsLayer(),
  education: buildEducationLayer(),
  certifications: buildCertificationsLayer(),
  skills: buildSkillsLayer(),
  contact: buildContactLayer(),
};

/**
 * Get a layer graph by id.
 */
export function getLayerGraph(id: LayerId): LayerGraph {
  return LAYER_GRAPHS[id];
}

/**
 * Search all layers for a node by id.
 */
export function getNode(id: string): MeshNode | undefined {
  for (const layerId of LAYER_ORDER) {
    const layer = LAYER_GRAPHS[layerId];
    const node = layer.nodes.find((n) => n.id === id);
    if (node) return node;
  }
  return undefined;
}
