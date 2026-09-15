# Portfolio Rebuild — Design Spec

Date: 2026-09-15

## Goal

Rebuild Pavan Kalyan Vetla's personal portfolio from scratch (no prior source
code exists — the old site at
`https://portfolio-website-flame-gamma.vercel.app/` was deployed without a
retained repo). The new site must reflect his current status as a
professional Software Engineer (not the old "ML-enthusiast student" framing),
with a futuristic, "3dfied", Material Design visual identity, fully
responsive across devices.

## Content sources

1. **Resume** (`PavanKalyanVetlaResume.pdf`, provided in the project folder) —
   authoritative source for current experience (Kovalty Technologies — SWE
   and SWE Intern roles), skills, two flagship personal projects (Theo
   Personal AI Workspace, Game Intelligence Platform), certifications, and
   education.
2. **Old portfolio site content** (fetched from the live old URL) — five
   earlier student projects (Tic Tac Toe, Mumbai House Price Prediction,
   Stock Price Prediction, YouTube Clone, Amazon Clone), plus original
   skills/education/contact info.
3. **User-provided LinkedIn detail dump** — additional earlier
   internships/roles not on the resume: Scora Labs Pvt Ltd (Software
   Development Intern), Zero Trust Cloud Security Virtual Internship (AICTE),
   GDSC GVP (Machine Learning Team Lead), The Sparks Foundation (Data
   Science & Business Analyst Intern), AICTE AI-ML Intern — and an extended
   certifications list (25 licenses total, confirmed via LinkedIn's
   certifications detail page). Also includes a final-year college project
   not on the resume: **News Summarization Archive** (Nov 2023 – Apr 2024,
   GVP College of Engineering) — a full-stack news summarizer using React.js
   frontend, Python/MongoDB backend, and a T5 model for article summarization
   ([repo](https://github.com/PavanKalyanV5/news-archive)).
4. **LinkedIn profile scrape** (saved profile/detail pages, credential and
   project links extracted directly from the HTML) — surfaced **AgenticRAG**,
   a separate personal project not on the resume: a fully self-hosted
   document-intelligence platform (drop in PDFs/DOCX/Markdown, ask questions
   grounded in the actual text, background processing with live progress,
   powered by a local LLM, full stack — API, worker, React UI — running as
   five Docker containers via one command). Built with event-driven
   architecture, message queues (RabbitMQ), CQRS, projections, and caching.
   Dated 2025, distinct from Theo Personal AI Workspace. Described in the
   user's own
   [LinkedIn article](https://www.linkedin.com/pulse/agenticrag-i-trained-my-ai-specific-knowledgebase-without-vetla-vsdgc/).

All content is merged: current professional role leads the narrative;
earlier internships, ML-era projects, and the full certification list are
retained further down the page as growth history, not deleted.

## Narrative framing

Hero and About lead with: **"Software Engineer — AI-Powered Backend Systems
& .NET Full-Stack Developer"** (matching current LinkedIn headline wording).
The site tells one continuous story from education through early
internships/projects to the current professional role, rather than treating
the old content as replaced. A visible **"Open to opportunities"** badge
appears near the hero/contact section, reflecting current job-search status.

## Tech stack

- **Next.js 15 (App Router)**, TypeScript.
- **MUI (Material UI)** as the styling/theming system — dark-first custom
  Material theme (deep surface colors + a vibrant accent) with a light-mode
  toggle persisted to `localStorage`. Responsiveness via MUI's `Grid2` /
  breakpoint system (mobile, tablet, desktop).
- **Framer Motion** for scroll-reveal and micro-interactions.
- **React Three Fiber + drei** for a 3D interactive hero centerpiece,
  dynamically imported with `ssr: false` and lazy-loaded. Wrapped in an error
  boundary; if WebGL is unavailable or the user prefers reduced motion, a
  static gradient/illustration hero renders instead.
- Hosting: **Vercel**, deployed from a new **GitHub** repo, auto-deploy on
  push to `main`. (Chosen over GitHub Pages specifically so Next.js API
  routes — the contact form backend — work natively, no static export
  limitations.)
- Contact form: a Next.js API route using an email-sending service (e.g.
  Resend). The user will generate and set the API key themselves as a Vercel
  environment variable — it is never shared in chat or committed to the
  repo.

## Page structure (in order)

1. **Hero** — 3D centerpiece, name, tagline, "Open to opportunities" badge,
   CTA buttons (Resume, Contact, GitHub).
2. **About** — professional summary, SWE-first framing.
3. **Experience timeline** — vertical timeline (alternating sides on
   desktop, stacked on mobile). Kovalty Technologies (SWE, current; SWE
   Intern) as primary entries. Scora Labs, GDSC GVP (ML Team Lead), Sparks
   Foundation, AICTE (AI-ML Intern, Zero Trust Cloud Security) as earlier
   entries.
4. **Projects timeline** — single chronological timeline combining Theo
   Personal AI Workspace, AgenticRAG, Game Intelligence Platform, News
   Summarization Archive, and the five older student projects. Each entry
   has a **custom-built SVG illustration/icon**
   representing its theme — not a sourced screenshot or AI-generated raster
   image — so the whole timeline is visually cohesive regardless of whether
   the underlying project is public, private, or long offline.
5. **Education timeline** — same visual timeline style: B.Tech (CGPA 9.19,
   GVP College of Engineering), Intermediate (CGPA 9.94/9.96, Sri Chaitanya),
   secondary schooling entries.
6. **Skills** — grouped by category (Languages; AI & Agentic Systems;
   Backend; Frontend; Databases; Cloud & DevOps; Design Patterns; Tools).
   Every skill gets a **fully custom-illustrated icon** (not a stock brand
   logo), displayed as icon+label cards with a hover/tilt micro-interaction.
7. **Certifications** — full list (30+ entries) in a collapsible/scrollable
   panel, grouped by issuer or year. Each entry gets a **custom-illustrated
   issuer icon**, reused across that issuer's certificates, so the section
   reads as a visual badge wall rather than a plain text list.
8. **Socials & Competitive Profiles** — GitHub, LinkedIn, Twitter, LeetCode,
   GeeksforGeeks, CodingNinjas, Google Cloud Skills Boost — icon row or card
   grid.
9. **Contact** — form (API route + email service) + direct email display.
10. **Footer**.

## Data architecture

Typed content files, one per section, so future edits are data changes, not
layout changes:

- `content/experience.ts`
- `content/projects.ts`
- `content/education.ts`
- `content/skills.ts`
- `content/certifications.ts`
- `content/socials.ts`

Custom SVG illustration components live alongside the relevant content file
(e.g. `components/icons/projects/*.tsx`, `components/icons/skills/*.tsx`,
`components/icons/issuers/*.tsx`), referenced from content data by key so
adding a new project/skill/cert is: add a data entry + add/reuse an icon
component.

## Error handling & fallbacks

- 3D hero wrapped in a React error boundary; WebGL failure or
  `prefers-reduced-motion` renders a static fallback hero instead of
  breaking the page.
- Contact form validates client-side and surfaces API/send errors inline —
  no silent failures.

## Testing

- Component-level render tests (Vitest + React Testing Library) for
  content-driven sections (experience, projects, education, certifications
  render correctly from their data files).
- Manual cross-browser/device pass for the 3D hero and responsive
  breakpoints before calling the build done — WebGL and layout issues don't
  reliably show up in unit tests.

## Out of scope for this spec

- Custom domain setup (can be added post-launch once the site is live on the
  default Vercel URL).
- CMS/blog functionality — not part of the current content set.
- Exact repo name/visibility and Vercel project linking — decided during
  implementation setup, not a design concern.
