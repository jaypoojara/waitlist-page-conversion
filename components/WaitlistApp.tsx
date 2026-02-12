"use client";

import { useState, useEffect, useCallback } from "react";
import { WAITLIST_CONFIG } from "@/lib/config";
import {
  seedDemoData,
  getCurrentUser,
  addToWaitlist,
  getTotalSignups,
  type WaitlistEntry,
} from "@/lib/waitlist";
import { CountdownTimer } from "./CountdownTimer";
import { RewardTiers } from "./RewardTiers";
import { ShareButtons } from "./ShareButtons";

// --- Animated Counter Hook ---
function useAnimatedCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(target);
    }

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

// --- FAQ Accordion Item ---
function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="will-animate animate-slide-up card-soft overflow-hidden rounded-2xl border border-[var(--border)] transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <h3 className="font-[family-name:var(--font-display)] font-semibold text-foreground">
          {q}
        </h3>
        <svg
          className={`h-5 w-5 shrink-0 text-accent transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-[15px] leading-relaxed text-muted">{a}</p>
        </div>
      </div>
    </div>
  );
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
        if (err instanceof Error) setError(err.message);
      }
    },
    [email, referredByCode]
  );

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
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#A78BFA] font-[family-name:var(--font-display)] text-sm font-bold text-white shadow-md shadow-accent/20">
              {WAITLIST_CONFIG.logoEmoji}
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
              {WAITLIST_CONFIG.productName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isSignedUp && (
              <a
                href="#signup"
                className="btn-gradient rounded-full px-5 py-2 text-sm font-semibold text-white"
              >
                Join Waitlist
              </a>
            )}

            {isSignedUp && (
              <div className="flex items-center gap-2 rounded-full border border-success/20 bg-success/[0.08] px-3 py-1.5 text-sm font-medium text-success">
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
                On the list
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute inset-0">
          {/* Primary blob — top right */}
          <div className="absolute -right-20 -top-20 h-[500px] w-[500px]">
            <div className="animate-blob h-full w-full bg-gradient-to-br from-violet-200/50 to-pink-200/30 blur-[80px]" />
          </div>
          {/* Secondary blob — bottom left */}
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px]">
            <div className="animate-blob h-full w-full bg-gradient-to-br from-blue-200/40 to-indigo-200/30 blur-[80px]" style={{ animationDelay: "3s" }} />
          </div>
          {/* Small accent blob — center */}
          <div className="absolute left-1/2 top-1/3 h-[250px] w-[250px] -translate-x-1/2">
            <div className="animate-breathe h-full w-full rounded-full bg-accent/[0.06] blur-[60px]" />
          </div>
          {/* Floating dots */}
          <div className="animate-float absolute left-[20%] top-[25%] h-2 w-2 rounded-full bg-accent/20" />
          <div className="animate-float absolute left-[75%] top-[20%] h-1.5 w-1.5 rounded-full bg-pink-400/25" style={{ animationDelay: "1s" }} />
          <div className="animate-float absolute left-[65%] top-[65%] h-2 w-2 rounded-full bg-indigo-300/20" style={{ animationDelay: "2s" }} />
          <div className="animate-float absolute left-[15%] top-[60%] h-1.5 w-1.5 rounded-full bg-violet-400/20" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          {!isSignedUp ? (
            <>
              {/* Launch badge */}
              <div className="will-animate animate-slide-down mb-8 inline-flex items-center gap-2.5 rounded-full border border-accent/15 bg-accent-light/50 px-5 py-2.5 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse-soft" />
                <span className="text-sm font-medium text-accent-strong">
                  Launching{" "}
                  {new Date(WAITLIST_CONFIG.launchDate).toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" }
                  )}
                </span>
              </div>

              {/* Headline */}
              <h1 className="will-animate animate-slide-up mb-6 font-[family-name:var(--font-display)] text-[clamp(2.25rem,6vw,4.25rem)] font-bold leading-[1.08] tracking-tight text-foreground">
                {WAITLIST_CONFIG.tagline.split(" ").map((word, i, arr) => {
                  if (i >= arr.length - 2) {
                    return (
                      <span
                        key={i}
                        className="animate-gradient bg-gradient-to-r from-accent via-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent"
                      >
                        {word}{" "}
                      </span>
                    );
                  }
                  return <span key={i}>{word} </span>;
                })}
              </h1>

              {/* Subtitle */}
              <p className="will-animate animate-slide-up delay-100 mx-auto mb-10 max-w-lg text-lg leading-relaxed text-muted">
                {WAITLIST_CONFIG.description}
              </p>

              {/* Email form card */}
              <div
                id="signup"
                className="will-animate animate-scale-in delay-200 soft-border card-soft mx-auto mb-6 max-w-lg rounded-2xl p-6 sm:p-8"
              >
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Enter your email address"
                      className="flex-1 rounded-xl border border-[var(--border)] bg-surface-light/60 px-5 py-3.5 text-foreground placeholder-muted/60 outline-none transition-all focus:border-accent/40 focus:bg-white focus:ring-2 focus:ring-accent/15"
                      autoComplete="email"
                    />
                    <button
                      type="submit"
                      className="btn-gradient shrink-0 rounded-xl px-7 py-3.5 font-[family-name:var(--font-display)] text-[15px] font-semibold text-white"
                    >
                      Join Waitlist
                    </button>
                  </div>

                  {error && (
                    <p className="animate-scale-in mt-3 text-sm text-red-500">
                      {error}
                    </p>
                  )}

                  {/* Social proof inside card */}
                  <div className="mt-5 flex items-center justify-center gap-3 border-t border-[var(--border)] pt-5">
                    <div className="flex -space-x-2">
                      {[
                        "from-violet-400 to-indigo-500",
                        "from-amber-400 to-orange-500",
                        "from-emerald-400 to-teal-500",
                        "from-rose-400 to-pink-500",
                        "from-sky-400 to-blue-500",
                      ].map((gradient, i) => (
                        <div
                          key={i}
                          className={`h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br shadow-sm ${gradient}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted">
                      <span className="font-semibold text-foreground">
                        {animatedTotal.toLocaleString()}+
                      </span>{" "}
                      already joined
                    </span>
                  </div>
                </form>
              </div>

              {/* Countdown */}
              <div className="will-animate animate-slide-up delay-400 mt-14 flex flex-col items-center">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Launching in
                </p>
                <CountdownTimer targetDate={WAITLIST_CONFIG.launchDate} />
              </div>
            </>
          ) : (
            /* ========== POST-SIGNUP DASHBOARD ========== */
            <div className="animate-scale-in">
              <div className="mb-10">
                {justSignedUp && (
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/[0.08] px-4 py-2 text-sm font-semibold text-success">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    You&apos;re on the waitlist!
                  </div>
                )}
                <h1 className="mb-3 font-[family-name:var(--font-display)] text-5xl font-bold tracking-tight sm:text-6xl">
                  You&apos;re <span className="bg-gradient-to-r from-accent via-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent">#{currentUser?.position.toLocaleString()}</span>
                </h1>
                <p className="text-lg text-muted">
                  {currentUser
                    ? `${(totalSignups - currentUser.position).toLocaleString()} people behind you`
                    : ""}
                  {" · "}
                  {totalSignups.toLocaleString()} total
                </p>
              </div>

              {/* Referral link card */}
              <div className="soft-border card-soft mx-auto mb-8 max-w-lg rounded-2xl p-6 text-left sm:p-7">
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.04a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.757 8.81" />
                  </svg>
                  <h3 className="font-[family-name:var(--font-display)] font-semibold">
                    Your referral link
                  </h3>
                </div>
                <p className="mb-4 text-sm text-muted">
                  Share to move up and unlock rewards
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 overflow-hidden rounded-xl border border-[var(--border)] bg-surface-light/60 px-4 py-3">
                    <p className="truncate font-mono text-sm text-muted">
                      {referralLink}
                    </p>
                  </div>
                  <button
                    onClick={copyReferralLink}
                    className={`shrink-0 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                      copied
                        ? "bg-success/10 text-success"
                        : "btn-gradient text-white"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-5">
                  <div className="rounded-xl bg-accent-light/40 p-3 text-center">
                    <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-accent">
                      {currentUser?.referralCount || 0}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted">Referrals</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3 text-center">
                    <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-warning">
                      {WAITLIST_CONFIG.rewardTiers.filter(
                        (t) => (currentUser?.referralCount || 0) >= t.referralsNeeded
                      ).length}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted">Rewards</p>
                  </div>
                </div>
              </div>

              <div className="mx-auto mb-8 max-w-lg">
                <h3 className="mb-3 text-left font-[family-name:var(--font-display)] font-semibold">
                  Share with friends
                </h3>
                <ShareButtons referralLink={referralLink} />
              </div>

              <div className="mt-14 flex flex-col items-center">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Launching in
                </p>
                <CountdownTimer targetDate={WAITLIST_CONFIG.launchDate} compact />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="relative border-y border-[var(--border)] bg-surface-light/50 py-14">
        <div className="relative mx-auto grid max-w-5xl grid-cols-3 gap-6 px-6">
          {[
            {
              value: `${animatedTotal.toLocaleString()}+`,
              label: "On the waitlist",
              color: "text-accent",
              bg: "bg-accent-light/50",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              ),
            },
            {
              value: `${daysUntilLaunch}`,
              label: "Days until launch",
              color: "text-[#F472B6]",
              bg: "bg-pink-50",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              value: `${WAITLIST_CONFIG.rewardTiers.length}`,
              label: "Reward tiers",
              color: "text-warning",
              bg: "bg-amber-50",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              ),
            },
          ].map((stat, i) => (
            <div key={i} className="card-soft flex flex-col items-center rounded-2xl border border-[var(--border)] px-4 py-6 text-center">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <p className={`font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== TRUSTED BY / LOGOS ========== */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-muted/70">
            Featured in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {WAITLIST_CONFIG.trustedBy.map((company, i) => (
              <div
                key={company.name}
                className="will-animate animate-fade-in text-xl font-[family-name:var(--font-display)] font-bold tracking-tight text-muted/30 transition-colors hover:text-muted/50"
                style={{ animationDelay: `${200 + i * 100}ms` }}
              >
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURE PREVIEW ========== */}
      <section className="relative py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-surface-light/50 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <p className="will-animate animate-slide-up mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Coming Soon
            </p>
            <h2 className="will-animate animate-slide-up delay-100 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              What we&apos;re building
            </h2>
            <p className="will-animate animate-slide-up delay-200 mt-4 text-lg text-muted">
              A sneak peek at the features that will change how you launch
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WAITLIST_CONFIG.features.map((feature, i) => (
              <div
                key={feature.title}
                className="will-animate animate-slide-up card-soft group rounded-2xl border border-[var(--border)] p-6 transition-all duration-300"
                style={{ animationDelay: `${250 + i * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light/50 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-[15px] font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW REFERRALS WORK ========== */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <p className="will-animate animate-slide-up mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              How it works
            </p>
            <h2 className="will-animate animate-slide-up delay-100 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Invite friends. Earn rewards.
            </h2>
            <p className="will-animate animate-slide-up delay-200 mt-4 text-lg text-muted">
              Three simple steps to unlock exclusive perks
            </p>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-3">
            {/* Connecting line (desktop only) */}
            <div className="pointer-events-none absolute left-0 right-0 top-[72px] hidden h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent sm:block" />

            {[
              {
                step: "01",
                title: "Sign up",
                description: "Join the waitlist and get your unique referral link instantly",
                color: "text-accent",
                bg: "bg-accent-light/50",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Share your link",
                description: "Send it to friends who would love what we're building",
                color: "text-[#F472B6]",
                bg: "bg-pink-50",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Unlock rewards",
                description: "Hit milestones to earn early access, discounts, and VIP perks",
                color: "text-warning",
                bg: "bg-amber-50",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.522m0 0a6.003 6.003 0 01-3.77-1.522" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="will-animate animate-slide-up card-soft group relative rounded-2xl border border-[var(--border)] p-7"
                style={{ animationDelay: `${300 + i * 150}ms` }}
              >
                {/* Step icon */}
                <div className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}>
                  <div className={`${item.color}`}>{item.icon}</div>
                </div>

                {/* Step label */}
                <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] ${item.color}`}>
                  Step {item.step}
                </p>

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
      <section className="relative py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-surface-light/60 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <p className="will-animate animate-slide-up mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Rewards
            </p>
            <h2 className="will-animate animate-slide-up delay-100 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Referral rewards
            </h2>
            <p className="will-animate animate-slide-up delay-200 mt-4 text-lg text-muted">
              Every friend you bring gets you closer to exclusive perks
            </p>
          </div>

          <RewardTiers
            currentReferrals={currentUser?.referralCount || 0}
            showProgress={isSignedUp}
          />
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <p className="will-animate animate-slide-up mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              What people are saying
            </p>
            <h2 className="will-animate animate-slide-up delay-100 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Early supporters love it
            </h2>
            <p className="will-animate animate-slide-up delay-200 mt-4 text-lg text-muted">
              Don&apos;t just take our word for it
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {WAITLIST_CONFIG.testimonials.map((testimonial, i) => {
              const avatarColors = [
                "from-violet-400 to-indigo-500",
                "from-pink-400 to-rose-500",
                "from-amber-400 to-orange-500",
              ];

              return (
                <div
                  key={testimonial.name}
                  className="will-animate animate-slide-up card-soft flex flex-col rounded-2xl border border-[var(--border)] p-6"
                  style={{ animationDelay: `${300 + i * 120}ms` }}
                >
                  {/* Stars */}
                  <div className="mb-4 flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="mb-6 flex-1 text-[15px] leading-relaxed text-foreground/80">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-[var(--border)] pt-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${avatarColors[i % avatarColors.length]}`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== TEAM ========== */}
      <section className="relative py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-surface-light/40 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <p className="will-animate animate-slide-up mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Meet the team
            </p>
            <h2 className="will-animate animate-slide-up delay-100 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Built by passionate people
            </h2>
            <p className="will-animate animate-slide-up delay-200 mt-4 text-lg text-muted">
              We&apos;re a small team with big ambitions
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {WAITLIST_CONFIG.team.map((member, i) => {
              const avatarColors = [
                "from-accent to-[#A78BFA]",
                "from-emerald-400 to-teal-500",
                "from-[#F472B6] to-rose-500",
              ];

              return (
                <div
                  key={member.name}
                  className="will-animate animate-slide-up card-soft group rounded-2xl border border-[var(--border)] p-6 text-center"
                  style={{ animationDelay: `${300 + i * 120}ms` }}
                >
                  {/* Avatar */}
                  <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-105 ${avatarColors[i % avatarColors.length]}`}>
                    {member.avatar}
                  </div>

                  <h3 className="mb-1 font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-accent">
                    {member.role}
                  </p>
                  <p className="text-[13px] leading-relaxed text-muted">
                    {member.bio}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-14 text-center">
            <p className="will-animate animate-slide-up mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              FAQ
            </p>
            <h2 className="will-animate animate-slide-up delay-100 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Questions? We&apos;ve got answers.
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "When will you launch?",
                a: `We're planning to launch in ${new Date(
                  WAITLIST_CONFIG.launchDate
                ).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}. Waitlist members will be the first to know — we'll send you an email.`,
              },
              {
                q: "How does the referral system work?",
                a: "After signing up, you'll get a unique referral link. Share it with friends — when they join through your link, your referral count goes up and you unlock rewards at each milestone.",
              },
              {
                q: "Is it free to join?",
                a: "Absolutely. Joining the waitlist costs nothing. Some reward tiers include paid product discounts or exclusive features at launch.",
              },
              {
                q: "Can I change my email later?",
                a: "Of course. Just reach out and we'll update your entry. Your referral count and rewards carry over.",
              },
            ].map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} delay={200 + i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      {!isSignedUp && (
        <section className="relative overflow-hidden py-24">
          {/* Soft gradient background */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-light/40 via-pink-50/30 to-surface-light/50" />
          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Don&apos;t miss your spot
            </h2>
            <p className="mb-10 text-lg text-muted">
              Join {totalSignups.toLocaleString()}+ others already on the waitlist
            </p>
            <a
              href="#signup"
              className="btn-gradient inline-flex rounded-xl px-10 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold text-white"
            >
              Join the Waitlist
            </a>
          </div>
        </section>
      )}

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-[var(--border)] bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#A78BFA] font-[family-name:var(--font-display)] text-xs font-bold text-white">
              {WAITLIST_CONFIG.logoEmoji}
            </div>
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold">
              {WAITLIST_CONFIG.productName}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-muted/70 transition-colors hover:text-accent"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </a>
            <p className="text-sm text-muted/50">
              Built with <span className="text-muted/70">WaitLyst</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
