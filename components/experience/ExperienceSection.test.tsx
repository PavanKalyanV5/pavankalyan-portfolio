import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExperienceSection } from "./ExperienceSection";

describe("ExperienceSection", () => {
  it("renders the current role by default and reveals an earlier internship on click", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    fireEvent.click(screen.getByText("May 2023 – Jul 2023"));
    expect(screen.getByText(/Scora Labs/i)).toBeInTheDocument();
  });
});
