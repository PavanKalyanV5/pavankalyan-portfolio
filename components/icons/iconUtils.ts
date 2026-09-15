export function hashSeed(seed: string): number {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  return Math.abs(hash);
}

export const ACCENT_PALETTE = [
  "#4F9DFF",
  "#8A5CFF",
  "#38D9C4",
  "#FFB84F",
  "#FF6B8B",
  "#5CE1A0",
  "#E15CDB",
  "#5CC8E1",
] as const;

export type BadgeShape = "circle" | "hexagon" | "roundedSquare";

export function pickAccentColor(seed: string): string {
  return ACCENT_PALETTE[hashSeed(seed) % ACCENT_PALETTE.length];
}

export function pickShape(seed: string): BadgeShape {
  const shapes: BadgeShape[] = ["circle", "hexagon", "roundedSquare"];
  return shapes[hashSeed(seed + "-shape") % shapes.length];
}

export function pickRotation(seed: string): number {
  const rotations = [-12, 0, 12];
  return rotations[hashSeed(seed + "-rotation") % rotations.length];
}

export function initialsFor(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
