import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import { fetchProfile, resolveDoc } from '../config/api.js';
import defaultTemplate from '../data/default-template.json';

/**
 * Route "/p/:slug" (and "/p/:slug/:pageSlug").
 * Fetches the published JSON for a slug from the API and renders it.
 * Two-tier fallback (as specified): API returns the default template when the
 * slug has no published profile; a network failure also falls back to the
 * bundled default template — so a visitor always sees a page.
 */
export default function ProfileBySlug() {
  const { slug, pageSlug } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProfile(slug, pageSlug)
      .then((payload) => {
        if (!alive) return;
        const resolved = resolveDoc(payload) || defaultTemplate;
        // Carry the plan's feature flags so plan-gated sections (AI) render correctly.
        if (payload && !payload.isDefault && payload.features) resolved.__features = payload.features;
        setDoc(resolved);
      })
      .catch(() => {
        if (alive) setDoc(defaultTemplate);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug, pageSlug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', opacity: 0.7 }}>
        Loading “{slug}”…
      </div>
    );
  }
  return <SiteLayout data={doc} />;
}
