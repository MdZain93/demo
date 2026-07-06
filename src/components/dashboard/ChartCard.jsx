/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Box from '@mui/material/Box';
import AppCard from '../common/AppCard';

export function ChartCard({ title, subheader = '', children }) {
  return (
    <AppCard title={title} subheader={subheader} sx={{ height: '100%' }}>
      <Box
        sx={{
          width: '100%',
          height: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 3,
          mb: 1
        }}
      >
        {children}
      </Box>
    </AppCard>
  );
}

export default ChartCard;
