/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

/**
 * Reusable AppModal component.
 * 
 * Props:
 * - open: boolean
 * - title: string
 * - onClose: function
 * - actions: ReactNode (optional bottom-right action buttons)
 * - children: ReactNode (modal body)
 * - maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (defaults to 'sm')
 */
export function AppModal({
  open,
  title,
  onClose,
  actions = null,
  children,
  maxWidth = 'sm',
  ...props
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      {...props}
    >
      <DialogTitle sx={{ m: 0, p: 2, variant: 'h3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        {children}
      </DialogContent>
      {actions ? (
        <>
          <Divider />
          <DialogActions sx={{ p: 2, px: 3 }}>
            {actions}
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
}

export default AppModal;
