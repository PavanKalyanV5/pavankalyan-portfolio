/**
 * Real-time SVG and asset resolvers using Simple Icons, SkillIcons, Devicon, DiceBear, and Google Favicons.
 */

// Simple Icons slug mappings
const SIMPLE_ICONS_MAP: Record<string, string> = {
  // Languages
  "c#": "dotnet",
  csharp: "dotnet",
  ".net": "dotnet",
  ".net core": "dotnet",
  "c++": "cplusplus",
  java: "java",
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  sql: "mysql",
  rust: "rust",
  html: "html5",
  css: "css3",

  // AI & Machine Learning
  "semantic kernel": "openai",
  rag: "openai",
  "retrieval-augmented generation (rag)": "openai",
  "vector search": "qdrant",
  "llm integration (gemini, gpt)": "googlegemini",
  "mcp server": "anthropic",
  lightgbm: "scikitlearn",
  tensorflow: "tensorflow",
  "time-series forecasting (ssa)": "scikitlearn",
  t5: "huggingface",

  // Backend & Distributed Systems
  webapi: "dotnet",
  fastapi: "fastapi",
  flask: "flask",
  orleans: "dotnet",
  swagger: "swagger",
  rabbitmq: "rabbitmq",
  graphql: "graphql",
  neo4j: "neo4j",

  // Frontend
  "react.js": "react",
  react: "react",
  redux: "redux",
  formik: "react",
  "material ui (mui)": "mui",
  nextjs: "nextdotjs",
  "next.js": "nextdotjs",
  zustand: "redux",

  // Databases
  "sql server": "microsoftsqlserver",
  mysql: "mysql",
  mongodb: "mongodb",
  "azure cosmosdb": "azurecosmosdb",

  // Cloud & DevOps
  "microsoft azure": "microsoftazure",
  azure: "microsoftazure",
  "azure devops": "azuredevops",
  docker: "docker",
  "ci/cd": "githubactions",
  aws: "amazonwebservices",
  "google cloud": "googlecloud",
  linux: "linux",

  // Tools & Version Control
  "visual studio": "visualstudio",
  "vs code": "visualstudiocode",
  "sql server management studio": "microsoftsqlserver",
  "sql developer": "oracle",
  github: "github",
  "azure repos": "azuredevops",
  postman: "postman",
  git: "git",
};

// Issuer domain mappings for favicons
const ISSUER_DOMAINS: Record<string, string> = {
  udemy: "udemy.com",
  zscaler: "zscaler.com",
  wipro: "wipro.com",
  google: "google.com",
  "google cloud": "cloud.google.com",
  coursera: "coursera.org",
  unstop: "unstop.com",
  "coding ninjas": "codingninjas.com",
  cisco: "cisco.com",
  microsoft: "microsoft.com",
  "l&t technology services": "ltts.com",
  nptel: "nptel.ac.in",
  "hack the mountains": "hackthemountains.tech",
  hackerrank: "hackerrank.com",
  aws: "aws.amazon.com",
  aicte: "aicte-india.org",
  "the sparks foundation": "thesparksfoundationsingapore.org",
  "scora labs": "scoralabs.com",
  "kovalty technologies": "kovalty.com",
  "gdsc gvp": "gdsc.community.dev",
};

// Issuer Simple Icons slug mappings
const ISSUER_SIMPLE_ICONS: Record<string, string> = {
  udemy: "udemy",
  zscaler: "zscaler",
  wipro: "wipro",
  google: "google",
  "google cloud": "googlecloud",
  coursera: "coursera",
  cisco: "cisco",
  microsoft: "microsoft",
  hackerrank: "hackerrank",
  aws: "amazonwebservices",
  github: "github",
  linkedin: "linkedin",
  leetcode: "leetcode",
  geeksforgeeks: "geeksforgeeks",
};

/**
 * Returns a high-res SVG icon URL for a tech name from Simple Icons.
 */
export function getTechIconUrl(tech: string, color = "5EE7D6"): string | null {
  const normalized = tech.toLowerCase().trim();
  const slug = SIMPLE_ICONS_MAP[normalized];
  if (slug) {
    return `https://cdn.simpleicons.org/${slug}/${color}`;
  }
  return null;
}

/**
 * Returns an icon URL for an issuer / organization.
 */
export function getIssuerIconUrl(issuer: string, color = "8A6BFF"): string {
  const norm = issuer.toLowerCase().trim();
  const simpleSlug = ISSUER_SIMPLE_ICONS[norm];
  if (simpleSlug) {
    return `https://cdn.simpleicons.org/${simpleSlug}/${color}`;
  }

  const domain = ISSUER_DOMAINS[norm];
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }

  return `https://www.google.com/s2/favicons?domain=${norm.replace(/[^a-z0-9]/g, "")}.com&sz=64`;
}

/**
 * Generates a SkillIcons row URL for a collection of skills.
 */
export function getSkillIconsRowUrl(skills: string[]): string {
  const iconMap: Record<string, string> = {
    "c#": "cs",
    csharp: "cs",
    ".net": "dotnet",
    ".net core": "dotnet",
    python: "py",
    javascript: "js",
    typescript: "ts",
    "react.js": "react",
    react: "react",
    docker: "docker",
    azure: "azure",
    "microsoft azure": "azure",
    aws: "aws",
    mongodb: "mongodb",
    mysql: "mysql",
    fastapi: "fastapi",
    flask: "flask",
    rust: "rust",
    graphql: "graphql",
    rabbitmq: "rabbitmq",
    git: "git",
    github: "github",
    html: "html",
    css: "css",
    redux: "redux",
    tensorflow: "tensorflow",
    postman: "postman",
    linux: "linux",
  };

  const matched = skills
    .map((s) => iconMap[s.toLowerCase().trim()])
    .filter(Boolean);

  const unique = Array.from(new Set(matched));
  const list = unique.slice(0, 10).join(",");
  return `https://skillicons.dev/icons?i=${list || "dotnet,cs,azure,docker,py,react"}`;
}

/**
 * Returns Pavan's official profile photo URL.
 */
export function getCyberAvatarUrl(): string {
  return "/profile.jpg";
}

/**
 * Returns project visual metadata / preview colorway.
 */
export function getProjectVisual(projectId: string): {
  badge: string;
  gradient: string;
  iconSlug: string;
} {
  switch (projectId) {
    case "agentic-rag":
      return {
        badge: "AGENTIC_RAG // LLM_PIPELINE",
        gradient: "linear-gradient(135deg, rgba(94, 231, 214, 0.2), rgba(16, 23, 48, 0.9))",
        iconSlug: "dotnet",
      };
    case "theo-ai-workspace":
      return {
        badge: "POLYGLOT // MULTI_AGENT_COUNCIL",
        gradient: "linear-gradient(135deg, rgba(138, 107, 255, 0.2), rgba(16, 23, 48, 0.9))",
        iconSlug: "rust",
      };
    case "game-intelligence-platform":
      return {
        badge: "AST_PARSER // DETERMINISTIC_ROUTE_MAP",
        gradient: "linear-gradient(135deg, rgba(255, 179, 92, 0.2), rgba(16, 23, 48, 0.9))",
        iconSlug: "typescript",
      };
    case "news-summarization-archive":
      return {
        badge: "NLP_SUMMARIZATION // T5_TRANSFORMER",
        gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(16, 23, 48, 0.9))",
        iconSlug: "python",
      };
    default:
      return {
        badge: "ENGINEERING_PROJECT",
        gradient: "linear-gradient(135deg, rgba(94, 231, 214, 0.15), rgba(16, 23, 48, 0.9))",
        iconSlug: "github",
      };
  }
}
