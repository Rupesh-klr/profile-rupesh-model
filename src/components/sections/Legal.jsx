import Reveal from '../Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Long-form legal/policy page content (Terms, Privacy, Refund…).
 * Driven by JSON: title, updated date, intro, and a list of clauses
 * (each with a heading, paragraphs and/or a bullet list).
 */
export default function Legal({ section }) {
  const { t } = useLanguage();

  return (
    <section id={section.id} className="section legal-section">
      <div className="container">
        <Reveal className="legal">
          <h1 className="display legal-title">{t(section.title)}</h1>
          {section.updated && <p className="legal-updated">{t(section.updated)}</p>}
          {section.intro && <p className="legal-intro">{t(section.intro)}</p>}

          {section.clauses?.map((c, i) => (
            <div className="legal-clause" key={i}>
              {c.heading && <h2>{`${i + 1}. ${t(c.heading)}`}</h2>}
              {c.body?.map((p, j) => (
                <p key={j}>{t(p)}</p>
              ))}
              {c.list?.length > 0 && (
                <ul>
                  {c.list.map((li, k) => (
                    <li key={k}>{t(li)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {section.note && <p className="legal-note">{t(section.note)}</p>}
        </Reveal>
      </div>
    </section>
  );
}
