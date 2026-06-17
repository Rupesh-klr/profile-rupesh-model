import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Testimonials({ section }) {
  const { t } = useLanguage();

  return (
    <section id={section.id} className="section">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="display section-title">{t(section.heading)}</h2>
          {section.subheading && <p className="section-sub">{t(section.subheading)}</p>}
        </Reveal>

        <div className="testi-grid">
          {section.items.map((item, i) => (
            <Reveal key={i} className="testi-card glass" variant="zoom" delay={i * 110}>
              <span className="quote-mark">&ldquo;</span>
              <div className="testi-stars" aria-label={`${item.rating || 5} / 5`}>
                {Array.from({ length: item.rating || 5 }).map((_, s) => (
                  <Icon key={s} name="star" size={16} />
                ))}
              </div>
              <p className="testi-quote">{t(item.quote)}</p>
              <p className="testi-author">— {t(item.author)}</p>
            </Reveal>
          ))}
        </div>

        {section.note && <p className="testi-note">{t(section.note)}</p>}
      </div>
    </section>
  );
}
