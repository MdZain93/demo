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
import { approvalCommentSchema } from '../../utils/validationSchemas';

export function ApprovalCommentForm({ onSubmit, loading, confirmLabel = 'Approve' }) {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(approvalCommentSchema),
    defaultValues: {
      comment: ''
    }
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <AppInput
            name="comment"
            control={control}
            label="Comments / Justification"
            multiline
            rows={3}
            placeholder="Please detail the reasons for your approval, rejection, or request for information..."
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AppButton type="submit" loading={loading} color={confirmLabel === 'Reject' ? 'error' : 'primary'}>
            Confirm {confirmLabel}
          </AppButton>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ApprovalCommentForm;
