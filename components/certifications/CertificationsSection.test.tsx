import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CertificationsSection } from "./CertificationsSection";

describe("CertificationsSection", () => {
  it("is collapsed by default and expands to show all certifications", () => {
    render(<CertificationsSection />);
    expect(screen.queryByText("Microsoft Orleans .NET")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /show all certifications/i }));
    expect(screen.getByText("Microsoft Orleans .NET")).toBeInTheDocument();
  });

  it("renders a verification link for certifications that have one", () => {
    render(<CertificationsSection />);
    fireEvent.click(screen.getByRole("button", { name: /show all certifications/i }));
    expect(screen.getAllByRole("link", { name: /verify/i })[0]).toBeInTheDocument();
  });
});
