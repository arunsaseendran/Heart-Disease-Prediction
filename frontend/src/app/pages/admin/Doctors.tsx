import { useState } from 'react';
import { doctorApi } from '../../../lib/api';
import { Plus, Stethoscope, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const SPECIALIZATION_CHOICES = [
  { value: 'cardiologist', label: 'Cardiologist' },
  { value: 'general_physician', label: 'General Physician' },
  { value: 'internist', label: 'Internist' },
  { value: 'cardiac_surgeon', label: 'Cardiac Surgeon' },
  { value: 'electrophysiologist', label: 'Electrophysiologist' },
  { value: 'other', label: 'Other' },
];

export default function AdminDoctors() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Doctor onboarding form
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    specialization: 'cardiologist',
    license_number: '',
    experience_years: 5,
    hospital_name: 'HeartCare Medical Center',
    consultation_fee: 800,
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
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        specialization: 'cardiologist',
        license_number: '',
        experience_years: 5,
        hospital_name: 'HeartCare Medical Center',
        consultation_fee: 800,
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
        <h1 className="page-title">Onboard Clinicians</h1>
        <p className="page-subtitle">Register practitioner accounts, verify clinical licenses, and configure consultation settings</p>
      </div>

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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Onboarding Credentials Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-header">
            <Lock style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
            <h3 className="section-title">Access & Authentication</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Practitioner Username</label>
              <input 
                type="text" 
                value={form.username} 
                onChange={(e) => setForm({ ...form, username: e.target.value })} 
                placeholder="e.g. dr_jones"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Mail style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} /> 
                Professional Email
              </label>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                placeholder="e.g. jones@heartcare.com"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Password</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Professional Specialties Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-header">
            <Stethoscope style={{ width: 17, height: 17, color: 'var(--brand-cyan)' }} />
            <h3 className="section-title">Clinical Qualifications & Hospital Settings</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input 
                type="text" 
                value={form.first_name} 
                onChange={(e) => setForm({ ...form, first_name: e.target.value })} 
                placeholder="e.g. Alice"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input 
                type="text" 
                value={form.last_name} 
                onChange={(e) => setForm({ ...form, last_name: e.target.value })} 
                placeholder="e.g. Smith"
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Clinical Specialization</label>
              <select 
                value={form.specialization} 
                onChange={(e) => setForm({ ...form, specialization: e.target.value })} 
                className="form-select"
              >
                {SPECIALIZATION_CHOICES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">License Registry ID</label>
              <input 
                type="text" 
                value={form.license_number} 
                onChange={(e) => setForm({ ...form, license_number: e.target.value })} 
                placeholder="e.g. MC-10492"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Experience (Years)</label>
              <input 
                type="number" 
                value={form.experience_years} 
                onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} 
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Affiliated Hospital Center</label>
              <input 
                type="text" 
                value={form.hospital_name} 
                onChange={(e) => setForm({ ...form, hospital_name: e.target.value })} 
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Consultation Fee (INR)</label>
              <input 
                type="number" 
                value={form.consultation_fee} 
                onChange={(e) => setForm({ ...form, consultation_fee: parseFloat(e.target.value) || 0 })} 
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Onboarding */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ gap: 8 }}
          >
            {loading ? (
              <><div className="spinner spinner-white animate-spin" /> Provisioning Practitioner...</>
            ) : (
              <><Plus style={{ width: 16, height: 16 }} /> Provision Clinician Profile</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
