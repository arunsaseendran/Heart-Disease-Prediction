import { useState, useEffect, useCallback } from 'react';
import { mlApi } from '../../../lib/api';
import {
  Cpu, RefreshCw, Upload, FileText, CheckCircle2, AlertCircle,
  BarChart3, TrendingUp, Zap, Database, Clock, Target,
  Activity, ShieldCheck, Info,
} from 'lucide-react';

// Algo display metadata (labels, colours, type descriptions)
const ALGO_META: Record<string, { name: string; type: string; color: string }> = {
  xgboost:             { name: 'XGBoost Classifier',           type: 'Gradient Boosting',       color: '#06b6d4' },
  random_forest:       { name: 'Random Forest Ensemble',       type: 'Bagging Decision Trees',   color: '#a78bfa' },
  decision_tree:       { name: 'Decision Tree Classifier',     type: 'Classification Tree',      color: '#34d399' },
  naive_bayes:         { name: 'Naive Bayes Gaussian',         type: 'Probabilistic',            color: '#fb923c' },
  svm:                 { name: 'Support Vector Machine (SVM)', type: 'Hyperplane Margins',       color: '#f472b6' },
  logistic_regression: { name: 'Logistic Regression',         type: 'Linear Classifier',        color: '#fbbf24' },
  knn:                 { name: 'K-Nearest Neighbors (KNN)',    type: 'Clustering Neighbors',     color: '#60a5fa' },
};

interface ModelResult {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  cv_mean: number;
  cv_std: number;
  confusion_matrix?: number[][];
}

interface TrainingData {
  results: Record<string, ModelResult>;
  best_model: string;
  trained_at: string;
  dataset_size: number;
  features?: string[];
}

function AccuracyBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 6, background: 'var(--bg-layer2)', borderRadius: 99, overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 99,
          transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      />
    </div>
  );
}

