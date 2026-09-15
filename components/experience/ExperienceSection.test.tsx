import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceSection } from "./ExperienceSection";

describe("ExperienceSection", () => {
  it("renders the current role and an earlier internship", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText(/Scora Labs/i)).toBeInTheDocument();
  });
});
