import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeRegistry, useColorMode } from "./ThemeRegistry";

function ToggleButton() {
  const { mode, toggleMode } = useColorMode();
  return <button onClick={toggleMode}>mode: {mode}</button>;
}

describe("ThemeRegistry", () => {
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
});
