import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * "aisuggest" section — AI automation suggestions.
 * Gated by plan: SectionRenderer passes `locked` when the resolved plan does NOT
 * include features.aiSuggestions (i.e. Free). Locked shows an upgrade card;
 * unlocked (Advanced, or author/preview with no plan context) shows the full section.
 */
export default function AiSuggest({ section, locked }) {
  const { t } = useLanguage();

  if (locked) {
    return (
      <section id={section.id} className="section">
        <div className="container">
          <Reveal className="ai-locked glass" variant="zoom">
            <span className="ai-badge"><Icon name="spark" size={14} /> AI</span>
            <h3 className="display">{t(section.lockedTitle) || 'AI automation suggestions'}</h3>
            <p>{t(section.lockedText) || 'Upgrade to the Advanced plan to unlock AI-powered suggestions for your page.'}</p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className="section ai-section">
      <div className="container">
        <Reveal className="section-head">
          <span className="ai-badge"><Icon name="spark" size={14} /> {t(section.badge) || 'AI suggestions'}</span>
          <h2 className="display section-title">{t(section.heading)}</h2>
          {section.subheading && <p className="section-sub">{t(section.subheading)}</p>}
        </Reveal>

        <div className="ai-grid">
          {(section.items || []).map((it, i) => (
            <Reveal key={i} className="ai-card glass" variant="zoom" delay={i * 90}>
              <span className="ai-card-icon"><Icon name={it.icon || 'spark'} size={18} /></span>
              <h3>{t(it.title)}</h3>
              <p>{t(it.desc)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
