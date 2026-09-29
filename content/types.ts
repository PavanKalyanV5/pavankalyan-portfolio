export type IconGlyph =
  | "language"
  | "ai"
  | "backend"
  | "frontend"
  | "database"
  | "cloud"
  | "pattern"
  | "tool"
  | "game"
  | "chart"
  | "media"
  | "cart"
  | "news"
  | "link";

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  location: string;
  dateLabel: string;
  tier: "primary" | "compact";
  bullets: string[];
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface CaseStudy {
  problem: string;
  architecture: string;
  keyDecisions: string[];
  results: string[];
  metrics?: { label: string; value: string }[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  dateLabel: string;
  tier: "featured" | "compact";
  techStack: string[];
  description: string;
  bullets: string[];
  links: ProjectLink[];
  glyph: IconGlyph;
  concurrentWith?: string;
  caseStudy?: CaseStudy;
}

export interface EducationEntry {
  id: string;
  institution: string;
  credential: string;
  grade: string;
  dateLabel: string;
}

export interface SkillCategory {
  key: string;
  label: string;
  glyph: IconGlyph;
  skills: string[];
}

export interface CertificationEntry {
  id: string;
  title: string;
  issuer: string;
  dateLabel: string;
  credentialId?: string;
  verificationUrl?: string;
  featured?: boolean;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}
