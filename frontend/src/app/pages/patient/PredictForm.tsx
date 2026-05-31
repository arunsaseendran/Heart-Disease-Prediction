import { useState } from 'react';
import { predictionApi, reportApi } from '../../../lib/api';
import { 
  Brain, Heart, Shield, Activity, FileText, ChevronRight, 
  Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Download, Zap
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const ALGORITHMS = [
  { value: 'best', label: 'Ensemble Best Model (XGBoost)' },
  { value: 'xgboost', label: 'XGBoost Classifier' },
  { value: 'random_forest', label: 'Random Forest Ensemble' },
  { value: 'decision_tree', label: 'Decision Tree Classifier' },
  { value: 'naive_bayes', label: 'Naive Bayes Gaussian' },
  { value: 'svm', label: 'Support Vector Machine (SVM)' },
  { value: 'logistic_regression', label: 'Logistic Regression' },
  { value: 'knn', label: 'K-Nearest Neighbors (KNN)' },
];

// Map algorithm key → display label
const getAlgorithmLabel = (key: string) =>
  ALGORITHMS.find(a => a.value === key)?.label || key;

export default function PredictForm() {
  // Wizard Stages: 'form' -> 'loading' -> 'result'
  const [stage, setStage] = useState<'form' | 'loading' | 'result'>('form');
  const [loadingText, setLoadingText] = useState('Initializing ML Engine...');
  const [error, setError] = useState('');
  
  // Results
  const [result, setResult] = useState<any>(null);
  const [pdfDownloading, setPdfDownloading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    age: 45,
    sex: 1,
    chest_pain_type: 1,
    resting_blood_pressure: 120,
    cholesterol: 200,
    fasting_blood_sugar: 0,
    resting_ecg: 0,
    max_heart_rate: 150,
    exercise_induced_angina: 0,
    st_depression: 1.0,
    st_slope: 1,
    num_major_vessels: 0,
    thalassemia: 1,
    smoking: false,
    algorithm: 'best',
    blood_group: 'A+',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStage('loading');

    // Fun simulation step words for 7 ML algorithms in parallel
    const steps = [
      'Normalizing ECG waveforms & resting blood pressure...',
      'Running Logistic Regression inference (Accuracy: 89.5%)...',
      'Auditing K-Nearest Neighbors clustering (Accuracy: 85.0%)...',
      'Triggering Support Vector Machine hyperplanes (Accuracy: 89.5%)...',
      'Computing Naive Bayes probabilities (Accuracy: 90.5%)...',
      'Evaluating Decision Tree splits (Accuracy: 93.0%)...',
      'Parsing Random Forest trees (Accuracy: 94.5%)...',
      'Optimizing XGBoost gradient boosting (Accuracy: 96.0%)...',
      'Compiling clinical recommendations...',
    ];

    let stepIdx = 0;
    const timer = setInterval(() => {
      if (stepIdx < steps.length - 1) {
        setLoadingText(steps[stepIdx]);
        stepIdx++;
      }
    }, 450);

    try {
      const response = await predictionApi.predict({
        ...form,
        save_record: true
      });
      clearInterval(timer);
      setLoadingText('Finalizing diagnostic report...');
      setTimeout(() => {
        setResult(response.data);
        setStage('result');
      }, 500);
    } catch (err: any) {
      clearInterval(timer);
      setError(err.response?.data?.detail || 'An error occurred during prediction.');
      setStage('form');
    }
  };

  const handleDownloadPDF = () => {
    const reportId = result?.prediction_id || result?.id;
    if (!reportId) return;
    setPdfDownloading(true);
    reportApi.generate(reportId)
      .then((r) => {
        const blob = new Blob([r.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `HeartCare_AI_Assessment_${reportId}.pdf`;
        link.click();
      })
      .catch(() => alert('Failed to download PDF.'))
      .finally(() => setPdfDownloading(false));
  };

  const resetForm = () => {
    setStage('form');
    setResult(null);
  };

  const riskBadgeClass = {
    high: 'badge-rose',
    medium: 'badge-amber',
    low: 'badge-emerald',
  }[result?.risk_level as 'high' | 'medium' | 'low'] || 'badge-neutral';

  const riskColor = {
    high: '#f43f5e',
    medium: '#f59e0b',
    low: '#10b981',
  }[result?.risk_level as 'high' | 'medium' | 'low'] || '#a78bfa';

  const riskBg = {
    high: 'rgba(244,63,94,0.08)',
    medium: 'rgba(245,158,11,0.08)',
    low: 'rgba(16,185,129,0.08)',
  }[result?.risk_level as 'high' | 'medium' | 'low'] || 'rgba(167,139,250,0.08)';

  const riskBorder = {
    high: '1px solid rgba(244,63,94,0.2)',
    medium: '1px solid rgba(245,158,11,0.2)',
    low: '1px solid rgba(16,185,129,0.2)',
  }[result?.risk_level as 'high' | 'medium' | 'low'] || '1px solid rgba(167,139,250,0.2)';

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }} className="stagger">
      
      {/* ── STAGE 1: THE INPUT WIZARD FORM ── */}
      {stage === 'form' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <h1 className="page-title">AI Cardiac Risk Assessment</h1>
            <p className="page-subtitle">Input clinical parameters to execute advanced ensemble machine learning diagnostics on our 7-model engine</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Section 1: Demographics & Lifestyle */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="section-header">
                <Heart style={{ width: 16, height: 16, color: 'var(--brand-rose)' }} />
                <h3 className="section-title">General Context & Lifestyle</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Patient Age (Years)</label>
                  <input 
                    type="number" min="1" max="110" 
                    value={form.age} onChange={e => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
                    className="form-input"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Biological Sex</label>
                  <Select value={String(form.sex)} onValueChange={v => setForm({ ...form, sex: parseInt(v) })}>
                    <SelectTrigger className="form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Male</SelectItem>
                      <SelectItem value="0">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tobacco Smoking</label>
                  <Select value={form.smoking ? 'yes' : 'no'} onValueChange={v => setForm({ ...form, smoking: v === 'yes' })}>
                    <SelectTrigger className="form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Non-Smoker</SelectItem>
                      <SelectItem value="yes">Active Smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <Select value={form.blood_group} onValueChange={v => setForm({ ...form, blood_group: v })}>
                    <SelectTrigger className="form-select">
                      <SelectValue placeholder="Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 2: Blood Metrics & Pain Modalities */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="section-header">
                <Activity style={{ width: 16, height: 16, color: 'var(--brand-cyan)' }} />
                <h3 className="section-title">Clinical Symptoms & Blood Metrics</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Chest Pain Symptom Type</label>
                  <Select value={String(form.chest_pain_type)} onValueChange={v => setForm({ ...form, chest_pain_type: parseInt(v) })}>
                    <SelectTrigger className="form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Typical Angina (severe chest pressure)</SelectItem>
                      <SelectItem value="1">Atypical Angina (shortness of breath/mild tightness)</SelectItem>
                      <SelectItem value="2">Non-anginal Pain (sharp, transient, non-cardiac feel)</SelectItem>
                      <SelectItem value="3">Asymptomatic (Silent chest context)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="form-label">Resting BP (mmHg)</label>
                  <input 
                    type="number" min="60" max="300" 
                    value={form.resting_blood_pressure} onChange={e => setForm({ ...form, resting_blood_pressure: parseInt(e.target.value) || 0 })}
                    className="form-input"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cholesterol (mg/dl)</label>
                  <input 
                    type="number" min="100" max="600" 
                    value={form.cholesterol} onChange={e => setForm({ ...form, cholesterol: parseInt(e.target.value) || 0 })}
                    className="form-input"
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Fasting Blood Sugar</label>
                  <Select value={String(form.fasting_blood_sugar)} onValueChange={v => setForm({ ...form, fasting_blood_sugar: parseInt(v) })}>
                    <SelectTrigger className="form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Normal (&lt; 120 mg/dl)</SelectItem>
                      <SelectItem value="1">Elevated (&gt; 120 mg/dl)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="form-label">Resting ECG Result</label>
                  <Select value={String(form.resting_ecg)} onValueChange={v => setForm({ ...form, resting_ecg: parseInt(v) })}>
                    <SelectTrigger className="form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Normal Waveform</SelectItem>
                      <SelectItem value="1">ST-T Wave Abnormality</SelectItem>
                      <SelectItem value="2">Left Ventricular Hypertrophy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="form-label">Max Heart Rate (bpm)</label>
                  <input 
                    type="number" min="50" max="250" 
                    value={form.max_heart_rate} onChange={e => setForm({ ...form, max_heart_rate: parseInt(e.target.value) || 0 })}
                    className="form-input"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Exercise Angina</label>
                  <Select value={String(form.exercise_induced_angina)} onValueChange={v => setForm({ ...form, exercise_induced_angina: parseInt(v) })}>
                    <SelectTrigger className="form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No exercise-induced tightness</SelectItem>
                      <SelectItem value="1">Yes (Angina induced by stress)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 3: Electrocardiogram & Stress Test */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="section-header">
                <Brain style={{ width: 16, height: 16, color: 'var(--brand-purple-light)' }} />
                <h3 className="section-title">ST Depression & Fluoroscopy Scans</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">ST Depression Value</label>
                  <input 
                    type="number" min="0" max="10" step="0.1"
                    value={form.st_depression} onChange={e => setForm({ ...form, st_depression: parseFloat(e.target.value) || 0.0 })}
                    className="form-input"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ST Peak Slope</label>
                  <Select value={String(form.st_slope)} onValueChange={v => setForm({ ...form, st_slope: parseInt(v) })}>
                    <SelectTrigger className="form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Upsloping</SelectItem>
                      <SelectItem value="1">Flat</SelectItem>
                      <SelectItem value="2">Downsloping (severe indicator)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="form-label">Colored Major Vessels</label>
                  <Select value={String(form.num_major_vessels)} onValueChange={v => setForm({ ...form, num_major_vessels: parseInt(v) })}>
                    <SelectTrigger className="form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 Vessels</SelectItem>
                      <SelectItem value="1">1 Vessel</SelectItem>
                      <SelectItem value="2">2 Vessels</SelectItem>
                      <SelectItem value="3">3 Vessels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="form-label">Thalassemia Scan</label>
                  <Select value={String(form.thalassemia)} onValueChange={v => setForm({ ...form, thalassemia: parseInt(v) })}>
                    <SelectTrigger className="form-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Normal Flow</SelectItem>
                      <SelectItem value="1">Fixed defect</SelectItem>
                      <SelectItem value="2">Reversible defect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 4: Advanced Scans & Algorithm Choice */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="section-header">
                <Shield style={{ width: 16, height: 16, color: 'var(--brand-cyan)' }} />
                <h3 className="section-title">ML Optimization Settings</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Choose ML Inference Algorithm</label>
                <Select value={form.algorithm} onValueChange={v => setForm({ ...form, algorithm: v })}>
                  <SelectTrigger className="form-select font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALGORITHMS.map(a => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Form Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button 
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ gap: 8 }}
              >
                Execute Cardiac Diagnostic <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ── STAGE 2: PARALLEL COMPUTATION LOADER ── */}
      {stage === 'loading' && (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 76, height: 76 }}>
            {/* outer spinning glow */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', border: '4px solid var(--border-subtle)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', width: '100%', height: '100%', border: '4px solid transparent', borderTopColor: 'var(--brand-purple)', borderRightColor: 'var(--brand-purple-light)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ position: 'absolute', width: '68%', height: '68%', top: '16%', left: '16%', border: '3px solid transparent', borderBottomColor: 'var(--brand-cyan)', borderLeftColor: 'var(--brand-cyan)', borderRadius: '50%', animation: 'spin 1.2s linear infinite', animationDirection: 'reverse' }} />
            <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart style={{ width: 22, height: 22, color: 'var(--brand-rose)', fill: 'rgba(225,29,72,0.12)' }} className="anim-heartbeat" />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Running Ensemble Diagnostic Engines</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', minHeight: 20 }}>
              {loadingText}
            </p>
          </div>
        </div>
      )}

      {/* ── STAGE 3: THE COMPREHENSIVE ASSESSMENT REPORT ── */}
      {stage === 'result' && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="anim-fade-up">
          
          {/* Result Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 className="page-title">Cardiac Assessment Report</h1>
              <p className="page-subtitle">High-fidelity clinical output generated dynamically by the ensemble ML algorithm</p>
            </div>
            
            <button 
              onClick={resetForm}
              className="btn btn-ghost btn-sm"
              style={{ gap: 6 }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} /> Run Another Vitals Check
            </button>
          </div>

          {/* Probability & Alert Hero Card */}
          <div 
            className="hero-banner"
            style={{ 
              background: 'linear-gradient(135deg, rgba(124,58,237,0.07) 0%, rgba(6,182,212,0.04) 100%)', 
              borderColor: 'rgba(124,58,237,0.14)',
              flexWrap: 'wrap',
              padding: '36px 40px'
            }}
          >
            <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
              
              {/* Radial Probability Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{ 
                  width: 104, 
                  height: 104, 
                  borderRadius: '50%', 
                  background: riskBg, 
                  border: `4.5px solid ${riskColor}`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: `0 0 24px ${riskColor}22`
                }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: riskColor }}>{result.probability}%</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.08em' }}>RISK CHANCE</span>
              </div>

              {/* Risk explanation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span 
                    className={`badge ${riskBadgeClass}`}
                    style={{ 
                      fontSize: 10.5, 
                      padding: '3px 12px',
                      background: riskBg,
                      color: riskColor,
                      borderColor: riskBorder
                    }}
                  >
                    {result.risk_level} CARDIAC RISK
                  </span>
                  <span className="info-chip" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                    Algorithm: <span style={{ color: 'var(--brand-cyan)' }}>{getAlgorithmLabel(result.algorithm_used || form.algorithm)}</span>
                  </span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                  {(result.prediction === 1 || result.has_disease) ? 'Coronary Pathology Indicated' : 'No Coronary Pathology Detected'}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 460 }}>
                  Diagnostic systems indicate high confidence in these findings based on ST slope patterns, blood vessels coloration, and rest ECG waveforms.
                </p>
              </div>

            </div>

            {/* Report Download CTA */}
            <div style={{ flexShrink: 0 }}>
              <button 
                onClick={handleDownloadPDF}
                disabled={pdfDownloading}
                className="btn btn-cyan btn-lg"
                style={{ gap: 8 }}
              >
                {pdfDownloading ? (
                  <><div className="spinner spinner-white animate-spin" /> Saving Report...</>
                ) : (
                  <><Download style={{ width: 15, height: 15 }} /> Download Medical PDF</>
                )}
              </button>
            </div>
          </div>

          {/* Recommendation Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            
            {/* Panel 1: Diet Plans */}
            <div className="card">
              <div className="section-header" style={{ marginBottom: 18 }}>
                <CheckCircle2 style={{ width: 17, height: 17, color: 'var(--brand-emerald)' }} />
                <h3 className="section-title">Recommended Dietary Regimen</h3>
              </div>
              <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {(result.recommendations?.diet || result.diet_recommendations || []).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Panel 2: Exercise & Lifestyle */}
            <div className="card">
              <div className="section-header" style={{ marginBottom: 18 }}>
                <Sparkles style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
                <h3 className="section-title">Lifestyle & Exercise Regimen</h3>
              </div>
              <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {(result.recommendations?.exercise || result.exercise_recommendations || []).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Clinical Alerts and Smoking Guidelines */}
          <div 
            className="card"
            style={{ 
              background: 'rgba(225,29,72,0.03)', 
              borderColor: 'rgba(225,29,72,0.18)', 
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 24
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand-rose)' }}>
              <AlertTriangle style={{ width: 16, height: 16 }} />
              <strong style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Clinical Warning & Action Items</strong>
            </div>
            
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {result.recommendations?.alert || result.alert_message || 'All general vitals match regular baseline values. Perform periodic checks and maintain healthy exercise habits.'}
            </p>
            
            {(result.recommendations?.smoking_advice || result.smoking_advice) && (
              <div style={{ fontSize: 13, color: '#f87171', borderTop: '1px solid rgba(225,29,72,0.12)', paddingTop: 12, marginTop: 4, lineHeight: 1.5, display: 'flex', gap: 6 }}>
                <Zap style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }} />
                <span><strong>Tobacco Recovery Protocol:</strong> {result.recommendations?.smoking_advice || result.smoking_advice}</span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
