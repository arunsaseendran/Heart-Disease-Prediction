import { Outlet, useNavigate, NavLink, useLocation } from 'react-router';
import { useAuth } from '../../lib/auth';
import {
  Heart, LayoutDashboard, Brain, History, Calendar, FileText,
  Bell, User, Users, Cpu, LogOut, Activity, Stethoscope,
  Sun, Moon, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { patientApi } from '../../lib/api';
import { useTheme } from '../../lib/theme';

/* ── Page title map ── */
const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/patient/dashboard':     { title: 'My Dashboard',          sub: 'Cardiac health overview' },
  '/patient/predict':       { title: 'AI Risk Assessment',    sub: 'Ensemble ML diagnostics' },
  '/patient/history':       { title: 'Prediction History',    sub: 'Cardiovascular assessment logs' },
  '/patient/appointments':  { title: 'Appointments',          sub: 'Schedule & manage consultations' },
  '/patient/prescriptions': { title: 'My Prescriptions',      sub: 'Medications from your doctor' },
  '/patient/notifications': { title: 'Notifications',         sub: 'Health alerts & updates' },
  '/patient/profile':       { title: 'My Profile',            sub: 'Account & clinical information' },
  '/doctor/dashboard':      { title: 'Doctor Dashboard',      sub: 'Clinical workspace overview' },
  '/doctor/patients':       { title: 'My Patients',           sub: 'Assigned patient management' },
  '/doctor/appointments':   { title: 'Consultations',         sub: 'Appointment management' },
  '/doctor/prescriptions':  { title: 'Prescriptions',         sub: 'Issue & manage medications' },
  '/doctor/profile':        { title: 'Profile & Availability',sub: 'Account & schedule settings' },
  '/admin/dashboard':       { title: 'Admin Console',         sub: 'Platform overview & metrics' },
  '/admin/users':           { title: 'User Management',       sub: 'Accounts, roles & permissions' },
  '/admin/doctors':         { title: 'Doctor Management',     sub: 'Onboard & manage practitioners' },
  '/admin/ml-models':       { title: 'ML Engine',             sub: 'Models, accuracy & training' },
  '/admin/predictions':     { title: 'Predictions',           sub: 'Platform-wide diagnostic data' },
  '/admin/appointments':    { title: 'All Appointments',      sub: 'Platform appointment oversight' },
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (user?.role === 'patient') {
      patientApi.notifications()
        .then((r) => {
          const list = r.data.results || r.data;
          setUnreadCount(list.filter((n: any) => !n.is_read).length);
        })
        .catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* Role accents */
  const roleAccent = {
    admin:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', badge: 'badge-admin' },
    doctor:  { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)', badge: 'badge-doctor' },
    patient: { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)',  gradient: 'linear-gradient(135deg,#7c3aed,#6366f1)', badge: 'badge-patient' },
  }[user.role];

  /* Nav items */
  const navItems = {
    patient: [
      { label: 'Dashboard',          path: '/patient/dashboard',     icon: LayoutDashboard },
      { label: 'Predict Risk',       path: '/patient/predict',       icon: Brain },
      { label: 'Prediction History', path: '/patient/history',       icon: History },
      { label: 'Appointments',       path: '/patient/appointments',  icon: Calendar },
      { label: 'My Prescriptions',   path: '/patient/prescriptions', icon: FileText },
      { label: 'Notifications',      path: '/patient/notifications', icon: Bell, badge: unreadCount },
      { label: 'My Profile',         path: '/patient/profile',       icon: User },
    ],
    doctor: [
      { label: 'Dashboard',          path: '/doctor/dashboard',      icon: LayoutDashboard },
      { label: 'My Patients',        path: '/doctor/patients',       icon: Users },
      { label: 'Consultations',      path: '/doctor/appointments',   icon: Calendar },
      { label: 'Prescriptions',      path: '/doctor/prescriptions',  icon: FileText },
      { label: 'Profile & Schedule', path: '/doctor/profile',        icon: Stethoscope },
    ],
    admin: [
      { label: 'Admin Console',      path: '/admin/dashboard',       icon: LayoutDashboard },
      { label: 'User Management',    path: '/admin/users',           icon: Users },
      { label: 'Doctor Management',  path: '/admin/doctors',         icon: Stethoscope },
      { label: 'ML Engine',          path: '/admin/ml-models',       icon: Cpu },
      { label: 'Predictions',        path: '/admin/predictions',     icon: Activity },
      { label: 'Appointments',       path: '/admin/appointments',    icon: Calendar },
    ],
  }[user.role];

  const pageMeta = PAGE_META[location.pathname] ?? { title: 'HeartCare AI', sub: 'Dashboard' };
  const userInitial = (user.first_name?.[0] || user.username[0]).toUpperCase();
  const displayName = user.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user.username;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-base)', fontFamily: "'Inter', sans-serif" }}>

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside className="dashboard-sidebar">

        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo-wrap">
            <Heart style={{ width: 16, height: 16, color: '#fff', fill: 'rgba(255,255,255,0.3)' }} className="anim-heartbeat" />
          </div>
          <div>
            <div className="sidebar-brand-text">
              HeartCare <span className="sidebar-brand-accent">AI</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 1 }}>
              Medical Platform
            </div>
          </div>
        </div>

        {/* Role indicator */}
        <div style={{
          margin: '10px 10px 6px',
          padding: '7px 12px',
          borderRadius: 'var(--radius-md)',
          background: roleAccent.bg,
          border: `1px solid ${roleAccent.color}20`,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: roleAccent.gradient,
            boxShadow: `0 0 8px ${roleAccent.color}60`,
          }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: roleAccent.color, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            {user.role} Portal
          </span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item: any) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {!!item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div
              className="user-avatar"
              style={{ background: roleAccent.gradient, color: '#fff' }}
            >
              {userInitial}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="user-name truncate">{displayName}</div>
              <div className="user-role-tag" style={{ color: roleAccent.color }}>{user.role}</div>
            </div>
            <ChevronRight style={{ width: 13, height: 13, color: 'var(--text-faint)', flexShrink: 0 }} />
          </div>

          <button className="signout-btn" onClick={handleLogout}>
            <LogOut style={{ width: 13, height: 13 }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════ MAIN AREA ══════════════ */}
      <div className="dashboard-content">

        {/* Header */}
        <header className="dashboard-header">
          <div className="header-page-info">
            <div className="header-page-title">{pageMeta.title}</div>
            <div className="header-page-sub">{pageMeta.sub}</div>
          </div>

          <div className="header-right">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="header-icon-btn"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light'
                ? <Moon style={{ width: 15, height: 15 }} />
                : <Sun style={{ width: 15, height: 15 }} />
              }
            </button>

            {/* System Status */}
            <div className="header-status-pill">
              <div className="status-live-dot" />
              <span className="header-status-text">System Live</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content anim-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
