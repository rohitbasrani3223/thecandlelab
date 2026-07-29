# ╔══════════════════════════════════════════════════════════════════╗
# ║        THE CANDLE LAB 3.0 — AI CODING AGENT MASTER PROMPT      ║
# ║             GLOBAL UX / UI / CODE QUALITY CONSTITUTION         ║
# ╚══════════════════════════════════════════════════════════════════╝

This document is **LAW** for every AI agent, Copilot, or developer
working on The Candle Lab 3.0 platform.

Every single component, page, modal, table, form, and animation
must obey ALL rules in this document.

No exceptions. No shortcuts.

---

## 1. BRAND IDENTITY — ALWAYS ENFORCE

```
Brand Name     : The Candle Lab
Brand Voice    : Luxury. Calm. Artisan. Premium. Indian. Elevated.
Target Emotion : "This feels expensive and trustworthy."
```

### Design Tokens (NON-NEGOTIABLE)

| Token            | Hex       | Use                                      |
|------------------|-----------|------------------------------------------|
| Gold Primary     | `#C4964A` | CTAs, highlights, icons, borders, badges |
| Gold Light       | `#D4A96A` | Hover states, gradients                  |
| Gold Dark        | `#A87B32` | Pressed states, text on gold             |
| Warm White       | `#FDFAF5` | Primary background                       |
| Ivory            | `#F5EFE4` | Card surfaces, section backgrounds       |
| Cream            | `#EDE4D4` | Borders, dividers, subtle fills          |
| Text Primary     | `#1A1208` | All primary headings and body text       |
| Text Secondary   | `#4A3728` | Subtext, descriptions                    |
| Text Muted       | `#8B7355` | Labels, hints, placeholders              |
| Accent Brown     | `#8B5E3C` | Supporting accents, pills                |
| Success Green    | `#4A7C59` | Order confirmed, stock in, success toast |
| Error Red        | `#B85450` | Form errors, out of stock, failure toast |
| Warning Gold     | `#C4964A` | Low stock, pending alerts                |

### Typography Rules

| Element            | Font                          | Style                        |
|--------------------|-------------------------------|------------------------------|
| Page H1            | Cormorant Garamond            | Light or Regular, 48–72px    |
| Section H2         | Cormorant Garamond            | Regular, 32–48px             |
| Card H3            | Cormorant Garamond            | Regular, 20–28px             |
| Body / Description | Inter                         | Regular 400, 14–16px         |
| Labels / Caps      | Inter                         | Bold 600, 10–12px, tracking  |
| Prices / Numbers   | Inter                         | SemiBold 600, tabular nums   |
| Hero Italic Accent | Cormorant Garamond Italic     | Light, gold color            |

**NEVER use system fonts. NEVER use font-weight 700+ for headings.**

---

## 2. GLOBAL LAYOUT RULES — EVERY PAGE

### ✅ Do This

- Use `sticky top-0 z-[300] backdrop-blur-md bg-[#FDFAF5]/96` for the Navbar — NEVER `fixed` without compensating padding.
- Use `.section` class from `globals.css` for consistent section spacing.
- Use `.container` class with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Guide the user's eye in this exact Z-pattern flow:

```
  [Announcement Bar]
  [Sticky Navbar]
  ──────────────────────────────────────
  [Hero / Page Title] ←── H1, only ONE per page
  [Primary CTA]
  [Main Content]
  [Secondary Content]
  [Related / Supplementary Content]
  [Footer]
```

- Every page must answer these questions **within 3 seconds**:
  1. What page am I on?
  2. What is the most important thing here?
  3. What should I click next?

### ❌ Never Do This

- **Never** use `fixed` navbar without `padding-top` compensation on `<main>`.
- **Never** place two `z-index` layers on the same Y-axis position.
- **Never** stack multiple overlapping `absolute` elements without `isHovered` guards.
- **Never** use `pt-28` or `pt-24` on hero sections when the navbar is already `sticky` — it creates dead space.
- **Never** use inline color values like `text-red-600`, `bg-blue-500` — always use the brand tokens above.
- **Never** display every available data field simultaneously.

