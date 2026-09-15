import type { ReactNode } from "react";
import { pickAccentColor, pickShape, pickRotation } from "./iconUtils";

interface IconBadgeProps {
  seed: string;
  size?: number;
  children: (accentColor: string) => ReactNode;
}

export function IconBadge({ seed, size = 48, children }: IconBadgeProps) {
  const accentColor = pickAccentColor(seed);
  const shape = pickShape(seed);
  const rotation = pickRotation(seed);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `rotate(${rotation}deg)` }}
      role="img"
    >
      {shape === "circle" && (
        <circle cx="24" cy="24" r="22" fill={accentColor} fillOpacity="0.16" stroke={accentColor} strokeWidth="1.5" />
      )}
      {shape === "hexagon" && (
        <polygon
          points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
          fill={accentColor}
          fillOpacity="0.16"
          stroke={accentColor}
          strokeWidth="1.5"
        />
      )}
      {shape === "roundedSquare" && (
        <rect x="4" y="4" width="40" height="40" rx="10" fill={accentColor} fillOpacity="0.16" stroke={accentColor} strokeWidth="1.5" />
      )}
      <g transform={`rotate(${-rotation})`} style={{ transformOrigin: "24px 24px" }}>
        {children(accentColor)}
      </g>
    </svg>
  );
}
