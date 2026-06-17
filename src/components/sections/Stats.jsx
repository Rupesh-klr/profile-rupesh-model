import Reveal from '../Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useCountUp } from '../../hooks/useCountUp.js';

function StatCard({ item, delay }) {
  const { t } = useLanguage();
  const [ref, display] = useCountUp(item.value);
  return (
    <Reveal className="stat-card glass" delay={delay}>
      <div className="stat-number" ref={ref}>
        {display}
        {item.suffix || ''}
      </div>
      <div className="stat-label">{t(item.label)}</div>
    </Reveal>
  );
}

export default function Stats({ section }) {
  return (
    <section id={section.id} className="section">
      <div className="container">
        <div className="stats-wrap">
          {section.items.map((item, i) => (
            <StatCard key={i} item={item} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
