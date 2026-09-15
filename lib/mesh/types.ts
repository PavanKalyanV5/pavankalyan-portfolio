/**
 * Shared contract between the content layer, the 3D mesh renderer, the HTML
 * overlay panels, and the no-WebGL DOM fallback. Every one of those consumes
 * `LayerGraph` and nothing else, so they can be built independently.
 */

export type LayerId =
  | "overview"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "skills"
  | "contact";

export type NodeKind =
  | "hub"
  | "role"
  | "project"
  | "education"
  | "certification"
  | "skillCluster"
  | "contact";

/**
 * Drives both colour and scale in 3D:
 *   live    -> warm amber, largest, pulsing  (the current role; at most one per layer)
 *   primary -> bright cool, large            (featured projects, degree)
 *   normal  -> cool                          (default)
 *   muted   -> dim cool, small               (long tail: older certs, compact projects)
 */
export type NodeEmphasis = "live" | "primary" | "normal" | "muted";

export interface NodeLink {
  label: string;
  url: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  credential: string;
  grade?: string;
  dateLabel: string;
}

export interface NodeDetail {
  /** Lead paragraph for the panel. */
  body?: string;
  /** Bulleted achievements / responsibilities. */
  bullets?: string[];
  /** Tech stack, skills, or grouped child items rendered as mono tokens. */
  tags?: string[];
  /** Outbound links (repo, article, credential verification). */
  links?: NodeLink[];
  /** Short annotation, e.g. "Built alongside full-time role at Kovalty". */
  note?: string;
}

export interface MeshNode {
  /** Stable id; doubles as the deterministic icon seed and the DOM element id. */
  id: string;
  layer: LayerId;
  kind: NodeKind;
  emphasis: NodeEmphasis;
  /** Short label rendered in 3D / on hover. Keep under ~24 chars. */
  label: string;
  /** Panel heading. */
  title: string;
  /** Panel subheading: organisation, tech stack, or issuer. */
  subtitle: string;
  /** Mono metadata line: date range, credential id, grade. */
  meta: string;
  /** Layout position in world space, computed by the layout functions. */
  position: [number, number, number];
  detail: NodeDetail;
}

export type EdgeKind =
  /** Chronological succession along a spine. */
  | "temporal"
  /** Ran at the same time as something else (project during a role). */
  | "concurrent"
  /** Child belongs to a cluster/hub. */
  | "membership";

export interface MeshEdge {
  from: string;
  to: string;
  kind: EdgeKind;
}

export interface LayerGraph {
  id: LayerId;
  /** Nav rail label. */
  label: string;
  /** One-line description shown when the layer is entered. */
  caption: string;
  nodes: MeshNode[];
  edges: MeshEdge[];
  /** Camera position that frames this whole layer. */
  cameraHome: [number, number, number];
}

export const LAYER_ORDER: LayerId[] = [
  "overview",
  "experience",
  "projects",
  "education",
  "certifications",
  "skills",
  "contact",
];
