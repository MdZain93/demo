/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Chip from '@mui/material/Chip';

export function RiskChip({ level = '' }) {
  const safeLevel = String(level || '').toLowerCase();
  let color = '#64748b'; // default slate gray
  let labelText = level || 'Low';

  switch (safeLevel) {
    case 'critical':
      color = '#7f1d1d'; // very dark deep red
      break;
    case 'high':
      color = '#ef4444'; // bright warning red
      break;
    case 'medium':
      color = '#f59e0b'; // amber / orange
      break;
    case 'low':
    default:
      color = '#10b981'; // green
      break;
  }

  return (
    <Chip
      label={labelText}
      size="small"
      variant="contained"
      sx={{
        backgroundColor: color,
        color: '#ffffff',
        fontWeight: 600,
        fontSize: '0.7rem',
        borderRadius: '4px',
        px: 0.5,
        height: '22px'
      }}
    />
  );
}

export default RiskChip;
