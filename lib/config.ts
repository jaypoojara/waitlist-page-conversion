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

  // --- Features Preview ---
  // Showcase what you're building
  features: [
    {
      title: "Smart Analytics",
      description: "Real-time insights into your launch performance and audience engagement.",
      icon: "📊",
    },
    {
      title: "Viral Referrals",
      description: "Built-in referral engine that turns every signup into a growth channel.",
      icon: "🔗",
    },
    {
      title: "Custom Branding",
      description: "Make it yours with full theme customization and white-label support.",
      icon: "🎨",
    },
    {
      title: "Email Sequences",
      description: "Automated drip campaigns to keep your waitlist warm and engaged.",
      icon: "✉️",
    },
    {
      title: "Integrations",
      description: "Connect with Zapier, Slack, Mailchimp, and 50+ other tools.",
      icon: "🧩",
    },
    {
      title: "A/B Testing",
      description: "Test different headlines, CTAs, and reward tiers to maximize conversions.",
      icon: "🧪",
    },
  ],

  // --- Testimonials ---
  // Quotes from early supporters or beta users
  testimonials: [
    {
      quote: "This is exactly what I needed for my product launch. The referral system alone is worth it.",
      name: "Sarah Chen",
      role: "Founder, Pixelflow",
      avatar: "SC",
    },
    {
      quote: "We grew our waitlist from 200 to 5,000 in two weeks. The viral loop is incredible.",
      name: "Marcus Rivera",
      role: "CEO, Launchpad.io",
      avatar: "MR",
    },
    {
      quote: "Clean design, easy to customize, and the analytics are top-notch. Highly recommend.",
      name: "Emily Park",
      role: "Product Lead, Nova",
      avatar: "EP",
    },
  ],

  // --- Team ---
  // The people behind the product
  team: [
    {
      name: "Alex Thompson",
      role: "CEO & Co-founder",
      avatar: "AT",
      bio: "Previously built and sold two SaaS companies. Passionate about helping founders launch better.",
    },
    {
      name: "Priya Sharma",
      role: "CTO & Co-founder",
      avatar: "PS",
      bio: "Ex-Stripe engineer. Obsessed with building tools that are simple on the surface, powerful underneath.",
    },
    {
      name: "Jordan Lee",
      role: "Head of Design",
      avatar: "JL",
      bio: "Former design lead at Figma. Believes great products start with great user experiences.",
    },
  ],

  // --- Trusted By / Logos ---
  // Companies, press, or partners
  trustedBy: [
    { name: "TechCrunch" },
    { name: "Product Hunt" },
    { name: "Y Combinator" },
    { name: "Forbes" },
    { name: "Indie Hackers" },
  ],

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
