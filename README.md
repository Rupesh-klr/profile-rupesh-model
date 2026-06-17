# Profilo Designer — Vedika Raksha (first client)

A polished, **JSON-driven, bilingual (English / తెలుగు) React profile template** built with Vite.
No backend — all content lives in JSON files (one per page), and `npm run build` produces a fully
static site you can host anywhere (Hostinger, Netlify, GitHub Pages, S3…).

**Pages (routes):**

| Route | Page | Content file |
|-------|------|--------------|
| `/` (and `/vedika-raksha-profile`) | Vedika Raksha's **profile** (home) | `src/data/vedika-raksha-profile.json` |
| `/vedika-raksha-new-page` (and `/vedika-raksha-empowerment-workshop`) | **Women's Empowerment** workshop | `src/data/vedika-raksha-new-page.json` |
| `/vedika-raksha-womb-rest-weekly-webniar` | **Womb Reset** weekly workshop (legacy, kept reachable) | `src/data/vedika-raksha-womb-rest-weekly-webniar.json` |
| `/vedika-raksha-profile-terms-conditions` | Terms & Conditions | `src/data/vedika-raksha-profile-terms-conditions.json` |
| `/vedika-raksha-profile-privacy-policy` | Privacy Policy | `src/data/vedika-raksha-profile-privacy-policy.json` |
| `/vedika-raksha-profile-refund-cancellation` | Refund & Cancellation | `src/data/vedika-raksha-profile-refund-cancellation.json` |

The legal pages are linked from every footer and also answer to short aliases (e.g.
`/vedika-raksha-profile-term-condtion`). The policy text is a **template — review it before going live.**

Routes are generated from one manifest — [`src/pages/pages.config.js`](src/pages/pages.config.js).
**Adding a page is 2 steps:** (1) create `src/data/<slug>.json`, (2) add a line to the manifest.
The URL = the slug, e.g. a future `/vedika-raksha-emotional-balance`. See
[docs/03 §3.8](docs/03-customization-guide.md).

**🎨 Secret colour palettes:** add `?p=1` … `?p=8` to the URL to switch the whole colour scheme
(`?p=2` = Green/Pink, `?p=3` = Blue, `?p=4` = Red, `?p=5` = Emerald, `?p=6` = Teal, `?p=7` = Violet,
`?p=8` = Amber; `1` = default Rose/Plum). The choice is remembered — there's no on-screen control,
only the number. See [`src/utils/applyPalette.js`](src/utils/applyPalette.js).

**Profilo Designer** is the reusable template; **Vedika Raksha** (Women's Empowerment Coach &
Wellness Mentor) is the first profile built on it. To make a new client site: copy the folder,
edit the JSON, swap the photos.

> 📚 Full documentation is in the [`docs/`](docs/) folder — start at [docs/README.md](docs/README.md).

## ⚡ One-click scripts (Windows)

| Double-click | What it does |
|--------------|--------------|
| **`Build-Deploy-Zip.bat`** | Builds the site and makes a **static** ZIP (`..._<ddMMMyy>.zip`) of `dist/` + `.htaccess` → upload via Hostinger **File Manager → public_html → Extract**. |
| **`Build-Source-Zip.bat`** | Makes a **source** ZIP (`..._<ddMMMyy>_source.zip`) that mirrors your GitHub repo (everything in `.gitignore` excluded, `package.json` at root) → for Hostinger **Setup Node.js App → Upload**. |
| **`Init-Git-And-Push.bat`** | Turns the finished project into a git repo and pushes it to a remote (GitHub/GitLab/Bitbucket). |

> **Which ZIP?** This is a *static* React site, so the simplest, most reliable route is the **static** ZIP via **File Manager** (`Build-Deploy-Zip.bat`). Use the **source** ZIP only for the **Setup Node.js App** flow (that uploader rejects a build-only zip with *"unsupported framework / invalid project structure"* because it needs `package.json`).

---

## ✨ Features

- **One source of truth** — every word, label and link comes from [`src/data/profile.json`](src/data/profile.json). No need to touch component code to change content.
- **Bilingual** — English + Telugu toggle in the header. Each text field is `{ "en": "...", "te": "..." }`. Add more languages by extending the `t()` helper.
- **Dark / Light theme** — warm "healing" light mode by default, elegant plum dark mode. Remembers the visitor's choice; respects OS preference on first visit.
- **Glassmorphism + motion** — frosted glass cards, soft gradient glows, scroll-reveal (IntersectionObserver), animated counters, live countdown. Honours `prefers-reduced-motion`.
- **Data-driven sections** — the page is rendered by mapping over `sections[]`. A small registry maps each section `type` to a component, so the order and content are fully controlled from JSON.
- **Zero runtime dependencies** beyond React. Icons are inline SVG; fonts load from Google Fonts.

