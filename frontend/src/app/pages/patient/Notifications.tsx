import { useState, useEffect } from 'react';
import { patientApi } from '../../../lib/api';
import { Bell, Check, Clock, AlertTriangle, Sparkles, Inbox, RefreshCcw } from 'lucide-react';

export default function PatientNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    patientApi.notifications()
      .then((r) => setNotifications(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkAsRead = (id: number) => {
    patientApi.markNotificationRead(id)
      .then(() => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      })
      .catch(() => {});
  };

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Health Notifications</h1>
          <p className="page-subtitle">Stay updated with clinical reminders, appointments status, and diagnostic results</p>
        </div>

        <button 
          onClick={load}
          className="btn btn-ghost btn-sm"
        >
          <RefreshCcw style={{ width: 13, height: 13 }} />
          Refresh Inbox
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <div className="empty-icon-wrap">
            <Inbox style={{ width: 28, height: 28 }} />
          </div>
          <div className="empty-title">All caught up!</div>
          <p className="empty-text">You do not have any notification alerts at this time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map((n) => {
            const isRead = n.is_read;
            
            // Icon selection
            let icon = <Bell style={{ width: 16, height: 16, color: 'var(--brand-purple-light)' }} />;
            let borderStyle = isRead ? 'var(--border-subtle)' : 'rgba(124,58,237,0.2)';
            let iconBg = isRead ? 'rgba(255,255,255,0.02)' : 'rgba(124,58,237,0.1)';
            
            if (n.type === 'emergency') {
              icon = <AlertTriangle style={{ width: 16, height: 16, color: 'var(--brand-rose)' }} />;
              borderStyle = isRead ? 'var(--border-subtle)' : 'rgba(225,29,72,0.2)';
              iconBg = isRead ? 'rgba(255,255,255,0.02)' : 'rgba(225,29,72,0.1)';
            } else if (n.type === 'medicine') {
              icon = <Sparkles style={{ width: 16, height: 16, color: 'var(--brand-cyan)' }} />;
              borderStyle = isRead ? 'var(--border-subtle)' : 'rgba(6,182,212,0.2)';
              iconBg = isRead ? 'rgba(255,255,255,0.02)' : 'rgba(6,182,212,0.1)';
            }
            
            return (
              <div 
                key={n.id} 
                className="card"
                style={{ 
                  background: isRead ? 'var(--bg-card)' : 'rgba(124,58,237,0.04)', 
                  borderColor: borderStyle,
                  padding: '18px 24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 18,
                  boxShadow: !isRead ? '0 4px 20px rgba(124,58,237,0.05)' : 'none',
                  transition: 'all var(--t-normal)'
                }}
              >
                <div style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 'var(--radius-sm)', 
                  background: iconBg, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: isRead ? '1px solid var(--border-subtle)' : '1px solid transparent'
                }}>
                  {icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: 14.5, fontWeight: isRead ? 600 : 700, color: isRead ? 'var(--text-secondary)' : '#fff', margin: 0 }}>
                      {n.title}
                    </h4>
                    {!isRead && (
                      <span className="badge badge-purple" style={{ fontSize: 8, padding: '1px 6px' }}>New</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: isRead ? 'var(--text-muted)' : 'var(--text-secondary)', marginTop: 4, marginBottom: 0, lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-faint)', marginTop: 8, fontWeight: 600 }}>
                    <Clock style={{ width: 11, height: 11 }} />
                    {new Date(n.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>

                {!isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(n.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ 
                      padding: '5px 12px', 
                      fontSize: '11.5px',
                      color: 'var(--brand-purple-light)',
                      borderColor: 'rgba(124,58,237,0.3)',
                      background: 'rgba(124,58,237,0.05)'
                    }}
                  >
                    <Check style={{ width: 13, height: 13 }} /> 
                    Dismiss
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
