import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { asset } from '../../utils/asset.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Curriculum({ section }) {
  const { t } = useLanguage();

  return (
    <section id={section.id} className="section">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="display section-title">{t(section.heading)}</h2>
          {section.subheading && <p className="section-sub">{t(section.subheading)}</p>}
        </Reveal>

        <div className="curriculum-grid">
          {section.modules.map((m, i) => (
            <Reveal key={i} className="module-card glass" delay={i * 120}>
              <div className="module-media">
                <img src={asset(m.image)} alt={t(m.title)} loading="lazy" />
                <span className="module-tag">{t(m.tag)}</span>
              </div>
              <div className="module-body">
                <h3>{t(m.title)}</h3>
                <ul className="module-points">
                  {m.points.map((p, j) => (
                    <li key={j}>
                      <span className="tick">
                        <Icon name="check" size={13} strokeWidth={2.4} />
                      </span>
                      {t(p)}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
