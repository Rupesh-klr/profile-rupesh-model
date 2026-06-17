/**
 * Lightweight inline SVG icon set. Reference by name from JSON (e.g. "icon": "heart").
 * stroke = currentColor so icons inherit text/accent colours and theme.
 */
const paths = {
  // hero highlights
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  language: <><path d="M4 5h7M9 3v2c0 4-2 7-5 9" /><path d="M5 9c0 3 3 5 6 6" /><path d="M12 20l4-9 4 9M14.5 16h5" /></>,
  video: <><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-3v10l-6-3" /></>,

  // feature / outcome icons
  seed: <><path d="M12 21c-4 0-7-3-7-7 0-2 1-4 3-6 2 3 4 4 4 7M12 21c4 0 7-3 7-7 0-2-1-4-3-6-2 3-4 4-4 7M12 21v-7" /></>,
  balance: <><path d="M12 3v18M5 21h14" /><path d="M12 6 5 9m7-3 7 3" /><path d="M2.5 13a2.5 3 0 0 0 5 0L5 9zM16.5 13a2.5 3 0 0 0 5 0L19 9z" /></>,
  report: <><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  heart: <><path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3 1 4 2.5 1-1.5 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20z" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  drained: <><circle cx="12" cy="12" r="9" /><path d="M8 9h.01M16 9h.01M8.5 16c1-1.2 5-1.2 7 0" transform="rotate(180 12 14.5)" /></>,
  question: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.7-2.5 2-2.5 3.5M12 17h.01" /></>,
  couple: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path d="M3 20c0-3 2.5-5 5-5s5 2 5 5M13 20c0-3 2.5-5 5-5s3 1.5 3 3" /></>,
  missing: <><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /></>,
  lotus: <><path d="M12 20c-5 0-8-3-8-6 2-1 4-1 5 0 0-3 1-6 3-8 2 2 3 5 3 8 1-1 3-1 5 0 0 3-3 6-8 6z" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /><circle cx="12" cy="12" r="2.5" /></>,
  link: <><path d="M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1" /><path d="M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1" /></>,

  // utility
  check: <><path d="m4 12 5 5L20 6" /></>,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  arrowUp: <><path d="M12 19V5M6 11l6-6 6 6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></>,
  moon: <><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" /></>,
  star: <><path d="M12 3.5 14.6 9l6 .6-4.5 4 1.3 5.9L12 16.6 6.6 19.5 7.9 13.6 3.4 9.6l6-.6z" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  website: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  facebook: <><path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5v4h3v8h4v-8h3l1-4h-4V7.5a1 1 0 0 1 1-1h2z" /></>,
  whatsapp: <><path d="M3 21l1.6-4.6A8 8 0 1 1 7.6 19.4z" /><path d="M9 8.5c0 4 2.5 6.5 6.5 6.5.8 0 1.3-1 .9-1.6l-1.2-1.2-1.8.7-1.8-1.8.7-1.8-1.2-1.2c-.6-.4-1.6 0-1.6.9z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
  link2: <><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></>,
};

const FILLED = new Set(['facebook', 'star']);

export default function Icon({ name, size = 24, className = '', strokeWidth = 1.7, ...rest }) {
  const content = paths[name];
  if (!content) return null;
  const filled = FILLED.has(name);
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {content}
    </svg>
  );
}
