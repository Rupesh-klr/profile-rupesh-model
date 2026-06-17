import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { asset } from '../../utils/asset.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function About({ section, person }) {
  const { t } = useLanguage();
  const img = person.images?.[1] || person.images?.[0];

  return (
    <section id={section.id} className="section">
      <div className="container about-grid">
        <Reveal className="about-media" variant="left">
          <div className="about-img">
            {img && <img src={asset(img.src)} alt={t(img.alt)} loading="lazy" />}
          </div>
        </Reveal>

        <Reveal className="about-text" variant="right">
          <p className="about-greeting">{t(section.greeting)}</p>
          <h2 className="display about-heading">{t(section.heading)}</h2>

          {section.paragraphs.map((p, i) => (
            <p key={i}>{t(p)}</p>
          ))}

          <ul className="about-creds">
            {section.credentials.map((c, i) => (
              <li key={i}>
                <span className="check">
                  <Icon name="checkCircle" size={22} />
                </span>
                {t(c)}
              </li>
            ))}
          </ul>

          {section.mission && (
            <div className="mission-card glass">
              <h4>{t(section.mission.title)}</h4>
              <p>{t(section.mission.text)}</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
