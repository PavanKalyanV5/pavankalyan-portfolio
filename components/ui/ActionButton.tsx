"use client";

import React from "react";
import styles from "./ActionButton.module.css";

interface ActionButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  external?: boolean;
  type?: "button" | "submit";
}

export function ActionButton({
  children,
  href,
  onClick,
  variant = "ghost",
  external = false,
  type = "button",
}: ActionButtonProps) {
  const variantClass = styles[variant];
  const baseClass = styles.button;

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClass} ${variantClass}`}
        data-cursor="link"
        {...(external && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass}`}
      onClick={onClick}
      data-cursor="link"
    >
      {children}
    </button>
  );
}
