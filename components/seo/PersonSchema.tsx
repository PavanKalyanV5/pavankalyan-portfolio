import type React from "react";
import { socials } from "@/content/socials";
import { education } from "@/content/education";
import { skillCategories } from "@/content/skills";
import { certifications } from "@/content/certifications";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-chi-bay-95.vercel.app").replace(/\/$/, "");

interface Person {
  "@context": string;
  "@type": string;
  name: string;
  jobTitle: string;
  url: string;
  description: string;
  email: string;
  image: string;
  address: {
    "@type": string;
    addressLocality: string;
    addressCountry: string;
  };
  sameAs: string[];
  worksFor: {
    "@type": string;
    name: string;
  };
  alumniOf: Array<{
    "@type": string;
    name: string;
  }>;
  knowsAbout: string[];
  hasCredential: Array<{
    "@type": string;
    name: string;
    credentialCategory: string;
    recognizedBy: {
      "@type": string;
      name: string;
    };
    url?: string;
  }>;
}

export function PersonSchema(): React.ReactElement {
  // Extract all skills from all categories
  const allSkills = skillCategories.reduce<string[]>((acc, category) => {
    return [...acc, ...category.skills];
  }, []);

  // Build credentials array with verification URLs
  const hasCredential = certifications.map((cert) => {
    const credential: {
      "@type": string;
      name: string;
      credentialCategory: string;
      recognizedBy: {
        "@type": string;
        name: string;
      };
      url?: string;
    } = {
      "@type": "EducationalOccupationalCredential",
      name: cert.title,
      credentialCategory: "certification",
      recognizedBy: {
        "@type": "Organization",
        name: cert.issuer,
      },
    };

    if (cert.verificationUrl) {
      credential.url = cert.verificationUrl;
    }

    return credential;
  });

  // Build alumni array from education
  const alumniOf = education.map((edu) => ({
    "@type": "EducationalOrganization",
    name: edu.institution,
  }));

  const schema: Person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pavan Kalyan Vetla",
    jobTitle: "Software Engineer",
    url: SITE_URL,
    description:
      "Software Engineer in Hyderabad building agentic RAG systems, ML forecasting engines, and distributed .NET/Orleans backends with CQRS and event sourcing.",
    email: "mailto:vetlapavankalyan5@gmail.com",
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressCountry: "IN",
    },
    sameAs: socials.map((social) => social.url),
    worksFor: {
      "@type": "Organization",
      name: "Kovalty Technologies",
    },
    alumniOf,
    knowsAbout: allSkills,
    hasCredential,
  };

  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
