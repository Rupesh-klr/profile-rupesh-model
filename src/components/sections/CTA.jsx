import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

function diff(target) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

export default function CTA({ section, ui }) {
  const { t, lang } = useLanguage();
  const target = section.workshop?.targetIso ? new Date(section.workshop.targetIso).getTime() : null;
  const [time, setTime] = useState(() => (target ? diff(target) : null));

  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const labels =
    lang === 'te'
      ? { days: 'రోజులు', hours: 'గంటలు', minutes: 'నిమిషాలు', seconds: 'సెకన్లు' }
      : { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section id={section.id} className="section">
      <div className="container">
        <Reveal className="cta-band" variant="zoom">
          <h2>{t(section.heading)}</h2>
          <p>{t(section.subheading)}</p>

          {time && (
            <>
              <div className="countdown" aria-hidden="true">
                {['days', 'hours', 'minutes', 'seconds'].map((k) => (
                  <div className="cd-box" key={k}>
                    <div className="cd-num">{pad(time[k])}</div>
                    <div className="cd-label">{labels[k]}</div>
                  </div>
                ))}
              </div>
              <p style={{ marginBottom: '1.6rem', fontWeight: 600 }}>
                {t(section.workshop.label)}: {t(section.workshop.date)}
              </p>
            </>
          )}

          <a className="btn btn-on-dark" href={ui.registerUrl || '#hero'}>
            <Icon name="spark" size={18} /> {t(ui.cta)}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
