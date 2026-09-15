import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { GeneratedIcon } from "./GeneratedIcon";
import { IssuerIcon } from "./IssuerIcon";
import { hashSeed } from "./iconUtils";

describe("hashSeed", () => {
  it("is deterministic for the same input", () => {
    expect(hashSeed("theo-ai-workspace")).toBe(hashSeed("theo-ai-workspace"));
  });

  it("differs for different inputs", () => {
    expect(hashSeed("theo-ai-workspace")).not.toBe(hashSeed("agentic-rag"));
  });
});

describe("GeneratedIcon", () => {
  it("renders an svg with a consistent background fill for the same seed", () => {
    const { container: a } = render(<GeneratedIcon seed="theo-ai-workspace" glyph="ai" />);
    const { container: b } = render(<GeneratedIcon seed="theo-ai-workspace" glyph="ai" />);
    expect(a.querySelector("svg")).toBeInTheDocument();
    expect(a.querySelector("rect,circle,polygon")?.getAttribute("fill")).toBe(
      b.querySelector("rect,circle,polygon")?.getAttribute("fill")
    );
  });
});

describe("IssuerIcon", () => {
  it("renders initials derived from the issuer name", () => {
    const { getByText } = render(<IssuerIcon issuer="Google Cloud" />);
    expect(getByText("GC")).toBeInTheDocument();
  });
});
