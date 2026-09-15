import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectsSection } from "./ProjectsSection";

describe("ProjectsSection", () => {
  it("renders a featured project with its concurrent-experience annotation when selected", () => {
    render(<ProjectsSection />);
    fireEvent.click(screen.getAllByText("Jun 2025 – Present")[0]);
    expect(screen.getByText("Theo Personal AI Workspace")).toBeInTheDocument();
    expect(
      screen.getByText(/Built alongside full-time Software Engineer role at Kovalty Technologies/i)
    ).toBeInTheDocument();
  });

  it("renders a compact older project without an annotation when selected", () => {
    render(<ProjectsSection />);
    fireEvent.click(screen.getAllByText("Sep 2023 – Oct 2023")[0]);
    expect(screen.getByText("Tic Tac Toe")).toBeInTheDocument();
    expect(
      screen.queryByText(/Built alongside full-time Software Engineer role at Kovalty Technologies/i)
    ).not.toBeInTheDocument();
  });
});
