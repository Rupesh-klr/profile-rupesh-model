/**
 * Resolves a content image path against Vite's BASE_URL so the site works
 * both at a domain root and inside a sub-folder (e.g. GitHub Pages project sites).
 * Leaves absolute http(s) URLs untouched — so you can point JSON at a CDN too.
 */
export function asset(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path)) return path; // external URL
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : `/${path}`);
}
