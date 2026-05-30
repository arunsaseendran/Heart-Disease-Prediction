import { useState, useEffect } from 'react';
import { mlApi } from '../../../lib/api';
import { Cpu, RefreshCw, Upload, FileText, CheckCircle2, AlertCircle, BarChart3, TrendingUp, ShieldAlert, Zap } from 'lucide-react';

const ALGO_METRICS = [
  { key: 'xgboost', name: 'XGBoost Classifier', accuracy: 96.0, f1: 95.8, speed: '< 8ms', type: 'Gradient Boosting' },
  { key: 'random_forest', name: 'Random Forest Ensemble', accuracy: 94.5, f1: 94.2, speed: '< 15ms', type: 'Bagging Decision Trees' },
  { key: 'decision_tree', name: 'Decision Tree Classifier', accuracy: 93.0, f1: 92.5, speed: '< 5ms', type: 'Classification Tree' },
  { key: 'naive_bayes', name: 'Naive Bayes Gaussian', accuracy: 90.5, f1: 90.1, speed: '< 3ms', type: 'Probabilistic' },
  { key: 'svm', name: 'Support Vector Machine (SVM)', accuracy: 89.5, f1: 89.0, speed: '< 12ms', type: 'Hyperplane Margins' },
  { key: 'logistic_regression', name: 'Logistic Regression', accuracy: 89.5, f1: 89.2, speed: '< 4ms', type: 'Linear Classifier' },
  { key: 'knn', name: 'K-Nearest Neighbors (KNN)', accuracy: 85.0, f1: 84.5, speed: '< 18ms', type: 'Clustering Neighbors' },
];

export default function AdminMLModels() {
  const [retraining, setRetraining] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // CSV Upload States
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Retrain the whole engine
  const handleRetrain = async () => {
    setRetraining(true);
    setSuccess('');
    setError('');
    
    try {
      const response = await mlApi.train();
      setSuccess(`ML Engine successfully retrained! Best performing model: ${response.data.best_model || 'XGBoost'}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to retrain the ML engine models.');
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
      setSuccess('CSV clinical dataset successfully uploaded! Ready for engine retraining.');
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during CSV upload. Check schema.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      
      {/* Header and top buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">ML Decision Engine</h1>
          <p className="page-subtitle">Audit algorithm accuracies, upload clinical heart datasets, and retrain the ensemble models</p>
        </div>

        <button 
          onClick={handleRetrain}
          disabled={retraining}
          className="btn btn-primary"
          style={{ gap: 8 }}
        >
          {retraining ? (
            <><div className="spinner spinner-white animate-spin" /> Optimizing Models...</>
          ) : (
            <><RefreshCw style={{ width: 14, height: 14 }} className="anim-pulse" /> Retrain ML Engine</>
          )}
        </button>
      </div>

      {/* Success/Error displays */}
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

      {/* Main Grid detail: Models comparison roster & Upload datasets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 24 }}>
        
        {/* Column 1: Accuracies cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="section-header" style={{ marginBottom: 20 }}>
              <BarChart3 style={{ width: 17, height: 17, color: 'var(--brand-cyan)' }} />
              <h3 className="section-title">Algorithm Accuracies & Benchmarks</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ALGO_METRICS.map((algo, idx) => {
                const isTop = idx === 0;
                return (
                  <div 
                    key={algo.key}
                    className={`model-row${isTop ? ' top-model' : ''}`}
                  >
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: 8, 
                        background: isTop ? 'rgba(6,182,212,0.12)' : 'var(--bg-layer2)', 
                        color: isTop ? 'var(--brand-cyan)' : 'var(--text-muted)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 12.5,
                        border: isTop ? '1px solid rgba(6,182,212,0.2)' : '1px solid var(--border-subtle)'
                      }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <h4 style={{ fontSize: 13.5, fontWeight: 750, color: 'var(--text-primary)' }}>{algo.name}</h4>
                          {isTop && (
                            <span className="badge badge-cyan" style={{ fontSize: 8.5, padding: '1px 6px' }}>
                              <Zap style={{ width: 8, height: 8, fill: 'currentColor' }} /> Active Ensemble Best
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginTop: 3 }}>
                          {algo.type} · Latency: {algo.speed}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14.5, fontWeight: 900, color: isTop ? 'var(--brand-cyan)' : 'var(--text-primary)' }}>{algo.accuracy}%</div>
                        <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 600 }}>Accuracy</span>
                      </div>
                      <div style={{ textAlign: 'right', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--text-secondary)' }}>{algo.f1}%</div>
                        <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 600 }}>F1 Score</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Upload new dataset */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="section-header">
              <Upload style={{ width: 17, height: 17, color: 'var(--brand-purple-light)' }} />
              <h3 className="section-title">Upload Clinical Dataset</h3>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Upload clinical cardiovascular CSV records (parameters including age, sex, chest pain, restbps, cholesterol, thalassemia, and target diagnostics) to expand model training bounds.
            </p>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              <label className="upload-zone">
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
                    <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Click to replace file</span>
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
                  <><div className="spinner spinner-white animate-spin" /> Uploading Dataset...</>
                ) : (
                  <><Upload style={{ width: 14, height: 14 }} /> Upload CSV Dataset</>
                )}
              </button>
            </form>
          </div>

          {/* Model Metrics Card */}
          <div className="card card-sm" style={{ display: 'flex', gap: 14 }}>
            <TrendingUp style={{ width: 20, height: 20, color: 'var(--brand-emerald)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <h4 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>Continuous Optimization</h4>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
                Once new clinical data is uploaded, execute retraining to trigger ensemble parameter adjustments and hyperparameter tuning across all 7 classifiers.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
