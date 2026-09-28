"use client";

import React, { useState } from "react";
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
  const [imgError, setImgError] = useState(false);

  const iconUrl =
    type === "issuer" ? getIssuerIconUrl(name) : getTechIconUrl(name);

  if (iconUrl && !imgError) {
    return (
      <span
        className={`${styles.iconWrap} ${className}`}
        style={{ width: size, height: size }}
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
        />
      </span>
    );
  }

  // Fallback to React Icon
  return (
    <span className={`${styles.iconWrap} ${className}`}>
      <TechIcon name={name} size={size} />
    </span>
  );
}
