"use client";

import { useState, useEffect, useCallback } from "react";
import { WAITLIST_CONFIG } from "@/lib/config";
import {
  seedDemoData,
  getCurrentUser,
  addToWaitlist,
  getTotalSignups,
  refreshCurrentUser,
  type WaitlistEntry,
} from "@/lib/waitlist";
import { CountdownTimer } from "./CountdownTimer";
import { RewardTiers } from "./RewardTiers";
import { ShareButtons } from "./ShareButtons";

// --- Animated Counter Hook ---
function useAnimatedCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

export function WaitlistApp() {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [currentUser, setCurrentUser] = useState<WaitlistEntry | null>(null);
  const [totalSignups, setTotalSignups] = useState(0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [referredByCode, setReferredByCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const animatedTotal = useAnimatedCounter(mounted ? totalSignups : 0);

  // Initialize
  useEffect(() => {
    seedDemoData();
    setMounted(true);

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setReferredByCode(ref);

    const user = getCurrentUser();
    if (user) {
      setIsSignedUp(true);
      setCurrentUser(user);
    }

    setTotalSignups(getTotalSignups());
  }, []);

  // Handle signup
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setError("Please enter your email address");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setError("Please enter a valid email address");
        return;
      }

      try {
        const entry = addToWaitlist(trimmedEmail, referredByCode);
        setCurrentUser(entry);
        setIsSignedUp(true);
        setJustSignedUp(true);
        setTotalSignups(getTotalSignups());
        setEmail("");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    },
    [email, referredByCode]
  );

  // Copy referral link
  const copyReferralLink = useCallback(() => {
    if (!currentUser) return;
    const link = `${window.location.origin}?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentUser]);

  const referralLink = currentUser
    ? `${typeof window !== "undefined" ? window.location.origin : ""}?ref=${currentUser.referralCode}`
    : "";

  const daysUntilLaunch = Math.max(
    0,
    Math.ceil(
      (new Date(WAITLIST_CONFIG.launchDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ========== NAVBAR ========== */}
      <nav className="glass fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-strong font-[family-name:var(--font-display)] text-sm font-bold text-white">
              {WAITLIST_CONFIG.logoEmoji}
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold">
              {WAITLIST_CONFIG.productName}
            </span>
          </div>

          {!isSignedUp && (
            <a
              href="#signup"
              className="rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Join Waitlist
            </a>
          )}

          {isSignedUp && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
              You&apos;re on the list
            </div>
          )}
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4">
            <div className="h-full w-full rounded-full bg-accent/[0.07] blur-[120px]" />
          </div>
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px]">
            <div className="h-full w-full rounded-full bg-accent-strong/[0.05] blur-[100px]" />
          </div>
        </div>

        {/* Grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          {!isSignedUp ? (
            <>
              {/* Launch badge */}
              <div className="will-animate animate-slide-down mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-surface px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
                <span className="text-sm text-muted">
                  Launching{" "}
                  {new Date(WAITLIST_CONFIG.launchDate).toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" }
                  )}
                </span>
              </div>

              {/* Headline */}
              <h1 className="will-animate animate-slide-up mb-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                {WAITLIST_CONFIG.tagline.split(" ").map((word, i, arr) => {
                  // Make last 2 words gradient
                  if (i >= arr.length - 2) {
                    return (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-accent to-[#a78bfa] bg-clip-text text-transparent"
                      >
                        {word}{" "}
                      </span>
                    );
                  }
                  return <span key={i}>{word} </span>;
                })}
              </h1>

              {/* Subtitle */}
              <p className="will-animate animate-slide-up delay-100 mx-auto mb-10 max-w-lg text-lg text-muted">
                {WAITLIST_CONFIG.description}
              </p>

              {/* Email form */}
              <form
                id="signup"
                onSubmit={handleSubmit}
                className="will-animate animate-slide-up delay-200 mx-auto mb-4 max-w-md"
              >
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your email"
                    className="flex-1 rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-foreground placeholder-muted outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    className="animate-gradient shrink-0 rounded-xl bg-gradient-to-r from-accent-strong via-accent to-accent-strong px-6 py-3 font-[family-name:var(--font-display)] font-semibold text-white transition-all hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
                  >
                    Join Waitlist
                  </button>
                </div>

                {error && (
                  <p className="animate-scale-in mt-3 text-sm text-red-400">
                    {error}
                  </p>
                )}
              </form>

              {/* Social proof */}
              <div className="will-animate animate-fade-in delay-300 mb-16 flex items-center justify-center gap-3">
                {/* Stacked avatars */}
                <div className="flex -space-x-2">
                  {[
                    "from-violet-400 to-indigo-600",
                    "from-amber-400 to-orange-600",
                    "from-emerald-400 to-teal-600",
                    "from-rose-400 to-pink-600",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br ${gradient}`}
                    />
                  ))}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-surface-light text-[10px] font-medium text-muted">
                    +
                  </div>
                </div>
                <span className="text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    {animatedTotal.toLocaleString()}+
                  </span>{" "}
                  people on the waitlist
                </span>
              </div>

              {/* Countdown */}
              <div className="will-animate animate-slide-up delay-400 flex flex-col items-center">
                <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
                  Launching in
                </p>
                <CountdownTimer targetDate={WAITLIST_CONFIG.launchDate} />
              </div>
            </>
          ) : (
            /* ========== POST-SIGNUP DASHBOARD ========== */
            <div className="animate-scale-in">
              {/* Success header */}
              <div className="mb-8">
                {justSignedUp && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-4 py-2 text-sm font-medium text-success">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    You&apos;re on the waitlist!
                  </div>
                )}
                <h1 className="mb-3 font-[family-name:var(--font-display)] text-4xl font-bold sm:text-5xl">
                  You&apos;re #{currentUser?.position.toLocaleString()}
                </h1>
                <p className="text-lg text-muted">
                  {currentUser
                    ? `${(totalSignups - currentUser.position).toLocaleString()} people behind you`
                    : ""}
                  {" · "}
                  {totalSignups.toLocaleString()} total on the waitlist
                </p>
              </div>

              {/* Referral link card */}
              <div className="gradient-border mx-auto mb-8 max-w-lg rounded-2xl bg-surface p-6 text-left">
                <h3 className="mb-1 font-[family-name:var(--font-display)] font-semibold">
                  Your referral link
                </h3>
                <p className="mb-4 text-sm text-muted">
                  Share this link to move up the waitlist and unlock rewards
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 overflow-hidden rounded-xl border border-[var(--border)] bg-background px-4 py-3">
                    <p className="truncate text-sm text-muted">
                      {referralLink}
                    </p>
                  </div>
                  <button
                    onClick={copyReferralLink}
                    className={`shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      copied
                        ? "bg-success/20 text-success"
                        : "bg-accent/10 text-accent hover:bg-accent/20"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Referral stats */}
                <div className="mt-4 flex items-center gap-4 border-t border-[var(--border)] pt-4">
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-accent">
                      {currentUser?.referralCount || 0}
                    </p>
                    <p className="text-xs text-muted">Referrals</p>
                  </div>
                  <div className="h-8 w-px bg-[var(--border)]" />
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-warning">
                      {WAITLIST_CONFIG.rewardTiers.filter(
                        (t) =>
                          (currentUser?.referralCount || 0) >= t.referralsNeeded
                      ).length}
                    </p>
                    <p className="text-xs text-muted">Rewards Unlocked</p>
                  </div>
                </div>
              </div>

              {/* Share buttons */}
              <div className="mx-auto mb-8 max-w-lg">
                <h3 className="mb-3 text-left font-[family-name:var(--font-display)] font-semibold">
                  Share with friends
                </h3>
                <ShareButtons referralLink={referralLink} />
              </div>

              {/* Countdown (smaller) */}
              <div className="mt-12 flex flex-col items-center">
                <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted">
                  Launching in
                </p>
                <CountdownTimer targetDate={WAITLIST_CONFIG.launchDate} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="border-y border-[var(--border)] bg-surface/50 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-6 text-center">
          {[
            {
              value: `${animatedTotal.toLocaleString()}+`,
              label: "On the waitlist",
            },
            { value: `${daysUntilLaunch}`, label: "Days until launch" },
            {
              value: `${WAITLIST_CONFIG.rewardTiers.length}`,
              label: "Reward tiers",
            },
          ].map((stat, i) => (
            <div key={i}>
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== HOW REFERRALS WORK ========== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <h2 className="will-animate animate-slide-up mb-3 font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
              Invite friends. Earn rewards.
            </h2>
            <p className="will-animate animate-slide-up delay-100 text-lg text-muted">
              The more friends you refer, the better your rewards
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Sign up",
                description:
                  "Join the waitlist and get your unique referral link",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Share your link",
                description:
                  "Send it to friends who would love what we're building",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Unlock rewards",
                description:
                  "Hit milestones to earn early access, discounts, and more",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.522m0 0a6.003 6.003 0 01-3.77-1.522"
                    />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="will-animate animate-slide-up group relative rounded-2xl border border-[var(--border)] bg-surface p-6 transition-all hover:border-[rgba(255,255,255,0.12)]"
                style={{ animationDelay: `${200 + i * 150}ms` }}
              >
                {/* Step number */}
                <div className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">
                  Step {item.step}
                </div>

                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== REWARD TIERS ========== */}
      <section className="border-t border-[var(--border)] bg-surface/30 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <h2 className="will-animate animate-slide-up mb-3 font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
              Referral rewards
            </h2>
            <p className="will-animate animate-slide-up delay-100 text-lg text-muted">
              Every friend you bring gets you closer to exclusive perks
            </p>
          </div>

          <RewardTiers
            currentReferrals={currentUser?.referralCount || 0}
            showProgress={isSignedUp}
          />
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="will-animate animate-slide-up mb-12 text-center font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
            Questions? We&apos;ve got answers.
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "When will you launch?",
                a: `We're planning to launch in ${new Date(
                  WAITLIST_CONFIG.launchDate
                ).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}. Waitlist members will be the first to know.`,
              },
              {
                q: "How does the referral system work?",
                a: "After signing up, you'll get a unique referral link. Share it with friends — when they join through your link, your referral count goes up and you unlock rewards at each milestone.",
              },
              {
                q: "Is it free to join?",
                a: "Yes, joining the waitlist is completely free. Some reward tiers may include paid product discounts or exclusive access.",
              },
              {
                q: "Can I change my email later?",
                a: "Contact us and we'll update your waitlist entry. Your referral count and rewards will transfer.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="will-animate animate-slide-up rounded-2xl border border-[var(--border)] bg-surface p-6"
                style={{ animationDelay: `${200 + i * 100}ms` }}
              >
                <h3 className="mb-2 font-[family-name:var(--font-display)] font-semibold text-foreground">
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      {!isSignedUp && (
        <section className="border-t border-[var(--border)] bg-surface/50 py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
              Don&apos;t miss out
            </h2>
            <p className="mb-8 text-lg text-muted">
              Join {totalSignups.toLocaleString()}+ others already on the
              waitlist
            </p>
            <a
              href="#signup"
              className="animate-gradient inline-flex rounded-xl bg-gradient-to-r from-accent-strong via-accent to-accent-strong px-8 py-4 font-[family-name:var(--font-display)] font-semibold text-white transition-all hover:shadow-lg hover:shadow-accent/25"
            >
              Join the Waitlist
            </a>
          </div>
        </section>
      )}

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-strong font-[family-name:var(--font-display)] text-xs font-bold text-white">
              {WAITLIST_CONFIG.logoEmoji}
            </div>
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold">
              {WAITLIST_CONFIG.productName}
            </span>
          </div>
          <p className="text-sm text-muted">
            Built with the{" "}
            <span className="text-accent">WaitLyst</span> template
          </p>
        </div>
      </footer>
    </div>
  );
}
