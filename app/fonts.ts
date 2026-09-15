import { Sora, JetBrains_Mono } from "next/font/google";

export const sora = Sora({
  weight: ["300", "400", "600", "800"],
  variable: "--font-display",
  display: "swap",
  subsets: ["latin"],
});

export const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  subsets: ["latin"],
});
