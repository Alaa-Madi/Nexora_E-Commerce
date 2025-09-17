import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  showUnauthorized?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  showUnauthorized = false
}) => {
  const { isAuthenticated, role } = useAuth();

  // If not authenticated, redirect to appropriate page
  if (!isAuthenticated) {
    if (showUnauthorized) {
      return <Navigate to="/unauthenticated" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect
  if (requiredRole && role !== requiredRole) {
    // Admin trying to access user-only routes
    if (requiredRole === 'user' && role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    // User trying to access admin-only routes
    if (requiredRole === 'admin' && role === 'user') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