export default function AdminMLModels() {
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // CSV Upload States
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch real model comparison data
  const fetchModelData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await mlApi.comparison();
      const data = res.data;
      // data may be either raw TrainingData or list of MLModel objects from DB
      if (data && data.results) {
        setTrainingData(data as TrainingData);
      } else if (Array.isArray(data) && data.length > 0) {
        // Convert DB model list to TrainingData shape
        const results: Record<string, ModelResult> = {};
        let bestModel = '';
        let bestAcc = 0;
        data.forEach((m: any) => {
          results[m.algorithm] = {
            accuracy: m.accuracy,
            precision: m.precision,
            recall: m.recall,
            f1_score: m.f1_score,
            cv_mean: m.cv_mean,
            cv_std: m.cv_std,
          };
          if (m.is_best || m.accuracy > bestAcc) {
            bestAcc = m.accuracy;
            bestModel = m.algorithm;
          }
        });
        setTrainingData({
          results,
          best_model: bestModel,
          trained_at: data[0]?.trained_at || new Date().toISOString(),
          dataset_size: data[0]?.dataset_size || 0,
        });
      }
    } catch {
      setError('Could not load model comparison data. Ensure the backend is running.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { fetchModelData(); }, [fetchModelData]);

  // Retrain the whole engine
  const handleRetrain = async () => {
    setRetraining(true);
    setSuccess('');
    setError('');
    try {
      const response = await mlApi.train();
      setSuccess(
        `✅ ML Engine successfully retrained on ${response.data.results ? Object.keys(response.data.results).length : 7} algorithms! ` +
        `Best model: ${(response.data.best_model || 'xgboost').replace(/_/g, ' ').toUpperCase()}`
      );
      // Refresh comparison data
      await fetchModelData();
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to retrain the ML engine models.');
    } finally {
      setRetraining(false);
    }
  };

  // Upload custom CSV dataset
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setSuccess('');
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await mlApi.uploadDataset(formData);
      setSuccess('📁 CSV clinical dataset uploaded successfully! Click "Retrain ML Engine" to update all models.');
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during CSV upload. Check file schema.');
    } finally {
      setUploading(false);
    }
  };

  // Sort models by accuracy descending
  const sortedModels = trainingData
    ? Object.entries(trainingData.results).sort((a, b) => b[1].accuracy - a[1].accuracy)
    : [];

  const trainedAt = trainingData?.trained_at
    ? new Date(trainingData.trained_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : null;

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">ML Decision Engine</h1>
          <p className="page-subtitle">Live algorithm accuracies, upload clinical datasets, and retrain all 7 classifiers</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={fetchModelData}
            disabled={loadingData}
            className="btn btn-ghost"
            style={{ gap: 6 }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} className={loadingData ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleRetrain}
            disabled={retraining || loadingData}
            className="btn btn-primary"
            style={{ gap: 8 }}
          >
            {retraining ? (
              <><div className="spinner spinner-white animate-spin" /> Optimizing Models…</>
            ) : (
              <><RefreshCw style={{ width: 14, height: 14 }} /> Retrain ML Engine</>
            )}
          </button>
        </div>
      </div>

      {/* ── Alerts ── */}
      {success && (
        <div className="alert alert-success">
          <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Status Bar ── */}
      {trainingData && (
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap',
          padding: '14px 20px', borderRadius: 12,
          background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.16)',
        }}>
          {[
            { icon: ShieldCheck, color: '#06b6d4', label: 'Best Model', value: (ALGO_META[trainingData.best_model]?.name || trainingData.best_model).replace(/_/g, ' ') },
            { icon: Database, color: '#a78bfa', label: 'Dataset Size', value: `${trainingData.dataset_size.toLocaleString()} records` },
            { icon: Target, color: '#34d399', label: 'Top Accuracy', value: `${sortedModels[0]?.[1].accuracy ?? '--'}%` },
            { icon: Clock, color: '#fb923c', label: 'Last Trained', value: trainedAt || 'Not yet' },
            { icon: Activity, color: '#f472b6', label: 'Algorithms', value: `${sortedModels.length} trained` },
          ].map(({ icon: Icon, color, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon style={{ width: 14, height: 14, color }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginTop: 1 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Main 2-column Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>

        {/* Column 1: Live model accuracies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="section-header" style={{ marginBottom: 20 }}>
              <BarChart3 style={{ width: 17, height: 17, color: 'var(--brand-cyan)' }} />
              <h3 className="section-title">Algorithm Accuracies &amp; Benchmarks</h3>
            </div>

            {loadingData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Array(7).fill(0).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 58 }} />
                ))}
              </div>
            ) : sortedModels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Info style={{ width: 32, height: 32, color: 'var(--text-faint)', margin: '0 auto 10px' }} />
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  No training data yet. Click <strong>Retrain ML Engine</strong> to train all algorithms.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {sortedModels.map(([key, metrics], idx) => {
                  const meta = ALGO_META[key] || { name: key.replace(/_/g, ' '), type: 'Unknown', color: '#94a3b8' };
                  const isBest = key === trainingData?.best_model;
                  return (
                    <div
                      key={key}
                      className={`model-row${isBest ? ' top-model' : ''}`}
                      style={{ flexDirection: 'column', gap: 10, alignItems: 'stretch' }}
                    >
                      {/* Top row: rank + name + badges */}
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                            background: isBest ? `${meta.color}18` : 'var(--bg-layer2)',
                            color: isBest ? meta.color : 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 900, fontSize: 12,
                            border: `1px solid ${isBest ? `${meta.color}30` : 'var(--border-subtle)'}`,
                          }}>
                            {idx + 1}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 13.5, fontWeight: 750, color: 'var(--text-primary)' }}>{meta.name}</span>
                              {isBest && (
                                <span className="badge badge-cyan" style={{ fontSize: 8.5, padding: '1px 6px' }}>
                                  <Zap style={{ width: 8, height: 8, fill: 'currentColor' }} /> Active Best
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              {meta.type}
                            </span>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 15, fontWeight: 900, color: isBest ? meta.color : 'var(--text-primary)' }}>
                              {metrics.accuracy}%
                            </div>
                            <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 600 }}>Accuracy</span>
                          </div>
                          <div style={{ textAlign: 'right', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12 }}>
                            <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-secondary)' }}>
                              {metrics.f1_score}%
                            </div>
                            <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 600 }}>F1 Score</span>
                          </div>
                        </div>
                      </div>

                      {/* Accuracy bar */}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <AccuracyBar value={metrics.accuracy} color={meta.color} />
                        <span style={{ fontSize: 10.5, color: 'var(--text-muted)', width: 32, textAlign: 'right', flexShrink: 0 }}>
                          {metrics.cv_mean}%
                        </span>
                        <span style={{ fontSize: 9, color: 'var(--text-faint)', flexShrink: 0 }}>CV</span>
                      </div>

                      {/* Detail row */}
                      <div style={{ display: 'flex', gap: 14, fontSize: 10.5, color: 'var(--text-muted)' }}>
                        <span>Precision: <strong style={{ color: 'var(--text-secondary)' }}>{metrics.precision}%</strong></span>
                        <span>Recall: <strong style={{ color: 'var(--text-secondary)' }}>{metrics.recall}%</strong></span>
                        <span>CV σ: <strong style={{ color: 'var(--text-secondary)' }}>±{metrics.cv_std}%</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Upload + Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Upload CSV */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="section-header">
              <Upload style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
              <h3 className="section-title">Upload Clinical Dataset</h3>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Upload a clinical cardiovascular CSV file to expand model training bounds.
              Required columns: <code style={{ fontSize: 11, background: 'var(--bg-layer2)', padding: '1px 5px', borderRadius: 4 }}>
                age, sex, chest_pain_type, resting_blood_pressure, cholesterol, fasting_blood_sugar,
                resting_ecg, max_heart_rate, exercise_induced_angina, st_depression, st_slope,
                num_major_vessels, thalassemia, target
              </code>
            </p>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label className="upload-zone" style={{ cursor: 'pointer' }}>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
                <FileText style={{ width: 28, height: 28, color: file ? 'var(--brand-emerald)' : 'var(--text-faint)' }} />
                {file ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontSize: 13, color: '#059669', fontWeight: 700 }}>{file.name}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                      {(file.size / 1024).toFixed(1)} KB · Click to replace
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 600 }}>Choose CSV dataset file</span>
                    <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Drag and drop or browse files</span>
                  </div>
                )}
              </label>

              <button
                type="submit"
                disabled={uploading || !file}
                className="btn btn-cyan btn-full"
                style={{ gap: 6 }}
              >
                {uploading ? (
                  <><div className="spinner spinner-white animate-spin" /> Uploading…</>
                ) : (
                  <><Upload style={{ width: 14, height: 14 }} /> Upload CSV Dataset</>
                )}
              </button>
            </form>
          </div>

          {/* Training Info Card */}
          <div className="card card-sm" style={{ display: 'flex', gap: 14 }}>
            <TrendingUp style={{ width: 20, height: 20, color: 'var(--brand-emerald)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <h4 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>Continuous Optimization</h4>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 4 }}>
                After uploading a dataset, click <strong>Retrain ML Engine</strong> to trigger full ensemble retraining.
                Hyperparameter tuning and cross-validation run across all 7 classifiers automatically.
              </p>
            </div>
          </div>

          {/* Engine Status Card */}
          <div className="card card-sm" style={{
            display: 'flex', gap: 14,
            background: trainingData ? 'rgba(16,185,129,0.04)' : 'rgba(245,158,11,0.04)',
            borderColor: trainingData ? 'rgba(16,185,129,0.18)' : 'rgba(245,158,11,0.18)',
          }}>
            <Cpu style={{
              width: 20, height: 20, flexShrink: 0, marginTop: 2,
              color: trainingData ? '#10b981' : '#f59e0b'
            }} />
            <div>
              <h4 style={{ fontSize: 13.5, fontWeight: 700, color: trainingData ? '#059669' : '#d97706' }}>
                {trainingData ? '✅ Engine Trained & Ready' : '⚠️ Engine Not Yet Trained'}
              </h4>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
                {trainingData
                  ? `${sortedModels.length} algorithms active · Best: ${ALGO_META[trainingData.best_model]?.name || trainingData.best_model} · ${trainingData.dataset_size.toLocaleString()} training records`
                  : 'No trained models found. Click "Retrain ML Engine" above to initialize all classifiers.'}
              </p>
            </div>
          </div>

          {/* Feature Columns */}
          {trainingData?.features && (
            <div className="card card-sm" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Database style={{ width: 14, height: 14, color: 'var(--brand-cyan)' }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Feature Columns ({trainingData.features.length})
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {trainingData.features.map((f) => (
                  <span key={f} style={{
                    fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                    background: 'rgba(6,182,212,0.08)', color: 'var(--brand-cyan)',
                    border: '1px solid rgba(6,182,212,0.15)',
                  }}>
                    {f.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
