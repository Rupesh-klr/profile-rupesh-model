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

/* ---------------- publish / deploy from the preview ---------------- */

async function sendJson(method, url, body, token) {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || `HTTP ${res.status}`), { status: res.status, data });
  return data.data;
}

export const profileSignup = (email, password, name) =>
  sendJson('POST', `${PROFILES_API}/auth/signup`, { email, password, name });
export const profileLogin = (email, password) =>
  sendJson('POST', `${PROFILES_API}/auth/login`, { email, password });

/** Login if the account exists, otherwise create it. Returns { token, user }. */
export async function signupOrLogin(email, password, name) {
  try {
    return await profileLogin(email, password);
  } catch (e) {
    if (e.status !== 401) throw e;
    // 401 = either no account yet, or wrong password. Try to create it.
    try {
      return await profileSignup(email, password, name);
    } catch (e2) {
      if (e2.status === 409) {
        throw new Error('This email is already registered — please check your password.');
      }
      throw e2;
    }
  }
}

/**
 * One-call deploy from the preview: ensure an account, create (or update if you
 * already own the slug) the profile from the pasted JSON, publish it, and return
 * the live path + the one-time editKey.
 */
export async function deployProfile({ slug, email, password, displayName, doc }) {
  const { token } = await signupOrLogin(email, password, displayName);
  const variant = doc?.sections?.[0]?.variant;
  const pages = [{ slug: 'home', title: displayName || slug, template: variant ? `profile-${variant}` : 'profile-1', json: doc }];

  let editKey = null;
  try {
    const res = await sendJson('POST', PROFILES_API, { slug, displayName, pages }, token);
    editKey = res.editKey;
  } catch (e) {
    if (e.status === 409) {
      // Slug exists — update it (succeeds only if this account owns it).
      await sendJson('PUT', `${PROFILES_API}/${encodeURIComponent(slug)}`, { displayName, pages }, token);
    } else {
      throw e;
    }
  }
  await sendJson('POST', `${PROFILES_API}/${encodeURIComponent(slug)}/publish`, {}, token);
  return { url: `/p/${slug}`, editKey, token };
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
