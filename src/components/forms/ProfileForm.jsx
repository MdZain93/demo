/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// Common
import AppInput from '../common/AppInput';
import AppSelect from '../common/AppSelect';
import AppButton from '../common/AppButton';
import { profileSchema } from '../../utils/validationSchemas';
import { DEPARTMENTS } from '../../utils/constants';

export function ProfileForm({ user, onSubmit, loading }) {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || ''
    }
  });

  // Keep form updated when user loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        department: user.department
      });
    }
  }, [user, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppInput name="name" control={control} label="Full Name" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppInput name="email" control={control} label="Email Address" type="email" />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppSelect name="department" control={control} label="Department" options={DEPARTMENTS} />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AppButton type="submit" loading={loading}>
            Save Changes
          </AppButton>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfileForm;
