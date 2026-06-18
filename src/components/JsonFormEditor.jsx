import { useState } from 'react';

/**
 * JsonFormEditor — a WordPress/Canva-style structured editor for a profile JSON.
 * It recursively turns the data into labeled, editable fields:
 *   • string / number / boolean → a labeled input
 *   • bilingual { en, te }       → one field with English + Telugu inputs
 *   • object                     → a collapsible labeled group
 *   • array                      → a list of items with add / remove / reorder
 * Fully controlled: edits call onChange(newValue) with an immutable copy.
 */

const BI_KEYS = ['en', 'te'];
const isBilingual = (v) =>
  v && typeof v === 'object' && !Array.isArray(v) &&
  Object.keys(v).length > 0 && Object.keys(v).every((k) => BI_KEYS.includes(k));

function humanize(key) {
  if (key == null || key === '') return '';
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

// A structurally-similar empty value (used by "Add" on arrays).
function blankLike(v) {
  if (Array.isArray(v)) return v.length ? [blankLike(v[0])] : [];
  if (isBilingual(v)) return { en: '', te: '' };
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v)) o[k] = blankLike(v[k]);
    return o;
  }
  if (typeof v === 'number') return 0;
  if (typeof v === 'boolean') return false;
  return '';
}

function Field({ name, value, onChange, depth }) {
  const label = humanize(name);

  if (isBilingual(value)) {
    return (
      <div className="jfe-field">
        {label && <label className="jfe-label">{label}</label>}
        <div className="jfe-bi">
          <input className="jfe-input" placeholder="English" value={value.en ?? ''}
            onChange={(e) => onChange({ ...value, en: e.target.value })} />
          <input className="jfe-input" lang="te" placeholder="తెలుగు" value={value.te ?? ''}
            onChange={(e) => onChange({ ...value, te: e.target.value })} />
        </div>
      </div>
    );
  }

  if (value === null || typeof value === 'string' || typeof value === 'number') {
    const str = value == null ? '' : value;
    const long = typeof str === 'string' && (str.length > 64 || str.includes('\n'));
    return (
      <div className="jfe-field">
        {label && <label className="jfe-label">{label}</label>}
        {long ? (
          <textarea className="jfe-input jfe-textarea" value={str} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input
            className="jfe-input"
            type={typeof value === 'number' ? 'number' : 'text'}
            value={str}
            onChange={(e) => onChange(typeof value === 'number' ? Number(e.target.value) : e.target.value)}
          />
        )}
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="jfe-field jfe-checkbox">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
    );
  }

  if (Array.isArray(value)) {
    return <ArrayField name={name} value={value} onChange={onChange} depth={depth} />;
  }
  return <ObjectField name={name} value={value} onChange={onChange} depth={depth} />;
}

function ObjectField({ name, value, onChange, depth }) {
  const [open, setOpen] = useState(depth < 2);
  const entries = Object.entries(value);
  const setKey = (k, nv) => onChange({ ...value, [k]: nv });

  // Root (no name): render entries directly, no header.
  if (name == null) {
    return (
      <div className="jfe-root">
        {entries.map(([k, v]) => (
          <Field key={k} name={k} value={v} onChange={(nv) => setKey(k, nv)} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <div className={`jfe-group d${Math.min(depth, 4)}`}>
      <button type="button" className="jfe-group-head" onClick={() => setOpen((o) => !o)}>
        <span className="jfe-caret">{open ? '▾' : '▸'}</span> {humanize(name)}
      </button>
      {open && (
        <div className="jfe-group-body">
          {entries.map(([k, v]) => (
            <Field key={k} name={k} value={v} onChange={(nv) => setKey(k, nv)} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArrayField({ name, value, onChange, depth }) {
  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const a = [...value];
    const [it] = a.splice(from, 1);
    a.splice(to, 0, it);
    onChange(a);
  };
  const add = () => onChange([...value, value.length ? blankLike(value[value.length - 1]) : '']);
  const removeAt = (i) => onChange(value.filter((_, j) => j !== i));
  const setAt = (i, nv) => onChange(value.map((x, j) => (j === i ? nv : x)));

  // Short label preview for an item (helps identify rows when collapsed).
  const itemLabel = (item) => {
    const pick = (o) => (o && typeof o === 'object' ? (o.en ?? o[Object.keys(o)[0]]) : o);
    if (item && typeof item === 'object') {
      const t = item.title || item.heading || item.label || item.name || item.q || item.quote;
      return t ? String(pick(t)).slice(0, 40) : '';
    }
    return String(pick(item) ?? '').slice(0, 40);
  };

  return (
    <div className={`jfe-group d${Math.min(depth, 4)}`}>
      <div className="jfe-arr-head">
        <span className="jfe-label">{humanize(name)} <em className="jfe-count">{value.length}</em></span>
        <button type="button" className="jfe-mini jfe-add" onClick={add}>+ Add</button>
      </div>
      <div className="jfe-group-body">
        {value.map((item, i) => (
          <div className="jfe-arr-item" key={i}>
            <div className="jfe-arr-item-head">
              <span className="jfe-arr-no">#{i + 1}{itemLabel(item) ? ` · ${itemLabel(item)}` : ''}</span>
              <span className="jfe-arr-actions">
                <button type="button" className="jfe-mini" disabled={i === 0} onClick={() => move(i, i - 1)}>↑</button>
                <button type="button" className="jfe-mini" disabled={i === value.length - 1} onClick={() => move(i, i + 1)}>↓</button>
                <button type="button" className="jfe-mini jfe-del" onClick={() => removeAt(i)}>✕</button>
              </span>
            </div>
            <Field name={null} value={item} onChange={(nv) => setAt(i, nv)} depth={depth + 1} />
          </div>
        ))}
        {value.length === 0 && <p className="jfe-empty">No items. Click “Add”.</p>}
      </div>
    </div>
  );
}

export default function JsonFormEditor({ value, onChange }) {
  if (!value || typeof value !== 'object') {
    return <div className="jfe-invalid">Nothing to edit.</div>;
  }
  return (
    <div className="jfe">
      <ObjectField name={null} value={value} onChange={onChange} depth={0} />
    </div>
  );
}
