// src/theme.ts
import type { PaletteMode } from '@mui/material';
import type { ThemeOptions } from '@mui/material/styles'; // 1. Import ThemeOptions

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({ // 2. Add the return type here
  direction: 'rtl',
  typography: {
    fontFamily: 'Vazirmatn, Arial, sans-serif',
  },
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Palette values for light mode
          primary: { main: '#1976d2' },
          background: {
            default: '#f4f6f8',
            paper: '#ffffff',
          },
        }
      : {
          // Palette values for dark mode
          primary: { main: '#90caf9' },
          background: {
            default: '#1c1c1c',
            paper: '#2c2c2c',
          },
        }),
  },
});