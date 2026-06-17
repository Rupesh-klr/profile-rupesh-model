/**
 * Secret colour-palette switcher.
 *
 * The active palette is chosen by a NUMBER (1–8) you pass in the URL:
 *     https://yoursite.com/?p=3
 *     https://yoursite.com/?palette=3
 *
 * 1 = default (Rose · Plum)        5 = Emerald
 * 2 = Green · Pink                 6 = Teal · Cyan
 * 3 = Royal Blue                   7 = Violet · Purple
 * 4 = Red · Crimson                8 = Amber · Sunset
 *
 * The choice is remembered in localStorage, so once you open ?p=3 the site
 * keeps that palette until you pass a different number. There is no UI for it —
 * only someone who knows the number can switch it. The colours are applied by
 * setting data-palette on <html>; the actual colours live in styles/palettes.css.
 */
const KEY = 'vr-palette';
const VALID = /^[1-8]$/;

export function applyPalette() {
  if (typeof window === 'undefined') return '1';

  let p = null;
  try {
    const params = new URLSearchParams(window.location.search);
    p = params.get('p') || params.get('palette');
  } catch {
    p = null;
  }

  if (p && VALID.test(p)) {
    window.localStorage.setItem(KEY, p);
  } else {
    p = window.localStorage.getItem(KEY);
  }

  if (!p || !VALID.test(p)) p = '1';

  document.documentElement.setAttribute('data-palette', p);
  return p;
}
