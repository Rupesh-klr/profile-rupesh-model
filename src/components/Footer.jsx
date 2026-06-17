import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Footer({ footer, person, nav }) {
  const { t } = useLanguage();
  const legalLinks = footer?.legalLinks || [];

  return (
    <footer className="footer">
      <div className="container">
        <Reveal className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <span className="brand-mark">
                <Icon name="lotus" size={22} />
              </span>
              {t(nav.brand)}
            </Link>
            {person.address && (
              <p className="footer-address">
                <Icon name="pin" size={15} />
                {t(person.address)}
              </p>
            )}
          </div>

          <div className="social-row">
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
          </div>
        </Reveal>

        {legalLinks.length > 0 && (
          <nav className="footer-legal" aria-label="Legal">
            {legalLinks.map((l, i) => (
              <Link key={i} to={l.route}>
                {t(l.label)}
              </Link>
            ))}
          </nav>
        )}

        <div className="footer-disclaimer">
          <p>{t(footer.disclaimer)}</p>
          <p className="copyright">{t(footer.copyright)}</p>
        </div>
      </div>
    </footer>
  );
}
