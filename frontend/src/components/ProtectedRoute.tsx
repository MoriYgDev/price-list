import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');

  // If the user's login token exists, show the requested admin page (the <Outlet />).
  // If the token does NOT exist, redirect them to the /login page.
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;