---

## 3. INFORMATION ARCHITECTURE — PROGRESSIVE DISCLOSURE

**Show only what the user needs RIGHT NOW. Hide everything else progressively.**

### Hierarchy Priority (show in this order)

```
LEVEL 1 — Always Visible
  → Image | Title | Price | Rating | Primary CTA

LEVEL 2 — On Expand / Tab / Hover
  → Description | Specifications | Burn Time | Wax Notes | Reviews

LEVEL 3 — On Request
  → Shipping Policy | Return Policy | FAQs | Care Instructions

LEVEL 4 — Never Show Uninvited
  → SKU | Barcode | Internal Metadata | Admin-only Fields
```

### Progressive Disclosure Patterns

Use these patterns to hide Level 2+ content:

- **Tabs** — Product detail specs, reviews, shipping
- **Accordions** — FAQs, filter groups, order details
- **Drawers (slide-in)** — Cart, quick view, filter panel
- **Modals** — Auth, size guide, fragrance quiz, image lightbox
- **Hover Cards** — Quick product preview
- **Expandable Rows** — Admin order details, customer history
- **"Show More" buttons** — Review lists, blog content, description

---

## 4. COMPONENT-SPECIFIC RULES

### ProductCard

- Show: Image, Name, Price (+ original if discount), Rating, Wishlist button.
- Show burn-time pill + wax badge ONLY when `!isHovered`.
- Show hover action buttons (Quick View, Add to Cart CTA) ONLY when `isHovered`.
- Only show **ONE badge** at a time: Bestseller > New Arrival > Sale%.
- Stock status: `In Stock` only if `stock <= 5` — otherwise don't show stock count.
- Keep product name to max 2 lines. Use `line-clamp-2`.
- Price must always use `formatPrice()` — never raw numbers.

### Navbar

- Position: `sticky top-0` — NEVER `fixed` alone.
- On scroll: apply `backdrop-blur-md`, `bg-[#FDFAF5]/96`, and subtle gold `border-b`.
- Mobile: full-screen slide-in drawer, not a dropdown.
- Cart + Wishlist badges: pill with count, only visible if count > 0.
- Search: opens a full modal search overlay, not inline expansion.

### HeroBanner

- No `pt-28` when Navbar is sticky — use `py-12 lg:py-16`.
- H1 must use Cormorant Garamond, max 2 lines, no wrapping on desktop.
- Max 2 CTAs: Primary (filled gold) + Secondary (outlined).
- Auto-slide interval: 7–8 seconds (not faster — luxury = calm).
- Feature pills (burn time / wax type) positioned below CTAs, not over image.

### Cart Drawer / Cart Page

- Line items: image thumbnail + name + quantity selector + subtotal + delete.
- Free shipping progress bar: always visible at top of cart.
- Coupon input: collapsed by default, expand on click. Never a full-width form.
- Order summary: sticky on desktop right column.
- CTA: "Proceed to Checkout" — full-width gold button at bottom.

### Checkout Flow

- Max 3 steps: Address → Payment → Confirm.
- Step indicator visible at all times.
- Auto-detect Indian pincode → fill city & state.
- Payment options: UPI | Card | COD — radio group, not tabs.
- Show order summary sidebar (sticky) on desktop at all times.
- Confirmation page: animated success, order ID, estimated delivery.

### Admin Panel

- Dashboard cards: 4 KPI cards in a row — Revenue, Orders, Products, Customers.
- Table columns: show max 6 columns. Everything else → "View Details" drawer.
- Actions: group into "..." dropdown menus — never inline multiple buttons per row.
- Filters: collapsed by default, expand on click.
- Status badges: use consistent pill colors across ALL admin tables:
  - Processing → `#C4964A` (gold)
  - Shipped → `#4A6B8A` (blue)
  - Delivered → `#4A7C59` (green)
  - Cancelled → `#B85450` (red)
  - Pending → `#8B7355` (muted)

