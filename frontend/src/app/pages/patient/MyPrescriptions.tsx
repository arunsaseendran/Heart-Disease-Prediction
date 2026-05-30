import { useState, useEffect } from 'react';
import { doctorApi } from '../../../lib/api';
import { FileText, Calendar, Plus, Heart, Clipboard, Clock, RefreshCcw } from 'lucide-react';

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    doctorApi.myPrescriptions()
      .then((r) => setPrescriptions(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Digital Prescriptions</h1>
          <p className="page-subtitle">Direct clinical instructions, medical therapies, and follow-up schedules issued by your cardiologists</p>
        </div>

        <button 
          onClick={loadData}
          className="btn btn-ghost btn-sm"
        >
          <RefreshCcw style={{ width: 13, height: 13 }} />
          Refresh Vault
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <div className="empty-icon-wrap">
            <FileText style={{ width: 28, height: 28 }} />
          </div>
          <div className="empty-title">No prescriptions found</div>
          <p className="empty-text">You do not have any digital prescriptions filed on this portal yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {prescriptions.map((rx) => (
            <div 
              key={rx.id} 
              className="card card-hover"
              style={{ 
                padding: '32px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 20 
              }}
            >
              
              {/* Rx Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ 
                      width: 26, 
                      height: 26, 
                      borderRadius: 'var(--radius-xs)', 
                      background: 'rgba(6,182,212,0.12)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid rgba(6,182,212,0.2)'
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--brand-cyan)' }}>Rx</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Prescription Registry: #{rx.id}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8, marginBottom: 4 }}>
                    Dr. {rx.doctor_name || `Cardiologist #${rx.doctor}`}
                  </h3>
                  <span className="badge badge-cyan" style={{ fontSize: 9.5 }}>
                    {rx.doctor_specialization || 'Cardiovascular Specialist'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div className="info-chip" style={{ fontSize: 11.5, padding: '4px 10px' }}>
                    <Calendar style={{ width: 12, height: 12 }} />
                    Issued: {new Date(rx.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </div>
                  {rx.follow_up_date && (
                    <span className="badge badge-purple" style={{ fontSize: 10 }}>
                      Follow-up: {new Date(rx.follow_up_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Rx Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                
                {/* Medications Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <Plus style={{ width: 13, height: 13, color: 'var(--brand-cyan)' }} /> 
                    Active Medications
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 18, minHeight: 90 }}>
                    <p style={{ fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: 1.6, fontWeight: 600 }}>
                      {rx.medications}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginTop: 4 }}>
                    <Clock style={{ width: 13, height: 13, color: 'var(--brand-purple-light)' }} /> 
                    Dosage & Directions
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(255,255,255,0.005)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                    {rx.dosage_instructions}
                  </p>
                </div>

                {/* Diagnostics and Notes Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                      <Clipboard style={{ width: 13, height: 13, color: 'var(--brand-purple-light)' }} /> 
                      Diagnosis Summary
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 'var(--radius-md)', padding: 14, fontWeight: 600 }}>
                      {rx.diagnosis}
                    </p>
                  </div>

                  {rx.recommended_tests && (
                    <div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
                        Recommended Clinical Tests
                      </div>
                      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(255,255,255,0.005)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                        {rx.recommended_tests}
                      </p>
                    </div>
                  )}

                  {rx.notes && (
                    <div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>
                        Special Practitioner Guidance
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, paddingLeft: 6 }}>
                        “ {rx.notes} ”
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
