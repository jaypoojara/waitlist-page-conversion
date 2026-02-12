"use client";

import { WAITLIST_CONFIG } from "@/lib/config";

interface RewardTiersProps {
  currentReferrals: number;
  showProgress?: boolean;
}

const tierColors = [
  {
    bg: "bg-rose-50",
    hoverBg: "group-hover:bg-rose-50/80",
    iconBg: "bg-rose-100 group-hover:bg-rose-200/70",
    accent: "text-rose-600",
    border: "group-hover:border-rose-200",
    progress: "from-rose-500 to-rose-400",
  },
  {
    bg: "bg-emerald-50",
    hoverBg: "group-hover:bg-emerald-50/80",
    iconBg: "bg-emerald-100 group-hover:bg-emerald-200/70",
    accent: "text-emerald-600",
    border: "group-hover:border-emerald-200",
    progress: "from-emerald-500 to-emerald-400",
  },
  {
    bg: "bg-amber-50",
    hoverBg: "group-hover:bg-amber-50/80",
    iconBg: "bg-amber-100 group-hover:bg-amber-200/70",
    accent: "text-amber-600",
    border: "group-hover:border-amber-200",
    progress: "from-amber-500 to-amber-400",
  },
  {
    bg: "bg-rose-50",
    hoverBg: "group-hover:bg-rose-50/80",
    iconBg: "bg-rose-100 group-hover:bg-rose-200/70",
    accent: "text-rose-600",
    border: "group-hover:border-rose-200",
    progress: "from-rose-500 to-rose-400",
  },
];

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
        const colors = tierColors[i];

        return (
          <div
            key={tier.title}
            className={`card-soft group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
              isUnlocked
                ? "border-success/30 bg-success/[0.04]"
                : `border-[var(--border)] bg-surface ${colors.border}`
            } will-animate animate-slide-up`}
            style={{ animationDelay: `${300 + i * 120}ms` }}
          >
            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition-colors duration-300 ${
                  isUnlocked ? "bg-success/10" : colors.iconBg
                }`}
              >
                {tier.icon}
              </div>

              <div className="min-w-0 flex-1">
                {/* Header */}
                <div className="mb-1.5 flex items-center gap-2">
                  <h3 className="font-[family-name:var(--font-display)] text-[15px] font-semibold text-foreground">
                    {tier.title}
                  </h3>
                  {isUnlocked && (
                    <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Unlocked
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-[13px] leading-relaxed text-muted">
                  {tier.description}
                </p>

                {/* Referral requirement + progress */}
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold ${
                      isUnlocked ? "text-success" : colors.accent
                    }`}
                  >
                    {tier.referralsNeeded} referrals
                  </span>
                  {showProgress && !isUnlocked && (
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${colors.progress}`}
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
