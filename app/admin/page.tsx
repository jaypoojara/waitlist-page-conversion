"use client";

import { useState, useEffect, useMemo } from "react";
import { WAITLIST_CONFIG } from "@/lib/config";
import {
  getWaitlist,
  getTotalSignups,
  exportToCSV,
  seedDemoData,
  type WaitlistEntry,
} from "@/lib/waitlist";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedDemoData();
    setMounted(true);

    // Check session
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("waitlyst_admin") === "true"
    ) {
      setAuthenticated(true);
      setEntries(getWaitlist());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === WAITLIST_CONFIG.admin.password) {
      setAuthenticated(true);
      sessionStorage.setItem("waitlyst_admin", "true");
      setEntries(getWaitlist());
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleExport = () => {
    const csv = exportToCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlyst-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.email.toLowerCase().includes(q) ||
        e.referralCode.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySignups = entries.filter(
      (e) => new Date(e.createdAt).toDateString() === today
    ).length;
    const totalReferrals = entries.reduce((s, e) => s + e.referralCount, 0);
    const topReferrer = entries.reduce(
      (top, e) => (e.referralCount > (top?.referralCount || 0) ? e : top),
      null as WaitlistEntry | null
    );
    return { total: entries.length, todaySignups, totalReferrals, topReferrer };
  }, [entries]);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // --- Password Gate ---
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-[#A78BFA] font-[family-name:var(--font-display)] font-bold text-white shadow-md shadow-accent/20">
              {WAITLIST_CONFIG.logoEmoji}
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted">
              Enter password to continue
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Password"
              className="mb-3 w-full rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-foreground placeholder-muted outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
              autoFocus
            />
            {passwordError && (
              <p className="mb-3 text-sm text-red-500">
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              className="btn-gradient w-full rounded-xl px-4 py-3 font-[family-name:var(--font-display)] font-semibold text-white"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            Default password: <code className="rounded bg-accent-light px-1.5 py-0.5 text-accent">admin123</code>
            <br />
            Change it in{" "}
            <code className="rounded bg-accent-light px-1.5 py-0.5 text-accent">lib/config.ts</code>
          </p>
        </div>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#A78BFA] font-[family-name:var(--font-display)] text-xs font-bold text-white">
              {WAITLIST_CONFIG.logoEmoji}
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <a
            href="/"
            className="rounded-lg border border-[var(--border)] bg-surface px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            &larr; Back to site
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Signups",
              value: stats.total.toLocaleString(),
              color: "text-accent",
              bg: "bg-accent-light/50",
            },
            {
              label: "Today",
              value: stats.todaySignups.toLocaleString(),
              color: "text-success",
              bg: "bg-emerald-50",
            },
            {
              label: "Total Referrals",
              value: stats.totalReferrals.toLocaleString(),
              color: "text-warning",
              bg: "bg-amber-50",
            },
            {
              label: "Top Referrer",
              value: stats.topReferrer
                ? `${stats.topReferrer.referralCount}`
                : "—",
              subtitle: stats.topReferrer?.email,
              color: "text-[#F472B6]",
              bg: "bg-pink-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="card-soft rounded-2xl border border-[var(--border)] p-5"
            >
              <p className="text-sm text-muted">{stat.label}</p>
              <p
                className={`mt-1 font-[family-name:var(--font-display)] text-3xl font-bold ${stat.color}`}
              >
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="mt-1 truncate text-xs text-muted">
                  {stat.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Actions row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or referral code..."
              className="w-full rounded-xl border border-[var(--border)] bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/20 sm:w-80"
            />
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="card-soft overflow-hidden rounded-2xl border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-surface-light/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Referral Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Referrals
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted sm:table-cell">
                    Referred By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-muted"
                    >
                      {search
                        ? "No results found"
                        : "No signups yet"}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="transition-colors hover:bg-surface-light/40"
                    >
                      <td className="px-4 py-3 text-sm text-muted">
                        {entry.position}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {entry.email}
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded-md bg-accent-light/50 px-2 py-0.5 text-xs text-accent">
                          {entry.referralCode}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-semibold ${
                            entry.referralCount > 0
                              ? "text-success"
                              : "text-muted"
                          }`}
                        >
                          {entry.referralCount}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-muted sm:table-cell">
                        {entry.referredBy ? (
                          <code className="rounded-md bg-surface-light px-2 py-0.5 text-xs">
                            {entry.referredBy}
                          </code>
                        ) : (
                          <span className="text-muted/50">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table footer */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing {filteredEntries.length} of {entries.length} entries
          </p>
          <p className="text-xs text-muted/50">
            Data stored in localStorage (demo mode)
          </p>
        </div>
      </div>
    </div>
  );
}
