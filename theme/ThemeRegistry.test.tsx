import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeRegistry, useColorMode } from "./ThemeRegistry";

function ToggleButton() {
  const { mode, toggleMode } = useColorMode();
  return <button onClick={toggleMode}>mode: {mode}</button>;
}

const STORAGE_KEY = "portfolio-color-mode";

describe("ThemeRegistry", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to dark mode and toggles to light", () => {
    render(
      <ThemeRegistry>
        <ToggleButton />
      </ThemeRegistry>
    );
    expect(screen.getByText("mode: dark")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("mode: light")).toBeInTheDocument();
  });

  it("reads from localStorage on mount and initializes with stored mode", async () => {
    window.localStorage.setItem(STORAGE_KEY, "light");
    render(
      <ThemeRegistry>
        <ToggleButton />
      </ThemeRegistry>
    );
    await waitFor(() => {
      expect(screen.getByText("mode: light")).toBeInTheDocument();
    });
  });

  it("writes to localStorage when toggling mode", () => {
    render(
      <ThemeRegistry>
        <ToggleButton />
      </ThemeRegistry>
    );
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(null);
    fireEvent.click(screen.getByRole("button"));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("light");
    fireEvent.click(screen.getByRole("button"));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });
});
