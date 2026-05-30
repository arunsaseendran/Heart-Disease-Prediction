import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth';
import { patientApi, authApi } from '../../../lib/api';
import { User, Shield, Phone, Heart, Award, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PatientProfile() {
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
    gender: 'other',
    date_of_birth: '',
    address: '',
  });

  // Clinical profile details
  const [clinicalForm, setClinicalForm] = useState({
    blood_group: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: '',
    current_medications: '',
  });

  useEffect(() => {
    if (user) {
      setAccountForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'other',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
      });
      
      patientApi.profile()
        .then((r) => {
          const d = r.data;
          setClinicalForm({
            blood_group: d.blood_group || '',
            emergency_contact_name: d.emergency_contact_name || '',
            emergency_contact_phone: d.emergency_contact_phone || '',
            medical_history: d.medical_history || '',
            allergies: d.allergies || '',
            current_medications: d.current_medications || '',
          });
        })
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
      // 2. Update Patient Profile Details
      await patientApi.updateProfile(clinicalForm);
      
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
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-subtitle">Manage your personal details, emergency contacts, and active medical indicators</p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
          <span>Profile coordinates successfully updated and synchronized!</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Card 1: Account Identifiers */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-header">
            <User style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
            <h3 className="section-title">General Account Identifiers</h3>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Biological Gender</label>
              <select 
                value={accountForm.gender} 
                onChange={(e) => setAccountForm({ ...accountForm, gender: e.target.value })} 
                className="form-select"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input 
                type="date" 
                value={accountForm.date_of_birth} 
                onChange={(e) => setAccountForm({ ...accountForm, date_of_birth: e.target.value })} 
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Home Address</label>
            <textarea 
              value={accountForm.address} 
              onChange={(e) => setAccountForm({ ...accountForm, address: e.target.value })} 
              rows={2}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Card 2: Clinical Metrics & Medical Context */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-header">
            <Shield style={{ width: 17, height: 17, color: 'var(--brand-cyan)' }} />
            <h3 className="section-title">Clinical History & Parameters</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <input 
                type="text" 
                value={clinicalForm.blood_group} 
                onChange={(e) => setClinicalForm({ ...clinicalForm, blood_group: e.target.value })} 
                placeholder="e.g. O+, A-"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Phone style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />
                Emergency Contact Name
              </label>
              <input 
                type="text" 
                value={clinicalForm.emergency_contact_name} 
                onChange={(e) => setClinicalForm({ ...clinicalForm, emergency_contact_name: e.target.value })} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Phone style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />
                Emergency Phone Number
              </label>
              <input 
                type="text" 
                value={clinicalForm.emergency_contact_phone} 
                onChange={(e) => setClinicalForm({ ...clinicalForm, emergency_contact_phone: e.target.value })} 
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">
                <Heart style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />
                Cardiovascular History
              </label>
              <textarea 
                value={clinicalForm.medical_history} 
                onChange={(e) => setClinicalForm({ ...clinicalForm, medical_history: e.target.value })} 
                placeholder="e.g. Chronic Hypertension, family cardiac disorders, previous chest surgery details..."
                className="form-textarea"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Award style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />
                Allergies & Sensitivities
              </label>
              <textarea 
                value={clinicalForm.allergies} 
                onChange={(e) => setClinicalForm({ ...clinicalForm, allergies: e.target.value })} 
                placeholder="e.g. Penicillin, latex, particular foods, contrast dye..."
                className="form-textarea"
                rows={3}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Active Cardiovascular Therapy Medications</label>
            <textarea 
              value={clinicalForm.current_medications} 
              onChange={(e) => setClinicalForm({ ...clinicalForm, current_medications: e.target.value })} 
              placeholder="e.g. Aspirin 75mg once daily, Atorvastatin 20mg at night..."
              className="form-textarea"
              rows={2}
            />
          </div>
        </div>

        {/* Form Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ gap: 8 }}
          >
            {loading ? (
              <><div className="spinner spinner-white animate-spin" /> Saving Account Details...</>
            ) : (
              <><Save style={{ width: 15, height: 15 }} /> Synchronize Account</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
