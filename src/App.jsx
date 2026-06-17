import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import { pages } from './pages/pages.config.js';
import ProfileBySlug from './pages/ProfileBySlug.jsx';
import PreviewPage from './pages/PreviewPage.jsx';
import Onboarding from './pages/Onboarding.jsx';

// Render a manifest entry: a custom component (`element`) or a
// data-only page rendered through the shared SiteLayout.
function renderPage(p) {
  if (p.element) {
    const Page = p.element;
    return <Page />;
  }
  return <SiteLayout data={p.data} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {pages.flatMap((p) => {
          const urls = [p.path, ...(p.aliases || [])];
          const el = renderPage(p);
          return urls.map((url) => <Route key={url} path={url} element={el} />);
        })}
        {/* Platform landing / onboarding */}
        <Route path="/" element={<Onboarding />} />
        {/* Builder routes: live preview + published-profile-by-slug (API-driven) */}
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/p/:slug" element={<ProfileBySlug />} />
        <Route path="/p/:slug/:pageSlug" element={<ProfileBySlug />} />
        {/* Unknown URL -> home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
