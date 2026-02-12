# WaitLyst — Waitlist / Coming Soon Page

> A high-converting waitlist template with built-in referral mechanics and reward tiers.

## Brand Identity
- **Theme:** Light, friendly, approachable with soft violet-lavender accents
- **Primary Color:** Vibrant Violet (#7C5CFC) with deeper variant (#6D4AFF)
- **Gradient Accent:** Violet → Lavender → Pink (#7C5CFC → #A78BFA → #F472B6)
- **Success Color:** Fresh Green (#22C55E)
- **Warning/Gold Color:** Warm Amber (#F59E0B)
- **Background:** Light lavender-white (#FAFAFF)
- **Surfaces:** White (#FFFFFF) with light lavender variant (#F5F3FF)
- **Fonts:** Space Grotesk (headings) + DM Sans (body)
- **Effects:** Soft shadow cards, morphing pastel blobs, floating dots, gradient border accents, gradient buttons

## Pages
- **Waitlist Page** (`/`) — Main landing page with email capture, countdown timer, referral system, reward tiers, FAQ, and social proof
- **Admin Dashboard** (`/admin`) — Password-protected dashboard to view signups, search, and export CSV

## Key Features
- **Email capture** with validation and duplicate detection in a white card with soft shadow
- **Referral system** — each signup gets a unique share link with copy button
- **Position counter** — shows "You're #X" with violet-pink gradient text after signup
- **Reward tiers** — 4 milestone rewards (3, 10, 25, 50 referrals) with pastel color theming (violet, emerald, amber, rose)
- **Countdown timer** — live countdown with soft shadow cards (compact mode post-signup)
- **Social proof** — animated counting counter with stacked colorful avatar indicators
- **Social sharing** — pre-written share messages for X/Twitter, LinkedIn, WhatsApp, and Email
- **Interactive FAQ** — collapsible accordion with smooth CSS transitions
- **Stats bar** — 3 icon cards with colored backgrounds (violet, pink, amber)
- **How It Works** — 3-step color-coded cards (violet, pink, amber) with connecting gradient line
- **Admin dashboard** — search, stats overview, CSV export (linked in footer)
- **Visual effects** — morphing pastel background blobs, floating dots, soft card shadows with hover lift, gradient buttons with color shift

## Page Sections (in order)
1. **Hero** — Headline, email form, social proof avatars, countdown timer
2. **Stats Bar** — 3 icon cards (waitlist count, days to launch, reward tiers)
3. **Trusted By / Logos** — "Featured in" row with company names (TechCrunch, Product Hunt, etc.)
4. **Feature Preview** — 6 upcoming features in a 3-column grid with emoji icons
5. **How It Works** — 3 color-coded step cards (Sign up → Share → Unlock rewards)
6. **Referral Rewards** — 4 tier cards with per-color theming and progress bars
7. **Testimonials** — 3 quote cards with star ratings, author name/role, and gradient avatar
8. **Team** — 3 team members with avatar, role, and bio
9. **FAQ** — 4 collapsible accordion items
10. **CTA Banner** — Final call-to-action with soft gradient background (hidden post-signup)
11. **Footer** — Logo, Admin link, "Built with WaitLyst"

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

### Change features, testimonials, team, or logos
All in `lib/config.ts`. Edit the `features`, `testimonials`, `team`, or `trustedBy` arrays. You can add, remove, or change entries freely.

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
- Created complete WaitLyst template
- Built email capture with validation and duplicate detection
- Added referral system with unique share links
- Created countdown timer component
- Built 4-tier reward system with progress tracking
- Added social sharing (X, LinkedIn, WhatsApp, Email)
- Created admin dashboard with search, stats, and CSV export
- Pre-seeded 147 demo entries for realistic preview
- Added smooth animations (fade, slide, scale, gradient shift)
- Interactive FAQ accordion with CSS grid-rows transition
- Stats bar with icon cards for waitlist metrics
- How It Works section with 3-step cards and connecting gradient line
- Admin link in footer with gear icon
- CTA section with soft gradient background (hidden post-signup)
- **Light theme redesign:** Switched from dark to light friendly violet-lavender theme
- **New color palette:** Vibrant violet (#7C5CFC) with pink (#F472B6) gradient accents on off-white background
- **Soft card shadows** replaced glass-morphism for cleaner, friendlier look
- **Morphing pastel blobs** replace dark breathing orbs in hero background
- **Gradient buttons** (violet → lavender → pink) with hover color shift
- **Pastel icon backgrounds** (violet-50, pink-50, amber-50) for color-coded sections
- **White frosted navbar** with backdrop blur
- **Added 4 new sections:** Feature Preview (6 features in 3-col grid), Testimonials (3 quote cards with stars), Team (3 members with bios), Trusted By (5 company name logos)
- All new section data is customizable in `lib/config.ts`
