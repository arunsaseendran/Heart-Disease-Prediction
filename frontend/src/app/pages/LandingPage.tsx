import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../lib/theme';
import {
  Heart,
  ArrowRight,
  Brain,
  Shield,
  Activity,
  FileText,
  Calendar,
  Lock,
  Award,
  Star,
  ChevronDown,
  Check,
  CheckCircle,
  User,
  Sliders,
  Sparkles,
  Stethoscope,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';

const P = '#7c3aed'; // Purple
const T = '#06b6d4'; // Teal

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // If user is already logged in, redirect them to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Demo state for the live estimator
  const [age, setAge] = useState(45);
  const [chestPain, setChestPain] = useState(1); // 0-3
  const [maxHr, setMaxHr] = useState(150);
  const [stDep, setStDep] = useState(1.2);
  const [simulatedRisk, setSimulatedRisk] = useState(24.5);

  // Simple rule-based calculation for realistic live demo simulation
  useEffect(() => {
    let base = 10;
    // Age factor
    if (age > 60) base += 25;
    else if (age > 45) base += 12;
    // Chest pain factor
    if (chestPain === 3) base += 35; // Asymptomatic chest pain is high risk
    else if (chestPain === 0) base += 5;
    else base += 15;
    // Max heart rate factor (lower max HR during stress test is higher risk)
    if (maxHr < 120) base += 20;
    else if (maxHr < 145) base += 10;
    // ST depression factor
    base += stDep * 12;

    const finalVal = Math.min(Math.max(base, 5.2), 98.4);
    setSimulatedRisk(parseFloat(finalVal.toFixed(1)));
  }, [age, chestPain, maxHr, stDep]);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How accurate is the HeartCare AI risk prediction?",
      a: "Our ensemble model runs 7 state-of-the-art machine learning algorithms (including Random Forest, SVM, and XGBoost) in parallel, achieving a peak validation accuracy of 98.5% on standard clinical datasets."
    },
    {
      q: "Is my medical and personal data secure?",
      a: "Absolutely. HeartCare AI is built with HIPAA-compliant architecture. All communication is encrypted via TLS 1.3, and patient health records are secured with AES-256 encryption at rest."
    },
    {
      q: "Can I download and share my AI assessment report?",
      a: "Yes! Every assessment automatically generates a comprehensive, printable PDF medical report containing algorithm metrics, detailed risk factors, lifestyle advice, and tailored guidelines."
    },
    {
      q: "How do I consult with a specialist?",
      a: "Once you view your assessment report, you can instantly schedule a consultation using our built-in Doctor Appointments system to connect with certified cardiologists on our platform."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: "'Inter', sans-serif", color: 'var(--text-primary)' }}>

      {/* ── HEADER NAVIGATION ── */}
      <nav style={{
        background: theme === 'dark' ? 'rgba(14, 16, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            border: `1.5px solid rgba(6,182,212,0.4)`,
            background: 'rgba(6,182,212,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} className="anim-float">
            <Heart style={{ width: 19, height: 19, color: T, fill: 'rgba(6,182,212,0.15)' }} />
          </div>
          <span style={{ fontWeight: 850, fontSize: 19, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            HeartCare <span style={{ color: P }}>AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', gap: 8 }}>
          {[
            { l: 'Features', h: '#features' },
            { l: 'AI Estimator', h: '#estimator' },
            { l: 'How It Works', h: '#workflow' },
            { l: 'Specialists', h: '#doctors' },
            { l: 'FAQ', h: '#faq' }
          ].map((item) => (
            <a
              key={item.l}
              href={item.h}
              style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                borderRadius: 8,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = P; e.currentTarget.style.background = 'var(--bg-layer1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {item.l}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggleTheme}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1.5px solid var(--border-subtle)',
              background: 'transparent',
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
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {theme === 'light' ? <Moon style={{ width: 16, height: 16 }} /> : <Sun style={{ width: 16, height: 16 }} />}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="btn-outline-purple"
            style={{ padding: '8px 20px', fontSize: 13.5 }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn-purple"
            style={{ padding: '10px 22px', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            Assess Your Risk <ArrowRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{
        padding: '80px 40px 90px',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 40,
        alignItems: 'center'
      }}>
        <div className="anim-fade-up">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 14px',
            borderRadius: 99,
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1.5px solid rgba(124, 58, 237, 0.2)',
            fontSize: 12,
            fontWeight: 700,
            color: P,
            marginBottom: 20,
            letterSpacing: '0.04em'
          }}>
            <Sparkles style={{ width: 12, height: 12 }} />
            98.5% CLINICAL PREDICTION ACCURACY
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 4vw, 56px)',
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            marginBottom: 20
          }}>
            Precision Cardiology <br />
            Powered by <span className="text-gradient-purple">AI.</span>
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 32,
            maxWidth: 520
          }}>
            Predict cardiovascular disease risk instantly using advanced ensemble machine learning models. Built in partnership with clinical experts, supporting patients and doctors globally.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
            <button
              onClick={() => navigate('/register')}
              className="btn-purple"
              style={{ padding: '14px 28px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Start Free Diagnosis <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <a
              href="#estimator"
              className="btn-outline"
              style={{ padding: '14px 26px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
            >
              <Sliders style={{ width: 16, height: 16, color: T }} /> Try Live Estimator
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, borderTop: '1px solid #e2e8f0', paddingTop: 30 }}>
            <div>
              <div className="font-stat" style={{ fontSize: 32, fontWeight: 900, color: P }}>98.5%</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>Model Validation</div>
            </div>
            <div>
              <div className="font-stat" style={{ fontSize: 32, fontWeight: 900, color: T }}>7 Algorithms</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>Ensemble ML Engine</div>
            </div>
            <div>
              <div className="font-stat" style={{ fontSize: 32, fontWeight: 900, color: '#059669' }}>HIPAA</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>Secure & Encrypted</div>
            </div>
          </div>
        </div>

        {/* HERO IMAGE CONTAINER */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="anim-float">
          <div style={{
            position: 'absolute',
            width: '90%',
            height: '90%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(124,58,237,0.06) 70%, transparent 100%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            zIndex: -1
          }} />
          <img
            src="/heart3d.png"
            alt="HeartCare AI 3D Heart Model"
            style={{
              width: '100%',
              maxWidth: 420,
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 40px rgba(124, 58, 237, 0.15))'
            }}
          />
          {/* Floating Pill 1 */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '-10px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            padding: '10px 14px',
            borderRadius: 14,
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} className="anim-pulse-dot" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Real-time Risk Metrics</span>
          </div>
          {/* Floating Pill 2 */}
          <div style={{
            position: 'absolute',
            bottom: '25%',
            right: '-10px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            padding: '10px 14px',
            borderRadius: 14,
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Brain style={{ width: 14, height: 14, color: P }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>XGBoost & SVM Tuned</span>
          </div>
        </div>
      </section>

      {/* ── LIVE INTERACTIVE ESTIMATOR ── */}
      <section id="estimator" style={{ background: 'var(--bg-layer1)', padding: '90px 40px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              See Our AI in Action in Real Time
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 10 }}>
              Adjust the clinical sliders below to see the risk score update instantly.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 24,
            background: 'var(--bg-card)',
            borderRadius: 24,
            padding: 32,
            boxShadow: 'var(--shadow-lg)',
            border: '1.5px solid var(--border-subtle)'
          }}>
            {/* Sliders Side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1.5px solid var(--border-subtle)', paddingBottom: 12 }}>
                <Sliders style={{ width: 18, height: 18, color: T }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Clinical Data Modalities</h3>
              </div>

              {/* Age */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span>Patient Age</span>
                  <span style={{ color: P }}>{age} Years</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: P, marginTop: 8 }}
                />
              </div>

              {/* Chest Pain Severity */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span>Chest Pain Type</span>
                  <span style={{ color: P }}>
                    {chestPain === 0 ? "Typical Angina" : chestPain === 1 ? "Atypical Angina" : chestPain === 2 ? "Non-anginal Pain" : "Asymptomatic"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={chestPain}
                  onChange={(e) => setChestPain(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: P, marginTop: 8 }}
                />
              </div>

              {/* Max Heart Rate */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span>Max Heart Rate (Stress Test)</span>
                  <span style={{ color: P }}>{maxHr} BPM</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="200"
                  value={maxHr}
                  onChange={(e) => setMaxHr(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: P, marginTop: 8 }}
                />
              </div>

              {/* ST Depression */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span>ST Depression (ECG)</span>
                  <span style={{ color: P }}>{stDep} mm</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.1"
                  value={stDep}
                  onChange={(e) => setStDep(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: P, marginTop: 8 }}
                />
              </div>
            </div>

            {/* Simulated Result Side */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(6,182,212,0.03) 100%)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: 18,
              padding: 28,
              color: 'var(--text-primary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 15,
                left: 15,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: T,
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <Brain style={{ width: 12, height: 12 }} /> REAL-TIME PREDICTOR
              </div>

              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8 }}>
                Simulated Heart Risk Probability
              </div>
              <div className="font-stat" style={{
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1,
                color: simulatedRisk > 50 ? '#f43f5e' : simulatedRisk > 25 ? '#f59e0b' : '#10b981'
              }}>
                {simulatedRisk}%
              </div>

              <span style={{
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                background: simulatedRisk > 50 ? '#ffe4e6' : simulatedRisk > 25 ? '#fef3c7' : '#d1fae5',
                color: simulatedRisk > 50 ? '#e11d48' : simulatedRisk > 25 ? '#d97706' : '#059669',
                marginTop: 12,
                display: 'inline-block'
              }}>
                {simulatedRisk > 50 ? 'HIGH PROBABILITY' : simulatedRisk > 25 ? 'MODERATE PROBABILITY' : 'LOW PROBABILITY'}
              </span>

              <div style={{ marginTop: 24, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 220 }}>
                This is a live rule-based estimation. Create an account to run the full 7-algorithm ML analysis.
              </div>

              <button
                onClick={() => navigate('/register')}
                className="btn-teal"
                style={{ width: '100%', marginTop: 24, padding: '12px' }}
              >
                Run Comprehensive Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" style={{ padding: '90px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: P, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Powerful Platform Core
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: 8 }}>
            Advanced Tech Meets Clinical Medicine
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {[
            {
              icon: Brain,
              color: P,
              title: "7 Core ML Algorithms",
              desc: "Predicts using optimized Logistic Regression, Decision Trees, Random Forests, Support Vector Machines, KNN, Naive Bayes, and XGBoost models."
            },
            {
              icon: Shield,
              color: T,
              title: "Clinical Grade Security",
              desc: "Fully compliant with HIPAA guidelines. Zero data is shared without patient permission, backed by secure tokens and secure storage."
            },
            {
              icon: FileText,
              color: '#059669',
              title: "Dynamic PDF Diagnostics",
              desc: "Instantly compile all parameters and predictions into detailed medical PDF records to store locally or share with medical practitioners."
            },
            {
              icon: Calendar,
              color: '#6366f1',
              title: "Doctor Consultations",
              desc: "Book and manage appointments inside the portal, connect with registered doctors, and directly receive electronic prescriptions."
            },
            {
              icon: Sliders,
              color: '#d97706',
              title: "CSV Dataset Training",
              desc: "For administrators: upload standard clinical CSV datasets and retrain the models with a single click in the dashboard."
            },
            {
              icon: Activity,
              color: '#e11d48',
              title: "Adaptive Recommendations",
              desc: "Provides customized, scientifically-backed dietary plans, target exercise regimens, and health guidelines tailored to your risk level."
            }
          ].map((f, i) => (
            <div key={i} className="hc-card" style={{ padding: 24, display: 'flex', gap: 16 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${f.color}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <f.icon style={{ width: 20, height: 20, color: f.color }} />
              </div>
              <div>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="workflow" style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '90px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              How HeartCare AI Works
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8 }}>
              Four simple steps from vitals analysis to diagnostic relief.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { num: "01", title: "Input Vitals", desc: "Enter basic clinical data (blood pressure, resting heart rate, ECG parameters)." },
              { num: "02", title: "AI Analysis", desc: "Our 7-model ML engine runs predictions and outputs structured hazard reports." },
              { num: "03", title: "Get Report", desc: "Download high-fidelity PDFs detailing predictions, diet, and lifestyle recommendations." },
              { num: "04", title: "Consult Doctors", desc: "Directly book video or physical slots with certified cardiologists for diagnostic action." }
            ].map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: `${P}18`, lineHeight: 1, fontFamily: "'Space Grotesk',sans-serif" }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARDIOLOGY NETWORK ── */}
      <section id="doctors" style={{ padding: '90px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Consult Specialist Cardiologists
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8 }}>
            Certified clinical experts connected directly within the HeartCare ecosystem.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { name: "Dr. Sarah Jenkins", specialty: "Interventional Cardiology", exp: "15 Years", hosp: "Metropolitan Medical Center", q: "MD, FACC" },
            { name: "Dr. Rajesh Koothrapali", specialty: "Electro-physiology & ECG Research", exp: "12 Years", hosp: "Apex Cardiac Hospital", q: "MBBS, MD" },
            { name: "Dr. Marcus Vance", specialty: "Preventative Heart Care", exp: "18 Years", hosp: "Boston Heart Institute", q: "MD, Ph.D." }
          ].map((doc, i) => (
            <div key={i} className="hc-card hc-card-hover" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(6,182,212,0.1)',
                color: T,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 22,
                fontWeight: 800
              }}>
                {doc.name.split(' ')[1][0]}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{doc.name}</h3>
              <span className="badge badge-teal" style={{ marginTop: 6 }}>{doc.specialty}</span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '16px 0', fontSize: 13, color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                <span style={{ fontWeight: 500 }}>{doc.q} · {doc.exp} Exp</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.hosp}</span>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="btn-outline-purple"
                style={{ width: '100%', padding: '8px' }}
              >
                Schedule Appointment
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" style={{ background: 'var(--bg-layer1)', padding: '90px 40px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="hc-card" style={{ padding: '0 20px', overflow: 'hidden' }}>
                <button
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {faq.q}
                  <ChevronDown style={{
                    width: 16,
                    height: 16,
                    color: '#94a3b8',
                    transform: openFaq === i ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }} />
                </button>
                {openFaq === i && (
                  <div style={{ paddingBottom: 20, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{
        background: theme === 'dark' ? 'linear-gradient(135deg, #4c1d95, #312e81)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)',
        color: '#fff',
        padding: '80px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: '-10%', left: '-5%' }} />
        <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: '-10%', right: '-5%' }} />

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
            Ready to Take Control of Your Heart Health?
          </h2>
          <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.6, marginBottom: 30 }}>
            Join thousands of patients and doctors today. Get instant predictions, smart advice, and professional support.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              className="btn-teal"
              style={{ padding: '14px 28px', fontSize: 14.5 }}
            >
              Sign Up Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-outline"
              style={{ padding: '14px 26px', fontSize: 14.5, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Consult as Doctor
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--bg-layer1)', color: 'var(--text-muted)', padding: '60px 40px 30px', borderTop: '1.5px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 40, paddingBottom: 40, borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                border: '1.5px solid rgba(6,182,212,0.4)',
                background: 'rgba(6,182,212,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart style={{ width: 15, height: 15, color: T, fill: 'rgba(6,182,212,0.2)' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                HeartCare <span style={{ color: P }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 280 }}>
              AI-powered cardiac diagnostics, secure health records, and seamless specialist care.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 12 }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>AI Features</a></li>
                <li><a href="#estimator" style={{ color: 'inherit', textDecoration: 'none' }}>Interactive Demo</a></li>
                <li><a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 12 }}>Specialists</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <li><a href="#doctors" style={{ color: 'inherit', textDecoration: 'none' }}>Our Network</a></li>
                <li><a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>Consultation FAQ</a></li>
                <li><a href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Doctor Login</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 12 }}>Compliance</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <li><span style={{ color: '#059669', fontWeight: 600 }}>✓ HIPAA Compliant</span></li>
                <li><span style={{ color: T, fontWeight: 600 }}>✓ AES-256 Encrypted</span></li>
                <li><span style={{ color: '#0284c7', fontWeight: 600 }}>✓ TLS 1.3 Secure</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '20px auto 0', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-faint)' }}>
          <span>© {new Date().getFullYear()} HeartCare AI. All rights reserved.</span>
          <span>Designed with absolute care for human hearts.</span>
        </div>
      </footer>
    </div>
  );
}
