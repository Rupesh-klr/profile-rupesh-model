import { useEffect } from 'react';
import { SITE } from '../data/seo.js';

/**
 * Injects per-route SEO into <head>: title, description, keywords,
 * canonical, Open Graph + Twitter cards, and JSON-LD structured data.
 *
 * Meta/link tags are upserted (found-or-created), so navigating between
 * routes updates them in place — no duplicates. JSON-LD scripts are
 * tagged and fully replaced on each route change.
 *
 * Note (SPA caveat): social scrapers (Facebook/WhatsApp/X) don't run JS,
 * so they read the STATIC tags in index.html. The values here keep things
 * correct for Google (which renders JS) and for in-app navigation.
 */
function upsertMeta(attr, key, content) {
  if (content == null || content === '') return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ seo }) {
  useEffect(() => {
    if (!seo) return;
    const { meta = {}, jsonLd = [] } = seo;
    const canonical = meta.canonical || window.location.origin + window.location.pathname;

    if (meta.title) document.title = meta.title;
    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'keywords', meta.keywords?.join(', '));
    upsertLink('canonical', canonical);

    const og = meta.og || {};
    upsertMeta('property', 'og:type', og.type || 'website');
    upsertMeta('property', 'og:title', og.title || meta.title);
    upsertMeta('property', 'og:description', og.description || meta.description);
    upsertMeta('property', 'og:url', og.url || canonical);
    upsertMeta('property', 'og:image', og.image || SITE.ogImage);
    upsertMeta('property', 'og:site_name', og.siteName || SITE.name);
    upsertMeta('property', 'og:locale', 'en_US');

    const twitter = meta.twitter || {};
    upsertMeta('name', 'twitter:card', twitter.card || 'summary_large_image');
    upsertMeta('name', 'twitter:title', twitter.title || meta.title);
    upsertMeta('name', 'twitter:description', twitter.description || meta.description);
    upsertMeta('name', 'twitter:image', twitter.image || SITE.ogImage);

    // JSON-LD: clear ours, then (re)inject for this route.
    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
    jsonLd.forEach((obj) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-seo-jsonld', '');
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
    });

    return () => {
      document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
    };
  }, [seo]);

  return null;
}
