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
import About from './pages/About.jsx';

// Admin imports
import AdminUsers from './admin/Users';
import AdminUserDetail from './admin/UserDetail';
import AdminVenues from './admin/Venues';
import AdminPendingVenues from './admin/PendingVenues';
import AdminReports from './admin/Reports';
import AdminSettings from './admin/Settings';
import AdminAddVenue from './admin/AddVenue'; // Import the AdminAddVenue component
import AdminAddCourt from './admin/AddCourt';

// Owner imports
import VenueManagement from './pages/owner/VenueManagement'; // Use the owner page component
import AddVenue from './pages/owner/AddVenue';
import OwnerAddCourt from './owner/AddCourt'; // reuse existing court form
import OwnerVenueBookings from './pages/owner/VenueBookings';

// Public game imports
import PublicGames from './pages/games/PublicGames';
import PublicGameDetail from './pages/games/PublicGameDetail';

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
          {/* Public (authenticated) route for venue bookings for all roles */}
          <Route path="/venues/:venueId/bookings" element={
            <ProtectedRoute>
              <OwnerVenueBookings />
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
          <Route path="/admin/venues/:venueId/courts/new" element={<ProtectedRoute role="admin"><AdminAddCourt /></ProtectedRoute>} />
          {/* Admin can also view venue bookings */}
          <Route path="/admin/venues/:venueId/bookings" element={<ProtectedRoute role="admin"><OwnerVenueBookings /></ProtectedRoute>} />
          
          {/* Owner routes */}
          <Route path="/owner/venues" element={
            <ProtectedRoute roles={['owner','admin']}>
              <VenueManagement /> {/* uses pages/owner/VenueManagement.jsx */}
            </ProtectedRoute>
          } />
          <Route path="/owner/venues/new" element={
            <ProtectedRoute roles={['owner','admin']}>
              <AddVenue />
            </ProtectedRoute>
          } />
          <Route path="/owner/venues/:venueId/courts/new" element={
            <ProtectedRoute roles={['owner','admin']}>
              <OwnerAddCourt />
            </ProtectedRoute>
          } />
          <Route path="/owner/venues/:venueId/bookings" element={<ProtectedRoute role="owner"><OwnerVenueBookings /></ProtectedRoute>} />
          
          {/* Public game routes */}
          <Route path="/games" element={<PublicGames />} />
          <Route path="/games/:gameId" element={<PublicGameDetail />} />
          
          {/* About page route */}
          <Route path="/about" element={<About />} />
          
          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}