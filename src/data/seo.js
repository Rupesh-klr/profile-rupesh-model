/**
 * ============================================================
 *  SEO — centralized page metadata + JSON-LD structured data.
 *
 *  This is the Vite-SPA equivalent of the Next.js `metadata` /
 *  structured-data pattern. Nothing here is Next-specific: the
 *  <Seo> component (src/components/Seo.jsx) reads these objects
 *  and injects them into <head> for the active route.
 *
 *  ⤵ ONE thing to set for production:
 *      SITE_URL  →  your real domain (drives every canonical,
 *                   og:url and JSON-LD @id/url below).
 * ============================================================
 */

import empowermentWorkshop from './vedika-raksha-new-page.json';
import wombWorkshop from './vedika-raksha-womb-rest-weekly-webniar.json';

// 🔧 Production domain (Hostinger). Change this one line if it ever moves.
export const SITE_URL = 'https://holistichealervedika.com';

const C = 'https://schema.org';
const abs = (path = '/') => `${SITE_URL}${path}`;
const OG_IMAGE = abs('/images/vedika-raksha-profile.jpg');
const LOGO = abs('/images/favicon.svg');
// pick the English string out of a bilingual { en, te } field
const en = (v) => (v && typeof v === 'object' ? v.en : v);

export const SITE = {
  name: 'Vedika Raksha Empowerment Academy',
  founder: 'Vedika Raksha',
  jobTitle: "Women's Empowerment Coach & Wellness Mentor",
  email: 'rvvedikaraksha@gmail.com',
  phone: '+918074540299',
  phoneDisplay: '+91 80745 40299',
  url: abs('/'),
  ogImage: OG_IMAGE,
  logo: LOGO,
  sameAs: [
    'https://www.instagram.com/rvvedikaraksha',
    'https://www.facebook.com/rvvedikaraksha',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'KY Residency, Block C, Bachupally',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500090',
    addressCountry: 'IN',
  },
  areaServed: ['IN', 'Worldwide'],
  priceRange: '₹₹',
  inLanguage: ['en', 'te'],
};

/* ---------------- JSON-LD node builders ---------------- */

const organization = () => ({
  '@context': C,
  '@type': 'EducationalOrganization',
  '@id': abs('/#organization'),
  name: SITE.name,
  url: SITE.url,
  logo: { '@type': 'ImageObject', url: SITE.logo },
  image: SITE.ogImage,
  email: SITE.email,
  telephone: SITE.phone,
  address: SITE.address,
  areaServed: SITE.areaServed,
  founder: { '@id': abs('/#vedika') },
  sameAs: SITE.sameAs,
});

const person = () => ({
  '@context': C,
  '@type': 'Person',
  '@id': abs('/#vedika'),
  name: SITE.founder,
  alternateName: 'RV Vedika Raksha',
  jobTitle: SITE.jobTitle,
  description:
    "Women's empowerment coach and wellness mentor helping women rebuild confidence, transform their mindset, and rise into independent, purpose-driven lives.",
  url: SITE.url,
  image: SITE.ogImage,
  email: SITE.email,
  telephone: SITE.phone,
  address: SITE.address,
  knowsLanguage: ['Telugu', 'English', 'Hindi'],
  worksFor: { '@id': abs('/#organization') },
  sameAs: SITE.sameAs,
});

const website = () => ({
  '@context': C,
  '@type': 'WebSite',
  '@id': abs('/#website'),
  url: SITE.url,
  name: SITE.name,
  inLanguage: SITE.inLanguage,
  publisher: { '@id': abs('/#organization') },
});

const professionalService = () => ({
  '@context': C,
  '@type': 'ProfessionalService',
  '@id': abs('/#service'),
  name: SITE.name,
  url: SITE.url,
  image: SITE.ogImage,
  description:
    "Women's empowerment coaching, mentoring and emotional wellbeing support — confidence, mindset and personal-growth programs for women.",
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: SITE.priceRange,
  address: SITE.address,
  areaServed: SITE.areaServed,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  founder: { '@id': abs('/#vedika') },
  sameAs: SITE.sameAs,
});

