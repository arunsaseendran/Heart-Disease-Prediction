import { useState, useEffect } from 'react';
import { doctorApi } from '../../../lib/api';
import { FileText, Plus, Calendar, ClipboardList, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    patient_id: '',
    diagnosis: '',
    medications: '',
    dosage_instructions: '',
    notes: '',
    recommended_tests: '',
    follow_up_date: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      doctorApi.prescriptions().catch(() => ({ data: [] })),
      doctorApi.myPatients().catch(() => ({ data: [] }))
    ])
      .then(([rxRes, ptRes]) => {
        setPrescriptions(rxRes.data.results || rxRes.data);
        setPatients(ptRes.data.results || ptRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await doctorApi.addPrescription({
        patient: parseInt(form.patient_id),
        diagnosis: form.diagnosis,
        medications: form.medications,
        dosage_instructions: form.dosage_instructions,
        notes: form.notes,
        recommended_tests: form.recommended_tests,
        follow_up_date: form.follow_up_date || null,
      });

      setSuccess(true);
      setForm({
        patient_id: '',
        diagnosis: '',
        medications: '',
        dosage_instructions: '',
        notes: '',
        recommended_tests: '',
        follow_up_date: '',
      });

      // Reload prescriptions
      doctorApi.prescriptions().then(r => setPrescriptions(r.data.results || r.data));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to file the clinical prescription. Please ensure active patient select.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }} className="stagger">
      
      {/* Column 1: Add New Prescription */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="page-title">Issue Prescription (Rx)</h1>
          <p className="page-subtitle">File medications, dosages, clinical diagnostics, and recovery guidelines for your patients</p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-header" style={{ marginBottom: 4 }}>
            <Plus style={{ width: 17, height: 17, color: 'var(--brand-cyan)' }} />
            <h3 className="section-title">New Clinical Rx Entry</h3>
          </div>

          {success && (
            <div className="alert alert-success">
              <CheckCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 2 }} />
              <span>Digital prescription successfully filed and logged in patient portal!</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Select Patient</label>
                <select
                  value={form.patient_id}
                  onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.patient_name || `Patient #${p.id}`} (Blood: {p.blood_group || 'N/A'})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Follow-Up Date</label>
                <input
                  type="date"
                  value={form.follow_up_date}
                  onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Diagnosis Summary</label>
              <textarea
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="e.g. Atypical chest tightening, elevated lipid profiles, and cardiovascular hazard threshold detected..."
                className="form-textarea"
                rows={2}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Therapies & Medications</label>
                <textarea
                  value={form.medications}
                  onChange={(e) => setForm({ ...form, medications: e.target.value })}
                  placeholder="e.g. Aspirin 75mg once daily&#10;Atorvastatin 20mg at night"
                  className="form-textarea"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dosage Instructions</label>
                <textarea
                  value={form.dosage_instructions}
                  onChange={(e) => setForm({ ...form, dosage_instructions: e.target.value })}
                  placeholder="e.g. Take Aspirin with breakfast, and Atorvastatin strictly before sleeping with warm water."
                  className="form-textarea"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Recommended Diagnostic Tests</label>
              <input
                type="text"
                value={form.recommended_tests}
                onChange={(e) => setForm({ ...form, recommended_tests: e.target.value })}
                placeholder="e.g. Lipid Profile, 12-lead Electrocardiogram (ECG), Stress echocardiography"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Clinical Guidelines</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Lifestyle guidelines, diet changes, sodium restrictions, cardiorespiratory exercise protocols..."
                className="form-textarea"
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-full"
              style={{ marginTop: 6 }}
            >
              {submitting ? (
                <><div className="spinner spinner-white animate-spin" /> Issuing Digital Rx...</>
              ) : (
                <>Issue Prescription (Sign Rx)</>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Column 2: Prescription Registry Log */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h2 className="page-title">Digital Rx History</h2>
          <p className="page-subtitle">Track previously compiled and signed patient clinical records</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 110, borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 20px' }}>
            <div className="empty-icon-wrap">
              <FileText style={{ width: 28, height: 28 }} />
            </div>
            <div className="empty-title">No prescriptions found</div>
            <p className="empty-text">You have not issued any prescriptions on this platform yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '80vh', overflowY: 'auto' }}>
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="card"
                style={{ padding: 20 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 800 }}>
                    Rx ID Reference: #{rx.id}
                  </span>
                  <span className="info-chip" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                    <Calendar style={{ width: 11, height: 11 }} />
                    {new Date(rx.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: 'var(--radius-sm)', 
                    background: 'rgba(124,58,237,0.12)', 
                    color: 'var(--brand-purple-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: 12,
                    border: '1px solid rgba(124,58,237,0.2)'
                  }}>
                    {(rx.patient_name?.[0] || 'P').toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 13.5, fontWeight: 750, color: 'var(--text-primary)', margin: 0 }}>
                      {rx.patient_name || `Patient #${rx.patient}`}
                    </h4>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    <strong>Diagnosis:</strong> <span style={{ color: 'var(--text-primary)' }}>{rx.diagnosis}</span>
                  </div>

                  <div style={{ 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--border-subtle)', 
                    padding: '10px 14px', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: 12, 
                    lineHeight: 1.45 
                  }}>
                    <strong style={{ color: 'var(--brand-cyan)' }}>Medications & Dosages:</strong>
                    <div style={{ color: 'var(--text-primary)', marginTop: 4, whiteSpace: 'pre-line' }}>{rx.medications}</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 4, fontStyle: 'italic' }}>{rx.dosage_instructions}</div>
                  </div>

                  {rx.follow_up_date && (
                    <div style={{ fontSize: 11, color: 'var(--brand-purple-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar style={{ width: 11, height: 11 }} />
                      Follow-Up Scheduled: {new Date(rx.follow_up_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
