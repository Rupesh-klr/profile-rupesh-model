import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DEV_OTP } from '../config/api.js';

/** Route "/signup" — create a builder account (OTP-gated, dev OTP 123123). */
export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '', otp: DEV_OTP });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    if (!/^[a-z0-9_.-]{3,30}$/.test(form.username.toLowerCase())) return 'Username: 3–30 chars (a–z, 0–9, dot, dash, underscore).';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    if (form.otp !== DEV_OTP) return `Invalid OTP. (Dev mode: the OTP is ${DEV_OTP})`;
    return '';
  }

  async function submit(e) {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setBusy(true);
    setError('');
    try {
      await signup({
        username: form.username.toLowerCase().trim(),
        password: form.password,
        otp: form.otp,
        email: form.email.trim(),
        name: form.name.trim(),
      });
      navigate('/preview', { replace: true });
    } catch (err) {
      setError(err.message || 'Sign up failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="onb">
      <div style={wrap}>
        <span className="eyebrow">Profilo · Builder</span>
        <h1 className="display" style={{ margin: '.3rem 0 1rem', fontSize: '2rem' }}>Create account</h1>

        <form className="glass" style={card} onSubmit={submit}>
          <div style={otpBanner}>
            🔐 Dev mode: we're out of SMS/email credits, so the verification OTP is <b>{DEV_OTP}</b> (pre-filled).
          </div>

          <label style={lbl}>Display name (optional)</label>
          <input style={input} value={form.name} onChange={set('name')} />
          <label style={lbl}>Username</label>
          <input style={input} value={form.username} onChange={set('username')} autoComplete="username" />
          <label style={lbl}>Email (optional — duplicates allowed)</label>
          <input style={input} type="email" value={form.email} onChange={set('email')} autoComplete="email" />
          <label style={lbl}>Password</label>
          <input style={input} type="password" value={form.password} onChange={set('password')} autoComplete="new-password" />
          <label style={lbl}>Confirm password</label>
          <input style={input} type="password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
          <label style={lbl}>OTP</label>
          <input style={input} value={form.otp} onChange={set('otp')} />

          {error && <div style={err}>{error}</div>}
          <button className="btn btn-primary" style={{ marginTop: '.9rem', width: '100%', opacity: busy ? 0.6 : 1 }}
            disabled={busy} type="submit">{busy ? 'Creating…' : 'Create account'}</button>

          <div style={{ marginTop: '.8rem', fontSize: 13, textAlign: 'center' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const wrap = { maxWidth: 440, margin: '0 auto', padding: '3rem 1.2rem' };
const card = { padding: '1.4rem', borderRadius: 18, display: 'flex', flexDirection: 'column' };
const lbl = { fontSize: 13, fontWeight: 600, margin: '.5rem 0 .25rem' };
const input = { padding: '.6rem .7rem', borderRadius: 8, border: '1px solid #ccc', fontSize: 14 };
const err = { background: '#fde8e8', color: '#9b1c1c', padding: '.5rem .8rem', borderRadius: 8, marginTop: '.7rem', fontSize: 14 };
const otpBanner = { background: '#fff7e6', border: '1px solid #f0d28a', color: '#7a5b00', padding: '.5rem .7rem', borderRadius: 8, fontSize: '.85rem', marginBottom: '.6rem' };
