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
};

export default function SectionRenderer({ section, person, ui }) {
  const Component = registry[section.type];
  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`[Profilo] No component registered for section type "${section.type}" (id: ${section.id}).`);
    }
    return null;
  }
  return <Component section={section} person={person} ui={ui} />;
}
