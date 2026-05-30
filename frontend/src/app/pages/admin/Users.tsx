import { useState, useEffect } from 'react';
import { authApi } from '../../../lib/api';
import { Users, Search, Trash2, UserCheck, UserMinus, ShieldAlert, Filter, RefreshCcw } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actioningId, setActioningId] = useState<number | null>(null);

  const loadData = () => {
    setLoading(true);
    authApi.adminUsers()
      .then((r) => setUsers(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleActive = (id: number) => {
    setActioningId(id);
    authApi.adminToggleUser(id)
      .then(() => {
        setUsers(users.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
      })
      .catch(() => alert('Failed to toggle user status.'))
      .finally(() => setActioningId(null));
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you absolutely sure you want to delete this user? This action is permanent and deletes all profiles.')) {
      setActioningId(id);
      authApi.adminDeleteUser(id)
        .then(() => {
          setUsers(users.filter(u => u.id !== id));
        })
        .catch(() => alert('Failed to delete user.'))
        .finally(() => setActioningId(null));
    }
  };

  const filtered = users.filter((u: any) => {
    const name = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
    const username = (u.username || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const query = search.toLowerCase();
    
    const matchesSearch = name.includes(query) || username.includes(query) || email.includes(query);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }} className="stagger">
      
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">User Accounts</h1>
          <p className="page-subtitle">Audit platform permissions, active accounts list, patient logs, and medical practitioner rosters</p>
        </div>

        <button 
          onClick={loadData}
          className="btn btn-ghost btn-sm"
        >
          <RefreshCcw style={{ width: 13, height: 13 }} />
          Refresh Accounts
        </button>
      </div>

      {/* Stats Summary Grid */}
      {!loading && users.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--bg-layer2)', color: 'var(--text-muted)' }}>
              <Users style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{users.length}</div>
              <div className="stat-sub">registered profiles</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.08)', color: 'var(--brand-purple-light)' }}>
              <Users style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div className="stat-label">Patients</div>
              <div className="stat-value" style={{ color: 'var(--brand-purple-light)' }}>
                {users.filter(u => u.role === 'patient').length}
              </div>
              <div className="stat-sub">active profiles</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.08)', color: 'var(--brand-cyan)' }}>
              <Users style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div className="stat-label">Doctors</div>
              <div className="stat-value" style={{ color: 'var(--brand-cyan)' }}>
                {users.filter(u => u.role === 'doctor').length}
              </div>
              <div className="stat-sub">medical experts</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.08)', color: 'var(--brand-amber)' }}>
              <Users style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div className="stat-label">Disabled</div>
              <div className="stat-value" style={{ color: '#fbbf24' }}>
                {users.filter(u => !u.is_active).length}
              </div>
              <div className="stat-sub">deactivated users</div>
            </div>
          </div>
        </div>
      )}

      {/* Table & Controls Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Controls Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1, minWidth: 260 }}>
            {/* Search bar */}
            <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
              <Search style={{ width: 14, height: 14, color: 'var(--text-faint)' }} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, username, or email..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Filter style={{ width: 14, height: 14, color: 'var(--brand-amber)' }} />
            {/* Role Filter */}
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
              style={{ width: 140 }}
            >
              <option value="all">All Roles</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 60, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <div className="empty-icon-wrap">
              <Users style={{ width: 24, height: 24 }} />
            </div>
            <div className="empty-title">No users found</div>
            <p className="empty-text">No registered accounts match your selected search queries or filters.</p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Profile Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isDoc = u.role === 'doctor';
                  const isActive = u.is_active;

                  return (
                    <tr key={u.id} className="table-row-hover">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: 'var(--radius-sm)', 
                            background: isAdmin ? 'rgba(245,158,11,0.12)' : isDoc ? 'rgba(6,182,212,0.12)' : 'rgba(124,58,237,0.12)',
                            color: isAdmin ? 'var(--brand-amber)' : isDoc ? 'var(--brand-cyan)' : 'var(--brand-purple-light)',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 12,
                            border: '1px solid currentColor'
                          }}>
                            {(u.first_name?.[0] || u.username[0]).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                              {u.first_name ? `${u.first_name} ${u.last_name || ''}` : 'No Profile Name'}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="mono" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{u.username}</span>
                      </td>

                      <td>
                        <span 
                          className={`badge ${isAdmin ? 'badge-amber' : isDoc ? 'badge-cyan' : 'badge-purple'}`}
                          style={{ fontSize: 9.5 }}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td>
                        <div className="status-dot active">
                          <span style={{ 
                            fontSize: 12, 
                            fontWeight: 700, 
                            color: isActive ? 'var(--brand-emerald)' : 'var(--brand-rose)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}>
                            <span style={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              background: isActive ? 'var(--brand-emerald)' : 'var(--brand-rose)',
                              boxShadow: isActive ? '0 0 6px var(--brand-emerald)' : '0 0 6px var(--brand-rose)'
                            }} />
                            {isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button 
                            onClick={() => handleToggleActive(u.id)}
                            disabled={actioningId === u.id || u.username === 'admin'}
                            className="btn btn-ghost btn-sm"
                            style={{ 
                              padding: '5px 10px', 
                              fontSize: '11px',
                              color: u.username === 'admin' ? 'var(--text-faint)' : isActive ? 'var(--text-muted)' : 'var(--brand-emerald)',
                              borderColor: 'var(--border-subtle)'
                            }}
                          >
                            {isActive ? <UserMinus style={{ width: 12, height: 12 }} /> : <UserCheck style={{ width: 12, height: 12 }} />}
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>

                          <button 
                            onClick={() => handleDelete(u.id)}
                            disabled={actioningId === u.id || u.username === 'admin'}
                            className="btn btn-ghost btn-sm"
                            style={{ 
                              padding: '5px 10px', 
                              fontSize: '11px', 
                              color: u.username === 'admin' ? 'var(--text-faint)' : 'var(--brand-rose)',
                              borderColor: 'var(--border-subtle)'
                            }}
                          >
                            <Trash2 style={{ width: 12, height: 12 }} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
