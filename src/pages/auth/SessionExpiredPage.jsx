/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AppButton from '../../components/common/AppButton';

export function SessionExpiredPage() {
  return (
    <Box sx={{ textAlign: 'center' }} py={4}>
      <WarningAmberIcon color="warning" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h2" fontWeight={800} gutterBottom>
        Session Expired
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxW: '380px', mx: 'auto' }}>
        For security compliance, your authentication ticket has expired. Please sign in again to resume your workspace sessions.
      </Typography>
      
      <AppButton component={Link} to="/login" fullWidth>
        Return to Portal Login
      </AppButton>
    </Box>
  );
}

export default SessionExpiredPage;
