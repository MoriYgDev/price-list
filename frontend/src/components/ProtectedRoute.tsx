import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * A component that protects routes from unauthenticated users.
 * If the user is authenticated, it renders the child routes.
 * Otherwise, it redirects to the login page.
 */
const ProtectedRoute = () => {
  // --- Check for auth token in local storage ---
  const token = localStorage.getItem('authToken');

  // --- Render child routes or redirect to login ---
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;