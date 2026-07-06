/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export function AuthLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: 2
      }}
    >
      <Grid 
        container 
        sx={{ 
          maxWidth: '960px', 
          width: '100%', 
          borderRadius: '14px', 
          overflow: 'hidden', 
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: (theme) => theme.palette.mode === 'dark' 
            ? '0 12px 40px rgba(0, 0, 0, 0.5)' 
            : '0 12px 40px rgba(0, 0, 0, 0.03)'
        }}
      >
        
        {/* Left Side: Professional GRC illustration panel */}
        <Grid
          size={{ xs: 0, md: 6 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            p: 5,
            backgroundColor: 'primary.dark',
            color: '#ffffff'
          }}
        >
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.02em', mb: 2 }}>
            Enterprise GRC & Procurement
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.75)', mb: 4, lineHeight: 1.6 }}>
            A unified governance portal for real-time risk assessment, compliance declarations, automated approval workbenches, and vendor governance.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem' }}>
                01
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                Procurement Workflow Engine
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem' }}>
                02
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                Vendor Risk Scoring Matrix
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem' }}>
                03
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                Continuous Compliance Logging
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Active auth form */}
        <Grid
          size={{ xs: 12, md: 6 }}
          component={Paper}
          elevation={0}
          square
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 4, sm: 6 },
            bgcolor: 'background.paper'
          }}
        >
          <Outlet />
        </Grid>

      </Grid>
    </Box>
  );
}

export default AuthLayout;
