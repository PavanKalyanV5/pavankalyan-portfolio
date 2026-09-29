import type { ProjectEntry } from "./types";

export const projects: ProjectEntry[] = [
  // 4 Flagship Engineering Systems
  {
    id: "agentic-rag",
    name: "AgenticRAG Platform",
    dateLabel: "2024 – 2025",
    tier: "featured",
    techStack: [".NET 8", "Semantic Kernel", "Docker", "RabbitMQ", "Vector Search"],
    description:
      "A fully self-hosted document-intelligence platform: drop in any PDF, DOCX, or Markdown file and ask questions grounded in the actual text, powered entirely by a local LLM with zero cloud vendor lock-in.",
    bullets: [
      "Chains vector-search retrieval, exact structured lookups, and ML forecasting to autonomously answer complex queries.",
      "Processes large documents asynchronously across API, worker, and React UI running as five containerized microservices.",
      "Engineered with event-driven message queues (RabbitMQ), CQRS projections, and continuous-learning feedback loops.",
    ],
    links: [
      {
        label: "Architecture Article",
        url: "https://www.linkedin.com/pulse/agenticrag-i-trained-my-ai-specific-knowledgebase-without-vetla-vsdgc/",
      },
    ],
    glyph: "ai",
    concurrentWith: "Engineered alongside full-time Software Engineer role at Kovalty Technologies",
    caseStudy: {
      problem:
        "Enterprise document Q&A systems frequently suffer from hallucinations, high cloud token costs, and data sovereignty compliance restrictions when querying proprietary contracts.",
      architecture:
        "A decoupled 5-container microservice topology: .NET 8 WebAPI gateway, RabbitMQ event bus, Python Semantic Kernel chunking worker, ChromaDB vector store, and a React streaming frontend.",
      keyDecisions: [
        "RabbitMQ over direct HTTP: Decouples file uploads from GPU-heavy embedding generation, preventing API thread exhaustion.",
        "Semantic Kernel over custom orchestration: Standardized prompt execution and planner hooks with native C# bindings.",
        "Continuous feedback loop: Corrected responses are tagged and indexed as high-priority exemplars without model fine-tuning.",
      ],
      results: [
        "42ms average semantic lookup latency across 50,000+ indexed chunk vectors.",
        "100% on-premises data isolation with zero cloud token egress costs.",
        "Handles multi-gigabyte document batches with zero job drops via resilient dead-letter queues.",
      ],
      metrics: [
        { label: "Vector Latency", value: "42ms" },
        { label: "Data Egress", value: "0 MB" },
        { label: "Containers", value: "5 Microservices" },
      ],
    },
  },
  {
    id: "theo-ai-workspace",
    name: "Theo Personal AI Workspace",
    dateLabel: "2024 – Present",
    tier: "featured",
    techStack: ["Rust", ".NET 8", "TypeScript", "GraphQL", "Neo4j", "CRDTs"],
    description:
      "A polyglot personal AI workspace unifying a high-performance Rust CRDT real-time sync core, .NET multi-agent orchestration, and a federated GraphQL gateway.",
    bullets: [
      "Built an Intelligent Council multi-agent orchestration system with durable, SQLite-backed checkpointing verified against process kill.",
      "Implemented real-time collaborative editing using Conflict-free Replicated Data Types (yrs, Yjs-wire-compatible) relayed via Hocuspocus.",
      "Engineered an agentic CLI (theo ask) driving background execution and multi-model AI routing (Claude, GPT, Gemini) through LiteLLM.",
    ],
    links: [],
    glyph: "ai",
    concurrentWith: "Independent engineering exploration in distributed multi-agent systems",
    caseStudy: {
      problem:
        "Existing AI tools isolate text editing from agent execution. Running long multi-step workflows often corrupts state when local processes crash midway.",
      architecture:
        "Rust core running yrs CRDT algorithms for byte-level text convergence, federated with .NET MediatR command bus for agent execution and Neo4j for semantic relationship mapping.",
      keyDecisions: [
        "Rust yrs over pure JS Yjs: Achieves sub-millisecond document diffing and deterministic memory consumption during large sync sessions.",
        "SQLite WAL checkpoints: Saves execution plan graphs at every tool invocation, enabling instant state resumption after process termination.",
        "mTLS proxy with LiteLLM: Rotates keys and manages provider quotas securely across Claude, GPT-4o, and Gemini.",
      ],
      results: [
        "Deterministic recovery from unexpected SIGKILL with zero state loss verified in test harness.",
        "Sub-10ms peer-to-peer conflict resolution across web, desktop, and CLI clients.",
      ],
      metrics: [
        { label: "Sync Engine", value: "Rust CRDT" },
        { label: "Recovery", value: "100% State Intact" },
        { label: "Gateway", value: "Federated GraphQL" },
      ],
    },
  },
  {
    id: "production-ml-forecasting",
    name: "Production ML Forecasting Engine",
    dateLabel: "2024 – Present",
    tier: "featured",
    techStack: ["Python", "LightGBM", "SSA Time-Series", "FastAPI", "Azure Cosmos DB"],
    description:
      "An operational time-series forecasting engine combining gradient boosted trees (LightGBM) with Singular Spectrum Analysis (SSA) to project operational volumes with volatility modeling.",
    bullets: [
      "Models trend, seasonality, and leading business indicators to forecast operational volume swings across dynamic geographic regions.",
      "Integrated into Python FastAPI MCP server, automating 82% of recurrent reporting workflows and analytics tasks.",
      "Deployed with automated scheduled execution pipelines against Azure Cosmos DB and SQL Server.",
    ],
    links: [],
    glyph: "chart",
    concurrentWith: "Built for Location Services client at Kovalty Technologies",
    caseStudy: {
      problem:
        "Manual operational forecasting for location verification services resulted in 3-day reporting lags and over-allocation of field resources during unpredicted demand surges.",
      architecture:
        "A dual-stage forecasting pipeline: SSA decomposes noisy signals into low-frequency trends and oscillatory harmonics, fed as dynamic features into LightGBM regression models.",
      keyDecisions: [
        "LightGBM + SSA over pure Deep Learning LSTM: 10x faster training cycles on tabular operational data with superior explainability for business analysts.",
        "FastAPI MCP endpoints: Enables internal AI chatbots to query projected volumes directly via standardized tool definitions.",
      ],
      results: [
        "82% reduction in manual analytical reporting intervention.",
        "Maintained 99.9% service reliability on automated scheduled runs.",
      ],
      metrics: [
        { label: "Ops Automation", value: "82%" },
        { label: "Service Uptime", value: "99.9%" },
        { label: "Architecture", value: "LightGBM + SSA" },
      ],
    },
  },
  {
    id: "game-intelligence-platform",
    name: "Game Intelligence Platform",
    dateLabel: "2024 – Present",
    tier: "featured",
    techStack: ["React", "TypeScript", "Zustand", "AST Parsing", "IndexedDB"],
    description:
      "A deterministic static-analysis platform for visual novel game scripts, featuring a full AST parser powering route-mapping graph explorers, character dossiers, and semantic dialogue search.",
    bullets: [
      "Engineered deterministic Route Map graph explorer resolving complex branching narrative conditions and state mutations.",
      "Built IndexedDB-backed AST analysis cache and persistent Zustand state verified with automated test suites.",
      "Integrated grounded AI modding walkthrough generation anchored to parsed game structure.",
    ],
    links: [],
    glyph: "game",
    concurrentWith: "Independent static-analysis & compiler engineering project",
    caseStudy: {
      problem:
        "Visual novel scripts span hundreds of thousands of lines across custom scripting languages with convoluted jump/call branches, making route tracking and state debugging nearly impossible.",
      architecture:
        "A custom recursive-descent lexer and AST parser compiling raw scripts into an immutable directed acyclic graph (DAG) cached locally via IndexedDB.",
      keyDecisions: [
        "Client-side AST compilation: Eliminates server processing costs by parsing 10MB+ game files directly in Web Workers.",
        "Persistent IndexedDB cache: Parses game libraries once and allows instant subsequent reloads.",
      ],
      results: [
        "Parses 250,000+ line dialogue scripts in under 2.2 seconds.",
        "Zero-latency search over 10,000+ branching plot decisions.",
      ],
      metrics: [
        { label: "Script Parsing", value: "<2.2s" },
        { label: "State Store", value: "IndexedDB + Zustand" },
      ],
    },
  },

  // Archive / Compact Projects (Clean understated list)
  {
    id: "news-summarization-archive",
    name: "News Summarization Archive",
    dateLabel: "Nov 2023 – Apr 2024",
    tier: "compact",
    techStack: ["React.js", "Python", "MongoDB", "T5 Transformer"],
    description:
      "A full-stack news reader aggregating Indian news sources and producing on-demand extractive summaries using the T5 transformer.",
    bullets: [
      "Built React frontend and Python/MongoDB backend.",
      "Aggregated news from multiple sources in chronological order.",
      "Used fine-tuned T5 model for real-time summarization.",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/PavanKalyanV5/news-archive" },
    ],
    glyph: "news",
    concurrentWith: "Final-year capstone project, B.Tech Computer Science",
  },
  {
    id: "stock-price-prediction",
    name: "Stock Price Prediction",
    dateLabel: "2023",
    tier: "compact",
    techStack: ["Python", "TensorFlow", "Bi-LSTM"],
    description:
      "Forecasts historical stock prices using a bidirectional LSTM recurrent neural network.",
    bullets: [],
    links: [],
    glyph: "chart",
  },
  {
    id: "mumbai-house-price",
    name: "Mumbai House Price Prediction",
    dateLabel: "2023",
    tier: "compact",
    techStack: ["Python", "Flask", "Scikit-Learn"],
    description:
      "A regression model predicting metropolitan real-estate prices based on demographic features.",
    bullets: [],
    links: [],
    glyph: "chart",
  },
  {
    id: "tic-tac-toe",
    name: "Minimax Game Engine",
    dateLabel: "2023",
    tier: "compact",
    techStack: ["JavaScript", "Minimax Algorithm"],
    description:
      "Game theory exploration implementing unbeatable Minimax state-tree decision traversal.",
    bullets: [],
    links: [],
    glyph: "game",
  },
  {
    id: "amazon-clone",
    name: "E-Commerce Frontend Replica",
    dateLabel: "2023",
    tier: "compact",
    techStack: ["JavaScript", "HTML5", "CSS3"],
    description:
      "A front-end e-commerce interface exploring cart management, catalog layout, and responsive UI.",
    bullets: [],
    links: [],
    glyph: "cart",
  },
  {
    id: "youtube-clone",
    name: "Streaming Platform UI Layout",
    dateLabel: "2023",
    tier: "compact",
    techStack: ["HTML5", "CSS3"],
    description:
      "A CSS Grid and Flexbox implementation replicating modern video streaming grid structures.",
    bullets: [],
    links: [],
    glyph: "media",
  },
];
