import { useState, useEffect } from 'react';
import { appointmentApi } from '../../../lib/api';
import { Calendar, Clock, Check, X, ClipboardList, CheckCircle2, MessageSquare } from 'lucide-react';

const statusConfig: Record<string, { bg: string; color: string; label: string; border: string }> = {
  pending:   { bg: 'rgba(245, 158, 11, 0.08)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)', label: 'Requested' },
  confirmed: { bg: 'rgba(6, 182, 212, 0.08)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.2)', label: 'Confirmed' },
  rejected:  { bg: 'rgba(225, 29, 72, 0.08)', color: '#fb7185', border: '1px solid rgba(225, 29, 72, 0.2)', label: 'Rejected' },
  completed: { bg: 'rgba(16, 185, 129, 0.08)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', label: 'Completed' },
  cancelled: { bg: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', label: 'Cancelled' },
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [actioningId, setActioningId] = useState<number | null>(null);

  const loadData = () => {
    setLoading(true);
    appointmentApi.list()
      .then((r) => setAppointments(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleAction = (id: number, action: 'confirm' | 'reject' | 'complete') => {
    setActioningId(id);
    const text = notes[id] || '';
    
    appointmentApi.action(id, { action, notes: text })
      .then(() => {
        // Update list status locally
        const statusMap = { confirm: 'confirmed', reject: 'rejected', complete: 'completed' };
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: statusMap[action], doctor_notes: text } : a));
      })
      .catch(() => alert('Failed to execute appointment action.'))
      .finally(() => setActioningId(null));
  };

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      <div>
        <h1 className="page-title">Consultations Registry</h1>
        <p className="page-subtitle">Confirm consultation requests, write medical remarks, and log completed clinical sessions</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <div className="empty-icon-wrap">
            <Calendar style={{ width: 28, height: 28 }} />
          </div>
          <div className="empty-title">No consultations scheduled</div>
          <p className="empty-text">You do not have any patient appointment requests booked yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {appointments.map((apt) => {
            const status = statusConfig[apt.status] || statusConfig.pending;
            const isPending = apt.status === 'pending';
            const isConfirmed = apt.status === 'confirmed';
            
            return (
              <div 
                key={apt.id}
                className="apt-card"
                style={{ padding: '24px 28px' }}
              >
                
                {/* Row 1: Patient details and Status badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 'var(--radius-sm)', 
                      background: 'rgba(124,58,237,0.12)', 
                      color: 'var(--brand-purple-light)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 800, 
                      fontSize: 15,
                      border: '1px solid rgba(124,58,237,0.2)'
                    }}>
                      {(apt.patient_name?.[0] || 'P').toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {apt.patient_name || `Patient #${apt.patient}`}
                      </h3>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                        PID: #{apt.patient} · Cardiac Care Profile
                      </span>
                    </div>
                  </div>

                  <span 
                    className="badge"
                    style={{ 
                      background: status.bg, 
                      color: status.color, 
                      borderColor: status.border,
                      fontSize: 11
                    }}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Row 2: Vitals date time reason */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: 16, 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: 16, 
                  fontSize: 13 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                    <Clock style={{ width: 14, height: 14, color: 'var(--brand-purple-light)' }} />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                      {new Date(apt.appointment_date + 'T00:00:00').toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      {' · '}
                      {apt.appointment_time}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                    <ClipboardList style={{ width: 14, height: 14, color: 'var(--brand-cyan)' }} />
                    <span>Reason: <strong style={{ color: 'var(--text-primary)' }}>"{apt.reason}"</strong></span>
                  </div>
                </div>

                {/* Notes Input / Status Display */}
                {isPending || isConfirmed ? (
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2px 14px' }}>
                      <MessageSquare style={{ width: 14, height: 14, color: 'var(--text-faint)' }} />
                      <input 
                        type="text" 
                        value={notes[apt.id] || ''}
                        onChange={(e) => setNotes({ ...notes, [apt.id]: e.target.value })}
                        placeholder="Write medical advice, prescription remarks, or consult notes..."
                        style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, padding: '10px 0', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {isPending && (
                        <>
                          <button 
                            onClick={() => handleAction(apt.id, 'confirm')}
                            disabled={actioningId === apt.id}
                            className="btn btn-cyan btn-sm"
                            style={{ gap: 4 }}
                          >
                            <Check style={{ width: 14, height: 14 }} /> Confirm
                          </button>
                          <button 
                            onClick={() => handleAction(apt.id, 'reject')}
                            disabled={actioningId === apt.id}
                            className="btn btn-danger btn-sm"
                            style={{ gap: 4 }}
                          >
                            <X style={{ width: 14, height: 14 }} /> Reject
                          </button>
                        </>
                      )}
                      {isConfirmed && (
                        <button 
                          onClick={() => handleAction(apt.id, 'complete')}
                          disabled={actioningId === apt.id}
                          className="btn btn-emerald btn-sm"
                          style={{ gap: 4 }}
                        >
                          <CheckCircle2 style={{ width: 14, height: 14 }} /> Complete Consultation
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  apt.doctor_notes && (
                    <div style={{ fontSize: 12.5, color: '#34d399', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', lineHeight: 1.5 }}>
                      <strong>Clinician Consultation Remarks:</strong> "{apt.doctor_notes}"
                    </div>
                  )
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
