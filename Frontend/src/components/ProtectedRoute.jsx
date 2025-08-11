import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role, roles }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  const allowed = roles?.length ? roles : (role ? [role] : null);
  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}