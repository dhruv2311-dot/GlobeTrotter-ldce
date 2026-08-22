import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  console.log('ProtectedRoute check:', { user, path: location.pathname });
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role?.toUpperCase() !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
};

export const PublicRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};
