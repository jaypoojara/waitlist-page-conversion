"use client";

import { WAITLIST_CONFIG } from "@/lib/config";

interface RewardTiersProps {
  currentReferrals: number;
  showProgress?: boolean;
}

export function RewardTiers({
  currentReferrals,
  showProgress = false,
}: RewardTiersProps) {
  const { rewardTiers } = WAITLIST_CONFIG;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rewardTiers.map((tier, i) => {
        const isUnlocked = currentReferrals >= tier.referralsNeeded;
        const progress = showProgress
          ? Math.min(100, (currentReferrals / tier.referralsNeeded) * 100)
          : 0;

        return (
          <div
            key={tier.title}
            className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
              isUnlocked
                ? "border-accent/30 bg-accent/5"
                : "border-[var(--border)] bg-surface hover:border-[rgba(255,255,255,0.12)]"
            } will-animate animate-slide-up`}
            style={{ animationDelay: `${300 + i * 100}ms` }}
          >
            {/* Unlock glow */}
            {isUnlocked && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
            )}

            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                  isUnlocked
                    ? "bg-accent/20"
                    : "bg-surface-light"
                }`}
              >
                {tier.icon}
              </div>

              <div className="min-w-0 flex-1">
                {/* Header */}
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-[family-name:var(--font-display)] font-semibold text-foreground">
                    {tier.title}
                  </h3>
                  {isUnlocked && (
                    <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
                      Unlocked
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted">{tier.description}</p>

                {/* Referral requirement */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-medium text-accent">
                    {tier.referralsNeeded} referrals
                  </span>
                  {showProgress && !isUnlocked && (
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-light">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent-strong to-accent transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
