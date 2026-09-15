import { Resend } from "resend";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
}

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    return Response.json(
      { error: "Contact form is not configured yet." },
      { status: 503 }
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!payload.email || !payload.message) {
    return Response.json({ error: "Email and message are required." }, { status: 400 });
  }

  if (
    (payload.name && payload.name.length > MAX_NAME_LENGTH) ||
    payload.email.length > MAX_EMAIL_LENGTH ||
    payload.message.length > MAX_MESSAGE_LENGTH
  ) {
    return Response.json({ error: "Submission exceeds allowed length." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields humans never see. Silently accept
  // without sending anything so the bot isn't tipped off.
  if (payload.website) {
    return Response.json({ success: true }, { status: 200 });
  }

  const resend = new Resend(apiKey);
  const fromAddress =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Portfolio Contact Form <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: toEmail,
    replyTo: payload.email,
    subject: `New portfolio message from ${payload.name ?? "a visitor"}`,
    text: payload.message,
  });

  if (error) {
    // The provider's reason is the only way to tell a rejected sender from a bad
    // key or a rate limit, and it is invisible unless logged. Server-side only:
    // the visitor gets a generic message, since provider detail is not theirs to
    // debug and could leak configuration.
    console.error("Resend rejected the message:", error);
    return Response.json({ error: "Failed to send message." }, { status: 502 });
  }

  return Response.json({ success: true }, { status: 200 });
}
