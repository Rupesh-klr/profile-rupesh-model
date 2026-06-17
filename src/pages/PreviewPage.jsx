import { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import sample from '../data/default-template.json';
import { buildProfileHtml, downloadHtml, slugify } from '../utils/exportHtml.js';
import { deployProfile } from '../config/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;

/**
 * Route "/preview" — paste a profile JSON (or load it from a URL), see it
 * rendered exactly as a public page, then export a self-contained HTML file.
 */
// Seed from a template handed off by /templates/:id (Edit in preview), else sample.
function initialText() {
  try {
    const handoff = sessionStorage.getItem('profilo-preview');
    if (handoff) {
      sessionStorage.removeItem('profilo-preview');
      return handoff;
    }
  } catch { /* ignore */ }
  return JSON.stringify(sample, null, 2);
}

export default function PreviewPage() {
  const { isAuthenticated, user } = useAuth();
  const [text, setText] = useState(initialText);
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState('');
  const [showPublish, setShowPublish] = useState(false);
  const [pub, setPub] = useState({ slug: '', username: '', password: '', otp: '123123', name: '', email: '' });
  const [pubBusy, setPubBusy] = useState(false);
  const [pubError, setPubError] = useState('');
  const [pubResult, setPubResult] = useState(null);

  function render() {
    try {
      setDoc(JSON.parse(text));
      setError('');
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
    }
  }

  async function loadUrl() {
    const url = prompt('Paste a public JSON URL:');
    if (!url) return;
    try {
      const r = await fetch(url);
      const j = await r.json();
      setText(JSON.stringify(j, null, 2));
      setDoc(j);
      setError('');
    } catch (e) {
      setError('Could not load URL: ' + e.message);
    }
  }

  function downloadJson() {
    const blob = new Blob([text], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'profile.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function deploy() {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      setPubError('Fix the JSON first: ' + e.message);
      return;
    }
    if (!SLUG_RE.test(pub.slug)) {
      setPubError('Slug must be 2–40 chars: lowercase letters, numbers and dashes.');
      return;
    }
    if (!isAuthenticated) {
      if (!/^[a-z0-9_.-]{3,30}$/.test(pub.username)) {
        setPubError('Username: 3–30 chars (a–z, 0–9, dot, dash, underscore).');
        return;
      }
      if (pub.password.length < 6) {
        setPubError('Password must be at least 6 characters.');
        return;
      }
    }
    setPubBusy(true);
    setPubError('');
    try {
      const res = await deployProfile({
        slug: pub.slug,
        username: pub.username,
        password: pub.password,
        otp: pub.otp,
        displayName: pub.name,
        email: pub.email,
        doc: parsed,
      });
      setPubResult(res);
    } catch (e) {
      setPubError(e.message || 'Deploy failed. Check the API is running.');
    } finally {
      setPubBusy(false);
    }
  }

  function exportHtml() {
    const title = doc?.person?.name?.en || doc?.person?.name || 'profile';
    try {
      const html = buildProfileHtml({ doc, title });
      downloadHtml(`${slugify(title)}.html`, html);
    } catch (e) {
      alert(e.message);
    }
  }

  if (doc) {
    return (
      <>
        {/* Floating toolbar — fixed BELOW the navbar so it's always clickable */}
        <div style={toolbar}>
          <button style={tbBtn} onClick={() => setDoc(null)}>← Edit JSON</button>
          <button style={tbBtnPrimary} onClick={exportHtml}>⬇ Download HTML</button>
          <span style={badge}>Preview · not published</span>
        </div>
        <div id="profilo-export-root">
          <SiteLayout data={doc} />
        </div>
      </>
    );
  }

  return (
    <div style={wrap}>
      <h1 style={{ margin: '0 0 .25rem' }}>Profilo — Preview</h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>
        Paste your profile JSON below and click <b>Render preview</b>. This is exactly how your public
        page will look. Nothing is saved until you publish via the API — or export a self-contained
        HTML you can host anywhere.
      </p>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', margin: '0 0 .6rem' }}>
        <button style={btnPrimary} onClick={render}>Render preview</button>
        <button style={btnPublish} onClick={() => setShowPublish((s) => !s)}>🚀 Publish / Deploy</button>
        <button style={btn} onClick={loadUrl}>Load from URL…</button>
        <button style={btn} onClick={downloadJson}>Download JSON</button>
      </div>

      {showPublish && (
        <div style={panel}>
          {pubResult ? (
            <div>
              <h3 style={{ margin: '0 0 .4rem' }}>🎉 Published!</h3>
              <p style={{ margin: '0 0 .5rem' }}>
                Your page is live at{' '}
                <a href={pubResult.url}>{window.location.origin}{pubResult.url}</a>
              </p>
              {pubResult.editKey && (
                <p style={{ margin: '0 0 .6rem' }}>
                  Edit key (save it — shown once): <code style={code}>{pubResult.editKey}</code>
                </p>
              )}
              <a style={{ ...btnPrimary, textDecoration: 'none' }} href={pubResult.url}>Open my page →</a>
            </div>
          ) : (
            <>
              <h3 style={{ margin: '0 0 .35rem' }}>Publish this page</h3>
              {isAuthenticated ? (
                <p style={{ margin: '0 0 .7rem', opacity: 0.8, fontSize: '.9rem' }}>
                  Publishing as <b>{user?.name || user?.username}</b>. Pick a slug and deploy to{' '}
                  <code style={code}>/p/&lt;slug&gt;</code>.
                </p>
              ) : (
                <>
                  <p style={{ margin: '0 0 .6rem', opacity: 0.75, fontSize: '.9rem' }}>
                    Creates an account (or logs in), publishes to <code style={code}>/p/&lt;slug&gt;</code>, and
                    returns an edit key. Or <Link to="/login">log in</Link> first.
                  </p>
                  <div style={otpBanner}>
                    🔐 Dev mode: we're out of SMS/email credits, so the verification OTP is{' '}
                    <b>123123</b> (pre-filled).
                  </div>
                </>
              )}
              <div style={formGrid}>
                <input style={input} placeholder="page slug (e.g. rupesh-test-profile)" value={pub.slug}
                  onChange={(e) => setPub({ ...pub, slug: e.target.value.toLowerCase() })} />
                <input style={input} placeholder="display name (optional)" value={pub.name}
                  onChange={(e) => setPub({ ...pub, name: e.target.value })} />
                {!isAuthenticated && (
                  <>
                    <input style={input} placeholder="username" value={pub.username}
                      onChange={(e) => setPub({ ...pub, username: e.target.value.toLowerCase() })} />
                    <input style={input} type="password" placeholder="password (min 6)" value={pub.password}
                      onChange={(e) => setPub({ ...pub, password: e.target.value })} />
                    <input style={input} placeholder="OTP (123123)" value={pub.otp}
                      onChange={(e) => setPub({ ...pub, otp: e.target.value })} />
                    <input style={input} type="email" placeholder="email (optional, can repeat)" value={pub.email}
                      onChange={(e) => setPub({ ...pub, email: e.target.value })} />
                  </>
                )}
              </div>
              {pubError && <div style={{ ...err, marginTop: '.6rem' }}>{pubError}</div>}
              <button style={{ ...btnPrimary, marginTop: '.7rem', opacity: pubBusy ? 0.6 : 1 }}
                disabled={pubBusy} onClick={deploy}>
                {pubBusy ? 'Publishing…' : 'Deploy 🚀'}
              </button>
            </>
          )}
        </div>
      )}

      {error && <div style={err}>{error}</div>}
      <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} style={ta} />
    </div>
  );
}

