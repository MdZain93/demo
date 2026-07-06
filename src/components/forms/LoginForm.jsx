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
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import SecurityIcon from '@mui/icons-material/Security';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// Common
import AppInput from '../common/AppInput';
import AppButton from '../common/AppButton';
import { loginSchema } from '../../utils/validationSchemas';
import useAuth from '../../hooks/useAuth';

const DEMO_USERS = [
  { label: 'Admin', email: 'admin@egrcp.com', role: 'Administrator', icon: <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />, color: '#6366f1' },
  { label: 'Manager', email: 'manager@egrcp.com', role: 'Procurement Manager', icon: <ManageAccountsIcon sx={{ fontSize: 16 }} />, color: '#22d3ee' },
  { label: 'Compliance', email: 'compliance@egrcp.com', role: 'Compliance Officer', icon: <GavelIcon sx={{ fontSize: 16 }} />, color: '#f59e0b' },
  { label: 'Auditor', email: 'auditor@egrcp.com', role: 'Auditor', icon: <VerifiedUserIcon sx={{ fontSize: 16 }} />, color: '#10b981' },
  { label: 'Employee', email: 'employee@egrcp.com', role: 'Employee', icon: <BadgeIcon sx={{ fontSize: 16 }} />, color: '#94a3b8' },
];

// Stagger animation variants for credential cards emerging from the logo
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const chipVariants = {
  hidden: {
    opacity: 0,
    scale: 0.2,
    y: -60,
    x: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
    },
  },
};

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await login(data.email, data.password);
      if (response && response.token) {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (demoUser) => {
    setSelectedUser(demoUser.email);
    setErrorMsg('');
    setValue('email', demoUser.email, { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      {/* Header: Logo + Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box
          id="login-logo-origin"
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SecurityIcon sx={{ color: '#6366f1', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.1 }}>
            Welcome Back
          </Typography>
          <Typography variant="caption" color="text.secondary">
            e-GRCP Platform
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sign in or pick a demo role below to auto-fill credentials.
      </Typography>

      <AnimatePresence>
        {errorMsg ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AppInput
        name="email"
        control={control}
        label="Email Address"
        type="email"
        autoComplete="email"
        autoFocus
      />

      <AppInput
        name="password"
        control={control}
        label="Password"
        type="password"
        autoComplete="current-password"
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 3 }}>
        <Typography
          variant="body2"
          component={Link}
          to="/forgot-password"
          color="primary"
          sx={{ textDecoration: 'none', fontWeight: 600 }}
        >
          Forgot Password?
        </Typography>
      </Box>

      <AppButton type="submit" fullWidth loading={loading}>
        Sign In to Portal
      </AppButton>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5 }}>
        <Typography
          variant="body2"
          component={Link}
          to="/"
          color="text.secondary"
          sx={{
            textDecoration: 'none',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': { color: 'primary.main' }
          }}
        >
          ← Back to Landing Page
        </Typography>
      </Box>

      {/* Demo Credentials Panel with emerge animation from logo */}
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.disabled" sx={{ px: 1, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Quick Demo Access
          </Typography>
        </Divider>

        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mb: 2 }}>
          Click a role to auto-fill credentials (password: <code>password123</code>)
        </Typography>

        {/* Chips animate in as if emerging from the logo icon above */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}
        >
          {DEMO_USERS.map((u) => (
            <motion.div key={u.email} variants={chipVariants}>
              <Tooltip title={u.role} placement="top" arrow>
                <Chip
                  icon={React.cloneElement(u.icon, {
                    sx: { fontSize: 16, color: `${u.color} !important` }
                  })}
                  label={u.label}
                  clickable
                  onClick={() => handleDemoSelect(u)}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    height: '34px',
                    px: 0.5,
                    bgcolor: selectedUser === u.email
                      ? `${u.color}22`
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedUser === u.email ? u.color : 'rgba(255,255,255,0.1)'}`,
                    color: selectedUser === u.email ? u.color : 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: `${u.color}18`,
                      borderColor: u.color,
                      color: u.color,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 14px ${u.color}33`,
                    },
                  }}
                />
              </Tooltip>
            </motion.div>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
}

export default LoginForm;
