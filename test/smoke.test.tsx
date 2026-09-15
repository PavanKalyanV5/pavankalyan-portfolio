import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders every top-level section without crashing", () => {
    render(
      <ThemeRegistry>
        <HomePage />
      </ThemeRegistry>
    );
    expect(
      screen.getByRole("heading", { name: "Pavan Kalyan Vetla" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Education" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Certifications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Socials/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "vetlapavankalyan5@gmail.com" })
    ).toHaveAttribute("href", "mailto:vetlapavankalyan5@gmail.com");
  });
});
