/**
 * Verified SVG and asset resolvers.
 * Uses bundled react-icons and verified CDN slugs with zero 404 network errors.
 */

// Verified Simple Icons CDN slugs that return HTTP 200
const VERIFIED_CDN_SLUGS: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  react: "react",
  "react.js": "react",
  fastapi: "fastapi",
  flask: "flask",
  rust: "rust",
  graphql: "graphql",
  mongodb: "mongodb",
  git: "git",
  github: "github",
  mysql: "mysql",
  postgresql: "postgresql",
  docker: "docker",
  dotnet: "dotnet",
  cplusplus: "cplusplus",
  googlecloud: "googlecloud",
};

/**
 * Returns a high-res SVG icon URL only for verified slugs.
 */
export function getTechIconUrl(tech: string, color = "5EE7D6"): string | null {
  const normalized = tech.toLowerCase().replace(/[^a-z0-9]/g, "");
  const slug = VERIFIED_CDN_SLUGS[normalized];
  if (slug) {
    return `https://cdn.simpleicons.org/${slug}/${color}`;
  }
  return null;
}

/**
 * Returns an icon URL for an issuer or null to use bundled icon.
 */
export function getIssuerIconUrl(issuer: string): string | null {
  const norm = issuer.toLowerCase().trim();
  if (norm.includes("google")) {
    return "https://cdn.simpleicons.org/googlecloud";
  }
  if (norm.includes("coursera")) {
    return "https://www.google.com/s2/favicons?domain=coursera.org&sz=64";
  }
  if (norm.includes("udemy")) {
    return "https://www.google.com/s2/favicons?domain=udemy.com&sz=64";
  }
  return null;
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
        badge: "AGENTIC_RAG // 5-STAGE PIPELINE",
        gradient: "linear-gradient(135deg, rgba(94, 231, 214, 0.15), rgba(16, 23, 48, 0.85))",
        iconSlug: "dotnet",
      };
    case "theo-ai-workspace":
      return {
        badge: "THEO_WORKSPACE // RUST + .NET 8",
        gradient: "linear-gradient(135deg, rgba(138, 107, 255, 0.15), rgba(16, 23, 48, 0.85))",
        iconSlug: "rust",
      };
    case "production-ml-forecasting":
      return {
        badge: "LIGHTGBM + SSA // TIME-SERIES",
        gradient: "linear-gradient(135deg, rgba(255, 179, 92, 0.15), rgba(16, 23, 48, 0.85))",
        iconSlug: "python",
      };
    case "game-intelligence-platform":
      return {
        badge: "AST_PARSER // DETERMINISTIC_ROUTE_MAP",
        gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(16, 23, 48, 0.85))",
        iconSlug: "typescript",
      };
    default:
      return {
        badge: "ENGINEERING_SYSTEM",
        gradient: "linear-gradient(135deg, rgba(94, 231, 214, 0.12), rgba(16, 23, 48, 0.85))",
        iconSlug: "github",
      };
  }
}
