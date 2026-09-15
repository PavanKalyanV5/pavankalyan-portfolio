import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";

describe("About", () => {
  it("renders the professional summary", () => {
    render(<About />);
    expect(screen.getByText(/agentic RAG pipelines/i)).toBeInTheDocument();
  });
});
