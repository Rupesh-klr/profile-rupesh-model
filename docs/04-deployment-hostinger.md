# 4. Deploy to Hostinger

This is a **static site** (plain HTML/CSS/JS after building). It does **not** need Hostinger's
Node.js app hosting or git deployment — you simply upload the built files to `public_html`.

> Hostinger's git integration is aimed at Node apps and can be awkward for a built front-end,
> so the easiest, most reliable route is the **one-click ZIP** below.

## Two ZIPs — which one?

| Bat file | Makes | Use it for |
|----------|-------|------------|
| `Build-Deploy-Zip.bat` | **Static** zip (`dist/` + `.htaccess`, files at root) | **File Manager → public_html → Extract** ✅ recommended for this static site |
| `Build-Source-Zip.bat` | **Source** zip (mirrors your GitHub repo; `.gitignore` excluded; `package.json` at root) | **Setup Node.js App → Upload your app files** |

> ⚠️ The **Setup Node.js App** uploader rejects the *static* zip with
> *"Unsupported framework or invalid project structure"* — that screen wants the **project source**
> (so it can detect the framework and run `npm install` / `npm run build`). That's what the
> **source** zip is for. For a plain static site, prefer the File Manager route below.

## Option A — One-click ZIP (recommended)

1. **Double-click `Build-Deploy-Zip.bat`** in the project folder.
   It will:
   - install dependencies (first run only),
   - build the production site,
   - create a deploy-ready ZIP **in the parent folder**, named like:
     ```
     Profilo-Designer_Vedika-Raksha_14Jun26.zip
     ```
     (format: `Profilo-Designer_<Client>_<ddMMMyy>`).
   The ZIP contains the built site **and the `.htaccess`**, with all files at the root.

2. **Upload it on Hostinger:**
   - Log in → **hPanel** → **File Manager**.
   - Open **`public_html`** (delete the default `index.html`/`default.php` if present).
   - **Upload** the ZIP.
   - Right-click the uploaded ZIP → **Extract** (extract *into* `public_html`).

3. **Visit your domain.** The site is live. The included `.htaccess` handles routing,
   compression, caching and basic security headers.

That's it — repeat steps 1–2 whenever you update the content.

## Option B — Manual upload

1. Run `npm run build`.
2. Upload **everything inside `dist/`** (not the `dist` folder itself) into `public_html`,
   including the hidden **`.htaccess`** (in File Manager, enable "show hidden files").

## About the `.htaccess`

It lives in [`public/.htaccess`](../public/.htaccess), so it is copied into every build
automatically. It provides:

- **SPA fallback** — routes unknown paths to `index.html` (works on Apache & LiteSpeed).
- **Gzip compression** and **long-term caching** of hashed assets (fast repeat visits).
- **HTML no-cache** so content updates appear immediately after re-deploy.
- **Security headers** (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- An **optional HTTPS redirect** (commented out — uncomment after your SSL is active).

## Custom domain & SSL

- Point your domain to Hostinger (or use the one in your plan).
- In hPanel, enable the free **SSL certificate**.
- Once SSL is active, you may uncomment the HTTPS redirect block in `.htaccess`.

## Updating the site later

Edit `profile.json` (or swap photos) → run `Build-Deploy-Zip.bat` again → upload & extract the new
ZIP. Because filenames are date-stamped, you keep a clean history of each release.
