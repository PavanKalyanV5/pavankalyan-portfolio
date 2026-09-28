/**
 * Client-side Neural Search & Synthesis Engine for Pavan Kalyan Vetla's Portfolio.
 * Provides instant natural language AI briefings and deep-links across projects,
 * experience, distributed systems, and machine learning architecture.
 */

export interface AiSynthesisResult {
  headline: string;
  summary: string;
  keyPoints: string[];
  actionLabel: string;
  actionLayer: "overview" | "experience" | "projects" | "education" | "certifications" | "skills" | "contact";
  actionNodeId?: string;
  relatedTech: string[];
}

export const PRESET_PROMPTS = [
  "Tell me about Agentic RAG",
  "How does he use Microsoft Orleans?",
  "Show ML & forecasting models (LightGBM)",
  "Summarize production experience at Kovalty",
  "What are his cloud & security certifications?",
  "Where did Pavan graduate from?",
];

export function synthesizeNeuralAnswer(query: string): AiSynthesisResult | null {
  const q = query.toLowerCase().trim();
  if (q.length < 3) return null;

  // 1. Agentic RAG / Semantic Kernel / LLM queries
  if (
    q.includes("rag") ||
    q.includes("agentic") ||
    q.includes("semantic kernel") ||
    q.includes("vector") ||
    q.includes("llm")
  ) {
    return {
      headline: "Agentic RAG & Document Intelligence Platform",
      summary:
        "Pavan engineered a fully self-hosted document-intelligence platform on .NET 8 and Semantic Kernel that autonomously chains vector retrieval, exact data lookups, and local LLM inference without cloud dependencies.",
      keyPoints: [
        "Chains vector search, exact SQL lookups, and ML forecasting to answer complex operational queries.",
        "Built-in continuous learning feedback loop that indexes corrections into knowledge base in real-time.",
        "5 Docker microservices with RabbitMQ event-driven architecture and CQRS projections.",
      ],
      actionLabel: "Inspect AgenticRAG Project",
      actionLayer: "projects",
      actionNodeId: "proj-agentic-rag",
      relatedTech: [".NET 8", "Semantic Kernel", "Docker", "RabbitMQ", "Vector Search"],
    };
  }

  // 2. Microsoft Orleans / Virtual Actors / Distributed Systems queries
  if (
    q.includes("orleans") ||
    q.includes("actor") ||
    q.includes("distributed") ||
    q.includes("cqrs") ||
    q.includes("event sourcing") ||
    q.includes("grain")
  ) {
    return {
      headline: "Distributed Systems & Microsoft Orleans Architecture",
      summary:
        "Deep expertise in Microsoft Orleans virtual actor architectures at Kovalty Technologies, using CQRS and Event Sourcing to process complex business workflows and monitor high-volume external API calls.",
      keyPoints: [
        "Distributed usage monitoring & alerting system managing 2,450+ active Orleans actor grains.",
        "Event-driven automations using Orleans, CQRS, and Azure Queues with zero data loss.",
        "Certified in Microsoft Orleans .NET architecture with Domain-Driven Design (DDD).",
      ],
      actionLabel: "View Orleans Experience & Skills",
      actionLayer: "skills",
      actionNodeId: "skill-orleans",
      relatedTech: ["Microsoft Orleans", ".NET 8", "CQRS", "Event Sourcing", "Azure Queues"],
    };
  }

  // 3. Machine Learning / Forecasting / LightGBM / SSA queries
  if (
    q.includes("ml") ||
    q.includes("model") ||
    q.includes("forecast") ||
    q.includes("lightgbm") ||
    q.includes("ssa") ||
    q.includes("ai") ||
    q.includes("fastapi")
  ) {
    return {
      headline: "Production ML Forecasting & FastAPI MCP Server",
      summary:
        "Developed a dual-engine ML forecasting system combining LightGBM and Singular Spectrum Analysis (SSA) to project operational volumes, alongside an MCP server automating 82% of business analytics.",
      keyPoints: [
        "LightGBM & SSA time-series modeling capturing volatility, leading indicators, and seasonality.",
        "Built Model Context Protocol (MCP) Server using Python FastAPI, automating analytics by 82%.",
        "Automated ML question tagging at Scora Labs using machine learning classification.",
      ],
      actionLabel: "View AI & ML Experience",
      actionLayer: "experience",
      actionNodeId: "exp-kovalty-swe",
      relatedTech: ["LightGBM", "SSA Forecasting", "Python FastAPI", "MCP Server", "TensorFlow"],
    };
  }

  // 4. Theo AI Workspace / Rust / Polyglot queries
  if (
    q.includes("theo") ||
    q.includes("rust") ||
    q.includes("crdt") ||
    q.includes("graphql") ||
    q.includes("neo4j")
  ) {
    return {
      headline: "Theo Personal AI Workspace & CRDT Engine",
      summary:
        "A polyglot personal AI workspace unifying a Rust CRDT real-time sync core, .NET multi-agent orchestration council, and a federated GraphQL gateway.",
      keyPoints: [
        "Intelligent Council multi-agent orchestration with durable SQLite checkpointing verified against process kill.",
        "Real-time collaborative editing using CRDTs (yrs, Yjs-wire-compatible) relayed via Hocuspocus.",
        "Agentic CLI (theo ask) driving background execution and multi-model routing (Claude, GPT, Gemini).",
      ],
      actionLabel: "Inspect Theo AI Workspace",
      actionLayer: "projects",
      actionNodeId: "proj-theo-ai-workspace",
      relatedTech: ["Rust", ".NET", "TypeScript", "GraphQL", "Neo4j", "CRDTs"],
    };
  }

  // 5. Kovalty Technologies / Career / Experience queries
  if (
    q.includes("kovalty") ||
    q.includes("job") ||
    q.includes("work") ||
    q.includes("experience") ||
    q.includes("career") ||
    q.includes("company")
  ) {
    return {
      headline: "Software Engineer @ Kovalty Technologies",
      summary:
        "Full-time Software Engineer in Hyderabad delivering core systems for Location Services client. Specializes in AI-powered backends, .NET 8 microservices, and Orleans event-driven pipelines.",
      keyPoints: [
        "Delivered agentic RAG chatbot and LightGBM volume forecasting engine in production.",
        "Maintained 99.9% uptime with proactive Azure Monitor telemetry; deployed 5+ hotfixes.",
        "Refactored 250+ frontend files and delivered >95% of user stories within sprint deadlines.",
      ],
      actionLabel: "View Kovalty Technologies Experience",
      actionLayer: "experience",
      actionNodeId: "exp-kovalty-swe",
      relatedTech: [".NET 8", "Azure", "Semantic Kernel", "Orleans", "SQL Server", "Cosmos DB"],
    };
  }

  // 6. Education / University / College queries
  if (
    q.includes("education") ||
    q.includes("college") ||
    q.includes("degree") ||
    q.includes("btech") ||
    q.includes("university") ||
    q.includes("gvp") ||
    q.includes("cgpa")
  ) {
    return {
      headline: "B.Tech in Computer Science @ GVPCE (CGPA: 9.19)",
      summary:
        "Graduated with a Bachelor of Technology in Computer Science from Gayatri Vidya Parishad College of Engineering (Autonomous), Visakhapatnam, graduating with an outstanding 9.19 CGPA.",
      keyPoints: [
        "B.Tech Computer Science (2020 – 2024) with 9.19 CGPA.",
        "Machine Learning Team Lead at Google Developer Student Clubs (GDSC).",
        "Final year capstone: News Summarization Archive using React, Python, MongoDB, and T5.",
      ],
      actionLabel: "View Education Details",
      actionLayer: "education",
      actionNodeId: "edu-gvp-btech",
      relatedTech: ["Computer Science", "Algorithms", "AST Parsing", "Machine Learning"],
    };
  }

  // 7. Certifications / Cloud / Zscaler queries
  if (
    q.includes("cert") ||
    q.includes("cloud") ||
    q.includes("aws") ||
    q.includes("azure") ||
    q.includes("zscaler") ||
    q.includes("security")
  ) {
    return {
      headline: "24 Accredited Industry Certifications",
      summary:
        "Certified in Cloud Architecture, Cybersecurity, and Data Science across AWS, Microsoft Azure, Zscaler Zero Trust, Google Cloud, and Oracle.",
      keyPoints: [
        "Zero Trust Certified Associate (ZTCA) & Cybersecurity Fundamentals from Zscaler.",
        "Microsoft Orleans .NET Certified Architecture Specialist.",
        "AWS Cloud & Machine Learning Foundations Graduate.",
      ],
      actionLabel: "View All 24 Certificates",
      actionLayer: "certifications",
      actionNodeId: "certs-core",
      relatedTech: ["AWS", "Microsoft Azure", "Zscaler Zero Trust", "Google Cloud", "Java Full Stack"],
    };
  }

  // 8. Contact / Email / Hire queries
  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("hire") ||
    q.includes("message") ||
    q.includes("phone") ||
    q.includes("reach")
  ) {
    return {
      headline: "Contact & Collaboration Transmission",
      summary:
        "Pavan is currently based in Hyderabad, India and open to engineering roles, technical consultations, and distributed backend opportunities.",
      keyPoints: [
        "Email: vetlapavankalyan5@gmail.com (Fastest response).",
        "LinkedIn: linkedin.com/in/vpavankalyan",
        "GitHub: github.com/PavanKalyanV5",
      ],
      actionLabel: "Open Message Transmission Form",
      actionLayer: "contact",
      actionNodeId: "contact-form",
      relatedTech: ["Email", "LinkedIn", "GitHub", "LeetCode"],
    };
  }

  return null;
}
