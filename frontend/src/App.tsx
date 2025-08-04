// src/App.tsx
import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { getDesignTokens } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
//import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalaliV3'
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali'

// Import all pages and components
import LoginPage from './pages/LoginPage';
import ClientPage from './pages/ClientPage';
// ... import all other components ...
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';

import { ColorModeContext } from './ColorModeContext';

function App() {
  // --- State for color mode ---
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // --- Memoized color mode toggle function ---
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  // --- Memoized theme object ---
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    // --- Provide color mode context to children ---
    <ColorModeContext.Provider value={colorMode}>
      {/* --- Provide theme to children --- */}
      <ThemeProvider theme={theme}>
        {/* --- Reset CSS --- */}
        <CssBaseline />
        {/* --- Global styles --- */}
        <GlobalStyles styles={{ 'html, body, #root': { height: '100%', margin: 0, padding: 0 } }} />
        {/* --- Provide date localization --- */}
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          {/* --- Router --- */}
          <Router>
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<ClientPage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* --- Protected Routes --- */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/add-product" element={<AddProductPage />} />
                  <Route path="/admin/edit-product/:id" element={<EditProductPage />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export default App;