const wrap = { maxWidth: 980, margin: '0 auto', padding: '2rem 1.2rem' };
const toolbar = {
  position: 'fixed',
  top: 78,
  left: 16,
  zIndex: 9999,
  display: 'flex',
  gap: '.5rem',
  alignItems: 'center',
  flexWrap: 'wrap',
  background: 'rgba(27,19,34,.92)',
  color: '#fff',
  padding: '.45rem .55rem',
  borderRadius: 999,
  boxShadow: '0 8px 30px rgba(0,0,0,.25)',
  backdropFilter: 'blur(8px)',
};
const tbBtn = { padding: '.4rem .8rem', borderRadius: 999, border: '1px solid rgba(255,255,255,.35)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 13 };
const tbBtnPrimary = { ...tbBtn, background: '#7c3aed', border: 'none' };
const badge = { fontSize: 12, opacity: 0.8, paddingRight: 6 };
const ta = { width: '100%', minHeight: '60vh', fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 13, lineHeight: 1.5, padding: '1rem', borderRadius: 12, border: '1px solid #ccc' };
const btn = { padding: '.5rem .9rem', borderRadius: 999, border: '1px solid #b58', background: '#fff', cursor: 'pointer' };
const btnPrimary = { ...btn, background: '#7c3aed', color: '#fff', border: 'none' };
const err = { background: '#fde8e8', color: '#9b1c1c', padding: '.6rem .9rem', borderRadius: 8, margin: '0 0 .6rem' };
const btnPublish = { ...btn, borderColor: '#7c3aed', color: '#7c3aed', fontWeight: 600 };
const panel = { border: '1px solid #e3d9ec', background: '#faf6fe', borderRadius: 12, padding: '1rem', margin: '0 0 .8rem' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' };
const input = { padding: '.55rem .7rem', borderRadius: 8, border: '1px solid #ccc', fontSize: 14 };
const code = { background: '#efe7f7', padding: '.1rem .4rem', borderRadius: 6, fontFamily: 'ui-monospace, Menlo, Consolas, monospace' };
const otpBanner = { background: '#fff7e6', border: '1px solid #f0d28a', color: '#7a5b00', padding: '.5rem .7rem', borderRadius: 8, fontSize: '.85rem', margin: '0 0 .7rem' };
