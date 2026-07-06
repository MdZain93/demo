/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// Common
import AppInput from '../common/AppInput';
import AppButton from '../common/AppButton';
import { changePasswordSchema } from '../../utils/validationSchemas';

export function ChangePasswordForm({ onSubmit, loading }) {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  const onSubmitHandler = async (data) => {
    await onSubmit(data);
    reset(); // Clear form fields after success
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <AppInput
            name="currentPassword"
            control={control}
            label="Current Password"
            type="password"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppInput
            name="newPassword"
            control={control}
            label="New Password"
            type="password"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppInput
            name="confirmNewPassword"
            control={control}
            label="Confirm New Password"
            type="password"
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AppButton type="submit" loading={loading}>
            Update Password
          </AppButton>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChangePasswordForm;
