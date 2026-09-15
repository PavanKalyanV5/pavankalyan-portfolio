# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Pavan Kalyan Vetla's portfolio site — a Next.js + MUI + React Three Fiber site hosted on Vercel, deployed from a new public GitHub repo, telling a single growth story from education through current Software Engineer work.

**Architecture:** Next.js 15 App Router with TypeScript. Content lives in typed data files under `content/`, decoupled from presentation. A deterministic, seed-based icon generator (`components/icons/`) renders a unique custom badge per skill/project/certification without hand-authoring one SVG asset per item — same seed always produces the same badge, satisfying "fully custom icon for everything" without an unbounded asset count. MUI provides theming/layout/responsiveness; Framer Motion provides motion; React Three Fiber renders one 3D hero centerpiece, isolated behind an error boundary with a static fallback so a WebGL failure can't break the page.

**Tech Stack:** Next.js 15, React 19, TypeScript, MUI 6 (`@mui/material` + Emotion), Framer Motion, `@react-three/fiber` + `@react-three/drei` + `three`, Resend (contact email), Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-15-portfolio-rebuild-design.md`

## Global Constraints

- Hosting is **Vercel**, deployed from GitHub repo **`PavanKalyanV5/pavankalyan-portfolio`** (public), auto-deploy on push to `main`.
- Dark-first Material theme with a light-mode toggle persisted to `localStorage`.
- Fully responsive: mobile, tablet, desktop breakpoints via MUI's `Grid2`/breakpoint system.
- Every skill, project, and certification-issuer icon is rendered by the shared deterministic `GeneratedIcon`/`IssuerIcon` system — never a stock brand logo, never a sourced screenshot.
- Personal/sensitive source files (`PavanKalyanVetlaResume.pdf`, `linkedinpage.html`, `certifications.html`, `experience.html`) must never be committed to the (public) repo — they are gitignored reference material only.
- No secrets (API keys, tokens) are ever written into committed files — only into `.env.local`, which is gitignored.
- Contact form requires a `RESEND_API_KEY` and `CONTACT_TO_EMAIL` environment variable, set by the user directly in Vercel's dashboard and in a local `.env.local` — never typed into chat or committed.

---

## Task 1: Project scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `.gitignore`, `.eslintrc.json`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `vitest.config.ts`, `test/setup.ts`
- Create: `test/smoke.test.tsx`
- Move: `PavanKalyanVetlaResume.pdf`, `linkedinpage.html`, `certifications.html`, `experience.html` → `research/` (gitignored)

**Interfaces:**
- Produces: a runnable `npm run dev` Next.js app and a runnable `npm test` Vitest suite that later tasks build on.

- [ ] **Step 1: Move personal reference files out of the repo root**

```bash
mkdir -p research
mv PavanKalyanVetlaResume.pdf linkedinpage.html certifications.html experience.html research/
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
.next/
out/
research/
*.pdf
.env
.env.local
.env*.local
.vercel
*.tsbuildinfo
coverage/
```

- [ ] **Step 3: Initialize `package.json` and install core dependencies**

```bash
npm init -y
npm install next@latest react@latest react-dom@latest
npm install @mui/material@latest @emotion/react@latest @emotion/styled@latest @emotion/cache@latest @emotion/server@latest
npm install framer-motion@latest three@latest @react-three/fiber@latest @react-three/drei@latest
npm install resend@latest
npm install -D typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest @types/three@latest
npm install -D eslint@latest eslint-config-next@latest
npm install -D vitest@latest @vitejs/plugin-react@latest jsdom@latest @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest
```

- [ ] **Step 4: Add scripts to `package.json`**

Edit the generated `package.json`, replacing the `"scripts"` block:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

- [ ] **Step 5: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Create `next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 7: Create `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 8: Create `app/globals.css`**

```css
html,
body {
  padding: 0;
  margin: 0;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 9: Create a minimal `app/layout.tsx` and `app/page.tsx`**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pavan Kalyan Vetla — Software Engineer",
  description:
    "Software Engineer building AI-powered backend systems and full-stack applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function HomePage() {
  return <main>Portfolio under construction.</main>;
}
```

- [ ] **Step 10: Create Vitest config and setup file**

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

```typescript
// test/setup.ts
import "@testing-library/jest-dom/vitest";

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
```

jsdom (the test environment) does not implement `window.matchMedia`. Task 7's `Hero` component calls it to detect `prefers-reduced-motion`, and Task 16's smoke test renders `Hero` too — without this polyfill, both crash with "matchMedia is not a function".

- [ ] **Step 11: Write a smoke test**

```tsx
// test/smoke.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders without crashing", () => {
    render(<HomePage />);
    expect(screen.getByText(/portfolio under construction/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 12: Verify everything runs**

```bash
npm test
npm run build
```

Expected: both commands exit 0; the test output shows 1 passed test.

- [ ] **Step 13: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts .eslintrc.json .gitignore app/ test/ vitest.config.ts
git commit -m "Scaffold Next.js + TypeScript + Vitest project"
```

---

## Task 2: GitHub repo, Vercel project, first deploy

**Files:** none (tooling/account setup only)

**Interfaces:**
- Produces: a live Vercel URL that auto-deploys on every push to `main` — later tasks push freely without further deploy setup.

- [ ] **Step 1: Install GitHub CLI and Vercel CLI**

```powershell
winget install --id GitHub.cli -e
npm install -g vercel
```

- [ ] **Step 2: Log in (interactive — run this yourself, not via an automated tool call)**

```bash
gh auth login
vercel login
```

Follow the browser-based prompts for both.

- [ ] **Step 3: Create the GitHub repo and push**

```bash
gh repo create PavanKalyanV5/pavankalyan-portfolio --public --source=. --remote=origin
git push -u origin master
```

- [ ] **Step 4: Link and deploy the Vercel project**

```bash
vercel link --yes
vercel --prod
```

Expected: command output ends with a `https://pavankalyan-portfolio-*.vercel.app` production URL.

- [ ] **Step 5: Verify the live site**

Open the printed URL in a browser. Expected: the page shows "Portfolio under construction."

- [ ] **Step 6: Confirm the GitHub → Vercel auto-deploy hook is active**

In the Vercel dashboard (vercel.com → the new project → Settings → Git), confirm the connected repo is `PavanKalyanV5/pavankalyan-portfolio` and the production branch is `master` (or rename the branch to `main` in both GitHub and Vercel settings — either is fine, just keep the plan's later `git push` commands consistent with whichever you choose).

---

## Task 3: Content data layer

**Files:**
- Create: `content/types.ts`
- Create: `content/experience.ts`
- Create: `content/projects.ts`
- Create: `content/education.ts`
- Create: `content/skills.ts`
- Create: `content/certifications.ts`
- Create: `content/socials.ts`
- Test: `content/content.test.ts`

**Interfaces:**
- Produces: `IconGlyph`, `ExperienceEntry`, `ProjectEntry`, `EducationEntry`, `SkillCategory`, `CertificationEntry`, `SocialLink` types, and populated arrays `experience`, `projects`, `education`, `skillCategories`, `certifications`, `socials` — every later section task imports directly from these files.

- [ ] **Step 1: Write the failing data-integrity test**

```typescript
// content/content.test.ts
import { describe, it, expect } from "vitest";
import { experience } from "./experience";
import { projects } from "./projects";
import { education } from "./education";
import { skillCategories } from "./skills";
import { certifications } from "./certifications";
import { socials } from "./socials";

describe("content data integrity", () => {
  it("has at least one experience entry with a primary tier", () => {
    expect(experience.length).toBeGreaterThan(0);
    expect(experience.some((e) => e.tier === "primary")).toBe(true);
  });

  it("has at least one featured project", () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.some((p) => p.tier === "featured")).toBe(true);
  });

  it("has education entries", () => {
    expect(education.length).toBeGreaterThan(0);
  });

  it("has skill categories with at least one skill each", () => {
    expect(skillCategories.length).toBeGreaterThan(0);
    for (const category of skillCategories) {
      expect(category.skills.length).toBeGreaterThan(0);
    }
  });

  it("has certifications", () => {
    expect(certifications.length).toBeGreaterThan(0);
  });

  it("has socials with valid URLs", () => {
    expect(socials.length).toBeGreaterThan(0);
    for (const social of socials) {
      expect(social.url.startsWith("https://")).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- content/content.test.ts
```

Expected: FAIL — the imported modules don't exist yet.

- [ ] **Step 3: Create `content/types.ts`**

```typescript
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
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}
```

- [ ] **Step 4: Create `content/experience.ts`**

```typescript
import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    id: "aicte-aiml",
    role: "AI-ML Intern",
    organization: "AICTE",
    location: "Virtual",
    dateLabel: "Jul 2022 – Sep 2022",
    tier: "compact",
    bullets: [
      "Completed AWS Cloud Foundations and AWS Artificial Intelligence and Machine Learning Foundations courses.",
      "Covered the basics of Computer Vision (CV) and Natural Language Processing (NLP).",
    ],
  },
  {
    id: "gdsc-ml-lead",
    role: "Machine Learning Team Lead",
    organization: "GDSC GVP",
    location: "Visakhapatnam, Andhra Pradesh, India",
    dateLabel: "Sep 2022 – Jul 2023",
    tier: "compact",
    bullets: [
      "Led the Machine Learning vertical of Google Developer Student Clubs at GVP, mentoring peers on applied ML projects.",
    ],
  },
  {
    id: "sparks-foundation",
    role: "Data Science and Business Analyst Intern",
    organization: "The Sparks Foundation",
    location: "Remote",
    dateLabel: "Nov 2022 – Dec 2022",
    tier: "compact",
    bullets: [
      "Completed assigned data science and business analytics tasks independently and on schedule.",
    ],
  },
  {
    id: "scora-labs",
    role: "Software Development Intern",
    organization: "Scora Labs Pvt Ltd",
    location: "Visakhapatnam, Andhra Pradesh, India · Hybrid",
    dateLabel: "May 2023 – Jul 2023",
    tier: "compact",
    bullets: [
      "Built a machine learning model to automatically tag assessment-platform questions with difficulty level and concept, replacing manual tagging.",
      "Integrated the model with the questions page so authors and test-takers could better navigate and identify relevant questions.",
    ],
  },
  {
    id: "aicte-zero-trust",
    role: "Zero Trust Cloud Security Virtual Internship",
    organization: "AICTE",
    location: "Visakhapatnam, Andhra Pradesh, India · Remote",
    dateLabel: "Sep 2023 – Nov 2023",
    tier: "compact",
    bullets: [
      "Completed a Zscaler-backed virtual internship covering zero trust architecture and cloud security fundamentals.",
    ],
  },
  {
    id: "kovalty-intern",
    role: "Software Engineer Intern",
    organization: "Kovalty Technologies — Client: Location Services",
    location: "Hyderabad",
    dateLabel: "Jan 2024 – Jun 2024",
    tier: "primary",
    bullets: [
      "Built core application panels (Admin, Assignment, User) using React, Redux, and Material UI.",
      "Implemented application-wide themes by refactoring reusable components across 250+ files.",
      "Performed post-deployment verifications after each release and supported T3 support operations — deployed 5+ hotfixes and maintained 99.9% uptime via proactive Azure Monitor health checks.",
    ],
  },
  {
    id: "kovalty-swe",
    role: "Software Engineer",
    organization: "Kovalty Technologies — Client: Location Services",
    location: "Hyderabad",
    dateLabel: "Jun 2024 – Present",
    tier: "primary",
    bullets: [
      "Built an agentic RAG chatbot on .NET 8 and Semantic Kernel that autonomously chains vector-search retrieval, exact data lookups, and ML-based forecasting to answer operational queries.",
      "Implemented a continuous-learning feedback loop that indexes corrections into the knowledge base in real time, with no retraining required.",
      "Developed an ML forecasting engine (LightGBM & SSA) modeling volatility, leading indicators, and seasonality to project operational volumes.",
      "Developed multiple AI/ML-powered features and an MCP Server using Python FastAPI, automating business analytics and report generation by 82%.",
      "Developed APIs and services using C# .NET 8 Core with Domain-Driven Design (DDD) against SQL Server and Azure Cosmos DB.",
      "Integrated external client servers via an API Gateway pattern to isolate core systems and improve reliability.",
      "Implemented event-driven automations on .NET Orleans using CQRS/Event-Sourcing to handle complex business rules.",
      "Built a distributed usage monitoring and alerting system on Orleans actors and Azure Queues to aggregate high-volume external API calls.",
      "Automated key business workflows via scheduled job execution services, reducing manual intervention by 78%.",
      "Delivered over 95% of assigned user stories within sprint timelines across the full Agile SDLC.",
    ],
  },
];
```

- [ ] **Step 5: Create `content/projects.ts`**

```typescript
import type { ProjectEntry } from "./types";

export const projects: ProjectEntry[] = [
  {
    id: "tic-tac-toe",
    name: "Tic Tac Toe",
    dateLabel: "Sep 2023 – Oct 2023",
    tier: "compact",
    techStack: ["HTML", "CSS", "JavaScript"],
    description:
      "An AI opponent built with the Minimax algorithm, exploring game theory through a classic game.",
    bullets: [],
    links: [],
    glyph: "game",
  },
  {
    id: "mumbai-house-price",
    name: "Mumbai House Price Prediction",
    dateLabel: "2023",
    tier: "compact",
    techStack: ["Python", "Flask", "HTML", "CSS", "JavaScript"],
    description:
      "A linear regression model predicting Mumbai house prices, deployed as a web app.",
    bullets: [],
    links: [],
    glyph: "chart",
  },
  {
    id: "stock-price-prediction",
    name: "Stock Price Prediction",
    dateLabel: "2023",
    tier: "compact",
    techStack: ["Python", "TensorFlow"],
    description:
      "Forecasts Google stock prices using a bidirectional LSTM deep learning model.",
    bullets: [],
    links: [],
    glyph: "chart",
  },
  {
    id: "youtube-clone",
    name: "YouTube Clone",
    dateLabel: "2023",
    tier: "compact",
    techStack: ["HTML", "CSS"],
    description: "A YouTube layout clone focused on CSS styling implementation.",
    bullets: [],
    links: [],
    glyph: "media",
  },
  {
    id: "amazon-clone",
    name: "Amazon Clone",
    dateLabel: "2023",
    tier: "compact",
    techStack: ["JavaScript", "HTML", "CSS"],
    description:
      "A fully functional e-commerce replica with JavaScript-driven interactivity.",
    bullets: [],
    links: [],
    glyph: "cart",
  },
  {
    id: "news-summarization-archive",
    name: "News Summarization Archive",
    dateLabel: "Nov 2023 – Apr 2024",
    tier: "featured",
    techStack: ["React.js", "Python", "MongoDB", "T5"],
    description:
      "A full-stack news reader that condenses daily news from multiple Indian sources into chronological, on-demand summaries.",
    bullets: [
      "Built the frontend in React.js and the backend in Python with MongoDB for storage.",
      "Aggregated news from multiple sources in India, presented in chronological order.",
      "Used the T5 model to summarize articles as users view them.",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/PavanKalyanV5/news-archive" },
    ],
    glyph: "news",
    concurrentWith: "Final-year capstone project, B.Tech Computer Science",
  },
  {
    id: "game-intelligence-platform",
    name: "Game Intelligence Platform",
    dateLabel: "2025 – Present",
    tier: "featured",
    techStack: ["React", "TypeScript", "Zustand", "AST Parsing"],
    description:
      "A static-analysis platform for visual novel game files, including a full per-label statement AST parser powering story-structure, route-mapping, and character-analysis tools.",
    bullets: [
      "Built a deterministic Route Map graph explorer for branching narrative structure, a semantic search engine over dialogue/content, and a per-character Dossier view.",
      "Integrated AI-generated content (walkthroughs, custom mods) grounded in parsed structural data, with a revise/feedback loop and versioned generation history.",
      "Built an IndexedDB-backed analysis cache and a persistent Zustand store, verified with an end-to-end test suite against real game files.",
    ],
    links: [],
    glyph: "game",
    concurrentWith: "Built alongside full-time Software Engineer role at Kovalty Technologies",
  },
  {
    id: "theo-ai-workspace",
    name: "Theo Personal AI Workspace",
    dateLabel: "Jun 2025 – Present",
    tier: "featured",
    techStack: ["Rust", ".NET", "TypeScript", "GraphQL", "Neo4j"],
    description:
      "A polyglot personal AI workspace unifying a Rust CRDT sync core, .NET agent orchestration, and a TypeScript content/sync service behind a federated GraphQL gateway.",
    bullets: [
      "Built an Intelligent Council multi-agent orchestration system with durable, SQLite-backed checkpointing verified against an actual process kill.",
      "Implemented real-time collaborative editing using CRDTs (yrs, Yjs-wire-compatible) relayed through a self-hosted Hocuspocus server.",
      "Built an agentic CLI (theo ask) driving background execution and checkpoint approval against the same gateway used by web/mobile clients.",
      "Integrated multi-model AI routing (Claude, GPT, Gemini) through a self-hosted LiteLLM proxy, secured via mTLS and short-lived signed JWTs.",
    ],
    links: [],
    glyph: "ai",
    concurrentWith: "Built alongside full-time Software Engineer role at Kovalty Technologies",
  },
  {
    id: "agentic-rag",
    name: "AgenticRAG",
    dateLabel: "2025",
    tier: "featured",
    techStack: [".NET", "Semantic Kernel", "Docker", "RabbitMQ"],
    description:
      "A fully self-hosted document-intelligence platform: drop in any PDF, DOCX, or Markdown file and ask questions grounded in the actual text, powered entirely by a local LLM with no cloud dependency.",
    bullets: [
      "Processes large files in the background with live progress across an API, worker, and React UI running as five Docker containers, started with one command.",
      "Built with event-driven architecture, message queues (RabbitMQ), CQRS, projections, and caching.",
    ],
    links: [
      {
        label: "Article",
        url: "https://www.linkedin.com/pulse/agenticrag-i-trained-my-ai-specific-knowledgebase-without-vetla-vsdgc/",
      },
    ],
    glyph: "ai",
    concurrentWith: "Built alongside full-time Software Engineer role at Kovalty Technologies",
  },
];
```

- [ ] **Step 6: Create `content/education.ts`**

```typescript
import type { EducationEntry } from "./types";

export const education: EducationEntry[] = [
  {
    id: "sri-chaitanya-intermediate",
    institution: "Sri Chaitanya Jr College",
    credential: "Intermediate (MPC)",
    grade: "CGPA 9.94",
    dateLabel: "2018 – 2020",
  },
  {
    id: "gvp-btech",
    institution: "Gayatri Vidya Parishad College of Engineering (Autonomous)",
    credential: "Bachelor of Technology in Computer Science",
    grade: "CGPA 9.19",
    dateLabel: "2020 – 2024",
  },
];
```

- [ ] **Step 7: Create `content/skills.ts`**

```typescript
import type { SkillCategory } from "./types";

export const skillCategories: SkillCategory[] = [
  {
    key: "languages",
    label: "Languages",
    glyph: "language",
    skills: ["C#", "C++", "Java", "Python", "JavaScript", "SQL"],
  },
  {
    key: "ai",
    label: "AI & Agentic Systems",
    glyph: "ai",
    skills: [
      "Semantic Kernel",
      "Retrieval-Augmented Generation (RAG)",
      "Vector Search",
      "LLM Integration (Gemini, GPT)",
      "MCP Server",
      "LightGBM",
      "Time-Series Forecasting (SSA)",
    ],
  },
  {
    key: "backend",
    label: "Backend Development",
    glyph: "backend",
    skills: [".NET Core", ".NET MVC", "WebAPI", "Python", "FastAPI", "Flask", "Orleans", "Swagger"],
  },
  {
    key: "frontend",
    label: "Frontend Development",
    glyph: "frontend",
    skills: ["React.js", "Redux", "Formik", "Material UI (MUI)"],
  },
  {
    key: "databases",
    label: "Databases",
    glyph: "database",
    skills: ["SQL Server", "MySQL", "MongoDB", "Azure CosmosDB"],
  },
  {
    key: "cloud",
    label: "Cloud & DevOps",
    glyph: "cloud",
    skills: ["Microsoft Azure", "Azure DevOps", "Docker", "CI/CD"],
  },
  {
    key: "patterns",
    label: "Design Patterns",
    glyph: "pattern",
    skills: ["CQRS", "Event Sourcing", "API Gateway", "DDD", "MVC", "Factory", "Singleton", "Object-Oriented Design"],
  },
  {
    key: "tools",
    label: "Tools & Workflow",
    glyph: "tool",
    skills: ["Visual Studio", "VS Code", "SQL Server Management Studio", "SQL Developer", "GitHub", "Azure Repos", "Postman"],
  },
];
```

- [ ] **Step 8: Create `content/certifications.ts`**

```typescript
import type { CertificationEntry } from "./types";

export const certifications: CertificationEntry[] = [
  {
    id: "cert-orleans",
    title: "Microsoft Orleans .NET",
    issuer: "Udemy",
    dateLabel: "Jan 2025",
    verificationUrl: "https://www.udemy.com/certificate/UC-b78fee6a-48a0-48a5-ab96-75937b574536/",
  },
  {
    id: "cert-zscaler-ztca",
    title: "Zero Trust Certified Associate (ZTCA)",
    issuer: "Zscaler",
    dateLabel: "Jan 2024 · Expires Jan 2027",
    credentialId: "9xxdrwm3j4gv",
    verificationUrl: "https://verify.skilljar.com/c/9xxdrwm3j4gv",
  },
  {
    id: "cert-wipro-talentnext",
    title: "TalentNext JAVA Full Stack",
    issuer: "Wipro",
    dateLabel: "Sep 2023",
    verificationUrl: "https://cert.diceid.com/csr/cid/YaNeGp",
  },
  {
    id: "cert-zscaler-fundamentals",
    title: "Zscaler Cybersecurity Fundamentals Associate Exam",
    issuer: "Zscaler",
    dateLabel: "Sep 2023 · Expires Sep 2026",
    credentialId: "e52p8ufsp83q",
    verificationUrl: "https://verify.skilljar.com/c/e52p8ufsp83q",
  },
  {
    id: "cert-google-data-analytics",
    title: "Google Data Analytics Certificate",
    issuer: "Google",
    dateLabel: "Aug 2023",
    credentialId: "QHYVR53L2UTP",
    verificationUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/QHYVR53L2UTP",
  },
  {
    id: "cert-unstop-ecommerce-11",
    title: "Certificate of Participation in Level 1.1: E-Commerce",
    issuer: "Unstop",
    dateLabel: "Aug 2023",
    credentialId: "23befc43-2643-4cfd-bfc3-1eb3ce8d1795",
    verificationUrl: "https://unstop.com/certificate-preview/23befc43-2643-4cfd-bfc3-1eb3ce8d1795",
  },
  {
    id: "cert-coding-ninjas-pointers",
    title: "Pointers",
    issuer: "Coding Ninjas",
    dateLabel: "",
    verificationUrl: "https://files.codingninjas.in/certi_image278661a2f5a1611585411d6f5d15075573b3c7.jpg",
  },
  {
    id: "cert-google-cloud-engineer",
    title: "Google Cloud Engineer Path",
    issuer: "Google Cloud",
    dateLabel: "Jan 2023",
    verificationUrl: "https://www.cloudskillsboost.google/public_profiles/e6fd3698-c0e3-4e0d-825b-3ccccd40465c",
  },
  {
    id: "cert-coursera-ml",
    title: "Machine Learning",
    issuer: "Coursera",
    dateLabel: "Jul 2023",
    credentialId: "TS98C9KSJJRC",
    verificationUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/TS98C9KSJJRC",
  },
  {
    id: "cert-coursera-unsupervised",
    title: "Unsupervised Learning, Recommenders, Reinforcement Learning",
    issuer: "Coursera",
    dateLabel: "Jul 2023",
    verificationUrl: "https://www.coursera.org/account/accomplishments/certificate/DBB3XZK8KVBX",
  },
  {
    id: "cert-cisco-ccna",
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco",
    dateLabel: "Jul 2023",
  },
  {
    id: "cert-cisco-cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    issuer: "Cisco",
    dateLabel: "Mar 2023",
  },
  {
    id: "cert-cisco-intro-cybersecurity",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco",
    dateLabel: "Jun 2023",
  },
  {
    id: "cert-lnt-crnn",
    title: "Cursive Handwritten Data Recognition using CRNN",
    issuer: "L&T Technology Services",
    dateLabel: "Dec 2022",
  },
  {
    id: "cert-azure-data-scientist",
    title: "Microsoft Certified: Azure Data Scientist Associate",
    issuer: "Microsoft",
    dateLabel: "Jan 2023 · Expired Jan 2024",
  },
  {
    id: "cert-nptel-dsa-java",
    title: "Data Structures and Algorithms using Java",
    issuer: "NPTEL",
    dateLabel: "Nov 2022",
  },
  {
    id: "cert-hack-the-mountains",
    title: "Hack The Mountains 3.O",
    issuer: "Hack The Mountains",
    dateLabel: "Aug 2022",
    credentialId: "4d27de0a-3ee5-417c-8497-c8bb1ce7621b",
  },
  {
    id: "cert-hackerrank-problem-solving",
    title: "Problem Solving (Basic)",
    issuer: "HackerRank",
    dateLabel: "Sep 2022",
  },
  {
    id: "cert-coursera-azure-ml-pipelines",
    title: "Machine Learning Pipelines with Azure ML Studio",
    issuer: "Coursera",
    dateLabel: "Sep 2022",
    credentialId: "TAY9ERV7NE6A",
  },
  {
    id: "cert-aws-ml-foundations",
    title: "AWS Academy Graduate — AWS Academy Machine Learning Foundations",
    issuer: "AWS",
    dateLabel: "Sep 2022",
  },
  {
    id: "cert-aws-cloud-foundations",
    title: "AWS Academy Graduate — AWS Academy Cloud Foundations",
    issuer: "AWS",
    dateLabel: "Sep 2022",
  },
  {
    id: "cert-coursera-advanced-learning-algorithms",
    title: "Advanced Learning Algorithms",
    issuer: "Coursera",
    dateLabel: "Sep 2022",
    credentialId: "5998V842M5UQ",
  },
  {
    id: "cert-coursera-supervised-ml",
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "Coursera",
    dateLabel: "Aug 2022",
    credentialId: "6QPXT224DADQ",
  },
  {
    id: "cert-unstop-ecommerce-1",
    title: "Certificate of Participation in Level 1: E-Commerce",
    issuer: "Unstop",
    dateLabel: "Jul 2022",
    credentialId: "3d590f80-918a-44ba-9507-b7afed12bdb5",
  },
];
```

- [ ] **Step 9: Create `content/socials.ts`**

```typescript
import type { SocialLink } from "./types";

export const socials: SocialLink[] = [
  { id: "github", label: "GitHub", url: "https://github.com/PavanKalyanV5" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/vpavankalyan" },
  { id: "leetcode", label: "LeetCode", url: "https://leetcode.com/u/vpavankalyan/" },
  { id: "geeksforgeeks", label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/profile/vpavankalyan" },
  { id: "code360", label: "Coding Ninjas (Code360)", url: "https://www.naukri.com/code360/profile/vpavankalyan" },
  { id: "twitter", label: "X (Twitter)", url: "https://x.com/Solo_Leveler_5" },
  {
    id: "google-cloud-skills",
    label: "Google Cloud Skills Boost",
    url: "https://www.cloudskillsboost.google/public_profiles/e6fd3698-c0e3-4e0d-825b-3ccccd40465c",
  },
];
```

- [ ] **Step 10: Run the test to verify it passes**

```bash
npm test -- content/content.test.ts
```

Expected: PASS, 6 tests.

- [ ] **Step 11: Commit**

```bash
git add content/
git commit -m "Add typed content data layer"
```

---

## Task 4: Deterministic icon system

**Files:**
- Create: `components/icons/iconUtils.ts`
- Create: `components/icons/glyphs.tsx`
- Create: `components/icons/IconBadge.tsx`
- Create: `components/icons/GeneratedIcon.tsx`
- Create: `components/icons/IssuerIcon.tsx`
- Test: `components/icons/icons.test.tsx`

**Interfaces:**
- Consumes: `IconGlyph` from `content/types.ts`.
- Produces: `<GeneratedIcon seed={string} glyph={IconGlyph} size?={number} />` and `<IssuerIcon issuer={string} size?={number} />` — every later section task (Projects, Skills, Certifications, Socials) renders icons through these two components exclusively.

- [ ] **Step 1: Write the failing tests**

```tsx
// components/icons/icons.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { GeneratedIcon } from "./GeneratedIcon";
import { IssuerIcon } from "./IssuerIcon";
import { hashSeed } from "./iconUtils";

describe("hashSeed", () => {
  it("is deterministic for the same input", () => {
    expect(hashSeed("theo-ai-workspace")).toBe(hashSeed("theo-ai-workspace"));
  });

  it("differs for different inputs", () => {
    expect(hashSeed("theo-ai-workspace")).not.toBe(hashSeed("agentic-rag"));
  });
});

describe("GeneratedIcon", () => {
  it("renders an svg with a consistent background fill for the same seed", () => {
    const { container: a } = render(<GeneratedIcon seed="theo-ai-workspace" glyph="ai" />);
    const { container: b } = render(<GeneratedIcon seed="theo-ai-workspace" glyph="ai" />);
    expect(a.querySelector("svg")).toBeInTheDocument();
    expect(a.querySelector("rect,circle,polygon")?.getAttribute("fill")).toBe(
      b.querySelector("rect,circle,polygon")?.getAttribute("fill")
    );
  });
});

describe("IssuerIcon", () => {
  it("renders initials derived from the issuer name", () => {
    const { getByText } = render(<IssuerIcon issuer="Google Cloud" />);
    expect(getByText("GC")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
npm test -- components/icons/icons.test.tsx
```

Expected: FAIL — modules don't exist yet.

- [ ] **Step 3: Create `components/icons/iconUtils.ts`**

```typescript
export function hashSeed(seed: string): number {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  return Math.abs(hash);
}

export const ACCENT_PALETTE = [
  "#4F9DFF",
  "#8A5CFF",
  "#38D9C4",
  "#FFB84F",
  "#FF6B8B",
  "#5CE1A0",
  "#E15CDB",
  "#5CC8E1",
] as const;

export type BadgeShape = "circle" | "hexagon" | "roundedSquare";

export function pickAccentColor(seed: string): string {
  return ACCENT_PALETTE[hashSeed(seed) % ACCENT_PALETTE.length];
}

export function pickShape(seed: string): BadgeShape {
  const shapes: BadgeShape[] = ["circle", "hexagon", "roundedSquare"];
  return shapes[hashSeed(seed + "-shape") % shapes.length];
}

export function pickRotation(seed: string): number {
  const rotations = [-12, 0, 12];
  return rotations[hashSeed(seed + "-rotation") % rotations.length];
}

export function initialsFor(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
```

- [ ] **Step 4: Create `components/icons/IconBadge.tsx`**

```tsx
import type { ReactNode } from "react";
import { pickAccentColor, pickShape, pickRotation } from "./iconUtils";

interface IconBadgeProps {
  seed: string;
  size?: number;
  children: (accentColor: string) => ReactNode;
}

export function IconBadge({ seed, size = 48, children }: IconBadgeProps) {
  const accentColor = pickAccentColor(seed);
  const shape = pickShape(seed);
  const rotation = pickRotation(seed);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `rotate(${rotation}deg)` }}
      role="img"
    >
      {shape === "circle" && (
        <circle cx="24" cy="24" r="22" fill={accentColor} fillOpacity="0.16" stroke={accentColor} strokeWidth="1.5" />
      )}
      {shape === "hexagon" && (
        <polygon
          points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
          fill={accentColor}
          fillOpacity="0.16"
          stroke={accentColor}
          strokeWidth="1.5"
        />
      )}
      {shape === "roundedSquare" && (
        <rect x="4" y="4" width="40" height="40" rx="10" fill={accentColor} fillOpacity="0.16" stroke={accentColor} strokeWidth="1.5" />
      )}
      <g transform={`rotate(${-rotation})`} style={{ transformOrigin: "24px 24px" }}>
        {children(accentColor)}
      </g>
    </svg>
  );
}
```

- [ ] **Step 5: Create `components/icons/glyphs.tsx`**

```tsx
import type { ReactNode } from "react";
import type { IconGlyph } from "@/content/types";

type GlyphRenderer = (color: string) => ReactNode;

export const glyphs: Record<IconGlyph, GlyphRenderer> = {
  language: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18,15 11,24 18,33" />
      <polyline points="30,15 37,24 30,33" />
    </g>
  ),
  ai: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="10" r="2" fill={color} />
      <circle cx="24" cy="38" r="2" fill={color} />
      <circle cx="10" cy="24" r="2" fill={color} />
      <circle cx="38" cy="24" r="2" fill={color} />
      <line x1="24" y1="18" x2="24" y2="12" />
      <line x1="24" y1="30" x2="24" y2="36" />
      <line x1="18" y1="24" x2="12" y2="24" />
      <line x1="30" y1="24" x2="36" y2="24" />
    </g>
  ),
  backend: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <rect x="10" y="10" width="28" height="9" rx="2" />
      <rect x="10" y="24" width="28" height="9" rx="2" />
      <circle cx="16" cy="14.5" r="1.2" fill={color} />
      <circle cx="16" cy="28.5" r="1.2" fill={color} />
    </g>
  ),
  frontend: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <rect x="8" y="11" width="32" height="24" rx="2" />
      <line x1="8" y1="18" x2="40" y2="18" />
      <circle cx="12.5" cy="14.5" r="0.9" fill={color} />
      <circle cx="16" cy="14.5" r="0.9" fill={color} />
    </g>
  ),
  database: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <ellipse cx="24" cy="13" rx="12" ry="4.5" />
      <path d="M12,13 L12,35 C12,37.5 17.4,39.5 24,39.5 C30.6,39.5 36,37.5 36,35 L36,13" />
      <path d="M12,24 C12,26.5 17.4,28.5 24,28.5 C30.6,28.5 36,26.5 36,24" />
    </g>
  ),
  cloud: (color) => (
    <g fill={color} fillOpacity="0.9">
      <circle cx="17" cy="27" r="6" />
      <circle cx="25" cy="22" r="8" />
      <circle cx="32" cy="27" r="5.5" />
      <rect x="14" y="26" width="24" height="9" rx="4.5" />
    </g>
  ),
  pattern: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <rect x="9" y="9" width="30" height="30" rx="2" strokeDasharray="4 3" />
      <line x1="9" y1="24" x2="39" y2="24" strokeDasharray="4 3" />
      <line x1="24" y1="9" x2="24" y2="39" strokeDasharray="4 3" />
    </g>
  ),
  tool: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="21" y="8" width="6" height="14" rx="2" transform="rotate(45 24 15)" />
      <rect x="12" y="26" width="20" height="8" rx="4" transform="rotate(45 22 30)" />
    </g>
  ),
  game: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="6" y="17" width="36" height="16" rx="8" />
      <line x1="14" y1="25" x2="14" y2="20" />
      <line x1="11.5" y1="22.5" x2="16.5" y2="22.5" />
      <circle cx="30" cy="22" r="1.6" fill={color} />
      <circle cx="35" cy="27" r="1.6" fill={color} />
    </g>
  ),
  chart: (color) => (
    <g fill={color}>
      <rect x="10" y="24" width="7" height="14" />
      <rect x="20.5" y="16" width="7" height="22" />
      <rect x="31" y="10" width="7" height="28" />
    </g>
  ),
  media: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <circle cx="24" cy="24" r="15" />
      <polygon points="20,17 32,24 20,31" fill={color} stroke="none" />
    </g>
  ),
  cart: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8,10 L13,10 L18,29 L36,29 L40,15 L15,15" />
      <circle cx="20" cy="36" r="2.2" fill={color} stroke="none" />
      <circle cx="33" cy="36" r="2.2" fill={color} stroke="none" />
    </g>
  ),
  news: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="9" y="12" width="30" height="24" rx="2" />
      <line x1="14" y1="19" x2="34" y2="19" />
      <line x1="14" y1="24" x2="34" y2="24" />
      <line x1="14" y1="29" x2="26" y2="29" />
    </g>
  ),
  link: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="8" y="18" width="18" height="12" rx="6" />
      <rect x="22" y="18" width="18" height="12" rx="6" />
    </g>
  ),
};
```

- [ ] **Step 6: Create `components/icons/GeneratedIcon.tsx`**

```tsx
import { IconBadge } from "./IconBadge";
import { glyphs } from "./glyphs";
import type { IconGlyph } from "@/content/types";

interface GeneratedIconProps {
  seed: string;
  glyph: IconGlyph;
  size?: number;
}

export function GeneratedIcon({ seed, glyph, size = 48 }: GeneratedIconProps) {
  return <IconBadge seed={seed} size={size}>{(color) => glyphs[glyph](color)}</IconBadge>;
}
```

- [ ] **Step 7: Create `components/icons/IssuerIcon.tsx`**

```tsx
import { IconBadge } from "./IconBadge";
import { initialsFor } from "./iconUtils";

interface IssuerIconProps {
  issuer: string;
  size?: number;
}

export function IssuerIcon({ issuer, size = 48 }: IssuerIconProps) {
  return (
    <IconBadge seed={issuer} size={size}>
      {(color) => (
        <text
          x="24"
          y="24"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="14"
          fontWeight="700"
          fill={color}
        >
          {initialsFor(issuer)}
        </text>
      )}
    </IconBadge>
  );
}
```

- [ ] **Step 8: Run the tests to verify they pass**

```bash
npm test -- components/icons/icons.test.tsx
```

Expected: PASS, 4 tests.

- [ ] **Step 9: Commit**

```bash
git add components/icons/
git commit -m "Add deterministic seed-based icon generation system"
```

---

## Task 5: MUI theme system

**Files:**
- Create: `theme/theme.ts`
- Create: `theme/ThemeRegistry.tsx`
- Test: `theme/ThemeRegistry.test.tsx`

**Interfaces:**
- Produces: `getTheme(mode: "light" | "dark")` and `<ThemeRegistry>{children}</ThemeRegistry>` (wraps the app, exposes a `useColorMode()` hook returning `{ mode, toggleMode }`) — Task 6's layout and header consume `ThemeRegistry`/`useColorMode`.

- [ ] **Step 1: Write the failing test**

```tsx
// theme/ThemeRegistry.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeRegistry, useColorMode } from "./ThemeRegistry";

function ToggleButton() {
  const { mode, toggleMode } = useColorMode();
  return <button onClick={toggleMode}>mode: {mode}</button>;
}

describe("ThemeRegistry", () => {
  it("defaults to dark mode and toggles to light", () => {
    render(
      <ThemeRegistry>
        <ToggleButton />
      </ThemeRegistry>
    );
    expect(screen.getByText("mode: dark")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("mode: light")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- theme/ThemeRegistry.test.tsx
```

Expected: FAIL — module doesn't exist yet.

- [ ] **Step 3: Create `theme/theme.ts`**

```typescript
import { createTheme, type ThemeOptions } from "@mui/material/styles";

const shared: ThemeOptions = {
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-sans, 'Inter', system-ui, sans-serif)",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
  },
};

export function getTheme(mode: "light" | "dark") {
  return createTheme({
    ...shared,
    palette:
      mode === "dark"
        ? {
            mode: "dark",
            background: { default: "#0B0E14", paper: "#12161F" },
            primary: { main: "#4F9DFF" },
            secondary: { main: "#8A5CFF" },
          }
        : {
            mode: "light",
            background: { default: "#F7F8FA", paper: "#FFFFFF" },
            primary: { main: "#2E6FE0" },
            secondary: { main: "#6A3FE0" },
          },
  });
}
```

- [ ] **Step 4: Create `theme/ThemeRegistry.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";

type Mode = "light" | "dark";

interface ColorModeContextValue {
  mode: Mode;
  toggleMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

const STORAGE_KEY = "portfolio-color-mode";

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) throw new Error("useColorMode must be used within ThemeRegistry");
  return context;
}

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (stored === "light" || stored === "dark") setMode(stored);
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const theme = useMemo(() => getTheme(mode), [mode]);
  const contextValue = useMemo(() => ({ mode, toggleMode }), [mode]);

  return (
    <ColorModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test -- theme/ThemeRegistry.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 6: Commit**

```bash
git add theme/
git commit -m "Add dark-first MUI theme system with persisted toggle"
```

---

## Task 6: Layout shell (Header, Footer, root layout)

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`
- Test: `components/layout/Header.test.tsx`

**Interfaces:**
- Consumes: `ThemeRegistry`, `useColorMode` from `theme/ThemeRegistry.tsx`.
- Produces: `<Header />`, `<Footer />` — consumed by `app/page.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

```tsx
// components/layout/Header.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import { Header } from "./Header";

describe("Header", () => {
  it("toggles the theme label when the toggle button is clicked", () => {
    render(
      <ThemeRegistry>
        <Header />
      </ThemeRegistry>
    );
    const toggle = screen.getByRole("button", { name: /toggle color mode/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(toggle).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/layout/Header.test.tsx
```

Expected: FAIL — `Header` doesn't exist yet.

- [ ] **Step 3: Create `components/layout/Header.tsx`**

```tsx
"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, Chip } from "@mui/material";
import { useColorMode } from "@/theme/ThemeRegistry";

export function Header() {
  const { mode, toggleMode } = useColorMode();

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(8px)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="span" fontWeight={700}>
          Pavan Kalyan Vetla
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip label="Open to opportunities" color="primary" variant="outlined" size="small" />
          <IconButton aria-label="toggle color mode" onClick={toggleMode}>
            {mode === "dark" ? "🌙" : "☀️"}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
```

- [ ] **Step 4: Create `components/layout/Footer.tsx`**

```tsx
import { Box, Typography, Container } from "@mui/material";

export function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, mt: 8, borderTop: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="md">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Pavan Kalyan Vetla. Built with Next.js, MUI, and React Three Fiber.
        </Typography>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 5: Wire `ThemeRegistry` into `app/layout.tsx`**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pavan Kalyan Vetla — Software Engineer",
  description:
    "Software Engineer building AI-powered backend systems and full-stack applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

```bash
npm test -- components/layout/Header.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 7: Commit**

```bash
git add components/layout/ app/layout.tsx
git commit -m "Add responsive header/footer shell wired to theme toggle"
```

---

## Task 7: Hero section with 3D centerpiece

**Files:**
- Create: `components/hero/HeroFallback.tsx`
- Create: `components/hero/HeroErrorBoundary.tsx`
- Create: `components/hero/HeroScene.tsx`
- Create: `components/hero/Hero.tsx`
- Test: `components/hero/Hero.test.tsx`

**Interfaces:**
- Produces: `<Hero />` — consumed by `app/page.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

```tsx
// components/hero/Hero.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import { Hero } from "./Hero";

vi.mock("./HeroScene", () => ({
  HeroScene: () => {
    throw new Error("WebGL unavailable in test environment");
  },
}));

describe("Hero", () => {
  it("renders the tagline, open-to-work badge, and CTA buttons even if the 3D scene throws", () => {
    render(
      <ThemeRegistry>
        <Hero />
      </ThemeRegistry>
    );
    expect(
      screen.getByText(/Software Engineer — AI-Powered Backend Systems & \.NET Full-Stack Developer/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/open to opportunities/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /resume/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/hero/Hero.test.tsx
```

Expected: FAIL — modules don't exist yet.

- [ ] **Step 3: Create `components/hero/HeroFallback.tsx`**

```tsx
import { Box } from "@mui/material";

export function HeroFallback() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 30% 30%, #8A5CFF33, transparent 60%), radial-gradient(circle at 70% 70%, #4F9DFF33, transparent 60%)",
      }}
      aria-hidden
    />
  );
}
```

- [ ] **Step 4: Create `components/hero/HeroErrorBoundary.tsx`**

```tsx
"use client";

import { Component, type ReactNode } from "react";
import { HeroFallback } from "./HeroFallback";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class HeroErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <HeroFallback />;
    return this.props.children;
  }
}
```

- [ ] **Step 5: Create `components/hero/HeroScene.tsx`**

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Icosahedron } from "@react-three/drei";
import { Box } from "@mui/material";

export function HeroScene() {
  return (
    <Box sx={{ position: "absolute", inset: 0 }} aria-hidden>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#4F9DFF" />
        <pointLight position={[-5, -3, 2]} intensity={0.8} color="#8A5CFF" />
        <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.5}>
          <Icosahedron args={[1.6, 1]}>
            <meshStandardMaterial color="#4F9DFF" wireframe />
          </Icosahedron>
        </Float>
      </Canvas>
    </Box>
  );
}
```

- [ ] **Step 6: Create `components/hero/Hero.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Container, Typography, Chip, Button, Stack } from "@mui/material";
import { HeroErrorBoundary } from "./HeroErrorBoundary";
import { HeroFallback } from "./HeroFallback";
import { socials } from "@/content/socials";

const HeroScene = dynamic(() => import("./HeroScene").then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function Hero() {
  const github = socials.find((s) => s.id === "github");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <Box component="section" sx={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <HeroErrorBoundary>{prefersReducedMotion ? <HeroFallback /> : <HeroScene />}</HeroErrorBoundary>
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Chip label="Open to opportunities" color="primary" sx={{ mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom fontWeight={800}>
          Pavan Kalyan Vetla
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary" gutterBottom>
          Software Engineer — AI-Powered Backend Systems & .NET Full-Stack Developer
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 4 }} flexWrap="wrap" useFlexGap>
          <Button variant="contained" size="large" href="/resume.pdf" target="_blank" rel="noopener">
            Resume
          </Button>
          <Button variant="outlined" size="large" href="#contact">
            Contact
          </Button>
          {github && (
            <Button variant="text" size="large" href={github.url} target="_blank" rel="noopener">
              GitHub
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 7: Run the test to verify it passes**

```bash
npm test -- components/hero/Hero.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 8: Commit**

```bash
git add components/hero/
git commit -m "Add hero section with error-bounded 3D centerpiece and static fallback"
```

---

## Task 8: About section

**Files:**
- Create: `components/about/About.tsx`
- Test: `components/about/About.test.tsx`

**Interfaces:**
- Produces: `<About />` — consumed by `app/page.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

```tsx
// components/about/About.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";

describe("About", () => {
  it("renders the professional summary", () => {
    render(<About />);
    expect(screen.getByText(/agentic RAG pipelines/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/about/About.test.tsx
```

Expected: FAIL — `About` doesn't exist yet.

- [ ] **Step 3: Create `components/about/About.tsx`**

```tsx
import { Container, Typography, Box } from "@mui/material";

export function About() {
  return (
    <Box component="section" id="about" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          About
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Software Engineer building AI-powered backend systems in production — from agentic
          RAG pipelines and ML forecasting engines to the distributed .NET architecture they
          run on.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Deep experience with .NET Core, .NET Orleans, and event-driven microservices,
          applying Domain-Driven Design, CQRS, and Event Sourcing to real business-scale
          problems — with full-stack React/TypeScript experience across the same systems.
        </Typography>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/about/About.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Commit**

```bash
git add components/about/
git commit -m "Add About section"
```

---

## Task 9: Generic timeline shell + Experience section

**Files:**
- Create: `components/timeline/Timeline.tsx`
- Create: `components/experience/ExperienceSection.tsx`
- Test: `components/experience/ExperienceSection.test.tsx`

**Interfaces:**
- Consumes: `experience` from `content/experience.ts`.
- Produces: `<Timeline items={TimelineItemData[]} />` (reused by Tasks 10 and 11) and `<ExperienceSection />` (consumed by `app/page.tsx` in Task 16).
- `TimelineItemData = { id: string; title: string; subtitle: string; dateLabel: string; tier: "primary" | "compact"; body: ReactNode }`.

- [ ] **Step 1: Write the failing test**

```tsx
// components/experience/ExperienceSection.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceSection } from "./ExperienceSection";

describe("ExperienceSection", () => {
  it("renders the current role and an earlier internship", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText(/Scora Labs/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/experience/ExperienceSection.test.tsx
```

Expected: FAIL — `ExperienceSection` doesn't exist yet.

- [ ] **Step 3: Create `components/timeline/Timeline.tsx`**

```tsx
import type { ReactNode } from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";

export interface TimelineItemData {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  tier: "primary" | "compact";
  body: ReactNode;
}

export function Timeline({ items }: { items: TimelineItemData[] }) {
  return (
    <Stack spacing={3}>
      {items.map((item) => (
        <Paper
          key={item.id}
          variant="outlined"
          sx={{
            p: item.tier === "primary" ? 4 : 2.5,
            borderColor: item.tier === "primary" ? "primary.main" : "divider",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
            <Box>
              <Typography variant={item.tier === "primary" ? "h6" : "subtitle1"} fontWeight={700}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.subtitle}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" whiteSpace="nowrap">
              {item.dateLabel}
            </Typography>
          </Stack>
          <Box sx={{ mt: 2 }}>{item.body}</Box>
        </Paper>
      ))}
    </Stack>
  );
}
```

- [ ] **Step 4: Create `components/experience/ExperienceSection.tsx`**

```tsx
import { Container, Typography, Box, List, ListItem } from "@mui/material";
import { Timeline, type TimelineItemData } from "@/components/timeline/Timeline";
import { experience } from "@/content/experience";

export function ExperienceSection() {
  const items: TimelineItemData[] = experience.map((entry) => ({
    id: entry.id,
    title: entry.role,
    subtitle: `${entry.organization} · ${entry.location}`,
    dateLabel: entry.dateLabel,
    tier: entry.tier,
    body: (
      <List dense disablePadding>
        {entry.bullets.map((bullet, index) => (
          <ListItem key={index} disableGutters sx={{ display: "list-item", listStyleType: "disc", ml: 2 }}>
            {bullet}
          </ListItem>
        ))}
      </List>
    ),
  }));

  return (
    <Box component="section" id="experience" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Experience
        </Typography>
        <Timeline items={items} />
      </Container>
    </Box>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test -- components/experience/ExperienceSection.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 6: Commit**

```bash
git add components/timeline/ components/experience/
git commit -m "Add generic Timeline shell and Experience section"
```

---

## Task 10: Projects section

**Files:**
- Create: `components/projects/ProjectsSection.tsx`
- Test: `components/projects/ProjectsSection.test.tsx`

**Interfaces:**
- Consumes: `Timeline`, `TimelineItemData` from `components/timeline/Timeline.tsx`; `projects` from `content/projects.ts`; `GeneratedIcon` from `components/icons/GeneratedIcon.tsx`.
- Produces: `<ProjectsSection />` — consumed by `app/page.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

```tsx
// components/projects/ProjectsSection.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectsSection } from "./ProjectsSection";

describe("ProjectsSection", () => {
  it("renders a featured project with its concurrent-experience annotation", () => {
    render(<ProjectsSection />);
    expect(screen.getByText("Theo Personal AI Workspace")).toBeInTheDocument();
    expect(
      screen.getByText(/Built alongside full-time Software Engineer role at Kovalty Technologies/i)
    ).toBeInTheDocument();
  });

  it("renders a compact older project without an annotation", () => {
    render(<ProjectsSection />);
    expect(screen.getByText("Tic Tac Toe")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/projects/ProjectsSection.test.tsx
```

Expected: FAIL — `ProjectsSection` doesn't exist yet.

- [ ] **Step 3: Create `components/projects/ProjectsSection.tsx`**

```tsx
import { Container, Typography, Box, Chip, Stack, Link as MuiLink } from "@mui/material";
import { Timeline, type TimelineItemData } from "@/components/timeline/Timeline";
import { GeneratedIcon } from "@/components/icons/GeneratedIcon";
import { projects } from "@/content/projects";

export function ProjectsSection() {
  const items: TimelineItemData[] = projects.map((project) => ({
    id: project.id,
    title: project.name,
    subtitle: project.techStack.join(" · "),
    dateLabel: project.dateLabel,
    tier: project.tier === "featured" ? "primary" : "compact",
    body: (
      <Box>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <GeneratedIcon seed={project.id} glyph={project.glyph} size={40} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              {project.description}
            </Typography>
            {project.concurrentWith && (
              <Chip label={project.concurrentWith} size="small" variant="outlined" sx={{ mb: 1 }} />
            )}
            {project.bullets.length > 0 && (
              <Box component="ul" sx={{ pl: 3, m: 0 }}>
                {project.bullets.map((bullet, index) => (
                  <li key={index}>
                    <Typography variant="body2" color="text.secondary">
                      {bullet}
                    </Typography>
                  </li>
                ))}
              </Box>
            )}
            {project.links.length > 0 && (
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                {project.links.map((link) => (
                  <MuiLink key={link.url} href={link.url} target="_blank" rel="noopener">
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Box>
    ),
  }));

  return (
    <Box component="section" id="projects" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Projects
        </Typography>
        <Timeline items={items} />
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/projects/ProjectsSection.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add components/projects/
git commit -m "Add Projects timeline with tiered detail and concurrent-experience annotations"
```

---

## Task 11: Education section

**Files:**
- Create: `components/education/EducationSection.tsx`
- Test: `components/education/EducationSection.test.tsx`

**Interfaces:**
- Consumes: `Timeline`, `TimelineItemData` from `components/timeline/Timeline.tsx`; `education` from `content/education.ts`.
- Produces: `<EducationSection />` — consumed by `app/page.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

```tsx
// components/education/EducationSection.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EducationSection } from "./EducationSection";

describe("EducationSection", () => {
  it("renders the B.Tech entry with its grade", () => {
    render(<EducationSection />);
    expect(screen.getByText(/Bachelor of Technology in Computer Science/i)).toBeInTheDocument();
    expect(screen.getByText(/CGPA 9.19/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/education/EducationSection.test.tsx
```

Expected: FAIL — `EducationSection` doesn't exist yet.

- [ ] **Step 3: Create `components/education/EducationSection.tsx`**

```tsx
import { Container, Typography, Box } from "@mui/material";
import { Timeline, type TimelineItemData } from "@/components/timeline/Timeline";
import { education } from "@/content/education";

export function EducationSection() {
  const items: TimelineItemData[] = education.map((entry) => ({
    id: entry.id,
    title: entry.credential,
    subtitle: entry.institution,
    dateLabel: entry.dateLabel,
    tier: "compact",
    body: (
      <Typography variant="body2" color="text.secondary">
        {entry.grade}
      </Typography>
    ),
  }));

  return (
    <Box component="section" id="education" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Education
        </Typography>
        <Timeline items={items} />
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/education/EducationSection.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Commit**

```bash
git add components/education/
git commit -m "Add Education timeline section"
```

---

## Task 12: Skills section

**Files:**
- Create: `components/skills/SkillsSection.tsx`
- Test: `components/skills/SkillsSection.test.tsx`

**Interfaces:**
- Consumes: `skillCategories` from `content/skills.ts`; `GeneratedIcon` from `components/icons/GeneratedIcon.tsx`.
- Produces: `<SkillsSection />` — consumed by `app/page.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

```tsx
// components/skills/SkillsSection.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillsSection } from "./SkillsSection";

describe("SkillsSection", () => {
  it("renders every skill category label and at least one skill from it", () => {
    render(<SkillsSection />);
    expect(screen.getByText("AI & Agentic Systems")).toBeInTheDocument();
    expect(screen.getByText("Semantic Kernel")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/skills/SkillsSection.test.tsx
```

Expected: FAIL — `SkillsSection` doesn't exist yet.

- [ ] **Step 3: Create `components/skills/SkillsSection.tsx`**

```tsx
import { Container, Typography, Box, Chip, Stack, Paper } from "@mui/material";
import { GeneratedIcon } from "@/components/icons/GeneratedIcon";
import { skillCategories } from "@/content/skills";

export function SkillsSection() {
  return (
    <Box component="section" id="skills" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Skills
        </Typography>
        <Stack spacing={3}>
          {skillCategories.map((category) => (
            <Paper key={category.key} variant="outlined" sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <GeneratedIcon seed={category.key} glyph={category.glyph} size={32} />
                <Typography variant="h6" fontWeight={700}>
                  {category.label}
                </Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                {category.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    variant="outlined"
                    sx={{ transition: "transform 0.15s ease", "&:hover": { transform: "translateY(-2px)" } }}
                  />
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/skills/SkillsSection.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Commit**

```bash
git add components/skills/
git commit -m "Add Skills section with category icons"
```

---

## Task 13: Certifications section

**Files:**
- Create: `components/certifications/CertificationsSection.tsx`
- Test: `components/certifications/CertificationsSection.test.tsx`

**Interfaces:**
- Consumes: `certifications` from `content/certifications.ts`; `IssuerIcon` from `components/icons/IssuerIcon.tsx`.
- Produces: `<CertificationsSection />` — consumed by `app/page.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

```tsx
// components/certifications/CertificationsSection.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CertificationsSection } from "./CertificationsSection";

describe("CertificationsSection", () => {
  it("is collapsed by default and expands to show all certifications", () => {
    render(<CertificationsSection />);
    expect(screen.queryByText("Microsoft Orleans .NET")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /show all certifications/i }));
    expect(screen.getByText("Microsoft Orleans .NET")).toBeInTheDocument();
  });

  it("renders a verification link for certifications that have one", () => {
    render(<CertificationsSection />);
    fireEvent.click(screen.getByRole("button", { name: /show all certifications/i }));
    expect(screen.getByRole("link", { name: /verify/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/certifications/CertificationsSection.test.tsx
```

Expected: FAIL — `CertificationsSection` doesn't exist yet.

- [ ] **Step 3: Create `components/certifications/CertificationsSection.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Container, Typography, Box, Collapse, Button, Grid, Paper, Stack, Link as MuiLink } from "@mui/material";
import { IssuerIcon } from "@/components/icons/IssuerIcon";
import { certifications } from "@/content/certifications";

export function CertificationsSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box component="section" id="certifications" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Certifications
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {certifications.length} certifications across cloud, AI/ML, security, and full-stack development.
        </Typography>
        <Button variant="outlined" onClick={() => setExpanded((prev) => !prev)} sx={{ mb: 2 }}>
          {expanded ? "Hide certifications" : "Show all certifications"}
        </Button>
        <Collapse in={expanded} unmountOnExit>
          <Grid container spacing={2}>
            {certifications.map((cert) => (
              <Grid key={cert.id} size={{ xs: 12, sm: 6 }}>
                <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <IssuerIcon issuer={cert.issuer} size={36} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {cert.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cert.issuer}
                        {cert.dateLabel ? ` · ${cert.dateLabel}` : ""}
                      </Typography>
                      {cert.verificationUrl && (
                        <MuiLink href={cert.verificationUrl} target="_blank" rel="noopener" variant="body2">
                          Verify
                        </MuiLink>
                      )}
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/certifications/CertificationsSection.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add components/certifications/
git commit -m "Add collapsible Certifications section with issuer badges"
```

---

## Task 14: Socials section

**Files:**
- Create: `components/socials/SocialsSection.tsx`
- Test: `components/socials/SocialsSection.test.tsx`

**Interfaces:**
- Consumes: `socials` from `content/socials.ts`; `GeneratedIcon` from `components/icons/GeneratedIcon.tsx`.
- Produces: `<SocialsSection />` — consumed by `app/page.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

```tsx
// components/socials/SocialsSection.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialsSection } from "./SocialsSection";

describe("SocialsSection", () => {
  it("renders a link for every social entry", () => {
    render(<SocialsSection />);
    expect(screen.getByRole("link", { name: /leetcode/i })).toHaveAttribute(
      "href",
      "https://leetcode.com/u/vpavankalyan/"
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/socials/SocialsSection.test.tsx
```

Expected: FAIL — `SocialsSection` doesn't exist yet.

- [ ] **Step 3: Create `components/socials/SocialsSection.tsx`**

```tsx
import { Container, Typography, Box, Stack, Link as MuiLink } from "@mui/material";
import { GeneratedIcon } from "@/components/icons/GeneratedIcon";
import { socials } from "@/content/socials";

export function SocialsSection() {
  return (
    <Box component="section" id="socials" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Socials & Competitive Profiles
        </Typography>
        <Stack direction="row" flexWrap="wrap" useFlexGap gap={3}>
          {socials.map((social) => (
            <MuiLink
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener"
              underline="none"
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, width: 96 }}
            >
              <GeneratedIcon seed={social.id} glyph="link" size={40} />
              <Typography variant="caption" align="center">
                {social.label}
              </Typography>
            </MuiLink>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/socials/SocialsSection.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Commit**

```bash
git add components/socials/
git commit -m "Add Socials & Competitive Profiles section"
```

---

## Task 15: Contact form and API route

**Files:**
- Create: `components/contact/ContactForm.tsx`
- Create: `app/api/contact/route.ts`
- Test: `components/contact/ContactForm.test.tsx`
- Test: `app/api/contact/route.test.ts`
- Create: `.env.local.example`

**Interfaces:**
- Produces: `<ContactForm />` (consumed by `app/page.tsx` in Task 16) and `POST /api/contact`.

- [ ] **Step 1: Write the failing client-side validation test**

```tsx
// components/contact/ContactForm.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  it("shows a validation error when submitting without an email", async () => {
    render(<ContactForm />);
    await userEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it("submits successfully and shows a confirmation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    );
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText(/name/i), "Test User");
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/message/i), "Hello there");
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => expect(screen.getByText(/message sent/i)).toBeInTheDocument());
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Write the failing API route test**

```typescript
// app/api/contact/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendMock.mockReset();
    process.env.RESEND_API_KEY = "test-key";
    process.env.CONTACT_TO_EMAIL = "vetlapavankalyan5@gmail.com";
  });

  it("returns 400 when email is missing", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test", message: "Hi" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("sends an email and returns 200 for a valid payload", async () => {
    sendMock.mockResolvedValue({ data: { id: "abc" }, error: null });
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hi" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 3: Run both tests to verify they fail**

```bash
npm test -- components/contact/ContactForm.test.tsx app/api/contact/route.test.ts
```

Expected: FAIL — neither module exists yet.

- [ ] **Step 4: Create `app/api/contact/route.ts`**

```typescript
import { Resend } from "resend";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;

  if (!payload.email || !payload.message) {
    return Response.json({ error: "Email and message are required." }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Portfolio Contact Form <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL ?? "",
    replyTo: payload.email,
    subject: `New portfolio message from ${payload.name ?? "a visitor"}`,
    text: payload.message,
  });

  if (error) {
    return Response.json({ error: "Failed to send message." }, { status: 502 });
  }

  return Response.json({ success: true }, { status: 200 });
}
```

- [ ] **Step 5: Create `components/contact/ContactForm.tsx`**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { Stack, TextField, Button, Alert } from "@mui/material";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!message.trim()) {
      setError("Message is required.");
      return;
    }

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      setError("Something went wrong sending your message. Please try again.");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return <Alert severity="success">Message sent — thanks for reaching out!</Alert>;
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2} maxWidth={480}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        multiline
        minRows={4}
        required
      />
      <Button type="submit" variant="contained" size="large">
        Send
      </Button>
    </Stack>
  );
}
```

- [ ] **Step 6: Create `.env.local.example`**

```
RESEND_API_KEY=your-resend-api-key
CONTACT_TO_EMAIL=vetlapavankalyan5@gmail.com
```

- [ ] **Step 7: Run both tests to verify they pass**

```bash
npm test -- components/contact/ContactForm.test.tsx app/api/contact/route.test.ts
```

Expected: PASS, 4 tests total.

- [ ] **Step 8: Commit**

```bash
git add components/contact/ app/api/contact/ .env.local.example
git commit -m "Add contact form with client validation and Resend-backed API route"
```

---

## Task 16: Homepage assembly and deploy verification

**Files:**
- Modify: `app/page.tsx`
- Modify: `test/smoke.test.tsx`
- Create: `public/resume.pdf` (copy from `research/PavanKalyanVetlaResume.pdf` — **not** the same as committing the original; this copy is the one intentionally published as a downloadable asset)

**Interfaces:**
- Consumes every section component built in Tasks 7–15.

- [ ] **Step 1: Copy the resume into `public/` as the downloadable asset**

```bash
mkdir -p public
cp research/PavanKalyanVetlaResume.pdf public/resume.pdf
```

- [ ] **Step 2: Assemble `app/page.tsx`**

```tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { EducationSection } from "@/components/education/EducationSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { CertificationsSection } from "@/components/certifications/CertificationsSection";
import { SocialsSection } from "@/components/socials/SocialsSection";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container, Typography, Box } from "@mui/material";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <ExperienceSection />
      <ProjectsSection />
      <EducationSection />
      <SkillsSection />
      <CertificationsSection />
      <SocialsSection />
      <Box component="section" id="contact" sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
            Contact
          </Typography>
          <ContactForm />
        </Container>
      </Box>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Update the smoke test to match the real homepage**

```tsx
// test/smoke.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders every top-level section without crashing", () => {
    render(
      <ThemeRegistry>
        <HomePage />
      </ThemeRegistry>
    );
    expect(screen.getByText("Pavan Kalyan Vetla")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Education" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Certifications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Socials/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the full test suite**

```bash
npm test
```

Expected: PASS, all tests across every task.

- [ ] **Step 5: Build and verify production build succeeds**

```bash
npm run build
```

Expected: exits 0 with no type or build errors.

- [ ] **Step 6: Commit and push**

```bash
git add app/page.tsx test/smoke.test.tsx public/resume.pdf
git commit -m "Assemble full homepage from all sections"
git push origin master
```

- [ ] **Step 7: Verify the Vercel deploy**

Wait for the Vercel dashboard to show the new deployment as "Ready," then open the production URL.

- [ ] **Step 8: Manual cross-device/browser QA (not automatable — do this by hand)**

- Open the site on a desktop browser at 1920px, 1280px, and 768px widths (resize the window or use DevTools device toolbar) — confirm the timelines, skills grid, and certifications grid reflow without overlapping text or overflowing icons.
- Open the site on an actual mobile device (or DevTools mobile emulation) — confirm the hero 3D scene either renders smoothly or the static fallback shows, and that all sections are readable without horizontal scrolling.
- Toggle light/dark mode and confirm it persists after a page refresh.
- Enable "reduce motion" in OS accessibility settings, reload, and confirm the hero shows the static fallback instead of the 3D canvas.
- Submit the contact form with a real email once `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set in the Vercel project's environment variables (Settings → Environment Variables) — confirm the email arrives.

---

## Post-launch (not part of this plan)

- Custom domain setup.
- Filling in real GitHub/live-demo links for the five older projects if the user finds them.
- Adding the remaining ~15 certifications without a captured verification link, if the user later scrolls and re-saves the LinkedIn certifications page to capture more.
