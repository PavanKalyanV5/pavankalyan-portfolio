import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { sora, jetbrainsMono } from "@/app/fonts";
import { PersonSchema } from "@/components/seo/PersonSchema";
import "@/styles/global.css";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pavankalyanvetla.vercel.app").replace(/\/$/, "");

export const viewport: Viewport = {
  themeColor: "#05070E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pavan Kalyan Vetla | AI-Powered Backend & .NET Full-Stack Software Engineer",
    template: "%s · Pavan Kalyan Vetla",
  },
  description:
    "Official portfolio of Pavan Kalyan Vetla — Software Engineer in Hyderabad building agentic RAG pipelines, ML forecasting engines (LightGBM/SSA), and high-throughput distributed .NET 8 / Microsoft Orleans backends.",
  keywords: [
    "Pavan Kalyan Vetla",
    "Vetla Pavan Kalyan",
    "Pavan Kalyan",
    "Pavan Kalyan Vetla Portfolio",
    "Pavan Kalyan Vetla Software Engineer",
    "Pavan Kalyan Vetla Hyderabad",
    "Pavan Kalyan Vetla Kovalty",
    "Software Engineer Hyderabad",
    "AI Backend Engineer",
    ".NET 8 Core Developer",
    "Microsoft Orleans Developer",
    "Agentic RAG",
    "Semantic Kernel .NET",
    "Vector Search",
    "FastAPI MCP Server",
    "Domain-Driven Design (DDD)",
    "CQRS and Event Sourcing",
    "Theo Personal AI Workspace",
    "AgenticRAG",
    "Full-Stack Developer Hyderabad",
    "Azure DevOps Docker",
    "PavanKalyanV5",
  ],
  authors: [{ name: "Pavan Kalyan Vetla", url: SITE_URL }],
  creator: "Pavan Kalyan Vetla",
  publisher: "Pavan Kalyan Vetla",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: "Pavan Kalyan Vetla Portfolio",
    title: "Pavan Kalyan Vetla | AI-Powered Backend & .NET Full-Stack Software Engineer",
    description:
      "Official portfolio of Pavan Kalyan Vetla. Building agentic RAG pipelines, ML forecasting engines, and distributed .NET 8 / Microsoft Orleans backends with CQRS and Event Sourcing.",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Pavan Kalyan Vetla — Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Solo_Leveler_5",
    site: "@Solo_Leveler_5",
    title: "Pavan Kalyan Vetla | AI-Powered Backend & .NET Full-Stack Software Engineer",
    description:
      "Official portfolio of Pavan Kalyan Vetla. Building agentic RAG pipelines, ML forecasting engines, and distributed .NET 8 / Orleans backends.",
    images: [`${SITE_URL}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  classification: "Software Engineering & Artificial Intelligence Portfolio",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "TByX_cKFEHc7HQXSxBcJDncqOL_OBFv8znzK0KxjxT8",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
        <PersonSchema />
      </body>
    </html>
  );
}