---

## 5. SPACING & WHITESPACE RULES

**Whitespace is not empty space. It is part of the design.**

| Spacing Context          | Value               |
|--------------------------|---------------------|
| Section vertical padding | `py-16 lg:py-24`    |
| Section horizontal pad   | `px-4 sm:px-6 lg:px-8` |
| Card inner padding       | `p-5 lg:p-6`        |
| Between section cards    | `gap-4 lg:gap-6`    |
| Between form fields      | `space-y-5`         |
| Between nav links        | `gap-5 lg:gap-7`    |
| Between badge pills      | `gap-1.5`           |
| Icon + text gap          | `gap-1.5` or `gap-2` |

If a section feels **crowded**, add more whitespace. Do NOT shrink elements.
If content doesn't fit, **split into multiple sections** or use **progressive disclosure**.

---

## 6. ANIMATION & INTERACTION RULES

- Framer Motion for all transitions — never CSS `transition` + `opacity` only.
- Entry animations: `opacity: 0 → 1` + `y: 24 → 0`, duration `0.5–0.7s`.
- Stagger children: `staggerChildren: 0.08–0.12s` for grid layouts.
- Hover animations: scale `1.02–1.05` max — never bigger.
- Button press: scale `0.96` on `active:`.
- Page transitions: use `AnimatePresence` with `mode="wait"`.
- Auto-sliders: ease in/out, no abrupt cuts.
- **Never** use `duration-300 + transform` with conflicting `transition` classes.

**Golden Rule: Animations must feel effortless, not flashy.**
Luxury brands move slowly and confidently. Never rush.

---

## 7. RESPONSIVENESS — MANDATORY ON ALL SCREENS

Test every component at:
- `320px` — small mobile
- `375px` — standard mobile (iPhone)
- `768px` — tablet (iPad)
- `1024px` — small laptop
- `1440px` — desktop
- `1920px` — large desktop

### Mobile-First Rules

- Navbars: full-screen slide-in drawer on mobile.
- Product grids: `grid-cols-2` on mobile, `grid-cols-4` on desktop.
- Filter panel: hidden drawer on mobile, sticky sidebar on desktop.
- Tables: scroll horizontally on mobile, never shrink columns.
- Hero: single-column layout on mobile, 12-column grid on desktop.
- Cart drawer: full screen on mobile, 400px panel on desktop.
- Checkout: single column on mobile, split 2-column on desktop.

---

## 8. CODE QUALITY RULES

### TypeScript

- ALL components must be fully typed — no `any`.
- Props interfaces must be named `{ComponentName}Props`.
- All API responses must be typed via `/src/types/`.
- Use `formatPrice()` from `@/lib/utils` for all price displays.
- Use `cn()` from `@/lib/utils` for conditional className merging.

### File Naming

- Components: `PascalCase.tsx` (e.g. `ProductCard.tsx`)
- Pages: `page.tsx` inside `app/` directory
- Stores: `camelCase.ts` (e.g. `cartStore.ts`)
- Types: `camelCase.ts` (e.g. `product.ts`)

### Imports

- Always use `@/` alias — never relative `../../` paths.
- Group imports: React → Next.js → Framer → Lucide → Local → Types.
- Never import unused variables or icons.

### State Management

- Cart: Zustand `useCartStore` from `@/store`
- Wishlist: Zustand `useWishlistStore` from `@/store`
- UI modals/drawers: Zustand `useUIStore` from `@/store`
- Admin data: Next.js API Routes → `/api/*` → Supabase PostgreSQL
- User auth: `/api/auth/` → Laravel 11 Sanctum tokens → stored in httpOnly cookie

---

## 9. SEO — MANDATORY ON EVERY PAGE

Every page must have:

```tsx
export const metadata: Metadata = {
  title: "{Page Title} | The Candle Lab — Luxury Handcrafted Candles",
  description: "{unique 120–155 char description}",
  keywords: ["{keywords}"],
  openGraph: {
    title: "...",
    description: "...",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
  },
};
```

