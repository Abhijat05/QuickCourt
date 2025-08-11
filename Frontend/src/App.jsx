import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/ui/theme-provider'; // Fixed import path
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import Verify2FA from './pages/Verify2FA';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard'; // This will automatically use index.jsx from the Dashboard directory
import VenueDetail from './pages/VenueDetail';
import Booking from './pages/Booking';
import VenueList from './pages/VenueList';
import Profile from './pages/Profile';
import UserBookings from './pages/UserBookings';
import BookingHistory from './pages/BookingHistory';
import NotFound from './pages/NotFound';

// Admin imports
import AdminUsers from './admin/Users';
import AdminUserDetail from './admin/UserDetail';
import AdminVenues from './admin/Venues';
import AdminPendingVenues from './admin/PendingVenues';
import AdminReports from './admin/Reports';
import AdminSettings from './admin/Settings';
import AdminAddVenue from './admin/AddVenue'; // Import the AdminAddVenue component

// Owner imports
import VenueManagement from './owner/VenueManagement'; // Import the VenueManagement component
import AddVenue from './owner/AddVenue'; // Import the AddVenue component

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem attribute="class">
      <Router>
        <Toaster position="top-center" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/verify-2fa" element={<Verify2FA />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/find" element={<VenueList />} />
          <Route path="/booking/:venueId" element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          } />
          
          {/* Additional protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <UserBookings />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/users/:userId" element={<ProtectedRoute role="admin"><AdminUserDetail /></ProtectedRoute>} />
          <Route path="/admin/venues" element={<ProtectedRoute role="admin"><AdminVenues /></ProtectedRoute>} />
          <Route path="/admin/venues/pending" element={<ProtectedRoute role="admin"><AdminPendingVenues /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/venues/new" element={<ProtectedRoute role="admin"><AdminAddVenue /></ProtectedRoute>} />
          
          {/* Owner routes */}
          <Route path="/owner/venues" element={<ProtectedRoute role="owner"><VenueManagement /></ProtectedRoute>} />
          <Route path="/owner/venues/new" element={<ProtectedRoute role="owner"><AddVenue /></ProtectedRoute>} />
          
          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}