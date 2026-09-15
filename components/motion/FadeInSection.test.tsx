import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FadeInSection } from "./FadeInSection";

describe("FadeInSection", () => {
  it("renders its children without crashing", () => {
    render(
      <FadeInSection>
        <div>test content</div>
      </FadeInSection>
    );
    expect(screen.getByText("test content")).toBeInTheDocument();
  });
});
