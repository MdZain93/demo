/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getNotifications,
  markAsRead as apiMarkAsRead,
  markAllNotificationsAsRead as apiMarkAllRead,
  addNotification as apiAddNotification
} from '../../services/notificationService';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getNotifications();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      const data = await apiMarkAsRead(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAllRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiMarkAllRead();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const triggerSystemAlert = createAsyncThunk(
  'notifications/triggerAlert',
  async ({ title, message, type, priority }, { rejectWithValue }) => {
    try {
      const data = await apiAddNotification(title, message, type, priority);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  notifications: [],
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load notifications';
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(markAllRead.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(triggerSystemAlert.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
      });
  }
});

export default notificationSlice.reducer;
