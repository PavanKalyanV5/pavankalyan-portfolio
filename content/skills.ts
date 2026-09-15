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
