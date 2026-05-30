import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../lib/theme';
import {
  Heart, ArrowRight, Brain, Shield, Activity, FileText,
  Calendar, Award, CheckCircle, Sliders, Sparkles, Stethoscope,
  Sun, Moon, ChevronDown, Star, Zap, Lock
} from 'lucide-react';

const V = '#7c3aed'; // Violet primary
const I = '#6366f1'; // Indigo accent

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const isDark = theme === 'dark';

  /* ── Section theming ── */
  const sectionBorder = isDark ? 'rgba(124,58,237,0.10)' : 'rgba(99,102,241,0.08)';

  /* ── Live Estimator State ── */
  const [age, setAge] = useState(45);
  const [chestPain, setChestPain] = useState(1);
  const [maxHr, setMaxHr] = useState(150);
  const [stDep, setStDep] = useState(1.2);
  const [simulatedRisk, setSimulatedRisk] = useState(24.5);

  useEffect(() => {
    let base = 10;
    if (age > 60) base += 25; else if (age > 45) base += 12;
    if (chestPain === 3) base += 35; else if (chestPain === 0) base += 5; else base += 15;
    if (maxHr < 120) base += 20; else if (maxHr < 145) base += 10;
    base += stDep * 12;
    setSimulatedRisk(parseFloat(Math.min(Math.max(base, 5.2), 98.4).toFixed(1)));
  }, [age, chestPain, maxHr, stDep]);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    { q: "How accurate is the HeartCare AI risk prediction?", a: "Our ensemble model runs 7 state-of-the-art machine learning algorithms (including Random Forest, SVM, and XGBoost) in parallel, achieving a peak validation accuracy of 98.5% on standard clinical datasets." },
    { q: "Is my medical and personal data secure?", a: "Absolutely. HeartCare AI is built with HIPAA-compliant architecture. All communication is encrypted via TLS 1.3, and patient health records are secured with AES-256 encryption at rest." },
    { q: "Can I download and share my AI assessment report?", a: "Yes! Every assessment automatically generates a comprehensive, printable PDF medical report containing algorithm metrics, detailed risk factors, lifestyle advice, and tailored guidelines." },
    { q: "How do I consult with a specialist?", a: "Once you view your assessment report, you can instantly schedule a consultation using our built-in Doctor Appointments system to connect with certified cardiologists on our platform." },
  ];

  /* ── Shared styles ── */
  const navBg = isDark ? 'rgba(0,0,0,0.88)' : 'rgba(255,255,255,0.92)';
  const sectionAlt = isDark ? '#040408' : '#f5f7ff';

  const riskColor = simulatedRisk > 50 ? '#f43f5e' : simulatedRisk > 25 ? '#f59e0b' : '#10b981';
  const riskLabel = simulatedRisk > 50 ? 'High Risk' : simulatedRisk > 25 ? 'Moderate Risk' : 'Low Risk';

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#000000' : '#ffffff', fontFamily: "'Inter', sans-serif", color: 'var(--text-primary)' }}>

      {/* ══ NAVBAR ══ */}
      <nav className="landing-nav" style={{
        background: navBg,
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderBottom: `1px solid ${sectionBorder}`,
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: isDark ? '0 1px 0 rgba(124,58,237,0.08), 0 4px 24px rgba(0,0,0,0.60)' : '0 1px 0 rgba(99,102,241,0.06), 0 2px 12px rgba(99,102,241,0.04)',
      }}>
        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${V}, ${I})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(124,58,237,0.32)',
          }} className="anim-heartbeat">
            <Heart style={{ width: 17, height: 17, color: '#fff', fill: 'rgba(255,255,255,0.25)' }} />
          </div>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            HeartCare <span style={{ background: `linear-gradient(90deg, ${V}, ${I})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className="nav-links" style={{ display: 'flex', flex: 1, justifyContent: 'center', gap: 4 }}>
          {[
            { l: 'Features', h: '#features' },
            { l: 'AI Estimator', h: '#estimator' },
            { l: 'How It Works', h: '#workflow' },
            { l: 'Specialists', h: '#doctors' },
            { l: 'FAQ', h: '#faq' },
          ].map((item) => (
            <a key={item.l} href={item.h} style={{
              padding: '7px 14px', fontSize: 13.5, fontWeight: 600,
              color: 'var(--text-muted)', textDecoration: 'none', borderRadius: 8,
              transition: 'all 0.18s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = V; e.currentTarget.style.background = isDark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >{item.l}</a>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            id="landing-theme-toggle"
            onClick={toggleTheme}
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              background: 'transparent', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.18s', outline: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = V; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.30)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'; }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
          </button>

          <button
            id="landing-signin-btn"
            className="desktop-only"
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 18px', fontSize: 13, fontWeight: 700,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
              borderRadius: 8, background: 'transparent', color: 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.18s', fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.30)'; e.currentTarget.style.color = V; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Sign In
          </button>

          <button
            id="landing-register-btn"
            className="desktop-only"
            onClick={() => navigate('/register')}
            style={{
              padding: '9px 20px', fontSize: 13, fontWeight: 700,
              background: `linear-gradient(135deg, ${V}, ${I})`,
              border: 'none', borderRadius: 8, color: '#fff',
              cursor: 'pointer', transition: 'all 0.18s',
              boxShadow: '0 4px 14px rgba(124,58,237,0.30)',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(124,58,237,0.40)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.30)'; }}
          >
            Get Started <ArrowRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="grid-hero" style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 48px 100px', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 48, alignItems: 'center' }}>
        <div className="anim-fade-up">
          {/* Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 14px', borderRadius: 99,
            background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.07)',
            border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.18)'}`,
            fontSize: 11.5, fontWeight: 700, color: V,
            marginBottom: 24, letterSpacing: '0.03em',
          }}>
            <Sparkles style={{ width: 11, height: 11 }} />
            98.5% Clinical Prediction Accuracy
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(38px, 4.5vw, 60px)',
            fontWeight: 900, lineHeight: 1.04,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            marginBottom: 22,
          }}>
            Precision Cardiology<br />
            Powered by{' '}
            <span className="text-gradient-purple">AI.</span>
          </h1>

          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 34, maxWidth: 520 }}>
            Predict cardiovascular disease risk instantly using an advanced ensemble of 7 machine learning models. Built with clinical experts, supporting patients and doctors globally.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
            <button
              id="hero-cta-primary"
              onClick={() => navigate('/register')}
              style={{
                padding: '14px 28px', fontSize: 15, fontWeight: 700,
                background: `linear-gradient(135deg, ${V}, ${I})`,
                border: 'none', borderRadius: 12, color: '#fff',
                cursor: 'pointer', transition: 'all 0.20s',
                boxShadow: '0 6px 22px rgba(124,58,237,0.32)',
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,58,237,0.42)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(124,58,237,0.32)'; }}
            >
              Start Free Diagnosis <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <a
              href="#estimator"
              id="hero-cta-secondary"
              style={{
                padding: '14px 26px', fontSize: 15, fontWeight: 700,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
                borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                color: 'var(--text-secondary)',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.20s', fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.30)'; e.currentTarget.style.color = V; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Sliders style={{ width: 15, height: 15 }} /> Live Estimator
            </a>
          </div>

          {/* Stats */}
          <div className="grid-features" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20,
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            paddingTop: 28,
          }}>
            {[
              { val: '98.5%', label: 'Model Accuracy',  color: V },
              { val: '7 Algo',label: 'Ensemble Engine', color: I },
              { val: 'HIPAA', label: 'Compliant',        color: '#10b981' },
            ].map((s) => (
              <div key={s.val}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 600, marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual — Premium Animated Heart */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 460 }}>

          {/* Deep glow backdrop */}
          <div style={{
            position: 'absolute', width: '75%', height: '75%',
            background: isDark
              ? 'radial-gradient(circle, rgba(124,58,237,0.24) 0%, rgba(99,102,241,0.12) 40%, transparent 72%)'
              : 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, rgba(99,102,241,0.06) 50%, transparent 76%)',
            borderRadius: '50%', filter: 'blur(52px)', zIndex: 0,
            animation: 'breathe 5s ease-in-out infinite',
          }} />

          {/* SVG pulse rings + orbit + ECG */}
          <svg viewBox="0 0 400 400" style={{ position: 'absolute', width: '100%', maxWidth: 460, zIndex: 1, pointerEvents: 'none' }}>
            {/* Outer pulse ring */}
            <circle cx="200" cy="200" r="182" fill="none"
              stroke={isDark ? 'rgba(124,58,237,0.09)' : 'rgba(124,58,237,0.06)'}
              strokeWidth="1"
              style={{ animation: 'pulseRing 4.2s ease-in-out infinite', transformOrigin: '200px 200px' }}
            />
            {/* Dashed mid ring */}
            <circle cx="200" cy="200" r="158" fill="none"
              stroke={isDark ? 'rgba(99,102,241,0.13)' : 'rgba(99,102,241,0.08)'}
              strokeWidth="1" strokeDasharray="5 12"
              style={{ animation: 'pulseRing 4.2s ease-in-out infinite 0.7s', transformOrigin: '200px 200px' }}
            />
            {/* Inner ring */}
            <circle cx="200" cy="200" r="130" fill="none"
              stroke={isDark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.10)'}
              strokeWidth="1.5"
              style={{ animation: 'pulseRing 4.2s ease-in-out infinite 1.4s', transformOrigin: '200px 200px' }}
            />

            {/* Rotating orbit with nodes */}
            <g style={{ transformOrigin: '200px 200px', animation: 'orbitSpin 14s linear infinite' }}>
              <circle cx="200" cy="200" r="170" fill="none"
                stroke={isDark ? 'rgba(124,58,237,0.11)' : 'rgba(124,58,237,0.06)'}
                strokeWidth="1" strokeDasharray="3 20" />
              <circle cx="200" cy="30" r="4.5" fill={isDark ? 'rgba(124,58,237,0.80)' : 'rgba(124,58,237,0.55)'}
                style={{ filter: isDark ? 'drop-shadow(0 0 8px rgba(124,58,237,0.90))' : 'drop-shadow(0 0 4px rgba(124,58,237,0.50))' }} />
              <circle cx="370" cy="200" r="3.5" fill={isDark ? 'rgba(99,102,241,0.70)' : 'rgba(99,102,241,0.45)'} />
              <circle cx="200" cy="370" r="4" fill={isDark ? 'rgba(124,58,237,0.60)' : 'rgba(124,58,237,0.40)'} />
              <circle cx="30" cy="200" r="3" fill={isDark ? 'rgba(99,102,241,0.55)' : 'rgba(99,102,241,0.35)'} />
            </g>

            {/* Counter-rotating inner orbit */}
            <g style={{ transformOrigin: '200px 200px', animation: 'spinReverse 20s linear infinite' }}>
              <circle cx="200" cy="200" r="142" fill="none"
                stroke={isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)'}
                strokeWidth="1" strokeDasharray="2 28" />
              <circle cx="200" cy="58" r="3" fill={isDark ? 'rgba(99,102,241,0.60)' : 'rgba(99,102,241,0.38)'} />
              <circle cx="342" cy="200" r="2.5" fill={isDark ? 'rgba(124,58,237,0.50)' : 'rgba(124,58,237,0.30)'} />
            </g>

            {/* ECG heartbeat line */}
            <g transform="translate(108, 328)">
              <polyline
                points="0,22 14,22 22,4 30,40 38,4 48,40 56,22 88,22 98,22 106,10 114,34 120,22 184,22"
                fill="none"
                stroke={isDark ? 'rgba(124,58,237,0.60)' : 'rgba(124,58,237,0.38)'}
                strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="260"
                strokeDashoffset="260"
                style={{ animation: 'ecgLine 2.6s ease-in-out infinite' }}
              />
            </g>
          </svg>

          {/* Heart image */}
          <img
            src="/heart3d.png"
            alt="HeartCare AI 3D Heart Visualization"
            style={{
              width: '64%', maxWidth: 290,
              objectFit: 'contain', position: 'relative', zIndex: 2,
              filter: isDark
                ? 'drop-shadow(0 0 28px rgba(124,58,237,0.45)) drop-shadow(0 20px 44px rgba(0,0,0,0.75))'
                : 'drop-shadow(0 20px 44px rgba(124,58,237,0.24)) drop-shadow(0 8px 18px rgba(0,0,0,0.08))',
              animation: 'float 4.6s ease-in-out infinite',
            }}
          />

          {/* Badge: Live Analysis (left) */}
          <div style={{
            position: 'absolute', top: '16%', left: '-8px', zIndex: 10,
            background: isDark ? 'rgba(6,6,14,0.96)' : 'rgba(255,255,255,0.97)',
            border: `1px solid ${isDark ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.14)'}`,
            borderRadius: 14, padding: '11px 14px',
            boxShadow: isDark
              ? '0 8px 36px rgba(0,0,0,0.92), 0 0 24px rgba(16,185,129,0.10)'
              : '0 8px 28px rgba(16,185,129,0.10), 0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', gap: 10,
            backdropFilter: 'blur(14px)',
            animation: 'floatReverse 4.2s ease-in-out infinite',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.07)',
              border: `1px solid rgba(16,185,129,0.22)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px rgba(16,185,129,0.70)' }} className="anim-pulse-dot" />
            </div>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: isDark ? '#34d399' : '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Live Analysis</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Real-time Risk Score</div>
            </div>
          </div>

          {/* Badge: ML Models (bottom-right) */}
          <div style={{
            position: 'absolute', bottom: '16%', right: '-8px', zIndex: 10,
            background: isDark ? 'rgba(6,6,14,0.96)' : 'rgba(255,255,255,0.97)',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.12)'}`,
            borderRadius: 14, padding: '11px 14px',
            boxShadow: isDark
              ? '0 8px 36px rgba(0,0,0,0.92), 0 0 24px rgba(99,102,241,0.10)'
              : '0 8px 28px rgba(99,102,241,0.10), 0 2px 8px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(14px)',
            animation: 'float 5.6s ease-in-out infinite 0.9s',
          }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: isDark ? '#a5b4fc' : '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>ML Ensemble</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['XGB', 'SVM', 'RF', 'KNN'].map((m) => (
                <span key={m} style={{
                  fontSize: 9.5, fontWeight: 800, padding: '2px 7px', borderRadius: 99,
                  background: isDark ? 'rgba(124,58,237,0.16)' : 'rgba(124,58,237,0.07)',
                  color: isDark ? '#c4b5fd' : '#7c3aed',
                  border: `1px solid ${isDark ? 'rgba(124,58,237,0.28)' : 'rgba(124,58,237,0.16)'}`,
                }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Badge: Accuracy (top-right) */}
          <div style={{
            position: 'absolute', top: '5%', right: '5%', zIndex: 10,
            background: isDark ? 'rgba(6,6,14,0.96)' : 'rgba(255,255,255,0.97)',
            border: `1px solid ${isDark ? 'rgba(124,58,237,0.22)' : 'rgba(124,58,237,0.12)'}`,
            borderRadius: 13, padding: '9px 13px',
            boxShadow: isDark ? '0 8px 28px rgba(0,0,0,0.92), 0 0 20px rgba(124,58,237,0.12)' : '0 6px 20px rgba(0,0,0,0.06)',
            backdropFilter: 'blur(14px)', textAlign: 'center',
            animation: 'floatReverse 6.2s ease-in-out infinite 1.3s',
          }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 900, color: isDark ? '#c4b5fd' : '#7c3aed', lineHeight: 1, letterSpacing: '-0.02em' }}>98.5%</div>
            <div style={{ fontSize: 9, fontWeight: 800, color: isDark ? '#4a3f70' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 3 }}>Accuracy</div>
          </div>

        </div>
      </section>

      {/* ══ LIVE ESTIMATOR ══ */}
      <section id="estimator" style={{ background: sectionAlt, padding: '96px 48px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: I, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>Interactive Demo</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              See Our AI in Action
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.65 }}>
              Adjust the clinical parameters below to see risk score update in real time.
            </p>
          </div>

          <div className="form-grid-2" style={{
            display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24,
            background: isDark ? '#0d0d0d' : '#fff',
            borderRadius: 24, padding: 32,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: isDark ? '0 24px 80px rgba(0,0,0,0.90)' : '0 8px 40px rgba(0,0,0,0.06)',
          }}>
            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 16, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <Sliders style={{ width: 17, height: 17, color: I }} />
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Clinical Data Inputs</h3>
              </div>
              {[
                { label: 'Patient Age', value: age, min: 20, max: 80, step: 1, display: `${age} yrs`, setter: (v: number) => setAge(v) },
                { label: 'Chest Pain Type', value: chestPain, min: 0, max: 3, step: 1, display: chestPain === 0 ? 'Typical Angina' : chestPain === 1 ? 'Atypical Angina' : chestPain === 2 ? 'Non-anginal' : 'Asymptomatic', setter: (v: number) => setChestPain(v) },
                { label: 'Max Heart Rate (Stress Test)', value: maxHr, min: 90, max: 200, step: 1, display: `${maxHr} bpm`, setter: (v: number) => setMaxHr(v) },
                { label: 'ST Depression (ECG)', value: stDep, min: 0, max: 4, step: 0.1, display: `${stDep.toFixed(1)} mm`, setter: (v: number) => setStDep(parseFloat(v.toFixed(1))) },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    <span>{s.label}</span>
                    <span style={{ color: V, fontWeight: 700 }}>{s.display}</span>
                  </div>
                  <input
                    type="range" min={s.min} max={s.max} step={s.step}
                    value={s.value}
                    onChange={(e) => s.setter(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: V, cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>

            {/* Risk Result */}
            <div style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(99,102,241,0.05) 100%)'
                : 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(99,102,241,0.02) 100%)',
              border: `1px solid ${isDark ? 'rgba(124,58,237,0.20)' : 'rgba(124,58,237,0.12)'}`,
              borderRadius: 18, padding: 28,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              alignItems: 'center', textAlign: 'center', position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 9.5, fontWeight: 800, letterSpacing: '0.09em', color: I, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Zap style={{ width: 10, height: 10 }} /> REAL-TIME PREDICTOR
              </div>

              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8 }}>Simulated Heart Risk Probability</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 68, fontWeight: 900, lineHeight: 1, color: riskColor, letterSpacing: '-0.04em', transition: 'color 0.4s ease' }}>
                {simulatedRisk}%
              </div>

              <span style={{
                padding: '4px 14px', borderRadius: 99, marginTop: 14,
                fontSize: 10.5, fontWeight: 800, display: 'inline-block', letterSpacing: '0.04em',
                background: simulatedRisk > 50 ? 'rgba(244,63,94,0.10)' : simulatedRisk > 25 ? 'rgba(245,158,11,0.10)' : 'rgba(16,185,129,0.10)',
                color: riskColor,
                border: `1px solid ${simulatedRisk > 50 ? 'rgba(244,63,94,0.22)' : simulatedRisk > 25 ? 'rgba(245,158,11,0.22)' : 'rgba(16,185,129,0.22)'}`,
              }}>
                {riskLabel.toUpperCase()}
              </span>

              <p style={{ marginTop: 20, fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 200 }}>
                Live rule-based simulation. Sign up to run the full 7-algorithm ML analysis.
              </p>

              <button
                id="estimator-cta"
                onClick={() => navigate('/register')}
                style={{
                  width: '100%', marginTop: 22, padding: '12px',
                  fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 700,
                  background: `linear-gradient(135deg, ${V}, ${I})`,
                  border: 'none', borderRadius: 10, color: '#fff',
                  cursor: 'pointer', transition: 'all 0.20s',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.40)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.28)'; e.currentTarget.style.transform = 'none'; }}
              >
                Run Full ML Report <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" style={{ padding: '96px 48px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: V, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>Platform Capabilities</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Advanced Tech Meets Clinical Medicine
          </h2>
        </div>
        <div className="grid-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 18 }}>
          {[
            { icon: Brain,     color: V,         title: '7-Model ML Ensemble',         desc: 'Logistic Regression, Decision Trees, Random Forests, SVM, KNN, Naive Bayes, and XGBoost running in parallel.' },
            { icon: Shield,    color: I,         title: 'Clinical Grade Security',      desc: 'Fully HIPAA-compliant. AES-256 at-rest encryption, TLS 1.3 in transit. Zero data shared without consent.' },
            { icon: FileText,  color: '#10b981', title: 'Dynamic PDF Reports',         desc: 'Generate comprehensive diagnostic PDFs with algorithm metrics, risk factors, and personalized guidelines.' },
            { icon: Calendar,  color: '#6366f1', title: 'Doctor Consultations',        desc: 'Schedule appointments, connect with cardiologists, and receive electronic prescriptions — all in one place.' },
            { icon: Sliders,   color: '#f59e0b', title: 'CSV Dataset Training',        desc: 'Admins can upload clinical datasets and retrain models with one click — no ML expertise required.' },
            { icon: Activity,  color: '#f43f5e', title: 'Adaptive Recommendations',   desc: 'Personalized diet plans, exercise regimens, and health guidelines tailored to your cardiovascular risk level.' },
          ].map((f, i) => (
            <div key={i} className="hc-card hc-card-hover" style={{ padding: 24, display: 'flex', gap: 18, cursor: 'default' }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                background: `${f.color}12`,
                border: `1px solid ${f.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.22s',
              }}>
                <f.icon style={{ width: 20, height: 20, color: f.color }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 7 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="workflow" style={{ background: sectionAlt, padding: '96px 48px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: I, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>Process</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              How HeartCare AI Works
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.65 }}>
              Four steps from vitals to diagnostic clarity.
            </p>
          </div>

          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { num: '01', icon: Sliders,     title: 'Input Vitals',   desc: 'Enter clinical data — blood pressure, resting HR, ECG parameters, and more.' },
              { num: '02', icon: Brain,       title: 'AI Analysis',    desc: 'Our 7-model ensemble runs predictions and outputs structured risk reports.' },
              { num: '03', icon: FileText,    title: 'Get Report',     desc: 'Download high-fidelity PDFs with prediction scores, diet, and lifestyle advice.' },
              { num: '04', icon: Stethoscope, title: 'Consult Doctor', desc: 'Book appointments with certified cardiologists directly inside the platform.' },
            ].map((step, i) => (
              <div key={i} className="hc-card" style={{ padding: 22, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: -1, left: -1, right: -1,
                  height: 3, borderRadius: '18px 18px 0 0',
                  background: `linear-gradient(90deg, ${V}, ${I})`,
                  opacity: 0.8,
                }} />
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 900, color: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 12 }}>{step.num}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <step.icon style={{ width: 16, height: 16, color: V }} />
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SPECIALISTS ══ */}
      <section id="doctors" style={{ padding: '96px 48px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: V, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>Expert Network</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Consult Specialist Cardiologists
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.65 }}>
            Certified clinical experts connected directly within HeartCare.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20 }}>
          {[
            { name: 'Dr. Sarah Jenkins',      specialty: 'Interventional Cardiology',   exp: '15 yrs', hosp: 'Metropolitan Medical Center', q: 'MD, FACC' },
            { name: 'Dr. Rajesh Koothrapali', specialty: 'Electrophysiology & ECG',     exp: '12 yrs', hosp: 'Apex Cardiac Hospital',         q: 'MBBS, MD' },
            { name: 'Dr. Marcus Vance',       specialty: 'Preventative Heart Care',     exp: '18 yrs', hosp: 'Boston Heart Institute',         q: 'MD, Ph.D.' },
          ].map((doc, i) => (
            <div key={i} className="hc-card hc-card-hover" style={{ padding: 26, textAlign: 'center', cursor: 'default' }}>
              {/* Avatar */}
              <div style={{
                width: 62, height: 62, borderRadius: '50%', margin: '0 auto 16px',
                background: `linear-gradient(135deg, ${V}22, ${I}22)`,
                border: `2px solid ${isDark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.18)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 22, fontWeight: 800, color: V,
              }}>
                {doc.name.split(' ')[1][0]}
              </div>

              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{doc.name}</h3>

              <span style={{
                display: 'inline-flex', padding: '3px 11px', borderRadius: 99,
                fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em',
                background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)',
                border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.16)'}`,
                color: I,
              }}>{doc.specialty}</span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '16px 0', fontSize: 12.5, color: 'var(--text-muted)', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, paddingTop: 14 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{doc.q} · {doc.exp}</span>
                <span style={{ fontSize: 12 }}>{doc.hosp}</span>
              </div>

              <button
                onClick={() => navigate('/register')}
                style={{
                  width: '100%', padding: '9px', fontFamily: "'Inter', sans-serif",
                  fontSize: 13, fontWeight: 700,
                  border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.22)'}`,
                  borderRadius: 9, background: isDark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.05)',
                  color: V, cursor: 'pointer', transition: 'all 0.18s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(124,58,237,0.16)' : 'rgba(124,58,237,0.10)'; e.currentTarget.style.borderColor = `rgba(124,58,237,0.45)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.05)'; e.currentTarget.style.borderColor = isDark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.22)'; }}
              >
                Schedule Appointment
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" style={{ background: sectionAlt, padding: '96px 48px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: I, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>FAQ</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px,3.5vw,38px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="hc-card" style={{ padding: '0 22px', overflow: 'hidden', cursor: 'pointer' }}>
                <button
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '20px 0',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)',
                    textAlign: 'left', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    gap: 16,
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown style={{
                    width: 16, height: 16, color: 'var(--text-faint)', flexShrink: 0,
                    transform: openFaq === i ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.22s ease',
                  }} />
                </button>
                {openFaq === i && (
                  <div style={{ paddingBottom: 20, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.75, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, paddingTop: 14 }} className="anim-fade-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{
        background: `linear-gradient(135deg, ${V} 0%, ${I} 100%)`,
        color: '#fff', padding: '88px 48px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: '-15%', left: '-8%', filter: 'blur(1px)' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: '-12%', right: '-6%' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: '20%', right: '20%' }} />

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Heart style={{ width: 22, height: 22, color: '#fff', fill: 'rgba(255,255,255,0.25)' }} className="anim-heartbeat" />
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16 }}>
            Ready to Take Control of Your Heart Health?
          </h2>
          <p style={{ fontSize: 15.5, opacity: 0.80, lineHeight: 1.70, marginBottom: 36 }}>
            Join thousands of patients and doctors. Get instant predictions, smart advice, and professional support.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              id="cta-signup-btn"
              onClick={() => navigate('/register')}
              style={{
                padding: '14px 30px', fontSize: 15, fontWeight: 700,
                background: '#fff', border: 'none', borderRadius: 12,
                color: V, cursor: 'pointer', transition: 'all 0.20s',
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.22)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
            >
              Sign Up Free
            </button>
            <button
              id="cta-login-btn"
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 28px', fontSize: 15, fontWeight: 700,
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 12, color: '#fff', cursor: 'pointer', transition: 'all 0.20s',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.20)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            >
              Doctor Login
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: isDark ? '#050505' : '#f8fafc', color: 'var(--text-muted)', padding: '60px 48px 28px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}` }}>
        <div className="footer-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.3fr 1.7fr', gap: 48, paddingBottom: 40, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${V}, ${I})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(124,58,237,0.28)' }}>
                <Heart style={{ width: 13, height: 13, color: '#fff', fill: 'rgba(255,255,255,0.3)' }} />
              </div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                HeartCare <span style={{ background: `linear-gradient(90deg, ${V}, ${I})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.70, maxWidth: 260 }}>
              AI-powered cardiac diagnostics, secure health records, and seamless specialist care.
            </p>
          </div>

          <div className="footer-links-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { heading: 'Platform', links: [{ l: 'AI Features', h: '#features' }, { l: 'Live Demo', h: '#estimator' }, { l: 'How it Works', h: '#workflow' }] },
              { heading: 'Specialists', links: [{ l: 'Our Network', h: '#doctors' }, { l: 'Consultation FAQ', h: '#faq' }, { l: 'Doctor Login', h: '/login' }] },
              { heading: 'Legal', links: [{ l: 'Privacy Policy', h: '#' }, { l: 'Terms of Use', h: '#' }, { l: 'HIPAA Info', h: '#' }] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{col.heading}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13 }}>
                  {col.links.map((lk) => (
                    <li key={lk.l}>
                      <a href={lk.h} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.18s', fontWeight: 500 }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = V; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                      >{lk.l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, fontSize: 12 }}>
          <span>© 2026 HeartCare AI. All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-faint)' }}>
            <Lock style={{ width: 10, height: 10 }} />
            HIPAA Compliant · AES-256 Encrypted · TLS 1.3
          </div>
        </div>
      </footer>
    </div>
  );
}
