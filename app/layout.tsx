import type { Metadata } from "next";
import { sora, jetbrainsMono } from "@/app/fonts";
import "@/styles/global.css";

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
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
