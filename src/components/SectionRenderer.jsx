import Hero from './sections/Hero.jsx';
import Stats from './sections/Stats.jsx';
import CardGrid from './sections/CardGrid.jsx';
import Curriculum from './sections/Curriculum.jsx';
import About from './sections/About.jsx';
import Testimonials from './sections/Testimonials.jsx';
import FAQ from './sections/FAQ.jsx';
import CTA from './sections/CTA.jsx';
import Contact from './sections/Contact.jsx';
import Team from './sections/Team.jsx';
import Legal from './sections/Legal.jsx';
import Statement from './sections/Statement.jsx';
import AiSuggest from './sections/AiSuggest.jsx';

/**
 * Maps a section `type` (from profile.json) to its component.
 * To add a new kind of section: build a component and register it here —
 * the JSON drives ordering and content, this drives rendering.
 */
const registry = {
  hero: Hero,
  stats: Stats,
  cardgrid: CardGrid,
  curriculum: Curriculum,
  about: About,
  testimonials: Testimonials,
  faq: FAQ,
  cta: CTA,
  contact: Contact,
  team: Team,
  legal: Legal,
  statement: Statement,
  aisuggest: AiSuggest,
};

export default function SectionRenderer({ section, person, ui, features }) {
  const Component = registry[section.type];
  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`[Profilo] No component registered for section type "${section.type}" (id: ${section.id}).`);
    }
    return null;
  }
  // Plan-gated AI section: locked on Free (features present but aiSuggestions=false).
  // When no plan context exists (author/preview), it shows unlocked.
  if (section.type === 'aisuggest') {
    const enabled = features ? !!features.aiSuggestions : true;
    return <AiSuggest section={section} locked={!enabled} />;
  }
  return <Component section={section} person={person} ui={ui} />;
}
