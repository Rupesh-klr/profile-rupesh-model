import SiteLayout from '../components/SiteLayout.jsx';
import profile from '../data/vedika-raksha-profile.json';

// Home route "/" — Vedika Raksha's personal/professional profile.
export default function ProfilePage() {
  return <SiteLayout data={profile} />;
}
