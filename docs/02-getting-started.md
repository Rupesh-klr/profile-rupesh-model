# 2. Getting Started

## Prerequisites

- **Node.js 18 or newer** (tested on Node 22). Download: https://nodejs.org
  Check it's installed:
  ```bash
  node -v
  npm -v
  ```

## Install

From the project folder, run once:

```bash
npm install
```

This downloads the dependencies into `node_modules/` (ignored by git).

## Run in development

```bash
npm run dev
```

Open the URL it prints (usually **http://localhost:5173**). The page hot-reloads as you edit
`src/data/profile.json` or any component — changes appear instantly.

## Build for production

```bash
npm run build
```

This creates a **`dist/`** folder — the complete static website (HTML, CSS, JS, images and the
`.htaccess`). There is no server to run; `dist/` *is* the site.

## Preview the production build

```bash
npm run preview
```

Serves the built `dist/` locally so you can check it before uploading.

## The one-click way (Windows)

You don't have to use the terminal. Just **double-click**:

- **`Build-Deploy-Zip.bat`** — installs (first run), builds, and creates a deploy-ready ZIP in
  the parent folder. See [Deploy to Hostinger](04-deployment-hostinger.md).
- **`Init-Git-And-Push.bat`** — turns the project into a git repository and pushes it to a remote.

## Common issues

| Problem | Fix |
|---------|-----|
| `npm not recognized` | Install Node.js, then reopen the terminal. |
| Port 5173 in use | Vite will pick the next free port — read the printed URL. |
| Telugu text shows boxes | Make sure you have an internet connection (the Telugu font loads from Google Fonts). |
| Photos look like placeholders | That's expected — replace the files in `public/images/`. See the [Customization Guide](03-customization-guide.md). |
