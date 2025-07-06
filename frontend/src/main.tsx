import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import cacheRtl from './cacheRtl.ts';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
        <App />
      </LocalizationProvider>
    </CacheProvider>
  </React.StrictMode>
);