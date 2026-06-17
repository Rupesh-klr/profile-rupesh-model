import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ScrollTop({ ui }) {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`scroll-top ${show ? 'show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t(ui.scrollTop)}
      title={t(ui.scrollTop)}
    >
      <Icon name="arrowUp" size={22} />
    </button>
  );
}
