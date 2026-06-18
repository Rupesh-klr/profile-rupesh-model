import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { profileLogin, forgotPassword, fetchAdminProfile, saveAndPublish, DEV_OTP } from '../config/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import JsonFormEditor from '../components/JsonFormEditor.jsx';

/**
 * Route "/edit/:slug" — owner editor.
 * Log in (username+password) or paste an edit key → load the page's JSON →
 * edit it → Update (saves all fields + republishes). Includes forgot-password
 * (dev OTP resets to 123123).
 */
export default function EditPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();

  const [creds, setCreds] = useState({ username: '', password: '', editKey: '' });
  const [auth, setAuth] = useState(null); // {} (session) | { token } | { editKey }

  // Already logged in? Try to load via the session token (falls back to the
  // login form if this account doesn't own the page).
  useEffect(() => {
    if (!isAuthenticated || auth) return;
    let alive = true;
    (async () => {
      try {
        const { profile } = await fetchAdminProfile(slug, {}); // {} → uses stored session token
        if (!alive) return;
        const home = (profile.pages || []).find((p) => p.slug === 'home') || profile.pages?.[0];
        setText(JSON.stringify(home?.json || {}, null, 2));
        setDisplayName(profile.displayName || '');
        setAuth({});
      } catch { /* not the owner via session — show the login form */ }
    })();
    return () => { alive = false; };
  }, [isAuthenticated, slug, auth]);
  const [displayName, setDisplayName] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [savedUrl, setSavedUrl] = useState('');
  const [mode, setMode] = useState('visual'); // 'visual' | 'code'
  const parsedDoc = useMemo(() => { try { return JSON.parse(text); } catch { return null; } }, [text]);

  const [showForgot, setShowForgot] = useState(false);
  const [forgot, setForgot] = useState({ username: '', otp: DEV_OTP, newPassword: '' });
  const [forgotMsg, setForgotMsg] = useState('');

  async function load() {
    setBusy(true);
    setError('');
    try {
      let a;
      if (creds.editKey.trim()) {
        a = { editKey: creds.editKey.trim() };
      } else {
        const { token } = await profileLogin(creds.username, creds.password);
        a = { token };
      }
      const { profile } = await fetchAdminProfile(slug, a);
      const home = (profile.pages || []).find((p) => p.slug === 'home') || profile.pages?.[0];
      setText(JSON.stringify(home?.json || {}, null, 2));
      setDisplayName(profile.displayName || '');
      setAuth(a);
    } catch (e) {
      setError(e.status === 403 ? 'Those credentials do not own this page.' : (e.message || 'Could not load.'));
    } finally {
      setBusy(false);
    }
  }

  async function update() {
    let doc;
    try {
      doc = JSON.parse(text);
    } catch (e) {
      setError('Fix the JSON first: ' + e.message);
      return;
    }
    setBusy(true);
    setError('');
    setSavedUrl('');
    try {
      const res = await saveAndPublish(slug, { doc, displayName }, auth);
      setSavedUrl(res.url);
    } catch (e) {
      setError(e.message || 'Update failed.');
    } finally {
      setBusy(false);
    }
  }

  async function doForgot() {
    setForgotMsg('');
    try {
      await forgotPassword(forgot.username, forgot.otp, forgot.newPassword || undefined);
      setForgotMsg(`Password reset for "${forgot.username}". ${forgot.newPassword ? '' : `It is now ${DEV_OTP}. `}Log in above.`);
    } catch (e) {
      setForgotMsg(e.message || 'Reset failed.');
    }
  }

  // ── Not authenticated: login / edit-key / forgot ──
  if (!auth) {
    return (
      <div style={wrap}>
        <h1 style={{ margin: '0 0 .25rem' }}>Edit “{slug}”</h1>
        <p style={{ marginTop: 0, opacity: 0.75 }}>Log in as the owner, or paste this page's edit key.</p>

        <div style={otpBanner}>🔐 Dev mode: out of credits — the verification OTP is <b>{DEV_OTP}</b>.</div>

        <div style={formGrid}>
          <input style={input} placeholder="username" value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value.toLowerCase() })} />
          <input style={input} type="password" placeholder="password" value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })} />
        </div>
        <input style={{ ...input, width: '100%', marginTop: '.5rem' }} placeholder="…or paste edit key" value={creds.editKey}
          onChange={(e) => setCreds({ ...creds, editKey: e.target.value })} />

        {error && <div style={err}>{error}</div>}
        <div style={{ display: 'flex', gap: '.5rem', marginTop: '.7rem', flexWrap: 'wrap' }}>
          <button style={{ ...btnPrimary, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={load}>
            {busy ? 'Loading…' : 'Load page'}
          </button>
          <button style={btn} onClick={() => setShowForgot((s) => !s)}>Forgot password?</button>
          <Link style={{ ...btn, textDecoration: 'none' }} to={`/p/${slug}`}>View live ↗</Link>
        </div>

        {showForgot && (
          <div style={panel}>
            <h3 style={{ margin: '0 0 .5rem' }}>Reset password</h3>
            <div style={formGrid}>
              <input style={input} placeholder="username" value={forgot.username}
                onChange={(e) => setForgot({ ...forgot, username: e.target.value.toLowerCase() })} />
              <input style={input} placeholder="OTP (123123)" value={forgot.otp}
                onChange={(e) => setForgot({ ...forgot, otp: e.target.value })} />
              <input style={input} type="password" placeholder="new password (blank = 123123)" value={forgot.newPassword}
                onChange={(e) => setForgot({ ...forgot, newPassword: e.target.value })} />
            </div>
            {forgotMsg && <div style={{ ...note, marginTop: '.5rem' }}>{forgotMsg}</div>}
            <button style={{ ...btnPrimary, marginTop: '.6rem' }} onClick={doForgot}>Reset password</button>
          </div>
        )}
      </div>
    );
  }

  // ── Authenticated: edit + update ──
  return (
    <div style={wrap}>
      <h1 style={{ margin: '0 0 .25rem' }}>Editing “{slug}”</h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>
        Edit the page JSON and click <b>Update</b> to save and republish to <code style={code}>/p/{slug}</code>.
      </p>

      <input style={{ ...input, width: '100%', margin: '0 0 .5rem' }} placeholder="display name" value={displayName}
        onChange={(e) => setDisplayName(e.target.value)} />

      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', margin: '0 0 .6rem' }}>
        <button style={{ ...btnPrimary, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={update}>
          {busy ? 'Updating…' : 'Update ✓'}
        </button>
        <Link style={{ ...btn, textDecoration: 'none' }} to={`/p/${slug}`}>View live ↗</Link>
        <button style={btn} onClick={() => setAuth(null)}>Log out</button>
      </div>

      {savedUrl && <div style={note}>✅ Saved & published — <a href={savedUrl}>open {window.location.origin}{savedUrl}</a></div>}
      {error && <div style={err}>{error}</div>}

      <div className="ed-tabs">
        <button className={`ed-tab ${mode === 'visual' ? 'active' : ''}`} onClick={() => setMode('visual')}>🧩 Visual editor</button>
        <button className={`ed-tab ${mode === 'code' ? 'active' : ''}`} onClick={() => setMode('code')}>{'{ } JSON'}</button>
      </div>

      {mode === 'code' ? (
        <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} style={ta} />
      ) : parsedDoc ? (
        <div className="ed-form">
          <JsonFormEditor value={parsedDoc} onChange={(nv) => setText(JSON.stringify(nv, null, 2))} />
        </div>
      ) : (
        <div style={err}>The JSON is invalid — switch to the JSON tab to fix it, then return here.</div>
      )}
    </div>
  );
}

