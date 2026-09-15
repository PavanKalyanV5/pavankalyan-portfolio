import { describe, it, expect } from "vitest";
import { experience } from "./experience";
import { projects } from "./projects";
import { education } from "./education";
import { skillCategories } from "./skills";
import { certifications } from "./certifications";
import { socials } from "./socials";

describe("content data integrity", () => {
  it("has at least one experience entry with a primary tier", () => {
    expect(experience.length).toBeGreaterThan(0);
    expect(experience.some((e) => e.tier === "primary")).toBe(true);
  });

  it("has at least one featured project", () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.some((p) => p.tier === "featured")).toBe(true);
  });

  it("has education entries", () => {
    expect(education.length).toBeGreaterThan(0);
  });

  it("has skill categories with at least one skill each", () => {
    expect(skillCategories.length).toBeGreaterThan(0);
    for (const category of skillCategories) {
      expect(category.skills.length).toBeGreaterThan(0);
    }
  });

  it("has certifications", () => {
    expect(certifications.length).toBeGreaterThan(0);
  });

  it("has socials with valid URLs", () => {
    expect(socials.length).toBeGreaterThan(0);
    for (const social of socials) {
      expect(social.url.startsWith("https://")).toBe(true);
    }
  });
});
