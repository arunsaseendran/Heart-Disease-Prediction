import { useState, useEffect } from 'react';
import { doctorApi } from '../../../lib/api';
import {
  Plus, Stethoscope, Mail, Lock, CheckCircle, AlertCircle,
  Clock, UserCheck, RefreshCw,
} from 'lucide-react';
import StyledSelect from '../../components/StyledSelect';

const SPECIALIZATION_CHOICES = [
  { value: 'cardiologist', label: 'Cardiologist' },
  { value: 'general_physician', label: 'General Physician' },
  { value: 'internist', label: 'Internist' },
  { value: 'cardiac_surgeon', label: 'Cardiac Surgeon' },
  { value: 'electrophysiologist', label: 'Electrophysiologist' },
  { value: 'other', label: 'Other' },
];

export default function AdminDoctors() {
  const [activeTab, setActiveTab] = useState<'pending' | 'onboard'>('pending');

  // ── Pending Approval ─────────────────────────────
  const [pending, setPending] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [approving, setApproving] = useState<number | null>(null);
  const [approveSuccess, setApproveSuccess] = useState('');
  const [approveError, setApproveError] = useState('');
  // Per-doctor approval form state
  const [approvalForms, setApprovalForms] = useState<Record<number, {
    specialization: string; license_number: string; experience_years: number;
    hospital_name: string; consultation_fee: number;
  }>>({});

  const loadPending = () => {
    setPendingLoading(true);
    doctorApi.adminPending()
      .then((r) => {
        const docs: any[] = r.data.results || r.data;
        setPending(docs);
        // Initialise approval forms for each pending doctor
        const forms: typeof approvalForms = {};
        docs.forEach((d: any) => {
          forms[d.id] = {
            specialization: 'cardiologist',
            license_number: '',
            experience_years: 0,
            hospital_name: 'HeartCare Medical Center',
            consultation_fee: 800,
          };
        });
        setApprovalForms(forms);
      })
      .catch(() => {})
      .finally(() => setPendingLoading(false));
  };

  useEffect(() => { loadPending(); }, []);

  const handleApprove = async (userId: number) => {
    setApproving(userId);
    setApproveSuccess('');
    setApproveError('');
    const formData = approvalForms[userId] || {};
    try {
      await doctorApi.adminApprove(userId, {
        specialization: formData.specialization || 'cardiologist',
        license_number: formData.license_number || `LIC-${userId}`,
        experience_years: formData.experience_years || 0,
        hospital_name: formData.hospital_name || 'HeartCare Medical Center',
        consultation_fee: formData.consultation_fee || 800,
      });
      setApproveSuccess('Doctor approved successfully! They are now visible in the appointment booking list.');
      loadPending();
    } catch (err: any) {
      const d = err.response?.data;
      const msg = typeof d === 'string' ? d : Object.values(d || {}).flat().join(' ');
      setApproveError(msg || 'Failed to approve the doctor.');
    } finally {
      setApproving(null);
    }
  };

  const updateApprovalForm = (userId: number, field: string, value: string | number) => {
    setApprovalForms((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  };

  // ── Onboard (Create) ──────────────────────────────
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    first_name: '', last_name: '',
    specialization: 'cardiologist', license_number: '',
    experience_years: 5, hospital_name: 'HeartCare Medical Center', consultation_fee: 800,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');
    try {
      await doctorApi.adminCreate(form);
      setSuccess(true);
      setForm({
        username: '', email: '', password: '',
        first_name: '', last_name: '',
        specialization: 'cardiologist', license_number: '',
        experience_years: 5, hospital_name: 'HeartCare Medical Center', consultation_fee: 800,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const d = err.response?.data;
      const msg = typeof d === 'string' ? d : Object.values(d || {}).flat().join(' ');
      setError(msg || 'Failed to register the medical practitioner account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      <div>
        <h1 className="page-title">Doctor Management</h1>
        <p className="page-subtitle">Approve registered practitioners and onboard new clinicians to the platform</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 6, background: 'var(--bg-layer1)', padding: 4, borderRadius: 'var(--radius-lg)', width: 'fit-content', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '8px 20px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, transition: 'all 0.18s',
            background: activeTab === 'pending' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'pending' ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: activeTab === 'pending' ? 'var(--shadow-xs)' : 'none',
            display: 'flex', alignItems: 'center', gap: 7,
          }}
        >
          <Clock style={{ width: 14, height: 14 }} />
          Pending Approval
          {pending.length > 0 && (
            <span style={{
              background: 'var(--brand-amber)', color: '#fff',
              fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 99,
              marginLeft: 2,
            }}>
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('onboard')}
          style={{
            padding: '8px 20px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, transition: 'all 0.18s',
            background: activeTab === 'onboard' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'onboard' ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: activeTab === 'onboard' ? 'var(--shadow-xs)' : 'none',
            display: 'flex', alignItems: 'center', gap: 7,
          }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          Onboard Clinician
        </button>
      </div>

      {/* ── Tab: Pending Approval ───────────────────── */}
      {activeTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Doctors who self-registered are listed below. Review and approve them to make them visible in appointment booking.
            </p>
            <button onClick={loadPending} className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
              <RefreshCw style={{ width: 13, height: 13 }} /> Refresh
            </button>
          </div>

          {approveSuccess && (
            <div className="alert alert-success">
              <CheckCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
              <span>{approveSuccess}</span>
            </div>
          )}
          {approveError && (
            <div className="alert alert-error">
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
              <span>{approveError}</span>
            </div>
          )}

          {pendingLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-xl)' }} />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <div className="empty-state" style={{ padding: '56px 24px' }}>
              <div className="empty-icon-wrap">
                <UserCheck style={{ width: 24, height: 24 }} />
              </div>
              <div className="empty-title">No Pending Approvals</div>
              <p className="empty-text">All registered doctor accounts have been approved.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pending.map((doc) => {
                const form = approvalForms[doc.id] || { specialization: 'cardiologist', license_number: '', experience_years: 0, hospital_name: 'HeartCare Medical Center', consultation_fee: 800 };
                return (
                  <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Doctor identity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 'var(--radius-md)',
                          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.06))',
                          border: '1px solid rgba(245,158,11,0.25)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: 16, color: '#d97706',
                        }}>
                          {(doc.first_name?.[0] || doc.username?.[0] || 'D').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text-primary)' }}>
                            {doc.first_name || doc.last_name ? `${doc.first_name} ${doc.last_name}`.trim() : doc.username}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                            @{doc.username} · {doc.email}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-amber">Pending Approval</span>
                    </div>

                    {/* Approval configuration form */}
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                        Set Clinical Details Before Approval
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                        <div className="form-group">
                          <label className="form-label">Specialization</label>
                          <StyledSelect
                            value={form.specialization}
                            onChange={(v) => updateApprovalForm(doc.id, 'specialization', v)}
                            options={SPECIALIZATION_CHOICES}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">License Number</label>
                          <input
                            type="text"
                            value={form.license_number}
                            onChange={(e) => updateApprovalForm(doc.id, 'license_number', e.target.value)}
                            placeholder={`LIC-${doc.id}`}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Experience (Yrs)</label>
                          <input
                            type="number"
                            value={form.experience_years}
                            onChange={(e) => updateApprovalForm(doc.id, 'experience_years', parseInt(e.target.value) || 0)}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Hospital</label>
                          <input
                            type="text"
                            value={form.hospital_name}
                            onChange={(e) => updateApprovalForm(doc.id, 'hospital_name', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Fee (INR)</label>
                          <input
                            type="number"
                            value={form.consultation_fee}
                            onChange={(e) => updateApprovalForm(doc.id, 'consultation_fee', parseFloat(e.target.value) || 0)}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleApprove(doc.id)}
                        disabled={approving === doc.id}
                        className="btn btn-emerald btn-sm"
                        style={{ gap: 7 }}
                      >
                        {approving === doc.id ? (
                          <><div className="spinner spinner-white spinner-sm animate-spin" /> Approving...</>
                        ) : (
                          <><UserCheck style={{ width: 14, height: 14 }} /> Approve Doctor</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Onboard Clinician ───────────────────── */}
      {activeTab === 'onboard' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {success && (
            <div className="alert alert-success">
              <CheckCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
              <span>Doctor account successfully provisioned and synchronised on the platform!</span>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Credentials Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="section-header">
              <Lock style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
              <h3 className="section-title">Access &amp; Authentication</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Practitioner Username</label>
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Enter username" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Mail style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />
                  Professional Email
                </label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email address" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="form-input" required />
              </div>
            </div>
          </div>

          {/* Clinical Details Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="section-header">
              <Stethoscope style={{ width: 17, height: 17, color: 'var(--brand-cyan)' }} />
              <h3 className="section-title">Clinical Qualifications &amp; Hospital Settings</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="Enter first name" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Enter last name" className="form-input" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Clinical Specialization</label>
                <StyledSelect
                  value={form.specialization}
                  onChange={(v) => setForm({ ...form, specialization: v })}
                  options={SPECIALIZATION_CHOICES}
                />
              </div>
              <div className="form-group">
                <label className="form-label">License Registry ID</label>
                <input type="text" value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} placeholder="e.g. MC-10492" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} className="form-input" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Affiliated Hospital Center</label>
                <input type="text" value={form.hospital_name} onChange={(e) => setForm({ ...form, hospital_name: e.target.value })} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fee (INR)</label>
                <input type="number" value={form.consultation_fee} onChange={(e) => setForm({ ...form, consultation_fee: parseFloat(e.target.value) || 0 })} className="form-input" required />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ gap: 8 }}>
              {loading ? (
                <><div className="spinner spinner-white animate-spin" /> Provisioning Practitioner...</>
              ) : (
                <><Plus style={{ width: 16, height: 16 }} /> Provision Clinician Profile</>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
