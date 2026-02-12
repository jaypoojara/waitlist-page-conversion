// ============================================
// WAITLYST CONFIGURATION
// Edit these values to customize your waitlist
// ============================================

export const WAITLIST_CONFIG = {
  // --- Branding ---
  productName: "WaitLyst",
  tagline: "The future of product launches starts here",
  description:
    "Be first in line. Join the waitlist for early access, exclusive perks, and rewards for spreading the word.",
  logoEmoji: "W",

  // --- Launch Date ---
  // Set your launch date (ISO format)
  launchDate: "2026-06-01T09:00:00",

  // --- Reward Tiers ---
  // Customize the rewards users earn by referring friends
  rewardTiers: [
    {
      referralsNeeded: 3,
      title: "Early Access",
      description: "Skip the line — get in before everyone else",
      icon: "🎯",
    },
    {
      referralsNeeded: 10,
      title: "30% Lifetime Discount",
      description: "Lock in a permanent discount, forever",
      icon: "💎",
    },
    {
      referralsNeeded: 25,
      title: "Founding Member",
      description: "Exclusive badge + early feature access",
      icon: "👑",
    },
    {
      referralsNeeded: 50,
      title: "VIP Launch Event",
      description: "Private invite to our launch celebration",
      icon: "🌟",
    },
  ],

  // --- Social Sharing Messages ---
  // {product} and {link} are replaced automatically
  social: {
    twitter:
      "I just joined the {product} waitlist. Something big is coming.\n\n{link}",
    linkedin:
      "Excited to join the {product} waitlist! Can't wait to see what they're building.\n\n{link}",
    whatsapp:
      "Hey! I just signed up for {product}. Looks really promising — thought you'd want in too: {link}",
    email: {
      subject: "You're invited: {product} waitlist",
      body: "Hey,\n\nI just joined the {product} waitlist and thought you'd be interested. They're building something pretty exciting.\n\nHere's my invite link: {link}\n\nSee you there!",
    },
  },

  // --- Admin ---
  admin: {
    password: "admin123", // Change this!
  },
};
