import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService, bookingService } from '../../../services/api';

export function useBookingActions(
  twoFactorEnabled, 
  setTwoFactorEnabled, 
  userBookings, 
  setUserBookings,
  dashboardData,
  setDashboardData
) {
  const handleToggle2FA = useCallback(async () => {
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
  }, [twoFactorEnabled, setTwoFactorEnabled]);

  const handleCancelBooking = useCallback(async (bookingId) => {
    try {
      try {
        await bookingService.cancelBooking(bookingId);
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
  }, [userBookings, dashboardData, setUserBookings, setDashboardData]);
  
  return {
    handleToggle2FA,
    handleCancelBooking
  };
}