import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  it("shows a validation error when submitting without an email", async () => {
    render(<ContactForm />);
    await userEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it("submits successfully and shows a confirmation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    );
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText(/name/i), "Test User");
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/message/i), "Hello there");
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => expect(screen.getByText(/message sent/i)).toBeInTheDocument());
    vi.unstubAllGlobals();
  });
});
