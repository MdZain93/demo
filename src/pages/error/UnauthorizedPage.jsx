/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ShieldIcon from '@mui/icons-material/Shield';
import AppButton from '../../components/common/AppButton';

export function UnauthorizedPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        px: 2,
      }}
    >
      <ShieldIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h1" fontWeight={800} color="error.main" gutterBottom>
        Access Blocked
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '440px' }}>
        You do not hold the required supervisor role clearance level to browse this sector. All access attempts are cataloged for continuous SOX security audits.
      </Typography>
      
      <AppButton component={Link} to="/dashboard">
        Return to Dashboard
      </AppButton>
    </Box>
  );
}

export default UnauthorizedPage;
