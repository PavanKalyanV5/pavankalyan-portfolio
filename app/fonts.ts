import { Bricolage_Grotesque, Newsreader } from "next/font/google";

export const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  display: "swap",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

export const newsreader = Newsreader({
  variable: "--font-text",
  display: "swap",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
