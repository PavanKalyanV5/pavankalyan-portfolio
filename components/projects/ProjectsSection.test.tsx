import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectsSection } from "./ProjectsSection";

describe("ProjectsSection", () => {
  it("renders a featured project with its concurrent-experience annotation", () => {
    render(<ProjectsSection />);
    expect(screen.getByText("Theo Personal AI Workspace")).toBeInTheDocument();
    const concurrentElements = screen.getAllByText(/Built alongside full-time Software Engineer role at Kovalty Technologies/i);
    expect(concurrentElements.length).toBeGreaterThan(0);
  });

  it("renders a compact older project without an annotation", () => {
    render(<ProjectsSection />);
    expect(screen.getByText("Tic Tac Toe")).toBeInTheDocument();
  });
});
