import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Contact section — shows reachable details (email, phone, location…) as cards,
 * plus the social links. `items` come from JSON; `href` (mailto:/tel:/https) is
 * optional and makes a card clickable.
 */
export default function Contact({ section, person }) {
  const { t } = useLanguage();

  return (
    <section id={section.id} className="section">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="display section-title">{t(section.heading)}</h2>
          {section.subheading && <p className="section-sub">{t(section.subheading)}</p>}
        </Reveal>

        <div className="card-grid">
          {section.items.map((item, i) => {
            const value = t(item.value);
            const href = item.href ? t(item.href) : null;
            return (
              <Reveal
                key={i}
                className="feature-card glass variant-audience"
                variant="zoom"
                delay={(i % 4) * 90}
              >
                <span className="fc-accent" />
                <span className="fc-icon">
                  <Icon name={item.icon} size={26} />
                </span>
                <h3>{t(item.label)}</h3>
                {href ? (
                  <p>
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      {value}
                    </a>
                  </p>
                ) : (
                  <p>{value}</p>
                )}
              </Reveal>
            );
          })}
        </div>

        {person?.social?.length > 0 && (
          <Reveal className="social-row" style={{ justifyContent: 'center', marginTop: '1.6rem' }}>
            {person.social.map((s, i) => (
              <a
                key={`${s.id}-${i}`}
                className="social-btn"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <Icon name={s.id} size={18} />
                {s.handle}
              </a>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
