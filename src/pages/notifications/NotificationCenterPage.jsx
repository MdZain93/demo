/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleIcon from '@mui/icons-material/Circle';
import DoneAllIcon from '@mui/icons-material/DoneAll';

// Redux
import {
  markNotificationRead,
  markAllRead
} from '../../features/notifications/notificationSlice';

// Components
import RiskChip from '../../components/common/RiskChip';
import { formatDate } from '../../utils/formatDate';

export function NotificationCenterPage() {
  const dispatch = useDispatch();

  // Redux notification store
  const { notifications } = useSelector((state) => state.notifications);

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box>
      {/* Title Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h1" fontWeight={800} color="text.primary">
            Notification Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with real-time risk alerts, compliance declarations, and spending authorization notices.
          </Typography>
        </Box>

        {unreadCount > 0 ? (
          <Button
            variant="outlined"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllRead}
          >
            Mark All as Read ({unreadCount})
          </Button>
        ) : null}
      </Box>

      {/* List wrapper card */}
      <Paper 
        sx={{ 
          borderRadius: '14px', 
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          bgcolor: 'background.paper'
        }}
      >
        {notifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            {notifications.map((notif, idx) => (
              <React.Fragment key={notif.id || idx}>
                <ListItem
                  sx={{
                    p: 3,
                    alignItems: 'flex-start',
                    bgcolor: notif.read ? 'transparent' : (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                    transition: 'background-color 0.15s ease-in-out',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' }
                  }}
                >
                  {/* Left priority bubble indicator */}
                  <Box sx={{ mr: 2.5, mt: 0.5, display: 'flex', alignItems: 'center' }}>
                    {!notif.read ? (
                      <CircleIcon color="primary" sx={{ fontSize: 10 }} />
                    ) : (
                      <CircleIcon sx={{ fontSize: 10, color: 'text.disabled' }} />
                    )}
                  </Box>

                  {/* Main text content body */}
                  <ListItemText
                    disableTypography
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 1.5 }}>
                        <Typography variant="body1" component="div" fontWeight={notif.read ? 600 : 800} color="text.primary">
                          {notif.title}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          {formatDate(notif.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1.5, lineHeight: 1.5 }}>
                          {notif.message}
                        </Typography>
 
                        {/* Badges footer row */}
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.4,
                              borderRadius: "4px",
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                              color: 'text.secondary'
                            }}
                          >
                            Module: {notif.type}
                          </Box>

                          <RiskChip level={notif.priority || 'Medium'} />

                          {!notif.read && (
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => handleMarkRead(notif.id)}
                              sx={{ fontWeight: 600, ml: 'auto' }}
                            >
                              Mark Read
                            </Button>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {idx < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <NotificationsIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
            <Typography variant="h3" color="text.secondary">All Clear!</Typography>
            <Typography variant="body2" color="text.disabled">No new warnings or notifications registered.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default NotificationCenterPage;
