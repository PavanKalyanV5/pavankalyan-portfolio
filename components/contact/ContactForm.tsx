"use client";

import { useState, type FormEvent } from "react";
import { Stack, TextField, Button, Alert } from "@mui/material";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!message.trim()) {
      setError("Message is required.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        setError("Something went wrong sending your message. Please try again.");
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong sending your message. Please try again.");
    }
  };

  if (sent) {
    return <Alert severity="success">Message sent — thanks for reaching out!</Alert>;
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2} maxWidth={480}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        multiline
        minRows={4}
      />
      <Button type="submit" variant="contained" size="large">
        Send
      </Button>
    </Stack>
  );
}
