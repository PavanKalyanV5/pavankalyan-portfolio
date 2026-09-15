import type { NodeEmphasis } from "./types";

export interface NodeStyle {
  color: string;
  radius: number;
  emissive: number;
}

export function styleFor(emphasis: NodeEmphasis): NodeStyle {
  switch (emphasis) {
    case "live":
      return { color: "#FFB35C", radius: 0.62, emissive: 1.5 };
    case "primary":
      return { color: "#7BF3E4", radius: 0.46, emissive: 0.9 };
    case "normal":
      return { color: "#5EE7D6", radius: 0.34, emissive: 0.55 };
    case "muted":
      return { color: "#2F6E77", radius: 0.24, emissive: 0.30 };
  }
}

export const EDGE_DIM = "#1B2540";
export const EDGE_ACTIVE = "#5EE7D6";
export const PARTICLE_COLOR = "#5EE7D6";
