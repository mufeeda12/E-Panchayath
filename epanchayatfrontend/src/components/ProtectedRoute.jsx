import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, regularUserOnly = false }) => {
  const { token, user, loading } = useContext(AuthContext);
  const location = useLocation();

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin' || user.is_admin || user.is_superuser);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // If a regular user tries to access an admin route, redirect to map
    return <Navigate to="/map" replace />;
  }

  if (regularUserOnly && isAdmin) {
    // If an admin tries to access a regular user only route, redirect to admin dashboard
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
