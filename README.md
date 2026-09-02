# IVM Homepage — Figma implementation

Drop-in files for the Figma "IVM website" home page (node `510:248`), built for
Next.js App Router + TypeScript + Tailwind CSS.

## 1. Copy files into your project

```
app/page.tsx                  → merge into your app/page.tsx (or route as needed)
components/layout/*.tsx       → components/layout/
components/home/*.tsx         → components/home/
lib/fonts.ts                  → merge into your existing lib/fonts.ts if you have one
styles/fonts.css              → styles/
scripts/fetch-figma-assets.mjs→ scripts/
```

The components use the `@/` import alias (`@/components/...`) — this is the
Next.js default; if your `tsconfig.json` uses a different alias, update the
imports in `app/page.tsx` accordingly.

## 2. Fetch the real image/icon assets (do this within ~7 days)

Figma's exported asset URLs are temporary. Run once, from your project root
(with normal internet access):

```bash
node scripts/fetch-figma-assets.mjs
```

This downloads the exact PNG/SVG bytes into `public/images/` and
`public/icons/`, matching the paths the components already reference. If a
link has expired, re-run Figma's `get_design_context` on the relevant node to
get a fresh URL and update `scripts/fetch-figma-assets.mjs`.

## 3. Wire up fonts

In your root layout (`app/layout.tsx`):

```tsx
import "@/styles/fonts.css";
import { lato } from "@/lib/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- **Lato** (used only for the "See All Model" / "Subscribe" button labels) is
  loaded via `next/font/google` in `lib/fonts.ts` — nothing else to do.
- **Avenir** (used everywhere else) is not a free/redistributable font.
  `styles/fonts.css` defines a `.font-avenir` utility class with a close
  system-font fallback stack, already applied throughout the components, so
  everything renders correctly today. When you have licensed Avenir webfont
  files, switch to `next/font/local` — instructions are in the comment at the
  top of `styles/fonts.css`.

## 4. Tailwind config

No required changes — every value from the design (`#005EB8`, `#002A52`,
`#1E1E1E`, `#E4E4E4`, `#B1CBE8`, pixel sizes, etc.) is written as Tailwind
arbitrary values directly in the components, so this works with your existing
`tailwind.config` unchanged.

Optional: if you'd rather have named design tokens, add to your config:

```ts
theme: {
  extend: {
    colors: {
      "ivm-blue": "#005EB8",
      "ivm-navy": "#002A52",
      "ivm-ink": "#1E1E1E",
      "ivm-border": "#E4E4E4",
      "ivm-blue-light": "#B1CBE8",
    },
  },
},
```

## Responsive breakpoints

Exact pixel values were pulled from Figma for both the mobile (393px) and
desktop (1440px) artboards; intermediate `md:` values are interpolated (no
tablet artboard exists in the file). The `lg:` breakpoint (1024px, Tailwind
default) is where the layout switches from the stacked mobile design to the
desktop design (nav drawer → full nav bar, stacked sections → side-by-side,
etc.).

## `/vehicles` page (node `510:250`)

Added under `app/vehicles/page.tsx`, built from:

```
components/vehicles/
  vehicles-data.ts          → Vehicle/Category types + seed data
  VehicleCard.tsx            → single card (image, name, Discover more / Order Now)
  VehicleFilter.tsx          → desktop sidebar list + mobile filter chip bar
  VehiclesPageContent.tsx    → client component: filter state + responsive grid
```

It reuses the same `Header` and `Footer` from the homepage — the Figma section
for this page doesn't include its own footer frame, so adding the shared one
is an assumption, flagged here in case you want this route footer-less.

Additional judgment calls specific to this page:

- **Placeholder data, not 15 unique vehicles**: every card in the Figma grid
  (15 on desktop, 5 on mobile) has identical copy ("Innoson Caris" / "Suvs"),
  and the two card instances inspected in detail reuse the same two car
  photos — clearly a duplicated placeholder card, not 15 designed vehicles.
  `vehicles-data.ts` seeds accordingly but the grid/filter is fully
  data-driven — drop in real models (mixed categories/names/images) and
  filtering keeps working unchanged.
- **Mobile filter chip bar**: the Figma file has no expanded mobile-filter
  frame for this page — only a page title showing the active category (e.g.
  "SUVs"). `VehicleFilter.tsx` adds a horizontal scrollable chip bar for
  mobile using the desktop sidebar's exact colors/weights, since a
  filterable grid needs *some* mobile control.
- **Mobile page-title size is interpolated**: I hit Figma's MCP rate limit
  (a quota on the connected Figma account's plan, separate from anything on
  your end) right before fetching the exact pixel size for the mobile "SUVs"
  heading. It uses the 24px/bold/uppercase pattern established for other
  mobile headings in this file — worth double-checking against Figma
  directly if pixel-exactness matters here.
- The "Suvs" category badge and the thin divider line visible in the card's
  raw Figma data are positioned completely outside the card's bounds in the
  source file (e.g. `top: 487px` on a 282px-tall card) and don't appear in
  the rendered Figma screenshot either — treated as stray/orphaned layer
  data and omitted from the visual output, matching what's actually shown.

## Judgment calls (flagged, not silently guessed)

- **Mobile nav drawer contents**: the Figma file only shows the hamburger's
  closed state — no expanded mobile-menu frame exists — so `Header.tsx`
  contains a standard slide-down drawer with the same links/phone/CTA as
  desktop.
- **Car model showcase on mobile**: the mobile frame positions the car image
  bleeding off the 393px canvas (drawn at x=350, width=347), which reads as
  an incomplete mobile adaptation. `CarModelShowcase.tsx` instead scales the
  desktop layout proportionally so the car, watermark, and arrows all stay
  on-screen.
- **Footer newsletter placement**: the mobile mockup places the newsletter
  block (different copy: "Sign up for the Made In Nigeria experience")
  between the brand block and the nav columns; desktop places it below both,
  with different copy ("Join our newsletter"). `Footer.tsx` uses the desktop
  ordering and copy at all breakpoints, since a newsletter block ahead of
  primary navigation is unconventional and this looks like a mobile-mockup
  inconsistency rather than intent. Say the word if you'd like the literal
  mobile order/copy instead.
