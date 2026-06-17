import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * A flexible statement block — used for "Our Concept", "Mission", "Vision"
 * and any single-idea section. Optional: number, icon, eyebrow, body[], points[].
 * `reverse: true` flips the layout for visual rhythm when stacked.
 */
export default function Statement({ section }) {
  const { t } = useLanguage();

  return (
    <section id={section.id} className="section section--statement">
      <div className="container">
        <Reveal className={`statement glass ${section.reverse ? 'reverse' : ''}`} variant="zoom">
          <div className="statement-aside">
            {section.number && <span className="statement-num">{section.number}</span>}
            <span className="statement-icon">
              <Icon name={section.icon || 'spark'} size={32} />
            </span>
            {section.eyebrow && <span className="eyebrow">{t(section.eyebrow)}</span>}
          </div>

          <div className="statement-main">
            <h2 className="display statement-heading">{t(section.heading)}</h2>
            {section.body?.map((p, i) => (
              <p key={i} className="statement-body">
                {t(p)}
              </p>
            ))}
            {section.points?.length > 0 && (
              <ul className="statement-points">
                {section.points.map((pt, i) => (
                  <li key={i}>
                    <span className="tick">
                      <Icon name="check" size={13} strokeWidth={2.4} />
                    </span>
                    {t(pt)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
