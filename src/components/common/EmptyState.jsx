/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/Inbox';

export function EmptyState({
  title = 'No records found',
  description = 'There is currently no data listed matching your query or filter parameters.',
  icon = null
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
        width: '100%',
        textAlign: 'center',
        bgcolor: 'transparent',
      }}
    >
      {icon ? (
        icon
      ) : (
        <InboxIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
      )}
      <Typography variant="h5" color="text.primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '450px', mx: 'auto' }}>
        {description}
      </Typography>
    </Box>
  );
}

export default EmptyState;
