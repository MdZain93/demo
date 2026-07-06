/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export function AppLoader({ message = 'Loading workspace data...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        width: '100%',
        gap: 3,
      }}
    >
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress 
          size={56} 
          thickness={2.5} 
          sx={{ 
            color: 'primary.main',
            '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
          }} 
        />
        <Box
          sx={{
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid rgba(59, 130, 246, 0.1)',
            animation: 'pulse 2s infinite ease-in-out'
          }}
        />
      </Box>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          fontWeight: 600, 
          letterSpacing: '0.02em',
          opacity: 0.8,
          fontFamily: '"Outfit", sans-serif'
        }}
      >
        {message}
      </Typography>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.2; }
            100% { transform: scale(0.8); opacity: 0.5; }
          }
        `}
      </style>
    </Box>
  );
}

export default AppLoader;