const breadcrumb = (items) => ({
  '@context': C,
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

// Build a FAQPage from a page JSON's `faq` section (English text only).
const faqPage = (data) => {
  const sec = data.sections?.find((s) => s.type === 'faq');
  if (!sec?.items?.length) return null;
  return {
    '@context': C,
    '@type': 'FAQPage',
    '@id': `${SITE_URL}#faq`,
    mainEntity: sec.items.map((q) => ({
      '@type': 'Question',
      name: en(q.q),
      acceptedAnswer: { '@type': 'Answer', text: en(q.a) },
    })),
  };
};

// Build an EducationalEvent for a free live workshop page.
const workshopEvent = (data, path, name) => {
  const w = data.sections?.find((s) => s.type === 'cta')?.workshop;
  return {
    '@context': C,
    '@type': 'EducationalEvent',
    '@id': abs(`${path}#event`),
    name,
    description: en(data.person?.tagline),
    ...(w?.targetIso ? { startDate: w.targetIso } : {}),
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'VirtualLocation', url: abs(path) },
    inLanguage: 'te',
    image: SITE.ogImage,
    organizer: { '@id': abs('/#organization') },
    performer: { '@id': abs('/#vedika') },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: abs(path),
      validFrom: w?.targetIso,
    },
  };
};

/* ---------------- per-page meta helpers ---------------- */

const og = (title, description, type, path) => ({
  title,
  description,
  type,
  url: abs(path),
  image: SITE.ogImage,
  siteName: SITE.name,
});
const tw = (title, description) => ({
  card: 'summary_large_image',
  title,
  description,
  image: SITE.ogImage,
});

const HOME_TITLE = "Vedika Raksha — Women's Empowerment Coach & Wellness Mentor";
const HOME_DESC =
  "Vedika Raksha helps women rediscover their confidence, purpose and power to create a fulfilling, independent life — women's empowerment coaching, mindset and emotional wellbeing support in Telugu and English.";
const EMP_TITLE = "Free Women's Empowerment Workshop — Vedika Raksha";
const EMP_DESC =
  "Join Vedika Raksha's free live women's empowerment workshop — rebuild confidence, find clarity and rise as an independent, empowered woman. Live on Zoom, in Telugu.";
const WOMB_TITLE = 'Womb Reset Weekly Workshop — Vedika Raksha';
const WOMB_DESC = en(wombWorkshop.person?.tagline);

/* ---------------- the per-route SEO map ---------------- */
// Keyed by each JSON's `meta.page`.

