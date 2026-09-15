import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the home panel by default and switches panels via the sidebar", () => {
    render(
      <ThemeRegistry>
        <HomePage />
      </ThemeRegistry>
    );

    expect(screen.getByRole("heading", { name: "Pavan Kalyan Vetla" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Experience" })[0]);
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Projects" })[0]);
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Education" })[0]);
    expect(screen.getByRole("heading", { name: "Education" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Skills" })[0]);
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Certifications" })[0]);
    expect(screen.getByRole("heading", { name: "Certifications" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Connect" })[0]);
    expect(screen.getByRole("heading", { name: /Socials/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "vetlapavankalyan5@gmail.com" })
    ).toHaveAttribute("href", "mailto:vetlapavankalyan5@gmail.com");
  });
});
