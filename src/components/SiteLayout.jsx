import { useEffect } from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollTop from './ScrollTop.jsx';
import SectionRenderer from './SectionRenderer.jsx';
import Seo from './Seo.jsx';
import { getSeoForData } from '../data/seo.js';

/**
 * Renders a complete profile site from a single data object (one JSON file).
 * Both the Profile page and the Webinar page reuse this — they only differ in
 * the `data` they pass in. This is what makes the template reusable.
 */
export default function SiteLayout({ data, features }) {
  const { person, nav, ui, sections, footer } = data;
  // Plan features for gating (e.g. the AI section). May come as a prop, be
  // attached to the resolved doc by ProfileBySlug, or live in meta.
  const feats = features || data.__features || data.meta?.features || null;

  // Each route starts at the top; <Seo> owns the title + head metadata.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  return (
    <>
      <Seo seo={getSeoForData(data)} />
      <Navbar data={nav} ui={ui} />

      <main>
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} person={person} ui={ui} features={feats} />
        ))}
      </main>

      <Footer footer={footer} person={person} nav={nav} />
      <ScrollTop ui={ui} />
    </>
  );
}
