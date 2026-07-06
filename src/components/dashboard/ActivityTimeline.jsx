/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { formatDate } from '../../utils/formatDate';

export function ActivityTimeline({ logs = [] }) {
  const displayLogs = logs.slice(0, 5); // display top 5 activities

  const getModuleColor = (mod) => {
    const safeMod = String(mod || '').toLowerCase();
    switch (safeMod) {
      case 'procurement':
        return '#3b82f6';
      case 'compliance':
        return '#ef4444';
      case 'vendors':
        return '#10b981';
      case 'risk':
        return '#f59e0b';
      case 'audit':
      default:
        return '#64748b';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
      {displayLogs.map((log, idx) => (
        <Box key={log.id || idx} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar
            sx={{
              bgcolor: getModuleColor(log.module || ''),
              fontSize: '0.75rem',
              width: 32,
              height: 32,
              fontWeight: 600
            }}
          >
            {log.module ? log.module.substring(0, 2).toUpperCase() : 'AU'}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {log.action}
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ whiteSpace: 'nowrap' }}>
                {formatDate(log.timestamp)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {log.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5, alignItems: 'center' }}>
              <Typography variant="body2" color="text.disabled" fontWeight={500}>
                User: {log.user} ({log.role})
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ height: 10 }} />
              <Typography variant="body2" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                IP: {log.ipAddress}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default ActivityTimeline;
