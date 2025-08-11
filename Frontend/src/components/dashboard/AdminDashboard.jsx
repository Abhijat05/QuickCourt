import { motion } from 'framer-motion';
import { AdminMainContent } from './admin/AdminMainContent';
import { AdminSidebar } from './admin/AdminSidebar';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function AdminDashboard({ adminData }) {
  return (
    <>
      <motion.div 
        variants={itemVariants} 
        className="col-span-1 lg:col-span-2 space-y-6"
      >
        <AdminMainContent adminData={adminData} />
      </motion.div>
      
      <motion.div variants={itemVariants} className="col-span-1 space-y-6">
        <AdminSidebar />
      </motion.div>
    </>
  );
}