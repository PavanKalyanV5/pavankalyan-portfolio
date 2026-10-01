"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import styles from "./Contact.module.css";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; email: string } | { kind: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "");

    const next: typeof errors = {};
    if (!EMAIL_RE.test(email)) next.email = "Enter an email address I can reply to.";
    if (message.length < 10) next.message = "Write at least a sentence so I know what this is about.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      if (res.ok) {
        form.reset();
        setStatus({ kind: "sent", email });
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      const fallback =
        res.status === 503
          ? `The form isn't set up yet. Email ${profile.email} instead.`
          : "The message didn't send. Try again, or email me directly.";
      setStatus({ kind: "error", message: res.status === 503 ? fallback : body.error ?? fallback });
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="c-name">
          Name <span className={styles.hint}>(optional)</span>
        </label>
        <input id="c-name" name="name" className={styles.input} autoComplete="name" maxLength={100} />
      </div>
      <div className={styles.field}>
        <label htmlFor="c-email">Email</label>
        <input
          id="c-email"
          name="email"
          type="email"
          className={styles.input}
          autoComplete="email"
          maxLength={200}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "c-email-err" : undefined}
        />
        {errors.email && (
          <p id="c-email-err" className={styles.error}>
            {errors.email}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="c-message">Message</label>
        <textarea
          id="c-message"
          name="message"
          className={styles.input}
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "c-message-err" : undefined}
        />
        {errors.message && (
          <p id="c-message-err" className={styles.error}>
            {errors.message}
          </p>
        )}
      </div>
      <div className={styles.trap} aria-hidden>
        <label htmlFor="c-website">Leave this empty</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button className={styles.send} type="submit" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending" : "Send message"}
      </button>
      <p className={`${styles.status} ${status.kind === "sent" ? styles.ok : ""} ${status.kind === "error" ? styles.error : ""}`} role="status" aria-live="polite">
        {status.kind === "sent" && `Message sent. I'll reply to ${status.email}.`}
        {status.kind === "error" && status.message}
      </p>
    </form>
  );
}
