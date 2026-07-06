/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

// Redux
import { toggleSidebar, toggleThemeMode, setGlobalSearch } from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import { markNotificationRead, markAllRead } from '../../features/notifications/notificationSlice';

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const { user } = useSelector((state) => state.auth);
  const { themeMode, sidebarOpen, globalSearch } = useSelector((state) => state.ui);
  const { notifications } = useSelector((state) => state.notifications);

  // Component States
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handlers
  const handleProfileOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleNotifOpen = (event) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const handleToggleSidebar = () => dispatch(toggleSidebar());
  const handleToggleTheme = () => dispatch(toggleThemeMode());

  const handleSearchChange = (e) => {
    dispatch(setGlobalSearch(e.target.value));
  };

  const handleLogout = () => {
    handleProfileClose();
    dispatch(logout());
    navigate('/login');
  };

  const handleProfileNav = () => {
    handleProfileClose();
    navigate('/settings');
  };

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleNotifClick = (id) => {
    dispatch(markNotificationRead(id));
    handleNotifClose();
    // Navigate to respective area depending on type
    navigate('/notifications');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        color: 'text.primary',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px', height: '64px', px: { xs: 2, md: 3 } }}>
        
        {/* Left section: Collapse & Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleToggleSidebar}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            fontWeight={700}
            color="primary.main"
            component={Link}
            to="/dashboard"
            sx={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontFamily: '"Outfit", sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            e-GRCP <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.05em' }}>PLATFORM</span>
          </Typography>
        </Box>

        {/* Middle section: Global search */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(31, 41, 55, 0.5)' : '#f1f5f9',
            borderRadius: '10px',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            px: 2,
            height: '40px',
            width: '100%',
            maxWidth: '420px',
            transition: 'all 0.15s ease-in-out',
            '&:focus-within': {
              borderColor: 'primary.main',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(31, 41, 55, 0.8)' : '#ffffff',
              boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
            }
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
          <InputBase
            placeholder="Search resources, vendors, risks..."
            fullWidth
            value={globalSearch}
            onChange={handleSearchChange}
            sx={{ 
              fontSize: '0.85rem', 
              color: 'text.primary',
              fontWeight: 500,
              width: '100%'
            }}
          />
        </Box>

        {/* Right section: Quick Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          
          {/* Theme mode button */}
          <Tooltip title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <IconButton onClick={handleToggleTheme} color="inherit">
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications bell badge */}
          <IconButton color="inherit" onClick={handleNotifOpen}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User profile dropdown avatar */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.disabled" fontWeight={500}>
                  {user.role}
                </Typography>
              </Box>
              <Tooltip title="User session options">
                <IconButton onClick={handleProfileOpen} size="small" sx={{ ml: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontWeight: 600, fontSize: '0.9rem' }}>
                    {user.avatar || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          ) : null}

        </Box>
      </Toolbar>

      {/* Notifications dropdown list menu */}
      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={handleNotifClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: { 
              width: 340, 
              maxHeight: 400, 
              mt: 1.5, 
              borderRadius: '12px',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: (theme) => theme.palette.mode === 'dark' 
                ? '0 10px 30px rgba(0,0,0,0.5)' 
                : '0 10px 30px rgba(0,0,0,0.06)'
            }
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>Notifications</Typography>
          {unreadCount > 0 ? (
            <Typography
              variant="body2"
              color="primary"
              fontWeight={600}
              sx={{ cursor: 'pointer', fontSize: '0.8rem' }}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Typography>
          ) : null}
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {notifications.length > 0 ? (
            notifications.slice(0, 4).map((notif) => (
              <React.Fragment key={notif.id}>
                <ListItem
                  onClick={() => handleNotifClick(notif.id)}
                  sx={{
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    bgcolor: notif.read ? 'transparent' : (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                    transition: 'background 0.15s ease',
                    '&:hover': {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          fontWeight: notif.read ? 500 : 700,
                          color: 'text.primary'
                        }}
                      >
                        {notif.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        component="div"
                        noWrap
                        sx={{ color: 'text.secondary' }}
                      >
                        {notif.message}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Box py={4} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No new alerts</Typography>
            </Box>
          )}
        </List>
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Typography
            variant="body2"
            color="primary"
            fontWeight={600}
            component={Link}
            to="/notifications"
            onClick={handleNotifClose}
            sx={{
              textDecoration: 'none',
              display: 'block',
              fontSize: '0.8rem',
              cursor: 'pointer',
              py: 0.5,
              borderRadius: '8px',
              transition: 'opacity 0.15s',
              '&:hover': { opacity: 0.75 }
            }}
          >
            See all notifications
          </Typography>
        </Box>
      </Menu>

      {/* Profile menu list */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: { 
              width: 220, 
              mt: 1.5, 
              borderRadius: '12px',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: (theme) => theme.palette.mode === 'dark' 
                ? '0 10px 30px rgba(0,0,0,0.5)' 
                : '0 10px 30px rgba(0,0,0,0.06)',
              userSelect: 'none',
              outline: 'none'
            }
          }
        }}
      >
        <Box sx={{ p: 2, outline: 'none', userSelect: 'none' }}>
          <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary' }}>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', mt: 0.5 }}>{user?.email}</Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={handleProfileNav}
          sx={{
            cursor: 'pointer',
            gap: 1.5,
            py: 1.2,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <AccountCircleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="body2" fontWeight={500}>My Profile</Typography>
        </MenuItem>
        <MenuItem
          onClick={handleProfileNav}
          sx={{
            cursor: 'pointer',
            gap: 1.5,
            py: 1.2,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <SettingsIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="body2" fontWeight={500}>Settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            cursor: 'pointer',
            gap: 1.5,
            py: 1.2,
            color: 'error.main',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' }
          }}
        >
          <LogoutIcon sx={{ color: 'error.main', fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600} color="error.main">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Header;
