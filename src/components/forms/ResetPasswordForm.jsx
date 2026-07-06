/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';

// Common
import AppInput from '../common/AppInput';
import AppButton from '../common/AppButton';
import { resetPasswordSchema } from '../../utils/validationSchemas';
import { resetPassword } from '../../services/authService';

export function ResetPasswordForm() {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(resetPasswordSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await resetPassword('mock-token', data.password);
      setSuccessMsg(response.message);
    } catch (err) {
      setErrorMsg(err.message || 'Verification token expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Typography variant="h2" fontWeight={800} gutterBottom>
        Update Password
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Please establish your new password credentials below.
      </Typography>

      {successMsg ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      ) : null}

      {errorMsg ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      ) : null}

      {!successMsg ? (
        <>
          <AppInput
            name="password"
            control={control}
            label="New Password"
            type="password"
            autoComplete="new-password"
            autoFocus
          />
          <AppInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
          />
          <AppButton type="submit" fullWidth loading={loading} sx={{ mt: 2 }}>
            Change Password
          </AppButton>
        </>
      ) : null}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Typography
          variant="body2"
          component={Link}
          to="/login"
          color="primary"
          sx={{ textDecoration: 'none', fontWeight: 600 }}
        >
          Proceed to Login
        </Typography>
      </Box>
    </Box>
  );
}

export default ResetPasswordForm;
