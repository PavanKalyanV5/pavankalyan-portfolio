// components/hero/Hero.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import { Hero } from "./Hero";

// `next/dynamic({ ssr: false })` resolves the `./HeroScene` import asynchronously
// (inside an effect), so a plain synchronous mock throw wouldn't actually fire before
// assertions run. `heroSceneSpy` lets the test wait until the mocked component has
// genuinely been invoked (and thrown) before asserting the boundary kept the rest of
// the page intact.
const heroSceneSpy = vi.fn(() => {
  throw new Error("WebGL unavailable in test environment");
});

vi.mock("./HeroScene", () => ({
  HeroScene: () => heroSceneSpy(),
}));

describe("Hero", () => {
  it("renders the tagline, open-to-work badge, and CTA buttons even if the 3D scene throws", async () => {
    render(
      <ThemeRegistry>
        <Hero />
      </ThemeRegistry>
    );

    // Wait for the dynamically-imported (mocked) HeroScene to actually render and throw.
    await waitFor(() => {
      expect(heroSceneSpy).toHaveBeenCalled();
    });

    expect(
      screen.getByText(/Software Engineer — AI-Powered Backend Systems & \.NET Full-Stack Developer/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/open to opportunities/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /resume/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });
});
