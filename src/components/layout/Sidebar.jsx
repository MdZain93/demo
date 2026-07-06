/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';

import { isRouteAllowed } from '../../utils/roleAccess';

export function Sidebar() {
  const theme = useTheme();
  const location = useLocation();

  // Redux Selectors
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  const role = user?.role || 'Employee';
  const drawerWidth = sidebarOpen ? 250 : 72;

  // Full menu tree definitions
  const menuItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Procurement Requests', path: '/procurement', icon: <ReceiptIcon /> },
    { label: 'Vendor Governance', path: '/vendors', icon: <CorporateFareIcon /> },
    { label: 'Risk Register', path: '/risk', icon: <SecurityIcon /> },
    { label: 'Compliance Center', path: '/compliance', icon: <GavelIcon /> },
    { label: 'Audit Center', path: '/audit', icon: <HistoryIcon /> },
    { label: 'Approval Workbench', path: '/approvals', icon: <AssignmentTurnedInIcon /> },
    { label: 'Reporting Center', path: '/reports', icon: <AssessmentIcon /> },
    { label: 'Notification Center', path: '/notifications', icon: <NotificationsIcon /> },
    { label: 'User Settings', path: '/settings', icon: <SettingsIcon /> },
    { label: 'Employee Directory', path: '/employees', icon: <PeopleIcon />, adminOnly: true }
  ];

  // Filter items matching the user's role permissions
  const allowedMenuItems = menuItems.filter((item) => isRouteAllowed(role, item.path));

  // Determine if a sidebar item is active based on current router path
  const isPathActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.sidebar',
          color: 'rgba(255, 255, 255, 0.6)',
          borderRight: 'none',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          }),
          overflowX: 'hidden',
          pt: '64px' // Stack nicely under Header
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        
        {/* Navigation list items */}
        <List sx={{ px: 1, py: 2 }}>
          {allowedMenuItems.map((item, index) => {
            const active = isPathActive(item.path);
            return (
              <ListItemButton
                key={index}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  py: 1,
                  px: sidebarOpen ? 2 : 1.2,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  backgroundColor: active ? 'primary.main' : 'transparent',
                  color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    backgroundColor: active ? 'primary.main' : '#1f2937',
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    }
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: sidebarOpen ? 36 : 'auto',
                    color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                </ListItemIcon>
                {sidebarOpen ? (
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        component="div"
                        sx={{
                          fontSize: '0.85rem',
                          fontWeight: active ? 600 : 500,
                          letterSpacing: '0.01em',
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                ) : null}
              </ListItemButton>
            );
          })}
        </List>

        {/* Sidebar Footer branding */}
        {sidebarOpen ? (
          <Box sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.35)', fontWeight: 500 }}>
              e-GRCP Platform
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '0.7rem' }}>
              v1.0.0 (STABLE)
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Drawer>
  );
}

export default Sidebar;
