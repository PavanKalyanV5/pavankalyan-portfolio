"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

interface AnimeCounterProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimeCounter({
  to,
  from = 0,
  duration = 1400,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: AnimeCounterProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    `${prefix}${from.toFixed(decimals)}${suffix}`
  );
  const animRef = useRef<{ value: number }>({ value: from });

  useEffect(() => {
    const targetObj = { value: from };
    animRef.current = targetObj;

    const anim = animate(targetObj, {
      value: to,
      duration,
      ease: "outExpo",
      onUpdate: () => {
        setDisplayValue(
          `${prefix}${targetObj.value.toFixed(decimals)}${suffix}`
        );
      },
    });

    return () => {
      anim.pause();
    };
  }, [to, from, duration, decimals, prefix, suffix]);

  return <span className={className}>{displayValue}</span>;
}
