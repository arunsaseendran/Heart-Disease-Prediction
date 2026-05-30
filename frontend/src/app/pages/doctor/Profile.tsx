import { useState, useEffect } from 'react';
import { doctorApi, authApi } from '../../../lib/api';
import { useAuth } from '../../../lib/auth';
import { User, Stethoscope, Save, DollarSign, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const SPECIALIZATION_CHOICES = [
  { value: 'cardiologist', label: 'Cardiologist' },
  { value: 'general_physician', label: 'General Physician' },
  { value: 'internist', label: 'Internist' },
  { value: 'cardiac_surgeon', label: 'Cardiac Surgeon' },
  { value: 'electrophysiologist', label: 'Electrophysiologist' },
  { value: 'other', label: 'Other' },
];

export default function DoctorProfile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // User form details
  const [accountForm, setAccountForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  // Doctor profile details
  const [docProfile, setDocProfile] = useState({
    specialization: 'general_physician',
    license_number: '',
    experience_years: 0,
    hospital_name: '',
    consultation_fee: 500,
    bio: '',
    is_available: true,
  });

  // Availability schedule list (Mock list or from availability endpoint)
  const [availability, setAvailability] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setAccountForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });

      doctorApi.profile()
        .then((r) => setDocProfile(r.data))
        .catch(() => {});

      doctorApi.availability()
        .then((r) => setAvailability(r.data.results || r.data))
        .catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      // 1. Update Core User Details
      await authApi.updateProfile(accountForm);
      // 2. Update Doctor Profile Details
      await doctorApi.updateProfile(docProfile);
      
      await refreshUser();
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      <div>
        <h1 className="page-title">Profile & Schedule</h1>
        <p className="page-subtitle">Configure your clinic coordinates, licensing credentials, weekly calendar slots, and consultation fees</p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
          <span>Practitioner profile successfully updated and synchronized!</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Card 1: Account details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-header">
            <User style={{ width: 17, height: 17, color: 'var(--brand-cyan)' }} />
            <h3 className="section-title">Practitioner General Coordinates</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input 
                type="text" 
                value={accountForm.first_name} 
                onChange={(e) => setAccountForm({ ...accountForm, first_name: e.target.value })} 
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input 
                type="text" 
                value={accountForm.last_name} 
                onChange={(e) => setAccountForm({ ...accountForm, last_name: e.target.value })} 
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                value={accountForm.email} 
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })} 
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                value={accountForm.phone} 
                onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })} 
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Practitioner Specialization details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-header">
            <Stethoscope style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
            <h3 className="section-title">Medical Qualifications & Bio</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Clinical Specialization</label>
              <select 
                value={docProfile.specialization} 
                onChange={(e) => setDocProfile({ ...docProfile, specialization: e.target.value })} 
                className="form-select"
              >
                {SPECIALIZATION_CHOICES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">License Number ID</label>
              <input 
                type="text" 
                value={docProfile.license_number} 
                onChange={(e) => setDocProfile({ ...docProfile, license_number: e.target.value })} 
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Practice Experience (Years)</label>
              <input 
                type="number" 
                value={docProfile.experience_years} 
                onChange={(e) => setDocProfile({ ...docProfile, experience_years: parseInt(e.target.value) || 0 })} 
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
                value={docProfile.hospital_name} 
                onChange={(e) => setDocProfile({ ...docProfile, hospital_name: e.target.value })} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <DollarSign style={{ width: 10, height: 10, display: 'inline', marginRight: 2 }} />
                Consultation Fee (INR)
              </label>
              <input 
                type="number" 
                value={docProfile.consultation_fee} 
                onChange={(e) => setDocProfile({ ...docProfile, consultation_fee: parseFloat(e.target.value) || 0 })} 
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Biography (Bio Statement)</label>
            <textarea 
              value={docProfile.bio} 
              onChange={(e) => setDocProfile({ ...docProfile, bio: e.target.value })} 
              rows={3}
              placeholder="Draft your cardiac clinical background, surgery highlights, therapeutic specialities, and publications..."
              className="form-textarea"
            />
          </div>
        </div>

        {/* Availability Timing cards */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-header">
            <Calendar style={{ width: 17, height: 17, color: 'var(--brand-emerald)' }} />
            <h3 className="section-title">Weekly Calendar Schedule Availability</h3>
          </div>

          {availability.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No availability schedule configured. Standard platform availability is automatically Mon-Fri 09:00 - 17:00.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {availability.map((av) => (
                <div 
                  key={av.id} 
                  className="card card-sm"
                  style={{ 
                    padding: 14, 
                    display: 'flex', 
                    gap: 8, 
                    alignItems: 'center', 
                    background: 'rgba(255,255,255,0.01)', 
                    borderColor: 'var(--border-subtle)' 
                  }}
                >
                  <Clock style={{ width: 15, height: 15, color: 'var(--brand-cyan)' }} />
                  <div>
                    <strong style={{ fontSize: 12.5, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                      {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][av.day_of_week]}
                    </strong>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 3 }}>
                      {av.start_time.slice(0,5)} - {av.end_time.slice(0,5)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ gap: 8 }}
          >
            {loading ? (
              <><div className="spinner spinner-white animate-spin" /> Saving Coordinates...</>
            ) : (
              <><Save style={{ width: 15, height: 15 }} /> Synchronize Practice Profile</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
