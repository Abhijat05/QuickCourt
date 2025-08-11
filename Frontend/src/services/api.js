import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  signup: (userData) => api.post('/auth/signup', userData),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  login: (credentials) => api.post('/auth/login', credentials),
  verify2FA: (data) => api.post('/auth/verify-2fa', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', email),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  toggle2FA: (enable) => api.post('/auth/2fa/toggle', { enable }),
  get2FAStatus: () => api.get('/auth/2fa/status'),
};

export default api;