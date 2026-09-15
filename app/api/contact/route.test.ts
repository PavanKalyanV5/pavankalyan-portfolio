import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: sendMock } };
  }),
}));

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendMock.mockReset();
    process.env.RESEND_API_KEY = "test-key";
    process.env.CONTACT_TO_EMAIL = "vetlapavankalyan5@gmail.com";
  });

  it("returns 400 when email is missing", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test", message: "Hi" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("sends an email and returns 200 for a valid payload", async () => {
    sendMock.mockResolvedValue({ data: { id: "abc" }, error: null });
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hi" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("returns 503 when RESEND_API_KEY is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hi" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error).toBeTruthy();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 503 when CONTACT_TO_EMAIL is not configured", async () => {
    delete process.env.CONTACT_TO_EMAIL;
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hi" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(503);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 for a malformed JSON body", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: "{not valid json",
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the message exceeds the length cap", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@example.com",
        message: "a".repeat(5001),
      }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the name exceeds the length cap", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "a".repeat(101),
        email: "test@example.com",
        message: "Hi",
      }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently accepts and does not send an email when the honeypot field is filled", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Bot",
        email: "bot@example.com",
        message: "Hi",
        website: "http://spam.example.com",
      }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
