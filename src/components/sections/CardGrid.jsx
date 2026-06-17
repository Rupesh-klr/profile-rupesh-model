import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Generic, reusable grid of icon cards.
 * Drives the "Challenges", "Who it's for" and "Outcomes" sections —
 * same component, different data + `variant` styling.
 */
export default function CardGrid({ section }) {
  const { t } = useLanguage();
  const variant = section.variant || 'problems';

  return (
    <section id={section.id} className="section">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="display section-title">{t(section.heading)}</h2>
          {section.subheading && <p className="section-sub">{t(section.subheading)}</p>}
        </Reveal>

        <div className="card-grid">
          {section.items.map((item, i) => (
            <Reveal
              key={i}
              className={`feature-card glass variant-${variant}`}
              variant="zoom"
              delay={(i % 4) * 90}
            >
              <span className="fc-accent" />
              <span className="fc-icon">
                <Icon name={item.icon} size={26} />
              </span>
              <h3>{t(item.title)}</h3>
              <p>{t(item.desc)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
