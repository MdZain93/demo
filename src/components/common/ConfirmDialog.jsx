/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppButton from './AppButton';

/**
 * Reusable ConfirmDialog.
 * 
 * Props:
 * - open: boolean
 * - title: string
 * - description: string
 * - confirmLabel: string (defaults to 'Confirm')
 * - cancelLabel: string (defaults to 'Cancel')
 * - severity: 'primary' | 'error' | 'warning' (defaults to 'primary')
 * - onConfirm: function
 * - onCancel: function
 * - loading: boolean
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  severity = 'primary',
  onConfirm,
  onCancel,
  loading = false
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle variant="h4">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <AppButton variant="text" color="inherit" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </AppButton>
        <AppButton
          variant="contained"
          color={severity === 'primary' ? 'primary' : severity}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
