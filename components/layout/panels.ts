import type { IconGlyph } from "@/content/types";

export type PanelId =
  | "home"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "certifications"
  | "connect";

export interface PanelConfig {
  id: PanelId;
  label: string;
  glyph: IconGlyph;
}

export const PANELS: PanelConfig[] = [
  { id: "home", label: "Home", glyph: "ai" },
  { id: "experience", label: "Experience", glyph: "backend" },
  { id: "projects", label: "Projects", glyph: "game" },
  { id: "education", label: "Education", glyph: "pattern" },
  { id: "skills", label: "Skills", glyph: "tool" },
  { id: "certifications", label: "Certifications", glyph: "news" },
  { id: "connect", label: "Connect", glyph: "link" },
];

export const DEFAULT_PANEL: PanelId = "home";

export function isPanelId(value: string): value is PanelId {
  return PANELS.some((panel) => panel.id === value);
}
