import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { asset } from '../../utils/asset.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Hero({ section, person, ui }) {
  const { t } = useLanguage();
  const portrait = person.images?.[0];

  return (
    <header id="hero" className={`hero hero--${section.variant || '1'}`}>
      <span className="hero-glow g1" />
      <span className="hero-glow g2" />
      <span className="hero-glow g3" />

      <div className="container hero-grid">
        {/* Left: copy */}
        <div>
          <Reveal variant="left">
            <span className="eyebrow">
              <Icon name="spark" size={15} /> {t(section.attention)}
            </span>
          </Reveal>

          <Reveal variant="left" delay={80}>
            <h1 className="display hero-headline">
              {t(section.headline)}
            </h1>
          </Reveal>

          <Reveal variant="left" delay={160}>
            <span className="hero-accent gradient-text">{t(section.headlineAccent)}</span>
          </Reveal>

          <Reveal variant="left" delay={220}>
            <p className="hero-desc">{t(section.description)}</p>
          </Reveal>

          <Reveal variant="left" delay={300}>
            <div className="hero-cta-row">
              <a className="btn btn-primary" href="#cta">
                {t(ui.cta)}
              </a>
              <a className="btn btn-ghost" href="#about">
                {t(ui.ctaSecondary)}
              </a>
            </div>
          </Reveal>

          <div className="hero-highlights">
            {section.highlights.map((h, i) => (
              <Reveal key={i} className="hl-item glass" delay={360 + i * 80}>
                <span className="hl-icon">
                  <Icon name={h.icon} size={20} />
                </span>
                <span>
                  <span className="hl-label">{t(h.label)}</span>
                  <br />
                  <span className="hl-value">{t(h.value)}</span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right: portrait */}
        <Reveal variant="right" className="hero-portrait" delay={150}>
          <span className="portrait-ring" />
          <div className="portrait-frame">
            {portrait && <img src={asset(portrait.src)} alt={t(portrait.alt)} fetchpriority="high" />}
          </div>
          <div className="portrait-badge glass-strong">
            <span className="dot" />
            {t(person.primaryLanguage)}
          </div>
          <div className="portrait-name glass-strong">
            <strong>{t(person.name)}</strong>
            <span>{t(person.title)}</span>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
