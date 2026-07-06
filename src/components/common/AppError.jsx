/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

export function AppError({
  message = 'An unexpected error occurred while processing GRC requests.',
  retryAction = null
}) {
  return (
    <Box m={2} width="100%">
      <Alert
        severity="error"
        action={
          retryAction ? (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={retryAction}
            >
              Retry
            </Button>
          ) : null
        }
      >
        <AlertTitle>Operation Failed</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}

export default AppError;
