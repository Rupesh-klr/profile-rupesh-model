import { Link } from 'react-router-dom';
import { templatesByLevel } from '../data/templates/catalog.js';

/** Route "/templates" — browse all sample templates grouped by experience level. */
export default function TemplatesGallery() {
  const groups = templatesByLevel();

  return (
    <div className="onb">
      <header className="onb-hero">
        <div className="container">
          <span className="eyebrow">Profilo · Template gallery</span>
          <h1 className="display onb-title">Pick a starting template</h1>
          <p className="onb-lead">
            Real, ready-to-edit profiles for students and developers. Open one to see it exactly as a
            visitor would, then edit the JSON and publish — or export a self-contained HTML.
          </p>
          <div className="onb-cta">
            <Link className="btn btn-ghost" to="/">← Home</Link>
            <Link className="btn btn-primary" to="/preview">Start from blank</Link>
          </div>
        </div>
      </header>

      {groups.map(({ level, items }) => (
        <section key={level} className="section container">
          <h2 className="display section-title" style={{ textAlign: 'center' }}>{level}</h2>
          <div className="tpl-grid">
            {items.map((t) => (
              <div key={t.id} className="glass tpl-card">
                <span className="tpl-role">{t.role} · model {t.model}</span>
                <h3>{t.name}</h3>
                <p className="tpl-title">{t.title}</p>
                <p className="tpl-tagline">{t.tagline}</p>
                <Link className="btn btn-primary" to={`/templates/${t.id}`}>View template ↗</Link>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
