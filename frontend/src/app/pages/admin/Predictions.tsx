import { useState, useEffect } from 'react';
import { predictionApi } from '../../../lib/api';
import { Activity, ShieldAlert, Heart, Calendar, Cpu, Clock, RefreshCcw } from 'lucide-react';

const riskConfig: Record<string, { bg: string; color: string; label: string; border: string }> = {
  low: { 
    bg: 'rgba(16, 185, 129, 0.08)', 
    border: '1px solid rgba(16, 185, 129, 0.18)', 
    color: '#059669', 
    label: 'Low Risk' 
  },
  medium: { 
    bg: 'rgba(245, 158, 11, 0.08)', 
    border: '1px solid rgba(245, 158, 11, 0.18)', 
    color: '#d97706', 
    label: 'Medium Risk' 
  },
  high: { 
    bg: 'rgba(225, 29, 72, 0.08)', 
    border: '1px solid rgba(225, 29, 72, 0.18)', 
    color: '#e11d48', 
    label: 'High Risk' 
  },
};

export default function AdminPredictions() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    predictionApi.adminStats()
      .then((r) => {
        setStats(r.data.stats || r.data);
        setPredictions(r.data.recent || r.data.results || r.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const list = Array.isArray(predictions) ? predictions : [];

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Platform Diagnostics Logs</h1>
          <p className="page-subtitle">
            Audit platform-wide heart disease predictions, probability logs, and algorithm metrics.
          </p>
        </div>
        
        <button 
          onClick={loadData}
          className="btn btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <RefreshCcw style={{ width: 14, height: 14 }} /> Refresh Logs
        </button>
      </div>

      {/* Stats row if available */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--bg-layer2)', color: 'var(--text-muted)' }}>
              <Activity style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="stat-label">Total Predictions</div>
              <div className="stat-value">{stats.total_predictions || list.length}</div>
              <div className="stat-sub">run on platform</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(225,29,72,0.08)', color: '#e11d48' }}>
              <ShieldAlert style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="stat-label" style={{ color: '#e11d48' }}>High Risk Alerts</div>
              <div className="stat-value" style={{ color: '#e11d48' }}>{stats.high_risk_count || list.filter(p => p.risk_level === 'high').length}</div>
              <div className="stat-sub">patients flagged</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.08)', color: '#d97706' }}>
              <Clock style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="stat-label" style={{ color: '#d97706' }}>Medium Risk</div>
              <div className="stat-value" style={{ color: '#d97706' }}>{stats.medium_risk_count || list.filter(p => p.risk_level === 'medium').length}</div>
              <div className="stat-sub">monitored cases</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.08)', color: '#059669' }}>
              <Heart style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div className="stat-label" style={{ color: '#059669' }}>Low Risk</div>
              <div className="stat-value" style={{ color: '#059669' }}>{stats.low_risk_count || list.filter(p => p.risk_level === 'low').length}</div>
              <div className="stat-sub">healthy vitals</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 80 }} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', padding: '60px 20px' }}>
          <Activity style={{ width: 44, height: 44, color: 'var(--text-faint)' }} />
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>No Diagnostic Data</h4>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No cardiovascular hazard predictions registered on the platform yet.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map((p) => {
            const risk = riskConfig[p.risk_level] || riskConfig.low;
            const isHigh = p.risk_level === 'high';
            
            return (
              <div 
                key={p.id}
                className="card card-hover"
                style={{ 
                  padding: '20px 24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: 16
                }}
              >
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Icon Indicator */}
                  <div style={{ 
                    width: 42, 
                    height: 42, 
                    borderRadius: 10, 
                    background: isHigh ? 'rgba(225,29,72,0.08)' : 'var(--bg-layer2)', 
                    color: isHigh ? '#e11d48' : 'var(--text-muted)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {isHigh ? <ShieldAlert style={{ width: 18, height: 18 }} /> : <Heart style={{ width: 18, height: 18 }} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 700 }}>
                        DIAGNOSIS ID: #{p.id}
                      </span>
                      <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 800, background: risk.bg, color: risk.color, border: risk.border }}>
                        {risk.label}
                      </span>
                    </div>

                    <h4 style={{ fontSize: 14.5, fontWeight: 750, color: 'var(--text-primary)', marginTop: 4 }}>
                      Patient: {p.patient_name || `Patient Profile #${p.patient}`}
                    </h4>
                  </div>
                </div>

                {/* Vitals detail */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: risk.color }}>
                    {p.probability}% <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 550 }}>Probability</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Cpu style={{ width: 11, height: 11 }} />
                      <span style={{ textTransform: 'capitalize' }}>{p.algorithm_used}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar style={{ width: 11, height: 11 }} />
                      <span>{new Date(p.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
