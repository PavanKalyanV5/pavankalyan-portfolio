import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EducationSection } from "./EducationSection";

describe("EducationSection", () => {
  it("renders the B.Tech entry with its grade", () => {
    render(<EducationSection />);
    expect(screen.getByText(/Bachelor of Technology in Computer Science/i)).toBeInTheDocument();
    expect(screen.getByText(/CGPA 9.19/)).toBeInTheDocument();
  });
});
