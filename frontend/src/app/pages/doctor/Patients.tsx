import { useState, useEffect } from 'react';
import { doctorApi } from '../../../lib/api';
import { Users, Heart, Clipboard, Phone, Shield, Search, RefreshCcw } from 'lucide-react';

export default function DoctorPatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = () => {
    setLoading(true);
    doctorApi.myPatients()
      .then((r) => setPatients(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const filtered = patients.filter((p: any) => {
    const name = (p.patient_name || '').toLowerCase();
    const username = (p.user_username || '').toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || username.includes(query);
  });

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Patient Registry</h1>
          <p className="page-subtitle">Monitor clinical histories, active prescriptions, and emergency vitals for your linked patients</p>
        </div>

        <button 
          onClick={loadData}
          className="btn btn-ghost btn-sm"
        >
          <RefreshCcw style={{ width: 13, height: 13 }} />
          Refresh Registry
        </button>
      </div>

      {/* Roster Controls */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users style={{ width: 16, height: 16, color: 'var(--brand-cyan)' }} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-secondary)' }}>Total Roster: {patients.length} Patient{patients.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="search-bar" style={{ width: '100%', maxWidth: 300 }}>
          <Search style={{ width: 14, height: 14, color: 'var(--text-faint)' }} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient profiles..."
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <div className="empty-icon-wrap">
            <Users style={{ width: 28, height: 28 }} />
          </div>
          <div className="empty-title">No patients found</div>
          <p className="empty-text">No registered patients in your roster match the search criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map((p) => (
            <div 
              key={p.id}
              className="card card-hover"
              style={{ 
                padding: '24px 28px',
                display: 'flex', 
                flexDirection: 'column', 
                gap: 16 
              }}
            >
              {/* Profile Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ 
                    width: 34, 
                    height: 34, 
                    borderRadius: 'var(--radius-sm)', 
                    background: 'rgba(6,182,212,0.12)', 
                    color: 'var(--brand-cyan)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: 14,
                    border: '1px solid rgba(6,182,212,0.2)'
                  }}>
                    {(p.patient_name?.[0] || 'P').toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {p.patient_name || `Patient #${p.id}`}
                    </h3>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      PID: #{p.id} · Active Profile
                    </span>
                  </div>
                </div>

                {p.blood_group && (
                  <span className="badge badge-rose" style={{ fontSize: 10 }}>
                    {p.blood_group}
                  </span>
                )}
              </div>

              {/* Patient Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                
                {/* Emergency Contact */}
                {p.emergency_contact_name && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                    <Phone style={{ width: 13, height: 13, color: 'var(--brand-cyan)', flexShrink: 0 }} />
                    <span>Emergency: <strong style={{ color: 'var(--text-primary)' }}>{p.emergency_contact_name} ({p.emergency_contact_phone || 'N/A'})</strong></span>
                  </div>
                )}

                {/* Medical History */}
                {p.medical_history && (
                  <div style={{ display: 'flex', gap: 6, color: 'var(--text-secondary)' }}>
                    <Clipboard style={{ width: 13, height: 13, color: 'var(--brand-purple-light)', flexShrink: 0, marginTop: 2 }} />
                    <span>Clinical History: <span style={{ color: 'var(--text-primary)' }}>{p.medical_history}</span></span>
                  </div>
                )}

                {/* Allergies */}
                {p.allergies && (
                  <div style={{ display: 'flex', gap: 6, color: 'var(--text-secondary)' }}>
                    <Shield style={{ width: 13, height: 13, color: 'var(--brand-rose)', flexShrink: 0, marginTop: 2 }} />
                    <span>Allergen Warning: <span style={{ color: 'var(--brand-rose)', fontWeight: 700 }}>{p.allergies}</span></span>
                  </div>
                )}

                {/* Medications */}
                {p.current_medications && (
                  <div style={{ 
                    display: 'flex', 
                    gap: 6, 
                    color: 'var(--text-secondary)', 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--border-subtle)', 
                    padding: '10px 14px', 
                    borderRadius: 'var(--radius-sm)', 
                    marginTop: 4 
                  }}>
                    <Heart style={{ width: 13, height: 13, color: 'var(--brand-rose)', flexShrink: 0, marginTop: 2 }} />
                    <span>Active Therapies: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p.current_medications}</span></span>
                  </div>
                )}

              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
