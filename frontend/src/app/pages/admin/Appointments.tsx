import { useEffect, useState } from 'react';
import { appointmentApi } from '../../../lib/api';
import { Calendar, Clock, CheckCircle, AlertCircle, Filter, Stethoscope, User, RefreshCcw } from 'lucide-react';

const statusConfig: Record<string, { bg: string; color: string; label: string; border: string }> = {
  pending:   { bg: 'rgba(245,158,11,0.08)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)', label: 'Pending' },
  confirmed: { bg: 'rgba(6,182,212,0.08)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)', label: 'Confirmed' },
  rejected:  { bg: 'rgba(225,29,72,0.08)', color: '#fb7185', border: '1px solid rgba(225,29,72,0.2)', label: 'Rejected' },
  completed: { bg: 'rgba(16,185,129,0.08)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)', label: 'Completed' },
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    appointmentApi.adminAll()
      .then((r) => setAppointments(r.data.results || r.data))
      .catch(() => appointmentApi.list().then((r) => setAppointments(r.data.results || r.data)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? appointments : appointments.filter((a: any) => a.status === filter);

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Platform Consultations</h1>
          <p className="page-subtitle">Platform-wide overview, monitoring, and audit of medical appointments</p>
        </div>
        
        <button 
          onClick={load}
          className="btn btn-ghost btn-sm"
          style={{ height: 'fit-content' }}
        >
          <RefreshCcw style={{ width: 13, height: 13 }} />
          Refresh Registry
        </button>
      </div>

      {/* ── Metric Summary Grid ── */}
      {!loading && appointments.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--bg-layer2)', color: 'var(--text-muted)' }}>
              <Calendar style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div className="stat-label">Total Booked</div>
              <div className="stat-value">{appointments.length}</div>
              <div className="stat-sub">consultations</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.08)', color: '#fbbf24' }}>
              <Clock style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div className="stat-label">Pending Action</div>
              <div className="stat-value" style={{ color: '#fbbf24' }}>
                {appointments.filter(a => a.status === 'pending').length}
              </div>
              <div className="stat-sub">require response</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.08)', color: '#06b6d4' }}>
              <CheckCircle style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div className="stat-label">Confirmed</div>
              <div className="stat-value" style={{ color: '#22d3ee' }}>
                {appointments.filter(a => a.status === 'confirmed').length}
              </div>
              <div className="stat-sub">upcoming slots</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
              <CheckCircle style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div className="stat-label">Completed</div>
              <div className="stat-value" style={{ color: '#34d399' }}>
                {appointments.filter(a => a.status === 'completed').length}
              </div>
              <div className="stat-sub">finished visits</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Table & Filter Area ── */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Filter Controls Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter style={{ width: 15, height: 15, color: 'var(--brand-amber)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Filter Status:</span>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', 'pending', 'confirmed', 'completed', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: '1.5px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--t-fast)',
                  textTransform: 'capitalize',
                  fontFamily: 'inherit',
                  background: filter === f ? 'var(--brand-amber)' : 'var(--bg-layer2)',
                  borderColor: filter === f ? 'transparent' : 'var(--border-subtle)',
                  color: filter === f ? '#000' : 'var(--text-secondary)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 60, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <div className="empty-icon-wrap">
              <Calendar style={{ width: 24, height: 24 }} />
            </div>
            <div className="empty-title">No appointments found</div>
            <p className="empty-text">No consultation records match the selected status filter.</p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((apt: any) => {
                  const s = statusConfig[apt.status] || statusConfig.pending;
                  return (
                    <tr key={apt.id} className="table-row-hover">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'var(--bg-layer2)', border: '1px solid var(--border-subtle)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)'
                          }}>
                            {(apt.patient_name?.[0] || 'P').toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13.5 }}>
                              {apt.patient_name || `Patient #${apt.patient}`}
                            </div>
                            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>
                              PID: #{apt.patient}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Stethoscope style={{ width: 13, height: 13, color: 'var(--brand-cyan)' }} />
                          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Dr. {apt.doctor_name || `Doctor #${apt.doctor}`}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-primary)', fontWeight: 600 }}>
                            <Clock style={{ width: 12, height: 12, color: 'var(--brand-purple-light)' }} />
                            {new Date(apt.appointment_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 17 }}>
                            {apt.appointment_time || 'Pending Schedule'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{
                          color: 'var(--text-muted)', fontSize: 12.5,
                          maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }} title={apt.reason}>
                          {apt.reason || 'No clinical reason provided'}
                        </div>
                      </td>
                      <td>
                        <span 
                          className="badge" 
                          style={{ 
                            background: s.bg, 
                            color: s.color, 
                            borderColor: s.border 
                          }}
                        >
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
