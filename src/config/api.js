/**
 * API client for the centralized backend (all-live-project-api-center).
 * Set VITE_API_BASE in .env to point at the deployed API; defaults to local dev.
 */
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
export const PROFILES_API = `${API_BASE}/api/profiles/v1`;

/** GET a profile by slug (optionally a single page). Returns the `data` payload. */
export async function fetchProfile(slug, pageSlug) {
  const url = pageSlug
    ? `${PROFILES_API}/${encodeURIComponent(slug)}?page=${encodeURIComponent(pageSlug)}`
    : `${PROFILES_API}/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  return body.data;
}

/** GET the plans config (free / advanced). */
export async function fetchPlans() {
  const res = await fetch(`${PROFILES_API}/plans`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).data?.plans;
}

/**
 * Turn an API payload into a single renderable SiteLayout doc.
 * Handles: default fallback (isDefault), a single page, or the root page
 * of a multi-page profile.
 */
export function resolveDoc(payload) {
  if (!payload) return null;
  if (payload.isDefault) return payload.data;
  if (payload.page) return payload.page.json;
  const pages = payload.pages || [];
  const root = pages.find((p) => p.slug === '' || p.slug === 'home') || pages[0];
  return root?.json || null;
}
