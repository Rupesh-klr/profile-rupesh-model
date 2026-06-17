# 3. Customization Guide

Almost everything is controlled from the **content JSON files** — one per page:

- [`src/data/vedika-raksha-profile.json`](../src/data/vedika-raksha-profile.json) → the profile page (`/`)
- [`src/data/vedika-raksha-womb-rest-weekly-webniar.json`](../src/data/vedika-raksha-womb-rest-weekly-webniar.json) → the workshop page (`/webinar`)

Both share the **same structure**, so everything below applies to either file. You rarely need to
touch the React code.

> **Cross-page links:** a nav entry with a `"route"` (e.g. `"route": "/webinar"`) becomes a
> page link; without it, the `id` is treated as an in-page scroll anchor.
>
> **Secret palettes:** the colour scheme is chosen by `?p=1`…`?p=8` in the URL (no on-screen
> control). Edit the colours in [`src/styles/palettes.css`](../src/styles/palettes.css).

## 3.1 Bilingual text

Every piece of text is an object with both languages:

```json
"heading": { "en": "What You'll Learn", "te": "మీరు ఏమి నేర్చుకుంటారు" }
```

The visitor flips between them with the **EN / తె** toggle in the header. If you only have English,
you can put the same text in both, or just `en` (it falls back to English automatically).

## 3.2 The person / brand

```jsonc
"person": {
  "name":     { "en": "Vedika Raksha", "te": "వేదిక రక్ష" },
  "title":    { "en": "Womb Healing & Fertility Coach", "te": "…" },
  "tagline":  { "en": "…", "te": "…" },
  "images":   [ { "src": "/images/vedika-1.svg", "alt": {…} }, … ],
  "social":   [ { "id": "instagram", "url": "…", "handle": "@…" }, … ]
}
```

Social `id` can be `website`, `instagram` or `facebook` (each has a matching icon).

## 3.3 Replacing the photos

Placeholders live in [`public/images/`](../public/images). Drop in real photos using the **same
file names** (or change the `src` paths in the JSON):

| File | Used for | Suggested size |
|------|----------|----------------|
| `vedika-1` | Hero portrait | ~800 × 1000 (4:5 portrait) |
| `vedika-2` | About section | ~800 × 1000 (4:5 portrait) |
| `vedika-3` | Spare (e.g. testimonials) | ~800 × 1000 |
| `learn-1/2/3` | The three "What you'll learn" cards | ~800 × 500 (16:10) |

If you upload `.jpg`/`.webp` instead of `.svg`, update the matching `src` in the JSON, e.g.
`"/images/vedika-1.webp"`.

## 3.4 Editing / reordering sections

The page is the `sections[]` array. Each entry has a `type` and its own content:

```jsonc
"sections": [
  { "id": "hero",         "type": "hero",        … },
  { "id": "stats",        "type": "stats",       "items": [ … ] },
  { "id": "challenges",   "type": "cardgrid", "variant": "problems",  … },
  { "id": "audience",     "type": "cardgrid", "variant": "audience",  … },
  { "id": "learn",        "type": "curriculum",  "modules": [ … ] },
  { "id": "outcomes",     "type": "cardgrid", "variant": "outcomes",  … },
  { "id": "about",        "type": "about",       … },
  { "id": "testimonials", "type": "testimonials",… },
  { "id": "faq",          "type": "faq",         "items": [ … ] },
  { "id": "cta",          "type": "cta",         … }
]
```

- **Reorder** the page by reordering these objects.
- **Remove** a section by deleting its object.
- **Repeat** a section type with different data (e.g. two `cardgrid`s) — that's exactly how
  Challenges / Audience / Outcomes are built from one component.

### Available section types

