import { useState } from 'react';
import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function FAQ({ section }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);

  return (
    <section id={section.id} className="section">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="display section-title">{t(section.heading)}</h2>
        </Reveal>

        <div className="faq-wrap">
          {section.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} className={`faq-item ${isOpen ? 'open' : ''}`} delay={i * 60}>
                <button
                  className="faq-q"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span>{t(item.q)}</span>
                  <span className="faq-icon">
                    <Icon name="plus" size={16} strokeWidth={2.4} />
                  </span>
                </button>
                <div className="faq-a">
                  <div className="faq-a-inner">
                    <p>{t(item.a)}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
