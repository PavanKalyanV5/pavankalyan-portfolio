import { IconBadge } from "./IconBadge";
import { initialsFor } from "./iconUtils";

interface IssuerIconProps {
  issuer: string;
  size?: number;
}

export function IssuerIcon({ issuer, size = 48 }: IssuerIconProps) {
  return (
    <IconBadge seed={issuer} size={size}>
      {(color) => (
        <text
          x="24"
          y="24"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="14"
          fontWeight="700"
          fill={color}
        >
          {initialsFor(issuer)}
        </text>
      )}
    </IconBadge>
  );
}
