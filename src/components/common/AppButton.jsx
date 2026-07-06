/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Reusable AppButton component that wraps Material UI's Button with support for loading states.
 * 
 * Props:
 * - children: string/ReactNode (button text)
 * - loading: boolean (shows spinning loader if true)
 * - icon: ReactNode (left icon)
 * - variant: 'text' | 'contained' | 'outlined' (defaults to 'contained')
 * - color: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' (defaults to 'primary')
 * - fullWidth: boolean
 * - disabled: boolean
 * - onClick: function
 */
export function AppButton({
  children,
  loading = false,
  icon = null,
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <Button
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={!loading ? icon : null}
      {...props}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
      ) : null}
      {children}
    </Button>
  );
}

export default AppButton;
