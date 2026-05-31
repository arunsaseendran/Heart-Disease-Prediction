import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../../lib/auth';
import { doctorApi, appointmentApi } from '../../../lib/api';
import {
  Users, Calendar, FileText, Stethoscope,
  ArrowRight, Shield, Clock, Activity, ChevronRight, CheckCircle2
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      doctorApi.myPatients().catch(() => ({ data: [] })),
      appointmentApi.list().catch(() => ({ data: [] })),
      doctorApi.prescriptions().catch(() => ({ data: [] })),
    ])
      .then(([ptRes, aptRes, rxRes]) => {
        setPatients(ptRes.data.results || ptRes.data);
        setAppointments(aptRes.data.results || aptRes.data);
        setPrescriptions(rxRes.data.results || rxRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pendingApts   = appointments.filter(a => a.status === 'pending');
  const confirmedApts = appointments.filter(a => a.status === 'confirmed');

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">

      {/* ── Hero Banner ── */}
      <div className="hero-banner cyan">
        <div>
          <p className="hero-eyebrow" style={{ color: 'var(--brand-cyan)' }}>Practitioner Workspace</p>
          <h1 className="hero-title">
            Welcome, Dr. {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username}!
          </h1>
          <p className="hero-desc">
            Manage your patient roster, appointments, and issue electronic prescriptions from your digital clinical space.
          </p>
        </div>
        <button
          onClick={() => navigate('/doctor/prescriptions')}
          className="btn btn-cyan btn-lg"
          style={{ flexShrink: 0 }}
        >
          <FileText style={{ width: 16, height: 16 }} />
          Issue Prescription
          <ArrowRight style={{ width: 15, height: 15 }} />
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4' }}>
            <Users style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div className="stat-label">Assigned Patients</div>
            <div className="stat-value">{loading ? '—' : patients.length}</div>
            <div className="stat-sub">active cases</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
            <Clock style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div className="stat-label">Pending Approvals</div>
            <div className="stat-value">{loading ? '—' : pendingApts.length}</div>
            <div className="stat-sub">awaiting action</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa' }}>
            <FileText style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div className="stat-label">Prescriptions Issued</div>
            <div className="stat-value">{loading ? '—' : prescriptions.length}</div>
            <div className="stat-sub">total issued</div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>

        {/* Left: Upcoming Consultations */}
        <div className="card">
          <div className="section-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
              <h3 className="section-title">Upcoming Consultations</h3>
            </div>
            <Link
              to="/doctor/appointments"
              style={{ fontSize: 12.5, color: 'var(--brand-cyan)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}
            >
              Manage All <ChevronRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 60 }} />)}
            </div>
          ) : confirmedApts.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon-wrap"><Calendar style={{ width: 22, height: 22 }} /></div>
              <p className="empty-text">No confirmed appointments scheduled.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
              {confirmedApts.slice(0, 4).map(a => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)', padding: '14px 16px',
                    transition: 'all var(--t-fast)',
                  }}
                  className="table-row-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9,
                      background: 'rgba(124,58,237,0.12)', color: '#a78bfa',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14
                    }}>
                      {a.patient_name?.[0] || 'P'}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {a.patient_name || `Patient #${a.patient}`}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>"{a.reason}"</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-cyan)', textAlign: 'right', flexShrink: 0 }}>
                    {new Date(a.appointment_date + 'T' + a.appointment_time)
                      .toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending badge */}
          {pendingApts.length > 0 && (
            <div className="alert alert-warning" style={{ marginTop: 14 }}>
              <Clock style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
              <span>You have <strong>{pendingApts.length}</strong> pending appointment request{pendingApts.length > 1 ? 's' : ''} awaiting your approval.</span>
            </div>
          )}
        </div>

        {/* Right: Quick Actions + Guidelines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Quick Actions */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Quick Actions</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <button className="quick-action qa-cyan" onClick={() => navigate('/doctor/patients')}>
                <Users style={{ width: 16, height: 16, color: 'var(--brand-cyan)' }} />
                View My Patients
                <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
              </button>
              <button className="quick-action" onClick={() => navigate('/doctor/appointments')}>
                <Calendar style={{ width: 16, height: 16, color: 'var(--brand-purple-light)' }} />
                Manage Appointments
                <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
              </button>
              <button className="quick-action qa-emerald" onClick={() => navigate('/doctor/prescriptions')}>
                <FileText style={{ width: 16, height: 16, color: 'var(--brand-emerald)' }} />
                Issue Prescription
                <ArrowRight style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
              </button>
            </div>
          </div>

          {/* Clinical Guidelines */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Clinical Guidelines</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
              {[
                { icon: Shield, color: 'var(--brand-emerald)', text: 'Audit ML diagnostic metrics before issuing medications to high-risk patients.' },
                { icon: CheckCircle2, color: 'var(--brand-purple-light)', text: 'Mark appointments as "Completed" to notify patients and log session records.' },
                { icon: Activity, color: 'var(--brand-cyan)', text: 'Verify active allergies in patient profiles before writing electronic prescriptions.' },
              ].map(({ icon: Icon, color, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <Icon style={{ width: 15, height: 15, color, flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
