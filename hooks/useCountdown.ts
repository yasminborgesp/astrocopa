"use client";

import { useState, useEffect } from "react";
import type { CountdownTime } from "@/types";

function calculateCountdown(targetDate: string): CountdownTime {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function useCountdown(targetDate: string | null | undefined): CountdownTime {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    // Calcula imediatamente
    setCountdown(calculateCountdown(targetDate));

    const interval = setInterval(() => {
      setCountdown(calculateCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
