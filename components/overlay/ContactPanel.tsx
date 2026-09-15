"use client";

import { useState, type FormEvent } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaCode,
} from "react-icons/fa6";
import {
  SiLeetcode,
  SiGeeksforgeeks,
  SiGooglecloud,
} from "react-icons/si";
import { ActionButton } from "../ui/ActionButton";
import { socials } from "@/content/socials";
import styles from "./ContactPanel.module.css";

export function ContactPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isSubmitting) {
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!message.trim()) {
      setError("Message is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });

      if (!response.ok) {
        setError("Something went wrong sending your message. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSent(true);
      setIsSubmitting(false);
    } catch {
      setError("Something went wrong sending your message. Please try again.");
      setIsSubmitting(false);
    }
  };

  const getSocialIcon = (id: string) => {
    switch (id) {
      case "github":
        return <FaGithub size={22} />;
      case "linkedin":
        return <FaLinkedin size={22} />;
      case "leetcode":
        return <SiLeetcode size={22} />;
      case "geeksforgeeks":
        return <SiGeeksforgeeks size={22} />;
      case "code360":
        return <FaCode size={22} />;
      case "twitter":
        return <FaXTwitter size={22} />;
      case "google-cloud-skills":
        return <SiGooglecloud size={22} />;
      default:
        return <FaCode size={22} />;
    }
  };

  const successMessage = "Message sent — thanks for reaching out!";

  return (
    <div className={styles.content}>
      <h2 className={styles.heading}>Get in touch</h2>

      <p className={styles.copy}>
        Have a question or want to collaborate? Reach out and let&apos;s talk.
      </p>

      {sent ? (
        <div
          className={`${styles.status} ${styles.success}`}
          role="status"
          aria-live="polite"
        >
          {successMessage}
        </div>
      ) : (
        <>
          {error && (
            <div
              className={`${styles.status} ${styles.error}`}
              role="status"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              aria-hidden="true"
              autoComplete="off"
              tabIndex={-1}
              className={styles.honeypot}
            />

            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={styles.label}>
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="message" className={styles.label}>
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={styles.textarea}
              />
            </div>

            <div className={styles.submitButton}>
              <ActionButton type="submit" variant="primary">
                {isSubmitting ? "Sending…" : "Send message"}
              </ActionButton>
            </div>
          </form>
        </>
      )}

      <div className={styles.divider} />

      <div className={styles.emailLine}>
        <a
          href="mailto:vetlapavankalyan5@gmail.com"
          className={styles.emailLink}
          data-cursor="link"
        >
          vetlapavankalyan5@gmail.com
        </a>
      </div>

      <div className={styles.socialStrip}>
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            title={social.label}
            className={styles.socialLink}
            data-cursor="link"
          >
            {getSocialIcon(social.id)}
          </a>
        ))}
      </div>
    </div>
  );
}
