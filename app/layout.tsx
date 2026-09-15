import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pavan Kalyan Vetla — Software Engineer",
  description:
    "Software Engineer building AI-powered backend systems and full-stack applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
