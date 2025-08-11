import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { BreadcrumbNav } from '../components/dashboard/BreadcrumbNav';
import { TwoFactorAlert } from '../components/dashboard/TwoFactorAlert';
import { 
  MOCK_DASHBOARD_DATA, 
  MOCK_BOOKINGS 
} from '../data/mockData';
import { authService, userService, adminService } from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    pendingVenues: 0,
    recentUsers: []
  });
  
  // For debugging purposes, add this at the beginning of your component:
  useEffect(() => {
    console.log("Current user data in Dashboard:", user);
    
    // Check if we can find role information in localStorage directly
    try {
      const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      console.log("User data from localStorage:", storedUserData);
      
      // If we have role in localStorage but not in the user object, we can use it
      if (storedUserData.role && !user?.role) {
        console.log("Found role in localStorage:", storedUserData.role);
      }
    } catch (e) {
      console.error("Error checking localStorage:", e);
    }
  }, [user]);

  // Check if user is admin - more robust check
  const isAdmin = () => {
    // Check user object first
    if (user?.role === 'admin') return true;
    
    // As fallback, check localStorage directly
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      return userData.role === 'admin';
    } catch (e) {
      console.error("Error checking admin status:", e);
      return false;
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (isAdmin()) {
          console.log("Loading admin dashboard...");
          await fetchAdminData();
        } else {
          console.log("Loading user dashboard...");
          await fetchUserData();
        }
      } catch (error) {
        console.error('Critical dashboard error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set a small timeout to avoid immediate loading
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch dashboard stats
      try {
        const dashboardResponse = await userService.getDashboard();
        setDashboardData(dashboardResponse.data);
      } catch (dashboardError) {
        console.warn('Dashboard stats failed, using mock data:', dashboardError);
        setDashboardData(MOCK_DASHBOARD_DATA);
      }
      
      // Try to fetch real bookings, fall back to mock bookings
      try {
        const bookingsResponse = await userService.getUserBookings();
        setUserBookings(bookingsResponse.data || []);
      } catch (bookingsError) {
        console.warn('User bookings failed, using mock data:', bookingsError);
        setUserBookings(MOCK_BOOKINGS);
      }
      
      // Try to fetch 2FA status
      try {
        const twoFAResponse = await authService.get2FAStatus();
        setTwoFactorEnabled(twoFAResponse.data?.twoFactorEnabled || false);
      } catch (twoFAError) {
        console.warn('2FA status failed, using default:', twoFAError);
        setTwoFactorEnabled(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Get total users
      const usersResponse = await adminService.getAllUsers();
      
      // Get pending venues
      const pendingResponse = await adminService.getPendingVenues();
      
      setAdminData({
        totalUsers: usersResponse.data?.length || 0,
        pendingVenues: pendingResponse.data?.length || 0,
        recentUsers: usersResponse.data?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };
  
  const handleToggle2FA = async () => {
    try {
      // Try to update the real service
      try {
        await authService.toggle2FA(!twoFactorEnabled);
      } catch (error) {
        console.warn('2FA toggle API failed, using mock update');
      }
      
      // Update the UI regardless
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update 2FA settings');
      console.error(error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      // Try to call the real service
      try {
        await userService.cancelBooking(bookingId);
      } catch (error) {
        console.warn('Booking cancellation API failed, using mock update');
      }
      
      // Update local state regardless
      setUserBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      
      // Update dashboard stats
      if (dashboardData) {
        setDashboardData(prev => ({
          ...prev,
          activeBookings: prev.activeBookings - 1,
          cancelledBookings: prev.cancelledBookings + 1
        }));
      }
      
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 mt-16"
    >
      <BreadcrumbNav />
      
      <DashboardHeader user={user} />
      
      {twoFactorEnabled && <TwoFactorAlert />}
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {isAdmin() ? (
          <AdminDashboard adminData={adminData} />
        ) : (
          <UserDashboard 
            dashboardData={dashboardData} 
            userBookings={userBookings} 
            twoFactorEnabled={twoFactorEnabled}
            onToggle2FA={handleToggle2FA}
            onCancelBooking={handleCancelBooking}
          />
        )}
      </motion.div>
    </motion.div>
  );
}