import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import { Header } from "./Header";

describe("Header", () => {
  it("toggles the visible mode icon when the toggle button is clicked", () => {
    render(
      <ThemeRegistry>
        <Header />
      </ThemeRegistry>
    );
    const toggle = screen.getByRole("button", { name: /toggle color mode/i });
    expect(toggle).toHaveTextContent("🌙");
    fireEvent.click(toggle);
    expect(toggle).toHaveTextContent("☀️");
    fireEvent.click(toggle);
    expect(toggle).toHaveTextContent("🌙");
  });
});
