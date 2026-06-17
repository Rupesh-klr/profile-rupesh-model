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

/* ---------------- accounts, publish & edit ---------------- */

// Dev verification OTP — the API is "out of credits", so a fixed code is used.
export const DEV_OTP = '123123';

// — session persistence (shared by AuthContext + all authed calls) —
const TOKEN_KEY = 'profilo_token';
const USER_KEY = 'profilo_user';
export function getStoredToken() {
  try { return localStorage.getItem(TOKEN_KEY) || null; } catch { return null; }
}
export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
}
export function setSession(token, user) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch { /* ignore */ }
}
export function clearSession() {
  try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } catch { /* ignore */ }
}

function authHeaders(auth = {}) {
  const h = { 'Content-Type': 'application/json' };
  // Explicit token/editKey wins; otherwise fall back to the logged-in session.
  const token = auth.token || (auth.editKey ? null : getStoredToken());
  if (token) h.Authorization = `Bearer ${token}`;
  if (auth.editKey) h['x-edit-key'] = auth.editKey;
  return h;
}

async function api(method, path, { body, auth } = {}) {
  const res = await fetch(`${PROFILES_API}${path}`, {
    method,
    headers: authHeaders(auth),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || `HTTP ${res.status}`), { status: res.status, data });
  return data.data;
}

// — auth (username-based; OTP-gated signup/reset) —
export const profileSignup = (username, password, otp, extra = {}) =>
  api('POST', '/auth/signup', { body: { username, password, otp, ...extra } });
export const profileLogin = (username, password) =>
  api('POST', '/auth/login', { body: { username, password } });
export const forgotPassword = (username, otp, newPassword) =>
  api('POST', '/auth/forgot', { body: { username, otp, newPassword } });

/** Login if the account exists, otherwise create it (OTP-gated). Returns { token, user }. */
export async function signupOrLogin(username, password, otp, extra) {
  try {
    return await profileLogin(username, password);
  } catch (e) {
    if (e.status !== 401) throw e;
    try {
      return await profileSignup(username, password, otp, extra);
    } catch (e2) {
      if (e2.status === 409) {
        throw new Error('Username already exists — check your password (or reset it).');
      }
      throw e2;
    }
  }
}

// — profile read/write (auth = { token } or { editKey }) —
export const fetchAdminProfile = (slug, auth) => api('GET', `/${encodeURIComponent(slug)}/admin`, { auth });
export const updateProfile = (slug, body, auth) => api('PUT', `/${encodeURIComponent(slug)}`, { body, auth });
export const publishProfile = (slug, auth) => api('POST', `/${encodeURIComponent(slug)}/publish`, { auth });

const buildPages = (doc, displayName, slug) => {
  const variant = doc?.sections?.[0]?.variant;
  return [{ slug: 'home', title: displayName || slug, template: variant ? `profile-${variant}` : 'profile-1', json: doc }];
};

/**
 * One-call deploy from the preview: ensure an account (OTP-gated), create (or
 * update if you already own the slug) the profile, publish it, and return the
 * live path + the one-time editKey.
 */
export async function deployProfile({ slug, username, password, otp, displayName, email, doc }) {
  // Use the logged-in session if present; otherwise sign up / log in.
  let token = getStoredToken();
  if (!token) {
    ({ token } = await signupOrLogin(username, password, otp, { email, name: displayName }));
  }
  const pages = buildPages(doc, displayName, slug);

  let editKey = null;
  try {
    const res = await api('POST', '', { body: { slug, displayName, pages }, auth: { token } });
    editKey = res.editKey;
  } catch (e) {
    if (e.status === 409) {
      await updateProfile(slug, { displayName, pages }, { token }); // we own it → update
    } else {
      throw e;
    }
  }
  await publishProfile(slug, { token });
  return { url: `/p/${slug}`, editKey, token };
}

/** Save edits to an existing profile's home page and (re)publish. */
export async function saveAndPublish(slug, { doc, displayName }, auth) {
  const pages = buildPages(doc, displayName, slug);
  await updateProfile(slug, { displayName, pages }, auth);
  await publishProfile(slug, auth);
  return { url: `/p/${slug}` };
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
