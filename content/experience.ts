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
