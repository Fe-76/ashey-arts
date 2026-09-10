# Ashey Arts

Portfolio site for illustrator Ashey Arts (Instagram: `@yehsarts` — the
handle didn't change with the rebrand). Etapas 1 through 3.5 are done. No
Supabase, no admin, no auth, no functional tracking yet — see "Known gaps"
below.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build    # production build + type-check
npm run preview  # preview the production build
```

## Architecture (as of Etapa 3.5)

**Home (`/`) is the entire public experience.** A visitor can scroll from
the opening all the way through the art sequence, Selected Works,
Commissions, How it Works and Track your Commission without ever opening
the sidebar:

```
src/pages/Home.tsx
  Opening                    (opening moment, no traditional hero)
  ArtOne / ArtTwo / ArtThree  (mask reveal / scale / parallax)
  SelectedWorksTeaser         → #selected-works
  WorksGrid                   (the actual portfolio pieces)
  CommissionsSection          → #commissions
  HowItWorksSection           → #how-it-works
  TrackSection                → #track  (visual only — see below)
  Footer
```

`/terms` is the **only** page that stays separate — it's the calmest,
most-read page and doesn't belong in a long scroll experience.

`/commissions`, `/how-it-works` and `/track` still exist as routes, but
each is now just a redirect (`<Navigate to="/#..." replace />`) into the
matching Home section, so old/bookmarked URLs keep working without
duplicating content (`src/pages/Commissions.tsx`, `HowItWorks.tsx`,
`Track.tsx`).

The sidebar (`src/components/Sidebar.tsx`) is a navigation **shortcut**,
not a requirement to discover content — Works/Commissions/How it
Works/Track all point at `/#<anchor>`; only Terms of Service is a real
route (`/terms`). `Home`'s own effect (in `Home.tsx`) watches
`location.hash` and smooth-scrolls to the matching section once it exists
— this covers both "already on Home, click a different anchor" and
"navigate from Terms/an old URL, wait for Home to mount, then scroll."
`ScrollToTop` (`src/components/ScrollToTop.tsx`) makes every other route
change start at the top; it explicitly skips that when the destination
has a hash, so it never fights the anchor scroll.

## Visual identity (as of Etapa 3.5)

The palette flipped from a light editorial site with one dark section to
a **dark plum/aubergine universe by default**, lit with soft pink and
lilac (`src/styles/tokens.css`). Off-white now plays a supporting role —
text, small surfaces — never the dominant background. Six `--zone-*`
tokens give Home's sections a gradual hue shift while staying the same
family (deep plum → dark violet → near-black plum → aubergine+pink →
dark blue-violet → deep plum for Track), instead of one flat wash or a
hard light↔dark cut. `AmbientLight` (`src/components/AmbientLight.tsx`)
adds a single diffuse, directional glow per section (pink behind one
piece, lilac beside another) rather than visible generic blobs.
Fraunces + Manrope, the ✦/✧ sparkle language, and the overall editorial
composition are unchanged.

## What's here

```
src/
  config/social.ts          Instagram URL/handle — one place to update
  styles/tokens.css          colors (incl. --zone-* ), type, spacing, easings
  styles/global.css          reset, dark color-scheme, sidebar page-shift
  hooks/                     useReducedMotion, useLenis
  components/
    ArtworkPlaceholder.tsx   stand-in illustrations (dark-toned palettes)
    Sparkle / SparkleField / Constellation   the ✦/✧ language, real glow
    AmbientLight.tsx         one diffuse directional light per section
    CursorGlow.tsx           continuous "fairy light" cursor glow
    ContactCTA.tsx           "Start your commission ✦" — typographic, not a button
    Sidebar.tsx              anchors into Home + a real link to /terms
    ScrollToTop.tsx          route changes start at top (hash-aware)
  sections/                  Opening, ArtOne/Two/Three, SelectedWorksTeaser,
                              WorksGrid, CommissionsSection, HowItWorksSection,
                              TrackSection, Footer — everything Home composes
  pages/
    Home.tsx                 composes all sections + hash-scroll handling
    Terms.tsx                 the one separate page
    Commissions.tsx, HowItWorks.tsx, Track.tsx   thin redirects into Home
```

## Known gaps (intentional, for later etapas)

- Track your Commission is **visual only** — the input looks ready but
  submitting does nothing; no fake lookup or simulated result.
- No Supabase connection; nothing is dynamic — all copy, prices and
  artworks are hardcoded in the section files.
- No admin, no auth, no tracking codes, no CMS.
- The Instagram URL in `src/config/social.ts` is a best guess
  (`instagram.com/yehsarts`) — swap it for the artist's real/verified
  profile link when available.
- No automated visual regression/screenshot testing was possible in the
  environment this was built in — please eyeball it locally: the full
  Home scroll, every sidebar anchor (including from `/terms`), the three
  old-URL redirects, the "Start your commission" CTA, dark-palette
  contrast, and mobile.
