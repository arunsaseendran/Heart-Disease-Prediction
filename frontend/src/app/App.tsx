import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from '../lib/auth';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PredictForm from './pages/patient/PredictForm';
import PredictionHistory from './pages/patient/PredictionHistory';
import PatientAppointments from './pages/patient/Appointments';
import PatientProfile from './pages/patient/Profile';
import PatientNotifications from './pages/patient/Notifications';
import MyPrescriptions from './pages/patient/MyPrescriptions';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPrescriptions from './pages/doctor/Prescriptions';
import DoctorProfile from './pages/doctor/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminDoctors from './pages/admin/Doctors';
import AdminMLModels from './pages/admin/MLModels';
import AdminPredictions from './pages/admin/Predictions';
import AdminAppointments from './pages/admin/Appointments';

function PrivateRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#e8304a] border-t-transparent rounded-full animate-spin" />
        <span className="text-white/70 text-sm">Loading...</span>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/patient/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<PrivateRoute><RoleRedirect /></PrivateRoute>} />

      {/* Patient */}
      <Route path="/patient" element={<PrivateRoute roles={['patient']}><DashboardLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="predict" element={<PredictForm />} />
        <Route path="history" element={<PredictionHistory />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="prescriptions" element={<MyPrescriptions />} />
        <Route path="notifications" element={<PatientNotifications />} />
        <Route path="profile" element={<PatientProfile />} />
      </Route>

      {/* Doctor */}
      <Route path="/doctor" element={<PrivateRoute roles={['doctor']}><DashboardLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="profile" element={<DoctorProfile />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><DashboardLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="ml-models" element={<AdminMLModels />} />
        <Route path="predictions" element={<AdminPredictions />} />
        <Route path="appointments" element={<AdminAppointments />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}