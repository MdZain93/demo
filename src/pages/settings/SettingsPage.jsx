/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';

// Redux
import { updateProfile } from '../../features/auth/authSlice';
import { addAuditLog } from '../../features/audit/auditSlice';

// Components
import ProfileForm from '../../components/forms/ProfileForm';
import ChangePasswordForm from '../../components/forms/ChangePasswordForm';

export function SettingsPage() {
  const dispatch = useDispatch();

  // Redux state
  const { user } = useSelector((state) => state.auth);

  // Component local states
  const [activeTab, setActiveTab] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Preference state mocks
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleProfileSubmit = async (formData) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Dispatch profile update
      dispatch(updateProfile(formData));

      // Log system audit log
      dispatch(
        addAuditLog({
          user: user.name,
          role: user.role,
          action: 'Update Profile',
          module: 'System',
          description: `Updated profile details: email changed to ${formData.email}`,
          ip: '127.0.0.1'
        })
      );

      setSuccessMsg('Corporate profile details saved successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile records.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (formData) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      // Simulate password change delays
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Audit log secure action
      dispatch(
        addAuditLog({
          user: user.name,
          role: user.role,
          action: 'Change Password',
          module: 'System',
          description: 'Successfully updated account password credentials.',
          ip: '127.0.0.1'
        })
      );

      setSuccessMsg('Account access password updated successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Page Title */}
      <Box mb={4}>
        <Typography variant="h1" fontWeight={800} color="text.primary">
          Platform Configurations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure security settings, profile metadata, and notification alerts.
        </Typography>
      </Box>

      {/* Tabs configuration container */}
      <Paper 
        sx={{ 
          borderRadius: '14px', 
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          bgcolor: 'background.paper'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Operator Profile" sx={{ fontWeight: 700, py: 2 }} />
          <Tab label="Security & Access" sx={{ fontWeight: 700, py: 2 }} />
          <Tab label="Preferences" sx={{ fontWeight: 700, py: 2 }} />
        </Tabs>

        <Box sx={{ p: 3, maxWidth: '700px' }}>
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

          {/* Tab 1: Profile */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h3" sx={{ mb: 1 }}>Corporate Operator Identity</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Review and update your enterprise profile details. Some domains are managed by corporate administration.
              </Typography>
              <ProfileForm user={user} onSubmit={handleProfileSubmit} loading={loading} />
            </Box>
          )}

          {/* Tab 2: Security */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h3" sx={{ mb: 1 }}>Credential Password Reset</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Please create a strong alphanumeric combination satisfying SOX lock guidelines.
              </Typography>
              <ChangePasswordForm onSubmit={handlePasswordSubmit} loading={loading} />
            </Box>
          )}

          {/* Tab 3: Preferences Mocks */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h3" sx={{ mb: 1 }}>Communication Preferences</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Configure how and when you receive system warning notifications and pending audit logs.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={<Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} color="primary" />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>Email Digest Alerts</Typography>
                      <Typography variant="body2" color="text.disabled">Receive summaries of pending spending requests twice daily.</Typography>
                    </Box>
                  }
                />
                
                <Divider />

                <FormControlLabel
                  control={<Switch checked={criticalSms} onChange={(e) => setCriticalSms(e.target.checked)} color="primary" />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>Vulnerability Emergency SMS alerts</Typography>
                      <Typography variant="body2" color="text.disabled">Receive real-time push alerts on mobile if compliance ratings drop below critical thresholds.</Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default SettingsPage;