| `type` | Component | Notes |
|--------|-----------|-------|
| `hero` | Hero | Headline, highlights, portrait |
| `stats` | Stats | Animated counters (`value`, `suffix`, `label`) |
| `cardgrid` | CardGrid | Icon cards; `variant`: `problems` / `audience` / `outcomes` |
| `curriculum` | Curriculum | Image cards with checklists (`modules`) |
| `about` | About | Bio, credentials, mission |
| `testimonials` | Testimonials | Quote cards with star ratings |
| `faq` | FAQ | Accordion |
| `cta` | CTA | Headline + optional live countdown (`workshop.targetIso`) |
| `contact` | Contact | Email/phone/location cards (`items` with `icon`, `label`, `value`, optional `href`) + social row |
| `statement` | Statement | Single-idea block (Our Concept / Mission / Vision) — `number`, `icon`, `eyebrow`, `heading`, `body[]`, `points[]`, `reverse` |
| `team` | Team | "Meet Our Trainers" — `members` with photo, role, `basics` tags, `summary`, expandable `details` (`moreLabel`/`lessLabel`) |
| `legal` | Legal | Long-form policy page — `title`, `updated`, `intro`, `clauses[{heading, body[], list[]}]`, `note` |

### Icons

Card `icon` values map to inline SVGs in
[`src/components/Icon.jsx`](../src/components/Icon.jsx). Available names include:
`seed, balance, report, heart, compass, drained, question, couple, missing, lotus, spark, link,
calendar, clock, language, video, check, checkCircle, star, mail, phone, pin, whatsapp,
website, instagram, facebook`.

## 3.5 Colours, fonts and theme

- **Colours** — all CSS variables at the top of [`src/index.css`](../src/index.css), under
  `[data-theme='light']` and `[data-theme='dark']`. Change `--primary`, `--accent`, `--gold`,
  backgrounds, shadows… and the whole site re-skins.
- **Fonts** — set in [`index.html`](../index.html) (the Google Fonts link) and referenced in
  `index.css`.
- **Default theme** — warm light. The visitor's choice is remembered in their browser.

## 3.6 Adding a brand-new section type

1. Create `src/components/sections/MySection.jsx` and read data from its `section` prop.
2. Register it in [`src/components/SectionRenderer.jsx`](../src/components/SectionRenderer.jsx):
   ```js
   import MySection from './sections/MySection.jsx';
   const registry = { /* … */, mysection: MySection };
   ```
3. Add `{ "id": "…", "type": "mysection", … }` to `sections[]` in the JSON.

## 3.7 Reusing the template for a new client

1. Copy the whole project folder, rename it.
2. Edit the JSON files in `src/data/` (name, content, languages, social, sections). Rename them
   per client and update the imports in `src/pages/ProfilePage.jsx` / `WebinarPage.jsx`.
3. Replace the photos in `public/images/`.
4. Open `Build-Deploy-Zip.bat` and change the two lines at the top:
   ```bat
   set "PROJECT_NAME=Profilo-Designer"
   set "CLIENT_NAME=New-Client-Name"
   ```
5. Build and deploy.

## 3.8 Adding a new page (route)

Routes are generated from one manifest: [`src/pages/pages.config.js`](../src/pages/pages.config.js).
The **URL = the content slug**, so the page name and its data file match.

**The easy way (no component file):**

1. Create the content file, e.g. `src/data/vedika-raksha-emotional-balance.json`
   (copy an existing JSON and edit it — same structure, same section types).
2. In `pages.config.js`, import it and add one line:
   ```js
   import emotionalBalance from '../data/vedika-raksha-emotional-balance.json';

   export const pages = [
     // …existing pages…
     { path: '/vedika-raksha-emotional-balance', data: emotionalBalance,
       title: 'Emotional Balance — Vedika Raksha' },
   ];
   ```

That's it — `http://localhost:5173/vedika-raksha-emotional-balance` now works.

**Prefer a dedicated component** (for a page that needs custom layout)? Create
`src/pages/MyPage.jsx` like `WombResetWebinarPage.jsx`, then use `element: MyPage` in the manifest
instead of `data`.

**Link to it** from another page by adding a nav entry with a `route` in that page's JSON:
```json
{ "id": "balance", "label": { "en": "Emotional Balance ↗", "te": "…" },
  "route": "/vedika-raksha-emotional-balance" }
```

**Aliases:** give a page extra URLs with `aliases: ['/another-url']` (that's how `/` also answers
to `/vedika-raksha-profile`).

> This is the scalable part: for any new person/page you only add a JSON file and one manifest line —
> no routing code to wire up.
