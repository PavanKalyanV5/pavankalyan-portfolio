"use client";

import React, { useState } from "react";
import { useIsMounted } from "@/lib/useIsMounted";
import { getTechIconUrl, getIssuerIconUrl } from "@/lib/assets/icons";
import { TechIcon } from "@/components/overlay/NodeIcons";
import styles from "./BrandIcon.module.css";

interface BrandIconProps {
  name: string;
  type?: "tech" | "issuer";
  size?: number;
  className?: string;
}

export function BrandIcon({
  name,
  type = "tech",
  size = 16,
  className = "",
}: BrandIconProps) {
  const mounted = useIsMounted();
  const [imgError, setImgError] = useState(false);

  const iconUrl =
    type === "issuer" ? getIssuerIconUrl(name) : getTechIconUrl(name);

  // During SSR, render space-reserved placeholder to prevent DarkReader extension hydration mismatches
  if (!mounted) {
    return (
      <span
        className={`${styles.iconWrap} ${className}`}
        style={{ width: size, height: size }}
        suppressHydrationWarning
      />
    );
  }

  if (iconUrl && !imgError) {
    return (
      <span
        className={`${styles.iconWrap} ${className}`}
        style={{ width: size, height: size }}
        suppressHydrationWarning
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconUrl}
          alt={name}
          width={size}
          height={size}
          className={styles.img}
          onError={() => setImgError(true)}
          loading="lazy"
          suppressHydrationWarning
        />
      </span>
    );
  }

  // Fallback to React Icon
  return (
    <span
      className={`${styles.iconWrap} ${className}`}
      suppressHydrationWarning
    >
      <TechIcon name={name} size={size} />
    </span>
  );
}
