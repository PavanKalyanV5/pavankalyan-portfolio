import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/site/Hero";
import { Recruiters } from "@/components/site/Recruiters";
import { Work } from "@/components/site/Work";
import { Projects } from "@/components/site/Projects";
import { Skills } from "@/components/site/Skills";
import { Credentials } from "@/components/site/Credentials";
import { profile } from "@/content/profile";

describe("Portfolio sections render as plain HTML", () => {
  it("renders the hero with name and contact links", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email me" })).toHaveAttribute("href", `mailto:${profile.email}`);
  });

  it("renders every content section heading", () => {
    render(
      <>
        <Recruiters />
        <Work />
        <Projects />
        <Skills />
        <Credentials />
      </>,
    );
    for (const id of ["rec-h", "work-h", "projects-h", "skills-h", "cred-h"]) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
  });
});
