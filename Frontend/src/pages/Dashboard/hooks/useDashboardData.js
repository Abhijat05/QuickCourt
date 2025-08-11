import { useState, useEffect } from 'react';
import { authService, userService, adminService } from '../../../services/api';
import { MOCK_DASHBOARD_DATA, MOCK_BOOKINGS } from '../../../data/mockData';

export function useDashboardData(user, setTwoFactorEnabled) {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    pendingVenues: 0,
    recentUsers: []
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (user?.role === 'admin') {
          await fetchAdminData();
        } else {
          await fetchUserData();
        }
      } catch (error) {
        console.error('Critical dashboard error:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    // Set a small timeout to avoid immediate loading
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user?.role]);
  
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
  
  return {
    isLoading,
    dashboardData,
    setDashboardData,
    userBookings,
    setUserBookings,
    adminData,
    error
  };
}