/**
 * ============================================================
 *  PAGES MANIFEST — the single place to register routes.
 *
 *  The whole site is generated from this list, so adding a new
 *  page for any person is quick and scalable.
 *
 *  Each entry is ONE of:
 *    • { path, element }  -> renders a custom page component
 *                            (use when a page needs its own component)
 *    • { path, data }     -> renders <SiteLayout data={data} />
 *                            (the EASY way: just point at a JSON file)
 *
 *  Optional: `aliases: ['/other-url']` adds extra URLs for the page.
 *            `title` is metadata (menus/docs), not required.
 *
 *  The route URL = the data file name, e.g.
 *    /vedika-raksha-womb-rest-weekly-webniar
 *    /vedika-raksha-emotional-balance   (future)
 * ============================================================
 */

import ProfilePage from './ProfilePage.jsx';
import WombResetWebinarPage from './WombResetWebinarPage.jsx';

// Data-only pages (rendered through SiteLayout — no component file needed).
import empowermentWorkshop from '../data/vedika-raksha-new-page.json';

// Legal pages are simple JSON-driven pages (no component file needed).
import termsConditions from '../data/vedika-raksha-profile-terms-conditions.json';
import privacyPolicy from '../data/vedika-raksha-profile-privacy-policy.json';
import refundCancellation from '../data/vedika-raksha-profile-refund-cancellation.json';

export const pages = [
  {
    // Live demo profile. "/" is the platform onboarding page (see App.jsx).
    path: '/vedika-raksha-profile',
    aliases: ['/demo'],
    element: ProfilePage,
    title: "Vedika Raksha — Women's Empowerment Coach & Wellness Mentor",
  },
  {
    // 2nd workshop — Women's Empowerment (the main, current workshop).
    path: '/vedika-raksha-new-page',
    aliases: ['/vedika-raksha-empowerment-workshop'],
    data: empowermentWorkshop,
    title: "Women's Empowerment Workshop — Vedika Raksha",
  },
  {
    // Kept reachable by direct link; not featured in the empowerment home nav.
    path: '/vedika-raksha-womb-rest-weekly-webniar',
    element: WombResetWebinarPage,
    title: 'Womb Reset Weekly Workshop — Vedika Raksha',
  },

  // --- Legal / policy pages (data-only) ---
  {
    path: '/vedika-raksha-profile-terms-conditions',
    aliases: ['/vedika-raksha-profile-term-condtion'],
    data: termsConditions,
    title: 'Terms & Conditions — Vedika Raksha',
  },
  {
    path: '/vedika-raksha-profile-privacy-policy',
    aliases: ['/vedika-raksha-profile-policy-private'],
    data: privacyPolicy,
    title: 'Privacy Policy — Vedika Raksha',
  },
  {
    path: '/vedika-raksha-profile-refund-cancellation',
    aliases: ['/vedika-raksha-profile-refund', '/vedika-raksha-profile-refundfucntion'],
    data: refundCancellation,
    title: 'Refund & Cancellation — Vedika Raksha',
  },

  // ---------------------------------------------------------------
  // ADD A NEW PAGE — 2 easy steps (no component file needed):
  //   1) Create src/data/vedika-raksha-emotional-balance.json
  //      (copy an existing JSON and edit the content)
  //   2) import it above, then uncomment this line:
  //
  // { path: '/vedika-raksha-emotional-balance', data: emotionalBalance,
  //   title: 'Emotional Balance — Vedika Raksha' },
  //
  // (Prefer a dedicated component? Make src/pages/MyPage.jsx like
  //  WombResetWebinarPage.jsx and use `element: MyPage` instead.)
  // ---------------------------------------------------------------
];
