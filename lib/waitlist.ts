// ============================================
// WAITLIST DATA MANAGEMENT
// Uses localStorage for demo — swap with your
// API/database in production
// ============================================

export interface WaitlistEntry {
  id: string;
  email: string;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  position: number;
  createdAt: string;
}

const STORAGE_KEY = "waitlyst_entries";
const CURRENT_USER_KEY = "waitlyst_current_user";

// --- Helpers ---

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// --- Core Functions ---

export function getWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveWaitlist(entries: WaitlistEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getCurrentUser(): WaitlistEntry | null {
  if (typeof window === "undefined") return null;
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return null;
  const entries = getWaitlist();
  return entries.find((e) => e.email === email) || null;
}

export function setCurrentUser(email: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, email);
}

export function clearCurrentUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isEmailRegistered(email: string): boolean {
  return getWaitlist().some(
    (e) => e.email.toLowerCase() === email.toLowerCase().trim()
  );
}

export function addToWaitlist(
  email: string,
  referredBy: string | null
): WaitlistEntry {
  const entries = getWaitlist();

  const normalizedEmail = email.toLowerCase().trim();

  if (isEmailRegistered(normalizedEmail)) {
    throw new Error("This email is already on the waitlist!");
  }

  const newEntry: WaitlistEntry = {
    id: generateId(),
    email: normalizedEmail,
    referralCode: generateReferralCode(),
    referredBy: referredBy || null,
    referralCount: 0,
    position: entries.length + 1,
    createdAt: new Date().toISOString(),
  };

  // Increment referrer's count
  if (referredBy) {
    const referrerIndex = entries.findIndex(
      (e) => e.referralCode === referredBy
    );
    if (referrerIndex >= 0) {
      entries[referrerIndex].referralCount += 1;
    }
  }

  entries.push(newEntry);
  saveWaitlist(entries);
  setCurrentUser(newEntry.email);

  return newEntry;
}

export function getTotalSignups(): number {
  return getWaitlist().length;
}

export function getEntryByReferralCode(
  code: string
): WaitlistEntry | undefined {
  return getWaitlist().find((e) => e.referralCode === code);
}

export function refreshCurrentUser(): WaitlistEntry | null {
  const user = getCurrentUser();
  if (!user) return null;
  // Re-read from storage to get latest referral counts
  const entries = getWaitlist();
  return entries.find((e) => e.email === user.email) || null;
}

export function exportToCSV(): string {
  const entries = getWaitlist();
  const headers = [
    "Position",
    "Email",
    "Referral Code",
    "Referrals",
    "Referred By",
    "Joined",
  ];
  const rows = entries.map((e) => [
    e.position,
    e.email,
    e.referralCode,
    e.referralCount,
    e.referredBy || "",
    new Date(e.createdAt).toLocaleDateString(),
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

// --- Demo Data Seeding ---

export function seedDemoData(): void {
  if (typeof window === "undefined") return;
  if (getWaitlist().length > 0) return;

  const firstNames = [
    "sarah", "alex", "jordan", "casey", "taylor",
    "morgan", "riley", "avery", "quinn", "blake",
    "drew", "sage", "reese", "skylar", "charlie",
    "finley", "hayden", "jamie", "logan", "parker",
    "emery", "rowan", "dakota", "river", "phoenix",
    "kai", "milan", "remy", "eden", "arden",
    "blair", "campbell", "devon", "ellis", "frankie",
    "grey", "hollis", "indigo", "jules", "kit",
    "lane", "marlowe", "nico", "oakley", "peyton",
    "rain", "shea", "tatum", "uri", "vale",
  ];

  const domains = [
    "gmail.com", "outlook.com", "hey.com",
    "icloud.com", "proton.me", "yahoo.com",
    "fastmail.com", "me.com",
  ];

  const entries: WaitlistEntry[] = [];
  const count = 147;

  for (let i = 0; i < count; i++) {
    const nameIndex = i % firstNames.length;
    const domainIndex = i % domains.length;
    const suffix = i >= firstNames.length ? Math.floor(i / firstNames.length) : "";

    const referredBy =
      i > 10
        ? entries[Math.floor(Math.random() * Math.min(i, 10))].referralCode
        : null;

    entries.push({
      id: generateId(),
      email: `${firstNames[nameIndex]}${suffix}@${domains[domainIndex]}`,
      referralCode: generateReferralCode(),
      referredBy,
      referralCount: Math.max(0, Math.floor(Math.random() * 6) - 2),
      position: i + 1,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  // Make some entries look like power referrers
  entries[0].referralCount = 23;
  entries[1].referralCount = 15;
  entries[2].referralCount = 11;
  entries[5].referralCount = 8;
  entries[8].referralCount = 6;

  saveWaitlist(entries);
}
