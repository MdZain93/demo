/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import AppButton from '../../components/common/AppButton';

export function NotFoundPage() {
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
      <SearchOffIcon color="disabled" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h1" fontWeight={800} color="text.primary" gutterBottom>
        404 - Resources Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '420px' }}>
        The system path or dashboard resource requested does not exist on this GRC platform node or you do not have permission.
      </Typography>
      
      <AppButton component={Link} to="/dashboard">
        Return to Dashboard
      </AppButton>
    </Box>
  );
}

export default NotFoundPage;
