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
import { forgotPasswordSchema } from '../../utils/validationSchemas';
import { forgotPassword } from '../../services/authService';

export function ForgotPasswordForm() {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await forgotPassword(data.email);
      setSuccessMsg(response.message);
    } catch (err) {
      setErrorMsg(err.message || 'Email registration not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Typography variant="h2" fontWeight={800} gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Enter your registered email address below, and we will dispatch a secure reset link.
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
            name="email"
            control={control}
            label="Email Address"
            type="email"
            autoComplete="email"
            autoFocus
          />
          <AppButton type="submit" fullWidth loading={loading} sx={{ mt: 2 }}>
            Send Reset Link
          </AppButton>
        </>
      ) : null}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 3 }}>
        <Typography
          variant="body2"
          component={Link}
          to="/login"
          color="primary"
          sx={{ textDecoration: 'none', fontWeight: 600 }}
        >
          Back to Login
        </Typography>
        <Typography
          variant="body2"
          component={Link}
          to="/"
          color="text.secondary"
          sx={{ 
            textDecoration: 'none', 
            fontWeight: 600,
            '&:hover': { color: 'primary.main' }
          }}
        >
          ← Back to Landing Page
        </Typography>
      </Box>
    </Box>
  );
}

export default ForgotPasswordForm;
