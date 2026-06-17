import { useState } from 'react';
import SiteLayout from '../components/SiteLayout.jsx';
import sample from '../data/default-template.json';
import { buildProfileHtml, downloadHtml, slugify } from '../utils/exportHtml.js';

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
  const [text, setText] = useState(initialText);
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState('');

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
        <button style={btn} onClick={loadUrl}>Load from URL…</button>
        <button style={btn} onClick={downloadJson}>Download JSON</button>
      </div>
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
