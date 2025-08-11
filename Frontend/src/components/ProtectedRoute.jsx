import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If a specific role is required and user doesn't have it
  if (role && user.role !== role) {
    // Redirect to dashboard with unauthorized message
    return <Navigate to="/dashboard" state={{ unauthorized: true }} />;
  }
  
  return children;
}