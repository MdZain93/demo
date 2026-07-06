/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Chip from '@mui/material/Chip';

export function StatusChip({ status = '' }) {
  const safeStatus = String(status || '').toLowerCase();
  let color = 'default';
  
  switch (safeStatus) {
    case 'approved':
    case 'completed':
    case 'compliant':
    case 'active':
      color = 'success';
      break;
    case 'pending':
    case 'pending approval':
    case 'under review':
    case 'in review':
      color = 'warning';
      break;
    case 'rejected':
    case 'suspended':
    case 'non-compliant':
      color = 'error';
      break;
    case 'send back':
    case 'escalated':
      color = 'secondary';
      break;
    case 'draft':
    case 'inactive':
    default:
      color = 'default';
      break;
  }

  return (
    <Chip
      label={status}
      color={color}
      size="small"
      variant="filled"
      sx={{
        fontWeight: 500,
        fontSize: '0.75rem',
        borderRadius: '4px',
        px: 0.5
      }}
    />
  );
}

export default StatusChip;
