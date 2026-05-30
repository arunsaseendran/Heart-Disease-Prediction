import { useState, useEffect } from 'react';
import { predictionApi, reportApi } from '../../../lib/api';
import { FileText, Download, Calendar, Activity, AlertTriangle, Shield, RefreshCcw } from 'lucide-react';

const riskConfig: Record<string, { bg: string; color: string; label: string; border: string; badge: string }> = {
  low: { 
    bg: 'rgba(16, 185, 129, 0.08)', 
    border: '1px solid rgba(16, 185, 129, 0.2)', 
    color: '#34d399', 
    label: 'Low Risk',
    badge: 'badge-emerald'
  },
  medium: { 
    bg: 'rgba(245, 158, 11, 0.08)', 
    border: '1px solid rgba(245, 158, 11, 0.2)', 
    color: '#fbbf24', 
    label: 'Medium Risk',
    badge: 'badge-amber'
  },
  high: { 
    bg: 'rgba(225, 29, 72, 0.08)', 
    border: '1px solid rgba(225, 29, 72, 0.2)', 
    color: '#fb7185', 
    label: 'High Risk',
    badge: 'badge-rose'
  },
};

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const loadData = () => {
    setLoading(true);
    predictionApi.history()
      .then((r) => setPredictions(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleDownloadPDF = (id: number) => {
    setDownloadingId(id);
    reportApi.generate(id)
      .then((r) => {
        const blob = new Blob([r.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `HeartCare_AI_Report_${id}.pdf`;
        link.click();
      })
      .catch(() => {
        alert('Failed to generate PDF clinical report. Please ensure model results exist.');
      })
      .finally(() => setDownloadingId(null));
  };

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Diagnostic Logs</h1>
          <p className="page-subtitle">View, audit, and download comprehensive clinical PDF reports of your previous heart disease predictions</p>
        </div>

        <button 
          onClick={loadData}
          className="btn btn-ghost btn-sm"
        >
          <RefreshCcw style={{ width: 13, height: 13 }} />
          Refresh Logs
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : predictions.length === 0 ? (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <div className="empty-icon-wrap">
            <Activity style={{ width: 28, height: 28 }} />
          </div>
          <div className="empty-title">No assessment logs found</div>
          <p className="empty-text">You have not run any cardiac risk predictions yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {predictions.map((p) => {
            const risk = riskConfig[p.risk_level] || riskConfig.low;
            const isHigh = p.risk_level === 'high';
            const isMed = p.risk_level === 'medium';
            
            return (
              <div 
                key={p.id}
                className="card card-hover"
                style={{ 
                  padding: '24px 28px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: 20,
                  flexWrap: 'wrap'
                }}
              >
                {/* Information Area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: '1 1 300px' }}>
                  {/* Indicator Box */}
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 'var(--radius-md)', 
                    background: isHigh ? 'rgba(225,29,72,0.12)' : isMed ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)', 
                    color: isHigh ? 'var(--brand-rose)' : isMed ? 'var(--brand-amber)' : 'var(--brand-emerald)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid currentColor'
                  }}>
                    {isHigh ? <AlertTriangle style={{ width: 20, height: 20 }} /> : <Shield style={{ width: 20, height: 20 }} />}
                  </div>

                  {/* Vitals Text details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.06em' }}>
                        LOG REFERENCE: #{p.id}
                      </span>
                      <span 
                        className={`badge ${risk.badge}`}
                        style={{ 
                          fontSize: 9.5, 
                          padding: '2px 9px',
                          background: risk.bg,
                          color: risk.color,
                          borderColor: risk.border
                        }}
                      >
                        {risk.label}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 900, color: risk.color, margin: 0 }}>
                      {p.probability}% <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 650 }}>Probability</span>
                    </h3>

                    {/* Meta info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Calendar style={{ width: 13, height: 13, color: 'var(--brand-purple-light)' }} />
                        {new Date(p.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </div>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-strong)' }} />
                      <div>
                        Inference: <span style={{ color: 'var(--brand-cyan)', fontWeight: 700, textTransform: 'capitalize' }}>{p.algorithm_used}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Area */}
                <div style={{ flexShrink: 0 }}>
                  <button 
                    onClick={() => handleDownloadPDF(p.id)}
                    disabled={downloadingId === p.id}
                    className="btn btn-ghost btn-sm"
                    style={{ gap: 6 }}
                  >
                    {downloadingId === p.id ? (
                      <><div className="spinner spinner-white animate-spin" /> Fetching PDF...</>
                    ) : (
                      <>
                        <Download style={{ width: 14, height: 14 }} /> Download Medical PDF
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