export const seoByPage = {
  profile: {
    meta: {
      title: HOME_TITLE,
      description: HOME_DESC,
      keywords: [
        'Vedika Raksha',
        "Women's Empowerment Coach",
        'Confidence Coach',
        'Mindset Coach',
        'Wellness Mentor',
        'Personal Growth',
        'Emotional Wellbeing',
        'Women Empowerment Telugu',
      ],
      canonical: abs('/'),
      og: og(HOME_TITLE, HOME_DESC, 'website', '/'),
      twitter: tw(HOME_TITLE, HOME_DESC),
    },
    jsonLd: [
      organization(),
      person(),
      website(),
      professionalService(),
      breadcrumb([{ name: 'Home', path: '/' }]),
    ],
  },

  'empowerment-workshop': {
    meta: {
      title: EMP_TITLE,
      description: EMP_DESC,
      keywords: [
        "Women's Empowerment Workshop",
        'Free Confidence Workshop',
        'Mindset Workshop for Women',
        'Vedika Raksha Workshop',
        'Telugu Women Empowerment',
        'Emotional Wellbeing Workshop',
      ],
      canonical: abs('/vedika-raksha-new-page'),
      og: og(EMP_TITLE, EMP_DESC, 'website', '/vedika-raksha-new-page'),
      twitter: tw(EMP_TITLE, EMP_DESC),
    },
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: "Women's Empowerment Workshop", path: '/vedika-raksha-new-page' },
      ]),
      workshopEvent(empowermentWorkshop, '/vedika-raksha-new-page', "Women's Empowerment Workshop"),
      faqPage(empowermentWorkshop),
      organization(),
      person(),
    ].filter(Boolean),
  },

  'womb-rest-workshop': {
    meta: {
      title: WOMB_TITLE,
      description: WOMB_DESC,
      keywords: [
        'Womb Reset Workshop',
        'Fertility Workshop',
        'Womb Healing',
        'Emotional Healing Fertility',
        'Vedika Raksha',
      ],
      canonical: abs('/vedika-raksha-womb-rest-weekly-webniar'),
      og: og(WOMB_TITLE, WOMB_DESC, 'website', '/vedika-raksha-womb-rest-weekly-webniar'),
      twitter: tw(WOMB_TITLE, WOMB_DESC),
    },
    jsonLd: [
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Womb Reset Workshop', path: '/vedika-raksha-womb-rest-weekly-webniar' },
      ]),
      workshopEvent(wombWorkshop, '/vedika-raksha-womb-rest-weekly-webniar', 'Womb Reset Weekly Workshop'),
      faqPage(wombWorkshop),
    ].filter(Boolean),
  },

  'terms-conditions': {
    meta: {
      title: 'Terms & Conditions — Vedika Raksha',
      description:
        'Terms & Conditions for Vedika Raksha Empowerment Academy — coaching, mentoring and workshops for women.',
      canonical: abs('/vedika-raksha-profile-terms-conditions'),
      og: og('Terms & Conditions — Vedika Raksha', 'Terms & Conditions for Vedika Raksha Empowerment Academy.', 'website', '/vedika-raksha-profile-terms-conditions'),
      twitter: tw('Terms & Conditions — Vedika Raksha', 'Terms & Conditions for Vedika Raksha Empowerment Academy.'),
    },
    jsonLd: [
      website(),
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Terms & Conditions', path: '/vedika-raksha-profile-terms-conditions' },
      ]),
    ],
  },

  'privacy-policy': {
    meta: {
      title: 'Privacy Policy — Vedika Raksha',
      description:
        'How Vedika Raksha Empowerment Academy collects, uses and protects your information.',
      canonical: abs('/vedika-raksha-profile-privacy-policy'),
      og: og('Privacy Policy — Vedika Raksha', 'How Vedika Raksha Empowerment Academy handles your data.', 'website', '/vedika-raksha-profile-privacy-policy'),
      twitter: tw('Privacy Policy — Vedika Raksha', 'How Vedika Raksha Empowerment Academy handles your data.'),
    },
    jsonLd: [
      website(),
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/vedika-raksha-profile-privacy-policy' },
      ]),
    ],
  },

  'refund-cancellation': {
    meta: {
      title: 'Refund & Cancellation — Vedika Raksha',
      description:
        'Refund and cancellation policy for Vedika Raksha Empowerment Academy paid programs and sessions.',
      canonical: abs('/vedika-raksha-profile-refund-cancellation'),
      og: og('Refund & Cancellation — Vedika Raksha', 'Refund and cancellation policy for Vedika Raksha Empowerment Academy.', 'website', '/vedika-raksha-profile-refund-cancellation'),
      twitter: tw('Refund & Cancellation — Vedika Raksha', 'Refund and cancellation policy for Vedika Raksha Empowerment Academy.'),
    },
    jsonLd: [
      website(),
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Refund & Cancellation', path: '/vedika-raksha-profile-refund-cancellation' },
      ]),
    ],
  },
};

/**
 * Resolve the SEO bundle for a page's data object. Falls back to a
 * minimal title/description derived from `person` when a page isn't
 * mapped above (Seo then uses the current URL as canonical).
 */
export function getSeoForData(data) {
  const key = data?.meta?.page;
  if (key && seoByPage[key]) return seoByPage[key];

  const name = en(data?.person?.name);
  const role = en(data?.person?.title);
  const title = name ? (role ? `${name} — ${role}` : name) : SITE.name;
  const description = en(data?.person?.tagline) || HOME_DESC;
  return {
    meta: { title, description, canonical: null, og: null, twitter: null },
    jsonLd: [organization(), person(), website()],
  };
}
