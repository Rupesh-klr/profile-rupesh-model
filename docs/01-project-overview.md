# 1. Project Overview

## What is Profilo Designer?

**Profilo Designer** is a template for building beautiful one-page **profile / personal-brand
websites**. You write the content once in a single JSON file, and the template renders a polished,
animated, bilingual site around it.

It was created to publish the profile of its **first client, Vedika Raksha** (Womb Healing &
Fertility Coach), and is built so the same template can be reused for future clients by editing
data and swapping photos — no rewriting of code.

## Highlights

- **One source of truth** — every word, label, link and section lives in
  [`src/data/profile.json`](../src/data/profile.json).
- **Bilingual** — English + Telugu (తెలుగు) with a header toggle. Every text field is
  `{ "en": "…", "te": "…" }`.
- **Dark / Light theme** — warm "healing" light mode by default, elegant plum dark mode.
- **Modern visuals** — glassmorphism cards, gradient glows, scroll-reveal animations,
  animated counters and a live countdown.
- **No backend** — `npm run build` outputs static HTML/CSS/JS. Host it anywhere.
- **Reusable engine** — the page is rendered by mapping over a `sections[]` array; a registry
  maps each section `type` to a component.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Language | JavaScript (JSX) |
| Styling | Plain CSS with CSS variables (theming) |
| Animation | IntersectionObserver + CSS (no heavy libraries) |
| Fonts | Playfair Display, Outfit, Noto Sans Telugu (Google Fonts) |
| Backend | **None** |

## Folder layout

```
vedika-raksha-profilo/
├─ Build-Deploy-Zip.bat      ← one-click: build + make Hostinger ZIP
├─ Init-Git-And-Push.bat     ← one-click: git init + push to remote
├─ index.html                ← HTML shell + font links
├─ package.json
├─ vite.config.js
├─ .gitignore / .env.example
├─ docs/                     ← you are here
├─ public/
│  ├─ .htaccess              ← Hostinger/Apache config (ships in every build)
│  └─ images/                ← placeholder art → replace with real photos
└─ src/
   ├─ data/
   │  ├─ vedika-raksha-profile.json                 ← PROFILE page content ("/")
   │  └─ vedika-raksha-womb-rest-weekly-webniar.json ← WORKSHOP page content ("/webinar")
   ├─ pages/                 ← ProfilePage, WebinarPage (one JSON each)
   ├─ context/               ← theme + language providers
   ├─ hooks/                 ← scroll reveal + count-up
   ├─ utils/
   │  ├─ asset.js            ← image path helper
   │  └─ applyPalette.js     ← secret ?p=1..8 colour switch
   ├─ components/
   │  ├─ App.jsx is the router; SiteLayout renders a page from one JSON
   │  ├─ SectionRenderer.jsx ← section "type" → component registry
   │  └─ sections/           ← Hero, Stats, CardGrid, Curriculum, About,
   │                            Testimonials, FAQ, CTA, Contact
   ├─ styles/palettes.css    ← the 8 colour palettes
   └─ index.css              ← design tokens, theming, all styles
```

## Pages & routing

Routing uses React Router (`BrowserRouter`) and is **generated from a single manifest**,
[`src/pages/pages.config.js`](../src/pages/pages.config.js). Each page is its own component
(or a data-only entry) rendered through the shared `SiteLayout`. The **URL = the content slug**.

| Route | Page | JSON |
|-------|------|------|
| `/` (+ alias `/vedika-raksha-profile`) | Profile (home) | `vedika-raksha-profile.json` |
| `/vedika-raksha-womb-rest-weekly-webniar` | Womb Reset workshop | `vedika-raksha-womb-rest-weekly-webniar.json` |

Adding a page = a new JSON + one manifest line (see [docs/03 §3.8](03-customization-guide.md)).
The included `public/.htaccess` makes deep links (refreshing any route) work on Hostinger.

## Secret colour palettes

Add a number to the URL to re-skin the whole site: `?p=1` … `?p=8`
(1 Rose/Plum · 2 Green/Pink · 3 Blue · 4 Red · 5 Emerald · 6 Teal · 7 Violet · 8 Amber).
There is no visible switch — only the number controls it, and it's remembered per browser.
Defined in [`src/styles/palettes.css`](../src/styles/palettes.css) + [`src/utils/applyPalette.js`](../src/utils/applyPalette.js).
