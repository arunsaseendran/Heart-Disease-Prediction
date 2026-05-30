import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login/', data),
  register: (data: Record<string, unknown>) =>
    api.post('/auth/register/', data),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data: FormData | Record<string, unknown>) =>
    api.patch('/auth/profile/', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),
  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post('/auth/change-password/', data),
  // Admin
  adminUsers: (params?: Record<string, string>) =>
    api.get('/auth/admin/users/', { params }),
  adminToggleUser: (id: number) =>
    api.post(`/auth/admin/users/${id}/toggle/`),
  adminDeleteUser: (id: number) =>
    api.delete(`/auth/admin/users/${id}/`),
  dashboardStats: () =>
    api.get('/auth/admin/dashboard/stats/'),
};

// ── Patients ──────────────────────────────────────────────────────────────────
export const patientApi = {
  profile: () => api.get('/patients/profile/'),
  updateProfile: (data: Record<string, unknown>) =>
    api.patch('/patients/profile/', data),
  list: (params?: Record<string, string>) =>
    api.get('/patients/', { params }),
  detail: (id: number) => api.get(`/patients/${id}/`),
  assignDoctor: (id: number, doctorId: number) =>
    api.post(`/patients/${id}/assign-doctor/`, { doctor_id: doctorId }),
  healthRecords: () => api.get('/patients/health-records/'),
  addHealthRecord: (data: Record<string, unknown>) =>
    api.post('/patients/health-records/', data),
  notifications: () => api.get('/patients/notifications/'),
  markNotificationRead: (id: number) =>
    api.post(`/patients/notifications/${id}/read/`),
};

// ── Doctors ───────────────────────────────────────────────────────────────────
export const doctorApi = {
  list: (params?: Record<string, string>) =>
    api.get('/doctors/', { params }),
  detail: (id: number) => api.get(`/doctors/${id}/`),
  profile: () => api.get('/doctors/profile/'),
  updateProfile: (data: Record<string, unknown>) =>
    api.patch('/doctors/profile/', data),
  adminCreate: (data: Record<string, unknown>) =>
    api.post('/doctors/admin/create/', data),
  availability: () => api.get('/doctors/availability/'),
  updateAvailability: (data: Record<string, unknown>) =>
    api.patch('/doctors/availability/', data),
  myPatients: () => api.get('/doctors/patients/'),
  prescriptions: () => api.get('/doctors/prescriptions/'),
  addPrescription: (data: Record<string, unknown>) =>
    api.post('/doctors/prescriptions/', data),
  prescriptionDetail: (id: number) =>
    api.get(`/doctors/prescriptions/${id}/`),
  myPrescriptions: () => api.get('/doctors/my-prescriptions/'),
};

// ── Predictions ───────────────────────────────────────────────────────────────
export const predictionApi = {
  predict: (data: Record<string, unknown>) =>
    api.post('/predictions/predict/', data),
  history: () => api.get('/predictions/history/'),
  detail: (id: number) => api.get(`/predictions/${id}/`),
  adminStats: () => api.get('/predictions/admin/stats/'),
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const appointmentApi = {
  list: () => api.get('/appointments/'),
  create: (data: Record<string, unknown>) =>
    api.post('/appointments/', data),
  detail: (id: number) => api.get(`/appointments/${id}/`),
  action: (id: number, data: { action: string; notes?: string }) =>
    api.post(`/appointments/${id}/action/`, data),
  adminAll: (params?: Record<string, string>) =>
    api.get('/appointments/admin/all/', { params }),
};

// ── Reports ───────────────────────────────────────────────────────────────────
export const reportApi = {
  generate: (predictionId: number) =>
    api.get(`/reports/generate/${predictionId}/`, { responseType: 'blob' }),
};

// ── ML Engine ─────────────────────────────────────────────────────────────────
export const mlApi = {
  train: () => api.post('/ml/train/'),
  comparison: () => api.get('/ml/comparison/'),
  models: () => api.get('/ml/models/'),
  uploadDataset: (formData: FormData) =>
    api.post('/ml/datasets/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  datasets: () => api.get('/ml/datasets/'),
};

export default api;
