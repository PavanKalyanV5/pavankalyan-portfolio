import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StaticPortfolio } from "@/components/fallback/StaticPortfolio";

describe("Static Portfolio Fallback", () => {
  it("renders the fallback portfolio with all content layers", () => {
    render(<StaticPortfolio />);

    // Assert main heading
    expect(screen.getByRole("heading", { name: "Pavan Kalyan Vetla" })).toBeInTheDocument();

    // Assert the five content layer headings
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Credentials" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();

    // Assert the email link
    expect(
      screen.getByRole("link", { name: "Email" })
    ).toHaveAttribute("href", "mailto:vetlapavankalyan5@gmail.com");
  });
});
