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
