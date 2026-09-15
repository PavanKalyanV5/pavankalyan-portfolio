import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { sora, jetbrainsMono } from "@/app/fonts";
import { PersonSchema } from "@/components/seo/PersonSchema";
import "@/styles/global.css";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pavankalyanvetla.vercel.app").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pavan Kalyan Vetla — Software Engineer",
    template: "%s · Pavan Kalyan Vetla",
  },
  description:
    "Software Engineer in Hyderabad building agentic RAG systems, ML forecasting engines, and distributed .NET/Orleans backends with CQRS and event sourcing.",
  keywords: [
    "Software Engineer",
    "C#",
    "Python",
    "JavaScript",
    ".NET Core",
    "Orleans",
    "Semantic Kernel",
    "RAG",
    "Vector Search",
    "Azure",
    "CQRS",
    "Event Sourcing",
    "React.js",
    "Machine Learning",
    "Hyderabad",
    "Full Stack Developer",
  ],
  authors: [{ name: "Pavan Kalyan Vetla", url: SITE_URL }],
  creator: "Pavan Kalyan Vetla",
  publisher: "Pavan Kalyan Vetla",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Pavan Kalyan Vetla",
    title: "Pavan Kalyan Vetla — Software Engineer",
    description:
      "Software Engineer in Hyderabad building agentic RAG systems, ML forecasting engines, and distributed .NET/Orleans backends with CQRS and event sourcing.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Solo_Leveler_5",
    title: "Pavan Kalyan Vetla — Software Engineer",
    description:
      "Software Engineer in Hyderabad building agentic RAG systems, ML forecasting engines, and distributed .NET/Orleans backends with CQRS and event sourcing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
        <PersonSchema />
      </body>
    </html>
  );
}
