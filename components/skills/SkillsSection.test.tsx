import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillsSection } from "./SkillsSection";

describe("SkillsSection", () => {
  it("renders every skill category label and at least one skill from it", () => {
    render(<SkillsSection />);
    expect(screen.getByText("AI & Agentic Systems")).toBeInTheDocument();
    expect(screen.getByText("Semantic Kernel")).toBeInTheDocument();
  });
});
