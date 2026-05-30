import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../../lib/auth';
import { predictionApi, appointmentApi } from '../../../lib/api';
import {
  Brain, Calendar, FileText, Heart, Activity,
  ArrowRight, Shield, Clock, ChevronRight, Sparkles, TrendingUp
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentPrediction, setRecentPrediction] = useState<any>(null);
  const [upcomingAppointment, setUpcomingAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      predictionApi.history().catch(() => ({ data: [] })),
      appointmentApi.list().catch(() => ({ data: [] })),
    ])
      .then(([predRes, aptRes]) => {
        const preds = predRes.data.results || predRes.data;
        if (preds.length > 0) setRecentPrediction(preds[0]);
        const apts = aptRes.data.results || aptRes.data;
        const upcoming = apts.find((a: any) => a.status === 'confirmed' || a.status === 'pending');
        if (upcoming) setUpcomingAppointment(upcoming);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const riskColor = {
    high:   '#f43f5e',
    medium: '#f59e0b',
    low:    '#10b981',
  };
  const riskBg = {
    high:   'rgba(225,29,72,0.12)',
    medium: 'rgba(245,158,11,0.12)',
    low:    'rgba(16,185,129,0.12)',
  };
  const riskBadge = {
    high:   'badge-rose',
    medium: 'badge-amber',
    low:    'badge-emerald',
  };

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">

      {/* ── Hero Banner ── */}
      <div className="hero-banner">
        <div>
          <p className="hero-eyebrow">Cardiac Health Command</p>
          <h1 className="hero-title">
            Welcome back, {user?.first_name || user?.username}! 👋
          </h1>
          <p className="hero-desc">
            Monitor, assess, and manage your cardiovascular health powered by 7 ensemble machine learning models.
          </p>
        </div>
        <button
          onClick={() => navigate('/patient/predict')}
          className="btn btn-primary btn-lg"
          style={{ flexShrink: 0 }}
        >
          <Brain style={{ width: 16, height: 16 }} />
          Assess Heart Risk
          <ArrowRight style={{ width: 15, height: 15 }} />
        </button>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa' }}>
            <Brain style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div className="stat-label">Last Risk Score</div>
            <div className="stat-value" style={{ fontSize: 24 }}>
              {loading ? '—' : recentPrediction ? `${recentPrediction.probability}%` : 'N/A'}
            </div>
            <div className="stat-sub">cardiovascular risk</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4' }}>
            <Calendar style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div className="stat-label">Next Appointment</div>
            <div className="stat-value" style={{ fontSize: 16, marginTop: 6 }}>
              {loading ? '—' : upcomingAppointment
                ? new Date(upcomingAppointment.appointment_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                : 'None'}
            </div>
            <div className="stat-sub">{upcomingAppointment?.status || 'not scheduled'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
            <Shield style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div className="stat-label">Data Protection</div>
            <div className="stat-value" style={{ fontSize: 18, marginTop: 6 }}>HIPAA</div>
            <div className="stat-sub">fully compliant</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
            <TrendingUp style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div className="stat-label">Model Accuracy</div>
            <div className="stat-value" style={{ fontSize: 24 }}>96%</div>
            <div className="stat-sub">XGBoost ensemble</div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 24 }}>

        {/* LEFT: Recent Prediction */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="section-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
                <h3 className="section-title">Recent Cardiac Assessment</h3>
              </div>
              <Link
                to="/patient/history"
                style={{ fontSize: 12.5, color: 'var(--brand-cyan)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}
              >
                View All <ChevronRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            {loading ? (
              <div className="skeleton" style={{ height: 100 }} />
            ) : recentPrediction ? (
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', paddingTop: 4 }}>
                {/* Risk Circle */}
                <div style={{
                  width: 88, height: 88, borderRadius: '50%', flexShrink: 0,
                  background: riskBg[recentPrediction.risk_level as keyof typeof riskBg] || riskBg.low,
                  border: `3px solid ${riskColor[recentPrediction.risk_level as keyof typeof riskColor] || riskColor.low}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                  boxShadow: `0 0 20px ${riskColor[recentPrediction.risk_level as keyof typeof riskColor] || riskColor.low}22`,
                }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: riskColor[recentPrediction.risk_level as keyof typeof riskColor] || riskColor.low }}>{recentPrediction.probability}%</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: riskColor[recentPrediction.risk_level as keyof typeof riskColor] || riskColor.low, opacity: 0.8, textTransform: 'uppercase' }}>risk</span>
                </div>

                <div style={{ flex: 1 }}>
                  <span className={`badge ${riskBadge[recentPrediction.risk_level as keyof typeof riskBadge] || 'badge-emerald'}`}>
                    {recentPrediction.risk_level} Risk
                  </span>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8, lineHeight: 1.3 }}>
                    {recentPrediction.prediction_result === 1
                      ? 'Coronary Pathology Indicated'
                      : 'No Severe Pathology Detected'}
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5, lineHeight: 1.5 }}>
                    {new Date(recentPrediction.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    {' · '}{recentPrediction.algorithm_used}
                  </p>
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '32px 10px' }}>
                <div className="empty-icon-wrap">
                  <Activity style={{ width: 24, height: 24 }} />
                </div>
                <div className="empty-title">No assessments yet</div>
                <p className="empty-text">Run your first cardiac risk prediction to see results here.</p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/patient/predict')}>
                  Start Assessment
                </button>
              </div>
            )}
          </div>

          {/* Info cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card card-sm" style={{ display: 'flex', gap: 14 }}>
              <Shield style={{ width: 20, height: 20, color: '#10b981', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>HIPAA Compliant</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
                  All diagnostics and patient data are secured with clinical-grade encryption.
                </p>
              </div>
            </div>
            <div className="card card-sm" style={{ display: 'flex', gap: 14 }}>
              <Sparkles style={{ width: 20, height: 20, color: '#a78bfa', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>7-Model Ensemble</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
                  7 ML algorithms run simultaneously with 96% peak validation accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Appointment + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Upcoming Appointment */}
          <div className="card">
            <div className="section-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar style={{ width: 17, height: 17, color: 'var(--brand-cyan)' }} />
                <h3 className="section-title">Next Consultation</h3>
              </div>
              <Link
                to="/patient/appointments"
                style={{ fontSize: 12.5, color: 'var(--brand-cyan)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}
              >
                Schedule <ChevronRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            {loading ? (
              <div className="skeleton" style={{ height: 90 }} />
            ) : upcomingAppointment ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(6,182,212,0.1)', color: '#06b6d4',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
                    }}>
                      {upcomingAppointment.doctor_name?.[3] || 'D'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Dr. {upcomingAppointment.doctor_name || `Doctor #${upcomingAppointment.doctor}`}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Cardiologist</div>
                    </div>
                  </div>
                  <span className={`badge ${upcomingAppointment.status === 'confirmed' ? 'badge-emerald' : 'badge-amber'}`}>
                    {upcomingAppointment.status}
                  </span>
                </div>

                <div className="info-chip" style={{ width: 'fit-content' }}>
                  <Clock style={{ width: 13, height: 13, color: 'var(--brand-purple-light)' }} />
                  {new Date(upcomingAppointment.appointment_date + 'T' + upcomingAppointment.appointment_time)
                    .toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  "{upcomingAppointment.reason}"
                </p>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '28px 10px' }}>
                <div className="empty-icon-wrap">
                  <Calendar style={{ width: 22, height: 22 }} />
                </div>
                <p className="empty-text">No appointments scheduled yet.</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Quick Actions</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <button className="quick-action" onClick={() => navigate('/patient/predict')}>
                <Brain style={{ width: 16, height: 16, color: 'var(--brand-purple-light)' }} />
                Check Cardiovascular Risk
                <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
              </button>
              <button className="quick-action qa-cyan" onClick={() => navigate('/patient/appointments')}>
                <Calendar style={{ width: 16, height: 16, color: 'var(--brand-cyan)' }} />
                Book a Consultation
                <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
              </button>
              <button className="quick-action qa-emerald" onClick={() => navigate('/patient/prescriptions')}>
                <FileText style={{ width: 16, height: 16, color: 'var(--brand-emerald)' }} />
                View Prescriptions
                <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
