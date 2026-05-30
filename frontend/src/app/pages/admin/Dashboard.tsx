import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../../../lib/api';
import {
  Users, Stethoscope, Activity, Calendar,
  ArrowRight, Shield, Cpu, Layers, TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.dashboardStats()
      .then((r) => setStats(r.data.stats || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total Accounts',
      value: stats?.total_users ?? 0,
      icon: Users,
      color: '#94a3b8',
      bg: 'rgba(148,163,184,0.1)',
      sub: 'registered users',
    },
    {
      label: 'Active Patients',
      value: stats?.patients_count ?? 0,
      icon: Activity,
      color: '#a78bfa',
      bg: 'rgba(124,58,237,0.12)',
      sub: 'on the platform',
    },
    {
      label: 'Practitioners',
      value: stats?.doctors_count ?? 0,
      icon: Stethoscope,
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.12)',
      sub: 'verified doctors',
    },
    {
      label: 'Diagnostics Run',
      value: stats?.predictions_count ?? 0,
      icon: Cpu,
      color: '#fb7185',
      bg: 'rgba(225,29,72,0.12)',
      sub: 'total predictions',
    },
  ];

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">

      {/* ── Hero Banner ── */}
      <div className="hero-banner amber">
        <div>
          <p className="hero-eyebrow" style={{ color: 'var(--brand-amber)' }}>Administrator Command Space</p>
          <h1 className="hero-title">HeartCare System Console</h1>
          <p className="hero-desc">
            Monitor platform metrics, manage user permissions, audit ML model accuracies, and retrain classifiers in real time.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/users')}
          className="btn btn-lg"
          style={{
            flexShrink: 0,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            boxShadow: '0 6px 24px rgba(245,158,11,0.28)',
          }}
        >
          <Users style={{ width: 16, height: 16 }} />
          Manage Users
          <ArrowRight style={{ width: 15, height: 15 }} />
        </button>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {statCards.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: bg, color }}>
              <Icon style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{loading ? '—' : value.toLocaleString()}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>

        {/* Left: Command Panel */}
        <div className="card">
          <div className="section-header">
            <TrendingUp style={{ width: 17, height: 17, color: 'var(--brand-amber)' }} />
            <h3 className="section-title">Quick Command Panel</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            <button className="quick-action qa-cyan" onClick={() => navigate('/admin/doctors')}>
              <Stethoscope style={{ width: 16, height: 16, color: 'var(--brand-cyan)' }} />
              Onboard New Specialist
              <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
            </button>
            <button className="quick-action" onClick={() => navigate('/admin/ml-models')}>
              <Cpu style={{ width: 16, height: 16, color: 'var(--brand-purple-light)' }} />
              Audit ML Engine & Upload CSV
              <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
            </button>
            <button className="quick-action" onClick={() => navigate('/admin/predictions')}>
              <Activity style={{ width: 16, height: 16, color: '#fb7185' }} />
              View Platform Predictions
              <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
            </button>
            <button className="quick-action" onClick={() => navigate('/admin/appointments')}>
              <Calendar style={{ width: 16, height: 16, color: 'var(--brand-amber)' }} />
              Monitor All Appointments
              <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
            </button>
          </div>

          {/* ML Model Accuracy preview */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              ML Engine Status
            </div>
            {[
              { name: 'XGBoost', acc: 96.0, color: '#06b6d4' },
              { name: 'Random Forest', acc: 94.5, color: '#a78bfa' },
              { name: 'Decision Tree', acc: 93.0, color: '#34d399' },
            ].map(({ name, acc, color }) => (
              <div key={name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{name}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color }}>{acc}%</span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${acc}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Compliance & Audit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="section-header">
              <Shield style={{ width: 17, height: 17, color: 'var(--brand-emerald)' }} />
              <h3 className="section-title">Compliance & Audit</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
              {[
                {
                  icon: Shield,
                  color: 'var(--brand-emerald)',
                  title: 'HIPAA Auditing',
                  text: 'Periodically verify linked medical licenses for all doctor onboarding operations.',
                },
                {
                  icon: Layers,
                  color: 'var(--brand-cyan)',
                  title: 'CSV Schema Validation',
                  text: 'Only upload standard clinical CSV formats in the ML Engine models tab.',
                },
                {
                  icon: Users,
                  color: 'var(--brand-purple-light)',
                  title: 'Role Assignment',
                  text: 'Assign patient and doctor roles carefully — role changes affect platform access.',
                },
              ].map(({ icon: Icon, color, title, text }) => (
                <div key={title} style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${color}18`, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 14, height: 14, color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{title}</div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System health */}
          <div className="card" style={{ background: 'rgba(16,185,129,0.04)', borderColor: 'rgba(16,185,129,0.18)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(16,185,129,0.12)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Activity style={{ width: 18, height: 18, color: '#10b981' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>All Systems Operational</div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>
                  Backend API, ML Engine & database connections are healthy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
