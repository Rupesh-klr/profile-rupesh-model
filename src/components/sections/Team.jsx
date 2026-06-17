import { useState } from 'react';
import Icon from '../Icon.jsx';
import Reveal from '../Reveal.jsx';
import { asset } from '../../utils/asset.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

function MemberCard({ member, delay, moreLabel, lessLabel }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <Reveal className="team-card glass" variant="zoom" delay={delay}>
      <div className="team-photo">
        {member.image && <img src={asset(member.image)} alt={t(member.name)} loading="lazy" />}
      </div>
      <div className="team-body">
        <h3>{t(member.name)}</h3>
        <p className="team-role">{t(member.role)}</p>

        {member.basics?.length > 0 && (
          <ul className="team-basics">
            {member.basics.map((b, i) => (
              <li key={i}>
                {b.icon && <Icon name={b.icon} size={15} />}
                {t(b)}
              </li>
            ))}
          </ul>
        )}

        {member.summary && <p className="team-summary">{t(member.summary)}</p>}

        {member.details && (
          <>
            <div className={`team-details ${open ? 'open' : ''}`}>
              <div className="team-details-inner">
                <p>{t(member.details)}</p>
              </div>
            </div>
            <button className="team-more" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
              {open ? t(lessLabel) || 'Show less' : t(moreLabel) || 'See more details'}
              <Icon name={open ? 'arrowUp' : 'plus'} size={15} strokeWidth={2.2} />
            </button>
          </>
        )}

        {member.social?.length > 0 && (
          <div className="team-social">
            {member.social.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <Icon name={s.id} size={16} />
              </a>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default function Team({ section }) {
  const { t } = useLanguage();

  return (
    <section id={section.id} className={`section team-section team--${section.variant || '1'}`}>
      <div className="container">
        <Reveal className="section-head">
          <h2 className="display section-title">{t(section.heading)}</h2>
          {section.subheading && <p className="section-sub">{t(section.subheading)}</p>}
        </Reveal>

        <div className="team-grid">
          {section.members.map((m, i) => (
            <MemberCard
              key={i}
              member={m}
              delay={i * 110}
              moreLabel={section.moreLabel}
              lessLabel={section.lessLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
