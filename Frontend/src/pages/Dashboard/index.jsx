import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { AdminDashboard } from '../../components/dashboard/AdminDashboard';
import { UserDashboard } from '../../components/dashboard/UserDashboard';
import { BreadcrumbNav } from '../../components/dashboard/BreadcrumbNav';
import { TwoFactorAlert } from '../../components/dashboard/TwoFactorAlert';
import { useDashboardData } from './hooks/useDashboardData';
import { useBookingActions } from './hooks/useBookingActions';

export default function Dashboard() {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const { 
    isLoading, 
    dashboardData,
    userBookings,
    adminData,
    error 
  } = useDashboardData(user, setTwoFactorEnabled);
  
  const {
    handleToggle2FA,
    handleCancelBooking
  } = useBookingActions(
    twoFactorEnabled,
    setTwoFactorEnabled,
    userBookings, 
    setUserBookings, 
    dashboardData,
    setDashboardData
  );
  
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
        {user?.role === 'admin' ? (
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