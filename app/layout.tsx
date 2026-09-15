import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
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
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
