import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlans } from '../config/api.js';

/**
 * Route "/" — onboarding / landing page for the Profilo platform.
 * Explains the product (no-code, JSON-driven profile sites — like Canva, but
 * configurable like code), the two plans, and how publishing + HTML export work.
 * Plan numbers come from the API (/plans) with a local fallback, so they stay in
 * one place.
 */
const FALLBACK_PLANS = {
  free: { id: 'free', label: 'Free', priceInr: 0, billing: 'free', maxPages: 10, features: { aiSuggestions: false, htmlExport: true } },
  advanced: { id: 'advanced', label: 'Advanced', priceInr: 100, billing: 'yearly', maxPages: 20, features: { aiSuggestions: true, htmlExport: true } },
};

const STEPS = [
  ['1', 'Pick a template', 'Choose a Profile + Team style (5 each). It is all just configuration.'],
  ['2', 'Edit one JSON', 'Change every word, image URL and link from a single JSON — no code.'],
  ['3', 'Preview', 'See it exactly as a public page before anyone else does.'],
  ['4', 'Publish or export', 'Publish to /p/your-name, or download a self-contained HTML to host anywhere.'],
];

const FEATURES = [
  ['No-code, JSON-driven', 'Like Canva for profile pages — but configurable like code. Edit text, photos and links in one file.'],
  ['Made for you', 'Students and working professionals: a clean, fast, free profile page in minutes.'],
  ['Bilingual', 'Every field supports English + Telugu with an on-page language toggle.'],
  ['Self-contained HTML export', 'Download one HTML file with CSS + your JSON inlined. Opens offline, host it anywhere for a live URL.'],
  ['Publish by slug', 'Go live at /p/your-name instantly — the page resolves your JSON from the cloud.'],
  ['Light / dark + palettes', 'Warm light and elegant dark themes, plus secret colour palettes.'],
];

const USECASES = [
  ['Students', 'Show your projects and skills to land internships and first jobs — a real portfolio without the portfolio-building headache.'],
  ['Working professionals', 'A clean, always-current profile to share with recruiters, clients and your network — update it in minutes.'],
  ['Freelancers', 'Pitch your services and past work, then export an HTML page to host on your own domain.'],
  ['Career switchers', 'Reframe your story around the role you want, with the right projects front and centre.'],
];

export default function Onboarding() {
  const [plans, setPlans] = useState(FALLBACK_PLANS);

  useEffect(() => {
    let alive = true;
    fetchPlans()
      .then((p) => { if (alive && p) setPlans(p); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const priceLabel = (p) => (p.priceInr ? `₹${p.priceInr}/${p.billing === 'yearly' ? 'year' : p.billing}` : 'Free forever');

  return (
    <div className="onb">
      {/* Hero */}
      <header className="onb-hero">
        <div className="container">
          <span className="eyebrow">Profilo Designer · No-code profile pages</span>
          <h1 className="display onb-title">
            Your profile page,<br />
            <span className="gradient-text">built from one JSON.</span>
          </h1>
          <p className="onb-lead">
            Make your profile <b>live in minutes — free, no code, fully customizable</b>. Beautiful,
            bilingual profile sites for students and working professionals: edit one JSON, preview it,
            then publish to a link or export a self-contained HTML you own and host anywhere.
          </p>
          <div className="onb-cta">
            <Link className="btn btn-primary" to="/templates">Browse templates</Link>
            <Link className="btn btn-ghost" to="/preview">Try the live preview</Link>
            <Link className="btn btn-ghost" to="/vedika-raksha-profile">See a live demo</Link>
          </div>
        </div>
      </header>

      {/* Mission & Vision */}
      <section className="section container">
        <div className="onb-grid onb-mv">
          <div className="glass onb-card">
            <span className="eyebrow">Our mission</span>
            <h3>Put everyone's work online — free</h3>
            <p>To help every student and working professional publish a beautiful, credible profile in minutes — no code, and no paywall just to be seen.</p>
          </div>
          <div className="glass onb-card">
            <span className="eyebrow">Our vision</span>
            <h3>A profile you truly own</h3>
            <p>A customizable, portable profile you control: edit it anytime from one JSON, host it anywhere, never get locked in. Your work should speak for itself.</p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section container">
        <h2 className="display section-title" style={{ textAlign: 'center' }}>Who it's for</h2>
        <p className="section-sub" style={{ textAlign: 'center' }}>One profile, many use-cases — all free and fully customizable.</p>
        <div className="onb-grid onb-features">
          {USECASES.map(([title, desc]) => (
            <div key={title} className="glass onb-card">
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section container">
        <h2 className="display section-title" style={{ textAlign: 'center' }}>How it works</h2>
        <div className="onb-grid onb-steps">
          {STEPS.map(([n, title, desc]) => (
            <div key={n} className="glass onb-card">
              <span className="onb-step-num">{n}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section container">
        <h2 className="display section-title" style={{ textAlign: 'center' }}>Why Profilo</h2>
        <div className="onb-grid onb-features">
          {FEATURES.map(([title, desc]) => (
            <div key={title} className="glass onb-card">
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="section container">
        <h2 className="display section-title" style={{ textAlign: 'center' }}>Simple pricing</h2>
        <p className="section-sub" style={{ textAlign: 'center' }}>Start free. Upgrade only if you need more pages and AI suggestions.</p>
        <div className="onb-grid onb-plans">
          {Object.values(plans).map((p) => (
            <div key={p.id} className={`glass onb-plan ${p.id === 'advanced' ? 'onb-plan--featured' : ''}`}>
              <h3 className="onb-plan-name">{p.label}</h3>
              <div className="onb-plan-price">{priceLabel(p)}</div>
              <ul className="onb-plan-list">
                <li>✓ Publish up to <b>{p.maxPages} pages</b></li>
                <li>✓ Self-contained HTML export</li>
                <li>✓ Bilingual (EN + తె)</li>
                <li>{p.features?.aiSuggestions ? '✓' : '—'} AI automation suggestions</li>
              </ul>
              <Link className={`btn ${p.id === 'advanced' ? 'btn-primary' : 'btn-ghost'}`} to="/preview">
                {p.priceInr ? 'Go Advanced' : 'Start free'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section container" style={{ textAlign: 'center' }}>
        <h2 className="display section-title">Ready to build your page?</h2>
        <div className="onb-cta" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" to="/preview">Open the preview</Link>
          <Link className="btn btn-ghost" to="/vedika-raksha-profile">View a demo</Link>
        </div>
        <p style={{ opacity: 0.6, marginTop: '1.5rem', fontSize: '.9rem' }}>© Profilo Designer</p>
      </section>
    </div>
  );
}
