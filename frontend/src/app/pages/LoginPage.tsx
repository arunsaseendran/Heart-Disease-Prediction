import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../lib/theme';
import {
  Heart, AlertCircle, CheckCircle, Lock, User, ArrowRight,
  Shield, Sparkles, Sun, Moon, Activity, Brain, Zap
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.username, form.password);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 900);
    } catch (err: any) {
      const d = err.response?.data;
      const msg = typeof d === 'string' ? d : Object.values(d || {}).flat().join(' ');
      setError(msg || 'Invalid username or password.');
    } finally { setLoading(false); }
  };

  const V = '#7c3aed';
  const I = '#6366f1';

  return (
    <div className="split-panel" style={{
      minHeight: '100vh',
      background: isDark ? '#000000' : '#f8fafc',
      display: 'flex',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Theme Toggle */}
      <div style={{ position: 'absolute', top: 22, right: 22, zIndex: 50 }}>
        <button
          id="login-theme-toggle"
          onClick={toggleTheme}
          style={{
            width: 34, height: 34, borderRadius: 8,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.80)',
            color: 'var(--text-muted)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.18s', outline: 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = V; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.30)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'; }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun style={{ width: 14, height: 14 }} /> : <Moon style={{ width: 14, height: 14 }} />}
        </button>
      </div>

      {/* ══ LEFT PANEL ══ */}
      <div className="split-panel-left" style={{
        width: '42%',
        background: `linear-gradient(145deg, #3b0f8c 0%, ${V} 40%, ${I} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 52px',
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        flexShrink: 0,
      }}>
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '52px 52px', pointerEvents: 'none',
        }} />
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '8%', left: '-60px', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-30px', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart style={{ width: 18, height: 18, color: '#fff', fill: 'rgba(255,255,255,0.28)' }} className="anim-heartbeat" />
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em', color: '#fff' }}>
              HeartCare <span style={{ opacity: 0.65 }}>AI</span>
            </span>
          </Link>
        </div>

        {/* Main copy */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 13px', borderRadius: 99,
            background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.20)',
            fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.90)',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 22,
          }}>
            <Sparkles style={{ width: 11, height: 11 }} />
            Welcome Back
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 900, lineHeight: 1.08,
            letterSpacing: '-0.04em', color: '#fff', marginBottom: 18,
          }}>
            Access your<br />cardiac dashboard.
          </h1>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 310 }}>
            Sign in to view your risk assessments, AI-powered diagnostics, and connect with medical professionals.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
            {[
              { icon: Brain,    label: '7-Model ML Ensemble Analysis' },
              { icon: Activity, label: 'Real-time Cardiac Monitoring' },
              { icon: Shield,   label: 'HIPAA-Compliant & Encrypted' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 13, height: 13, color: '#fff' }} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 22, display: 'flex', alignItems: 'center', gap: 9 }}>
          <Shield style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.45)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
            Your data is private and encrypted. No spam, ever.
          </span>
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="split-panel-right" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', overflowY: 'auto', position: 'relative', zIndex: 1,
        background: isDark ? '#000000' : '#f8fafc',
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute', top: '10%', right: '10%',
          width: 320, height: 320, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="anim-fade-up" style={{ width: '100%', maxWidth: 380 }}>
          {/* Header */}
          <div style={{ marginBottom: 30 }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em',
              color: 'var(--text-primary)', marginBottom: 8,
            }}>
              Sign in to your account
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>
              New to HeartCare?{' '}
              <Link to="/register" style={{ color: V, fontWeight: 700, textDecoration: 'none' }}>
                Create an account
              </Link>
            </p>
          </div>

          {/* Alerts */}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              <CheckCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
              Login successful! Redirecting…
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Username */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <User style={{ width: 10, height: 10 }} /> Username
              </label>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${focusedField === 'username' ? 'rgba(124,58,237,0.50)' : 'var(--border-medium)'}`,
                boxShadow: focusedField === 'username' ? '0 0 0 3px rgba(124,58,237,0.08)' : 'none',
                transition: 'all 0.18s',
                background: 'var(--bg-input)',
                display: 'flex', alignItems: 'center',
              }}>
                <User style={{ width: 14, height: 14, color: 'var(--text-faint)', position: 'absolute', left: 13, flexShrink: 0 }} />
                <input
                  id="login-username"
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                  style={{
                    width: '100%', padding: '11px 14px 11px 36px',
                    background: 'transparent', border: 'none',
                    color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5, fontWeight: 500, outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 0 }}>
                  <Lock style={{ width: 10, height: 10 }} /> Password
                </label>
                <a href="#" style={{ fontSize: 11.5, color: V, textDecoration: 'none', fontWeight: 700 }}>
                  Forgot password?
                </a>
              </div>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${focusedField === 'password' ? 'rgba(124,58,237,0.50)' : 'var(--border-medium)'}`,
                boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(124,58,237,0.08)' : 'none',
                transition: 'all 0.18s',
                background: 'var(--bg-input)',
                display: 'flex', alignItems: 'center',
              }}>
                <Lock style={{ width: 14, height: 14, color: 'var(--text-faint)', position: 'absolute', left: 13 }} />
                <input
                  id="login-password"
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '11px 14px 11px 36px',
                    background: 'transparent', border: 'none',
                    color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5, fontWeight: 500, outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading || success}
              style={{
                width: '100%', padding: '13px', marginTop: 4,
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700,
                background: loading || success ? 'rgba(124,58,237,0.60)' : `linear-gradient(135deg, ${V}, ${I})`,
                border: 'none', borderRadius: 'var(--radius-md)', color: '#fff',
                cursor: loading || success ? 'not-allowed' : 'pointer',
                transition: 'all 0.20s',
                boxShadow: loading || success ? 'none' : '0 4px 16px rgba(124,58,237,0.30)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.40)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = loading || success ? 'none' : '0 4px 16px rgba(124,58,237,0.30)';
              }}
            >
              {loading ? (
                <>
                  <div className="spinner spinner-white" style={{ width: 14, height: 14 }} />
                  Signing in…
                </>
              ) : success ? (
                <>
                  <CheckCircle style={{ width: 15, height: 15 }} />
                  Redirecting…
                </>
              ) : (
                <>
                  Sign In <ArrowRight style={{ width: 15, height: 15 }} />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Link to="/" style={{ fontSize: 12, color: 'var(--text-faint)', textDecoration: 'none', fontWeight: 500 }}>
                ← Back to Home
              </Link>
            </div>
          </form>

          {/* Trust indicators */}
          <div style={{
            marginTop: 28, padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Shield style={{ width: 12, height: 12, color: '#10b981' }} />
            <span style={{ fontSize: 11.5, color: 'var(--text-faint)', fontWeight: 500 }}>
              256-bit encrypted · HIPAA compliant · Secure session
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
