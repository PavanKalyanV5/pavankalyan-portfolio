import type { ReactNode } from "react";
import type { IconGlyph } from "@/content/types";

type GlyphRenderer = (color: string) => ReactNode;

export const glyphs: Record<IconGlyph, GlyphRenderer> = {
  language: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18,15 11,24 18,33" />
      <polyline points="30,15 37,24 30,33" />
    </g>
  ),
  ai: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="10" r="2" fill={color} />
      <circle cx="24" cy="38" r="2" fill={color} />
      <circle cx="10" cy="24" r="2" fill={color} />
      <circle cx="38" cy="24" r="2" fill={color} />
      <line x1="24" y1="18" x2="24" y2="12" />
      <line x1="24" y1="30" x2="24" y2="36" />
      <line x1="18" y1="24" x2="12" y2="24" />
      <line x1="30" y1="24" x2="36" y2="24" />
    </g>
  ),
  backend: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <rect x="10" y="10" width="28" height="9" rx="2" />
      <rect x="10" y="24" width="28" height="9" rx="2" />
      <circle cx="16" cy="14.5" r="1.2" fill={color} />
      <circle cx="16" cy="28.5" r="1.2" fill={color} />
    </g>
  ),
  frontend: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <rect x="8" y="11" width="32" height="24" rx="2" />
      <line x1="8" y1="18" x2="40" y2="18" />
      <circle cx="12.5" cy="14.5" r="0.9" fill={color} />
      <circle cx="16" cy="14.5" r="0.9" fill={color} />
    </g>
  ),
  database: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <ellipse cx="24" cy="13" rx="12" ry="4.5" />
      <path d="M12,13 L12,35 C12,37.5 17.4,39.5 24,39.5 C30.6,39.5 36,37.5 36,35 L36,13" />
      <path d="M12,24 C12,26.5 17.4,28.5 24,28.5 C30.6,28.5 36,26.5 36,24" />
    </g>
  ),
  cloud: (color) => (
    <g fill={color} fillOpacity="0.9">
      <circle cx="17" cy="27" r="6" />
      <circle cx="25" cy="22" r="8" />
      <circle cx="32" cy="27" r="5.5" />
      <rect x="14" y="26" width="24" height="9" rx="4.5" />
    </g>
  ),
  pattern: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <rect x="9" y="9" width="30" height="30" rx="2" strokeDasharray="4 3" />
      <line x1="9" y1="24" x2="39" y2="24" strokeDasharray="4 3" />
      <line x1="24" y1="9" x2="24" y2="39" strokeDasharray="4 3" />
    </g>
  ),
  tool: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="21" y="8" width="6" height="14" rx="2" transform="rotate(45 24 15)" />
      <rect x="12" y="26" width="20" height="8" rx="4" transform="rotate(45 22 30)" />
    </g>
  ),
  game: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="6" y="17" width="36" height="16" rx="8" />
      <line x1="14" y1="25" x2="14" y2="20" />
      <line x1="11.5" y1="22.5" x2="16.5" y2="22.5" />
      <circle cx="30" cy="22" r="1.6" fill={color} />
      <circle cx="35" cy="27" r="1.6" fill={color} />
    </g>
  ),
  chart: (color) => (
    <g fill={color}>
      <rect x="10" y="24" width="7" height="14" />
      <rect x="20.5" y="16" width="7" height="22" />
      <rect x="31" y="10" width="7" height="28" />
    </g>
  ),
  media: (color) => (
    <g fill="none" stroke={color} strokeWidth="2">
      <circle cx="24" cy="24" r="15" />
      <polygon points="20,17 32,24 20,31" fill={color} stroke="none" />
    </g>
  ),
  cart: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8,10 L13,10 L18,29 L36,29 L40,15 L15,15" />
      <circle cx="20" cy="36" r="2.2" fill={color} stroke="none" />
      <circle cx="33" cy="36" r="2.2" fill={color} stroke="none" />
    </g>
  ),
  news: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="9" y="12" width="30" height="24" rx="2" />
      <line x1="14" y1="19" x2="34" y2="19" />
      <line x1="14" y1="24" x2="34" y2="24" />
      <line x1="14" y1="29" x2="26" y2="29" />
    </g>
  ),
  link: (color) => (
    <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="8" y="18" width="18" height="12" rx="6" />
      <rect x="22" y="18" width="18" height="12" rx="6" />
    </g>
  ),
};
