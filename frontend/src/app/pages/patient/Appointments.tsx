import { useState, useEffect } from 'react';
import { appointmentApi, doctorApi } from '../../../lib/api';
import { Calendar, Clock, AlertCircle, CheckCircle, Video, ClipboardList } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const statusConfig: Record<string, { bg: string; color: string; label: string; border: string }> = {
  pending:   { bg: 'rgba(245, 158, 11, 0.08)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)', label: 'Pending Approval' },
  confirmed: { bg: 'rgba(6, 182, 212, 0.08)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.2)', label: 'Confirmed' },
  rejected:  { bg: 'rgba(225, 29, 72, 0.08)', color: '#fb7185', border: '1px solid rgba(225, 29, 72, 0.2)', label: 'Rejected' },
  completed: { bg: 'rgba(16, 185, 129, 0.08)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', label: 'Completed' },
  cancelled: { bg: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', label: 'Cancelled' },
};

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Booking Form State
  const [form, setForm] = useState({
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      appointmentApi.list(),
      doctorApi.list()
    ])
      .then(([aptRes, docRes]) => {
        setAppointments(aptRes.data.results || aptRes.data);
        setDoctors(docRes.data.results || docRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await appointmentApi.create({
        doctor: parseInt(form.doctor_id),
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        reason: form.reason
      });
      setSuccess(true);
      setForm({ doctor_id: '', appointment_date: '', appointment_time: '', reason: '' });
      // Reload appointments list
      appointmentApi.list().then((r) => setAppointments(r.data.results || r.data));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to book the appointment. Please check availability.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32 }} className="stagger">
      
      {/* Column 1: Book New Appointment */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="page-title">Consultations</h1>
          <p className="page-subtitle">Schedule an online telehealth or physical clinic cardiovascular consultation</p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-header" style={{ marginBottom: 4 }}>
            <Calendar style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
            <h3 className="section-title">New Appointment Request</h3>
          </div>

          {success && (
            <div className="alert alert-success">
              <CheckCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 2 }} />
              <span>Appointment requested successfully! Pending doctor review.</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Select Specialist</label>
              <Select
                value={String(form.doctor_id)}
                onValueChange={(v) => setForm({ ...form, doctor_id: v })}
                required
              >
                <SelectTrigger className="form-select">
                  <SelectValue placeholder="-- Choose Cardiologist --" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.id} value={String(doc.id)}>
                      Dr. {doc.user?.first_name ? `${doc.user.first_name} ${doc.user.last_name || ''}`.trim() : (doc.user?.username || 'Unknown')} ({doc.specialization_display || doc.specialization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Select Date</label>
                <input
                  type="date"
                  value={form.appointment_date}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Time</label>
                <input
                  type="time"
                  value={form.appointment_time}
                  onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Consultation</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Describe your cardiovascular concerns, e.g. chest tighting, follow-up diagnostics, or general health assessment..."
                className="form-textarea"
                rows={3}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-full"
              style={{ marginTop: 6 }}
            >
              {submitting ? (
                <><div className="spinner spinner-white animate-spin" /> Submitting Request...</>
              ) : (
                <>Schedule Appointment</>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Column 2: Scheduled Appointments Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h2 className="page-title">Appointment Registry</h2>
          <p className="page-subtitle">Track dates, clinician approvals, and diagnostic remarks</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 110, borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <div className="empty-icon-wrap">
              <Calendar style={{ width: 24, height: 24 }} />
            </div>
            <div className="empty-title">No Consultations scheduled</div>
            <p className="empty-text">You have not scheduled any appointments yet. Request one on the left.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {appointments.map((apt) => {
              const status = statusConfig[apt.status] || statusConfig.pending;
              return (
                <div key={apt.id} className="apt-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ 
                        width: 34, 
                        height: 34, 
                        borderRadius: 'var(--radius-sm)', 
                        background: 'rgba(6,182,212,0.1)', 
                        color: 'var(--brand-cyan)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 800,
                        border: '1px solid rgba(6,182,212,0.2)'
                      }}>
                        {(apt.doctor_name?.[0] || 'D').toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                          Dr. {apt.doctor_name || `Doctor #${apt.doctor}`}
                        </h4>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                          Cardiologist
                        </span>
                      </div>
                    </div>
                    <span 
                      className="badge" 
                      style={{ 
                        background: status.bg, 
                        color: status.color, 
                        borderColor: status.border,
                        fontSize: 10
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1.2fr 1fr', 
                    gap: 10, 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: 12, 
                    fontSize: 12.5 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                      <Clock style={{ width: 13, height: 13, color: 'var(--brand-purple-light)' }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {new Date(apt.appointment_date + 'T' + apt.appointment_time).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                      <Video style={{ width: 13, height: 13, color: 'var(--brand-cyan)' }} />
                      <span style={{ fontWeight: 600 }}>{apt.appointment_time} · Telehealth</span>
                    </div>
                  </div>

                  {apt.reason && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.45, display: 'flex', gap: 6 }}>
                      <ClipboardList style={{ width: 12, height: 12, flexShrink: 0, marginTop: 2, color: 'var(--brand-purple-light)' }} />
                      <span>Reason: <span style={{ color: 'var(--text-secondary)' }}>{apt.reason}</span></span>
                    </div>
                  )}

                  {apt.doctor_notes && (
                    <div style={{ fontSize: 12, color: '#34d399', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', lineHeight: 1.45 }}>
                      <strong style={{ fontWeight: 700 }}>Clinician Notes:</strong> {apt.doctor_notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
