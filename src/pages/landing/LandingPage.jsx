/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import { useTheme } from '@mui/material/styles';

// Framer Motion (v12)
import { motion, useScroll, useTransform } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleThemeMode } from '../../features/ui/uiSlice';

export function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.ui?.themeMode || 'dark');
  const { user } = useSelector((state) => state.auth);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [isMobile, setIsMobile] = useState(false);
  const [infoModal, setInfoModal] = useState({ open: false, data: null });

  // Monitor viewport size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const moduleDetails = {
    procurement: {
      title: 'Procurement Engine',
      icon: <StorageIcon sx={{ fontSize: 40 }} />,
      color: '#22d3ee',
      bgcolor: 'rgba(34, 211, 238, 0.1)',
      description: 'Submit and track regulatory spend proposals with budget limit verification checks.',
      bullets: [
        'Automated spend controls and approval routing based on cost center hierarchies.',
        'Real-time budget limit checks against allocated department thresholds.',
        'Compliance validation to ensure all purchases adhere to corporate spending policies.',
        'Audit-ready purchase logs with full approval history trails.'
      ]
    },
    vendors: {
      title: 'Vendor Registry',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      bgcolor: 'rgba(99, 102, 241, 0.1)',
      description: 'Track supplier compliance certificates, expiry logs, and onboarded capability rankings.',
      bullets: [
        'Centralized database for all third-party suppliers and service providers.',
        'Automated certificate tracking for ISO 27001, SOC 2, and regulatory compliances.',
        'Expiry notifications and alerts sent automatically to vendors and procurement leads.',
        'Standardized risk rating questionnaires and capability performance scorecards.'
      ]
    },
    risk: {
      title: 'Threat Analytics',
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      color: '#ef4444',
      bgcolor: 'rgba(239, 68, 68, 0.1)',
      description: 'Prioritize vulnerabilities using interactive ISO 31000 5x5 Heat Map matrices.',
      bullets: [
        'Interactive 5x5 Risk Heat Map matching likelihood with severity levels.',
        'ISO 31000-compliant risk scoring and prioritization engine.',
        'Direct tracking of threats, threat vectors, and active mitigation measures.',
        'Collaborative risk assignments and mitigation verification workflows.'
      ]
    },
    compliance: {
      title: 'Audit Integrity',
      icon: <ShieldIcon sx={{ fontSize: 40 }} />,
      color: '#10b981',
      bgcolor: 'rgba(16, 185, 129, 0.1)',
      description: 'Maintain continuous logs of security configuration compliance and system alterations.',
      bullets: [
        'Tamper-evident audit trails with cryptographic validation of log entries.',
        'Automated evidence collection for regulatory frameworks (SOX, HIPAA, GDPR).',
        'Continuous monitoring of system configurations to prevent compliance drift.',
        'Session logging and administrative change tracking with operator signatures.'
      ]
    }
  };

  const handleOpenModal = (moduleKey) => {
    setInfoModal({ open: true, data: moduleDetails[moduleKey] });
  };

  const handleCloseModal = () => {
    setInfoModal({ ...infoModal, open: false });
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        overflowX: 'clip',
        position: 'relative',
        fontFamily: '"Inter", sans-serif',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      {/* Ambient Neon Background Glows */}
      <Box 
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '50vw',
          height: '50vw',
          background: isDark
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          top: '45%',
          right: '-10%',
          width: '45vw',
          height: '45vw',
          background: isDark
            ? 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(34, 211, 238, 0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Sticky Header Nav */}
      <Box 
        sx={{ 
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          backdropFilter: 'blur(12px)',
          bgcolor: isDark ? 'rgba(3, 7, 18, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 3, md: 8 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon sx={{ color: theme.palette.secondary.main, fontSize: 28 }} />
              <Typography variant="h6" fontWeight={800} sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.02em', color: theme.palette.text.primary }}>
                e-GRCP <span style={{ color: theme.palette.primary.main, fontWeight: 500 }}>PLATFORM</span>
              </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <IconButton onClick={() => dispatch(toggleThemeMode())} color="inherit">
                {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              
              <Button 
                variant="outlined" 
                onClick={() => navigate('/login')}
                sx={{ 
                  borderColor: theme.palette.divider, 
                  color: theme.palette.text.primary,
                  borderRadius: '10px',
                  textTransform: 'none',
                  px: 3,
                  '&:hover': {
                    borderColor: theme.palette.secondary.main,
                    bgcolor: isDark ? 'rgba(34, 211, 238, 0.05)' : 'rgba(6, 182, 212, 0.05)'
                  }
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="contained"
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                endIcon={<KeyboardArrowRightIcon />}
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: '10px',
                  textTransform: 'none',
                  px: 3.5,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    boxShadow: `0 0 20px ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(79, 70, 229, 0.15)'}`
                  }
                }}
              >
                Enter Portal
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: isMobile ? 'auto' : 'calc(100vh - 70px)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
          pt: isMobile ? 12 : 0,
          pb: isMobile ? 8 : 0
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 3, md: 8 } }}>
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          {/* Left Text Detail */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Box 
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  bgcolor: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)', 
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)',
                  px: 2, 
                  py: 0.8, 
                  borderRadius: '30px', 
                  mb: 3 
                }}
              >
                <ShieldIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#c7d2fe' : '#4f46e5', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  GRC WORKFLOWS POWERED BY INTELLIGENCE
                </Typography>
              </Box>

              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  fontFamily: '"Outfit", sans-serif',
                  mb: 3,
                  background: isDark
                    ? 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 70%, #22d3ee 100%)'
                    : 'linear-gradient(135deg, #0f172a 40%, #4f46e5 70%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Enterprise Governance & Auditing Redefined
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary, 
                  fontSize: '1.15rem', 
                  lineHeight: 1.7, 
                  mb: 5, 
                  maxWidth: '560px' 
                }}
              >
                Maintain total oversight of third-party risk posture, SOX / ISO compliance filings, spending authorizations, and corporate procurement policies in a unified, modern console.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate(user ? '/dashboard' : '/login')}
                  endIcon={<KeyboardArrowRightIcon />}
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: '12px',
                    px: 4,
                    height: '52px',
                    fontWeight: 700,
                    boxShadow: `0 10px 25px -5px ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(79, 70, 229, 0.25)'}`,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                      boxShadow: `0 15px 30px ${isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.3)'}`,
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Get Started Now
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => {
                    const el = document.getElementById('features-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{ 
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    borderRadius: '12px',
                    px: 4,
                    height: '52px',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: theme.palette.text.secondary,
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                >
                  Explore Modules
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Hero Image Panel */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-center"
            >
              <Box 
                component="img"
                src="/grc_core.png"
                alt="GRC AI Core sphere"
                sx={{
                  width: '380px',
                  height: '380px',
                  objectFit: 'contain',
                  filter: isDark 
                    ? 'drop-shadow(0 20px 50px rgba(99, 102, 241, 0.25))'
                    : 'drop-shadow(0 20px 50px rgba(99, 102, 241, 0.12))'
                }}
              />
            </motion.div>
            
            <Box 
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '320px',
                height: '320px',
                border: '2px dashed',
                borderColor: isDark ? 'rgba(34, 211, 238, 0.2)' : 'rgba(8, 145, 178, 0.2)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: -1,
                animation: 'spin 40s linear infinite'
              }}
            />
          </Grid>
        </Grid>
        </Container>
      </Box>

      {/* Feature Showcase Section (Simplified Fade-In Layout) */}
      <Box 
        id="features-section"
        sx={{ 
          py: 16, 
          bgcolor: isDark ? 'rgba(11, 15, 25, 0.5)' : 'rgba(241, 245, 249, 0.5)', 
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 3, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="body2" sx={{ color: theme.palette.secondary.main, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 1.5 }}>
              INTEGRATED SOLUTIONS
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif', mb: 2, color: theme.palette.text.primary }}>
              A Unified System for Governance & Spending
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, maxWidth: '600px', mx: 'auto' }}>
              Say goodbye to fragmented tools. We combine regulatory filing audits, vendor evaluations, compliance registers, and spend workflows in one cohesive panel.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Procurement Card */}
            <Grid size={{ xs: 12, md: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.0 }}
                whileHover={{ y: -8 }}
              >
                <Paper 
                  sx={{ 
                    p: 4, 
                    borderRadius: '16px', 
                    bgcolor: isDark ? 'rgba(11, 15, 25, 0.6)' : '#ffffff', 
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    height: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isDark ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' : '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                    color: theme.palette.text.primary,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background-color 0.3s'
                  }}
                  onClick={() => handleOpenModal('procurement')}
                >
                  <Box>
                    <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '10px', bgcolor: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', mb: 3.5 }}>
                      <StorageIcon />
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Procurement Engine</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>Submit and track regulatory spend proposals with budget limit verification checks.</Typography>
                  </Box>
                  <Button size="small" endIcon={<KeyboardArrowRightIcon />} sx={{ color: theme.palette.secondary.main, textTransform: 'none', alignSelf: 'flex-start', p: 0 }}>Learn more</Button>
                </Paper>
              </motion.div>
            </Grid>

            {/* Vendor Governance Card */}
            <Grid size={{ xs: 12, md: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                whileHover={{ y: -8 }}
              >
                <Paper 
                  sx={{ 
                    p: 4, 
                    borderRadius: '16px', 
                    bgcolor: isDark ? 'rgba(11, 15, 25, 0.6)' : '#ffffff', 
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    height: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isDark ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' : '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                    color: theme.palette.text.primary,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background-color 0.3s'
                  }}
                  onClick={() => handleOpenModal('vendors')}
                >
                  <Box>
                    <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '10px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', mb: 3.5 }}>
                      <AssignmentTurnedInIcon />
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Vendor Registry</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>Track supplier compliance certificates, expiry logs, and onboarded capability rankings.</Typography>
                  </Box>
                  <Button size="small" endIcon={<KeyboardArrowRightIcon />} sx={{ color: theme.palette.primary.main, textTransform: 'none', alignSelf: 'flex-start', p: 0 }}>Learn more</Button>
                </Paper>
              </motion.div>
            </Grid>

            {/* Risk Card */}
            <Grid size={{ xs: 12, md: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.30 }}
                whileHover={{ y: -8 }}
              >
                <Paper 
                  sx={{ 
                    p: 4, 
                    borderRadius: '16px', 
                    bgcolor: isDark ? 'rgba(11, 15, 25, 0.6)' : '#ffffff', 
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    height: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isDark ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' : '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                    color: theme.palette.text.primary,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background-color 0.3s'
                  }}
                  onClick={() => handleOpenModal('risk')}
                >
                  <Box>
                    <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '10px', bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', mb: 3.5 }}>
                      <BarChartIcon />
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Threat Analytics</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>Prioritize vulnerabilities using interactive ISO 31000 5x5 Heat Map matrices.</Typography>
                  </Box>
                  <Button size="small" endIcon={<KeyboardArrowRightIcon />} sx={{ color: '#ef4444', textTransform: 'none', alignSelf: 'flex-start', p: 0 }}>Learn more</Button>
                </Paper>
              </motion.div>
            </Grid>

            {/* Compliance Card */}
            <Grid size={{ xs: 12, md: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                whileHover={{ y: -8 }}
              >
                <Paper 
                  sx={{ 
                    p: 4, 
                    borderRadius: '16px', 
                    bgcolor: isDark ? 'rgba(11, 15, 25, 0.6)' : '#ffffff', 
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    height: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isDark ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' : '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                    color: theme.palette.text.primary,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background-color 0.3s'
                  }}
                  onClick={() => handleOpenModal('compliance')}
                >
                  <Box>
                    <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '10px', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', mb: 3.5 }}>
                      <ShieldIcon />
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Audit Integrity</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>Maintain continuous logs of security configuration compliance and system alterations.</Typography>
                  </Box>
                  <Button size="small" endIcon={<KeyboardArrowRightIcon />} sx={{ color: '#10b981', textTransform: 'none', alignSelf: 'flex-start', p: 0 }}>Learn more</Button>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Security Audit Details (Scroll Animated Shield) */}
      <Container maxWidth={false} sx={{ py: 20, px: { xs: 3, md: 8 } }}>
        <Grid container spacing={8} sx={{ alignItems: 'center' }}>
          {/* Left Side rotating Shield image on Scroll */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ x: -160, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
            >
              <Box 
                component="img"
                src="/grc_shield.png"
                alt="GRC Cybersecurity Shield"
                sx={{
                  width: '360px',
                  height: '360px',
                  objectFit: 'contain',
                  filter: isDark 
                    ? 'drop-shadow(0 15px 40px rgba(34, 211, 238, 0.25))'
                    : 'drop-shadow(0 15px 40px rgba(8, 145, 178, 0.15))'
                }}
              />
            </motion.div>
          </Grid>

          {/* Right Side Bullet points */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ x: 160, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
            >
              <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 1.5 }}>
                CONTINUOUS SECURITY & CONTROL
              </Typography>
              <Typography variant="h2" sx={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif', mb: 4, color: theme.palette.text.primary }}>
                Tamper-Evident Records & Audit Compliance
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  <Box sx={{ bgcolor: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)', color: theme.palette.primary.main, p: 1, borderRadius: '8px', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <ShieldIcon />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={700} sx={{ mb: 0.5, color: theme.palette.text.primary }}>Signed Regulatory Documents</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>All vendor declarations, onboarding documents, and audit logs are digitally tracked to prevent retrospective editing.</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  <Box sx={{ bgcolor: isDark ? 'rgba(34, 211, 238, 0.1)' : 'rgba(6, 182, 212, 0.1)', color: theme.palette.secondary.main, p: 1, borderRadius: '8px', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <StorageIcon />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={700} sx={{ mb: 0.5, color: theme.palette.text.primary }}>Comprehensive Session Tracking</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>Track user operation logins, module alterations, and system configuration modifications with immutable operator logs.</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', p: 1, borderRadius: '8px', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <AssignmentTurnedInIcon />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={700} sx={{ mb: 0.5, color: theme.palette.text.primary }}>Real-time Notifications & Warnings</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>Alert administrators instantly via the notification center if third-party certificates expire or compliance indexes drop.</Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Footer Section */}
      <Box sx={{ borderTop: '1px solid', borderColor: theme.palette.divider, py: 6, bgcolor: isDark ? '#020617' : '#f8fafc', transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
        <Container maxWidth={false} sx={{ px: { xs: 3, md: 8 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              &copy; {new Date().getFullYear()} e-GRCP Platform. All rights reserved. SOX and ISO 31000 Certified Console.
            </Typography>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Button size="small" sx={{ color: theme.palette.text.secondary, textTransform: 'none' }}>Privacy Policy</Button>
              <Button size="small" sx={{ color: theme.palette.text.secondary, textTransform: 'none' }}>Terms of Service</Button>
              <Button size="small" sx={{ color: theme.palette.text.secondary, textTransform: 'none' }}>Security Audits</Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Information Modal */}
      <Dialog 
        open={infoModal.open} 
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            bgcolor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderRadius: '20px',
            color: theme.palette.text.primary,
            maxWidth: '550px',
            width: '100%',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 3 }}>
          <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '12px', bgcolor: infoModal.data?.bgcolor, color: infoModal.data?.color }}>
            {infoModal.data?.icon}
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ fontFamily: '"Outfit", sans-serif' }}>
              {infoModal.data?.title}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              e-GRCP Module Overview
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 3 }}>
          <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 500, mb: 3 }}>
            {infoModal.data?.description}
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
            Key Capabilities
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {infoModal.data?.bullets.map((bullet, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box sx={{ width: '6px', height: '6px', borderRadius: '50%', bgcolor: infoModal.data?.color, mt: '8px', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.5 }}>
                  {bullet}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={handleCloseModal}
            sx={{ 
              borderRadius: '10px',
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.text.secondary,
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
              }
            }}
          >
            Close Overview
          </Button>
          <Button 
            variant="contained"
            onClick={() => {
              handleCloseModal();
              navigate('/login');
            }}
            sx={{ 
              borderRadius: '10px',
              bgcolor: infoModal.data?.color,
              color: '#ffffff',
              '&:hover': {
                bgcolor: infoModal.data?.color,
                filter: 'brightness(0.9)',
                boxShadow: `0 0 15px ${infoModal.data?.color}40`
              }
            }}
          >
            Access Module
          </Button>
        </DialogActions>
      </Dialog>

      {/* Inline Spin Animation keyframe CSS */}
      <style>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}

export default LandingPage;