---

## 🚀 Getting started

```bash
npm install      # one time
npm run dev      # local dev server (hot reload) → http://localhost:5173
npm run build    # static production build → dist/
npm run preview  # preview the production build locally
```

> Requires Node 18+ (tested on Node 22). After `npm run build`, the `dist/` folder is the
> entire site — upload it to any static host. There is **no server to run**.

---

## 🚀 Deploy to Hostinger

This is a static site, so it does **not** need Hostinger's Node app hosting or git deploy.

1. Double-click **`Build-Deploy-Zip.bat`** → it creates `Profilo-Designer_Vedika-Raksha_<ddMMMyy>.zip`
   in the parent folder (built site **+ `.htaccess`**, files at the ZIP root).
2. Hostinger **hPanel → File Manager → `public_html`** → upload the ZIP → right-click → **Extract**.
3. Done. The included [`public/.htaccess`](public/.htaccess) handles SPA routing, gzip,
   caching and security headers.

Full steps: [docs/04-deployment-hostinger.md](docs/04-deployment-hostinger.md).

## 🔁 Put it on GitHub (optional)

Double-click **`Init-Git-And-Push.bat`** — it runs `git init`, makes the first commit, and (if you
paste a remote URL) pushes to `origin/main`. `node_modules`, `dist` and `.env` are ignored.

---

## ✏️ Editing the content

Open [`src/data/profile.json`](src/data/profile.json). Everything is there:

| Key          | What it controls                                              |
| ------------ | ------------------------------------------------------------ |
| `person`     | Name, title, tagline, the 3 photos, social links            |
| `nav`        | Brand name + menu links                                      |
| `ui`         | Button labels, register URL, toggle labels                  |
| `sections[]` | The ordered page sections (hero, stats, cards, FAQ, CTA…)    |
| `footer`     | Disclaimer + copyright                                       |

**Bilingual text** is always an object:

```json
"heading": { "en": "What You'll Learn", "te": "మీరు ఏమి నేర్చుకుంటారు" }
```

Change the order of the page by reordering the objects in `sections[]`. Delete a section by
removing its object. No code changes needed.

---

## 🖼️ Replacing the photos

The 3 owner images and the 3 "secret" images are placeholders in [`public/images/`](public/images).
Drop in real photos using the **same file names** (or update the `src` paths in `profile.json`):

| File                         | Used for                          | Suggested size |
| ---------------------------- | --------------------------------- | -------------- |
| `vedika-1.svg` → `.jpg/.webp`| Hero portrait                     | ~800 × 1000 (4:5) |
| `vedika-2.svg` → `.jpg/.webp`| About section                     | ~800 × 1000 (4:5) |
| `vedika-3.svg` → `.jpg/.webp`| Spare / testimonials (optional)   | ~800 × 1000 (4:5) |
| `learn-1/2/3.svg`            | The 3 "What you'll learn" cards   | ~800 × 500 (16:10) |

If you use `.jpg`/`.webp`, update the matching `src` in `profile.json` (e.g. `/images/vedika-1.webp`).

---

## 🎨 Re-theming

All colours are CSS variables at the top of [`src/index.css`](src/index.css) under
`[data-theme='light']` and `[data-theme='dark']`. Change `--primary`, `--accent`, `--gold`,
backgrounds and shadows there to re-skin the whole site. Fonts are set in [`index.html`](index.html).

---

## 🧩 Adding a new section type

1. Create `src/components/sections/MySection.jsx` (read its data from the `section` prop).
2. Register it in [`src/components/SectionRenderer.jsx`](src/components/SectionRenderer.jsx):
   ```js
   import MySection from './sections/MySection.jsx';
   const registry = { /* … */, mysection: MySection };
   ```
3. Add an object to `sections[]` in the JSON with `"type": "mysection"`.

---

## 📁 Project structure

```
src/
  data/profile.json        ← ALL content (edit this)
  context/                 ← theme + language providers
  hooks/                   ← useReveal (scroll), useCountUp (counters)
  components/
    Navbar, Footer, ScrollTop, Icon, Reveal
    SectionRenderer.jsx    ← type → component registry
    sections/              ← Hero, Stats, CardGrid, Curriculum, About,
                              Testimonials, FAQ, CTA
  index.css                ← design tokens, theming, all styles
public/images/             ← placeholder art (swap with real photos)
```

---

## 🔗 Links

- Instagram: https://www.instagram.com/rvvedikaraksha
- Facebook: https://www.facebook.com/rvvedikaraksha
- Email: rvvedikaraksha@gmail.com · WhatsApp: +91 80745 40299

© Vedika Raksha. All Rights Reserved.
