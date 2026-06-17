import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DEV_OTP } from '../config/api.js';

/** Route "/login" — builder sign-in (isolated profile account). */
export default function Login() {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/preview';

  const [form, setForm] = useState({ username: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [showForgot, setShowForgot] = useState(false);
  const [forgot, setForgot] = useState({ username: '', otp: DEV_OTP, newPassword: '' });
  const [forgotMsg, setForgotMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.username.toLowerCase().trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function doForgot() {
    setForgotMsg('');
    try {
      await resetPassword(forgot.username.toLowerCase().trim(), forgot.otp, forgot.newPassword || undefined);
      setForgotMsg(`Password reset for "${forgot.username}". ${forgot.newPassword ? '' : `It is now ${DEV_OTP}. `}Sign in above.`);
    } catch (err) {
      setForgotMsg(err.message || 'Reset failed');
    }
  }

  return (
    <div className="onb">
      <div style={wrap}>
        <span className="eyebrow">Profilo · Builder</span>
        <h1 className="display" style={{ margin: '.3rem 0 1rem', fontSize: '2rem' }}>Sign in</h1>

        <form className="glass" style={card} onSubmit={submit}>
          <label style={lbl}>Username</label>
          <input style={input} autoFocus value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <label style={lbl}>Password</label>
          <input style={input} type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />

          {error && <div style={err}>{error}</div>}
          <button className="btn btn-primary" style={{ marginTop: '.9rem', width: '100%', opacity: busy ? 0.6 : 1 }}
            disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>

          <div style={row}>
            <button type="button" style={linkBtn} onClick={() => setShowForgot((s) => !s)}>Forgot password?</button>
            <span>No account? <Link to="/signup">Create one</Link></span>
          </div>
        </form>

        {showForgot && (
          <div className="glass" style={{ ...card, marginTop: '.8rem' }}>
            <div style={otpBanner}>🔐 Dev mode: out of credits — verification OTP is <b>{DEV_OTP}</b>.</div>
            <label style={lbl}>Username</label>
            <input style={input} value={forgot.username} onChange={(e) => setForgot({ ...forgot, username: e.target.value })} />
            <label style={lbl}>OTP</label>
            <input style={input} value={forgot.otp} onChange={(e) => setForgot({ ...forgot, otp: e.target.value })} />
            <label style={lbl}>New password (blank = {DEV_OTP})</label>
            <input style={input} type="password" value={forgot.newPassword} onChange={(e) => setForgot({ ...forgot, newPassword: e.target.value })} />
            {forgotMsg && <div style={note}>{forgotMsg}</div>}
            <button type="button" className="btn btn-ghost" style={{ marginTop: '.7rem' }} onClick={doForgot}>Reset password</button>
          </div>
        )}
      </div>
    </div>
  );
}

const wrap = { maxWidth: 440, margin: '0 auto', padding: '3rem 1.2rem' };
const card = { padding: '1.4rem', borderRadius: 18, display: 'flex', flexDirection: 'column' };
const lbl = { fontSize: 13, fontWeight: 600, margin: '.5rem 0 .25rem' };
const input = { padding: '.6rem .7rem', borderRadius: 8, border: '1px solid #ccc', fontSize: 14 };
const err = { background: '#fde8e8', color: '#9b1c1c', padding: '.5rem .8rem', borderRadius: 8, marginTop: '.7rem', fontSize: 14 };
const note = { background: '#e9f9ee', color: '#10643a', padding: '.5rem .8rem', borderRadius: 8, marginTop: '.6rem', fontSize: 14 };
const otpBanner = { background: '#fff7e6', border: '1px solid #f0d28a', color: '#7a5b00', padding: '.5rem .7rem', borderRadius: 8, fontSize: '.85rem', marginBottom: '.6rem' };
const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.5rem', marginTop: '.8rem', fontSize: 13, flexWrap: 'wrap' };
const linkBtn = { background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontSize: 13 };
