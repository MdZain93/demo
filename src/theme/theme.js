/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';

export const getTheme = (mode) => createAppTheme(mode);

export const createAppTheme = (mode) => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  return createTheme({
    palette,
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontSize: '2.5rem',
        fontWeight: 800,
        letterSpacing: '-0.04em'
      },
      h2: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontSize: '2rem',
        fontWeight: 800,
        letterSpacing: '-0.03em'
      },
      h3: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em'
      },
      h4: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontSize: '1.25rem',
        fontWeight: 700,
        letterSpacing: '-0.01em'
      },
      h5: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontSize: '1.125rem',
        fontWeight: 700,
        letterSpacing: '-0.01em'
      },
      h6: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontSize: '1rem',
        fontWeight: 600
      },
      body1: {
        fontSize: '0.9375rem',
        lineHeight: 1.6
      },
      body2: {
        fontSize: '0.8125rem',
        lineHeight: 1.57
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem'
      }
    },
    shape: {
      borderRadius: 12
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: mode === 'dark' 
              ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' 
              : '0 4px 20px -2px rgba(0, 0, 0, 0.02)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#e5e7eb'}`,
            borderRadius: '14px'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            height: '42px', // Standard height 40px to 44px
            padding: '8px 18px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              transform: 'translateY(-1px)'
            }
          },
          contained: {
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.08)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(37, 99, 235, 0.15)',
            }
          },
          sizeSmall: {
            height: '34px',
            padding: '6px 12px',
            fontSize: '0.8rem'
          },
          sizeLarge: {
            height: '48px',
            padding: '12px 24px',
            fontSize: '0.95rem'
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '14px 16px', // Standard cell padding 14px to 16px
            borderBottom: `1px solid ${mode === 'dark' ? '#1f2937' : '#e5e7eb'}`
          },
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'dark' ? '#111827' : '#f9fafb',
            color: mode === 'dark' ? '#9ca3af' : '#374151'
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '12px', // Standard border radius 10px to 14px
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '1.5px'
            }
          }
        }
      }
    }
  });
};

export default createAppTheme;
