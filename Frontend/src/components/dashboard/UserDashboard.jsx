import { motion } from 'framer-motion';
import { UserMainContent } from './user/UserMainContent';
import { UserSidebar } from './user/UserSidebar';
import { useState } from 'react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function UserDashboard({ 
  dashboardData, 
  userBookings, 
  twoFactorEnabled, 
  onToggle2FA, 
  onCancelBooking 
}) {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  return (
    <>
      <motion.div 
        variants={itemVariants} 
        className="col-span-1 lg:col-span-2 space-y-6"
      >
        <UserMainContent 
          dashboardData={dashboardData}
          userBookings={userBookings}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onCancelBooking={onCancelBooking}
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="col-span-1 space-y-6">
        <UserSidebar 
          dashboardData={dashboardData}
          twoFactorEnabled={twoFactorEnabled}
          onToggle2FA={onToggle2FA}
        />
      </motion.div>
    </>
  );
}