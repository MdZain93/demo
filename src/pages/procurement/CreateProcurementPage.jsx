/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// Redux
import { submitNewRequest } from '../../features/procurement/procurementSlice';
import { addAuditLog } from '../../features/audit/auditSlice';
import { triggerSystemAlert } from '../../features/notifications/notificationSlice';

// Components
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import ProcurementRequestForm from '../../components/forms/ProcurementRequestForm';

export function CreateProcurementPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (requestData, fileName) => {
    setLoading(true);
    try {
      // 1. Submit request to Redux
      const request = await dispatch(
        submitNewRequest({
          requestData: { ...requestData, attachment: fileName },
          creator: user
        })
      ).unwrap();

      // 2. Add System-wide Audit Log
      dispatch(
        addAuditLog({
          user: user.name,
          role: user.role,
          action: 'Create Procurement',
          module: 'Procurement',
          description: `Created procurement request "${requestData.title}" for ${formatCurrency(requestData.amount)}`,
          ip: '192.168.1.45'
        })
      );

      // 3. Trigger alert notification for managers/admins
      dispatch(
        triggerSystemAlert({
          title: 'New Procurement Request',
          message: `${user.name} submitted a request: "${requestData.title}" ($${parseFloat(requestData.amount).toLocaleString()})`,
          type: 'Procurement',
          priority: requestData.amount > 100000 ? 'High' : 'Medium'
        })
      );

      navigate('/procurement');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amt);
  };

  return (
    <Box>
      {/* Navigation Breadcrumbs */}
      <AppBreadcrumbs links={[{ label: 'Procurement', to: '/procurement' }]} activeLabel="Create Request" />

      {/* Header */}
      <Box mb={4}>
        <Typography variant="h1" fontWeight={800} color="text.primary">
          Create Procurement Request
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please fill out the form details below to submit a regulatory spend request for supervisor approval.
        </Typography>
      </Box>

      {/* Form Card wrapper */}
      <Paper 
        sx={{ 
          p: 3, 
          borderRadius: '14px', 
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          bgcolor: 'background.paper'
        }}
      >
        <ProcurementRequestForm onSubmit={handleSubmit} loading={loading} />
      </Paper>
    </Box>
  );
}

export default CreateProcurementPage;
