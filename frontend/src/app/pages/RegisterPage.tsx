import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { authApi } from '../../lib/api';
import { useTheme } from '../../lib/theme';
import { Heart, AlertCircle, CheckCircle, User, Lock, Mail, ArrowRight, HeartHandshake, Stethoscope, Shield, Sparkles, Sun, Moon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [form, setForm] = useState({
    username: '', password: '', email: '', first_name: '', last_name: '', age: '', gender: 'M',
    specialization: '', experience: '', hospital: '', consulting_fees: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);

    const payload: any = {
      username: form.username,
      password: form.password,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      age: parseInt(form.age) || 30,
      gender: form.gender,
      role: role
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

  const isPatient = role === 'patient';

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
        position: 'fixed', top: '-10%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', left: '-5%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: '40%',
        background: 'linear-gradient(160deg, #7c3aed 0%, #5b21b6 50%, #06b6d4 100%)',
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
            Free Registration
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.04em', color: '#fff', marginBottom: 16
          }}>
            Start your cardiac<br />health journey.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.68)', lineHeight: 1.7, maxWidth: 300 }}>
            Join thousands of patients and doctors using HeartCare AI for advanced cardiovascular diagnostics.
          </p>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32 }}>
            {[
              { label: 'AI-powered 98.5% accurate risk assessment' },
              { label: 'Instant PDF diagnostic reports' },
              { label: 'Book cardiologist consultations in seconds' },
              { label: 'Secure, HIPAA-compliant data storage' },
            ].map(({ label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1
                }}>
                  <span style={{ fontSize: 10, color: '#fff', fontWeight: 800 }}>✓</span>
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: 500, lineHeight: 1.5 }}>{label}</span>
              </div>
            ))}
          </div>
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 32px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="anim-fade-up" style={{ width: '100%', maxWidth: 460, paddingBottom: 40 }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em',
              color: 'var(--text-primary)', marginBottom: 8
            }}>Create your account</h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#7c3aed', fontWeight: 700, textDecoration: 'none' }}>
                Sign in →
              </Link>
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
            display: 'flex', background: 'var(--bg-layer1)', padding: 5,
            borderRadius: 14, marginBottom: 24,
            border: '1px solid var(--border-subtle)'
          }}>
            {([
              { key: 'patient', label: 'Patient', Icon: HeartHandshake },
              { key: 'doctor', label: 'Doctor / Practitioner', Icon: Stethoscope },
            ] as const).map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                style={{
                  flex: 1, padding: '11px 12px', borderRadius: 10,
                  border: role === key ? '1.5px solid rgba(124,58,237,0.2)' : '1.5px solid transparent',
                  background: role === key ? 'var(--bg-card-solid)' : 'transparent',
                  color: role === key ? '#7c3aed' : 'var(--text-muted)',
                  fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: role === key ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <Icon style={{ width: 15, height: 15 }} /> {label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 20,
            padding: '28px 28px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="form-input" placeholder="John" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className="form-input" placeholder="Doe" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User style={{ width: 11, height: 11, display: 'inline', marginRight: 5 }} />
                  Username
                </label>
                <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="form-input" placeholder="johndoe" required />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail style={{ width: 11, height: 11, display: 'inline', marginRight: 5 }} />
                  Email Address
                </label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="john@example.com" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input type="number" min="1" max="120" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="form-input" placeholder="35" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock style={{ width: 11, height: 11, display: 'inline', marginRight: 5 }} />
                  Password
                </label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" placeholder="••••••••" required />
              </div>

              {/* Doctor-specific fields */}
              {role === 'doctor' && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 14,
                  borderTop: '1.5px solid rgba(0,0,0,0.06)', paddingTop: 18, marginTop: 4
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Stethoscope style={{ width: 13, height: 13, color: '#7c3aed' }} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Professional Credentials
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <input type="text" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="form-input" placeholder="Cardiologist" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (Years)</label>
                      <input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="form-input" placeholder="8" required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Hospital / Clinic</label>
                      <input type="text" value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} className="form-input" placeholder="Mayo Clinic" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Consultation Fees (₹)</label>
                      <input type="number" value={form.consulting_fees} onChange={e => setForm({ ...form, consulting_fees: e.target.value })} className="form-input" placeholder="800" required />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="btn btn-primary btn-full"
                style={{ padding: '13px', fontSize: 14, marginTop: 6 }}
              >
                {loading ? (
                  <><div className="spinner spinner-white" />Registering Account…</>
                ) : (
                  <>Create {isPatient ? 'Patient' : 'Doctor'} Account <ArrowRight style={{ width: 15, height: 15 }} /></>
                )}
              </button>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <Link to="/" style={{ fontSize: 12.5, color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}>
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
