import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialsSection } from "./SocialsSection";

describe("SocialsSection", () => {
  it("renders a link for every social entry", () => {
    render(<SocialsSection />);
    expect(screen.getByRole("link", { name: /leetcode/i })).toHaveAttribute(
      "href",
      "https://leetcode.com/u/vpavankalyan/"
    );
  });
});
