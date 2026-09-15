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
});
