import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../lib/theme';
import { Heart, AlertCircle, CheckCircle, Lock, User, ArrowRight, Shield, Sparkles, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.username, form.password);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      const d = err.response?.data;
      const msg = typeof d === 'string' ? d : Object.values(d || {}).flat().join(' ');
      setError(msg || 'Invalid username or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Theme Toggle Floating Button */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 50 }}>
        <button 
          onClick={toggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1.5px solid var(--border-subtle)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            outline: 'none',
          }}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-layer2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-card)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {theme === 'light' ? <Moon style={{ width: 16, height: 16 }} /> : <Sun style={{ width: 16, height: 16 }} />}
        </button>
      </div>

      {/* Ambient blobs */}
      <div style={{
        position: 'fixed', top: '-10%', left: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-5%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* ── LEFT PANEL ── */}
      <div className="auth-left" style={{
        width: '40%',
        background: 'linear-gradient(145deg, var(--brand-purple) 0%, var(--brand-purple-dark) 55%, var(--brand-cyan) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 48px',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        color: '#fff'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '-50px', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px', pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 13,
              border: '1.5px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Heart style={{ width: 19, height: 19, color: '#fff', fill: 'rgba(255,255,255,0.25)' }} className="anim-heartbeat" />
            </div>
            <span style={{ fontWeight: 850, fontSize: 19, letterSpacing: '-0.03em', color: '#fff' }}>
              HeartCare <span style={{ color: 'rgba(255,255,255,0.65)' }}>AI</span>
            </span>
          </Link>
        </div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 13px', borderRadius: 99,
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.22)',
            fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20
          }}>
            <Sparkles style={{ width: 11, height: 11 }} />
            Welcome Back
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.04em', color: '#fff', marginBottom: 16
          }}>
            Access your cardiac<br />dashboard.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.68)', lineHeight: 1.7, maxWidth: 300 }}>
            Sign in to view your risk assessments, predictive models, and connect with medical professionals instantly.
          </p>
        </div>

        {/* Bottom note */}
        <div style={{
          position: 'relative', zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 22,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <Shield style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.5)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            Your data is always private and encrypted. No spam, ever.
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="anim-fade-up" style={{ width: '100%', maxWidth: 380 }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em',
              color: 'var(--text-primary)', marginBottom: 8
            }}>Sign in to your account</h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
              New to HeartCare?{' '}
              <Link to="/register" style={{ color: 'var(--brand-purple)', fontWeight: 700, textDecoration: 'none' }}>
                Create an account
              </Link>
            </p>
          </div>

          {/* Alerts */}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              <CheckCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
              Login successful! Redirecting...
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">
                <User style={{ width: 11, height: 11, display: 'inline', marginRight: 5 }} />
                Username
              </label>
              <input 
                type="text" 
                value={form.username} 
                onChange={e => setForm({ ...form, username: e.target.value })} 
                className="form-input" 
                placeholder="johndoe" 
                required 
                autoComplete="username" 
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  <Lock style={{ width: 11, height: 11, display: 'inline', marginRight: 5 }} />
                  Password
                </label>
                <a href="#" style={{ fontSize: 11.5, color: 'var(--brand-purple)', textDecoration: 'none', fontWeight: 700 }}>
                  Forgot password?
                </a>
              </div>
              <input 
                type="password" 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                className="form-input" 
                placeholder="••••••••" 
                required 
                autoComplete="current-password" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || success} 
              className="btn-primary"
              style={{ padding: '12px', fontSize: 14, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}
            >
              {loading ? (
                <><div className="spinner-white" style={{ width: 14, height: 14, borderRightColor: 'transparent', borderRadius: '50%', borderStyle: 'solid', borderWidth: 2, animation: 'spin 1s linear infinite' }} />Signing in…</>
              ) : (
                <>Sign In <ArrowRight style={{ width: 15, height: 15 }} /></>
              )}
            </button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/" style={{ fontSize: 12, color: 'var(--text-faint)', textDecoration: 'none', fontWeight: 500 }}>
                ← Back to Home
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