- Every page must have exactly **one `<h1>`** tag.
- Use semantic HTML: `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`.
- All images: `alt` text always required. Never `alt=""` for product images.
- All interactive elements: unique `id` attributes.

---

## 10. THE LUXURY TEST — RUN BEFORE EVERY COMMIT

Before marking any component or page as DONE, verify ALL of the following:

| Check | Question | Must be |
|-------|----------|---------|
| ✔ Visual Clarity | Is this page visually clean? | YES |
| ✔ Hierarchy | Is there ONE clear focal point? | YES |
| ✔ Whitespace | Is there enough breathing room? | YES |
| ✔ 5-Second Test | Can a new user understand it in under 5 seconds? | YES |
| ✔ Information Overload | Are all non-primary fields hidden in progressive disclosure? | YES |
| ✔ Brand Consistency | Are only brand token colors used? | YES |
| ✔ Typography | Are Cormorant Garamond + Inter used correctly? | YES |
| ✔ Mobile | Does it look correct on 375px screen? | YES |
| ✔ Animations | Do all animations feel smooth, not janky? | YES |
| ✔ No Console Errors | Is browser console clean? | YES |
| ✔ TypeScript | Zero TypeScript errors? | YES |
| ✔ Overlaps | Are there zero unintended overlapping elements? | YES |
| ✔ The Apple Test | Does this feel like Apple or luxury fashion UI? | YES |

**If any answer is NO — STOP and fix it before continuing.**

---

## 11. ANTI-PATTERNS — NEVER DO THESE

- ❌ `fixed` navbar without compensating `padding-top` on main content
- ❌ Raw inline colors (`text-red-500`, `bg-green-400`) — use brand tokens
- ❌ More than 2 absolutely-positioned overlays on the same card without hover guards
- ❌ Text over busy image backgrounds without gradient overlay or blur
- ❌ `min-h-screen` with `padding-top` that doubles spacing
- ❌ More than 1 `<h1>` on any single page
- ❌ `console.log()` left in production components
- ❌ Hardcoded mock prices like `₹999` — always use `formatPrice(product.price)`
- ❌ Giant walls of text without line breaks, accordions, or tabs
- ❌ Modals that are too small for their content — ensure proper height constraints
- ❌ Animations with duration > 1000ms — feels sluggish, not luxury
- ❌ Showing all 8+ badges at once — pick highest priority only
- ❌ Tables without search, sort, and pagination
- ❌ Forms longer than 5 fields without grouping or multi-step

---

## 12. STACK REFERENCE CARD

```
Frontend      : Next.js 16 (App Router) + React 19 + TypeScript
Styling       : Tailwind CSS v4 + Framer Motion + Lucide Icons
State         : Zustand (cart, wishlist, UI modals)
Backend API   : Laravel 11 → port 8085
Database      : Supabase PostgreSQL (hosted)
Auth          : Laravel Sanctum (API tokens)
Image CDN     : Cloudinary / Supabase Storage / Unsplash (dev)
Payments      : Razorpay (INR)
Fonts         : Cormorant Garamond + Inter (Google Fonts)
Icons         : Lucide React only
Toasts        : react-hot-toast
```

---

## 13. GOLDEN PHILOSOPHY

> "Less but better." — Dieter Rams

> "Design is not just what it looks like and feels like.
>  Design is how it works." — Steve Jobs

> "The goal is not to display more information.
>  The goal is to create a calm, elegant, premium, world-class user experience."

Every screen should pass the **Apple Test**:
*If it were on Apple.com, would it look at home?*

If the page feels crowded, noisy, cluttered, or visually tiring — **simplify it**.

Show only what the user needs at that moment.
Everything else is revealed progressively, on demand.

This is what separates a normal e-commerce site from a **luxury brand experience**.

---

*The Candle Lab 3.0 — Master UX Constitution v3.0*
*Last updated: 2026-07-29*