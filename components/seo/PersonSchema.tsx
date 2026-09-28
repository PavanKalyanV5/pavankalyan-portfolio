import type React from "react";
import { socials } from "@/content/socials";
import { education } from "@/content/education";
import { skillCategories } from "@/content/skills";
import { certifications } from "@/content/certifications";
import { projects } from "@/content/projects";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pavankalyanvetla.vercel.app").replace(/\/$/, "");

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

  // Build projects ItemList
  const projectItems = projects.map((p, idx) => ({
    "@type": "SoftwareApplication",
    position: idx + 1,
    name: p.name,
    description: p.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    author: {
      "@id": `${SITE_URL}/#person`,
    },
    keywords: p.techStack.join(", "),
  }));

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "Pavan Kalyan Vetla | AI-Powered Backend & .NET Full-Stack Software Engineer",
        description:
          "Official portfolio and engineering chronicle of Pavan Kalyan Vetla, Software Engineer based in Hyderabad.",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#person`,
        },
        mainEntity: {
          "@id": `${SITE_URL}/#person`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Pavan Kalyan Vetla — Engineering Portfolio",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Pavan Kalyan Vetla",
        alternateName: [
          "Vetla Pavan Kalyan",
          "Pavan Kalyan",
          "PavanKalyanV5",
          "vetlapavankalyan",
        ],
        jobTitle: "Software Engineer",
        url: SITE_URL,
        description:
          "Software Engineer in Hyderabad building agentic RAG systems, ML forecasting engines (LightGBM/SSA), and distributed .NET 8 / Microsoft Orleans backends with CQRS and event sourcing.",
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
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#projects`,
        name: "Featured Software Projects by Pavan Kalyan Vetla",
        itemListElement: projectItems,
      },
    ],
  };

  const json = JSON.stringify(schemaGraph).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