const wrap = { maxWidth: 980, margin: '0 auto', padding: '2rem 1.2rem' };
const ta = { width: '100%', minHeight: '58vh', fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 13, lineHeight: 1.5, padding: '1rem', borderRadius: 12, border: '1px solid #ccc' };
const btn = { padding: '.5rem .9rem', borderRadius: 999, border: '1px solid #b58', background: '#fff', cursor: 'pointer' };
const btnPrimary = { ...btn, background: '#7c3aed', color: '#fff', border: 'none' };
const err = { background: '#fde8e8', color: '#9b1c1c', padding: '.6rem .9rem', borderRadius: 8, margin: '.6rem 0 0' };
const note = { background: '#e9f9ee', color: '#10643a', padding: '.6rem .9rem', borderRadius: 8, margin: '.6rem 0 0' };
const otpBanner = { background: '#fff7e6', border: '1px solid #f0d28a', color: '#7a5b00', padding: '.5rem .7rem', borderRadius: 8, fontSize: '.85rem', margin: '0 0 .8rem' };
const panel = { border: '1px solid #e3d9ec', background: '#faf6fe', borderRadius: 12, padding: '1rem', margin: '.8rem 0 0' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' };
const input = { padding: '.55rem .7rem', borderRadius: 8, border: '1px solid #ccc', fontSize: 14 };
const code = { background: '#efe7f7', padding: '.1rem .4rem', borderRadius: 6, fontFamily: 'ui-monospace, Menlo, Consolas, monospace' };
