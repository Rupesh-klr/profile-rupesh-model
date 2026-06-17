/**
 * Self-contained HTML export.
 *
 * Snapshots the currently rendered profile (inside #profilo-export-root) into a
 * single .html file with ALL CSS inlined and the source JSON embedded. The file:
 *   • opens offline (everything is inline; only images-by-URL + Google Fonts need the network),
 *   • can be uploaded to any static host (GitHub Pages, Netlify, Hostinger…) for a live URL,
 *   • carries its own data in <script id="profilo-data"> so it stays editable/portable.
 *
 * It is a static snapshot (no theme/language JS), which is exactly what you want
 * for a hostable, offline page.
 */
export function buildProfileHtml({ rootId = 'profilo-export-root', doc, title = 'Profilo' }) {
  const rootEl = document.getElementById(rootId);
  if (!rootEl) throw new Error('Nothing to export — render the preview first.');

  // 1) Inline every <style> tag (Vite injects CSS as <style> in dev; build inlines too).
  let css = '';
  document.querySelectorAll('style').forEach((s) => {
    css += s.textContent + '\n';
  });

  // 2) Keep font preconnect + remote stylesheets so typography matches when online.
  let headLinks = '';
  document
    .querySelectorAll('link[rel="preconnect"], link[rel="stylesheet"][href^="http"]')
    .forEach((l) => {
      headLinks += l.outerHTML + '\n';
    });

  // 3) Carry over theme / palette / language chosen at export time.
  const htmlEl = document.documentElement;
  const theme = htmlEl.getAttribute('data-theme') || 'light';
  const palette = htmlEl.getAttribute('data-palette') || '';
  const lang = htmlEl.getAttribute('lang') || 'en';

  const body = rootEl.innerHTML;
  const dataScript = doc
    ? `<script type="application/json" id="profilo-data">${JSON.stringify(doc).replace(/</g, '\\u003c')}</script>`
    : '';

  return `<!doctype html>
<html lang="${lang}" data-theme="${theme}"${palette ? ` data-palette="${palette}"` : ''}>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${escapeHtml(title)}</title>
<!-- Exported by Profilo Designer — self-contained, offline-ready, host anywhere. -->
${headLinks}<style>${css}</style>
</head>
<body>
${body}
${dataScript}
</body>
</html>`;
}

export function downloadHtml(filename, html) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

export function slugify(s) {
  return String(s || 'profile')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'profile';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
