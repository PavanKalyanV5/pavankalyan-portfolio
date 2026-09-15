import { Resend } from "resend";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;

  if (!payload.email || !payload.message) {
    return Response.json({ error: "Email and message are required." }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Portfolio Contact Form <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL ?? "",
    replyTo: payload.email,
    subject: `New portfolio message from ${payload.name ?? "a visitor"}`,
    text: payload.message,
  });

  if (error) {
    return Response.json({ error: "Failed to send message." }, { status: 502 });
  }

  return Response.json({ success: true }, { status: 200 });
}
