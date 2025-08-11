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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error.response?.data?.message || 'An unexpected error occurred';
    console.error('API Error:', error.response?.data || error);
    return Promise.reject(error);
  }
);

// Helper function to handle API calls safely
const safeApiCall = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API call failed:', error.message);
    throw error;
  }
};

export const authService = {
  signup: (userData) => safeApiCall(() => api.post('/auth/signup', userData)),
  verifyOtp: (data) => safeApiCall(() => api.post('/auth/verify-otp', data)),
  login: (credentials) => safeApiCall(() => api.post('/auth/login', credentials)),
  verify2FA: (data) => safeApiCall(() => api.post('/auth/verify-2fa', data)),
  forgotPassword: (email) => safeApiCall(() => api.post('/auth/forgot-password', email)),
  resetPassword: (data) => safeApiCall(() => api.post('/auth/reset-password', data)),
  toggle2FA: (enable) => safeApiCall(() => api.post('/auth/2fa/toggle', { enable })),
  get2FAStatus: () => safeApiCall(() => api.get('/auth/2fa/status')),
  resendOtp: (data) => safeApiCall(() => api.post('/auth/resend-otp', data)),
};

export const userService = {
  getDashboard: () => safeApiCall(() => api.get('/user/dashboard')),
  // Change this to use the correct endpoint
  getUserBookings: () => safeApiCall(() => api.get('/bookings/user')),
  cancelBooking: (bookingId) => safeApiCall(() => api.patch(`/bookings/${bookingId}/cancel`)),
  getUserProfile: () => safeApiCall(() => api.get('/user/profile')),
  updateUserProfile: (data) => safeApiCall(() => api.patch('/user/profile', data)),
  getUserBookingHistory: () => safeApiCall(() => api.get('/user/history'))
};

export const venueService = {
  getAllVenues: () => safeApiCall(() => api.get('/venues')),
  getVenueById: (id) => safeApiCall(() => api.get(`/venues/${id}`)),
  searchVenues: (params) => safeApiCall(() => api.get('/venues/search', { params })),
};

export const bookingService = {
  createBooking: (data) => safeApiCall(() => api.post('/bookings', data)),
  getAllUserBookings: () => safeApiCall(() => api.get('/bookings/user')),
  getBookingById: (id) => safeApiCall(() => api.get(`/bookings/${id}`)),
  cancelBooking: (id) => safeApiCall(() => api.patch(`/bookings/${id}/cancel`)),
};

export const availabilityService = {
  getCourtAvailability: (courtId, date) => safeApiCall(() => api.get(`/availability/court/${courtId}/date/${date}`)),
};

export const reviewService = {
  getVenueReviews: (venueId) => safeApiCall(() => api.get(`/reviews/venue/${venueId}`)),
  addReview: (reviewData) => safeApiCall(() => api.post('/reviews', reviewData)),
};

export const ownerService = {
  getOwnerVenues: () => safeApiCall(() => api.get('/owner/venues')),
  getVenueById: (venueId) => safeApiCall(() => api.get(`/owner/venues/${venueId}`)),
  createVenue: (data) => safeApiCall(() => api.post('/owner/venues', data)),
  updateVenue: (venueId, data) => safeApiCall(() => api.put(`/owner/venues/${venueId}`, data)),
  getVenueStats: (venueId) => safeApiCall(() => api.get(`/owner/venues/${venueId}/stats`)),
  getVenueBookings: (venueId) => safeApiCall(() => api.get(`/owner/venues/${venueId}/bookings`)),
  createCourt: (venueId, data) => safeApiCall(() => api.post(`/owner/venues/${venueId}/courts`, data)),
  testRoute: () => safeApiCall(() => api.get('/owner/test')),
};

export const adminService = {
  getAllUsers: () => safeApiCall(() => api.get('/admin/users')),
  getUserById: (userId) => safeApiCall(() => api.get(`/admin/users/${userId}`)),
  deleteUser: (userId) => safeApiCall(() => api.delete(`/admin/users/${userId}`)),
  changeUserRole: (data) => safeApiCall(() => api.post('/admin/users/role', data)),
  getPendingVenues: () => safeApiCall(() => api.get('/admin/venues/pending')),
  approveVenue: (venueId) => safeApiCall(() => api.patch(`/admin/venues/${venueId}/approve`)),
  // Create venue (without courts)
  createVenue: (venueData) => safeApiCall(() => api.post('/owner/venues', venueData)),
  
  // Create court for a venue
  createCourt: (venueId, courtData) => safeApiCall(() => api.post(`/owner/venues/${venueId}/courts`, courtData)),
};

export const imageService = {
  getVenueImages: (venueId) => safeApiCall(() => api.get(`/images/venues/${venueId}`)),
  uploadVenueImage: (venueId, formData) => safeApiCall(() => api.post(`/images/venues/${venueId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })),
  uploadCourtImage: (courtId, formData) => safeApiCall(() => api.post(`/images/courts/${courtId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })),
  uploadMultipleVenueImages: (venueId, formData) => safeApiCall(() => api.post(`/images/venues/${venueId}/multiple`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })),
};

export const gameService = {
  getPublicGames: () => safeApiCall(() => api.get('/games/public')),
  getGameDetails: (gameId) => safeApiCall(() => api.get(`/games/${gameId}`)),
  createPublicGame: (data) => safeApiCall(() => api.post('/games/create', data)),
  joinPublicGame: (gameId) => safeApiCall(() => api.post(`/games/${gameId}/join`)),
  leavePublicGame: (gameId) => safeApiCall(() => api.post(`/games/${gameId}/leave`)),
  getUserGames: () => safeApiCall(() => api.get('/games/user/participating')),
  getGameParticipants: (gameId) => safeApiCall(() => api.get(`/games/${gameId}/participants`)),
  checkGameParticipants: (gameId) => safeApiCall(() => api.get(`/games/${gameId}/check-participants`)),
};

export default api;