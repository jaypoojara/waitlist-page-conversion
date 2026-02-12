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

export function CountdownTimer({ targetDate }: { targetDate: string }) {
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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-light sm:h-20 sm:w-20">
              <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-muted sm:text-3xl">
                --
              </span>
            </div>
            <span className="mt-2 text-xs text-muted sm:text-sm">---</span>
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

  return (
    <div className="flex gap-3 sm:gap-4">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div
            className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-surface-light sm:h-20 sm:w-20"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Subtle top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <span className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="mt-2 text-xs font-medium uppercase tracking-wider text-muted sm:text-sm">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
