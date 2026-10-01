import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" style={{ minHeight: "100dvh", display: "grid", placeContent: "center", padding: "var(--gutter)", gap: 16 }}>
      <h1 style={{ fontSize: "clamp(3rem, 12vw, 8rem)", fontWeight: 800, fontStretch: "80%", lineHeight: 0.9 }}>404</h1>
      <p>That page doesn&apos;t exist. The portfolio lives on the home page.</p>
      <Link href="/">Back to the portfolio</Link>
    </main>
  );
}
