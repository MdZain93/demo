/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// Redux
import { fetchNotifications } from '../../features/notifications/notificationSlice';
import { fetchAuditLogs } from '../../features/audit/auditSlice';

import { motion, AnimatePresence } from 'motion/react';

// ... other imports

export function MainLayout() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { sidebarOpen } = useSelector((state) => state.ui);

  // Auto scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Load common background notifications and logs on mount
  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const sidebarWidth = sidebarOpen ? 250 : 72;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Platform Header */}
      <Header />
      
      {/* Collapsible Sidebar */}
      <Sidebar />
      
      {/* Main Container body panel */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen
            })
        }}
      >
        {/* Spacer for AppBar fixed positioning */}
        <Toolbar sx={{ minHeight: '64px' }} />
        
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            py: 3, // 24px consistent page padding
            px: { xs: 2, md: 3 }, // 16px to 24px padding
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Active router views render here with transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Container>
        
        {/* Page Footer */}
        <Footer />
      </Box>
    </Box>
  );
}

export default MainLayout;
