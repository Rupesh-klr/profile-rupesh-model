import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlans } from '../config/api.js';
import Reveal from '../components/Reveal.jsx';

/**
 * Route "/" — onboarding / landing page for the Profilo platform.
 * Bold, developer-grade look: dark "terminal" hero with a JSON ➜ rendered-card
 * showcase, stats, a roles marquee, the product story, plans and an FAQ.
 */
const FALLBACK_PLANS = {
  free: { id: 'free', label: 'Free', priceInr: 0, billing: 'free', maxPages: 10, features: { aiSuggestions: false, htmlExport: true } },
  advanced: { id: 'advanced', label: 'Advanced', priceInr: 100, billing: 'yearly', maxPages: 20, features: { aiSuggestions: true, htmlExport: true } },
};

const STATS = [
  ['10+', 'Ready-made templates'],
  ['9', 'Developer roles covered'],
  ['2', 'Languages (EN / తె)'],
  ['₹0', 'To launch your page'],
];

const ROLES = [
  'Full-Stack', 'Frontend', 'UI / UX', 'Backend', 'DevOps',
  'Cloud', 'Salesforce', 'Data Warehouse', 'Machine Learning', 'Data Science', 'Student',
];

const STEPS = [
  ['1', 'Pick a template', 'Choose a Profile + Team style (5 each) for your role and experience level.'],
  ['2', 'Edit visually', 'Change every field in a WordPress-style editor — or tweak the raw JSON. No code needed.'],
  ['3', 'Preview', 'See it exactly as a public page before anyone else does.'],
  ['4', 'Publish or export', 'Go live at /p/your-name, or download a self-contained HTML to host anywhere.'],
];

const FEATURES = [
  ['Visual editor + JSON', 'Edit labeled fields like a CMS, or drop to raw JSON. One source of truth, two ways to work.'],
  ['Projects-first profiles', 'Templates built for developers — projects, stack and impact up front, the way recruiters scan.'],
  ['Own your output', 'Export one self-contained HTML (CSS + data inlined). Opens offline; host it on any domain.'],
  ['Bilingual', 'Every field supports English + Telugu with an on-page language toggle.'],
  ['Publish by slug', 'Go live instantly at /p/your-name — your JSON resolves from the cloud, with a default fallback.'],
  ['Light / dark + palettes', 'Warm light, elegant dark, and secret colour palettes — your page, your vibe.'],
];

const USECASES = [
  ['Students', 'Show your projects and skills to land internships and first jobs — a real portfolio, no headache.'],
  ['Working professionals', 'A clean, always-current profile to share with recruiters, clients and your network.'],
  ['Freelancers', 'Pitch your services and past work, then export an HTML page for your own domain.'],
  ['Career switchers', 'Reframe your story around the role you want, with the right projects front and centre.'],
];

const FAQS = [
  ['Do I need to know how to code?', 'No. The visual editor gives you labeled fields for everything. The raw JSON is there if you want it, but it is optional.'],
  ['Where does my page actually live?', 'At /p/your-name on the platform — or export a self-contained HTML file and host it anywhere (GitHub Pages, Netlify, your own domain).'],
  ['Is it really free?', 'Yes — publish up to 10 pages free. Advanced is ₹100/year for 20 pages plus AI automation suggestions.'],
  ['Can I edit my page later?', 'Anytime. Log in (or use your edit key) at /edit/your-name, change the fields, and click Update to republish.'],
  ['Is my data locked in?', 'Never. Export your JSON or a self-contained HTML whenever you like — you fully own your content.'],
];

const SNIPPET = `{
  "person": {
    "name": "Aarav Mehta",
    "title": "Full-Stack Developer"
  },
  "sections": [
    { "type": "hero", "headline": "I ship products" },
    { "type": "projects",
      "items": ["TaskFlow", "StudyBuddy AI"] }
  ]
}`;

