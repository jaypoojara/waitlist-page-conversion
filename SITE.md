# WaitLyst — Waitlist / Coming Soon Page

> A high-converting waitlist template with built-in referral mechanics and reward tiers.

## Brand Identity
- **Theme:** Dark, premium, exclusive feel
- **Primary Color:** Indigo (#818CF8) with deeper variant (#6366F1)
- **Success Color:** Emerald (#34D399)
- **Warning/Gold Color:** Amber (#FBBF24)
- **Background:** Near-black (#06060F)
- **Fonts:** Space Grotesk (headings) + DM Sans (body)

## Pages
- **Waitlist Page** (`/`) — Main landing page with email capture, countdown timer, referral system, reward tiers, FAQ, and social proof
- **Admin Dashboard** (`/admin`) — Password-protected dashboard to view signups, search, and export CSV

## Key Features
- **Email capture** with validation and duplicate detection
- **Referral system** — each signup gets a unique share link
- **Position counter** — shows "You're #X" after signup
- **Reward tiers** — 4 milestone rewards (3, 10, 25, 50 referrals)
- **Countdown timer** — live countdown to launch date
- **Social proof** — animated counter showing total signups
- **Social sharing** — pre-written share messages for X/Twitter, LinkedIn, WhatsApp, and Email
- **Admin dashboard** — search, stats overview, CSV export

## Components
- **WaitlistApp** — Main page component managing signup state and all sections
- **CountdownTimer** — Live countdown to the launch date
- **RewardTiers** — Visual reward tier cards with progress tracking
- **ShareButtons** — Social sharing buttons with pre-written copy

## How to Customize

### Change product name, tagline, and launch date
Open `lib/config.ts` and edit the values at the top. Everything updates automatically.

### Change reward tiers
In `lib/config.ts`, edit the `rewardTiers` array. You can change the number of referrals needed, titles, descriptions, and icons.

### Change colors
Open `app/globals.css` and edit the CSS variables in `:root`. The main ones:
- `--accent` — primary brand color
- `--accent-strong` — deeper variant for buttons
- `--background` — page background
- `--surface` — card/section backgrounds

### Change social share messages
In `lib/config.ts`, edit the `social` section. Use `{product}` and `{link}` as placeholders.

### Admin password
Change the password in `lib/config.ts` under `admin.password`. Default is `admin123`.

### Connect to a real database
Replace the localStorage calls in `lib/waitlist.ts` with your API endpoints. The interface stays the same.

## Project Structure
```
app/
├── layout.tsx          — Page wrapper with fonts and metadata
├── page.tsx            — Homepage (renders WaitlistApp)
├── globals.css         — Theme colors, animations, and utility classes
└── admin/page.tsx      — Admin dashboard
components/
├── WaitlistApp.tsx     — Main waitlist page (all sections)
├── CountdownTimer.tsx  — Countdown timer component
├── RewardTiers.tsx     — Reward tier cards
├── ShareButtons.tsx    — Social sharing buttons
└── AgentationProvider.tsx — Ship Studio dev tool
lib/
├── config.ts           — All customizable settings in one place
└── waitlist.ts         — Waitlist data management (localStorage)
```

## Recent Changes
- Created complete WaitLyst template with dark premium theme
- Built email capture with validation and duplicate detection
- Added referral system with unique share links
- Created countdown timer component
- Built 4-tier reward system with progress tracking
- Added social sharing (X, LinkedIn, WhatsApp, Email)
- Created admin dashboard with search, stats, and CSV export
- Pre-seeded 147 demo entries for realistic preview
- Added smooth animations (fade, slide, scale, gradient shift)
