import { IconBadge } from "./IconBadge";
import { glyphs } from "./glyphs";
import type { IconGlyph } from "@/content/types";

interface GeneratedIconProps {
  seed: string;
  glyph: IconGlyph;
  size?: number;
}

export function GeneratedIcon({ seed, glyph, size = 48 }: GeneratedIconProps) {
  return <IconBadge seed={seed} size={size}>{(color) => glyphs[glyph](color)}</IconBadge>;
}
