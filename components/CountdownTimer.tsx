"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({
  targetDate,
  compact = false,
}: {
  targetDate: string;
  compact?: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex gap-3 sm:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center rounded-2xl bg-surface ${compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-18 w-18 sm:h-22 sm:w-22"}`}
            >
              <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-muted">
                --
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  const boxSize = compact
    ? "h-14 w-14 sm:h-16 sm:w-16"
    : "h-[72px] w-[72px] sm:h-[88px] sm:w-[88px]";
  const textSize = compact
    ? "text-xl sm:text-2xl"
    : "text-2xl sm:text-[34px]";

  return (
    <div className="flex gap-3 sm:gap-4">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div
            className={`card-soft relative flex items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] ${boxSize}`}
          >
            {/* Top accent line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            <span
              className={`relative font-[family-name:var(--font-display)] font-bold tabular-nums tracking-tight text-foreground ${textSize}`}
            >
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="mt-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
