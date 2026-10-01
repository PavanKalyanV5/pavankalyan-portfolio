import type { FlowConfig } from "./FlowDiagram";

/** Diagrams are drawn from each project's case study, not invented. */
export const FLOWS: Record<string, FlowConfig> = {
  "agentic-rag": {
    nodes: [
      { id: "ui", x: 10, y: 14, label: "React UI", sub: "streams answers" },
      { id: "api", x: 245, y: 14, label: ".NET 8 WebAPI", sub: "gateway", accent: true },
      { id: "mq", x: 480, y: 14, label: "RabbitMQ", sub: "event bus" },
      { id: "db", x: 245, y: 140, label: "ChromaDB", sub: "vector store" },
      { id: "worker", x: 480, y: 140, label: "Semantic Kernel", sub: "chunk and embed worker" },
    ],
    edges: ["M160 41 H245", "M395 41 H480", "M555 68 V140", "M480 167 H395", "M320 140 V68"],
    route: "M85 41 H320 H555 V167 H320 V41",
    ariaLabel:
      "Architecture: a React UI calls a .NET 8 WebAPI gateway, which publishes to RabbitMQ. A Semantic Kernel worker consumes jobs and writes embeddings to ChromaDB, and the gateway queries ChromaDB to answer.",
    caption: "The orange packet follows one document from upload to answer.",
  },
  "theo-ai-workspace": {
    nodes: [
      { id: "clients", x: 10, y: 14, label: "Web, desktop, CLI", sub: "Yjs-wire clients" },
      { id: "gw", x: 245, y: 14, label: "Federated GraphQL", sub: "gateway", accent: true },
      { id: "neo", x: 480, y: 14, label: "Neo4j", sub: "relationship graph" },
      { id: "crdt", x: 10, y: 140, label: "Rust CRDT core", sub: "yrs real-time sync" },
      { id: "council", x: 245, y: 140, label: ".NET agent council", sub: "SQLite checkpoints" },
      { id: "llm", x: 480, y: 140, label: "LiteLLM router", sub: "Claude, GPT, Gemini" },
    ],
    edges: ["M160 41 H245", "M395 41 H480", "M320 68 V140", "M395 167 H480", "M245 167 H160", "M85 140 V68"],
    route: "M85 41 H320 V167 H555",
    ariaLabel:
      "Architecture: clients talk to a federated GraphQL gateway backed by Neo4j. The gateway calls a .NET agent council that checkpoints to SQLite and routes models through LiteLLM. A Rust CRDT core syncs edits with the clients.",
    caption: "One request travels from a client, through the council, out to a model.",
  },
  "game-intelligence-platform": {
    nodes: [
      { id: "src", x: 10, y: 14, label: "Game scripts", sub: "250,000+ lines" },
      { id: "parser", x: 245, y: 14, label: "Lexer and parser", sub: "runs in a Web Worker", accent: true },
      { id: "dag", x: 480, y: 14, label: "Immutable DAG", sub: "routes and state" },
      { id: "store", x: 10, y: 140, label: "Zustand store", sub: "persistent UI state" },
      { id: "cache", x: 245, y: 140, label: "IndexedDB cache", sub: "parse once, reload fast" },
      { id: "ui", x: 480, y: 140, label: "Route map UI", sub: "graph and search" },
    ],
    edges: ["M160 41 H245", "M395 41 H480", "M320 68 V140", "M555 68 V140", "M245 167 H160"],
    route: "M85 41 H320 V167 M320 41 H555 V167",
    ariaLabel:
      "Architecture: raw scripts go through a lexer and parser in a Web Worker and become an immutable DAG. The parse result is cached in IndexedDB, and the DAG feeds a route map UI backed by a Zustand store.",
    caption: "Parsing happens once; every later visit reads from the cache.",
  },
  "agent-loop": {
    nodes: [
      { id: "q", x: 10, y: 14, label: "Question", sub: "operational query" },
      { id: "agent", x: 245, y: 14, label: "Agent planner", sub: "Semantic Kernel", accent: true },
      { id: "ans", x: 480, y: 14, label: "Answer", sub: "grounded in sources" },
      { id: "vec", x: 10, y: 140, label: "Vector search", sub: "documents" },
      { id: "sql", x: 245, y: 140, label: "Exact lookup", sub: "structured data" },
      { id: "ml", x: 480, y: 140, label: "ML forecast", sub: "LightGBM and SSA" },
    ],
    edges: ["M160 41 H245", "M395 41 H480", "M290 68 L100 140", "M320 68 V140", "M350 68 L540 140"],
    route: "M85 41 H320 V167 M320 41 H555",
    ariaLabel:
      "The agent planner receives a question and chains three tools, vector search, an exact data lookup and an ML forecast, before returning a grounded answer.",
    caption: "The planner picks and chains tools per question instead of following one fixed path.",
  },
  "forecast-pipeline": {
    nodes: [
      { id: "data", x: 10, y: 14, label: "Operational data", sub: "SQL Server, Cosmos DB" },
      { id: "ssa", x: 245, y: 14, label: "SSA decompose", sub: "trend, cycles", accent: true },
      { id: "gbm", x: 480, y: 14, label: "LightGBM", sub: "learns the features" },
      { id: "job", x: 10, y: 140, label: "Scheduled job", sub: "runs unattended" },
      { id: "api", x: 245, y: 140, label: "FastAPI MCP", sub: "tool endpoints" },
      { id: "bot", x: 480, y: 140, label: "AI assistant", sub: "asks for projections" },
    ],
    edges: ["M160 41 H245", "M395 41 H480", "M555 68 V140", "M480 167 H395", "M245 167 H160"],
    route: "M85 41 H320 H555 V167 H85",
    ariaLabel:
      "Operational data is decomposed by SSA, learned by LightGBM, and exposed through FastAPI MCP endpoints that an AI assistant and a scheduled job both call.",
    caption: "Both the scheduled job and the chatbot read the same forecast through one API.",
  },
  "privacy-proxy": {
    nodes: [
      { id: "cc", x: 10, y: 14, label: "Claude Code", sub: "prompts, files, paths" },
      { id: "proxy", x: 245, y: 14, label: "Local proxy", sub: "redacts and restores", accent: true },
      { id: "api", x: 480, y: 14, label: "Claude API", sub: "sees labels only" },
      { id: "tools", x: 10, y: 140, label: "Your tools", sub: "get real values back" },
      { id: "rules", x: 245, y: 140, label: "Detection rules", sub: "PII, 20 secret patterns" },
      { id: "audit", x: 480, y: 140, label: "Audit trail", sub: "what was changed" },
    ],
    edges: ["M160 41 H245", "M395 41 H480", "M320 68 V140", "M395 68 L500 140", "M85 68 V140"],
    route: "M85 41 H555 H85",
    ariaLabel:
      "Claude Code sends requests through a local proxy that redacts personal data using detection rules and logs what it changed. The API sees only labels. On the way back the proxy restores the real values for your tools.",
    caption: "Out: personal data becomes labels. Back: labels become real values again.",
  },
  "interview-copilot": {
    nodes: [
      { id: "audio", x: 10, y: 14, label: "Two audio channels", sub: "loopback + mic" },
      { id: "stt", x: 245, y: 14, label: "Local speech to text", sub: "per channel", accent: true },
      { id: "q", x: 480, y: 14, label: "Question detector", sub: "finds what was asked" },
      { id: "kb", x: 10, y: 140, label: "Knowledge base", sub: "your documents" },
      { id: "llm", x: 245, y: 140, label: "Model routing", sub: "Anthropic, Gemini" },
      { id: "ui", x: 480, y: 140, label: "Overlay", sub: "points and answer" },
    ],
    edges: ["M160 41 H245", "M395 41 H480", "M555 68 V104 H320 V140", "M160 167 H245", "M395 167 H480"],
    route: "M85 41 H555 V104 H320 V167 H555",
    ariaLabel:
      "Two audio channels feed local speech recognition and a question detector. A detected question goes to model routing along with context from a local knowledge base, and the answer streams into an overlay.",
    caption: "Only the model call leaves the machine. Audio and documents stay local.",
  },
};
