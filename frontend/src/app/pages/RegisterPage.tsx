import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { authApi } from '../../lib/api';
import { useTheme } from '../../lib/theme';
import {
  Heart, AlertCircle, CheckCircle, User, Lock, Mail, ArrowRight,
  HeartHandshake, Stethoscope, Shield, Sparkles, Sun, Moon, Brain, Activity
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [form, setForm] = useState({
    username: '', password: '', email: '', first_name: '', last_name: '',
    age: '', gender: 'male', specialization: '', experience: '', hospital: '', consulting_fees: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isDark = theme === 'dark';
  const V = '#7c3aed';
  const I = '#6366f1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const payload: any = {
      username: form.username, password: form.password, password2: form.password, email: form.email,
      first_name: form.first_name, last_name: form.last_name,
      age: parseInt(form.age) || 30, gender: form.gender, role,
    };
    if (role === 'doctor') {
      payload.specialization = form.specialization || 'Cardiologist';
      payload.experience = parseInt(form.experience) || 5;
      payload.hospital = form.hospital || 'General Hospital';
      payload.consulting_fees = parseFloat(form.consulting_fees) || 500;
    }
    try {
      await authApi.register(payload);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      const d = err.response?.data;
      const msg = typeof d === 'string' ? d : Object.values(d || {}).flat().join(' ');
      setError(msg || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  const inputStyle = (focused?: boolean): React.CSSProperties => ({
    width: '100%', padding: '10px 14px',
    background: isDark ? '#111111' : '#ffffff',
    border: `1.5px solid ${focused ? 'rgba(124,58,237,0.50)' : isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.10)'}`,
    boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.08)' : 'none',
    borderRadius: 10, color: 'var(--text-primary)',
    fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500,
    outline: 'none', transition: 'all 0.18s',
  });

  return (
    <div className="split-panel" style={{
      minHeight: '100vh',
      background: isDark ? '#000000' : '#f8fafc',
      display: 'flex', fontFamily: "'Inter', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Theme Toggle */}
      <div style={{ position: 'absolute', top: 22, right: 22, zIndex: 50 }}>
        <button
          id="register-theme-toggle"
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
        width: '40%', flexShrink: 0,
        background: `linear-gradient(160deg, #2d0b7a 0%, ${V} 45%, ${I} 100%)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '52px 52px', position: 'relative', overflow: 'hidden', color: '#fff',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-50px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

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

        {/* Copy */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 13px', borderRadius: 99,
            background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.20)',
            fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.90)',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 22,
          }}>
            <Sparkles style={{ width: 11, height: 11 }} />
            Free Registration
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 900, lineHeight: 1.08,
            letterSpacing: '-0.04em', color: '#fff', marginBottom: 18,
          }}>
            Start your cardiac<br />health journey.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 300 }}>
            Join thousands of patients and doctors using HeartCare AI for advanced cardiovascular diagnostics.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 32 }}>
            {[
              { icon: Brain,    label: 'AI-powered 98.5% accurate risk assessment' },
              { icon: Activity, label: 'Instant PDF diagnostic reports' },
              { icon: Stethoscope, label: 'Book cardiologist consultations instantly' },
              { icon: Shield,   label: 'Secure, HIPAA-compliant data storage' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Icon style={{ width: 12, height: 12, color: '#fff' }} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)', fontWeight: 500, lineHeight: 1.55 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 22, display: 'flex', alignItems: 'center', gap: 9 }}>
          <Shield style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.45)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Your data is private and encrypted. No spam, ever.</span>
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="split-panel-right" style={{
        flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '40px 32px', overflowY: 'auto', position: 'relative', zIndex: 1,
        background: isDark ? '#000000' : '#f8fafc',
      }}>
        <div className="anim-fade-up" style={{ width: '100%', maxWidth: 460, paddingBottom: 48, paddingTop: 8 }}>

          {/* Header */}
          <div style={{ marginBottom: 26 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 8 }}>
              Create your account
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: V, fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
            </p>
          </div>

          {/* Alerts */}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              <CheckCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
              Registration successful! Redirecting to login…
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div style={{
            display: 'flex',
            background: isDark ? '#0d0d0d' : '#f1f5f9',
            padding: 5, borderRadius: 14, marginBottom: 22,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}>
            {([
              { key: 'patient', label: 'Patient',              Icon: HeartHandshake },
              { key: 'doctor',  label: 'Doctor / Practitioner', Icon: Stethoscope },
            ] as const).map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                style={{
                  flex: 1, padding: '11px 10px', borderRadius: 10,
                  border: role === key ? `1.5px solid rgba(124,58,237,${isDark ? '0.30' : '0.18'})` : '1.5px solid transparent',
                  background: role === key ? (isDark ? '#161616' : '#fff') : 'transparent',
                  color: role === key ? V : 'var(--text-muted)',
                  fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
                  transition: 'all 0.20s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: role === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <Icon style={{ width: 14, height: 14 }} /> {label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div style={{
            background: isDark ? '#0d0d0d' : '#fff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            borderRadius: 20, padding: '26px 26px',
            boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.80)' : '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="John" required className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Doe" required className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <User style={{ width: 9, height: 9 }} /> Username
                </label>
                <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="johndoe" required className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Mail style={{ width: 9, height: 9 }} /> Email Address
                </label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required className="form-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input type="number" min="1" max="120" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="35" required className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Lock style={{ width: 9, height: 9 }} /> Password
                </label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required className="form-input" />
              </div>

              {/* Doctor-specific */}
              {role === 'doctor' && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 14,
                  borderTop: `1.5px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  paddingTop: 18, marginTop: 4,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Stethoscope style={{ width: 12, height: 12, color: V }} />
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: V, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Professional Credentials
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <input type="text" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Cardiologist" required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (Years)</label>
                      <input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="8" required className="form-input" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 13 }}>
                    <div className="form-group">
                      <label className="form-label">Hospital / Clinic</label>
                      <input type="text" value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} placeholder="Mayo Clinic" required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Consultation Fees (₹)</label>
                      <input type="number" value={form.consulting_fees} onChange={e => setForm({ ...form, consulting_fees: e.target.value })} placeholder="800" required className="form-input" />
                    </div>
                  </div>
                </div>
              )}

              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading || success}
                style={{
                  width: '100%', padding: '13px', marginTop: 4,
                  fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700,
                  background: loading || success ? 'rgba(124,58,237,0.60)' : `linear-gradient(135deg, ${V}, ${I})`,
                  border: 'none', borderRadius: 10, color: '#fff',
                  cursor: loading || success ? 'not-allowed' : 'pointer',
                  transition: 'all 0.20s',
                  boxShadow: loading || success ? 'none' : '0 4px 16px rgba(124,58,237,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={(e) => { if (!loading && !success) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.40)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = loading || success ? 'none' : '0 4px 16px rgba(124,58,237,0.28)'; }}
              >
                {loading ? (
                  <><div className="spinner spinner-white" style={{ width: 14, height: 14 }} />Registering…</>
                ) : (
                  <>Create {role === 'patient' ? 'Patient' : 'Doctor'} Account <ArrowRight style={{ width: 14, height: 14 }} /></>
                )}
              </button>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/" style={{ fontSize: 12.5, color: 'var(--text-faint)', textDecoration: 'none', fontWeight: 500 }}>
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
