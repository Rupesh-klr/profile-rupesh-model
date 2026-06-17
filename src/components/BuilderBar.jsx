import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Floating login/logout bar for the builder UI pages (home, templates, preview,
 * edit). Hidden on published profiles (/p/:slug) and the data-driven pages,
 * which have their own navigation.
 */
const SHOW_ON = ['/', '/templates', '/preview'];

export default function BuilderBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const show = SHOW_ON.includes(pathname) || pathname.startsWith('/edit/');
  if (!show) return null;

  return (
    <div style={bar}>
      {isAuthenticated ? (
        <>
          <span style={who}>👤 {user?.name || user?.username}</span>
          <button style={btn} onClick={logout}>Log out</button>
        </>
      ) : (
        <>
          <Link style={ghost} to="/login">Log in</Link>
          <Link style={btn} to="/signup">Sign up</Link>
        </>
      )}
    </div>
  );
}

const bar = {
  position: 'fixed', top: 14, right: 14, zIndex: 9998,
  display: 'flex', alignItems: 'center', gap: '.5rem',
  background: 'rgba(27,19,34,.9)', color: '#fff',
  padding: '.35rem .45rem', borderRadius: 999,
  boxShadow: '0 8px 30px rgba(0,0,0,.25)', backdropFilter: 'blur(8px)',
};
const who = { fontSize: 13, padding: '0 .4rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const btn = { padding: '.4rem .8rem', borderRadius: 999, border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer', fontSize: 13, textDecoration: 'none' };
const ghost = { padding: '.4rem .8rem', borderRadius: 999, border: '1px solid rgba(255,255,255,.4)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 13, textDecoration: 'none' };
