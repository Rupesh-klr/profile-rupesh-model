import { useNavigate, useParams, Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import { getTemplate } from '../data/templates/catalog.js';

/** Route "/templates/:id" — render one template exactly as a published page. */
export default function TemplateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tpl = getTemplate(id);

  if (!tpl) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        Template not found. <Link to="/templates">Back to the gallery</Link>
      </div>
    );
  }

  function editInPreview() {
    try {
      sessionStorage.setItem('profilo-preview', JSON.stringify(tpl.data, null, 2));
    } catch { /* ignore */ }
    navigate('/preview');
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(tpl.data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${tpl.id}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <div style={toolbar}>
        <Link style={tbBtn} to="/templates">← Templates</Link>
        <button style={tbBtnPrimary} onClick={editInPreview}>✎ Edit in preview</button>
        <button style={tbBtn} onClick={downloadJson}>⬇ JSON</button>
      </div>
      <div id="profilo-export-root">
        <SiteLayout data={tpl.data} />
      </div>
    </>
  );
}

const toolbar = {
  position: 'fixed', top: 78, left: 16, zIndex: 9999,
  display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap',
  background: 'rgba(27,19,34,.92)', color: '#fff', padding: '.45rem .55rem',
  borderRadius: 999, boxShadow: '0 8px 30px rgba(0,0,0,.25)', backdropFilter: 'blur(8px)',
};
const tbBtn = { padding: '.4rem .8rem', borderRadius: 999, border: '1px solid rgba(255,255,255,.35)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 13, textDecoration: 'none' };
const tbBtnPrimary = { ...tbBtn, background: '#7c3aed', border: 'none' };