export default function Onboarding() {
  const [plans, setPlans] = useState(FALLBACK_PLANS);

  useEffect(() => {
    let alive = true;
    fetchPlans().then((p) => { if (alive && p) setPlans(p); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const priceLabel = (p) => (p.priceInr ? `₹${p.priceInr}/${p.billing === 'yearly' ? 'year' : p.billing}` : 'Free forever');

  return (
    <div className="onb">
      {/* Hero — dark developer terminal vibe */}
      <header className="onb-hero">
        <div className="container onb-hero-inner">
          <span className="onb-pill"><span className="dot" /> <span className="onb-mono">~/profilo</span> · live · free · no-code</span>
          <h1 className="display onb-title">
            Ship a stunning <span className="gradient-text">developer profile</span><br />
            from a single JSON.
          </h1>
          <p className="onb-lead">
            A no-code profile builder for developers, students and professionals. Edit labeled fields
            (or raw JSON), preview live, then <b>publish to a link</b> or <b>export a self-contained HTML</b>
            you own and host anywhere. Free to launch.
          </p>
          <div className="onb-cta">
            <Link className="btn btn-primary" to="/templates">Browse templates</Link>
            <Link className="btn btn-ghost" to="/preview">Open the editor</Link>
            <Link className="btn btn-ghost" to="/signup">Create account</Link>
          </div>

          {/* JSON ➜ rendered card showcase */}
          <div className="onb-showcase">
            <div className="onb-code">
              <div className="onb-code-bar"><i /><i /><i /></div>
              <pre>{SNIPPET}</pre>
            </div>
            <div className="onb-demo">
              <div className="onb-demo-top">
                <span className="onb-demo-avatar" />
                <div><b>Aarav Mehta</b><span>Full-Stack Developer</span></div>
              </div>
              <div className="onb-demo-tags"><span>React</span><span>Node.js</span><span>AWS</span><span>PostgreSQL</span></div>
              <p style={{ margin: 0, fontSize: '.86rem', color: '#c6c9ea' }}>I ship products end to end — TaskFlow, StudyBuddy AI and more.</p>
              <button className="onb-demo-btn">View work →</button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <Reveal className="onb-stats">
          {STATS.map(([n, label]) => (
            <div className="onb-stat" key={label}><b>{n}</b><span>{label}</span></div>
          ))}
        </Reveal>
      </section>

      {/* Roles marquee */}
      <div className="onb-marquee">
        <div className="onb-marquee-track">
          {[...ROLES, ...ROLES].map((r, i) => (
            <span className="onb-chip" key={i}>{r} developer</span>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="section container">
        <div className="onb-grid onb-mv">
          <Reveal className="glass onb-card" variant="left">
            <span className="eyebrow">Our mission</span>
            <h3>Put everyone's work online — free</h3>
            <p>To help every developer, student and professional publish a beautiful, credible profile in minutes — no code, and no paywall just to be seen.</p>
          </Reveal>
          <Reveal className="glass onb-card" variant="right" delay={120}>
            <span className="eyebrow">Our vision</span>
            <h3>A profile you truly own</h3>
            <p>A customizable, portable profile you control: edit it anytime, host it anywhere, never get locked in. Your work should speak for itself.</p>
          </Reveal>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section container">
        <Reveal><h2 className="display section-title" style={{ textAlign: 'center' }}>Who it's for</h2></Reveal>
        <p className="section-sub" style={{ textAlign: 'center' }}>One profile, many use-cases — all free and fully customizable.</p>
        <div className="onb-grid onb-features">
          {USECASES.map(([title, desc], i) => (
            <Reveal key={title} className="glass onb-card" variant="zoom" delay={i * 70}>
              <h3>{title}</h3><p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section container">
        <Reveal><h2 className="display section-title" style={{ textAlign: 'center' }}>How it works</h2></Reveal>
        <div className="onb-grid onb-steps">
          {STEPS.map(([n, title, desc], i) => (
            <Reveal key={n} className="glass onb-card" variant="zoom" delay={i * 70}>
              <span className="onb-step-num">{n}</span><h3>{title}</h3><p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section container">
        <Reveal><h2 className="display section-title" style={{ textAlign: 'center' }}>Built like a tool you'd actually use</h2></Reveal>
        <div className="onb-grid onb-features">
          {FEATURES.map(([title, desc], i) => (
            <Reveal key={title} className="glass onb-card" variant="zoom" delay={i * 60}>
              <h3>{title}</h3><p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="section container">
        <Reveal><h2 className="display section-title" style={{ textAlign: 'center' }}>Simple pricing</h2></Reveal>
        <p className="section-sub" style={{ textAlign: 'center' }}>Start free. Upgrade only if you need more pages and AI suggestions.</p>
        <div className="onb-grid onb-plans">
          {Object.values(plans).map((p, i) => (
            <Reveal key={p.id} className={`glass onb-plan ${p.id === 'advanced' ? 'onb-plan--featured' : ''}`} variant="zoom" delay={i * 90}>
              <h3 className="onb-plan-name">{p.label}</h3>
              <div className="onb-plan-price">{priceLabel(p)}</div>
              <ul className="onb-plan-list">
                <li>✓ Publish up to <b>{p.maxPages} pages</b></li>
                <li>✓ Visual editor + JSON</li>
                <li>✓ Self-contained HTML export</li>
                <li>{p.features?.aiSuggestions ? '✓' : '—'} AI automation suggestions</li>
              </ul>
              <Link className={`btn ${p.id === 'advanced' ? 'btn-primary' : 'btn-ghost'}`} to="/preview">
                {p.priceInr ? 'Go Advanced' : 'Start free'}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section container">
        <Reveal><h2 className="display section-title" style={{ textAlign: 'center' }}>Questions, answered</h2></Reveal>
        <div className="onb-faq">
          {FAQS.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section container" style={{ textAlign: 'center' }}>
        <Reveal>
          <h2 className="display section-title">Ready to build your page?</h2>
          <div className="onb-cta" style={{ justifyContent: 'center' }}>
            <Link className="btn btn-primary" to="/templates">Browse templates</Link>
            <Link className="btn btn-ghost" to="/preview">Open the editor</Link>
          </div>
          <p style={{ opacity: 0.6, marginTop: '1.5rem', fontSize: '.9rem' }}>© Profilo Designer</p>
        </Reveal>
      </section>
    </div>
  );
}
