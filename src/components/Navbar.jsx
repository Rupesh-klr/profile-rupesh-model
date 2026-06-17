import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

// A nav entry is either an in-page anchor (has `id`) or a cross-page
// route link (has `route`, e.g. "/webinar").
function NavItem({ link, t, onClick }) {
  if (link.route) {
    return (
      <Link to={link.route} onClick={onClick}>
        {t(link.label)}
      </Link>
    );
  }
  return (
    <a href={`#${link.id}`} onClick={onClick}>
      {t(link.label)}
    </a>
  );
}

export default function Navbar({ data, ui }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="nav-brand" onClick={close}>
          <span className="brand-mark">
            <Icon name="lotus" size={22} />
          </span>
          {t(data.brand)}
        </Link>

        <div className="nav-links">
          {data.links.map((l) => (
            <NavItem key={l.id} link={l} t={t} />
          ))}
        </div>

        <div className="nav-actions">
          {/* language toggle */}
          <div className="pill-toggle" role="group" aria-label="Language">
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
            <button
              className={lang === 'te' ? 'active' : ''}
              onClick={() => setLang('te')}
              aria-pressed={lang === 'te'}
              lang="te"
            >
              తె
            </button>
          </div>

          {/* theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t(ui.themeLight) : t(ui.themeDark)}
            title={theme === 'dark' ? t(ui.themeLight) : t(ui.themeDark)}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>

          {t(ui.cta) && (
            <a className="btn btn-primary nav-cta-btn" href="#cta">
              {t(ui.cta)}
            </a>
          )}

          <button
            className="nav-toggle-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div className="container">
        <div className={`mobile-menu glass ${menuOpen ? 'open' : 'closed'}`}>
          {data.links.map((l) => (
            <NavItem key={l.id} link={l} t={t} onClick={close} />
          ))}
          {t(ui.cta) && (
            <a href="#cta" className="btn btn-primary" onClick={close} style={{ marginTop: '0.4rem' }}>
              {t(ui.cta)}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
